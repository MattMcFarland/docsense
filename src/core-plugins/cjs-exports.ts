import { NodePath } from 'babel-traverse';
import {
  isObjectProperty,
  AssignmentExpression,
  Identifier,
  MemberExpression,
  isMemberExpression,
  Node,
  isIdentifier,
} from 'babel-types';

import helpers, { getFunctionMeta } from '../parser/helpers';
import ParseEngine from '../parser/ParseEngine';
import functionVisitor from './visitors/functionVisitor';

export const pluginName = 'cjsExports';
export const collectionName = pluginName + '_collection';
export const entryId = pluginName + '_id';

export default function(engine: ParseEngine, db: Lowdb.Lowdb): any {
  db.set(collectionName, []).write();
  const createPush = (path: NodePath) => (data: any) => {
    db
      .get(collectionName)
      .push(data)
      .write();
    path.traverse(functionVisitor(onFunction), data[entryId]);
  };
  const insert = (id_val: string) => (data: any) => {
    db
      .get(collectionName)
      .find({ [entryId]: id_val })
      .assign(data)
      .write();
  };

  return {
    visitor: {
      AssignmentExpression(path: NodePath<AssignmentExpression>) {
        if (!validate(path)) return;

        const { getFileName, getDocTags } = helpers(path);
        const push = createPush(path);
        const leftSide = path.get('left');
        const rightSide = path.get('right');

        // TODO - once object parsing is finished, we can just re-use object traversal.
        if (rightSide.isObjectExpression()) {
          return rightSide.node.properties.forEach(exportsProperty => {
            if (
              isObjectProperty(exportsProperty) &&
              isNamedIdentifier(exportsProperty.key)
            ) {
              push({
                [entryId]: exportsProperty.key.name,
                file_id: getFileName(),
                jsdoc: getDocTags(),
              });
            }
          });
        }

        const cjsExports_id =
          isNamedModuleExports(leftSide.node) || isNamedExport(leftSide.node)
            ? leftSide.node.property.name
            : 'default';
        const file_id = getFileName();

        push({
          cjsExports_id,
          file_id,
          jsdoc: getDocTags(),
        });
      },
    },
  };

  function onFunction(path: NodePath, id: string) {
    if (!id) {
      return;
    }
    const { function_id /* params, jsdoc */ } = getFunctionMeta(path);
    insert(id)({
      function_id,
    });
  }

  /**
   * This uses a "blacklist" strategy, and returns false to shut down the process.
   * Primarily am doing this because it proved difficult using a "whitelist" strategy,
   * as there were many false positives.
   * @param path NodePath
   */
  function validate(path: NodePath<AssignmentExpression>) {
    // abort if module or exports are not found in global scope
    const root = path.findParent((p: NodePath) => p.isProgram());
    const leftNode = path.get('left').node;

    if (!root.scope.globals.module && !root.scope.globals.exports) {
      return;
    }

    if (falsePositiveModule(leftNode) || falsePositiveExports(leftNode)) {
      return false;
    }

    return true;
  }

  /**
   * Since some Identifiers are nameless, this adds type safety.
   */
  interface INamedIdentifier extends Identifier {
    name: string;
  }

  /**
   * Looks like: `exports[foo]` or `exports.foo`
   */
  interface INamedExport extends MemberExpression {
    object: {
      name: 'exports';
    } & INamedIdentifier;
    property: INamedIdentifier;
  }

  /**
   * Looks like: `module.exports[foo]` or `module.exports.foo`
   */
  interface INamedModuleExport extends INestedObject {
    object: {
      object: {
        name: 'module';
      } & INamedIdentifier;
      property: {
        name: 'exports';
      } & INamedIdentifier;
    } & MemberExpression;
    property: INamedIdentifier;
  }

  /**
   * This covers: object.object.name, and object.property.name
   * Looks like `foo.bar` where foo is an "object", and "bar" is an object,
   * and `foo.bar.baz` where baz is a "NamedIdentifier", which is not an object, but
   * a key.
   */
  interface INestedObject extends MemberExpression {
    object: {
      object: INamedIdentifier;
      property: INamedIdentifier;
    } & MemberExpression;
  }
  function isNestedObject(node: Node): node is INestedObject {
    return isMemberExpression(node) && isMemberExpression(node.object);
  }

  /**
   * This prevents foo.module.exports from getting picked up
   * Use this first to scrub out false positives in later processing
   * @param node Node
   */
  function falsePositiveModule(node: Node) {
    return isNestedObject(node) && node.object.object.name !== 'module';
  }

  /**
   * This prevents foo.exports, or module.oops.exports from getting picked up
   * Use this first to scrub out false positives in later processing
   * @param node Node
   */
  function falsePositiveExports(node: Node) {
    return isNestedObject(node) && node.object.property.name !== 'exports';
  }

  /**
   * This checks for the signature of `exports.foo`
   * Make sure to use {falsePositiveExports} to short circuit processing
   * before using this, as this method alone
   * will not scrub out `foo.exports.bar` properly.
   * @param node Node
   */
  function isNamedExport(node: Node): node is INamedExport {
    return Boolean(
      isMemberExpression(node) &&
        isNamedIdentifier(node.object) &&
        node.object &&
        node.object.name === 'exports' &&
        node.property !== undefined
    );
  }

  /**
   * This checks for the signature of `module.exports.foo`
   * Make sure to use {falsePositiveModule} to short circuit processing
   * before using this, as this method alone
   * will not scrub out `foo.module.exports.bar` properly.
   * @param node Node
   */
  function isNamedModuleExports(node: Node): node is INamedModuleExport {
    return Boolean(
      isNestedObject(node) &&
        node.object.object.name === 'module' &&
        node.object.property.name === 'exports' &&
        node.property !== undefined
    );
  }

  /**
   * Because not all Identifiers can be named.
   * @param node Node
   */
  function isNamedIdentifier(node: Node): node is INamedIdentifier {
    return isIdentifier(node) && node.name !== undefined;
  }
}
