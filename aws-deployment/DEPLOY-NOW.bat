@echo off
echo ============================================================
echo  ESS-WEB AWS Deployment
echo ============================================================
echo.

echo [CHECK 1/3] Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not accessible!
    echo.
    echo Please:
    echo 1. Make sure Docker Desktop shows "running" in system tray
    echo 2. Wait 1-2 minutes for Docker to fully start
    echo 3. Close this window and run this script again
    echo.
    pause
    exit /b 1
)
echo Docker is ready!

echo.
echo [CHECK 2/3] Checking AWS CLI...
aws --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: AWS CLI is not accessible!
    echo.
    echo You need to install AWS CLI:
    echo https://aws.amazon.com/cli/
    echo.
    echo Or if already installed, open a NEW terminal window
    echo.
    pause
    exit /b 1
)
echo AWS CLI is ready!

echo.
echo [CHECK 3/3] Checking AWS credentials...
aws sts get-caller-identity >nul 2>&1
if errorlevel 1 (
    echo ERROR: AWS is not configured!
    echo.
    echo Please run: aws configure
    echo And enter your AWS credentials
    echo.
    pause
    exit /b 1
)
echo AWS credentials configured!

echo.
echo ============================================================
echo  All checks passed! Starting deployment...
echo ============================================================
echo.

REM Get account ID
for /f "tokens=*" %%i in ('aws sts get-caller-identity --query Account --output text') do set ACCOUNT_ID=%%i
echo AWS Account: %ACCOUNT_ID%

set REGION=ap-southeast-1
set REPO=ess-web
set ECR_URI=%ACCOUNT_ID%.dkr.ecr.%REGION%.amazonaws.com/%REPO%

echo Region: %REGION%
echo Repository: %REPO%
echo ECR URI: %ECR_URI%
echo.

echo ============================================================
echo  STEP 1/5: Building Docker Image
echo  This will take 5-10 minutes...
echo ============================================================
echo.

docker build -t %REPO%:latest .
if errorlevel 1 (
    echo.
    echo ERROR: Docker build failed!
    echo Check the error messages above.
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo  STEP 2/5: Authenticating to AWS ECR
echo ============================================================
echo.

aws ecr get-login-password --region %REGION% | docker login --username AWS --password-stdin %ECR_URI%
if errorlevel 1 (
    echo.
    echo ERROR: ECR authentication failed!
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo  STEP 3/5: Tagging Docker Image
echo ============================================================
echo.

docker tag %REPO%:latest %ECR_URI%:latest
echo Tagged: %ECR_URI%:latest

echo.
echo ============================================================
echo  STEP 4/5: Pushing to AWS ECR
echo  This will take 5-20 minutes depending on internet speed...
echo ============================================================
echo.

docker push %ECR_URI%:latest
if errorlevel 1 (
    echo.
    echo ERROR: Push to ECR failed!
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo  STEP 5/5: Saving Deployment Info
echo ============================================================
echo.

echo ESS-WEB Deployment to AWS ECR > deployment-success.txt
echo ================================ >> deployment-success.txt
echo Date: %DATE% %TIME% >> deployment-success.txt
echo Account ID: %ACCOUNT_ID% >> deployment-success.txt
echo Region: %REGION% >> deployment-success.txt
echo Repository: %REPO% >> deployment-success.txt
echo Image URI: %ECR_URI%:latest >> deployment-success.txt
echo. >> deployment-success.txt
echo Your Docker image is now in AWS ECR! >> deployment-success.txt
echo. >> deployment-success.txt
echo Next steps: >> deployment-success.txt
echo 1. Go to AWS Console ^> ECS >> deployment-success.txt
echo 2. Create a new Fargate service using this image >> deployment-success.txt
echo 3. Or run: deploy-to-ecs-fargate.ps1 >> deployment-success.txt

echo.
echo ============================================================
echo  SUCCESS! Your app is now in AWS ECR!
echo ============================================================
echo.
echo Image URI: %ECR_URI%:latest
echo.
echo Deployment details saved to: deployment-success.txt
echo.
echo Next: Deploy to ECS Fargate
echo   - Option 1: Use AWS Console (easiest)
echo   - Option 2: Run deploy-to-ecs-fargate.ps1
echo.
echo ============================================================
pause
