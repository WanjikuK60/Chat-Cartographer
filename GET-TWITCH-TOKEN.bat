@echo off
cd /d "%~dp0"
if exist "%~dp0tools\twitch-cli_1.1.24_Windows_x86_64\twitch.exe" (
  "%~dp0tools\twitch-cli_1.1.24_Windows_x86_64\twitch.exe" token --user-token --scopes "chat:read"
) else (
  twitch token --user-token --scopes "chat:read"
)
echo.
echo Keep the token private. Enter it only in Chat Cartographer.
pause
