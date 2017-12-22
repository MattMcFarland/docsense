export default function(options: any) {
  const HighlightJS = require('highlight.js');
  const Handlebars = require('handlebars');
  const code = options.fn(this);
  const highlighted = HighlightJS.highlightAuto(code).value;
  const html = `<pre class="ba b--black-20 lh-solid"><code class="javascript">${highlighted}</code></pre>`;

  return new Handlebars.SafeString(html);
}
