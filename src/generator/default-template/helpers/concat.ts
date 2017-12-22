export default (...args: any[]) => {
  return args.reduce((acc, arg) => (isPrimitive(arg) ? acc + arg : acc));
};
function isPrimitive(arg: any): arg is typeof String | typeof Number {
  if (typeof arg === 'string') return true;
  if (typeof arg === 'number') return true;
  return false;
}
