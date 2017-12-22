import * as Handlebars from 'handlebars';

describe('hbs helpers > daam', () => {
  test('matches snapshot', () => {
    Handlebars.registerHelper('daam', require('../daam').default);
    const hbs = `<div>{{daam modulePath}}</div>`;
    const template = Handlebars.compile(hbs);
    const result = template({ modulePath: 'foo/bar/index' });
    expect(result).toMatchSnapshot();
  });
});
