// Copyright 2021 Battelle Energy Alliance

using System;
using System.Linq;
using Microsoft.Extensions.Configuration;


namespace XmppMessageClient
{
    public static class ConfigHelper
    {
        public static IConfiguration GetConfiguration()
        {
            var assembly = AppDomain.CurrentDomain.GetAssemblies().Single(x => x.EntryPoint != null);

            var builder = new ConfigurationBuilder();
            builder.SetBasePath(AppContext.BaseDirectory);
            builder.AddJsonFile("AppSettings.json", optional: true, reloadOnChange: true);
            builder.AddUserSecrets(assembly, optional: false);
                
            return builder.Build();
        }
    }
}