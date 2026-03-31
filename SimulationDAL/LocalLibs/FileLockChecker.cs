// Copyright 2026 Battelle Energy Alliance
// Utility class that uses Win32 API calls to check whether a file or directory is locked by another process.
using System;
using System.Runtime.InteropServices;
using Microsoft.Win32.SafeHandles;
using System.IO;

namespace SimulationDAL.LocalLibs
{
  public class FileLockChecker
  {
    [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    private static extern SafeFileHandle CreateFile(
        string lpFileName,
        uint dwDesiredAccess,
        uint dwShareMode,
        IntPtr lpSecurityAttributes,
        uint dwCreationDisposition,
        uint dwFlagsAndAttributes,
        IntPtr hTemplateFile);

    private const uint GENERIC_READ = 0x80000000;
    private const uint GENERIC_WRITE = 0x40000000;
    private const uint OPEN_EXISTING = 3;
    private const uint FILE_ATTRIBUTE_NORMAL = 0x80;
    private const uint FILE_FLAG_BACKUP_SEMANTICS = 0x02000000; // Required for directories

    public static bool IsFileLocked(string filePath)
    {
      SafeFileHandle handle = CreateFile(
          filePath,
          GENERIC_READ | GENERIC_WRITE,
          0, // No sharing - exclusive access
          IntPtr.Zero,
          OPEN_EXISTING,
          FILE_ATTRIBUTE_NORMAL,
          IntPtr.Zero);

      if (handle.IsInvalid)
      {
        int error = Marshal.GetLastWin32Error();
        return error == 32 || error == 5; // Sharing violation or access denied
      }

      handle.Dispose();
      return false;
    }

    public static bool IsDirectoryLocked(string directoryPath, out string lockedFilePath)
    {
      lockedFilePath = null!;

      if (!Directory.Exists(directoryPath))
        return false;

      // First check if the directory itself is locked
      SafeFileHandle dirHandle = CreateFile(
          directoryPath,
          GENERIC_READ,
          0, // No sharing
          IntPtr.Zero,
          OPEN_EXISTING,
          FILE_FLAG_BACKUP_SEMANTICS, // Required for directories!
          IntPtr.Zero);

      if (dirHandle.IsInvalid)
      {
        int error = Marshal.GetLastWin32Error();
        if (error == 32 || error == 5)
        {
          lockedFilePath = directoryPath + " (directory itself)";
          return true;
        }
      }
      else
      {
        dirHandle.Dispose();
      }

      // Then check all files in the directory
      try
      {
        var files = Directory.GetFiles(directoryPath, "*.*", SearchOption.AllDirectories);
        foreach (var file in files)
        {
          if (IsFileLocked(file))
          {
            lockedFilePath = file;
            return true;
          }
        }
      }
      catch
      {
        lockedFilePath = directoryPath + " (enumeration failed)";
        return true;
      }

      // Also check subdirectories
      try
      {
        var subdirs = Directory.GetDirectories(directoryPath, "*", SearchOption.AllDirectories);
        foreach (var subdir in subdirs)
        {
          SafeFileHandle subHandle = CreateFile(
              subdir,
              GENERIC_READ,
              0,
              IntPtr.Zero,
              OPEN_EXISTING,
              FILE_FLAG_BACKUP_SEMANTICS,
              IntPtr.Zero);

          if (subHandle.IsInvalid)
          {
            int error = Marshal.GetLastWin32Error();
            if (error == 32 || error == 5)
            {
              lockedFilePath = subdir + " (subdirectory)";
              return true;
            }
          }
          else
          {
            subHandle.Dispose();
          }
        }
      }
      catch
      {
        // Ignore enumeration errors for subdirectories
      }

      return false;
    }
  }
}
