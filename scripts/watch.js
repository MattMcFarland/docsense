const Path = require('path');
const OS = require('os');
const spawn = require('child_process').spawn;
const mkdirp = require('mkdirp');

const sane = require('sane');
const chalk = require('chalk');
const fs = require('fs');

const platform = OS.platform();

const projectPath = Path.resolve(__dirname, '..');
const watchPath = Path.resolve(projectPath, 'src');

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

console.log('Executing watcher on', chalk.cyan(platform));

const targetDir = path => Path.resolve(projectPath, 'dist', argv.target, path);
const srcDir = path => Path.resolve(watchPath, path);

const cli = targetDir('cli');
const cliWatcher = sane(cli, { glob: ['docsense.js'] });

const compiler = Path.resolve(
  process.cwd(),
  'node_modules',
  '.bin',
  platform === 'win32' ? 'tsc.cmd' : 'tsc'
);

const watcher = sane(watchPath, {
  glob: argv.extensions.map(ext => `**/*.${ext}`),
});

const tsc = argv.noTs
  ? spawn('echo', ['no-tsc flag enabled, skipping tsc!'])
  : spawn(compiler, ['-w', '-p', 'tsconfig.common.json'], {
      env: process.env,
      cwd: process.cwd(),
    });

const tscOutput = buffer => {
  if (buffer.length) {
    process.stdout.write(
      chalk.cyan(' TSC -> ') + buffer.toString().trim() + '\n'
    );
  }
};

const saneOutput = (...args) => {
  console.log(chalk.magenta('SANE ->'), ...args);
};

tsc.stderr.on('data', tscOutput);
tsc.stdout.on('data', tscOutput);

tsc.on('exit', code => {
  if (code !== 0) {
    process.exit(code);
  }
});

tsc.stdout.once('data', () => {
  saneOutput('Watching on', argv.extensions);
});

const copyFile = (source, dest) => {
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
};

const onFileChange = (filepath, root, stat) => {
  const srcFile = srcDir(filepath);
  const newFile = targetDir(filepath);
  saneOutput('File change detected. Starting copy...');
  copyFile(srcFile, newFile)
    .then(file => saneOutput('Copied ' + chalk.yellow('modified file'), file))
    .catch(err => saneOutput(err.message));
};

const onFileAdd = (filepath, root, stat) => {
  const srcFile = srcDir(filepath);
  const newFile = targetDir(filepath);
  saneOutput('File addition detected. Starting copy...');
  copyFile(srcFile, newFile)
    .then(file => saneOutput('Copied ' + chalk.yellow('new file'), file))
    .catch(err => saneOutput(err.message));
};

const onFileDelete = (filepath, root, stat) => {
  const targetFile = targetDir(filepath);
  saneOutput('File removal detected. Deleting...');
  fs.unlink(Path.resolve(targetFile), err => {
    if (err) return saneOutput(err.message);
    saneOutput(
      'Removed',
      chalk.red('file'),
      Path.relative(projectPath, targetFile)
    );
  });
};

watcher.on('change', onFileChange);
watcher.on('add', onFileAdd);
watcher.on('delete', onFileDelete);

cliWatcher.on('change', (filepath, root) => {
  fs.chmod(Path.join(root, filepath), 700, err => {
    if (err) return saneOutput(err);
    saneOutput('chmod', filepath);
  });
});
