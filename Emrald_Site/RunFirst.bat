@ECHO OFF

RMDIR /S /Q .\bin\
SET failures=0

xcopy ..\..\Common\Packages\Microsoft.AspNet.Identity.Core.2.2.3\lib\net45\Microsoft.AspNet.Identity.Core.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.Identity.Core.2.2.3\lib\net45\Microsoft.AspNet.Identity.Core.xml .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Owin.1.0\lib\net40\Owin.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.Web.Infrastructure.2.0.0\lib\net40\Microsoft.Web.Infrastructure.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.WebPages.3.2.9\lib\net45\System.Web.Helpers.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.WebPages.3.2.9\lib\net45\System.Web.Helpers.xml .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.Razor.3.2.9\lib\net45\System.Web.Razor.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.Razor.3.2.9\lib\net45\System.Web.Razor.xml .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.WebPages.3.2.9\lib\net45\System.Web.WebPages.Deployment.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.WebPages.3.2.9\lib\net45\System.Web.WebPages.Deployment.xml .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.WebPages.3.2.9\lib\net45\System.Web.WebPages.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.WebPages.3.2.9\lib\net45\System.Web.WebPages.xml .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.WebPages.3.2.9\lib\net45\System.Web.WebPages.Razor.dll .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)

xcopy ..\..\Common\Packages\Microsoft.AspNet.WebPages.3.2.9\lib\net45\System.Web.WebPages.Razor.xml .\bin\
IF ERRORLEVEL 1 (
	SET /a failures=failures+1
)


IF %failures% GTR 0 (
	ECHO %failures% files failed to copy.  Try building the solution in Visual Studio and running this script again.
)
IF %failures% EQU 0 (
	ECHO All Dependencies Copied Successfully!
)