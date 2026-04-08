@echo off
setlocal

where pnpm >nul 2>nul
if errorlevel 1 (
  echo pnpm is required to run the Nexu desktop client.
  echo Install Node.js and pnpm first, then try again.
  exit /b 1
)

call pnpm dev:demo
