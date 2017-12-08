import { Renderer } from 'marked';

import { blockquote, code } from './styles';

export default function() {
  const renderer = new Renderer();
  renderer.blockquote = blockquote;
  renderer.code = code;
  return renderer;
}
