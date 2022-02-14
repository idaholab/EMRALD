// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Message = Matrix.Xmpp.Client.Message;
using MessageDefLib;
using Newtonsoft.Json;


namespace XmppMessageClient
{

  public class SampleClientController : IMessageClient
  {
    private XmppMessageClient m_xmppNsgClient;

    private string m_username;
    private string m_domain;
    private string m_host;
    private FrmSampleClient m_form;
    private int m_nextMsgId = 100;

    private string m_passwd = "secret";  // TODO
    private Dictionary<string, Matrix.Xmpp.Roster.RosterItem> m_RosterItems = new Dictionary<string, Matrix.Xmpp.Roster.RosterItem>();

    public Dictionary<string, Matrix.Xmpp.Roster.RosterItem> rosterItems { get { return m_RosterItems; } }

    public SampleClientController(IAppSettingsService appSettingsService)
    {
      m_xmppNsgClient = new XmppMessageClient(m_passwd, appSettingsService);
      m_xmppNsgClient.SetMessageClient(this);
    }

    public void Connect(string username, string domain, string resource, string host)
    {
      m_username = username;
      m_domain = domain;
      m_host = host;

      m_xmppNsgClient.Connect(m_username, m_domain, m_host, 5222, resource);
    }

    public void Disconnect()
    {
      m_xmppNsgClient.Disconnect();
      if (m_form != null)
        m_form.OnDisconnected();
    }

    public void SetForm(FrmSampleClient form)
    {
      m_form = form;
    }

    public string GetNextMessageId()
    {
      return m_nextMsgId.ToString();
    }

    public bool SendMessage(TMsgWrapper msg, string toJid="")
    {
      // Convert the SampleMessage to a JSON string
      string jsonStr = JsonConvert.SerializeObject(msg);

      //
      if (toJid == "" || m_RosterItems.ContainsKey(toJid))
      {
        m_xmppNsgClient.SendMessage(jsonStr, m_nextMsgId.ToString(), toJid);
        m_nextMsgId++;
        return true;
      }
      else
        return false;
    }

    public bool SendMessageTest(string msg)
    {
      // Convert the SampleMessage to a JSON string
      //string jsonStr = JsonConvert.SerializeObject(msg);

      //
      
        m_xmppNsgClient.SendMessage(msg, m_nextMsgId.ToString());
        m_nextMsgId++;
        return true;
    }

    public void IncomingMessage(Message msg)
    {
      if (!string.IsNullOrEmpty(msg.Body))
      {
        TMsgWrapper msgObj = JsonConvert.DeserializeObject<TMsgWrapper>(msg.Body);
        if (msgObj != null)
        {
          if (m_form != null)
          {
            if(msg.From == null)
              m_form.IncomingEMRALDMsg("Server", msgObj);
            else
              m_form.IncomingEMRALDMsg(msg.From, msgObj);
          }
          //todo - process the message with EMRALD  

        }
        else
        {
          m_form.IncomingOtherMsg(msg.From, msg.Body);
        }
      }
    }

    public void IncomingReceipt(string msgId)
    {
      Console.WriteLine("Controller - Received the receipt: {0}", msgId);
      m_form.IncomingReceipt(msgId);
    }
    
    public void AddRosterItem(Matrix.Xmpp.Roster.RosterItem item)
    {
      this.m_RosterItems.Add(item.Jid, item);
      if (m_form != null)
        m_form.OnRosterCng();
    }

    public void DelRosterItem(string jID)
    {
      this.m_RosterItems.Remove(jID);
      if (m_form != null)
        m_form.OnRosterCng();
    }

    public void OnConnected()
    {
      if (m_form != null)
        m_form.OnConnected();
    }

  }
}
