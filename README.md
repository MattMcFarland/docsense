## WIP

This is a work in progress

## Docsense

Docsense is a pluggable and customizable AST to documentation generator which
parses ECMASCIPT 2015+ using
[Babylon](https://github.com/babel/babel/tree/master/packages/babylon),

**It is still in early development and currently not operational**

### Finished

* [x] variable declarations
* [x] FunctionExpression, ArrowFunctionExpression, FunctionDeclaration
* [x] CommonJS Exports
* [x] ES6 Exports
* [x] Function Paramaters
* [x] Object Destructuring
* [x] Plugin system
* [x] JSDoc comments for all of the above
* [x] Memory/File database and caching

### TODO

* [ ] core-plugin/object - which will parse for
      [ObjectExpression](https://github.com/babel/babel/blob/master/packages/babylon/ast/spec.md#objectexpression),
      [ObjectMember](https://github.com/babel/babel/blob/master/packages/babylon/ast/spec.md#objectmember),
      [ObjectProperty](https://github.com/babel/babel/blob/master/packages/babylon/ast/spec.md#objectproperty),
      [ObjectMethod](https://github.com/babel/babel/blob/master/packages/babylon/ast/spec.md#objectmethod),
      and _maybe_
      [ObjectPattern](https://github.com/babel/babel/blob/master/packages/babylon/ast/spec.md#objectpattern)

* [ ] core-plugin/class - which will parse for
      [Classes](https://github.com/babel/babel/blob/master/packages/babylon/ast/spec.md#classes)
      which include
      [ClassBody](https://github.com/babel/babel/blob/master/packages/babylon/ast/spec.md#classbody),
      [ClassPrivateMethod](https://github.com/babel/babel/blob/master/packages/babylon/ast/spec.md#classprivatemethod),
      [ClassProperty](https://github.com/babel/babel/blob/master/packages/babylon/ast/spec.md#classproperty),
      [ClassPrivateProperty](https://github.com/babel/babel/blob/master/packages/babylon/ast/spec.md#classprivateproperty),
      [ClassDeclaration](https://github.com/babel/babel/blob/master/packages/babylon/ast/spec.md#classdeclaration),
      [MetaProperty](https://github.com/babel/babel/blob/master/packages/babylon/ast/spec.md#metaproperty),
      [Super](https://github.com/babel/babel/blob/master/packages/babylon/ast/spec.md#super),
      [ThisExpression](https://github.com/babel/babel/blob/master/packages/babylon/ast/spec.md#thisexpression)

- [ ] Querying data, UI

- [ ] STRETCH: Support for prototype based object creation (es5), also perhaps
      usage of Object.DefineProperty(ies), Object.Create, etc.

### LICENSE

MIT
