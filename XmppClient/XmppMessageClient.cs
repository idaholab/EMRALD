// Copyright 2021 Battelle Energy Alliance

using EventArgs = Matrix.EventArgs;
using Matrix;
using Matrix.Xmpp.Client;
using Matrix.Xmpp.Register;
using Matrix.Xmpp.XData;
using Matrix.Xmpp.Roster;
using System;
//using System.Windows.Forms;
using Message = Matrix.Xmpp.Client.Message;
using Subscription = Matrix.Xmpp.Roster.Subscription;
using Matrix.Xmpp;
using System.Threading;


namespace XmppMessageClient
{
  class XmppMessageClient
  {

    #region << Properties and Member Variables >>
    private Matrix.Xmpp.Client.XmppClient m_xmppClient;
    private Jid m_serverJid;
    private Jid m_clientJid;
    private IMessageClient m_msgClient;
    private string m_passwd;
    #endregion
    private readonly IAppSettingsService _appSettingsService;

    public XmppMessageClient(string passwd, IAppSettingsService appSettingsService)
    {
      _appSettingsService = appSettingsService;
      m_passwd = passwd;
      SetLicense();
      InitializeXmppClient();

    }

    private void InitializeXmppClient()
    {

      m_serverJid = new Jid("server@localhost"); // TODO - Put this in a property

      // 
      // xmppClient
      // 
      m_xmppClient = new Matrix.Xmpp.Client.XmppClient();

      //Jid myJid = new Jid("greg", "inl417836", "MatriX");
      //Console.WriteLine("test Jid: {0}", myJid.ToString());
      //m_xmppClient = new Matrix.Xmpp.Client.XmppClient();

      m_xmppClient.Compression = false;
      m_xmppClient.Hostname = null;
      m_xmppClient.ProxyHostname = null;
      m_xmppClient.ProxyPass = null;
      m_xmppClient.ProxyPort = 1080;
      m_xmppClient.ProxyType = Matrix.Net.Proxy.ProxyType.None;
      m_xmppClient.ProxyUser = null;
      m_xmppClient.ResolveSrvRecords = true;
      m_xmppClient.Status = "";
      m_xmppClient.StreamManagement = false;
      m_xmppClient.Transport = Matrix.Net.Transport.Socket;
      m_xmppClient.Uri = null;
      m_xmppClient.AutoRoster = true;
      //m_xmppClient.OnRosterStart += new System.EventHandler<Matrix.EventArgs>(xmppClient_OnRosterStart);
      //m_xmppClient.OnRosterEnd += new System.EventHandler<Matrix.EventArgs>(xmppClient_OnRosterEnd);
      m_xmppClient.OnRosterItem += new System.EventHandler<Matrix.Xmpp.Roster.RosterEventArgs>(xmppClient_OnRosterItem);
      m_xmppClient.OnMessage += new System.EventHandler<Matrix.Xmpp.Client.MessageEventArgs>(xmppClient_OnMessage);
      m_xmppClient.OnIq += new System.EventHandler<Matrix.Xmpp.Client.IqEventArgs>(xmppClient_OnIq);
      m_xmppClient.OnRegisterInformation += new System.EventHandler<Matrix.Xmpp.Register.RegisterEventArgs>(xmppClient_OnRegisterInformation);
      m_xmppClient.OnRegister += new System.EventHandler<Matrix.EventArgs>(xmppClient_OnRegister);
      m_xmppClient.OnRegisterError += new System.EventHandler<Matrix.Xmpp.Client.IqEventArgs>(xmppClient_OnRegisterError);
      m_xmppClient.OnBind += new System.EventHandler<Matrix.JidEventArgs>(xmppClient_OnBind);
      m_xmppClient.OnBeforeSasl += new System.EventHandler<Matrix.Xmpp.Sasl.SaslEventArgs>(xmppClient_OnBeforeSasl);
      m_xmppClient.OnReceiveXml += new System.EventHandler<Matrix.TextEventArgs>(xmppClient_OnReceiveXml);
      m_xmppClient.OnSendXml += new System.EventHandler<Matrix.TextEventArgs>(xmppClient_OnSendXml);
      m_xmppClient.OnStreamError += new System.EventHandler<Matrix.StreamErrorEventArgs>(xmppClient_OnStreamError);
      m_xmppClient.OnError += new System.EventHandler<Matrix.ExceptionEventArgs>(xmppClient_OnError);
      m_xmppClient.OnValidateCertificate += new System.EventHandler<Matrix.CertificateEventArgs>(xmppClient_OnValidateCertificate);
      m_xmppClient.OnLogin += new System.EventHandler<Matrix.EventArgs>(xmppClient_OnLogin);
      m_xmppClient.OnAuthError += new System.EventHandler<Matrix.Xmpp.Sasl.SaslEventArgs>(xmppClient_OnAuthError);
      m_xmppClient.OnClose += new System.EventHandler<Matrix.EventArgs>(xmppClient_OnClose);

    }

    private void xmppClient_OnRegisterInformation(object sender, RegisterEventArgs e)
    {
      Console.WriteLine("OnRegisterInformation");

      e.Register.RemoveAll<Data>();

      e.Register.Username = m_xmppClient.Username;
      e.Register.Password = m_xmppClient.Password;
    }

    private void xmppClient_OnRegister(object sender, EventArgs e)
    {
      Console.WriteLine("OnRegister");
    }

    private void xmppClient_OnRegisterError(object sender, IqEventArgs e)
    {
      Console.WriteLine("OnRegisterError");
      m_xmppClient.Close();
    }

    private void xmppClient_OnBind(object sender, JidEventArgs e)
    {
      m_clientJid = e.Jid;
      Console.WriteLine("OnBind");

    }

    private void xmppClient_OnClose(object sender, Matrix.EventArgs e)
    {
      Console.WriteLine("OnClose");
    }

    private void xmppClient_OnIq(object sender, IqEventArgs e)
    {
      Console.WriteLine("OnIq");
    }

    private void xmppClient_OnMessage(object sender, MessageEventArgs e)
    {
      var msg = e.Message;

      Console.WriteLine("OnMessage");

      if (msg.IsReceipt)
      {
        Console.WriteLine("Got the message receipt for: {0}", msg.Id);
        if (m_msgClient != null)
        {
          m_msgClient.IncomingReceipt(msg.Id);
        }
      }
      else
      {
        if (m_msgClient != null)
        {
          m_msgClient.IncomingMessage(msg);

          // Send the acknowledgement
          var to = msg.From;
          msg.To = msg.From;
          msg.From = to;
          msg.DeliveryReceipt(msg.Id);
          string status = m_xmppClient.Send(msg);

        }
      }
    }

    private void xmppClient_OnValidateCertificate(object sender, CertificateEventArgs e)
    {
      Console.WriteLine("OnValidateCertificate");
    }

    private void xmppClient_OnBeforeSasl(object sender, Matrix.Xmpp.Sasl.SaslEventArgs e)
    {
      Console.WriteLine("OnBeforeSasl");
    }

    private void xmppClient_OnAuthError(object sender, Matrix.Xmpp.Sasl.SaslEventArgs e)
    {
      Console.WriteLine("OnAuthError");
      m_xmppClient.Close();
    }

    private void xmppClient_OnReceiveXml(object sender, TextEventArgs e)
    {
      Console.WriteLine("OnReceiveXml");
    }

    private void xmppClient_OnSendXml(object sender, TextEventArgs e)
    {
      Console.WriteLine("OnSendXml");
    }

    private void xmppClient_OnStreamError(object sender, StreamErrorEventArgs e)
    {
      Console.WriteLine("OnStreamError");
    }

    private void xmppClient_OnError(object sender, ExceptionEventArgs e)
    {
      Console.WriteLine("OnError: {0}", e.Exception.ToString());
    }

    private void xmppClient_OnLogin(object sender, Matrix.EventArgs e)
    {
      Console.WriteLine("OnLogin");
      m_msgClient.OnConnected();
    }

    private void RosterResponse(object sender, IqEventArgs e)
    {
      var iq = e.Iq;

      if (iq.Type == IqType.Result)
      {
        // process result here
      }
      else if (iq.Type == IqType.Error)
      {
        // process errors here
      }
    }


    private void xmppClient_OnRosterItem(object sender, Matrix.Xmpp.Roster.RosterEventArgs e)
    {
      if (e.RosterItem.Subscription != Subscription.Remove)
        m_msgClient.AddRosterItem(e.RosterItem);
      else
        m_msgClient.DelRosterItem(e.RosterItem.Jid);
    }



    /// <summary>
    /// Sets the license and activate the evaluation.
    /// </summary>
    private void SetLicense()
    {
      //To use this as a base for your project, you need to have an MatriX license
      //Get a license and use project "Manage User Secrets" to set the license if you want to use this MatriX package 
      //example 
      /*
      {
        "Secrets": {
          "XmppLicense": "YourLicenseCodeHere"
        }
      }
       */
      try
      {
        string lic = _appSettingsService.XmppLicense;  //the other option is to place your license code here, but do not distribute
        Matrix.License.LicenseManager.SetLicense(lic);
      }
      catch { } //failed to do license just continue with trial
      

      // when something is wrong with your license you can find the error here
      // Console.WriteLine("License errors: {0}", Matrix.License.LicenseManager.LicenseError);
    }

    #region << Public Methods >>

    /// <summary>
    /// Connect to the server.
    /// </summary>
    public void Connect(string username, string domain, string host, int port, string resource)
    {
      Console.WriteLine("Connecting for: user={0}, server={1}, host={2}", username, resource, host);
      m_xmppClient.SetUsername(username);
      m_xmppClient.SetXmppDomain(domain);
      m_xmppClient.Password = m_passwd;
      m_xmppClient.Port = port;

      //if (!String.IsNullOrEmpty(host))
      //{
      //  // disable SRV lookups and specify the sever hostname manual
      //  m_xmppClient.ResolveSrvRecords = false;
      //  m_xmppClient.Hostname = host;
      //}
      m_xmppClient.Resource = resource;

      m_xmppClient.Open();

      // Create the client Jid
      string clientHost = System.Net.Dns.GetHostName();
      //m_clientJid = new Jid(username, clientHost, "");
    }

    /// <summary>
    /// Disconnect from the server.
    /// </summary>
    public void Disconnect()
    {
      m_xmppClient.Close();
    }

    /// <summary>
    /// Sends the jsonStr as a Xmpp message to the server.
    /// </summary>
    public void SendMessage(string jsonStr, string msgId, string toJid = "")
    {
      //Console.WriteLine("Sending message: {0} id: {1}", jsonStr, msgId);
      //var msg = new Message { Type = MessageType.Normal, To = m_serverJid, Body = jsonStr, Id = msgId };
      var msg = new Message(m_serverJid, m_clientJid, MessageType.Normal, jsonStr);
      if (toJid != "")
        msg.To = toJid;
      msg.Id = m_clientJid;
      // msg.From = m_xmppClient.
      string status = m_xmppClient.Send(msg);
      Console.WriteLine("SendMessage returned status: {0}", status);

    }


    /// <summary>
    /// Set a listener for message events
    /// </summary>
    public void SetMessageClient(IMessageClient msgClient)
    {
      m_msgClient = msgClient;
    }

    #endregion

  }
}