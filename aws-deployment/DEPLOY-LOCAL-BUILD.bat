@echo off
echo ============================================================
echo  ESS-WEB AWS Deployment (Local Build Version)
echo ============================================================
echo.
echo This script will:
echo  1. Build your app LOCALLY (not in Docker)
echo  2. Create Docker image with pre-built files
echo  3. Push to AWS ECR
echo.
echo ============================================================
echo.

pause

echo [Step 1/6] Building React app locally...
echo This will take 2-5 minutes...
call npm run build

if errorlevel 1 (
    echo.
    echo ERROR: Local build failed!
    echo Check the error messages above.
    pause
    exit /b 1
)

echo.
echo [Step 2/6] Getting AWS Account ID...
for /f "tokens=*" %%i in ('aws sts get-caller-identity --query Account --output text') do set ACCOUNT_ID=%%i
echo Account ID: %ACCOUNT_ID%

set REGION=ap-southeast-1
set REPO=ess-web
set ECR_URI=%ACCOUNT_ID%.dkr.ecr.%REGION%.amazonaws.com/%REPO%

echo.
echo [Step 3/6] Building Docker image (simple - no build inside)...
docker build -f Dockerfile.simple -t %REPO%:latest .

if errorlevel 1 (
    echo.
    echo ERROR: Docker build failed!
    pause
    exit /b 1
)

echo.
echo [Step 4/6] Authenticating to AWS ECR...
aws ecr get-login-password --region %REGION% | docker login --username AWS --password-stdin %ECR_URI%

echo.
echo [Step 5/6] Tagging and pushing to ECR...
docker tag %REPO%:latest %ECR_URI%:latest
docker push %ECR_URI%:latest

if errorlevel 1 (
    echo.
    echo ERROR: Push failed!
    pause
    exit /b 1
)

echo.
echo ============================================================
echo  SUCCESS! Your app is now in AWS ECR!
echo ============================================================
echo.
echo Image URI: %ECR_URI%:latest
echo.
pause
