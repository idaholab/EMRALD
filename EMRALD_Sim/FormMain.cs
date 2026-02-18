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
  public partial class FormMain : Form, IMessageDispHandling
  {
    private readonly IAppSettingsService _appSettingsService;
    private readonly IOptions<UISettings> _optionsAccessor;
    private ISimMessaging _server = null;
    private EmraldModel _sim = null;
    private bool _validSim = false;
    private string _modelPath = "";
    private string curDir = "c:\\temp";
    private ModelSettings _currentModelSettings = null;
    private bool _populatingSettings = false;
    private bool _running = false;
    private string _lastError = "";
    private JSONRun _jsonRunner = null;
    private CancellationTokenSource _cancellationTokenSource = null;
    private List<string> _monitorVarsFromArgs = new List<string>();
    private int _pathResultsInterval = -1;

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

#if DEBUG
      ConsoleHelper.Show();
#endif

      curDir = System.IO.Path.GetDirectoryName(Application.ExecutablePath);

      if (args.Length > 0)
      {
        if (args[0] == "//")
          return;
        AttachConsole(ATTACH_PARENT_PROCESS);
      }

      bool execute = false;
      string model = null;

      if (args.Length > 0)
      {
        string argument = args[0].ToLower();
        bool isJSON = false;
        try
        {
          isJSON = Path.GetExtension(argument).Equals(".json", StringComparison.OrdinalIgnoreCase);
        }
        catch { }

        if (isJSON)
        {
          OptionsRunWithNotify(args[0]);
        }
        else
        {
          execute = LoadFromArgs(args, out model);
        }
      }

      if (model != null)
      {
        if (OpenModel(model))
        {
          tcMain.SelectedTab = tabSimulate;

          // Apply monitor variables from command-line args
          if (_monitorVarsFromArgs.Count > 0)
          {
            for (int idx = 0; idx < lbMonitorVars.Items.Count; idx++)
            {
              if (_monitorVarsFromArgs.Contains(lbMonitorVars.Items[idx].ToString()))
              {
                lbMonitorVars.SetItemChecked(idx, true);
              }
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
    /// <param name="modelPath">Output parameter for model path</param>
    /// <returns>return if to execute the model</returns>
    private bool LoadFromArgs(string[] args, out string modelPath)
    {
      _populatingSettings = true;
      bool execute = false;
      modelPath = null;
      List<string> monitor = new List<string>();
      int pathResultsInterval = -1;

      for (int i = 0; i < args.Length; i++)
      {
        string argument = args[i].ToLower();
        switch (argument)
        {
          case "-n":
            tbRunCnt.Text = args[i + 1];
            ++i;
            break;

          case "-i":
            string filePath = args[i + 1];
            if (!File.Exists(filePath))
            {
              Console.Write("invalid input file path - " + filePath);
              return false;
            }
            else
            {
              modelPath = filePath;
            }
            ++i;
            break;

          case "-r":
            tbSavePath.Text = args[i + 1];
            ++i;
            break;

          case "-o":
            tbSavePath2.Text = args[i + 1];
            ++i;
            break;

          case "-t":
            tbMaxSimTime.Text = args[i + 1];
            ++i;
            break;

          case "-e":
            execute = true;
            break;

          case "-m":
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

          case "-s":
            if (LoadLib.SetSeed(args[i + 1]))
              tbSeed.Text = args[i + 1];
            ++i;
            break;

          case "-rintrv":
            try
            {
              pathResultsInterval = int.Parse(args[i + 1]);
            }
            catch
            {
              Console.WriteLine("-rIntrv option must be a valid integer number");
            }
            ++i;
            break;

          case "-mergeresults":
            if (args.Length < (i + 4))
            {
              Console.Write("Invalid option, must have two result file paths and a destination file path after -mergeresults.");
              return false;
            }
            string mergePath1 = args[i + 1];
            string mergePath2 = args[i + 2];
            string resPath = args[i + 3];

            try
            {
              if (SimulationEngine.OverallResults.CombineJsonResultFiles(mergePath1, mergePath2, resPath) == "")
              {
                Console.Write("Failed to load files, must have two valid file paths after -mergeresults.");
                return false;
              }
              Console.WriteLine("Successfully merged results to: " + resPath);
              Environment.Exit(0);
            }
            catch
            {
              Console.Write("Failed to merge result files, verify they are valid EMRALD path result JSON files.");
              Environment.Exit(1);
            }
            break;

          case "-d":
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

            if (i + 1 < args.Length && args[i + 1][0] == '[')
            {
              string arg = args[i + 1];
              try
              {
                arg = arg.TrimStart('[');
                if (arg.EndsWith(","))
                  arg = arg.TrimEnd(',');
                ConfigData.debugRunStart = int.Parse(arg);
                tbLogRunStart.Text = arg;
                ++i;

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
            }
            break;

          case "-help":
          case "-h":
          case "-H":
          case "-HELP":
            ShowHelpAndExit();
            break;
        }
      }

      // Store values for later use after model is loaded
      if (monitor.Count > 0)
      {
        // Store monitor list to apply after model loads
        _monitorVarsFromArgs = monitor;
      }

      if (pathResultsInterval > 0)
      {
        _pathResultsInterval = pathResultsInterval;
      }

      _populatingSettings = false;
      return execute;
    }

    private void ShowHelpAndExit()
    {
      Console.WriteLine("Pass in a Options JSON file or use the following command line options.");
      Console.WriteLine("-n \"run count\"");
      Console.WriteLine("-i \"input model path\"");
      Console.WriteLine("-r \"results output file\"");
      Console.WriteLine("-o \"paths output file\"");
      Console.WriteLine("-t \"max run time\"");
      Console.WriteLine("-e \"execute\"");
      Console.WriteLine("-m \"parameter to monitor, use []'s to do multiples, example - [x y z] \"");
      Console.WriteLine("-s \"initial random number seed\"");
      Console.WriteLine("-d \"debug level \"basic\" or \"detailed\", (optional) range [start end].");
      Console.WriteLine("    Basic - state movement only. Detailed - state movement, actions and events.");
      Console.WriteLine("    Example: -d basic [10 20]");
      Console.WriteLine("-rIntrv \"how often to save the path results, every X number of runs. No value or <1 will result in saving only after all runs are complete.\"");
      Console.WriteLine("-mergeResults \"merge two json path result files into one. Estimates the 5th and 95th. Example: -mergeResults c:/temp/PathResultsBatch1.json c:/temp/PathResultsBatch2.json c:/temp/PathResultsCombined.json\"");
      Console.WriteLine("Options JSON file - ");
      Console.WriteLine(Options_cur.CmdJSON_OptionsExample);
      Environment.Exit(0);
    }

    private void OptionsRunWithNotify(string jsonPath)
    {
      if (!File.Exists(jsonPath))
      {
        Console.Write("Invalid path for JSON options load.");
        return;
      }
      string optionsJsonStr = File.ReadAllText(jsonPath);

      Form notificationForm = new Form
      {
        Text = "Processing",
        Size = new System.Drawing.Size(300, 100),
        StartPosition = FormStartPosition.CenterScreen
      };

      Label label = new Label
      {
        Text = "Processing, please wait...",
        AutoSize = true,
        TextAlign = System.Drawing.ContentAlignment.MiddleCenter,
        Dock = DockStyle.Fill
      };
      notificationForm.Controls.Add(label);

      Task.Run(() =>
      {
        notificationForm.ShowDialog();
      });

      Task.Run(() =>
      {
        OptionsRun(optionsJsonStr);
        notificationForm.Invoke(new System.Action(() => notificationForm.Close()));
        Environment.Exit(0);
      });
    }

    private async void OptionsRun(string optionsJsonStr)
    {
      JSONRun simRun = new JSONRun(optionsJsonStr);
      if (simRun.error != "")
      {
        Console.Write(simRun.error);
      }
      else
      {
        string res = await simRun.RunSim();
        if (res != "")
        {
          Console.Write($"Failed to load from JSON options: {res}");
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
        listBoxClients.Items.Clear();
        cbRegisteredClients.Items.Clear();
        AssignServer();
        List<string> resources = _server.GetResources();
        foreach (string item in resources)
        {
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

    private void FormMain_FormClosed(object sender, FormClosedEventArgs e)
    {
      _cancellationTokenSource?.Cancel();
      Environment.Exit(0);
    }

    private void btnGenMsg_Click(object sender, EventArgs e)
    {
      TimeSpan time = TimeSpan.FromSeconds(0);
      try { time = TimeSpan.Parse(lblSimTime.Text); } catch { }

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

      switch ((SimActionType)cbMsgType.SelectedIndex)
      {
        case SimActionType.atCompModify:
          msgObj.simAction = new SimAction(SimActionType.atCompModify, actTime, new ItemData(tbItemDataName.Text, tbItemDataValue.Text));
          break;

        case SimActionType.atOpenSim:
          TimeSpan endTime = TimeSpan.FromSeconds(0);
          try { endTime = TimeSpan.Parse(tbEndTime.Text); } catch { }
          msgObj.simAction = new SimAction(new SimInfo(tbModelRef.Text, endTime, tbConfigData.Text, Convert.ToInt32(tbSeed), 1, 1), actTime);
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

        if (_optionsAccessor.Value.SettingsByModel.Count == 10)
        {
          _optionsAccessor.Value.SettingsByModel.RemoveLast();
          recentToolStripMenuItem.DropDownItems.RemoveAt(recentToolStripMenuItem.DropDownItems.Count - 1);
        }

        _optionsAccessor.Value.SettingsByModel.AddFirst(_currentModelSettings);

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
              if (!_server.SendMessage(msg, (string)cbRegisteredClients.Items[cbRegisteredClients.SelectedIndex]))
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

    private void SetRunningVis()
    {
      btnStartSims.Enabled = !_running;
      btn_Stop.Enabled = _running;
      lbl_CurThread.Visible = cbMultiThreaded.Checked && _running;
      cbCurThread.Visible = cbMultiThreaded.Checked && _running;
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
      _lastError = "";

      try
      {
        _running = true;
        SetRunningVis();

        if (chkLog.Checked && ((int.Parse(tbLogRunStart.Text) - int.Parse(tbLogRunEnd.Text)) > 100))
        {
          DialogResult res = MessageBox.Show("Are you sure you want to debug that many runs?", "Debug Warning", MessageBoxButtons.YesNo, MessageBoxIcon.Warning);
          if (res == DialogResult.No)
          {
            _running = false;
            SetRunningVis();
            return;
          }
        }

        // Validate max time
        TimeSpan maxTime;
        try
        {
          maxTime = TimeSpan.Parse(tbMaxSimTime.Text);
        }
        catch
        {
          MessageBox.Show("Invalid Max Simulation Time, please fix.");
          _running = false;
          SetRunningVis();
          return;
        }

        lblRunTime.Visible = true;
        lbl_ResultHeader.Visible = true;

        // Create Options_cur from UI settings
        Options_cur options = CreateOptionsFromUI();

        // Read model JSON
        string modelJson = teModel.Text;

        // Create JSONRun instance
        _jsonRunner = new JSONRun(options, modelJson, UIProgressCallback);

        // Create cancellation token
        _cancellationTokenSource = new CancellationTokenSource();

        // Run simulation asynchronously
        Task.Run(async () =>  // Add async here
        {
          string result = await _jsonRunner.RunSim();  // Add await here

          InvokeUIUpdate(() =>
          {
            _running = false;
            SetRunningVis();

            if (result != "")
            {
              _lastError = result;
              lbl_ResultHeader.Text = _lastError;
              MessageBox.Show(_lastError, "Simulation Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            else
            {
              lbl_ResultHeader.Text = "Simulation completed successfully";

              // Clear temp thread files if checkbox is checked and multi-threaded
              if (cbClearTemps.Checked && cbMultiThreaded.Checked && _jsonRunner.simRuns.Count > 0)
              {
                // Clear temp files for all threads
                foreach (var simRun in _jsonRunner.simRuns)
                {
                  simRun.ClearTempThreadData();
                }
              }
            }
          });
        }, _cancellationTokenSource.Token);
      }
      catch (Exception err)
      {
        _running = false;
        SetRunningVis();
        MessageBox.Show($"Error starting simulation: {err.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
      }
    }

    private Options_cur CreateOptionsFromUI()
    {
      Options_cur options = new Options_cur();

      // Basic settings
      options.runct = int.Parse(tbRunCnt.Text);
      options.runtime = tbMaxSimTime.Text;
      options.inpfile = _modelPath;
      options.resout = tbSavePath.Text;
      options.jsonRes = tbSavePath2.Text;

      // Path results interval
      options.pathResultsInterval = _pathResultsInterval;

      // Seed
      if (!string.IsNullOrEmpty(tbSeed.Text))
      {
        options.seed = int.Parse(tbSeed.Text);
      }

      // Thread settings
      if (cbMultiThreaded.Checked && !string.IsNullOrEmpty(tbThreads.Text))
      {
        options.threads = int.Parse(tbThreads.Text);
      }
      else
      {
        options.threads = 0; // Single threaded
      }

      // Debug settings
      if (chkLog.Checked)
      {
        if (rbDebugDetailed.Checked)
          options.debug = "DETAILED";
        else
          options.debug = "BASIC";

        options.debugStartIdx = int.Parse(tbLogRunStart.Text);
        options.debugEndIdx = int.Parse(tbLogRunEnd.Text);
      }
      else
      {
        options.debug = "OFF";
      }

      // Variables to monitor
      options.variables = new List<string>();
      foreach (var item in lbMonitorVars.CheckedItems)
      {
        options.variables.Add(item.ToString());
      }

      // Initialize variable values (if any)
      options.initVars = new List<VarInitValue>();

      return options;
    }

    private void UIProgressCallback(TimeSpan runTime, int runCnt, bool logFailedComps, int? threadNum)
    {
      InvokeUIUpdate(() =>
      {
        DispResults(runTime, runCnt, logFailedComps, threadNum);
      });
    }

    private void DispResults(TimeSpan runTime, int runCnt, bool logFailedComps, int? threadNum)
    {
      int curT = 0;
      if (_running && cbMultiThreaded.Checked && cbCurThread.Visible)
        curT = cbCurThread.SelectedIndex;

      if ((_lastError == "") && ((threadNum == null) || (curT == (int)threadNum))) //only update for specified thread or if there is none specified
      {
        lbl_ResultHeader.Text = _sim.name + " " + runCnt.ToString() + " of " + tbRunCnt.Text + " runs.";
        lblRunTime.Text = runTime.ToString("g");
        lvResults.Items.Clear();

        // Get the simRuns from JSONRun
        if (_jsonRunner != null && _jsonRunner.simRuns.Count > 0)
        {
          var keyPaths = _jsonRunner.simRuns[curT].keyPaths.ToList(); // Create a separate list of the keys because multithreading can cause a change while in loop
          foreach (var item in keyPaths)
          {
            string[] lvCols = new string[4];
            lvCols[0] = item.Key;
            lvCols[1] = item.Value.count.ToString();
            lvCols[2] = (item.Value.count / (double)runCnt).ToString();
            lvCols[3] = item.Value.timeMean.ToString(@"dd\.hh\:mm\:ss") + " +/- " + item.Value.timeStdDeviation.ToString(@"dd\.hh\:mm\:ss");
            lvResults.Items.Add(new ListViewItem(lvCols));

            //write the failed components and times.
            if (_jsonRunner.simRuns[curT].keyFailedItems.ContainsKey(item.Key))
            {
              var compFailSets = _jsonRunner.simRuns[curT].keyFailedItems[item.Key].compFailSets.ToList(); //make a copy as could be modified in loop when multi threading
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
          List<string> values = _jsonRunner.simRuns[curT].GetVarValues(_jsonRunner.simRuns[curT].logVarVals);
          int i = 0;
          foreach (var simVar in _jsonRunner.simRuns[curT].logVarVals)
          {
            string[] lvCols = new string[2];
            lvCols[0] = simVar;
            lvCols[1] = values[i];
            lvVarValues.Items.Add(new ListViewItem(lvCols));
            ++i;
          }
        }

        this.Refresh();
        Application.DoEvents();
      }
    }

    private void UpdateResultsDisplay(int runCnt)
    {
      // This method is no longer needed as DispResults handles everything
      // Kept for compatibility but does nothing
    }

    private void btn_Stop_Click(object sender, EventArgs e)
    {
      if (_jsonRunner != null)
      {
        _jsonRunner.StopSims();
      }

      _cancellationTokenSource?.Cancel();
      _running = false;
      SetRunningVis();
      lbl_ResultHeader.Text = "Simulation stopped by user";
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

      this.Text = "EMRALD (" + path + ")";

      string errorStr = "";
      _sim = null;
      teModel.Text = LoadLib.LoadModel(ref _sim, path, ref errorStr);
      _modelPath = path;

      if (errorStr != "")
      {
        txtMStatus.ForeColor = Color.Maroon;
        txtMStatus.Text = errorStr;
        Console.Write(errorStr);
        Cursor.Current = saveCurs;
        _validSim = false;
        return false;
      }
      else
      {
        ValidateModelAndUpdateUI();
      }

      Cursor.Current = saveCurs;
      ResetResults();
      return _validSim;
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
      if (!string.IsNullOrEmpty(_currentModelSettings.Threads) &&
          int.TryParse(_currentModelSettings.Threads, out int threadCount) &&
          threadCount > 0)
      {
        cbMultiThreaded.Checked = true;
      }

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
        if (_currentModelSettings.CheckedVars.Contains(lbMonitorVars.Items[i].ToString()))
        {
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
      _sim = null;
      ValidateModelAndUpdateUI();
      Cursor.Current = saveCurs;
    }

    private void ValidateModelAndUpdateUI()
    {
      string validationError = LoadLib.ValidateModel(ref _sim, teModel.Text, _modelPath);
      _validSim = validationError == "";

      if (validationError != "")
      {
        txtMStatus.ForeColor = Color.Maroon;
        txtMStatus.Text = validationError;
        Console.Write(validationError);
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

      lbExtSimLinks.Items.Clear();
      if (_validSim)
      {
        foreach (var sim in _sim.allExtSims)
        {
          int idx = lbExtSimLinks.Items.Add(sim.Value.name);
          AssignServer();
          if (_server != null)
          {
            bool chk = sim.Value.resourceName == "" ? false : _server.HasResource(sim.Value.resourceName);
            lbExtSimLinks.SetItemChecked(idx, chk);
          }
        }
      }

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

    private void lbExtSimLinks_Click(object sender, EventArgs e)
    {
      CheckState ck = CheckState.Unchecked;
      AssignServer();
      var f = new FormSelExtSim(_server.GetResources());
      if (f.ShowDialog(this) == DialogResult.OK && lbExtSimLinks.SelectedItem != null)
      {
        if (f.resourceName != "")
        {
          var extSimLink = _sim.allExtSims.FindByName(lbExtSimLinks.SelectedItem.ToString());
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

    private void button1_Click_1(object sender, EventArgs e)
    {
      // Test button - currently not used
    }

    private void button4_Click(object sender, EventArgs e)
    {
      string tempLoc = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + @"\\EMRALD_SANKEY\\";
      System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo(Path.Combine(tempLoc, @"emrald-sankey-timeline.html")) { UseShellExecute = true });
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
        _server = new EMRALDMsgServer("secret", _appSettingsService);
        _server.SetUICallbacks(this);
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
        Process.Start(new ProcessStartInfo(filePath) { UseShellExecute = true });
      }
      catch (Exception ex)
      {
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

        if (cbMultiThreaded.Checked == false)
        {
          tbThreads.Text = "0";
        }
        else
        {
          tbSeed.Text = "";

          if ((tbThreads.Text == "") || (tbThreads.Text == "0"))
          {
            int recommendedThreads = 1;
            int totalProcessors = Environment.ProcessorCount;

            PerformanceCounter cpuCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total");
            Thread.Sleep(100);
            float currentCpuUsage = cpuCounter.NextValue();
            recommendedThreads = (int)((1 - currentCpuUsage) * totalProcessors);
            recommendedThreads = Math.Max(recommendedThreads, 1);

            tbThreads.Text = Math.Min(recommendedThreads, (int)(totalProcessors * 0.75)).ToString();
          }

          List<string> issueItems = _sim.CanMutiThread();
          if (issueItems.Count > 0)
          {
            using (var frm = new FormMultiThreadRefs(_sim.multiThreadInfo, issueItems, _sim.rootPath))
            {
              var result = frm.ShowDialog();
              if (result == DialogResult.OK)
              {
                _sim.SetMultiThreadInfo(frm.EditedMultiThreadInfo);
                teModel.Text = _sim.modelTxt;
                saveStripMenuItem_Click(sender, e);
              }
              else
              {
                cbMultiThreaded.Checked = false;
                return;
              }
            }
          }
          else
          {
            if (_sim.multiThreadInfo == null)
              _sim.SetMultiThreadInfo(new MultiThreadInfo());
            teModel.Text = _sim.modelTxt;
            saveStripMenuItem_Click(sender, e);
          }

          chkLog.Checked = false;
          chkLog.Enabled = false;
          tbSeed.Enabled = false;
        }

        tbThreads.Visible = cbMultiThreaded.Checked;
        lblThreads.Visible = cbMultiThreaded.Checked;
        cbClearTemps.Visible = cbMultiThreaded.Checked;
        lbl_CurThread.Visible = cbMultiThreaded.Checked && (!_running);
        cbCurThread.Visible = cbMultiThreaded.Checked;
        bttnPathRefs.Visible = cbMultiThreaded.Checked;

        LoadLib.SetThreads(tbThreads.Text);
        SetCurThreadCB();
      }
      finally
      {
        Cursor.Current = Cursors.Default;
      }
    }

    private void SetCurThreadCB()
    {
      cbCurThread.Items.Clear();
      if (cbMultiThreaded.Checked && !string.IsNullOrEmpty(tbThreads.Text))
      {
        int threadCount = 0;
        if (int.TryParse(tbThreads.Text, out threadCount) && threadCount > 0)
        {
          for (int i = 0; i < threadCount; i++)
            cbCurThread.Items.Add($"{i}");

          if (cbCurThread.Items.Count > 0)
            cbCurThread.SelectedIndex = 0;
        }
      }
    }

    private void tbThreads_Leave(object sender, EventArgs e)
    {
      if (!LoadLib.SetThreads(tbThreads.Text))
      {
        MessageBox.Show("Invalid Thread Cnt, must be a number");
        tbThreads.Text = "1";
      }
      else
      {
        SetCurThreadCB();
        SaveUISettingsToJson();
      }
    }

    private void bttnPathRefs_Click(object sender, EventArgs e)
    {
      if (_sim == null)
      {
        MessageBox.Show("You must load a model before editing multi-thread variable references.", "No Model Loaded", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        return;
      }

      List<string> issueItems = _sim.CanMutiThread();

      using (var frm = new FormMultiThreadRefs(_sim.multiThreadInfo, issueItems, _sim.rootPath))
      {
        var result = frm.ShowDialog();
        if (result == DialogResult.OK)
        {
          _sim.SetMultiThreadInfo(frm.EditedMultiThreadInfo);
          teModel.Text = _sim.modelTxt;
          saveStripMenuItem_Click(sender, e);
        }
      }
    }
  }
}