# Deploy ESS-WEB to ECS Fargate using Existing ECR Repository
# This script assumes you already have an ECR repository with your image

param(
    [Parameter(Mandatory=$false)]
    [string]$RepositoryName = "ess-web",
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "ap-southeast-1",
    
    [Parameter(Mandatory=$false)]
    [string]$ClusterName = "ess-web-cluster",
    
    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "ess-web-service",
    
    [Parameter(Mandatory=$false)]
    [string]$ImageTag = "latest"
)

$ErrorActionPreference = "Stop"

Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Deploy ESS-WEB to ECS Fargate            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Get AWS Account ID
Write-Host "Getting AWS Account ID..." -ForegroundColor Yellow
$accountId = aws sts get-caller-identity --query Account --output text
if ([string]::IsNullOrEmpty($accountId)) {
    Write-Host "✗ Could not get AWS Account ID. Run 'aws configure' first." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Account ID: $accountId" -ForegroundColor Green

# Build ECR Image URI
$ecrImageUri = "$accountId.dkr.ecr.$Region.amazonaws.com/${RepositoryName}:${ImageTag}"
Write-Host "✓ Using image: $ecrImageUri" -ForegroundColor Green
Write-Host ""

# Phase 1: Create IAM Role for ECS Tasks (if not exists)
Write-Host "════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host " Phase 1: Setting up IAM Role" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════" -ForegroundColor Yellow

$roleName = "ecsTaskExecutionRole"
$roleExists = aws iam get-role --role-name $roleName 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating IAM role: $roleName..." -ForegroundColor Yellow
    
    $trustPolicy = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
"@
    $trustPolicy | Out-File -FilePath "trust-policy.json" -Encoding UTF8
    
    aws iam create-role `
        --role-name $roleName `
        --assume-role-policy-document file://trust-policy.json | Out-Null
    
    aws iam attach-role-policy `
        --role-name $roleName `
        --policy-arn "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy" | Out-Null
    
    Write-Host "✓ IAM role created" -ForegroundColor Green
    Start-Sleep -Seconds 5
} else {
    Write-Host "✓ IAM role already exists" -ForegroundColor Green
}

# Phase 2: Create CloudWatch Log Group
Write-Host "`n════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host " Phase 2: Setting up CloudWatch Logs" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════" -ForegroundColor Yellow

aws logs create-log-group --log-group-name "/ecs/ess-web" --region $Region 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ CloudWatch log group created" -ForegroundColor Green
} else {
    Write-Host "✓ CloudWatch log group already exists" -ForegroundColor Green
}

# Phase 3: Create/Update Task Definition
Write-Host "`n════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host " Phase 3: Registering Task Definition" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════" -ForegroundColor Yellow

$taskDef = @"
{
  "family": "ess-web-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::${accountId}:role/${roleName}",
  "taskRoleArn": "arn:aws:iam::${accountId}:role/${roleName}",
  "containerDefinitions": [
    {
      "name": "ess-web-container",
      "image": "${ecrImageUri}",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp",
          "hostPort": 80
        }
      ],
      "essential": true,
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ess-web",
          "awslogs-region": "${Region}",
          "awslogs-stream-prefix": "ecs",
          "awslogs-create-group": "true"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
"@

$taskDef | Out-File -FilePath "task-definition-final.json" -Encoding UTF8

aws ecs register-task-definition `
    --cli-input-json file://task-definition-final.json `
    --region $Region | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Task definition registered" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to register task definition" -ForegroundColor Red
    exit 1
}

# Phase 4: Create ECS Cluster
Write-Host "`n════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host " Phase 4: Creating ECS Cluster" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════" -ForegroundColor Yellow

$clusterExists = aws ecs describe-clusters `
    --clusters $ClusterName `
    --region $Region `
    --query 'clusters[0].status' `
    --output text 2>$null

if ($clusterExists -eq "ACTIVE") {
    Write-Host "✓ ECS cluster already exists" -ForegroundColor Green
} else {
    Write-Host "Creating ECS cluster: $ClusterName..." -ForegroundColor Yellow
    aws ecs create-cluster --cluster-name $ClusterName --region $Region | Out-Null
    Write-Host "✓ ECS cluster created" -ForegroundColor Green
}

# Phase 5: Get VPC Information
Write-Host "`n════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host " Phase 5: Getting VPC Information" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════" -ForegroundColor Yellow

$vpcId = aws ec2 describe-vpcs `
    --filters "Name=isDefault,Values=true" `
    --query "Vpcs[0].VpcId" `
    --output text `
    --region $Region

if ([string]::IsNullOrEmpty($vpcId) -or $vpcId -eq "None") {
    Write-Host "✗ No default VPC found. Please create a VPC first." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Using VPC: $vpcId" -ForegroundColor Green

$subnets = aws ec2 describe-subnets `
    --filters "Name=vpc-id,Values=$vpcId" `
    --query "Subnets[*].SubnetId" `
    --output text `
    --region $Region

$subnetArray = $subnets -split "\s+"
if ($subnetArray.Count -lt 2) {
    Write-Host "✗ Need at least 2 subnets in different availability zones" -ForegroundColor Red
    exit 1
}

$subnet1 = $subnetArray[0]
$subnet2 = $subnetArray[1]
Write-Host "✓ Using subnets: $subnet1, $subnet2" -ForegroundColor Green

# Phase 6: Create Security Group
Write-Host "`n════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host " Phase 6: Creating Security Group" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════" -ForegroundColor Yellow

$sgName = "ess-web-ecs-sg"
$existingSg = aws ec2 describe-security-groups `
    --filters "Name=group-name,Values=$sgName" "Name=vpc-id,Values=$vpcId" `
    --query "SecurityGroups[0].GroupId" `
    --output text `
    --region $Region 2>$null

if ($existingSg -and $existingSg -ne "None") {
    $sgId = $existingSg
    Write-Host "✓ Using existing security group: $sgId" -ForegroundColor Green
} else {
    Write-Host "Creating security group..." -ForegroundColor Yellow
    $sgId = aws ec2 create-security-group `
        --group-name $sgName `
        --description "Security group for ESS Web ECS tasks" `
        --vpc-id $vpcId `
        --query 'GroupId' `
        --output text `
        --region $Region
    
    Start-Sleep -Seconds 2
    
    # Allow HTTP
    aws ec2 authorize-security-group-ingress `
        --group-id $sgId `
        --protocol tcp `
        --port 80 `
        --cidr 0.0.0.0/0 `
        --region $Region 2>$null
    
    Write-Host "✓ Security group created: $sgId" -ForegroundColor Green
}

# Phase 7: Create/Update ECS Service
Write-Host "`n════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host " Phase 7: Creating/Updating ECS Service" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════" -ForegroundColor Yellow

$serviceExists = aws ecs describe-services `
    --cluster $ClusterName `
    --services $ServiceName `
    --region $Region `
    --query 'services[0].status' `
    --output text 2>$null

if ($serviceExists -eq "ACTIVE") {
    Write-Host "Service exists. Updating..." -ForegroundColor Yellow
    aws ecs update-service `
        --cluster $ClusterName `
        --service $ServiceName `
        --force-new-deployment `
        --region $Region | Out-Null
    Write-Host "✓ Service updated with new deployment" -ForegroundColor Green
} else {
    Write-Host "Creating new ECS service..." -ForegroundColor Yellow
    
    $serviceConfig = @"
{
  "cluster": "${ClusterName}",
  "serviceName": "${ServiceName}",
  "taskDefinition": "ess-web-task",
  "desiredCount": 1,
  "launchType": "FARGATE",
  "platformVersion": "LATEST",
  "networkConfiguration": {
    "awsvpcConfiguration": {
      "subnets": ["${subnet1}", "${subnet2}"],
      "securityGroups": ["${sgId}"],
      "assignPublicIp": "ENABLED"
    }
  }
}
"@
    
    $serviceConfig | Out-File -FilePath "service-config.json" -Encoding UTF8
    
    aws ecs create-service `
        --cli-input-json file://service-config.json `
        --region $Region | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ ECS service created" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to create service" -ForegroundColor Red
        exit 1
    }
}

# Get Task Public IP
Write-Host "`n════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host " Getting Task Information..." -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "Waiting for tasks to start (30 seconds)..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

$tasks = aws ecs list-tasks `
    --cluster $ClusterName `
    --service-name $ServiceName `
    --region $Region `
    --query 'taskArns[0]' `
    --output text

if (![string]::IsNullOrEmpty($tasks) -and $tasks -ne "None") {
    $eniId = aws ecs describe-tasks `
        --cluster $ClusterName `
        --tasks $tasks `
        --region $Region `
        --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' `
        --output text
    
    if (![string]::IsNullOrEmpty($eniId) -and $eniId -ne "None") {
        $publicIp = aws ec2 describe-network-interfaces `
            --network-interface-ids $eniId `
            --region $Region `
            --query 'NetworkInterfaces[0].Association.PublicIp' `
            --output text
        
        if (![string]::IsNullOrEmpty($publicIp) -and $publicIp -ne "None") {
            Write-Host "✓ Task is running" -ForegroundColor Green
            Write-Host "  Public IP: $publicIp" -ForegroundColor Cyan
        }
    }
}

# Final Summary
Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║       DEPLOYMENT COMPLETE!                 ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Deployment Summary:" -ForegroundColor White
Write-Host "  Region: $Region" -ForegroundColor Cyan
Write-Host "  Cluster: $ClusterName" -ForegroundColor Cyan
Write-Host "  Service: $ServiceName" -ForegroundColor Cyan
Write-Host "  Image: $ecrImageUri" -ForegroundColor Cyan
if (![string]::IsNullOrEmpty($publicIp) -and $publicIp -ne "None") {
    Write-Host "  Application URL: http://$publicIp" -ForegroundColor Yellow
}
Write-Host ""
Write-Host "Useful Commands:" -ForegroundColor White
Write-Host "  View service status:" -ForegroundColor Gray
Write-Host "    aws ecs describe-services --cluster $ClusterName --services $ServiceName --region $Region" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  View logs:" -ForegroundColor Gray
Write-Host "    aws logs tail /ecs/ess-web --follow --region $Region" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  List tasks:" -ForegroundColor Gray
Write-Host "    aws ecs list-tasks --cluster $ClusterName --service-name $ServiceName --region $Region" -ForegroundColor DarkGray
Write-Host ""

if (![string]::IsNullOrEmpty($publicIp) -and $publicIp -ne "None") {
    $openBrowser = Read-Host "Open application in browser? (y/n)"
    if ($openBrowser -eq 'y') {
        Start-Process "http://$publicIp"
    }
}
