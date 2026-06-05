@echo off
title Solvark Web Agency Platform
cls
echo =====================================================================
echo             SOLVARK PREMIUM WEB AGENCY PLATFORM
echo =====================================================================
echo.
echo [INFO] Starting Next.js 16 Development Server...
echo [INFO] Admin Dashboard: http://localhost:3000/admin
echo.
echo [INFO] Seeded Credentials:
echo   - Email:    admin@solvark.com
echo   - Password: solvarkadmin123
echo.
echo ---------------------------------------------------------------------
echo Launching default browser to admin gateway...
start http://localhost:3000/admin
echo.
echo Starting server process. Press Ctrl+C to terminate...
echo ---------------------------------------------------------------------
npm run dev
