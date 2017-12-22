import * as Handlebars from 'handlebars';
import fnSignature from '../fnSignature';
describe('hbs helpers > fnSignature', () => {
  test('matches snapshot', () => {
    Handlebars.registerHelper('fnSignature', fnSignature);
    const template = Handlebars.compile(`<div>{{fnSignature fn}}</div>`);
    const result = template({ fn: { params: ['a, b, c'] } });
    expect(result).toMatchSnapshot();
  });
});
