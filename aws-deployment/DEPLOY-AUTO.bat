@echo off
echo ============================================================
echo  ESS-WEB AWS Deployment - AUTOMATED
echo ============================================================
echo.
echo [STEP 1/5] Building application locally...
echo.

call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Build failed!
    echo Check the output above for errors.
    pause
    exit /b 1
)

echo.
echo [STEP 2/5] Checking if dist folder exists...
echo.

if not exist "dist" (
    echo ERROR: dist folder not found!
    echo The build should have created a 'dist' folder.
    pause
    exit /b 1
)

echo SUCCESS: dist folder found
echo.
echo [STEP 3/5] Building Docker image...
echo.

docker build -f Dockerfile.simple -t ess-web:latest .
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Docker build failed!
    pause
    exit /b 1
)

echo.
echo [STEP 4/5] Logging into AWS ECR...
echo.

aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 085464833615.dkr.ecr.ap-southeast-1.amazonaws.com
if %errorlevel% neq 0 (
    echo.
    echo ERROR: AWS ECR login failed!
    pause
    exit /b 1
)

echo.
echo [STEP 5/5] Tagging and pushing to ECR...
echo.

docker tag ess-web:latest 085464833615.dkr.ecr.ap-southeast-1.amazonaws.com/ess-web:latest
docker push 085464833615.dkr.ecr.ap-southeast-1.amazonaws.com/ess-web:latest

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Push to ECR failed!
    pause
    exit /b 1
)

echo.
echo ============================================================
echo  DEPLOYMENT SUCCESSFUL!
echo ============================================================
echo.
echo Your image is now in ECR:
echo 085464833615.dkr.ecr.ap-southeast-1.amazonaws.com/ess-web:latest
echo.
echo Next steps:
echo 1. Go to AWS ECS Console
echo 2. Create a new Task Definition using this image
echo 3. Create or update an ECS Service with Fargate
echo.
pause
