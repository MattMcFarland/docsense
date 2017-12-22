import * as Handlebars from 'handlebars';

describe('hbs helpers > concat', () => {
  test('matches snapshot', () => {
    Handlebars.registerHelper('concat', require('../concat').default);
    const hbs = `<div>{{concat foo " " bar " " baz}}</div>`;
    const template = Handlebars.compile(hbs);
    const result = template({ foo: 'foo', bar: 'bar', baz: 'baz' });
    expect(result).toMatchSnapshot();
  });
});
