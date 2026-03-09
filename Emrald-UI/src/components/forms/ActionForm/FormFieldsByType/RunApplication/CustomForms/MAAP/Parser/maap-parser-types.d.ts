import type { ParserOptions } from 'peggy';
import type { MAAPSourceElement } from '../../../../../../../../types/EMRALD_Model';

export type WrapperOptions = ParserOptions & {
  safeMode?: boolean;
};

export type InnerTitleStatement = {
  title: string;
  comments: string[];
};

export interface Program {
  type: 'program';
  value: MAAPSourceElement[];
  comments: [string[], string[]];
}

export interface MAAPInpParser {
  options: WrapperOptions;
  parse: (input: string, options?: WrapperOptions) => { output?: Program };
  toString: (input?: Program) => string;
}
