import { Binding, NodePath } from 'babel-traverse';
import {
  ExportAllDeclaration,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  ExportSpecifier,
  FunctionDeclaration,
  Identifier,
  isIdentifier,
  VariableDeclarator,
} from 'babel-types';
import { Annotation } from 'doctrine';

import { IPluginCommand } from '../_types/Plugin';
import ParseEngine from '../parser/ParseEngine';
import Store from '../store';
import { log } from '../utils/logger';
import { logSkipped } from './helpers/effects';
import {
  assertNever,
  getDocTagsFromPath,
  getFileName,
  getFunctionMeta,
  isNamedIdentifier,
} from './helpers/getters';
import {
  FunctionType,
  IFunctionMeta,
  VariableDeclaratorInit,
} from './helpers/types';
import functionVisitor from './visitors/functionVisitor';

export const collectionName = 'esModule_collection';
interface State {
  identifiers: { [index: string]: any };
}

interface Exportable {
  file_id: string;
  esModule_id: string;
}
interface ExportingStatic extends Exportable {
  kind: 'ExportingStatic';
  jsdoc?: Annotation[];
}
interface ExportingFunction extends Exportable {
  kind: 'ExportingFunction';
  function: IFunctionMeta;
  jsdoc?: Annotation[];
}
interface ExportingLiteral extends Exportable {
  kind: 'ExportingLiteral';
  type: 'StringLiteral' | 'NumericLiteral' | 'BooleanLiteral';
  value: string | number | boolean;
  jsdoc?: Annotation[];
}
type ESModule = ExportingFunction | ExportingLiteral;
export const key = 'esModule';
export default (engine: ParseEngine, store: Store): any => {
  return {
    visitor: {
      ExportNamedDeclaration: namedDeclaration,
      ExportSpecifier: specifier,
      ExportAllDeclaration: allDeclaration,
      ExportDefaultDeclaration: defaultDeclaration,
    },
  };

  /**
   * Visitor for ExportNamedDeclaration
   * @param path NodePath
   * @see {ExportNamedDeclaration}
   */
  function namedDeclaration(path: NodePath<ExportNamedDeclaration>) {
    // A named declaration will have a null node.declaration on some occasions,
    // like ExportSpecifier, so we can return and hope the other visitors catch it.
    if (!path.node.declaration) return;

    const push = store.createPush(path);

    //////////////////////////////////////////////////////////////////////////////////
    /* EXPORT NAMED DECLARATION : FUNCTION DECLARATION                              */
    //////////////////////////////////////////////////////////////////////////////////

    if (path.node.declaration.type === 'FunctionDeclaration') {
      push({
        kind: 'ExportingFunction',
        file_id: getFileName(path),
        function: getFunctionMeta(path.get('declaration') as NodePath<
          FunctionDeclaration
        >),
        esModule_id: 'default',
        jsdoc: getDocTagsFromPath(path),
      });
    }

    //////////////////////////////////////////////////////////////////////////////////
    /* EXPORT NAMED DECLARATION : VARIABLE DECLARATION                              */
    //////////////////////////////////////////////////////////////////////////////////

    if (path.node.declaration.type === 'VariableDeclaration') {
      const declarations = path.node.declaration.declarations;

      declarations.forEach((variableDeclarator, index) => {
        // Cannot currently see how this would not be defined, but TypeScript insists
        // that dec.id might be null in this occasion, so we use this guard.
        if (!isIdentifier(variableDeclarator.id)) return;

        const esModule_id = variableDeclarator.id.name;

        // "init" is the thing that this is assigned to
        const assignment = path.get(
          `declaration.declarations.${index}.init`
        ) as NodePath<VariableDeclaratorInit>;

        switch (assignment.node.type) {
          // it can be any one of these types, which are all mentioned
          // for documentation purposes.

          /* Function Types */
          case 'ArrowFunctionExpression':
          case 'FunctionExpression':
            push<ExportingFunction>({
              kind: 'ExportingFunction',
              file_id: getFileName(path),
              function: getFunctionMeta(assignment as NodePath<FunctionType>),
              jsdoc: getDocTagsFromPath(assignment),
              esModule_id,
            });
            break;

          /* Function Calls and Objects will contain nothing but a name for now */
          case 'CallExpression':
          case 'NewExpression':
          case 'MemberExpression':
          case 'ObjectExpression':
            push<ExportingStatic>({
              kind: 'ExportingStatic',
              file_id: getFileName(path),
              jsdoc: getDocTagsFromPath(assignment),
              esModule_id,
            });
            break;

          /* Literals */
          case 'StringLiteral':
          case 'NumericLiteral':
          case 'BooleanLiteral':
            push<ExportingLiteral>({
              kind: 'ExportingLiteral',
              file_id: getFileName(path),
              type: assignment.node.type,
              value: assignment.node.value,
              jsdoc: getDocTagsFromPath(assignment),
              esModule_id,
            });
            break;

          /* Identifier */
          case 'Identifier':
            const refName = assignment.node.name;
            const bindings: any = path.scope.getAllBindings();
            const reference: Binding = bindings[refName]
              ? bindings[refName]
              : null;

            if (reference && reference.path && reference.path.isFunction()) {
              push<ExportingFunction>({
                kind: 'ExportingFunction',
                file_id: getFileName(path),
                function: getFunctionMeta(reference.path as NodePath<
                  FunctionType
                >),
                esModule_id: 'default',
                jsdoc: getDocTagsFromPath(reference.path),
              });
            }
            break;

          // The following node types are skipped, and a warning will be noted
          // in the console.
          case 'NullLiteral':
          case 'ArrayExpression':
          case 'AssignmentExpression':
          case 'BinaryExpression':
          case 'ConditionalExpression':
          case 'RegExpLiteral':
          case 'LogicalExpression':
          case 'SequenceExpression':
          case 'ThisExpression':
          case 'UnaryExpression':
          case 'UpdateExpression':
          case 'ClassExpression':
          case 'MetaProperty':
          case 'Super':
          case 'TaggedTemplateExpression':
          case 'TemplateLiteral':
          case 'YieldExpression':
          case 'TypeCastExpression':
          case 'JSXElement':
          case 'JSXEmptyExpression':
          case 'JSXIdentifier':
          case 'JSXMemberExpression':
          case 'ParenthesizedExpression':
          case 'AwaitExpression':
          case 'BindExpression':
          case 'DoExpression':
            log.warn('es-modules', 'skipping', variableDeclarator.init.type);
            break;
        }
      });
    }
  }

  /**
   * Visitor for ExportSpecifier
   * @param path NodePath
   * @see {ExportSpecifier}
   */
  function specifier(path: NodePath<ExportSpecifier>) {
    const push = store.createPush(path);
    const local = path.node.local.name;
    const esModule_id = path.node.exported.name;
    const bindings: any = path.scope.getAllBindings();
    const reference: Binding = bindings[local] ? bindings[local] : null;
    push({
      file_id: getFileName(path),
      function:
        reference && reference.path && reference.path.isFunction()
          ? getFunctionMeta(reference.path as NodePath<FunctionType>)
          : undefined,
      esModule_id,
    });
  }

  /**
   * Visitor for ExportAllDeclaration
   * @param path NodePath
   * @see {ExportAllDeclaration}
   */
  function allDeclaration(path: NodePath<ExportAllDeclaration>) {
    const push = store.createPush(path);
    push({
      kind: 'ExportingAllFromSource',
      file_id: getFileName(path),
      esModule_id: 'all',
      source_id: path.node.source.value,
    });
  }

  /**
   * Visitor for ExportDefaultDeclaration
   * @param path NodePath
   * @see {ExportDefaultDeclaration}
   */
  function defaultDeclaration(path: NodePath<ExportDefaultDeclaration>) {
    const push = store.createPush(path);

    switch (path.node.declaration.type) {
      case 'FunctionDeclaration':
      case 'ArrowFunctionExpression':
      case 'FunctionExpression':
        const functionPath = path.get('declaration') as NodePath<FunctionType>;
        push<ExportingFunction>({
          kind: 'ExportingFunction',
          file_id: getFileName(path),
          function: getFunctionMeta(functionPath),
          jsdoc: getDocTagsFromPath(functionPath),
          esModule_id: 'default',
        });
        break;
      case 'Identifier':
        const idPath = path.get('declaration') as NodePath<Identifier>;
        const refName = idPath.node.name;
        const bindings: any = path.scope.getAllBindings();
        const reference: Binding = bindings[refName] ? bindings[refName] : null;

        if (reference && reference.path && reference.path.isFunction()) {
          push<ExportingFunction>({
            kind: 'ExportingFunction',
            file_id: getFileName(path),
            function: getFunctionMeta(reference.path as NodePath<FunctionType>),
            esModule_id: 'default',
            jsdoc: getDocTagsFromPath(reference.path),
          });
        }

        break;
    }
  }
};
