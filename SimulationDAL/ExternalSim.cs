// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using MessageDefLib;
using NLog;

namespace SimulationDAL
{
  public class ExternalSim : BaseObjInfo
  {
    public string resourceName; //name of resource type to connect to in MsgServer, not unique if more than one simulation of the same tool 
    public string modelRef; 
    public string configData = "";
    public TimeSpan simMaxTime;
    public bool verified = false; //verified there is a link to a external sim client
    public int timeout = 10; //time before timeout in trying to connect to external sim

    public string msgServerClient { get; set; } //


    public ExternalSim(string clientResourceName, string desc, string modelRef, TimeSpan maxRunTime, string configData = "")
    {
      this._id = SingleNextIDs.Instance.NextID(EnIDTypes.itExtSim);

      this.name = clientResourceName + this._id.ToString(); //must be unique
      this.resourceName = clientResourceName;
      this.modelRef = modelRef;
      this.desc = desc;
      simMaxTime = maxRunTime;
      this.configData = configData;
    }
    
    public ExternalSim()
    {
      this._id = SingleNextIDs.Instance.NextID(EnIDTypes.itExtSim);
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
      retStr = retStr + "\"ExtSim\": {" + Environment.NewLine + base.GetJSON(false, lists);
      retStr = retStr + "," + Environment.NewLine + "\"resourceName\": \"" + resourceName + "\"";
      retStr = retStr + "," + Environment.NewLine + "\"modelRef\": \"" + modelRef + "\"";
      retStr = retStr + "," + Environment.NewLine + "\"configData\": \"" + configData + "\"";
      retStr = retStr + "," + Environment.NewLine + "\"simMaxTime\": \"" + simMaxTime.ToString("G") + "\"";

      
      retStr = retStr + GetDerivedJSON(lists) + Environment.NewLine + "}";

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
        if (dynObj.ExtSim == null)
          return false;

        dynObj = ((dynamic)obj).ExtSim;
      }

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      lists.allExtSims.Add(this);

      this.resourceName = (string)dynObj.resourceName;
      //this.modelRef = dynObj.modelRef;
      //this.configData = dynObj.configData;
      //try
      //{
      //  this.simMaxTime = XmlConvert.ToTimeSpan((string)dynObj.simMaxTime); 
      //}
      //catch
      //{
      //  throw new Exception("Invalid Time format.");
      //}


      processed = true;
      return true;
      }

    public override bool LoadObjLinks(object obj, bool wrapped, EmraldModel lists)
    {
      //TODO :
      return true;
    }

    public virtual void LookupRelatedItems(EmraldModel all, EmraldModel addToList)
    {
      //none
    }

    public virtual List<ScanForReturnItem> ScanFor(ScanForTypes scanType)
    {
      //override in the different types if it is possible that the item has something for the scanType 
      return new List<ScanForReturnItem>();
    }
  }

  public class AllExtSims : Dictionary<int, ExternalSim>, ModelItemLists
  {
    private Dictionary<string, int> nameToID = new Dictionary<string, int>();
    private List<ExternalSim> deleted = new List<ExternalSim>();

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
          retStr = retStr + ((BaseObjInfo)item.Value).name + " Ext Sim not processed" + Environment.NewLine;
      }

      return retStr;
    }

    public void Add(ExternalSim inSim)
    {
      if (nameToID.ContainsKey(inSim.name))
        return;

      nameToID.Add(inSim.name, inSim.id);
      this.Add(inSim.id, inSim);
    }

    new public void Clear()
    {
      deleted.Clear();
      nameToID.Clear();
      base.Clear();
    }

    public void DeleteAll()
    {
      foreach (ExternalSim curVar in this.Values)
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
        ExternalSim temp = this[key];

        deleted.Add(temp);
        nameToID.Remove(temp.name);

        base.Remove(key);
      }
    }

    public ExternalSim FindByName(string name, bool exception = true)
    {
      try
      {
        if (nameToID.ContainsKey(name))
          return this[nameToID[name]];
        else
        {
          if (exception)
            throw new Exception("Failed to find External Sim - " + name);
          else
            return null;
        }
      }
      catch
      {
        if (exception)
          throw new Exception("Failed to find External Sim - " + name);
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
      retStr = retStr + "\"ExtSimList\": [";

      int i = 1;
      foreach (ExternalSim curItem in this.Values)
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
      var dynamicObj = (dynamic)obj;//Json.Decode(jsonListString);
      string curName = "";
      try
      {
        foreach (var wrapper in dynamicObj)
        {
          var item = wrapper;
          ExternalSim curItem = null;
          curName = (string)item.name;

          if (loaded && (item.id != null) && ((int)item.id > 0))
          {
            curItem = this[(int)item.id];
            if (curItem == null)
              throw new Exception("Failed to find external Sim with id of " + (int)item.id);
          }
          else
          {
            curItem = this.FindByName(curName, false);
            if (curItem != null)
              throw new Exception("External sim with the name of " + (string)item.name + " already exists");
          }

          if (curItem == null)
          {
            curItem = new ExternalSim();
          }

          if (!curItem.DeserializeDerived((object)(dynamic)item, false, lists, useGivenIDs))
            throw new Exception("Failed to deserialize ExternalSims List JSON");
        }
      }
      catch (Exception e)
      {
        throw new Exception("On ExternalSim named " + curName + ". " + e.Message);
      }

    }

    public bool LoadLinks(object obj, EmraldModel lists)
    {      
      return true;
    }

    public List<ScanForReturnItem> ScanFor(ScanForTypes scanType, EmraldModel lists)
    {
      var foundList = new List<ScanForReturnItem>();

      if ((scanType == ScanForTypes.sfMultiThreadIssues) && (this.Count > 0)) //shortcircuit
      {
        foundList.Add(new ScanForRefsItem(this[0].id,
                                          this[0].name,
                                          EnIDTypes.itAction,
                                          "Currently External Sim communication is not supported in multithreading.",
                                          ""));
        return foundList;
      }

      foreach (var curItem in this.Values)
      {
        foundList.AddRange(curItem.ScanFor(scanType));
      }

      return foundList;
    }

  }

}
