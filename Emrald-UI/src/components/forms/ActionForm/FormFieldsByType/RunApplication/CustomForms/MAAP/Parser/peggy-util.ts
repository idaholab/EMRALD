import type { Location, LocationRange, parser, SourceText } from 'peggy';

export type GrammarSource = {
  offset?: number | ((location: Location) => Location);
};

export class peg$SyntaxError extends SyntaxError {
  public expected: parser.Expectation[];
  public found: string | null;
  public location?: LocationRange;

  constructor(
    message: string,
    expected: parser.Expectation[],
    found: string | null,
    location?: LocationRange,
  ) {
    super(message);
    this.expected = expected;
    this.found = found;
    this.location = location;
    this.name = 'SyntaxError';
  }

  static buildMessage(expected: parser.Expectation[], found: string | null) {
    function hex(ch: string) {
      return ch.codePointAt(0)?.toString(16).toUpperCase();
    }

    const nonPrintable = Object.prototype.hasOwnProperty.call(
      RegExp.prototype,
      'unicode',
    )
      ? new RegExp(String.raw`[\p{C}\p{Mn}\p{Mc}]`, 'gu')
      : null;
    function unicodeEscape(s: string) {
      if (nonPrintable) {
        return s.replace(nonPrintable, ch => String.raw`\u{${hex(ch)}}`);
      }
      return s;
    }

    function literalEscape(s: string) {
      return unicodeEscape(
        s
          .replace(/\\/g, '\\\\')
          .replace(/"/g, String.raw`\"`)
          .replace(/\0/g, String.raw`\0`)
          .replace(/\t/g, String.raw`\t`)
          .replace(/\n/g, String.raw`\n`)
          .replace(/\r/g, String.raw`\r`)
          .replace(/[\u0000-\u000F]/g, ch => String.raw`\x0${hex(ch)}`)
          .replace(
            /[\u0010-\u001F\u007F-\u009F]/g,
            ch => String.raw`\x${hex(ch)}`,
          ),
      );
    }

    function classEscape(s: string) {
      return unicodeEscape(
        s
          .replace(/\\/g, '\\\\')
          .replace(/\]/g, String.raw`\]`)
          .replace(/\^/g, String.raw`\^`)
          .replace(/-/g, String.raw`\-`)
          .replace(/\0/g, String.raw`\0`)
          .replace(/\t/g, String.raw`\t`)
          .replace(/\n/g, String.raw`\n`)
          .replace(/\r/g, String.raw`\r`)
          .replace(/[\u0000-\u000F]/g, ch => String.raw`\x0${hex(ch)}`)
          .replace(
            /[\u0010-\u001F\u007F-\u009F]/g,
            ch => String.raw`\x${hex(ch)}`,
          ),
      );
    }

    const DESCRIBE_EXPECTATION_FNS = {
      literal(expectation: parser.LiteralExpectation) {
        return '"' + literalEscape(expectation.text) + '"';
      },

      class(expectation: parser.ClassExpectation) {
        const escapedParts = expectation.parts.map(part =>
          Array.isArray(part)
            ? classEscape(part[0] ?? '') + '-' + classEscape(part[1] ?? '')
            : classEscape(part),
        );

        return `[${expectation.inverted ? '^' : ''}${escapedParts.join('')}]`;
      },

      any(_: parser.AnyExpectation) {
        return 'any character';
      },

      end(_: parser.EndExpectation) {
        return 'end of input';
      },

      other(expectation: parser.OtherExpectation) {
        return expectation.description;
      },
    };

    function describeExpectation(expectation: parser.Expectation) {
      switch (expectation.type) {
        case 'any': {
          return DESCRIBE_EXPECTATION_FNS.any(expectation);
        }
        case 'class': {
          return DESCRIBE_EXPECTATION_FNS.class(expectation);
        }
        case 'end': {
          return DESCRIBE_EXPECTATION_FNS.end(expectation);
        }
        case 'literal': {
          return DESCRIBE_EXPECTATION_FNS.literal(expectation);
        }
        default: {
          return DESCRIBE_EXPECTATION_FNS.other(expectation);
        }
      }
    }

    function describeExpected(expected: parser.Expectation[]) {
      const descriptions = expected.map(element =>
        describeExpectation(element),
      );
      descriptions.sort();

      if (descriptions.length > 0) {
        let j = 1;
        for (let i = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i] ?? '';
            j++;
          }
        }
        descriptions.length = j;
      }

      switch (descriptions.length) {
        case 1: {
          return descriptions[0] ?? '';
        }

        case 2: {
          return `${descriptions[0] ?? ''} or ${descriptions[1] ?? ''}`;
        }

        default: {
          return `${descriptions.slice(0, -1).join(', ')}, or ${descriptions.at(-1) ?? ''}`;
        }
      }
    }

    function describeFound(found: string) {
      return found ? '"' + literalEscape(found) + '"' : 'end of input';
    }

    return `Expected ${describeExpected(expected)} but ${describeFound(found ?? '')} found.`;
  }

  format(sources: SourceText[]) {
    let str = 'Error: ' + this.message;
    if (this.location) {
      let src = null;
      const st = sources.find(s => s.source === this.location?.source);
      if (st) {
        src = st.text.split(/\r\n|\n|\r/g);
      }
      const s = this.location.start;
      const location_source = this.location.source as GrammarSource | undefined;
      const offset_s
        = location_source && typeof location_source.offset === 'function'
          ? location_source.offset(s)
          : s;
      const loc = `${offset_s.line.toString()}:${offset_s.column.toString()}`;
      if (src) {
        const e = this.location.end;
        const filler = ''.padEnd(offset_s.line.toString().length, ' ');
        const line = src[s.line - 1];
        const last = s.line === e.line ? e.column : (line?.length ?? 0) + 1;
        const hatLen = last - s.column || 1;
        str += `\n --> ${loc}\n${filler} |\n${offset_s.line.toString()} | ${line ?? ''}\n${filler} | ${''.padEnd(s.column - 1, ' ')}${''.padEnd(hatLen, '^')}`;
      } else {
        str += '\n at ' + loc;
      }
    }
    return str;
  }
}

export function peg$literalExpectation(
  text: string,
  ignoreCase: boolean,
): parser.LiteralExpectation {
  return { type: 'literal', text, ignoreCase };
}

export function peg$classExpectation(
  parts: (string | string[])[],
  inverted: boolean,
  ignoreCase: boolean,
  _: boolean,
): parser.ClassExpectation {
  return { type: 'class', parts, inverted, ignoreCase };
}

export function peg$anyExpectation(): parser.AnyExpectation {
  return { type: 'any' };
}

export function peg$endExpectation(): parser.EndExpectation {
  return { type: 'end' };
}

export type DetailsCache = { line: number; column: number }[];
