// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.IO;
using MathNet.Numerics.Statistics;
using SimulationDAL;
using System.Xml.Linq;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Matrix.Xmpp.Disco;
using Newtonsoft.Json.Schema;
using System.Runtime.Intrinsics.X86;
using Newtonsoft.Json.Linq;

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

    public void MergeResults(OverallResults inclThese)
    {
      int totRuns = this.numRuns + inclThese.numRuns;
      
      //make dictionary for lookup
      Dictionary<string, KeyStateResult> inclDict = inclThese.keyStates.ToDictionary(row => row.name, row => row);
      
      //Matched items merged in from the incl
      List<string> merged = new List<string>();

      foreach (var keyState in this.keyStates)
      {
        if(inclDict.ContainsKey(keyState.name))
        {
          keyState.Merge(inclDict[keyState.name], totRuns);
          merged.Add(keyState.name);
        }
      }

      //remove the items merged
      foreach(var name in merged)
      {
        inclDict.Remove(name);
      }

      //add all incl items that didn't exist in the current results
      foreach(var item in inclDict.Values)
      {
        this.keyStates.Add(item);
      }


      //add all the other state paths
      //make dictionary for lookup
      Dictionary<string, ResultState> otherInclDict = inclThese.otherStatePaths.ToDictionary(row => row.name, row => row);

      //Matched items merged in from the incl
      merged = new List<string>();

      foreach (var s in this.otherStatePaths)
      {
        if (otherInclDict.ContainsKey(s.name))
        {
          s.Merge(otherInclDict[s.name], totRuns);
          merged.Add(s.name);
        }
      }

      //remove the items merged
      foreach (var name in merged)
      {
        otherInclDict.Remove(name);
      }

      //add all incl items that didn't exist in the current results
      foreach (var item in otherInclDict.Values)
      {
        this.otherStatePaths.Add(item);
      }

    }

    public static string CombineResultFiles(string mergePath1, string mergePath2, string destPath = "")
    {
      if (!File.Exists(mergePath1) || !File.Exists(mergePath2))
      {
        return "";
      }


      OverallResults r1 = JsonConvert.DeserializeObject<OverallResults>(File.ReadAllText(mergePath1));
      r1.CalcStats();

      OverallResults r2 = JsonConvert.DeserializeObject<OverallResults>(File.ReadAllText(mergePath2));
      r2.CalcStats();
      
      r1.MergeResults(r2);
      string combinedResStr = JsonConvert.SerializeObject(r1, Formatting.Indented);

      if (destPath != "")
      {
        if (File.Exists(destPath))
        {
          File.Delete(destPath);
        }
        File.WriteAllText(destPath, combinedResStr);
      }

      
      return combinedResStr;
    }

  }

  public class KeyStateResult : ResultStateBase
  {
    [JsonIgnore]
    public Dictionary<string, ResultState> pathsLookup = new Dictionary<string, ResultState>();

    [JsonProperty(Order = 9999)] //last
    //[JsonConverter(typeof(PathsConverter))]
    public List<ResultState> paths { get { return pathsLookup.Values.ToList(); } 
                                     set { pathsLookup = value.ToDictionary(x => x.name, x => x); } }

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

    /// <summary>
    /// update this key state reault item with the values from that state in the path list
    /// </summary>
    public void AssignResults()
    {
      if (pathsLookup.ContainsKey(this.name))
      {
        base.ShallowCopy(pathsLookup[this.name]);
      }
    }

    public override void Merge(ResultStateBase other, int totCnt)
    {
      base.Merge(other, totCnt);
      KeyStateResult otherKeyState = (KeyStateResult)other;
      Dictionary<string, ResultState> inclDict = otherKeyState.pathsLookup.ToDictionary(x=>x.Key, x=>x.Value);
      
      //merge all the path items
      List<string> merged = new List<string>();

      foreach (var state in this.pathsLookup)
      {
        if (inclDict.ContainsKey(state.Key))
        {
          state.Value.Merge(inclDict[state.Key], this.count);
          merged.Add(state.Key);
        }
      }

      
      //remove the items merged
      foreach (var name in merged)
      {
        inclDict.Remove(name);
      }

      //add all incl items that didn't exist in the current results
      foreach (var item in inclDict)
      {
        this.pathsLookup.Add(item.Key, item.Value);
      }
    }
  }

  //public class PathsConverter : JsonConverter
  //{
  //  public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
  //  {
  //    throw new NotImplementedException("Unnecessary because CanRead is false. The type will skip the converter.");
  //  }

  //  public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
  //  {
  //    if (reader.TokenType == JsonToken.Null)
  //    {
  //      return string.Empty;
  //    }
  //    else if (reader.TokenType == JsonToken.String)
  //    {
  //      return serializer.Deserialize(reader, objectType);
  //    }
  //    else
  //    {
  //      JObject obj = JObject.Load(reader);
  //      if (obj["paths"] != null)
  //        return obj["Code"].ToString();
  //      else
  //        return serializer.Deserialize(reader, objectType);
  //    }
  //  }

  //  public override bool CanWrite
  //  {
  //    get { return false; }
  //  }

  //  public override bool CanRead
  //  {
  //    get { return true; }
  //  }

  //  public override bool CanConvert(Type objectType)
  //  {
  //    if (objectType == typeof(List<ResultState>))
  //      return true;
  //    return false;
  //  }
  //}

  public class ResultState : ResultStateBase
  {
    [JsonProperty(Order = 9998)] //on the end
    public EnterExitCause[] entries 
    { 
      get { return enterDict.Values.ToArray(); }
      set { enterDict = value.ToDictionary(x => x.otherState + "->" + x.name, x => x); }
    }
    [JsonProperty(Order = 9999)] //on the end
    public EnterExitCause[] exits 
    { 
      get { return exitDict.Values.ToArray(); }
      set { exitDict = value.ToDictionary(x => x.name + "->" + x.otherState, x => x); }
    }

    public ResultState(string name, bool inKeyPath) : base(name, inKeyPath) { }
    
  }

  public class ResultStateBase
  {
    [JsonProperty(Order = 1)]
    public string name = "";
    [JsonProperty(Order = 2)]
    public double contributionRate { get { return _rate; } set { _rate = value; } }
    [JsonProperty(Order = 3)]
    public double cRate5th { get { return _rate5th; } set { _rate5th = value; } }
    [JsonProperty(Order = 4)]
    public double cRate95th { get { return _rate95th; } set { _rate95th = value; } }
    [JsonProperty(Order = 5)]
    public int count { get { return _count; } set { _count = value; } }
    [JsonIgnore]
    public int contributionCnt { get { return _contributionCnt; }}

    [JsonIgnore]
    public List<TimeSpan> times { get { return _times; } set { _times = value; } }
    [JsonProperty(Order = 6)]
    public TimeSpan timeMean { 
      get { return (_totalTime / count) + TimeSpan.FromDays(_extraDays / count); }
      set { _extraDays = value.TotalDays * count; } //just put all in extra days, easier.
    }
    [JsonProperty(Order = 7)]
    public TimeSpan timeStdDeviation 
    { 
      get { return GetTimeStdDev(); } 
      set { _stdDev = value; }
    }
    [JsonProperty(Order = 8)]
    public TimeSpan timeMin { get { return _timeMin; } set { _timeMin = value; } }
    [JsonProperty(Order = 9)]
    public TimeSpan timeMax { get { return _timeMax; } set { _timeMax = value; } }

    [JsonProperty(Order = 10)]

    public Dictionary<string, List<string>> watchVariables = new Dictionary<string, List<string>>();
    [JsonIgnore]
    public Dictionary<string, EnterExitCause> enterDict { get; set; } = new Dictionary<string, EnterExitCause>(); //key will be from state, event, and action 
    [JsonIgnore]
    public Dictionary<string, EnterExitCause> exitDict { get; set; } = new Dictionary<string, EnterExitCause>(); //key will be from state, event, and action
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
    protected TimeSpan? _stdDev = null;
    private bool _mergedResults = false;

    public ResultStateBase(string name, bool inKeyPath)
    {
      this.name = name;
      if (inKeyPath)
        _contributionCnt = 1;
    }

    public TimeSpan GetTimeStdDev()
    { 
      if(_stdDev == null)
      {
        if (_count <= 1)
          return TimeSpan.Zero;

        double mean = timeMean.TotalMinutes;
        double sumDiffSq = 0; //sum of difference squared;
        foreach (var t in this._times)
        {
          sumDiffSq += Math.Pow(((t.TotalMinutes) - mean), 2);
        }

        //calc variance   
        double variance = sumDiffSq / (count - 1);
        _stdDev = TimeSpan.FromMinutes(Math.Sqrt(variance)); //return square root of variance
      }
          
      return (TimeSpan)_stdDev;
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

      _stdDev = null;
    }

    public void CalcStats(int totCnt)
    {
      if((_rate != 0) && (_contributionCnt == 0)) //this was loaded through JSON object and we need to determine the contributionCnt
      {
        _contributionCnt = (int)Math.Round(totCnt * _rate);
      }

      _rate = (double)_contributionCnt / totCnt;
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

      //add the variables
      foreach (var v in include.watchVariables)
      {
        this.watchVariables[v.Key].Add(v.Value[0]);
      }
    }

    public void ShallowCopy(ResultStateBase toCopy)
    {
      watchVariables = toCopy.watchVariables;
      enterDict = toCopy.enterDict;
      exitDict = toCopy.exitDict;
      _totalTime = toCopy._totalTime;
      _extraDays = toCopy._extraDays;
      _times = toCopy._times;
      _count = toCopy._count;
      _contributionCnt = toCopy._contributionCnt;
      _rate = toCopy._rate;
      _rate5th = toCopy._rate5th;
      _rate95th = toCopy._rate95th;
      _timeMin = toCopy._timeMin;
      _timeMax = toCopy._timeMax;
    }

    public virtual void Merge(ResultStateBase other, int totCnt)
    {
      _mergedResults = true;
      _totalTime += other._totalTime;
      _extraDays += other._extraDays;
      _count += other._count;
      _contributionCnt += other._contributionCnt;

      //estimate the standard deviation for combination of 2 
      double sum = (((_contributionCnt / this._rate)-1) * Math.Pow(((TimeSpan)_stdDev).TotalMinutes, 2));
      sum += (((_contributionCnt / other._rate) - 1) * Math.Pow(((TimeSpan)other._stdDev).TotalMinutes, 2));
      double res = Math.Sqrt(sum / ((_contributionCnt / this._rate) + (other._contributionCnt / other._rate) - 2));


      _rate = (double)_contributionCnt / totCnt;
      double range = 1.96 * Math.Sqrt((_rate * (1 - _rate)) / totCnt);
      _rate5th = Math.Round(_rate - range, 8);
      _rate95th = Math.Round(_rate + range, 8);
      _timeMin = _timeMin <= other._timeMin ? _timeMin : other._timeMin;
      _timeMax = _timeMax >= other._timeMax ? _timeMax : other._timeMax;

      foreach(var i in other.watchVariables)
      {
        if (this.watchVariables.ContainsKey(i.Key))
        {
          this.watchVariables[i.Key].AddRange(i.Value);
        }
        else
        {
          this.watchVariables.Add(i.Key, i.Value);
        }
      }

      EnterExitCause curCause = null;
      foreach (var item in other.enterDict)
      {
        if (!this.enterDict.TryGetValue(item.Key, out curCause))
          this.enterDict.Add(item.Key, item.Value);
        else
          curCause.cnt += item.Value.cnt;
      }

      foreach (var item in other.exitDict)
      {
        if (!this.exitDict.TryGetValue(item.Key, out curCause))
          this.exitDict.Add(item.Key, item.Value);
        else
        {
          curCause.cnt += item.Value.cnt;
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

    public EnterExitCause() { }
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
