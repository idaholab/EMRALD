@ECHO OFF

RMDIR /S /Q .\bin\
SET failures=0

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\csc.exe .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\csc.exe.config .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\csc.rsp .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\csi.exe .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\csi.rsp .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\Microsoft.Build.Tasks.CodeAnalysis.dll .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\Microsoft.CodeAnalysis.CSharp.dll .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\Microsoft.CodeAnalysis.CSharp.Scripting.dll .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\Microsoft.CodeAnalysis.dll .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\Microsoft.CodeAnalysis.Scripting.dll .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\Microsoft.CodeAnalysis.VisualBasic.dll .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\Microsoft.CSharp.Core.targets .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\Microsoft.DiaSymReader.Native.amd64.dll .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\Microsoft.DiaSymReader.Native.x86.dll .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\Microsoft.VisualBasic.Core.targets .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\System.AppContext.dll .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\System.Collections.Immutable.dll .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\System.Diagnostics.StackTrace.dll .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\System.IO.FileSystem.dll .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\System.IO.FileSystem.Primitives.dll .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\System.Reflection.Metadata.dll .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\vbc.exe .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\vbc.exe.config .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\vbc.rsp .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\VBCSCompiler.exe .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\tools\roslyn45\VBCSCompiler.exe.config .\bin\roslyn\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.Identity.Core.2.2.3\lib\net45\Microsoft.AspNet.Identity.Core.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.Identity.Core.2.2.3\lib\net45\Microsoft.AspNet.Identity.Core.xml .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.Identity.Owin.2.2.3\lib\net45\Microsoft.AspNet.Identity.Owin.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.Identity.Owin.2.2.3\lib\net45\Microsoft.AspNet.Identity.Owin.xml .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\lib\net45\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.2.0.1\lib\net45\Microsoft.CodeDom.Providers.DotNetCompilerPlatform.xml .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.Owin.4.1.0\lib\net45\Microsoft.Owin.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.Owin.4.1.0\lib\net45\Microsoft.Owin.xml .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Owin.1.0\lib\net40\Owin.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.Owin.Security.Cookies.4.1.0\lib\net45\Microsoft.Owin.Security.Cookies.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.Owin.Security.Cookies.4.1.0\lib\net45\Microsoft.Owin.Security.Cookies.xml .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.Owin.Security.4.1.0\lib\net45\Microsoft.Owin.Security.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.Owin.Security.4.1.0\lib\net45\Microsoft.Owin.Security.xml .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.Owin.Security.OAuth.4.1.0\lib\net45\Microsoft.Owin.Security.OAuth.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.Owin.Security.OAuth.4.1.0\lib\net45\Microsoft.Owin.Security.OAuth.xml .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.Web.Infrastructure.1.0.0.0\lib\net40\Microsoft.Web.Infrastructure.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Newtonsoft.Json.12.0.3\lib\net45\Newtonsoft.Json.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Newtonsoft.Json.12.0.3\lib\net45\Newtonsoft.Json.xml .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.WebPages.3.2.7\lib\net45\System.Web.Helpers.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.WebPages.3.2.7\lib\net45\System.Web.Helpers.xml .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.Razor.3.2.7\lib\net45\System.Web.Razor.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.Razor.3.2.7\lib\net45\System.Web.Razor.xml .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.WebPages.3.2.7\lib\net45\System.Web.WebPages.Deployment.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.WebPages.3.2.7\lib\net45\System.Web.WebPages.Deployment.xml .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.WebPages.3.2.7\lib\net45\System.Web.WebPages.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.WebPages.3.2.7\lib\net45\System.Web.WebPages.xml .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.WebPages.3.2.7\lib\net45\System.Web.WebPages.Razor.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.WebPages.3.2.7\lib\net45\System.Web.WebPages.Razor.xml .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)


IF %failures% GTR 0 (
	ECHO %failures% files failed to copy.  Try building the solution in Visual Studio and running this script again.
)
IF %failures% EQU 0 (
	ECHO All Dependencies Copied Successfully!
)