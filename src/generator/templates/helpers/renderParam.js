module.exports = function(param) {
  if (typeof param === 'string') return param;
  if (Array.isArray(param)) {
    return (
      '{ ' +
      param
        .map(p => {
          if (p.key === p.value) return p.value;
          return `{ ${p.key}: ${p.value} }`;
        })
        .join(', ') +
      ' }'
    );
  }
};
