@echo off
chcp 65001 >nul
title School Portal Full V10 - Local
echo ==========================================
echo School Portal Full V10
echo ==========================================
if not exist node_modules (
  echo [INFO] Installing dependencies...
  npm install
)
echo [INFO] Starting local server...
npm run dev
pause
