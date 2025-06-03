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
            this.lstItems = new System.Windows.Forms.ListBox();
            this.txtRefPath = new System.Windows.Forms.TextBox();
            this.txtRelPath = new System.Windows.Forms.TextBox();
            this.lstToCopy = new System.Windows.Forms.ListBox();
            this.btnAddCopy = new System.Windows.Forms.Button();
            this.btnRemoveCopy = new System.Windows.Forms.Button();
            this.btnOK = new System.Windows.Forms.Button();
            this.btnCancel = new System.Windows.Forms.Button();
            this.lblRefPath = new System.Windows.Forms.Label();
            this.lblRelPath = new System.Windows.Forms.Label();
            this.lblItems = new System.Windows.Forms.Label();
            this.lblToCopy = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // lstItems
            // 
            this.lstItems.FormattingEnabled = true;
            this.lstItems.ItemHeight = 16;
            this.lstItems.Location = new System.Drawing.Point(12, 32);
            this.lstItems.Name = "lstItems";
            this.lstItems.Size = new System.Drawing.Size(200, 340);
            this.lstItems.TabIndex = 0;
            this.lstItems.SelectedIndexChanged += new System.EventHandler(this.lstItems_SelectedIndexChanged);
            // 
            // lblItems
            // 
            this.lblItems.AutoSize = true;
            this.lblItems.Location = new System.Drawing.Point(12, 12);
            this.lblItems.Name = "lblItems";
            this.lblItems.Size = new System.Drawing.Size(82, 17);
            this.lblItems.TabIndex = 100;
            this.lblItems.Text = "Item Names";
            // 
            // txtRefPath
            // 
            this.txtRefPath.Location = new System.Drawing.Point(230, 50);
            this.txtRefPath.Name = "txtRefPath";
            this.txtRefPath.ReadOnly = true;
            this.txtRefPath.Size = new System.Drawing.Size(500, 22);
            this.txtRefPath.TabIndex = 1;
            // 
            // lblRefPath
            // 
            this.lblRefPath.AutoSize = true;
            this.lblRefPath.Location = new System.Drawing.Point(230, 30);
            this.lblRefPath.Name = "lblRefPath";
            this.lblRefPath.Size = new System.Drawing.Size(61, 17);
            this.lblRefPath.TabIndex = 101;
            this.lblRefPath.Text = "Ref Path";
            // 
            // txtRelPath
            // 
            this.txtRelPath.Location = new System.Drawing.Point(230, 100);
            this.txtRelPath.Name = "txtRelPath";
            this.txtRelPath.ReadOnly = true;
            this.txtRelPath.Size = new System.Drawing.Size(500, 22);
            this.txtRelPath.TabIndex = 2;
            // 
            // lblRelPath
            // 
            this.lblRelPath.AutoSize = true;
            this.lblRelPath.Location = new System.Drawing.Point(230, 80);
            this.lblRelPath.Name = "lblRelPath";
            this.lblRelPath.Size = new System.Drawing.Size(60, 17);
            this.lblRelPath.TabIndex = 102;
            this.lblRelPath.Text = "Rel Path";
            // 
            // lstToCopy
            // 
            this.lstToCopy.FormattingEnabled = true;
            this.lstToCopy.ItemHeight = 16;
            this.lstToCopy.Location = new System.Drawing.Point(230, 160);
            this.lstToCopy.Name = "lstToCopy";
            this.lstToCopy.Size = new System.Drawing.Size(500, 148);
            this.lstToCopy.TabIndex = 3;
            // 
            // lblToCopy
            // 
            this.lblToCopy.AutoSize = true;
            this.lblToCopy.Location = new System.Drawing.Point(230, 140);
            this.lblToCopy.Name = "lblToCopy";
            this.lblToCopy.Size = new System.Drawing.Size(111, 17);
            this.lblToCopy.TabIndex = 103;
            this.lblToCopy.Text = "Items to copy";
            // 
            // btnAddCopy
            // 
            this.btnAddCopy.Location = new System.Drawing.Point(750, 160);
            this.btnAddCopy.Name = "btnAddCopy";
            this.btnAddCopy.Size = new System.Drawing.Size(75, 28);
            this.btnAddCopy.TabIndex = 4;
            this.btnAddCopy.Text = "Add";
            this.btnAddCopy.UseVisualStyleBackColor = true;
            this.btnAddCopy.Click += new System.EventHandler(this.btnAddCopy_Click);
            // 
            // btnRemoveCopy
            // 
            this.btnRemoveCopy.Location = new System.Drawing.Point(750, 200);
            this.btnRemoveCopy.Name = "btnRemoveCopy";
            this.btnRemoveCopy.Size = new System.Drawing.Size(75, 28);
            this.btnRemoveCopy.TabIndex = 5;
            this.btnRemoveCopy.Text = "Remove";
            this.btnRemoveCopy.UseVisualStyleBackColor = true;
            this.btnRemoveCopy.Click += new System.EventHandler(this.btnRemoveCopy_Click);
            // 
            // btnOK
            // 
            this.btnOK.Location = new System.Drawing.Point(550, 390);
            this.btnOK.Name = "btnOK";
            this.btnOK.Size = new System.Drawing.Size(90, 35);
            this.btnOK.TabIndex = 6;
            this.btnOK.Text = "OK";
            this.btnOK.Enabled = false;
            this.btnOK.UseVisualStyleBackColor = true;
            this.btnOK.Click += new System.EventHandler(this.btnOK_Click);
            // 
            // btnCancel
            // 
            this.btnCancel.Location = new System.Drawing.Point(650, 390);
            this.btnCancel.Name = "btnCancel";
            this.btnCancel.Size = new System.Drawing.Size(90, 35);
            this.btnCancel.TabIndex = 7;
            this.btnCancel.Text = "Cancel";
            this.btnCancel.UseVisualStyleBackColor = true;
            this.btnCancel.Click += new System.EventHandler(this.btnCancel_Click);
            // 
            // FormMultiThreadRefs
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(850, 450);
            this.Controls.Add(this.lblItems);
            this.Controls.Add(this.lstItems);
            this.Controls.Add(this.lblRefPath);
            this.Controls.Add(this.txtRefPath);
            this.Controls.Add(this.lblRelPath);
            this.Controls.Add(this.txtRelPath);
            this.Controls.Add(this.lblToCopy);
            this.Controls.Add(this.lstToCopy);
            this.Controls.Add(this.btnAddCopy);
            this.Controls.Add(this.btnRemoveCopy);
            this.Controls.Add(this.btnOK);
            this.Controls.Add(this.btnCancel);
            this.Name = "FormMultiThreadRefs";
            this.Text = "MultiThread Path References";
            this.Load += new System.EventHandler(this.FormMultiThreadRefs_Load);
            this.ResumeLayout(false);
            this.PerformLayout();
        }

        #endregion
    }
}