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


  public interface ISimMessaging
  {
    bool SendMessage(TMsgWrapper msg, string appInfo);
    int ResourceCnt();
    List<string> GetResources();
    bool HasResource(string name);
    void SetUICallbacks(IMessageDispHandling form);
    TEventCallBack evCallBackFunc { set; }

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
