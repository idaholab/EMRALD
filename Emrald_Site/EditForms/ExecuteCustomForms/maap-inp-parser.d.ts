declare module 'maap-inp-parser' {
  export type WrapperOptions = {
    safeMode?: boolean;
  };

  export type Literal = BooleanLiteral | NumericLiteral | TimerLiteral;

  export type NumericLiteral = {
    type: 'number';
    units?: string;
    value: number;
  };

  export type BooleanLiteral = {
    type: 'boolean';
    value: boolean;
  };

  export type Identifier = {
    type: 'identifier';
    value: string;
  };

  export type Parameter = {
    flag?: BooleanLiteral;
    index: number;
    type: 'parameter';
    value: string;
  };

  export type TimerLiteral = {
    type: 'timer';
    value: number;
  };

  export type ExpressionMember = Literal | Identifier;

  export type Arguments = ExpressionType[];

  export type CallExpression = {
    arguments: Arguments;
    type: 'call_expression';
    value: Identifier;
  };

  export type ExpressionOperator =
    | '**'
    | '*'
    | '/'
    | '>='
    | '<='
    | '>'
    | '<'
    | '+'
    | '-';

  export type PureExpression = {
    type: 'expression';
    value: {
      left: ExpressionType;
      op: ExpressionOperator;
      right: PureExpression | ExpressionType;
    };
  };

  export type ExpressionBlock = {
    type: 'expression_block';
    value: PureExpression;
  };

  export type ExpressionType =
    | CallExpression
    | ExpressionBlock
    | ExpressionMember;

  export type Assignment = {
    target: CallExpression | Identifier;
    type: 'assignment';
    value: Expression;
  };

  export type IsExpression = {
    target: CallExpression | Identifier;
    type: 'is_expression';
    value: Expression;
  };

  export type AsExpression = {
    target: CallExpression | Identifier;
    type: 'as_expression';
    value: Identifier;
  };

  export type Expression = IsExpression | PureExpression | ExpressionType;

  export type Variable = CallExpression | ExpressionMember;

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

  export type SensitivityStatement = {
    type: 'sensitivity';
    value: 'ON' | 'OFF';
  };

  export type TitleStatement = {
    type: 'title';
    value: string;
  };

  export type FileStatement = {
    fileType: 'PARAMETER FILE' | 'INCLUDE';
    type: 'file';
    value: string;
  };

  export type BlockStatement = {
    blockType: 'PARAMETER CHANGE' | 'INITIATORS';
    type: 'block';
    value: SourceElement[];
  };

  export type ConditionalBlockStatement = {
    blockType: 'WHEN' | 'IF';
    test: Expression;
    type: 'conditional_block';
    value: SourceElement[];
  };

  export type AliasStatement = {
    type: 'alias';
    value: AsExpression[];
  };

  export type PlotFilStatement = {
    n: number;
    type: 'plotfil';
    value: (CallExpression | ExpressionMember)[][];
  };

  export type UserEvtStatement = {
    type: 'user_evt';
    value: UserEvtElement[];
  };

  export type UserEvtElement = Parameter | ActionStatement | SourceElement;

  export type ActionStatement = {
    index: number;
    type: 'action';
    value: UserEvtElement[];
  };

  export type FunctionStatement = {
    name: Identifier;
    type: 'function';
    value: Expression;
  };

  export type TimerStatement = {
    type: 'set_timer';
    value: TimerLiteral;
  };

  export type LookupStatement = {
    name: Variable;
    type: 'lookup_variable';
    value: string[];
  };

  export type Program = {
    type: 'program';
    value: SourceElement[];
  };

  export type SourceElement = Statement | Assignment | AsExpression | Expression;

  export type MAAPInpParserOutput = {
    errors: PEG.parser.SyntaxError[];
    input: string;
    output: Program;
  };

  export type MAAPInpParser = {
    options: WrapperOptions;
    parse(input: string, options?: WrapperOptions): MAAPInpParserOutput;
    toString(input: Program): string;
  };
}
