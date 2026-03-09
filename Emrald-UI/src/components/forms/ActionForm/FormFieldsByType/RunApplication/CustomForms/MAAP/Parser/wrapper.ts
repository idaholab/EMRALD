import type { parse } from './maap-inp-parser';
import type { MAAPInpParser } from './maap-parser-types';
import { MAAPToString } from './maap-to-string';
import { safeMode } from './safeMode';

/**
 * Wraps the parser with additional logic.
 *
 * @param parser - The parser to wrap.
 * @returns The wrapped parser.
 */
export function wrapper(parser: typeof parse) {
  const maapInpParser: MAAPInpParser = {
    options: {
      safeMode: true,
    },
    parse: (input, options) =>
      safeMode(parser, input, {
        ...maapInpParser.options,
        ...options,
      }),
    toString: input => new MAAPToString(input).output,
  };
  return maapInpParser;
}
