// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace MessageDefLib
{
  [JsonConverter(typeof(StringEnumConverter))]
  public enum MessageType { mtSimEvent = 0, mtSimAction, mtOther };
  [JsonConverter(typeof(StringEnumConverter))]
  public enum SimActionType { atCompModify = 0, atTimer, atOpenSim, atCancelSim, atPauseSim, atContinue, atRestartAtTime, atPing, atStatus, atTerminate }; 
  [JsonConverter(typeof(StringEnumConverter))]
  public enum SimEventType { etCompEv = 0, etTimer, etSimLoaded, etEndSim, etPing, etStatus };
  [JsonConverter(typeof(StringEnumConverter))]
  public enum StatusType { stWaiting = 0, stLoading, stRunning, stIdle, stDone, stError };

  //public class TOtherMsgData
  //{
  //  public string info { get; set; } //JSON string of data specifications by the external code
  //}

  public class ItemData
  {
    public ItemData(string inNameId, string inValue)//, CompMsgType type)
    {
      nameId = inNameId;
      value = inValue;
    }

    public string nameId { get; set; } //name or number identifier defined by the user or external code, unique by (XMPP client connection ID and evID)  
    public string value { get; set; } //value to set the component to
  }

  //Events are either a response to an action or things that happened in a client simulation that someone else cares about.
  public class SimEvent
  {
    public SimEvent(SimEventType evType, TimeSpan evTime, string nameId = "", string inValue = "0.0")
    {
      this.evType = evType;
      this.time = evTime;
      if (evType == SimEventType.etCompEv || evType == SimEventType.etTimer)
      {
        this.itemData = new ItemData(nameId, inValue);
      }
    }

    public SimEventType evType { get; set; }
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public ItemData itemData { get; set; }  //if type - etCompEv, etTimer, etStatus 
    public TimeSpan time { get; set; } //time of event (in global time, so Global Run Time at this sim start time + this sim time)
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public StatusType status { get; set; } //if status type then this has a value  
  }

  public class SimInfo
  {
    public SimInfo(string inModel, TimeSpan inEndTime, string inConfigData)
    {
      model = inModel;
      configData = inConfigData;
      endTime = inEndTime;
    }

    public string model { get; set; } //reference to the model to run. Name, path, etc.
    public TimeSpan endTime { get; set; } //time in global run time of when to end the simulation
    public string configData { get; set; } //any additional information required by the client to setup run. Set by the user in the controller or EMRALD model.
  }

  //Actions are things you are telling another simulation to do. (from the main controller such as EMRALD)
  public class SimAction
  {
    [JsonConstructor]
    public SimAction(SimActionType type, TimeSpan? actTime = null)
    {
      actType = type;
      time = actTime;
      if ((type == SimActionType.atTimer || type == SimActionType.atRestartAtTime) && (actTime == null))
        throw new Exception("Timer or restartAtTime actions require a time.");
      simInfo = null;
      itemData = null;
    }
    public SimAction(SimInfo startupInfo)
    {
      actType = SimActionType.atOpenSim;
      simInfo = startupInfo;
      itemData = null;
    }
    public SimAction(SimActionType type, TimeSpan actTime, ItemData compModData)
    {
      actType = type;
      simInfo = null;
      itemData = compModData;
      time = actTime;
    }

    public SimActionType actType { get; set; } //type of action to be taken by child simulation
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public TimeSpan? time { get; set; } //when to take action if not immediate [atCompModify, atTimer, restartAtTime] - (in global time, so local time is time - global runtime at start of local sim)
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public SimInfo simInfo; //if type is OpenSim
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public ItemData itemData; //if type is compModify, timer
  }


  public class TMsgWrapper
  {
    public TMsgWrapper() { }

    public TMsgWrapper(MessageType msgType, string dispName, TimeSpan? globTime = null, string description = "")
    {
      version = "0.1.0";
      pID = Guid.NewGuid();
      this.msgType = msgType;
      if (msgType == MessageType.mtSimEvent)
        this.simEvents = new List<SimEvent>();
      globalRunTime = globTime == null ? TimeSpan.Zero : (TimeSpan)globTime;
      this.dispName = dispName;
      desc = description;
      //todo?
      //switch (msgType)
      //{
      //  case MessageType.mtCompModify:
      //    this.extSimEv = new ExtSimEv();
      //    break;

      //  case MessageType.mtExtSimEv:
      //    this.compModify = new CompModify();
      //    break;

      //  case MessageType.mtOther:

      //    break;

      //  case MessageType.mtResponse:

      //    break;

      //  case MessageType.mtSimAction:

      //    break;
      //}
    }

    public string version { get; set; } // [major.minor.revision] Server and Client must operate on the same “Major” number for compatibility. Non required features will be a minor or revision number change
    public Guid pID { get; set; } //packet ID, unique for each simulation running
    public MessageType msgType { get; set; }  // Message type [Event, Action, Request, Response, Register] must have a matching name/value pair.
    public TimeSpan globalRunTime { get; set; }
    public string dispName; //display name of the action
    public string desc { get; set; } //User readable info for the message
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public List<SimEvent> simEvents { get; set; } //An event that occurred to a component.
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public SimAction simAction { get; set; } //An action to be taken by child simulation
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public string otherInfo { get; set; }


    public override string ToString()
    {
      return msgType.ToString().Substring(2) + " ID - " + pID + " " + desc;
    }

  }
}
