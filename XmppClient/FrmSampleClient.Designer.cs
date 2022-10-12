﻿// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace XmppMessageClient
{
    partial class FrmSampleClient
    {
        private System.ComponentModel.Container components = null;

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

       


        #region Form-Designer Code

        private void InitializeComponent()
        {
      this.statusBarClient = new System.Windows.Forms.StatusStrip();
      this.cmdDisconnect = new System.Windows.Forms.Button();
      this.cmdConnect = new System.Windows.Forms.Button();
      this.textBoxHost = new System.Windows.Forms.TextBox();
      this.label4 = new System.Windows.Forms.Label();
      this.textBoxUser = new System.Windows.Forms.TextBox();
      this.label2 = new System.Windows.Forms.Label();
      this.textboxResource = new System.Windows.Forms.TextBox();
      this.label1 = new System.Windows.Forms.Label();
      this.tabControl1 = new System.Windows.Forms.TabControl();
      this.tabConnection = new System.Windows.Forms.TabPage();
      this.panel3 = new System.Windows.Forms.Panel();
      this.lblHowMany = new System.Windows.Forms.Label();
      this.tbHowMany = new System.Windows.Forms.TextBox();
      this.lblClientMsg = new System.Windows.Forms.Label();
      this.btnSendMsg = new System.Windows.Forms.Button();
      this.cbResources = new System.Windows.Forms.ComboBox();
      this.tabMsgSending = new System.Windows.Forms.TabControl();
      this.tabPgManual = new System.Windows.Forms.TabPage();
      this.pnlSendMsg = new System.Windows.Forms.Panel();
      this.panel4 = new System.Windows.Forms.Panel();
      this.splitter3 = new System.Windows.Forms.Splitter();
      this.rtbJSONErrors = new System.Windows.Forms.RichTextBox();
      this.rtbJSONMsg = new System.Windows.Forms.RichTextBox();
      this.splitter2 = new System.Windows.Forms.Splitter();
      this.pnlJSONGen = new System.Windows.Forms.Panel();
      this.tabCtrlMsgTypes = new System.Windows.Forms.TabControl();
      this.tabItemData = new System.Windows.Forms.TabPage();
      this.tbItemDataValue = new System.Windows.Forms.TextBox();
      this.label5 = new System.Windows.Forms.Label();
      this.tbItemDataName = new System.Windows.Forms.TextBox();
      this.compID = new System.Windows.Forms.Label();
      this.tabStatus = new System.Windows.Forms.TabPage();
      this.cbStatusMsgType = new System.Windows.Forms.ComboBox();
      this.panel1 = new System.Windows.Forms.Panel();
      this.label11 = new System.Windows.Forms.Label();
      this.cbMsgType = new System.Windows.Forms.ComboBox();
      this.panel2 = new System.Windows.Forms.Panel();
      this.groupBox1 = new System.Windows.Forms.GroupBox();
      this.rtbMsgInfo = new System.Windows.Forms.RichTextBox();
      this.btnGenMsg = new System.Windows.Forms.Button();
      this.panel5 = new System.Windows.Forms.Panel();
      this.tbDispName = new System.Windows.Forms.TextBox();
      this.label10 = new System.Windows.Forms.Label();
      this.label3 = new System.Windows.Forms.Label();
      this.tbTimeSpan = new System.Windows.Forms.TextBox();
      this.tbMsgDesc = new System.Windows.Forms.TextBox();
      this.lblMsgTime = new System.Windows.Forms.Label();
      this.lblManMsgDesc = new System.Windows.Forms.Label();
      this.lblSendManualMsg = new System.Windows.Forms.Label();
      this.tabPgTestFile = new System.Windows.Forms.TabPage();
      this.tbTestMsg = new System.Windows.Forms.TextBox();
      this.btnOpenTestMsgFile = new System.Windows.Forms.Button();
      this.label6 = new System.Windows.Forms.Label();
      this.tbTestMsgFile = new System.Windows.Forms.TextBox();
      this.panelConnection = new System.Windows.Forms.Panel();
      this.label9 = new System.Windows.Forms.Label();
      this.textBoxDomain = new System.Windows.Forms.TextBox();
      this.tabMessages = new System.Windows.Forms.TabPage();
      this.groupBoxReceived = new System.Windows.Forms.GroupBox();
      this.rtfReceived = new System.Windows.Forms.RichTextBox();
      this.groupBoxClients = new System.Windows.Forms.GroupBox();
      this.listBoxClients = new System.Windows.Forms.ListBox();
      this.tabLog = new System.Windows.Forms.TabPage();
      this.rtbLog = new System.Windows.Forms.RichTextBox();
      this.dlgOpenTestMsgFile = new System.Windows.Forms.OpenFileDialog();
      this.tabControl1.SuspendLayout();
      this.tabConnection.SuspendLayout();
      this.panel3.SuspendLayout();
      this.tabMsgSending.SuspendLayout();
      this.tabPgManual.SuspendLayout();
      this.pnlSendMsg.SuspendLayout();
      this.panel4.SuspendLayout();
      this.pnlJSONGen.SuspendLayout();
      this.tabCtrlMsgTypes.SuspendLayout();
      this.tabItemData.SuspendLayout();
      this.tabStatus.SuspendLayout();
      this.panel1.SuspendLayout();
      this.panel2.SuspendLayout();
      this.groupBox1.SuspendLayout();
      this.panel5.SuspendLayout();
      this.tabPgTestFile.SuspendLayout();
      this.panelConnection.SuspendLayout();
      this.tabMessages.SuspendLayout();
      this.groupBoxReceived.SuspendLayout();
      this.groupBoxClients.SuspendLayout();
      this.tabLog.SuspendLayout();
      this.SuspendLayout();
      // 
      // statusBarClient
      // 
      this.statusBarClient.Location = new System.Drawing.Point(0, 764);
      this.statusBarClient.Name = "statusBarClient";
      this.statusBarClient.Size = new System.Drawing.Size(722, 22);
      this.statusBarClient.TabIndex = 5;
      // 
      // cmdDisconnect
      // 
      this.cmdDisconnect.Enabled = false;
      this.cmdDisconnect.Location = new System.Drawing.Point(3, 33);
      this.cmdDisconnect.Name = "cmdDisconnect";
      this.cmdDisconnect.Size = new System.Drawing.Size(101, 25);
      this.cmdDisconnect.TabIndex = 20;
      this.cmdDisconnect.Text = "Disconnect";
      this.cmdDisconnect.UseVisualStyleBackColor = true;
      this.cmdDisconnect.Click += new System.EventHandler(this.cmdDisconnect_Click);
      // 
      // cmdConnect
      // 
      this.cmdConnect.Location = new System.Drawing.Point(3, 3);
      this.cmdConnect.Name = "cmdConnect";
      this.cmdConnect.Size = new System.Drawing.Size(101, 25);
      this.cmdConnect.TabIndex = 19;
      this.cmdConnect.Text = "Connect";
      this.cmdConnect.UseVisualStyleBackColor = true;
      this.cmdConnect.Click += new System.EventHandler(this.cmdConnect_Click);
      // 
      // textBoxHost
      // 
      this.textBoxHost.Location = new System.Drawing.Point(184, 38);
      this.textBoxHost.Name = "textBoxHost";
      this.textBoxHost.Size = new System.Drawing.Size(167, 23);
      this.textBoxHost.TabIndex = 18;
      this.textBoxHost.Text = "localhost";
      this.textBoxHost.Visible = false;
      // 
      // label4
      // 
      this.label4.AutoSize = true;
      this.label4.Location = new System.Drawing.Point(123, 38);
      this.label4.Name = "label4";
      this.label4.Size = new System.Drawing.Size(35, 15);
      this.label4.TabIndex = 17;
      this.label4.Text = "Host:";
      this.label4.Visible = false;
      // 
      // textBoxUser
      // 
      this.textBoxUser.Location = new System.Drawing.Point(184, 8);
      this.textBoxUser.Name = "textBoxUser";
      this.textBoxUser.Size = new System.Drawing.Size(167, 23);
      this.textBoxUser.TabIndex = 16;
      this.textBoxUser.Text = "User1";
      // 
      // label2
      // 
      this.label2.AutoSize = true;
      this.label2.Location = new System.Drawing.Point(123, 9);
      this.label2.Name = "label2";
      this.label2.Size = new System.Drawing.Size(33, 15);
      this.label2.TabIndex = 15;
      this.label2.Text = "User:";
      // 
      // textboxResource
      // 
      this.textboxResource.Location = new System.Drawing.Point(431, 38);
      this.textboxResource.Name = "textboxResource";
      this.textboxResource.Size = new System.Drawing.Size(167, 23);
      this.textboxResource.TabIndex = 14;
      this.textboxResource.Text = "MyApp";
      // 
      // label1
      // 
      this.label1.AutoSize = true;
      this.label1.Location = new System.Drawing.Point(370, 41);
      this.label1.Name = "label1";
      this.label1.Size = new System.Drawing.Size(58, 15);
      this.label1.TabIndex = 13;
      this.label1.Text = "Resource:";
      // 
      // tabControl1
      // 
      this.tabControl1.Controls.Add(this.tabConnection);
      this.tabControl1.Controls.Add(this.tabMessages);
      this.tabControl1.Controls.Add(this.tabLog);
      this.tabControl1.Dock = System.Windows.Forms.DockStyle.Fill;
      this.tabControl1.Location = new System.Drawing.Point(0, 0);
      this.tabControl1.Name = "tabControl1";
      this.tabControl1.SelectedIndex = 0;
      this.tabControl1.Size = new System.Drawing.Size(722, 764);
      this.tabControl1.TabIndex = 19;
      // 
      // tabConnection
      // 
      this.tabConnection.Controls.Add(this.panel3);
      this.tabConnection.Controls.Add(this.tabMsgSending);
      this.tabConnection.Controls.Add(this.panelConnection);
      this.tabConnection.Location = new System.Drawing.Point(4, 24);
      this.tabConnection.Name = "tabConnection";
      this.tabConnection.Padding = new System.Windows.Forms.Padding(3);
      this.tabConnection.Size = new System.Drawing.Size(714, 736);
      this.tabConnection.TabIndex = 0;
      this.tabConnection.Text = "Connections/Send";
      this.tabConnection.UseVisualStyleBackColor = true;
      // 
      // panel3
      // 
      this.panel3.Controls.Add(this.lblHowMany);
      this.panel3.Controls.Add(this.tbHowMany);
      this.panel3.Controls.Add(this.lblClientMsg);
      this.panel3.Controls.Add(this.btnSendMsg);
      this.panel3.Controls.Add(this.cbResources);
      this.panel3.Dock = System.Windows.Forms.DockStyle.Bottom;
      this.panel3.Location = new System.Drawing.Point(3, 699);
      this.panel3.Name = "panel3";
      this.panel3.Size = new System.Drawing.Size(708, 34);
      this.panel3.TabIndex = 27;
      // 
      // lblHowMany
      // 
      this.lblHowMany.AutoSize = true;
      this.lblHowMany.Location = new System.Drawing.Point(270, 15);
      this.lblHowMany.Name = "lblHowMany";
      this.lblHowMany.Size = new System.Drawing.Size(65, 15);
      this.lblHowMany.TabIndex = 22;
      this.lblHowMany.Text = "How Many";
      this.lblHowMany.Visible = false;
      // 
      // tbHowMany
      // 
      this.tbHowMany.Location = new System.Drawing.Point(335, 7);
      this.tbHowMany.Name = "tbHowMany";
      this.tbHowMany.Size = new System.Drawing.Size(36, 23);
      this.tbHowMany.TabIndex = 21;
      this.tbHowMany.Text = "1";
      this.tbHowMany.Visible = false;
      this.tbHowMany.Leave += new System.EventHandler(this.tbHowMany_Leave);
      // 
      // lblClientMsg
      // 
      this.lblClientMsg.AutoSize = true;
      this.lblClientMsg.Location = new System.Drawing.Point(3, 14);
      this.lblClientMsg.Name = "lblClientMsg";
      this.lblClientMsg.Size = new System.Drawing.Size(53, 15);
      this.lblClientMsg.TabIndex = 7;
      this.lblClientMsg.Text = "Send to :";
      // 
      // btnSendMsg
      // 
      this.btnSendMsg.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
      this.btnSendMsg.Location = new System.Drawing.Point(394, 7);
      this.btnSendMsg.Name = "btnSendMsg";
      this.btnSendMsg.Size = new System.Drawing.Size(121, 23);
      this.btnSendMsg.TabIndex = 0;
      this.btnSendMsg.Text = "Send";
      this.btnSendMsg.UseVisualStyleBackColor = true;
      this.btnSendMsg.Click += new System.EventHandler(this.btnSendMsg_Click);
      // 
      // cbResources
      // 
      this.cbResources.FormattingEnabled = true;
      this.cbResources.Items.AddRange(new object[] {
            "EMRALD"});
      this.cbResources.Location = new System.Drawing.Point(62, 7);
      this.cbResources.Name = "cbResources";
      this.cbResources.Size = new System.Drawing.Size(188, 23);
      this.cbResources.TabIndex = 0;
      // 
      // tabMsgSending
      // 
      this.tabMsgSending.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
      this.tabMsgSending.Controls.Add(this.tabPgManual);
      this.tabMsgSending.Controls.Add(this.tabPgTestFile);
      this.tabMsgSending.Location = new System.Drawing.Point(3, 73);
      this.tabMsgSending.Name = "tabMsgSending";
      this.tabMsgSending.SelectedIndex = 0;
      this.tabMsgSending.Size = new System.Drawing.Size(708, 627);
      this.tabMsgSending.TabIndex = 9;
      this.tabMsgSending.SelectedIndexChanged += new System.EventHandler(this.tabMsgSending_SelectedIndexChanged);
      // 
      // tabPgManual
      // 
      this.tabPgManual.Controls.Add(this.pnlSendMsg);
      this.tabPgManual.Location = new System.Drawing.Point(4, 24);
      this.tabPgManual.Name = "tabPgManual";
      this.tabPgManual.Padding = new System.Windows.Forms.Padding(3);
      this.tabPgManual.Size = new System.Drawing.Size(700, 599);
      this.tabPgManual.TabIndex = 0;
      this.tabPgManual.Text = "Manual";
      this.tabPgManual.UseVisualStyleBackColor = true;
      // 
      // pnlSendMsg
      // 
      this.pnlSendMsg.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
      this.pnlSendMsg.Controls.Add(this.panel4);
      this.pnlSendMsg.Controls.Add(this.panel5);
      this.pnlSendMsg.Dock = System.Windows.Forms.DockStyle.Fill;
      this.pnlSendMsg.Location = new System.Drawing.Point(3, 3);
      this.pnlSendMsg.Name = "pnlSendMsg";
      this.pnlSendMsg.Size = new System.Drawing.Size(694, 593);
      this.pnlSendMsg.TabIndex = 27;
      // 
      // panel4
      // 
      this.panel4.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
      this.panel4.Controls.Add(this.splitter3);
      this.panel4.Controls.Add(this.rtbJSONErrors);
      this.panel4.Controls.Add(this.rtbJSONMsg);
      this.panel4.Controls.Add(this.splitter2);
      this.panel4.Controls.Add(this.pnlJSONGen);
      this.panel4.Dock = System.Windows.Forms.DockStyle.Fill;
      this.panel4.Location = new System.Drawing.Point(0, 93);
      this.panel4.Name = "panel4";
      this.panel4.Size = new System.Drawing.Size(690, 496);
      this.panel4.TabIndex = 28;
      // 
      // splitter3
      // 
      this.splitter3.Dock = System.Windows.Forms.DockStyle.Bottom;
      this.splitter3.Location = new System.Drawing.Point(0, 391);
      this.splitter3.Name = "splitter3";
      this.splitter3.Size = new System.Drawing.Size(688, 3);
      this.splitter3.TabIndex = 6;
      this.splitter3.TabStop = false;
      // 
      // rtbJSONErrors
      // 
      this.rtbJSONErrors.BackColor = System.Drawing.SystemColors.Control;
      this.rtbJSONErrors.Dock = System.Windows.Forms.DockStyle.Bottom;
      this.rtbJSONErrors.Location = new System.Drawing.Point(0, 394);
      this.rtbJSONErrors.Name = "rtbJSONErrors";
      this.rtbJSONErrors.Size = new System.Drawing.Size(688, 100);
      this.rtbJSONErrors.TabIndex = 5;
      this.rtbJSONErrors.Text = "JSON Errors";
      this.rtbJSONErrors.Visible = false;
      // 
      // rtbJSONMsg
      // 
      this.rtbJSONMsg.BackColor = System.Drawing.SystemColors.Control;
      this.rtbJSONMsg.Dock = System.Windows.Forms.DockStyle.Fill;
      this.rtbJSONMsg.Location = new System.Drawing.Point(0, 229);
      this.rtbJSONMsg.Name = "rtbJSONMsg";
      this.rtbJSONMsg.Size = new System.Drawing.Size(688, 265);
      this.rtbJSONMsg.TabIndex = 3;
      this.rtbJSONMsg.Text = "";
      // 
      // splitter2
      // 
      this.splitter2.Dock = System.Windows.Forms.DockStyle.Top;
      this.splitter2.Location = new System.Drawing.Point(0, 226);
      this.splitter2.Name = "splitter2";
      this.splitter2.Size = new System.Drawing.Size(688, 3);
      this.splitter2.TabIndex = 2;
      this.splitter2.TabStop = false;
      // 
      // pnlJSONGen
      // 
      this.pnlJSONGen.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
      this.pnlJSONGen.Controls.Add(this.tabCtrlMsgTypes);
      this.pnlJSONGen.Controls.Add(this.panel1);
      this.pnlJSONGen.Controls.Add(this.panel2);
      this.pnlJSONGen.Dock = System.Windows.Forms.DockStyle.Top;
      this.pnlJSONGen.Location = new System.Drawing.Point(0, 0);
      this.pnlJSONGen.Name = "pnlJSONGen";
      this.pnlJSONGen.Size = new System.Drawing.Size(688, 226);
      this.pnlJSONGen.TabIndex = 4;
      // 
      // tabCtrlMsgTypes
      // 
      this.tabCtrlMsgTypes.Controls.Add(this.tabItemData);
      this.tabCtrlMsgTypes.Controls.Add(this.tabStatus);
      this.tabCtrlMsgTypes.Dock = System.Windows.Forms.DockStyle.Fill;
      this.tabCtrlMsgTypes.ItemSize = new System.Drawing.Size(100, 18);
      this.tabCtrlMsgTypes.Location = new System.Drawing.Point(0, 31);
      this.tabCtrlMsgTypes.Multiline = true;
      this.tabCtrlMsgTypes.Name = "tabCtrlMsgTypes";
      this.tabCtrlMsgTypes.SelectedIndex = 0;
      this.tabCtrlMsgTypes.Size = new System.Drawing.Size(686, 87);
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
      this.tabItemData.Size = new System.Drawing.Size(678, 61);
      this.tabItemData.TabIndex = 0;
      this.tabItemData.Text = "ItemData";
      // 
      // tbItemDataValue
      // 
      this.tbItemDataValue.Location = new System.Drawing.Point(71, 35);
      this.tbItemDataValue.Name = "tbItemDataValue";
      this.tbItemDataValue.Size = new System.Drawing.Size(146, 23);
      this.tbItemDataValue.TabIndex = 8;
      this.tbItemDataValue.Text = "1";
      // 
      // label5
      // 
      this.label5.AutoSize = true;
      this.label5.Location = new System.Drawing.Point(10, 38);
      this.label5.Name = "label5";
      this.label5.Size = new System.Drawing.Size(41, 15);
      this.label5.TabIndex = 7;
      this.label5.Text = "Value :";
      // 
      // tbItemDataName
      // 
      this.tbItemDataName.Location = new System.Drawing.Point(71, 10);
      this.tbItemDataName.Name = "tbItemDataName";
      this.tbItemDataName.Size = new System.Drawing.Size(146, 23);
      this.tbItemDataName.TabIndex = 6;
      this.tbItemDataName.Text = "CompName";
      // 
      // compID
      // 
      this.compID.AutoSize = true;
      this.compID.Location = new System.Drawing.Point(10, 13);
      this.compID.Name = "compID";
      this.compID.Size = new System.Drawing.Size(59, 15);
      this.compID.TabIndex = 5;
      this.compID.Text = "Name ID :";
      // 
      // tabStatus
      // 
      this.tabStatus.BackColor = System.Drawing.Color.Gainsboro;
      this.tabStatus.Controls.Add(this.cbStatusMsgType);
      this.tabStatus.Location = new System.Drawing.Point(4, 22);
      this.tabStatus.Name = "tabStatus";
      this.tabStatus.Size = new System.Drawing.Size(678, 61);
      this.tabStatus.TabIndex = 0;
      this.tabStatus.Text = "Status";
      this.tabStatus.Enter += new System.EventHandler(this.tabStatus_Enter);
      // 
      // cbStatusMsgType
      // 
      this.cbStatusMsgType.FormattingEnabled = true;
      this.cbStatusMsgType.Items.AddRange(new object[] {
            "Waiting",
            "Loading",
            "Running",
            "Done",
            "Error"});
      this.cbStatusMsgType.Location = new System.Drawing.Point(7, 3);
      this.cbStatusMsgType.Name = "cbStatusMsgType";
      this.cbStatusMsgType.Size = new System.Drawing.Size(123, 23);
      this.cbStatusMsgType.TabIndex = 14;
      // 
      // panel1
      // 
      this.panel1.BackColor = System.Drawing.Color.Gainsboro;
      this.panel1.Controls.Add(this.label11);
      this.panel1.Controls.Add(this.cbMsgType);
      this.panel1.Dock = System.Windows.Forms.DockStyle.Top;
      this.panel1.Location = new System.Drawing.Point(0, 0);
      this.panel1.Name = "panel1";
      this.panel1.Size = new System.Drawing.Size(686, 31);
      this.panel1.TabIndex = 3;
      // 
      // label11
      // 
      this.label11.AutoSize = true;
      this.label11.Location = new System.Drawing.Point(182, 7);
      this.label11.Name = "label11";
      this.label11.Size = new System.Drawing.Size(92, 15);
      this.label11.TabIndex = 1;
      this.label11.Text = "Event Msg Type:";
      // 
      // cbMsgType
      // 
      this.cbMsgType.FormattingEnabled = true;
      this.cbMsgType.Items.AddRange(new object[] {
            "CompEv",
            "Timer",
            "SimStarted",
            "EndSim",
            "Ping",
            "Status"});
      this.cbMsgType.Location = new System.Drawing.Point(276, 4);
      this.cbMsgType.Name = "cbMsgType";
      this.cbMsgType.Size = new System.Drawing.Size(121, 23);
      this.cbMsgType.TabIndex = 0;
      this.cbMsgType.SelectedIndexChanged += new System.EventHandler(this.cbMsgType_SelectedIndexChanged);
      // 
      // panel2
      // 
      this.panel2.BackColor = System.Drawing.Color.Gainsboro;
      this.panel2.Controls.Add(this.groupBox1);
      this.panel2.Controls.Add(this.btnGenMsg);
      this.panel2.Dock = System.Windows.Forms.DockStyle.Bottom;
      this.panel2.Location = new System.Drawing.Point(0, 118);
      this.panel2.Name = "panel2";
      this.panel2.Size = new System.Drawing.Size(686, 106);
      this.panel2.TabIndex = 2;
      // 
      // groupBox1
      // 
      this.groupBox1.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
      this.groupBox1.Controls.Add(this.rtbMsgInfo);
      this.groupBox1.Location = new System.Drawing.Point(4, 3);
      this.groupBox1.Name = "groupBox1";
      this.groupBox1.Size = new System.Drawing.Size(1186, 68);
      this.groupBox1.TabIndex = 12;
      this.groupBox1.TabStop = false;
      this.groupBox1.Text = "Info (Likely JSON)";
      // 
      // rtbMsgInfo
      // 
      this.rtbMsgInfo.Dock = System.Windows.Forms.DockStyle.Fill;
      this.rtbMsgInfo.Location = new System.Drawing.Point(3, 19);
      this.rtbMsgInfo.Name = "rtbMsgInfo";
      this.rtbMsgInfo.Size = new System.Drawing.Size(1180, 46);
      this.rtbMsgInfo.TabIndex = 0;
      this.rtbMsgInfo.Text = "";
      // 
      // btnGenMsg
      // 
      this.btnGenMsg.Anchor = System.Windows.Forms.AnchorStyles.Bottom;
      this.btnGenMsg.Location = new System.Drawing.Point(528, 77);
      this.btnGenMsg.Name = "btnGenMsg";
      this.btnGenMsg.Size = new System.Drawing.Size(119, 23);
      this.btnGenMsg.TabIndex = 1;
      this.btnGenMsg.Text = "Generate Message";
      this.btnGenMsg.UseVisualStyleBackColor = true;
      this.btnGenMsg.Click += new System.EventHandler(this.btnGenMsg_Click);
      // 
      // panel5
      // 
      this.panel5.BackColor = System.Drawing.Color.Gainsboro;
      this.panel5.Controls.Add(this.tbDispName);
      this.panel5.Controls.Add(this.label10);
      this.panel5.Controls.Add(this.label3);
      this.panel5.Controls.Add(this.tbTimeSpan);
      this.panel5.Controls.Add(this.tbMsgDesc);
      this.panel5.Controls.Add(this.lblMsgTime);
      this.panel5.Controls.Add(this.lblManMsgDesc);
      this.panel5.Controls.Add(this.lblSendManualMsg);
      this.panel5.Dock = System.Windows.Forms.DockStyle.Top;
      this.panel5.Location = new System.Drawing.Point(0, 0);
      this.panel5.Name = "panel5";
      this.panel5.Size = new System.Drawing.Size(690, 93);
      this.panel5.TabIndex = 27;
      // 
      // tbDispName
      // 
      this.tbDispName.Location = new System.Drawing.Point(89, 17);
      this.tbDispName.Name = "tbDispName";
      this.tbDispName.Size = new System.Drawing.Size(146, 23);
      this.tbDispName.TabIndex = 8;
      this.tbDispName.Text = "EventName";
      // 
      // label10
      // 
      this.label10.AutoSize = true;
      this.label10.Location = new System.Drawing.Point(10, 17);
      this.label10.Name = "label10";
      this.label10.Size = new System.Drawing.Size(68, 15);
      this.label10.TabIndex = 7;
      this.label10.Text = "DispName :";
      // 
      // label3
      // 
      this.label3.AutoSize = true;
      this.label3.Location = new System.Drawing.Point(241, 68);
      this.label3.Name = "label3";
      this.label3.Size = new System.Drawing.Size(288, 15);
      this.label3.TabIndex = 6;
      this.label3.Text = "Time [hh:mm:ss.ms] from current run time (optional)";
      // 
      // tbTimeSpan
      // 
      this.tbTimeSpan.Location = new System.Drawing.Point(89, 61);
      this.tbTimeSpan.Name = "tbTimeSpan";
      this.tbTimeSpan.Size = new System.Drawing.Size(146, 23);
      this.tbTimeSpan.TabIndex = 5;
      this.tbTimeSpan.Text = "00:00:00";
      // 
      // tbMsgDesc
      // 
      this.tbMsgDesc.Location = new System.Drawing.Point(89, 38);
      this.tbMsgDesc.Name = "tbMsgDesc";
      this.tbMsgDesc.Size = new System.Drawing.Size(469, 23);
      this.tbMsgDesc.TabIndex = 3;
      this.tbMsgDesc.Text = "Some Event";
      // 
      // lblMsgTime
      // 
      this.lblMsgTime.AutoSize = true;
      this.lblMsgTime.Location = new System.Drawing.Point(10, 64);
      this.lblMsgTime.Name = "lblMsgTime";
      this.lblMsgTime.Size = new System.Drawing.Size(80, 15);
      this.lblMsgTime.TabIndex = 2;
      this.lblMsgTime.Text = "Occure Time :";
      // 
      // lblManMsgDesc
      // 
      this.lblManMsgDesc.AutoSize = true;
      this.lblManMsgDesc.Location = new System.Drawing.Point(10, 38);
      this.lblManMsgDesc.Name = "lblManMsgDesc";
      this.lblManMsgDesc.Size = new System.Drawing.Size(73, 15);
      this.lblManMsgDesc.TabIndex = 1;
      this.lblManMsgDesc.Text = "Description :";
      // 
      // lblSendManualMsg
      // 
      this.lblSendManualMsg.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
      this.lblSendManualMsg.AutoSize = true;
      this.lblSendManualMsg.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point);
      this.lblSendManualMsg.Location = new System.Drawing.Point(232, 1);
      this.lblSendManualMsg.Name = "lblSendManualMsg";
      this.lblSendManualMsg.Size = new System.Drawing.Size(208, 16);
      this.lblSendManualMsg.TabIndex = 1;
      this.lblSendManualMsg.Text = "Send Manual Event Message";
      this.lblSendManualMsg.TextAlign = System.Drawing.ContentAlignment.TopCenter;
      // 
      // tabPgTestFile
      // 
      this.tabPgTestFile.Controls.Add(this.tbTestMsg);
      this.tabPgTestFile.Controls.Add(this.btnOpenTestMsgFile);
      this.tabPgTestFile.Controls.Add(this.label6);
      this.tabPgTestFile.Controls.Add(this.tbTestMsgFile);
      this.tabPgTestFile.Location = new System.Drawing.Point(4, 24);
      this.tabPgTestFile.Name = "tabPgTestFile";
      this.tabPgTestFile.Padding = new System.Windows.Forms.Padding(3);
      this.tabPgTestFile.Size = new System.Drawing.Size(700, 599);
      this.tabPgTestFile.TabIndex = 1;
      this.tabPgTestFile.Text = "Test File";
      this.tabPgTestFile.UseVisualStyleBackColor = true;
      // 
      // tbTestMsg
      // 
      this.tbTestMsg.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
      this.tbTestMsg.Location = new System.Drawing.Point(3, 38);
      this.tbTestMsg.Multiline = true;
      this.tbTestMsg.Name = "tbTestMsg";
      this.tbTestMsg.ScrollBars = System.Windows.Forms.ScrollBars.Both;
      this.tbTestMsg.Size = new System.Drawing.Size(697, 555);
      this.tbTestMsg.TabIndex = 22;
      this.tbTestMsg.TextChanged += new System.EventHandler(this.tbTest_TextChanged);
      // 
      // btnOpenTestMsgFile
      // 
      this.btnOpenTestMsgFile.Location = new System.Drawing.Point(337, 6);
      this.btnOpenTestMsgFile.Name = "btnOpenTestMsgFile";
      this.btnOpenTestMsgFile.Size = new System.Drawing.Size(47, 23);
      this.btnOpenTestMsgFile.TabIndex = 19;
      this.btnOpenTestMsgFile.Text = "...";
      this.btnOpenTestMsgFile.UseVisualStyleBackColor = true;
      this.btnOpenTestMsgFile.Click += new System.EventHandler(this.btnOpenTestMsgFile_Click);
      // 
      // label6
      // 
      this.label6.AutoSize = true;
      this.label6.Location = new System.Drawing.Point(15, 9);
      this.label6.Name = "label6";
      this.label6.Size = new System.Drawing.Size(25, 15);
      this.label6.TabIndex = 17;
      this.label6.Text = "File";
      // 
      // tbTestMsgFile
      // 
      this.tbTestMsgFile.Location = new System.Drawing.Point(46, 6);
      this.tbTestMsgFile.Name = "tbTestMsgFile";
      this.tbTestMsgFile.Size = new System.Drawing.Size(285, 23);
      this.tbTestMsgFile.TabIndex = 18;
      // 
      // panelConnection
      // 
      this.panelConnection.BackColor = System.Drawing.Color.Transparent;
      this.panelConnection.Controls.Add(this.label9);
      this.panelConnection.Controls.Add(this.textBoxDomain);
      this.panelConnection.Controls.Add(this.cmdDisconnect);
      this.panelConnection.Controls.Add(this.cmdConnect);
      this.panelConnection.Controls.Add(this.label1);
      this.panelConnection.Controls.Add(this.textBoxHost);
      this.panelConnection.Controls.Add(this.textboxResource);
      this.panelConnection.Controls.Add(this.label4);
      this.panelConnection.Controls.Add(this.label2);
      this.panelConnection.Controls.Add(this.textBoxUser);
      this.panelConnection.Dock = System.Windows.Forms.DockStyle.Top;
      this.panelConnection.Location = new System.Drawing.Point(3, 3);
      this.panelConnection.Name = "panelConnection";
      this.panelConnection.Size = new System.Drawing.Size(708, 64);
      this.panelConnection.TabIndex = 16;
      // 
      // label9
      // 
      this.label9.AutoSize = true;
      this.label9.Location = new System.Drawing.Point(370, 9);
      this.label9.Name = "label9";
      this.label9.Size = new System.Drawing.Size(52, 15);
      this.label9.TabIndex = 21;
      this.label9.Text = "Domain:";
      // 
      // textBoxDomain
      // 
      this.textBoxDomain.Location = new System.Drawing.Point(431, 6);
      this.textBoxDomain.Name = "textBoxDomain";
      this.textBoxDomain.Size = new System.Drawing.Size(167, 23);
      this.textBoxDomain.TabIndex = 22;
      this.textBoxDomain.Text = "localhost";
      // 
      // tabMessages
      // 
      this.tabMessages.Controls.Add(this.groupBoxReceived);
      this.tabMessages.Controls.Add(this.groupBoxClients);
      this.tabMessages.Location = new System.Drawing.Point(4, 24);
      this.tabMessages.Name = "tabMessages";
      this.tabMessages.Padding = new System.Windows.Forms.Padding(3);
      this.tabMessages.Size = new System.Drawing.Size(714, 736);
      this.tabMessages.TabIndex = 1;
      this.tabMessages.Text = "Recieved Messages";
      this.tabMessages.UseVisualStyleBackColor = true;
      // 
      // groupBoxReceived
      // 
      this.groupBoxReceived.Controls.Add(this.rtfReceived);
      this.groupBoxReceived.Dock = System.Windows.Forms.DockStyle.Fill;
      this.groupBoxReceived.Location = new System.Drawing.Point(3, 108);
      this.groupBoxReceived.Margin = new System.Windows.Forms.Padding(2);
      this.groupBoxReceived.Name = "groupBoxReceived";
      this.groupBoxReceived.Padding = new System.Windows.Forms.Padding(2);
      this.groupBoxReceived.Size = new System.Drawing.Size(708, 625);
      this.groupBoxReceived.TabIndex = 24;
      this.groupBoxReceived.TabStop = false;
      this.groupBoxReceived.Text = "Messages";
      // 
      // rtfReceived
      // 
      this.rtfReceived.Dock = System.Windows.Forms.DockStyle.Fill;
      this.rtfReceived.Location = new System.Drawing.Point(2, 18);
      this.rtfReceived.Margin = new System.Windows.Forms.Padding(2);
      this.rtfReceived.Name = "rtfReceived";
      this.rtfReceived.ReadOnly = true;
      this.rtfReceived.Size = new System.Drawing.Size(704, 605);
      this.rtfReceived.TabIndex = 0;
      this.rtfReceived.Text = "";
      // 
      // groupBoxClients
      // 
      this.groupBoxClients.Controls.Add(this.listBoxClients);
      this.groupBoxClients.Dock = System.Windows.Forms.DockStyle.Top;
      this.groupBoxClients.Location = new System.Drawing.Point(3, 3);
      this.groupBoxClients.Margin = new System.Windows.Forms.Padding(2);
      this.groupBoxClients.Name = "groupBoxClients";
      this.groupBoxClients.Padding = new System.Windows.Forms.Padding(2);
      this.groupBoxClients.Size = new System.Drawing.Size(708, 105);
      this.groupBoxClients.TabIndex = 23;
      this.groupBoxClients.TabStop = false;
      this.groupBoxClients.Text = "Connected Clients";
      // 
      // listBoxClients
      // 
      this.listBoxClients.Dock = System.Windows.Forms.DockStyle.Fill;
      this.listBoxClients.FormattingEnabled = true;
      this.listBoxClients.ItemHeight = 15;
      this.listBoxClients.Location = new System.Drawing.Point(2, 18);
      this.listBoxClients.Margin = new System.Windows.Forms.Padding(2);
      this.listBoxClients.Name = "listBoxClients";
      this.listBoxClients.Size = new System.Drawing.Size(704, 85);
      this.listBoxClients.TabIndex = 0;
      // 
      // tabLog
      // 
      this.tabLog.Controls.Add(this.rtbLog);
      this.tabLog.Location = new System.Drawing.Point(4, 24);
      this.tabLog.Name = "tabLog";
      this.tabLog.Padding = new System.Windows.Forms.Padding(3);
      this.tabLog.Size = new System.Drawing.Size(714, 736);
      this.tabLog.TabIndex = 2;
      this.tabLog.Text = "Log/Errors";
      this.tabLog.UseVisualStyleBackColor = true;
      // 
      // rtbLog
      // 
      this.rtbLog.Dock = System.Windows.Forms.DockStyle.Fill;
      this.rtbLog.Location = new System.Drawing.Point(3, 3);
      this.rtbLog.Margin = new System.Windows.Forms.Padding(2);
      this.rtbLog.Name = "rtbLog";
      this.rtbLog.ReadOnly = true;
      this.rtbLog.Size = new System.Drawing.Size(708, 730);
      this.rtbLog.TabIndex = 1;
      this.rtbLog.Text = "";
      // 
      // dlgOpenTestMsgFile
      // 
      this.dlgOpenTestMsgFile.FileName = "openFileDialog1";
      this.dlgOpenTestMsgFile.FileOk += new System.ComponentModel.CancelEventHandler(this.dlgOpenTestMsgFile_FileOk);
      // 
      // FrmSampleClient
      // 
      this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.None;
      this.ClientSize = new System.Drawing.Size(722, 786);
      this.Controls.Add(this.tabControl1);
      this.Controls.Add(this.statusBarClient);
      this.Name = "FrmSampleClient";
      this.Text = "Sample Xmpp Message Client";
      this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.FrmSampleClient_FormClosed);
      this.Load += new System.EventHandler(this.FrmSampleClient_Load);
      this.tabControl1.ResumeLayout(false);
      this.tabConnection.ResumeLayout(false);
      this.panel3.ResumeLayout(false);
      this.panel3.PerformLayout();
      this.tabMsgSending.ResumeLayout(false);
      this.tabPgManual.ResumeLayout(false);
      this.pnlSendMsg.ResumeLayout(false);
      this.panel4.ResumeLayout(false);
      this.pnlJSONGen.ResumeLayout(false);
      this.tabCtrlMsgTypes.ResumeLayout(false);
      this.tabItemData.ResumeLayout(false);
      this.tabItemData.PerformLayout();
      this.tabStatus.ResumeLayout(false);
      this.panel1.ResumeLayout(false);
      this.panel1.PerformLayout();
      this.panel2.ResumeLayout(false);
      this.groupBox1.ResumeLayout(false);
      this.panel5.ResumeLayout(false);
      this.panel5.PerformLayout();
      this.tabPgTestFile.ResumeLayout(false);
      this.tabPgTestFile.PerformLayout();
      this.panelConnection.ResumeLayout(false);
      this.panelConnection.PerformLayout();
      this.tabMessages.ResumeLayout(false);
      this.groupBoxReceived.ResumeLayout(false);
      this.groupBoxClients.ResumeLayout(false);
      this.tabLog.ResumeLayout(false);
      this.ResumeLayout(false);
      this.PerformLayout();

        }
        #endregion

        private System.Windows.Forms.StatusStrip statusBarClient;
        private System.Windows.Forms.TextBox textBoxHost;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox textBoxUser;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox textboxResource;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button cmdConnect;
        private System.Windows.Forms.Button cmdDisconnect;
    private System.Windows.Forms.TabControl tabControl1;
    private System.Windows.Forms.TabPage tabConnection;
    private System.Windows.Forms.Panel panelConnection;
    private System.Windows.Forms.TabPage tabMessages;
    private System.Windows.Forms.GroupBox groupBoxReceived;
    private System.Windows.Forms.RichTextBox rtfReceived;
    private System.Windows.Forms.GroupBox groupBoxClients;
    private System.Windows.Forms.ListBox listBoxClients;
    private System.Windows.Forms.Panel pnlSendMsg;
    private System.Windows.Forms.Panel panel4;
    private System.Windows.Forms.Splitter splitter3;
    private System.Windows.Forms.RichTextBox rtbJSONErrors;
    private System.Windows.Forms.RichTextBox rtbJSONMsg;
    private System.Windows.Forms.Splitter splitter2;
    private System.Windows.Forms.Panel pnlJSONGen;
    private System.Windows.Forms.Panel panel2;
    private System.Windows.Forms.Button btnGenMsg;
    private System.Windows.Forms.TabControl tabCtrlMsgTypes;
    private System.Windows.Forms.TabPage tabItemData;
    private System.Windows.Forms.TabPage tabStatus;
    private System.Windows.Forms.Panel panel3;
    private System.Windows.Forms.Label lblClientMsg;
    private System.Windows.Forms.Button btnSendMsg;
    private System.Windows.Forms.ComboBox cbResources;
    private System.Windows.Forms.Panel panel5;
    private System.Windows.Forms.Label label3;
    private System.Windows.Forms.TextBox tbTimeSpan;
    private System.Windows.Forms.TextBox tbMsgDesc;
    private System.Windows.Forms.Label lblMsgTime;
    private System.Windows.Forms.Label lblManMsgDesc;
    private System.Windows.Forms.Label lblSendManualMsg;
    private System.Windows.Forms.TextBox tbItemDataValue;
    private System.Windows.Forms.Label label5;
    private System.Windows.Forms.TextBox tbItemDataName;
    private System.Windows.Forms.Label compID;
    private System.Windows.Forms.ComboBox cbStatusMsgType;
    private System.Windows.Forms.GroupBox groupBox1;
    private System.Windows.Forms.RichTextBox rtbMsgInfo;
    private System.Windows.Forms.TabPage tabLog;
    private System.Windows.Forms.RichTextBox rtbLog;
    private System.Windows.Forms.Label label9;
    private System.Windows.Forms.TextBox textBoxDomain;
    private System.Windows.Forms.TextBox tbDispName;
    private System.Windows.Forms.Label label10;
    private System.Windows.Forms.Panel panel1;
    private System.Windows.Forms.Label label11;
    private System.Windows.Forms.ComboBox cbMsgType;
    private System.Windows.Forms.TabControl tabMsgSending;
    private System.Windows.Forms.TabPage tabPgManual;
    private System.Windows.Forms.TabPage tabPgTestFile;
    private System.Windows.Forms.Button btnOpenTestMsgFile;
    private System.Windows.Forms.Label label6;
    private System.Windows.Forms.TextBox tbTestMsgFile;
    private System.Windows.Forms.OpenFileDialog dlgOpenTestMsgFile;
    private System.Windows.Forms.Label lblHowMany;
    private System.Windows.Forms.TextBox tbHowMany;
    private System.Windows.Forms.TextBox tbTestMsg;
  }
}
