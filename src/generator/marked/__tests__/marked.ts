import * as FS from 'fs';
import * as Path from 'path';

import * as marked from 'marked';
import markedStyle from '../renderer';

const renderer = markedStyle();
marked.setOptions({ renderer });

describe('marked renderer', () => {
  it('matches snapshot', done => {
    const markdown = FS.readFileSync(
      Path.join(__dirname, './__fixtures__/kitchsink.txt')
    );
    marked.parse(markdown.toString(), (err, data) => {
      expect(err).toBe(null);
      expect(data).toMatchSnapshot();
      done();
    });
  });
});
