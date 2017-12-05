import * as mkdirp from 'mkdirp';
import { resolve as resolvePath } from 'path';
import { promisify } from 'util';

import { compile, require_template } from './compiler';

const mkdir = promisify(mkdirp);

const db = require('../../docs/db.json');

// create index html
const { file_collection, export_collection, function_collection } = db;
const esModules = file_collection.reduce((acc: any, file: any) => {
  const fileExports = export_collection.filter(
    (xp: any) => xp.file_id === file.file_id
  );
  const exports = fileExports.map((x: any) => x);
  if (exports.length) {
    acc.push({
      file_id: file.file_id,
      exports,
    });
  }
  return acc;
}, []);

const distDir = require('path').resolve(__dirname, '../../docs');

const makeModuleDirs = (): Promise<any> =>
  Promise.all(
    esModules.map((esm: any) => mkdir(resolvePath(distDir, esm.file_id)))
  );
const makeModuleLinks = () =>
  esModules.map((esm: any) => {
    return { link: esm.file_id + '/index.html' };
  });

const getModuleInfo = (esm: any) => {
  //console.log(JSON.stringify(esm, null, 2));
  const exports = esm.exports.map((exm: any) => {
    if (exm.function_id) {
      const withFn = function_collection.find(
        (fns: any) => fns.function_id === exm.function_id
      );
      console.log(withFn);
      return {
        file_id: esm.file_id,
        export_id: exm.export_id,
        function: withFn,
      };
    }
  });
  return { exports };
};

makeModuleDirs().then(() => {
  esModules.forEach((esm: any) => {
    const esModulePage = require_template('./templates/esModule.hbs');
    compile(
      esModulePage,
      { esModule: getModuleInfo(esm), esModules },
      esm.file_id + '/index.html'
    );
  });
  const indexPage = require_template('./templates/index.hbs');
  compile(indexPage, { esModules }, 'index.html');
});
