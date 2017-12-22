import * as Handlebars from 'handlebars';

describe('hbs helpers > json', () => {
  test('matches snapshot', () => {
    Handlebars.registerHelper('json', require('../json').default);
    const template = Handlebars.compile(`<div>{{json pojo}}</div>`);
    const result = template({ pojo: { foo: { bar: 'baz ' } } });
    expect(result).toMatchSnapshot();
  });
});
