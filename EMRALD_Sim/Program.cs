// Copyright 2021 Battelle Energy Alliance

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using XmppServer;

namespace EMRALD_Sim
{
  static class Program
  {
    /// <summary>
    /// The main entry point for the application.
    /// </summary>
    [STAThread]
    static void Main(string[] args)
    {
      Application.EnableVisualStyles();
      Application.SetCompatibleTextRenderingDefault(false);
      var appSettingsService = new AppSettingsService(ConfigHelper.GetConfiguration());
      Application.Run(new FormMain(args, appSettingsService));
    }
  }
}
