import * as Handlebars from 'handlebars';

describe('hbs helpers > fnSignature', () => {
  test('matches snapshot', () => {
    Handlebars.registerHelper('fnSignature', require('../fnSignature'));
    const template = Handlebars.compile(`<div>{{fnSignature fn}}</div>`);
    const result = template({ fn: { params: ['a, b, c'] } });
    expect(result).toMatchSnapshot();
  });
});
