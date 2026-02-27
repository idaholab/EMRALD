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

    #region << Properties and Member Variables >>
    private Socket m_Listener;
    private bool m_Listening;
    private IMessageServer m_msgClient;
    private int m_port;
    private string m_passwd;
    #endregion
    private NLog.Logger logger = NLog.LogManager.GetLogger("logfile");
    private DateTime lastMsgSendTime;

    public XmppMessageServer(int port, string passwd)
    {
      m_port = port;
      m_passwd = passwd;
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
      //Get a license from environment variable
      //run the following in cmd: setx Secrets__XmppLicense "YourLicenseCodeHere"
      //restart IDE

      //string lic = Environment.GetEnvironmentVariable("Secrets__XmppLicense");
      string lic = @"eJxkkd1ugkAUhF+FeGsqPyJqs25aFZGAiAVBvVthxbUsS2HBn6evUasXvZtzvsmZSQ6wSYSzEgsnmmbloIGSt5Lt+BEV+D29owYEbsHiKuJmDD1exYQB8bUBiwplnPAzlIH41GBUlZxRXEDgIIqh6diCYQZAvE1gxGiOsvP1HK5xJnwJboHLiHEOxD8EdIpICsubo5U/+AfJ0lbCaiDe8dX/DFrmMeJYP+WkwOOrgook92RZufb6h4BHkgzxqsAwaOsFRge7fYhoNKfrnRFuOuG3q4a26/e1vrnfDg+4RxKHe9LFSgIz7fuKZ3b2a5l6CdNGs1TDseX7l8n0R0LNaFbMN7h70WtL14xAps1lHKbdaYXW2We9m4zH5VIVna6nSnk0V8yttVPsOiTGYTgK88WYHdXmqjQso9uLVpW78OZ0oyFV30gDIL56A/HxO/grgAA=";


      if (string.IsNullOrEmpty(lic))
      {
        throw new Exception("XmppLicense not found. Set environment variable: Secrets__XmppLicense");
      }

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
        //temp fix to help with orders
        if ((DateTime.Now - lastMsgSendTime) < TimeSpan.FromMilliseconds(100))
          System.Threading.Thread.Sleep(100);

        var con = Global.ServerConnections[userJid];
        con.Send(msg);
        lastMsgSendTime = DateTime.Now;
      }
      catch
      {
        logger.Error("Failed to send - " + msgId);
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
