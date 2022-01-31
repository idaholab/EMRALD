// Copyright 2021 Battelle Energy Alliance

using Matrix;
using Matrix.Xmpp;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using XmppServer;
using Message = Matrix.Xmpp.Base.Message;

namespace XmppMessageServer
{
  class XmppMessageServer
  {

    // Thread signal.
    private readonly ManualResetEvent allDone = new ManualResetEvent(false);
    private readonly IAppSettingsService _appSettingsService;

    #region << Properties and Member Variables >>
    private Socket m_Listener;
    private bool m_Listening;
    private IMessageServer m_msgClient;
    private int m_port;
    private string m_passwd;
    #endregion


    public XmppMessageServer(int port, string passwd, IAppSettingsService appSettingsService)
    {
      m_port = port;
      m_passwd = passwd;
      _appSettingsService = appSettingsService;
      SetLicense();
      StartListening();
    }

    internal bool Authenticate(string clientPasswd)
    {
      return m_passwd == clientPasswd;
    }

    private void StartListening()
    {
      var myThreadDelegate = new ThreadStart(Listen);
      var myThread = new Thread(myThreadDelegate);
      myThread.Start();
    }

    private void StopListening()
    {
      m_Listening = false;
      allDone.Set();

    }

    private void Listen()
    {
      var localEndPoint = new IPEndPoint(IPAddress.Any, m_port);

      // Create a TCP/IP socket.
      m_Listener = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);

      // Bind the socket to the local endpoint and listen for incoming connections.
      try
      {
        m_Listener.Bind(localEndPoint);
        m_Listener.Listen(10);

        m_Listening = true;

        while (m_Listening)
        {
          // Set the event to nonsignaled state.
          allDone.Reset();

          // Start an asynchronous socket to listen for connections.
          try
          {
            m_Listener.BeginAccept(AcceptCallback, null);
          }
          catch (Exception e)
          {
            Console.WriteLine("Exception in listening socket {0}", e.ToString());
          }

          // Wait until a connection is made before continuing.
          allDone.WaitOne();
        }

      }
      catch (Exception e)
      {
        Console.WriteLine("XmppMessageServer exception: {0}", e.ToString());
      }
    }

    private void AcceptCallback(IAsyncResult ar)
    {

      // Signal the main thread to continue.
      allDone.Set();
      // Get the socket that handles the client request.
      try
      {
        var sock = m_Listener.EndAccept(ar);
        var con = new XmppServerConnection(sock, this);
      }
      catch (Exception e)
      {
        Console.WriteLine("XmppMessageServer Exception {0}", e.ToString());
      }
    }

    /// <summary>
    /// Sets the license and activate the evaluation.
    /// </summary>
    private void SetLicense()
    {
      //If you are compiling this on your own, you need to have an MatriX license for 2 way coupling
      //Get a license and use project "Manage User Secrets" to set the license if you want to use this MatriX package 
      //example 
      /*
      {
        "Secrets": {
          "XmppLicense": "YourLicenseCodeHere"
        }
      }
       */
      string lic = _appSettingsService.XmppLicense;  //the other option is to place your license code here, but do not distribute
      Matrix.License.LicenseManager.SetLicense(lic);

      // when something is wrong with your license you can find the error here
      //Console.WriteLine("License errors: {0}", Matrix.License.LicenseManager.LicenseError);
    }

    #region << Public Methods >>

    /// <summary>
    /// Sends the jsonStr as a Xmpp message to the specified client.
    /// </summary>
    public void SendMessage(string jsonStr, string msgId, Jid userJid)
    {
      var msg = new Matrix.Xmpp.Client.Message { Type = Matrix.Xmpp.MessageType.Normal, To = userJid, Body = jsonStr, Id = msgId };
      msg.From = "EMRALD";
      //var con = Global.ServerConnections.FirstOrDefault(sc => sc.m_clientJid.Equals(userJid, new BareJidComparer()));
      try
      {
        var con = Global.ServerConnections[userJid];
        con.Send(msg);
      }
      catch
      {
        //jID not found 
      }
    }

    /// <summary>
    /// Set a listener for message events
    /// </summary>
    public void SetMessageClient(IMessageServer msgClient)
    {
      m_msgClient = msgClient;
    }

    #endregion


    #region << Methods called by instances of XmppServerConnection >>

    [MethodImpl(MethodImplOptions.Synchronized)]
    internal void IncomingMessage(Message msg)
    {
      m_msgClient.IncomingMessage(msg);
    }

    [MethodImpl(MethodImplOptions.Synchronized)]
    internal void IncomingReceipt(string msgId)
    {
      m_msgClient.IncomingReceipt(msgId);
    }

    [MethodImpl(MethodImplOptions.Synchronized)]
    internal void OnConnect(Jid clientJid)
    {
      m_msgClient.OnConnect(clientJid);
    }

    [MethodImpl(MethodImplOptions.Synchronized)]
    internal void OnDisconnect(Jid clientJid)
    {
      m_msgClient.OnDisconnect(clientJid);
    }
    #endregion

  }

}
