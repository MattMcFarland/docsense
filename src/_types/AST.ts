import * as t from 'babel-types';
import { Annotation } from 'doctrine';

// tslint:disable: no-shadowed-variable no-namespace

export type NodeType =
  | t.CommentBlock
  | t.CommentLine
  | t.ArrayExpression
  | t.AssignmentExpression
  | t.BinaryExpression
  | t.Directive
  | t.DirectiveLiteral
  | t.BlockStatement
  | t.BreakStatement
  | t.CallExpression
  | t.CatchClause
  | t.ConditionalExpression
  | t.ContinueStatement
  | t.DebuggerStatement
  | t.DoWhileStatement
  | t.EmptyStatement
  | t.ExpressionStatement
  | t.File
  | t.ForInStatement
  | t.ForStatement
  | t.FunctionDeclaration
  | t.FunctionExpression
  | t.Identifier
  | t.IfStatement
  | t.LabeledStatement
  | t.StringLiteral
  | t.NumericLiteral
  | t.NullLiteral
  | t.BooleanLiteral
  | t.RegExpLiteral
  | t.LogicalExpression
  | t.MemberExpression
  | t.NewExpression
  | t.Program
  | t.ObjectExpression
  | t.ObjectMethod
  | t.ObjectProperty
  | t.RestElement
  | t.ReturnStatement
  | t.SequenceExpression
  | t.SwitchCase
  | t.SwitchStatement
  | t.ThisExpression
  | t.ThrowStatement
  | t.TryStatement
  | t.UnaryExpression
  | t.UpdateExpression
  | t.VariableDeclaration
  | t.VariableDeclarator
  | t.WhileStatement
  | t.WithStatement
  | t.AssignmentPattern
  | t.ArrayPattern
  | t.ArrowFunctionExpression
  | t.ClassBody
  | t.ClassDeclaration
  | t.ClassExpression
  | t.ExportAllDeclaration
  | t.ExportDefaultDeclaration
  | t.ExportNamedDeclaration
  | t.ExportSpecifier
  | t.ForOfStatement
  | t.ImportDeclaration
  | t.ImportDefaultSpecifier
  | t.ImportNamespaceSpecifier
  | t.ImportSpecifier
  | t.MetaProperty
  | t.ClassMethod
  | t.AssignmentProperty
  | t.ObjectPattern
  | t.SpreadElement
  | t.Super
  | t.TaggedTemplateExpression
  | t.TemplateElement
  | t.TemplateLiteral
  | t.YieldExpression
  | t.AnyTypeAnnotation
  | t.ArrayTypeAnnotation
  | t.BooleanTypeAnnotation
  | t.BooleanLiteralTypeAnnotation
  | t.NullLiteralTypeAnnotation
  | t.ClassImplements
  | t.ClassProperty
  | t.DeclareClass
  | t.DeclareFunction
  | t.DeclareInterface
  | t.DeclareModule
  | t.DeclareTypeAlias
  | t.DeclareVariable
  | t.ExistentialTypeParam
  | t.FunctionTypeAnnotation
  | t.FunctionTypeParam
  | t.GenericTypeAnnotation
  | t.InterfaceExtends
  | t.InterfaceDeclaration
  | t.IntersectionTypeAnnotation
  | t.MixedTypeAnnotation
  | t.NullableTypeAnnotation
  | t.NumericLiteralTypeAnnotation
  | t.NumberTypeAnnotation
  | t.StringLiteralTypeAnnotation
  | t.StringTypeAnnotation
  | t.ThisTypeAnnotation
  | t.TupleTypeAnnotation
  | t.TypeofTypeAnnotation
  | t.TypeAlias
  | t.TypeAnnotation
  | t.TypeCastExpression
  | t.TypeParameterDeclaration
  | t.TypeParameterInstantiation
  | t.ObjectTypeAnnotation
  | t.ObjectTypeCallProperty
  | t.ObjectTypeIndexer
  | t.ObjectTypeProperty
  | t.QualifiedTypeIdentifier
  | t.UnionTypeAnnotation
  | t.VoidTypeAnnotation
  | t.JSXAttribute
  | t.JSXClosingElement
  | t.JSXElement
  | t.JSXEmptyExpression
  | t.JSXExpressionContainer
  | t.JSXIdentifier
  | t.JSXMemberExpression
  | t.JSXNamespacedName
  | t.JSXOpeningElement
  | t.JSXSpreadAttribute
  | t.JSXText
  | t.Noop
  | t.ParenthesizedExpression
  | t.AwaitExpression
  | t.BindExpression
  | t.Decorator
  | t.DoExpression
  | t.ExportDefaultSpecifier
  | t.ExportNamespaceSpecifier
  | t.RestProperty
  | t.SpreadProperty;

export type FunctionType =
  | t.FunctionDeclaration
  | t.FunctionExpression
  | t.ArrowFunctionExpression;
export type Parameter =
  | t.Identifier
  | t.MemberExpression
  | t.ArrayPattern
  | t.ObjectPattern
  | t.RestElement
  | t.AssignmentPattern;
export interface INamedIdentifier extends t.Identifier {
  type: 'Identifier';
  name: string;
}
