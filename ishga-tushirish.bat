@echo off
chcp 65001 >nul
cd /d "%~dp0"
title ijarago
if not exist "node_modules" call npm install
if not exist "server\node_modules" call npm install --prefix server
if not exist "client\node_modules" call npm install --prefix client
if not exist "server\.env" copy "server\.env.example" "server\.env" >nul
echo.
echo Sayt: http://localhost:5173   (toxtatish: Ctrl+C)
echo.
call npm run dev
pause
