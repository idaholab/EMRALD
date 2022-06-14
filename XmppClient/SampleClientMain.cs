// Copyright 2021 Battelle Energy Alliance

using System;
using System.Threading;
using System.Windows.Forms;

namespace XmppMessageClient
{
  class SampleClientMain
  {
    public SampleClientMain()
    {
    }

    /// <summary>
    /// The main entry point for the application.
    /// </summary>
    [STAThread]
    static void Main(string[] args)
    {
      // show the gui
      Application.EnableVisualStyles();
      Application.SetCompatibleTextRenderingDefault(false);
      var appSettingsService = new AppSettingsService(ConfigHelper.GetConfiguration());
      Application.Run(new FrmSampleClient(new SampleClientController(appSettingsService)));
    }
  }
}
