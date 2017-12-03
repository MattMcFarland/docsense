import * as t from 'babel-types';
import { Annotation } from 'doctrine';

// tslint:disable: no-shadowed-variable no-namespace
export namespace Types {
  export type AnyTypeAnnotation = t.AnyTypeAnnotation;
  export type ArrayExpression = t.ArrayExpression;
  export type ArrayPattern = t.ArrayPattern;
  export type ArrayTypeAnnotation = t.ArrayTypeAnnotation;
  export type ArrowFunctionExpression = t.ArrowFunctionExpression;
  export type AssignmentExpression = t.AssignmentExpression;
  export type AssignmentPattern = t.AssignmentPattern;
  export type AssignmentProperty = t.AssignmentProperty;
  export type AwaitExpression = t.AwaitExpression;
  export type BinaryExpression = t.BinaryExpression;
  export type BindExpression = t.BindExpression;
  export type BlockStatement = t.BlockStatement;
  export type BooleanLiteral = t.BooleanLiteral;
  export type BooleanLiteralTypeAnnotation = t.BooleanLiteralTypeAnnotation;
  export type BooleanTypeAnnotation = t.BooleanTypeAnnotation;
  export type BreakStatement = t.BreakStatement;
  export type CallExpression = t.CallExpression;
  export type CatchClause = t.CatchClause;
  export type ClassBody = t.ClassBody;
  export type ClassDeclaration = t.ClassDeclaration;
  export type ClassExpression = t.ClassExpression;
  export type ClassImplements = t.ClassImplements;
  export type ClassMethod = t.ClassMethod;
  export type ClassProperty = t.ClassProperty;
  export type Comment = t.Comment;
  export type CommentBlock = t.CommentBlock;
  export type CommentLine = t.CommentLine;
  export type ConditionalExpression = t.ConditionalExpression;
  export type ContinueStatement = t.ContinueStatement;
  export type DebuggerStatement = t.DebuggerStatement;
  export type DeclareClass = t.DeclareClass;
  export type DeclareFunction = t.DeclareFunction;
  export type DeclareInterface = t.DeclareInterface;
  export type DeclareModule = t.DeclareModule;
  export type DeclareTypeAlias = t.DeclareTypeAlias;
  export type DeclareVariable = t.DeclareVariable;
  export type Decorator = t.Decorator;
  export type Directive = t.Directive;
  export type DirectiveLiteral = t.DirectiveLiteral;
  export type DoExpression = t.DoExpression;
  export type DoWhileStatement = t.DoWhileStatement;
  export type EmptyStatement = t.EmptyStatement;
  export type ExistentialTypeParam = t.ExistentialTypeParam;
  export type ExportAllDeclaration = t.ExportAllDeclaration;
  export type ExportDefaultDeclaration = t.ExportDefaultDeclaration;
  export type ExportDefaultSpecifier = t.ExportDefaultSpecifier;
  export type ExportNamedDeclaration = t.ExportNamedDeclaration;
  export type ExportNamespaceSpecifier = t.ExportNamespaceSpecifier;
  export type ExportSpecifier = t.ExportSpecifier;
  export type ExpressionStatement = t.ExpressionStatement;
  export type File = t.File;
  export type ForInStatement = t.ForInStatement;
  export type ForOfStatement = t.ForOfStatement;
  export type ForStatement = t.ForStatement;
  export type FunctionDeclaration = t.FunctionDeclaration;
  export type FunctionExpression = t.FunctionExpression;
  export type FunctionTypeAnnotation = t.FunctionTypeAnnotation;
  export type FunctionTypeParam = t.FunctionTypeParam;
  export type GenericTypeAnnotation = t.GenericTypeAnnotation;
  export type Identifier = t.Identifier;
  export type IfStatement = t.IfStatement;
  export type ImportDeclaration = t.ImportDeclaration;
  export type ImportDefaultSpecifier = t.ImportDefaultSpecifier;
  export type ImportNamespaceSpecifier = t.ImportNamespaceSpecifier;
  export type ImportSpecifier = t.ImportSpecifier;
  export type InterfaceDeclaration = t.InterfaceDeclaration;
  export type InterfaceExtends = t.InterfaceExtends;
  export type IntersectionTypeAnnotation = t.IntersectionTypeAnnotation;
  export type JSXAttribute = t.JSXAttribute;
  export type JSXClosingElement = t.JSXClosingElement;
  export type JSXElement = t.JSXElement;
  export type JSXEmptyExpression = t.JSXEmptyExpression;
  export type JSXExpressionContainer = t.JSXExpressionContainer;
  export type JSXIdentifier = t.JSXIdentifier;
  export type JSXMemberExpression = t.JSXMemberExpression;
  export type JSXNamespacedName = t.JSXNamespacedName;
  export type JSXOpeningElement = t.JSXOpeningElement;
  export type JSXSpreadAttribute = t.JSXSpreadAttribute;
  export type JSXText = t.JSXText;
  export type LabeledStatement = t.LabeledStatement;
  export type LogicalExpression = t.LogicalExpression;
  export type MemberExpression = t.MemberExpression;
  export type MetaProperty = t.MetaProperty;
  export type MixedTypeAnnotation = t.MixedTypeAnnotation;
  export type NewExpression = t.NewExpression;
  export type Node = t.Node;
  export type Noop = t.Noop;
  export type NullableTypeAnnotation = t.NullableTypeAnnotation;
  export type NullLiteral = t.NullLiteral;
  export type NullLiteralTypeAnnotation = t.NullLiteralTypeAnnotation;
  export type NumberTypeAnnotation = t.NumberTypeAnnotation;
  export type NumericLiteral = t.NumericLiteral;
  export type NumericLiteralTypeAnnotation = t.NumericLiteralTypeAnnotation;
  export type ObjectExpression = t.ObjectExpression;
  export type ObjectMethod = t.ObjectMethod;
  export type ObjectPattern = t.ObjectPattern;
  export type ObjectProperty = t.ObjectProperty;
  export type ObjectTypeAnnotation = t.ObjectTypeAnnotation;
  export type ObjectTypeCallProperty = t.ObjectTypeCallProperty;
  export type ObjectTypeIndexer = t.ObjectTypeIndexer;
  export type ObjectTypeProperty = t.ObjectTypeProperty;
  export type ParenthesizedExpression = t.ParenthesizedExpression;
  export type Program = t.Program;
  export type QualifiedTypeIdentifier = t.QualifiedTypeIdentifier;
  export type RegExpLiteral = t.RegExpLiteral;
  export type RestElement = t.RestElement;
  export type RestProperty = t.RestProperty;
  export type ReturnStatement = t.ReturnStatement;
  export type SequenceExpression = t.SequenceExpression;
  export type SourceLocation = t.SourceLocation;
  export type SpreadElement = t.SpreadElement;
  export type SpreadProperty = t.SpreadProperty;
  export type StringLiteral = t.StringLiteral;
  export type StringLiteralTypeAnnotation = t.StringLiteralTypeAnnotation;
  export type StringTypeAnnotation = t.StringTypeAnnotation;
  export type Super = t.Super;
  export type SwitchCase = t.SwitchCase;
  export type SwitchStatement = t.SwitchStatement;
  export type TaggedTemplateExpression = t.TaggedTemplateExpression;
  export type TemplateElement = t.TemplateElement;
  export type TemplateLiteral = t.TemplateLiteral;
  export type ThisExpression = t.ThisExpression;
  export type ThisTypeAnnotation = t.ThisTypeAnnotation;
  export type ThrowStatement = t.ThrowStatement;
  export type TryStatement = t.TryStatement;
  export type TupleTypeAnnotation = t.TupleTypeAnnotation;
  export type TypeAlias = t.TypeAlias;
  export type TypeAnnotation = t.TypeAnnotation;
  export type TypeCastExpression = t.TypeCastExpression;
  export type TypeofTypeAnnotation = t.TypeofTypeAnnotation;
  export type TypeParameterDeclaration = t.TypeParameterDeclaration;
  export type TypeParameterInstantiation = t.TypeParameterInstantiation;
  export type UnaryExpression = t.UnaryExpression;
  export type UnionTypeAnnotation = t.UnionTypeAnnotation;
  export type UpdateExpression = t.UpdateExpression;
  export type VariableDeclaration = t.VariableDeclaration;
  export type VariableDeclarator = t.VariableDeclarator;
  export type VoidTypeAnnotation = t.VoidTypeAnnotation;
  export type WhileStatement = t.WhileStatement;
  export type WithStatement = t.WithStatement;
  export type YieldExpression = t.YieldExpression;
}
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
