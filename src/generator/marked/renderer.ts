import { Renderer } from 'marked';

import { blockquote, code, heading, paragraph } from './styles';

export default function() {
  const renderer = new Renderer();
  renderer.blockquote = blockquote;
  renderer.code = code;
  renderer.paragraph = paragraph;
  renderer.heading = heading;
  return renderer;
}
