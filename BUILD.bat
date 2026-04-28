@echo off
chcp 65001 >nul
title School Portal Full V10 - Build
echo ==========================================
echo Build School Portal Full V10
echo ==========================================
npm install
npm run build
pause
