// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using MathNet.Numerics.Statistics;
using SimulationDAL;
using System.Xml.Linq;


namespace SimulationEngine
{
  public class OverallResults
  {
    [JsonProperty(Order = 1)]
    public string name;
    [JsonProperty(Order = 2)]
    public int numRuns = 0;
    [JsonProperty(Order = 3)]
    public List<KeyStateResult> keyStates = null;
    [JsonProperty(Order = 4)]
    public List<ResultState> otherStatePaths = null;
    public void CalcStats()
    {
      foreach(var i in keyStates)
      {
        i.CalcAllStats(numRuns);
      }
    }
  }

  public class KeyStateResult : ResultStateBase
  {
    [JsonIgnore]
    public Dictionary<string, ResultState> pathsLookup = new Dictionary<string, ResultState>();

    [JsonProperty(Order = 9999)] //last
    public List<ResultState> paths { get { return pathsLookup.Values.ToList(); } }

    public KeyStateResult(string name) : base(name, true) { }
    public void CalcAllStats(int keyStateCnt)
    {
      foreach(var i in this.paths)
      {
        i.CalcStats(this.count);

        if(i.name == this.name)
        {
          this._contributionCnt = i.contributionCnt;
        }
      }

      this.CalcStats(keyStateCnt);
    }

  }

  public class ResultState : ResultStateBase
  {
    [JsonProperty(Order = 9998)] //on the end
    public EnterExitCause[] entries { get { return enterDict.Values.ToArray(); } }
    [JsonProperty(Order = 9999)] //on the end
    public EnterExitCause[] exits { get { return exitDict.Values.ToArray(); } }

    public ResultState(string name, bool inKeyPath) : base(name, inKeyPath) { }
  }

  public class ResultStateBase
  {
    [JsonProperty(Order = 1)]
    public string name = "";
    [JsonProperty(Order = 2)]
    public double contributionRate { get { return _rate; } }
    [JsonProperty(Order = 3)]
    public double cRate5th { get { return _rate5th; } }
    [JsonProperty(Order = 4)]
    public double cRate95th { get { return _rate95th; } }
    [JsonProperty(Order = 5)]
    public int count { get { return _count; } }
    [JsonIgnore]
    public int contributionCnt { get { return _contributionCnt; } }

    [JsonIgnore]
    public List<TimeSpan> times { get { return _times; } }
    [JsonProperty(Order = 6)]
    public TimeSpan timeMean { get { return (_totalTime / count) + TimeSpan.FromDays(_extraDays / count); } }
    [JsonProperty(Order = 7)]
    public TimeSpan timeStdDeviation { get {return GetTimeStdDev(); } }
    [JsonProperty(Order = 8)]
    public TimeSpan timeMin { get {return _timeMin; } }
    [JsonProperty(Order = 9)]
    public TimeSpan timeMax { get {return _timeMax; } }
    
    [JsonProperty(Order = 10)]

    public Dictionary<string, List<string>> watchVariables = new Dictionary<string, List<string>>();
    [JsonIgnore]
    public Dictionary<string, EnterExitCause> enterDict { get; set; } = new Dictionary<string, EnterExitCause>(); //key will be from state, event, and action 
    [JsonIgnore]
    public Dictionary<string, EnterExitCause> exitDict { get; set; } = new Dictionary<string, EnterExitCause>(); //key will be from state, event, and action
    public EnterExitCause[] entries { get { return enterDict.Values.ToArray(); } }
    public EnterExitCause[] exits { get { return exitDict.Values.ToArray(); } }
    protected TimeSpan _totalTime = TimeSpan.Zero;
    private double _extraDays = 0.0;
    protected List<TimeSpan> _times = new List<TimeSpan>();
    protected int _count = 0;
    protected int _contributionCnt = 0;
    protected double _rate = 0;
    protected double _rate5th = 0;
    protected double _rate95th = 0;
    protected TimeSpan _timeMin = TimeSpan.FromSeconds(0);
    protected TimeSpan _timeMax = TimeSpan.FromSeconds(0);
    private bool statsDone = false;

    public ResultStateBase(string name, bool inKeyPath)
    {
      this.name = name;
      if (inKeyPath)
        _contributionCnt = 1;
    }

    public TimeSpan GetTimeStdDev()
    {
      if (_count <= 1)
        return TimeSpan.Zero;

      double mean = timeMean.TotalMinutes;
      //List<double> diffSq = new List<double>(); //difference squared
      double sumDiffSq = 0; //sum of difference squared;
      foreach(var t in this._times)
      {
        sumDiffSq += Math.Pow(((t.TotalMinutes) - mean), 2);
      }

      //calc variance   
      double variance = sumDiffSq / (count-1);
      double res = Math.Sqrt(variance); //return square root of variance

      return TimeSpan.FromMinutes(res);
    }

    public void AddTime(TimeSpan newTime)
    {
      if ((_count == 0) || (newTime < _timeMin))
        _timeMin = newTime;
      if (newTime > _timeMax)
        _timeMax = newTime;

      this._times.Add(newTime);
      try
      {
        if ((TimeSpan.MaxValue - this._totalTime) < newTime)
        {
          _extraDays += this._totalTime.Days;
          this._totalTime -= TimeSpan.FromDays(this._totalTime.Days);
        }

        this._totalTime += newTime;
      }
      catch
      {
        this._totalTime = TimeSpan.MaxValue;
      }
      ++_count;
    }  

    public void CalcStats(int totCnt)
    {
      _rate = (double)this.contributionCnt / totCnt;
      double range = 1.96 * Math.Sqrt((_rate * (1 - _rate)) / totCnt);
      _rate5th = Math.Round(_rate - range, 8);
      _rate95th = Math.Round(_rate + range, 8);
    }

    /// <summary>
    /// This is used to collapse in an item times to just one, using the mean. 
    /// </summary>
    public void Collapse()
    {
      TimeSpan newTime = this.timeMean;
      this._times.Clear();
      this._count = 0;
      this._rate = 0;
      this._rate5th = 0;
      this._rate95th = 0;
      this._totalTime = TimeSpan.FromSeconds(0);
      this._timeMin = TimeSpan.FromSeconds(0);
      this._timeMax = TimeSpan.FromSeconds(0);

      this.AddTime(newTime);
    }

    /// <summary>
    /// This pulls in the data from another ResultState, adding the mean time as a time and combining all the causes
    /// </summary>
    /// <param name="include"></param>
    public void Combine(ResultState include)
    {
      this.AddTime(include.timeMean);
      EnterExitCause curCause = null;
      this._contributionCnt += include.contributionCnt;
           
      foreach (var item in include.enterDict.Values)
      {
        if (!this.enterDict.TryGetValue(item.key, out curCause))
          this.enterDict.Add(item.key, item);
        else
          curCause.cnt += item.cnt;
      }

      foreach (var item in include.exitDict.Values)
      {
        if (!this.exitDict.TryGetValue(item.key, out curCause))
          this.exitDict.Add(item.key, item);
        else
        {
          curCause.cnt += item.cnt;
        }
      }
    }
  }

  public class EnterExitCause
  {
    [JsonIgnore]
    public string key = "";
    public string desc = ""; //Enter key of -  prevState.name + ", " + eventName + ", " + actionName;
                             //Enter key of -  eventName + ", " + actionName + ", " + nextState.name;
    public string name = ""; //eventName + " -> " + actionName
    public string evDesc = "";
    public string actDesc = "";
    public string otherState = ""; //too or from state 
    public int cnt = 0; //number of times this cause leads to parent state.

    public EnterExitCause(string otherState, SimulationDAL.Event ev, SimulationDAL.Action act, bool from)
    {
      string evName = "Immediate Action";
      if (ev!=null)
      {
        evName = ev.name;
        this.evDesc = ev.desc;
      }
      
      this.name = evName + " & " + act.name;
      this.desc = "Event [" + evName + "] occured and caused the action - " + act.name;
      
      this.actDesc = act.desc;
      this.otherState = otherState;
      if(from)
        this.key = otherState + "->" + this.name;
      else
        this.key = this.name + "->" + otherState;
    }
  }

}
