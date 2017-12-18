import chalk from 'chalk';
import * as yargs from 'yargs';

import { exec as execFn } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import * as Path from 'path';
import { promisify } from 'util';

import * as Sane from 'sane';
import { log } from '../../utils/logger';

const exec = promisify(execFn);

export const command = 'serve [Options]';
export const aliases = ['s', 'w', 'watch'];
export const desc = 'Serves up a local docsense app that watches for changes';

export const builder: yargs.CommandBuilder = argv => {
  return yargs
    .options({
      files: {
        alias: 'f',
        desc: 'File or glob of files that will be parsed.',
        default: '[**/*.js]',
      },
      out: {
        alias: 'o',
        desc: 'Directory your documentation will be generated in',
        default: 'docs',
      },
      root: {
        alias: 'r',
        desc: 'Directory to start parsing in',
        default: './',
      },
      log: {
        alias: 'l',
        desc: 'Enable logging from the child build process',
        default: false,
      },
    })
    .example(
      '$0 serve',
      'Hosts a local server, builds docs, and watches for changes based on the configuration file (which can be generated with the init command) '
    )
    .example(
      '$0 serve -o out -r lib',
      'Treats the folder "lib" as root. So all docs are generated from "lib", replacing "myPackage/lib" with "myPackage"'
    )
    .example(
      '$0 serve --log',
      'Lets you see all of the log output from the build steps'
    )
    .epilog(
      'This uses all of the options found with docsense build, use "docsense build --help to see more"'
    );
};

export const handler = (argv: any) => {
  const watchPath = Path.resolve(process.cwd(), argv.root);
  const watcher = Sane(watchPath, { glob: '**/*' });
  log.on('error', onBuildFailure);
  build(argv)
    .then(firstBuildResults => {
      log.success('serve', 'Finished intial build, firing up Browsersync.');
      const bs = require('browser-sync').create();

      logChildProcess(firstBuildResults);

      // Start a Browsersync static file server
      bs.init({ server: argv.out }, () => {
        log.info('serve', 'Watching for changes...');
      });

      const browserUpdate = (buildResults: any) => {
        logChildProcess(buildResults);
        log.success('serve', 'Build Finished');
        setTimeout(() => {
          bs.reload();
          log.info('serve', 'Watching for changes...');
        }, 100);
      };

      const onFileChange = (filepath: string, root: string) => {
        require.cache = {};
        log.info('serve', 'file change', filepath);
        log.info('serve', 'Compiling changes...');
        bs.notify('Compiling, please wait!');
        build(argv)
          .then(browserUpdate)
          .catch(onBuildFailure);
      };

      watcher.on('change', onFileChange);
      watcher.on('add', onFileChange);
      watcher.on('delete', onFileChange);
    })
    .catch(onBuildFailure);

  function logChildProcess({ stdout, stderr }: any) {
    process.stdout.write(chalk.grey(stdout));
    // logger uses stderr, so we can format it.
    if (!argv.log) return;
    stderr.split('\n').forEach((errline: string) => {
      const [title, level, state, ...msg]: any = errline.split(' ');

      interface ColorMap {
        [key: string]: any;
      }
      const colors: ColorMap = {
        WARN: chalk.dim.yellow,
        ERR: chalk.dim.red,
        info: chalk.dim.green,
        success: chalk.dim.green,
      };
      const levelColor = colors[level] || chalk.dim.grey;
      if (!level) return;
      process.stderr.write(
        `  ${levelColor(level)} ${chalk.dim.cyan(state)} ${msg.join(' ')}\n`
      );
    });
  }
};

function onBuildFailure(err: Error) {
  if (err && err.message) {
    const msg = err.message.replace(/docsense.ERR!.[\S]+/g, '');
    const msgs = msg.split('\n');
    msgs.forEach(m => {
      if (m.indexOf('docsense info') > -1)
        return log.error('build', chalk.grey(m));
      if (m.indexOf('docsense WARN') > -1)
        return log.error('build', chalk.grey(m));
      if (m.indexOf('docsense verb') > -1)
        return log.error('build', chalk.grey(m));
      if (m.indexOf('docsense sill') > -1)
        return log.error('build', chalk.grey(m));
      process.stdout.write('  ' + m + '\n');
    });
  }
  log.error(
    'build',
    'Build cancelled, waiting for changes before building again.'
  );
}

async function build(argv: any) {
  const bin = Path.resolve(__dirname, '..', 'docsense');

  let argString = `-f ${argv.files} -o ${argv.o} -r ${argv.r}`;

  if (argv.silent) argString += ' -s';
  if (argv.quiet) argString += ' -q';
  if (argv.verbose) argString += ' -V';
  if (argv.debug) argString += ' -D';

  const cmd = `node ${bin} ${argString}`;
  const options = {
    cwd: process.cwd(),
    env: process.env,
  };
  return exec(cmd, options);
}
