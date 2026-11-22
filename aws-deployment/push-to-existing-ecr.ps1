# Push ESS-WEB to Existing ECR Repository
# Use this script when you already have an ECR repository created

param(
    [Parameter(Mandatory=$false)]
    [string]$RepositoryName = "ess-web",
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "ap-southeast-1",
    
    [Parameter(Mandatory=$false)]
    [string]$ImageTag = "latest"
)

$ErrorActionPreference = "Stop"

Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Push to Existing ECR: $RepositoryName" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get AWS Account ID
Write-Host "Step 1: Getting AWS Account ID..." -ForegroundColor Yellow
try {
    $accountId = aws sts get-caller-identity --query Account --output text
    if ([string]::IsNullOrEmpty($accountId)) {
        throw "Could not get Account ID"
    }
    Write-Host "✓ Account ID: $accountId" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get AWS Account ID" -ForegroundColor Red
    Write-Host "  Make sure AWS CLI is configured: aws configure" -ForegroundColor Yellow
    exit 1
}

# Step 2: Verify ECR Repository Exists
Write-Host "`nStep 2: Verifying ECR repository exists..." -ForegroundColor Yellow
try {
    $repoUri = aws ecr describe-repositories `
        --repository-names $RepositoryName `
        --region $Region `
        --query 'repositories[0].repositoryUri' `
        --output text 2>$null
    
    if ([string]::IsNullOrEmpty($repoUri) -or $repoUri -eq "None") {
        throw "Repository not found"
    }
    Write-Host "✓ Found repository: $repoUri" -ForegroundColor Green
} catch {
    Write-Host "✗ ECR repository '$RepositoryName' not found in region '$Region'" -ForegroundColor Red
    Write-Host "  Create it first or check the repository name and region" -ForegroundColor Yellow
    exit 1
}

# Step 3: Build Docker Image
Write-Host "`nStep 3: Building Docker image..." -ForegroundColor Yellow
Write-Host "This will take 5-10 minutes..." -ForegroundColor Cyan

docker build -t ${RepositoryName}:${ImageTag} .
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Docker build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker image built successfully" -ForegroundColor Green

# Step 4: Authenticate Docker to ECR
Write-Host "`nStep 4: Authenticating to ECR..." -ForegroundColor Yellow
try {
    aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin "$accountId.dkr.ecr.$Region.amazonaws.com" 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Authentication failed"
    }
    Write-Host "✓ Successfully authenticated to ECR" -ForegroundColor Green
} catch {
    Write-Host "✗ ECR authentication failed" -ForegroundColor Red
    exit 1
}

# Step 5: Tag Image for ECR
Write-Host "`nStep 5: Tagging Docker image..." -ForegroundColor Yellow
$ecrImageUri = "${repoUri}:${ImageTag}"
docker tag ${RepositoryName}:${ImageTag} $ecrImageUri
Write-Host "✓ Tagged as: $ecrImageUri" -ForegroundColor Green

# Step 6: Push to ECR
Write-Host "`nStep 6: Pushing image to ECR..." -ForegroundColor Yellow
Write-Host "This may take several minutes depending on your internet speed..." -ForegroundColor Cyan

docker push $ecrImageUri
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Docker push failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Image successfully pushed to ECR!" -ForegroundColor Green

# Step 7: Verify Image in ECR
Write-Host "`nStep 7: Verifying image in ECR..." -ForegroundColor Yellow
$images = aws ecr list-images `
    --repository-name $RepositoryName `
    --region $Region `
    --query 'imageIds[?imageTag==`'"$ImageTag"'`]' `
    --output json | ConvertFrom-Json

if ($images.Count -gt 0) {
    Write-Host "✓ Image verified in ECR" -ForegroundColor Green
} else {
    Write-Host "⚠ Image pushed but not found in listing (may take a moment to appear)" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         PUSH SUCCESSFUL!                   ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Image URI: $ecrImageUri" -ForegroundColor Cyan
Write-Host "Repository: $RepositoryName" -ForegroundColor White
Write-Host "Region: $Region" -ForegroundColor White
Write-Host "Tag: $ImageTag" -ForegroundColor White
Write-Host ""

# Save details
$deploymentInfo = @"
ESS-WEB ECR Deployment
======================
Deployment Date: $(Get-Date)
AWS Account ID: $accountId
AWS Region: $Region

ECR Details:
- Repository Name: $RepositoryName
- Repository URI: $repoUri
- Image Tag: $ImageTag
- Full Image URI: $ecrImageUri

Next Steps:
-----------
1. Use this image URI in your ECS task definition
2. Update ecs-task-definition.json with: $ecrImageUri
3. Deploy to ECS with: .\deploy-to-ecs-fargate.ps1

View Images:
aws ecr list-images --repository-name $RepositoryName --region $Region

Pull Image:
docker pull $ecrImageUri
"@

$deploymentInfo | Out-File -FilePath "ecr-deployment-info.txt" -Encoding UTF8
Write-Host "Deployment info saved to: ecr-deployment-info.txt" -ForegroundColor Green
Write-Host ""

# Display next steps
Write-Host "═══════════════════════════════════════════" -ForegroundColor Yellow
Write-Host " NEXT STEPS" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Update your ECS task definition to use:" -ForegroundColor White
Write-Host "   $ecrImageUri" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Deploy to ECS Fargate:" -ForegroundColor White
Write-Host "   .\deploy-to-ecs-fargate.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "OR update existing ECS service:" -ForegroundColor White
Write-Host "   aws ecs update-service --cluster YOUR_CLUSTER --service YOUR_SERVICE --force-new-deployment --region $Region" -ForegroundColor Cyan
Write-Host ""
}