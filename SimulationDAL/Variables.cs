// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using Sop.Collections.Generic.BTree;
//using SimulationTracking;
using MyStuff.Collections;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Converters;
using System.IO;
using System.Xml;
using System.Text.RegularExpressions;

namespace SimulationDAL
{
  public enum EnVarScope { gtLocal = 0, gtGlobal, gt3DSim, gtAccrual, gtDocLink };
  public enum DocType { dtXML = 0, dtJSON, dtTextRegEx};

  public abstract class SimVariable : BaseObjInfo
  {
    private bool _monitor = false;
    public EnVarScope varScope = EnVarScope.gtGlobal;
    public Type dType; 
    protected object _value = null;
    public bool resetOnRuns = false;
    protected object initValue = null;

    public double dblValue { get { return Convert.ToDouble(GetValue()); } }
    public string strValue { get { return Convert.ToString(GetValue()); } }
    public bool boolValue { get { return Convert.ToBoolean(GetValue()); } }
    public bool monitorInSim { get { return _monitor; } }
    public virtual object value { get { return GetValue(); } }
    // public DateTime timeValue { get { return Convert.ToDateTime(value); } }

    public virtual void SetValue(object newValue)
    {
      _value = newValue;
    }

    public virtual object GetValue()
    {
      return _value;
    }
    public virtual void InitValue(dynamic dynObj)
    {
      try
      {
        _value = Convert.ChangeType(dynObj, dType);
      }
      catch (Exception e)
      {
        throw new Exception("Failed to initialize variable, not the correct type. " + e.Message);
      }

      //save initial value for initValue if resetting
      initValue = _value;
    }
    public void ReInit()
    {
      this._value = this.initValue;
    }

    protected SimVariable()
    {
      this._id = SingleNextIDs.Instance.NextID(EnIDTypes.itVar);
    }

    protected SimVariable(string inName, EnVarScope inType, Type inDType, object inVal = null)
    {
      this._id = SingleNextIDs.Instance.NextID(EnIDTypes.itVar);

      this.name = inName;
      this.varScope = inType;
      this._value = inVal;
      this.initValue = inVal;
      this.dType = inDType;
    }

    /// <summary>
    /// Initialize to the original assigned value.
    /// </summary>
    

    public abstract string GetDerivedJSON();

    public override string GetJSON(bool incBrackets, EmraldModel lists)
    {
      string retStr = "";
      if (incBrackets)
      {
        retStr = "{";
      }
      retStr = retStr + "\"Variable\": {" + Environment.NewLine + base.GetJSON(false, lists) + "," + Environment.NewLine;

      //add derived items
      retStr = retStr + "\"varScope\": \"" + this.varScope.ToString() + "\"," + Environment.NewLine;
      retStr = retStr + "\"value\": " + this._value.ToString() + "," + Environment.NewLine;
      retStr = retStr + "\"monitorInSim\": \"" + this._monitor.ToString() +"\"," + Environment.NewLine;
      retStr = retStr + "\"resetOnRuns\": \"" + this.resetOnRuns.ToString() + "\"," + Environment.NewLine;
      retStr = retStr + "\"type\": \"" + this.dType.Name + "\"";
      retStr = retStr + GetDerivedJSON();

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
        if (dynObj.Variable == null)
          return false;

        dynObj = ((dynamic)obj).Variable;
      }

      try
      {
        string t = ((String)dynObj.type).ToUpper().Substring(0, 3);
        switch (t)
        {
          case "INT":
            dType = typeof(int);
            //_value = Convert.ToInt32(dynObj.value);
            break;
          case "DOU":
          case "TIM":
            dType = typeof(double);
            //_value = Convert.ToDouble(dynObj.value);
            break;
          //todo
          //case "TIM":
          //  dType = typeof(TimeSpan);
          //  value = XMLConvert.toTimeSpan(dynObj.value);
          //  break;
          case "STR":
            dType = typeof(string);
            //_value = Convert.ToString(dynObj.value);
            break;
          case "BOO":
            dType = typeof(bool);
            //_value = Convert.ToBoolean(dynObj.value);
            break;
          default:
            throw new Exception("Value not matching Variable type - " + (string)dynObj.value + " -to- " + (String)dynObj.type);
        }
      }
      catch
      {
        throw new Exception("Variable \"" + this.name + "\"  missing type.");
      }

      try
      {
        _monitor = Convert.ToBoolean(dynObj.monitorInSim);
      }
      catch
      {
        _monitor = false;
      }

      try
      {
        resetOnRuns = Convert.ToBoolean(dynObj.resetOnRuns);
      }
      catch
      {
        _monitor = false;
      }

      if (varScope != (EnVarScope)Enum.Parse(typeof(EnVarScope), (string)dynObj.varScope, true))
        throw new Exception("Variable scope types do not match, cannot change the type once an item is created!");


      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      InitValue(dynObj.value);

      lists.allVariables.Add(this, false);
      
      processed = true;
      return true;
    }

     //public virtual void LookupRelatedItems(LookupLists all, LookupLists addToList)
    //{

    //  if (addToList.allVariables.ContainsKey(this.id))
    //  {
    //    return;
    //  }

    //  addToList.allVariables.Add(this);
    //}
  }

  public class SimGlobVariable : SimVariable
  {
    public SimGlobVariable()
      : base() { this.varScope = EnVarScope.gtGlobal; }

    public SimGlobVariable(string inName, Type inDType, object inVal = null)
      : base(inName, EnVarScope.gtGlobal, inDType, inVal) { }

    public override string GetDerivedJSON() { return ""; }
  }

  public class Sim3DVariable : SimVariable
  {
    public string sim3DNameId = "";
    //public string propName = null;

    public Sim3DVariable()
      : base() { this.varScope = EnVarScope.gt3DSim; }

    public Sim3DVariable(string inName, string inSim3DNameId, Type inDType, object inVal = null)
      : base(inName, EnVarScope.gt3DSim, inDType, inVal)
    {
      this.sim3DNameId = inSim3DNameId; 
    }

    public override string GetDerivedJSON()
    {
      string retStr = "";

      //add derived items
      retStr = retStr + "," + Environment.NewLine + "\"sim3DId\": " + this.sim3DNameId.ToString();

      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Variable == null)
          return false;

        dynObj = ((dynamic)obj).Variable;
      }

      sim3DNameId = Convert.ToString(dynObj.sim3DId);

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      lists.allVariables.Add(this, false);

      processed = true;
      return true;
    }
  }

  public class SimCompVariable : SimVariable
  {
    protected EvalDiagram simCompOwner = null;

    public SimCompVariable()
      : base() { this.varScope = EnVarScope.gtLocal; }

    public SimCompVariable(string inName, EvalDiagram inCompOwner, Type inDType, object inVal = null)
      : base(inName, EnVarScope.gtLocal, inDType, inVal) 
    {
      this.simCompOwner = inCompOwner;
    }

    public override string GetDerivedJSON()
    {
      string retStr = "";

      //add derived items
      retStr = retStr + "," + Environment.NewLine + "\"simCompOwner\": \"" + this.simCompOwner.name + "\"";

      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Variable == null)
          return false;

        dynObj = ((dynamic)obj).Variable;
      }

      bool retVal = base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs);


      if (retVal && (dynObj.simCompOwner != null))
      {
        lists.allVariables.Add(this, false);

        simCompOwner = (EvalDiagram)lists.allDiagrams.FindByName((string)dynObj.simCompOwner);

        retVal = simCompOwner != null;
      }

      processed = true;
      return retVal;
    }

    public override bool LoadObjLinks(object obj, bool wrapped, EmraldModel lists)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Variable == null)
          return false;

        dynObj = ((dynamic)obj).Variable;
      }
      
      if (dynObj.simCompOwner != null)
      {
        lists.allVariables.Add(this, false);

        simCompOwner = (EvalDiagram)lists.allDiagrams.FindByName((string)dynObj.simCompOwner);

        if (simCompOwner == null)
          throw new Exception("Failed to find Diagram named - " + (string)dynObj.simCompOwner);
      }

      return true;
    }

    //public override void LookupRelatedItems(LookupLists all, LookupLists addToList)
    //{

    //  if (addToList.allVariables.ContainsKey(this.id))
    //  {
    //    return;
    //  }

    //  addToList.allVariables.Add(this);

    //  simCompOwner.LookupRelatedItems(all, addToList);
    //}
  }

  public class AccrualVariable : SimVariable
  {
    [JsonConverter(typeof(StringEnumConverter))]
    public enum EnCumultiveType { ctTime, ctMultiplier, ctTable };//, ctCustScript};
    public EnTimeRate varRate = EnTimeRate.trHours; //rate of time for the variable 
    public class AccrualVarData
    {

      public EnCumultiveType type = EnCumultiveType.ctTime;
      public double accrualMult = 0.0;      
      public EnTimeRate multRate = EnTimeRate.trHours; //for ctTable or ctMultiplier type, rate of accrual in table
      public List<List<double>> accrualTable = new List<List<double>>();

      //todo for custScript
      //public string compCode = "";
      //protected bool compiled;
      //protected ScriptEngine compiledComp;
      //protected List<Variable> varList = null;
    }

    protected AllStates _StateList = new AllStates();
    protected Dictionary<int, AccrualVarData> _CumulativeParams = new Dictionary<int, AccrualVarData>();

    public AccrualVariable()
      : base() { this.varScope = EnVarScope.gtAccrual; this.dType = typeof(double); }

    public override string GetDerivedJSON()
    {
      string retStr = "";

      //add derived items

      retStr = retStr + "," + Environment.NewLine + "\"AccrualStatesData \": [" + Environment.NewLine;
      foreach (var state in _StateList)
      {
        //TODO
        //retStr = retStr + "[\"stateName\": \"" + state.Value.name + "\"," + Environment.NewLine;
        //AccrualVarData varData = _CumulativeParams[state.Key];
        //string varDataStr = JsonConvert.SerializeObject(varData);
        //varDataStr = varDataStr.Trim(new Char[] { ' ', '{' }).TrimEnd(new Char[] { ' ', '{' });
        //retStr = retStr + varDataStr + "]," + Environment.NewLine;

        //retStr = retStr + "\"stateName\": \"" + state.Value.name + "\"," + Environment.NewLine;
        //retStr = retStr + "\"type \": \"" + varData.type.ToString() + "\"" + Environment.NewLine;
        //retStr = retStr + "\"type \": \"" + varData.type.ToString() + "\"" + Environment.NewLine;
        //retStr = retStr + "\"type \": \"" + varData.type.ToString() + "\"" + Environment.NewLine;
        //retStr = retStr + "\"type \": \"" + varData.type.ToString() + "\"" + Environment.NewLine;
        //retStr = retStr + "\"type \": \"" + varData.type.ToString() + "\"" + Environment.NewLine;


      }
      retStr = retStr.TrimEnd(new Char[] { ',' });

      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Variable == null)
          return false;

        dynObj = ((dynamic)obj).Variable;

      }

      bool retVal = base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs);

      if (dynObj.AccrualStatesData == null)
      {
        throw new Exception("Missing AccrualStatesData for accrualVariable variable");
      }

      if (dynObj.varRate == null)
        throw new Exception("Missing simRate for accrualVariable variable");

      this.varRate = (EnTimeRate)dynObj.varRate;

      //dynObj = dynObj.AccrualStatesData;
      //must load everything in LoadObjLinks because the states must be loaded first so we have the IDs.     

      processed = true;
      return retVal;
    }

    public override bool LoadObjLinks(object obj, bool wrapped, EmraldModel lists)
    {
      dynamic dynObj = (dynamic)obj;
      try
      {
        if (wrapped)
        {
          if (dynObj.Variable == null)
            return false;

          dynObj = ((dynamic)obj).Variable.AccrualStatesData;
        }
        int i = 0;
        foreach (dynamic toStateItem in dynObj.AccrualStatesData)
        {
          string error = VerifyDataObj(toStateItem);
          if (error != "")
            throw new Exception("\"AccrualStatesData\"[" + i.ToString() + "], " + error);
          State curState = (State)lists.allStates.FindByName((string)toStateItem.stateName);
          _StateList.Add(curState.id, curState);
          string s = JsonConvert.SerializeObject(toStateItem);
          AccrualVarData data = JsonConvert.DeserializeObject<AccrualVarData>(s);
          _CumulativeParams.Add(curState.id, data);
          List<AccrualVariable> addTo = null;
          if (lists.AccrualVars.TryGetValue(curState.id, out addTo))
          {
            addTo.Add(this);
          }
          else
          {
            lists.AccrualVars.Add(curState.id, new List<AccrualVariable>() { this });
          }

          i++;
        }        
      }
      catch (Exception e)
      {
        throw new Exception("Missing AccrualStatesData for accrualVariable named - " + this.name + " error - " + e.Message);
      }

      return true;
    }

    private string VerifyDataObj(dynamic aVarDataDyn)
    {
      string problems = "";

      if (aVarDataDyn.type == null)
        return "missing type";

      if (aVarDataDyn.stateName == null)
        return "missing \"stateName\"";      

      foreach (var state in _StateList)
      {
        switch ((EnCumultiveType)aVarDataDyn.type)
        {
          case EnCumultiveType.ctMultiplier:
            if (aVarDataDyn.accrualMult == null)
              return "missing \"accrualMult\"";
            if (aVarDataDyn.multRate == null)
              return "missing \"multRate\"";
            break;
          case EnCumultiveType.ctTable:
            if (aVarDataDyn.multRate == null)
              return "missing \"multRate\"";
            if (aVarDataDyn.accrualTable == null)
              return "missing \"accrualTable\"";
            if (aVarDataDyn.accrualTable[0][0] != 0)
              return "fist time value of the \"accrualTable\" must be 0.";

            break;
          default:
            break;
        }
      }


      return problems;
    }

    /// <summary>
    /// update the accrue value
    /// </summary>
    /// <param name="tInState"></param>
    /// <param name="inStateID"></param>
    /// <returns>returns if changes or not</returns>
    public bool Accrue(TimeSpan tInState, int inStateID)
    {
      object compValue = this._value;
      State inState = _StateList[inStateID];
      if (inState == null)
        return false;
      AccrualVarData aData = _CumulativeParams[inStateID];
      if(aData == null)
      {
        throw new Exception("Missing AccrualVarData for State - " + inState.name);
      }

      switch(aData.type)
      {
        case EnCumultiveType.ctTime:
          _value = (double)_value + Globals.ConvertToNewTimeSpan(EnTimeRate.trHours, tInState.TotalHours, this.varRate);
          break;

        case EnCumultiveType.ctMultiplier:
          double addVal = aData.accrualMult * Globals.ConvertToNewTimeSpan(EnTimeRate.trHours, tInState.TotalHours, aData.multRate);
          _value = (double)_value + addVal;
          break;

        case EnCumultiveType.ctTable:
          double compTime = Globals.ConvertToNewTimeSpan(EnTimeRate.trHours, tInState.TotalHours, this.varRate);
          
          double prevTime = 0;
          //tblMult = Globals.ConvertToNewTimeSpan(aData.multRate, aData.accrualTable[0][1], aData.simRate);
          //add all the full table sections
          int i;
          for (i = 1; i < aData.accrualTable.Count; i++)
          {            
            double tblTimeConverted = Globals.ConvertToNewTimeSpan(this.varRate, (aData.accrualTable[i][0] - aData.accrualTable[i - 1][0]), aData.multRate);
            _value = (double)_value + tblTimeConverted * aData.accrualTable[i-1][1];
            if (compTime <= aData.accrualTable[i][0])
            {
              break;
            }
          }

          double remainTime = compTime - aData.accrualTable[i - 1][0];
          _value = (double)_value + aData.accrualTable[i][1] * Globals.ConvertToNewTimeSpan(this.varRate, (remainTime), aData.multRate);

          break;

        default:
          throw new Exception("Accrual data type" + aData.type.ToString() + " not implemented.");
      }

      return compValue != this._value;
    }
  }

  public abstract class DocVariable : SimVariable
  {
    protected DocType _docType = DocType.dtXML;
    protected string _docPath = "";
    protected string _linkStr = ""; //xpath for xml, JSONPath for JSON, and regExp string for TextRegExp
    protected bool _pathMustExist = true;
    protected object _dfltValue = null;

    public DocVariable(DocType subType)
      : base()
    {
      this.varScope = EnVarScope.gtDocLink;
      this.dType = typeof(string);
      this._docType = subType;
    }

    public override string GetDerivedJSON()
    {
      string retStr = "";

      retStr = retStr + "\"docType \": \"" + _docType.ToString() + "\"," + Environment.NewLine;
      retStr = retStr + "," + Environment.NewLine + "\"docPath \": \"" + _docType.ToString();
      retStr = retStr + "," + Environment.NewLine + "\"linkStr \": \"" + _docType.ToString() + "\"";

      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Variable == null)
          return false;

        dynObj = ((dynamic)obj).Variable;

      }

      if (dynObj.docType == null)
        throw new Exception("Missing docType for document variable");

      if (dynObj.docPath == null)
        throw new Exception("Missing docPath for document variable");

      if (dynObj.pathMustExist != null)
        this._pathMustExist = Convert.ToBoolean(dynObj.pathMustExist);


      this._docType = (DocType)dynObj.docType;
      this._docPath = Convert.ToString(dynObj.docPath);

      if (_pathMustExist && !File.Exists(_docPath))
        throw new Exception("No file located at - " + _docPath + " for Document variable ");

      if (dynObj.docLink == null)
        throw new Exception("Missing docLink for document variable");

      this._linkStr = Convert.ToString(dynObj.docLink);

      bool retVal = base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs);

      
      //must load everything in LoadObjLinks because the states must be loaded first so we have the IDs. 
      processed = true;
      return true;
    }
   
    public override void InitValue(dynamic dynObj)
    {
      try
      {
        _dfltValue = Convert.ChangeType(dynObj, dType);
      }
      catch (Exception e)
      {
        throw new Exception("Failed to initialize default value, not the correct type. " + e.Message);
      }

      try
      {
        if (_pathMustExist)
        {
          //do this different for document items as the value is not set by the user data
          _value = GetValue();
          //save initial value for initValue if resetting
          initValue = _value;
        }
      }
      catch (Exception e)
      {
        throw new Exception("Failed to initialize variable, not the correct type. " + e.Message);
      }
    }
  }

  public class XmlDocVariable : DocVariable
  {
   

    public XmlDocVariable()
      : base(DocType.dtXML) { }    
              
    public override void SetValue(object newValue)
    {

      _value = newValue;
      //update the document
      XmlDocument xDoc = new XmlDocument();
      xDoc.Load(_docPath);
      XmlElement pRoot = xDoc.DocumentElement;
      XmlNodeList nodes = pRoot.SelectNodes(_linkStr);
      XmlNode replNode = null;
      if ((nodes == null) || (nodes.Count == 0))
        throw new Exception("Path string found no items.");
      foreach (XmlNode i in nodes)
      {
        switch (i.NodeType)
        {
          case XmlNodeType.Attribute:
            i.Value = _value.ToString();
            break;
          case XmlNodeType.Text:
            i.InnerText = _value.ToString();
            break;
          default:
            if (replNode == null)
            {
              XmlDocument repl = new XmlDocument();
              repl.LoadXml(this.strValue);
              replNode = xDoc.ImportNode(repl.DocumentElement, true);
            }
            var p = i.ParentNode;
            var ret = p.ReplaceChild(replNode, i);
            break;
        }
      }

      xDoc.Save(_docPath);
    }

    public override object GetValue()
    {
      XmlDocument xDoc = new XmlDocument();
      xDoc.Load(_docPath);
      XmlElement pRoot = xDoc.DocumentElement;
      XmlNodeList nodes = pRoot.SelectNodes(_linkStr);
      if ((nodes == null) || (nodes.Count == 0))
      {
        if(_dfltValue == null)
          throw new Exception("Path string found no items.");
        else
          return Convert.ChangeType(_dfltValue, dType);
      }
      if (nodes.Count == 1)
      {
        switch (nodes[0].NodeType)
        {
          case XmlNodeType.Attribute:
            return Convert.ChangeType(nodes[0].Value, dType);
          case XmlNodeType.Text:
            return Convert.ChangeType(nodes[0].InnerText, dType);
          default:
            if (this.dType != typeof(string))
            {
              throw new Exception("Variable type to match to a XML object must be a String");
            }
            return nodes[0].OuterXml;
        }
      }
      else //more than one, only allow text
      {
        if (this.dType != typeof(string))
        {
          throw new Exception("Variable type to match to a XML object list must be a String");
        }
        _value = "";

        if(nodes.Count < 1)
          throw new Exception("Missing match for or data for XPath - " + _linkStr);

        foreach (XmlNode i in nodes)
        {
          switch (nodes[0].NodeType)
          {
            case XmlNodeType.Attribute:
              _value += Environment.NewLine + i.Value;
            break;
            case XmlNodeType.Text:
              _value += Environment.NewLine + i.InnerText;
            break;
            default:
              _value += Environment.NewLine + i.OuterXml;
            break;
          }
        }
          
        _value = ((string)_value).TrimStart();
        return _value;
      }
    }
  }


  public class JSONDocVariable : DocVariable
  {
    public JSONDocVariable()
      : base(DocType.dtJSON) { }

    public override void SetValue(object newValue)
    {
      _value = newValue;
      //update the document
      JObject fullObj = JObject.Parse(File.ReadAllText(this._docPath));
      var modItems = fullObj.SelectTokens(_linkStr);
      if (modItems == null)
        throw new Exception("Failed to locate document reference - " + _linkStr);
      modItems = JsonExtensions.ReplacePath(fullObj, _linkStr, newValue);

      //update the json file with the change
      using (StreamWriter file = File.CreateText(_docPath))
      using (JsonTextWriter writer = new JsonTextWriter(file))
      {
        fullObj.WriteTo(writer);
      }
    }

    public override object GetValue()
    {
      _linkStr = _linkStr.Replace("\"", "'");
      string fileStr = File.ReadAllText(this._docPath);
      JObject fullObj = JObject.Parse(fileStr);
      JToken modItem = fullObj.SelectToken(_linkStr);
      if(modItem == null)
      {
        if (_dfltValue == null)
          throw new Exception("Path string found no items.");
        else
          return Convert.ChangeType(_dfltValue, dType);
      }
      else if (modItem.Type == JTokenType.Object)
      {
        if (this.dType != typeof(string))
        {
          throw new Exception("Variable type to match to a JSON object must be a String");
        }
        return modItem.ToString();
      }
      else
      {
        return modItem.ToObject(dType);
      }
    }
  }

  public class TextRegExVariable : DocVariable
  {
    private int _regExpLine = 0;
    private int _begPosition = 0;
    private int _numChars = -1; //-1 goes until the next white space

    public TextRegExVariable()
      : base(DocType.dtTextRegEx) { }

    public override string GetDerivedJSON()
    {
      string retStr = base.GetDerivedJSON();
      retStr = retStr + "," + Environment.NewLine + "\"regExpLine \": \"" + _regExpLine.ToString() + "\"";
      retStr = retStr + "," + Environment.NewLine + "\"begPos \": \"" + _begPosition + "\"";
      retStr = retStr + "," + Environment.NewLine + "\"numChars \": \"" + _numChars + "\"";
      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = (dynamic)obj;
      if (wrapped)
      {
        if (dynObj.Variable == null)
          return false;

        dynObj = ((dynamic)obj).Variable;
      }

      if (dynObj.regExpLine == null)
        throw new Exception("Missing regExpLine for regEx document variable");


      if (dynObj.begPosition == null)
        throw new Exception("Missing begPosition for RegEx document variable");

      if (dynObj.numChars == null)
        throw new Exception("Missing begPosition for regEx document variable");

      try
      {
        this._regExpLine = Convert.ToInt32(dynObj.regExpLine);
        this._begPosition = Convert.ToInt32(dynObj.begPosition);
        this._numChars = Convert.ToInt32(dynObj.numChars);
      }
      catch (Exception e)
      {
        throw new Exception("Failed to get data from TextRegEx document variable bad format - " + e.Message);
      }

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;          

      //must load everything in LoadObjLinks because the states must be loaded first so we have the IDs. 
      processed = true;
      return true;
    }

    public override void SetValue(object newValue)
    {
      _value = newValue;
      Regex rx = new Regex(_linkStr, RegexOptions.Compiled | RegexOptions.IgnoreCase);
      string docTxt = File.ReadAllText(this._docPath);
      // Find matches.
      MatchCollection matches = rx.Matches(docTxt);

      if (matches.Count < 0)
      {
        throw new Exception("Failed to find RegEx - " + _linkStr + " in file - " + _docPath);
      }

      try
      {
        if (this._regExpLine == 0)
        {
          docTxt = rx.Replace(docTxt, newValue.ToString(), 1);
          File.WriteAllText(_docPath, docTxt);
        }
        else
        {

          //Split text blob by that match.
          string[] matchSplit = rx.Split(docTxt);
          //Then count the number of line brakes before the match.
          int lineMatch = new Regex(@"(\n|\r\n?)").Matches(matchSplit[0]).Count;
          string[] docLines = docTxt.Split(new[] { Environment.NewLine }, StringSplitOptions.None);

          if (_regExpLine > 0)
            lineMatch = lineMatch + _regExpLine;
          string line = docLines[lineMatch];

          if (_begPosition >= 0)
          {
            //cut the correct section from the line
            int cnt = this._numChars;
            if (cnt == 0) //go to the next space
              cnt = line.IndexOf(" ", _begPosition) - _begPosition;
            if (cnt < 0)
              cnt = line.Length - _begPosition;

            string begLine = "";
            if (_begPosition > 0)
              begLine = line.Substring(0, _begPosition);

            string endLine = "";
            if ((_begPosition + cnt) < line.Length)
              endLine = line.Substring(_begPosition + cnt, (line.Length - (_begPosition + cnt)));

            string newLine = begLine + newValue.ToString() + endLine;
            docLines[lineMatch] = newLine;
          }
          else
          {
            docLines[lineMatch] = newValue.ToString();
          }
          File.WriteAllLines(_docPath, docLines);
        }


      }
      catch
      {
        throw new Exception("Failed to write new value in document - " + _docPath);
      }
    }

    public override object GetValue()
    {
      Regex rx = new Regex(_linkStr, RegexOptions.Compiled | RegexOptions.IgnoreCase);
      string docTxt = File.ReadAllText(this._docPath);
      // Find matches.
      MatchCollection matches = rx.Matches(docTxt);

      if (matches.Count <= 0)
      {
        if (_dfltValue == null)
          throw new Exception("Failed to find RegEx - " + _linkStr + " in file - " + _docPath);
        else
          return Convert.ChangeType(_dfltValue, dType);
      }
      string foundTxt = matches[0].Value;
      try
      {
        if (this._regExpLine > 0)
        {

          //Split text blob by that match.
          string[] matchSplit = rx.Split(docTxt);
          //Then count the number of line brakes before the match.
          int lineMatch = new Regex(@"(\n|\r\n?)").Matches(matchSplit[0]).Count;
          string[] docLines = docTxt.Split(new[] { Environment.NewLine }, StringSplitOptions.None);
          foundTxt = docLines[lineMatch + _regExpLine];

          if (_begPosition >= 0)
          {
            //cut the correct section from the line
            int cnt = this._numChars;
            if (cnt == 0) //go to the next space
              cnt = foundTxt.IndexOf(" ", _begPosition) - _begPosition;
            if (cnt < 0)
              cnt = foundTxt.Length - _begPosition;
            foundTxt = foundTxt.Substring(_begPosition, cnt);
          }
        }

        return Convert.ChangeType(foundTxt, dType);
      }
      catch
      {
        throw new Exception("Failed to convert - " + foundTxt + " into a " + this.dType.ToString());
      }
    }

    //public class TimeStateVariable : SimVariable
    //{
    //  public BTreeDictionary<TimeSpan, TimeMoveEvent> timedEvQue = new BTreeDictionary<TimeSpan, TimeMoveEvent>();
    //  public Dictionary<int, List<TimeSpan>> stateRefLookup = new Dictionary<int, List<TimeSpan>>(); //lookup of state IDs to a key in TimedEvQue.
    //  public List<TimeMoveEvent> poppedList = new List<TimeMoveEvent>();

    //  public Dictionary<int, StatePath> curStates = new Dictionary<int, StatePath>();
    //  public Dictionary<int, RemovedStateInfo> removedItems = new Dictionary<int, RemovedStateInfo>();
    //  public MyBitArray curStatesBS;

    //  //public List<Tuple<int, int, string>> nextStateQue = new List<Tuple<int, int, string>>();
    //  //public List<EventListData> processEventList = new List<EventListData>();

    //  public TimeStateVariable(string inName)
    //    : base(inName, EnVarScope.gtTimeState, typeof(double))
    //  {
    //  }

    //  public override string GetDerivedJSON()
    //  {
    //    string retStr = "";

    //    //todo
    //    ////add derived items
    //    //retStr = retStr + "," + Environment.NewLine + "\"simCompOwner\": \"" + this.simCompOwner.name + "\"";

    //    return retStr;
    //  }

    //  public override bool DeserializeDerived(object obj, bool wrapped, LookupLists lists, bool useGivenIDs)
    //  {
    //    //TODO
    //    //dynamic dynObj = (dynamic)obj;
    //    //if (wrapped)
    //    //{
    //    //  if (dynObj.Variable == null)
    //    //    return false;

    //    //  dynObj = ((dynamic)obj).Variable;
    //    //}

    //    //bool retVal = base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs);


    //    //if (retVal && (dynObj.simCompOwner != null))
    //    //{
    //    //  lists.allVariables.Add(this, false);

    //    //  simCompOwner = (EvalDiagram)lists.allDiagrams.FindByName((string)dynObj.simCompOwner);

    //    //  retVal = simCompOwner != null;
    //    //}

    //    //processed = true;
    //    //return retVal;


    //    return true;
    //  }

    //  public override bool LoadObjLinks(object obj, bool wrapped, LookupLists lists)
    //  {
    //    //todo
    //    //dynamic dynObj = (dynamic)obj;
    //    //if (wrapped)
    //    //{
    //    //  if (dynObj.Variable == null)
    //    //    return false;

    //    //  dynObj = ((dynamic)obj).Variable;
    //    //}

    //    //if (dynObj.simCompOwner != null)
    //    //{
    //    //  lists.allVariables.Add(this, false);

    //    //  simCompOwner = (EvalDiagram)lists.allDiagrams.FindByName((string)dynObj.simCompOwner);

    //    //  if (simCompOwner == null)
    //    //    throw new Exception("Failed to find Diagram named - " + (string)dynObj.simCompOwner);
    //    //}

    //    return true;
    //  }

    //  public void SaveTimeQue(TimeSpan toTime,  BTreeDictionary<TimeSpan, TimeMoveEvent> timedEvQue, Dictionary<int, List<TimeSpan>> stateRefLookup, List<TimeMoveEvent> poppedList)
    //  {
    //    this.timedEvQue.Clear();
    //    this.value = toTime.TotalHours;

    //    foreach(var ev in timedEvQue)
    //    {
    //      this.timedEvQue.Add(new TimeSpan(ev.Key.Ticks), new TimeMoveEvent(ev.Value));
    //    }

    //    this.stateRefLookup.Clear();
    //    foreach (var sRef in stateRefLookup)
    //    {
    //      this.stateRefLookup.Add(sRef.Key, new List<TimeSpan>(sRef.Value));
    //    }

    //    //this.poppedList.Clear();
    //    //for(int i=0; i<poppedList.Count(); i++)
    //    //{
    //    //  this.poppedList.Add(new TimeMoveEvent(poppedList[i]));
    //    //}
    //  }

    //  public void SaveStateQue(Dictionary<int, StatePath> inCurStates, Dictionary<int, RemovedStateInfo> inRemovedItems, MyBitArray inCurStatesBS)
    //  {
    //    this.curStates.Clear();
    //    foreach (var st in inCurStates)
    //    {
    //      this.curStates.Add(st.Key, new StatePath(st.Value));
    //    }

    //    //this.removedItems.Clear();
    //    //foreach (var st in inRemovedItems)
    //    //{
    //    //  this.removedItems.Add(st.Key, new RemovedStateInfo(st.Value));
    //    //}

    //    this.curStatesBS = new MyBitArray(inCurStatesBS);
    //  }

    //  //public void SaveProcessLists(List<EventListData> inProcessEventList, List<Tuple<int, int, string>> inNextStateQue)
    //  //{
    //  //  this.processEventList.Clear();
    //  //  foreach(var ev in inProcessEventList)
    //  //  {
    //  //    this.processEventList.Add(ev);
    //  //  }

    //  //  this.nextStateQue.Clear();
    //  //  foreach(var st in inNextStateQue)
    //  //  {
    //  //    this.nextStateQue.Add(st);
    //  //  }
    //  //}
    //}

  }

  public class VariableList : Dictionary<int, SimVariable>, ModelItemLists
  {
    private List<SimVariable> deleted = new List<SimVariable>();
    private Dictionary<string, int> nameToID = new Dictionary<string, int>();
    private Dictionary<string, int> sim3dNameIDToID = new Dictionary<string, int>();

    public bool loaded = false;

    public void Add(SimVariable var, bool errorOnDup = true)
    {
      if (nameToID.ContainsKey(var.name))
      {
        if (errorOnDup)
          throw new Exception("Variable already exists " + var.name);
        return;
      }

      nameToID.Add(var.name, var.id);

      if (var is Sim3DVariable)
      {
        string simName = ((Sim3DVariable)var).sim3DNameId;
        if (sim3dNameIDToID.ContainsKey(simName))
          throw new Exception("External Sim variable \"" + simName + " is already attached to an EMRALD variable and can't be used again.");

        sim3dNameIDToID.Add(((Sim3DVariable)var).sim3DNameId, var.id);
      }

      this.Add(var.id, var);
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
          retStr = retStr + ((BaseObjInfo)item.Value).name + " Variable not processed" + Environment.NewLine;
      }

      return retStr;
    }

    new public void Clear()
    {
      nameToID.Clear();
      sim3dNameIDToID.Clear();
      deleted.Clear();
      base.Clear();
    }

    public void DeleteAll()
    {
      foreach (SimVariable curVar in this.Values)
      {
        deleted.Add(curVar);
      }

      nameToID.Clear();
      sim3dNameIDToID.Clear();
      base.Clear();
    }

    public void ReInitAll()
    {
      foreach (var v in this)
      {
        v.Value.ReInit();
      }
    }

    new public void Remove(int key)
    {
      if (this.ContainsKey(key))
      {
        SimVariable temp = this[key];

        deleted.Add(temp);

        nameToID.Remove(temp.name);

        if (temp is Sim3DVariable)
          sim3dNameIDToID.Remove(((Sim3DVariable)temp).sim3DNameId);

        base.Remove(key);
      }
    }

    public int maxID { get { if (this.Count > 0) { return this.Keys.Max(); } else { return 0; } } }

    public SimVariable FindByName(string name, bool exception = true)
    {
      try
      {
        if (nameToID.ContainsKey(name))
          return this[nameToID[name]];
        else
        {
          if (exception)
            throw new Exception("Failed to find Variable - " + name);
          else
            return null;
        }
      }
      catch
      {
        if (exception)
          throw new Exception("Failed to find Variable - " + name);
        else
          return null;
      }

      //int loc = -1;
      //if (nameToID.TryGetValue(name, out loc))
      //{
      //  return this[nameToID[name]];
      //}

      //return null;
    }

    public SimVariable FindBySim3dId(string findSim3dNameId)
    {
      if (!sim3dNameIDToID.ContainsKey(findSim3dNameId))
      {
        return null;
      }

      return this[sim3dNameIDToID[findSim3dNameId]];
    }

    public static SimVariable CreateNewSimVariable(EnVarScope scope, dynamic item)
    {
      switch (scope)
      {
        case EnVarScope.gtLocal: return new SimCompVariable();
        case EnVarScope.gtGlobal: return new SimGlobVariable();
        case EnVarScope.gt3DSim: return new Sim3DVariable();
        case EnVarScope.gtAccrual: return new AccrualVariable();
        case EnVarScope.gtDocLink:
          DocType docVarType = (DocType)Enum.Parse(typeof(DocType), (string)item.docType, true);
          switch (docVarType)
          {
            case DocType.dtJSON:
              return new JSONDocVariable();
            case DocType.dtXML:
              return new XmlDocVariable();
            case DocType.dtTextRegEx:
              return new TextRegExVariable();
            default: throw new Exception("Invalid document variable type.");
          }
        default: throw new Exception("Invalid Sim variable type.");
      }
    }

    public string GetJSON(bool incBrackets, EmraldModel lists)
    {
      string retStr = "";
      if (incBrackets)
      {
        retStr = "{";
      }
      retStr = retStr + "\"VariableList\": [";

      int i = 1;
      foreach (SimVariable curItem in this.Values)
      {
        retStr = retStr + Environment.NewLine;
        retStr += curItem.GetJSON(true, lists);
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

      foreach (var wrapper in dynamicObj)
      {
        var item = wrapper.Variable;
        try
        {
          SimVariable curItem = null;

          if (loaded && (item.id != null) && ((int)item.id > 0))
          {
            curItem = this[(int)item.id];
            if (curItem == null)
              throw new Exception("Failed to find Variable with id of " + (int)item.id);
          }
          else
          {
            curItem = this.FindByName((string)item.name, false);
            if (curItem != null)
              throw new Exception("Variable with the name of " + (string)item.name + " already exists");
          }

          if (curItem == null)
          {
            EnVarScope scope = (EnVarScope)Enum.Parse(typeof(EnVarScope), (string)item.varScope, true);
            curItem = CreateNewSimVariable(scope, item);
          }

          if (!curItem.DeserializeDerived((object)item, false, lists, useGivenIDs))
            throw new Exception("Failed to deserialize Variables List JSON");
        }
        catch (Exception e)
        {
          throw new Exception("(Variable - " + item["name"] + ") " + e.Message);
        }
      }
    }

    public bool LoadLinks(object obj, EmraldModel lists)
    {
      var dynamicObj = (dynamic)obj;

      foreach (var wrapper in dynamicObj)
      {
        var item = wrapper.Variable;
        EnVarScope scope = (EnVarScope)Enum.Parse(typeof(EnVarScope), (string)item.varScope, true);

        if ((scope == EnVarScope.gtLocal) || (scope == EnVarScope.gtAccrual))
        {

          SimVariable curItem = this.FindByName((string)item.name, false);
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
            throw new Exception("On variable named " + curItem.name + ". " + e.Message);
          }
        }
      }

      return true;
    }
  }
}
