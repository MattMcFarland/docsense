import * as Handlebars from 'handlebars';

describe('hbs helpers > renderParam', () => {
  test('matches snapshot', () => {
    Handlebars.registerHelper('renderParam', require('../renderParam').default);
    const template = Handlebars.compile(`<div>{{renderParam param}}</div>`);
    const result = template({ param: ['foo'] });
    expect(result).toMatchSnapshot();
  });
});
