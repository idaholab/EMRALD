namespace EMRALD_Sim
{
    partial class FormMultiThreadRefs
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        private System.Windows.Forms.ListBox lstItems;
        private System.Windows.Forms.TextBox txtRefPath;
        private System.Windows.Forms.TextBox txtRelPath;
        private System.Windows.Forms.ListBox lstToCopy;
        private System.Windows.Forms.Button btnAddCopy;
        private System.Windows.Forms.Button btnRemoveCopy;
        private System.Windows.Forms.Button btnOK;
        private System.Windows.Forms.Button btnCancel;
        private System.Windows.Forms.Label lblRefPath;
        private System.Windows.Forms.Label lblRelPath;
        private System.Windows.Forms.Label lblItems;
        private System.Windows.Forms.Label lblToCopy;

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
      lstItems = new System.Windows.Forms.ListBox();
      txtRefPath = new System.Windows.Forms.TextBox();
      txtRelPath = new System.Windows.Forms.TextBox();
      lstToCopy = new System.Windows.Forms.ListBox();
      btnAddCopy = new System.Windows.Forms.Button();
      btnRemoveCopy = new System.Windows.Forms.Button();
      btnOK = new System.Windows.Forms.Button();
      btnCancel = new System.Windows.Forms.Button();
      lblRefPath = new System.Windows.Forms.Label();
      lblRelPath = new System.Windows.Forms.Label();
      lblItems = new System.Windows.Forms.Label();
      lblToCopy = new System.Windows.Forms.Label();
      SuspendLayout();
      // 
      // lstItems
      // 
      lstItems.FormattingEnabled = true;
      lstItems.ItemHeight = 15;
      lstItems.Location = new System.Drawing.Point(10, 30);
      lstItems.Name = "lstItems";
      lstItems.Size = new System.Drawing.Size(176, 319);
      lstItems.TabIndex = 0;
      lstItems.SelectedIndexChanged += lstItems_SelectedIndexChanged;
      // 
      // txtRefPath
      // 
      txtRefPath.Location = new System.Drawing.Point(201, 47);
      txtRefPath.Name = "txtRefPath";
      txtRefPath.ReadOnly = true;
      txtRefPath.Size = new System.Drawing.Size(438, 23);
      txtRefPath.TabIndex = 1;
      // 
      // txtRelPath
      // 
      txtRelPath.Location = new System.Drawing.Point(201, 94);
      txtRelPath.Name = "txtRelPath";
      txtRelPath.ReadOnly = true;
      txtRelPath.Size = new System.Drawing.Size(438, 23);
      txtRelPath.TabIndex = 2;
      // 
      // lstToCopy
      // 
      lstToCopy.FormattingEnabled = true;
      lstToCopy.ItemHeight = 15;
      lstToCopy.Location = new System.Drawing.Point(201, 150);
      lstToCopy.Name = "lstToCopy";
      lstToCopy.Size = new System.Drawing.Size(438, 139);
      lstToCopy.TabIndex = 3;
      // 
      // btnAddCopy
      // 
      btnAddCopy.Location = new System.Drawing.Point(656, 150);
      btnAddCopy.Name = "btnAddCopy";
      btnAddCopy.Size = new System.Drawing.Size(66, 26);
      btnAddCopy.TabIndex = 4;
      btnAddCopy.Text = "Add";
      btnAddCopy.UseVisualStyleBackColor = true;
      btnAddCopy.Click += btnAddCopy_Click;
      // 
      // btnRemoveCopy
      // 
      btnRemoveCopy.Location = new System.Drawing.Point(656, 188);
      btnRemoveCopy.Name = "btnRemoveCopy";
      btnRemoveCopy.Size = new System.Drawing.Size(66, 26);
      btnRemoveCopy.TabIndex = 5;
      btnRemoveCopy.Text = "Remove";
      btnRemoveCopy.UseVisualStyleBackColor = true;
      btnRemoveCopy.Click += btnRemoveCopy_Click;
      // 
      // btnOK
      // 
      btnOK.Enabled = false;
      btnOK.Location = new System.Drawing.Point(481, 366);
      btnOK.Name = "btnOK";
      btnOK.Size = new System.Drawing.Size(79, 33);
      btnOK.TabIndex = 6;
      btnOK.Text = "OK";
      btnOK.UseVisualStyleBackColor = true;
      btnOK.Click += btnOK_Click;
      // 
      // btnCancel
      // 
      btnCancel.Location = new System.Drawing.Point(569, 366);
      btnCancel.Name = "btnCancel";
      btnCancel.Size = new System.Drawing.Size(79, 33);
      btnCancel.TabIndex = 7;
      btnCancel.Text = "Cancel";
      btnCancel.UseVisualStyleBackColor = true;
      btnCancel.Click += btnCancel_Click;
      // 
      // lblRefPath
      // 
      lblRefPath.AutoSize = true;
      lblRefPath.Location = new System.Drawing.Point(201, 28);
      lblRefPath.Name = "lblRefPath";
      lblRefPath.Size = new System.Drawing.Size(51, 15);
      lblRefPath.TabIndex = 101;
      lblRefPath.Text = "Ref Path";
      // 
      // lblRelPath
      // 
      lblRelPath.AutoSize = true;
      lblRelPath.Location = new System.Drawing.Point(201, 75);
      lblRelPath.Name = "lblRelPath";
      lblRelPath.Size = new System.Drawing.Size(50, 15);
      lblRelPath.TabIndex = 102;
      lblRelPath.Text = "Rel Path";
      // 
      // lblItems
      // 
      lblItems.AutoSize = true;
      lblItems.Location = new System.Drawing.Point(10, 11);
      lblItems.Name = "lblItems";
      lblItems.Size = new System.Drawing.Size(189, 15);
      lblItems.TabIndex = 100;
      lblItems.Text = "Item Names (* items not assigned)";
      // 
      // lblToCopy
      // 
      lblToCopy.AutoSize = true;
      lblToCopy.Location = new System.Drawing.Point(201, 131);
      lblToCopy.Name = "lblToCopy";
      lblToCopy.Size = new System.Drawing.Size(79, 15);
      lblToCopy.TabIndex = 103;
      lblToCopy.Text = "Items to copy";
      // 
      // FormMultiThreadRefs
      // 
      AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
      AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
      ClientSize = new System.Drawing.Size(744, 422);
      Controls.Add(lblItems);
      Controls.Add(lstItems);
      Controls.Add(lblRefPath);
      Controls.Add(txtRefPath);
      Controls.Add(lblRelPath);
      Controls.Add(txtRelPath);
      Controls.Add(lblToCopy);
      Controls.Add(lstToCopy);
      Controls.Add(btnAddCopy);
      Controls.Add(btnRemoveCopy);
      Controls.Add(btnOK);
      Controls.Add(btnCancel);
      Name = "FormMultiThreadRefs";
      Text = "MultiThread Path References";
      Load += FormMultiThreadRefs_Load;
      ResumeLayout(false);
      PerformLayout();
    }

    #endregion
  }
}