import ParseEngine from '../../../parser/ParseEngine';
import { IPluginModuleAndRecord } from '../../../types/Plugin';
import { registerPlugin } from '../../../utils/plugin';
import assert = require('assert');
import Memory = require('lowdb/adapters/Memory');

export default (initialState: any, fileName: string) => (
  plugin: IPluginModuleAndRecord,
  sourceCode: string
) => {
  return new Promise(resolve => {
    const low: any = require('lowdb');
    const db: Lowdb = low(new Memory());

    const parser = new ParseEngine('babylon', {
      sourceType: 'module',
    });

    db.setState(initialState);
    plugin.eval = plugin.default;
    assert(plugin.eval, 'plugin must have a default export');
    assert(plugin.collectionName, 'plugin must export a collectionName');
    parser.on('done', () => resolve(db.getState()));
    registerPlugin(parser, plugin, db);
    parser.emit('addFile:before', db.getState());

    parser.addFile(fileName, sourceCode.toString());
    parser.emit('addFile:after', db.getState());

    parser.emit('done');
  });
};