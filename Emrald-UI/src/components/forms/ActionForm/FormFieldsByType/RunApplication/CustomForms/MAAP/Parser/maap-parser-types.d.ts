import type {
  MAAPComment,
  MAAPExpressionType,
  MAAPIdentifier,
  MAAPLiteral,
  MAAPSourceElement,
  MAAPUserEvtElement,
} from '../../../../../../../../types/EMRALD_Model';

import type { LocationRange, ParserOptions } from 'peggy';

type WithComment<T> = {
  comment?: string;
} & T;

type WithVariable<T> = {
  useVariable?: boolean;
} & T;

interface Location {
  location?: LocationRange;
}

export type WrapperOptions = ParserOptions & {
  locations?: boolean;
  safeMode?: boolean;
};

export type Arguments = MAAPExpressionType[];

export interface Program {
  type: 'program';
  value: (MAAPSourceElement | MAAPComment)[];
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
