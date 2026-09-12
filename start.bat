@echo off
title EARIP - Enterprise AI Retail Intelligence Platform
echo ==============================================================================
echo   EARIP - Enterprise AI Retail Intelligence Platform
echo   FastAPI Backend + React Frontend + Supabase Database + Groq Llama-3.3-70B
echo ==============================================================================
echo.

echo Starting FastAPI Backend on http://localhost:8000 ...
start "EARIP Backend" cmd /k "cd /d %~dp0backend && .\venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo Waiting 3 seconds for backend initialization...
timeout /t 3 /nobreak >nul

echo Starting Vite Frontend on http://localhost:5180 ...
start "EARIP Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ==============================================================================
echo   EARIP is now launching!
echo   Frontend: http://localhost:5180
echo   Backend Docs: http://localhost:8000/docs
echo   Health Check: http://localhost:8000/api/health
echo ==============================================================================
pause
