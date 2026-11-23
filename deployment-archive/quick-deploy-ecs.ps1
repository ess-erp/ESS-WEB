# ESS-WEB Quick Deploy to AWS ECS Fargate
# This script automates the entire deployment process

param(
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1"
)

$ErrorActionPreference = "Stop"

Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   ESS-WEB AWS ECS Fargate Quick Deploy    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Function to print section headers
function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host "═══════════════════════════════════════════" -ForegroundColor Yellow
    Write-Host " $Title" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════════" -ForegroundColor Yellow
}

# Function to check command exists
function Test-Command {
    param([string]$Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    } catch {
        return $false
    }
}

# 1. Prerequisites Check
Write-Section "1. Checking Prerequisites"

if (-not (Test-Command "aws")) {
    Write-Host "✗ AWS CLI not found. Please install from: https://aws.amazon.com/cli/" -ForegroundColor Red
    exit 1
}
Write-Host "✓ AWS CLI installed" -ForegroundColor Green

if (-not (Test-Command "docker")) {
    Write-Host "✗ Docker not found. Please install Docker Desktop" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker installed" -ForegroundColor Green

try {
    $accountId = aws sts get-caller-identity --query Account --output text
    Write-Host "✓ AWS configured - Account ID: $accountId" -ForegroundColor Green
} catch {
    Write-Host "✗ AWS not configured. Run 'aws configure' first" -ForegroundColor Red
    exit 1
}

# 2. Get VPC Information
Write-Section "2. Getting VPC Information"

$vpcId = aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text --region $Region
if ([string]::IsNullOrEmpty($vpcId)) {
    Write-Host "✗ No default VPC found. Please create a VPC first." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Using VPC: $vpcId" -ForegroundColor Green

$subnets = aws ec2 describe-subnets --filters "Name=vpc-id,Values=$vpcId" --query "Subnets[*].SubnetId" --output text --region $Region
$subnetArray = $subnets -split "\s+"
if ($subnetArray.Count -lt 2) {
    Write-Host "✗ Need at least 2 subnets in different AZs" -ForegroundColor Red
    exit 1
}
$subnet1 = $subnetArray[0]
$subnet2 = $subnetArray[1]
Write-Host "✓ Using Subnets: $subnet1, $subnet2" -ForegroundColor Green

# 3. Create Security Groups
Write-Section "3. Creating Security Groups"

# Check if security group exists
$existingSg = aws ec2 describe-security-groups --filters "Name=group-name,Values=ess-web-ecs-sg" "Name=vpc-id,Values=$vpcId" --query "SecurityGroups[0].GroupId" --output text --region $Region 2>$null

if ($existingSg -and $existingSg -ne "None") {
    $sgId = $existingSg
    Write-Host "✓ Using existing ECS security group: $sgId" -ForegroundColor Green
} else {
    $sgId = aws ec2 create-security-group --group-name ess-web-ecs-sg --description "ESS Web ECS tasks" --vpc-id $vpcId --query 'GroupId' --output text --region $Region
    Start-Sleep -Seconds 2
    aws ec2 authorize-security-group-ingress --group-id $sgId --protocol tcp --port 80 --cidr 0.0.0.0/0 --region $Region 2>$null
    Write-Host "✓ Created ECS security group: $sgId" -ForegroundColor Green
}

# ALB Security Group
$existingAlbSg = aws ec2 describe-security-groups --filters "Name=group-name,Values=ess-web-alb-sg" "Name=vpc-id,Values=$vpcId" --query "SecurityGroups[0].GroupId" --output text --region $Region 2>$null

if ($existingAlbSg -and $existingAlbSg -ne "None") {
    $albSgId = $existingAlbSg
    Write-Host "✓ Using existing ALB security group: $albSgId" -ForegroundColor Green
} else {
    $albSgId = aws ec2 create-security-group --group-name ess-web-alb-sg --description "ESS Web ALB" --vpc-id $vpcId --query 'GroupId' --output text --region $Region
    Start-Sleep -Seconds 2
    aws ec2 authorize-security-group-ingress --group-id $albSgId --protocol tcp --port 80 --cidr 0.0.0.0/0 --region $Region 2>$null
    aws ec2 authorize-security-group-ingress --group-id $sgId --protocol tcp --port 80 --source-group $albSgId --region $Region 2>$null
    Write-Host "✓ Created ALB security group: $albSgId" -ForegroundColor Green
}

# 4. Build and Push Docker Image
Write-Section "4. Building and Pushing Docker Image"

Write-Host "This will take 5-10 minutes..." -ForegroundColor Yellow

# Create ECR repository
$ecrRepo = aws ecr describe-repositories --repository-names ess-web --region $Region 2>$null
if ($LASTEXITCODE -ne 0) {
    aws ecr create-repository --repository-name ess-web --region $Region --image-scanning-configuration scanOnPush=true | Out-Null
    Write-Host "✓ Created ECR repository" -ForegroundColor Green
} else {
    Write-Host "✓ Using existing ECR repository" -ForegroundColor Green
}

$ecrUri = "$accountId.dkr.ecr.$Region.amazonaws.com/ess-web"

# Authenticate Docker
aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin $ecrUri 2>$null | Out-Null
Write-Host "✓ Authenticated to ECR" -ForegroundColor Green

# Build image
Write-Host "Building Docker image..." -ForegroundColor Yellow
docker build -t ess-web:latest . --quiet
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Docker build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker image built" -ForegroundColor Green

# Push image
Write-Host "Pushing image to ECR..." -ForegroundColor Yellow
docker tag ess-web:latest ${ecrUri}:latest
docker push ${ecrUri}:latest --quiet
Write-Host "✓ Image pushed to ECR" -ForegroundColor Green

# 5. Create ECS Resources
Write-Section "5. Creating ECS Resources"

# Create log group
aws logs create-log-group --log-group-name "/ecs/ess-web" --region $Region 2>$null
Write-Host "✓ CloudWatch log group ready" -ForegroundColor Green

# Update and register task definition
$taskDefContent = Get-Content ecs-task-definition.json -Raw
$taskDefContent = $taskDefContent -replace 'YOUR_ACCOUNT_ID', $accountId
$taskDefContent | Set-Content ecs-task-definition-updated.json
aws ecs register-task-definition --cli-input-json file://ecs-task-definition-updated.json --region $Region | Out-Null
Write-Host "✓ Task definition registered" -ForegroundColor Green

# Create cluster
$clusterExists = aws ecs describe-clusters --clusters ess-web-cluster --region $Region --query 'clusters[0].status' --output text 2>$null
if ($clusterExists -ne "ACTIVE") {
    aws ecs create-cluster --cluster-name ess-web-cluster --region $Region | Out-Null
    Write-Host "✓ ECS cluster created" -ForegroundColor Green
} else {
    Write-Host "✓ Using existing ECS cluster" -ForegroundColor Green
}

# 6. Create Load Balancer
Write-Section "6. Creating Application Load Balancer"

# Create target group
$existingTg = aws elbv2 describe-target-groups --names ess-web-tg --region $Region --query 'TargetGroups[0].TargetGroupArn' --output text 2>$null
if ($existingTg -and $existingTg -ne "None") {
    $tgArn = $existingTg
    Write-Host "✓ Using existing target group" -ForegroundColor Green
} else {
    $tgArn = aws elbv2 create-target-group --name ess-web-tg --protocol HTTP --port 80 --vpc-id $vpcId --target-type ip --health-check-path /health --region $Region --query 'TargetGroups[0].TargetGroupArn' --output text
    Write-Host "✓ Target group created" -ForegroundColor Green
}

# Create ALB
$existingAlb = aws elbv2 describe-load-balancers --names ess-web-alb --region $Region --query 'LoadBalancers[0].LoadBalancerArn' --output text 2>$null
if ($existingAlb -and $existingAlb -ne "None") {
    $albArn = $existingAlb
    Write-Host "✓ Using existing ALB" -ForegroundColor Green
} else {
    Write-Host "Creating Application Load Balancer (this takes 2-3 minutes)..." -ForegroundColor Yellow
    $albArn = aws elbv2 create-load-balancer --name ess-web-alb --subnets $subnet1 $subnet2 --security-groups $albSgId --scheme internet-facing --region $Region --query 'LoadBalancers[0].LoadBalancerArn' --output text
    
    # Wait for ALB to be active
    Write-Host "Waiting for ALB to become active..." -ForegroundColor Yellow
    Start-Sleep -Seconds 60
    
    # Create listener
    aws elbv2 create-listener --load-balancer-arn $albArn --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn=$tgArn --region $Region | Out-Null
    Write-Host "✓ ALB created and configured" -ForegroundColor Green
}

# Get ALB DNS
$albDns = aws elbv2 describe-load-balancers --load-balancer-arns $albArn --query 'LoadBalancers[0].DNSName' --output text --region $Region

# 7. Create ECS Service
Write-Section "7. Creating ECS Service"

$existingService = aws ecs describe-services --cluster ess-web-cluster --services ess-web-service --region $Region --query 'services[0].status' --output text 2>$null
if ($existingService -eq "ACTIVE") {
    Write-Host "Service already exists. Updating..." -ForegroundColor Yellow
    aws ecs update-service --cluster ess-web-cluster --service ess-web-service --force-new-deployment --region $Region | Out-Null
    Write-Host "✓ Service updated" -ForegroundColor Green
} else {
    # Create service JSON
    $serviceJson = @"
{
  "cluster": "ess-web-cluster",
  "serviceName": "ess-web-service",
  "taskDefinition": "ess-web-task",
  "desiredCount": 2,
  "launchType": "FARGATE",
  "platformVersion": "LATEST",
  "networkConfiguration": {
    "awsvpcConfiguration": {
      "subnets": ["$subnet1", "$subnet2"],
      "securityGroups": ["$sgId"],
      "assignPublicIp": "ENABLED"
    }
  },
  "loadBalancers": [
    {
      "targetGroupArn": "$tgArn",
      "containerName": "ess-web-container",
      "containerPort": 80
    }
  ],
  "healthCheckGracePeriodSeconds": 60
}
"@
    $serviceJson | Out-File -FilePath "ecs-service-config.json" -Encoding UTF8
    
    Write-Host "Creating ECS service with 2 tasks..." -ForegroundColor Yellow
    aws ecs create-service --cli-input-json file://ecs-service-config.json --region $Region | Out-Null
    Write-Host "✓ ECS service created" -ForegroundColor Green
}

# 8. Summary
Write-Section "8. Deployment Complete!"

Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║           DEPLOYMENT SUCCESSFUL!           ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Your application is deploying and will be available at:" -ForegroundColor Cyan
Write-Host "  http://$albDns" -ForegroundColor Yellow
Write-Host ""
Write-Host "It may take 2-3 minutes for tasks to become healthy." -ForegroundColor Cyan
Write-Host ""
Write-Host "Monitor deployment:" -ForegroundColor White
Write-Host "  aws ecs describe-services --cluster ess-web-cluster --services ess-web-service --region $Region" -ForegroundColor Gray
Write-Host ""
Write-Host "View logs:" -ForegroundColor White
Write-Host "  aws logs tail /ecs/ess-web --follow --region $Region" -ForegroundColor Gray
Write-Host ""
Write-Host "Open in browser (in 2 minutes):" -ForegroundColor White
Write-Host "  Start-Process 'http://$albDns'" -ForegroundColor Gray
Write-Host ""

# Offer to open in browser
$response = Read-Host "Open in browser now? (y/n)"
if ($response -eq 'y') {
    Start-Process "http://$albDns"
}

Write-Host ""
Write-Host "Deployment details saved to: deployment-info.txt" -ForegroundColor Green

# Save deployment info
@"
ESS-WEB Deployment Information
==============================
Deployment Date: $(Get-Date)
AWS Region: $Region
AWS Account ID: $accountId

Resources Created:
- ECR Repository: $ecrUri
- ECS Cluster: ess-web-cluster
- ECS Service: ess-web-service
- VPC: $vpcId
- Subnets: $subnet1, $subnet2
- Security Groups: $sgId (ECS), $albSgId (ALB)
- Target Group: $tgArn
- Load Balancer: $albArn
- Application URL: http://$albDns

Useful Commands:
- View service: aws ecs describe-services --cluster ess-web-cluster --services ess-web-service --region $Region
- View tasks: aws ecs list-tasks --cluster ess-web-cluster --service-name ess-web-service --region $Region
- View logs: aws logs tail /ecs/ess-web --follow --region $Region
- Update app: docker build -t ess-web:latest . && docker push $ecrUri:latest && aws ecs update-service --cluster ess-web-cluster --service ess-web-service --force-new-deployment --region $Region
"@ | Out-File -FilePath "deployment-info.txt" -Encoding UTF8

Write-Host "✓ All done! 🚀" -ForegroundColor Green
