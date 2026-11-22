# ESS-WEB AWS ECS Deployment

Complete deployment guide and scripts for deploying ESS-WEB to AWS ECS with Fargate.

## 📁 Deployment Files

- `Dockerfile` - Multi-stage Docker build configuration
- `nginx.conf` - Production Nginx configuration
- `.dockerignore` - Docker build exclusions
- `docker-compose.yml` - Local testing with Docker Compose
- `ecs-task-definition.json` - ECS Fargate task configuration
- `deploy-ecs.ps1` - Step-by-step deployment script
- `create-ecs-service.ps1` - ECS service creation script
- `quick-deploy-ecs.ps1` - **🚀 One-command full deployment**

## 🚀 Quick Start (Recommended)

### Prerequisites

1. **AWS CLI** - [Install Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
   ```powershell
   aws --version
   aws configure  # Set your credentials
   ```

2. **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)
   ```powershell
   docker --version
   ```

3. **AWS Account** with appropriate permissions

### One-Command Deployment

```powershell
# Navigate to project directory
cd f:\ERP-2026\ESS-WEB

# Run quick deployment script
.\quick-deploy-ecs.ps1

# That's it! The script will:
# ✓ Validate prerequisites
# ✓ Create ECR repository
# ✓ Build and push Docker image
# ✓ Create VPC resources
# ✓ Create security groups
# ✓ Create Application Load Balancer
# ✓ Create ECS cluster and service
# ✓ Deploy your application
```

**Duration:** 10-15 minutes

**Cost:** ~$60/month (see cost breakdown below)

### Access Your Application

After deployment completes, your app will be available at:
```
http://ess-web-alb-XXXXXXXXX.us-east-1.elb.amazonaws.com
```

The URL is displayed at the end of deployment and saved to `deployment-info.txt`.

---

## 🧪 Local Testing First

Always test locally before deploying to AWS:

```powershell
# Build Docker image
docker build -t ess-web:latest .

# Run locally
docker run -d -p 3000:80 --name ess-web-test ess-web:latest

# Test in browser
Start-Process "http://localhost:3000"

# View logs
docker logs -f ess-web-test

# Stop and clean up
docker stop ess-web-test
docker rm ess-web-test
```

---

## 📋 Manual Deployment (Step by Step)

If you prefer manual control:

### Step 1: Build and Push to ECR

```powershell
.\deploy-ecs.ps1
```

This script:
- Creates ECR repository
- Builds Docker image
- Pushes to ECR
- Creates ECS cluster
- Registers task definition

### Step 2: Setup Network (Manual)

Create VPC, subnets, security groups, and load balancer.
See detailed guide in the deployment artifacts.

### Step 3: Create ECS Service

```powershell
.\create-ecs-service.ps1 `
  -VpcId vpc-xxxxx `
  -Subnet1 subnet-xxxxx `
  -Subnet2 subnet-yyyyy `
  -SecurityGroup sg-xxxxx `
  -TargetGroupArn arn:aws:elasticloadbalancing:... `
  -DesiredCount 2
```

---

## 🔄 Update Deployed Application

After making code changes:

```powershell
# Quick update script
docker build -t ess-web:latest .
docker tag ess-web:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ess-web:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ess-web:latest

aws ecs update-service `
  --cluster ess-web-cluster `
  --service ess-web-service `
  --force-new-deployment `
  --region us-east-1
```

Or create an update script `update-app.ps1`:
```powershell
param([string]$Region = "us-east-1")
$accountId = aws sts get-caller-identity --query Account --output text
$ecrUri = "$accountId.dkr.ecr.$Region.amazonaws.com/ess-web"

Write-Host "Building image..." -ForegroundColor Yellow
docker build -t ess-web:latest .

Write-Host "Pushing to ECR..." -ForegroundColor Yellow
aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin $ecrUri
docker tag ess-web:latest ${ecrUri}:latest
docker push ${ecrUri}:latest

Write-Host "Updating ECS service..." -ForegroundColor Yellow
aws ecs update-service --cluster ess-web-cluster --service ess-web-service --force-new-deployment --region $Region

Write-Host "✓ Deployment started! Check AWS Console for progress." -ForegroundColor Green
```

---

## 📊 Monitoring

### View Logs

```powershell
# Real-time logs
aws logs tail /ecs/ess-web --follow --region us-east-1

# Last hour
aws logs tail /ecs/ess-web --since 1h --region us-east-1
```

### Check Service Status

```powershell
# Service overview
aws ecs describe-services `
  --cluster ess-web-cluster `
  --services ess-web-service `
  --region us-east-1 `
  --query 'services[0].{Status:status,Running:runningCount,Desired:desiredCount,Deployments:deployments}'

# List running tasks
aws ecs list-tasks `
  --cluster ess-web-cluster `
  --service-name ess-web-service `
  --region us-east-1
```

### Check Load Balancer Health

```powershell
# Get target health
aws elbv2 describe-target-health `
  --target-group-arn YOUR_TG_ARN `
  --region us-east-1
```

---

## 💰 Cost Breakdown

**Monthly costs (us-east-1):**

| Resource | Configuration | Monthly Cost |
|----------|--------------|--------------|
| Fargate (2 tasks) | 0.5 vCPU, 1GB RAM, 730 hrs | ~$30 |
| Application Load Balancer | Always on | ~$16 |
| Data Transfer | 100GB outbound | ~$9 |
| ECR Storage | 10GB | ~$1 |
| CloudWatch Logs | Standard retention | ~$5 |
| **Total** | | **~$61/month** |

**Cost optimization:**
- Scale down to 1 task during off-hours
- Use auto-scaling policies
- Set CloudWatch log retention to 7 days
- Delete old ECR images regularly

---

## 🔒 Security Checklist

- [ ] Enable HTTPS with AWS Certificate Manager
- [ ] Restrict security group rules to necessary IPs
- [ ] Use AWS Secrets Manager for sensitive data
- [ ] Enable CloudTrail for audit logging
- [ ] Set up CloudWatch alarms
- [ ] Regular security updates (base images)
- [ ] Enable container image scanning in ECR
- [ ] Configure WAF rules on ALB

---

## 🐛 Troubleshooting

### Tasks Keep Failing

```powershell
# Check task logs
aws ecs describe-tasks --cluster ess-web-cluster --tasks TASK_ARN

# Common issues:
# - Health check failing: Verify /health endpoint works
# - Out of memory: Increase memory in task definition
# - Image pull error: Check ECR permissions
```

### Cannot Access Application

1. Check ALB target health:
   ```powershell
   aws elbv2 describe-target-health --target-group-arn YOUR_TG_ARN
   ```

2. Verify security groups allow traffic

3. Check ECS service events:
   ```powershell
   aws ecs describe-services --cluster ess-web-cluster --services ess-web-service --query 'services[0].events[0:5]'
   ```

### Deployment Taking Too Long

- Wait 5-10 minutes for initial deployment
- Check CloudWatch logs for errors
- Verify health check endpoint returns 200 OK

---

## 🎯 Production Checklist

Before going to production:

- [ ] Test application thoroughly locally
- [ ] Configure production environment variables
- [ ] Set up custom domain in Route 53
- [ ] Enable HTTPS/SSL
- [ ] Configure auto-scaling (min: 2, max: 10)
- [ ] Set up CloudWatch alarms
- [ ] Configure backup strategy
- [ ] Document runbook procedures
- [ ] Test disaster recovery
- [ ] Set up monitoring/alerting

---

## 📚 Additional Resources

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [AWS Fargate Pricing](https://aws.amazon.com/fargate/pricing/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)

---

## 🆘 Support

### Quick Commands Reference

```powershell
# Get ALB URL
aws elbv2 describe-load-balancers --query 'LoadBalancers[?LoadBalancerName==`ess-web-alb`].DNSName' --output text

# Scale service
aws ecs update-service --cluster ess-web-cluster --service ess-web-service --desired-count 3

# Stop all tasks (for maintenance)
aws ecs update-service --cluster ess-web-cluster --service ess-web-service --desired-count 0

# Restart service
aws ecs update-service --cluster ess-web-cluster --service ess-web-service --force-new-deployment

# Delete service (cleanup)
aws ecs delete-service --cluster ess-web-cluster --service ess-web-service --force
```

---

## 🎉 Success!

Your ESS-WEB application is now running on AWS ECS Fargate with:
- ✅ Auto-scaling capabilities
- ✅ Load balancing across multiple availability zones
- ✅ Health monitoring and auto-recovery
- ✅ Centralized logging
- ✅ Zero-downtime deployments

**Need help?** Check the detailed walkthrough guide or AWS documentation.
