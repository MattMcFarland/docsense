import { existsSync, readFileSync } from 'fs';
import * as marked from 'marked';
import * as Path from 'path';

import getConfig from '../config';
import { ESModule } from '../core-plugins/es-modules';
import { connect } from '../db';
import { addEmojis, compile, require_md, require_template } from './compiler';

import {
  directoryExportsQuery,
  fileExportsQuery,
  hierarchyQuery,
} from './queries';
import { IDirectoryExportsQuery } from './queries/directoryExportsQuery';
import { IFileExportsQuery } from './queries/fileExportsQuery';
import { copyStaticFiles, scaffoldStaticAssets } from './scaffolder';

export const generate = async () => {
  const config = await getConfig();

  await scaffoldStaticAssets(config.out);
  await copyStaticFiles(config.out);

  const db = await connect();
  const esModules = await fileExportsQuery.exec();
  const esModuleTree = await hierarchyQuery.exec();
  const dirModules = await directoryExportsQuery.exec();
  const project = require(Path.resolve(process.cwd(), 'package.json'));

  const mainDoc = require_md(config.main);
  const indexPage = require_template('./templates/index.hbs');

  if (mainDoc) {
    compile(
      indexPage,
      { main: mainDoc.data, esModules, config, esModuleTree, project },
      'index.html'
    );
  }

  // This loop only goes over the modules that plugins found to have exports.
  esModules.forEach((esModule: IFileExportsQuery) => {
    const esModulePage = require_template('./templates/esModule.hbs');
    const sourcePage = require_template('./templates/sourcePage.hbs');
    const mdfilePath = esModule.file.isIndex
      ? `${esModule.file.dir}/README`
      : `${esModule.file.dir}/${esModule.file.name}`;
    const resolvedMDFilePath = resolveFromProject(mdfilePath);
    const hasMarkdownFile = existsSync(resolvedMDFilePath + '.md');

    const md = hasMarkdownFile ? require_md(resolvedMDFilePath) : '';
    const markdownFileContent = (md && md.data) || '';
    const markdownFileChunks = (md && md.chunks) || '';
    const markdownFileTitle = (md && md.title) || '';

    compile(
      esModulePage,
      {
        hasMarkdownFile,
        markdownFileTitle,
        markdownFileContent,
        markdownFileChunks,
        dirModules,
        esModule,
        esModules,
        config,
        esModuleTree,
        project,
      },
      esModule.file.path + '/index.html'
    );
    compile(
      sourcePage,
      {
        hasMarkdownFile,
        markdownFileContent,
        sourceCode: readFileSync(
          resolveFromProject(esModule.file.path),
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
  dirModules.forEach((dirModule: IDirectoryExportsQuery) => {
    const dirModulePage = require_template('./templates/dirModule.hbs');
    const mdfilePath = `${dirModule.directory}/README`;
    const resolvedMDFilePath = resolveFromProject(mdfilePath);
    const hasMarkdownFile = existsSync(resolvedMDFilePath + '.md');

    const md = hasMarkdownFile ? require_md(resolvedMDFilePath) : '';
    const markdownFileContent = (md && md.data) || '';
    const markdownFileChunks = (md && md.chunks) || '';
    const markdownFileTitle = (md && md.title) || '';

    compile(
      dirModulePage,
      {
        dirModule,
        hasMarkdownFile,
        markdownFileTitle,
        markdownFileContent,
        markdownFileChunks,
        dirModules,
        esModules,
        config,
        esModuleTree,
        project,
      },
      Path.join(dirModule.directory, 'directory.html')
    );
  });
  function resolveFromProject(pathToResolve: string) {
    return Path.resolve(config.root, pathToResolve);
  }
};

function getMarkdownMeta(text: string) {
  const tokens = marked.lexer(text);
  const parsed = marked.parser(tokens);
}
