module.exports = function(options) {
  return `<pre class="ba b--black-20 lh-solid"><code class="javascript">${options.fn(
    this
  )}</code></pre>`;
};
