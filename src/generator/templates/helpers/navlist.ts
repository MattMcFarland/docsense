module.exports = (ctx: any) => {
  const Handlebars = require('handlebars');
  return new Handlebars.SafeString(makeList(ctx));
};

function makeList(obj: any, depth: number = 3) {
  let result = '';
  Object.entries(obj).forEach(([key, value]: any) => {
    if (value.type === 'root') {
      result += makeList(value, depth);
    }
    if (value.type === 'path') {
      result += `<h${depth} class="f${depth} pa1">${key}</h${depth}>`;
      result += makeList(value, depth + 1);
    }
    if (value.type === 'file') {
      const { dir, name, base } = value.meta.fileData;
      result += `<a class="pa1 pl2 link dim white db" href="/m/${dir}/${base}.html">${name}</a>`;
    }
  });
  return result;
}
