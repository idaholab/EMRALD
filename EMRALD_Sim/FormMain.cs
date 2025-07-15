using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using Matrix.Xmpp.Bytestreams;
using MessageDefLib;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;
using NLog;
using SimulationDAL;
using SimulationEngine;
using Windows.Devices.Geolocation;
using XmppMessageServer;
using XmppServer;
using static EMRALD_Sim.UISettings;

namespace EMRALD_Sim
{
  public partial class FormMain : Form, IMessageForm //XmppMessageServer.MessageForm
  {
    private readonly IAppSettingsService _appSettingsService;
    private readonly IOptions<UISettings> _optionsAccessor;
    private EMRALDMsgServer _server = null;
    private EmraldModel _sim = null;
    private bool _validSim = false;
    private string _modelPath = "";
    //private bool _cancel = false;
    private string _statsFile = "";
    private List<ProcessSimBatch> simRuns = new List<ProcessSimBatch>();
    private string curDir = "c:\\temp";
    private List<string> monitor = new List<string>();
    private List<List<string>> _xmppLink = new List<List<string>>();
    private string _XMPP_Password = "secret";
    private int _pathResultsInterval = -1;
    private ModelSettings _currentModelSettings = null;
    private Options_cur jsonOptions = null; //if the user has passed in JSON options
    private bool _populatingSettings = false; //Flag that UI settings are being populated programatically, don't save on changes if true
    private bool _running = false; //currently running simulations

    [DllImport("kernel32.dll")]
    static extern bool AttachConsole(int dwProcessId);
    private const int ATTACH_PARENT_PROCESS = -1;

    public FormMain(string[] args, IAppSettingsService appSettingsService, IOptions<UISettings> optionsAccessor)
    {
      _appSettingsService = appSettingsService;
      _optionsAccessor = optionsAccessor;
      InitializeComponent();
      teModel.SetHighlighting("JSON");
      ResetResults();

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
      if (args.Length > 0) // Loop through array
      {
        string argument = args[0].ToLower();
        bool isJSON = false;
        try
        {
          isJSON = Path.GetExtension(argument).Equals(".json", StringComparison.OrdinalIgnoreCase);
        }
        catch { }
        ;

        if (isJSON)
        {
          //jsonOptions =  LoadFromJSON(args[0]);
          OptionsRunWithNotify(args[0]);
        }
        else
        {
          execute = LoadFromArgs(args);
        }
      }

      if (model != null)
      {
        if (OpenModel(model))
        {

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
            if (extSimLink == null)
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
    }


    /// <summary>
    /// Load the settings from the arguments passed in
    /// </summary>
    /// <param name="args"></param>
    /// <returns>return if to execute the model</returns>
    private bool LoadFromArgs(string[] args)
    {
      _populatingSettings = true;
      bool execute = false;
      string model = null;
      //SimulationDAL.Globals.simID = 1;
      for (int i = 0; i < args.Length; i++) // Loop through array
      {
        string argument = args[i].ToLower();
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
                return false;
              }
              else
              {
                model = filePath;
              }
              ++i;
              break;
            }

          case "-r": //path to output file
            {
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

                    _xmppLink.Add(new List<string>() { linkName, xmppResouce, xmppUser, timeout.ToString() });
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

                  _xmppLink.Add(new List<string>() { linkName, xmppResouce, xmppUser, timeout.ToString() });
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

          case "-jsonstats":
            {
              _statsFile = args[i + 1];
              break;
            }

          case "-rintrv":
            {
              try
              {
                _pathResultsInterval = int.Parse(args[i + 1]);
              }
              catch
              {
                Console.WriteLine("-rIntrv option must be a valid integer number");
              }
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
                    return false;
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

          case "-mergeresults":
            if (args.Length < (i + 4))
            {
              Console.Write("Invalid option, must have two result file paths and a destination file path after -mergeresults.");
              return false;
            }
            string mergePath1 = _statsFile = args[i + 1];
            string mergePath2 = _statsFile = args[i + 2];
            string resPath = _statsFile = args[i + 3];

            try
            {
              if (SimulationEngine.OverallResults.CombineJsonResultFiles(mergePath1, mergePath2, resPath) == "")
              {
                Console.Write("Failed to load files, must have two valid file paths after -mergeresults.");
                return false;
              }

              //all went well so be done
            }
            catch
            {
              Console.Write("Failed to merge result files, verify they are valid EMRALD path result JSON files.");
            }
            break;

          case "-help":
          case "-h":
          case "-H":
          case "-HELP":
            {
              Console.WriteLine("Pass in a Options JSON file or use the following command line options.");
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
              Console.WriteLine("-rIntrv \"how often to save the path results, every X number of runs. No value or <1 will result in saving only after all runs are complete.\"");
              Console.WriteLine("-mergeResults \"merge two json path result files into one. Estimates the 5th and 95th. Example: -mergeResults c:/temp/PathResultsBatch1.json c:/temp/PathResultsBatch2.json c:/temp/PathResultsCombined.json\"");
              Console.WriteLine("Options JSON file - ");
              Console.WriteLine(Options_cur.CmdJSON_OptionsExample);
              Environment.Exit(0);
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
      _populatingSettings = false;
      return execute;
    }

    private void OptionsRunWithNotify(string jsonPath)
    {
      if (!File.Exists(jsonPath))
      {
        Console.Write("Invalid path for JSON options load.");
        return;
      }
      string optionsJsonStr = File.ReadAllText(jsonPath);

      // Create a new form to act as a notification
      Form notificationForm = new Form
      {
        Text = "Processing",
        Size = new System.Drawing.Size(300, 100),
        StartPosition = FormStartPosition.CenterScreen
      };

      // Add a label to the form to display the message
      Label label = new Label
      {
        Text = "Processing, please wait...",
        AutoSize = true,
        TextAlign = System.Drawing.ContentAlignment.MiddleCenter,
        Dock = DockStyle.Fill
      };
      notificationForm.Controls.Add(label);

      // Show the notification form
      Task.Run(() =>
      {
        notificationForm.ShowDialog();
      });

      // Handle the arguments asynchronously
      Task.Run(() =>
      {
        OptionsRun(optionsJsonStr);

        // Close the notification form once processing is complete
        notificationForm.Invoke(new System.Action(() => notificationForm.Close()));

        // Exit the application
        Environment.Exit(0);
      });
    }

    private void OptionsRun(string optionsJsonStr)
    {
      JSONRun simRun = new JSONRun(optionsJsonStr);
      if (simRun.error != "")
      {
        Console.Write(simRun.error);
      }
      else
      {
        string res = simRun.RunSim();
        if (res != "")
        {
          Console.Write("Invalid path for JSON options load.");
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
        string schemaStr = System.IO.File.ReadAllText(System.Reflection.Assembly.GetEntryAssembly().Location + "\\MessageProtocol.JSON");
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
      try { time = TimeSpan.Parse(lblSimTime.Text); } catch { }
      ;

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
      }
      ;

      switch ((SimActionType)cbMsgType.SelectedIndex)
      {
        case SimActionType.atCompModify:
          msgObj.simAction = new SimAction(SimActionType.atCompModify, actTime, new ItemData(tbItemDataName.Text, tbItemDataValue.Text));
          break;

        case SimActionType.atOpenSim:
          TimeSpan endTime = TimeSpan.FromSeconds(0);
          try { endTime = TimeSpan.Parse(tbEndTime.Text); } catch { }
          msgObj.simAction = new SimAction(new SimInfo(tbModelRef.Text, endTime, tbConfigData.Text, Convert.ToInt32(tbSeed), 1, 1));
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
      PopulateRecentFileList();
    }

    private void PopulateRecentFileList()
    {
      if (_optionsAccessor.Value.SettingsByModel.Count > 0)
      {
        foreach (ModelSettings modelSettings in _optionsAccessor.Value.SettingsByModel)
        {
          ToolStripMenuItem fileRecent = new ToolStripMenuItem(modelSettings.Filename, null, RecentFile_click) { Tag = modelSettings };
          recentToolStripMenuItem.DropDownItems.Add(fileRecent);
        }

      }
      else
      {
        recentToolStripMenuItem.Visible = false;
      }
    }

    private void AddRecentlyOpenedFileToSettings()
    {
      _currentModelSettings = _optionsAccessor.Value.SettingsByModel.SingleOrDefault(m => m.Filename == _modelPath);

      if (_currentModelSettings == null)
      {
        _currentModelSettings = new ModelSettings
        {
          Filename = _modelPath
        };

        // Limit the size of the list
        if (_optionsAccessor.Value.SettingsByModel.Count == 10)
        {
          _optionsAccessor.Value.SettingsByModel.RemoveLast();
          recentToolStripMenuItem.DropDownItems.RemoveAt(recentToolStripMenuItem.DropDownItems.Count - 1);
        }

        _optionsAccessor.Value.SettingsByModel.AddFirst(_currentModelSettings);

        // Might be hidden if there were no recent entries in the json file to start with
        recentToolStripMenuItem.Visible = true;
        ToolStripMenuItem fileRecent = new ToolStripMenuItem(_modelPath, null, RecentFile_click) { Tag = _currentModelSettings };
        recentToolStripMenuItem.DropDownItems.Insert(0, fileRecent);

        PopulateSettingsFromJson();
        SaveUISettings();
      }
    }

    private void RecentFile_click(object sender, EventArgs e)
    {
      ToolStripMenuItem toolStripMenuItem = sender as ToolStripMenuItem;

      if (toolStripMenuItem.Text != _modelPath)
      {
        _currentModelSettings = toolStripMenuItem.Tag as ModelSettings;

        // Move item to top of list
        _optionsAccessor.Value.SettingsByModel.Remove(_currentModelSettings);
        _optionsAccessor.Value.SettingsByModel.AddFirst(_currentModelSettings);
        recentToolStripMenuItem.DropDownItems.Remove(toolStripMenuItem);
        recentToolStripMenuItem.DropDownItems.Insert(0, toolStripMenuItem);

        if (OpenModel(toolStripMenuItem.Text))
        {
          PopulateSettingsFromJson();
          SaveUISettings();
        }
      }
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
              if (_server.SendMessage(msg, (string)cbRegisteredClients.Items[cbRegisteredClients.SelectedIndex]))
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

    //set when running item visibility 
    private void SetRunningVis()
    {
      btnStartSims.Enabled = !_running;
      lbl_CurThread.Visible = cbMultiThreaded.Checked && (_running);
      cbCurThread.Visible = cbMultiThreaded.Checked && (_running);
    }

    private void ResetResults()
    {
      lblRunTime.Text = "00:00:00";
      lbl_ResultHeader.Text = "0 of n runs";
      lvResults.Items.Clear();
      lvVarValues.Items.Clear();
    }

    private void btnStartSims_Click(object sender, EventArgs e)
    {
      _running = false;
      ResetResults();
      try
      {
        MethodInvoker ErrorAndVisUpdateDelegate = delegate ()
        {
          //btnStartSims.Enabled = true;
          SetRunningVis();

          foreach (var simBatch in simRuns)
          {
            if (simBatch.error != "")
              lbl_ResultHeader.Text = "Thread-" + simBatch.threadNum.ToString() + " " + simBatch.error;
          }
        };


        //btnStartSims.Enabled = false;
        _running = true;
        SetRunningVis();
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
            //btnStartSims.Enabled = true;
            _running = false;
            SetRunningVis();
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
          //btnStartSims.Enabled = true;
          _running = false;
          SetRunningVis();
          return;
        }

        lblRunTime.Visible = true;
        lbl_ResultHeader.Visible = true;

        _statsFile = tbSavePath2.Text;
        int threadCnt = ConfigData.threads == null ? 1 : (int)ConfigData.threads;
        int runsDiv = int.Parse(tbRunCnt.Text) / threadCnt;

        List<Thread> threads = new List<Thread>();
        simRuns.Clear();
        

        for (int i = 0; i < ConfigData.threads; i++)
        {
          //set up the simBatch, only set threads if more than one.
          simRuns.Add(new ProcessSimBatch(_sim, maxTime, tbSavePath.Text, _statsFile, _pathResultsInterval, ConfigData.threads <= 1 ? null : i));

          simRuns[i].progressCallback = DispResults;
          if (_server != null)
          {
            simRuns[i].AddExtSimulationData(_server, 100, "", _XMPP_Password);
          }

          foreach (var varItem in lbMonitorVars.CheckedItems)
          {
            simRuns[i].logVarVals.Add(varItem.ToString());
          }

          if (i == 0) //add extra runs on the first one
            simRuns[i].SetupBatch(runsDiv + (int.Parse(tbRunCnt.Text) % (int)ConfigData.threads), true);
          else
            simRuns[i].SetupBatch(runsDiv, true);

          ThreadStart tStarter = new ThreadStart(simRuns[i].RunBatch);
          //run this when the thread is done.
          int locIdx = i;
          tStarter += () =>
          {
            simRuns[locIdx].GetVarValues(simRuns[locIdx].logVarVals, true);
          };

          Thread simThread = new Thread(tStarter);
          if (i == 0)
          {
            // Start the first thread immediately so it can set up the files needed by the others
            simThread.Start();
          }
          else
          {
            // Delay the start of all but first thread so that it has time to write so others have time to copy data
            new Task(async () =>
            {
              //wait until first thread is done writing temp tread files.
              while (!simRuns[0].tempThreadFilesWriten)
                await Task.Delay(TimeSpan.FromMilliseconds(10)); // Adjust the delay as needed
              simThread.Start();
            }).Start();
          }
          threads.Add(simThread);
        }

        Task.Run(() =>
        {
          // Wait for all threads to complete
          foreach (var thread in threads)
          {
            thread.Join();
          }
          // Once all threads are done, update the UI and sum results
          //compile results if needed
          for (int i = 1; i < simRuns.Count; i++)
          {
            //SimulationEngine.OverallResults.CombineJsonResultFiles(simRuns[0].jsonResultsPaths, simRuns[i].jsonResultsPaths, simRuns[0].jsonResultsPaths);
            simRuns[0].AddOtherBatchResults(simRuns[i]);
            if (cbClearTemps.Checked)
              simRuns[i].ClearTempThreadData();

          }
          _running = false;

          //update the screen
          InvokeUIUpdate(ErrorAndVisUpdateDelegate);
          simRuns[0].WriteFinalResults(true, threadCnt);
          if (cbClearTemps.Checked)
            simRuns[0].ClearTempThreadData();
        });


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
        if (OpenModel(openModel.FileName))
          AddRecentlyOpenedFileToSettings();
      }
    }

    private bool OpenModel(string path)
    {
      Cursor saveCurs = Cursor.Current;
      Cursor.Current = Cursors.WaitCursor;

      this.Text = "EMRALD (" + path + ");";

      string errorStr = "";
      //clear the existing model
      _sim = null;
      teModel.Text = LoadLib.LoadModel(ref _sim, path, ref errorStr);
      _modelPath = path;
      if (errorStr != "")
      {
        txtMStatus.ForeColor = Color.Maroon;
        txtMStatus.Text = errorStr;
        Console.Write(errorStr);
        return false;
      }
      else
      {
        ValidateModelAndUpdateUI();
      }

      Cursor.Current = saveCurs;
      ResetResults();
      return true;
    }

    private void SaveUISettingsToJson()
    {
      if (!_populatingSettings && (_currentModelSettings != null))
      {
        _currentModelSettings.RunCount = tbRunCnt.Text;
        _currentModelSettings.MaxRunTime = tbMaxSimTime.Text;
        _currentModelSettings.BasicResultsLocation = tbSavePath.Text;
        _currentModelSettings.PathResultsLocation = tbSavePath2.Text;
        _currentModelSettings.Seed = tbSeed.Text;
        _currentModelSettings.DebugFromRun = tbLogRunStart.Text;
        _currentModelSettings.DebugToRun = tbLogRunEnd.Text;

        _currentModelSettings.CheckedVars.Clear();
        _currentModelSettings.Threads = tbThreads.Text;
        foreach (var item in lbMonitorVars.CheckedItems)
        {
          _currentModelSettings.CheckedVars.Add(item.ToString());
        }

        if (chkLog.Checked)
        {
          if (ConfigData.debugLev == LogLevel.Info)
          {
            _currentModelSettings.DebugLevel = "Basic";
          }
          else
          {
            _currentModelSettings.DebugLevel = "Detailed";
          }
        }
        SaveUISettings();
      }
    }

    private void SaveUISettings()
    {
      File.WriteAllText("UISettings.json", JsonConvert.SerializeObject(_optionsAccessor.Value, Formatting.Indented));
    }

    private void PopulateSettingsFromJson()
    {
      _populatingSettings = true;
      tbRunCnt.Text = _currentModelSettings.RunCount.ToString();
      tbMaxSimTime.Text = _currentModelSettings.MaxRunTime.ToString();
      tbSavePath.Text = _currentModelSettings.BasicResultsLocation;
      tbSavePath2.Text = _currentModelSettings.PathResultsLocation;
      tbSeed.Text = _currentModelSettings.Seed;
      LoadLib.SetSeed(tbSeed.Text);
      LoadLib.SetThreads(_currentModelSettings.Threads);
      tbLogRunStart.Text = _currentModelSettings.DebugFromRun.ToString();
      tbLogRunEnd.Text = _currentModelSettings.DebugToRun.ToString();
      
      tbThreads.Text = _currentModelSettings.Threads;
      if ((_currentModelSettings.Threads != "") && (_currentModelSettings.Threads != "1"))
        cbMultiThreaded.Checked = true;

      if ((_currentModelSettings.DebugLevel == "Basic") && (!cbMultiThreaded.Checked))
      {
        chkLog.Checked = true;
        ConfigData.debugLev = LogLevel.Info;
      }
      else if ((_currentModelSettings.DebugLevel == "Detailed") && (!cbMultiThreaded.Checked))
      {
        chkLog.Checked = true;
        rbDebugBasic.Checked = false;
        rbDebugDetailed.Checked = true;
        ConfigData.debugLev = LogLevel.Debug;
      }
      else
      {
        chkLog.Checked = false;
        rbDebugBasic.Checked = false;
        rbDebugDetailed.Checked = false;
        ConfigData.debugLev = LogLevel.Off;
      }

      for (int i = 0; i < lbMonitorVars.Items.Count; i++)
      {
        // Check if the item text is in the itemsToCheck list
        if (_currentModelSettings.CheckedVars.Contains(lbMonitorVars.Items[i].ToString()))
        {
          // If it is, set the item as checked
          lbMonitorVars.SetItemChecked(i, true);
        }
      }
      

      SetCurThreadCB();

      _populatingSettings = false;

    }

    private void btnValidateModel_Click(object sender, EventArgs e)
    {
      Cursor saveCurs = Cursor.Current;
      Cursor.Current = Cursors.WaitCursor;
      //clear the current model
      _sim = null;
      ValidateModelAndUpdateUI();
      Cursor.Current = saveCurs;
    }

    private void ValidateModelAndUpdateUI()
    {
      txtMStatus.Text = LoadLib.ValidateModel(ref _sim, teModel.Text, _modelPath);
      _validSim = txtMStatus.Text == "";
      if (txtMStatus.Text != "")
      {
        txtMStatus.ForeColor = Color.Maroon;
        Console.Write(txtMStatus.Text);
      }
      else
      {
        txtMStatus.Text = "Model Loaded Successfully";
        txtMStatus.ForeColor = Color.Green;
        Console.Write(txtMStatus.Text);

        if (_sim.updated)
        {
          DialogResult result = MessageBox.Show("Model was converted to the latest version, save?", "Save Changes", MessageBoxButtons.YesNoCancel, MessageBoxIcon.Question);

          if (result == DialogResult.Yes)
          {
            saveStripMenuItem_Click(null, null);
          }
        }
      }

      InitSimTabInfo();
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
        foreach (SimVariable v in _sim.allVariables.Values)
        {
          if (v.canMonitorSim)
          {
            int idx = lbMonitorVars.Items.Add(v.name);
            bool chk = v.monitorInSim;
            lbMonitorVars.SetItemChecked(idx, chk);
          }
        }
      }
    }

    private void DispResults(TimeSpan runTime, int runCnt, bool logFailedComps, int? threadNum)
    {
      MethodInvoker methodInvokerDelegate = delegate ()
      {
        int curT = 0;
        if (_running && cbMultiThreaded.Checked)
          curT = cbCurThread.SelectedIndex;

        if ((threadNum == null) || (curT == (int)threadNum)) //only update for specified thread or if there is none specified
        {

          lbl_ResultHeader.Text = _sim.name + " " + runCnt.ToString() + " of " + tbRunCnt.Text + " runs.";// Time - " + runTime.ToString();
          lblRunTime.Text = runTime.ToString("g");
          lvResults.Items.Clear();

          var keyPaths = simRuns[curT].keyPaths.ToList(); // Create a separate list of the keys because multithreading can cause a change while in loop
          foreach (var item in keyPaths)
          {

            //  foreach (var item in simRuns[curT].keyPaths)
            //{
            string[] lvCols = new string[4];
            lvCols[0] = item.Key;
            lvCols[1] = item.Value.count.ToString();
            lvCols[2] = (item.Value.count / (double)runCnt).ToString();
            lvCols[3] = item.Value.timeMean.ToString(@"dd\.hh\:mm\:ss") + " +/- " + item.Value.timeStdDeviation.ToString(@"dd\.hh\:mm\:ss");
            lvResults.Items.Add(new ListViewItem(lvCols));

            //write the failed components and times.
            if (simRuns[curT].keyFailedItems.ContainsKey(item.Key))
            {
              var compFailSets = simRuns[curT].keyFailedItems[item.Key].compFailSets.ToList(); //make a copy as could be modified in loop when multi threading
                                                                                               //foreach (var cs in simRuns[curT].keyFailedItems[item.Key].compFailSets)
              foreach (var cs in compFailSets)
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
                lvResults.Items.Add(new ListViewItem(lvCols));
              }
            }

          }


          lvVarValues.Items.Clear();
          List<string> values = simRuns[curT].GetVarValues(simRuns[curT].logVarVals);
          int i = 0;
          foreach (var simVar in simRuns[curT].logVarVals)
          {
            string[] lvCols = new string[2];
            lvCols[0] = simVar;
            lvCols[1] = values[i];
            lvVarValues.Items.Add(new ListViewItem(lvCols));
            ++i;
          }

          this.Refresh();
          Application.DoEvents();
        }

        //if (tbSavePath.Text != "")
        //{
        //  simRuns[curT].LogResults(runTime, runCnt, logFailedComps);
        //}

      };

      InvokeUIUpdate(methodInvokerDelegate);
    }

    private void btn_Stop_Click(object sender, EventArgs e)
    {
      int curT = 0;
      if (cbMultiThreaded.Checked)
        curT = cbCurThread.SelectedIndex;

      simRuns[curT].StopSims();
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

      if (lbExtSimLinks.SelectedIndex > -1)
      {
        lbExtSimLinks.SetItemCheckState(lbExtSimLinks.SelectedIndex, ck);
      }
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

    private void button4_Click(object sender, EventArgs e)
    {
      string tempLoc = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + @"\\EMRALD_SANKEY\\";
      System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo(Path.Combine(tempLoc, @"emrald-sankey-timeline.html")) { UseShellExecute = true });
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

      SaveUISettingsToJson();
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
      SaveUISettingsToJson();
    }

    private void tbSeed_Leave(object sender, EventArgs e)
    {
      if (!LoadLib.SetSeed(tbSeed.Text))
      {
        MessageBox.Show("Invalid Seed, must be a number");
        tbSeed.Text = "";
      }
      else
      {
        SaveUISettingsToJson();
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
      SaveUISettingsToJson();
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
      SaveUISettingsToJson();
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
      else
      {
        SaveUISettingsToJson();
      }
    }

    private void Leave_SaveSettings(object sender, System.EventArgs e)
    {
      SaveUISettingsToJson();
    }

    private void teModel_TextChanged(object sender, EventArgs e)
    {
      _validSim = false;
      txtMStatus.Text = "";
    }

    private void saveStripMenuItem_Click(object sender, EventArgs e)
    {
      sdSaveModel.FileName = _modelPath;
      if (File.Exists(_modelPath))
      {
        try
        {
          bool extUpdate = false;
          if (Path.GetExtension(_modelPath) == ".json")
          {
            DialogResult result = MessageBox.Show("Update to .emrald extension?", "New Extension", MessageBoxButtons.YesNoCancel, MessageBoxIcon.Question);

            extUpdate = result == DialogResult.Yes;
          }

          File.Delete(_modelPath);
          if (extUpdate)
            _modelPath = Path.ChangeExtension(_modelPath, ".emrald");
          File.WriteAllText(_modelPath, teModel.Text);
        }
        catch
        {
          txtMStatus.ForeColor = Color.Maroon;
          txtMStatus.Text = "Failed to save model";
          Console.Write("Failed to save model");
          return;
        }
      }
      else
      {
        sdSaveModel.ShowDialog();
      }
    }

    private void sdSaveModel_FileOk(object sender, CancelEventArgs e)
    {
      string saveLoc = sdSaveModel.FileName;
      try
      {
        if (File.Exists(saveLoc))
        {
          txtMStatus.ForeColor = Color.Maroon;
          txtMStatus.Text = "Failed to save, File Already Exists";
          Console.Write("Failed to save, File Already Exists");
        }

        File.Delete(saveLoc);
        File.WriteAllText(saveLoc, teModel.Text);
        _modelPath = saveLoc;
      }
      catch
      {
        txtMStatus.ForeColor = Color.Maroon;
        txtMStatus.Text = "Failed to save model";
        Console.Write("Failed to save model");
        return;
      }
    }

    private void toolStripMenuItem1_Click(object sender, EventArgs e)
    {
      sdSaveModel.FileName = _modelPath;
      sdSaveModel.ShowDialog();
    }

    private void lbMonitorVars_Leave(object sender, EventArgs e)
    {
      SaveUISettingsToJson();
    }
    private void btn_DebugOpen_Click(object sender, EventArgs e)
    {
      string appDirectory = Application.StartupPath;
      string filePath = Path.Combine(appDirectory, "debugLog.txt");

      try
      {
        // Open the file in the default text viewer
        Process.Start(new ProcessStartInfo(filePath) { UseShellExecute = true });
      }
      catch (Exception ex)
      {
        // Handle any errors that may occur
        MessageBox.Show($"An error occurred while trying to open the file: {ex.Message}");
      }
    }

    private void cbMultiThreaded_CheckedChanged(object sender, EventArgs e)
    {
      Cursor.Current = Cursors.WaitCursor;
      try
      {
        if (_sim == null)
        {
          MessageBox.Show("You must load a model before enabling multi-threaded mode.", "No Model Loaded", MessageBoxButtons.OK, MessageBoxIcon.Warning);
          cbMultiThreaded.Checked = false;
          return;
        }

        if (_sim.multiThreadInfo == null)
          _sim.multiThreadInfo = new MultiThreadInfo();

        if (cbMultiThreaded.Checked == false)
        {
          tbThreads.Text = "0"; //0 indicates no threading, 1 will copy the model and run in a seperate thread as if multithreading but still just one thread.
        }
        else
        {
          tbSeed.Text = "";

          if ((tbThreads.Text == "") || (tbThreads.Text == "0"))
          {
            //figure out recommended thread number
            int recommendedThreads = 1;
            // Get total number of logical processors
            int totalProcessors = Environment.ProcessorCount;

            // Use PerformanceCounter to get current CPU usage
            PerformanceCounter cpuCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total");

            // Allow the counter to stabilize by waiting a bit
            Thread.Sleep(100);

            // Get the current CPU usage
            float currentCpuUsage = cpuCounter.NextValue();

            // Calculate the recommended number of threads
            recommendedThreads = (int)((1 - currentCpuUsage) * totalProcessors);

            // Ensure at least one thread is recommended
            recommendedThreads = Math.Max(recommendedThreads, 1);

            //don't use more than 75% of the threads by default
            tbThreads.Text = Math.Min(recommendedThreads, (int)(totalProcessors * 0.75)).ToString();
          }


          // Always get issues (if any) for highlighting, but always show the editor form 
          List<string> issueItems = _sim.CanMutiThread();
          if (issueItems.Count > 0)
          {
            using (var frm = new FormMultiThreadRefs(_sim.multiThreadInfo, issueItems))
            {
              var result = frm.ShowDialog();
              if (result == DialogResult.OK)
              {
                _sim.multiThreadInfo = frm.EditedMultiThreadInfo;
                teModel.Text = _sim.modelTxt;
                //save the multithread stuff.
                saveStripMenuItem_Click(sender, e);
              }
              else
              {
                // User cancelled, revert checkbox and exit
                cbMultiThreaded.Checked = false;
                return;
              }
            }
          }
          else //save the empty multiThreadInfo
          {
            _sim.multiThreadInfo = new MultiThreadInfo();
            teModel.Text = _sim.modelTxt;
            saveStripMenuItem_Click(sender, e);
          }
        }

        tbThreads.Visible = cbMultiThreaded.Checked;
        lblThreads.Visible = cbMultiThreaded.Checked;
        cbClearTemps.Visible = cbMultiThreaded.Checked;
        chkLog.Checked = !cbMultiThreaded.Checked;
        chkLog.Enabled = !cbMultiThreaded.Checked;
        tbSeed.Enabled = !cbMultiThreaded.Checked;
        lbl_CurThread.Visible = cbMultiThreaded.Checked && (!_running);
        cbCurThread.Visible = cbMultiThreaded.Checked;
        bttnPathRefs.Visible = cbMultiThreaded.Checked;

        SetCurThreadCB();
      }
      finally
      {
        // Change cursor back to default
        Cursor.Current = Cursors.Default;
      }
    }

    private void SetCurThreadCB()
    {
      cbCurThread.Items.Clear();
      for (int i = 0; i < ConfigData.threads; i++)
        cbCurThread.Items.Add($"{i}");
      if (cbMultiThreaded.Checked && (ConfigData.threads > 0))
        cbCurThread.SelectedIndex = ((int)ConfigData.threads) - 1;
    }

    private void tbThreads_Leave(object sender, EventArgs e)
    {
      {
        if (!LoadLib.SetThreads(tbThreads.Text))
        {
          MessageBox.Show("Invalid Thread Cnt, must be a number");
          tbSeed.Text = "1";
        }
        else
        {
          SetCurThreadCB();
          SaveUISettingsToJson();
        }
      }
    }

    private void bttnPathRefs_Click(object sender, EventArgs e)
    {
      if (_sim == null)
      {
        MessageBox.Show("You must load a model before editing multi-thread variable references.", "No Model Loaded", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        return;
      }

      // Ensure multiThreadInfo is initialized
      if (_sim.multiThreadInfo == null)
        _sim.multiThreadInfo = new MultiThreadInfo();

      // Get issues (if any) for multi-threading.
      List<string> issueItems = _sim.CanMutiThread();

      // Always show the form, regardless of issue count
      using (var frm = new FormMultiThreadRefs(_sim.multiThreadInfo, issueItems))
      {
        var result = frm.ShowDialog();
        if (result == DialogResult.OK)
        {
          _sim.multiThreadInfo = frm.EditedMultiThreadInfo;
          teModel.Text = _sim.modelTxt;
          //save the multithread stuff.
          saveStripMenuItem_Click(sender, e);
        }
        else
        {
          // User cancelled, do not update anything or throw
          // (Optional: add code here if you want to revert UI or warn the user)
        }
      }
    }
  }
}
