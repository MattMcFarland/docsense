const HighlightJS = require('highlight.js');
module.exports = function(string) {
  return HighlightJS.highlightAuto(string).value;
};
