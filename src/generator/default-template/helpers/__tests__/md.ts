import * as Handlebars from 'handlebars';

describe('hbs helpers > md', () => {
  test('matches snapshot', () => {
    Handlebars.registerHelper('md', require('../md'));
    const template = Handlebars.compile(`<div>{{#md}} {{stuff}} {{/md}}</div>`);
    const result = template({ stuff: `#heading \n\n**yay markdown**` });
    expect(result).toMatchSnapshot();
  });
});
