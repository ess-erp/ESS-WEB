# Simple script to push Docker image to ECR
param(
    [string]$Region = "ap-southeast-1",
    [string]$RepositoryName = "ess-web"
)

Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Pushing to ECR: $RepositoryName" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Get AWS Account ID
Write-Host "[1/6] Getting AWS Account ID..." -ForegroundColor Yellow
$accountId = aws sts get-caller-identity --query Account --output text
Write-Host "✓ Account ID: $accountId" -ForegroundColor Green

# Verify repository
Write-Host "`n[2/6] Verifying ECR repository..." -ForegroundColor Yellow
$repoUri = "$accountId.dkr.ecr.$Region.amazonaws.com/$RepositoryName"
Write-Host "✓ Repository URI: $repoUri" -ForegroundColor Green

# Build image
Write-Host "`n[3/6] Building Docker image..." -ForegroundColor Yellow
Write-Host "This will take 5-10 minutes..." -ForegroundColor Cyan
docker build -t ${RepositoryName}:latest .
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Build complete" -ForegroundColor Green

# Authenticate
Write-Host "`n[4/6] Authenticating to ECR..." -ForegroundColor Yellow
aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin $repoUri
Write-Host "✓ Authenticated" -ForegroundColor Green

# Tag image
Write-Host "`n[5/6] Tagging image..." -ForegroundColor Yellow
docker tag ${RepositoryName}:latest ${repoUri}:latest
Write-Host "✓ Tagged as: ${repoUri}:latest" -ForegroundColor Green

# Push to ECR
Write-Host "`n[6/6] Pushing to ECR..." -ForegroundColor Yellow
Write-Host "This may take several minutes..." -ForegroundColor Cyan
docker push ${repoUri}:latest
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Push failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║           SUCCESS!                         ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Image URI: ${repoUri}:latest" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Deploy to ECS with:" -ForegroundColor Yellow
Write-Host "  .\deploy-to-ecs-fargate.ps1" -ForegroundColor Cyan
Write-Host ""
