import { compile, require_template } from './compiler';

const db = require('../../docs/db.json');

// create index html
const { file_collection, export_collection } = db;
const filesWithExports = file_collection.reduce((acc: any, file: any) => {
  const fileExports = export_collection.filter(
    (xp: any) => xp.file_id === file.file_id
  );
  const exports = fileExports.map((x: any) => x.export_id);
  if (exports.length) {
    acc.push({
      file_id: file.file_id,
      exports,
    });
  }
  return acc;
}, []);

const indexPage = require_template('./templates/index.hbs');

compile(indexPage, { filesWithExports }, 'index.html');
