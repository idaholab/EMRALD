// Copyright 2021 Battelle Energy Alliance

namespace EMRALD_Sim
{
  partial class FormMain
  {
    /// <summary>
    /// Required designer variable.
    /// </summary>
    private System.ComponentModel.IContainer components = null;

    /// <summary>
    /// Clean up any resources being used.
    /// </summary>
    /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
    protected override void Dispose(bool disposing)
    {
      if (disposing && (components != null))
      {
        components.Dispose();
      }
      base.Dispose(disposing);
    }

    #region Windows Form Designer generated code

    /// <summary>
    /// Required method for Designer support - do not modify
    /// the contents of this method with the code editor.
    /// </summary>
    private void InitializeComponent()
    {
      this.components = new System.ComponentModel.Container();
      this.menuStrip1 = new System.Windows.Forms.MenuStrip();
      this.fileToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
      this.openToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
      this.defaultLoadToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
      this.openModel = new System.Windows.Forms.OpenFileDialog();
      this.tabXMPP = new System.Windows.Forms.TabPage();
      this.panel1 = new System.Windows.Forms.Panel();
      this.panel2 = new System.Windows.Forms.Panel();
      this.splitter4 = new System.Windows.Forms.Splitter();
      this.rtbJSONErrors = new System.Windows.Forms.RichTextBox();
      this.rtbJSONMsg = new System.Windows.Forms.RichTextBox();
      this.splitter5 = new System.Windows.Forms.Splitter();
      this.pnlJSONGen = new System.Windows.Forms.Panel();
      this.tabCtrlMsgTypes = new System.Windows.Forms.TabControl();
      this.tabItemData = new System.Windows.Forms.TabPage();
      this.tbItemDataValue = new System.Windows.Forms.TextBox();
      this.label5 = new System.Windows.Forms.Label();
      this.tbItemDataName = new System.Windows.Forms.TextBox();
      this.compID = new System.Windows.Forms.Label();
      this.tabSimInfo = new System.Windows.Forms.TabPage();
      this.label9 = new System.Windows.Forms.Label();
      this.tbEndTime = new System.Windows.Forms.TextBox();
      this.label8 = new System.Windows.Forms.Label();
      this.tbConfigData = new System.Windows.Forms.TextBox();
      this.label4 = new System.Windows.Forms.Label();
      this.tbModelRef = new System.Windows.Forms.TextBox();
      this.label6 = new System.Windows.Forms.Label();
      this.panel6 = new System.Windows.Forms.Panel();
      this.groupBox1 = new System.Windows.Forms.GroupBox();
      this.rtbMsgInfo = new System.Windows.Forms.RichTextBox();
      this.btnGenMsg = new System.Windows.Forms.Button();
      this.pnlTimePicking = new System.Windows.Forms.Panel();
      this.label3 = new System.Windows.Forms.Label();
      this.tbTimeSpan = new System.Windows.Forms.TextBox();
      this.label2 = new System.Windows.Forms.Label();
      this.panel5 = new System.Windows.Forms.Panel();
      this.label11 = new System.Windows.Forms.Label();
      this.cbMsgType = new System.Windows.Forms.ComboBox();
      this.panel7 = new System.Windows.Forms.Panel();
      this.label1 = new System.Windows.Forms.Label();
      this.btnSendMsg = new System.Windows.Forms.Button();
      this.cbRegisteredClients = new System.Windows.Forms.ComboBox();
      this.panel8 = new System.Windows.Forms.Panel();
      this.tbDispName = new System.Windows.Forms.TextBox();
      this.label10 = new System.Windows.Forms.Label();
      this.lblSimTime = new System.Windows.Forms.Label();
      this.tbMsgDesc = new System.Windows.Forms.TextBox();
      this.lblMsgTime = new System.Windows.Forms.Label();
      this.lblManMsgDesc = new System.Windows.Forms.Label();
      this.lblSendManualMsg = new System.Windows.Forms.Label();
      this.splitter1 = new System.Windows.Forms.Splitter();
      this.pnlConInfo = new System.Windows.Forms.Panel();
      this.groupBoxReceived = new System.Windows.Forms.GroupBox();
      this.chkClearOnMsg = new System.Windows.Forms.CheckBox();
      this.rtfReceived = new System.Windows.Forms.RichTextBox();
      this.groupBoxClients = new System.Windows.Forms.GroupBox();
      this.listBoxClients = new System.Windows.Forms.ListBox();
      this.tabModel = new System.Windows.Forms.TabPage();
      this.button1 = new System.Windows.Forms.Button();
      this.panel3 = new System.Windows.Forms.Panel();
      this.panel15 = new System.Windows.Forms.Panel();
      this.txtModel = new System.Windows.Forms.TextBox();
      this.panel9 = new System.Windows.Forms.Panel();
      this.btnValidateModel = new System.Windows.Forms.Button();
      this.splitter2 = new System.Windows.Forms.Splitter();
      this.txtMStatus = new System.Windows.Forms.TextBox();
      this.tcMain = new System.Windows.Forms.TabControl();
      this.tabSimulate = new System.Windows.Forms.TabPage();
      this.pnlSimResults = new System.Windows.Forms.Panel();
      this.lvVarValues = new System.Windows.Forms.ListView();
      this.colName = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
      this.colValue = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
      this.splitter8 = new System.Windows.Forms.Splitter();
      this.lvResults = new System.Windows.Forms.ListView();
      this.colKeyState = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
      this.colFailureCnt = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
      this.colRate = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
      this.colFailedItems = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
      this.panel13 = new System.Windows.Forms.Panel();
      this.lblRunTime = new System.Windows.Forms.Label();
      this.btn_Stop = new System.Windows.Forms.Button();
      this.lbl_ResultHeader = new System.Windows.Forms.Label();
      this.splitter6 = new System.Windows.Forms.Splitter();
      this.pnlSimulate = new System.Windows.Forms.Panel();
      this.chkDebug = new System.Windows.Forms.Panel();
      this.tbSavePath2 = new System.Windows.Forms.TextBox();
      this.button2 = new System.Windows.Forms.Button();
      this.gbPathResults = new System.Windows.Forms.GroupBox();
      this.rbJsonPaths = new System.Windows.Forms.RadioButton();
      this.rbSimplePath = new System.Windows.Forms.RadioButton();
      this.label19 = new System.Windows.Forms.Label();
      this.tbSeed = new System.Windows.Forms.TextBox();
      this.label18 = new System.Windows.Forms.Label();
      this.chkLog = new System.Windows.Forms.CheckBox();
      this.grpDebugOpts = new System.Windows.Forms.GroupBox();
      this.label21 = new System.Windows.Forms.Label();
      this.label20 = new System.Windows.Forms.Label();
      this.tbLogRunEnd = new System.Windows.Forms.TextBox();
      this.tbLogRunStart = new System.Windows.Forms.TextBox();
      this.rbDebugDetailed = new System.Windows.Forms.RadioButton();
      this.rbDebugBasic = new System.Windows.Forms.RadioButton();
      this.label17 = new System.Windows.Forms.Label();
      this.label16 = new System.Windows.Forms.Label();
      this.button3 = new System.Windows.Forms.Button();
      this.tbSavePath = new System.Windows.Forms.TextBox();
      this.label13 = new System.Windows.Forms.Label();
      this.tbMaxSimTime = new System.Windows.Forms.TextBox();
      this.label15 = new System.Windows.Forms.Label();
      this.label14 = new System.Windows.Forms.Label();
      this.tbRunCnt = new System.Windows.Forms.TextBox();
      this.btnStartSims = new System.Windows.Forms.Button();
      this.splitter7 = new System.Windows.Forms.Splitter();
      this.panel12 = new System.Windows.Forms.Panel();
      this.lbMonitorVars = new System.Windows.Forms.CheckedListBox();
      this.panel14 = new System.Windows.Forms.Panel();
      this.label7 = new System.Windows.Forms.Label();
      this.splitter3 = new System.Windows.Forms.Splitter();
      this.panel4 = new System.Windows.Forms.Panel();
      this.lbExtSimLinks = new System.Windows.Forms.CheckedListBox();
      this.panel10 = new System.Windows.Forms.Panel();
      this.label12 = new System.Windows.Forms.Label();
      this.tabLog = new System.Windows.Forms.TabPage();
      this.rtbLog = new System.Windows.Forms.RichTextBox();
      this.saveFileDialog1 = new System.Windows.Forms.SaveFileDialog();
      this.saveFileDialog2 = new System.Windows.Forms.SaveFileDialog();
      this.toolTip1 = new System.Windows.Forms.ToolTip(this.components);
      this.menuStrip1.SuspendLayout();
      this.tabXMPP.SuspendLayout();
      this.panel1.SuspendLayout();
      this.panel2.SuspendLayout();
      this.pnlJSONGen.SuspendLayout();
      this.tabCtrlMsgTypes.SuspendLayout();
      this.tabItemData.SuspendLayout();
      this.tabSimInfo.SuspendLayout();
      this.panel6.SuspendLayout();
      this.groupBox1.SuspendLayout();
      this.pnlTimePicking.SuspendLayout();
      this.panel5.SuspendLayout();
      this.panel7.SuspendLayout();
      this.panel8.SuspendLayout();
      this.pnlConInfo.SuspendLayout();
      this.groupBoxReceived.SuspendLayout();
      this.groupBoxClients.SuspendLayout();
      this.tabModel.SuspendLayout();
      this.panel3.SuspendLayout();
      this.panel15.SuspendLayout();
      this.panel9.SuspendLayout();
      this.tcMain.SuspendLayout();
      this.tabSimulate.SuspendLayout();
      this.pnlSimResults.SuspendLayout();
      this.panel13.SuspendLayout();
      this.pnlSimulate.SuspendLayout();
      this.chkDebug.SuspendLayout();
      this.gbPathResults.SuspendLayout();
      this.grpDebugOpts.SuspendLayout();
      this.panel12.SuspendLayout();
      this.panel14.SuspendLayout();
      this.panel4.SuspendLayout();
      this.panel10.SuspendLayout();
      this.tabLog.SuspendLayout();
      this.SuspendLayout();
      // 
      // menuStrip1
      // 
      this.menuStrip1.ImageScalingSize = new System.Drawing.Size(24, 24);
      this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.fileToolStripMenuItem});
      this.menuStrip1.Location = new System.Drawing.Point(0, 0);
      this.menuStrip1.Name = "menuStrip1";
      this.menuStrip1.Size = new System.Drawing.Size(1079, 24);
      this.menuStrip1.TabIndex = 0;
      this.menuStrip1.Text = "menuStrip1";
      // 
      // fileToolStripMenuItem
      // 
      this.fileToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.openToolStripMenuItem,
            this.defaultLoadToolStripMenuItem});
      this.fileToolStripMenuItem.Name = "fileToolStripMenuItem";
      this.fileToolStripMenuItem.Size = new System.Drawing.Size(37, 20);
      this.fileToolStripMenuItem.Text = "File";
      // 
      // openToolStripMenuItem
      // 
      this.openToolStripMenuItem.Name = "openToolStripMenuItem";
      this.openToolStripMenuItem.Size = new System.Drawing.Size(138, 22);
      this.openToolStripMenuItem.Text = "Open";
      this.openToolStripMenuItem.Click += new System.EventHandler(this.openToolStripMenuItem_Click);
      // 
      // defaultLoadToolStripMenuItem
      // 
      this.defaultLoadToolStripMenuItem.Name = "defaultLoadToolStripMenuItem";
      this.defaultLoadToolStripMenuItem.Size = new System.Drawing.Size(138, 22);
      this.defaultLoadToolStripMenuItem.Text = "DefaultLoad";
      this.defaultLoadToolStripMenuItem.Visible = false;
      this.defaultLoadToolStripMenuItem.Click += new System.EventHandler(this.defaultLoadToolStripMenuItem_Click);
      // 
      // openModel
      // 
      this.openModel.Filter = "JSON Files (*.json)|*.json";
      // 
      // tabXMPP
      // 
      this.tabXMPP.Controls.Add(this.panel1);
      this.tabXMPP.Controls.Add(this.splitter1);
      this.tabXMPP.Controls.Add(this.pnlConInfo);
      this.tabXMPP.Location = new System.Drawing.Point(4, 22);
      this.tabXMPP.Name = "tabXMPP";
      this.tabXMPP.Padding = new System.Windows.Forms.Padding(3);
      this.tabXMPP.Size = new System.Drawing.Size(1071, 768);
      this.tabXMPP.TabIndex = 1;
      this.tabXMPP.Text = "XMPP Messaging";
      this.tabXMPP.UseVisualStyleBackColor = true;
      this.tabXMPP.Enter += new System.EventHandler(this.tabXMPP_Enter);
      // 
      // panel1
      // 
      this.panel1.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
      this.panel1.Controls.Add(this.panel2);
      this.panel1.Controls.Add(this.panel7);
      this.panel1.Controls.Add(this.panel8);
      this.panel1.Dock = System.Windows.Forms.DockStyle.Fill;
      this.panel1.Location = new System.Drawing.Point(400, 3);
      this.panel1.Name = "panel1";
      this.panel1.Size = new System.Drawing.Size(668, 762);
      this.panel1.TabIndex = 28;
      // 
      // panel2
      // 
      this.panel2.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
      this.panel2.Controls.Add(this.splitter4);
      this.panel2.Controls.Add(this.rtbJSONErrors);
      this.panel2.Controls.Add(this.rtbJSONMsg);
      this.panel2.Controls.Add(this.splitter5);
      this.panel2.Controls.Add(this.pnlJSONGen);
      this.panel2.Dock = System.Windows.Forms.DockStyle.Fill;
      this.panel2.Location = new System.Drawing.Point(0, 93);
      this.panel2.Name = "panel2";
      this.panel2.Size = new System.Drawing.Size(664, 617);
      this.panel2.TabIndex = 28;
      // 
      // splitter4
      // 
      this.splitter4.Dock = System.Windows.Forms.DockStyle.Bottom;
      this.splitter4.Location = new System.Drawing.Point(0, 512);
      this.splitter4.Name = "splitter4";
      this.splitter4.Size = new System.Drawing.Size(662, 3);
      this.splitter4.TabIndex = 6;
      this.splitter4.TabStop = false;
      // 
      // rtbJSONErrors
      // 
      this.rtbJSONErrors.BackColor = System.Drawing.SystemColors.Control;
      this.rtbJSONErrors.Dock = System.Windows.Forms.DockStyle.Bottom;
      this.rtbJSONErrors.Location = new System.Drawing.Point(0, 515);
      this.rtbJSONErrors.Name = "rtbJSONErrors";
      this.rtbJSONErrors.Size = new System.Drawing.Size(662, 100);
      this.rtbJSONErrors.TabIndex = 5;
      this.rtbJSONErrors.Text = "JSON Errors";
      this.rtbJSONErrors.Visible = false;
      // 
      // rtbJSONMsg
      // 
      this.rtbJSONMsg.BackColor = System.Drawing.SystemColors.Control;
      this.rtbJSONMsg.Dock = System.Windows.Forms.DockStyle.Fill;
      this.rtbJSONMsg.Location = new System.Drawing.Point(0, 301);
      this.rtbJSONMsg.Name = "rtbJSONMsg";
      this.rtbJSONMsg.Size = new System.Drawing.Size(662, 314);
      this.rtbJSONMsg.TabIndex = 3;
      this.rtbJSONMsg.Text = "";
      // 
      // splitter5
      // 
      this.splitter5.Dock = System.Windows.Forms.DockStyle.Top;
      this.splitter5.Location = new System.Drawing.Point(0, 298);
      this.splitter5.Name = "splitter5";
      this.splitter5.Size = new System.Drawing.Size(662, 3);
      this.splitter5.TabIndex = 2;
      this.splitter5.TabStop = false;
      // 
      // pnlJSONGen
      // 
      this.pnlJSONGen.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
      this.pnlJSONGen.Controls.Add(this.tabCtrlMsgTypes);
      this.pnlJSONGen.Controls.Add(this.panel6);
      this.pnlJSONGen.Controls.Add(this.pnlTimePicking);
      this.pnlJSONGen.Controls.Add(this.panel5);
      this.pnlJSONGen.Dock = System.Windows.Forms.DockStyle.Top;
      this.pnlJSONGen.Location = new System.Drawing.Point(0, 0);
      this.pnlJSONGen.Name = "pnlJSONGen";
      this.pnlJSONGen.Size = new System.Drawing.Size(662, 298);
      this.pnlJSONGen.TabIndex = 4;
      // 
      // tabCtrlMsgTypes
      // 
      this.tabCtrlMsgTypes.Controls.Add(this.tabItemData);
      this.tabCtrlMsgTypes.Controls.Add(this.tabSimInfo);
      this.tabCtrlMsgTypes.Dock = System.Windows.Forms.DockStyle.Fill;
      this.tabCtrlMsgTypes.ItemSize = new System.Drawing.Size(100, 18);
      this.tabCtrlMsgTypes.Location = new System.Drawing.Point(0, 62);
      this.tabCtrlMsgTypes.Multiline = true;
      this.tabCtrlMsgTypes.Name = "tabCtrlMsgTypes";
      this.tabCtrlMsgTypes.SelectedIndex = 0;
      this.tabCtrlMsgTypes.Size = new System.Drawing.Size(660, 114);
      this.tabCtrlMsgTypes.SizeMode = System.Windows.Forms.TabSizeMode.Fixed;
      this.tabCtrlMsgTypes.TabIndex = 0;
      // 
      // tabItemData
      // 
      this.tabItemData.BackColor = System.Drawing.Color.Gainsboro;
      this.tabItemData.Controls.Add(this.tbItemDataValue);
      this.tabItemData.Controls.Add(this.label5);
      this.tabItemData.Controls.Add(this.tbItemDataName);
      this.tabItemData.Controls.Add(this.compID);
      this.tabItemData.Location = new System.Drawing.Point(4, 22);
      this.tabItemData.Name = "tabItemData";
      this.tabItemData.Size = new System.Drawing.Size(652, 88);
      this.tabItemData.TabIndex = 0;
      this.tabItemData.Text = "ItemData";
      // 
      // tbItemDataValue
      // 
      this.tbItemDataValue.Location = new System.Drawing.Point(71, 35);
      this.tbItemDataValue.Name = "tbItemDataValue";
      this.tbItemDataValue.Size = new System.Drawing.Size(146, 20);
      this.tbItemDataValue.TabIndex = 8;
      this.tbItemDataValue.Text = "300";
      // 
      // label5
      // 
      this.label5.AutoSize = true;
      this.label5.Location = new System.Drawing.Point(10, 38);
      this.label5.Name = "label5";
      this.label5.Size = new System.Drawing.Size(40, 13);
      this.label5.TabIndex = 7;
      this.label5.Text = "Value :";
      // 
      // tbItemDataName
      // 
      this.tbItemDataName.Location = new System.Drawing.Point(71, 10);
      this.tbItemDataName.Name = "tbItemDataName";
      this.tbItemDataName.Size = new System.Drawing.Size(146, 20);
      this.tbItemDataName.TabIndex = 6;
      this.tbItemDataName.Text = "myNameID";
      // 
      // compID
      // 
      this.compID.AutoSize = true;
      this.compID.Location = new System.Drawing.Point(10, 13);
      this.compID.Name = "compID";
      this.compID.Size = new System.Drawing.Size(55, 13);
      this.compID.TabIndex = 5;
      this.compID.Text = "Name ID :";
      // 
      // tabSimInfo
      // 
      this.tabSimInfo.BackColor = System.Drawing.Color.Gainsboro;
      this.tabSimInfo.Controls.Add(this.label9);
      this.tabSimInfo.Controls.Add(this.tbEndTime);
      this.tabSimInfo.Controls.Add(this.label8);
      this.tabSimInfo.Controls.Add(this.tbConfigData);
      this.tabSimInfo.Controls.Add(this.label4);
      this.tabSimInfo.Controls.Add(this.tbModelRef);
      this.tabSimInfo.Controls.Add(this.label6);
      this.tabSimInfo.Location = new System.Drawing.Point(4, 22);
      this.tabSimInfo.Name = "tabSimInfo";
      this.tabSimInfo.Size = new System.Drawing.Size(652, 88);
      this.tabSimInfo.TabIndex = 0;
      this.tabSimInfo.Text = "SimInfo";
      // 
      // label9
      // 
      this.label9.AutoSize = true;
      this.label9.Location = new System.Drawing.Point(198, 67);
      this.label9.Name = "label9";
      this.label9.Size = new System.Drawing.Size(104, 13);
      this.label9.TabIndex = 9;
      this.label9.Text = " [days hh:mm:ss.ms] ";
      // 
      // tbEndTime
      // 
      this.tbEndTime.Location = new System.Drawing.Point(75, 64);
      this.tbEndTime.Name = "tbEndTime";
      this.tbEndTime.Size = new System.Drawing.Size(117, 20);
      this.tbEndTime.TabIndex = 16;
      this.tbEndTime.Text = "00:00:00";
      // 
      // label8
      // 
      this.label8.AutoSize = true;
      this.label8.Location = new System.Drawing.Point(8, 67);
      this.label8.Name = "label8";
      this.label8.Size = new System.Drawing.Size(58, 13);
      this.label8.TabIndex = 15;
      this.label8.Text = "End Time :";
      // 
      // tbConfigData
      // 
      this.tbConfigData.Location = new System.Drawing.Point(75, 38);
      this.tbConfigData.Name = "tbConfigData";
      this.tbConfigData.Size = new System.Drawing.Size(554, 20);
      this.tbConfigData.TabIndex = 12;
      // 
      // label4
      // 
      this.label4.AutoSize = true;
      this.label4.Location = new System.Drawing.Point(7, 41);
      this.label4.Name = "label4";
      this.label4.Size = new System.Drawing.Size(69, 13);
      this.label4.TabIndex = 11;
      this.label4.Text = "Config Data :";
      // 
      // tbModelRef
      // 
      this.tbModelRef.Location = new System.Drawing.Point(75, 13);
      this.tbModelRef.Name = "tbModelRef";
      this.tbModelRef.Size = new System.Drawing.Size(340, 20);
      this.tbModelRef.TabIndex = 10;
      this.tbModelRef.Text = "c:\\temp\\model.x";
      // 
      // label6
      // 
      this.label6.AutoSize = true;
      this.label6.Location = new System.Drawing.Point(7, 16);
      this.label6.Name = "label6";
      this.label6.Size = new System.Drawing.Size(62, 13);
      this.label6.TabIndex = 9;
      this.label6.Text = "Model Ref :";
      // 
      // panel6
      // 
      this.panel6.BackColor = System.Drawing.Color.Gainsboro;
      this.panel6.Controls.Add(this.groupBox1);
      this.panel6.Controls.Add(this.btnGenMsg);
      this.panel6.Dock = System.Windows.Forms.DockStyle.Bottom;
      this.panel6.Location = new System.Drawing.Point(0, 176);
      this.panel6.Name = "panel6";
      this.panel6.Size = new System.Drawing.Size(660, 120);
      this.panel6.TabIndex = 2;
      // 
      // groupBox1
      // 
      this.groupBox1.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
      this.groupBox1.Controls.Add(this.rtbMsgInfo);
      this.groupBox1.Location = new System.Drawing.Point(4, 3);
      this.groupBox1.Name = "groupBox1";
      this.groupBox1.Size = new System.Drawing.Size(642, 82);
      this.groupBox1.TabIndex = 12;
      this.groupBox1.TabStop = false;
      this.groupBox1.Text = "Info (Likely JSON)";
      // 
      // rtbMsgInfo
      // 
      this.rtbMsgInfo.Dock = System.Windows.Forms.DockStyle.Fill;
      this.rtbMsgInfo.Location = new System.Drawing.Point(3, 16);
      this.rtbMsgInfo.Name = "rtbMsgInfo";
      this.rtbMsgInfo.Size = new System.Drawing.Size(636, 63);
      this.rtbMsgInfo.TabIndex = 0;
      this.rtbMsgInfo.Text = "";
      // 
      // btnGenMsg
      // 
      this.btnGenMsg.Anchor = System.Windows.Forms.AnchorStyles.Bottom;
      this.btnGenMsg.Location = new System.Drawing.Point(256, 91);
      this.btnGenMsg.Name = "btnGenMsg";
      this.btnGenMsg.Size = new System.Drawing.Size(119, 23);
      this.btnGenMsg.TabIndex = 1;
      this.btnGenMsg.Text = "Generate Message";
      this.btnGenMsg.UseVisualStyleBackColor = true;
      this.btnGenMsg.Click += new System.EventHandler(this.btnGenMsg_Click);
      // 
      // pnlTimePicking
      // 
      this.pnlTimePicking.BackColor = System.Drawing.Color.Gainsboro;
      this.pnlTimePicking.Controls.Add(this.label3);
      this.pnlTimePicking.Controls.Add(this.tbTimeSpan);
      this.pnlTimePicking.Controls.Add(this.label2);
      this.pnlTimePicking.Dock = System.Windows.Forms.DockStyle.Top;
      this.pnlTimePicking.Location = new System.Drawing.Point(0, 31);
      this.pnlTimePicking.Name = "pnlTimePicking";
      this.pnlTimePicking.Size = new System.Drawing.Size(660, 31);
      this.pnlTimePicking.TabIndex = 4;
      // 
      // label3
      // 
      this.label3.AutoSize = true;
      this.label3.Location = new System.Drawing.Point(195, 7);
      this.label3.Name = "label3";
      this.label3.Size = new System.Drawing.Size(101, 13);
      this.label3.TabIndex = 8;
      this.label3.Text = "[days hh:mm:ss.ms] ";
      // 
      // tbTimeSpan
      // 
      this.tbTimeSpan.Location = new System.Drawing.Point(48, 3);
      this.tbTimeSpan.Name = "tbTimeSpan";
      this.tbTimeSpan.Size = new System.Drawing.Size(146, 20);
      this.tbTimeSpan.TabIndex = 7;
      this.tbTimeSpan.Text = "00:00:00";
      // 
      // label2
      // 
      this.label2.AutoSize = true;
      this.label2.Location = new System.Drawing.Point(8, 7);
      this.label2.Name = "label2";
      this.label2.Size = new System.Drawing.Size(36, 13);
      this.label2.TabIndex = 1;
      this.label2.Text = "Time :";
      // 
      // panel5
      // 
      this.panel5.BackColor = System.Drawing.Color.Gainsboro;
      this.panel5.Controls.Add(this.label11);
      this.panel5.Controls.Add(this.cbMsgType);
      this.panel5.Dock = System.Windows.Forms.DockStyle.Top;
      this.panel5.Location = new System.Drawing.Point(0, 0);
      this.panel5.Name = "panel5";
      this.panel5.Size = new System.Drawing.Size(660, 31);
      this.panel5.TabIndex = 3;
      // 
      // label11
      // 
      this.label11.AutoSize = true;
      this.label11.Location = new System.Drawing.Point(182, 7);
      this.label11.Name = "label11";
      this.label11.Size = new System.Drawing.Size(90, 13);
      this.label11.TabIndex = 1;
      this.label11.Text = "Action Msg Type:";
      // 
      // cbMsgType
      // 
      this.cbMsgType.FormattingEnabled = true;
      this.cbMsgType.Items.AddRange(new object[] {
            "CompModify",
            "Timer",
            "OpenSim",
            "CancelSim",
            "PauseSim",
            "Continue",
            "Reset",
            "RestartAtTime",
            "Ping",
            "Status"});
      this.cbMsgType.Location = new System.Drawing.Point(276, 4);
      this.cbMsgType.Name = "cbMsgType";
      this.cbMsgType.Size = new System.Drawing.Size(121, 21);
      this.cbMsgType.TabIndex = 0;
      this.cbMsgType.SelectedIndexChanged += new System.EventHandler(this.cbMsgType_SelectedIndexChanged);
      // 
      // panel7
      // 
      this.panel7.Controls.Add(this.label1);
      this.panel7.Controls.Add(this.btnSendMsg);
      this.panel7.Controls.Add(this.cbRegisteredClients);
      this.panel7.Dock = System.Windows.Forms.DockStyle.Bottom;
      this.panel7.Location = new System.Drawing.Point(0, 710);
      this.panel7.Name = "panel7";
      this.panel7.Size = new System.Drawing.Size(664, 48);
      this.panel7.TabIndex = 27;
      // 
      // label1
      // 
      this.label1.AutoSize = true;
      this.label1.Location = new System.Drawing.Point(47, 18);
      this.label1.Name = "label1";
      this.label1.Size = new System.Drawing.Size(50, 13);
      this.label1.TabIndex = 7;
      this.label1.Text = "Send to :";
      // 
      // btnSendMsg
      // 
      this.btnSendMsg.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
      this.btnSendMsg.Location = new System.Drawing.Point(297, 13);
      this.btnSendMsg.Name = "btnSendMsg";
      this.btnSendMsg.Size = new System.Drawing.Size(202, 23);
      this.btnSendMsg.TabIndex = 0;
      this.btnSendMsg.Text = "Send";
      this.btnSendMsg.UseVisualStyleBackColor = true;
      this.btnSendMsg.Click += new System.EventHandler(this.btnSendMsg_Click_1);
      // 
      // cbRegisteredClients
      // 
      this.cbRegisteredClients.FormattingEnabled = true;
      this.cbRegisteredClients.Items.AddRange(new object[] {
            "EMRALD"});
      this.cbRegisteredClients.Location = new System.Drawing.Point(103, 15);
      this.cbRegisteredClients.Name = "cbRegisteredClients";
      this.cbRegisteredClients.Size = new System.Drawing.Size(188, 21);
      this.cbRegisteredClients.TabIndex = 0;
      // 
      // panel8
      // 
      this.panel8.BackColor = System.Drawing.Color.Gainsboro;
      this.panel8.Controls.Add(this.tbDispName);
      this.panel8.Controls.Add(this.label10);
      this.panel8.Controls.Add(this.lblSimTime);
      this.panel8.Controls.Add(this.tbMsgDesc);
      this.panel8.Controls.Add(this.lblMsgTime);
      this.panel8.Controls.Add(this.lblManMsgDesc);
      this.panel8.Controls.Add(this.lblSendManualMsg);
      this.panel8.Dock = System.Windows.Forms.DockStyle.Top;
      this.panel8.Location = new System.Drawing.Point(0, 0);
      this.panel8.Name = "panel8";
      this.panel8.Size = new System.Drawing.Size(664, 93);
      this.panel8.TabIndex = 27;
      // 
      // tbDispName
      // 
      this.tbDispName.Location = new System.Drawing.Point(89, 17);
      this.tbDispName.Name = "tbDispName";
      this.tbDispName.Size = new System.Drawing.Size(146, 20);
      this.tbDispName.TabIndex = 8;
      this.tbDispName.Text = "ManualEv";
      // 
      // label10
      // 
      this.label10.AutoSize = true;
      this.label10.Location = new System.Drawing.Point(10, 17);
      this.label10.Name = "label10";
      this.label10.Size = new System.Drawing.Size(62, 13);
      this.label10.TabIndex = 7;
      this.label10.Text = "DispName :";
      // 
      // lblSimTime
      // 
      this.lblSimTime.AutoSize = true;
      this.lblSimTime.Location = new System.Drawing.Point(86, 64);
      this.lblSimTime.Name = "lblSimTime";
      this.lblSimTime.Size = new System.Drawing.Size(49, 13);
      this.lblSimTime.TabIndex = 6;
      this.lblSimTime.Text = "00:00:00";
      // 
      // tbMsgDesc
      // 
      this.tbMsgDesc.Location = new System.Drawing.Point(89, 38);
      this.tbMsgDesc.Name = "tbMsgDesc";
      this.tbMsgDesc.Size = new System.Drawing.Size(469, 20);
      this.tbMsgDesc.TabIndex = 3;
      this.tbMsgDesc.Text = "Testing";
      // 
      // lblMsgTime
      // 
      this.lblMsgTime.AutoSize = true;
      this.lblMsgTime.Location = new System.Drawing.Point(10, 64);
      this.lblMsgTime.Name = "lblMsgTime";
      this.lblMsgTime.Size = new System.Drawing.Size(56, 13);
      this.lblMsgTime.TabIndex = 2;
      this.lblMsgTime.Text = "Sim Time :";
      // 
      // lblManMsgDesc
      // 
      this.lblManMsgDesc.AutoSize = true;
      this.lblManMsgDesc.Location = new System.Drawing.Point(10, 41);
      this.lblManMsgDesc.Name = "lblManMsgDesc";
      this.lblManMsgDesc.Size = new System.Drawing.Size(66, 13);
      this.lblManMsgDesc.TabIndex = 1;
      this.lblManMsgDesc.Text = "Description :";
      // 
      // lblSendManualMsg
      // 
      this.lblSendManualMsg.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
      this.lblSendManualMsg.AutoSize = true;
      this.lblSendManualMsg.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
      this.lblSendManualMsg.Location = new System.Drawing.Point(232, 1);
      this.lblSendManualMsg.Name = "lblSendManualMsg";
      this.lblSendManualMsg.Size = new System.Drawing.Size(209, 16);
      this.lblSendManualMsg.TabIndex = 1;
      this.lblSendManualMsg.Text = "Send Manual Event Message";
      this.lblSendManualMsg.TextAlign = System.Drawing.ContentAlignment.TopCenter;
      // 
      // splitter1
      // 
      this.splitter1.BackColor = System.Drawing.SystemColors.ScrollBar;
      this.splitter1.Location = new System.Drawing.Point(394, 3);
      this.splitter1.Name = "splitter1";
      this.splitter1.Size = new System.Drawing.Size(6, 762);
      this.splitter1.TabIndex = 25;
      this.splitter1.TabStop = false;
      // 
      // pnlConInfo
      // 
      this.pnlConInfo.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
      this.pnlConInfo.Controls.Add(this.groupBoxReceived);
      this.pnlConInfo.Controls.Add(this.groupBoxClients);
      this.pnlConInfo.Dock = System.Windows.Forms.DockStyle.Left;
      this.pnlConInfo.Location = new System.Drawing.Point(3, 3);
      this.pnlConInfo.Name = "pnlConInfo";
      this.pnlConInfo.Size = new System.Drawing.Size(391, 762);
      this.pnlConInfo.TabIndex = 24;
      // 
      // groupBoxReceived
      // 
      this.groupBoxReceived.Controls.Add(this.chkClearOnMsg);
      this.groupBoxReceived.Controls.Add(this.rtfReceived);
      this.groupBoxReceived.Dock = System.Windows.Forms.DockStyle.Fill;
      this.groupBoxReceived.Location = new System.Drawing.Point(0, 105);
      this.groupBoxReceived.Margin = new System.Windows.Forms.Padding(2);
      this.groupBoxReceived.Name = "groupBoxReceived";
      this.groupBoxReceived.Padding = new System.Windows.Forms.Padding(2);
      this.groupBoxReceived.Size = new System.Drawing.Size(389, 655);
      this.groupBoxReceived.TabIndex = 22;
      this.groupBoxReceived.TabStop = false;
      this.groupBoxReceived.Text = "Message Log";
      // 
      // chkClearOnMsg
      // 
      this.chkClearOnMsg.AutoSize = true;
      this.chkClearOnMsg.Checked = true;
      this.chkClearOnMsg.CheckState = System.Windows.Forms.CheckState.Checked;
      this.chkClearOnMsg.Location = new System.Drawing.Point(305, -1);
      this.chkClearOnMsg.Name = "chkClearOnMsg";
      this.chkClearOnMsg.Size = new System.Drawing.Size(95, 17);
      this.chkClearOnMsg.TabIndex = 1;
      this.chkClearOnMsg.Text = "Clear Sim Start";
      this.chkClearOnMsg.UseVisualStyleBackColor = true;
      // 
      // rtfReceived
      // 
      this.rtfReceived.Dock = System.Windows.Forms.DockStyle.Fill;
      this.rtfReceived.Location = new System.Drawing.Point(2, 15);
      this.rtfReceived.Margin = new System.Windows.Forms.Padding(2);
      this.rtfReceived.Name = "rtfReceived";
      this.rtfReceived.ReadOnly = true;
      this.rtfReceived.Size = new System.Drawing.Size(385, 638);
      this.rtfReceived.TabIndex = 0;
      this.rtfReceived.Text = "";
      // 
      // groupBoxClients
      // 
      this.groupBoxClients.Controls.Add(this.listBoxClients);
      this.groupBoxClients.Dock = System.Windows.Forms.DockStyle.Top;
      this.groupBoxClients.Location = new System.Drawing.Point(0, 0);
      this.groupBoxClients.Margin = new System.Windows.Forms.Padding(2);
      this.groupBoxClients.Name = "groupBoxClients";
      this.groupBoxClients.Padding = new System.Windows.Forms.Padding(2);
      this.groupBoxClients.Size = new System.Drawing.Size(389, 105);
      this.groupBoxClients.TabIndex = 21;
      this.groupBoxClients.TabStop = false;
      this.groupBoxClients.Text = "Connected Clients";
      // 
      // listBoxClients
      // 
      this.listBoxClients.Dock = System.Windows.Forms.DockStyle.Fill;
      this.listBoxClients.FormattingEnabled = true;
      this.listBoxClients.Location = new System.Drawing.Point(2, 15);
      this.listBoxClients.Margin = new System.Windows.Forms.Padding(2);
      this.listBoxClients.Name = "listBoxClients";
      this.listBoxClients.Size = new System.Drawing.Size(385, 88);
      this.listBoxClients.TabIndex = 0;
      // 
      // tabModel
      // 
      this.tabModel.Controls.Add(this.button1);
      this.tabModel.Controls.Add(this.panel3);
      this.tabModel.Controls.Add(this.splitter2);
      this.tabModel.Controls.Add(this.txtMStatus);
      this.tabModel.Location = new System.Drawing.Point(4, 22);
      this.tabModel.Name = "tabModel";
      this.tabModel.Padding = new System.Windows.Forms.Padding(3);
      this.tabModel.Size = new System.Drawing.Size(1071, 768);
      this.tabModel.TabIndex = 0;
      this.tabModel.Text = "Model";
      this.tabModel.UseVisualStyleBackColor = true;
      // 
      // button1
      // 
      this.button1.Location = new System.Drawing.Point(25, 699);
      this.button1.Name = "button1";
      this.button1.Size = new System.Drawing.Size(75, 23);
      this.button1.TabIndex = 5;
      this.button1.Text = "Test";
      this.button1.UseVisualStyleBackColor = true;
      this.button1.Visible = false;
      // 
      // panel3
      // 
      this.panel3.Controls.Add(this.panel15);
      this.panel3.Controls.Add(this.panel9);
      this.panel3.Dock = System.Windows.Forms.DockStyle.Fill;
      this.panel3.Location = new System.Drawing.Point(3, 3);
      this.panel3.Name = "panel3";
      this.panel3.Size = new System.Drawing.Size(1065, 672);
      this.panel3.TabIndex = 4;
      // 
      // panel15
      // 
      this.panel15.Controls.Add(this.txtModel);
      this.panel15.Dock = System.Windows.Forms.DockStyle.Fill;
      this.panel15.Location = new System.Drawing.Point(0, 0);
      this.panel15.Name = "panel15";
      this.panel15.Size = new System.Drawing.Size(1065, 643);
      this.panel15.TabIndex = 3;
      // 
      // txtModel
      // 
      this.txtModel.Dock = System.Windows.Forms.DockStyle.Fill;
      this.txtModel.Location = new System.Drawing.Point(0, 0);
      this.txtModel.Multiline = true;
      this.txtModel.Name = "txtModel";
      this.txtModel.ScrollBars = System.Windows.Forms.ScrollBars.Both;
      this.txtModel.Size = new System.Drawing.Size(1065, 643);
      this.txtModel.TabIndex = 1;
      this.txtModel.TextChanged += new System.EventHandler(this.txtModel_TextChanged);
      // 
      // panel9
      // 
      this.panel9.Controls.Add(this.btnValidateModel);
      this.panel9.Dock = System.Windows.Forms.DockStyle.Bottom;
      this.panel9.Location = new System.Drawing.Point(0, 643);
      this.panel9.Name = "panel9";
      this.panel9.Size = new System.Drawing.Size(1065, 29);
      this.panel9.TabIndex = 2;
      // 
      // btnValidateModel
      // 
      this.btnValidateModel.Location = new System.Drawing.Point(498, 4);
      this.btnValidateModel.Name = "btnValidateModel";
      this.btnValidateModel.Size = new System.Drawing.Size(75, 23);
      this.btnValidateModel.TabIndex = 0;
      this.btnValidateModel.Text = "Validate";
      this.btnValidateModel.UseVisualStyleBackColor = true;
      this.btnValidateModel.Click += new System.EventHandler(this.btnValidateModel_Click);
      // 
      // splitter2
      // 
      this.splitter2.Cursor = System.Windows.Forms.Cursors.HSplit;
      this.splitter2.Dock = System.Windows.Forms.DockStyle.Bottom;
      this.splitter2.Location = new System.Drawing.Point(3, 675);
      this.splitter2.Name = "splitter2";
      this.splitter2.Size = new System.Drawing.Size(1065, 3);
      this.splitter2.TabIndex = 3;
      this.splitter2.TabStop = false;
      // 
      // txtMStatus
      // 
      this.txtMStatus.Dock = System.Windows.Forms.DockStyle.Bottom;
      this.txtMStatus.Location = new System.Drawing.Point(3, 678);
      this.txtMStatus.Multiline = true;
      this.txtMStatus.Name = "txtMStatus";
      this.txtMStatus.Size = new System.Drawing.Size(1065, 87);
      this.txtMStatus.TabIndex = 2;
      // 
      // tcMain
      // 
      this.tcMain.Controls.Add(this.tabModel);
      this.tcMain.Controls.Add(this.tabSimulate);
      this.tcMain.Controls.Add(this.tabXMPP);
      this.tcMain.Controls.Add(this.tabLog);
      this.tcMain.Dock = System.Windows.Forms.DockStyle.Fill;
      this.tcMain.Location = new System.Drawing.Point(0, 24);
      this.tcMain.Name = "tcMain";
      this.tcMain.SelectedIndex = 0;
      this.tcMain.Size = new System.Drawing.Size(1079, 794);
      this.tcMain.TabIndex = 1;
      // 
      // tabSimulate
      // 
      this.tabSimulate.Controls.Add(this.pnlSimResults);
      this.tabSimulate.Controls.Add(this.splitter6);
      this.tabSimulate.Controls.Add(this.pnlSimulate);
      this.tabSimulate.Location = new System.Drawing.Point(4, 22);
      this.tabSimulate.Name = "tabSimulate";
      this.tabSimulate.Size = new System.Drawing.Size(1071, 768);
      this.tabSimulate.TabIndex = 3;
      this.tabSimulate.Text = "Simulate";
      this.tabSimulate.UseVisualStyleBackColor = true;
      // 
      // pnlSimResults
      // 
      this.pnlSimResults.Controls.Add(this.lvVarValues);
      this.pnlSimResults.Controls.Add(this.splitter8);
      this.pnlSimResults.Controls.Add(this.lvResults);
      this.pnlSimResults.Controls.Add(this.panel13);
      this.pnlSimResults.Dock = System.Windows.Forms.DockStyle.Fill;
      this.pnlSimResults.Location = new System.Drawing.Point(0, 254);
      this.pnlSimResults.Name = "pnlSimResults";
      this.pnlSimResults.Size = new System.Drawing.Size(1071, 514);
      this.pnlSimResults.TabIndex = 3;
      // 
      // lvVarValues
      // 
      this.lvVarValues.AllowColumnReorder = true;
      this.lvVarValues.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.colName,
            this.colValue});
      this.lvVarValues.Dock = System.Windows.Forms.DockStyle.Top;
      this.lvVarValues.FullRowSelect = true;
      this.lvVarValues.GridLines = true;
      this.lvVarValues.HideSelection = false;
      this.lvVarValues.Location = new System.Drawing.Point(0, 412);
      this.lvVarValues.Name = "lvVarValues";
      this.lvVarValues.Size = new System.Drawing.Size(1071, 375);
      this.lvVarValues.TabIndex = 5;
      this.lvVarValues.UseCompatibleStateImageBehavior = false;
      this.lvVarValues.View = System.Windows.Forms.View.Details;
      // 
      // colName
      // 
      this.colName.Text = "Variable Name";
      this.colName.Width = 150;
      // 
      // colValue
      // 
      this.colValue.Text = "Value";
      this.colValue.Width = 80;
      // 
      // splitter8
      // 
      this.splitter8.Dock = System.Windows.Forms.DockStyle.Top;
      this.splitter8.Location = new System.Drawing.Point(0, 409);
      this.splitter8.Name = "splitter8";
      this.splitter8.Size = new System.Drawing.Size(1071, 3);
      this.splitter8.TabIndex = 4;
      this.splitter8.TabStop = false;
      // 
      // lvResults
      // 
      this.lvResults.AllowColumnReorder = true;
      this.lvResults.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.colKeyState,
            this.colFailureCnt,
            this.colRate,
            this.colFailedItems});
      this.lvResults.Dock = System.Windows.Forms.DockStyle.Top;
      this.lvResults.FullRowSelect = true;
      this.lvResults.GridLines = true;
      this.lvResults.HideSelection = false;
      this.lvResults.Location = new System.Drawing.Point(0, 34);
      this.lvResults.Name = "lvResults";
      this.lvResults.Size = new System.Drawing.Size(1071, 375);
      this.lvResults.TabIndex = 3;
      this.lvResults.UseCompatibleStateImageBehavior = false;
      this.lvResults.View = System.Windows.Forms.View.Details;
      // 
      // colKeyState
      // 
      this.colKeyState.Text = "KeyState";
      this.colKeyState.Width = 150;
      // 
      // colFailureCnt
      // 
      this.colFailureCnt.Text = "Failure Cnt";
      this.colFailureCnt.Width = 80;
      // 
      // colRate
      // 
      this.colRate.Text = "Rate";
      // 
      // colFailedItems
      // 
      this.colFailedItems.Text = "Failed Items";
      this.colFailedItems.Width = 400;
      // 
      // panel13
      // 
      this.panel13.Controls.Add(this.lblRunTime);
      this.panel13.Controls.Add(this.btn_Stop);
      this.panel13.Controls.Add(this.lbl_ResultHeader);
      this.panel13.Dock = System.Windows.Forms.DockStyle.Top;
      this.panel13.Location = new System.Drawing.Point(0, 0);
      this.panel13.Name = "panel13";
      this.panel13.Size = new System.Drawing.Size(1071, 34);
      this.panel13.TabIndex = 0;
      // 
      // lblRunTime
      // 
      this.lblRunTime.Location = new System.Drawing.Point(321, 16);
      this.lblRunTime.Name = "lblRunTime";
      this.lblRunTime.RightToLeft = System.Windows.Forms.RightToLeft.No;
      this.lblRunTime.Size = new System.Drawing.Size(60, 13);
      this.lblRunTime.TabIndex = 11;
      this.lblRunTime.Text = "00:00:00";
      this.lblRunTime.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
      this.lblRunTime.Visible = false;
      // 
      // btn_Stop
      // 
      this.btn_Stop.Location = new System.Drawing.Point(240, 6);
      this.btn_Stop.Name = "btn_Stop";
      this.btn_Stop.Size = new System.Drawing.Size(75, 23);
      this.btn_Stop.TabIndex = 10;
      this.btn_Stop.Text = "Stop";
      this.btn_Stop.UseVisualStyleBackColor = true;
      this.btn_Stop.Click += new System.EventHandler(this.btn_Stop_Click);
      // 
      // lbl_ResultHeader
      // 
      this.lbl_ResultHeader.Location = new System.Drawing.Point(387, 16);
      this.lbl_ResultHeader.Name = "lbl_ResultHeader";
      this.lbl_ResultHeader.Size = new System.Drawing.Size(663, 13);
      this.lbl_ResultHeader.TabIndex = 6;
      this.lbl_ResultHeader.Text = "0 of n runs";
      this.lbl_ResultHeader.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
      this.lbl_ResultHeader.Visible = false;
      // 
      // splitter6
      // 
      this.splitter6.Cursor = System.Windows.Forms.Cursors.HSplit;
      this.splitter6.Dock = System.Windows.Forms.DockStyle.Top;
      this.splitter6.Location = new System.Drawing.Point(0, 251);
      this.splitter6.Name = "splitter6";
      this.splitter6.Size = new System.Drawing.Size(1071, 3);
      this.splitter6.TabIndex = 2;
      this.splitter6.TabStop = false;
      // 
      // pnlSimulate
      // 
      this.pnlSimulate.Controls.Add(this.chkDebug);
      this.pnlSimulate.Controls.Add(this.splitter7);
      this.pnlSimulate.Controls.Add(this.panel12);
      this.pnlSimulate.Controls.Add(this.splitter3);
      this.pnlSimulate.Controls.Add(this.panel4);
      this.pnlSimulate.Dock = System.Windows.Forms.DockStyle.Top;
      this.pnlSimulate.Enabled = false;
      this.pnlSimulate.Location = new System.Drawing.Point(0, 0);
      this.pnlSimulate.Name = "pnlSimulate";
      this.pnlSimulate.Size = new System.Drawing.Size(1071, 251);
      this.pnlSimulate.TabIndex = 1;
      // 
      // chkDebug
      // 
      this.chkDebug.Controls.Add(this.tbSavePath2);
      this.chkDebug.Controls.Add(this.button2);
      this.chkDebug.Controls.Add(this.gbPathResults);
      this.chkDebug.Controls.Add(this.label19);
      this.chkDebug.Controls.Add(this.tbSeed);
      this.chkDebug.Controls.Add(this.label18);
      this.chkDebug.Controls.Add(this.chkLog);
      this.chkDebug.Controls.Add(this.grpDebugOpts);
      this.chkDebug.Controls.Add(this.label17);
      this.chkDebug.Controls.Add(this.label16);
      this.chkDebug.Controls.Add(this.button3);
      this.chkDebug.Controls.Add(this.tbSavePath);
      this.chkDebug.Controls.Add(this.label13);
      this.chkDebug.Controls.Add(this.tbMaxSimTime);
      this.chkDebug.Controls.Add(this.label15);
      this.chkDebug.Controls.Add(this.label14);
      this.chkDebug.Controls.Add(this.tbRunCnt);
      this.chkDebug.Controls.Add(this.btnStartSims);
      this.chkDebug.Dock = System.Windows.Forms.DockStyle.Fill;
      this.chkDebug.Location = new System.Drawing.Point(346, 0);
      this.chkDebug.Name = "chkDebug";
      this.chkDebug.Size = new System.Drawing.Size(725, 251);
      this.chkDebug.TabIndex = 3;
      // 
      // tbSavePath2
      // 
      this.tbSavePath2.Location = new System.Drawing.Point(112, 78);
      this.tbSavePath2.Name = "tbSavePath2";
      this.tbSavePath2.Size = new System.Drawing.Size(372, 20);
      this.tbSavePath2.TabIndex = 27;
      this.tbSavePath2.Text = "c:\\temp\\PathResults.json";
      // 
      // button2
      // 
      this.button2.Location = new System.Drawing.Point(490, 76);
      this.button2.Name = "button2";
      this.button2.Size = new System.Drawing.Size(75, 23);
      this.button2.TabIndex = 28;
      this.button2.Text = "Open";
      this.button2.UseVisualStyleBackColor = true;
      this.button2.Click += new System.EventHandler(this.button2_Click_1);
      // 
      // gbPathResults
      // 
      this.gbPathResults.Controls.Add(this.rbJsonPaths);
      this.gbPathResults.Controls.Add(this.rbSimplePath);
      this.gbPathResults.Location = new System.Drawing.Point(112, 108);
      this.gbPathResults.Name = "gbPathResults";
      this.gbPathResults.Size = new System.Drawing.Size(460, 20);
      this.gbPathResults.TabIndex = 39;
      this.gbPathResults.TabStop = false;
      this.gbPathResults.Visible = false;
      // 
      // rbJsonPaths
      // 
      this.rbJsonPaths.AutoSize = true;
      this.rbJsonPaths.Checked = true;
      this.rbJsonPaths.Location = new System.Drawing.Point(92, 9);
      this.rbJsonPaths.Name = "rbJsonPaths";
      this.rbJsonPaths.Size = new System.Drawing.Size(128, 17);
      this.rbJsonPaths.TabIndex = 32;
      this.rbJsonPaths.TabStop = true;
      this.rbJsonPaths.Text = "Detailed Stats (JSON)";
      this.rbJsonPaths.UseVisualStyleBackColor = true;
      this.rbJsonPaths.Visible = false;
      // 
      // rbSimplePath
      // 
      this.rbSimplePath.AutoSize = true;
      this.rbSimplePath.Location = new System.Drawing.Point(6, 9);
      this.rbSimplePath.Name = "rbSimplePath";
      this.rbSimplePath.Size = new System.Drawing.Size(80, 17);
      this.rbSimplePath.TabIndex = 31;
      this.rbSimplePath.Text = "Simple Text";
      this.rbSimplePath.UseVisualStyleBackColor = true;
      this.rbSimplePath.Visible = false;
      this.rbSimplePath.CheckedChanged += new System.EventHandler(this.rbSimplePath_CheckedChanged);
      // 
      // label19
      // 
      this.label19.AutoSize = true;
      this.label19.Location = new System.Drawing.Point(215, 139);
      this.label19.Name = "label19";
      this.label19.Size = new System.Drawing.Size(121, 13);
      this.label19.TabIndex = 36;
      this.label19.Text = "(leave blank for random)";
      // 
      // tbSeed
      // 
      this.tbSeed.Location = new System.Drawing.Point(112, 132);
      this.tbSeed.Name = "tbSeed";
      this.tbSeed.Size = new System.Drawing.Size(100, 20);
      this.tbSeed.TabIndex = 35;
      this.tbSeed.Leave += new System.EventHandler(this.tbSeed_Leave);
      // 
      // label18
      // 
      this.label18.AutoSize = true;
      this.label18.Location = new System.Drawing.Point(12, 135);
      this.label18.Name = "label18";
      this.label18.Size = new System.Drawing.Size(38, 13);
      this.label18.TabIndex = 34;
      this.label18.Text = "Seed :";
      // 
      // chkLog
      // 
      this.chkLog.AutoSize = true;
      this.chkLog.Location = new System.Drawing.Point(136, 162);
      this.chkLog.Name = "chkLog";
      this.chkLog.Size = new System.Drawing.Size(199, 17);
      this.chkLog.TabIndex = 33;
      this.chkLog.Text = "Debug (file debug.txt in run directory)";
      this.chkLog.UseVisualStyleBackColor = true;
      this.chkLog.CheckedChanged += new System.EventHandler(this.chkLog_CheckedChanged);
      // 
      // grpDebugOpts
      // 
      this.grpDebugOpts.Controls.Add(this.label21);
      this.grpDebugOpts.Controls.Add(this.label20);
      this.grpDebugOpts.Controls.Add(this.tbLogRunEnd);
      this.grpDebugOpts.Controls.Add(this.tbLogRunStart);
      this.grpDebugOpts.Controls.Add(this.rbDebugDetailed);
      this.grpDebugOpts.Controls.Add(this.rbDebugBasic);
      this.grpDebugOpts.Enabled = false;
      this.grpDebugOpts.Location = new System.Drawing.Point(136, 171);
      this.grpDebugOpts.Name = "grpDebugOpts";
      this.grpDebugOpts.Size = new System.Drawing.Size(368, 53);
      this.grpDebugOpts.TabIndex = 32;
      this.grpDebugOpts.TabStop = false;
      // 
      // label21
      // 
      this.label21.AutoSize = true;
      this.label21.Location = new System.Drawing.Point(133, 31);
      this.label21.Name = "label21";
      this.label21.Size = new System.Drawing.Size(46, 13);
      this.label21.TabIndex = 38;
      this.label21.Text = "To Run:";
      // 
      // label20
      // 
      this.label20.AutoSize = true;
      this.label20.Location = new System.Drawing.Point(6, 31);
      this.label20.Name = "label20";
      this.label20.Size = new System.Drawing.Size(56, 13);
      this.label20.TabIndex = 37;
      this.label20.Text = "From Run:";
      // 
      // tbLogRunEnd
      // 
      this.tbLogRunEnd.Location = new System.Drawing.Point(185, 28);
      this.tbLogRunEnd.Name = "tbLogRunEnd";
      this.tbLogRunEnd.Size = new System.Drawing.Size(55, 20);
      this.tbLogRunEnd.TabIndex = 34;
      this.tbLogRunEnd.Leave += new System.EventHandler(this.tbLogRunEnd_Leave);
      // 
      // tbLogRunStart
      // 
      this.tbLogRunStart.Location = new System.Drawing.Point(68, 28);
      this.tbLogRunStart.Name = "tbLogRunStart";
      this.tbLogRunStart.Size = new System.Drawing.Size(53, 20);
      this.tbLogRunStart.TabIndex = 33;
      this.tbLogRunStart.Leave += new System.EventHandler(this.tbLogRunStart_Leave);
      // 
      // rbDebugDetailed
      // 
      this.rbDebugDetailed.AutoSize = true;
      this.rbDebugDetailed.Location = new System.Drawing.Point(150, 9);
      this.rbDebugDetailed.Name = "rbDebugDetailed";
      this.rbDebugDetailed.Size = new System.Drawing.Size(183, 17);
      this.rbDebugDetailed.TabIndex = 32;
      this.rbDebugDetailed.TabStop = true;
      this.rbDebugDetailed.Text = "Detailed (States, Actions, Events)";
      this.rbDebugDetailed.UseVisualStyleBackColor = true;
      this.rbDebugDetailed.CheckedChanged += new System.EventHandler(this.rbDebug_CheckedChanged);
      // 
      // rbDebugBasic
      // 
      this.rbDebugBasic.AutoSize = true;
      this.rbDebugBasic.Location = new System.Drawing.Point(6, 9);
      this.rbDebugBasic.Name = "rbDebugBasic";
      this.rbDebugBasic.Size = new System.Drawing.Size(138, 17);
      this.rbDebugBasic.TabIndex = 31;
      this.rbDebugBasic.TabStop = true;
      this.rbDebugBasic.Text = "Basic (State Movement)";
      this.rbDebugBasic.UseVisualStyleBackColor = true;
      this.rbDebugBasic.CheckedChanged += new System.EventHandler(this.rbDebug_CheckedChanged);
      // 
      // label17
      // 
      this.label17.AutoSize = true;
      this.label17.Location = new System.Drawing.Point(12, 81);
      this.label17.Name = "label17";
      this.label17.Size = new System.Drawing.Size(91, 13);
      this.label17.TabIndex = 29;
      this.label17.Text = "Path Results Loc:";
      this.toolTip1.SetToolTip(this.label17, "JSON tree structure with all the satistics for paths, event, and actions");
      // 
      // label16
      // 
      this.label16.AutoSize = true;
      this.label16.Location = new System.Drawing.Point(12, 57);
      this.label16.Name = "label16";
      this.label16.Size = new System.Drawing.Size(95, 13);
      this.label16.TabIndex = 26;
      this.label16.Text = "Basic Results Loc:";
      // 
      // button3
      // 
      this.button3.Location = new System.Drawing.Point(490, 52);
      this.button3.Name = "button3";
      this.button3.Size = new System.Drawing.Size(75, 23);
      this.button3.TabIndex = 25;
      this.button3.Text = "Open";
      this.button3.UseVisualStyleBackColor = true;
      this.button3.Click += new System.EventHandler(this.button3_Click);
      // 
      // tbSavePath
      // 
      this.tbSavePath.Location = new System.Drawing.Point(112, 54);
      this.tbSavePath.Name = "tbSavePath";
      this.tbSavePath.Size = new System.Drawing.Size(372, 20);
      this.tbSavePath.TabIndex = 24;
      this.tbSavePath.Text = "c:\\temp\\NewSimResults.txt";
      // 
      // label13
      // 
      this.label13.AutoSize = true;
      this.label13.Location = new System.Drawing.Point(259, 35);
      this.label13.Name = "label13";
      this.label13.Size = new System.Drawing.Size(238, 13);
      this.label13.TabIndex = 23;
      this.label13.Text = "[days.hh:mm:ss.ms]  Don\'t put 24 hours for 1 day.";
      // 
      // tbMaxSimTime
      // 
      this.tbMaxSimTime.Location = new System.Drawing.Point(112, 31);
      this.tbMaxSimTime.Name = "tbMaxSimTime";
      this.tbMaxSimTime.Size = new System.Drawing.Size(146, 20);
      this.tbMaxSimTime.TabIndex = 22;
      this.tbMaxSimTime.Text = "365.00:00:00";
      // 
      // label15
      // 
      this.label15.AutoSize = true;
      this.label15.Location = new System.Drawing.Point(10, 35);
      this.label15.Name = "label15";
      this.label15.Size = new System.Drawing.Size(79, 13);
      this.label15.TabIndex = 21;
      this.label15.Text = "Max Sim Time :";
      // 
      // label14
      // 
      this.label14.AutoSize = true;
      this.label14.Location = new System.Drawing.Point(12, 12);
      this.label14.Name = "label14";
      this.label14.Size = new System.Drawing.Size(38, 13);
      this.label14.TabIndex = 20;
      this.label14.Text = "Runs :";
      // 
      // tbRunCnt
      // 
      this.tbRunCnt.Location = new System.Drawing.Point(112, 9);
      this.tbRunCnt.Name = "tbRunCnt";
      this.tbRunCnt.Size = new System.Drawing.Size(100, 20);
      this.tbRunCnt.TabIndex = 19;
      this.tbRunCnt.Text = "1000";
      this.tbRunCnt.Leave += new System.EventHandler(this.tbRunCnt_Leave);
      // 
      // btnStartSims
      // 
      this.btnStartSims.Location = new System.Drawing.Point(15, 174);
      this.btnStartSims.Name = "btnStartSims";
      this.btnStartSims.Size = new System.Drawing.Size(75, 23);
      this.btnStartSims.TabIndex = 0;
      this.btnStartSims.Text = "Run";
      this.btnStartSims.UseVisualStyleBackColor = true;
      this.btnStartSims.Click += new System.EventHandler(this.btnStartSims_Click);
      // 
      // splitter7
      // 
      this.splitter7.Location = new System.Drawing.Point(343, 0);
      this.splitter7.Name = "splitter7";
      this.splitter7.Size = new System.Drawing.Size(3, 251);
      this.splitter7.TabIndex = 5;
      this.splitter7.TabStop = false;
      // 
      // panel12
      // 
      this.panel12.Controls.Add(this.lbMonitorVars);
      this.panel12.Controls.Add(this.panel14);
      this.panel12.Dock = System.Windows.Forms.DockStyle.Left;
      this.panel12.Location = new System.Drawing.Point(173, 0);
      this.panel12.Name = "panel12";
      this.panel12.Size = new System.Drawing.Size(170, 251);
      this.panel12.TabIndex = 4;
      // 
      // lbMonitorVars
      // 
      this.lbMonitorVars.CheckOnClick = true;
      this.lbMonitorVars.Dock = System.Windows.Forms.DockStyle.Fill;
      this.lbMonitorVars.FormattingEnabled = true;
      this.lbMonitorVars.Location = new System.Drawing.Point(0, 23);
      this.lbMonitorVars.Name = "lbMonitorVars";
      this.lbMonitorVars.Size = new System.Drawing.Size(170, 228);
      this.lbMonitorVars.TabIndex = 1;
      // 
      // panel14
      // 
      this.panel14.BackColor = System.Drawing.Color.Gainsboro;
      this.panel14.Controls.Add(this.label7);
      this.panel14.Dock = System.Windows.Forms.DockStyle.Top;
      this.panel14.Location = new System.Drawing.Point(0, 0);
      this.panel14.Name = "panel14";
      this.panel14.Size = new System.Drawing.Size(170, 23);
      this.panel14.TabIndex = 0;
      // 
      // label7
      // 
      this.label7.AutoSize = true;
      this.label7.Location = new System.Drawing.Point(3, 5);
      this.label7.Name = "label7";
      this.label7.Size = new System.Drawing.Size(100, 13);
      this.label7.TabIndex = 0;
      this.label7.Text = "Variables to Monitor";
      this.label7.TextAlign = System.Drawing.ContentAlignment.TopCenter;
      // 
      // splitter3
      // 
      this.splitter3.Location = new System.Drawing.Point(170, 0);
      this.splitter3.Name = "splitter3";
      this.splitter3.Size = new System.Drawing.Size(3, 251);
      this.splitter3.TabIndex = 2;
      this.splitter3.TabStop = false;
      // 
      // panel4
      // 
      this.panel4.Controls.Add(this.lbExtSimLinks);
      this.panel4.Controls.Add(this.panel10);
      this.panel4.Dock = System.Windows.Forms.DockStyle.Left;
      this.panel4.Location = new System.Drawing.Point(0, 0);
      this.panel4.Name = "panel4";
      this.panel4.Size = new System.Drawing.Size(170, 251);
      this.panel4.TabIndex = 1;
      // 
      // lbExtSimLinks
      // 
      this.lbExtSimLinks.CheckOnClick = true;
      this.lbExtSimLinks.Dock = System.Windows.Forms.DockStyle.Fill;
      this.lbExtSimLinks.FormattingEnabled = true;
      this.lbExtSimLinks.Location = new System.Drawing.Point(0, 23);
      this.lbExtSimLinks.Name = "lbExtSimLinks";
      this.lbExtSimLinks.Size = new System.Drawing.Size(170, 228);
      this.lbExtSimLinks.TabIndex = 1;
      this.lbExtSimLinks.Click += new System.EventHandler(this.lbExtSimLinks_Click);
      // 
      // panel10
      // 
      this.panel10.BackColor = System.Drawing.Color.Gainsboro;
      this.panel10.Controls.Add(this.label12);
      this.panel10.Dock = System.Windows.Forms.DockStyle.Top;
      this.panel10.Location = new System.Drawing.Point(0, 0);
      this.panel10.Name = "panel10";
      this.panel10.Size = new System.Drawing.Size(170, 23);
      this.panel10.TabIndex = 0;
      // 
      // label12
      // 
      this.label12.AutoSize = true;
      this.label12.Location = new System.Drawing.Point(3, 5);
      this.label12.Name = "label12";
      this.label12.Size = new System.Drawing.Size(141, 13);
      this.label12.TabIndex = 0;
      this.label12.Text = "Links to External Simulations";
      this.label12.TextAlign = System.Drawing.ContentAlignment.TopCenter;
      // 
      // tabLog
      // 
      this.tabLog.Controls.Add(this.rtbLog);
      this.tabLog.Location = new System.Drawing.Point(4, 22);
      this.tabLog.Name = "tabLog";
      this.tabLog.Size = new System.Drawing.Size(1071, 768);
      this.tabLog.TabIndex = 2;
      this.tabLog.Text = "Log";
      this.tabLog.UseVisualStyleBackColor = true;
      // 
      // rtbLog
      // 
      this.rtbLog.Dock = System.Windows.Forms.DockStyle.Fill;
      this.rtbLog.Location = new System.Drawing.Point(0, 0);
      this.rtbLog.Margin = new System.Windows.Forms.Padding(2);
      this.rtbLog.Name = "rtbLog";
      this.rtbLog.ReadOnly = true;
      this.rtbLog.Size = new System.Drawing.Size(1071, 768);
      this.rtbLog.TabIndex = 1;
      this.rtbLog.Text = "";
      // 
      // saveFileDialog1
      // 
      this.saveFileDialog1.DefaultExt = "txt";
      this.saveFileDialog1.Filter = "Text Files (*/txt)|*.txt,*.*";
      this.saveFileDialog1.FileOk += new System.ComponentModel.CancelEventHandler(this.saveFileDialog1_FileOk);
      // 
      // saveFileDialog2
      // 
      this.saveFileDialog2.DefaultExt = "txt";
      this.saveFileDialog2.Filter = "Text Files (*/txt)|*.txt,*.*";
      this.saveFileDialog2.FileOk += new System.ComponentModel.CancelEventHandler(this.saveFileDialog2_FileOk);
      // 
      // FormMain
      // 
      this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
      this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
      this.ClientSize = new System.Drawing.Size(1079, 818);
      this.Controls.Add(this.tcMain);
      this.Controls.Add(this.menuStrip1);
      this.MainMenuStrip = this.menuStrip1;
      this.Name = "FormMain";
      this.Text = "EMRALD Simulation Engine";
      this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.FormMain_FormClosed);
      this.Load += new System.EventHandler(this.FormMain_Load);
      this.menuStrip1.ResumeLayout(false);
      this.menuStrip1.PerformLayout();
      this.tabXMPP.ResumeLayout(false);
      this.panel1.ResumeLayout(false);
      this.panel2.ResumeLayout(false);
      this.pnlJSONGen.ResumeLayout(false);
      this.tabCtrlMsgTypes.ResumeLayout(false);
      this.tabItemData.ResumeLayout(false);
      this.tabItemData.PerformLayout();
      this.tabSimInfo.ResumeLayout(false);
      this.tabSimInfo.PerformLayout();
      this.panel6.ResumeLayout(false);
      this.groupBox1.ResumeLayout(false);
      this.pnlTimePicking.ResumeLayout(false);
      this.pnlTimePicking.PerformLayout();
      this.panel5.ResumeLayout(false);
      this.panel5.PerformLayout();
      this.panel7.ResumeLayout(false);
      this.panel7.PerformLayout();
      this.panel8.ResumeLayout(false);
      this.panel8.PerformLayout();
      this.pnlConInfo.ResumeLayout(false);
      this.groupBoxReceived.ResumeLayout(false);
      this.groupBoxReceived.PerformLayout();
      this.groupBoxClients.ResumeLayout(false);
      this.tabModel.ResumeLayout(false);
      this.tabModel.PerformLayout();
      this.panel3.ResumeLayout(false);
      this.panel15.ResumeLayout(false);
      this.panel15.PerformLayout();
      this.panel9.ResumeLayout(false);
      this.tcMain.ResumeLayout(false);
      this.tabSimulate.ResumeLayout(false);
      this.pnlSimResults.ResumeLayout(false);
      this.panel13.ResumeLayout(false);
      this.pnlSimulate.ResumeLayout(false);
      this.chkDebug.ResumeLayout(false);
      this.chkDebug.PerformLayout();
      this.gbPathResults.ResumeLayout(false);
      this.gbPathResults.PerformLayout();
      this.grpDebugOpts.ResumeLayout(false);
      this.grpDebugOpts.PerformLayout();
      this.panel12.ResumeLayout(false);
      this.panel14.ResumeLayout(false);
      this.panel14.PerformLayout();
      this.panel4.ResumeLayout(false);
      this.panel10.ResumeLayout(false);
      this.panel10.PerformLayout();
      this.tabLog.ResumeLayout(false);
      this.ResumeLayout(false);
      this.PerformLayout();

    }

    #endregion

    private System.Windows.Forms.MenuStrip menuStrip1;
    private System.Windows.Forms.ToolStripMenuItem fileToolStripMenuItem;
    private System.Windows.Forms.ToolStripMenuItem openToolStripMenuItem;
    private System.Windows.Forms.OpenFileDialog openModel;
    private System.Windows.Forms.TabPage tabXMPP;
    private System.Windows.Forms.GroupBox groupBoxClients;
    private System.Windows.Forms.ListBox listBoxClients;
    private System.Windows.Forms.TabPage tabModel;
    private System.Windows.Forms.TabControl tcMain;
    private System.Windows.Forms.GroupBox groupBoxReceived;
    private System.Windows.Forms.RichTextBox rtfReceived;
    private System.Windows.Forms.Splitter splitter1;
    private System.Windows.Forms.Panel pnlConInfo;
    private System.Windows.Forms.TabPage tabLog;
    private System.Windows.Forms.RichTextBox rtbLog;
    private System.Windows.Forms.CheckBox chkClearOnMsg;
    private System.Windows.Forms.Panel panel1;
    private System.Windows.Forms.Panel panel2;
    private System.Windows.Forms.Splitter splitter4;
    private System.Windows.Forms.RichTextBox rtbJSONErrors;
    private System.Windows.Forms.RichTextBox rtbJSONMsg;
    private System.Windows.Forms.Splitter splitter5;
    private System.Windows.Forms.Panel pnlJSONGen;
    private System.Windows.Forms.TabControl tabCtrlMsgTypes;
    private System.Windows.Forms.TabPage tabItemData;
    private System.Windows.Forms.TextBox tbItemDataValue;
    private System.Windows.Forms.Label label5;
    private System.Windows.Forms.TextBox tbItemDataName;
    private System.Windows.Forms.Label compID;
    private System.Windows.Forms.TabPage tabSimInfo;
    private System.Windows.Forms.Panel panel5;
    private System.Windows.Forms.Label label11;
    private System.Windows.Forms.ComboBox cbMsgType;
    private System.Windows.Forms.Panel panel6;
    private System.Windows.Forms.GroupBox groupBox1;
    private System.Windows.Forms.RichTextBox rtbMsgInfo;
    private System.Windows.Forms.Button btnGenMsg;
    private System.Windows.Forms.Panel panel7;
    private System.Windows.Forms.Label label1;
    private System.Windows.Forms.Button btnSendMsg;
    private System.Windows.Forms.ComboBox cbRegisteredClients;
    private System.Windows.Forms.Panel panel8;
    private System.Windows.Forms.TextBox tbDispName;
    private System.Windows.Forms.Label label10;
    private System.Windows.Forms.Label lblSimTime;
    private System.Windows.Forms.TextBox tbMsgDesc;
    private System.Windows.Forms.Label lblMsgTime;
    private System.Windows.Forms.Label lblManMsgDesc;
    private System.Windows.Forms.Label lblSendManualMsg;
    private System.Windows.Forms.Panel pnlTimePicking;
    private System.Windows.Forms.Label label2;
    private System.Windows.Forms.Label label3;
    private System.Windows.Forms.TextBox tbTimeSpan;
    private System.Windows.Forms.TextBox tbConfigData;
    private System.Windows.Forms.Label label4;
    private System.Windows.Forms.TextBox tbModelRef;
    private System.Windows.Forms.Label label6;
    private System.Windows.Forms.TextBox tbEndTime;
    private System.Windows.Forms.Label label8;
    private System.Windows.Forms.Label label9;
    private System.Windows.Forms.TabPage tabSimulate;
    private System.Windows.Forms.Panel pnlSimulate;
    private System.Windows.Forms.Button btnStartSims;
    private System.Windows.Forms.TextBox txtMStatus;
    private System.Windows.Forms.TextBox txtModel;
    private System.Windows.Forms.Splitter splitter2;
    private System.Windows.Forms.Panel panel3;
    private System.Windows.Forms.Panel panel9;
    private System.Windows.Forms.Button btnValidateModel;
    private System.Windows.Forms.Panel panel4;
    private System.Windows.Forms.Panel panel10;
    private System.Windows.Forms.Label label12;
    private System.Windows.Forms.Panel chkDebug;
    private System.Windows.Forms.Splitter splitter3;
    private System.Windows.Forms.CheckedListBox lbExtSimLinks;
    private System.Windows.Forms.Label label14;
    private System.Windows.Forms.TextBox tbRunCnt;
    private System.Windows.Forms.Label label13;
    private System.Windows.Forms.TextBox tbMaxSimTime;
    private System.Windows.Forms.Label label15;
    private System.Windows.Forms.Panel pnlSimResults;
    private System.Windows.Forms.Panel panel13;
    private System.Windows.Forms.Splitter splitter6;
    private System.Windows.Forms.Label lbl_ResultHeader;
    private System.Windows.Forms.Button btn_Stop;
    private System.Windows.Forms.Label label16;
    private System.Windows.Forms.Button button3;
    private System.Windows.Forms.TextBox tbSavePath;
    private System.Windows.Forms.ListView lvResults;
    private System.Windows.Forms.ColumnHeader colKeyState;
    private System.Windows.Forms.ColumnHeader colFailureCnt;
    private System.Windows.Forms.ColumnHeader colRate;
    private System.Windows.Forms.ColumnHeader colFailedItems;
    private System.Windows.Forms.Label lblRunTime;
    private System.Windows.Forms.Splitter splitter7;
    private System.Windows.Forms.Panel panel12;
    private System.Windows.Forms.CheckedListBox lbMonitorVars;
    private System.Windows.Forms.Panel panel14;
    private System.Windows.Forms.Label label7;
    private System.Windows.Forms.ToolStripMenuItem defaultLoadToolStripMenuItem;
    private System.Windows.Forms.Button button1;
    private System.Windows.Forms.ListView lvVarValues;
    private System.Windows.Forms.ColumnHeader colName;
    private System.Windows.Forms.ColumnHeader colValue;
    private System.Windows.Forms.Splitter splitter8;
    private System.Windows.Forms.Panel panel15;
    private System.Windows.Forms.SaveFileDialog saveFileDialog1;
    private System.Windows.Forms.Label label17;
    private System.Windows.Forms.Button button2;
    private System.Windows.Forms.TextBox tbSavePath2;
    private System.Windows.Forms.SaveFileDialog saveFileDialog2;
    private System.Windows.Forms.CheckBox chkLog;
    private System.Windows.Forms.GroupBox grpDebugOpts;
    private System.Windows.Forms.RadioButton rbDebugDetailed;
    private System.Windows.Forms.RadioButton rbDebugBasic;
    private System.Windows.Forms.Label label19;
    private System.Windows.Forms.TextBox tbSeed;
    private System.Windows.Forms.Label label18;
    private System.Windows.Forms.Label label21;
    private System.Windows.Forms.Label label20;
    private System.Windows.Forms.TextBox tbLogRunEnd;
    private System.Windows.Forms.TextBox tbLogRunStart;
    private System.Windows.Forms.GroupBox gbPathResults;
    private System.Windows.Forms.RadioButton rbJsonPaths;
    private System.Windows.Forms.RadioButton rbSimplePath;
    private System.Windows.Forms.ToolTip toolTip1;
  }
}

