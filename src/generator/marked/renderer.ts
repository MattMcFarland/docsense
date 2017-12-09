import { Renderer } from 'marked';

import {
  blockquote,
  code,
  codespan,
  heading,
  link,
  paragraph,
  table,
} from './styles';
import { tableCell, tableRow } from './styles/table';

export default function() {
  const renderer = new Renderer();
  renderer.blockquote = blockquote;
  renderer.code = code;
  renderer.paragraph = paragraph;
  renderer.heading = heading;
  renderer.table = table;
  renderer.tablecell = tableCell;
  renderer.tablerow = tableRow;
  renderer.codespan = codespan;
  renderer.link = link;
  return renderer;
}
