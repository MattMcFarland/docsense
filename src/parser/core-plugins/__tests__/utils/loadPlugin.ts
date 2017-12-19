import * as assert from 'assert';

import { Lowdb } from '../../../../storage/db';
import ParseEngine from '../../../ParseEngine';
import { registerPlugin } from '../../../plugin-loader';

export default (initialState: any, fileName: string) => (
  plugin: any,
  sourceCode: string
): Promise<any> => {
  return new Promise(resolve => {
    const Memory = require('lowdb/adapters/Memory');
    const low: any = require('lowdb');
    const db: Lowdb = low(new Memory());
    const parser = new ParseEngine({
      root: './',
      main: 'readme',
      files: ['TEST'],
      out: 'TEST',
      parser: 'babylon',
      parseOptions: {
        sourceType: 'module',
        plugins: ['typescript'],
      },
    });

    db.setState({ sourceCode, ...initialState });

    parser.on('done', () => resolve(db.getState()));
    plugin.eval = plugin;
    registerPlugin(parser, plugin, db);

    parser.emit('addFile:before', db.getState());

    parser.addFile(fileName, sourceCode.toString());
    parser.emit('addFile:after', db.getState());

    parser.emit('done');
  });
};
