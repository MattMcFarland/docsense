module.exports = function(...args) {
  return args.reduce((acc, arg) => (isPrimitive(arg) ? acc + arg : acc));
};
function isPrimitive(arg) {
  if (typeof arg === 'string') return true;
  if (typeof arg === 'number') return true;
  return false;
}
