// Copyright 2021 Battelle Energy Alliance

using System;
using System.Diagnostics;
using System.Linq;
using System.Text.RegularExpressions;
using System.Text;
using System.Net.Sockets;
using Matrix.Xmpp.Bind;
using Matrix.Xmpp.Client;
using Matrix.Xmpp.Roster;
using Matrix.Xmpp.Sasl;
//using Matrix.Xmpp.Session;
using Matrix.Xmpp.Stream;
using Matrix.Xml;
using Matrix.Xmpp;
using Matrix;
using System.Collections.Generic;

using Iq = Matrix.Xmpp.Base.Iq;
using Message = Matrix.Xmpp.Base.Message;
using MxAuth = Matrix.Xmpp.Sasl.Auth;
using Stream = Matrix.Xmpp.Client.Stream;

namespace XmppMessageServer
{
  /// <summary>
  /// XMPPSeverConnection class.
  /// </summary>
  internal class XmppServerConnection
  {
    private const int BUFFERSIZE = 1024;
    private NLog.Logger logger = NLog.LogManager.GetLogger("logfile");
    #region << Properties and Member Variables >>
    public const string XmppDomain = "localhost";
    public string User { get; set; }
    public string Resource { get; set; }
    //public string   SessionId       { get; set; }
    public bool IsAuthenticated { get; set; }
    public bool IsBinded { get; set; }
    private Socket m_Sock;
    private Jid _Jid;
    public Jid m_clientJid { get { return _Jid; } }
    private XmppMessageServer m_server;

    #endregion

    private XmppStreamParser streamParser;
    private byte[] buffer = new byte[BUFFERSIZE];

    // Jid bound to this connection
    private bool streamFooterSent;

    #region << Constructors >>
    public XmppServerConnection()
    {
      //SessionId = null;
      streamParser = new XmppStreamParser();

      streamParser.OnStreamStart += streamParser_OnStreamStart;
      streamParser.OnStreamEnd += streamParser_OnStreamEnd;
      streamParser.OnStreamElement += streamParser_OnStreamElement;
    }

    public XmppServerConnection(Socket sock, XmppMessageServer server) : this()
    {
      m_Sock = sock;
      m_Sock.BeginReceive(buffer, 0, BUFFERSIZE, 0, ReadCallback, null);
      m_server = server;
    }
    #endregion


    public void ReadCallback(IAsyncResult ar)
    {
      if (!m_Sock.Connected) //catch if closed then don't do anything.
        return;
      // Retrieve the state object and the handler socket
      // from the asynchronous state object

      // Read data from the client socket. 
      try
      {
        int bytesRead = m_Sock.EndReceive(ar);

        if (bytesRead > 0 && m_Sock != null && m_Sock.Connected)
        {
          streamParser.Write(buffer, 0, bytesRead);
          // Not all data received. Get more.
          if(m_Sock.Connected)
            m_Sock.BeginReceive(buffer, 0, BUFFERSIZE, 0, ReadCallback, null);
        }
        else
        {
          Disconnect();
        }
      }
      catch (Exception e)
      {
        Console.WriteLine("XmppServerConnection Exception {0}", e.ToString());
        logger.Debug("XMPP Server Disconnecting, XmppServerConnection Exception {0}", e.ToString());
        Disconnect();
      }
    }

    /// <summary>
    /// Disconnect socket
    /// </summary>
    private void Disconnect()
    {
      try
      {
        if (m_server != null)
        {
          m_server.OnDisconnect(m_clientJid);
        }

        if (!streamFooterSent && m_Sock.Connected)
        {
          Send("</stream:stream>");
          streamFooterSent = true;
        }


        // return right away if have not created socket
        if (m_Sock == null)
          return;

      }
      catch (Exception e)
      {
        Console.WriteLine("XmppServerConnection Exception {0}", e.ToString());
        logger.Debug("XmppServerConnection Exception {0}", e.ToString());
      }

      try
      {
        // first, shutdown the socket (when connected
        if (m_Sock.Connected)
          m_Sock.Shutdown(SocketShutdown.Both);
      }
      catch (Exception e)
      {
        Console.WriteLine("XmppServerConnection Exception {0}", e.ToString());
        logger.Debug("XmppServerConnection Exception {0}", e.ToString());
      }
      try
      {
        // next, close the socket which terminates any pending
        // async operations
        m_Sock.Close();
      }
      catch (Exception e)
      {
        Console.WriteLine("XmppServerConnection Exception {0}", e.ToString());
        logger.Debug("XmppServerConnection Exception {0}", e.ToString());
      }

      if (Global.ServerConnections.ContainsKey(this._Jid))
        Global.ServerConnections.Remove(this._Jid);
    }

    internal void Send(string data)
    {
      try { 
        // Convert the string data to byte data using ASCII encoding.
        byte[] byteData = Encoding.UTF8.GetBytes(data);

        logger.Debug("SentMessage - " + data);

        // Begin sending the data to the remote device.
        if (m_Sock.Connected)
          m_Sock.BeginSend(byteData, 0, byteData.Length, 0, SendCallback, null);
      }
      catch (Exception e)
      {
        logger.Debug("XmppServer Send Exception: {0}", e.ToString());
      }
    }

    private void SendCallback(IAsyncResult ar)
    {

      try
      {
        // Complete sending the data to the remote device.
        if(m_Sock.Connected)
          m_Sock.EndSend(ar);

      }
      catch (Exception e)
      {
        Console.WriteLine("Send Callback Exception: {0}", e.ToString());
        logger.Debug("XmppServer Send Callback Exception: {0}", e.ToString());
      }
    }


    public void Stop()
    {
      Disconnect();
    }


    #region << StreamParser events >>
    void streamParser_OnStreamEnd(object sender, Matrix.EventArgs e)
    {
      Disconnect();
    }

    void streamParser_OnStreamElement(object sender, StanzaEventArgs e)
    {
      try
      {
        if (e.Stanza is Presence)
        {
          ProcessPresence(e.Stanza as Presence);
        }
        if (e.Stanza is Message)
        {
          ProcessMessage(e.Stanza as Message);
        }
        else if (e.Stanza is Iq)
        {
          ProcessIq(e.Stanza as Iq);
        }

        if (e.Stanza is MxAuth)
        {
          var auth = e.Stanza as MxAuth;
          if (auth.SaslMechanism == SaslMechanism.Plain)
            ProcessSaslPlainAuth(auth);
        }
      }
      catch (Exception ex)
      {
        logger.Debug("XmppServer streamParser_OnStreamElement Exception: {0}", ex.ToString());
      }
    }

    private void ProcessPresence(Presence pres)
    {
    }

    void streamParser_OnStreamStart(object sender, StanzaEventArgs e)
    {
      SendStreamHeader();
      Send(BuildStreamFeatures());
    }
    #endregion

    private void ProcessMessage(Message msg)
    {
      try
      {
        if (msg.IsReceipt)
        {
          m_server.IncomingReceipt(msg.Id);
        }
        else
        {
          //if (msg.GetAttributeBool("HANDSHAKE"))
          //{
          //  if (m_server != null)
          //  {
          //    m_clientJid = msg.From;
          //    Console.WriteLine("Received handshake from client: {0}", m_clientJid);
          //    m_server.OnConnect(m_clientJid);
          //  }

          //}

          m_server.IncomingMessage(msg);

          // Send the acknowledgement
          var to = msg.From;
          msg.To = msg.From;
          msg.From = to;
          msg.DeliveryReceipt(msg.Id);
          Send(msg);

        }
      }
      catch (Exception e)
      {
        logger.Debug("XmppServer ProcessMessage Exception: {0}", e.ToString());
      }
    }

    private void ProcessIq(Iq iq)
    {
      try
      {
        if (iq.Query is Roster)
          ProcessRosterIq(iq);
        else if (iq.Query is Bind)
          ProcessBind(iq);
        //else if (iq.Query is Session)
        //  ProcessSession(iq);
        else if (iq.To != null && !iq.To.Equals(XmppDomain, new FullJidComparer()))
          RouteIq(iq);

        //if (iq.Query is Bind)
        //  ProcessBind(iq);
        //else if (iq.To != null && !iq.To.Equals(XmppDomain, new FullJidComparer()))
        //    RouteIq(iq);
        else
        {
          // something we don't understand or do not support, reply with error
          Send(
              new Matrix.Xmpp.Client.Iq()
              {
                Type = IqType.Error,
                Id = iq.Id,
                Error = new Matrix.Xmpp.Client.Error(Matrix.Xmpp.Base.ErrorCondition.FeatureNotImplemented)
              });
        }
      }
      catch (Exception e)
      {
        logger.Debug("XmppServer ProcessIq Exception: {0}", e.ToString());
      }
    }

    private void ProcessRosterIq(Iq iq)
    {
      try
      {
        if (iq.Type == IqType.Get)
        {
          // Send the roster
          // All logged in items for EMRALD are in a roster given for all clients - this may change later
          iq.SwitchDirection();
          iq.Type = IqType.Result;

          //The roster will always include all the connections this may change in the future
          foreach (var con in Global.ServerConnections)
          {
            var ri = new Matrix.Xmpp.Roster.RosterItem
            {
              Jid = con.Key,
              Name = con.Value.User,
              Subscription = Matrix.Xmpp.Roster.Subscription.Both
            };

            ri.AddGroup("EMRALD");
            ri.AddGroup(con.Value.Resource);
            iq.Query.Add(ri);
          }

          Send(iq);
        }
        else //if (iq.Type == IqType.Set)
        {
          //For EMRALD items are added to a master roster for everyone to access so no need to set roster items - this may change later
          // TODO, send an error here for

          //if(iq.Query.FirstElement is RosterItem)
          //{
          //  var item = iq.Query.FirstElement as RosterItem;
          //  _roster.Add(item);
          //}        
        }
      }
      catch (Exception e)
      {
        logger.Debug("XmppServer ProcessRosterIq: {0}", e.ToString());
      }

    }


    private void ProcessSaslPlainAuth(MxAuth auth)
    {
      try
      {
        string pass = null;
        string user = null;

        byte[] bytes = Convert.FromBase64String(auth.Value);
        string sasl = Encoding.UTF8.GetString(bytes);
        // trim nullchars
        sasl = sasl.Trim((char)0);
        string[] split = sasl.Split((char)0);

        if (split.Length == 3)
        {
          user = split[1];
          pass = split[2];
        }
        else if (split.Length == 2)
        {
          user = split[0];
          pass = split[1];
        }

        while(m_server == null)
        {
          System.Threading.Thread.Sleep(10);
        }

        bool passOk = m_server.Authenticate(pass);

        // check if username and password is correct
        if (user != null && passOk)
        {
          // pass correct
          User = user;
          streamParser.Reset();
          IsAuthenticated = true;
          Send(new Success());
        }
        else
        {
          {
            // user does not exist or wrong password
            Send(new Failure(FailureCondition.NotAuthorized));
          }
        }
      }
      catch (Exception e)
      {
        logger.Debug("XmppServer ProcessSaslPlainAuth Exception: {0}", e.ToString());
      }
    }

    private void ProcessBind(Iq iq)
    {
      try
      {
        var bind = iq.Query as Bind;

        string res = bind.Resource;
        if (!String.IsNullOrEmpty(res))
        {

          var jid = new Jid(User, XmppDomain, res);
          _Jid = jid;
          var resIq = new BindIq
          {
            Id = iq.Id,
            Type = IqType.Result,
            Bind = { Jid = jid }
          };

          Send(resIq);
          Resource = res;
          IsBinded = true;

          // connection is bindet now. Add it to our global list of connection.
          if (!Global.ServerConnections.ContainsKey(this._Jid))
          {
            Global.ServerConnections[this._Jid] = this;
            m_server.OnConnect(this._Jid);
          }
          //else
          //  Global.ServerConnections.Add(this._Jid, this);


          // Wait until we receive the HANDSHAKE message

          //if (m_server != null)
          //{
          //    m_server.OnConnect(m_clientJid);
          //}

        }
        else
        {
          // return error
        }
      }
      catch (Exception e)
      {
        logger.Debug("XmppServer ProcessBind Exception: {0}", e.ToString());
      }

    }


    private void RouteIq(Iq iq)
    {
      try
      {
        // route the iq here
        var to = iq.To;

        // check if the destination of this message is available
        XmppServerConnection con;
        if (Global.ServerConnections.TryGetValue(to, out con))
        {
          // found connection, stamp packet with from and route it.
          iq.From = _Jid;
          con.Send(iq);
        }
        else
        {
          // connection not found. Return the message to the sender and stamp it with error
          iq.Type = IqType.Error;
          iq.To = _Jid;
          iq.From = to;
          iq.Add(new Matrix.Xmpp.Client.Error(Matrix.Xmpp.Base.ErrorCondition.ServiceUnavailable));
          Send(iq);
        }
      }
      catch (Exception e)
      {
        logger.Debug("XmppServer RoutIq Exception: {0}", e.ToString());
      }
    }
    


    /// <summary>
    /// sends the XMPP stream header
    /// </summary>
    private void SendStreamHeader()
    {
      try
      {
        var stream = new Stream
        {
          Version = "1.0",
          From = XmppDomain,
          Id = Guid.NewGuid().ToString()
        };

        Send(stream.StartTag());
      }
      catch (Exception e)
      {
        logger.Debug("XmppServer SendStreamHeader Exception: {0}", e.ToString());
      }
    }

    private XmppXElement BuildStreamFeatures()
    {
      var feat = new StreamFeatures();
      try
      {        
        //feat.Add(new StartTls());

        if (!IsAuthenticated)
        {
          var mechs = new Mechanisms();
          mechs.AddMechanism(SaslMechanism.Plain);
          feat.Mechanisms = mechs;
        }
        else if (!IsBinded && IsAuthenticated)
        {
          feat.Add(new Bind());
        }

        return feat;
      }
      catch (Exception e)
      {
        logger.Debug("XmppServer ProcessSaslPlainAuth Exception: {0}", e.ToString());
      }

      return feat;
    }

    internal void Send(XmppXElement el)
    {
      try
      {
        Send(el.ToString(false));
      }
      catch (Exception e)
      {
        logger.Debug("XmppServer ProcessSaslPlainAuth Exception: {0}", e.ToString());
      }
    }
  }
}