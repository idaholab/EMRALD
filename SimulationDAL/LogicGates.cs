// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MyStuff.Collections;
using Newtonsoft.Json;
//using System.Windows.Forms;
//using System.Web.Helpers;


namespace SimulationDAL
{
  public enum EnGateType { gtAnd, gtOr, gtNot, gtNofM };

  //interface IEvaluateable<MyBitArray>
  //{
  //  bool Evaluate(MyBitArray curStates);
  //}

  public class compChild
  {
    public EvalDiagram diagram = null;
    public Dictionary<int, int> stateValues = new Dictionary<int, int>(); //stateID and then value for the state
  }

  public class LogicNode : BaseObjInfo
  {
    protected bool _isTop;  //root node of this one 
    private List<compChild> _compChildren = new List<compChild>();
    private List<LogicNode> _subGates = new List<LogicNode>();

    public EnGateType gateType = EnGateType.gtAnd;
    //public bool isTop { get { return _isTop; } }
    public int val1 = 0;
    public LogicNode ChildGate(int idx) {return _subGates[idx];}
    public int childGateCnt { get { return _subGates.Count; } }

    public LogicNode()
    {
      this._id = SingleNextIDs.Instance.NextID(EnIDTypes.itTreeNode);
    }

    public LogicNode(string inName, EnGateType inGType, LogicNode inRootParent, int inVal1 = 0)
    {
      this._id = SingleNextIDs.Instance.NextID(EnIDTypes.itTreeNode);

      this.name = inName;
      this.gateType = inGType;
      this.val1 = inVal1;
      if (inRootParent == null)
      {
        this._isTop = true;
      }
      else
      {
        this._isTop = false;
      }
    }

    public LogicNode(string inName, EnGateType inGType, bool isTop, int inVal1 = 0)
    {
      this._id = SingleNextIDs.Instance.NextID(EnIDTypes.itTreeNode);

      this.name = inName;
      this.gateType = inGType;
      this.val1 = inVal1;
      this._isTop = isTop;
    }

    public override string GetJSON(bool incBrackets, EmraldModel lists)
    {
      string retStr = "";
      if (incBrackets)
      {
        retStr = "{";
      }
      retStr = retStr + "\"LogicNode\": {" + Environment.NewLine + base.GetJSON(false, lists) + "," + Environment.NewLine;

      //add derived items
      retStr = retStr + "\"gateType\": \"" + this.gateType.ToString() + "\"";
      if(this._isTop != null)
      {
        retStr = retStr + "," + Environment.NewLine + "\"isTop\": \"" + _isTop.ToString() + "\"";
      }


      
      retStr = retStr + "," + Environment.NewLine + "\"compChildren\": [";
      for (int i = 0; i < this._compChildren.Count; ++i)
      {

        retStr = retStr + "\"diagramName\": \"" + this._compChildren[i].diagram.name + "\"," + Environment.NewLine;

        Dictionary<string, int> nameDict = this._compChildren[i].stateValues
            .ToDictionary(kvp => lists.allStates[kvp.Key].name, kvp => kvp.Value);

        retStr = retStr + "\"stateValues\": " + JsonConvert.SerializeObject(nameDict) + Environment.NewLine;

        if (i < this._compChildren.Count - 1)
        {
          retStr = retStr + "," + Environment.NewLine;
        }
      }       

      retStr = retStr + "]";
      

      
      retStr = retStr + "," + Environment.NewLine + "\"gateChildren\": [";
      for (int i = 0; i < this._subGates.Count; ++i)
      {
        retStr = retStr + "\"" + this._subGates[i].name + "\"";

        if (i < this._subGates.Count - 1)
        {
          retStr = retStr + "," + Environment.NewLine;
        }
      }
      retStr = retStr + "]";

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
        if (dynObj.LogicNode == null)
          return false;

        dynObj = ((dynamic)obj).LogicNode;
      }

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      lists.allLogicNodes.Add(this);

      gateType = (EnGateType)Enum.Parse(typeof(EnGateType), (string)dynObj.gateType, true);


      //load the component children in the loadObjLinks so we keep the diagram name and load the state value list together.
      
      

      processed = true;
      return true;
    }

    public override bool LoadObjLinks(object obj, bool wrapped, EmraldModel lists)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.LogicNode == null)
          return false;

        dynObj = ((dynamic)obj).LogicNode;
      }

      
      //load the root obj info
      if (dynObj.rootName != null)
      {
        _isTop = this.name == (string)dynObj.rootName;
      }
      if (dynObj.isTop != null)
      {
        _isTop = (bool)dynObj.isTop;
      }
      

      //load the gate children
      if (dynObj.gateChildren != null)
      {
        _subGates.Clear();
        foreach (var gateName in dynObj.gateChildren)
        {
          LogicNode curChildGate = lists.allLogicNodes.FindByName((string)gateName);
          if (curChildGate == null)
          {
            throw new Exception("Deserialize Logic failed to find child gate - " + gateName);

          }

          if (!_subGates.Contains(curChildGate))
            _subGates.Add(curChildGate);
        }
      }

      //load the component children
      if (dynObj.compChildren != null)
      {
        _compChildren.Clear();
        foreach (var child in dynObj.compChildren)
        {
          var compChild = new compChild();
          EvalDiagram curChildComp = (EvalDiagram)lists.allDiagrams.FindByName((string)child.diagramName);
          if (curChildComp == null)
          {
            throw new Exception("Deserialize Logic gate Failed to find child state - " + child);
          }
          compChild.diagram = curChildComp;

          if (child.stateValues != null)
          {
            foreach (var item in child.stateValues)
            {
              State state = lists.allStates.FindByName(item.name);
              compChild.stateValues.Add(state.id, item.stateValues);
            }
          }
          

          _compChildren.Add(compChild);
        }

      }
      return true;
    }


    public int Evaluate(MyBitArray curStates, bool success)
    {
      int retVal = 0;
      int evalSum = 0;
      int unknownCnt = 0;
      //go through all the child item both components and gates
      foreach (var curComp in _compChildren)
      {
        int evalNum = curComp.diagram.Evaluate(curStates, success, curComp.stateValues);
        if (evalNum < 0)
          unknownCnt++;
        else
        {
          if ((gateType == EnGateType.gtAnd) && (evalNum == 0)) //short curcuit AND with a 0 in it
            return 0;
          if ((gateType == EnGateType.gtOr) && (evalNum == 1)) //short curcuit OR with a 1 in it
            return 1;
          evalSum += evalNum;
        }
      }
      foreach (LogicNode curNode in _subGates)
      {
        int evalNum = curNode.Evaluate(curStates, success);
        if (evalNum < 0)
          unknownCnt++;
        else
        {
          if ((gateType == EnGateType.gtAnd) && (evalNum == 0)) //short curcuit AND with a 0 in it
            return 0;
          if ((gateType == EnGateType.gtOr) && (evalNum == 1)) //short curcuit OR with a 1 in it
            return 1;
          evalSum += evalNum;
        }
      }

      if (unknownCnt == (_compChildren.Count + _subGates.Count)) //all children unknown
        return -1;

      switch (gateType)
      {
        case EnGateType.gtAnd:
          return (_compChildren.Count + _subGates.Count) == (evalSum + unknownCnt) ? 1 : 0; //if all 1's or unknown then 1. Treat unknowns as true so the are ignored
          break;

        case EnGateType.gtOr:
          return evalSum > 0 ? 1 : 0; //if no 1's return false. Treat unknowns as false so they are ignored
          break;

        case EnGateType.gtNot:
          return evalSum > 0 ? 1 : 0; //Should only be one so just return 1 if greater than 0.

        case EnGateType.gtNofM:
          return evalSum > val1 ? 1 : 0;
        default:
          throw new Exception("Gate not defined to evaluate");
      }
    }

    public void AddGateChild(LogicNode child)
    {
      this._subGates.Add(child);
    }

    public void RemoveGateChild(LogicNode child)
    {
      this._subGates.Remove(child);
    }

    public List<int> AllUsedStateIDs
    {
      get
      {
        List<int> retVal = new List<int>();


        //get all the used states for the components
        foreach (var comp in this._compChildren)
        {
          retVal.AddRange(comp.diagram.stateIDs);
        }
        
        //add all the items under child gates
        foreach (LogicNode childNode in this._subGates)
        {
          retVal.AddRange(childNode.AllUsedStateIDs);
        }

        return retVal.Distinct().ToList();
      }
    }

    //public void LookupRelatedItems(LookupLists all, LookupLists addToList)
    //{
    //  if (addToList.allLogicNodes.ContainsKey(this.id))
    //  {
    //    return;
    //  }

    //  addToList.allLogicNodes.Add(this);

    //  foreach(LogicNode curItem in this._subGates)
    //  {
    //    curItem.LookupRelatedItems(all, addToList);
    //  }

    //  foreach (Diagram curItem in this._compChildren)
    //  {
    //    curItem.LookupRelatedItems(all, addToList);
    //  }
    //}

    public virtual List<ScanForReturnItem> ScanFor(ScanForTypes scanType, string modelRootPath)
    {
      //override in the different types if it is possible that the item has something for the scanType 
      return new List<ScanForReturnItem>();
    }
  }


  public class LogicNodeList : Dictionary<int, LogicNode>, ModelItemLists
  {
    private Dictionary<string, int> nameToID = new Dictionary<string, int>();
    private List<LogicNode> deleted = new List<LogicNode>();
    public int maxID { get { if (this.Count > 0) { return this.Keys.Max(); } else { return 0; } } }

    public bool loaded = false;

    public void Add(LogicNode addNode, bool errorOnDup = true)
    {
      if (nameToID.ContainsKey(addNode.name))
      {
        if (errorOnDup)
          throw new Exception("logic node already exists " + addNode.name);
        return;
      }

      nameToID.Add(addNode.name, addNode.id);
     
      this.Add(addNode.id, addNode);
    }

    public void AddRecursive(LogicNode addNode)
    {
      if (!nameToID.ContainsKey(addNode.name))
      {
        nameToID.Add(addNode.name, addNode.id);

        this.Add(addNode.id, addNode);

        for (int i =0; i< addNode.childGateCnt; ++i)
        {
          AddRecursive(addNode.ChildGate(i));
        }

      }
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
          retStr = retStr + ((BaseObjInfo)item.Value).name + " LogicGate not processed" + Environment.NewLine;
      }

      return retStr;
    }

    new public void Remove(int key)
    {
      if (this.ContainsKey(key))
      {
        LogicNode temp = this[key];
        deleted.Add(temp);

        nameToID.Remove(temp.name);
        
        base.Remove(key);
      }
    }

    new public void Clear()
    {
      nameToID.Clear();
      deleted.Clear();
      base.Clear();
    }

    public void DeleteAll()
    {
      foreach (LogicNode curVar in this.Values)
      {
        deleted.Add(curVar);
      }

      nameToID.Clear();
      base.Clear();
    }

    public LogicNode FindByName(string name, bool exception = true)
    {
      try
      {
        if (nameToID.ContainsKey(name))
          return this[nameToID[name]];
        else
        {
          if (exception)
            throw new Exception("Failed to find LogicGate - " + name);
          else
            return null;
        }
      }
      catch
      {
        if (exception)
          throw new Exception("Failed to find LogicGate - " + name);
        else  
          return null;
      }
    }

    public string GetJSON(bool incBrackets, EmraldModel lists)
    {
      string retStr = "";
      if (incBrackets)
      {
        retStr = "{";
      }
      retStr = retStr + "\"LogicNodeList\": [";

      bool first = true;
      foreach (LogicNode curItem in this.Values)
      {
        if (!first)
          retStr = retStr + "," + Environment.NewLine;

        retStr = retStr + Environment.NewLine + curItem.GetJSON(true, lists);
        first = false;
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
          LogicNode curItem = null;
          curName = (string)item.name;

          if (loaded && (item.id != null) && ((int)item.id > 0))
          {
            curItem = this[(int)item.id];
            if (curItem == null)
              throw new Exception("Failed to find LogicGate with id of " + (int)item.id);
          }
          else
          {
            curItem = this.FindByName(curName, false);
            if (curItem != null)
              throw new Exception("LogicGate with the name of " + (string)item.name + " already exists");
          }

          if (curItem == null)
          {
            curItem = new LogicNode();
          }

          if (!curItem.DeserializeDerived((object)item, false, lists, useGivenIDs))
            throw new Exception("Failed to deserialize LogicGate List JSON");

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
        var item = wrapper;

        LogicNode curItem = this.FindByName((string)item.name, false);
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
          throw new Exception("On Gate named " + curItem.name + ". " + e.Message);
        }
      }

      return true;
    }

    public List<ScanForReturnItem> ScanFor(ScanForTypes scanType, EmraldModel lists)
    {
      var foundList = new List<ScanForReturnItem>();
      if (scanType == ScanForTypes.sfMultiThreadIssues) //shortcircuit
      {
        //currently there are no references to file or possible common data here.
        return foundList;
      }

      foreach (var curItem in this.Values)
      {
        foundList.AddRange(curItem.ScanFor(scanType, lists.rootPath));
      }

      return foundList;
    }
  }



}
