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
import * as Path from 'path';

import { IPluginCommand } from '../_types/Plugin';
import ParseEngine from '../parser/ParseEngine';
import Store from '../store';
import { encode } from '../utils/base64';
import { log } from '../utils/logger';
import { logSkipped } from './helpers/effects';
import {
  assertNever,
  getDocTagsFromPath,
  getFileId,
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

export interface State {
  identifiers: { [index: string]: any };
}

export interface Exportable {
  file_id: string;
  esModule_id: string;
}

export interface ExportingReference extends Exportable {
  kind: 'ExportingReference';
  jsdoc?: Annotation[];
}

export interface ExportingFunction extends Exportable {
  kind: 'ExportingFunction';
  function: IFunctionMeta;
  jsdoc?: Annotation[];
}

export interface ExportingLiteral extends Exportable {
  kind: 'ExportingLiteral';
  type: 'StringLiteral' | 'NumericLiteral' | 'BooleanLiteral';
  value: string | number | boolean;
  jsdoc?: Annotation[];
}

export interface ExportingImport extends Exportable {
  kind: 'ExportingImport';
  source: Exportable;
  jsdoc?: Annotation[];
}

export type ESModule =
  | ExportingFunction
  | ExportingLiteral
  | ExportingImport
  | ExportingReference;

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
   * @param nodePath NodePath
   * @see {ExportNamedDeclaration}
   */
  function namedDeclaration(nodePath: NodePath<ExportNamedDeclaration>) {
    // A named declaration will have a null node.declaration on some occasions,
    // like ExportSpecifier, so we can return and hope the other visitors catch it.
    if (!nodePath.node.declaration) return;

    const push = store.createPush(nodePath);

    //////////////////////////////////////////////////////////////////////////////////
    /* EXPORT NAMED DECLARATION : FUNCTION DECLARATION                              */
    //////////////////////////////////////////////////////////////////////////////////

    if (nodePath.node.declaration.type === 'FunctionDeclaration') {
      push<ExportingFunction>({
        kind: 'ExportingFunction',
        file_id: getFileId(nodePath, engine.config.root),
        function: getFunctionMeta(nodePath.get('declaration') as NodePath<
          FunctionDeclaration
        >),
        esModule_id: (nodePath.get('declaration') as NodePath<
          FunctionDeclaration
        >).node.id.name,
        jsdoc: getDocTagsFromPath(nodePath),
      });
    }

    //////////////////////////////////////////////////////////////////////////////////
    /* EXPORT NAMED DECLARATION : VARIABLE DECLARATION                              */
    //////////////////////////////////////////////////////////////////////////////////

    if (nodePath.node.declaration.type === 'VariableDeclaration') {
      const declarations = nodePath.node.declaration.declarations;

      declarations.forEach((variableDeclarator, index) => {
        // Cannot currently see how this would not be defined, but TypeScript insists
        // that dec.id might be null in this occasion, so we use this guard.
        if (!isIdentifier(variableDeclarator.id)) return;

        const esModule_id = variableDeclarator.id.name;

        // "init" is the thing that this is assigned to
        const assignment = nodePath.get(
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
              file_id: getFileId(nodePath, engine.config.root),
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
            push<ExportingReference>({
              kind: 'ExportingReference',
              file_id: getFileId(nodePath, engine.config.root),
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
              file_id: getFileId(nodePath, engine.config.root),
              type: assignment.node.type,
              value: assignment.node.value,
              jsdoc: getDocTagsFromPath(assignment),
              esModule_id,
            });
            break;

          /* Identifier */
          case 'Identifier':
            const refName = assignment.node.name;
            const bindings: any = nodePath.scope.getAllBindings();
            const reference: Binding = bindings[refName]
              ? bindings[refName]
              : null;

            if (reference && reference.path && reference.path.isFunction()) {
              push<ExportingFunction>({
                kind: 'ExportingFunction',
                file_id: getFileId(nodePath, engine.config.root),
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
            const location = assignment.node.loc;
            log.warn(
              'es-modules',
              'skipping',
              variableDeclarator.init.type,
              `${location.filename}@${location.start.line}:${
                location.start.column
              }`
            );
            break;
        }
      });
    }
  }

  /**
   * Visitor for ExportSpecifier
   * @param nodePath NodePath
   * @see {ExportSpecifier}
   */
  function specifier(nodePath: NodePath<ExportSpecifier>) {
    const push = store.createPush(nodePath);
    const local = nodePath.node.local.name;
    const esModule_id = nodePath.node.exported.name;
    const bindings: any = nodePath.scope.getAllBindings();
    const reference: Binding = bindings[local] ? bindings[local] : null;

    // if exporting a previously declared variable

    if (reference && reference.path && reference.path.isFunction()) {
      push<ExportingFunction>({
        esModule_id,
        kind: 'ExportingFunction',
        file_id: getFileId(nodePath, engine.config.root),
        function: getFunctionMeta(reference.path as NodePath<FunctionType>),
        jsdoc: getDocTagsFromPath(reference.path),
      });
      return;
    }

    // check for being an exported import from another file

    const parentPath = nodePath.parentPath;
    if (
      parentPath.isExportNamedDeclaration() &&
      parentPath.node.source.type === 'StringLiteral'
    ) {
      const file_id = getFileId(nodePath, engine.config.root);
      const file_path = getFileName(nodePath);
      const file_dir = Path.dirname(file_path);
      const source = {
        file_id: encode(
          Path.posix.join(file_dir, parentPath.node.source.value)
        ),
        esModule_id: local,
      };
      push<ExportingImport>({
        kind: 'ExportingImport',
        file_id,
        esModule_id,
        source,
      });
      return;
    }
    log.warn('es-modules', 'skipping', nodePath.type, nodePath.node.local.name);
  }

  /**
   * Visitor for ExportAllDeclaration
   * @param nodePath NodePath
   * @see {ExportAllDeclaration}
   */
  function allDeclaration(nodePath: NodePath<ExportAllDeclaration>) {
    const push = store.createPush(nodePath);
    push({
      kind: 'ExportingAllFromSource',
      file_id: getFileId(nodePath, engine.config.root),
      esModule_id: 'all',
      source_id: nodePath.node.source.value,
    });
  }

  /**
   * Visitor for ExportDefaultDeclaration
   * @param nodePath NodePath
   * @see {ExportDefaultDeclaration}
   */
  function defaultDeclaration(nodePath: NodePath<ExportDefaultDeclaration>) {
    const push = store.createPush(nodePath);

    switch (nodePath.node.declaration.type) {
      case 'FunctionDeclaration':
      case 'ArrowFunctionExpression':
      case 'FunctionExpression':
        const functionPath = nodePath.get('declaration') as NodePath<
          FunctionType
        >;
        push<ExportingFunction>({
          kind: 'ExportingFunction',
          file_id: getFileId(nodePath, engine.config.root),
          function: getFunctionMeta(functionPath),
          jsdoc: getDocTagsFromPath(functionPath),
          esModule_id: 'default',
        });
        break;
      case 'Identifier':
        const idPath = nodePath.get('declaration') as NodePath<Identifier>;
        const refName = idPath.node.name;
        const bindings: any = nodePath.scope.getAllBindings();
        const reference: Binding = bindings[refName] ? bindings[refName] : null;

        if (reference && reference.path && reference.path.isFunction()) {
          push<ExportingFunction>({
            kind: 'ExportingFunction',
            file_id: getFileId(nodePath, engine.config.root),
            function: getFunctionMeta(reference.path as NodePath<FunctionType>),
            esModule_id: 'default',
            jsdoc: getDocTagsFromPath(reference.path),
          });
        }

        break;
    }
  }
};
