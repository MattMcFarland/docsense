const PascalCase = require('pascal-case');

const maybeSlice = bool => arr => (bool ? arr.slice(0, -1) : arr);

function modulename(str) {
  const sliceBy = str.indexOf('index') !== -1 ? true : false;
  const pattern = maybeSlice(sliceBy)(
    str
      .split('.')
      .shift()
      .split('/')
  );
  return PascalCase(pattern.pop());
}

module.exports = modulename;
