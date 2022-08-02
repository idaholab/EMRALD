// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MyStuff.Collections;
//using System.Windows.Forms;
//using System.Web.Helpers;


namespace SimulationDAL
{
  public enum EnGateType { gtAnd, gtOr, gtNot, gtNofM };

  //interface IEvaluateable<MyBitArray>
  //{
  //  bool Evaluate(MyBitArray curStates);
  //}

  public class LogicNode : BaseObjInfo
  {
    protected bool _isTop;  //root node of this one 
    private List<EvalDiagram> _compChildren = new List<EvalDiagram>();
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

        retStr = retStr + "\"" + this._compChildren[i].name + "\"";


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

    public string GetTreeJSON(bool incBrackets, EmraldModel lists)
    {
      string retStr = "";
      if (incBrackets)
      {
        retStr = "{";
      }
      retStr = retStr + "\"LogicNode\": {" + Environment.NewLine + base.GetJSON(false, lists) + "," + Environment.NewLine;

      //add derived items
      retStr = retStr + "\"gateType\": \"" + this.gateType.ToString() + "\"";
      retStr = retStr + "," + Environment.NewLine + "\"isTop\": \"" + this._isTop.ToString() + "\"";


      retStr = retStr + "," + Environment.NewLine + "\"compChildren\": [";
      for (int i = 0; i < this._compChildren.Count; ++i)
      {
        retStr = retStr + Environment.NewLine + "{ \"stateName\":\"" + this._compChildren[i].name + "\"}";

        if (i < this._compChildren.Count - 1)
        {
          retStr = retStr + "," + Environment.NewLine;
        }
      }
      retStr = retStr + "]";
      

      retStr = retStr + "," + Environment.NewLine + "\"gateChildren\": [";
      for (int i = 0; i < this._subGates.Count; ++i)
      {
        retStr = retStr + Environment.NewLine + this._subGates[i].GetJSON(false, lists);

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

      //Now done in LoadObjLinks()
      ////load the root obj info
      //if (dynObj.rootName != null)
      //{
      //  _rootParent = lists.allLogicNodes.FindByName((string)dynObj.rootName);
      //  if (_rootParent == null)
      //  {
      //    throw new Exception("Root node " + (string)dynObj.rootName + " not found.");
      //  }
      //}

      ////load the gate children
      //if (dynObj.gateChildren != null)
      //{
      //  _subGates.Clear();
      //  foreach (dynamic gateName in dynObj.gateChildren)
      //  {
      //    LogicNode curChildGate = lists.allLogicNodes.FindByName(gateName);
      //    if (curChildGate == null)
      //    {
      //      throw new Exception("Deserialize Logic failed to find child gate - " + gateName);

      //    }
          
      //    if (!_subGates.Contains(curChildGate))
      //      _subGates.Add(curChildGate);
      //  }
      //}

      ////load the component children
      //if (dynObj.compChildren != null)
      //{
      //  _compChildren.Clear();
      //  foreach (dynamic stateName in dynObj.compChildren)
      //  {
      //    EvalDiagram curChildComp = lists.allDiagrams.FindByName(stateName);
      //    if (curChildComp == null)
      //    {
      //      throw new Exception("Deserialize Logic gate Failed to find child state - " + stateName);
      //    }
          
      //    _compChildren.Add(curChildComp);
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
        foreach (var stateName in dynObj.compChildren)
        {
          EvalDiagram curChildComp = (EvalDiagram)lists.allDiagrams.FindByName((string)stateName);
          if (curChildComp == null)
          {
            throw new Exception("Deserialize Logic gate Failed to find child state - " + stateName);
          }

          _compChildren.Add(curChildComp);
        }

      }
      return true;
    }


    public bool Evaluate(MyBitArray curStates, bool success = false)
    {
      bool retVal;
      int cnt = 0;

      switch (gateType)
      {
        case EnGateType.gtAnd:
        case EnGateType.gtNot:
          retVal = true;
          break;

        case EnGateType.gtOr:
        case EnGateType.gtNofM:
          retVal = false;
          break;

        default:
          retVal = false;
          break;
      }


      foreach (EvalDiagram curComp in _compChildren)
      {
        switch (gateType)
        {
          case EnGateType.gtAnd:
            retVal = (retVal && curComp.Evaluate(curStates));
            if (!retVal)
              return retVal;
            break;

          case EnGateType.gtOr:
            retVal = (retVal || curComp.Evaluate(curStates));
            if (retVal)
              return retVal;
            break;

          case EnGateType.gtNot:
            return (!curComp.Evaluate(curStates));

          case EnGateType.gtNofM:
            { 
              ++cnt;
              if (cnt >= val1)
              {
                return true;
              }
            }
            break;
        }
      }

      foreach (LogicNode curNode in _subGates)
      {
        switch (gateType)
        {
          case EnGateType.gtAnd:
            retVal = (retVal && curNode.Evaluate(curStates));
            if (!retVal)
              return retVal;
            break;

          case EnGateType.gtOr:
            retVal = (retVal || curNode.Evaluate(curStates));
            if (retVal)
              return retVal;
            break;

          case EnGateType.gtNot:
            return (!curNode.Evaluate(curStates));

          case EnGateType.gtNofM:
            if (curNode.Evaluate(curStates))
            {
              ++cnt;
              if (cnt >= val1)
                return true;
            }
            break;
        }
      }

      return retVal;
    }

    public void AddGateChild(LogicNode child)
    {
      this._subGates.Add(child);
    }

    public void RemoveGateChild(LogicNode child)
    {
      this._subGates.Remove(child);
    }

    public void AddCompChild(EvalDiagram child)
    {
      this._compChildren.Add(child);
    }

    public void RemoveCompChild(EvalDiagram child)
    {
      this._compChildren.Remove(child);
    }

    public List<int> AllUsedStateIDs
    {
      get
      {
        List<int> retVal = new List<int>();


        //get all the used states for the components
        foreach (EvalDiagram comp in this._compChildren)
        {
          retVal.AddRange(comp.stateIDs);
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
          var item = wrapper.LogicNode;
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
        var item = wrapper.LogicNode;

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
  }



}
