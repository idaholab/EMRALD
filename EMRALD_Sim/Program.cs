// Copyright 2021 Battelle Energy Alliance
// Application entry point for EMRALD_Sim: configures logging, dependency injection, and launches the main WinForms window.
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SimulationDAL;
using XmppServer;

namespace EMRALD_Sim
{
  static class Program
  {
    private static string _logFilePath;

    /// <summary>
    /// Application entry point: sets up logging, config/services, and launches the main form.
    /// </summary>
    [STAThread]
    static void Main(string[] args)
    {
      // Allocate a console window when running a Debug build, or when the user
      // passes -console / -showConsole on the command line. Must happen before
      // FormMain attaches to the parent process console.
      bool showConsole = false;
#if DEBUG
      showConsole = true;
#endif
      if (!showConsole)
      {
        foreach (var arg in args)
        {
          if (arg.Equals("-console", StringComparison.OrdinalIgnoreCase) ||
              arg.Equals("-showConsole", StringComparison.OrdinalIgnoreCase))
          {
            showConsole = true;
            break;
          }
        }
      }
      if (showConsole)
      {
        ConsoleHelper.Show();
      }

      // Set up log file path
      _logFilePath = CommonFunctions.NormalizeCombine(Application.StartupPath, "EMRALD_ErrorLog.txt");

      // Clear the error log on application start
      try
      {
        if (File.Exists(_logFilePath))
        {
          File.Delete(_logFilePath);
        }
      }
      catch
      {
        // If we can't delete it, just continue
      }

      try
      {
        // Add global exception handlers BEFORE anything else
        Application.ThreadException += Application_ThreadException;
        AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;
        Application.SetUnhandledExceptionMode(UnhandledExceptionMode.CatchException);

        // Log startup
        LogMessage("=== Application Starting ===");
        LogMessage($"Command line args: {string.Join(" ", args)}");
        LogMessage($"Running in RDP: {SystemInformation.TerminalServerSession}");
        LogMessage($".NET Version: {Environment.Version}");
        LogMessage($"OS: {Environment.OSVersion}");

        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);

        EnsureConfigFileExists();

        var services = new ServiceCollection();
        ConfigureServices(services, ConfigHelper.GetConfiguration(), args);

        using (ServiceProvider serviceProvider = services.BuildServiceProvider())
        {
          var mainForm = serviceProvider.GetRequiredService<FormMain>();
          LogMessage("MainForm created successfully");
          Application.Run(mainForm);
        }

        LogMessage("=== Application Exiting Normally ===");
      }
      catch (Exception ex)
      {
        HandleFatalException("Main", ex);
      }
    }

    /// <summary>
    /// Registers app services and options into the DI container.
    /// </summary>
    private static void ConfigureServices(ServiceCollection services, IConfiguration configuration, string[] args)
    {
      try
      {
        LogMessage("Configuring services...");
        services.AddOptions();
        services.Configure<UISettings>(configuration);
        services.AddSingleton(configuration);
        services.AddSingleton<FormMain>();
        services.AddSingleton<IAppSettingsService, AppSettingsService>();
        services.AddSingleton(args);
        LogMessage("Services configured successfully");
      }
      catch (Exception ex)
      {
        HandleFatalException("ConfigureServices", ex);
        throw; // Re-throw to prevent partial configuration
      }
    }

    /// <summary>
    /// Global WinForms thread exception handler.
    /// </summary>
    private static void Application_ThreadException(object sender, ThreadExceptionEventArgs e)
    {
      HandleFatalException("UI Thread", e.Exception);
    }

    /// <summary>
    /// Global unhandled exception handler for non-UI threads.
    /// </summary>
    private static void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
    {
      Exception ex = e.ExceptionObject as Exception;

      LogMessage("=== UNHANDLED EXCEPTION ===");
      LogMessage($"Is Terminating: {e.IsTerminating}");

      if (ex != null)
      {
        LogMessage($"Exception Type: {ex.GetType().FullName}");
        LogMessage($"Message: {ex.Message}");
        LogMessage($"Source: {ex.Source}");
        LogMessage($"Stack Trace:\n{ex.StackTrace}");

        if (ex.InnerException != null)
        {
          LogMessage($"Inner Exception Type: {ex.InnerException.GetType().FullName}");
          LogMessage($"Inner Message: {ex.InnerException.Message}");
          LogMessage($"Inner Stack Trace:\n{ex.InnerException.StackTrace}");
        }
      }
      else
      {
        // If it's not an Exception object, log whatever we can
        LogMessage($"Exception Object Type: {e.ExceptionObject?.GetType().FullName ?? "null"}");
        LogMessage($"Exception String: {e.ExceptionObject?.ToString() ?? "null"}");
      }

      try
      {
        // Try to show message box (may not work if app is terminating)
        MessageBox.Show(
          $"A fatal error has occurred.\n\n" +
          $"Error: {ex?.Message ?? "Unknown error"}\n\n" +
          $"Details have been logged to:\n{_logFilePath}\n\n" +
          $"Please send this file to support.",
          "Fatal Error - EMRALD",
          MessageBoxButtons.OK,
          MessageBoxIcon.Error);
      }
      catch
      {
        // If MessageBox fails, at least the log file has the info
      }
    }

    /// <summary>
    /// Centralized fatal exception logger and user notifier.
    /// </summary>
    private static void HandleFatalException(string source, Exception ex)
    {
      try
      {
        LogMessage($"=== FATAL EXCEPTION in {source} ===");
        LogMessage($"Exception Type: {ex.GetType().FullName}");
        LogMessage($"Message: {ex.Message}");
        LogMessage($"Source: {ex.Source}");
        LogMessage($"Stack Trace:\n{ex.StackTrace}");

        if (ex.InnerException != null)
        {
          LogMessage($"Inner Exception: {ex.InnerException.GetType().FullName}");
          LogMessage($"Inner Message: {ex.InnerException.Message}");
          LogMessage($"Inner Stack Trace:\n{ex.InnerException.StackTrace}");
        }

        // Show error to user
        MessageBox.Show(
          $"An error occurred in {source}:\n\n" +
          $"{ex.Message}\n\n" +
          $"Details logged to:\n{_logFilePath}\n\n" +
          $"Stack Trace:\n{ex.StackTrace?.Substring(0, Math.Min(500, ex.StackTrace?.Length ?? 0))}",
          $"Error in {source}",
          MessageBoxButtons.OK,
          MessageBoxIcon.Error);
      }
      catch (Exception logEx)
      {
        // Last resort - try to write to temp directory
        try
        {
          string emergencyLog = CommonFunctions.NormalizeCombine(Path.GetTempPath(), "EMRALD_Errors_Log.txt");
          File.AppendAllText(emergencyLog,
            $"{DateTime.Now}: LOGGING FAILED\n" +
            $"Original Exception: {ex}\n" +
            $"Logging Exception: {logEx}\n\n");
        }
        catch
        {
          // If even this fails, we're out of options
        }
      }
    }

    /// <summary>
    /// Append a timestamped message to the error log; swallow failures.
    /// </summary>
    private static void LogMessage(string message)
    {
      try
      {
        string logEntry = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] {message}\n";
        File.AppendAllText(_logFilePath, logEntry);
      }
      catch
      {
        // If logging fails, don't crash the app
      }
    }

    /// <summary>
    /// Ensure UISettings.json exists and is valid JSON; create minimal file if missing/invalid.
    /// </summary>
    private static void EnsureConfigFileExists()
    {
      string uiSettingsPath = CommonFunctions.NormalizeCombine(AppContext.BaseDirectory, "UISettings.json");
      try
      {
        bool create = false;
        if (!File.Exists(uiSettingsPath))
        {
          create = true;
        }
        else
        {
          // Validate JSON
          var text = File.ReadAllText(uiSettingsPath);
          if (string.IsNullOrWhiteSpace(text))
          {
            create = true;
          }
          else
          {
            try
            {
              Newtonsoft.Json.Linq.JToken.Parse(text);
            }
            catch
            {
              create = true;
            }
          }
        }

        if (create)
        {
          // Store as an empty list of options (matches updated saver)
          File.WriteAllText(uiSettingsPath, "[]");
        }
      }
      catch
      {
        // Swallow; configuration builder will still treat the file as optional
      }
    }
  }
}
