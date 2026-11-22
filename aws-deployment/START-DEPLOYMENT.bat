@echo off
cls
echo.
echo ============================================================
echo           ESS-WEB DEPLOYMENT TO AWS
echo ============================================================
echo.
echo This script will:
echo   1. Build your Docker image
echo   2. Push it to AWS ECR
echo   3. Prepare for ECS deployment
echo.
echo Expected time: 15-30 minutes
echo.
echo ============================================================
echo.

pause

echo.
echo Starting deployment...
echo.

REM Change to project directory
cd /d f:\ERP-2026\ESS-WEB

REM Run the deployment
call DEPLOY-NOW.bat

echo.
echo ============================================================
echo.
echo Deployment script completed.
echo Check the output above for success or error messages.
echo.
echo ============================================================
pause
