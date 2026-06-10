// Evaluates a watch item's WatchEventCriteria fParser expression so the server only sends a
// callback to EMRALD when the expression is true. The expression grammar/evaluation lives in the
// shared MessageDefLib.FParser so it stays in sync with EMRALD's load-time validation. A real
// external tool would hand the expression to its own fParser instead.

using System;
using MessageDefLib;

namespace WebSocketTestServer
{
    internal static class WatchEventCriteriaEvaluator
    {
        /// <summary>
        /// Evaluate a criteria expression. A null/empty expression means "no rule" and returns true
        /// (report on change). Unknown variables or unparseable expressions evaluate to false (don't
        /// report) rather than throwing, so a bad expression suppresses chatter instead of crashing.
        /// </summary>
        /// <param name="criteria">fParser expression, e.g. "(valve_12 > 5) &amp; (valve_12 &lt; 10)".</param>
        /// <param name="resolve">Resolves a variable name to its current numeric value.</param>
        public static bool Evaluate(string criteria, Func<string, double> resolve)
        {
            if (string.IsNullOrWhiteSpace(criteria))
                return true;

            try
            {
                return FParser.Evaluate(criteria, resolve) != 0.0;
            }
            catch
            {
                return false;
            }
        }
    }
}
