const Handlebars = require('handlebars');

module.exports = function(ctx) {
  const staticModel = JSON.stringify(ctx);
  const tag = `<script class="nohighlight" type="application/json" id="staticModel">${staticModel}</script>`;
  return new Handlebars.SafeString(tag);
};
