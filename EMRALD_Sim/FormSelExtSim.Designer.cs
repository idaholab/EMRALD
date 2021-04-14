// Copyright 2021 Battelle Energy Alliance

namespace EMRALD_Sim
{
  partial class FormSelExtSim
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
      this.panel1 = new System.Windows.Forms.Panel();
      this.btnCancel = new System.Windows.Forms.Button();
      this.btnOK = new System.Windows.Forms.Button();
      this.lbResources = new System.Windows.Forms.ListBox();
      this.panel1.SuspendLayout();
      this.SuspendLayout();
      // 
      // panel1
      // 
      this.panel1.Controls.Add(this.btnCancel);
      this.panel1.Controls.Add(this.btnOK);
      this.panel1.Dock = System.Windows.Forms.DockStyle.Bottom;
      this.panel1.Location = new System.Drawing.Point(0, 226);
      this.panel1.Name = "panel1";
      this.panel1.Size = new System.Drawing.Size(284, 36);
      this.panel1.TabIndex = 0;
      // 
      // btnCancel
      // 
      this.btnCancel.Location = new System.Drawing.Point(155, 6);
      this.btnCancel.Name = "btnCancel";
      this.btnCancel.Size = new System.Drawing.Size(75, 23);
      this.btnCancel.TabIndex = 1;
      this.btnCancel.Text = "Cancel";
      this.btnCancel.UseVisualStyleBackColor = true;
      this.btnCancel.Click += new System.EventHandler(this.btnCancel_Click);
      // 
      // btnOK
      // 
      this.btnOK.Location = new System.Drawing.Point(65, 6);
      this.btnOK.Name = "btnOK";
      this.btnOK.Size = new System.Drawing.Size(75, 23);
      this.btnOK.TabIndex = 0;
      this.btnOK.Text = "OK";
      this.btnOK.UseVisualStyleBackColor = true;
      this.btnOK.Click += new System.EventHandler(this.btnOK_Click);
      // 
      // lbResources
      // 
      this.lbResources.Dock = System.Windows.Forms.DockStyle.Fill;
      this.lbResources.FormattingEnabled = true;
      this.lbResources.Location = new System.Drawing.Point(0, 0);
      this.lbResources.Name = "lbResources";
      this.lbResources.Size = new System.Drawing.Size(284, 226);
      this.lbResources.TabIndex = 1;
      this.lbResources.MouseClick += new System.Windows.Forms.MouseEventHandler(this.lbResources_MouseClick);
      this.lbResources.MouseDoubleClick += new System.Windows.Forms.MouseEventHandler(this.lbResources_MouseDoubleClick);
      // 
      // FormSelExtSim
      // 
      this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
      this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
      this.ClientSize = new System.Drawing.Size(284, 262);
      this.Controls.Add(this.lbResources);
      this.Controls.Add(this.panel1);
      this.Name = "FormSelExtSim";
      this.Text = "Select External Simulation";
      this.panel1.ResumeLayout(false);
      this.ResumeLayout(false);

    }

    #endregion

    private System.Windows.Forms.Panel panel1;
    private System.Windows.Forms.Button btnCancel;
    private System.Windows.Forms.Button btnOK;
    private System.Windows.Forms.ListBox lbResources;
  }
}