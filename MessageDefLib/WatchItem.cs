// Copyright 2026 Battelle Energy Alliance
// Defines the "watch item" structure sent in the WebSocket CreateConnection request so an external
// simulation knows which variables EMRALD wants reported and, optionally, the fParser expression
// that must be true before a value is sent back.

using Newtonsoft.Json;

namespace MessageDefLib
{
  /// <summary>
  /// One variable EMRALD asks an external simulation to watch.
  /// </summary>
  public class WatchItem
  {
    public WatchItem() { }

    public WatchItem(string name, string type, string watchEventCriteria = null)
    {
      this.name = name;
      this.type = type;
      this.WatchEventCriteria = watchEventCriteria;
    }

    /// <summary>Name or id of the variable in the external simulation (matches ItemData.nameId).</summary>
    public string name { get; set; }

    /// <summary>The variable's EMRALD type ("double", "int", "bool", "string", ...).</summary>
    public string type { get; set; }

    /// <summary>
    /// Optional fParser boolean expression, e.g. "(valve_12 &gt; 5) &amp; (valve_12 &lt; 10)". When set, the
    /// external simulation should only report this variable while the expression evaluates true
    /// (cuts down callback chatter). When null/empty, report on every change.
    /// </summary>
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public string WatchEventCriteria { get; set; }
  }
}
