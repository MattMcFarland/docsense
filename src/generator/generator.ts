import { existsSync, readFileSync } from 'fs';
import * as marked from 'marked';
import * as Path from 'path';

import getConfig from '../config';
import { ESModule } from '../parser/core-plugins/es-modules';
import { connect } from '../storage/db';
import { log } from '../utils/logger';
import Compiler, { addEmojis, require_md, require_template } from './compiler';
import {
  directoryExportsQuery,
  fileExportsQuery,
  hierarchyQuery,
} from './queries';
import { IDirectoryExportsQuery } from './queries/directoryExportsQuery';
import { IFileExportsQuery } from './queries/fileExportsQuery';
import { copyStaticFiles, scaffoldStaticAssets } from './scaffolder';

export default async () => {
  log.info('generate', 'start');

  const config = await getConfig();

  await scaffoldStaticAssets(config.out);
  await copyStaticFiles(config.out);

  const db = await connect();
  const esModules = await fileExportsQuery.exec();
  const esModuleTree = await hierarchyQuery.exec();
  const dirModules = await directoryExportsQuery.exec();
  const project = require(Path.resolve(process.cwd(), 'package.json'));

  const mainDoc = require_md(config.main);
  const indexPage = require_template('./default-template/index.hbs');
  const compile = new Compiler(config).compile;

  if (mainDoc) {
    log.info('generate', 'main page');
    compile(
      indexPage,
      { main: mainDoc.data, esModules, config, esModuleTree, project },
      'index.html'
    );
  }
  log.info('generate', 'module pages');
  // This loop only goes over the modules that plugins found to have exports.
  esModules.forEach((esModule: IFileExportsQuery) => {
    const esModulePage = require_template('./default-template/esModule.hbs');
    const sourcePage = require_template('./default-template/sourcePage.hbs');
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
    log.verbose('compile', 'file', esModule.file.path);
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
  log.success('generate', 'module pages');
  log.info('generate', 'directory pages');
  dirModules.forEach((dirModule: IDirectoryExportsQuery) => {
    const dirModulePage = require_template('./default-template/dirModule.hbs');
    const mdfilePath = `${dirModule.directory}/README`;
    const resolvedMDFilePath = resolveFromProject(mdfilePath);
    const hasMarkdownFile = existsSync(resolvedMDFilePath + '.md');
    const md = hasMarkdownFile ? require_md(resolvedMDFilePath) : '';
    const markdownFileContent = (md && md.data) || '';
    const markdownFileChunks = (md && md.chunks) || '';
    const markdownFileTitle = (md && md.title) || '';
    log.verbose('compile', 'directory', dirModule.directory);
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
  log.success('generate', 'directory pages');
  function resolveFromProject(pathToResolve: string) {
    return Path.resolve(config.root, pathToResolve);
  }

  log.success('generate', 'complete');
  return true;
};

function getMarkdownMeta(text: string) {
  const tokens = marked.lexer(text);
  const parsed = marked.parser(tokens);
}
