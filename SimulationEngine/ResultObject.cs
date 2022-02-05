// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using MathNet.Numerics.Statistics;


namespace SimulationEngine
{
  public class OverallResults
  {
    public string name;
    public int numRuns = 0;
    public List<KeyStateResult> keyStates = null;
    public List<ResultState> otherStatePaths = null;
  }

  public class KeyStateResult : ResultState
  {
    [JsonIgnore]
    public Dictionary<string, ResultState> pathsLookup = new Dictionary<string, ResultState>();
    
    public List<ResultState> paths { get { return pathsLookup.Values.ToList(); } }

    public KeyStateResult(string name) : base(name) { }

  }

  public class ResultState
  {
    public string name = "";
    public double rate { get { return _rate; } }
    public double rate5th { get { return _rate5th; } }
    public double rate95th { get { return _rate95th; } }
    public int count { get { return _count; } }

    [JsonIgnore]
    public List<TimeSpan> times { get { return _times; } }
    public TimeSpan timeMean { get { return _totalTime / count; } }
    public TimeSpan timeStdDeviation { get {return GetTimeStdDev(); } }
    public TimeSpan timeMin { get {return _timeMin; } }
    public TimeSpan timeMax { get {return _timeMax; } }

    public Dictionary<string, List<string>> watchVariables = new Dictionary<string, List<string>>();
    [JsonIgnore]
    public Dictionary<string, EnterExitCause> enterDict { get; set; } = new Dictionary<string, EnterExitCause>(); //key will be from state, event, and action 
    [JsonIgnore]
    public Dictionary<string, EnterExitCause> exitDict { get; set; } = new Dictionary<string, EnterExitCause>(); //key will be from state, event, and action
    public EnterExitCause[] entries { get { return enterDict.Values.ToArray(); } }
    public EnterExitCause[] exits { get { return exitDict.Values.ToArray(); } }
    private TimeSpan _totalTime = TimeSpan.Zero;
    private List<TimeSpan> _times = new List<TimeSpan>();
    private int _count = 0;
    private double _rate = 0;
    private double _rate5th = 0;
    private double _rate95th = 0;
    private TimeSpan _timeMin = TimeSpan.FromSeconds(0);
    private TimeSpan _timeMax = TimeSpan.FromSeconds(0);

    public ResultState(string name)
    {
      this.name = name;
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
      this._totalTime += newTime;      
      ++_count;
    }  

    public void CalcStats(int totCnt)
    {
      _rate = (double)this._count / totCnt;
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
           
      foreach (var item in include.enterDict.Values)
      {
        if (!this.enterDict.TryGetValue(item.desc, out curCause))
          this.enterDict.Add(item.desc, item);
        else 
          curCause.cnt += item.cnt;
      }

      foreach (var item in include.exitDict.Values)
      {
        if (!this.exitDict.TryGetValue(item.desc, out curCause))
          this.exitDict.Add(item.desc, item);
        else
          curCause.cnt += item.cnt;
      }
    }
  }

  public class EnterExitCause
  {
    public string desc = ""; //Enter key of -  prevState.name + ", " + eventName + ", " + actionName;
                             //Enter key of -  eventName + ", " + actionName + ", " + nextState.name;
    public string name = ""; //eventName + " -> " + actionName
    public string otherState = ""; //too or from state 
    public int cnt = 0; //number of times this cause leads to parent state.

    public EnterExitCause(string from, string name, string desc = "")
    {
      this.name = name;
      this.desc = desc;
      this.otherState = from;
    }
  }

}
