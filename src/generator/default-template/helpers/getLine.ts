module.exports = (function_id: string) => {
  if (!function_id) return false;
  return function_id.split('@')[1].split(':')[0];
};
