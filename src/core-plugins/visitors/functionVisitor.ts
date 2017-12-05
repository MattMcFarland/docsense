export default (handler: any) => ({
  ArrowFunctionExpression: handler,
  FunctionExpression: handler,
  FunctionDeclaration: handler,
  ObjectMethod: handler,
  ClassMethod: handler,
});
