// Copyright 2026 Battelle Energy Alliance
// Main application form that provides the EMRALD simulation GUI, including model loading, run control, and results display.
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
    private bool _running = false;
    private string _lastError = "";
    private JSONRun _jsonRunner = null;
    private CancellationTokenSource _cancellationTokenSource = null;
    private int _pathResultsInterval = -1;
    private List<string> _recentFiles = new List<string>();
    private bool _skipApplyOptionsOnce = false;
    private bool _isCommandLineRun = false;
    private bool _pendingAutoRun = false; // command-line run is deferred to FormMain_Load so the window handle exists before the sim marshals UI updates
    private Options_cur _curSimOptions = new Options_cur();
    private ContextMenuStrip _monitorVarsContextMenu = null;

    [DllImport("kernel32.dll")]
    static extern bool AttachConsole(int dwProcessId);
    private const int ATTACH_PARENT_PROCESS = -1;

    // Main form constructor: wire services, process args, and open model if provided.
    public FormMain(string[] args, IAppSettingsService appSettingsService, IOptions<UISettings> optionsAccessor)
    {
      _appSettingsService = appSettingsService;
      _optionsAccessor = optionsAccessor;
      InitializeComponent();


      teModel.SetHighlighting("JSON");
      tcCouplingTypeInfo.SelectedIndex = 1;
      ResetResults();
      _curSimOptions.seed = null;
      _curSimOptions.opsVer = 1.02;
      _curSimOptions.initVars = _curSimOptions.initVars ?? new List<VarInitValue>();
      _curSimOptions.variables = _curSimOptions.variables ?? new List<string>();

#if DEBUG
      // Don't allocate a private console when launched with CLI args — it would block AttachConsole below,
      // and Console.WriteLine would write to a window that closes the instant Environment.Exit fires.
      if (args.Length == 0)
        ConsoleHelper.Show();
#endif

      curDir = System.IO.Path.GetDirectoryName(Application.ExecutablePath);
      LoadRecentFiles();
      SetupMonitorVarsContextMenu();

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
          try
          {
            _curSimOptions = JsonConvert.DeserializeObject<Options_cur>(File.ReadAllText(args[0]));
            //A relative inpfile resolves against the run directory first, then the options JSON file's location.
            _curSimOptions.inpfile = CommonFunctions.ResolveInputPath(_curSimOptions.inpfile, args[0]);
            model = _curSimOptions.inpfile;
            execute = true;
            _isCommandLineRun = true;
          }
          catch
          {
            OptionsRunWithNotify(args[0]);
          }
        }
        else
        {
          execute = LoadFromArgs(args, out model);
        }
      }

      if (model != null && OpenModel(model))
      {
        LoadCurSimOptionsFromDisk(model);
        tcMain.SelectedTab = tabSimulate;
        AddRecentFile(model);
      }

      ApplyOptionsToUI();

      // Defer the auto-run to FormMain_Load. Starting the sim here (before Application.Run
      // shows the form) means the window handle isn't created yet, so the background sim
      // thread's UI marshaling (InvokeUIUpdate) throws "Invoke or BeginInvoke cannot be
      // called on a control until the window handle has been created."
      _pendingAutoRun = execute && _validSim;
    }

    // Create right-click menu for monitor vars to select/unselect all.
    private void SetupMonitorVarsContextMenu()
    {
      _monitorVarsContextMenu = new ContextMenuStrip();
      var miSelectAll = new ToolStripMenuItem("Select All", null, (s, e) => SetAllMonitorVarsChecked(true));
      var miUnselectAll = new ToolStripMenuItem("Unselect All", null, (s, e) => SetAllMonitorVarsChecked(false));
      _monitorVarsContextMenu.Items.Add(miSelectAll);
      _monitorVarsContextMenu.Items.Add(miUnselectAll);
      lbMonitorVars.ContextMenuStrip = _monitorVarsContextMenu;
    }

    private void SetAllMonitorVarsChecked(bool check)
    {
      lbMonitorVars.ItemCheck -= lbMonitorVars_ItemCheck; // avoid per-item save spam
      for (int i = 0; i < lbMonitorVars.Items.Count; i++)
      {
        lbMonitorVars.SetItemChecked(i, check);
      }
      lbMonitorVars.ItemCheck += lbMonitorVars_ItemCheck;

      _curSimOptions.variables = check
        ? lbMonitorVars.Items.Cast<object>().Select(o => o.ToString()).ToList()
        : new List<string>();

      SaveUISettingsToJson();
    }

    /// <summary>
    /// Load the settings from the arguments passed in
    /// </summary>
    /// <param name="args"></param>
    /// <param name="modelPath">Output parameter for model path</param>
    /// <returns>return if to execute the model</returns>
    // Parse command-line options into _curSimOptions; returns true if execute flag present.
    private bool LoadFromArgs(string[] args, out string modelPath)
    {
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
            _curSimOptions.runct = int.Parse(args[i + 1]);
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
              _curSimOptions.inpfile = filePath;
            }
            ++i;
            break;

          case "-r":
            _curSimOptions.resout = args[i + 1];
            ++i;
            break;

          case "-o":
            _curSimOptions.jsonRes = args[i + 1];
            ++i;
            break;

          case "-t":
            _curSimOptions.runtime = args[i + 1];
            ++i;
            break;

          case "-threads":
            try
            {
              _curSimOptions.threads = int.Parse(args[i + 1]);
            }
            catch
            {
              Console.WriteLine("Invalid syntax for -threads, must be an integer.");
            }
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
              _curSimOptions.seed = int.Parse(args[i + 1]);
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
            // Need at least: -mergeResults src1 src2 dest  →  args.Length >= i + 4
            if (args.Length < (i + 4))
            {
              Console.Write("Invalid option, must have at least two result file paths and a destination file path after -mergeresults.");
              return false;
            }
            // All args after the flag are paths; the LAST is the destination, the rest are sources.
            string resPath = args[args.Length - 1];
            var mergeSources = new List<string>();
            for (int j = i + 1; j < args.Length - 1; j++)
              mergeSources.Add(args[j]);

            try
            {
              if (SimulationEngine.OverallResults.CombineJsonResultFiles(mergeSources, resPath) == "")
              {
                Console.Write("Failed to load files, must have valid file paths after -mergeresults.");
                return false;
              }
              Console.WriteLine("Successfully merged " + mergeSources.Count + " result files to: " + resPath);
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
                _curSimOptions.debug = "BASIC";
                ConfigData.debugLev = LogLevel.Info;
                break;

              case "detailed":
              case "Detailed":
                _curSimOptions.debug = "DETAILED";
                ConfigData.debugLev = LogLevel.Debug;
                break;

              default:
                Console.Write("invalid option for debug must be \"basic\" or \"detailed\". ");
                break;
            }
            _curSimOptions.debugStartIdx = ConfigData.debugRunStart;
            _curSimOptions.debugEndIdx = ConfigData.debugRunEnd;
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
                _curSimOptions.debugStartIdx = ConfigData.debugRunStart;
                ++i;

                arg = args[i + 1];
                if (!arg.EndsWith("]"))
                {
                  Console.Write("invalid option for debug range. Use [startIndex endIndex]");
                  return false;
                }
                arg = arg.TrimEnd(']');
                ConfigData.debugRunEnd = int.Parse(arg);
                _curSimOptions.debugEndIdx = ConfigData.debugRunEnd;
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

      if (monitor.Count > 0)
      {
        _curSimOptions.variables = monitor;
      }

      if (pathResultsInterval > 0)
      {
        _pathResultsInterval = pathResultsInterval;
        _curSimOptions.pathResultsInterval = pathResultsInterval;
      }

      if (execute)
        _isCommandLineRun = true;

      return execute;
    }

    // Print CLI help text and exit.
    private void ShowHelpAndExit()
    {
      // Leading newline so output starts on a fresh line after the shell prompt that just returned.
      Console.WriteLine();
      Console.WriteLine("Pass in a Options JSON file or use the following command line options.");
      Console.WriteLine("-n \"run count\"");
      Console.WriteLine("-i \"input model path\"");
      Console.WriteLine("-r \"results output file\"");
      Console.WriteLine("-o \"paths output file\"");
      Console.WriteLine("-threads \"number of threads to use\"");
      Console.WriteLine("-t \"max run time\"");
      Console.WriteLine("-e \"execute\"");
      Console.WriteLine("-m \"parameter to monitor, use []'s to do multiples, example - [x y z] \"");
      Console.WriteLine("-s \"initial random number seed\"");
      Console.WriteLine("-d \"debug level \"basic\" or \"detailed\", (optional) range [start end].");
      Console.WriteLine("    Basic - state movement only. Detailed - state movement, actions and events.");
      Console.WriteLine("    Example: -d basic [10 20]");
      Console.WriteLine("-rIntrv \"how often to save the path results, every X number of runs. No value or <1 will result in saving only after all runs are complete.\"");
      Console.WriteLine("-mergeResults \"merge two or more json path result files into one. The LAST path is the destination; all preceding paths are sources. Estimates the 5th and 95th.");
      Console.WriteLine("    Example (2 sources): -mergeResults c:/temp/Batch1.json c:/temp/Batch2.json c:/temp/Combined.json");
      Console.WriteLine("    Example (3 sources): -mergeResults c:/temp/Batch1.json c:/temp/Batch2.json c:/temp/Batch3.json c:/temp/Combined.json\"");
      Console.WriteLine("Options JSON file - ");
      Console.WriteLine(Options_cur.CmdJSON_OptionsExample);
      Console.Out.Flush();
      Environment.Exit(0);
    }

    // Launch a JSON-run with a simple processing dialog.
    private void OptionsRunWithNotify(string jsonPath)
    {
      if (!File.Exists(jsonPath))
      {
        Console.Write("Invalid path for JSON options load. " + jsonPath);
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
        OptionsRun(optionsJsonStr, jsonPath);
        notificationForm.Invoke(new System.Action(() => notificationForm.Close()));
        Environment.Exit(0);
      });
    }

    // Execute a JSON-defined simulation from console workflow.
    private async void OptionsRun(string optionsJsonStr, string optionsFilePath = "")
    {
      JSONRun simRun = new JSONRun(optionsJsonStr, "", null, optionsFilePath);
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

    // Clear XMPP display when requested.
    public void Clear()
    {
      if (chkClearOnMsg.Checked)
      {
        rtfReceived.Clear();
      }
    }

    // Ensure delegate executes on UI thread.
    private void InvokeUIUpdate(MethodInvoker methodInvokerDelegate)
    {
      // Only marshal when the window handle exists; otherwise Invoke throws "Invoke or BeginInvoke
      // cannot be called on a control until the window handle has been created." Running inline is
      // safe before the handle exists because there's no UI thread message pump to marshal onto yet.
      if (this.IsHandleCreated && this.InvokeRequired)
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

      // Run the command-line/JSON sim now that the form is loaded and its window handle exists.
      if (_pendingAutoRun)
      {
        _pendingAutoRun = false;
        btnStartSims_Click(this, null);
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

    private bool ValidateOrCreateFolder(string filePath, string fieldLabel)
    {
      if (string.IsNullOrWhiteSpace(filePath))
        return true;

      string folder = Path.GetDirectoryName(filePath);
      if (string.IsNullOrWhiteSpace(folder) || Directory.Exists(folder))
        return true;

      DialogResult res = MessageBox.Show(
        $"The folder for {fieldLabel} does not exist:\n{folder}\n\nCreate it?",
        "Folder Not Found",
        MessageBoxButtons.YesNo,
        MessageBoxIcon.Question);

      if (res == DialogResult.Yes)
      {
        Directory.CreateDirectory(folder);
        return true;
      }

      return false;
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
      ClearDebugLog();

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

        // Sync UI fields to options in case Leave events never fired
        _curSimOptions.resout = tbSavePath.Text;
        _curSimOptions.jsonRes = tbSavePath2.Text;
        SaveUISettingsToJson();

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

        // Require resout when run from command line
        if (_isCommandLineRun && string.IsNullOrEmpty(tbSavePath.Text))
        {
          Console.Write("Basic results output path (-r) is required when running from command line.");
          _running = false;
          SetRunningVis();
          return;
        }

        // Validate output folder paths
        if (!ValidateOrCreateFolder(tbSavePath.Text, "Basic Results"))
        {
          tbSavePath.Focus();
          _running = false;
          SetRunningVis();
          return;
        }
        if (!ValidateOrCreateFolder(tbSavePath2.Text, "Path Results"))
        {
          tbSavePath2.Focus();
          _running = false;
          SetRunningVis();
          return;
        }

        lblRunTime.Visible = true;
        lbl_ResultHeader.Visible = true;

        // Clone the options so runtime changes in the UI don't alter the running sim
        _curSimOptions.clearThreadTemps = cbClearTemps.Checked;
        Options_cur options = JsonConvert.DeserializeObject<Options_cur>(JsonConvert.SerializeObject(_curSimOptions));

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

              // Thread temp files are cleared by JSONRun via options.clearThreadTemps
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

    // Handle File->Open model and add to recents (without applying saved options).
    private void openToolStripMenuItem_Click(object sender, EventArgs e)
    {
      if (openModel.ShowDialog() == DialogResult.OK)
      {
        _skipApplyOptionsOnce = true;
        if (OpenModel(openModel.FileName))
          AddRecentFile(openModel.FileName);
      }
    }

    // Load model file, validate, and reset UI/results.
    private bool OpenModel(string path)
    {
      Cursor saveCurs = Cursor.Current;
      Cursor.Current = Cursors.WaitCursor;

      this.Text = "EMRALD (" + path + ")";

      string errorStr = "";
      _sim = null;
      teModel.Text = LoadLib.LoadModel(ref _sim, path, ref errorStr);
      _modelPath = path;
      _curSimOptions.inpfile = _modelPath;

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

    // Persist per-model option set to UISettings.json (list).
    private void SaveUISettingsToJson()
    {
      _curSimOptions.inpfile = _modelPath;
      if (string.IsNullOrWhiteSpace(_modelPath))
        return;

      List<Options_cur> list;
      try
      {
        list = File.Exists("UISettings.json")
          ? JsonConvert.DeserializeObject<List<Options_cur>>(File.ReadAllText("UISettings.json")) ?? new List<Options_cur>()
          : new List<Options_cur>();
      }
      catch
      {
        list = new List<Options_cur>();
      }

      list.RemoveAll(o => string.Equals(o.inpfile, _modelPath, StringComparison.OrdinalIgnoreCase));
      list.Add(JsonConvert.DeserializeObject<Options_cur>(JsonConvert.SerializeObject(_curSimOptions)));

      File.WriteAllText("UISettings.json", JsonConvert.SerializeObject(list, Formatting.Indented));
    }

    private void LoadCurSimOptionsFromDisk(string modelPath)
    {
      if (string.IsNullOrWhiteSpace(modelPath))
        return;

      try
      {
        if (File.Exists("UISettings.json"))
        {
          var list = JsonConvert.DeserializeObject<List<Options_cur>>(File.ReadAllText("UISettings.json")) ?? new List<Options_cur>();
          var match = list.FirstOrDefault(o => string.Equals(o.inpfile, modelPath, StringComparison.OrdinalIgnoreCase));
          if (match != null)
          {
            _curSimOptions = match;
          }
        }
      }
      catch { }
    }

    // Load recents from disk and rebuild Recent menu.
    private void LoadRecentFiles()
    {
      try
      {
        if (File.Exists("RecentFiles.json"))
        {
          _recentFiles = JsonConvert.DeserializeObject<List<string>>(File.ReadAllText("RecentFiles.json")) ?? new List<string>();
        }
      }
      catch { _recentFiles = new List<string>(); }

      PopulateRecentMenu();
    }

    // Save recents list to disk.
    private void SaveRecentFiles()
    {
      File.WriteAllText("RecentFiles.json", JsonConvert.SerializeObject(_recentFiles, Formatting.Indented));
    }

    // Rebuild Recent menu from in-memory list.
    private void PopulateRecentMenu()
    {
      recentToolStripMenuItem.DropDownItems.Clear();
      if (_recentFiles.Count == 0)
      {
        recentToolStripMenuItem.Visible = false;
        return;
      }

      recentToolStripMenuItem.Visible = true;
      foreach (var path in _recentFiles)
      {
        var item = new ToolStripMenuItem(path, null, RecentFile_Click) { Tag = path };
        recentToolStripMenuItem.DropDownItems.Add(item);
      }
    }

    // Insert/trim recents, persist, and refresh menu.
    private void AddRecentFile(string path)
    {
      if (string.IsNullOrWhiteSpace(path))
        return;

      _recentFiles.Remove(path);
      _recentFiles.Insert(0, path);
      if (_recentFiles.Count > 10)
        _recentFiles = _recentFiles.Take(10).ToList();

      SaveRecentFiles();
      PopulateRecentMenu();
    }

    // Open a recent model and apply saved options.
    private void RecentFile_Click(object sender, EventArgs e)
    {
      var menuItem = sender as ToolStripMenuItem;
      var path = menuItem?.Tag as string;
      if (string.IsNullOrWhiteSpace(path))
        return;

      if (!File.Exists(path))
      {
        MessageBox.Show($"File not found: {path}");
        _recentFiles.Remove(path);
        SaveRecentFiles();
        PopulateRecentMenu();
        return;
      }

      if (OpenModel(path))
      {
        LoadCurSimOptionsFromDisk(path);
        ApplyOptionsToUI();
        AddRecentFile(path);
      }
    }

    // Push _curSimOptions values into UI controls.
    private void ApplyOptionsToUI()
    {
      tbRunCnt.Text = _curSimOptions.runct.ToString();
      tbMaxSimTime.Text = _curSimOptions.runtime ?? "365.00:00:00";
      if (!string.IsNullOrEmpty(_curSimOptions.resout))
        tbSavePath.Text = _curSimOptions.resout;
      if (!string.IsNullOrEmpty(_curSimOptions.jsonRes))
        tbSavePath2.Text = _curSimOptions.jsonRes;

      tbSeed.Text = _curSimOptions.seed.HasValue ? _curSimOptions.seed.ToString() : "";
      LoadLib.SetSeed(tbSeed.Text);
      tbThreads.Text = _curSimOptions.threads > 0 ? _curSimOptions.threads.ToString() : "";
      LoadLib.SetThreads(tbThreads.Text);
      tbLogRunStart.Text = _curSimOptions.debugStartIdx > 0 ? _curSimOptions.debugStartIdx.ToString() : "1";
      tbLogRunEnd.Text = _curSimOptions.debugEndIdx > 0 ? _curSimOptions.debugEndIdx.ToString() : tbRunCnt.Text;

      cbMultiThreaded.Checked = _curSimOptions.threads > 0;

      // Coupling settings
      if (_curSimOptions.couplingInfo == null)
        _curSimOptions.couplingInfo = new CouplingData();

      rbWebSocket.Checked = _curSimOptions.couplingInfo.couplingType == CouplingType.WebSocket;
      rbXMPP.Checked = _curSimOptions.couplingInfo.couplingType != CouplingType.WebSocket;
      tbWebSocketURL.Text = _curSimOptions.couplingInfo.couplingURL ?? string.Empty;

      // Detach chkLog handler so it doesn't reset radio buttons / start-end indexes / _curSimOptions while we apply.
      chkLog.CheckedChanged -= chkLog_CheckedChanged;
      try
      {
        string debugLev = (_curSimOptions.debug ?? "").Trim().ToUpperInvariant();
        if (debugLev == "BASIC")
        {
          chkLog.Checked = true;
          rbDebugBasic.Checked = true;
          rbDebugDetailed.Checked = false;
          ConfigData.debugLev = LogLevel.Info;
        }
        else if (debugLev == "DETAILED")
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
        grpDebugOpts.Enabled = chkLog.Checked;
      }
      finally
      {
        chkLog.CheckedChanged += chkLog_CheckedChanged;
      }

      lbMonitorVars.ItemCheck -= lbMonitorVars_ItemCheck; // avoid per-item save spam and BeginInvoke before handle exists
      try
      {
        for (int i = 0; i < lbMonitorVars.Items.Count; i++)
        {
          string val = lbMonitorVars.Items[i].ToString();
          bool monitoredByModel = _sim?.allVariables.FindByName(val, false)?.monitorInSim ?? false;
          bool inOptions = _curSimOptions.variables?.Contains(val) ?? false;
          lbMonitorVars.SetItemChecked(i, monitoredByModel || inOptions);
        }
      }
      finally
      {
        lbMonitorVars.ItemCheck += lbMonitorVars_ItemCheck;
      }

      _pathResultsInterval = _curSimOptions.pathResultsInterval;

      SetCurThreadCB();

      ValidateOptionsVariables();
    }

    // Verify that every name in _curSimOptions.variables and initVars exists in the loaded model.
    // Reports any mismatches to the console and to txtMStatus.
    private void ValidateOptionsVariables()
    {
      if (_sim == null || _curSimOptions == null || !_validSim)
        return;

      var missingMonitor = new List<string>();
      var notMonitorable = new List<string>();
      var missingInit = new List<string>();

      if (_curSimOptions.variables != null)
      {
        foreach (var name in _curSimOptions.variables)
        {
          var v = _sim.allVariables.FindByName(name, false);
          if (v == null)
            missingMonitor.Add(name);
          else if (!v.canMonitorSim)
            notMonitorable.Add(name);
        }
      }

      if (_curSimOptions.initVars != null)
      {
        foreach (var iv in _curSimOptions.initVars)
        {
          if (_sim.allVariables.FindByName(iv.varName, false) == null)
            missingInit.Add(iv.varName);
        }
      }

      if (missingMonitor.Count == 0 && notMonitorable.Count == 0 && missingInit.Count == 0)
        return;

      var sb = new StringBuilder();
      sb.AppendLine("Options JSON variable check found issues:");
      if (missingMonitor.Count > 0)
        sb.AppendLine("  'variables' not found in model: " + string.Join(", ", missingMonitor));
      if (notMonitorable.Count > 0)
        sb.AppendLine("  'variables' exist but are not monitorable: " + string.Join(", ", notMonitorable));
      if (missingInit.Count > 0)
        sb.AppendLine("  'initVars' not found in model: " + string.Join(", ", missingInit));

      string msg = sb.ToString().TrimEnd();
      Console.WriteLine(msg);
      txtMStatus.Text = msg;
      txtMStatus.ForeColor = Color.Maroon;
    }

    private void btnValidateModel_Click(object sender, EventArgs e)
    {
      Cursor saveCurs = Cursor.Current;
      Cursor.Current = Cursors.WaitCursor;
      _sim = null;
      ValidateModelAndUpdateUI();
      Cursor.Current = saveCurs;
    }

    // Validate model text, update status, and refresh sim tab UI.
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
      if (_skipApplyOptionsOnce)
      {
        _skipApplyOptionsOnce = false;
      }
      else
      {
        ApplyOptionsToUI();
      }
    }

    // Populate simulation tab lists and enable/disable coupling section.
    private void InitSimTabInfo()
    {
      pnlSimulate.Enabled = _validSim;
      pnlSimResults.Enabled = _validSim;

      lbExtSimLinks.Items.Clear();
      bool hasExtSims = _validSim && _sim != null && _sim.allExtSims.Count > 0;
      tcCouplingTypeInfo.Enabled = hasExtSims;
      panel4.Enabled = hasExtSims;
      gbCoupleType.Enabled = hasExtSims;

      if (_validSim && hasExtSims)
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
      else
      {
        lbExtSimLinks.Items.Clear();
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
      _curSimOptions.resout = tbSavePath.Text;
      SaveUISettingsToJson();
    }

    private void button2_Click_1(object sender, EventArgs e)
    {
      saveFileDialog2.ShowDialog();
    }

    private void saveFileDialog2_FileOk(object sender, CancelEventArgs e)
    {
      tbSavePath2.Text = saveFileDialog2.FileName;
      _curSimOptions.jsonRes = tbSavePath2.Text;
      SaveUISettingsToJson();
    }

    private void AssignServer()
    {
      if (_server == null)
      {
        _server = new EMRALDMsgServer("secret");
        _server.SetUICallbacks(this);
      }
    }

    private void rbDebug_CheckedChanged(object sender, EventArgs e)
    {
      if (rbDebugBasic.Checked)
        ConfigData.debugLev = LogLevel.Info;
      if (rbDebugDetailed.Checked)
        ConfigData.debugLev = LogLevel.Debug;

      _curSimOptions.debug = chkLog.Checked ? (rbDebugDetailed.Checked ? "DETAILED" : "BASIC") : "OFF";
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
        _curSimOptions.debug = rbDebugDetailed.Checked ? "DETAILED" : "BASIC";
        _curSimOptions.debugStartIdx = ConfigData.debugRunStart;
        _curSimOptions.debugEndIdx = ConfigData.debugRunEnd;
      }
      else
      {
        ConfigData.debugLev = LogLevel.Off;
        rbDebugBasic.Checked = false;
        rbDebugDetailed.Checked = false;
        _curSimOptions.debug = "OFF";
        _curSimOptions.debugStartIdx = 0;
        _curSimOptions.debugEndIdx = 0;
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
      }
      if (int.TryParse(tbSeed.Text, out int seedVal))
        _curSimOptions.seed = seedVal;
      else
        _curSimOptions.seed = null;
      SaveUISettingsToJson();
    }

    private void tbLogRunStart_Leave(object sender, EventArgs e)
    {
      int parsedValue;
      if (!int.TryParse(tbLogRunStart.Text, out parsedValue))
      {
        MessageBox.Show("From Run must be a number > 0.");
        tbLogRunStart.Text = "1";
        _curSimOptions.debugStartIdx = 1;
        return;
      }

      if (parsedValue < 1)
        tbLogRunStart.Text = "1";

      ConfigData.debugRunStart = int.Parse(tbLogRunStart.Text);
      _curSimOptions.debugStartIdx = ConfigData.debugRunStart;
      SaveUISettingsToJson();
    }

    private void tbLogRunEnd_Leave(object sender, EventArgs e)
    {
      int parsedValue;
      if (!int.TryParse(tbLogRunEnd.Text, out parsedValue))
      {
        MessageBox.Show("To Run must be a number less than or equal to the total runs");
        tbLogRunEnd.Text = tbRunCnt.Text;
        if (int.TryParse(tbRunCnt.Text, out int totalRuns))
          _curSimOptions.debugEndIdx = totalRuns;
        return;
      }

      if (parsedValue > int.Parse(tbRunCnt.Text))
        tbLogRunStart.Text = tbRunCnt.Text;

      ConfigData.debugRunEnd = int.Parse(tbLogRunEnd.Text);
      _curSimOptions.debugEndIdx = ConfigData.debugRunEnd;
      SaveUISettingsToJson();
    }

    private void tbRunCnt_Leave(object sender, EventArgs e)
    {
      int parsedValue;
      if (!int.TryParse(tbRunCnt.Text, out parsedValue))
      {
        MessageBox.Show("Run Count must be a number");
        tbRunCnt.Text = "1000";
        _curSimOptions.runct = 1000;
        return;
      }
      else
      {
        _curSimOptions.runct = parsedValue;
        SaveUISettingsToJson();
      }
    }

    private void Leave_SaveSettings(object sender, System.EventArgs e)
    {
      SaveUISettingsToJson();
      if (sender == tbMaxSimTime)
      {
        _curSimOptions.runtime = tbMaxSimTime.Text;
      }
      else if (sender == tbSavePath)
      {
        _curSimOptions.resout = tbSavePath.Text;
      }
      else if (sender == tbSavePath2)
      {
        _curSimOptions.jsonRes = tbSavePath2.Text;
      }
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
        _curSimOptions.inpfile = _modelPath;
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

    private void lbMonitorVars_ItemCheck(object sender, ItemCheckEventArgs e)
    {
      var variables = lbMonitorVars.CheckedItems.Cast<object>().Select(i => i.ToString()).ToList();
      string variableName = lbMonitorVars.Items[e.Index].ToString();

      if (e.NewValue == CheckState.Checked && !variables.Contains(variableName))
      {
        variables.Add(variableName);
      }
      else if (e.NewValue == CheckState.Unchecked && variables.Contains(variableName))
      {
        variables.Remove(variableName);
      }

      _curSimOptions.variables = variables;
      if (IsHandleCreated)
        BeginInvoke(new System.Action(() => SaveUISettingsToJson()));
      else
        SaveUISettingsToJson();
    }

    // Delete the NLog debug file so each Run starts with a fresh log.
    // NLog's File target uses keepFileOpen=false by default, so the file isn't held between writes.
    private void ClearDebugLog()
    {
      try
      {
        NLog.LogManager.Flush();
        string logPath = Path.Combine(Application.StartupPath, "DebugLog.txt");
        if (File.Exists(logPath))
          File.Delete(logPath);
      }
      catch
      {
        // If the file is locked or missing, skip silently — the previous run's tail isn't worth blocking on.
      }
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
          chkLog.Enabled = true;
          grpDebugOpts.Enabled = chkLog.Checked;
        }
        else
        {
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
        if (cbMultiThreaded.Checked && int.TryParse(tbThreads.Text, out int threadCount) && threadCount > 0)
          _curSimOptions.threads = threadCount;
        else
          _curSimOptions.threads = 0;

        _curSimOptions.debug = chkLog.Checked ? (rbDebugDetailed.Checked ? "DETAILED" : "BASIC") : "OFF";
        if (chkLog.Checked && int.TryParse(tbLogRunStart.Text, out int dbgStart)) _curSimOptions.debugStartIdx = dbgStart;
        if (chkLog.Checked && int.TryParse(tbLogRunEnd.Text, out int dbgEnd)) _curSimOptions.debugEndIdx = dbgEnd;
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

      if (cbMultiThreaded.Checked && int.TryParse(tbThreads.Text, out int threadCount) && threadCount > 0)
        _curSimOptions.threads = threadCount;
      else
        _curSimOptions.threads = 0;
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

    private void rbWebSocket_CheckedChanged(object sender, EventArgs e)
    {
      if (_curSimOptions.couplingInfo == null)
        _curSimOptions.couplingInfo = new CouplingData();

      if (rbWebSocket.Checked)
      {
        tcCouplingTypeInfo.SelectedTab = tpWebSocket;
        _curSimOptions.couplingInfo.couplingType = CouplingType.WebSocket;
      }
      else
      {
        tcCouplingTypeInfo.SelectedTab = tpXMPP;
        _curSimOptions.couplingInfo.couplingType = CouplingType.XMPP;
      }

      SaveUISettingsToJson();
    }

    private void tbWebSocketURL_TextChanged(object sender, EventArgs e)
    {
      if (_curSimOptions.couplingInfo == null)
        _curSimOptions.couplingInfo = new CouplingData();

      _curSimOptions.couplingInfo.couplingURL = string.IsNullOrWhiteSpace(tbWebSocketURL.Text) ? null : tbWebSocketURL.Text;
      SaveUISettingsToJson();
    }
  }
}
