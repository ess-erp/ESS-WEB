# Wait for Docker to be fully ready and then deploy

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host " Checking Docker Status..." -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# Wait for Docker to be ready
$maxAttempts = 30
$attempt = 0
$dockerReady = $false

while ($attempt -lt $maxAttempts -and -not $dockerReady) {
    $attempt++
    Write-Host "Attempt $attempt of $maxAttempts - Checking if Docker is ready..." -ForegroundColor Yellow
    
    try {
        # Try to run docker ps
        $result = docker ps 2>&1
        if ($LASTEXITCODE -eq 0) {
            $dockerReady = $true
            Write-Host "Docker is ready!" -ForegroundColor Green
        }
    } catch {
        Write-Host "Docker not ready yet, waiting..." -ForegroundColor Yellow
    }
    
    if (-not $dockerReady) {
        Start-Sleep -Seconds 5
    }
}

if (-not $dockerReady) {
    Write-Host ""
    Write-Host "ERROR: Docker is not ready after $maxAttempts attempts" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please:" -ForegroundColor Yellow
    Write-Host "1. Make sure Docker Desktop is running (check system tray)" -ForegroundColor White
    Write-Host "2. Wait for Docker Desktop to show 'Docker Desktop is running'" -ForegroundColor White
    Write-Host "3. Open a NEW Command Prompt window" -ForegroundColor White
    Write-Host "4. Navigate to: f:\ERP-2026\ESS-WEB" -ForegroundColor White
    Write-Host "5. Run: deploy-to-aws.bat" -ForegroundColor White
    Write-Host ""
    pause
    exit 1
}

Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host " Docker is Ready! Starting Deployment..." -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""

# Get AWS Account ID
Write-Host "[1/6] Getting AWS Account ID..." -ForegroundColor Yellow
try {
    $accountId = aws sts get-caller-identity --query Account --output text 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "AWS CLI not configured"
    }
    Write-Host "Account ID: $accountId" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "ERROR: AWS CLI is not configured!" -ForegroundColor Red
    Write-Host "Please run: aws configure" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

$region = "ap-southeast-1"
$repoName = "ess-web"
$ecrUri = "$accountId.dkr.ecr.$region.amazonaws.com/$repoName"

Write-Host ""
Write-Host "[2/6] Building Docker image..." -ForegroundColor Yellow
Write-Host "This will take 5-10 minutes. Please wait..." -ForegroundColor Cyan
Write-Host ""

docker build -t ${repoName}:latest .

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Docker build failed!" -ForegroundColor Red
    Write-Host "Check the error messages above." -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

Write-Host ""
Write-Host "[3/6] Authenticating to ECR..." -ForegroundColor Yellow
aws ecr get-login-password --region $region | docker login --username AWS --password-stdin $ecrUri

Write-Host ""
Write-Host "[4/6] Tagging image..." -ForegroundColor Yellow
docker tag ${repoName}:latest ${ecrUri}:latest
Write-Host "Tagged as: ${ecrUri}:latest" -ForegroundColor Green

Write-Host ""
Write-Host "[5/6] Pushing to ECR..." -ForegroundColor Yellow
Write-Host "This may take 10-20 minutes depending on your internet speed..." -ForegroundColor Cyan
Write-Host ""

docker push ${ecrUri}:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Failed to push to ECR!" -ForegroundColor Red
    Write-Host ""
    pause
    exit 1
}

Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host " SUCCESS! Image pushed to ECR" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Image URI: ${ecrUri}:latest" -ForegroundColor Cyan
Write-Host "Region: $region" -ForegroundColor White
Write-Host "Repository: $repoName" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Deploy to ECS Fargate using AWS Console, or" -ForegroundColor White
Write-Host "2. Run: .\deploy-to-ecs-fargate.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Deployment info saved to: ecr-push-info.txt" -ForegroundColor Green

# Save deployment info
@"
ESS-WEB ECR Push - Success
==========================
Date: $(Get-Date)
AWS Account: $accountId
Region: $region
Repository: $repoName
Image URI: ${ecrUri}:latest

Your Docker image is now in AWS ECR and ready to deploy!

Next: Deploy to ECS Fargate
"@ | Out-File -FilePath "ecr-push-info.txt" -Encoding UTF8

Write-Host ""
pause
