module.exports = function_id => {
  if (!function_id) return false;
  return function_id.split('@')[1].split(':')[0];
};
