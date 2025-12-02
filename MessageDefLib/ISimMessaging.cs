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
    bool SendMessage(TMsgWrapper msg, string resAndClient);
    int ResourceCnt();
    List<string> GetResources();
    bool HasResource(string name);
    void SetForm(IMessageForm form);
    TEventCallBack evCallBackFunc { set; }
  }

  public interface IMessageForm
  {
    void IncomingEMRALDMsg(string sender, TMsgWrapper msg);
    void IncomingOtherMsg(string sender, String msg);
    void OnConnectCng();
    void Clear();
  }
}
