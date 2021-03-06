import {
  AnyTypeAnnotation,
  ArrayExpression,
  ArrayPattern,
  ArrayTypeAnnotation,
  ArrowFunctionExpression,
  AssignmentExpression,
  AssignmentPattern,
  AssignmentProperty,
  AwaitExpression,
  BinaryExpression,
  BindExpression,
  BlockStatement,
  BooleanLiteral,
  BooleanLiteralTypeAnnotation,
  BooleanTypeAnnotation,
  BreakStatement,
  CallExpression,
  CatchClause,
  ClassBody,
  ClassDeclaration,
  ClassExpression,
  ClassImplements,
  ClassMethod,
  ClassProperty,
  Comment,
  CommentBlock,
  CommentLine,
  ConditionalExpression,
  ContinueStatement,
  DebuggerStatement,
  DeclareClass,
  DeclareFunction,
  DeclareInterface,
  DeclareModule,
  DeclareTypeAlias,
  DeclareVariable,
  Decorator,
  Directive,
  DirectiveLiteral,
  DoExpression,
  DoWhileStatement,
  EmptyStatement,
  ExistentialTypeParam,
  ExportAllDeclaration,
  ExportDefaultDeclaration,
  ExportDefaultSpecifier,
  ExportNamedDeclaration,
  ExportNamespaceSpecifier,
  ExportSpecifier,
  ExpressionStatement,
  File,
  ForInStatement,
  ForOfStatement,
  ForStatement,
  FunctionDeclaration,
  FunctionExpression,
  FunctionTypeAnnotation,
  FunctionTypeParam,
  GenericTypeAnnotation,
  Identifier,
  IfStatement,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  InterfaceDeclaration,
  InterfaceExtends,
  IntersectionTypeAnnotation,
  JSXAttribute,
  JSXClosingElement,
  JSXElement,
  JSXEmptyExpression,
  JSXExpressionContainer,
  JSXIdentifier,
  JSXMemberExpression,
  JSXNamespacedName,
  JSXOpeningElement,
  JSXSpreadAttribute,
  JSXText,
  LabeledStatement,
  LogicalExpression,
  MemberExpression,
  MetaProperty,
  MixedTypeAnnotation,
  NewExpression,
  Node,
  Noop,
  NullableTypeAnnotation,
  NullLiteral,
  NullLiteralTypeAnnotation,
  NumberTypeAnnotation,
  NumericLiteral,
  NumericLiteralTypeAnnotation,
  ObjectExpression,
  ObjectMethod,
  ObjectPattern,
  ObjectProperty,
  ObjectTypeAnnotation,
  ObjectTypeCallProperty,
  ObjectTypeIndexer,
  ObjectTypeProperty,
  ParenthesizedExpression,
  Program,
  QualifiedTypeIdentifier,
  RegExpLiteral,
  RestElement,
  RestProperty,
  ReturnStatement,
  SequenceExpression,
  SourceLocation,
  SpreadElement,
  SpreadProperty,
  StringLiteral,
  StringLiteralTypeAnnotation,
  StringTypeAnnotation,
  Super,
  SwitchCase,
  SwitchStatement,
  TaggedTemplateExpression,
  TemplateElement,
  TemplateLiteral,
  ThisExpression,
  ThisTypeAnnotation,
  ThrowStatement,
  TryStatement,
  TupleTypeAnnotation,
  TypeAlias,
  TypeAnnotation,
  TypeCastExpression,
  TypeofTypeAnnotation,
  TypeParameterDeclaration,
  TypeParameterInstantiation,
  UnaryExpression,
  UnionTypeAnnotation,
  UpdateExpression,
  VariableDeclaration,
  VariableDeclarator,
  VoidTypeAnnotation,
  WhileStatement,
  WithStatement,
  YieldExpression,
} from 'babel-types';
import { Annotation } from 'doctrine';

// Type definitions for babel-types
// Project: babel-types
// Definitions by: Matt McFarland

declare module 'babel-types' {
  export interface Node {
    loc: SourceLocation | null;
    __doc_tags__?: Annotation[];
    id: Identifier | null;
  }

  export interface Comment {
    type: 'CommentBlock' | 'CommentLine';
    value: string;
    start: number;
    end: number;
    loc: SourceLocation;
  }
  export interface SourceLocation {
    filename: string;
  }
}
