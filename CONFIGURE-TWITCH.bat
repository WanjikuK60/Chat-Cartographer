@echo off
cd /d "%~dp0"
if exist "%~dp0tools\twitch-cli_1.1.24_Windows_x86_64\twitch.exe" (
  "%~dp0tools\twitch-cli_1.1.24_Windows_x86_64\twitch.exe" configure
) else (
  twitch configure
)
echo.
echo Twitch CLI configuration finished. Close this window when done.
pause
