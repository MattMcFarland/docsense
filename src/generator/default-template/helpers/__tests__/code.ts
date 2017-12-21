import * as Handlebars from 'handlebars';

describe('hbs helpers > code', () => {
  test('matches snapshot', () => {
    const code = require('../code');
    Handlebars.registerHelper('code', code);
    const hbs = `<div>{{#code}}var foo = 'bar'{{/code}}</div>`;
    const template = Handlebars.compile(hbs);
    const result = template({});
    expect(result).toMatchSnapshot();
  });
});
