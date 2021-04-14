// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace SimulationEngine
{
  public class OverallResults
  {
    public string name;
    public int numRuns = 0;
    public List<ResultState> keyStates = null;
  }

  public class ResultState
  {
    public string name = "";
    public double rate = 0;
    public double rate5th = 0;
    public double rate95th = 0;
    public int count = 0;
    public List<TimeSpan> times = new List<TimeSpan>();
    public TimeSpan timeMean = new TimeSpan();
    public TimeSpan timeStdDeviation = new TimeSpan();
    public Dictionary<string, List<string>> watchVariables = new Dictionary<string, List<string>>();
    [JsonIgnore]
    public Dictionary<string, Cause> causeDict { get; set; } = new Dictionary<string, Cause>(); //key will be from state, event, and action 
    public Cause[] causes { get { return causeDict.Values.ToArray(); } }

    public ResultState(string name)
    {
      this.name = name;
    }
  }
  public class Cause
  {
    public string desc = "";
    public string name = "";
    public ResultState fromState = null;

    public Cause(string name, string desc = "", ResultState from = null)
    {
      this.name = name;
      this.desc = desc;
      this.fromState = from;
    }
  }
}
