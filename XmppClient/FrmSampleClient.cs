using System.Drawing;
using System.Windows.Forms;

using Matrix;
using Matrix.Xmpp;
using Matrix.Xmpp.Client;
using EventArgs = System.EventArgs;
using Message = Matrix.Xmpp.Client.Message;
using System;
using CommonDefLib;
using MessageType = CommonDefLib.MessageType;
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
    private bool internalTxtMod = false;

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
      string x = "[\r\n{\r\n\"dispName\":\"EventName\",\r\n\"version\":\"0.1.0\",\r\n\"pID\":\"00000000-0000-0000-0000-000000000674\",\r\n\"msgType\":\"mtSimEvent\",\r\n\"globalRunTime\":\"00:00:00\",\r\n\"desc\":\"SomeEvent\",\r\n\"simEvents\":[\r\n{\r\n\"evType\":\"etPing\",\r\n\"time\":\"00:00:00\"\r\n}\r\n]\r\n},\r\n{\r\n\"dispName\":\"EventName\",\r\n\"version\":\"0.1.0\",\r\n\"pID\":\"00000000-0000-0000-0000-000000001010\",\r\n\"msgType\":\"mtSimEvent\",\r\n\"globalRunTime\":\"00:00:00\",\r\n\"desc\":\"Juststarted.\",\r\n\"simEvents\":[\r\n{\r\n\"evType\":\"etStatus\",\r\n\"status\":\"stIdle\",\r\n\"time\":\"00:00:00\"\r\n}\r\n]\r\n},\r\n{\r\n\"dispName\":\"EventName\",\r\n\"version\":\"0.1.0\",\r\n\"pID\":\"00000000-0000-0000-0000-000000002012\",\r\n\"msgType\":\"mtSimEvent\",\r\n\"globalRunTime\":\"00:00:00\",\r\n\"desc\":\"SomeEvent\",\r\n\"simEvents\":[\r\n{\r\n\"evType\":\"etSimLoaded\",\r\n\"time\":\"00:00:00\"\r\n}\r\n]\r\n}\r\n]";
      string find = "{\r\n\"dispName\":\"EventName\",\r\n\"version\":\"0.1.0\",\r\n\"pID\":\"00000000-0000-0000-0000-000000001010\",\r\n\"msgType\":\"mtSimEvent\",\r\n\"globalRunTime\":\"00:00:00\",\r\n\"desc\":\"Juststarted.\",\r\n\"simEvents\":[\r\n{\r\n\"evType\":\"etStatus\",\r\n\"status\":\"stIdle\",\r\n\"time\":\"00:00:00\"\r\n}\r\n]\r\n}";
      //string find = "\"version\":\"0.1.0\",\r\n\"pID\":\"00000000-0000-0000-0000-000000000674\",";
      //string x = "[Line1\r\nID=5\r\nName=test\r\nlastLine\r\n";
      //string find = "ID=5\r\nName=test";
      int i = x.IndexOf(find);


      m_clientController.Connect(textBoxUser.Text, textBoxDomain.Text, textboxResource.Text, textBoxHost.Text);
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
      if (btnSendMsg.InvokeRequired)
      {
        // Call this same method but append THREAD2 to the text
        Action safeWrite = delegate { UI_Update(); };
        btnSendMsg.Invoke(safeWrite);
      }
      else 
      {
        int cnt = int.Parse(tbHowMany.Text);
        if(_autoTester != null)
        {
          int newCnt = Math.Min(cnt, (_testMsgCnt - _autoTester.idx));
          if(cnt != newCnt)
          {
            tbHowMany.Text = newCnt.ToString();
            return;
          }
        }
        
        string newTxt = btnSendMsg.Text;
        if (cnt > 1)
        {
          newTxt = "Run";
        }
        else
        {
          newTxt = "Send Next";
        }
        if (testerStarted && (_autoTester.idx == _testMsgCnt))
        {
          newTxt = "ReRun";
          tbHowMany.Text = "1";
        }
        btnSendMsg.Text = newTxt;

        //string x = "[\r\n{\r\n\"dispName\":\"EventName\",\r\n\"version\":\"0.1.0\",\r\n\"pID\":\"00000000-0000-0000-0000-000000000674\",\r\n\"msgType\":\"mtSimEvent\",\r\n\"globalRunTime\":\"00:00:00\",\r\n\"desc\":\"SomeEvent\",\r\n\"simEvents\":[\r\n{\r\n\"evType\":\"etPing\",\r\n\"time\":\"00:00:00\"\r\n}\r\n]\r\n},\r\n{\r\n\"dispName\":\"EventName\",\r\n\"version\":\"0.1.0\",\r\n\"pID\":\"00000000-0000-0000-0000-000000001010\",\r\n\"msgType\":\"mtSimEvent\",\r\n\"globalRunTime\":\"00:00:00\",\r\n\"desc\":\"Juststarted.\",\r\n\"simEvents\":[\r\n{\r\n\"evType\":\"etStatus\",\r\n\"status\":\"stIdle\",\r\n\"time\":\"00:00:00\"\r\n}\r\n]\r\n},\r\n{\r\n\"dispName\":\"EventName\",\r\n\"version\":\"0.1.0\",\r\n\"pID\":\"00000000-0000-0000-0000-000000002012\",\r\n\"msgType\":\"mtSimEvent\",\r\n\"globalRunTime\":\"00:00:00\",\r\n\"desc\":\"SomeEvent\",\r\n\"simEvents\":[\r\n{\r\n\"evType\":\"etSimLoaded\",\r\n\"time\":\"00:00:00\"\r\n}\r\n]\r\n}\r\n]";
        //string find = \"version\":\"0.1.0\",\r\n\"pID\":\"00000000-0000-0000-0000-000000000674\",";
        //int i = x.IndexOf(find);


        //todo show next msg to run if any
        if ((_autoTester != null) && (_autoTester.idx < _testMsgCnt))
        {
          JToken curJ = _autoTester.msgList[_autoTester.idx];
          string findI = curJ.ToString(Formatting.Indented).Replace("\t", "").Replace(" ", "");
          string full = tbTestMsg.Text.Replace("\t", "").Replace(" ", "");
          int idx = full.IndexOf(findI, 0);
          if (idx >= 0)
          {
            int begLine = full.Substring(0, idx).Split('\n').Length;
            int lines = findI.Split('\n').Length;
            idx = tbTestMsg.GetFirstCharIndexFromLine(lines);
            int endLoc = tbTestMsg.GetFirstCharIndexFromLine(begLine + (lines-1));
            if (endLoc < idx)
              endLoc = tbTestMsg.Text.Length;
            tbTestMsg.Select(idx, (endLoc-idx));
            tbTestMsg.Focus();
            //tbTestMsg.SelectionBackColor = System.Drawing.Color.Brown;
            //rtbTestMsg.Refresh();
          }
            
        }
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
              _autoTester = new AutoMessageTester(this.m_clientController, this.tbTestMsg.Text, UI_Update, false);
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
        tbTestMsg.Text = msgText;
        tbTestMsg.Text = msgText;
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

    private void tabMsgSending_SelectedIndexChanged(object sender, EventArgs e)
    {
      if(tabMsgSending.SelectedTab == tabPgTestFile)
      {
        tbHowMany.Visible = true;
        lblHowMany.Visible = true;
        btnSendMsg.Text = "Send Next";
        if(tbTestMsg.Text == "")
        {
          btnSendMsg.Enabled = false;
        }
      }
      else
      {
        tbHowMany.Visible = false;
        lblHowMany.Visible = false;
        btnSendMsg.Text = "Send";
        btnSendMsg.Enabled = true;
      }
    }

    private void tbHowMany_Leave(object sender, EventArgs e)
    {

      try
      {
        int cnt = int.Parse(tbHowMany.Text);
        if (cnt > _testMsgCnt)
            tbHowMany.Text = _testMsgCnt.ToString();
        //UI_Update();
      }
      catch
      {
        if(tbHowMany.Text != "1")
          tbHowMany.Text = "1";
      }
    }



    private void tbTest_TextChanged(object sender, EventArgs e)
    {
      //only update if not from auto formatting
      if(internalTxtMod)
      {
        internalTxtMod = false;
        return;
      }

      JArray modelJson = null;
      try
      {
        modelJson = JArray.Parse(tbTestMsg.Text);
        internalTxtMod = true;
        tbTestMsg.Text = modelJson.ToString(Formatting.Indented);
      }
      catch (Exception ex)
      {
        if (!tbTestMsg.Text.StartsWith("Error"))
          tbTestMsg.Text = "Error loading file, verify the JSON format and an array of messages. " + ex.Message;
        return;
      };

      //update how many messages there are.
      _testMsgCnt = modelJson.Count;
      btnSendMsg.Enabled = true;
    }

    
  } 

}