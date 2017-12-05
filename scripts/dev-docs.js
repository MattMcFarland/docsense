const path = require('path');
const bs = require('browser-sync').create();
const spawn = require('cross-spawn');
const sane = require('sane');

const watchPath = path.resolve(process.cwd(), 'src/generator');
const watcher = sane(watchPath, { glob: ['**/*.ts', '**/*.hbs'] });

watcher.on('change', function(filepath, root, stat) {
  spawn.sync('yarn', ['poc'], { stdio: 'inherit' });
  console.log('file changed', filepath);
});
watcher.on('add', function(filepath, root, stat) {
  spawn.sync('yarn', ['poc'], { stdio: 'inherit' });
  console.log('file added', filepath);
});
watcher.on('delete', function(filepath, root) {
  spawn.sync('yarn', ['poc'], { stdio: 'inherit' });
  console.log('file deleted', filepath);
});

// Listen to change events on HTML and reload
bs.watch('docs/**/*').on('change', bs.reload);

// Start a Browsersync static file server
bs.init({
  server: './docs',
});
