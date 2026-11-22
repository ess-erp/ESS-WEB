@echo off
setlocal

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0
REM Get the project root (parent of aws-deployment)
cd /d "%SCRIPT_DIR%.."
set PROJECT_ROOT=%CD%

echo ============================================================
echo  ESS-WEB - Update Deployment
echo ============================================================
echo.
echo This will:
echo  1. Build your updated code
echo  2. Create new Docker image
echo  3. Push to ECR
echo  4. Force ECS to use the new image
echo.
echo Project Root: %PROJECT_ROOT%
echo ============================================================
echo.

echo [STEP 1/5] Building application...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [STEP 2/5] Building Docker image...
docker build -f aws-deployment/Dockerfile.simple -t ess-web:latest .
if %errorlevel% neq 0 (
    echo ERROR: Docker build failed!
    pause
    exit /b 1
)

echo.
echo [STEP 3/5] Logging into AWS ECR...
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 085464833615.dkr.ecr.ap-southeast-1.amazonaws.com

echo.
echo [STEP 4/5] Tagging and pushing to ECR...
docker tag ess-web:latest 085464833615.dkr.ecr.ap-southeast-1.amazonaws.com/ess-web:latest
docker push 085464833615.dkr.ecr.ap-southeast-1.amazonaws.com/ess-web:latest

echo.
echo [STEP 5/5] Forcing ECS to update service (PRODUCTION - ess-web-task-service-ztakm2kh)...
aws ecs update-service --cluster ess-web-cluster --service ess-web-task-service-ztakm2kh --force-new-deployment --region ap-southeast-1

echo.
echo ============================================================
echo  UPDATE COMPLETE!
echo ============================================================
echo.
echo Your service is being updated with the new code.
echo It will take 2-3 minutes for the new version to be live.
echo.
echo Domain: https://erp.ess.edu.ph
echo.
echo Check status at:
echo https://ap-southeast-1.console.aws.amazon.com/ecs/v2/clusters/ess-web-cluster/services/ess-web-task-service-ztakm2kh
echo.
pause
