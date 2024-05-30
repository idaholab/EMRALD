rem this .bat is called from c# project SimulationDAL on build, to bundle all the JS files used to upgrade a project to the lastest version, into a sigle JS file and is copied to that project so it can be executed inside of c#

@echo off
cd /d "%~dp0" >nul
set "exportJS_File=.\out\dist\cSharpBundle.js"

call npx rollup .\out\ExportForCSharp.js --file %exportJS_File% --format cjs --plugin @rollup/plugin-node-resolve >nul

rem remove the last line that has the "exports.UpgradeEMRALDModel = UpgradeEMRALDModel;" as that is not allowed in the c# call
type "%exportJS_File%" | findstr /v /c:"exports.UpgradeEMRALDModel = UpgradeEMRALDModel;" > "%exportJS_File%.tmp" 

rem Replace the original file with the filtered temporary file
move /y "%exportJS_File%.tmp" "%exportJS_File%" > nul

rem Save the javascript file to the location specified by the first parameter to the .bat
set "file_path=%~1"
for %%I in ("%file_path%") do set "pDir=%%~dpI" >nul

if exist "%exportJS_File%" (
    if not "%pDir%"=="" (
        echo make sure path exists 
        if not exist "%pDir%" mkdir "%pDir%"
        echo copy jsFile for c# : "%exportJS_File%" to "%file_path%"
        copy "%exportJS_File%" "%file_path%"
    )
)
