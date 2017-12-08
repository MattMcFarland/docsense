import * as t from 'babel-types';
import { Annotation } from 'doctrine';

export type ArrayPatternElement =
  | t.Identifier
  | t.MemberExpression
  | t.ArrayExpression
  | t.AssignmentExpression
  | t.BinaryExpression
  | t.CallExpression
  | t.ConditionalExpression
  | t.FunctionExpression
  | t.StringLiteral
  | t.NumericLiteral
  | t.BooleanLiteral
  | t.NullLiteral
  | t.RegExpLiteral
  | t.LogicalExpression
  | t.NewExpression
  | t.ObjectExpression
  | t.SequenceExpression
  | t.ThisExpression
  | t.UnaryExpression
  | t.UpdateExpression
  | t.ArrowFunctionExpression
  | t.ClassExpression
  | t.MetaProperty
  | t.Super
  | t.TaggedTemplateExpression
  | t.TemplateLiteral
  | t.YieldExpression
  | t.TypeCastExpression
  | t.JSXElement
  | t.JSXEmptyExpression
  | t.JSXIdentifier
  | t.JSXMemberExpression
  | t.ParenthesizedExpression
  | t.AwaitExpression
  | t.BindExpression
  | t.DoExpression;

export interface IFunctionMeta {
  function_id: string;
  params?: Param[];
  jsdoc: Annotation[];
}

export type FunctionType =
  | t.ObjectMethod
  | t.ArrowFunctionExpression
  | t.FunctionExpression
  | t.FunctionDeclaration;

export type VarIDNode =
  | t.Identifier
  | t.MemberExpression
  | t.RestElement
  | t.AssignmentPattern
  | t.ArrayPattern
  | t.ObjectPattern;

export type Param = string | IKeyValueDescriptor[] | string[];

export interface IKeyValueDescriptor {
  key: string;
  value: string;
}

export type ArrayPatternProperty =
  | t.Identifier
  | t.MemberExpression
  | t.ArrayExpression
  | t.AssignmentExpression
  | t.BinaryExpression
  | t.CallExpression
  | t.ConditionalExpression
  | t.FunctionExpression
  | t.StringLiteral
  | t.NumericLiteral
  | t.BooleanLiteral
  | t.NullLiteral
  | t.RegExpLiteral
  | t.LogicalExpression
  | t.NewExpression
  | t.ObjectExpression
  | t.SequenceExpression
  | t.ThisExpression
  | t.UnaryExpression
  | t.UpdateExpression
  | t.ArrowFunctionExpression
  | t.ClassExpression
  | t.MetaProperty
  | t.Super
  | t.TaggedTemplateExpression
  | t.TemplateLiteral
  | t.YieldExpression
  | t.TypeCastExpression
  | t.JSXElement
  | t.JSXEmptyExpression
  | t.JSXIdentifier
  | t.JSXMemberExpression
  | t.ParenthesizedExpression
  | t.AwaitExpression
  | t.BindExpression
  | t.DoExpression
  | t.RestElement;

export type VariableDeclaratorInit =
  | t.ArrayExpression
  | t.AssignmentExpression
  | t.BinaryExpression
  | t.CallExpression
  | t.ConditionalExpression
  | t.FunctionExpression
  | t.Identifier
  | t.StringLiteral
  | t.NumericLiteral
  | t.BooleanLiteral
  | t.NullLiteral
  | t.RegExpLiteral
  | t.LogicalExpression
  | t.MemberExpression
  | t.NewExpression
  | t.ObjectExpression
  | t.SequenceExpression
  | t.ThisExpression
  | t.UnaryExpression
  | t.UpdateExpression
  | t.ArrowFunctionExpression
  | t.ClassExpression
  | t.MetaProperty
  | t.Super
  | t.TaggedTemplateExpression
  | t.TemplateLiteral
  | t.YieldExpression
  | t.TypeCastExpression
  | t.JSXElement
  | t.JSXEmptyExpression
  | t.JSXIdentifier
  | t.JSXMemberExpression
  | t.ParenthesizedExpression
  | t.AwaitExpression
  | t.BindExpression
  | t.DoExpression;
