using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using XmppMessageServer;
using Newtonsoft.Json;
using Newtonsoft.Json.Schema;
using Newtonsoft.Json.Linq;
using MessageDefLib;
using SimulationDAL;
using System.IO;
using System.Runtime.InteropServices;
using NLog;
using SimulationEngine;
using System.Threading;
using XmppServer;


namespace EMRALD_Sim
{
  public partial class FormMain : Form, IMessageForm //XmppMessageServer.MessageForm
  {
    private readonly IAppSettingsService _appSettingsService;
    private EMRALDMsgServer _server = null;
    private EmraldModel _sim = null;
    private bool _validSim = false;
    private string _modelPath = "";
    //private bool _cancel = false;
    private string _statsFile = "";
    private ProcessSimBatch simRuns = null;
    private string curDir = "c:\\temp";
    private List<string> monitor = new List<string>();
    private List<List<string>> _xmppLink = new List<List<string>>();
    private string _XMPP_Password = "secret";

    [DllImport("kernel32.dll")]
    static extern bool AttachConsole(int dwProcessId);
    private const int ATTACH_PARENT_PROCESS = -1;

    public FormMain(string[] args, IAppSettingsService appSettingsService)
    {
      _appSettingsService = appSettingsService;
      InitializeComponent();
      lvResults.Columns[3].Text = "Mean Time or Failed Components";
      lvResults.Columns[1].Text = "Count";

      //System.IO.File.Wri
      curDir = System.IO.Path.GetDirectoryName(Application.ExecutablePath);

      //System.IO.File.WriteAllLines(curDir + "\\simRunLog.txt", args);
      //System.IO.File.AppendAllText(curDir + "\\simRunLog.txt", "Cur Dir = " + Directory.GetCurrentDirectory() + Environment.NewLine);

      if (args.Length > 0)
      {
        if (args[0] == "//")
          return;
        AttachConsole(ATTACH_PARENT_PROCESS);
      }

      bool execute = false;
      string model = null;
      //SimulationDAL.Globals.simID = 1;
      for (int i = 0; i < args.Length; i++) // Loop through array
      {
        string argument = args[i];
        switch (argument)
        {
          case "-n": //run count
            {
              tbRunCnt.Text = args[i + 1];
              ++i;
              break;
            }

          case "-i": //path to input file
            {
              string filePath = args[i + 1];
              if (!File.Exists(filePath))
              {
                Console.Write("invalid input file path - " + filePath);
                return;
              }
              else
              {
                model = filePath;
              }
              ++i;
              break;
            }


          //case "-c": //code load of project
          //  {
          //    sim = new LookupLists("Test", "Desc");
          //    sim.TestNRCFlooding2();
          //    //sim.TestLoop(); 
          //    break;
          //  }

          case "-r": //path to output file
            {

              //tabSimulate_Enter(this, null);
              tbSavePath.Text = args[i + 1];
              ++i;
              break;
            }

          case "-o": //path to paths and timing output file
            {
              tbSavePath2.Text = args[i + 1];
              ++i;
              break;
            }

          case "-t": //max run time
            {
              tbMaxSimTime.Text = args[i + 1];
              ++i;
              break;
            }

          case "-e": //execute
            {
              execute = true;
              break;
            }

          case "-m": //monitor
            {
              try
              {
                string arg = args[i + 1];
                if (arg[0] == '[')
                {
                  arg = arg.TrimStart('[');
                  while (arg[arg.Length - 1] != ']')
                  {
                    monitor.Add(arg);
                    ++i;
                    arg = args[i + 1];
                  }

                  arg = arg.TrimEnd(']');
                  monitor.Add(arg);
                  ++i;
                }
                else
                {
                  monitor.Add(args[i + 1]);
                  ++i;
                }
              }
              catch
              {
                Console.Write("invalid data for monitor parameters, must be a single string or multiple encased in \"[]\", example - [x y z] ");
              }

              break;
            }

          case "-c": //coupled XMPP application
            {
              try
              {
                //read the password
                _XMPP_Password = args[i + 1];
                ++i;
                string arg = args[i + 1];
                if (arg[0] == '[')
                {
                  arg = arg.TrimStart('[');
                  while (arg[arg.Length - 1] != ']')
                  {
                    string linkName = arg;
                    ++i;
                    string xmppResouce = args[i + 1];
                    ++i;
                    string xmppUser = args[i + 1];
                    ++i;
                    int timeout = int.Parse(args[i + 1].TrimEnd(']')); //verify it is a number

                    _xmppLink.Add(new List<string>() { linkName, xmppResouce, xmppUser, timeout.ToString()});
                  }

                  arg = args[i + 1];
                  ++i;
                }
                else
                {
                  string linkName = arg;
                  ++i;
                  string xmppResouce = args[i + 1];
                  ++i;
                  string xmppUser = args[i + 1];
                  ++i;
                  int timeout = int.Parse(args[i + 1]); //verify it is a number

                  _xmppLink.Add(new List<string>() { linkName, xmppResouce, xmppUser, timeout.ToString()});
                  ++i;
                }
              }
              catch
              {
                Console.Write("invalid data for coupling external simulation, specify the password and the external sim name, XMPP connection resource, XMPP user name, and timeout in seconds. For multiple, encase in \"[]\"" + Environment.NewLine +
                                "Example: -d xmppServerPassword [LinkedProgram MyApp User1 60] [LinkedProgram2 MyApp2 User2 60]");
              }

              break;
            }

          case "-s":
            {
              if (LoadLib.SetSeed(args[i + 1]))
                tbSeed.Text = args[i + 1];
              break;
            }

          case "-jsonStats":
            {
              _statsFile = args[i + 1];
              break;
            }

          case "-d": //debug the runs
            {
              string strLev = args[i + 1];

              switch (strLev)
              {
                case "basic":
                case "Basic":
                  chkLog.Checked = true;
                  ConfigData.debugLev = LogLevel.Info;
                  break;

                case "detailed":
                case "Detailed":
                  chkLog.Checked = true;
                  rbDebugBasic.Checked = false;
                  rbDebugDetailed.Checked = true;
                  ConfigData.debugLev = LogLevel.Debug;
                  break;

                default:
                  Console.Write("invalid option for debug must be \"basic\" or \"detailed\". ");
                  break;
              }
              ++i;

              string arg = args[i + 1];
              if (arg[0] == '[')
              {
                try
                {
                  //get the start index
                  arg = arg.TrimStart('[');
                  if (arg.EndsWith(","))
                    arg = arg.TrimEnd(',');
                  ConfigData.debugRunStart = int.Parse(arg);
                  tbLogRunStart.Text = arg;
                  ++i;

                  //get the end index
                  arg = args[i + 1];
                  if (!arg.EndsWith("]"))
                  {
                    Console.Write("invalid option for debug range. Use [startIndex endIndex]");
                    return;
                  }
                  arg = arg.TrimEnd(']');
                  ConfigData.debugRunEnd = int.Parse(arg);
                  tbLogRunEnd.Text = arg;
                  ++i;
                }
                catch
                {
                  Console.Write("invalid option for debug range. Use [startIndex endIndex]");
                }

                ++i;
              }


              break;
            }

          case "-help":
            {
              Console.WriteLine("-n \"run count\"");
              Console.WriteLine("-i \"input model path\"");
              Console.WriteLine("-r \"results output file\"");
              Console.WriteLine("-o \"paths output file\"");
              Console.WriteLine("-jsonStats \"write path statistics to json output file at specified directory\"");
              Console.WriteLine("-t \"max run time\"");
              Console.WriteLine("-e \"execute\"");
              Console.WriteLine("-c \"coupled external simulation using XMPP, specify the password and the external sim name, XMPP connection resource, XMPP user name and timeout in seconds. If there is more than one put each in brackets\"" + Environment.NewLine +
                                "    Example: -c xmppServerPassword [LinkedProgram MyApp User1 60] [LinkedProgram2 MyApp2 User2 60]");
              Console.WriteLine("-m \"parameter to monitor, use []'s to do multiples, example - [x y z] \"");
              Console.WriteLine("-s \"initial random number seed\"");
              Console.WriteLine("-d \"debug level \"basic\" or \"detailed\", (optional) range [start end]. " + Environment.NewLine +
                                "    Basic - state movement only. Detailed - state movement, actions and events. " + Environment.NewLine +
                                "    Example: -d basic [10 20]");
              break;
            }


            //case "-x": //path to Extternal Sims TODO
            //  {
            //    if (File.Exists(args[i+1]))
            //    {
            //      extSims.Add(args[i + 1]);
            //    }
            //    else
            //    {
            //      Console.Write("invalid input external sim path - " + args[i + 1]);
            //      return;
            //    }

            //    string model3DPath = args[i + 1]; 
            //    //cbNeutrino.Checked = true;
            //    ++i;
            //    break;
            //  }


        }
      }

      if (model != null)
      {
        OpenModel(model);

        tcMain.SelectedTab = tabSimulate;

        //check the monitor values
        for (int idx = 0; idx < lbMonitorVars.Items.Count; idx++)
        {
          if (monitor.Contains(lbMonitorVars.Items[idx].ToString()))
          {
            lbMonitorVars.SetItemChecked(idx, true);
          }
        }

        //assign the xmpp connections if any
        for (int idx = 0; idx < _xmppLink.Count; idx++)
        {
          AssignServer(); //make sure it has been assigned
          var extSimLink = _sim.allExtSims.FindByName(_xmppLink[idx][0], false);
          if(extSimLink == null)
          {
            Console.Write("Bad -c first input. No external link in model named - " + _xmppLink[idx][0]);
          }
          else
          {
            extSimLink.resourceName = _xmppLink[idx][1] + " - " + _xmppLink[idx][2].ToLower();
            extSimLink.verified = false;
            extSimLink.timeout = int.Parse(_xmppLink[idx][3]);
            //check the UI
            var itemIdx = lbExtSimLinks.FindStringExact(_xmppLink[idx][0]);
            lbExtSimLinks.SetItemChecked(itemIdx, true);
          }                
        }


        if (execute)
        {
          btnStartSims_Click(this, null);
        }
      }
    }

    public void Clear()
    {
      if (chkClearOnMsg.Checked)
      {
        rtfReceived.Clear();
      }
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
        //rtfReceived.Text = msg;
        rtfReceived.AppendText("From : " + sender + Environment.NewLine);
        rtfReceived.AppendText("JSON String: \n");
        rtfReceived.AppendText(JsonConvert.SerializeObject(msg, Formatting.Indented));

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


    public void OnConnectCng()
    {
      MethodInvoker methodInvokerDelegate = delegate ()
      {
        string sel1 = listBoxClients.GetItemText(listBoxClients.SelectedItem);
        string sel2 = cbRegisteredClients.GetItemText(cbRegisteredClients.SelectedItem);
        //reload the client lists
        listBoxClients.Items.Clear();
        cbRegisteredClients.Items.Clear();
        AssignServer(); //make sure it has been assigned
        List<string> resources = _server.GetResources();
        foreach (string item in resources)
        {
          //string userName = server.UserFromConnection(item.Item1).ToUpper();
          listBoxClients.Items.Add(item);
          cbRegisteredClients.Items.Add(item);
        }

        for (int i = 0; i < listBoxClients.Items.Count; i++)
        {
          if (listBoxClients.GetItemText(i) == sel2)
            listBoxClients.SelectedIndex = i;
        }

        for (int i = 0; i < cbRegisteredClients.Items.Count; i++)
        {
          if (cbRegisteredClients.GetItemText(i) == sel2)
            cbRegisteredClients.SelectedIndex = i;
        }

        if ((cbRegisteredClients.SelectedIndex < 0) && (cbRegisteredClients.Items.Count > 0))
          cbRegisteredClients.SelectedIndex = 0;
      };

      InvokeUIUpdate(methodInvokerDelegate);
    }


    private void btnSendMsg_Click(object sender, EventArgs e)
    {
      if (cbRegisteredClients.SelectedIndex >= 0)
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
              AssignServer(); //make sure it has been assigned
              if (!_server.SendMessage(msg, cbRegisteredClients.GetItemText(cbRegisteredClients.SelectedItem)))
              {
                rtbJSONErrors.Visible = true;
                rtbJSONErrors.Text = "Failed to send message";
              }
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
        MessageBox.Show("You must select a client to send it to. Left of the Send Bttn.");
    }

    private void FormMain_FormClosed(object sender, FormClosedEventArgs e)
    {
      Environment.Exit(0);
    }

    private void button1_Click_1(object sender, EventArgs e)
    {

      //System.IO.File.WriteAllText("c:\\temp\\ActJSON.JSON", jsonString + Environment.NewLine);
    }

    //private void rbCompModFV_CheckedChanged(object sender, EventArgs e)
    //{
    //  this.grpboxCompMod1.Enabled = rbCompModFV.Checked;
    //  if(rbCompModFV.Checked)
    //  {
    //    rbCompModInfo.Checked = false;
    //  }
    //  else
    //  {
    //    tbCompModField.Clear();
    //    tbCompModValue.Clear();
    //  }

    //}

    //private void rbCompModInfo_CheckedChanged(object sender, EventArgs e)
    //{
    //  this.grpboxCompMod2.Enabled = rbCompModInfo.Checked;
    //  if (rbCompModInfo.Checked)
    //  {
    //    rbCompModFV.Checked = false;
    //  }
    //  else
    //  {
    //    rtbCompMsgInfo.Clear();
    //  }
    //}

    private void btnGenMsg_Click(object sender, EventArgs e)
    {
      TimeSpan time = TimeSpan.FromSeconds(0);
      try { time = TimeSpan.Parse(lblSimTime.Text); } catch { };

      TMsgWrapper msgObj = new TMsgWrapper(MessageType.mtSimAction, tbDispName.Text, time, tbMsgDesc.Text);


      TimeSpan actTime = TimeSpan.FromSeconds(0);
      try
      {
        if (pnlTimePicking.Visible)
          actTime = TimeSpan.Parse(tbTimeSpan.Text);
      }
      catch
      {
        MessageBox.Show("Not a valid time for the action.");
        return;
      };

      switch ((SimActionType)cbMsgType.SelectedIndex)
      {
        case SimActionType.atCompModify:
          msgObj.simAction = new SimAction(SimActionType.atCompModify, actTime, new ItemData(tbItemDataName.Text, tbItemDataValue.Text));
          break;

        case SimActionType.atOpenSim:
          TimeSpan endTime = TimeSpan.FromSeconds(0);
          try { endTime = TimeSpan.Parse(tbEndTime.Text); } catch { }
          msgObj.simAction = new SimAction(new SimInfo(tbModelRef.Text, endTime, tbConfigData.Text));
          break;

        case SimActionType.atTimer:
        case SimActionType.atRestartAtTime:
          msgObj.simAction = new SimAction((SimActionType)cbMsgType.SelectedIndex, actTime);
          break;

        default:
          msgObj.simAction = new SimAction((SimActionType)cbMsgType.SelectedIndex);
          break;
      }

      if (msgObj != null)
        rtbJSONMsg.Text = JsonConvert.SerializeObject(msgObj, Formatting.Indented);
    }

    private void FormMain_Load(object sender, EventArgs e)
    {
      cbMsgType.Items.Clear();
      foreach (SimActionType actT in Enum.GetValues(typeof(SimActionType)))
      {
        cbMsgType.Items.Add(actT.ToString().Substring(2));
      }
      cbMsgType.SelectedIndex = 0;
    }

    private void cbMsgType_SelectedIndexChanged(object sender, EventArgs e)
    {
      if ((SimActionType)cbMsgType.SelectedIndex == SimActionType.atCompModify)
      {
        pnlTimePicking.Visible = true;
        tabCtrlMsgTypes.Visible = true;
        if (!tabCtrlMsgTypes.TabPages.Contains(tabItemData))
          tabCtrlMsgTypes.TabPages.Add(tabItemData);
        if (tabCtrlMsgTypes.TabPages.Contains(tabSimInfo))
          tabCtrlMsgTypes.TabPages.Remove(tabSimInfo);
      }
      else if ((SimActionType)cbMsgType.SelectedIndex == SimActionType.atOpenSim)
      {
        pnlTimePicking.Visible = false;
        tabCtrlMsgTypes.Visible = true;
        if (!tabCtrlMsgTypes.TabPages.Contains(tabSimInfo))
          tabCtrlMsgTypes.TabPages.Add(tabSimInfo);
        if (tabCtrlMsgTypes.TabPages.Contains(tabItemData))
          tabCtrlMsgTypes.TabPages.Remove(tabItemData);
      }
      else if (((SimActionType)cbMsgType.SelectedIndex == SimActionType.atRestartAtTime) || ((SimActionType)cbMsgType.SelectedIndex == SimActionType.atTimer))
      {
        pnlTimePicking.Visible = true;
        tabCtrlMsgTypes.Visible = false;
      }
      else
      {
        tabCtrlMsgTypes.Visible = false;
        tabCtrlMsgTypes.Visible = false;
        pnlTimePicking.Visible = false;
      }

      tabCtrlMsgTypes.SelectedIndex = 0;
    }

    private void btnSendMsg_Click_1(object sender, EventArgs e)
    {
      if (cbRegisteredClients.SelectedIndex >= 0)
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
              AssignServer(); //make sure it has been assigned
              _server.SendMessage(msg, (string)cbRegisteredClients.Items[cbRegisteredClients.SelectedIndex]);
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
        MessageBox.Show("You must select a client to send it to. Left of the Send Bttn.");
    }

    private void btnStartSims_Click(object sender, EventArgs e)
    {
      try
      {
        MethodInvoker ButtonEnableDelegate = delegate ()
        {
          btnStartSims.Enabled = true;

          if (simRuns.error != "")
            lbl_ResultHeader.Text = simRuns.error;
        };


        btnStartSims.Enabled = false;
        if (chkLog.Checked && ((int.Parse(tbLogRunStart.Text) - (int.Parse(tbLogRunEnd.Text)) > 100)))
        {
          DialogResult res = MessageBox.Show("Debug Warning", "Are you sure you want to debug that many runs ?", MessageBoxButtons.YesNo, MessageBoxIcon.Warning);
          if (res == DialogResult.No)
            return;
        }

        //make sure that all the Ext Sim links are assigned.
        foreach (var extSimLink in lbExtSimLinks.Items)
        {
          if (!lbExtSimLinks.CheckedItems.Contains(extSimLink))
          {
            MessageBox.Show("You must assign all the Links to External Simulations");
            btnStartSims.Enabled = true;
            return;
          }
        }

        TimeSpan maxTime = TimeSpan.FromSeconds(0);
        try
        {
          maxTime = TimeSpan.Parse(tbMaxSimTime.Text);
        }
        catch
        {
          MessageBox.Show("Invalid Max Simulation Time, please fix.");
          btnStartSims.Enabled = true;
          return;
        }

        lblRunTime.Visible = true;
        lbl_ResultHeader.Visible = true;

        //do the JSON path statistics ?
        if (rbJsonPaths.Checked)
          _statsFile = tbSavePath2.Text;
        else
          _statsFile = "";


        simRuns = new ProcessSimBatch(_sim, maxTime, tbSavePath.Text, _statsFile);

        simRuns.progressCallback = DispResults;
        if (_server != null)
        {
          simRuns.AddExtSimulationData(_server, 100, "", _XMPP_Password);
        }

        foreach (var varItem in lbMonitorVars.CheckedItems)
        {
          simRuns.logVarVals.Add(varItem.ToString());
        }

        string simplePathRes = "";
        if (!rbJsonPaths.Checked)
          simplePathRes = tbSavePath2.Text;

        simRuns.SetupBatch(int.Parse(tbRunCnt.Text), true, simplePathRes);
        ThreadStart tStarter = new ThreadStart(simRuns.RunBatch);
        //run this when the thread is done.
        tStarter += () =>
        {
          simRuns.GetVarValues(simRuns.logVarVals, true);
          InvokeUIUpdate(ButtonEnableDelegate);
        };

        Thread simThread = new Thread(tStarter);
        simThread.Start();
      }
      catch (Exception err)
      {
        throw (err);
      }

      //Thread simThread = new Thread(new ThreadStart(simRuns.RunBatch));
      //simRuns.RunBatch(int.Parse(tbRunCnt.Text), ref _cancel, true, simplePathRes);

      //simRuns.GetVarValues(simRuns.logVarVals, true);
    }

    private void tabXMPP_Enter(object sender, EventArgs e)
    {
      cbMsgType.SelectedIndex = 0;
    }

    private void openToolStripMenuItem_Click(object sender, EventArgs e)
    {
      if (openModel.ShowDialog() == DialogResult.OK)
      {
        OpenModel(openModel.FileName);
      }
    }

    private void OpenModel(string path)
    {
      Cursor saveCurs = Cursor.Current;
      Cursor.Current = Cursors.WaitCursor;

      this.Text = "EMRALD (" + path + ");";

      string errorStr = "";
      txtModel.Text = LoadLib.LoadModel(path, ref errorStr);
      _modelPath = path;
      if (errorStr != "")
      {
        txtMStatus.ForeColor = Color.Maroon;
        txtMStatus.Text = errorStr;
        Console.Write(errorStr);
      }

      btnValidateModel_Click(null, null);

      Cursor.Current = saveCurs;
    }

    private void btnValidateModel_Click(object sender, EventArgs e)
    {
      Cursor saveCurs = Cursor.Current;
      Cursor.Current = Cursors.WaitCursor;

      txtMStatus.Text = LoadLib.ValidateModel(ref _sim, txtModel.Text, Path.GetDirectoryName(_modelPath));
      _validSim = txtMStatus.Text == "";
      if (txtMStatus.Text != "")
      {
        txtMStatus.ForeColor = Color.Maroon;
        Console.Write(txtMStatus.Text);
      }

      InitSimTabInfo();
      Cursor.Current = saveCurs;
    }

    private void InitSimTabInfo()
    {
      pnlSimulate.Enabled = _validSim;
      pnlSimResults.Enabled = _validSim;

      //load the external Sim links
      lbExtSimLinks.Items.Clear();
      if (_validSim)
      {
        foreach (var sim in _sim.allExtSims)
        {
          int idx = lbExtSimLinks.Items.Add(sim.Value.name);
          AssignServer(); //make sure it has been assigned
          if (_server != null)
          {
            bool chk = sim.Value.resourceName == "" ? false : _server.HasResource(sim.Value.resourceName);
            lbExtSimLinks.SetItemChecked(idx, chk);
          }
        }
      }

      //load all the variables for user to adjust what to monitor
      lbMonitorVars.Items.Clear();
      if (_validSim)
      {
        foreach (var var in _sim.allVariables)
        {
          int idx = lbMonitorVars.Items.Add(var.Value.name);
          bool chk = var.Value.monitorInSim;
          lbMonitorVars.SetItemChecked(idx, chk);
        }
      }
    }

    private void txtModel_TextChanged(object sender, EventArgs e)
    {
      _validSim = false;
    }

    private void DispResults(TimeSpan runTime, int runCnt, bool finalValOnly)
    {
      MethodInvoker methodInvokerDelegate = delegate ()
      {
        lbl_ResultHeader.Text = _sim.name + " " + runCnt.ToString() + " of " + tbRunCnt.Text + " runs.";// Time - " + runTime.ToString();
        lblRunTime.Text = runTime.ToString("g");
        lvResults.Items.Clear();

        foreach (var item in simRuns.keyPaths)
        {
          string[] lvCols = new string[4];
          lvCols[0] = item.Key;
          lvCols[1] = item.Value.count.ToString();
          lvCols[2] = (item.Value.count / (double)runCnt).ToString();
          lvCols[3] = item.Value.timeMean.ToString(@"dd\.hh\:mm\:ss") + " +/- " + item.Value.timeStdDeviation.ToString(@"dd\.hh\:mm\:ss");
          lvResults.Items.Add(new ListViewItem(lvCols));

          //write the failed components and times.
          if (simRuns.keyFailedItems.ContainsKey(item.Key))
          {
            foreach (var cs in simRuns.keyFailedItems[item.Key].compFailSets)
            {
              string[] lvCols2 = new string[4];

              int[] ids = cs.Key.Get1sIndexArray();
              List<string> names = new List<String>();
              foreach (int id in ids)
              {
                names.Add(_sim.allStates[id].name);
              }
              names.Sort();

              lvCols[0] = "";
              lvCols[1] = ((Double)cs.Value).ToString();
              lvCols[2] = String.Format("{0:0.00}", (((double)cs.Value / item.Value.count) * 100)) + "%";
              lvCols[3] = string.Join(", ", names);

            }
          }

          //foreach (var cs in item.Value.compFailSets)
          //{
          //  string[] lvCols2 = new string[4];

          //  int[] ids = cs.Key.Get1sIndexArray();
          //  List<string> names = new List<String>();
          //  foreach (int id in ids)
          //  {
          //    names.Add(_sim.allStates[id].name);
          //  }
          //  names.Sort();

          //  lvCols[0] = "";
          //  lvCols[1] = ((Double)cs.Value).ToString();
          //  lvCols[2] = String.Format("{0:0.00}", (((double)cs.Value / item.Value.failCnt) * 100)) + "%";
          //  lvCols[3] = string.Join(", ", names);
          //  lvResults.Items.Add(new ListViewItem(lvCols));
          //}
        }

        lvVarValues.Items.Clear();
        List<string> values = simRuns.GetVarValues(simRuns.logVarVals);
        int i = 0;
        foreach (var simVar in simRuns.logVarVals)
        {
          string[] lvCols = new string[2];
          lvCols[0] = simVar;
          lvCols[1] = values[i];
          lvVarValues.Items.Add(new ListViewItem(lvCols));
          ++i;
        }

        this.Refresh();
        Application.DoEvents();

        if (tbSavePath.Text != "")
        {
          simRuns.LogResults(runTime, runCnt, !finalValOnly);
        }

      };

      InvokeUIUpdate(methodInvokerDelegate);
    }

    private void btn_Stop_Click(object sender, EventArgs e)
    {
      simRuns.StopSims();
    }

    private void lbExtSimLinks_Click(object sender, EventArgs e)
    {
      CheckState ck = CheckState.Unchecked;
      AssignServer(); //make sure it has been assigned
      var f = new FormSelExtSim(_server.GetResources());
      if (f.ShowDialog(this) == DialogResult.OK && lbExtSimLinks.SelectedItem != null)
      {
        if (f.resourceName != "")
        {
          var extSimLink = _sim.allExtSims.FindByName(lbExtSimLinks.SelectedItem.ToString());
          //  f.resourceName);
          extSimLink.resourceName = f.resourceName;
          extSimLink.verified = true;
          ck = CheckState.Checked;
        }
      }

      lbExtSimLinks.SetItemCheckState(lbExtSimLinks.SelectedIndex, ck);
    }

    private void defaultLoadToolStripMenuItem_Click(object sender, EventArgs e)
    {
      //Cursor saveCurs = Cursor.Current;
      //Cursor.Current = Cursors.WaitCursor;

      //try
      //{
      //  _sim = CodeModels.LoadDemoWithTsunamiIE();// LoadDemo();

      //  txtModel.Text = _sim.GetJSON(true, _sim);
      //  txtMStatus.ForeColor = Color.Green;
      //  txtMStatus.Text = "Model loaded succesfully.";
      //  _validSim = true;

      //  this.Text = "EMRALD (CodedDemo);";
      //}
      //catch (Exception error)
      //{
      //  txtMStatus.ForeColor = Color.Maroon;
      //  txtMStatus.Text = "Failed to load model :" + error.Message;
      //}
    }


    private void button3_Click(object sender, EventArgs e)
    {
      saveFileDialog1.ShowDialog();
    }

    private void saveFileDialog1_FileOk(object sender, CancelEventArgs e)
    {
      tbSavePath.Text = saveFileDialog1.FileName;
    }

    private void button2_Click_1(object sender, EventArgs e)
    {
      saveFileDialog2.ShowDialog();
    }

    private void saveFileDialog2_FileOk(object sender, CancelEventArgs e)
    {
      tbSavePath2.Text = saveFileDialog2.FileName;
    }

    private void AssignServer()
    {
      if (_server == null)
      {
        _server = new EMRALDMsgServer(_XMPP_Password, _appSettingsService);
        _server.SetForm(this);
      }
    }

    private void rbDebug_CheckedChanged(object sender, EventArgs e)
    {
      if (rbDebugBasic.Checked)
        ConfigData.debugLev = LogLevel.Info;
      if (rbDebugDetailed.Checked)
        ConfigData.debugLev = LogLevel.Debug;

    }

    private void chkLog_CheckedChanged(object sender, EventArgs e)
    {

      if (chkLog.Checked)
      {
        rbDebugBasic.Checked = true;
        tbLogRunStart.Text = "1";
        tbLogRunEnd.Text = tbRunCnt.Text;
        ConfigData.debugRunStart = 1;
        ConfigData.debugRunEnd = int.Parse(tbRunCnt.Text);
      }
      else
      {
        ConfigData.debugLev = LogLevel.Off;
        rbDebugBasic.Checked = false;
        rbDebugDetailed.Checked = false;
      }
      grpDebugOpts.Enabled = chkLog.Checked;
    }

    private void tbSeed_Leave(object sender, EventArgs e)
    {
      if (!LoadLib.SetSeed(tbSeed.Text))
      {
        MessageBox.Show("Invalid Seed, must be a number");
        tbSeed.Text = "";
      }
    }

    private void tbLogRunStart_Leave(object sender, EventArgs e)
    {
      int parsedValue;
      if (!int.TryParse(tbLogRunStart.Text, out parsedValue))
      {
        MessageBox.Show("From Run must be a number > 0.");
        tbLogRunStart.Text = "1";
        return;
      }

      if (parsedValue < 1)
        tbLogRunStart.Text = "1";

      ConfigData.debugRunStart = int.Parse(tbLogRunStart.Text);
    }

    private void tbLogRunEnd_Leave(object sender, EventArgs e)
    {
      int parsedValue;
      if (!int.TryParse(tbLogRunEnd.Text, out parsedValue))
      {
        MessageBox.Show("To Run must be a number less than or equal to the total runs");
        tbLogRunEnd.Text = tbRunCnt.Text;
        return;
      }

      if (parsedValue > int.Parse(tbRunCnt.Text))
        tbLogRunStart.Text = tbRunCnt.Text;

      ConfigData.debugRunEnd = int.Parse(tbLogRunEnd.Text);
    }

    private void tbRunCnt_Leave(object sender, EventArgs e)
    {
      int parsedValue;
      if (!int.TryParse(tbRunCnt.Text, out parsedValue))
      {
        MessageBox.Show("Run Count must be a number");
        tbRunCnt.Text = "1000";
        return;
      }
    }

    private void rbSimplePath_CheckedChanged(object sender, EventArgs e)
    {
      if (rbSimplePath.Checked)
        tbSavePath2.Text = Path.GetDirectoryName(tbSavePath2.Text) + "\\" + Path.GetFileNameWithoutExtension(tbSavePath2.Text) + ".text";
      else
        tbSavePath2.Text = Path.GetDirectoryName(tbSavePath2.Text) + "\\" + Path.GetFileNameWithoutExtension(tbSavePath2.Text) + ".json";
    }

  }
}
