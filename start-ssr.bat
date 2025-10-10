@echo off
echo ========================================
echo   Game Smiths Club - SSR Server
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [1/3] Installing dependencies...
    call npm install ejs compression helmet
    echo.
) else (
    echo [1/3] Dependencies already installed
    echo.
)

REM Check if views folder exists
if not exist "views\" (
    echo [ERROR] Views folder not found!
    echo Please ensure the SSR setup is complete.
    pause
    exit /b 1
)

REM Check if public folder exists
if not exist "public\" (
    echo [ERROR] Public folder not found!
    echo Please ensure the SSR setup is complete.
    pause
    exit /b 1
)

echo [2/3] Starting SSR server...
echo.
echo Server will start on: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

REM Start the server
node server-ssr.js
