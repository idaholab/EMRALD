// Copyright 2021 Battelle Energy Alliance

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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
      var services = new ServiceCollection();
      ConfigureServices(services, ConfigHelper.GetConfiguration(), args);

      using (ServiceProvider serviceProvider = services.BuildServiceProvider())
      {
        var mainForm = serviceProvider.GetRequiredService<FormMain>();
        Application.Run(mainForm);
      }
    }

    private static void ConfigureServices(ServiceCollection services, IConfiguration configuration, string[] args)
    {
      services.AddOptions();
      services.Configure<UISettings>(configuration);
      services.AddSingleton(configuration);
      services.AddSingleton<FormMain>();
      services.AddSingleton<IAppSettingsService, AppSettingsService>();
      services.AddSingleton(args);
    }
  }
}
