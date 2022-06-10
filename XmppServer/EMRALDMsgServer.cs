// Copyright 2021 Battelle Energy Alliance

using Matrix;
using Matrix.Xmpp.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
//using System.Web.Script.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Matrix.Xmpp.Roster;
using MessageDefLib;
using XmppServer;

namespace XmppMessageServer
{
 
  


  public class EMRALDMsgServer : IMessageServer
  {
    private NLog.Logger logger = NLog.LogManager.GetLogger("logfile");
    public delegate void TEventCallBack(string clientName, MessageDefLib.TMsgWrapper evData);


    private XmppMessageServer _xmppMsgServer;
    private IMessageForm _form;
    private int _nextMsgId = 0;
    //private string _passwd = "secret";
    private TEventCallBack _evCallBackFunc = null;

    //private List<string> _connections = new List<string>();

    //public Dictionary<string, JIDandApp> clientApps { get { return _clientApps; } }
    //public List<string> connections { get { return _connections; } }
    private Dictionary<string, string> _resourceLookup = new Dictionary<string, string>(); //User & Resource lookup for jID into _roster.
    private Dictionary<string, Matrix.Xmpp.Roster.RosterItem> _roster = new Dictionary<string, Matrix.Xmpp.Roster.RosterItem>();
    //private Matrix.Xmpp.Client.RosterManager _rosterMan = new Matrix.Xmpp.Client.RosterManager();

    // TODO - The server should save these as properties
    private int m_port = 5222;

    public TEventCallBack evCallBackFunc { set { _evCallBackFunc = value; } }

    public EMRALDMsgServer(string passwd, IAppSettingsService appSettingsService)
    {
      _xmppMsgServer = new XmppMessageServer(m_port, passwd, appSettingsService);
      _xmppMsgServer.SetMessageClient(this);
    }

    public void Clear()
    {
      _form?.Clear();
    }

    public void SetForm(IMessageForm form)
    {
      _form = form;
    }

    public string GetNextMessageId()
    {
      return _nextMsgId.ToString();
    }

    public bool SendMessage(TMsgWrapper msg, string resAndClient)
    {
      string key = resAndClient;
      if (_resourceLookup.ContainsKey(key))
      {
        Jid userJid = _resourceLookup[key];

        // Convert the SampleMessage to a JSON string
        string jsonStr = JsonConvert.SerializeObject(msg);
        logger.Debug("Sending message - " + jsonStr);
        _xmppMsgServer.SendMessage(jsonStr, "S-"+_nextMsgId.ToString(), userJid);
        _nextMsgId++;
        return true;
      }
      else
      {
        string err = "error, could not find attached simulation for " + resAndClient;
        logger.Error(err);
        throw new Exception(err);
      }
    }

    public void IncomingMessage(Message msg)
    {
      
      if (!string.IsNullOrEmpty(msg.Body))
      {

        //Console.WriteLine("msg body: {0}", msg.Body);
        try
        {
          TMsgWrapper msgObj = JsonConvert.DeserializeObject<TMsgWrapper>(msg.Body);
          logger.Debug("Recieved message - " + msg.Body);
          if (msgObj != null)
          {
            //if (_form != null)
              _form?.IncomingEMRALDMsg(msg.From, msgObj);

            //process the message with EMRALD  
            _evCallBackFunc?.Invoke(ResAndNameFromConnection(msg.From), msgObj);
          }
          else
          {
            _form?.IncomingOtherMsg(ResAndNameFromConnection(msg.From), msg.Body);
          }
        }
        catch(Exception e)
        {
          _form?.IncomingOtherMsg(ResAndNameFromConnection(msg.From), msg.Body);
          logger.Error(e.Message);
          System.Threading.Thread.Sleep(500); //give time for error to write to log
          throw new Exception(e.Message);
        }
      }
    }

    public string UserFromConnection(string jID)
    {
      string userStr = "";
      //chars until an @ symbol
      int pos = jID.IndexOf('@');
      if(pos > 0)
      {
        userStr = jID.Substring(0, pos);
      }
      return userStr;
    }

    public void IncomingReceipt(string msgId)
    {
      //todo? don't return from send message until receipt is given or error on messages sent but no receipt after a certain duration.
    }

    public string ResAndNameFromConnection(string jID)
    {
      string resAndName = "";
      var clientCon = Global.ServerConnections[jID];
      if(clientCon != null)
        resAndName = clientCon.Resource + " - " + clientCon.User;

      return resAndName;
    }

    public bool OnConnect(Jid clientJid)
    {
      try
      {
        var clientCon = Global.ServerConnections[clientJid];
        var resAndName = clientCon.Resource + " - " + clientCon.User;
        if (_resourceLookup.ContainsKey(resAndName))
          return false;

        //var ri = new Matrix.Xmpp.Roster.RosterItem
        //{
        //  Jid = clientJid,
        //  Name = user,
        //  Subscription = Matrix.Xmpp.Roster.Subscription.Both
        //};

        //ri.AddGroup("EMRALD");
        //_roster.Add(clientJid, ri);

        _resourceLookup.Add(resAndName, clientJid);
        _form?.OnConnectCng();

        return true;
      }
      catch
      {
        return false;
      }
    }

    public void OnDisconnect(Jid clientJid)
    {
      //find the resource and remove it
      foreach(var r in _resourceLookup)
      {
        if (r.Value == clientJid)
        {
          _resourceLookup.Remove(r.Key);
        }
      }

      //_resourceLookup.Remove(clientJid);
      _form?.OnConnectCng();
    }

    public List<string> GetResources()
    {
      var ret = new List<string>();
      foreach(var item in _resourceLookup)
      {
        ret.Add(item.Key);
        //_rosterMan.
      }
      return ret;
    } 

    public bool HasResource(string name)
    {
      return _resourceLookup.ContainsKey(name);
    }

    public int ResourceCnt()
    {
      return _resourceLookup.Count();
    }

    //void AddToRoster(RosterItem item)
    //{
    //  _roster.Add(item.Jid, item);
    //}

    //void DelFromRoster(string jID)
    //{
    //  if(_roster.ContainsKey(jID))
    //  {
    //    _roster.Remove(jID);
    //  }
    //}
  }
}
