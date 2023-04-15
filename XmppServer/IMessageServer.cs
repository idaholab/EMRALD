// Copyright 2021 Battelle Energy Alliance

using Matrix;
using Matrix.Xmpp.Base;
using CommonDefLib;

namespace XmppMessageServer
{
  interface IMessageServer
  {
    /// <summary>
    /// Called to allow the listener to handle an incoming message
    /// </summary>
    void IncomingMessage(Message msg);

    /// <summary>
    /// Called to allow the listener to handle an incoming message receipt
    /// </summary>
    void IncomingReceipt(string msgId);

    /// <summary>
    /// Called when a client connects to the server
    /// </summary>
    bool OnConnect(Jid clientJid);

    /// <summary>
    /// Called when a client disconnects from the server
    /// </summary>
    void OnDisconnect(Jid clientJid);

    bool SendMessage(TMsgWrapper msg, string resAndClient);
  }
}
