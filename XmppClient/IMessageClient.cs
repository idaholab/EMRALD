// Copyright 2021 Battelle Energy Alliance

using System;
using Matrix;
using Message = Matrix.Xmpp.Client.Message;


namespace XmppMessageClient
{
  interface IMessageClient
  {
    /// <summary>
    /// Called to allow the listener to handle an incoming message
    /// </summary>
    void IncomingMessage(Message msg);
    //void IncomingMessage(string sender, TMsgWrapper msg);
    //void IncomingOtherMsg(string sender, String msg);
    
    /// <summary>
    /// Called when it successfully connects to the server
    /// </summary>
    void OnConnected();

    void AddRosterItem(Matrix.Xmpp.Roster.RosterItem item);

    void DelRosterItem(string jID);

    /// <summary>
    /// Called to allow the listener to handle an incoming message receipt
    /// </summary>
    void IncomingReceipt(string msgId);
  }

}
