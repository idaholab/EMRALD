using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace EMRALD_Sim
{
  public partial class FormSelExtSim : Form
  {
    public string resourceName = "";
    public FormSelExtSim(List<string> resources)
    {
      InitializeComponent();
      foreach(string name in resources)
      {
        lbResources.Items.Add(name);
      }
    }

    private void btnOK_Click(object sender, EventArgs e)
    {
      this.DialogResult = DialogResult.OK;
      this.Close();
    }

    private void btnCancel_Click(object sender, EventArgs e)
    {
      this.DialogResult = DialogResult.Cancel;
      this.Close();
    }

    private void lbResources_MouseDoubleClick(object sender, MouseEventArgs e)
    {
      if (lbResources.SelectedItem != null)
      {
        resourceName = lbResources.SelectedItem.ToString();
        this.DialogResult = DialogResult.OK;
        this.Close();
      }
    }

    private void lbResources_MouseClick(object sender, MouseEventArgs e)
    {
      if (lbResources.SelectedItem != null)
      {
        resourceName = lbResources.SelectedItem.ToString();
      }
    }
  }
}
