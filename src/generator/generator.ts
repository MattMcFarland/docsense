import { readFileSync } from 'fs';
import * as marked from 'marked';
import { resolve as resolvePath } from 'path';

import getConfig from '../config';
import { ESModule } from '../core-plugins/es-modules';
import { connect } from '../db';
import { addEmojis, compile, require_md, require_template } from './compiler';
import markedStyle from './marked/renderer';
import { copyStaticFiles, scaffoldStaticAssets } from './scaffolder';

export const generate = () =>
  Promise.all([getConfig(), connect()]).then(([config, db]) => {
    const { esModule_collection, file_collection } = db.getState();
    Promise.all([scaffoldStaticAssets(config.out), copyStaticFiles(config.out)])
      .then(() => {
        const renderer = markedStyle();
        const makeModuleLinks = () =>
          esModules.map((esm: ESModule) => ({
            link: esm.file_id + '/index.html',
          }));

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
              return acc;
            }, [])
            .sort((a: any, b: any) => (a.export_id === 'default' ? -1 : 1));
          return { exports };
        };

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
        const mainDoc = require_md(config.main);
        marked.setOptions({ renderer });
        const indexPage = require_template('./templates/index.hbs');
        if (mainDoc) {
          const parsed = marked(addEmojis(mainDoc));
          compile(indexPage, { main: parsed, esModules }, 'index.html');
        }
      })
      .catch(e => {
        process.exit(1);
      });
  });
