import { MAAPInpParser } from 'maap-inp-parser';
import type { Parser } from 'peggy';
import safeMode from './safeMode';
import toString from './toString';

/**
 * Wraps the parser with additional logic.
 *
 * @param parser - The parser to wrap.
 * @returns The wrapped parser.
 */
export default function wrapper(parser: Parser): MAAPInpParser {
  const maapInpParser: MAAPInpParser = {
    options: {
      locations: false,
      safeMode: true,
    },
    parse: (input, options) =>
      safeMode(parser, input, {
        ...maapInpParser.options,
        ...options,
      }),
    toString: (input) => toString(input),
  };
  return maapInpParser;
}
