import { readFileSync } from 'fs';
import * as marked from 'marked';
import { resolve as resolvePath } from 'path';

import getConfig from '../config';
import { ESModule } from '../core-plugins/es-modules';
import { connect } from '../db';
import { addEmojis, compile, require_md, require_template } from './compiler';
import markedStyle from './marked/renderer';
import { fileExportsQuery, hierarchyQuery } from './queries';
import { IFileExportsQuery } from './queries/fileExportsQuery';
import { copyStaticFiles, scaffoldStaticAssets } from './scaffolder';

export const generate = async () => {
  const config = await getConfig();

  await scaffoldStaticAssets(config.out);
  await copyStaticFiles(config.out);

  const db = await connect();
  const esModules = await fileExportsQuery.exec();
  const esModuleTree = await hierarchyQuery.exec();
  const project = require(resolvePath(process.cwd(), 'package.json'));
  const renderer = markedStyle();

  marked.setOptions({ renderer });

  const mainDoc = require_md(config.main);
  const indexPage = require_template('./templates/index.hbs');

  if (mainDoc) {
    const parsed = marked(addEmojis(mainDoc));
    compile(
      indexPage,
      { main: parsed, esModules, config, esModuleTree, project },
      'index.html'
    );
  }

  // This loop only goes over the modules that plugins found to have exports.
  esModules.forEach((esModule: IFileExportsQuery) => {
    const esModulePage = require_template('./templates/esModule.hbs');
    const sourcePage = require_template('./templates/sourcePage.hbs');
    compile(
      esModulePage,
      { esModule, esModules, config, esModuleTree, project },
      esModule.file.path + '/index.html'
    );
    compile(
      sourcePage,
      {
        sourceCode: readFileSync(
          resolvePath(config.root, esModule.file.path),
          'utf8'
        ),
        esModule,
        esModules,
        config,
        esModuleTree,
        project,
      },
      esModule.file.path + '/source.html'
    );
  });
};
