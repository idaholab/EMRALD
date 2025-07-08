using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using SimulationDAL;

namespace EMRALD_Sim
{
    public partial class FormMultiThreadRefs : Form
    {
        // Use the actual type if possible, but keep as dynamic if required by calling code
        private MultiThreadInfo _multiThreadInfo; // Your multiThreadInfo object
        private List<string> _issueItems; // Items to highlight (strings matching ItemName)
        private int _currentItemIndex = -1;

        public MultiThreadInfo EditedMultiThreadInfo => _multiThreadInfo;

        public FormMultiThreadRefs(MultiThreadInfo multiThreadInfo, List<string> issueItems)
        {
            InitializeComponent();
            _multiThreadInfo = multiThreadInfo;
            _issueItems = issueItems ?? new List<string>();
        }
        
        private void FormMultiThreadRefs_Load(object sender, EventArgs e)
        {
          lstItems.Items.Clear();
          if (_multiThreadInfo?.ToCopyForRefs == null) return;
    
    
          foreach (var item in _multiThreadInfo.ToCopyForRefs)
          {
            // Create display text with ItemType and ItemName
            string displayText = $"{item.ItemType}: {item.ItemName}";
        
            // Highlight issue items with asterisk
            bool isIssue = _issueItems.Contains((string)item.ItemName);
            if (isIssue)
              displayText += " *";
            
            lstItems.Items.Add(displayText);
          }
    
          if (lstItems.Items.Count > 0)
            lstItems.SelectedIndex = 0;
        }

        private void lstItems_SelectedIndexChanged(object sender, EventArgs e)
        {
            _currentItemIndex = lstItems.SelectedIndex;
            if (_currentItemIndex < 0) return;
            var item = _multiThreadInfo.ToCopyForRefs[_currentItemIndex];
            txtRefPath.Text = item.RefPath ?? "";
            txtRelPath.Text = item.RelPath ?? "";
            lstToCopy.Items.Clear();
            if (item.ToCopy != null)
            {
                foreach (var path in item.ToCopy)
                    lstToCopy.Items.Add(path);
            }
            
            UpdateOKButtonState();
        }

        private void btnAddCopy_Click(object sender, EventArgs e)
        {
            if (_currentItemIndex < 0) return;
            using (var ofd = new OpenFileDialog())
            {
                ofd.Title = "Select file(s) to copy";
                ofd.Multiselect = true;
                if (ofd.ShowDialog() == DialogResult.OK)
                {
                    var item = _multiThreadInfo.ToCopyForRefs[_currentItemIndex];
                    if (item.ToCopy == null) item.ToCopy = new List<string>();
                    foreach (var file in ofd.FileNames)
                    {
                        if (!item.ToCopy.Contains(file))
                        {
                            item.ToCopy.Add(file);
                            lstToCopy.Items.Add(file);
                        }
                    }
                    UpdateRelPath();
                }
            }
            UpdateOKButtonState();
        }

        private void btnRemoveCopy_Click(object sender, EventArgs e)
        {
            if (_currentItemIndex < 0 || lstToCopy.SelectedIndex < 0) return;
            var item = _multiThreadInfo.ToCopyForRefs[_currentItemIndex];
            int idx = lstToCopy.SelectedIndex;
            if (item.ToCopy != null && idx < item.ToCopy.Count)
            {
                item.ToCopy.RemoveAt(idx);
                lstToCopy.Items.RemoveAt(idx);
                UpdateRelPath();
            }
            UpdateOKButtonState();
        }

        private void btnOK_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.OK;
            _multiThreadInfo.AssignedTime = DateTime.Now;
            Close();
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.Cancel;
            Close();
        }

        private void UpdateRelPath()
        {
            if (_currentItemIndex < 0) return;
            var item = _multiThreadInfo.ToCopyForRefs[_currentItemIndex];
            string refPath = item.RefPath ?? "";
            List<string> toCopy = item.ToCopy != null
                ? ((IEnumerable<string>)item.ToCopy).ToList()
                : new List<string>();
            item.RelPath = CalculateRelPath(refPath, toCopy);
            txtRelPath.Text = item.RelPath;
        }

        private string CalculateRelPath(string refPath, List<string> toCopy)
        {
          if (string.IsNullOrEmpty(refPath) || toCopy.Count == 0)
            return "";

          // Find common parent (absolute path)
          string commonParent = CommonFunctions.FindClosestParentFolder(toCopy);
          if (string.IsNullOrEmpty(commonParent))
            return "";

          string absCommonParent = Path.GetFullPath(commonParent);

          // RefPath might be relative or absolute
          string absRefPath = Path.IsPathRooted(refPath)
            ? Path.GetFullPath(refPath)
            : Path.GetFullPath(Path.Combine(absCommonParent, refPath));

          // Always show ref path relative to the common parent
          string relPath = Path.GetRelativePath(absCommonParent, absRefPath);

          // Standardize for display: prefix with ./
          relPath = "./" + relPath.Replace('\\', '/');

          return relPath;
        }
        
        
        private void UpdateOKButtonState()
        {
          // Enable OK button only if at least one item has something in its ToCopy list
          bool hasItemsToCopy = false;
    
          // Check if any of the ToCopyForRef items has items in their ToCopy list
          foreach (var item in _multiThreadInfo.ToCopyForRefs)
          {
            if (item.ToCopy != null && item.ToCopy.Count > 0)
            {
              hasItemsToCopy = true;
              break;
            }
          }
    
          btnOK.Enabled = hasItemsToCopy;
        }
      
    }
}