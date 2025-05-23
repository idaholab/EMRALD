import { MAAPInpParser, Program, WrapperOptions } from './maap-parser-types';
import safeMode from './safeMode';
import { MAAPToString } from './maap-to-string';

/**
 * Wraps the parser with additional logic.
 *
 * @param parser - The parser to wrap.
 * @returns The wrapped parser.
 */
export default function wrapper(
  parser: (input: string, options?: WrapperOptions) => Program,
): MAAPInpParser {
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
    toString: (input) => MAAPToString(input),
  };
  return maapInpParser;
}
