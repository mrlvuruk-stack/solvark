@echo off
title Solvark Public Website
cls
echo =====================================================================
echo             SOLVARK PREMIUM PUBLIC WEBSITE
echo =====================================================================
echo.
echo [INFO] Starting Next.js 16 Development Server...
echo [INFO] Public Website URL: http://localhost:3000/
echo.
echo ---------------------------------------------------------------------
echo Launching default browser to Solvark Homepage...
start http://localhost:3000/
echo.
echo Starting server process. Press Ctrl+C to terminate...
echo ---------------------------------------------------------------------
npm run dev
