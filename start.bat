@echo off
cd /d "%~dp0"

echo Starting FloodSafe Backend Engine on port 5001
start "FloodSafe Backend" /min node server\index.js

if not exist node_modules (
    echo Installing dependencies, please wait...
    call npm install
)

echo Starting Vite Frontend on http://localhost:3000
call npm run dev