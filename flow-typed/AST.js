// @flow

// This is all borrowed from Babylon source code
// This is probably a bad way of doing this but they do not declare their flow types

import type { Token } from './Token'
import type { SourceLocation } from './SourceLocation'

declare type Comment = {
  type: 'CommentBlock' | 'CommentLine',
  value: string,
  start: number,
  end: number,
  loc: SourceLocation,
}

declare interface NodeBase {
  start: number;
  end: number;
  loc: SourceLocation;
  range: [number, number];
  leadingComments?: ?Array<Comment>;
  trailingComments?: ?Array<Comment>;
  innerComments?: ?Array<Comment>;

  extra: { [key: string]: any };
}

// Using a union type for `ASTNode` makes type-checking too slow.
// Instead, add an index signature to allow a ASTNode to be treated as anything.
declare type ASTNode = NodeBase & { [key: string]: any }
declare type Expression = ASTNode
declare type Statement = ASTNode
declare type Pattern =
  | Identifier
  | ObjectPattern
  | ArrayPattern
  | RestElement
  | AssignmentPattern
declare type Declaration =
  | VariableDeclaration
  | ClassDeclaration
  | FunctionDeclaration
  | TsInterfaceDeclaration
  | TsTypeAliasDeclaration
  | TsEnumDeclaration
  | TsModuleDeclaration
declare type DeclarationBase = NodeBase & {
  // TypeScript allows declarations to be prefixed by `declare`.
  //TODO: a FunctionDeclaration is never "declare", because it's a TSDeclareFunction instead.
  declare?: true,
}

// TODO: Not in spec
declare type HasDecorators = NodeBase & {
  decorators?: $ReadOnlyArray<Decorator>,
}

declare type Identifier = PatternBase & {
  type: 'Identifier',
  name: string,

  __clone(): Identifier,

  // TypeScript only. Used in case of an optional parameter.
  optional?: ?true,
}

declare type PrivateName = NodeBase & {
  type: 'PrivateName',
  id: Identifier,
}

// Literals

declare type Literal =
  | RegExpLiteral
  | NullLiteral
  | StringLiteral
  | BooleanLiteral
  | NumericLiteral

declare type RegExpLiteral = NodeBase & {
  type: 'RegExpLiteral',
  pattern: string,
  flags: RegExp$flags,
}

declare type NullLiteral = NodeBase & {
  type: 'NullLiteral',
}

declare type StringLiteral = NodeBase & {
  type: 'StringLiteral',
  value: string,
}

declare type BooleanLiteral = NodeBase & {
  type: 'BooleanLiteral',
  value: boolean,
}

declare type NumericLiteral = NodeBase & {
  type: 'NumericLiteral',
  value: number,
}

declare type BigIntLiteral = NodeBase & {
  type: 'BigIntLiteral',
  value: number,
}

// Programs

declare type BlockStatementLike = Program | BlockStatement

declare type File = NodeBase & {
  type: 'File',
  program: Program,
  comments: $ReadOnlyArray<Comment>,
  tokens: $ReadOnlyArray<Token | Comment>,
}

declare type Program = NodeBase & {
  type: 'Program',
  sourceType: 'script' | 'module',
  body: Array<Statement | ModuleDeclaration>, // TODO: $ReadOnlyArray
  directives: $ReadOnlyArray<Directive>, // TODO: Not in spec
}

// Functions

declare type Function =
  | NormalFunction
  | ArrowFunctionExpression
  | ObjectMethod
  | ClassMethod

declare type NormalFunction = FunctionDeclaration | FunctionExpression

declare type BodilessFunctionOrMethodBase = HasDecorators & {
  // TODO: Remove this. Should not assign "id" to methods.
  // https://github.com/babel/babylon/issues/535
  id: ?Identifier,

  params: $ReadOnlyArray<Pattern | TSParameterProperty>,
  body: BlockStatement,
  generator: boolean,
  async: boolean,

  // TODO: All not in spec
  expression: boolean,
  typeParameters?: ?TypeParameterDeclarationBase,
  returnType?: ?TypeAnnotationBase,
}

declare type BodilessFunctionBase = BodilessFunctionOrMethodBase & {
  id: ?Identifier,
}

declare type FunctionBase = BodilessFunctionBase & {
  body: BlockStatement,
}

// Statements

declare type ExpressionStatement = NodeBase & {
  type: 'ExpressionStatement',
  expression: Expression,
}

declare type BlockStatement = NodeBase & {
  type: 'BlockStatement',
  body: Array<Statement>, // TODO: $ReadOnlyArray
  directives: $ReadOnlyArray<Directive>,
}

declare type EmptyStatement = NodeBase & {
  type: 'EmptyStatement',
}

declare type DebuggerStatement = NodeBase & {
  type: 'DebuggerStatement',
}

declare type WithStatement = NodeBase & {
  type: 'WithStatement',
  object: Expression,
  body: Statement,
}

declare type ReturnStatement = NodeBase & {
  type: 'ReturnStatement',
  argument: ?Expression,
}

declare type LabeledStatement = NodeBase & {
  type: 'LabeledStatement',
  label: Identifier,
  body: Statement,
}

declare type BreakStatement = NodeBase & {
  type: 'BreakStatement',
  label: ?Identifier,
}

declare type ContinueStatement = NodeBase & {
  type: 'ContinueStatement',
  label: ?Identifier,
}

// Choice

declare type IfStatement = NodeBase & {
  type: 'IfStatement',
  test: Expression,
  consequent: Statement,
  alternate: ?Statement,
}

declare type SwitchStatement = NodeBase & {
  type: 'SwitchStatement',
  discriminant: Expression,
  cases: $ReadOnlyArray<SwitchCase>,
}

declare type SwitchCase = NodeBase & {
  type: 'SwitchCase',
  test: ?Expression,
  consequent: $ReadOnlyArray<Statement>,
}

// Exceptions

declare type ThrowStatement = NodeBase & {
  type: 'ThrowStatement',
  argument: Expression,
}

declare type TryStatement = NodeBase & {
  type: 'TryStatement',
  block: BlockStatement,
  handler: CatchClause | null,
  finalizer: BlockStatement | null,

  guardedHandlers: $ReadOnlyArray<empty>, // TODO: Not in spec
}

declare type CatchClause = NodeBase & {
  type: 'CatchClause',
  param: Pattern,
  body: BlockStatement,
}

// Loops

declare type WhileStatement = NodeBase & {
  type: 'WhileStatement',
  test: Expression,
  body: Statement,
}

declare type DoWhileStatement = NodeBase & {
  type: 'DoWhileStatement',
  body: Statement,
  test: Expression,
}

declare type ForLike = ForStatement | ForInOf

declare type ForStatement = NodeBase & {
  type: 'ForStatement',
  init: ?(VariableDeclaration | Expression),
  test: ?Expression,
  update: ?Expression,
  body: Statement,
}

declare type ForInOf = ForInStatement | ForOfStatement

declare type ForInOfBase = NodeBase & {
  type: 'ForInStatement',
  left: VariableDeclaration | Expression,
  right: Expression,
  body: Statement,
}

declare type ForInStatement = ForInOfBase & {
  type: 'ForInStatement',
  // TODO: Shouldn't be here, but have to declare it because it's assigned to a ForInOf unconditionally.
  await: boolean,
}

declare type ForOfStatement = ForInOfBase & {
  type: 'ForOfStatement',
  await: boolean,
}

// Declarations

declare type OptFunctionDeclaration = FunctionBase &
  DeclarationBase & {
    type: 'FunctionDeclaration',
  }

declare type FunctionDeclaration = OptFunctionDeclaration & {
  id: Identifier,
}

declare type VariableDeclaration = DeclarationBase &
  HasDecorators & {
    type: 'VariableDeclaration',
    declarations: $ReadOnlyArray<VariableDeclarator>,
    kind: 'var' | 'let' | 'const',
  }

declare type VariableDeclarator = NodeBase & {
  type: 'VariableDeclarator',
  id: Pattern,
  init: ?Expression,
}

// Misc

declare type Decorator = NodeBase & {
  type: 'Decorator',
  expression: Expression,
}

declare type Directive = NodeBase & {
  type: 'Directive',
  value: DirectiveLiteral,
}

declare type DirectiveLiteral = StringLiteral & { type: 'DirectiveLiteral' }

// Expressions

declare type Super = NodeBase & { type: 'Super' }

declare type Import = NodeBase & { type: 'Import' }

declare type ThisExpression = NodeBase & { type: 'ThisExpression' }

declare type ArrowFunctionExpression = FunctionBase & {
  type: 'ArrowFunctionExpression',
  body: BlockStatement | Expression,
}

declare type YieldExpression = NodeBase & {
  type: 'YieldExpression',
  argument: ?Expression,
  delegate: boolean,
}

declare type AwaitExpression = NodeBase & {
  type: 'AwaitExpression',
  argument: ?Expression,
}

declare type ArrayExpression = NodeBase & {
  type: 'ArrayExpression',
  elements: $ReadOnlyArray<?(Expression | SpreadElement)>,
}

declare type ObjectExpression = NodeBase & {
  type: 'ObjectExpression',
  properties: $ReadOnlyArray<ObjectProperty | ObjectMethod | SpreadElement>,
}

declare type ObjectOrClassMember = ClassMethod | ClassProperty | ObjectMember

declare type ObjectMember = ObjectProperty | ObjectMethod

declare type ObjectMemberBase = NodeBase & {
  key: Expression,
  computed: boolean,
  value: Expression,
  decorators: $ReadOnlyArray<Decorator>,
  kind?: 'get' | 'set' | 'method',
  method: boolean, // TODO: Not in spec

  variance?: ?FlowVariance, // TODO: Not in spec
}

declare type ObjectProperty = ObjectMemberBase & {
  type: 'ObjectProperty',
  shorthand: boolean,
}

declare type ObjectMethod = ObjectMemberBase &
  MethodBase & {
    type: 'ObjectMethod',
    kind: 'get' | 'set' | 'method', // Never "constructor"
  }

declare type FunctionExpression = MethodBase & {
  kind?: void, // never set
  type: 'FunctionExpression',
}

// Unary operations

declare type UnaryExpression = NodeBase & {
  type: 'UnaryExpression',
  operator: UnaryOperator,
  prefix: boolean,
  argument: Expression,
}

declare type UnaryOperator =
  | '-'
  | '+'
  | '!'
  | '~'
  | 'typeof'
  | 'void'
  | 'delete'
  | 'throw'

declare type UpdateExpression = NodeBase & {
  type: 'UpdateExpression',
  operator: UpdateOperator,
  argument: Expression,
  prefix: boolean,
}

declare type UpdateOperator = '++' | '--'

// Binary operations

declare type BinaryExpression = NodeBase & {
  type: 'BinaryExpression',
  operator: BinaryOperator,
  left: Expression,
  right: Expression,
}

declare type BinaryOperator =
  | '=='
  | '!='
  | '==='
  | '!=='
  | '<'
  | '<='
  | '>'
  | '>='
  | '<<'
  | '>>'
  | '>>>'
  | '+'
  | '-'
  | '*'
  | '/'
  | '%'
  | '|'
  | '^'
  | '&'
  | 'in'
  | 'instanceof'

declare type AssignmentExpression = NodeBase & {
  type: 'AssignmentExpression',
  operator: AssignmentOperator,
  left: Pattern | Expression,
  right: Expression,
}

declare type AssignmentOperator =
  | '='
  | '+='
  | '-='
  | '*='
  | '/='
  | '%='
  | '<<='
  | '>>='
  | '>>>='
  | '|='
  | '^='
  | '&='

declare type LogicalExpression = NodeBase & {
  type: 'LogicalExpression',
  operator: LogicalOperator,
  left: Expression,
  right: Expression,
}

declare type LogicalOperator = '||' | '&&'

declare type SpreadElement = NodeBase & {
  type: 'SpreadElement',
  argument: Expression,
}

declare type MemberExpression = NodeBase & {
  type: 'MemberExpression',
  object: Expression | Super,
  property: Expression,
  computed: boolean,
}

declare type BindExpression = NodeBase & {
  type: 'BindExpression',
  object: $ReadOnlyArray<?Expression>,
  callee: $ReadOnlyArray<Expression>,
}

declare type ConditionalExpression = NodeBase & {
  type: 'ConditionalExpression',
  test: Expression,
  alternate: Expression,
  consequent: Expression,
}

declare type CallOrNewBase = NodeBase & {
  callee: Expression | Super | Import,
  arguments: Array<Expression | SpreadElement>, // TODO: $ReadOnlyArray
  typeParameters?: ?TypeParameterInstantiationBase, // TODO: Not in spec
}

declare type CallExpression = CallOrNewBase & {
  type: 'CallExpression',
}

declare type NewExpression = CallOrNewBase & {
  type: 'NewExpression',
  optional?: boolean, // TODO: Not in spec
}

declare type SequenceExpression = NodeBase & {
  type: 'SequenceExpression',
  expressions: $ReadOnlyArray<Expression>,
}

// Template Literals

declare type TemplateLiteral = NodeBase & {
  type: 'TemplateLiteral',
  quasis: $ReadOnlyArray<TemplateElement>,
  expressions: $ReadOnlyArray<Expression>,
}

declare type TaggedTmplateExpression = NodeBase & {
  type: 'TaggedTemplateExpression',
  tag: Expression,
  quasi: TemplateLiteral,
}

declare type TemplateElement = NodeBase & {
  type: 'TemplateElement',
  tail: boolean,
  value: {
    cooked: string,
    raw: string,
  },
}

// Patterns

// TypeScript access modifiers
declare type Accessibility = 'public' | 'protected' | 'private'

declare type PatternBase = HasDecorators & {
  // TODO: All not in spec
  // Flow/TypeScript only:
  typeAnnotation?: ?TypeAnnotationBase,
}

declare type AssignmentProperty = ObjectProperty & {
  value: Pattern,
}

declare type ObjectPattern = PatternBase & {
  type: 'ObjectPattern',
  properties: $ReadOnlyArray<AssignmentProperty | RestElement>,
}

declare type ArrayPattern = PatternBase & {
  type: 'ArrayPattern',
  elements: $ReadOnlyArray<?Pattern>,
}

declare type RestElement = PatternBase & {
  type: 'RestElement',
  argument: Pattern,
}

declare type AssignmentPattern = PatternBase & {
  type: 'AssignmentPattern',
  left: Pattern,
  right: Expression,
}

// Classes

declare type Class = ClassDeclaration | ClassExpression

declare type ClassBase = HasDecorators & {
  id: ?Identifier,
  superClass: ?Expression,
  body: ClassBody,
  decorators: $ReadOnlyArray<Decorator>,

  // TODO: All not in spec
  typeParameters?: ?TypeParameterDeclarationBase,
  superTypeParameters?: ?TypeParameterInstantiationBase,
  implements?:
    | ?$ReadOnlyArray<TsExpressionWithTypeArguments>
    | $ReadOnlyArray<FlowClassImplements>,
}

declare type ClassBody = NodeBase & {
  type: 'ClassBody',
  body: Array<ClassMember | TsIndexSignature>, // TODO: $ReadOnlyArray
}

declare type ClassMemberBase = NodeBase &
  HasDecorators & {
    static: boolean,
    computed: boolean,
    // TypeScript only:
    accessibility?: ?Accessibility,
    abstract?: ?true,
    optional?: ?true,
  }

declare type ClassMember =
  | ClassMethod
  | ClassPrivateMethod
  | ClassProperty
  | ClassPrivateProperty

declare type MethodLike =
  | ObjectMethod
  | FunctionExpression
  | ClassMethod
  | ClassPrivateMethod
  | TSDeclareMethod

declare type MethodBase = FunctionBase & {
  +kind: MethodKind,
}

declare type MethodKind = 'constructor' | 'method' | 'get' | 'set'

declare type ClassMethodOrDeclareMethodCommon = ClassMemberBase & {
  key: Expression,
  kind: MethodKind,
  static: boolean,
  decorators: $ReadOnlyArray<Decorator>,
}

declare type ClassMethod = MethodBase &
  ClassMethodOrDeclareMethodCommon & {
    type: 'ClassMethod',
    variance?: ?FlowVariance, // TODO: Not in spec
  }

declare type ClassPrivateMethod = NodeBase &
  ClassMethodOrDeclareMethodCommon &
  MethodBase & {
    type: 'ClassPrivateMethod',
    key: PrivateName,
    computed: false,
  }

declare type ClassProperty = ClassMemberBase & {
  type: 'ClassProperty',
  key: Expression,
  value: ?Expression, // TODO: Not in spec that this is nullable.

  typeAnnotation?: ?TypeAnnotationBase, // TODO: Not in spec
  variance?: ?FlowVariance, // TODO: Not in spec

  // TypeScript only: (TODO: Not in spec)
  readonly?: true,
}

declare type ClassPrivateProperty = NodeBase & {
  type: 'ClassPrivateProperty',
  key: PrivateName,
  value: ?Expression, // TODO: Not in spec that this is nullable.
  static: boolean,
  computed: false,
}

declare type OptClassDeclaration = ClassBase &
  DeclarationBase &
  HasDecorators & {
    type: 'ClassDeclaration',
    // TypeScript only
    abstract?: ?true,
  }

declare type ClassDeclaration = OptClassDeclaration & {
  id: Identifier,
}

declare type ClassExpression = ClassBase & { type: 'ClassExpression' }

declare type MetaProperty = NodeBase & {
  type: 'MetaProperty',
  meta: Identifier,
  property: Identifier,
}

// Modules

declare type ModuleDeclaration = AnyImport | Anydeclare

declare type AnyImport = ImportDeclaration | TsImportEqualsDeclaration

declare type Anydeclare =
  | declareNamedDeclaration
  | declareDefaultDeclaration
  | declareAllDeclaration
  | TsdeclareAssignment

declare type ModuleSpecifier = NodeBase & {
  local: Identifier,
}

// Imports

declare type ImportDeclaration = NodeBase & {
  type: 'ImportDeclaration',
  // TODO: $ReadOnlyArray
  specifiers: Array<
    ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier
  >,
  source: Literal,

  importKind?: 'type' | 'typeof' | 'value', // TODO: Not in spec
}

declare type ImportSpecifier = ModuleSpecifier & {
  type: 'ImportSpecifier',
  imported: Identifier,
}

declare type ImportDefaultSpecifier = ModuleSpecifier & {
  type: 'ImportDefaultSpecifier',
}

declare type ImportNamespaceSpecifier = ModuleSpecifier & {
  type: 'ImportNamespaceSpecifier',
}

// declares

declare type declareNamedDeclaration = NodeBase & {
  type: 'declareNamedDeclaration',
  declaration: ?Declaration,
  specifiers: $ReadOnlyArray<declareSpecifier>,
  source: ?Literal,

  declareKind?: 'type' | 'value', // TODO: Not in spec
}

declare type declareSpecifier = NodeBase & {
  type: 'declareSpecifier',
  declareed: Identifier,
}

declare type declareDefaultDeclaration = NodeBase & {
  type: 'declareDefaultDeclaration',
  declaration:
    | OptFunctionDeclaration
    | OptTSDeclareFunction
    | OptClassDeclaration
    | Expression,
}

declare type declareAllDeclaration = NodeBase & {
  type: 'declareAllDeclaration',
  source: Literal,
  declareKind?: 'type' | 'value', // TODO: Not in spec
}

// JSX (TODO: Not in spec)

declare type JSXIdentifier = ASTNode
declare type JSXNamespacedName = ASTNode
declare type JSXMemberExpression = ASTNode
declare type JSXEmptyExpression = ASTNode
declare type JSXSpreadChild = ASTNode
declare type JSXExpressionContainer = ASTNode
declare type JSXAttribute = ASTNode
declare type JSXOpeningElement = ASTNode
declare type JSXClosingElement = ASTNode
declare type JSXElement = ASTNode
declare type JSXOpeningFragment = ASTNode
declare type JSXClosingFragment = ASTNode
declare type JSXFragment = ASTNode

// Flow/TypeScript common (TODO: Not in spec)

declare type TypeAnnotationBase = NodeBase & {
  typeAnnotation: ASTNode,
}

declare type TypeAnnotation = NodeBase & {
  type: 'TypeAnnotation',
  typeAnnotation: FlowTypeAnnotation,
}

declare type TsTypeAnnotation = NodeBase & {
  type: 'TSTypeAnnotation',
  typeAnnotation: TsType,
}

declare type TypeParameterDeclarationBase = NodeBase & {
  params: $ReadOnlyArray<TypeParameterBase>,
}

declare type TypeParameterDeclaration = TypeParameterDeclarationBase & {
  type: 'TypeParameterDeclaration',
  params: $ReadOnlyArray<TypeParameter>,
}

declare type TsTypeParameterDeclaration = TypeParameterDeclarationBase & {
  type: 'TsTypeParameterDeclaration',
  params: $ReadOnlyArray<TsTypeParameter>,
}

declare type TypeParameterBase = NodeBase & {
  name: string,
}

declare type TypeParameter = TypeParameterBase & {
  type: 'TypeParameter',
}

declare type TsTypeParameter = TypeParameterBase & {
  type: 'TSTypeParameter',
  constraint?: TsType,
  default?: TsType,
}

declare type TypeParameterInstantiationBase = NodeBase & {
  params: $ReadOnlyArray<ASTNode>,
}

declare type TypeParameterInstantiation = TypeParameterInstantiationBase & {
  type: 'TypeParameterInstantiation',
  params: $ReadOnlyArray<FlowType>,
}

declare type TsTypeParameterInstantiation = TypeParameterInstantiationBase & {
  type: 'TSTypeParameterInstantiation',
  params: $ReadOnlyArray<TsType>,
}

// Flow (TODO: Not in spec)

declare type TypeCastExpressionBase = NodeBase & {
  expression: Expression,
  typeAnnotation: TypeAnnotationBase,
}

declare type TypeCastExpression = NodeBase & {
  type: 'TypeCastExpression',
  expression: Expression,
  typeAnnotation: TypeAnnotation,
}

declare type TsTypeCastExpression = NodeBase & {
  type: 'TSTypeCastExpression',
  expression: Expression,
  typeAnnotation: TsTypeAnnotation,
}

declare type FlowType = ASTNode
declare type FlowPredicate = ASTNode
declare type FlowDeclare = ASTNode
declare type FlowDeclareClass = ASTNode
declare type FlowDeclaredeclareDeclaration = ASTNode
declare type FlowDeclareFunction = ASTNode
declare type FlowDeclareVariable = ASTNode
declare type FlowDeclareModule = ASTNode
declare type FlowDeclareModuledeclares = ASTNode
declare type FlowDeclareTypeAlias = ASTNode
declare type FlowDeclareOpaqueType = ASTNode
declare type FlowDeclareInterface = ASTNode
declare type FlowInterface = ASTNode
declare type FlowInterfaceExtends = ASTNode
declare type FlowTypeAlias = ASTNode
declare type FlowOpaqueType = ASTNode
declare type FlowObjectTypeIndexer = ASTNode
declare type FlowFunctionTypeAnnotation = ASTNode
declare type FlowObjectTypeProperty = ASTNode
declare type FlowObjectTypeSpreadProperty = ASTNode
declare type FlowObjectTypeCallProperty = ASTNode
declare type FlowObjectTypeAnnotation = ASTNode
declare type FlowQualifiedTypeIdentifier = ASTNode
declare type FlowGenericTypeAnnotation = ASTNode
declare type FlowTypeofTypeAnnotation = ASTNode
declare type FlowTupleTypeAnnotation = ASTNode
declare type FlowFunctionTypeParam = ASTNode
declare type FlowTypeAnnotation = ASTNode
declare type FlowVariance = ASTNode
declare type FlowClassImplements = ASTNode

// estree

declare type EstreeProperty = NodeBase & {
  type: 'Property',
  shorthand: boolean,
  key: Expression,
  computed: boolean,
  value: Expression,
  decorators: $ReadOnlyArray<Decorator>,
  kind?: 'get' | 'set' | 'init',

  variance?: ?FlowVariance,
}

// === === === ===
// TypeScript
// === === === ===

// Note: A type named `TsFoo` is based on TypeScript's `FooNode` type,
// defined in https://github.com/Microsoft/TypeScript/blob/master/src/compiler/types.ts
// Differences:
// * Change `NodeArray<T>` to just `$ReadOnlyArray<T>`.
// * Don't give nodes a "modifiers" list; use boolean flags instead,
//   and only allow modifiers that are not considered errors.
// * A property named `type` must be renamed to `typeAnnotation` to avoid conflict with the node's type.
// * Sometimes TypeScript allows to parse something which will be a grammar error later;
//   in babylon these cause exceptions, so the AST format is stricter.

// ================
// Misc
// ================

declare type TSParameterProperty = HasDecorators & {
  // Note: This has decorators instead of its parameter.
  type: 'TSParameterProperty',
  // At least one of `accessibility` or `readonly` must be set.
  accessibility?: ?Accessibility,
  readonly?: ?true,
  parameter: Identifier | AssignmentPattern,
}

declare type OptTSDeclareFunction = BodilessFunctionBase &
  DeclarationBase & {
    type: 'TSDeclareFunction',
  }

declare type TSDeclareFunction = OptTSDeclareFunction & {
  id: Identifier,
}

declare type TSDeclareMethod = BodilessFunctionOrMethodBase &
  ClassMethodOrDeclareMethodCommon & {
    type: 'TSDeclareMethod',
    +kind: MethodKind,
  }

declare type TsQualifiedName = NodeBase & {
  type: 'TSQualifiedName',
  left: TsEntityName,
  right: Identifier,
}

declare type TsEntityName = Identifier | TsQualifiedName

declare type TsSignatureDeclaration =
  | TsCallSignatureDeclaration
  | TsConstructSignatureDeclaration
  | TsMethodSignature
  | TsFunctionType
  | TsConstructorType

declare type TsSignatureDeclarationOrIndexSignatureBase = NodeBase & {
  // Not using TypeScript's "ParameterDeclaration" here, since it's inconsistent with regular functions.
  parameters: $ReadOnlyArray<Identifier | RestElement>,
  typeAnnotation: ?TsTypeAnnotation,
}

declare type TsSignatureDeclarationBase = TsSignatureDeclarationOrIndexSignatureBase & {
  typeParameters: ?TsTypeParameterDeclaration,
}

// ================
// TypeScript type members (for type literal / interface / class)
// ================

declare type TsTypeElement =
  | TsCallSignatureDeclaration
  | TsConstructSignatureDeclaration
  | TsPropertySignature
  | TsMethodSignature
  | TsIndexSignature

declare type TsCallSignatureDeclaration = TsSignatureDeclarationBase & {
  type: 'TSCallSignatureDeclaration',
}

declare type TsConstructSignatureDeclaration = TsSignatureDeclarationBase & {
  type: 'TSConstructSignature',
}

declare type TsNamedTypeElementBase = NodeBase & {
  // Not using TypeScript's `PropertyName` here since we don't have a `ComputedPropertyName` node type.
  // This is usually an Identifier but may be e.g. `Symbol.iterator` if `computed` is true.
  key: Expression,
  computed: boolean,
  optional?: true,
}

declare type TsPropertySignature = TsNamedTypeElementBase & {
  type: 'TSPropertySignature',
  readonly?: true,
  typeAnnotation?: TsTypeAnnotation,
  initializer?: Expression,
}

declare type TsMethodSignature = TsSignatureDeclarationBase &
  TsNamedTypeElementBase & {
    type: 'TSMethodSignature',
  }

// *Not* a ClassMemberBase: Can't have accessibility, can't be abstract, can't be optional.
declare type TsIndexSignature = TsSignatureDeclarationOrIndexSignatureBase & {
  readonly?: true,
  type: 'TSIndexSignature',
  // Note: parameters.length must be 1.
}

// ================
// TypeScript types
// ================

declare type TsType =
  | TsKeywordType
  | TsThisType
  | TsFunctionOrConstructorType
  | TsTypeReference
  | TsTypeQuery
  | TsTypeLiteral
  | TsArrayType
  | TsTupleType
  | TsUnionOrIntersectionType
  | TsParenthesizedType
  | TsTypeOperator
  | TsIndexedAccessType
  | TsMappedType
  | TsLiteralType
  // TODO: This probably shouldn't be included here.
  | TsTypePredicate

declare type TsTypeBase = NodeBase

declare type TsKeywordTypeType =
  | 'TSAnyKeyword'
  | 'TSNumberKeyword'
  | 'TSObjectKeyword'
  | 'TSBooleanKeyword'
  | 'TSStringKeyword'
  | 'TSSymbolKeyword'
  | 'TSVoidKeyword'
  | 'TSUndefinedKeyword'
  | 'TSNullKeyword'
  | 'TSNeverKeyword'
declare type TsKeywordType = TsTypeBase & {
  type: TsKeywordTypeType,
}

declare type TsThisType = TsTypeBase & {
  type: 'TSThisType',
}

declare type TsFunctionOrConstructorType = TsFunctionType | TsConstructorType

declare type TsFunctionType = TsTypeBase &
  TsSignatureDeclarationBase & {
    type: 'TSFunctionType',
    typeAnnotation: TypeAnnotation, // not optional
  }

declare type TsConstructorType = TsTypeBase &
  TsSignatureDeclarationBase & {
    type: 'TSConstructorType',
    typeAnnotation: TsTypeAnnotation,
  }

declare type TsTypeReference = TsTypeBase & {
  type: 'TSTypeReference',
  typeName: TsEntityName,
  typeParameters?: TsTypeParameterInstantiation,
}

declare type TsTypePredicate = TsTypeBase & {
  type: 'TSTypePredicate',
  parameterName: Identifier | TsThisType,
  typeAnnotation: TsTypeAnnotation,
}

// `typeof` operator
declare type TsTypeQuery = TsTypeBase & {
  type: 'TSTypeQuery',
  exprName: TsEntityName,
}

declare type TsTypeLiteral = TsTypeBase & {
  type: 'TSTypeLiteral',
  members: $ReadOnlyArray<TsTypeElement>,
}

declare type TsArrayType = TsTypeBase & {
  type: 'TSArrayType',
  elementType: TsType,
}

declare type TsTupleType = TsTypeBase & {
  type: 'TSTupleType',
  elementTypes: $ReadOnlyArray<TsType>,
}

declare type TsUnionOrIntersectionType = TsUnionType | TsIntersectionType

declare type TsUnionOrIntersectionTypeBase = TsTypeBase & {
  types: $ReadOnlyArray<TsType>,
}

declare type TsUnionType = TsUnionOrIntersectionTypeBase & {
  type: 'TSUnionType',
}

declare type TsIntersectionType = TsUnionOrIntersectionTypeBase & {
  type: 'TSIntersectionType',
}

declare type TsParenthesizedType = TsTypeBase & {
  type: 'TSParenthesizedType',
  typeAnnotation: TsType,
}

declare type TsTypeOperator = TsTypeBase & {
  type: 'TSTypeOperator',
  operator: 'keyof',
  typeAnnotation: TsType,
}

declare type TsIndexedAccessType = TsTypeBase & {
  type: 'TSIndexedAccessType',
  objectType: TsType,
  indexType: TsType,
}

declare type TsMappedType = TsTypeBase & {
  type: 'TSMappedType',
  readonly?: true,
  typeParameter: TsTypeParameter,
  optional?: true,
  typeAnnotation: ?TsType,
}

declare type TsLiteralType = TsTypeBase & {
  type: 'TSLiteralType',
  literal: NumericLiteral | StringLiteral | BooleanLiteral,
}

// ================
// TypeScript declarations
// ================

declare type TsInterfaceDeclaration = DeclarationBase & {
  type: 'TSInterfaceDeclaration',
  id: Identifier,
  typeParameters: ?TsTypeParameterDeclaration,
  // TS uses "heritageClauses", but want this to resemble ClassBase.
  extends?: $ReadOnlyArray<TsExpressionWithTypeArguments>,
  body: TSInterfaceBody,
}

declare type TSInterfaceBody = NodeBase & {
  type: 'TSInterfaceBody',
  body: $ReadOnlyArray<TsTypeElement>,
}

declare type TsExpressionWithTypeArguments = TsTypeBase & {
  type: 'TSExpressionWithTypeArguments',
  expression: TsEntityName,
  typeParameters?: TsTypeParameterInstantiation,
}

declare type TsTypeAliasDeclaration = DeclarationBase & {
  type: 'TSTypeAliasDeclaration',
  id: Identifier,
  typeParameters: ?TsTypeParameterDeclaration,
  typeAnnotation: TsType,
}

declare type TsEnumDeclaration = DeclarationBase & {
  type: 'TSEnumDeclaration',
  const?: true,
  id: Identifier,
  members: $ReadOnlyArray<TsEnumMember>,
}

declare type TsEnumMember = NodeBase & {
  type: 'TSEnumMemodulmber',
  id: Identifier | StringLiteral,
  initializer?: Expression,
}

declare type TsModuleDeclaration = DeclarationBase & {
  type: 'TSModuleDeclaration',
  global?: true, // In TypeScript, this is only available through `node.flags`.
  id: TsModuleName,
  body: TsNamespaceBody,
}

// `namespace A.B { }` is a namespace named `A` with another TsNamespaceDeclaration as its body.
declare type TsNamespaceBody = TsModuleBlock | TsNamespaceDeclaration

declare type TsModuleBlock = NodeBase & {
  type: 'TSModuleBlock',
  body: $ReadOnlyArray<Statement>,
}

declare type TsNamespaceDeclaration = TsModuleDeclaration & {
  id: Identifier,
  body: TsNamespaceBody,
}

declare type TsModuleName = Identifier | StringLiteral

declare type TsImportEqualsDeclaration = NodeBase & {
  type: 'TSImportEqualsDeclaration',
  isdeclare: boolean,
  id: Identifier,
  moduleReference: TsModuleReference,
}

declare type TsModuleReference = TsEntityName | TsExternalModuleReference

declare type TsExternalModuleReference = NodeBase & {
  type: 'TSExternalModuleReference',
  expression: StringLiteral,
}

// TypeScript's own parser uses declareAssignment for both `declare default` and `declare =`.
// But for babylon, `declare default` is an declareDefaultDeclaration,
// so a TsdeclareAssignment is always `declare =`.
declare type TsdeclareAssignment = NodeBase & {
  type: 'TSdeclareAssignment',
  expression: Expression,
}

declare type TsNamespacedeclareDeclaration = NodeBase & {
  type: 'TSNamespacedeclareDeclaration',
  id: Identifier,
}

// ================
// TypeScript expressions
// ================

declare type TsTypeAssertionLikeBase = NodeBase & {
  expression: Expression,
  typeAnnotation: TsType,
}

declare type TsAsExpression = TsTypeAssertionLikeBase & {
  type: 'TSAsExpression',
}

declare type TsTypeAssertion = TsTypeAssertionLikeBase & {
  type: 'TSTypeAssertion',
  typeAnnotation: TsType,
  expression: Expression,
}

declare type TsNonNullExpression = NodeBase & {
  type: 'TSNonNullExpression',
  expression: Expression,
}
