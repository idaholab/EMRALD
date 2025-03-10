declare module 'maap-inp-parser' {
  import type { LocationRange, ParserOptions } from 'peggy';

  type Location = {
    location?: LocationRange;
  };

  export type WrapperOptions = ParserOptions & {
    locations?: boolean;
    safeMode?: boolean;
  };

  export type Literal = BooleanLiteral | NumericLiteral | TimerLiteral;

  export type NumericLiteral = Location & {
    type: 'number';
    units?: string;
    value: number;
  };

  export type BooleanLiteral = Location & {
    type: 'boolean';
    value: boolean;
  };

  export type Identifier = Location & {
    type: 'identifier';
    value: string;
  };

  export type ParameterName = Location & {
    type: 'parameter_name';
    value: string;
  };

  export type Parameter = Location & {
    flag?: BooleanLiteral;
    index: number;
    type: 'parameter';
    value: Expression | ParameterName;
  };

  export type TimerLiteral = Location & {
    type: 'timer';
    value: number;
  };

  export type Arguments = ExpressionType[];

  export type CallExpression = Location & {
    arguments: Arguments;
    type: 'call_expression';
    value: Identifier;
  };

  export type ExpressionOperator = '**' | '*' | '/' | '>=' | '<=' | '>' | '<' | '+' | '-';

  export type PureExpression = Location & {
    type: 'expression';
    value: {
      left: ExpressionType;
      op: ExpressionOperator;
      right: PureExpression | ExpressionType;
    };
  };

  export type ExpressionBlock = Location & {
    type: 'expression_block';
    value: PureExpression;
  };

  export type ExpressionType = CallExpression | ExpressionBlock | Variable;

  export type Assignment = Location & {
    target: CallExpression | Identifier;
    type: 'assignment';
    value: Expression;
  };

  export type IsExpression = Location & {
    target: Variable;
    type: 'is_expression';
    value: Expression;
  };

  export type AsExpression = Location & {
    target: Variable;
    type: 'as_expression';
    value: Identifier;
  };

  export type Expression = IsExpression | PureExpression | ExpressionType;

  export type Variable = CallExpression | Literal | ParameterName | Identifier;

  export type Statement =
    | SensitivityStatement
    | TitleStatement
    | FileStatement
    | BlockStatement
    | ConditionalBlockStatement
    | AliasStatement
    | PlotFilStatement
    | UserEvtStatement
    | FunctionStatement
    | TimerStatement
    | LookupStatement;

  export type SensitivityStatement = Location & {
    type: 'sensitivity';
    value: 'ON' | 'OFF';
  };

  export type TitleStatement = Location & {
    type: 'title';
    value?: string;
  };

  export type FileStatement = Location & {
    fileType: 'PARAMETER FILE' | 'INCLUDE';
    type: 'file';
    value: string;
  };

  export type BlockStatement = Location & {
    blockType: 'PARAMETER CHANGE' | 'INITIATORS';
    type: 'block';
    value: SourceElement[];
  };

  export type ConditionalBlockStatement = Location & {
    blockType: 'WHEN' | 'IF';
    test: Expression;
    type: 'conditional_block';
    value: SourceElement[];
    id?: string;
  };

  export type AliasStatement = Location & {
    type: 'alias';
    value: AsExpression[];
  };

  export type PlotFilStatement = Location & {
    n: number;
    type: 'plotfil';
    value: Variable[][];
  };

  export type UserEvtStatement = Location & {
    type: 'user_evt';
    value: UserEvtElement[];
  };

  export type UserEvtElement = Parameter | ActionStatement | SourceElement;

  export type ActionStatement = Location & {
    index: number;
    type: 'action';
    value: UserEvtElement[];
  };

  export type FunctionStatement = Location & {
    name: Identifier;
    type: 'function';
    value: Expression;
  };

  export type TimerStatement = Location & {
    type: 'set_timer';
    value: TimerLiteral;
  };

  export type LookupStatement = Location & {
    name: Variable;
    type: 'lookup_variable';
    value: string[];
  };

  export type Comment = {
    type: 'comment';
    value: string;
  };

  export type Program = {
    type: 'program';
    value: (SourceElement | Comment)[];
  };

  export type SourceElement =
    | Statement
    | Assignment
    | AsExpression
    | IsExpression
    | Expression
    | CallExpression
    | ExpressionBlock
    | ParameterName
    | Literal
    | Identifier
    | Comment;

  export type MAAPInpParserOutput = {
    errors: PEG.parser.SyntaxError[];
    input: string;
    output: Program;
  };

  export type MAAPInpParser = {
    options: WrapperOptions;
    parse(input: string, options?: WrapperOptions): MAAPInpParserOutput;
    toString(input: Program | UserEvtElement | Literal | Identifier): string;
  };
}
