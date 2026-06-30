// Copyright 2021 Battelle Energy Alliance
// Defines the SimVariable hierarchy (local, global, accrual, doc-link) for storing and updating simulation variable values.

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;
using MessageDefLib;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;

namespace SimulationDAL
{
  public enum EnVarScope { gtLocal = 0, gtGlobal, gt3DSim, gtAccrual, gtDocLink };
  public enum DocType { dtXML = 0, dtJSON, dtTextRegEx };

  public abstract class SimVariable : BaseObjInfo
  {
    private bool _canMonitor = true; //Show in the UI to watch the variable
    private bool _monitor = false; //Default value to watch the variable in the solver UI
    private bool _cumulativeStats = false; //provide the statistical results for this variable at the end of the sim runs
    public EnVarScope varScope = EnVarScope.gtGlobal;
    public Type dType = null!;
    protected object _value = null!;
    public bool resetOnRuns = false;
    protected object initValue = null!;
    readonly NLog.Logger logger = NLog.LogManager.GetLogger("logfile");

    public double dblValue { get { return Convert.ToDouble(GetValue(false)); } }
    public string strValue { get { return Convert.ToString(GetValue(false))!; } }
    public bool boolValue { get { return Convert.ToBoolean(GetValue(false)); } }
    public bool monitorInSim { get { return _monitor; } }
    public bool canMonitorSim { get { return _canMonitor; } }
    public bool cumulativeStats { get { return _cumulativeStats; } }

    public virtual object value { get { return GetValue(false); } }
    public virtual object NoUpdateValue { get { return _value; } }
    // public DateTime timeValue { get { return Convert.ToDateTime(value); } }

    public virtual void SetValue(object newValue)
    {

      logger.Debug($"Set variable Value : {name} = {newValue}");
      _value = newValue;
    }

    public virtual object GetValue(bool dfltOnError)
    {
      return _value;
    }
    public virtual void InitValue(dynamic dynObj)
    {
      try
      {
        _value = Convert.ChangeType(dynObj, dType);
        logger.Debug($"Init variable Value : {name} = {_value}");
      }
      catch (Exception e)
      {
        throw new Exception($"Failed to initialize variable, not the correct type. {e.Message}");
      }

      //save initial value for initValue if resetting
      initValue = _value;
    }
    public virtual void ReInit()
    {
      _value = initValue;
      logger.Debug($"Init variable Value : {name} = {_value}");
    }

    protected SimVariable()
    {
      _id = SingleNextIDs.Instance.NextID(EnIDTypes.itVar);
    }

    protected SimVariable(string inName, EnVarScope inType, Type inDType, object inVal = null!)
    {
      _id = SingleNextIDs.Instance.NextID(EnIDTypes.itVar);

      name = inName;
      varScope = inType;
      _value = inVal;
      initValue = inVal;
      dType = inDType;
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
      retStr += $"\"Variable\": {{{Environment.NewLine + base.GetJSON(false, lists)},{Environment.NewLine}";

      //add derived items
      retStr += $"\"varScope\": \"{varScope}\",{Environment.NewLine}";

      if (varScope == EnVarScope.gtDocLink)//wait until GetDerivedJSON for doc variables to put in default value since default value not read until then
      { }
      else if (dType.Name.ToString() == "String")//need quotes around the string and string should be as is (not all lower case), no quotes around other variable types
      {
        retStr += $"\"value\": \"{_value}\",{Environment.NewLine}";
      }
      else
      {
        retStr += $"\"value\": {_value.ToString()!.ToLower()},{Environment.NewLine}";
      }

      if (varScope != EnVarScope.gtDocLink)//should not have resetOnRuns for doc variables
      {
        retStr += $"\"resetOnRuns\": {resetOnRuns.ToString().ToLower()},{Environment.NewLine}";//removed quotes
      }

      string t = dType.Name.ToLower() switch
      {
        "int32" => "int",
        "boolean" => "bool",
        "string" => "string",
        "double" => "double",
        _ => "string",
      };
      retStr += $"\"type\": \"{t}\"";
      retStr += GetDerivedJSON();

      retStr += $"{Environment.NewLine}}}";

      if (incBrackets)
      {
        retStr += $"{Environment.NewLine}}}";
      }

      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = obj;

      if (wrapped)
      {
        if (dynObj.Variable == null)
          return false;

        dynObj = ((dynamic)obj).Variable;
      }

      try
      {
        //string dType = ((String)dynObj.type);
        string t = ((string)dynObj.type).ToUpper()[..3];
        dType = t switch
        {
          "INT" => typeof(int),
          "DOU" or "TIM" => typeof(double),
          //todo
          //case "TIM":
          //  dType = typeof(TimeSpan);
          //  value = XMLConvert.toTimeSpan(dynObj.value);
          //  break;
          "STR" => typeof(string),
          "BOO" => typeof(bool),
          _ => throw new Exception($"Value not matching Variable type - {(string)dynObj.value} -to- {(string)dynObj.type}"),
        };
      }
      catch
      {
        throw new Exception($"Variable \"{name}\"  missing type.");
      }

      if (dynObj.monitorInSim != null)
      {
        _monitor = Convert.ToBoolean(dynObj.monitorInSim);
      }
      else
      {
        _monitor = false;
      }

      if (dynObj.canMonitor != null)
      {
        _canMonitor = Convert.ToBoolean(dynObj.canMonitor);
      }
      else
      {
        _canMonitor = true;
      }

      if (dynObj.cumulativeStats != null)
      {
        _cumulativeStats = Convert.ToBoolean(dynObj.cumulativeStats);
      }
      else
      {
        _cumulativeStats = false;
      }

      try
      {
        if (dynObj.resetOnRuns != null)
          resetOnRuns = Convert.ToBoolean(dynObj.resetOnRuns);
      }
      catch
      {
        resetOnRuns = true;
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

    public virtual List<ScanForReturnItem> ScanFor(ScanForTypes scanType, string modelRootPath)
    {
      //override in the different types if it is possible that the item has something for the scanType 
      return [];
    }
  }

  public class SimGlobVariable : SimVariable
  {
    public SimGlobVariable()
      : base() { varScope = EnVarScope.gtGlobal; }

    public SimGlobVariable(string inName, Type inDType, object inVal = null!)
      : base(inName, EnVarScope.gtGlobal, inDType, inVal) { }

    public override string GetDerivedJSON() { return ""; }
  }

  public class Sim3DVariable : SimVariable
  {
    public string sim3DNameId = "";
    public ExternalSim extSim = null!;

    //Optional fParser boolean expression sent to the external sim so it only reports this variable
    //while the expression is true, e.g. "(valve_12 > 5) & (valve_12 < 10)". Empty = report on every change.
    public string WatchEventCriteria = "";

    public string resourceName { get { return extSim.resourceName; } }

    public Sim3DVariable()
      : base() { varScope = EnVarScope.gt3DSim; }

    public Sim3DVariable(string inName, string inSim3DNameId, Type inDType, object inVal = null!)
      : base(inName, EnVarScope.gt3DSim, inDType, inVal)
    {
      sim3DNameId = inSim3DNameId;
    }

    public override string GetDerivedJSON()
    {
      //add derived items
      string retStr = $",{Environment.NewLine}\"sim3DId\": \"{sim3DNameId}\"";

      if (!string.IsNullOrEmpty(WatchEventCriteria))
      {
        //SerializeObject quotes/escapes the fParser expression as a JSON string.
        retStr += $",{Environment.NewLine}\"WatchEventCriteria\": {JsonConvert.SerializeObject(WatchEventCriteria)}";
      }

      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = obj;
      if (wrapped)
      {
        if (dynObj.Variable == null)
          return false;

        dynObj = ((dynamic)obj).Variable;
      }

      sim3DNameId = Convert.ToString(dynObj.sim3DId);

      if (dynObj.WatchEventCriteria != null)
      {
        //Optional fParser expression string.
        WatchEventCriteria = Convert.ToString(dynObj.WatchEventCriteria);
      }

      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      lists.allVariables.Add(this, false);

      processed = true;
      return true;
    }

    public override bool LoadObjLinks(object obj, bool wrapped, EmraldModel lists)
    {
      dynamic dynObj = obj;
      try
      {
        if (wrapped)
        {
          if (dynObj.Variable == null)
            return false;
          if (((dynamic)obj).Variable != null)
            dynObj = ((dynamic)obj).Variable;
          else
            return false;
        }

        if (dynObj.extSim == null)
        {
          throw new Exception("Missing extSim property to specify simulation to link variable to.");
        }
        else
        {
          extSim = lists.allExtSims.FindByName((string)dynObj.extSim);
        }

        //Validate the optional WatchEventCriteria fParser expression. It may only reference the
        //sim3D ids of external sim (gt3DSim) variables - this one or others - and no other variables.
        if (!string.IsNullOrEmpty(WatchEventCriteria))
        {
          HashSet<string> allowedIds = [];
          foreach (var v in lists.allVariables.Values)
          {
            if (v is Sim3DVariable s3d && !string.IsNullOrEmpty(s3d.sim3DNameId))
              allowedIds.Add(s3d.sim3DNameId);
          }

          if (!FParser.TryValidate(WatchEventCriteria, allowedIds, out string fpErr))
            throw new Exception($"Invalid WatchEventCriteria expression \"{WatchEventCriteria}\" - {fpErr}");
        }
      }
      catch (Exception e)
      {
        throw new Exception($"Failed to load object links for Sim3DVariable named - {name} error - {e.Message}");
      }

      return true;
    }
  }

  public class SimCompVariable : SimVariable
  {
    protected EvalDiagram simCompOwner = null!;

    public SimCompVariable()
      : base() { varScope = EnVarScope.gtLocal; }

    public SimCompVariable(string inName, EvalDiagram inCompOwner, Type inDType, object inVal = null!)
      : base(inName, EnVarScope.gtLocal, inDType, inVal)
    {
      simCompOwner = inCompOwner;
    }

    public override string GetDerivedJSON()
    {
      //add derived items
      return $",{Environment.NewLine}\"simCompOwner\": \"{simCompOwner.name}\"";
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = obj;
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
      dynamic dynObj = obj;
      if (wrapped)
      {
        if (dynObj.Variable == null)
          return false;

        dynObj = ((dynamic)obj).Variable;
      }

      if (dynObj.simCompOwner != null)
      {
        lists.allVariables.Add(this, false);

        simCompOwner = (EvalDiagram)lists.allDiagrams.FindByName((string)dynObj.simCompOwner) ?? throw new Exception($"Failed to find Diagram named - {(string)dynObj.simCompOwner}");
      }

      return true;
    }
  }

  public class AccrualVariable : SimVariable
  {
    [JsonConverter(typeof(StringEnumConverter))]
    public enum EnCumultiveType { ctTime, ctMultiplier, ctTable };//, ctCustScript};
    public class AccrualVarData
    {

      public string stateName = "";
      public EnCumultiveType type = EnCumultiveType.ctTime;
      public double accrualMult = 0.0;
      public EnTimeRate multRate = EnTimeRate.trHours; //for ctTable or ctMultiplier type, rate of accrual in table
      public List<List<double>> accrualTable = [];

      //todo for custScript if added
      //public string compCode = "";
      //protected bool compiled;
      //protected ScriptEngine compiledComp;
      //protected List<Variable> varList = null;
    }

    protected AllStates _StateList = [];
    protected Dictionary<int, AccrualVarData> _CumulativeParams = [];

    public AccrualVariable()
      : base()
    {
      varScope = EnVarScope.gtAccrual;
      dType = typeof(double);
      resetOnRuns = true;
    }

    public override string GetDerivedJSON()
    {
      //add derived items
      string retStr = $",{Environment.NewLine}\"accrualStatesData\": [{Environment.NewLine}";
      foreach (var state in _StateList)
      {

        AccrualVarData varData = _CumulativeParams[state.Key];
        retStr += $"{JsonConvert.SerializeObject(varData, Newtonsoft.Json.Formatting.Indented)},";

      }
      retStr = retStr.TrimEnd([',']);
      retStr += $"]{Environment.NewLine}";


      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = obj;
      if (wrapped)
      {
        if (dynObj.Variable == null)
          return false;

        dynObj = ((dynamic)obj).Variable;

      }

      bool retVal = base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs);

      if (dynObj.accrualStatesData == null)
      {
        throw new Exception("Missing accrualStatesData for accrualVariable variable");
      }


      //must load everything in LoadObjLinks because the states must be loaded first so we have the IDs.     

      processed = true;
      return retVal;
    }

    public override bool LoadObjLinks(object obj, bool wrapped, EmraldModel lists)
    {
      dynamic dynObj = obj;
      try
      {
        if (wrapped)
        {
          if (dynObj.Variable == null)
            return false;
          if (((dynamic)obj).Variable != null)
            dynObj = ((dynamic)obj).Variable;
          else
            return false;
        }

        dynamic accrData = dynObj.accrualStatesData;
        int i = 0;
        foreach (dynamic toStateItem in dynObj.accrualStatesData)
        {
          string error = VerifyDataObj(toStateItem);
          if (error != "")
            throw new Exception($"\"accrualStatesData\"[{i}], {error}");
          State curState = lists.allStates.FindByName((string)toStateItem.stateName);
          _StateList.Add(curState.id, curState);
          string s = JsonConvert.SerializeObject(toStateItem);
          AccrualVarData data = JsonConvert.DeserializeObject<AccrualVarData>(s)!;
          _CumulativeParams.Add(curState.id, data);
          List<AccrualVariable> addTo = null!;
          if (lists.AccrualVars.TryGetValue(curState.id, out addTo!))
          {
            addTo.Add(this);
          }
          else
          {
            lists.AccrualVars.Add(curState.id, [this]);
          }

          i++;
        }
      }
      catch (Exception e)
      {
        throw new Exception($"Missing accrualStatesData for accrualVariable named - {name} error - {e.Message}");
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
      object compValue = _value;
      State inState = _StateList[inStateID];
      if (inState == null)
        return false;
      AccrualVarData aData = _CumulativeParams[inStateID] ?? throw new Exception("Missing AccrualVarData for State - " + inState.name);
      switch (aData.type)
      {
        case EnCumultiveType.ctTime:
          throw new Exception("not implemented time type placeholder");
        //_value = (double)_value + Globals.ConvertToNewTimeSpan(EnTimeRate.trHours, tInState.TotalHours, this.varRate);


        case EnCumultiveType.ctMultiplier:
          double addVal = aData.accrualMult * Globals.ConvertToNewTimeSpan(EnTimeRate.trHours, tInState.TotalHours, aData.multRate);
          base.SetValue((double)_value + addVal);
          break;

        case EnCumultiveType.ctTable:
          //add all the full table sections
          int i;
          double totalTblTime = 0;
          for (i = 1; i < aData.accrualTable.Count; i++)
          {

            double tblTimeConverted = Globals.ConvertToNewTimeSpan(EnTimeRate.trHours, aData.accrualTable[i][0] - aData.accrualTable[i - 1][0], aData.multRate);
            totalTblTime += tblTimeConverted;
            if (tInState.TotalHours > totalTblTime) //full time used
            {
              base.SetValue((double)_value + tblTimeConverted * aData.accrualTable[i - 1][1]);
            }
            else //partial time used
            {
              double remainTime = tblTimeConverted - (totalTblTime - tInState.TotalHours);
              totalTblTime += tblTimeConverted;
              break;
            }
          }
          break;

        default:
          throw new Exception($"Accrual data type{aData.type} not implemented.");
      }

      return compValue != _value;
    }
  }

  public abstract class DocVariable : SimVariable
  {
    protected DocType _docType = DocType.dtXML;
    protected string _docPath = "";
    protected string _linkStr = ""; //xpath for xml, JSONPath for JSON, and regExp string for TextRegExp
    protected bool _pathMustExist = false;
    protected object _dfltValue = null!;
    protected string _docFullPath = "";
    private VariableList _vars = null!;

    protected string linkStr()
    {
      if (_vars == null)
        return _linkStr;

      //replace any variables in the string
      string newStr = "";
      //string remaining = _linkStr;
      int lastIdx = 0;
      for (int index = 0; ; index += 1)
      {
        index = _linkStr.IndexOf('%', index);
        if (index == -1)
        {
          newStr += _linkStr[lastIdx..];
          break;
        }
        int end = 1;
        while (((end + index) <= _linkStr.Length) && (char.IsDigit(_linkStr[end + index]) || char.IsLetter(_linkStr[end + index]) || (_linkStr[end + index] == '_')))
          end++;
        string varName = _linkStr.Substring(index, end).Trim('%');
        SimVariable replVar = _vars.FindByName(varName, false) ?? throw new Exception($"Failed to find variable {varName} for document variable in {name}");
        newStr += _linkStr[lastIdx..index];
        newStr += replVar.value.ToString();
        index += end;
        lastIdx = index;
      }

      return newStr;
    }

    public override void ReInit()
    {
      if (initValue == null)
      {
        InitValue(GetValue(true));
      }

      _value = initValue!;
      _oldLinkStr = ""; //reset so it tires to load as needed
    }

    //params to see if we need to update the value or not on reading data
    protected DateTime _timestamp = DateTime.MinValue; //timestamp of doc file
    protected string _oldLinkStr = ""; //To see if link string has changed 

    public DocVariable(DocType subType)
      : base()
    {
      varScope = EnVarScope.gtDocLink;
      dType = typeof(string);
      _docType = subType;
    }

    public override string GetDerivedJSON()
    {
      string retStr = $",{Environment.NewLine}\"value\": {_dfltValue}";
      retStr += $",{Environment.NewLine}\"docLink\": \"{_linkStr}\"";
      retStr += $",{Environment.NewLine}\"docType\": \"{_docType}\"";
      retStr += $",{Environment.NewLine}\"docPath\": \"{_docPath}\"";
      retStr += $",{Environment.NewLine}\"pathMustExist\": {_pathMustExist.ToString().ToLower()}";

      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = obj;
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
        _pathMustExist = Convert.ToBoolean(dynObj.pathMustExist);


      _docType = (DocType)dynObj.docType;
      _docPath = Convert.ToString(dynObj.docPath);

      if (_docPath.Trim() == "")
        throw new Exception("No doc path assigned for document variable.");

      if (!Path.IsPathRooted(_docPath) && (_docPath[0] == '.'))
      {
        _docFullPath = lists.rootPath;
        if (!_docFullPath.EndsWith('\\'))
          _docFullPath += @"\";

        _docFullPath = CommonFunctions.NormalizeGetFullPath(Path.Combine(_docFullPath, _docPath));
      }
      else
      {
        _docFullPath = _docPath;
      }

      if (_pathMustExist && !File.Exists(_docFullPath) &&
          !_docFullPath.Contains("AppData")) //If this is a multithread path then don't check!
      {
        throw new Exception($"No file located at - {_docFullPath} for Document variable ");
      }

      if (dynObj.docLink == null)
        throw new Exception("Missing docLink for document variable");

      _linkStr = Convert.ToString(dynObj.docLink);

      bool retVal = base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs);
      _vars = lists.allVariables;

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
        throw new Exception($"Failed to initialize default value, not the correct type. {e.Message}");
      }

      try
      {
        if (_pathMustExist && File.Exists(_docFullPath) && _docFullPath.Contains("AppData")) //if the file doesn't exist yet, load on reInit 
        {
          //do this different for document items as the value is not set by the user data
          base.InitValue(GetValue(true));
          //save initial value for initValue if resetting
          initValue = _value;
        }
      }
      catch (Exception e)
      {
        throw new Exception($"Failed to initialize variable, not the correct type. {e.Message}");
      }
    }

    public override List<ScanForReturnItem> ScanFor(ScanForTypes scanType, string modelRootPath)
    {
      var itemList = new List<ScanForReturnItem>();

      if (scanType == ScanForTypes.sfMultiThreadIssues)
      {
        //the docPath is a file references so return it.  
        itemList.Add(new ScanForRefsItem(id,
                                        name,
                                        EnIDTypes.itVar,
                                        $"Document Variable[{name}] has a file path reference: {_docPath}",
                                        _docPath));
      }

      return itemList;
    }


    public void UpdatePathRefs(string oldRef, string newRef, string modelPath)
    {
      if (_docPath == oldRef)
      {
        _docPath = newRef;
        if (!Path.IsPathRooted(_docPath) && (_docPath[0] == '.'))
        {
          _docFullPath = modelPath;
          if (!_docFullPath.EndsWith('\\'))
            _docFullPath += @"\";

          _docFullPath = CommonFunctions.NormalizeGetFullPath(Path.Combine(_docFullPath, _docPath));
        }
        else
        {
          _docFullPath = _docPath;
        }
      }
      else
        throw new Exception("Current document reference does not match request to change.");

    }
  }

  public class XmlDocVariable : DocVariable
  {


    public XmlDocVariable()
      : base(DocType.dtXML) { }

    public override void SetValue(object newValue)
    {
      _value = newValue;
      bool fileUpdated = false;
      int retryCount = 0;

      while (!fileUpdated && retryCount < 5)
      {
        try
        {
          XmlDocument xDoc = new()
          {
            PreserveWhitespace = true
          };
          using (XmlReader reader = XmlReader.Create(_docFullPath))
          {
            xDoc.Load(reader);
          }
          XmlElement pRoot = xDoc.DocumentElement!;
          XmlNodeList nodes = pRoot.SelectNodes(linkStr())!;
          XmlNode replNode = null!;
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
                i.InnerText = _value.ToString()!;
                break;
              default:
                if (replNode == null)
                {
                  XmlDocument repl = new();
                  repl.LoadXml(strValue);
                  replNode = xDoc.ImportNode(repl.DocumentElement!, true);
                }
                var p = i.ParentNode ?? throw new Exception("Variable SetValue - parent node is null, this should not happen.");
                var ret = p.ReplaceChild(replNode, i);
                break;
            }
          }

          // Detect original BOM so the save doesn't change the file's encoding
          Encoding writeEncoding;
          {
            byte[] bom = new byte[3];
            using (FileStream fs = File.OpenRead(_docFullPath))
              fs.ReadExactly(bom, 0, 3);
            writeEncoding = (bom[0] == 0xEF && bom[1] == 0xBB && bom[2] == 0xBF)
              ? new UTF8Encoding(true)
              : new UTF8Encoding(false);
          }
          using (XmlWriter xWriter = XmlWriter.Create(_docFullPath, new XmlWriterSettings { Encoding = writeEncoding }))
            xDoc.Save(xWriter);
          fileUpdated = true;
        }
        catch (IOException ex)
        {
          retryCount++;
          Console.WriteLine($"Error updating file (attempt {retryCount}): {ex.Message}");
          System.Threading.Thread.Sleep(1000); // Wait for a second before retrying
        }
        catch (Exception ex)
        {
          throw new Exception($"Failed to set the value for XML variable {name} check the XML syntax. {linkStr()}", ex);
        }
      }

      if (!fileUpdated)
      {
        throw new IOException("Unable to update the file after multiple attempts.");
      }
    }

    public override object GetValue(bool dfltOnError)
    {
      bool fileRead = false;
      int retryCount = 0;
      object result = null!;

      while (!fileRead && retryCount < 5)
      {
        try
        {
          // Combined existence check with timestamp retrieval
          DateTime curTimestamp;
          try
          {
            curTimestamp = File.GetLastWriteTimeUtc(_docFullPath);

            // Check if file exists (GetLastWriteTimeUtc returns 1/1/1601 for non-existent files on Windows)
            if (curTimestamp.Year == 1601)
            {
              if (!_pathMustExist)
                return _dfltValue;
              else
                throw new FileNotFoundException($"Required file not found: {_docFullPath}");
            }
          }
          catch (Exception ex)
          {
            if (!_pathMustExist)
              return _dfltValue;
            throw new Exception($"Error accessing file: {_docFullPath}", ex);
          }

          // If not changed, return the previous value
          string curLinkStr = linkStr();
          if ((curTimestamp == _timestamp) && (_oldLinkStr == curLinkStr) && (_value != null))
          {
            return _value;
          }

          // Value is new, so save the timestamp and look up the new value
          _timestamp = curTimestamp;
          _oldLinkStr = curLinkStr;

          using (Stream s = File.OpenRead(_docFullPath))
          {
            XmlDocument xDoc = new();
            xDoc.Load(s);
            XmlElement pRoot = xDoc.DocumentElement!;
            XmlNodeList nodes = pRoot.SelectNodes(curLinkStr)!;
            if ((nodes == null) || (nodes.Count == 0))
            {
              if (_dfltValue == null)
              {
                throw new Exception("Path string found no items.");
              }
              else
              {
                base.SetValue(Convert.ChangeType(_dfltValue, dType));
                result = _value!;
              }
            }
            else if (nodes.Count == 1)
            {
              switch (nodes[0]!.NodeType)
              {
                case XmlNodeType.Attribute:
                  base.SetValue(Convert.ChangeType(nodes[0]!.Value, dType)!);
                  break;
                case XmlNodeType.Text:
                  base.SetValue(Convert.ChangeType(nodes[0]!.InnerText, dType));
                  break;
                default:
                  if (dType != typeof(string))
                  {
                    throw new Exception("Variable type to match to a XML object must be a String");
                  }
                  base.SetValue(nodes[0]!.OuterXml);
                  break;
              }
              result = _value!;
            }
            else // More than one, only allow text
            {
              if (dType != typeof(string))
              {
                throw new Exception("Variable type to match to a XML object list must be a String");
              }
              base.SetValue("");

              if (nodes.Count < 1)
              {
                throw new Exception($"Missing match for or data for XPath - {_linkStr}");
              }

              foreach (XmlNode i in nodes)
              {
                switch (nodes[0]!.NodeType)
                {
                  case XmlNodeType.Attribute:
                    base.SetValue(_value + Environment.NewLine + i.Value);
                    break;
                  case XmlNodeType.Text:
                    base.SetValue(_value + Environment.NewLine + i.InnerText);
                    break;
                  default:
                    base.SetValue(_value + Environment.NewLine + i.OuterXml);
                    break;
                }
              }

              base.SetValue(((string)_value!).TrimStart());
              result = _value;
            }
          }

          fileRead = true;
        }
        catch (IOException ex)
        {
          retryCount++;
          Console.WriteLine($"Error reading file (attempt {retryCount}): {ex.Message}");
          System.Threading.Thread.Sleep(1000); // Wait for a second before retrying
        }
        catch (Exception ex)
        {
          if (dfltOnError && !_pathMustExist)
            return _dfltValue;
          else
            throw new Exception($"Failed to get the value for XML variable {name}. Check the XML syntax. {linkStr()}", ex);
        }
      }

      if (!fileRead)
      {
        throw new IOException("Unable to read the file after multiple attempts.");
      }

      return result;
    }

  }
  public class JSONDocVariable : DocVariable
  {
    public JSONDocVariable()
      : base(DocType.dtJSON) { }

    public override void SetValue(object newValue)
    {
      // Update the base value
      base.SetValue(newValue);
      NLog.Logger logger = NLog.LogManager.GetLogger("logfile");
      logger.Info($"Assign Doc Var: {name}  = {newValue}");

      bool fileUpdated = false;
      int retryCount = 0;

      while (!fileUpdated && retryCount < 5)
      {
        try
        {
          JObject fullObj = null!;
          using (StreamReader sr = new(_docFullPath))
          {
            string test = sr.ReadToEnd();
            // Update the document
            fullObj = JObject.Parse(test);
            var modItems = fullObj.SelectTokens(linkStr()) ?? throw new Exception($"Failed to locate document reference - {linkStr()}");
            modItems = JsonExtensions.ReplacePath(fullObj, linkStr(), newValue);
          }
          // Update the JSON file with the change
          using (StreamWriter file = File.CreateText(_docFullPath))
          using (JsonTextWriter writer = new(file))
          {
            fullObj.WriteTo(writer);
          }


          fileUpdated = true;
        }
        catch (IOException ex)
        {
          retryCount++;
          logger.Warn($"Error updating file (attempt {retryCount}): {ex.Message}");
          System.Threading.Thread.Sleep(1000); // Wait for a second before retrying
        }
        catch (Exception e)
        {
          logger.Error($"Assign Doc Var failed: {name}  = {newValue} Error - {e.Message}");
          throw new Exception("Failed to update the JSON document.", e);
        }
      }

      if (!fileUpdated)
      {
        throw new IOException("Unable to update the file after multiple attempts.");
      }

    }

    public override object GetValue(bool dfltOnError)
    {
      _linkStr = _linkStr.Replace("\"", "'");

      bool fileRead = false;
      int retryCount = 0;
      object result = null!;

      while (!fileRead && retryCount < 5)
      {
        try
        {
          // Combined existence check with timestamp retrieval
          DateTime curTimestamp;
          try
          {
            curTimestamp = File.GetLastWriteTimeUtc(_docFullPath);

            // Check if file exists (GetLastWriteTimeUtc returns 1/1/1601 for non-existent files on Windows)
            if (curTimestamp.Year == 1601)
            {
              if (!_pathMustExist)
                return _dfltValue;
              else
                throw new FileNotFoundException($"Required file not found: {_docFullPath}");
            }
          }
          catch (Exception ex)
          {
            if (!_pathMustExist)
              return _dfltValue;
            throw new Exception($"Error accessing file: {_docFullPath}", ex);
          }

          // If not changed, return the previous value
          string curLinkStr = linkStr();
          if ((curTimestamp == _timestamp) && (_oldLinkStr == curLinkStr) && (_value != null))
          {
            return _value;
          }

          // Value is new, so save the timestamp and look up the new value
          _timestamp = curTimestamp;
          _oldLinkStr = curLinkStr;

          string fileStr = File.ReadAllText(_docFullPath);
          JObject fullObj = JObject.Parse(fileStr);
          JToken modItem = fullObj.SelectToken(curLinkStr)!;

          if (modItem == null)
          {
            if (_dfltValue == null)
            {
              throw new Exception("Path string found no items.");
            }
            else
            {
              base.SetValue(Convert.ChangeType(_dfltValue, dType));
              result = _value!;
            }
          }
          else if (modItem.Type == JTokenType.Object)
          {
            if (dType != typeof(string))
            {
              throw new Exception("Variable type to match to a JSON object must be a String");
            }

            base.SetValue(modItem.ToString());
            result = _value!;
          }
          else
          {
            base.SetValue(modItem.ToObject(dType)!);
            result = _value!;
          }

          fileRead = true;
        }
        catch (IOException ex)
        {
          retryCount++;
          Console.WriteLine($"Error reading file (attempt {retryCount}): {ex.Message}");
          System.Threading.Thread.Sleep(1000); // Wait for a second before retrying
        }
        catch (Exception ex)
        {
          if (dfltOnError && !_pathMustExist)
            return _dfltValue;
          else
            throw new Exception($"Failed to get the value for JSON variable {name}. Check the JSON syntax. {linkStr()}", ex);
        }
      }

      if (!fileRead)
      {
        throw new IOException("Unable to read the file after multiple attempts.");
      }

      return result!;
    }
  }

  public partial class TextRegExVariable : DocVariable
  {
    private int _regExpLine = -1;//-1 means just the regular expression, box unchecked
    private int _begPosition = 0;
    private int _numChars = -1; //-1 goes until the next white space

    private Regex _cachedRegex = null!;
    private string _cachedPattern = null!;
    [GeneratedRegex(@"(\n(?!\r)|\r(?!\n)|\r\n?)", RegexOptions.Compiled)]
    private static partial Regex LineBreakRegex();
    private static readonly Regex _lineBreakRegex = LineBreakRegex();

    public TextRegExVariable()
      : base(DocType.dtTextRegEx) { }

    private Regex GetCompiledRegex() => GetCompiledRegex(linkStr());

    private Regex GetCompiledRegex(string currentPattern)
    {
      if (_cachedRegex == null || _cachedPattern != currentPattern)
      {
        _cachedRegex = new Regex(currentPattern, RegexOptions.Compiled | RegexOptions.IgnoreCase);
        _cachedPattern = currentPattern;
      }

      return _cachedRegex;
    }

    public override string GetDerivedJSON()
    {
      string retStr = base.GetDerivedJSON();
      retStr += $",{Environment.NewLine}\"regExpLine\": \"{_regExpLine}\"";
      retStr += $",{Environment.NewLine}\"begPosition\": {_begPosition}";
      retStr += $",{Environment.NewLine}\"numChars\": {_numChars}";
      //TODO- File from Model Editor doesn't print JSON with " " around the value for _numChars, but this does. Should it have the " "? Should the other fields have " " around the value? Currently the Model Editor does print JSON with " " around the value for _regExpLine and _begPosition
      return retStr;
    }

    public override bool DeserializeDerived(object obj, bool wrapped, EmraldModel lists, bool useGivenIDs)
    {
      dynamic dynObj = obj;
      if (wrapped)
      {
        if (dynObj.Variable == null)
          return false;

        dynObj = ((dynamic)obj).Variable;
      }

      if (dynObj.regExpLine != null)
        _regExpLine = Convert.ToInt32(dynObj.regExpLine);

      if (dynObj.begPosition != null)
        _begPosition = Convert.ToInt32(dynObj.begPosition);

      if (dynObj.numChars != null)
        _numChars = Convert.ToInt32(dynObj.numChars);


      if (!base.DeserializeDerived((object)dynObj, false, lists, useGivenIDs))
        return false;

      //must load everything in LoadObjLinks because the states must be loaded first so we have the IDs. 
      processed = true;
      return true;
    }

    public override void SetValue(object newValue)
    {
      base.SetValue(newValue);
      Regex rx = GetCompiledRegex();
      bool fileUpdated = false;
      int retryCount = 0;

      while (!fileUpdated && retryCount < 5)
      {
        try
        {
          string docTxt = File.ReadAllText(_docFullPath);
          // Find matches.
          MatchCollection matches = rx.Matches(docTxt);

          if (matches.Count < 1)
          {
            throw new Exception($"Failed to find RegEx - {linkStr()} in file - {_docFullPath}");
          }

          if (_regExpLine == -1) // Change functionality, unchecked, want to use RegEx itself as variable value and variable value to be changed
          {
            docTxt = rx.Replace(docTxt, newValue.ToString()!, 1);
            File.WriteAllText(_docFullPath, docTxt);
          }
          else
          {
            // Split text blob by that match.
            string[] matchSplit = rx.Split(docTxt);
            // Then count the number of line breaks before the match.
            int lineMatch = _lineBreakRegex.Count(matchSplit[0]);
            string[] docLines = docTxt.Split([Environment.NewLine], StringSplitOptions.None);

            if (_regExpLine >= 0)
              lineMatch += _regExpLine;
            string line = docLines[lineMatch];

            if (_begPosition >= 0)
            {
              // Cut the correct section from the line
              int cnt = _numChars;
              if (cnt == 0) // Go to the next space
                cnt = line.IndexOf(' ', _begPosition) - _begPosition;
              if (cnt < 0)
                cnt = line.Length - _begPosition;

              string begLine = "";
              if (_begPosition > 0)
                begLine = line[.._begPosition];

              string endLine = "";
              if ((_begPosition + cnt) < line.Length)
                endLine = line[(_begPosition + cnt)..];

              string newLine = begLine + newValue.ToString() + endLine;
              docLines[lineMatch] = newLine;
            }
            else
            {
              docLines[lineMatch] = newValue.ToString()!;
            }
            File.WriteAllLines(_docFullPath, docLines);
          }

          fileUpdated = true;
        }
        catch (IOException ex)
        {
          retryCount++;
          Console.WriteLine($"Error updating file (attempt {retryCount}): {ex.Message}");
          System.Threading.Thread.Sleep(1000); // Wait for a second before retrying
        }
        catch (Exception ex)
        {
          throw new Exception($"Failed to write new value in document - {_docFullPath}", ex);
        }
      }

      if (!fileUpdated)
      {
        throw new IOException("Unable to update the file after multiple attempts.");
      }

    }

    public override object GetValue(bool dfltOnError)
    {
      // Resolve linkStr() once and pass it through — it's used both as the regex pattern
      // and as the cache-key comparison below.
      string curLinkStr = linkStr();
      Regex rx = GetCompiledRegex(curLinkStr);
      bool fileRead = false;
      int retryCount = 0;
      object result = null!;

      while (!fileRead && retryCount < 5)
      {
        try
        {
          // Combined existence check with timestamp retrieval
          DateTime curTimestamp;
          try
          {
            curTimestamp = File.GetLastWriteTimeUtc(_docFullPath);

            // Check if file exists (GetLastWriteTimeUtc returns 1/1/1601 for non-existent files on Windows)
            if (curTimestamp.Year == 1601)
            {
              if (!_pathMustExist)
                return _dfltValue;
              else
                throw new FileNotFoundException($"Required file not found: {_docFullPath}");
            }
          }
          catch (Exception ex)
          {
            if (!_pathMustExist)
              return _dfltValue;
            throw new Exception($"Error accessing file: {_docFullPath}", ex);
          }

          // If not changed, return the previous value
          if ((curTimestamp == _timestamp) && (_oldLinkStr == curLinkStr) && (_value != null))
          {
            return _value;
          }

          // Value is new, so save the timestamp and look up the new value
          _timestamp = curTimestamp;
          _oldLinkStr = curLinkStr;
          string docTxt = File.ReadAllText(_docFullPath);
          // Find the first match only — Matches+.Count would force a full enumeration of every
          // match in the file when we only ever use the first one.
          Match firstMatch = rx.Match(docTxt);

          if (!firstMatch.Success)
          {
            if (dfltOnError && !_pathMustExist)
            {
              result = _dfltValue;
            }
            else
            {
              throw new Exception($"Failed to find RegEx - {curLinkStr} in file - {_docFullPath}");
            }
          }
          else
          {
            string foundTxt = firstMatch.Value;
            try
            {
              if (_regExpLine >= 0)
              {
                // Count line breaks in the prefix before the match. Earlier code re-ran the
                // user regex over the whole file via rx.Split just to recover this prefix;
                // firstMatch.Index gives us the same answer with no extra regex scan.
                // Regex.Count on a ReadOnlySpan avoids allocating both the prefix substring
                // and the MatchCollection that .Matches(...).Count used to create.
                int lineMatch = _lineBreakRegex.Count(docTxt.AsSpan(0, firstMatch.Index));
                string[] docLines = docTxt.Split([Environment.NewLine, "\r"], StringSplitOptions.None);
                foundTxt = docLines[lineMatch + _regExpLine];

                if (_begPosition >= 0)
                {
                  // Cut the correct section from the line
                  int cnt = _numChars;
                  if (cnt == 0) // Go to the next space
                    cnt = foundTxt.IndexOf(' ', _begPosition) - _begPosition;
                  if (cnt < 0)
                    cnt = foundTxt.Length - _begPosition;
                  foundTxt = foundTxt.Substring(_begPosition, cnt);
                }
              }

              base.SetValue(Convert.ChangeType(foundTxt, dType));
              result = _value!;
            }
            catch (Exception ex)
            {
              throw new Exception($"Failed to convert - {foundTxt} into a {dType}", ex);
            }
          }

          fileRead = true;
        }
        catch (IOException ex)
        {
          retryCount++;
          Console.WriteLine($"Error reading file (attempt {retryCount}): {ex.Message}");
          System.Threading.Thread.Sleep(1000); // Wait for a second before retrying
        }
        catch (Exception ex)
        {
          if (dfltOnError && !_pathMustExist)
          {
            return _dfltValue;
          }
          else
          {
            throw new Exception($"Failed to get the value for RegEx variable {name}. Check the RegEx syntax. {linkStr()}", ex);
          }
        }
      }

      if (!fileRead)
      {
        throw new IOException("Unable to read the file after multiple attempts.");
      }

      return result;
    }
  }

  public class VariableList : Dictionary<int, SimVariable>, ModelItemLists
  {
    private readonly List<SimVariable> deleted = [];
    private readonly Dictionary<string, int> nameToID = [];
    private readonly Dictionary<string, int> sim3dNameIDToID = [];

    public bool loaded = false;

    public void Add(SimVariable var, bool errorOnDup = true)
    {
      if (nameToID.ContainsKey(var.name))
      {
        if (errorOnDup)
          throw new Exception($"Variable already exists {var.name}");
        return;
      }

      nameToID.Add(var.name, var.id);

      if (var is Sim3DVariable variable)
      {
        string simName = variable.sim3DNameId;
        if (sim3dNameIDToID.ContainsKey(simName))
          throw new Exception($"External Sim variable \"{simName}\" is already attached to an EMRALD variable and can't be used again.");

        sim3dNameIDToID.Add(variable.sim3DNameId, var.id);
      }

      if (ContainsKey(var.id))
        throw new Exception($"Variable {var.name} has already been added to the variable list.");
      Add(var.id, var);
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
          retStr += $"{item.Value.name} Variable not processed{Environment.NewLine}";
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
      foreach (SimVariable curVar in Values)
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
      if (ContainsKey(key))
      {
        SimVariable temp = this[key];

        deleted.Add(temp);

        nameToID.Remove(temp.name);

        if (temp is Sim3DVariable)
          sim3dNameIDToID.Remove(((Sim3DVariable)temp).sim3DNameId);

        base.Remove(key);
      }
    }

    public int maxID { get { if (Count > 0) { return Keys.Max(); } else { return 0; } } }

    public SimVariable FindByName(string name, bool exception = true)
    {
      try
      {
        if (nameToID.TryGetValue(name, out int value))
          return this[value];
        else
        {
          if (exception)
            throw new Exception($"Failed to find Variable - {name}");
          else
            return null!;
        }
      }
      catch
      {
        if (exception)
          throw new Exception($"Failed to find Variable - {name}");
        else
          return null!;
      }
    }

    public SimVariable FindBySim3dId(string findSim3dNameId)
    {
      if (!sim3dNameIDToID.TryGetValue(findSim3dNameId, out int value))
      {
        return null!;
      }

      return this[value];
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
          return docVarType switch
          {
            DocType.dtJSON => new JSONDocVariable(),
            DocType.dtXML => new XmlDocVariable(),
            DocType.dtTextRegEx => new TextRegExVariable(),
            _ => throw new Exception("Invalid document variable type."),
          };
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
      retStr += "\"VariableList\": [";

      int i = 1;
      foreach (SimVariable curItem in Values)
      {
        retStr += Environment.NewLine;
        retStr += curItem.GetJSON(true, lists);
        if (i < Count)
        {
          retStr += $",{Environment.NewLine}";
        }
        ++i;
      }

      retStr += "]";

      if (incBrackets)
      {
        retStr += $"{Environment.NewLine}}}";
      }

      return retStr;
    }

    public void DeserializeJSON(object obj, EmraldModel lists, bool useGivenIDs)
    {
      var dynamicObj = (dynamic)obj;

      foreach (var wrapper in dynamicObj)
      {
        var item = wrapper;
        try
        {
          SimVariable curItem = null!;

          if (loaded && (item.id != null) && ((int)item.id > 0))
          {
            curItem = this[(int)item.id] ?? throw new Exception($"Failed to find Variable with id of {(int)item.id}");
          }
          else
          {
            curItem = FindByName((string)item.name, false);
            if (curItem != null)
              throw new Exception($"Variable with the name of {(string)item.name} already exists");
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
          throw new Exception($"(Variable - {item["name"]}) {e.Message}");
        }
      }
    }

    public bool LoadLinks(object obj, EmraldModel lists)
    {
      var dynamicObj = (dynamic)obj;

      foreach (var wrapper in dynamicObj)
      {
        var item = wrapper;
        EnVarScope scope = (EnVarScope)Enum.Parse(typeof(EnVarScope), (string)item.varScope, true);

        if ((scope == EnVarScope.gtLocal) || (scope == EnVarScope.gtAccrual) || (scope == EnVarScope.gt3DSim))
        {

          SimVariable curItem = FindByName((string)item.name, false);
          try
          {
            if (curItem == null)
            {
              throw new Exception($"Failed to find Action with the name of {(string)item.name}");
            }

            if (!curItem.LoadObjLinks((object)item, false, lists))
              throw new Exception("Failed to deserialize Action List JSON");
          }

          catch (Exception e)
          {
            throw new Exception($"On variable named {curItem.name}. {e.Message}");
          }
        }
      }

      return true;
    }

    public List<ScanForReturnItem> ScanFor(ScanForTypes scanType, EmraldModel lists)
    {
      var foundList = new List<ScanForReturnItem>();

      foreach (var curItem in Values)
      {
        foundList.AddRange(curItem.ScanFor(scanType, lists.rootPath));
      }

      return foundList;
    }
  }
}
