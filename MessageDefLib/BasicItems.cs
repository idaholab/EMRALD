// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Data.SqlClient;
//using System.Data.EntityClient;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;
using NLog;

namespace CommonDefLib
{
  public static class ConfigData
  {
    static public int? seed = null;
    static public LogLevel debugLev = LogLevel.Off;
    static public int? debugRunStart = null;
    static public int? debugRunEnd = null;
  }

  public class SingleRandom : Random
  {
    static SingleRandom _Instance;
    public static SingleRandom Instance
    {
      get
      {
        if (_Instance == null)
        {
          if(ConfigData.seed == null)
            _Instance = new SingleRandom();
          else
            _Instance = new SingleRandom((int)ConfigData.seed);
        }
        return _Instance;
      }
    }

    private SingleRandom() : base() { }
    private SingleRandom(int seed) : base(seed) { }
    public static void Reset()
    {
      _Instance = null;
    }
  }



  public static class JsonExtensions
  {
    public static JObject ReplacePath<T>(this JToken root, string path, T newValue)
    {
      if (root == null || path == null)
      {
        throw new ArgumentNullException();
      }

      foreach (var value in root.SelectTokens(path).ToList())
      {
        if (value == root)
        {
          if (value.Type == JTokenType.Object)
          {
            root = JToken.Parse(newValue.ToString());
          }
          else
          {
            root = JToken.FromObject(newValue);
          }
        }
        else
        {
          if (value.Type == JTokenType.Object)
          {
            value.Replace(JToken.Parse(newValue.ToString()));
          }
          else
          {
            value.Replace(JToken.FromObject(newValue));
          }          
        }
      }

      return (JObject)root;
    }
  }

}
