import * as Handlebars from 'handlebars';

describe('hbs helpers > esImport', () => {
  test('when all is false > matches snapshot', () => {
    Handlebars.registerHelper('esImport', require('../esImport'));
    const template = Handlebars.compile(`
    {{ esImport
      all=false
      name="foo"
      link="/bar/baz/source.html"
      line=99
      from="/bar/baz"
    }}
    `);
    const result = template({});
    expect(result).toMatchSnapshot();
  });
  test('when all is true > matches snapshot', () => {
    Handlebars.registerHelper('esImport', require('../esImport'));
    const template = Handlebars.compile(`
    {{ esImport
      all=true
      name="foo"
      link="/bar/baz/source.html"
      line=99
      from="/bar/baz"
    }}
    `);
    const result = template({});
    expect(result).toMatchSnapshot();
  });
});
