import { MAAPComment, MAAPSourceElement } from '../../../../../../../../types/EMRALD_Model';

import type { LocationRange, ParserOptions } from 'peggy';

type WithComment<T> = {
  comment?: string;
} & T;

type WithVariable<T> = {
  useVariable?: boolean;
} & T;

type Location = {
  location?: LocationRange;
};

export type WrapperOptions = ParserOptions & {
  locations?: boolean;
  safeMode?: boolean;
};

export type NumericLiteral = Location & {
  type: 'number';
  units?: string;
  value: number;
};

export type BooleanLiteral = Location & {
  type: 'boolean';
  value: boolean;
};

export type Identifier = WithVariable<
  Location & {
    type: 'identifier';
    value: string;
  }
>;

export type ParameterName = Location & {
  type: 'parameter_name';
  value: string;
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
export type PureExpression = WithVariable<
  Location & {
    type: 'expression';
    value: {
      left: ExpressionType;
      op: ExpressionOperator;
      right: PureExpression | ExpressionType;
    };
  }
>;

export type ExpressionBlock = Location & {
  type: 'expression_block';
  value: PureExpression;
};

export type IsExpression = WithVariable<
  Location & {
    target: Variable;
    type: 'is_expression';
    value: Expression;
  }
>;

export type AsExpression = Location & {
  target: Variable;
  type: 'as_expression';
  value: Identifier;
};
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
  value: MAAPSourceElement[];
};

export type ConditionalBlockStatement = Location & {
  blockType: 'WHEN' | 'IF';
  test: Expression;
  type: 'conditional_block';
  value: MAAPSourceElement[];
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

export type Program = {
  type: 'program';
  value: (MAAPSourceElement | MAAPComment)[];
};

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
