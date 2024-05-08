rem this .bat is called from c# project SimulationDAL to create the JS files from the type script ones used to upgrade a project to the lastest version.
@echo off

rem Set the current directory to the directory of the batch script
cd /d "%~dp0" >nul

rem Set the target directory for TypeScript output
set "target_directory=%~dp0out" >nul

rem Delete existing files in the target directory
del /q "%target_directory%\*"

rem Compile TypeScript files and continue even if there's an error
tsc --target es2020 --outDir "%target_directory%" ExportForCSharp.ts >nul