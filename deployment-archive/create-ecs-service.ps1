# Create ECS Service Script
# Run this AFTER setting up VPC, subnets, security groups, and load balancer

param(
    [Parameter(Mandatory=$true)]
    [string]$VpcId,
    
    [Parameter(Mandatory=$true)]
    [string]$Subnet1,
    
    [Parameter(Mandatory=$true)]
    [string]$Subnet2,
    
    [Parameter(Mandatory=$true)]
    [string]$SecurityGroup,
    
    [Parameter(Mandatory=$false)]
    [string]$TargetGroupArn,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1",
    
    [Parameter(Mandatory=$false)]
    [string]$ClusterName = "ess-web-cluster",
    
    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "ess-web-service",
    
    [Parameter(Mandatory=$false)]
    [int]$DesiredCount = 2
)

Write-Host "Creating ECS Service..." -ForegroundColor Yellow
Write-Host "Cluster: $ClusterName" -ForegroundColor Cyan
Write-Host "Service: $ServiceName" -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor Cyan
Write-Host "Desired Tasks: $DesiredCount" -ForegroundColor Cyan
Write-Host ""

# Create service configuration
$serviceConfig = @{
    cluster = $ClusterName
    serviceName = $ServiceName
    taskDefinition = "ess-web-task"
    desiredCount = $DesiredCount
    launchType = "FARGATE"
    platformVersion = "LATEST"
    networkConfiguration = @{
        awsvpcConfiguration = @{
            subnets = @($Subnet1, $Subnet2)
            securityGroups = @($SecurityGroup)
            assignPublicIp = "ENABLED"
        }
    }
    healthCheckGracePeriodSeconds = 60
}

# Add load balancer configuration if target group provided
if ($TargetGroupArn) {
    $serviceConfig.loadBalancers = @(
        @{
            targetGroupArn = $TargetGroupArn
            containerName = "ess-web-container"
            containerPort = 80
        }
    )
    Write-Host "✓ Load balancer configuration added" -ForegroundColor Green
}

# Convert to JSON and save
$serviceConfigJson = $serviceConfig | ConvertTo-Json -Depth 10
$serviceConfigJson | Out-File -FilePath "ecs-service-config.json" -Encoding UTF8

# Create the service
Write-Host "Creating ECS service..." -ForegroundColor Yellow
aws ecs create-service --cli-input-json file://ecs-service-config.json --region $Region

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ ECS Service created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Monitor your service:" -ForegroundColor Yellow
    Write-Host "  aws ecs describe-services --cluster $ClusterName --services $ServiceName --region $Region" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "View tasks:" -ForegroundColor Yellow
    Write-Host "  aws ecs list-tasks --cluster $ClusterName --service-name $ServiceName --region $Region" -ForegroundColor Cyan
    Write-Host ""
    if ($TargetGroupArn) {
        Write-Host "Your application will be available through the ALB DNS name" -ForegroundColor Green
        Write-Host "Get ALB DNS:" -ForegroundColor Yellow
        Write-Host "  aws elbv2 describe-load-balancers --region $Region --query 'LoadBalancers[?contains(LoadBalancerName, ``ess-web``)].DNSName' --output text" -ForegroundColor Cyan
    } else {
        Write-Host "Get task public IP:" -ForegroundColor Yellow
        Write-Host "  aws ecs describe-tasks --cluster $ClusterName --tasks <TASK_ID> --region $Region --query 'tasks[0].attachments[0].details[?name==``networkInterfaceId``].value' --output text" -ForegroundColor Cyan
    }
} else {
    Write-Host "✗ Failed to create ECS service" -ForegroundColor Red
    Write-Host "Check if the service already exists or review the error above" -ForegroundColor Yellow
}
