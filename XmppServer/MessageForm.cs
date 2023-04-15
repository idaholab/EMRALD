// Copyright 2021 Battelle Energy Alliance

using System;
using CommonDefLib;

namespace XmppMessageServer
{
  public interface IMessageForm
  {
    void IncomingEMRALDMsg(string sender, TMsgWrapper msg);
    void IncomingOtherMsg(string sender, String msg);
    void OnConnectCng();
    void Clear();
  }
}
