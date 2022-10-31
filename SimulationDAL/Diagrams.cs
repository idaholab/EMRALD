// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
//using System.Windows.Forms;
using MyStuff.Collections;
//using System.Web.Helpers;

namespace SimulationDAL
{
  public class Diagram : BaseObjInfo
  {
    //protected dSimulation _Sim = null;
    protected List<State> _States = null;
    public EnDiagramType diagType = EnDiagramType.dtOther;
    protected int maxStateID = 0;
   

    public Diagram()
    {
      this._id = SingleNextIDs.Instance.NextID(EnIDTypes.itDiagram);
      this._States = new List<State>();
      //_Sim = inSim;
    }

    public Diagram(string inName, EnDiagramType inDiagType)
    {
      this._id = SingleNextIDs.Instance.NextID(EnIDTypes.itDiagram);

      //this._Sim = inSim;
      this.diagType = inDiagType;
      this.name = inName;
      this._States = new List<State>();
    }

    public void Clear()
    {
      this._States.Clear();
    }

    public void AddState(State addState)
    {
      bool found = false;
      foreach (State curState in this._States)
      {
        if (curState.name == addState.name)
        {
          found = true;
          break;
        }
      }

      if (!found)
        this._States.Add(addState);
    }

    public virtual string GetDerivedJSON(EmraldModel lists)
    {
      return "";
    }

    public override string GetJSON(bool incBrackets, EmraldModel lists)
    {
      //EnDiagramType enumTest = (EnDiagramType)Enum.Parse(typeof(EnDiagramType), "dtComponent", true);


      string retStr = "";
      if (incBrackets)
      {
        retStr = "{";
      }
      retStr = retStr + "\"Diagram\": {" + Environment.NewLine + base.GetJSON(false, lists);
      retStr = retStr + "," + Environment.NewLine + "\"diagramType\": \"" + diagType.ToString() + "\"";
      retStr = retStr + "," + Environment.NewLine + "\"states\": [";

      StateSort sorter = new StateSort();
      _States.Sort(sorter);
      //foreach (State curSt in this._States)
      for (int i = 0; i < this._States.Count; ++i)
      {
        retStr = retStr + Environment.NewLine + "\""+ this._States[i].name + "\"";

        if (i < this._States.Count - 1)
        {
          retStr = retStr + "," + Environment.NewLine;
        }
      }

      retStr = retStr + "]" + Environment.NewLine;
      retStr = retStr + GetDerivedJSON(lists) + Environment.NewLine + "}";

      if (incBrackets)
      {
        retStr = retStr + Environment.NewLine + "}";
      }

      return retStr;
    }

    //public override string GetJSONExpanded(bool incBrackets, LookupLists lists, bool includeIDs = true)
    //{
    //  string retStr = "";
    //  if (incBrackets)
    //  {
    //    retStr = "{";
    //  }
    //  retStr = retStr + "\"Diagram\": {" + Environment.NewLine + base.GetJSON(false, lists,);
    //  retStr = retStr + "," + Environment.NewLine + "\"diagramType\": \"" + diagType.ToString() + "\"";
    //  retStr = retStr + "," + Environment.NewLine + "\"states\": [";

    //  StateSort sorter = new StateSort();
    //  _States.Sort(sorter);
    //  //foreach (State curSt in this._States)
    //  for (int i = 0; i < this._States.Count; ++i)
    //  {
    //    retStr = retStr + Environment.NewLine + this._States[i].GetJSON(true, lists);
        

    //    if (i < this._States.Count - 1)
    //    {
    //      retStr = retStr + "," + Environment.NewLine;
    //    }
    //  }

    //  retStr = retStr + "]" + Environment.NewLine;
    //  retStr = retStr + GetDerivedJSON(lists) + Environment.NewLine + "}";

    //  if (incBrackets)
    //  {
    //    retStr = retStr + Environment.NewLine + "}";
    //  }

    //  return retStr;
    //}

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Diagram == null)
          return false;

        dynObj = ((dynamic)obj).Diagram;
      }

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      var jsonDiagType = (EnDiagramType)Enum.Parse(typeof(EnDiagramType), (string)dynObj.diagramType, true);
      if (this.diagType == EnDiagramType.dtOther)
        this.diagType = jsonDiagType;

      if (this.diagType != jsonDiagType)
        throw new Exception("Diagram types do not match, cannot change the type once an item is created!");

      lists.allDiagrams.Add(this);

      //Done in LoadObjLinks()
      ////load the Event Items
      //if (dynObj.states != null)
      //{
      //  this._States.Clear();

      //  foreach (dynamic stateName in dynObj.states)
      //  {
      //    State curState = lists.allStates.FindByName(stateName);
      //    if (curState == null)
      //    {
      //      throw new Exception("Failed to find State - " + stateName);
      //    }
          
      //    this.AddState(curState);
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
        if (dynObj.Diagram == null)
          return false;

        dynObj = ((dynamic)obj).Diagram;
      }

      //load the Event Items
      if (dynObj.states != null)
      {
        this._States.Clear();

        foreach (dynamic stateName in dynObj.states)
        {
          State curState = lists.allStates.FindByName((string)stateName);
          if (curState == null)
          {
            throw new Exception("Failed to find State - " + (string)stateName);
          }

          if(curState.diagram != this)
          {
            throw new Exception("State - " + (string)stateName + " does not have " + this.name + " listed as it's diagram.  Reference missing or trying to make a state belong to more than one diagram.");
          }

          this.AddState(curState);
        }
      }
      return true;
    }

    public virtual void LookupRelatedItems(EmraldModel all, EmraldModel addToList)
    {
      if (addToList.allDiagrams.ContainsKey(this.id))
      {
        return;
      }

      addToList.allDiagrams.Add(this);

      foreach(State curState in this._States)
      {
        curState.LookupRelatedItems(all, addToList);
      }
    }

    public State HasAStateInCurrentStates(MyBitArray currentStates) //return true if a diagrams state is in the current state list.
    {
      foreach (State curSt in _States)
      {
        if ((curSt.id < currentStates.Count) && (currentStates[curSt.id]))
        {
          return curSt;
        }
      }

      return null;
    }
  }


  public abstract class EvalDiagram : Diagram // dtComponent or dtSystem
  {
    private List<int> _okStates = new List<int>(); //TODO may be faster to use a bitset
    private List<int> _singleStateGroup = new List<int>(); //TODO may be faster to use a bitset
    //private bool? value = null;
    private List<int> _failStates = null;

    /// <summary>
    /// Create a component
    /// </summary>
    /// <param name="compStates">Value states for this component can only be in one at a time </param>
    /// <param name="onStates">Which states will be a one or true value for the state </param>

    public EvalDiagram(EnDiagramType inDiagType)
      : base("", inDiagType) { }

    public EvalDiagram(string inName, EnDiagramType inDiagType)
      : base(inName, inDiagType) { }
    

    public override string GetDerivedJSON(EmraldModel lists)
    {
      string retStr = "," + Environment.NewLine + "\"singleStates\": [";
      for (int i = 0; i < this._singleStateGroup.Count; ++i)
      {
        retStr = retStr + Environment.NewLine + "{\"stateName\": \"" + lists.allStates[this._singleStateGroup[i]].name + "\"," +
                                                 "\"okState\":\"" + _okStates.Contains(this._singleStateGroup[i]).ToString() + "\"}";
        if (i < this._singleStateGroup.Count - 1)
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
        if (dynObj.Diagram == null)
          return false;

        dynObj = ((dynamic)obj).Diagram;
      }

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      //Now done in LoadObjLinks()
      ////load the transition list
      //if (dynObj.okStates != null)
      //{
      //  _okStates.Clear();
      //  _singleStateGroup.Clear();

      //  foreach (dynamic curToObj in dynObj.okStates)
      //  {
      //    State curState = lists.allStates.FindByName((string)curToObj.stateName);
      //    if (curState == null)
      //      throw new Exception("Failed to locate ok state " + (string)curToObj.stateName + " in state list");

      //    _okStates.Add(curState.id);

      //    if (curToObj.inSingleStateGroup == true)
      //      _singleStateGroup.Add(curState.id);
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
        if (dynObj.Diagram == null)
          return false;

        dynObj = ((dynamic)obj).Diagram;
      }

      if (!base.LoadObjLinks((object)dynObj, false, lists))
        return false;

      //load the transition list
      
      if (dynObj.singleStates != null)
      {
        _okStates.Clear();
        _singleStateGroup.Clear();

        foreach (dynamic curToObj in dynObj.singleStates)
        {
          State curState = lists.allStates.FindByName((string)curToObj.stateName);
          if (curState == null)
            throw new Exception("Failed to locate ok state " + (string)curToObj.stateName + " in state list");

          _singleStateGroup.Add(curState.id);

          if (Convert.ToBoolean((string)curToObj.okState))
            _okStates.Add(curState.id);
        }
      }

      if ((_singleStateGroup.Count < 1) || (_okStates.Count < 1) || (_singleStateGroup.Count == _okStates.Count) || (_singleStateGroup.Count - _okStates.Count == 0))
        throw new Exception("Diagram named - " + this.name + " can not be evaluated. Make sure at least one state in the diagram has a value of 1 and another has a value of 0.");
      
      return true;
    }

    public bool IsFailedState(int stateID)
    {      
      return (this._singleStateGroup.Contains(stateID) && (!this._okStates.Contains(stateID)));
    }

    public MyBitArray GetFailBitSet()
    {
      MyBitArray retBS = new MyBitArray(this.stateIDs.Max()+1, false);
      foreach(var i in this._States)
      {
        retBS[i.id] = IsFailedState(i.id);
      }
      return retBS;
    }

    public List<int> GetFailList()
    {
      List<int> retBS = new List<int>();
      foreach (var i in this._States)
      {
        if(IsFailedState(i.id))
          retBS.Add(i.id);
      }
      return retBS;
    }

    /// <summary>
    /// Evaluate the component depending on what state it is in.
    /// </summary>
    public bool Evaluate(MyBitArray curStates)
    {
      //if (onSuccess) //go through all the OK states
      //{
      //  foreach (int id in _okStates)
      //  {
      //    if (curStates[id])
      //    {
      //      return true;
      //    }
      //  }
      //}
      //else
      //{
        if (_failStates == null)
        {
          _failStates = new List<int>();
          foreach (int id in _singleStateGroup)
          {
            if (!_okStates.Contains(id))
            {
              _failStates.Add(id);
            }
          }
        }

        foreach (int id in _failStates)
        {
          if (curStates[id])
          {
            return true;
          }
        }
//      }
      return false;
    }

    public void AddEvalVal(int stateID, bool inIsSuccessState)
    {
      _singleStateGroup.Add(stateID);
      if (inIsSuccessState)
      {
        _okStates.Add(stateID);
      }
    }

    public void Remove(int stateID)
    {
      if (_singleStateGroup.Contains(stateID))
      {
        _singleStateGroup.Remove(stateID);
        if (_okStates.Contains(stateID))
        {
          _okStates.Remove(stateID);
        }
      }
    }

    //public bool CanAddState(int newState, MyBitArray curStates)
    //{
    //  bool newInGroup = false;
    //  bool hasCur = false;
    //  foreach (int id in _singleStateGroup)
    //  {
    //    if (curStates[id])
    //      hasCur = true;

    //    if (id == newState)
    //      newInGroup = true;
    //  }

    //  if ((newInGroup) && (hasCur))
    //  {
    //    return false;
    //  }
    //  else
    //  {
    //    return true;
    //  }
    //}

    //public bool StateInComp(int stateID)
    //{
    //  return _singleStateGroup.Contains(stateID);
    //}

    public List<int> stateIDs
    {
      get
      {
        List<int> retList = new List<int>();
        retList.AddRange(this._singleStateGroup);
        return retList;
      }
    }
  }

  public class CompDiagram : EvalDiagram // dtComponent 
  {
    public CompDiagram()
      : base(EnDiagramType.dtComponent) { }

    public CompDiagram(string inName)
      : base(inName, EnDiagramType.dtComponent) { }
  }

  public class SysDiagram : EvalDiagram // dtComponent 
  {
    public SysDiagram()
      : base(EnDiagramType.dtSystem) { }

    public SysDiagram(string inName)
      : base(inName, EnDiagramType.dtSystem) { }
  }

  public class AllDiagrams : Dictionary<int, Diagram>, ModelItemLists
  {
    private Dictionary<string, int> nameToID = new Dictionary<string, int>();
    private List<Diagram> deleted = new List<Diagram>();

    public int maxID { get { if (this.Count > 0) { return this.Keys.Max(); } else { return 0; } } }

    public bool loaded = false;

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
          retStr = retStr + ((BaseObjInfo)item.Value).name + " Diagram not processed" + Environment.NewLine;
      }

      return retStr;
    }

    public static Diagram CreateNewDiagram(EnDiagramType diagType)
    {
      switch (diagType)
      {
        case EnDiagramType.dtComponent: return new CompDiagram();
        case EnDiagramType.dtOther: return new Diagram();
        case EnDiagramType.dtPlant: return new Diagram();
        case EnDiagramType.dtSystem: return new SysDiagram();
        default: return null;
      }
    }

    public void Add(Diagram inDiagram)
    {
      if (nameToID.ContainsKey(inDiagram.name))
        return;

      nameToID.Add(inDiagram.name, inDiagram.id);
      this.Add(inDiagram.id, inDiagram);
    }

    new public void Clear()
    {
      deleted.Clear();
      nameToID.Clear();
      base.Clear();
    }

    public void DeleteAll()
    {
      foreach (Diagram curVar in this.Values)
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
        Diagram temp = this[key];

        deleted.Add(temp);
        nameToID.Remove(temp.name);

        base.Remove(key);
      }
    }

    public Diagram FindByName(string name, bool exception = true)
    {
      try
      {
        if(nameToID.ContainsKey(name))
          return this[nameToID[name]];
        else
        {
          if (exception)
            throw new Exception("Failed to find Diagram - " + name);
          else
            return null;
        }
      }
      catch
      {
        if (exception)
          throw new Exception("Failed to find Diagram - " + name);
        else
          return null;
      }      

      //Diagram diag = null;
      //if (nameToID.ContainsKey(name))
      //{
      //  var dId = nameToID[name];
      //  if (this.ContainsKey(dId))
      //    diag = this[dId];
      //}
      //return diag;
    }

    public string GetJSON(bool incBrackets, EmraldModel lists)
    {
      string retStr = "";
      if (incBrackets)
      {
        retStr = "{";
      }
      retStr = retStr + "\"DiagramList\": [";

      int i = 1;
      foreach (Diagram curItem in this.Values)
      {
        if (curItem is EvalDiagram)
          retStr = retStr + Environment.NewLine + ((EvalDiagram)curItem).GetJSON(true, lists);
        else
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
      //dynamic dynObj = (dynamic)obj;
      //dynObj = ((dynamic)obj).Diagram;

      //if (!string.IsNullOrEmpty(jsonListString))
      //{

      var dynamicObj = (dynamic)obj;//Json.Decode(jsonListString);
      string curName = "";
      try
      {
        foreach (var wrapper in dynamicObj)
        {
          var item = wrapper.Diagram;
          Diagram curItem = null;
          curName = (string)item.name;

          if (loaded && (item.id != null) && ((int)item.id > 0))
          {
            curItem = this[(int)item.id];
            if (curItem == null)
              throw new Exception("Failed to find Diagram with id of " + (int)item.id);
          }
          else
          {
            curItem = this.FindByName(curName, false);
            if (curItem != null)
              throw new Exception("Diagram with the name of " + (string)item.name + " already exists");
          }

          if (curItem == null)
          {
            curItem = AllDiagrams.CreateNewDiagram((EnDiagramType)Enum.Parse(typeof(EnDiagramType), (string)item.diagramType, true));
            //done in deserialize - lists.allActions.Add(curAct);
          }

          if (!curItem.DeserializeDerived((object)(dynamic)item, false, lists, useGivenIDs))
            throw new Exception("Failed to deserialize Diagrams List JSON");
        }      
      }
      catch (Exception e)
      {
        throw new Exception("On diagram named " + curName + ". " + e.Message);
      }
}

    public bool LoadLinks(object obj, EmraldModel lists)
    {
      var dynamicObj = (dynamic)obj;

      foreach (var wrapper in dynamicObj)
      {
        var item = wrapper.Diagram;

        Diagram curItem = this.FindByName((string)item.name);
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
          throw new Exception("On Diagram named " + curItem.name + ". " + e.Message);
        }
      }

      return true;
    }

  }
}
