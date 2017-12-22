import { BlockHelper } from '../_types/handlebars';

const marked = require('marked');
const addEmojis = require('../../compiler').addEmojis;
const markedStyle = require('../../marked/renderer').default;
const renderer = markedStyle();

marked.setOptions({ renderer });

export default function(this: any, ctx: BlockHelper) {
  const Handlebars = require('handlebars');
  const str = ctx.fn(this);
  const parsed = marked(addEmojis(str));
  return new Handlebars.SafeString(parsed);
}
