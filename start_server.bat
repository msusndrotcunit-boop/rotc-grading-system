@echo off
echo Starting ROTC Grading System Server...
cd server
node server.js
if %errorlevel% neq 0 (
    echo Server crashed with exit code %errorlevel%.
    pause
)
pause