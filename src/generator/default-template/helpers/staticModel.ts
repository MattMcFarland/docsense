module.exports = (ctx: any) => {
  const Handlebars = require('handlebars');
  const staticModel = JSON.stringify(ctx);
  const tag = `<script class="nohighlight" type="application/json" id="staticModel">${staticModel}</script>`;
  return new Handlebars.SafeString(tag);
};
