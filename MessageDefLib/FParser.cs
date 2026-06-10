// Copyright 2026 Battelle Energy Alliance
// Minimal fParser-style boolean/arithmetic expression parser shared by EMRALD (to validate a
// variable's WatchEventCriteria when a model is loaded) and the WebSocket sample server (to
// evaluate it). Keeping one implementation means "valid" and "evaluatable" stay in sync.
//
// Supported grammar (lowest to highest precedence):
//   expression := or
//   or         := and ( ("|" | "||") and )*
//   and        := comparison ( ("&" | "&&") comparison )*
//   comparison := additive ( ("="|"=="|"!="|"<="|">="|"<"|">") additive )?
//   additive   := multiplicative ( ("+"|"-") multiplicative )*
//   multiplic. := unary ( ("*"|"/") unary )*
//   unary      := ("+"|"-")? primary
//   primary    := number | identifier | "(" expression ")"
// (Functions and the power operator are intentionally not supported.)

using System;
using System.Collections.Generic;
using System.Globalization;

namespace MessageDefLib
{
  public static class FParser
  {
    /// <summary>
    /// Evaluate an expression. <paramref name="resolve"/> maps an identifier to its value and may
    /// throw for unknown identifiers. Throws <see cref="FormatException"/> on a syntax error.
    /// </summary>
    public static double Evaluate(string expr, Func<string, double> resolve)
    {
      var parser = new Parser(expr ?? string.Empty, resolve);
      double result = parser.ParseExpression();
      parser.ExpectEnd();
      return result;
    }

    /// <summary>
    /// Validate an expression's syntax and, when <paramref name="allowedVariables"/> is provided,
    /// that every identifier it references is in that set. A null/empty expression is valid.
    /// </summary>
    /// <param name="expr">The fParser expression.</param>
    /// <param name="allowedVariables">Allowed identifier names, or null to skip the identifier check.</param>
    /// <param name="error">On failure, a human-readable reason.</param>
    public static bool TryValidate(string expr, IEnumerable<string> allowedVariables, out string error)
    {
      if (string.IsNullOrWhiteSpace(expr))
      {
        error = null;
        return true;
      }

      HashSet<string> allowed = allowedVariables == null ? null : new HashSet<string>(allowedVariables);
      try
      {
        // Resolve to a dummy value so we only check syntax + identifier names, not runtime values.
        Evaluate(expr, name =>
        {
          if (allowed != null && !allowed.Contains(name))
            throw new FormatException("unknown variable '" + name + "'");
          return 1.0;
        });
        error = null;
        return true;
      }
      catch (Exception ex)
      {
        error = ex.Message;
        return false;
      }
    }

    private sealed class Parser
    {
      private readonly string _s;
      private readonly Func<string, double> _resolve;
      private int _pos;

      public Parser(string s, Func<string, double> resolve)
      {
        _s = s ?? string.Empty;
        _resolve = resolve;
      }

      public void ExpectEnd()
      {
        SkipWhitespace();
        if (_pos < _s.Length)
          throw new FormatException("unexpected '" + _s.Substring(_pos) + "'");
      }

      public double ParseExpression() => ParseOr();

      private double ParseOr()
      {
        double value = ParseAnd();
        while (true)
        {
          SkipWhitespace();
          if (Consume('|'))
          {
            Consume('|'); // allow "||"
            double right = ParseAnd();
            value = (value != 0.0 || right != 0.0) ? 1.0 : 0.0;
          }
          else
          {
            return value;
          }
        }
      }

      private double ParseAnd()
      {
        double value = ParseComparison();
        while (true)
        {
          SkipWhitespace();
          if (Consume('&'))
          {
            Consume('&'); // allow "&&"
            double right = ParseComparison();
            value = (value != 0.0 && right != 0.0) ? 1.0 : 0.0;
          }
          else
          {
            return value;
          }
        }
      }

      private double ParseComparison()
      {
        double left = ParseAdditive();
        string op = MatchComparisonOp();
        if (op == null)
          return left;

        double right = ParseAdditive();
        switch (op)
        {
          case "==": return left == right ? 1.0 : 0.0;
          case "!=": return left != right ? 1.0 : 0.0;
          case "<=": return left <= right ? 1.0 : 0.0;
          case ">=": return left >= right ? 1.0 : 0.0;
          case "<": return left < right ? 1.0 : 0.0;
          case ">": return left > right ? 1.0 : 0.0;
          default: throw new FormatException("unknown operator " + op);
        }
      }

      private double ParseAdditive()
      {
        double value = ParseMultiplicative();
        while (true)
        {
          SkipWhitespace();
          if (Consume('+')) value += ParseMultiplicative();
          else if (Consume('-')) value -= ParseMultiplicative();
          else return value;
        }
      }

      private double ParseMultiplicative()
      {
        double value = ParseUnary();
        while (true)
        {
          SkipWhitespace();
          if (Consume('*')) value *= ParseUnary();
          else if (Consume('/')) value /= ParseUnary();
          else return value;
        }
      }

      private double ParseUnary()
      {
        SkipWhitespace();
        if (Consume('-')) return -ParseUnary();
        if (Consume('+')) return ParseUnary();
        return ParsePrimary();
      }

      private double ParsePrimary()
      {
        SkipWhitespace();
        if (Consume('('))
        {
          double inner = ParseExpression();
          SkipWhitespace();
          if (!Consume(')'))
            throw new FormatException("missing ')'");
          return inner;
        }

        char c = Peek();
        if (char.IsDigit(c) || c == '.')
          return ParseNumber();

        if (char.IsLetter(c) || c == '_')
        {
          string ident = ParseIdentifier();
          if (ident == "true") return 1.0;
          if (ident == "false") return 0.0;
          return _resolve(ident);
        }

        if (c == '\0')
          throw new FormatException("unexpected end of expression");
        throw new FormatException("unexpected character '" + c + "'");
      }

      private double ParseNumber()
      {
        int start = _pos;
        while (_pos < _s.Length && (char.IsDigit(_s[_pos]) || _s[_pos] == '.'))
          _pos++;
        return double.Parse(_s.Substring(start, _pos - start), CultureInfo.InvariantCulture);
      }

      private string ParseIdentifier()
      {
        int start = _pos;
        while (_pos < _s.Length && (char.IsLetterOrDigit(_s[_pos]) || _s[_pos] == '_'))
          _pos++;
        return _s.Substring(start, _pos - start);
      }

      private string MatchComparisonOp()
      {
        SkipWhitespace();
        if (_pos + 1 < _s.Length)
        {
          string two = _s.Substring(_pos, 2);
          if (two == "==" || two == "!=" || two == "<=" || two == ">=")
          {
            _pos += 2;
            return two;
          }
        }
        if (_pos < _s.Length)
        {
          char c = _s[_pos];
          if (c == '=') { _pos++; return "=="; } // fParser uses single '=' for equality
          if (c == '<') { _pos++; return "<"; }
          if (c == '>') { _pos++; return ">"; }
        }
        return null;
      }

      private void SkipWhitespace()
      {
        while (_pos < _s.Length && char.IsWhiteSpace(_s[_pos]))
          _pos++;
      }

      private char Peek() => _pos < _s.Length ? _s[_pos] : '\0';

      private bool Consume(char c)
      {
        if (_pos < _s.Length && _s[_pos] == c)
        {
          _pos++;
          return true;
        }
        return false;
      }
    }
  }
}
