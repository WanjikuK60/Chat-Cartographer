@echo off
setlocal
cd /d "%~dp0"
git push -u origin main
if errorlevel 1 (
  echo.
  echo Push did not complete. Finish any GitHub sign-in prompt and try again.
  pause
  exit /b 1
)
echo.
echo Chat Cartographer has been pushed to https://github.com/WanjikuK60/Chat-Cartographer
pause
