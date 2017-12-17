module.exports = function(options: any) {
  const HighlightJS = require('highlight.js');
  const Handlebars = require('handlebars');
  const code = options.fn(this);
  const codeString = `<pre class="ba b--black-20 lh-solid"><code class="javascript">${code}</code></pre>`;
  const highlighted = HighlightJS.highlightAuto(codeString).value;
  return highlighted;
};
