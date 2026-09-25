using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MessageDefLib;
//using XmppMessageServer;
//using static XmppMessageServer.EMRALDMsgServer;


namespace MessageDefLib
{
  public delegate void TEventCallBack(string clientName, MessageDefLib.TMsgWrapper evData);

  //Raised when the messaging layer fails to process an incoming message from a connected
  //application (un-deserializable message or an error thrown while applying it). Lets the
  //consumer (e.g. EMRALD's StateTracker) decide how to react - terminate the connection,
  //abort the run, etc.
  public delegate void TErrorCallBack(string clientName, string errorMsg, string rawMessage);


  public interface ISimMessaging
  {
    bool SendMessage(TMsgWrapper msg, string appInfo);
    int ResourceCnt();
    List<string> GetResources();
    bool HasResource(string name);
    void SetUICallbacks(IMessageDispHandling form);
    TEventCallBack evCallBackFunc { set; }
    TErrorCallBack errCallBackFunc { set; }

    string connectionPassword { get; set; }
    int simFrameRate { get; set; }
  }

  public interface IMessageDispHandling
  {
    void IncomingEMRALDMsg(string sender, TMsgWrapper msg);
    void IncomingOtherMsg(string sender, String msg);
    void OnConnectCng();
    void Clear();
  }
}
