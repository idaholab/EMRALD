using ElectronNET.API;

namespace Processes {
    public class Program {
        public static void Main(string[] args) {
            CreateHostBuilder(args).Build().Run();
        }
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args).ConfigureWebHostDefaults(builder => {
                builder.UseElectron(args);
                builder.UseStartup<Startup>();
            });
    }
}
