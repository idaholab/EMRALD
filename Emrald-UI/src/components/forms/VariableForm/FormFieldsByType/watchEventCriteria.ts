/**
 * Client-side validation for a gt3DSim variable's WatchEventCriteria fParser expression.
 *
 * Mirrors the grammar of the shared C# MessageDefLib.FParser (used for model-load validation and by
 * the WebSocket sample server), so the UI warns about the same expressions EMRALD would reject.
 *
 * Supported (lowest to highest precedence): boolean | || , boolean & && , comparisons
 * = == != <= >= < > , additive + - , multiplicative * / , unary + - , parentheses, numbers, and
 * identifiers. Functions and the power operator are not supported. Identifiers must be in the
 * allowed set (the current and other external-sim variable ids); true/false literals are allowed.
 */

export interface FParserValidationResult {
  valid: boolean;
  error?: string;
}

export function validateWatchEventCriteria(
  expression: string,
  allowedVariables: Set<string>,
): FParserValidationResult {
  if (!expression || expression.trim() === '') {
    return { valid: true };
  }
  try {
    const parser = new ExprParser(expression, allowedVariables);
    parser.parseExpression();
    parser.expectEnd();
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : String(error) };
  }
}

class ExprParser {
  private pos = 0;

  constructor(
    private readonly s: string,
    private readonly allowed: Set<string>,
  ) {}

  expectEnd() {
    this.skipWhitespace();
    if (this.pos < this.s.length) {
      throw new Error(`Unexpected "${this.s.slice(this.pos)}"`);
    }
  }

  parseExpression(): number {
    return this.parseOr();
  }

  private parseOr(): number {
    let value = this.parseAnd();
    for (;;) {
      this.skipWhitespace();
      if (this.consume('|')) {
        this.consume('|'); // allow "||"
        const right = this.parseAnd();
        value = value !== 0 || right !== 0 ? 1 : 0;
      } else {
        return value;
      }
    }
  }

  private parseAnd(): number {
    let value = this.parseComparison();
    for (;;) {
      this.skipWhitespace();
      if (this.consume('&')) {
        this.consume('&'); // allow "&&"
        const right = this.parseComparison();
        value = value !== 0 && right !== 0 ? 1 : 0;
      } else {
        return value;
      }
    }
  }

  private parseComparison(): number {
    const left = this.parseAdditive();
    const op = this.matchComparisonOp();
    if (!op) {
      return left;
    }
    const right = this.parseAdditive();
    switch (op) {
      case '==': {
        return left === right ? 1 : 0;
      }
      case '!=': {
        return left === right ? 0 : 1;
      }
      case '<=': {
        return left <= right ? 1 : 0;
      }
      case '>=': {
        return left >= right ? 1 : 0;
      }
      case '<': {
        return left < right ? 1 : 0;
      }
      case '>': {
        return left > right ? 1 : 0;
      }
      default: {
        throw new Error(`Unknown operator ${op}`);
      }
    }
  }

  private parseAdditive(): number {
    let value = this.parseMultiplicative();
    for (;;) {
      this.skipWhitespace();
      if (this.consume('+')) {
        value += this.parseMultiplicative();
      } else if (this.consume('-')) {
        value -= this.parseMultiplicative();
      } else {
        return value;
      }
    }
  }

  private parseMultiplicative(): number {
    let value = this.parseUnary();
    for (;;) {
      this.skipWhitespace();
      if (this.consume('*')) {
        value *= this.parseUnary();
      } else if (this.consume('/')) {
        value /= this.parseUnary();
      } else {
        return value;
      }
    }
  }

  private parseUnary(): number {
    this.skipWhitespace();
    if (this.consume('-')) {
      return -this.parseUnary();
    }
    if (this.consume('+')) {
      return this.parseUnary();
    }
    return this.parsePrimary();
  }

  private parsePrimary(): number {
    this.skipWhitespace();
    if (this.consume('(')) {
      const inner = this.parseExpression();
      this.skipWhitespace();
      if (!this.consume(')')) {
        throw new Error('Missing ")"');
      }
      return inner;
    }

    const c = this.peek();
    if (isDigit(c) || c === '.') {
      return this.parseNumber();
    }
    if (isLetter(c) || c === '_') {
      const ident = this.parseIdentifier();
      if (ident === 'true') {
        return 1;
      }
      if (ident === 'false') {
        return 0;
      }
      if (!this.allowed.has(ident)) {
        throw new Error(
          `Unknown variable "${ident}". Only the current and other external-sim (gt3DSim) variable ids may be used.`,
        );
      }
      return 1; // dummy value; we only validate syntax + identifiers
    }
    if (c === '') {
      throw new Error('Unexpected end of expression');
    }
    throw new Error(`Unexpected character "${c}"`);
  }

  private parseNumber(): number {
    const start = this.pos;
    while (this.pos < this.s.length && (isDigit(this.s[this.pos]) || this.s[this.pos] === '.')) {
      this.pos++;
    }
    const text = this.s.slice(start, this.pos);
    const value = Number(text);
    if (Number.isNaN(value)) {
      throw new TypeError(`Invalid number "${text}"`);
    }
    return value;
  }

  private parseIdentifier(): string {
    const start = this.pos;
    while (
      this.pos < this.s.length
      && (isLetter(this.s[this.pos]) || isDigit(this.s[this.pos]) || this.s[this.pos] === '_')
    ) {
      this.pos++;
    }
    return this.s.slice(start, this.pos);
  }

  private matchComparisonOp(): string | null {
    this.skipWhitespace();
    if (this.pos + 1 < this.s.length) {
      const two = this.s.slice(this.pos, this.pos + 2);
      if (two === '==' || two === '!=' || two === '<=' || two === '>=') {
        this.pos += 2;
        return two;
      }
    }
    const c = this.peek();
    if (c === '=') {
      this.pos++;
      return '=='; // fParser uses single "=" for equality
    }
    if (c === '<') {
      this.pos++;
      return '<';
    }
    if (c === '>') {
      this.pos++;
      return '>';
    }
    return null;
  }

  private skipWhitespace() {
    while (this.pos < this.s.length && /\s/.test(this.s[this.pos])) {
      this.pos++;
    }
  }

  private peek(): string {
    return this.pos < this.s.length ? this.s[this.pos] : '';
  }

  private consume(c: string): boolean {
    if (this.pos < this.s.length && this.s[this.pos] === c) {
      this.pos++;
      return true;
    }
    return false;
  }
}

function isDigit(c: string): boolean {
  return c >= '0' && c <= '9';
}

function isLetter(c: string): boolean {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}
