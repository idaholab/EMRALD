// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.CodeDom.Compiler;
using ScriptEngineNS;
//using System.Windows.Forms;
using System.Data;
//using System.Web.Helpers;
using System.Diagnostics;
//using SimulationTracking;
using System.IO;
using System.Threading;
using Newtonsoft.Json.Linq;
using MessageDefLib;
using System.Xml;

namespace SimulationDAL
{
  //using HoudiniSimRunner;

  public abstract class Action : BaseObjInfo
  {
    protected EnActionType _actType = EnActionType.atTransition;
    public EnActionType actType { get { return _actType; } }
    public bool mainItem = false;

    //public EnActionType actType;


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
  }
    

  public class TransitionAct : Action //atTransition
  {
    private List<State> _newStateIDs = new List<State>(); //possible states to travel to for this transition     
    private List<Double> _toStateProb = new List<double>();
    private List<SimVariable> _toStateVarProb = new List<SimVariable>();
    private List<string> _failDesc = new List<string>();
    protected bool mutExcl = true;

    private bool hasVarProbs = false;
    public List<string> failDesc { get { return _failDesc; } set { _failDesc = value; } }

    public bool mutuallyExclusive { get { return this.mutExcl; } set { this.mutExcl = value; } }

    //double[] bounds = null;

    public TransitionAct()
      : base("", EnActionType.atTransition)
    { }

    public TransitionAct(string name)
      : base(name, EnActionType.atTransition)
    { }

    public override string GetDerivedJSON(EmraldModel lists)
    {
      string retStr = "";
      retStr = retStr + "\"mutExcl\": \"" + this.mutExcl.ToString() + "\"";
      retStr = retStr + "," + Environment.NewLine + "\"newStates\": [";
      string varProbStr;
      for (int i = 0; i < this._newStateIDs.Count; ++i)
      {
        varProbStr = this._toStateVarProb[i] == null ? "null" : this._toStateVarProb[i].name;
        //retStr = retStr + Environment.NewLine + "{" + this._newStateIDs[i].GetJSON(false, false) + ",";
        retStr = retStr + Environment.NewLine + "{\"toState\": \"" + this._newStateIDs[i].name + "\",";
        retStr = retStr + Environment.NewLine + "\"prob\":" + this._toStateProb[i].ToString() + ",";
        retStr = retStr + Environment.NewLine + "\"varProb\": \"" + varProbStr + "\",";
        retStr = retStr + Environment.NewLine + "\"failDesc\":\"" + this._failDesc[i] + "\"}";
        if (i < this._newStateIDs.Count - 1)
        {
          retStr = retStr + "," + Environment.NewLine;
        }
      }

      retStr = retStr + "]";
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

      mutExcl = Convert.ToBoolean(dynObj.mutExcl);

      lists.allActions.Add(this, false);

      //Done in LoadObjLinks()
      ////load the transition list
      //if (dynObj.newStates != null)
      //{
      //  _newStateIDs.Clear();
      //  _toStateProb.Clear();

      //  foreach (dynamic curToObj in dynObj.newStates)
      //  {
      //    State curState = lists.allStates.FindByName((string)curToObj.toState);
          
      //    if (curState == null)
      //    {
      //      //create a place holder for the state until the rest of the data is filled in.
      //      curState = new State();
      //      curState.name = (string)curToObj.toState;
      //      lists.allStates.Add(curState);
      //    }
          
      //    _newStateIDs.Add(curState);
      //    _toStateProb.Add((double)curToObj.prob);
      //    _failDesc.Add((string)curToObj.failDesc);
      //  }
      //}

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

        //RecalcBoundBoxes();
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


    //private void RecalcBoundBoxes()
    //{
    //  if (_toStateProb[_toStateProb.Count - 1] != -1)
    //    return;

    //  if (_toStateProb.Count() <= 0) return;

    //  double probSum = 0;
    //  double remProb = 1.0;
    //  for (int i=0; i< _toStateProb.Count; ++i)
    //  {
    //    if (_toStateVarProb[i] != null)
    //    {
    //      _toStateProb[i] = _toStateVarProb[i].value;
    //      if (_toStateProb[i] < 0)
    //        if (i < (_toStateProb.Count - 1))
    //          throw new Exception("More than 1 to state is trying to use the remaining probability.");
    //        else
    //        {
    //          probSum += _toStateProb[i];
    //          remProb = remProb - (remProb * _toStateProb[i]);
    //        }
    //    }
    //  }

    //  if ((this._toStateProb[_toStateProb.Count() - 1] < 0) && (!mutuallyExclusive))
    //  {
    //    if (probSum < 1)
    //    {
    //      probSum = probSum + (1 - probSum);
    //    }
    //    else
    //      throw new Exception("Remainder to State will never be hit, the Probabilities add up to more than 1.0. Action - " + this.name);
    //  }
  
      
    //  //double remProb = 1.0;
    //  //for (int i = 0; i < _toStateProb.Count(); ++i)
    //  //{
    //  //  if (_toStateProb[i] >= 0)
    //  //  {
    //  //    remProb = remProb - (remProb * _toStateProb[i]);
    //  //  }
    //  //  else if (i < _toStateProb.Count - 1)
    //  //  {
    //  //    throw new Exception("More than 1 to state is trying to use the remaining probability.");
    //  //  }
    //  //}

    //  bounds = new double[_toStateProb.Count()]; 
    //  if(mutuallyExclusive) //redistribute the bounding boxes as a % of the (1-remProb)
    //  {

    //    for (int i = 0; i < _toStateProb.Count(); ++i)
    //    {
    //      if (_toStateProb[i] >= 0)
    //        bounds[i] = ((1-remProb)/probSum)*_toStateProb[i];
    //      else
    //        bounds[i] = 1;
    //    }
    //  }
    //  else //redistribute the bounding boxes and use overlapping for multiple to states.
    //  {
    //    double prevBound = 0;
    //    for (int i = 0; i < _toStateProb.Count(); ++i)
    //    {
    //      if (_toStateProb[i] >= 0)
    //      {
    //        bounds[i] = _toStateProb[i] + (_toStateProb[i] - (_toStateProb[i] * prevBound));
    //        prevBound = bounds[i];
    //      }
    //      else
    //        bounds[i] = 1;
    //    }
    //  }
    //}

    //private void RecalcBoundBoxes()
    //{
    //  if (_toStateProb[_toStateProb.Count - 1] != -1)
    //    return;

    //  double probSum = this._toStateProb.Sum();
    //  if (_toStateProb.Count() <= 0) return;

    //  if (this._toStateProb[_toStateProb.Count() - 1] < 0)
    //    probSum = probSum + 1;

    //  bounds = new double[_toStateProb.Count()];

    //  double remProb = 1.0;
    //  for (int i = 0; i < _toStateProb.Count(); ++i)
    //  {
    //    if (_toStateProb[i] >= 0)
    //    {
    //      remProb = remProb - (remProb * _toStateProb[i]);
    //    }
    //    else if (i < _toStateProb.Count - 1)
    //    {
    //      throw new Exception("More than 1 to state is trying to use the remaining probability.");
    //    }
    //  }


    //  if (mutuallyExclusive) //redistribute the bounding boxes as a % of the (1-remProb)
    //  {

    //    for (int i = 0; i < _toStateProb.Count(); ++i)
    //    {
    //      if (_toStateProb[i] >= 0)
    //        bounds[i] = ((1 - remProb) / probSum) * _toStateProb[i];
    //      else
    //        bounds[i] = 1;
    //    }
    //  }
    //  else //redistribute the bounding boxes and use overlapping for multiple to states.
    //  {
    //    double prevBound = 0;
    //    for (int i = 0; i < _toStateProb.Count(); ++i)
    //    {
    //      if (_toStateProb[i] >= 0)
    //      {
    //        bounds[i] = _toStateProb[i] + (_toStateProb[i] - (_toStateProb[i] * prevBound));
    //        prevBound = bounds[i];
    //      }
    //      else
    //        bounds[i] = 1;
    //    }
    //  }
    //}

    public List<IdxAndStr> WhichToState()
    {
      if (hasVarProbs)
        for(int i=0; i<_toStateVarProb.Count; ++i)
        {
          if (_toStateVarProb[i] != null)
            _toStateProb[i] = _toStateVarProb[i].dblValue;
        }

      List<IdxAndStr> retStateIDs = new List<IdxAndStr> { };
      double probSum = _toStateProb.Sum();
      if (mutExcl && (probSum > 0) && (probSum < 1.0) && (_toStateProb[_toStateProb.Count-1] > 0))
      {
#if DEBUG
        throw new Exception("For action " + this.name + " Transition and probabilities don't add up to 1.0 or no default value");
#else
        System.Diagnostics.Debug.Write("No default state entered for " + this.name + " Transition and proabilites don't add up to 1.0");
        return retStateIDs;
#endif
      }
      else if (_toStateProb.Count == 0) 
        throw new Exception(this.name + " has no _toSateProbs in list - no TO state added to the action.");
//      else if (mutExcl && (_toStateProb[_toStateProb.Count - 1] != -1) && (_toStateProb[_toStateProb.Count - 1] != 1))
//      {
//#if DEBUG
//        throw new Exception("Missing default option for independent failures " + this.name);
//#else
//        System.Diagnostics.Debug.Write("Missing default option for independent failures. " + this.name);
//        return retStateIDs;
//#endif
//      }
      else if ((_newStateIDs.Count < 1) || (_newStateIDs.Count != _toStateProb.Count))
      {
#if DEBUG
        throw new Exception("Either no to State for this Transition or miss. " + this.name);
#else
        System.Diagnostics.Debug.Write("No to State for this Transition is an error. " + this.name);
        return retStateIDs;
#endif
      }
      else if (mutExcl &&((_toStateProb[0] == 1.0) || (_toStateProb[0] == -1.0)))
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

      if (retStateIDs.Count == 0) //no probability items were selected we must use the default state
        retStateIDs.Add(new IdxAndStr(_newStateIDs[_toStateProb.Count - 1].id, _failDesc[_toStateProb.Count-1]));

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
    protected ScriptEngine scriptRunner = null;
    protected List<String> codeVariables = new List<String>();
    protected bool compiled = false;
    protected Type _retType = typeof(double);

    public string scriptCode = "";
   
    public ScriptAct(EnActionType actType)
      : base("", actType)
    {
      this.compiled = false;
    }

    public ScriptAct(string inName, string inScriptCode, List<String> inCodeVars, EnActionType actType)
      : base(inName, actType)
    {
      this.compiled = false;
      if (inCodeVars != null)
        this.codeVariables = new List<String>(inCodeVars);
      this.scriptCode = inScriptCode;
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
            if ((string)varName != "CurTime")
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
      scriptRunner = new ScriptEngine("Act_" + this.name, ScriptEngine.Languages.CSharp, scriptCode);

      //add the Time and 3D Frame variables
      scriptRunner.AddVariable("CurTime", typeof(double));
      scriptRunner.AddVariable("ExtSimStartTime", typeof(double));

      //add all the variables needed
      if (codeVariables != null)
      {
        foreach (string varName in codeVariables)
        {
          SimVariable var = allVars.FindByName(varName);

          if(var == null)
            throw new Exception("failed to compile " + this.name + " no variable named " + varName + " defined in the diagram.");

          if ((varName != "CurTime") &&
              (varName != "ExtSimStartTime"))
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
      }

      return this.compiled;
    }
  }

  public class VarValueAct : ScriptAct //atCngVarVal
  {
    public SimVariable simVar = null;
    //public int varID { get { return simVar.id; } }
    public int varID { get { return (simVar != null) ? simVar.id : 0; } }
    //public bool isTimeStateVar { get { return this.simVar is TimeStateVariable; } }  
    
    public VarValueAct()
      : base(EnActionType.atCngVarVal) { }

    //public VarValueAct(string inName, TimeStateVariable inSimVar)
    // : this(inName, inSimVar, "", typeof(double), null)
    //{ }

    public VarValueAct(string inName, SimVariable inSimVar, string inNewValCode, Type inRetType, List<String> inCodeVars)
      : base(inName, inNewValCode, inCodeVars, EnActionType.atCngVarVal)
    {
      this.simVar = inSimVar;
      if((inRetType != typeof(double)) && (inRetType != typeof(string)) &&  (inRetType != typeof(bool)))
        throw new Exception("This return type is not implemented " + inRetType.Name);
      this._retType = inRetType;
    }

    public override string GetDerivedJSON(EmraldModel lists)
    {
      string newValStr = scriptCode.Replace("\n", "\\n").Replace("\r", "\\r");
      
      string retStr = base.GetDerivedJSON(lists);
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

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

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
          throw new Exception("Failed to find the Variable " + simVar.name);
        }

        this._retType = simVar.dType;
      }

      base.LoadObjLinks(obj, wrapped, lists);
      if (!codeVariables.Contains(simVar.name))
      {
        this.codeVariables.Add(simVar.name);
      }

      return true;
    }

    public void SetVal(SimVariable toSetVar, EmraldModel lists, TimeSpan curSimTime, TimeSpan start3DTime)
    {
      //if(this.simVar is TimeStateVariable)
      //{
      //  throw new Exception("SetVal this should not be called for a TimeStateVariable");
      //}

      if (!this.compiled)
      {
        if (scriptCode == "")
        {
          throw new Exception("No code for " + this.name);
        }

        if (!CompileCode(lists.allVariables))
          throw new Exception("Code failed compile, can not evaluate");
      }

      scriptRunner.SetVariable("CurTime", typeof(double), curSimTime.TotalHours);
      scriptRunner.SetVariable("ExtSimStartTime", typeof(double), start3DTime.TotalHours);

      if (codeVariables != null)
      {
        foreach (string varName in codeVariables)
        {
          SimVariable simVar = lists.allVariables.FindByName(varName);
          if (simVar == null)
            throw new Exception("Failed to find variable named " + varName);
          scriptRunner.SetVariable(varName, simVar.dType, simVar.value);
        }
      }

      toSetVar.SetValue(scriptRunner.EvaluateGeneric());

      //if (this.retType == typeof(double))
      //{
      //  toSet = scriptRunner.Evaluate();
      //  if ((retVal < 0) || double.IsNaN(retVal))
      //  {
      //    System.Diagnostics.Debug.Write("Invalid Return Value");
      //  }
      //  return retVal;
      //}

      //if (this.retType == typeof(string))
      //{
      //  string retVal = scriptRunner.EvaluateString();
      //  if ((retVal < 0) || double.IsNaN(retVal))
      //  {
      //    System.Diagnostics.Debug.Write("Invalid Return Value");
      //  }
      //  return retVal;
      //}

      
      
      
    }
  }

  public class JumpToTimeAct : VarValueAct //atJumpToTime
  {
    //TimeStateVariable savedTime = null;

    public JumpToTimeAct()
      : base() 
    {
      this._actType = EnActionType.atJumpToTime; 
    }

    //public JumpToTimeAct(string inName, TimeStateVariable saved)
    //  : base(inName, saved, "", typeof(double), null)
    //  //: base(inName, "", null, EnActionType.atJumpToTime)
    //{
    //  this._actType = EnActionType.atJumpToTime;
    //  this._retType = typeof(double);
    //  savedTime = saved;
    //}

    public JumpToTimeAct(string inName, string inNewValCode, List<String> inCodeVars)
      : base(inName, null, inNewValCode, typeof(double), inCodeVars)
    {
      this._actType = EnActionType.atJumpToTime;
    }

    //public TimeStateVariable SavedSlot() { return savedTime; }

    public void SetVal(ref double toSet, EmraldModel lists, TimeSpan curSimTime, TimeSpan start3DTime)
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

      scriptRunner.SetVariable("CurTime", typeof(double), curSimTime.TotalHours);
      scriptRunner.SetVariable("ExtSimStartTime", typeof(double), start3DTime.TotalHours);

      if (codeVariables != null)
      {
        foreach (string varName in codeVariables)
        {
          SimVariable simVar = lists.allVariables.FindByName(varName);
          if (simVar == null)
            throw new Exception("Failed to find variable named " + varName);
          scriptRunner.SetVariable(varName, typeof(double), simVar.value);
        }
      }

      toSet = (double)scriptRunner.EvaluateGeneric();
    }
  }

  public class CustomStateShiftAct : ScriptAct //atCustomStateShift
  {

    public CustomStateShiftAct()
      : base(EnActionType.atCustomStateShift) { }

    public CustomStateShiftAct(string inName, SimVariable inSimVar, string inScriptCode, List<String> inCodeVars)
      : base(inName, inScriptCode, inCodeVars, EnActionType.atCngVarVal) {}


    public bool CompileCode(EmraldModel lists)
    {
      if (scriptCode == "")
      {
        return false;
      }

      this.compiled = false;
      scriptRunner = new ScriptEngine("JumpAct_" + this.name, ScriptEngine.Languages.CSharp);
      scriptRunner.Code = scriptCode; // "Result = var1+3;";

      //add the Time and 3D Frame variables
      scriptRunner.AddVariable("CurTime", typeof(Double));
      scriptRunner.AddVariable("ExeExitCode", typeof(int));

      //add all the variables needed
      if (codeVariables != null)
      {
        foreach (string varName in codeVariables)
        {
          if ((varName != "CurTime") &&
              (varName != "ExeExitCode"))
          {
            scriptRunner.AddVariable(varName, typeof(double));
          }
        }
      }

      scriptRunner.AddVariable("outputFile", typeof(string));

      //add all the states
      foreach (KeyValuePair<int, State> state in lists.allStates)
      {
        //todo see if there are any variables with the name of the state
        scriptRunner.AddVariable(state.Value.name, typeof(bool));
        scriptRunner.AddVariable(state.Value.name + "_Time", typeof(TimeSpan));
      }


      if (!scriptRunner.Compile(typeof(List<string>)))
      {
        throw new Exception("failed to compile code - " + String.Join(Environment.NewLine, scriptRunner.messages.ToArray()) + Environment.NewLine + scriptCode);
      }
      else
      {
        this.compiled = true;
      }

      return this.compiled;
    }

    public void GetNewStateShifts(EmraldModel lists, ref List<int> addStates, ref List<int> removeStates)
    {
      if (!this.compiled)
      {
        if (!CompileCode(lists))
          throw new Exception("Code for - " + this.name + " failed to compile, can not evaluate");
      }

      //Set all the variable values
      if (codeVariables != null)
      {
        foreach (string varName in codeVariables)
        {
          SimVariable curVar = lists.allVariables.FindByName(varName);
          if (curVar == null)
            throw new Exception("Failed to find variable named " + varName);

          scriptRunner.SetVariable(curVar.name, typeof(double), curVar.value);
        }
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

  public class RunExtAppAct : Action //atRunExtApp
  {
    private string exePath = "";
    
    private ScriptEngine makeInputFileCompEval = null;
    private ScriptEngine processOutputFileCompEval = null;
    private List<String> codeVariables = new List<String>();
    private bool compiled;
    private ProcessStartInfo extApp = null;
    private Process proc = null;
    private string exeOutputPath = "";

    public string makeInputFileCode = "";
    public string processOutputFileCode = "";
    
    public RunExtAppAct()
      : base("", EnActionType.atRunExtApp)
    {
      this.compiled = false;
    }

    public RunExtAppAct(string inName, string inMakeInputFileCode, string inProcessOutputCode, List<String> inCodeVariables, string inExePath, string inExeOutputPath = "")
      : base(inName, EnActionType.atRunExtApp)
    {
      this.compiled = false;
      if(inCodeVariables != null)
        this.codeVariables = new List<String>(inCodeVariables);

      this.makeInputFileCode = inMakeInputFileCode;
      this.processOutputFileCode = inProcessOutputCode;
      this.exePath = inExePath;
      if (inExeOutputPath != "")
        this.exeOutputPath = inExeOutputPath;
      else
        this.exeOutputPath = Path.GetDirectoryName(System.Reflection.Assembly.GetEntryAssembly().Location);


    }

    public override string GetDerivedJSON(EmraldModel lists)
    {

      string code1Str = makeInputFileCode.Replace("\\", "\\\\").Replace("\n", "\\n").Replace("\r", "\\r").Replace("\"", "\\\""); //
      string code2Str = processOutputFileCode.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\n", "\\n").Replace("\r", "\\r");
      string exePathStr = exePath.Replace("\\", "\\\\").Replace("\"", "\\\"");
      //JObject codeJson1 = new JObject();
      //codeJson1.Add("code", code1Str);
      //JObject codeJson2 = new JObject();
      //codeJson2.Add("code", code2Str);
      //code1Str = codeJson1.ToString();
      //code2Str = codeJson2.ToString();
      //code1Str = code1Str.Substring(14, code1Str.Length - 18);
      //code2Str = code2Str.Substring(14, code2Str.Length - 18);



      string retStr = Environment.NewLine + "\"makeInputFileCode\":" + "\"" + code1Str + "\"";
      retStr = retStr + "," + Environment.NewLine + "\"processOutputFileCode\":" + "\"" + code2Str + "\"";
      retStr = retStr + "," + Environment.NewLine + "\"exePath\":" + "\"" + exePathStr + "\"";
      retStr = retStr + "," + Environment.NewLine + "\"exeOutputPath\":" + "\"" + exeOutputPath + "\"";

      //string codeStr = "{\"processOutputFileCode\":" + "\"" + code2Str + "\"}";

      //JObject retJO = new JObject();
      //retJO.Add("code", code2Str);
      //string jStr = retJO.ToString();
      //var dynamicObj = Json.Decode(jStr);


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

      if (Path.IsPathRooted(exePath))
      {
        if (!exePath.StartsWith("cmd.exe") && !File.Exists(exePath))
          throw new Exception("Executable path for the \"RunApplication\" action does not exist ! - " + exePath);
      }
      else
      {
        if (!exePath.StartsWith("cmd.exe") && !File.Exists(System.IO.Directory.GetCurrentDirectory() + "\\" + exePath))
          throw new Exception("Executable path for the \"RunApplication\" action does not exist ! - " + exePath);
      }

      if (dynObj.exeOutputPath == null)
        this.exeOutputPath = Directory.GetParent(System.IO.Directory.GetCurrentDirectory()).FullName;// Path.GetDirectoryName(System.Reflection.Assembly.GetEntryAssembly().Location);
      else
        exeOutputPath = (string)dynObj.exeOutputPath;

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
      

      return true;
    }

    public bool CompileMakeInputFileCode(EmraldModel lists)
    {
      if (makeInputFileCode == "")
      {
        return false;
      }

      this.compiled = false;
      makeInputFileCompEval = new ScriptEngine("RunExtAppAct_Pre_" + this.name, ScriptEngine.Languages.CSharp);
      makeInputFileCompEval.Code = makeInputFileCode; // "Result = var1+3;";

      //add the Time and 3D Frame variables
      makeInputFileCompEval.AddVariable("CurTime", typeof(double));
      makeInputFileCompEval.AddVariable("ExePath", typeof(string));

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
              (varName != "ExtSimStartTime"))
          {
            makeInputFileCompEval.AddVariable(varName, var.dType);
          }
          
        }
      }

      //add all the states
      foreach (KeyValuePair<int, State> state in lists.allStates)
      {
        //todo see if there are any variables with the name of the state
        makeInputFileCompEval.AddVariable(state.Value.name, typeof(bool));
        makeInputFileCompEval.AddVariable(state.Value.name + "_Time", typeof(TimeSpan));
      }

      

      if (!makeInputFileCompEval.Compile(typeof(string)))
      {
        throw new Exception("failed to compile code - " + String.Join(Environment.NewLine, makeInputFileCompEval.messages.ToArray()) + Environment.NewLine + makeInputFileCode);
      }
      else
      {
        this.compiled = true;
      }

      return this.compiled;
    }

    public bool CompileProcessOutputFileCode(EmraldModel lists)
    {
      if (processOutputFileCode == "")
      {
        return false;
      }

      this.compiled = false;
      processOutputFileCompEval = new ScriptEngine("RunExtAppAct_Post_" + this.name, ScriptEngine.Languages.CSharp);
      processOutputFileCompEval.Code = processOutputFileCode; // "Result = var1+3;";

      //add the Time and 3D Frame variables
      processOutputFileCompEval.AddVariable("CurTime", typeof(Double));
      processOutputFileCompEval.AddVariable("ExeExitCode", typeof(int));

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
              (varName != "ExeExitCode"))
          {
            processOutputFileCompEval.AddVariable(varName, var.dType);
          }
        }
      }

      processOutputFileCompEval.AddVariable("outputFile", typeof(string));

      //add all the states
      foreach (KeyValuePair<int, State> state in lists.allStates)
      {
        //todo see if there are any variables with the name of the state
        processOutputFileCompEval.AddVariable(state.Value.name, typeof(bool));
        processOutputFileCompEval.AddVariable(state.Value.name + "_Time", typeof(TimeSpan));
      }


      if (!processOutputFileCompEval.Compile(typeof(List<string>)))
      {
        throw new Exception("failed to compile code - " + String.Join(Environment.NewLine, processOutputFileCompEval.messages.ToArray()) + Environment.NewLine + processOutputFileCode);
      }
      else
      {
        this.compiled = true;
      }

      return this.compiled;
    }


    private void WriteStandardOutput()
    {
      using (StreamWriter writer = File.CreateText(exeOutputPath + "\\_out.txt"))
      using (StreamReader reader = proc.StandardOutput)
      {
        writer.AutoFlush = true;

        for (; ; )
        {
          string textLine = reader.ReadLine();

          if (textLine == null)
            break;

          writer.WriteLine(textLine);
          Console.Out.WriteLine(textLine);
        }
      }

      if (File.Exists(exeOutputPath + "\\_out.txt"))
      {
        FileInfo info = new FileInfo(exeOutputPath + "\\_out.txt");

        // if the error info is empty or just contains eof etc.

        if (info.Length < 4)
          info.Delete();
      }
    }

    public void RunExtApp(Dictionary<int, TimeSpan> curStatesTime, TimeSpan curTime, EmraldModel lists, ref List<int> addStates, ref List<int> removeStates)
    {
      if (!this.compiled)
      {
        if (!CompileMakeInputFileCode(lists))
          throw new Exception("MakeInputFile Code failed to compile, can not evaluate");

        if (!CompileProcessOutputFileCode(lists))
          throw new Exception("ProcessOutputFile Code failed compile, can not evaluate");
      }

      //Set all the variable values
      if (codeVariables != null)
      {
        foreach (string varName in codeVariables)
        {
          SimVariable curVar = lists.allVariables.FindByName(varName);
          if (curVar == null)
            throw new Exception("Failed to find variable named " + varName);

          makeInputFileCompEval.SetVariable(curVar.name, curVar.dType, curVar.value);
          processOutputFileCompEval.SetVariable(curVar.name, curVar.dType, curVar.value);
        }

        makeInputFileCompEval.SetVariable("CurTime", typeof(double), curTime.TotalHours);
        makeInputFileCompEval.SetVariable("ExePath", typeof(string), Path.GetDirectoryName(exePath));
        
      }

      //add if in states
      foreach (KeyValuePair<int, State> state in lists.allStates)
      {
        TimeSpan stateTime;
        if (curStatesTime.TryGetValue(state.Value.id, out stateTime))
        {
          makeInputFileCompEval.SetVariable(state.Value.name, typeof(bool), true);
          makeInputFileCompEval.SetVariable(state.Value.name + "_Time", typeof(TimeSpan), stateTime);
          processOutputFileCompEval.SetVariable(state.Value.name, typeof(bool), true);
          processOutputFileCompEval.SetVariable(state.Value.name + "_Time", typeof(TimeSpan), stateTime);
        }
        else
        {
          makeInputFileCompEval.SetVariable(state.Value.name, typeof(bool), false);
          makeInputFileCompEval.SetVariable(state.Value.name + "_Time", typeof(TimeSpan), TimeSpan.FromMilliseconds(0));
          processOutputFileCompEval.SetVariable(state.Value.name, typeof(bool), false);
          processOutputFileCompEval.SetVariable(state.Value.name + "_Time", typeof(TimeSpan), TimeSpan.FromMilliseconds(0));
        }
      }

      string runParams = makeInputFileCompEval.EvaluateString();

      NLog.Logger logger = NLog.LogManager.GetLogger("logfile");
      logger.Info("Executing - " + exePath + " " + runParams);

      int exitCode;
      if (runParams != null)
      {
        if (!File.Exists(exePath) && !exePath.Contains("cmd.exe"))
          throw new Exception("No executable specified for RunExtApp - " + this.name);

        if (exePath.Contains("cmd.exe"))
          runParams = "/K " + runParams;

        //Start the executable
        extApp = new ProcessStartInfo();
        extApp.Arguments = runParams;
        extApp.FileName = exePath; // Path.GetFileName(exePath);
        extApp.WorkingDirectory = Path.GetDirectoryName(exePath);
        extApp.UseShellExecute = false;
        extApp.RedirectStandardOutput = false;
        extApp.RedirectStandardError = false;

        // Do you want to show a console window?
        //extApp.WindowStyle = Hidden.ProcessWindowStyle;
        //extApp.CreateNoWindow = true;

        // Run the external process & wait for it to finish
        using (proc = Process.Start(extApp))
        {
          //Thread stdOutThread = new Thread(new ThreadStart(WriteStandardOutput));
          //stdOutThread.IsBackground = true;
          //stdOutThread.Name = "StandardOutput";
          //stdOutThread.Start();

          proc.WaitForExit();
          //stdOutThread.Join();

          // Retrieve the app's exit code
          exitCode = proc.ExitCode;
          proc.Close();
          //if (exitCode > 0) //don't quit on bad exit code, add it as a variable and allow the user to define what to do
          //  throw new Exception("Failed to run external code - " + exePath + ".   exit code - " + exitCode.ToString());
        }
      }
      else 
        exitCode = -1;

      processOutputFileCompEval.SetVariable("CurTime", typeof(double), curTime.TotalHours);
      processOutputFileCompEval.SetVariable("ExeExitCode", typeof(int), exitCode);
      processOutputFileCompEval.SetVariable("outputFile", typeof(string), exeOutputPath + "\\_out.txt");


      List<String> retStates = processOutputFileCompEval.EvaluateStrList();
      System.Threading.Thread.Sleep(10);

      while (File.Exists(Path.GetDirectoryName(exePath) + "\\_out.txt"))
      {
        try
        {
          System.IO.File.Delete(Path.GetDirectoryName(exePath) + "\\_out.txt");
        }
        catch
        {
          //do nothing;
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
    }

  }

  public class Sim3DAction : Action //at3DSim
  {
    //Sim3DInfo sim3D;
    public SimActionType sim3DMessage = SimActionType.atOpenSim;

    public Sim3DVariable simVar = null;
    public int? varID { get { return simVar == null ? 0 : simVar.id; } }
    //public String modelRef = null;
    //public String configData = null;
    private ExternalSim _extSim;
    public bool openSimVarParams = false;
    public TimeSpan simMaxTime { get { return _extSim.simMaxTime; } }
    public String resourceName { get { return _extSim.resourceName; } }



    public Sim3DAction()
      : base("", EnActionType.at3DSimMsg){ }

    public Sim3DAction(string inName, SimActionType message, ExternalSim simData, SimVariable inSimVar = null, String inParams = "")
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

      string retStr = "," + Environment.NewLine + "\"sim3DMessageID\":" + "\"" + sim3DMessage.ToString() + "\"";
      retStr = retStr + "," + Environment.NewLine + "\"extSim\":" + "\"" + _extSim.name + "\"";
      if (this.simVar != null)
        retStr = retStr + "," + Environment.NewLine + "\"sim3DVariable\":" + "\"" + simVar.name + "\"";
      if (this._extSim != null)
        retStr = retStr + "," + Environment.NewLine + "\"sim3DModelRef\":" + "\"" + _extSim.modelRef + "\"";
      if (this._extSim != null)
        retStr = retStr + "," + Environment.NewLine + "\"sim3DConfigData\":" + "\"" + _extSim.configData + "\"";
      retStr = retStr + "," + Environment.NewLine + "\"openSimVarParams\":" + openSimVarParams.ToString();
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

      //sim3DMessage = dynObj.sim3DMessage;

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
      if (dynObj.openSimVarParams != null)
      {
        if((_extSim.modelRef != "") && (lists.allVariables.FindByName(_extSim.modelRef) == null))
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
      string retVal = _extSim.modelRef;
      if (openSimVarParams)
      {
         retVal = lists.allVariables.FindByName(_extSim.modelRef, true).strValue;
      }

      return retVal;
    }

    public string ConfigData(EmraldModel lists)
    {
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

      this.moveFromCurrent = (bool)dynObj.moveFromCurrent;

      if (dynObj.actions != null)
      {
        foreach (var toActName in dynObj.actions)
        {
          Action curAct = lists.allActions.FindByName((string)toActName);

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

    public Action FindByName(string name, bool exception = true)
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

    public static Action CreateNewAction(EnActionType actType)
    {
      Action retAct = null;

      switch (actType)
      {
        case EnActionType.at3DSimMsg: retAct = new Sim3DAction(); break;
        case EnActionType.atCngVarVal: retAct = new VarValueAct(); break;
        case EnActionType.atTransition: retAct = new TransitionAct(); break;
        case EnActionType.atRunExtApp: retAct = new RunExtAppAct(); break;
        case EnActionType.atCustomStateShift: retAct = new CustomStateShiftAct(); break;
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
          var item = wrapper.Action;
          Action curItem = null;
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

          if (!curItem.DeserializeDerived((object)item, false, lists, useGivenIDs))
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
        var item = wrapper.Action;
        
        Action curItem = this.FindByName((string)item.name);
        try
        { 
          if (curItem == null)
          {
            throw new Exception("Failed to find Action with the name of " + (string)item.name);
          }

          if (!curItem.LoadObjLinks((object)item, false, lists))
            throw new Exception("Failed to deserialize Action List JSON");
        }

        catch (Exception e)
        {
          throw new Exception("On Action named " + curItem.name + ". " + e.Message);
        }
      }  


      return true;
    }

    public void CompileCodes(EmraldModel lists)
    {
      foreach(var item in this)
      {
        if(item.Value is VarValueAct)
        {
          try
          {
            ((VarValueAct)item.Value).CompileCode(lists.allVariables);
          }
          catch (Exception e)
          {
            throw new Exception("Action \"" + item.Value.name + " \" - " + e.Message);
          }
          
        }

        if(item.Value is RunExtAppAct)
        {
          try
          {
            ((RunExtAppAct)item.Value).CompileMakeInputFileCode(lists);
          }
          catch (Exception e)
          {
            throw new Exception("Action \"" + item.Value.name + " \"  preprocessor code - " + e.Message);
          }

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

}
