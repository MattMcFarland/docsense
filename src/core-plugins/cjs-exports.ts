import helpers, { getFunctionMeta } from '../parser/helpers';
import ParseEngine from '../parser/ParseEngine';
import functionVisitor from './visitors/functionVisitor';
export const pluginName = 'cjsExports';
export const collectionName = pluginName + '_collection';
export const entryId = pluginName + '_id';

export default function(engine: ParseEngine, db: Lowdb.Lowdb): any {
  db.set(collectionName, []).write();
  const createPush = path => data => {
    db
      .get(collectionName)
      .push(data)
      .write();
    path.traverse(functionVisitor(onFunction), data[entryId]);
  };
  const insert = id_val => data => {
    db
      .get(collectionName)
      .find({ [entryId]: id_val })
      .assign(data)
      .write();
  };
  return {
    visitor: {
      AssignmentExpression(path) {
        if (!validate(path)) {
          return;
        }
        const push = createPush(path);
        const { getFileName, getDocTags } = helpers(path);
        const leftSide = path.get('left');
        const rightSide = path.get('right');

        if (
          rightSide.type === 'ObjectExpression' &&
          rightSide.node.properties.length
        ) {
          return rightSide.properties.forEach(exportsProperty => {
            push({
              [entryId]: exportsProperty.key.name,
              file_id: getFileName(),
              jsdoc: getDocTags(),
            });
          });
        }
        // module.exports.foo = bar
        const isNamedModuleExports =
          looksLikeModule(leftSide.node) &&
          leftSide.node.object.property &&
          leftSide.node.object.property.name === 'exports' &&
          leftSide.node.property;
        // exports.foo = bar
        const isNamedExport =
          leftSide.type === 'MemberExpression' &&
          leftSide.node.object &&
          leftSide.node.object.name === 'exports' &&
          leftSide.node.property;

        const cjsExports_id =
          isNamedModuleExports || isNamedExport
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
  function onFunction(path, id) {
    if (!id) {
      return;
    }
    const { function_id /* params, jsdoc */ } = getFunctionMeta(path);
    insert(id)({
      function_id,
    });
  }
  function looksLikeModule(node) {
    if (!node) {
      return;
    }
    return (
      node.type === 'MemberExpression' &&
      node.object &&
      node.object.object &&
      node.object.object.name &&
      node.object.object.name === 'module' &&
      node.object.property
    );
  }

  function validate(path) {
    // abort if module or exports are not found in global scope
    const root = path.findParent(p => p.isProgram());
    if (
      !path.scope.globals.exports &&
      !path.scope.globals.module &&
      !root.scope.globals.module &&
      !root.scope.globals.exports
    ) {
      return;
    }
    const leftSide = path.get('left');

    if (
      looksLikeModule(leftSide.node) &&
      leftSide.node.object &&
      leftSide.node.object.property &&
      leftSide.node.object.property.name !== 'exports'
    ) {
      return false;
    }
    if (
      leftSide.node.object &&
      leftSide.node.object.object &&
      leftSide.node.object.object.name !== 'module'
    ) {
      return false;
    }
    if (
      leftSide.node.object &&
      leftSide.node.object.name &&
      leftSide.node.object.name !== 'module' &&
      leftSide.node.object.name !== 'exports'
    ) {
      return false;
    }
    return true;
  }
}
