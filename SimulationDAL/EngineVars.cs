// Copyright 2026 Battelle Energy Alliance
// Central registry for engine-injected variables exposed to user scripts.

using System;
using System.Collections.Generic;
using System.Linq;
using ScriptEngineNS;

namespace SimulationDAL
{
  /// <summary>
  /// Variables the simulation engine injects into user scripts (their values are
  /// computed per iteration by the engine, not stored in the model). Each script-using
  /// class declares an <c>EngineVar[] AvailableEngineVars</c> for its context — not every
  /// engine var is meaningful in every context (e.g. ExeExitCode is only set after an
  /// external app runs).
  /// </summary>
  public enum EngineVar
  {
    CurTime,
    RunIdx,
    ExtSimStartTime,
    NextEvTime,
    ExeExitCode,
    ExePath,
    RootPath,
    OrigRootPath,
    MultiThreaded,
    Rand
  }

  public static class EngineVarRegistry
  {
    public sealed record VarInfo(string Name, Type DType);

    public static readonly IReadOnlyDictionary<EngineVar, VarInfo> All =
      new Dictionary<EngineVar, VarInfo>
      {
        [EngineVar.CurTime]         = new VarInfo("CurTime",         typeof(double)),
        [EngineVar.RunIdx]          = new VarInfo("RunIdx",          typeof(int)),
        [EngineVar.ExtSimStartTime] = new VarInfo("ExtSimStartTime", typeof(double)),
        [EngineVar.NextEvTime]      = new VarInfo("NextEvTime",      typeof(double)),
        [EngineVar.ExeExitCode]     = new VarInfo("ExeExitCode",     typeof(int)),
        [EngineVar.ExePath]         = new VarInfo("ExePath",         typeof(string)),
        [EngineVar.RootPath]        = new VarInfo("RootPath",        typeof(string)),
        [EngineVar.OrigRootPath]    = new VarInfo("OrigRootPath",    typeof(string)),
        [EngineVar.MultiThreaded]   = new VarInfo("MultiThreaded",   typeof(bool)),
        [EngineVar.Rand]            = new VarInfo("Rand",            typeof(Random)),
      };

    /// <summary>Every engine var name; useful for excluding from user-var lookups and for source scans.</summary>
    public static readonly HashSet<string> AllNames =
      new HashSet<string>(All.Values.Select(v => v.Name), StringComparer.Ordinal);
  }

  /// <summary>
  /// Per-iteration sim state read by <see cref="EngineVarBinder.Bind"/>. Callers populate
  /// only the fields relevant to their script context; others are left at default.
  /// </summary>
  public struct ScriptContext
  {
    public double CurTime;
    public int RunIdx;
    public double ExtSimStartTime;
    public double NextEvTime;
    public int ExeExitCode;
    public string ExePath;
    public string RootPath;
    public string OrigRootPath;
    public bool MultiThreaded;
    public Random Rand;
  }

  /// <summary>
  /// A user-defined SimVariable resolved once at compile time, with a flag for whether
  /// the script source actually references it. Skips per-call FindByName lookup, and the
  /// flag lets per-call code skip SetVariable for vars the script doesn't use.
  /// </summary>
  public struct ResolvedUserVar
  {
    public SimVariable simVar;
    public bool isUsed;
  }

  public static class EngineVarBinder
  {
    /// <summary>
    /// Binds engine vars to the script's ScriptEngine. An engine var is set only if it is
    /// listed in <paramref name="available"/> AND its name is in <paramref name="usedNames"/>.
    /// <see cref="EngineVar.RootPath"/> is the sole exception — when it's in
    /// <paramref name="available"/> it is set unconditionally, because the ScriptEngine
    /// source wrapper chdir's to it before running user code regardless of whether the
    /// user's script text mentions the name.
    /// </summary>
    public static void Bind(ScriptEngine engine, EngineVar[] available,
                            HashSet<string> usedNames, in ScriptContext ctx)
    {
      foreach (var v in available)
      {
        var info = EngineVarRegistry.All[v];
        bool always = v == EngineVar.RootPath;
        if (!always && !usedNames.Contains(info.Name)) continue;

        object val = v switch
        {
          EngineVar.CurTime         => ctx.CurTime,
          EngineVar.RunIdx          => ctx.RunIdx,
          EngineVar.ExtSimStartTime => ctx.ExtSimStartTime,
          EngineVar.NextEvTime      => ctx.NextEvTime,
          EngineVar.ExeExitCode     => ctx.ExeExitCode,
          EngineVar.ExePath         => ctx.ExePath,
          EngineVar.RootPath        => ctx.RootPath,
          EngineVar.OrigRootPath    => ctx.OrigRootPath,
          EngineVar.MultiThreaded   => ctx.MultiThreaded,
          EngineVar.Rand            => (object)ctx.Rand,
          _ => throw new InvalidOperationException("Unknown EngineVar: " + v)
        };
        engine.SetVariable(info.Name, info.DType, val);
      }
    }
  }
}
