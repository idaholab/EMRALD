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
    public List<ResultState> keyStates = null;
  }

  public class ResultState
  {
    public string name = "";
    public double rate { get { return _rate; } }
    public double rate5th { get { return _rate5th; } }
    public double rate95th { get { return _rate95th; } }
    public int count { get { return _count; } }
    
    public List<TimeSpan> times { get { return _times; } }
    public TimeSpan timeMean { get { return _totalTime / count; } }
    public TimeSpan timeStdDeviation { get {return GetTimeStdDev(); } } 
    public Dictionary<string, List<string>> watchVariables = new Dictionary<string, List<string>>();
    [JsonIgnore]
    public Dictionary<string, Cause> causeDict { get; set; } = new Dictionary<string, Cause>(); //key will be from state, event, and action 
    public Cause[] causes { get { return causeDict.Values.ToArray(); } }
    private TimeSpan _totalTime = TimeSpan.Zero;
    private List<TimeSpan> _times = new List<TimeSpan>();
    private int _count = 0;
    private double _rate = 0;
    private double _rate5th = 0;
    private double _rate95th = 0;

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
