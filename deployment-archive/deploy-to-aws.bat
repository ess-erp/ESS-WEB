@echo off
echo ===================================================
echo  ESS-WEB AWS ECS Deployment
echo ===================================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

REM Check if AWS CLI is configured
aws sts get-caller-identity >nul 2>&1
if errorlevel 1 (
    echo ERROR: AWS CLI is not configured!
    echo Please run: aws configure
    pause
    exit /b 1
)

echo Step 1/6: Getting AWS Account ID...
for /f "tokens=*" %%i in ('aws sts get-caller-identity --query Account --output text') do set ACCOUNT_ID=%%i
echo Account ID: %ACCOUNT_ID%

set REGION=ap-southeast-1
set REPO_NAME=ess-web
set ECR_URI=%ACCOUNT_ID%.dkr.ecr.%REGION%.amazonaws.com/%REPO_NAME%

echo.
echo Step 2/6: Building Docker image...
echo This will take 5-10 minutes...
docker build -t %REPO_NAME%:latest .
if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Step 3/6: Authenticating to ECR...
aws ecr get-login-password --region %REGION% | docker login --username AWS --password-stdin %ECR_URI%

echo.
echo Step 4/6: Tagging image...
docker tag %REPO_NAME%:latest %ECR_URI%:latest

echo.
echo Step 5/6: Pushing to ECR...
echo This may take 10-20 minutes...
docker push %ECR_URI%:latest
if errorlevel 1 (
    echo Push failed!
    pause
    exit /b 1
)

echo.
echo Step 6/6: Image pushed successfully!
echo.
echo ===================================================
echo  SUCCESS! Image is now in ECR
echo ===================================================
echo.
echo Image URI: %ECR_URI%:latest
echo.
echo Next steps:
echo 1. Go to AWS Console
echo 2. Navigate to ECS
echo 3. Create a new service using this image
echo.
echo Or run: deploy-ecs-service.bat
echo.
pause
