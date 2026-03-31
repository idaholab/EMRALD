// Copyright 2026 Battelle Energy Alliance
// Helper class to show or hide a Windows console window using kernel32 P/Invoke calls.
using System.Runtime.InteropServices;

namespace EMRALD_Sim
{
  internal static class ConsoleHelper
  {
    [DllImport("kernel32.dll")]
    private static extern bool AllocConsole();

    [DllImport("kernel32.dll")]
    private static extern bool FreeConsole();

    public static void Show() => AllocConsole();
    public static void Hide() => FreeConsole();
  }
}

