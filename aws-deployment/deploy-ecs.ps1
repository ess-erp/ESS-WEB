# ESS-WEB AWS ECS Fargate Deployment Script
# PowerShell script for Windows

param(
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1",
    
    [Parameter(Mandatory=$false)]
    [string]$ClusterName = "ess-web-cluster",
    
    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "ess-web-service",
    
    [Parameter(Mandatory=$false)]
    [string]$RepositoryName = "ess-web"
)

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Green "========================================="
Write-ColorOutput Green "  ESS-WEB ECS Fargate Deployment"
Write-ColorOutput Green "========================================="
Write-Output ""

# Step 1: Check AWS CLI
Write-ColorOutput Yellow "Step 1: Checking AWS CLI..."
try {
    $awsVersion = aws --version 2>&1
    Write-Output "✓ AWS CLI found: $awsVersion"
} catch {
    Write-ColorOutput Red "✗ AWS CLI not found. Please install AWS CLI first."
    exit 1
}

# Step 2: Check Docker
Write-ColorOutput Yellow "`nStep 2: Checking Docker..."
try {
    $dockerVersion = docker --version
    Write-Output "✓ Docker found: $dockerVersion"
} catch {
    Write-ColorOutput Red "✗ Docker not found. Please install Docker Desktop."
    exit 1
}

# Step 3: Get AWS Account ID
Write-ColorOutput Yellow "`nStep 3: Getting AWS Account ID..."
try {
    $accountId = aws sts get-caller-identity --query Account --output text
    Write-Output "✓ AWS Account ID: $accountId"
} catch {
    Write-ColorOutput Red "✗ Failed to get AWS Account ID. Please run 'aws configure' first."
    exit 1
}

# Step 4: Create ECR Repository
Write-ColorOutput Yellow "`nStep 4: Creating ECR Repository..."
$ecrRepo = aws ecr describe-repositories --repository-names $RepositoryName --region $Region 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Output "Creating new ECR repository: $RepositoryName"
    aws ecr create-repository --repository-name $RepositoryName --region $Region --image-scanning-configuration scanOnPush=true
    Write-Output "✓ ECR Repository created"
} else {
    Write-Output "✓ ECR Repository already exists"
}

$ecrUri = "$accountId.dkr.ecr.$Region.amazonaws.com/$RepositoryName"
Write-Output "ECR URI: $ecrUri"

# Step 5: Build Docker Image
Write-ColorOutput Yellow "`nStep 5: Building Docker image..."
docker build -t ${RepositoryName}:latest .
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Red "✗ Docker build failed"
    exit 1
}
Write-Output "✓ Docker image built successfully"

# Step 6: Authenticate to ECR
Write-ColorOutput Yellow "`nStep 6: Authenticating to ECR..."
aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin $ecrUri
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Red "✗ ECR authentication failed"
    exit 1
}
Write-Output "✓ Successfully authenticated to ECR"

# Step 7: Tag and Push Image
Write-ColorOutput Yellow "`nStep 7: Tagging and pushing Docker image..."
docker tag ${RepositoryName}:latest ${ecrUri}:latest
docker push ${ecrUri}:latest
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Red "✗ Docker push failed"
    exit 1
}
Write-Output "✓ Image pushed to ECR successfully"

# Step 8: Create CloudWatch Log Group
Write-ColorOutput Yellow "`nStep 8: Creating CloudWatch Log Group..."
$logGroup = aws logs describe-log-groups --log-group-name-prefix "/ecs/ess-web" --region $Region 2>&1
if ($LASTEXITCODE -ne 0) {
    aws logs create-log-group --log-group-name "/ecs/ess-web" --region $Region
    Write-Output "✓ CloudWatch log group created"
} else {
    Write-Output "✓ CloudWatch log group already exists"
}

# Step 9: Create/Update Task Definition
Write-ColorOutput Yellow "`nStep 9: Updating task definition with account ID..."
$taskDefContent = Get-Content ecs-task-definition.json -Raw
$taskDefContent = $taskDefContent -replace 'YOUR_ACCOUNT_ID', $accountId
$taskDefContent | Set-Content ecs-task-definition-updated.json

Write-Output "Registering task definition..."
aws ecs register-task-definition --cli-input-json file://ecs-task-definition-updated.json --region $Region
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Red "✗ Task definition registration failed"
    exit 1
}
Write-Output "✓ Task definition registered"

# Step 10: Check if Cluster Exists
Write-ColorOutput Yellow "`nStep 10: Checking ECS Cluster..."
$clusterExists = aws ecs describe-clusters --clusters $ClusterName --region $Region --query 'clusters[0].status' --output text 2>&1
if ($clusterExists -eq "ACTIVE") {
    Write-Output "✓ ECS Cluster already exists: $ClusterName"
} else {
    Write-Output "Creating ECS Cluster: $ClusterName"
    aws ecs create-cluster --cluster-name $ClusterName --region $Region
    Write-Output "✓ ECS Cluster created"
}

# Step 11: Instructions for Service Creation
Write-ColorOutput Green "`n========================================="
Write-ColorOutput Green "  NEXT STEPS - MANUAL CONFIGURATION"
Write-ColorOutput Green "========================================="
Write-Output ""
Write-Output "The Docker image has been built and pushed to ECR successfully!"
Write-Output "Image URI: $ecrUri:latest"
Write-Output ""
Write-ColorOutput Yellow "To complete the deployment, you need to:"
Write-Output ""
Write-Output "1. Create VPC and Subnets (if not exists):"
Write-Output "   - Use AWS Console > VPC > Create VPC"
Write-Output "   - Or use the default VPC"
Write-Output ""
Write-Output "2. Create Security Group:"
Write-Output "   - Allow inbound: Port 80 (HTTP) from 0.0.0.0/0"
Write-Output "   - Allow inbound: Port 443 (HTTPS) from 0.0.0.0/0"
Write-Output "   - Allow outbound: All traffic"
Write-Output ""
Write-Output "3. Create Application Load Balancer (ALB):"
Write-Output "   aws elbv2 create-load-balancer --name ess-web-alb \"
Write-Output "     --subnets subnet-xxxxx subnet-yyyyy \"
Write-Output "     --security-groups sg-xxxxx --region $Region"
Write-Output ""
Write-Output "4. Create Target Group:"
Write-Output "   aws elbv2 create-target-group --name ess-web-tg \"
Write-Output "     --protocol HTTP --port 80 --vpc-id vpc-xxxxx \"
Write-Output "     --target-type ip --health-check-path /health \"
Write-Output "     --region $Region"
Write-Output ""
Write-Output "5. Create ECS Service:"
Write-Output "   Use the create-ecs-service.ps1 script or AWS Console"
Write-Output ""
Write-ColorOutput Cyan "Run './create-ecs-service.ps1' to create the service (after setting up VPC/ALB)"
Write-Output ""
Write-Output "For detailed instructions, see: ecs-deployment-guide.md"
Write-Output ""
Write-ColorOutput Green "========================================="
