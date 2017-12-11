const HighlightJS = require('highlight.js');
module.exports = function(str, lang) {
  return HighlightJS.highlight(lang, str).value;
  // return HighlightJS.highlightAuto(string).value;
};
