using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MessageDefLib;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;

namespace XmppMessageClient
{
  class AutoMessageTester
  {
    private SampleClientController _clientController;
    private JArray _msgList;
    private string _error;
    public string error { get { return _error; } }
    private bool _stop = false;
    //private int _idx = 0;
    private bool _hasStatusMsgs = false;
    private StatusType _curStatus = StatusType.stIdle;


    public AutoMessageTester(SampleClientController clientController, string messageList, bool hasStatusMsgs)
    {
      _clientController = clientController;
      try
      {
        string schemaStr = System.IO.File.ReadAllText("MessageProtocol.JSON");
        JSchema schemaChk = JSchema.Parse(schemaStr);
        _hasStatusMsgs = hasStatusMsgs;

        _msgList = JArray.Parse(messageList);
        int i = 0;
        foreach(var jItem in _msgList)
        {
          ++i;
          IList<ValidationError> errors;
          bool valid = jItem.IsValid(schemaChk, out errors);
          if (!valid)
            throw new Exception("Invalid message format [" + i.ToString() + "] " + errors.Select(i=>i.Message).ToString());
        }
      }
      catch (Exception e)
      {
        _error = "Failed to convert message list into JSON - " + e.Message;
      }
    }

    public void Stop()
    {
      _stop = true;
    }

    public void Start()
    {
      try
      {
        //_idx = 0;
        _curStatus = StatusType.stIdle;

        foreach (var jItem in _msgList)
        {
          if(_stop)
          {
            _error = "Stopped early.";
            return;
          }

          TMsgWrapper nextEvMsg = jItem.ToObject<TMsgWrapper>();
          NextMsg(nextEvMsg);
        }
      }
      catch(Exception e)
      {
        _error = "Error Running Test Messages - " + e.Message;
      }
    }

    public void NextMsg(TMsgWrapper msgObj)
    {
      if (_stop)
      {
        _error = "Stopped early.";
        return;
      }

      //SimActionType curActType = msgObj.simEvents.actType;
      //var jItem = _msgList[_idx];
      //TMsgWrapper nextEvMsg = jItem.ToObject<TMsgWrapper>();// JsonConvert.DeserializeObject<TMsgWrapper>(jItem);
      //SimEventType nextEvType = nextEvMsg.simEvents[0].evType;
      //if (_idx < _msgList.Count)
      //{
        if (msgObj.msgType == MessageType.mtSimEvent)
        {
          //bool valid = true;

          ////TODO validate the proper messages are being sent for the status part.
          //switch (_curStatus)
          //{
          //  case StatusType.stIdle:
          //    break;
          //  case StatusType.stLoading:
          //    break;
          //  case StatusType.stWaiting:
          //    break;
          //  case StatusType.stRunning:
          //    break;
          //  case StatusType.stDone:
          //    break;
          //  case StatusType.stError:
          //    if (curActType != SimActionType.atTerminate)
          //    {
          //      _error = "received message after an error";
          //      _stop = true;
          //    }
          //    break;         
          //}


          //if (_hasStatusMsgs && (nextEvType == SimEventType.etStatus))
          //{
          //  _clientController.SendMessage(msgObj);
          //}
          ////only respond to the following messages.
          //else if(
          //       (msgObj.simAction.actType == SimActionType.atOpenSim) ||
          //       (msgObj.simAction.actType == SimActionType.atContinue) ||
          //       (msgObj.simAction.actType == SimActionType.atCancelSim) )
          //{

          //}
          _clientController.SendMessage(msgObj);
        }

      //}
    }
  }
}
