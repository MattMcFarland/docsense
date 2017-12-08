import { readdirSync, readFileSync, writeFileSync } from 'fs';
import * as mkdirp from 'mkdirp';
import { resolve as resolvePath } from 'path';
import { promisify } from 'util';

import { compile, require_template } from './compiler';

const mkdir = promisify(mkdirp);

const db = require('../../docs/db.json');

// create index html
const { esModule_collection, file_collection } = db;
const esModules = file_collection.reduce((acc: any, file: any) => {
  const fileExports = esModule_collection.filter(
    (xp: any) => xp.file_id === file.file_id
  );
  if (fileExports.length) {
    acc.push({
      file_id: file.file_id,
      exports: fileExports,
    });
  }

  return acc;
}, []);

const distDir = require('path').resolve(__dirname, '../../docs');

const makeSourceDirs = (): Promise<any> =>
  Promise.all(
    esModules.map((esm: any) =>
      mkdir(resolvePath(distDir, esm.file_id + '/source'))
    )
  );

const makeModuleDirs = (): Promise<any> =>
  Promise.all(
    esModules.map((esm: any) => mkdir(resolvePath(distDir, esm.file_id)))
  );

const makeModuleLinks = () =>
  esModules.map((esm: any) => {
    return { link: esm.file_id + '/index.html' };
  });

const makeStatic = () => mkdir(resolvePath(distDir, 'static'));

const copyStatic = () => {
  const files = readdirSync(resolvePath(__dirname, 'static'));
  files.forEach(file => {
    const data = readFileSync(resolvePath(__dirname, 'static', file));
    writeFileSync(resolvePath(distDir, 'static', file), data);
  });

  return true;
};

const getModuleInfo = (esm: any) => {
  const exports = esm.exports
    .reduce((acc: any, exm: any) => {
      if (exm.function_id) {
        const withFn = file_collection.find(
          (fns: any) => fns.function_id === exm.function_id
        );
        const withXp = esModule_collection.find(
          (fns: any) => fns.function_id === exm.function_id
        );
        acc.push({
          file_id: esm.file_id,
          export_id: exm.export_id,
          function_id: exm.function_id,
          function: withFn,
          xp: withXp,
        });
      } else {
        acc.push(exm);
      }

      // if (esm.file_id && exm.export_id) {
      //   acc.push({
      //     file_id: esm.file_id,
      //     export_id: exm.export_id,
      //   });
      // }
      return acc;
    }, [])
    .sort((a: any, b: any) => (a.export_id === 'default' ? -1 : 1));
  return { exports };
};

makeModuleDirs()
  .then(makeStatic)
  .then(copyStatic)
  .then(() => {
    esModules.forEach((esm: any) => {
      const esModulePage = require_template('./templates/esModule.hbs');
      const sourcePage = require_template('./templates/sourcePage.hbs');
      compile(
        esModulePage,
        { file_id: esm.file_id, esModule: getModuleInfo(esm), esModules },
        esm.file_id + '/index.html'
      );
      compile(
        sourcePage,
        {
          sourceCode: readFileSync(resolvePath(esm.file_id), 'utf8'),
          esModules,
        },
        esm.file_id + '/source.html'
      );
    });
    const indexPage = require_template('./templates/index.hbs');
    compile(indexPage, { esModules }, 'index.html');
  });