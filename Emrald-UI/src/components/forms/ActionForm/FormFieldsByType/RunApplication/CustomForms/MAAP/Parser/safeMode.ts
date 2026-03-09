import type { parser } from 'peggy';
import type { parse } from './maap-inp-parser';
import type { WrapperOptions } from './maap-parser-types';

/**
 * Attempts to avoid parsing errors by commenting out problematic lines and re-parsing.
 *
 * @param parser - The Peggy parser.
 * @param input - The input to parse.
 * @param options - Options passed to the parser.
 * @param errors - Running list of errors used for recursion.
 * @returns The best possible parsing of the input.
 */
export function safeMode(
  parser: typeof parse,
  input: string,
  options?: WrapperOptions,
  errors: parser.SyntaxError[] = [],
) {
  try {
    return {
      errors,
      input,
      output: parser(input, options),
    };
  } catch (error) {
    const syntaxError = error as parser.SyntaxError;
    if (options?.safeMode === false) {
      throw error;
    } else {
      const inputLines = input.split('\n');
      const line = syntaxError.location.start.line - 1;
      inputLines[line] = `// ${inputLines[line] ?? ''}`;
      return safeMode(
        parser,
        inputLines.join('\n'),
        options,
        errors.concat(syntaxError),
      );
    }
  }
}
