using ElectronNET.API;  

namespace Processes {
    public class Startup {
        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services) {
            services.AddRazorPages();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
            app.UseExceptionHandler("/Error");
            app.UseHsts();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints => {
                endpoints.MapRazorPages();
            });
            CreateWindow();
        }

        private async void CreateWindow() {
            var window = await Electron.WindowManager.CreateWindowAsync();
            window.OnClosed += () => {
                Electron.App.Quit();
            };
        }
    }
}
