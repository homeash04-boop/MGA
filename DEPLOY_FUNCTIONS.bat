@echo off
chcp 65001 >nul
title Deploy School Portal Edge Functions
echo ==========================================
echo Deploy School Portal Edge Functions
echo Project ref: dlsxlvzubiwcsojnwzcj
echo ==========================================
echo.
where npx >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npx not found. Install Node.js first.
  pause
  exit /b 1
)
npx supabase --version
npx supabase link --project-ref dlsxlvzubiwcsojnwzcj
npx supabase functions deploy create-user --no-verify-jwt
npx supabase functions deploy approve-password-reset --no-verify-jwt
echo.
echo If SERVICE_ROLE_KEY is not set, run:
echo npx supabase secrets set SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
pause
