using System.Drawing;
using System.Windows.Forms;

using Matrix;
using Matrix.Xmpp;
using Matrix.Xmpp.Client;
using EventArgs = System.EventArgs;
using Message = Matrix.Xmpp.Client.Message;
using System;
using MessageDefLib;
using MessageType = MessageDefLib.MessageType;
using Newtonsoft.Json;
using Newtonsoft.Json.Schema;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.IO;
using System.Threading;

namespace XmppMessageClient
{
  /// <summary>
  /// 
  /// </summary>
  public partial class FrmSampleClient : Form
  {
    private SampleClientController m_clientController;
    private Dictionary<string, List<TMsgWrapper>> _validMessages = new Dictionary<string, List<TMsgWrapper>>();
    private AutoMessageTester _autoTester = null;
    private int _testMsgCnt = 0;
    private bool testerStarted = false;

    public FrmSampleClient(SampleClientController clientController)
    {
      m_clientController = clientController;
      m_clientController.SetForm(this);

      InitializeComponent();
    }
    
    private void InvokeUIUpdate(MethodInvoker methodInvokerDelegate)
    {
      if (this.InvokeRequired)
      {
        this.Invoke(methodInvokerDelegate);
      }
      else
      {
        methodInvokerDelegate();
      }
    }

    public void IncomingEMRALDMsg(string sender, TMsgWrapper msg)
    {
      
      MethodInvoker methodInvokerDelegate = delegate ()
      {
        rtfReceived.AppendText("From : " + sender + Environment.NewLine);
        rtfReceived.AppendText("JSON String: \n");
        rtfReceived.AppendText(JsonConvert.SerializeObject(msg, Formatting.Indented));

        List<TMsgWrapper> msgList;
        if (_validMessages.TryGetValue(sender, out msgList))
        {
          msgList.Add(msg);
        }
        else
        {
          msgList = new List<TMsgWrapper>();
          _validMessages.Add(sender, msgList);
          msgList.Add(msg);
        }


      };

      InvokeUIUpdate(methodInvokerDelegate);
    }

    public void IncomingOtherMsg(string sender, String msg)
    {
      MethodInvoker methodInvokerDelegate = delegate ()
      {
        rtbLog.AppendText("Unidentified Message " + Environment.NewLine);
        rtbLog.AppendText("From : " + sender + Environment.NewLine);
        rtbLog.AppendText("Raw String: " + Environment.NewLine);
        rtbLog.AppendText(msg + Environment.NewLine);
      };

      InvokeUIUpdate(methodInvokerDelegate);
    }

    public void IncomingReceipt(string msgId)
    {
      string statusMsg = "Received acknowledgement for message Id: " + msgId;
      statusBarClient.Text = statusMsg;
    }

    private void cmdSend_Click(object sender, EventArgs e)
    {
      
    }

    private void ResetMessage()
    {
      statusBarClient.Text = "";
      //comboBoxMsgType.SelectedIndex = 0;
      //textBoxDesc.Text = "";
      //dateTimePickerMsgDate.Value = DateTime.Now;
    }

    private void cmdConnect_Click(object sender, EventArgs e)
    {
      m_clientController.Connect(textBoxUser.Text, textBoxDomain.Text, textboxResource.Text, textBoxHost.Text);
      // TODO return a connection status
      UpdateConnectedStatus(true);
    }

    private void UpdateConnectedStatus(bool connected)
    {
      cmdDisconnect.Enabled = connected;
      btnSendMsg.Enabled = connected;
      cmdConnect.Enabled = !connected;
    }

    private void FrmSampleClient_FormClosed(object sender, FormClosedEventArgs e)
    {
      m_clientController.Disconnect();
      System.Windows.Forms.Application.Exit();
    }

    private void cmdDisconnect_Click(object sender, EventArgs e)
    {
      m_clientController.Disconnect();
      UpdateConnectedStatus(false);
    }

    private void cmdClose_Click(object sender, EventArgs e)
    {
      System.Windows.Forms.Application.Exit();
    }

    private void btnGenMsg_Click(object sender, EventArgs e)
    {
      TimeSpan time = TimeSpan.FromSeconds(0);
      try { time = TimeSpan.Parse(tbTimeSpan.Text); } catch { };
      TMsgWrapper msgObj = new TMsgWrapper(MessageType.mtSimEvent, tbDispName.Text, TimeSpan.FromSeconds(0), tbMsgDesc.Text);
      msgObj.simEvents.Add(new SimEvent((SimEventType)cbMsgType.SelectedIndex, time));

      switch (tabCtrlMsgTypes.SelectedIndex)
      {
        case 0: //Item Data
          msgObj.simEvents[0].itemData = new ItemData(tbItemDataName.Text, tbItemDataValue.Text);
          break;

        case 1: //Status
          msgObj.simEvents[0].status = (StatusType)cbStatusMsgType.SelectedIndex;
          break;
      }

      if (msgObj != null)
      {
        rtbJSONMsg.Text = JsonConvert.SerializeObject(msgObj, Formatting.Indented);
      }
    }

    private void FrmSampleClient_Load(object sender, EventArgs e)
    {
      cbStatusMsgType.Items.Clear();
      foreach (var statusType in Enum.GetValues(typeof(StatusType)))
      {
        cbStatusMsgType.Items.Add(statusType.ToString());
      }
      cbStatusMsgType.SelectedIndex = 0;
      cbMsgType.SelectedIndex = (int)SimEventType.etCompEv;
    }

    private void UI_Update()
    {
      //todo show next msg to run if any
      //btnSendMsg.Text = "Run";
      int cnt = int.Parse(tbHowMany.Text);
      if (cnt > 1)
      {
        btnSendMsg.Text = "Run";
      }
      else
      {
        btnSendMsg.Text = "Send Next";
      }
      if (testerStarted && (_autoTester.idx == _testMsgCnt))
      {
        btnSendMsg.Text = "ReRun";
      }
    }

    private void btnSendMsg_Click(object sender, EventArgs e)
    {
      //MethodInvoker NextUpdateDelegate = delegate ()
      //{
      //  //todo show next msg to run if any

      //  btnSendMsg.Text = "Stop";
      //};

      if (cbResources.SelectedIndex >= 0)
      {
        if (tabMsgSending.SelectedIndex == 0)
        {
          //see if json is valid
          string schemaStr = System.IO.File.ReadAllText("MessageProtocol.JSON");
          JSchema schemaChk = JSchema.Parse(schemaStr);
          try
          {
            JToken json = JToken.Parse(rtbJSONMsg.Text);
            IList<ValidationError> errors;
            bool valid = json.IsValid(schemaChk, out errors);
            if (!valid)
            {
              rtbJSONErrors.Visible = true;
              rtbJSONErrors.Clear();
              foreach (var error in errors)
              {
                rtbJSONErrors.AppendText(error.Message + Environment.NewLine);
                foreach (var child in error.ChildErrors)
                {
                  rtbJSONErrors.AppendText("Error - Line : " + child.LineNumber + " Pos : " + child.LinePosition + " - " + child.Message + Environment.NewLine);
                }
              }
            }
            else
            {
              TMsgWrapper msg = JsonConvert.DeserializeObject<TMsgWrapper>(rtbJSONMsg.Text);
              if (msg != null)
              {
                rtbJSONErrors.Visible = false;
                if (cbResources.SelectedIndex >= 0)

                  m_clientController.SendMessage(msg);
              }
              else
              {
                rtbJSONErrors.Visible = true;
                rtbJSONErrors.Text = "Error creating message from JSON text.";
              }
            }
          }
          catch (Exception er)
          {
            rtbJSONErrors.Visible = true;
            if (er is JsonReaderException)
              rtbJSONErrors.Text = "Error - Line : " + ((JsonReaderException)er).LineNumber + " Pos : " + ((JsonReaderException)er).LinePosition + Environment.NewLine;
            else
              rtbJSONErrors.Text = "Text is not a valid JSON Message Object :" + Environment.NewLine;
            rtbJSONErrors.AppendText(er.Message);
          }
        }
        else
        {
          if (btnSendMsg.Text == "Stop")
          {
            //todo stop the message sending.
            _autoTester.Stop();
          }
          else
          {
            if (_autoTester == null)
            {
              _autoTester = new AutoMessageTester(this.m_clientController, this.rtbTestMsg.Text, UI_Update, false);
            }

            if (btnSendMsg.Text == "ReRun")
            {
              _autoTester.Stop();
            }            
            
            if (!testerStarted)
              AutoMessageLoop();

            _autoTester.SetRunTo(_autoTester.idx + int.Parse(tbHowMany.Text));            
          }
          
        }
      }
      else
        MessageBox.Show("You must select a client to send it to. Left of the Send Button.");
    }

    /// <summary>
    /// Called on successfull connection to server
    /// </summary>
    public void OnConnected()
    {
      btnSendMsg.Enabled = true;
      pnlSendMsg.Enabled = true;
    }

    public void OnDisconnected()
    {
      btnSendMsg.Enabled = false;
      pnlSendMsg.Enabled = false;
    }


    /// <summary>
    /// Called when rostr items are changed
    /// </summary>
    public void OnRosterCng()
    {
      string prevSel = cbResources.Text;
      cbResources.Items.Clear();
      cbResources.Items.Add("EMRALD");
      int idx = 0;
      foreach (var item in m_clientController.rosterItems)
      {
        cbResources.Items.Add(item.Key);
        if (item.Key == prevSel)
          cbResources.SelectedIndex = idx;
        ++idx;
      }

      if (cbResources.SelectedIndex < 0)
        cbResources.SelectedIndex = 0;
    }
   
    private void cbMsgType_SelectedIndexChanged(object sender, EventArgs e)
    {
      if (((SimEventType)cbMsgType.SelectedIndex == SimEventType.etCompEv) || ((SimEventType)cbMsgType.SelectedIndex == SimEventType.etTimer))
      {
        tabCtrlMsgTypes.Visible = true;
        if (!tabCtrlMsgTypes.TabPages.Contains(tabItemData))
          tabCtrlMsgTypes.TabPages.Add(tabItemData);
        if (tabCtrlMsgTypes.TabPages.Contains(tabStatus))
          tabCtrlMsgTypes.TabPages.Remove(tabStatus);
      }
      else if (cbMsgType.Text == "Status") 
      {
        tabCtrlMsgTypes.Visible = true;
        if (!tabCtrlMsgTypes.TabPages.Contains(tabStatus))
          tabCtrlMsgTypes.TabPages.Add(tabStatus);
        if (tabCtrlMsgTypes.TabPages.Contains(tabItemData))
          tabCtrlMsgTypes.TabPages.Remove(tabItemData);
      }
      else
      {
        tabCtrlMsgTypes.Visible = false;
      }

      tabCtrlMsgTypes.SelectedIndex = 0;
    }

    private void tabStatus_Enter(object sender, EventArgs e)
    {
      cbStatusMsgType.SelectedIndex = (int)StatusType.stRunning;
    }

    private void btnOpenTestMsgFile_Click(object sender, EventArgs e)
    {
        dlgOpenTestMsgFile.ShowDialog();
    }

    private void dlgOpenTestMsgFile_FileOk(object sender, System.ComponentModel.CancelEventArgs e)
    {
      tbTestMsgFile.Text = dlgOpenTestMsgFile.FileName;
      LoadMsgTestFile();
    }
    private void LoadMsgTestFile()
    {
      if(File.Exists(tbTestMsgFile.Text))
      {
        string msgText = File.ReadAllText(tbTestMsgFile.Text);
        rtbTestMsg.Text = msgText;
      }
    }

    private void AutoMessageLoop()
    {
      //Loop through the messages in the testMsg text.
      if (btnSendMsg.Text != "Send Next")
        btnSendMsg.Text = "Stop";

      testerStarted = true;
      ThreadStart tStarter = new ThreadStart(_autoTester.Start);
      //run this when the thread is done.
      tStarter += () =>
      {
        testerStarted = false;
      };

      Thread simThread = new Thread(tStarter);
      simThread.Start();
      
    }

    private void tabPage1_Enter(object sender, EventArgs e)
    {
    }

    private void tabPage2_Enter(object sender, EventArgs e)
    {
    }

    private void rtbTestMsg_TextChanged(object sender, EventArgs e)
    {
      JArray modelJson = null;
      try
      {
        modelJson = JArray.Parse(rtbTestMsg.Text);
        rtbTestMsg.Text = modelJson.ToString(Formatting.Indented);
      }
      catch (Exception ex)
      {
        rtbTestMsg.Text = "Error loading file, verify the JSON format and an array of messages";
        return;
      };

      //update how many messages there are.
      _testMsgCnt = modelJson.Count;
      btnSendMsg.Enabled = true;
    }

    private void tabMsgSending_SelectedIndexChanged(object sender, EventArgs e)
    {
      if(tabMsgSending.SelectedTab == tabPgTestFile)
      {
        tbHowMany.Visible = true;
        lblHowMany.Visible = true;
        btnSendMsg.Text = "Send Next";
        if(rtbTestMsg.Text == "")
        {
          btnSendMsg.Enabled = false;
        }
      }
      else
      {
        tbHowMany.Visible = false;
        lblHowMany.Visible = false;
        btnSendMsg.Text = "Send";
      }
    }

    private void tbHowMany_TextChanged(object sender, EventArgs e)
    {
      try
      {
        int cnt = int.Parse(tbHowMany.Text);
        if (cnt > _testMsgCnt)
            tbHowMany.Text = _testMsgCnt.ToString();
        UI_Update();
      }
      catch
      {
        tbHowMany.Text = "1";
      }
    }
  } 

}