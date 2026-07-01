@echo off
setlocal EnableExtensions

set "ROOT=%~dp0.."
set "DIST=%ROOT%\dist"
set "WORK=%ROOT%\tmp-repack\backend"
set "SRC=%ROOT%\packages\obhodiq\files"

set "BASE_VERSION=%~1"
if not defined BASE_VERSION set "BASE_VERSION=0.1.0-r4"

set "NEW_VERSION=%~2"
if not defined NEW_VERSION set "NEW_VERSION=0.1.0-r5"

set "INPUT_IPK=%DIST%\obhodiq_%BASE_VERSION%_all.ipk"
set "OUTPUT_IPK=%DIST%\obhodiq_%NEW_VERSION%_all.ipk"

if not exist "%INPUT_IPK%" (
  echo Input package not found: %INPUT_IPK%
  exit /b 1
)

if not exist "%SRC%" (
  echo Source files not found: %SRC%
  exit /b 1
)

if exist "%WORK%" rmdir /s /q "%WORK%"
mkdir "%WORK%" || exit /b 1
mkdir "%WORK%\control" || exit /b 1
mkdir "%WORK%\data" || exit /b 1

tar -xf "%INPUT_IPK%" -C "%WORK%" || exit /b 1
tar -xf "%WORK%\control.tar.gz" -C "%WORK%\control" || exit /b 1

powershell -NoProfile -Command "$content = Get-Content '%WORK%\control\control' -Raw; $content = [regex]::Replace($content, '^Version: .*$','Version: %NEW_VERSION%','Multiline'); [System.IO.File]::WriteAllText('%WORK%\control\control', $content, (New-Object System.Text.UTF8Encoding($false)))"
if errorlevel 1 exit /b 1

mkdir "%WORK%\data\etc\config" || exit /b 1
mkdir "%WORK%\data\etc\init.d" || exit /b 1
mkdir "%WORK%\data\usr\bin" || exit /b 1
mkdir "%WORK%\data\usr\lib\obhodiq" || exit /b 1
mkdir "%WORK%\data\www\cgi-bin" || exit /b 1

copy /y "%SRC%\etc\config\obhodiq" "%WORK%\data\etc\config\obhodiq" >nul || exit /b 1
copy /y "%SRC%\etc\init.d\obhodiq" "%WORK%\data\etc\init.d\obhodiq" >nul || exit /b 1
copy /y "%SRC%\usr\bin\obhodiq" "%WORK%\data\usr\bin\obhodiq" >nul || exit /b 1
copy /y "%SRC%\www\cgi-bin\obhodiq" "%WORK%\data\www\cgi-bin\obhodiq" >nul || exit /b 1
xcopy /y /i /q "%SRC%\usr\lib\obhodiq\*" "%WORK%\data\usr\lib\obhodiq\" >nul || exit /b 1

del /f /q "%WORK%\control.tar.gz" "%WORK%\data.tar.gz" "%OUTPUT_IPK%" 2>nul

tar -czf "%WORK%\control.tar.gz" -C "%WORK%\control" . || exit /b 1
tar -czf "%WORK%\data.tar.gz" -C "%WORK%\data" . || exit /b 1

(
  cd /d "%WORK%"
  tar -czf "%OUTPUT_IPK%" debian-binary control.tar.gz data.tar.gz
) || exit /b 1

echo Built: %OUTPUT_IPK%
endlocal
