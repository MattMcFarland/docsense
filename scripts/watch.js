const Path = require('path');
const OS = require('os');
const spawn = require('child_process').spawn;
const mkdirp = require('mkdirp');
const { grey: hr } = require('chalkline');
const sane = require('sane');
const { red, yellow, green, blue, cyan, magenta } = require('chalk');
const fs = require('fs');

// #region Command Line Interface
const argv = require('yargs')
  .usage('$0 <target> [extensions..]', 'Watches files for changes', yargs => {
    yargs.positional('target', {
      describe: 'target destination',
      choices: ['esm', 'common'],
    });
    yargs.positional('extensions', {
      describe: 'file extensions to watch for (eg: js, css)',
      default: ['js', 'css', 'md', 'hbs'],
    });
    yargs.option('noTs', {
      describe: 'disable typescript compile',
      default: false,
    });
  })
  .version(false)
  .help(true).argv;
// #endregion

function startWatching() {
  // #region initializers
  const platform = OS.platform();
  const projectPath = Path.resolve(__dirname, '..');
  const watchPath = Path.resolve(projectPath, 'src');

  function greet() {
    const log = (...args) => () => console.log(...args);
    const indented = (...args) => () => console.log('  ', ...args);
    const br = () => process.stderr.write('\n');
    // kind of like a pipe, but does not take any args and is pure side effect
    const run = (...fns) => fns.forEach(fn => fn());

    run(
      br,
      hr,
      br,
      log('Watch script has started, running on', cyan(platform)),
      log('Targeting', yellow(argv.target)),
      log('With the following watchers:'),
      log(blue('  TSC'), argv.noTs ? 'will be disabled' : 'to watch ts'),
      log(magenta('  SANE'), 'to watch', argv.extensions.join(', ')),
      log(magenta('  SANE'), 'to watch binary destination "docsense.js"'),
      br,
      hr,
      br
    );
  }

  function initializeTSC() {
    const tscBinary = Path.resolve(
      process.cwd(),
      'node_modules',
      '.bin',
      platform === 'win32' ? 'tsc.cmd' : 'tsc'
    );

    const tscOutput = buffer => {
      if (buffer.length) {
        process.stdout.write(
          '\n' + blue(' TSC -> ') + '\n\n' + buffer.toString()
        );
        hr();
      }
    };

    const tscProcess = argv.noTs
      ? spawn('echo', ['no-tsc flag enabled, skipping tsc!'])
      : spawn(
          tscBinary,
          ['--listEmittedFiles', '-w', '-p', 'tsconfig.common.json'],
          {
            env: process.env,
            cwd: process.cwd(),
          }
        );

    tscProcess.stderr.on('data', tscOutput);
    tscProcess.stdout.on('data', tscOutput);
    tscProcess.on('exit', code => {
      if (code !== 0) {
        process.exit(code);
      }
    });

    return tscProcess;
  }

  function initializeSane() {
    // #region helpers
    const withZero = unit => (unit.toString().length === 1 ? `0${unit}` : unit);
    const withTime = () => {
      const time = new Date();
      const h = withZero(time.getHours());
      const m = withZero(time.getMinutes());
      const s = withZero(time.getSeconds());

      return (
        time.getHours() +
        ':' +
        time.getMinutes() +
        ':' +
        time.getSeconds() +
        ' -'
      );
    };
    //#endregion

    /**
     * @namespace SaneWatcher
     * Did this to hopefully make the code more organized by the type of functions.
     */
    const SaneWatcher = {
      /**
       * @namespace Resolvers
       * Functions for retrieving the proper file paths from either target or source.
       */
      Resolvers: {
        resolveFromTargetDir(path) {
          return Path.resolve(projectPath, 'dist', argv.target, path);
        },
        resolveFromSourceDir(path) {
          return Path.resolve(watchPath, path);
        },
      },
      /**
       * @namespace Loggers
       * Functions for Logging out Sane related stuff
       */
      Loggers: {
        saneOutput(...args) {
          process.stdout.write(
            '\n' + magenta(' SANE -> ') + '\n\n' + args.join(' ') + '\n\n\n'
          );
          hr();

          // because this is being used in a promise chain
          return true;
        },
        logCompletion() {
          SaneWatcher.Loggers.saneOutput(
            withTime(),
            'Operation complete. Watching for file changes.'
          );
        },
      },
      /**
       * @namespace Effects
       * File I/O stuff
       */
      Effects: {
        copyFile(source, dest) {
          return new Promise((resolve, reject) => {
            const targetPath = Path.dirname(dest);
            mkdirp(targetPath, err => {
              if (err) return reject(err);
              fs.readFile(source, (err, dataToCopy) => {
                if (err) return reject(err);
                fs.writeFile(dest, dataToCopy, err => {
                  if (err) return reject(err);
                  return resolve(Path.relative(projectPath, dest));
                });
              });
            });
          });
        },
      },
      /**
       * The procedure that wires up, and fires up the watchers.
       */
      start() {
        const {
          resolveFromTargetDir,
          resolveFromSourceDir,
        } = SaneWatcher.Resolvers;
        const { saneOutput, logCompletion } = SaneWatcher.Loggers;
        const { copyFile } = SaneWatcher.Effects;

        const onFileChange = (filepath, root) => {
          const srcFile = resolveFromSourceDir(filepath);
          const newFile = resolveFromTargetDir(filepath);

          saneOutput(withTime(), 'File change detected. Starting copy...');

          copyFile(srcFile, newFile)
            .then(file => saneOutput('Copied ' + yellow('modified file'), file))
            .then(logCompletion)
            .catch(err => saneOutput(err.message));
        };

        const onFileAdd = (filepath, root) => {
          const srcFile = resolveFromSourceDir(filepath);
          const newFile = resolveFromTargetDir(filepath);

          saneOutput(withTime(), 'File addition detected. Starting copy...');

          copyFile(srcFile, newFile)
            .then(file => saneOutput('Copied ' + yellow('new file'), file))
            .then(logCompletion)
            .catch(err => saneOutput(err.message));
        };

        const onFileDelete = (filepath, root) => {
          const targetFile = resolveFromTargetDir(filepath);

          saneOutput(withTime(), 'File removal detected. Deleting...');

          fs.unlink(Path.resolve(targetFile), err => {
            if (err) return saneOutput(err.message);
            saneOutput(
              'Removed',
              red('file'),
              Path.relative(projectPath, targetFile)
            );
            logCompletion();
          });
        };

        const sourceFileWatcher = sane(watchPath, {
          glob: argv.extensions.map(ext => `**/*.${ext}`),
        });

        const destBinWatcher = sane(resolveFromTargetDir('cli'), {
          glob: ['docsense.js'],
        });

        sourceFileWatcher.on('change', onFileChange);
        sourceFileWatcher.on('add', onFileAdd);
        sourceFileWatcher.on('delete', onFileDelete);

        destBinWatcher.on('change', (filepath, root) => {
          saneOutput(
            'Detected a new docsense.js file. Changing permissions mode to 700...'
          );
          fs.chmod(Path.join(root, filepath), 700, err => {
            if (err) return saneOutput(err);
            logCompletion();
          });
        });

        return { sourceFileWatcher, destBinWatcher };
      },
    };

    return SaneWatcher;
  }
  // #endregion

  // #region execution
  greet();

  const tsc = initializeTSC();
  const SaneWatcher = initializeSane();

  tsc.stdout.once('data', () => {
    // once tsc has bootstrapped (or it outputs that it wont run, we always at least one event)
    // start up saneWatcher.  This is to prevent any race conditions.
    SaneWatcher.start();
  });
  // #endregion
}

startWatching();
