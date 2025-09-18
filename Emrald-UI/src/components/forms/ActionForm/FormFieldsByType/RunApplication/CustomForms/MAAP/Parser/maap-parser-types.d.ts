import type {
  MAAPExpressionType,
  MAAPIdentifier,
  MAAPLiteral,
  MAAPSourceElement,
  MAAPUserEvtElement,
} from '../../../../../../../../types/EMRALD_Model';

import type { ParserOptions } from 'peggy';

type WithComment<T> = {
  comment?: string;
} & T;

type WithVariable<T> = {
  useVariable?: boolean;
} & T;

export type WrapperOptions = ParserOptions & {
  safeMode?: boolean;
};

export type Arguments = MAAPExpressionType[];

export interface Program {
  type: 'program';
  value: MAAPSourceElement[];
  comments: [string[], string[]];
}

export interface MAAPInpParserOutput {
  errors: PEG.parser.SyntaxError[];
  input: string;
  output: Program;
}

export interface MAAPInpParser {
  options: WrapperOptions;
  parse(input: string, options?: WrapperOptions): MAAPInpParserOutput;
  toString(input: Program | MAAPUserEvtElement | MAAPLiteral | MAAPIdentifier): string;
}
