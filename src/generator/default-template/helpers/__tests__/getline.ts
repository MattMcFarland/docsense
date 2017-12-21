import * as Handlebars from 'handlebars';

describe('hbs helpers > getLine', () => {
  test('matches snapshot', () => {
    Handlebars.registerHelper('getLine', require('../getLine'));
    const template = Handlebars.compile(`<div>{{getLine str}}</div>`);
    const result = template({ str: 'foobar@10:1' });
    expect(result).toMatchSnapshot();
  });
});
