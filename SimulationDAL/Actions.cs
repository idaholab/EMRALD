// Copyright 2021 Battelle Energy Alliance
// Defines the Action base class and derived action types (transition, variable change, external message, etc.) for EMRALD states.

using System;
using System.CodeDom.Compiler;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection.Emit;
using System.Runtime.InteropServices;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Xml;
using MessageDefLib;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Scripting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema.Generation;
using ScriptEngineNS;

namespace SimulationDAL
{
  public abstract class Action : BaseObjInfo
  {
    protected EnActionType _actType = EnActionType.atTransition;
    public EnActionType actType { get { return _actType; } }
    public bool mainItem = false;

    public Action(string inName, EnActionType inActType, bool inMainItem = false)
    {
      this._actType = inActType;
      this._id = SingleNextIDs.Instance.NextID(EnIDTypes.itAction);
      this.name = inName;
      this.mainItem = inMainItem;
    }


    public abstract string GetDerivedJSON(EmraldModel lists);

    public override string GetJSON(bool incBrackets, EmraldModel lists)
    {
      string retStr = "";
      if (incBrackets)
      {
        retStr = "{";
      }
      retStr = retStr + "\"Action\": {" + Environment.NewLine + base.GetJSON(false, lists) + "," + Environment.NewLine;

      //add derived items
      retStr = retStr + "\"actType\": \"" + this.actType.ToString() + "\"," + Environment.NewLine;
      retStr = retStr + "\"mainItem\": \"" + this.mainItem.ToString() + "\"," + Environment.NewLine;

      retStr = retStr + GetDerivedJSON(lists);

      retStr = retStr + Environment.NewLine + "}";

      if (incBrackets)
      {
        retStr = retStr + Environment.NewLine + "}";
      }

      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Action == null)
          return false;

        dynObj = ((dynamic)obj).Action;
      }


      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      lists.allActions.Add(this, false);

      if (actType != (EnActionType)Enum.Parse(typeof(EnActionType), (string)dynObj.actType, true))
        throw new Exception("action types do not match, cannot change the type once an item is created!");

      if (dynObj.mainItem != null)
      {
        mainItem = Convert.ToBoolean(dynObj.mainItem);
      }

      return true;
    }

    public virtual void LookupRelatedItems(EmraldModel all, EmraldModel addToList)
    {
      if (addToList.allActions[this.id] != null)
      {
        return;
      }

      addToList.allActions.Add(this, false);
    }

    public virtual List<ScanForReturnItem> ScanFor(ScanForTypes scanType, string modelRootPath)
    {
      //override in the different types if it is possible that the item has something for the scanType 
      return new List<ScanForReturnItem>();
    }
  }


  public class TransitionAct : Action //atTransition
  {
    private List<State> _newStateIDs = new List<State>(); //possible states to travel to for this transition     
    private List<Double> _toStateProb = new List<double>();
    private List<SimVariable?> _toStateVarProb = new List<SimVariable?>();
    private List<string> _failDesc = new List<string>();
    protected bool mutExcl = true;

    private bool hasVarProbs = false;
    public List<string> failDesc { get { return _failDesc; } set { _failDesc = value; } }

    public bool mutuallyExclusive
    {
      get { return this.mutExcl; }
      set
      {
        this.mutExcl = value;
        NormalizeSingleNonMutExclRemainder();
      }
    }

    public TransitionAct()
      : base("", EnActionType.atTransition)
    { }

    public TransitionAct(string name)
      : base(name, EnActionType.atTransition)
    { }

    private void NormalizeSingleNonMutExclRemainder()
    {
      if (!mutExcl
          && _toStateProb.Count == 1
          && _toStateProb[0] == -1
          && ((_toStateVarProb.Count == 0) || (_toStateVarProb[0] == null)))
      {
        _toStateProb[0] = 1.0;
      }
    }

    public override string GetDerivedJSON(EmraldModel lists)
    {
      string retStr = "";
      retStr += "\"mutExcl\": \"" + this.mutExcl.ToString().ToLower() + "\"";
      retStr += "," + Environment.NewLine + "\"newStates\": [";

      for (int i = 0; i < this._newStateIDs.Count; ++i)
      {
        var varProb = this._toStateVarProb[i];   // cache once

        retStr += Environment.NewLine + "{\"toState\": \"" + this._newStateIDs[i].name + "\",";
        retStr += Environment.NewLine + "\"prob\":" + this._toStateProb[i].ToString() + ",";

        // use cached varProb safely
        retStr += Environment.NewLine + "\"varProb\": "
               + (varProb is null ? "null" : "\"" + varProb.name + "\"")
               + ",";

        retStr += Environment.NewLine + "\"failDesc\":\"" + this._failDesc[i] + "\"}";

        if (i < this._newStateIDs.Count - 1)
          retStr += "," + Environment.NewLine;
      }

      retStr += "]";
      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Action == null)
          return false;

        dynObj = ((dynamic)obj).Action;
      }

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      if(dynObj.mutExcl != null)
        mutuallyExclusive = Convert.ToBoolean(dynObj.mutExcl);

      lists.allActions.Add(this, false);

      processed = true;
      return true;
    }

    public override bool LoadObjLinks(object obj, bool wrapped, EmraldModel lists)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Action == null)
          return false;

        dynObj = ((dynamic)obj).Action;
      }

      //load the transition list
      if (dynObj.newStates != null)
      {
        _newStateIDs.Clear();
        _toStateProb.Clear();
        _toStateVarProb.Clear();

        foreach (dynamic curToObj in dynObj.newStates)
        {
          State curState = lists.allStates.FindByName((string)curToObj.toState);

          _newStateIDs.Add(curState);
          _toStateProb.Add(Convert.ToDouble(curToObj.prob));
          if (curToObj["varProb"] != null)
          {
            string varName = (String)curToObj.varProb;
            if ((varName != null) && (varName.ToUpper() != "NULL"))
            {
              _toStateVarProb.Add(lists.allVariables.FindByName(varName));
              hasVarProbs = true;
            }
            else
              _toStateVarProb.Add(null);
          }
          else
          {
            _toStateVarProb.Add(null);
          }

          _failDesc.Add((string)curToObj.failDesc);
        }

        NormalizeSingleNonMutExclRemainder();

        if ((_newStateIDs.Count < 1) || (_newStateIDs.Count != _toStateProb.Count))
        {
          throw new Exception("Either no \"to State\" for this Transition or missing one." );
        }

        double probSum = _toStateProb.Sum();
        if (mutExcl && ((probSum > 1.0) || ((probSum < 1.0) && (_toStateProb[_toStateProb.Count - 1] > 0))))
        {
          throw new Exception("Mutually exclusive transition probabilities don't add up to 1.0 or no default final value");

        }
        if(!mutExcl)
        {
          foreach(var val in _toStateProb)
          {
            if(((val > 1) || (val < 0)) && (val != -1))
            {
              throw new Exception("Non Mutually exclusive transition probabilities must be between 0 and 1 or a variable");
            }
          }
        }
      }

      return true;
    }

    public void AddToState(State toState, SimVariable varProb, string failDesc = "")
    {
      //use the remainder

      if (varProb == null)
        throw new Exception("Variable for the probability cannot be null");
      if (toState == null)
        throw new Exception("Null toState for action is not allowed - " + this.name);


      hasVarProbs = true;
      this._toStateProb.Insert(0, varProb.dblValue);
      this._toStateVarProb.Insert(0, varProb);
      this._newStateIDs.Insert(0, toState);
      this._failDesc.Insert(0, failDesc);


      //RecalcBoundBoxes();
    }

    public void AddToState(State toState, double prob = -1, string failDesc = "")
    {
      if (toState == null)
        throw new Exception("Null toState for action is not allowed - " + this.name);

      if (prob == -1) //use the remainder
      {
        //this._toStateProb.Add(1 - _toStateProb.Sum());
        this._toStateProb.Add(prob);
        this._toStateVarProb.Add(null);
        this._newStateIDs.Add(toState);
        this._failDesc.Add(failDesc);
      }
      else
      {
        this._toStateProb.Insert(0, prob);
        this._toStateVarProb.Insert(0, null);
        this._newStateIDs.Insert(0, toState);
        this._failDesc.Insert(0, failDesc);
      }

      NormalizeSingleNonMutExclRemainder();

      //RecalcBoundBoxes();
    }

    //_removedToStates
    public void RemoveToState(State toState)
    {
      if (this._newStateIDs.Contains(toState))
      {
        int idx = this._newStateIDs.IndexOf(toState);
        this._newStateIDs.RemoveAt(idx);
        this._toStateProb.RemoveAt(idx);
        this._toStateVarProb.RemoveAt(idx);
      }

      //RecalcBoundBoxes();
    }



    public List<IdxAndStr> WhichToState()
    {
      if (hasVarProbs)
      {
        for (int i = 0; i < _toStateVarProb.Count; ++i)
        {
          var varProb = _toStateVarProb[i];   // <-- read once

          if (varProb is null)
            continue;

          if (varProb.dblValue < 0.0)
            throw new Exception(
                $"{name} - Invalid variable value used for a transition % [{varProb.name}] = {varProb.dblValue}"
            );

          _toStateProb[i] = varProb.dblValue;
        }

      }

      NormalizeSingleNonMutExclRemainder();

      List<IdxAndStr> retStateIDs = new List<IdxAndStr> { };
      double probSum = _toStateProb.Sum();
      if (_toStateProb.Count == 0)
        throw new Exception(this.name + " has no _toSateProbs in list - no TO state added to the action.");
      else if (mutExcl && (probSum > 0) && (probSum < 1.0) && (_toStateProb[_toStateProb.Count - 1] > 0))
      {
        throw new Exception("For action " + this.name + " Mutually Exclusive Transition and probabilities don't add up to 1.0 or no default path");
      }
      
      else if ((_newStateIDs.Count < 1) || (_newStateIDs.Count != _toStateProb.Count))
      {
#if DEBUG
        throw new Exception("Either no \"to State\" for this Transition or miss. " + this.name);
#else
        System.Diagnostics.Debug.Write("No \"to State\" for this Transition is an error. " + this.name);
        return retStateIDs;
#endif
      }
      else if (mutExcl && ((_toStateProb[0] == 1.0) || (_toStateProb[0] == -1.0)))
      {
        retStateIDs.Add(new IdxAndStr(_newStateIDs[0].id, _failDesc[0]));
        return retStateIDs;
      }

      double randNum = SingleRandom.Instance.NextDouble();
      int slot = 0;
      double sum = 0.0;
      List<int> added = new List<int>();
      for (slot = 0; slot < _toStateProb.Count; ++slot)
      {
        if (mutExcl)//use the prev bound is the low
        {
          if (randNum <= _toStateProb[slot] + sum)
          {
            retStateIDs.Add(new IdxAndStr(_newStateIDs[slot].id, _failDesc[slot]));
            return retStateIDs;
          }

          sum += _toStateProb[slot];
        }
        else //use the bound (box - prob) as the low
        {
          randNum = SingleRandom.Instance.NextDouble();
          if ((randNum <= _toStateProb[slot]) &&
             (!added.Contains(_newStateIDs[slot].id))) //don't add a state more than once.
          {
            retStateIDs.Add(new IdxAndStr(_newStateIDs[slot].id, _failDesc[slot]));
            added.Add(_newStateIDs[slot].id);
          }
        }
      }

      //Only mutually exclusive transitions require a guaranteed default path (probabilities partition 1.0).
      //For non-mutually-exclusive transitions an empty result is valid - it means no new state was selected
      //(e.g. a single 0.5 target should transition only ~50% of the time, not fall through to a default).
      if (mutExcl && retStateIDs.Count == 0) //no probability items were selected we must use the default state
        retStateIDs.Add(new IdxAndStr(_newStateIDs[_toStateProb.Count - 1].id, _failDesc[_toStateProb.Count - 1]));

      return retStateIDs;
    }

    public override void LookupRelatedItems(EmraldModel all, EmraldModel addToList)
    {

      if (addToList.allActions.ContainsKey(this.id))
      {
        return;
      }

      addToList.allActions.Add(this, false);

      foreach (State curItem in this._newStateIDs)
      {
        curItem.LookupRelatedItems(all, addToList);
      }
    }
  }

  public abstract class ScriptAct : Action
  {
    protected ScriptEngine scriptRunner;
    protected List<String> codeVariables = new List<String>();
    protected bool compiled = false;
    protected Type _retType = typeof(double);
    public string scriptCode = "";

    // Names of engine vars actually referenced by scriptCode (populated at compile time).
    // Used by EngineVarBinder.Bind to gate per-call SetVariable.
    protected HashSet<string> engineVarsUsed = new HashSet<string>(StringComparer.Ordinal);

    // Compile-time resolved user vars (see SimulationDAL.ResolvedUserVar).
    protected List<ResolvedUserVar> resolvedUserVars = new List<ResolvedUserVar>();

    public ScriptAct(EnActionType actType)
      : base("", actType)
    {
      this.compiled = false;
      scriptRunner = new ScriptEngine(ScriptEngine.Languages.CSharp, "");
    }

    public ScriptAct(string inName, string inScriptCode, List<String> inCodeVars, EnActionType actType)
      : base(inName, actType)
    {
      this.compiled = false;
      if (inCodeVars != null)
        this.codeVariables = new List<String>(inCodeVars);
      this.scriptCode = inScriptCode;
      scriptRunner = new ScriptEngine(ScriptEngine.Languages.CSharp, scriptCode);
    }

    public override string GetDerivedJSON(EmraldModel lists)
    {
      string newScriptStr = scriptCode.Replace("\n", "\\n").Replace("\r", "\\r");

      string retStr = Environment.NewLine + "\"scriptCode\":" + "\"" + newScriptStr + "\"";

      if (codeVariables != null)
      {
        bool first = true;
        retStr = retStr + "," + Environment.NewLine + "\"codeVariables\":[";
        foreach (string varName in codeVariables)
        {
          if (first)
          {
            retStr = retStr + "\"" + varName + "\"";
            first = false;
          }
          else
          {
            retStr = retStr + ", \"" + varName + "\"";
          }
        }
        retStr = retStr + "]" + Environment.NewLine;
      }

      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Action == null)
          return false;

        dynObj = ((dynamic)obj).Action;
      }

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      lists.allActions.Add(this, false);

      scriptCode = (string)dynObj.scriptCode;

      processed = true;
      return true;
    }

    public override bool LoadObjLinks(object obj, bool wrapped, EmraldModel lists)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Action == null)
          return false;

        dynObj = ((dynamic)obj).Action;
      }

      this.codeVariables.Clear();
      if (dynObj.codeVariables != null)
      {
        foreach (var varName in dynObj.codeVariables)
        {
          if (!codeVariables.Contains((string)varName))
          {
            if (((string)varName != "CurTime") && 
                ((string)varName != "RunIdx") &&
                ((string)varName != "RootPath"))
            {
              SimVariable curVar = lists.allVariables.FindByName((string)varName, false);
              if (curVar == null)
                throw new Exception("Failed to find variable named " + (string)varName);
            }

            this.codeVariables.Add((string)varName);
          }
        }
      }

      return true;
    }

    public virtual bool CompileCode(VariableList allVars)
    {
      if (scriptCode == "")
      {
        return false;
      }

      this.compiled = false;
      scriptRunner.Code = scriptCode;

      //add the Time and 3D Frame variables
      scriptRunner.AddVariable("CurTime", typeof(double));
      scriptRunner.AddVariable("RunIdx", typeof(int));
      scriptRunner.AddVariable("ExtSimStartTime", typeof(double));
      scriptRunner.AddVariable("RootPath", typeof(string));
      scriptRunner.AddVariable("OrigRootPath", typeof(string));
      // Expose the engine’s shared RNG so user scripts can consume the same deterministic stream
      scriptRunner.AddVariable("Rand", typeof(Random));


      //add all the variables needed
      if (codeVariables != null)
      {
        foreach (string varName in codeVariables)
        {
          SimVariable var = allVars.FindByName(varName);

          if (var == null)
            throw new Exception("failed to compile " + this.name + " no variable named " + varName + " defined in the diagram.");

          if ((varName != "CurTime") &&
              (varName != "ExtSimStartTime") &&
              (varName != "RunIdx") &&
              (varName != "OrigRootPath") &&
              (varName != "RootPath") &&
              (varName != "Rand"))
          {
            scriptRunner.AddVariable(varName, var.dType);
          }
        }
      }

      if (!scriptRunner.Compile(this._retType))
      {
        throw new Exception("failed to compile code - " + String.Join(Environment.NewLine, scriptRunner.messages.ToArray()) + Environment.NewLine + scriptCode);
      }
      else
      {
        this.compiled = true;
        CacheScriptActUsedVars(allVars);
      }

      return this.compiled;
    }

    // Populates engineVarsUsed and resolvedUserVars after a successful compile so per-call
    // SetVariable in derived classes can skip name lookup and skip variables the script doesn't use.
    protected void CacheScriptActUsedVars(VariableList allVars)
    {
      engineVarsUsed = CommonFunctions.DetectUsedNames(scriptCode, EngineVarRegistry.AllNames);
      resolvedUserVars.Clear();
      if (codeVariables == null) return;
      foreach (string varName in codeVariables)
      {
        // Engine vars are bound by EngineVarBinder, not resolved as user vars.
        if (EngineVarRegistry.AllNames.Contains(varName)) continue;

        SimVariable v = allVars.FindByName(varName);
        if (v == null) continue; // CompileCode already validated; defensive only
        resolvedUserVars.Add(new ResolvedUserVar
        {
          simVar = v,
          isUsed = scriptCode.Contains(varName)
        });
      }
    }

    public override List<ScanForReturnItem> ScanFor(ScanForTypes scanType, string modelRootPath)
    {
      var listItems = new List<ScanForReturnItem>();

      if (scanType == ScanForTypes.sfMultiThreadIssues)
      {
        //see if there are any file references in the code.         
        var paths = CommonFunctions.FindFilePathReferences(ref scriptCode);
        foreach (var path in paths)
        {
          //if (!Path.IsPathRooted(path)) //todo, allow relative paths, but change to model path relative

          listItems.Add(new ScanForRefsItem( this.id,
                                          this.name,
                                          EnIDTypes.itAction, 
                                          "Action [" + this.name + "] has a file path reference script: " + path + ". If there could be a multi thread issue, assign files to copy.",
                                          path));

        }
      }

      return listItems;
    }

    public void UpdatePathRefs(string oldRef, string newRef, string modelPath)
    {
      //find the file references in the code and look for a match of the oldRef and replace.
      string newRefEscaped = newRef.Replace("\\", "\\\\").Replace("\"", "\\\"");
      var paths = CommonFunctions.FindFilePathReferences(ref scriptCode, oldRef, newRefEscaped);

      if (paths.Count <= 0)
        throw new Exception("Failed to find string in the path " + oldRef + " in the source of the External Simulation Event.");
      
      scriptRunner.Code = scriptCode;
      this.compiled = false;
      if (!scriptRunner.Compile(this._retType))
      {
        throw new Exception("failed to compile code - " + String.Join(Environment.NewLine, scriptRunner.messages.ToArray()) + Environment.NewLine + scriptCode);
      }
      else
      {
        this.compiled = true;
      }

    }
  }

  public class VarValueAct : ScriptAct //atCngVarVal
  {
    private readonly object _executionLock = new object();

    private static readonly EngineVar[] AvailableEngineVars =
    {
      EngineVar.CurTime, EngineVar.RunIdx, EngineVar.ExtSimStartTime,
      EngineVar.RootPath, EngineVar.OrigRootPath, EngineVar.Rand
    };

    public SimVariable? simVar = null;
    //public int varID { get { return simVar.id; } }
    public int varID { get { return (simVar != null) ? simVar.id : 0; } }
    //public bool isTimeStateVar { get { return this.simVar is TimeStateVariable; } }

    // When useDistribution is true, the new value is sampled from _dist instead of running scriptCode.
    // The Min/Max parameters are applied as raw doubles for VarValueAct (no time-rate conversion),
    // matching the UI choice "keep time-rate fields, ignore at runtime."
    public bool useDistribution = false;
    private DistribInfo? _dist;

    public VarValueAct()
      : base(EnActionType.atCngVarVal) { }

    public VarValueAct(EnActionType t)
      : base(t) { }

    //public VarValueAct(string inName, TimeStateVariable inSimVar)
    // : this(inName, inSimVar, "", typeof(double), null)
    //{ }

    public VarValueAct(string inName, SimVariable? inSimVar, string inNewValCode, Type inRetType, List<String> inCodeVars)
      : base(inName, inNewValCode, inCodeVars, EnActionType.atCngVarVal)
    {
      this.simVar = inSimVar;
      if ((inRetType != typeof(double)) && (inRetType != typeof(string)) && (inRetType != typeof(bool)))
        throw new Exception("This return type is not implemented " + inRetType.Name);
      this._retType = inRetType;
    }

    public override string GetDerivedJSON(EmraldModel lists)
    {
      string retStr;
      if (useDistribution && _dist != null)
      {
        // Distribution-mode: emit the distribution fields instead of scriptCode/codeVariables.
        retStr = _dist.GetJSON();
        retStr += "," + Environment.NewLine + "\"useDistribution\": true";
      }
      else
      {
        retStr = base.GetDerivedJSON(lists);
      }

      if (simVar != null)
        retStr = retStr + "," + Environment.NewLine + "\"variableName\":" + "\"" + simVar.name + "\"";

      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Action == null)
          return false;

        dynObj = ((dynamic)obj).Action;
      }

      // Read tolerantly: missing/null becomes false. Convert.ToBoolean handles JValue, primitive
      // bool, "true"/"false" strings, etc. without the dynamic-dispatch edge cases that a
      // direct (bool) cast on a Newtonsoft JValue can hit.
      try
      {
        useDistribution = dynObj.useDistribution != null && Convert.ToBoolean((object)dynObj.useDistribution);
      }
      catch
      {
        useDistribution = false;
      }
      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      if (useDistribution)
      {
        // Variable values are unitless raw numbers, so the distribution is constructed in
        // value-only mode (no time-rate conversions, dfltTimeRate is not required in JSON).
        _dist = new DistribInfo(useTimeRates: false);
        try
        {
          _dist.Deserialize(dynObj);
        }
        catch (Exception err)
        {
          throw new Exception("Failed to read distribution for Change Var Value action " + this.name + ": " + err.Message);
        }
      }

      processed = true;
      return true;
    }

    public override bool LoadObjLinks(object obj, bool wrapped, EmraldModel lists)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Action == null)
          return false;

        dynObj = ((dynamic)obj).Action;
      }

      //load the sim variable if there is one
      if (dynObj.variableName != null)
      {
        simVar = lists.allVariables.FindByName((string)dynObj.variableName);
        if (simVar == null)
        {
          throw new Exception("Failed to find the Variable " + simVar?.name);
        }

        this._retType = simVar.dType;
      }

      if (useDistribution && _dist != null)
      {
        // Resolve any variable references inside the distribution parameters
        _dist.LoadVariableReferences(lists.allVariables);
      }
      else
      {
        base.LoadObjLinks(obj, wrapped, lists);
        if (simVar != null)
        {
          if (!codeVariables.Contains(simVar.name))
          {
            codeVariables.Add(simVar.name);
          }
        }
      }

      return true;
    }

    public void SetVal(SimVariable toSetVar, EmraldModel lists, TimeSpan curSimTime, TimeSpan start3DTime, int runIdx)
    {
      //if(this.simVar is TimeStateVariable)
      //{
      //  throw new Exception("SetVal this should not be called for a TimeStateVariable");
      //}
      lock (_executionLock)
      {
        if (useDistribution && _dist != null)
        {
          double sampled = _dist.Sample(out _);

          // VarValueAct ignores time-rate conversion: the sampled value is used as a raw double.
          // Min/Max constraints are also applied as raw doubles (their timeRate field is preserved
          // in the schema for parity with events but not interpreted here).
          if (_dist.TryGetParameter("Minimum", out double minVal, out _) && sampled < minVal)
            sampled = minVal;
          if (_dist.TryGetParameter("Maximum", out double maxVal, out _) && sampled > maxVal)
            sampled = maxVal;

          toSetVar.SetValue(Convert.ChangeType(sampled, toSetVar.dType));
          return;
        }

        if (!this.compiled)
        {
          if (scriptCode == "")
          {
            throw new Exception("No code for " + this.name);
          }

          if (!CompileCode(lists.allVariables))
            throw new Exception("Code failed compile, can not evaluate");
        }

        EngineVarBinder.Bind(scriptRunner, AvailableEngineVars, engineVarsUsed, new ScriptContext
        {
          CurTime = curSimTime.TotalHours,
          RunIdx = runIdx,
          ExtSimStartTime = start3DTime.TotalHours,
          RootPath = lists.rootPath,
          OrigRootPath = lists.origRootPath,
          Rand = SingleRandom.Instance
        });

        foreach (var rv in resolvedUserVars)
        {
          if (rv.isUsed)
            scriptRunner.SetVariable(rv.simVar.name, rv.simVar.dType, rv.simVar.value);
        }

        toSetVar.SetValue(scriptRunner.EvaluateGeneric());
      }

    }
  }

  
  //Initial concept for DLL variable assigning vs code execution for speedup. Part of code so it can be maintained with code, but not offically included.
  //TODO : This currently has hard coded paths and values for testing and needs to be removed if released
  public class VarValueDLLAct : VarValueAct //atCngVarValDLL
  {
    public class DllParamInfo
    {
      public bool emraldVar { get; set; } = false;
      public string name { get; set; } = ""; //name of input
      public string dTypeStr { get; set; } = ""; //type of the value if not an emrald variable

      public string value { get; set; } = "";//value for the parameter if not a variable from EMRALD

    }

    public string libPath = "";
    public String functionName = "";
    public List<DllParamInfo> callParams = new List<DllParamInfo>();

    private const string preClassCode = "[DllImport(\"kernel32.dll\")]\r\n  private static extern IntPtr LoadLibrary(string dllToLoad);\r\n  [DllImport(\"kernel32.dll\")]\r\n  private static extern IntPtr GetProcAddress(IntPtr hModule, string procedureName);\r\n  [UnmanagedFunctionPointer(CallingConvention.Cdecl)]";
    private const string mainCallCode1 = "string dllPath = @\"E:\\Projects_VS\\Tests\\DynamicLoadDLLTest\\SimpleCDLL.dll\";\r\n      string functionName = \"";
    private const string mainCallCode2 = "\";  \r\n      IntPtr dllHandle = LoadLibrary(dllPath);\r\n      IntPtr functionAddress = GetProcAddress(dllHandle, functionName);\r\n     ";


    public new int varID { get { return (simVar != null) ? simVar.id : 0; } }
    //public bool isTimeStateVar { get { return this.simVar is TimeStateVariable; } }  

    public VarValueDLLAct()
      : base(EnActionType.atCngVarDll) 
    { 
      this.scriptRunner.addUsing.Add("System.Runtime.InteropServices");
    }

    public override string GetDerivedJSON(EmraldModel lists)
    {
      //script code is dynamically created and not specified by the user
      string save = this.scriptCode;
      this.scriptCode = "";
      string retStr = base.GetDerivedJSON(lists);
      this.scriptCode = save;

      if (simVar != null)
        retStr = retStr + "," + Environment.NewLine + "\"libPath\":" + "\"" +libPath + "\"";

      

      retStr = retStr + "," + Environment.NewLine + "\"functionName\":" + "\"" + functionName + "\"";

      string callParams = JsonConvert.SerializeObject(this.callParams);

      retStr = retStr + "," + Environment.NewLine + "\"callParams\":" + "\"" + callParams + "\"";

      

      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Action == null)
          return false;

        dynObj = ((dynamic)obj).Action;
      }

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      try
      {
        functionName = Convert.ToString(dynObj.functionName);
        string pathRef = Convert.ToString(dynObj.libPath);
        if (!Path.IsPathRooted(pathRef) && (pathRef.Length > 0) && (pathRef[0] == '.'))
        {
          libPath = lists.rootPath;
          if (!libPath.EndsWith(@"\"))
            libPath += @"\";

          libPath = CommonFunctions.NormalizeGetFullPath(Path.Combine(libPath + pathRef));
        }

        if (!File.Exists(libPath))
        {
          Console.WriteLine("Missing DLL file - " + libPath);
        }
        string callParamJson = Convert.ToString(dynObj.callParams);

        callParams.Add(new DllParamInfo() { dTypeStr = "atCngVarDll", emraldVar = true, name = "varName", value = "5" });
        String test = JsonConvert.SerializeObject(callParams);
        callParams = JsonConvert.DeserializeObject<List<DllParamInfo>>(callParamJson)
             ?? new List<DllParamInfo>();
      }
      catch
      {
        throw new Exception("Missing data for CngVarValDLL, check functionName, libPath, and callParams");
      }
      if(!File.Exists(libPath)) 
      {
        throw new Exception("Library path missing - " + libPath);
      }

      processed = true;
      return true;
    }

    public override bool LoadObjLinks(object obj, bool wrapped, EmraldModel lists)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Action == null)
          return false;

        dynObj = ((dynamic)obj).Action;
      }

      base.LoadObjLinks(obj, wrapped, lists);

      //load the sim variable if there is one
      foreach (var p in callParams)
      {
        if (p.emraldVar)
        {
          
          if ((p.value != "CurTime") && 
              (p.value != "RunIdx") &&
              (p.value != "RootPath"))
          {
            SimVariable curVar = lists.allVariables.FindByName(p.name, false);
            if (curVar == null)
              throw new Exception("Failed to find variable named " + p.value);
          }
          if(!codeVariables.Contains(p.name))
            this.codeVariables.Add(p.name);
        }
      }

      //string functionCall = functionName + "(";
      string functionCall = "myFunction(";
      if (simVar == null)
        throw new InvalidOperationException("simVar was null when building delegate.");
      string fullPreClassCode = preClassCode + Environment.NewLine + "private delegate " + simVar.dType.ToString() + " " + functionName + "(";
      


      foreach (var p in callParams)
      {
        if (p.emraldVar)
        {
          var v = lists.allVariables.FindByName(p.name);
          fullPreClassCode += v.dType.ToString() + " " + v.name + ", ";
          functionCall += v.name + ", ";
        }
        else
        {
          fullPreClassCode += p.dTypeStr + " " + p.name + ", ";
          functionCall += p.value + ", ";
        }
      }

      //remove the last comma and add the end characters
      fullPreClassCode = fullPreClassCode.Substring(0, fullPreClassCode.Length - 2) + ");";
      functionCall = functionCall.Substring(0, functionCall.Length - 2) + ");";
      

      this.scriptRunner.preClassInfo = fullPreClassCode;
      scriptCode = mainCallCode1 + functionName + mainCallCode2;
      scriptCode += functionName + " myFunction = Marshal.GetDelegateForFunctionPointer<" + functionName  + "> (functionAddress);\r\n  return ";
      scriptCode += functionCall;

      return true;
    }

    //public override List<ScanForReturnItem> ScanFor(ScanForTypes scanType) lib Path is OK because it is a DLL and can be loaded from many different threads.

  }

  public class JumpToTimeAct : VarValueAct //atJumpToTime
  {
    //TimeStateVariable savedTime = null;

    private static readonly EngineVar[] AvailableEngineVars =
    {
      EngineVar.CurTime, EngineVar.RunIdx, EngineVar.ExtSimStartTime,
      EngineVar.RootPath, EngineVar.Rand
    };

    public JumpToTimeAct()
      : base()
    {
      this._actType = EnActionType.atJumpToTime;
    }


    public JumpToTimeAct(string inName, string inNewValCode, List<String> inCodeVars)
      : base(inName, null, inNewValCode, typeof(double), inCodeVars)
    {
      this._actType = EnActionType.atJumpToTime;
    }

    //public TimeStateVariable SavedSlot() { return savedTime; }

    public void SetVal(ref double toSet, EmraldModel lists, TimeSpan curSimTime, TimeSpan start3DTime, int runIdx)
    {
      if (!this.compiled)
      {
        if (scriptCode == "")
        {
          throw new Exception("No code for " + this.name);
        }

        if (!CompileCode(lists.allVariables))
          throw new Exception("Code failed compile, can not evaluate");
      }

      EngineVarBinder.Bind(scriptRunner, AvailableEngineVars, engineVarsUsed, new ScriptContext
      {
        CurTime = curSimTime.TotalHours,
        RunIdx = runIdx,
        ExtSimStartTime = start3DTime.TotalHours,
        RootPath = lists.rootPath,
        Rand = SingleRandom.Instance
      });

      foreach (var rv in resolvedUserVars)
      {
        if (rv.isUsed)
          scriptRunner.SetVariable(rv.simVar.name, typeof(double), rv.simVar.value);
      }

      toSet = (double)scriptRunner.EvaluateGeneric();
    }
  }

  public class CustomStateShiftAct : ScriptAct //atCustomStateShift
  {

    public CustomStateShiftAct()
      : base(EnActionType.atCustomStateShift) { }

    public CustomStateShiftAct(string inName, SimVariable inSimVar, string inScriptCode, List<String> inCodeVars)
      : base(inName, inScriptCode, inCodeVars, EnActionType.atCngVarVal) { }


    public bool CompileCode(EmraldModel lists, string modelPath)
    {
      if (scriptCode == "")
      {
        return false;
      }

      this.compiled = false;
      scriptRunner = new ScriptEngine(ScriptEngine.Languages.CSharp);
      scriptRunner.Code = scriptCode; // "Result = var1+3;";

      //add the Time and 3D Frame variables
      scriptRunner.AddVariable("CurTime", typeof(Double));
      scriptRunner.AddVariable("ExeExitCode", typeof(int));

      //add all the variables needed
      if (codeVariables != null)
      {
        foreach (string varName in codeVariables)
        {
          if (!EngineVarRegistry.AllNames.Contains(varName))
          {
            scriptRunner.AddVariable(varName, typeof(double));
          }
        }
      }

      scriptRunner.AddVariable("OutputFile", typeof(string));

      // Only declare state-name booleans the script actually references — avoids
      // bloating the synthesized assembly with one field per state per model.
      foreach (KeyValuePair<int, State> state in lists.allStates)
      {
        if (scriptCode.Contains(state.Value.name) || scriptCode.Contains(state.Value.name + "_Time"))
        {
          scriptRunner.AddVariable(state.Value.name, typeof(bool));
          scriptRunner.AddVariable(state.Value.name + "_Time", typeof(TimeSpan));
        }
      }


      if (!scriptRunner.Compile(typeof(List<string>)))
      {
        throw new Exception("failed to compile code - " + String.Join(Environment.NewLine, scriptRunner.messages.ToArray()) + Environment.NewLine + scriptCode);
      }
      else
      {
        this.compiled = true;
        // Reuse the base-class user-var cache; engine-vars cache is unused here
        // because this class doesn't SetVariable engine vars per call.
        resolvedUserVars.Clear();
        if (codeVariables != null)
        {
          foreach (string varName in codeVariables)
          {
            if (EngineVarRegistry.AllNames.Contains(varName)) continue;
            SimVariable v = lists.allVariables.FindByName(varName);
            if (v == null) continue;
            resolvedUserVars.Add(new ResolvedUserVar
            {
              simVar = v,
              isUsed = scriptCode.Contains(varName)
            });
          }
        }
      }

      return this.compiled;
    }

    public void GetNewStateShifts(EmraldModel lists, ref List<int> addStates, ref List<int> removeStates)
    {
      if (!this.compiled)
      {
        if (!CompileCode(lists, lists.rootPath))
          throw new Exception("Code for - " + this.name + " failed to compile, can not evaluate");
      }

      //Set all the variable values — only those the script references
      foreach (var rv in resolvedUserVars)
      {
        if (rv.isUsed)
          scriptRunner.SetVariable(rv.simVar.name, typeof(double), rv.simVar.value);
      }


      List<String> retStates = scriptRunner.EvaluateStrList();

      //make sure all the IDs returned are valid state IDs.
      foreach (string listItem in retStates)
      {
        if ((listItem[0] != '+') && (listItem[0] != '-'))
          throw new Exception("States must be tagged with '+' or '-' for adding or removing");

        bool add = listItem[0] == '+';
        string stateName = listItem.Substring(1);
        State retState = lists.allStates.FindByName(stateName);
        if (retState == null)
        {
          throw new Exception("processOutputFile code did not generate valid state IDs.");
        }
        else
        {
          if (add)
            addStates.Add(retState.id);
          else
            removeStates.Add(retState.id);
        }
      }
    }

  }

  public enum ReturnType { rtNone, rtStateList, rtVar };

  public class RunExtAppAct : Action //atRunExtApp
  {
    private string exePath = "";
    private ScriptEngine? makeInputFileCompEval;
    private ScriptEngine? processOutputFileCompEval;
    public List<String> codeVariables = new List<String>();
    private bool compiled;
    private ProcessStartInfo? extApp;
    private Process? proc;
    private string exeOutputPath = "";
    public string makeInputFileCode = "";
    public string processOutputFileCode = "";
    public ReturnType returnProcess = ReturnType.rtStateList;
    public SimVariable? assignVariable;
    private Dictionary<string, int> stateVarsAddedPre = new Dictionary<string, int>();
    private Dictionary<string, int> stateVarsAddedPost = new Dictionary<string, int>();
    private string customFormName = ""; //custom form
    private bool exeFromPreCode = false;
    private bool useProjPathExeWorkingDir = false;

    // Engine vars exposed to the make-input and process-output scripts. The binder gates
    // per-call SetVariable on whether each name actually appears in the script source.
    private static readonly EngineVar[] PreAvailableEngineVars =
    {
      EngineVar.CurTime, EngineVar.RunIdx, EngineVar.ExePath, EngineVar.RootPath,
      EngineVar.OrigRootPath, EngineVar.MultiThreaded, EngineVar.Rand
    };
    private static readonly EngineVar[] PostAvailableEngineVars =
    {
      EngineVar.CurTime, EngineVar.RunIdx, EngineVar.ExeExitCode, EngineVar.ExePath,
      EngineVar.RootPath, EngineVar.MultiThreaded, EngineVar.Rand
    };
    private HashSet<string> preEngineVarsUsed = new HashSet<string>(StringComparer.Ordinal);
    private HashSet<string> postEngineVarsUsed = new HashSet<string>(StringComparer.Ordinal);

    // Compile-time resolved user vars per script (see SimulationDAL.ResolvedUserVar).
    private List<ResolvedUserVar> resolvedUserVarsPre = new List<ResolvedUserVar>();
    private List<ResolvedUserVar> resolvedUserVarsPost = new List<ResolvedUserVar>();

    // Cached path resolutions — exePath and origRootPath don't change between calls,
    // so resolve once per compiled action instead of every RunExtApp invocation.
    private string? cachedFixedExePath;

    private static string CleanExePath(string? path)
    {
      return path?.Trim().Trim('"') ?? "";
    }

    private static bool HasExplicitExePath(string exePath)
    {
      return Path.IsPathRooted(exePath) || !string.IsNullOrEmpty(Path.GetDirectoryName(exePath));
    }

    private static bool IsCmdExePath(string? path)
    {
      return string.Equals(Path.GetFileName(CleanExePath(path)), "cmd.exe", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsPathlessSystemExe(string? path, string modelRootPath)
    {
      string exePath = CleanExePath(path);
      if (string.IsNullOrWhiteSpace(exePath) || HasExplicitExePath(exePath))
        return false;

      if (string.IsNullOrWhiteSpace(modelRootPath))
        return true;

      string modelExePath = CommonFunctions.NormalizeGetFullPath(CommonFunctions.NormalizeCombine(modelRootPath, exePath));
      return !File.Exists(modelExePath);
    }

    private static string ResolveExePath(string? path, string modelRootPath)
    {
      string exePath = CleanExePath(path);
      if (string.IsNullOrWhiteSpace(exePath) || Path.IsPathRooted(exePath) || IsPathlessSystemExe(exePath, modelRootPath))
        return exePath;

      return CommonFunctions.NormalizeGetFullPath(CommonFunctions.NormalizeCombine(modelRootPath, exePath));
    }

    // Cached logger — NLog returns the same logger for a given name, no point looking up each call.
    private static readonly NLog.Logger logger = NLog.LogManager.GetLogger("logfile");



    public RunExtAppAct()
      : base("", EnActionType.atRunExtApp)
    {
      this.compiled = false;
    }

    public RunExtAppAct(string inName, string inMakeInputFileCode, string inProcessOutputCode, List<String> inCodeVariables, string inExePath, string inExeOutputPath = "")
      : base(inName, EnActionType.atRunExtApp)
    {
      this.compiled = false;
      if (inCodeVariables != null)
        this.codeVariables = new List<String>(inCodeVariables);

      this.makeInputFileCode = inMakeInputFileCode;
      this.processOutputFileCode = inProcessOutputCode;
      this.exePath = inExePath;
      if (inExeOutputPath != "")
        this.exeOutputPath = inExeOutputPath;
      else
        this.exeOutputPath = CommonFunctions.NormalizeGetDirectoryName(System.Reflection.Assembly.GetEntryAssembly()?.Location
            ?? AppDomain.CurrentDomain.BaseDirectory);
    }

    public override string GetDerivedJSON(EmraldModel lists)
    {

      string code1Str = makeInputFileCode.Replace("\\", "\\\\").Replace("\n", "\\n").Replace("\r", "\\r").Replace("\"", "\\\""); //
      string code2Str = processOutputFileCode.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\n", "\\n").Replace("\r", "\\r");
      string exePathStr = exePath.Replace("\\", "\\\\").Replace("\"", "\\\"");

      if(Environment.OSVersion.Platform == PlatformID.Unix)
      {
        code1Str = makeInputFileCode.Replace("\\", "/").Replace("\n", "\\n").Replace("\r", "\\r").Replace("\"", "\\\""); //
        code2Str = processOutputFileCode.Replace("\\", "/").Replace("\"", "\\\"").Replace("\n", "\\n").Replace("\r", "\\r");
        exePathStr = exePath.Replace("\\", "/").Replace("\"", "\\\"");
      }

      string retStr = Environment.NewLine + "\"makeInputFileCode\":" + "\"" + code1Str + "\"";
      retStr = retStr + "," + Environment.NewLine + "\"processOutputFileCode\":" + "\"" + code2Str + "\"";
      retStr = retStr + "," + Environment.NewLine + "\"exePath\":" + "\"" + exePathStr + "\"";
      retStr = retStr + "," + Environment.NewLine + "\"ExeFromPreCode\": " + exeFromPreCode.ToString().ToLower();
      //retStr = retStr + "," + Environment.NewLine + "\"exeOutputPath\":" + "\"" + exeOutputPath + "\"";
      //retStr = retStr + "," + Environment.NewLine + "\"returnProcess\":" + "\"" + returnProcess.ToString() + "\"";
      if (assignVariable != null)
      {
        retStr = retStr + "," + Environment.NewLine + "\"variableName\":" + "\"" + assignVariable.name + "\"";
      }

      if (codeVariables != null)
      {
        bool first = true;
        retStr = retStr + "," + Environment.NewLine + "\"codeVariables\":[";
        foreach (string varName in codeVariables)
        {
          if (first)
          {
            retStr = retStr + "\"" + varName + "\"";
            first = false;
          }
          else
          {
            retStr = retStr + ", \"" + varName + "\"";
          }
        }
        retStr = retStr + "]" + Environment.NewLine;
      }


      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Action == null)
          return false;

        dynObj = ((dynamic)obj).Action;
      }

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      lists.allActions.Add(this, false);

      makeInputFileCode = (string)dynObj.makeInputFileCode;
      processOutputFileCode = (string)dynObj.processOutputFileCode;
      exePath = (string)dynObj.exePath;
      exeFromPreCode = dynObj.ExeFromPreCode != null && Convert.ToBoolean((object)dynObj.ExeFromPreCode);

      if (dynObj.returnProcess != null)
      {
        returnProcess = (ReturnType)Enum.Parse(typeof(ReturnType), (string)dynObj.returnProcess, true);
      }

      if ((returnProcess == ReturnType.rtVar) && (dynObj.variableName == null))
      {
        throw new Exception("missing assign variable definition.");
      }

      if (!exeFromPreCode && !string.IsNullOrWhiteSpace(exePath) && !IsPathlessSystemExe(exePath, lists.rootPath))
      {
        string fullExePath = ResolveExePath(exePath, lists.rootPath);
        if (!fullExePath.Contains("AppData") &&  //If this is a multithread path then don't check!
            !File.Exists(fullExePath))
          throw new Exception("Executable path for the \"RunApplication\" action does not exist ! - " + exePath);
      }

      if (dynObj.exeOutputPath == null)
        this.exeOutputPath = CommonFunctions.NormalizeGetParent(CommonFunctions.NormalizeGetCurrentDirectory());// Path.GetDirectoryName(System.Reflection.Assembly.GetEntryAssembly().Location);
      else
        exeOutputPath = (string)dynObj.exeOutputPath;

      if (dynObj.caType != null) //get custom form type name if exists
        this.customFormName = (string)dynObj.caType;

      if (dynObj.useProjPathExeWorkingDir != null)
        this.useProjPathExeWorkingDir = (bool)dynObj.useProjPathExeWorkingDir;
      processed = true;
      return true;
    }

    public override bool LoadObjLinks(object obj, bool wrapped, EmraldModel lists)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Action == null)
          return false;

        dynObj = ((dynamic)obj).Action;
      }

      this.codeVariables.Clear();
      if (dynObj.codeVariables != null)
      {
        foreach (var varName in dynObj.codeVariables)
        {
          SimVariable curVar = lists.allVariables.FindByName((string)varName);
          if (curVar == null)
            throw new Exception("Failed to find variable named " + (string)varName);

          this.codeVariables.Add((string)varName);
        }
      }

      if (dynObj.variableName != null)
      {
        assignVariable = lists.allVariables.FindByName((string)dynObj.variableName);
      }

      return true;
    }

    public bool CompileMakeInputFileCode(EmraldModel lists)
    {
      if (makeInputFileCode == "")
      {
        return false;
      }

      this.compiled = false;
      makeInputFileCompEval = new ScriptEngine(ScriptEngine.Languages.CSharp);
      makeInputFileCompEval.Code = makeInputFileCode; 

      //add the Time other default variables
      makeInputFileCompEval.AddVariable("CurTime", typeof(double));
      makeInputFileCompEval.AddVariable("RunIdx", typeof(int));
      makeInputFileCompEval.AddVariable("ExePath", typeof(string));
      makeInputFileCompEval.AddVariable("RootPath", typeof(string));
      makeInputFileCompEval.AddVariable("OrigRootPath", typeof(string));
      makeInputFileCompEval.AddVariable("MultiThreaded", typeof(bool));
      makeInputFileCompEval.AddVariable("Rand", typeof(Random));


      //add all the variables needed
      if (codeVariables != null)
      {
        foreach (string varName in codeVariables)
        {

          //makeInputFileCompEval.AddVariable(varName, typeof(double));
          SimVariable var = lists.allVariables.FindByName(varName);
          if (var == null)
            throw new Exception("failed to compile " + this.name + " no variable named " + varName + " defined in the diagram.");

          if ((varName != "CurTime") &&
              (varName != "RunIdx") &&
              (varName != "ExePath") &&
              (varName != "RootPath") &&
              (varName != "OrigRootPath") &&
              (varName != "MultiThreaded") &&
              (varName != "Rand"))
          {
            makeInputFileCompEval.AddVariable(varName, var.dType);
          }
        }
      }

      //add all the states
      stateVarsAddedPre.Clear();
      foreach (KeyValuePair<int, State> state in lists.allStates)
      {
        //see if there are any variables with the name of the state && and valid variable name
        if ((makeInputFileCode.Contains(state.Value.name) || makeInputFileCode.Contains(state.Value.name + "_Time")) &&
           (state.Value.name.IndexOfAny(new char[] { '*', '&', '#', ' ', '-', '+', '_', '@', '$', '#', '%', ',', ')', '=', '/', '>', '<', '.', ';', '~', '`', '|', '}', '{', ']', '[', '\\' }) == -1))
        {
          makeInputFileCompEval.AddVariable(state.Value.name, typeof(bool));
          makeInputFileCompEval.AddVariable(state.Value.name + "_Time", typeof(TimeSpan));
          stateVarsAddedPre.Add(state.Value.name, state.Value.id);
        }
      }



      if (!makeInputFileCompEval.Compile(typeof(string)))
      {
        throw new Exception("failed to compile code - " + String.Join(Environment.NewLine, makeInputFileCompEval.messages.ToArray()) + Environment.NewLine + makeInputFileCode);
      }
      else
      {
        this.compiled = true;
        preEngineVarsUsed = CommonFunctions.DetectUsedNames(makeInputFileCode, EngineVarRegistry.AllNames);
        cachedFixedExePath = null; // invalidate; will be recomputed lazily in RunExtApp
        ResolveUserVars(lists, makeInputFileCode, resolvedUserVarsPre);
      }

      return this.compiled;
    }

    // Resolve each codeVariable to a SimVariable once, with a flag for whether the script
    // body references it — avoids per-iteration FindByName and gates per-iteration SetVariable.
    private void ResolveUserVars(EmraldModel lists, string code, List<ResolvedUserVar> into)
    {
      into.Clear();
      if (codeVariables == null) return;
      foreach (string varName in codeVariables)
      {
        if (EngineVarRegistry.AllNames.Contains(varName)) continue;
        SimVariable v = lists.allVariables.FindByName(varName);
        if (v == null) continue;
        into.Add(new ResolvedUserVar { simVar = v, isUsed = code.Contains(varName) });
      }
    }

    public bool CompileProcessOutputFileCode(EmraldModel lists)
    {
      if (processOutputFileCode == "")
      {
        return false;
      }

      this.compiled = false;
      processOutputFileCompEval = new ScriptEngine(ScriptEngine.Languages.CSharp);
      processOutputFileCompEval.Code = processOutputFileCode; 

      //add the Time and 3D Frame variables
      processOutputFileCompEval.AddVariable("CurTime", typeof(Double));
      processOutputFileCompEval.AddVariable("RunIdx", typeof(int));
      processOutputFileCompEval.AddVariable("ExeExitCode", typeof(int));
      //processOutputFileCompEval.AddVariable("OutputFile", typeof(string));
      processOutputFileCompEval.AddVariable("RootPath", typeof(string));
      processOutputFileCompEval.AddVariable("OrigRootPath", typeof(string));
      processOutputFileCompEval.AddVariable("ExePath", typeof(string));
      processOutputFileCompEval.AddVariable("MultiThreaded", typeof(bool));
      processOutputFileCompEval.AddVariable("Rand", typeof(Random));

      //add all the variables needed
      if (codeVariables != null)
      {
        foreach (string varName in codeVariables)
        {
          //makeInputFileCompEval.AddVariable(varName, typeof(double));
          SimVariable var = lists.allVariables.FindByName(varName);
          if (var == null)
            throw new Exception("failed to compile " + this.name + " no variable named " + varName + " defined in the diagram.");

          if ((varName != "CurTime") &&
              (varName != "RunIdx") &&
              (varName != "ExeExitCode") &&
              (varName != "ExePath") &&
              (varName != "OrigRootPath") &&
              (varName != "RootPath") &&
              (varName != "Rand"))
          {
            processOutputFileCompEval.AddVariable(varName, var.dType);
          }
        }
      }

      //add all the states
      stateVarsAddedPost.Clear();
      foreach (KeyValuePair<int, State> state in lists.allStates)
      {
        //see if there are any variables with the name of the state && and valid variable name
        if ((makeInputFileCode.Contains(state.Value.name) || makeInputFileCode.Contains(state.Value.name + "_Time")) &&
           (state.Value.name.IndexOfAny(new char[] { '*', '&', '#', ' ', '-', '+', '_', '@', '$', '#', '%', ',', ')', '=', '/', '>', '<', '.', ';', '~', '`', '|', '}', '{', ']', '[', '\\' }) == -1))
        {
          processOutputFileCompEval.AddVariable(state.Value.name, typeof(bool));
          processOutputFileCompEval.AddVariable(state.Value.name + "_Time", typeof(TimeSpan));
          stateVarsAddedPost.Add(state.Value.name, state.Value.id);
        }
      }


      Type retType = typeof(object);
      switch (returnProcess)
      {
        case ReturnType.rtNone:
          retType = typeof(void);
          break;
        case ReturnType.rtStateList:
          retType = typeof(List<string>);
          break;
        case ReturnType.rtVar:
          retType = typeof(object);
          break;
      }

      if (!processOutputFileCompEval.Compile(retType))
      {
        throw new Exception("failed to compile code - " + String.Join(Environment.NewLine, processOutputFileCompEval.messages.ToArray()) + Environment.NewLine + processOutputFileCode);
      }
      else
      {
        this.compiled = true;
        postEngineVarsUsed = CommonFunctions.DetectUsedNames(processOutputFileCode, EngineVarRegistry.AllNames);
        ResolveUserVars(lists, processOutputFileCode, resolvedUserVarsPost);
      }


      return this.compiled;
    }


    private void WriteStandardOutput()
    {
      if(proc?.StandardOutput == null) return;

      using (StreamWriter writer = File.CreateText(exeOutputPath + Path.AltDirectorySeparatorChar + "_out.txt"))
      using (StreamReader reader = proc.StandardOutput)
      {
        writer.AutoFlush = true;

        for (; ; )
        {
          string? textLine = reader.ReadLine();
          
          if (textLine == null)
            break;

          writer.WriteLine(textLine);
          Console.Out.WriteLine(textLine);
        }
      }

      if (File.Exists(exeOutputPath + Path.AltDirectorySeparatorChar + "_out.txt"))
      {
        FileInfo info = new FileInfo(exeOutputPath + Path.AltDirectorySeparatorChar + "_out.txt");

        // if the error info is empty or just contains eof etc.

        if (info.Length < 4)
          info.Delete();
      }
    }

    public void RunExtApp(Dictionary<int, TimeSpan> curStatesTime, TimeSpan curTime, EmraldModel lists, ref List<int> addStates, ref List<int> removeStates, bool multiThreaded)
    {
      if (!this.compiled)
      {
        if (!CompileMakeInputFileCode(lists))
          throw new Exception("MakeInputFile Code failed to compile, can not evaluate");
        if ((processOutputFileCode != null) && (processOutputFileCode != ""))
        {
          if (!CompileProcessOutputFileCode(lists))
            throw new Exception("ProcessOutputFile Code failed compile, can not evaluate");
        }
      }

      if (makeInputFileCompEval == null)
        throw new Exception("Script engine not assigned should not happen.");

      //Set all the variable values
      foreach (var rv in resolvedUserVarsPre)
      {
        if (rv.isUsed)
          makeInputFileCompEval.SetVariable(rv.simVar.name, rv.simVar.dType, rv.simVar.value);
      }

      // exePath rooting is computed once per compiled action (origRootPath doesn't change).
      if (preEngineVarsUsed.Contains("ExePath") && cachedFixedExePath == null)
      {
        cachedFixedExePath = ResolveExePath(exePath, lists.origRootPath);
      }

      EngineVarBinder.Bind(makeInputFileCompEval, PreAvailableEngineVars, preEngineVarsUsed, new ScriptContext
      {
        CurTime = curTime.TotalHours,
        RunIdx = lists.curRunIdx,
        ExePath = cachedFixedExePath ?? "",
        RootPath = lists.rootPath,
        OrigRootPath = lists.origRootPath,
        MultiThreaded = multiThreaded,
        Rand = SingleRandom.Instance
      });

      // Iterate only the states the scripts reference (populated at compile time),
      // rather than scanning lists.allStates which can be O(allStates) per call.
      foreach (var kv in stateVarsAddedPre)
      {
        if (curStatesTime.TryGetValue(kv.Value, out TimeSpan stateTime))
        {
          makeInputFileCompEval.SetVariable(kv.Key, typeof(bool), true);
          makeInputFileCompEval.SetVariable(kv.Key + "_Time", typeof(TimeSpan), stateTime);
        }
        else
        {
          makeInputFileCompEval.SetVariable(kv.Key, typeof(bool), false);
          makeInputFileCompEval.SetVariable(kv.Key + "_Time", typeof(TimeSpan), TimeSpan.FromMilliseconds(0));
        }
      }

      if (processOutputFileCompEval != null)
      {
        foreach (var kv in stateVarsAddedPost)
        {
          if (curStatesTime.TryGetValue(kv.Value, out TimeSpan stateTime))
          {
            processOutputFileCompEval.SetVariable(kv.Key, typeof(bool), true);
            processOutputFileCompEval.SetVariable(kv.Key + "_Time", typeof(TimeSpan), stateTime);
          }
          else
          {
            processOutputFileCompEval.SetVariable(kv.Key, typeof(bool), false);
            processOutputFileCompEval.SetVariable(kv.Key + "_Time", typeof(TimeSpan), TimeSpan.FromMilliseconds(0));
          }
        }
      }

      string runParams = makeInputFileCompEval.EvaluateString();
      var locExePath = exeFromPreCode ? "" : exePath;

      // Only infer the exe from runParams when no exePath was explicitly configured,
      // or when ExeFromPreCode explicitly says the preprocessor return string includes it.
      // Otherwise an argument value that merely contains ".exe" (e.g. "--model C:\...\foo.exe")
      // would be mistaken for the executable and clobber the real exePath.
      // Check if runParams contains an exe path (look for .exe extension)
      if (string.IsNullOrEmpty(locExePath) && !string.IsNullOrEmpty(runParams))
      {
        int exeIdx = runParams.IndexOf(".exe", StringComparison.OrdinalIgnoreCase);
        if (exeIdx > 0)
        {
          // Found .exe, extract everything up to and including .exe
          int exeEndIdx = exeIdx + 4; // Length of ".exe"
          locExePath = runParams.Substring(0, exeEndIdx).Trim();

          // Get the remaining parameters after the exe path
          if (exeEndIdx < runParams.Length)
          {
            runParams = runParams.Substring(exeEndIdx).Trim();
          }
          else
          {
            runParams = "";
          }
        }
      }

      string fullExePath = ResolveExePath(locExePath, lists.rootPath);

      logger.Info("Executing - " + fullExePath + " " + runParams);

      int exitCode = 0;
      string workingDir;
      try
      {
        if (runParams != null)
        {
          bool pathlessSystemExe = IsPathlessSystemExe(locExePath, lists.rootPath);
          if (string.IsNullOrWhiteSpace(fullExePath) ||
              (!pathlessSystemExe && !File.Exists(fullExePath)))
            throw new Exception("No executable specified for RunExtApp - " + this.name);
          if (IsCmdExePath(locExePath))
          {
            runParams = "/C " + runParams;
          }

          workingDir = useProjPathExeWorkingDir
            ? lists.rootPath
            : CommonFunctions.NormalizeGetDirectoryName(fullExePath);

          // Reuse the ProcessStartInfo across calls (the fields below are the only ones that change).
          if (extApp == null)
          {
            extApp = new ProcessStartInfo();
            extApp.UseShellExecute = false;

            // In DEBUG builds or whenever the user enabled debug logging via the options JSON,
            // let the child's stdout/stderr flow through (inherited handles in release with debug on;
            // a separate console window in DEBUG builds via CreateNoWindow=false below).
            // In a clean release run (debug == "off"), redirect both streams so we can drain them
            // into a no-op and keep the EMRALD console clean — also avoids conhost cost.
#if DEBUG
            bool suppressChildOutput = false;
#else
            bool suppressChildOutput = ConfigData.debugLev == NLog.LogLevel.Off;
#endif
            extApp.RedirectStandardOutput = suppressChildOutput;
            extApp.RedirectStandardError = suppressChildOutput;

#if DEBUG
            // Show the child's console window in debug builds for easier troubleshooting.
            extApp.CreateNoWindow = false;
#else
            // Release builds: skip console window creation — conhost allocation is a measurable
            // per-launch cost when running thousands of Monte Carlo iterations.
            extApp.CreateNoWindow = true;
#endif
          }
          extApp.Arguments = runParams;
          extApp.FileName = fullExePath;
          extApp.WorkingDirectory = workingDir;

          // Run the external process & wait for it to finish
          using (proc = Process.Start(extApp))
          {
            if (proc == null)
              return; //should never happen, declared at top for optimization.

            // If we redirected the streams, we must drain them or the child will block once the
            // pipe buffer fills. Discard the lines — the intent here is suppression, not capture.
            if (extApp.RedirectStandardOutput)
            {
              proc.OutputDataReceived += (_, _) => { };
              proc.ErrorDataReceived += (_, _) => { };
              proc.BeginOutputReadLine();
              proc.BeginErrorReadLine();
            }

            proc.WaitForExit();

            // Retrieve the app's exit code
            exitCode = proc.ExitCode;
            proc.Close();
          }
        }
        else
        {
          exitCode = -1;
          workingDir = useProjPathExeWorkingDir
            ? lists.rootPath
            : CommonFunctions.NormalizeGetDirectoryName(fullExePath);
        }
      }
      catch (Exception ex)
      {
        logger.Error("Failed executing RunExtApp action [" + this.name + "] Executable: " + fullExePath + " Parameters: " + runParams + " Error - " + ex.Message);
        throw;
      }

      //Set all the variable values
      if (processOutputFileCompEval != null)
      {
        EngineVarBinder.Bind(processOutputFileCompEval, PostAvailableEngineVars, postEngineVarsUsed, new ScriptContext
        {
          CurTime = curTime.TotalHours,
          RunIdx = lists.curRunIdx,
          ExeExitCode = exitCode,
          ExePath = CommonFunctions.NormalizeGetDirectoryName(fullExePath),
          RootPath = lists.rootPath,
          MultiThreaded = multiThreaded,
          Rand = SingleRandom.Instance
        });

        foreach (var rv in resolvedUserVarsPost)
        {
          if (rv.isUsed)
            processOutputFileCompEval.SetVariable(rv.simVar.name, rv.simVar.dType, rv.simVar.value);
        }
      }

      switch (this.returnProcess)
      {
        case ReturnType.rtNone:
          if (processOutputFileCompEval != null)
            processOutputFileCompEval.EvaluateGeneric();
          break;

        case ReturnType.rtStateList:
          if (processOutputFileCompEval == null)
            throw new Exception("Script engine not assigned should not happen.");

          List<String> retStates = processOutputFileCompEval.EvaluateStrList();

          // _out.txt is written by the child exe into its working directory (set above as workingDir).
          // Earlier code looked in dirname(exePath), which can mismatch when exePath is relative or
          // when useProjPathExeWorkingDir redirects the child to lists.rootPath. Use workingDir to
          // guarantee we target the same per-thread location the exe actually wrote to.
          string outFilePath = Path.Combine(workingDir, "_out.txt");
          int delTries = 0;
          while ((delTries < 30) && File.Exists(outFilePath))
          {
            try
            {
              System.IO.File.Delete(outFilePath);
            }
            catch
            {
              //try again in a bit;
              ++delTries;
              System.Threading.Thread.Sleep(10);
            }
          }

          //make sure all the IDs returned are valid state IDs.
          foreach (string listItem in retStates)
          {
            if ((listItem[0] != '+') && (listItem[0] != '-'))
              throw new Exception("States must be tagged with '+' or '-' for adding or removing");

            bool add = listItem[0] == '+';
            string stateName = listItem.Substring(1);
            State retState = lists.allStates.FindByName(stateName);
            if (retState == null)
            {
              throw new Exception("processOuputFile code did not generate vaild state IDs.");
            }
            else
            {
              if (add)
                addStates.Add(retState.id);
              else
                removeStates.Add(retState.id);
            }
          }
          break;
        case ReturnType.rtVar:
          if (processOutputFileCompEval == null)
            throw new Exception("Script engine not assigned should not happen.");
          if (assignVariable == null)
            throw new Exception("Missing variable to assign value, should not happen.");
          assignVariable.SetValue(processOutputFileCompEval.EvaluateGeneric()); 
          break;

        default: //do nothing
          break;
      }
    }

    public override List<ScanForReturnItem> ScanFor(ScanForTypes scanType, string modelRootPath)
    {
      var listItems = new List<ScanForReturnItem>();

      bool exeIsPathlessSystem = IsPathlessSystemExe(this.exePath, modelRootPath);
      string fullExePath = string.IsNullOrWhiteSpace(this.exePath)
        ? CommonFunctions.NormalizeGetFullPath(modelRootPath)
        : exeIsPathlessSystem
          ? ""
          : ResolveExePath(this.exePath, modelRootPath);

      if (scanType == ScanForTypes.sfMultiThreadIssues)
      {
        if (this.customFormName == "MAAP") //if MAAP, it takes care multi thead stuff in its own code.
        {
          return listItems;
        }
        //get the reference to the exe, this must be first.
        // Ignore pathless system exes; they are not copied or repathed per thread.
        if (!exeIsPathlessSystem)
        {
          listItems.Add(new ScanForRefsItem(this.id,
                                          this.name,
                                          EnIDTypes.itAction,
                                          "Run Exe Action [" + this.name + "] has a file path reference to the exe to run: " + this.exePath + ". Assign this Exe and its needed files to be copied.",
                                          this.exePath));
        }

        //see if there are any file references in the code.  

        if (makeInputFileCode != null)
        {
          var paths = CommonFunctions.FindFilePathReferences(ref makeInputFileCode);
          foreach (var path in paths)
          {
            listItems.Add(new ScanForRefsItem(this.id,
                                            this.name,
                                            EnIDTypes.itAction,
                                            "Run Exe Action[" + this.name + "] has a file path reference in the pre - process code: " + path + ". If there could be a multi thread issue, assign files to copy.",
                                            path,
                                            fullExePath));
          }
        }

        if (processOutputFileCode != null)
        {
          var paths = CommonFunctions.FindFilePathReferences(ref processOutputFileCode);
          foreach (var path in paths)
          {
            listItems.Add(new ScanForRefsItem(this.id,
                                            this.name,
                                            EnIDTypes.itAction,
                                            "Run Exe Action [" + this.name + "] has a file path reference in the post-process code: " + path + ". If there could be a multi thread issue, assign files to copy.",
                                            path,
                                            fullExePath));
          }
        }
        
      }

      return listItems;
    }

    public void UpdatePathRefs(string oldRef, string newRef, string modelPath, EmraldModel lists)
    {
      bool inExe = false;
      if (this.exePath == oldRef && IsPathlessSystemExe(this.exePath, lists.origRootPath))
      {
        inExe = true;
      }
      else if (this.exePath == oldRef)
      {
        // Decide whether to relocate the exe to the per-thread workspace.
        // If the exe was actually copied into modelPath (the thread's rootPath), use the new
        // per-thread location. Otherwise leave the exe at its original location so all threads
        // share a single install.
        string perThreadCandidate = Path.IsPathRooted(newRef)
          ? newRef
          : CommonFunctions.NormalizeGetFullPath(Path.Combine(modelPath, newRef));

        if (File.Exists(perThreadCandidate))
        {
          this.exePath = newRef;
          inExe = true;
        }
        else
        {
          // Not copied per-thread — pin to the original model location so the action still finds
          // the exe at runtime from any thread.
          inExe = true;
          if (!Path.IsPathRooted(this.exePath))
          {
            string origExe = CommonFunctions.NormalizeGetFullPath(Path.Combine(lists.origRootPath, this.exePath));
            if (!File.Exists(origExe))
              throw new Exception("Executable path for the \"RunApplication\" action does not exist! - " + this.exePath);
            this.exePath = origExe;
          }
          else if (!File.Exists(this.exePath))
          {
            throw new Exception("Executable path for the \"RunApplication\" action does not exist! - " + this.exePath);
          }
        }
      }
      //find the file references in the code and look for a match of the oldRef and replace.         
      var paths = CommonFunctions.FindFilePathReferences(ref makeInputFileCode, oldRef, newRef);
      if (paths.Count <= 0) //not found in the input code so move to the output file code
      {
        paths.AddRange(CommonFunctions.FindFilePathReferences(ref processOutputFileCode, oldRef, newRef));
      }
      if ((paths.Count <= 0) && !inExe)
        throw new Exception("Failed to find string in the path " + oldRef + " in the source of the External Simulation Event and is not the exe path.");

      //recompile the source
      this.compiled = false;
      CompileMakeInputFileCode(lists);
      CompileProcessOutputFileCode(lists);
      this.exeOutputPath = CommonFunctions.NormalizeGetDirectoryName(modelPath);
    }
  }

  public class Sim3DAction : Action //at3DSim
  {
    //Sim3DInfo sim3D;
    public SimActionType sim3DMessage = SimActionType.atOpenSim;

    public Sim3DVariable? simVar = null;
    public int? varID { get { return simVar == null ? 0 : simVar.id; } }
    //public String modelRef = null;
    //public String configData = null;
    private ExternalSim? _extSim;
    public bool openSimVarParams = false;
    public TimeSpan simMaxTime { get { return _extSim?.simMaxTime ?? TimeSpan.Zero; } }
    public String resourceName { get { return _extSim?.resourceName ?? ""; } }



    public Sim3DAction()
      : base("", EnActionType.at3DSimMsg) { }

    public Sim3DAction(string inName, SimActionType message, ExternalSim simData, SimVariable? inSimVar = null, String inParams = "")
      : base(inName, EnActionType.at3DSimMsg)
    {
      sim3DMessage = message;
      //TODO : Change when more than 1 sim use DBlookup
      //TODO : sim3D = inSim3D;
      if ((inSimVar != null) && !(inSimVar is Sim3DVariable))
      {
        System.Diagnostics.Debug.Write("SimVariable for a 3DAction must be a Sim3DVariable type");
      }

      if ((inSimVar != null) && (inSimVar is Sim3DVariable))
      {
        this.simVar = (Sim3DVariable)inSimVar;
      }

      this._extSim = simData;
      this.sim3DMessage = message;
    }

    public override string GetDerivedJSON(EmraldModel lists)
    {

      string retStr = Environment.NewLine + "\"sim3DMessage\":" + "\"" + sim3DMessage.ToString() + "\"";
      retStr = retStr + "," + Environment.NewLine + "\"extSim\":\"" + (_extSim?.name ?? "") + "\"";
      if (this.simVar != null)
        retStr = retStr + "," + Environment.NewLine + "\"sim3DVariable\":" + "\"" + simVar.name + "\"";
      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Action == null)
          return false;

        dynObj = ((dynamic)obj).Action;
      }


      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      lists.allActions.Add(this, false);

      sim3DMessage = (SimActionType)Enum.Parse(typeof(SimActionType), (string)dynObj.sim3DMessage, true);

      if (dynObj.openSimVarParams != null)
      {
        openSimVarParams = (bool)dynObj.openSimVarParams;
      }
      
      //Done in LoadObjLinks
      //SimVar
      //extSim


      processed = true;
      return true;
    }

    public override bool LoadObjLinks(object obj, bool wrapped, EmraldModel lists)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Action == null)
          return false;

        dynObj = ((dynamic)obj).Action;
      }

      //load the sim variable if there is one
      if (dynObj.sim3DVariable == null)
        this.simVar = null;
      else
      {
        simVar = (Sim3DVariable)lists.allVariables.FindByName((string)dynObj.sim3DVariable);
        if (simVar == null)
        {
          throw new Exception("failed to find variable associated with Sim3DAction");
        }
        else
        {
          if (simVar.varScope != EnVarScope.gt3DSim)
            throw new Exception("Sim3DAction must have a variable of type gt3DSim");
        }
      }

      //load the ext sim
      if (dynObj.extSim == null)
        this._extSim = new ExternalSim("UnknownSim", "", "", TimeSpan.FromSeconds(0));
      else
      {
        _extSim = (ExternalSim)lists.allExtSims.FindByName((string)dynObj.extSim);
        if (_extSim == null)
        {
          throw new Exception("failed to find external sim associated with Sim3DAction - " + (string)dynObj.extSim);
        }

        if (dynObj.sim3DModelRef != null)
          _extSim.modelRef = (string)dynObj.sim3DModelRef;
        if (dynObj.sim3DConfigData != null)
          _extSim.configData = (string)dynObj.sim3DConfigData;
        if (dynObj.simEndTime != null)
          _extSim.simMaxTime = XmlConvert.ToTimeSpan((string)dynObj.simEndTime);
      }

      //if the parameters are variable verify they exist
      if ((dynObj.openSimVarParams != null)  && ((bool)dynObj.openSimVarParams == true))
      {
        if ((_extSim.modelRef != "") && (lists.allVariables.FindByName(_extSim.modelRef) == null))
        {
          throw new Exception("Model reference marked as a variable but variable named - " + _extSim.modelRef + " does not exist");
        }

        if ((_extSim.configData != "") && (lists.allVariables.FindByName(_extSim.configData) == null))
        {
          throw new Exception("Config Data marked as a variable but variable named - " + _extSim.modelRef + " does not exist");
        }
      }

      return true;
    }

    public string ModelRef(EmraldModel lists)
    {
      if (_extSim == null)
        throw new Exception("_estSim null should not happen.");
      string retVal = _extSim.modelRef;
      if (openSimVarParams)
      {
         retVal = lists.allVariables.FindByName(_extSim.modelRef, true).strValue;
      }

      return retVal;
    }

    public string ConfigData(EmraldModel lists)
    {
      if (_extSim == null)
        throw new Exception("_estSim null should not happen.");
      string retVal = _extSim.configData;
      if (openSimVarParams)
      {
        retVal = lists.allVariables.FindByName(_extSim.configData, true).strValue;
      }

      return retVal;
    }
  }




  public class ActionList : List<Action>
  {
    //private List<Transition> transItems = new List<Transition>();
    public bool moveFromCurrent;

    public ActionList(bool inMoveFromCurrent = false)
    {
      this.moveFromCurrent = inMoveFromCurrent;
    }

    public string GetJSON(bool incBrackets, EmraldModel lists)
    {
      string retStr = "";
      if (incBrackets)
      {
        retStr = "{";
      }
      retStr = retStr + "\"moveFromCurrent\":" + this.moveFromCurrent.ToString().ToLower();
      retStr = retStr + "," + Environment.NewLine + "\"actions\": [";

      for (int i = 0; i < this.Count; ++i)
      {
        retStr = retStr + Environment.NewLine + "\"" + this[i].name + "\"";


        if (i < this.Count - 1)
        {
          retStr = retStr + "," + Environment.NewLine;
        }
      }

      retStr = retStr + "]";


      if (incBrackets)
      {
        retStr = retStr + Environment.NewLine + "}";
      }

      return retStr;
    }


    public bool DeserializeJSON(object obj, EmraldModel lists)
    {
      dynamic dynObj = (dynamic)obj;

      this.Clear();

      if (dynObj.moveFromCurrent != null)
        this.moveFromCurrent = (bool)dynObj.moveFromCurrent;
      else
        this.moveFromCurrent = true;

      if (dynObj.actions != null)
      {
        foreach (var toActName in dynObj.actions)
        {
          Action? curAct = lists.allActions.FindByName((string)toActName);

          if (curAct == null)
          {
            throw new Exception("Failed to find Action - " + (string)toActName);
          }
          
          this.Add(curAct);
        }
      }

      return true;
    }
  }

  public class AllActions : Dictionary<int, Action>, ModelItemLists
  {
    private List<Action> deleted = new List<Action>();
    private Dictionary<string, int> nameToID = new Dictionary<string, int>();
    
    public bool loaded = false;

    public void Add(Action inAction, bool errorOnDup = true)
    {
      if (nameToID.ContainsKey(inAction.name))
      {
        if (errorOnDup)
          throw new Exception("Action already exists " + inAction.name);
        return;
      }

      nameToID.Add(inAction.name, inAction.id);
      
      this.Add(inAction.id, inAction);
    }

    public void SetProcessed(bool value)
    {
      foreach (var item in this)
      {
        item.Value.processed = value;
      }
    }

    public string AllProcessed()
    {
      string retStr = "";
      foreach (var item in this)
      {
        if (item.Value.processed != true)
          retStr = retStr + ((BaseObjInfo)item.Value).name + " Action not processed" + Environment.NewLine;
      }

      return retStr;
    }

    new public void Clear()
    {
      nameToID.Clear();
      deleted.Clear();
      base.Clear();
    }

    public void DeleteAll()
    {
      foreach (Action curVar in this.Values)
      {
        deleted.Add(curVar);
      }

      nameToID.Clear();
      base.Clear();
    }

    new public void Remove(int key)
    {
      if (this.ContainsKey(key))
      {
        Action curAct = this[key];
        deleted.Add(curAct);

        nameToID.Remove(curAct.name);
        
        base.Remove(key);
      }
    }    

    public Action? FindByName(string name, bool exception = true)
    {
      try
      {
        if (nameToID.ContainsKey(name))
        {
          return this[nameToID[name]];
        }
        else
        {
          if (exception)
            throw new Exception("Failed to find Action - " + name);
          else
            return null;
        }
      }
      catch
      {
        if (exception)
          throw new Exception("Failed to find Action - " + name);
        else
          return null;
      }      
    }

    public static Action? CreateNewAction(EnActionType actType)
    {
      Action? retAct = null;

      switch (actType)
      {
        case EnActionType.at3DSimMsg: retAct = new Sim3DAction(); break;
        case EnActionType.atCngVarVal: retAct = new VarValueAct(); break;
        case EnActionType.atTransition: retAct = new TransitionAct(); break;
        case EnActionType.atRunExtApp: retAct = new RunExtAppAct(); break;
        case EnActionType.atCustomStateShift: retAct = new CustomStateShiftAct(); break;
        case EnActionType.atCngVarDll: retAct = new VarValueDLLAct(); break;
        default: break;
      }

      return retAct;
    }

    public string GetJSON(bool incBrackets, EmraldModel lists)
    {
      string retStr = "";
      if (incBrackets)
      {
        retStr = "{";
      }
      retStr = retStr + "\"ActionList\": [";

      int i = 1;
      foreach (Action curItem in this.Values)
      {
        retStr = retStr + Environment.NewLine + curItem.GetJSON(true, lists);
        if (i < this.Count)
        {
          retStr = retStr + "," + Environment.NewLine;
        }
        ++i;
      }

      retStr = retStr + "]";

      if (incBrackets)
      {
        retStr = retStr + Environment.NewLine + "}";
      }

      return retStr;
    }

    public void DeserializeJSON(object obj, EmraldModel lists, bool useGivenIDs)
    {
      var dynamicObj = (dynamic)obj;
      string curName = "";
      try
      {
        foreach (var wrapper in dynamicObj)
        {
          var item = wrapper;
          Action? curItem = null;
          curName = (string)item.name;

          if (loaded && (item.id != null) && ((int)item.id > 0))
          {
            curItem = this[(int)item.id];
            if (curItem == null)
              throw new Exception("Failed to find Action with id of " + (int)item.id);
          }
          else
          {
            curItem = this.FindByName(curName, false);
            if (curItem != null)
              throw new Exception("Action with the name of " + (string)item.name + " already exists");
          }

          if (curItem == null)
          {
            EnActionType actType = (EnActionType)Enum.Parse(typeof(EnActionType), (string)item.actType, true);
            curItem = CreateNewAction(actType);
          }

          if ((curItem == null) || (!curItem.DeserializeDerived((object)item, false, lists, useGivenIDs)))
            throw new Exception("Failed to deserialize Action List JSON");
        }
      }
      catch (Exception e)
      {
        throw new Exception("On action named " + curName + ". " + e.Message);
      }
    }

    public bool LoadLinks(object obj, EmraldModel lists)
    {
      var dynamicObj = (dynamic)obj;

      foreach (var wrapper in dynamicObj)
      {
        var item = wrapper;
        if (item == null)
          throw new Exception("LoadLinks item is null should not be.");

        string itemName = (string)item.name; // Explicit cast to string
        Action? curItem = this.FindByName(itemName);
        try
        { 
          if (curItem == null)
          {
            throw new Exception("Failed to find Action with the name of " + (string)item!.name);
          }

          if (!curItem.LoadObjLinks((object)item, false, lists))
            throw new Exception("Failed to deserialize Action List JSON");
        }

        catch (Exception e)
        {
          throw new Exception("On Action named " + curItem!.name + ". " + e.Message);
        }
      }  


      return true;
    }

    public void CompileCodes(EmraldModel lists)
    {
      foreach (var item in this)
      {
        if ((item.Value is VarValueAct) || (item.Value is VarValueDLLAct))
        {
          // In distribution mode the action has no scriptCode to compile.
          // Also skip when there's literally no script content to compile (defensive: covers
          // any path where useDistribution might not be set yet but the JSON had no scriptCode).
          if (item.Value is VarValueAct vva)
          {
            if (vva.useDistribution || string.IsNullOrWhiteSpace(vva.scriptCode))
              continue;
          }
          try
          {
            ((VarValueAct)item.Value).CompileCode(lists.allVariables);
          }
          catch (Exception e)
          {
            throw new Exception("Action \"" + item.Value.name + " \" - " + e.Message);
          }

        }

        if (item.Value is RunExtAppAct)
        {
          try
          {
            ((RunExtAppAct)item.Value).CompileMakeInputFileCode(lists);
          }
          catch (Exception e)
          {
            throw new Exception("Action \"" + item.Value.name + " \"  preprocessor code - " + e.Message);
          }
          if ((((RunExtAppAct)item.Value).processOutputFileCode != null) && (((RunExtAppAct)item.Value).processOutputFileCode != ""))
          {
            try
            {
              ((RunExtAppAct)item.Value).CompileProcessOutputFileCode(lists);
            }
            catch (Exception e)
            {
              throw new Exception("Action \"" + item.Value.name + " \" postprocessing code -" + e.Message);
            }
          }
        }
      }
    }

    public List<ScanForReturnItem> ScanFor(ScanForTypes scanType, EmraldModel lists)
    {
      var foundList = new List<ScanForReturnItem>();
      //Return any listItems that actions could have with reference when multithreading

      foreach (var curItem in this.Values)
      {
        foundList.AddRange(curItem.ScanFor(scanType, lists.rootPath));        
      }

      return foundList;
    }
  }

}
