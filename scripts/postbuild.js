const cpr = require('cpr');
const fs = require('fs');
const { cyan, yellow } = require('chalk');
const argv = require('yargs')
  .usage(
    '$0 <target>',
    'Copies non-transpiled files, and chmods the cli',
    yargs => {
      yargs.positional('target', {
        describe: 'the build destination',
        type: 'string',
        choices: ['esm', 'common'],
      });
    }
  )
  .version(false)
  .help(false).argv;

const cliFile = `dist/${argv.target}/cli/docsense.js`;
const staticDir = 'generator/templates/static';
const templatesDir = 'generator/templates';

const sources = {
  static: `src/${staticDir}`,
  templates: `src/${templatesDir}`,
};

const targets = {
  static: `dist/${argv.target}/${staticDir}`,
  templates: `dist/${argv.target}/${templatesDir}`,
};

let errors = [];
cpr(
  sources.templates,
  targets.templates,
  {
    filter: /.js$|static|.ts$/,
    overwrite: true,
  },
  err => {
    if (err) errors.push(err);
    console.log(
      'Copied from',
      cyan(sources.templates),
      'to',
      yellow(targets.templates)
    );
    cpr(
      sources.static,
      targets.static,
      {
        overwrite: true,
        confirm: true,
      },
      err => {
        if (err) errors.push(err);
        console.log(
          'Copied from',
          cyan(sources.static),
          'to',
          yellow(targets.static)
        );
        fs.chmod(cliFile, 777, err => {
          if (err) errors.push(err);
          console.log('chmod 777', cyan(cliFile));
          if (errors.length) {
            console.log('Done! (With Errors)');
            errors.forEach(msg => console.log(msg));
            process.exit(1);
          }
          console.log('✨', '  Done!');
        });
      }
    );
  }
);
