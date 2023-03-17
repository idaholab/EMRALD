// Copyright 2021 Battelle Energy Alliance

using System;
using System.Linq;
using Microsoft.Extensions.Configuration;


namespace EMRALD_Sim
{
    public static class ConfigHelper
    {
        public static IConfiguration GetConfiguration()
        {
            var assembly = AppDomain.CurrentDomain.GetAssemblies().Single(x => x.EntryPoint != null);

            var builder = new ConfigurationBuilder().AddEnvironmentVariables();
            builder.SetBasePath(AppContext.BaseDirectory);
            builder.AddJsonFile("AppSettings.json", optional: true, reloadOnChange: true);
            builder.AddJsonFile("UISettings.json", optional: true);
            builder.AddUserSecrets(assembly, optional: true);
                
            return builder.Build();
        }
    }
}