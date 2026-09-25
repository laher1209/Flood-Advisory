@echo off
setlocal enabledelayedexpansion
title FloodSafe - Cross-Platform React TSX Launcher
cd /d "%~dp0"

echo ========================================================
echo       FloodSafe React TSX Application Launcher
echo ========================================================
echo.

:: Check if Node.js & npm are installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] Node.js and npm were not detected on this computer.
    echo.
    echo Options:
    echo   [1] Open instant React App in browser (Zero-install, works right now)
    echo   [2] Install Node.js LTS automatically via Windows Package Manager (winget)
    echo   [3] Open nodejs.org in your browser to download installer
    echo.
    set /p choice="Enter choice [1, 2, or 3] (press Enter for 1): "
    if "!choice!"=="" set choice=1

    if "!choice!"=="1" (
        echo.
        echo Launching instant React preview in your default browser...
        start "" "%~dp0preview.html"
        exit /b 0
    )

    if "!choice!"=="2" (
        echo.
        echo Installing Node.js LTS via winget...
        winget install OpenJS.NodeJS.LTS
        echo.
        echo Once installation finishes, close this window and double-click start.bat again!
        pause
        exit /b 0
    )

    if "!choice!"=="3" (
        echo.
        echo Opening https://nodejs.org in your browser...
        start https://nodejs.org/
        pause
        exit /b 0
    )

    start "" "%~dp0preview.html"
    exit /b 0
)

echo [+] Node.js and npm detected!
echo.

:: Check if node_modules exists, if not install dependencies
if not exist "%~dp0node_modules" (
    echo [*] First time setup: Downloading and installing dependencies...
    echo [*] Running 'npm install'...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [!] npm install encountered an error.
        echo [*] Opening fallback instant preview in browser...
        start "" "%~dp0preview.html"
        pause
        exit /b 1
    )
    echo.
    echo [+] Dependencies installed successfully!
    echo.
)

echo [*] Starting local Vite Development Server...
echo [*] Press Ctrl+C in this window anytime to stop.
echo.

call npm run dev
