import { MAAPInpParserOutput, Program, WrapperOptions } from 'maap-inp-parser';

/**
 * Attempts to avoid parsing errors by commenting out problematic lines and re-parsing.
 *
 * @param parser - The Peggy parser.
 * @param input - The input to parse.
 * @param options - Options passed to the parser.
 * @param errors - Running list of errors used for recursion.
 * @returns The best possible parsing of the input.
 */
export default function safeMode(
  parser: (input: string, options?: WrapperOptions) => Program,
  input: string,
  options?: WrapperOptions,
  errors: PEG.parser.SyntaxError[] = [],
): MAAPInpParserOutput {
  try {
    const output = parser(input, options);
    if (!options?.locations) {
      /**
       * Removes the location data returned by Peggy.
       *
       * @param o - The object to clean.
       */
      const stripLocations = (o: any) => {
        if (o) {
          delete o.location;
        }
        if (typeof o === 'object') {
          Object.values(o).forEach((v) => stripLocations(v));
        }
      };
      stripLocations(output);
    }
    return {
      errors,
      input,
      output,
    };
  } catch (err) {
    const syntaxError = err as PEG.parser.SyntaxError;
    if (syntaxError.location && options?.safeMode !== false) {
      const inputLines = input.split('\n');
      const line = syntaxError.location.start.line - 1;
      inputLines[line] = `// ${inputLines[line]}`;
      return safeMode(parser, inputLines.join('\n'), options, errors.concat(syntaxError));
    } else {
      throw err;
    }
  }
}
