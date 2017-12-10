export const encode = (str: string) => {
  const buffer = Buffer.from(str, 'utf8');
  return buffer.toString('base64');
};
export const decode = (str: string) => {
  const buffer = Buffer.from(str, 'base64');
  return buffer.toString('utf8');
};
