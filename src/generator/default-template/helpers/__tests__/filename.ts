import * as Handlebars from 'handlebars';

describe('hbs helpers > filename', () => {
  test('matches snapshot', () => {
    Handlebars.registerHelper('filename', require('../filename'));
    const template = Handlebars.compile(`<div>{{filename somepath}}</div>`);
    const result = template({ somepath: 'lib/index.js' });
    expect(result).toMatchSnapshot();
  });
});
