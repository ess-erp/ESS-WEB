# ESS-WEB - AWS Deployment Documentation

**Enterprise Resource Planning System - Web Application**

Complete guide for deploying and maintaining the ESS-WEB React application on AWS ECS Fargate with Docker containerization and CI/CD automation.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Technology Stack](#technology-stack)
5. [Initial Setup](#initial-setup)
6. [Deployment Options](#deployment-options)
7. [Custom Domain & HTTPS](#custom-domain--https)
8. [CI/CD with GitHub Actions](#cicd-with-github-actions)
9. [Maintenance & Operations](#maintenance--operations)
10. [Monitoring & Logging](#monitoring--logging)
11. [Troubleshooting](#troubleshooting)
12. [Cost Management](#cost-management)
13. [Security Best Practices](#security-best-practices)
14. [Appendix](#appendix)

---

## Overview

### What is ESS-WEB?

ESS-WEB is a comprehensive Enterprise Resource Planning (ERP) system built as a React single-page application. This documentation covers the complete process of deploying and maintaining the application on Amazon Web Services (AWS) using modern containerization and orchestration technologies.

### Current Deployment Status

- **Status**: ✅ Live and Running
- **URL**: `http://18.140.2.134`
- **Region**: Asia Pacific (Singapore) - `ap-southeast-1`
- **Platform**: AWS ECS Fargate (Serverless Containers)
- **Container Registry**: Amazon ECR
- **Deployment Method**: Docker + Automated Scripts + Optional CI/CD

---

## Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  Route 53 DNS (Optional)                                     │
│  erp.yourdomain.com → Load Balancer                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  Application Load Balancer (Optional)                        │
│  • SSL/TLS Termination                                       │
│  • HTTPS Listener (443)                                      │
│  • HTTP→HTTPS Redirect (80)                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  Amazon ECS Cluster: ess-web-cluster                        │
│  ┌───────────────────────────────────────────────────┐      │
│  │  ECS Service: ess-web-task-service-zlakin2ki      │      │
│  │  • Desired Tasks: 1                                │      │
│  │  • Launch Type: Fargate (Serverless)              │      │
│  │  • CPU: 1 vCPU (1024 units)                       │      │
│  │  • Memory: 3 GB (3072 MB)                         │      │
│  │                                                    │      │
│  │  ┌──────────────────────────────────────┐        │      │
│  │  │  Task: ess-web-task:1                │        │      │
│  │  │  ┌────────────────────────────────┐  │        │      │
│  │  │  │  Container: ess-web            │  │        │      │
│  │  │  │  • Image: ECR ess-web:latest   │  │        │      │
│  │  │  │  • Port: 80                    │  │        │      │
│  │  │  │  • Nginx + React Build         │  │        │      │
│  │  │  └────────────────────────────────┘  │        │      │
│  │  └──────────────────────────────────────┘        │      │
│  └───────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                     ↑
                     │
┌─────────────────────────────────────────────────────────────┐
│  Amazon ECR: ess-web                                         │
│  • Repository URI:                                           │
│    085464833615.dkr.ecr.ap-southeast-1.amazonaws.com/ess-web│
│  • Images: Docker container images                           │
└─────────────────────────────────────────────────────────────┘
                     ↑
                     │
┌─────────────────────────────────────────────────────────────┐
│  Build & Deploy Process                                      │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │ Local Dev   │ →  │ Docker Build │ →  │  Push to ECR │   │
│  │ or GitHub   │    │   Image      │    │              │   │
│  └─────────────┘    └──────────────┘    └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Description

| Component | Purpose | Configuration |
|-----------|---------|---------------|
| **ECR Repository** | Stores Docker images | `ess-web` repository |
| **ECS Cluster** | Container orchestration | Fargate serverless mode |
| **ECS Service** | Maintains desired task count | 1 task, rolling updates |
| **ECS Task** | Running container instance | 1 vCPU, 3GB RAM |
| **Container** | Nginx + React application | Port 80, production build |
| **ALB (Optional)** | Load balancing + HTTPS | SSL termination, health checks |
| **Route 53 (Optional)** | DNS management | Custom domain routing |

---

## Prerequisites

### Required Tools

- **Node.js**: Version 20.x or higher
- **npm**: Version 10.x or higher
- **Docker Desktop**: Latest version
- **AWS CLI**: Version 2.x
- **Git**: For version control and CI/CD

### AWS Account Requirements

- Active AWS account
- IAM user with appropriate permissions
- Access Key ID and Secret Access Key
- Credit card on file for billing

### Development Environment

- **Operating System**: Windows (PowerShell scripts provided)
- **Editor**: VS Code or similar
- **Terminal**: PowerShell or Command Prompt

---

## Technology Stack

### Frontend Technologies

```json
{
  "React": "19.1.0",
  "Vite": "7.0.4",
  "Redux": "react-redux",
  "React Router": "Latest",
  "Tailwind CSS": "4.1.12",
  "@tailwindcss/postcss": "Latest",
  "Framer Motion": "Animation library",
  "Lucide React": "Icons"
}
```

### Infrastructure & DevOps

```yaml
Cloud Provider: AWS (Amazon Web Services)
Region: ap-southeast-1 (Singapore)
Container Runtime: Docker
Container Registry: Amazon ECR
Container Orchestration: Amazon ECS Fargate
Web Server: Nginx (Alpine Linux)
CI/CD: GitHub Actions
Version Control: Git / GitHub
```

### Build Tools

- **Build Tool**: Vite 7.x
- **Package Manager**: npm with `--legacy-peer-deps`
- **Node Version**: 20.x (required for Vite 7)
- **Docker**: Multi-stage builds for optimization

---

## Initial Setup

### Step 1: Install Prerequisites

#### 1.1 Install Node.js 20.x

Download from: https://nodejs.org/

```powershell
# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

#### 1.2 Install Docker Desktop

Download from: https://www.docker.com/products/docker-desktop

```powershell
# Verify installation
docker --version
docker ps
```

#### 1.3 Install AWS CLI

Download from: https://aws.amazon.com/cli/

```powershell
# Verify installation
aws --version  # Should show aws-cli/2.x.x
```

#### 1.4 Configure AWS CLI

```powershell
aws configure

# Enter when prompted:
# AWS Access Key ID: [Your access key]
# AWS Secret Access Key: [Your secret key]
# Default region name: ap-southeast-1
# Default output format: json
```

### Step 2: Prepare Application

#### 2.1 Install Dependencies

```powershell
cd f:\ERP-2026\ESS-WEB
npm install --legacy-peer-deps
```

#### 2.2 Install Tailwind CSS PostCSS Plugin

```powershell
npm install --save-dev @tailwindcss/postcss
```

#### 2.3 Build Application

```powershell
npm run build
```

Verify the `dist/` folder is created with built files.

### Step 3: AWS Resources Setup

#### 3.1 Create ECR Repository (Done)

```powershell
# Already created: ess-web
# URI: 085464833615.dkr.ecr.ap-southeast-1.amazonaws.com/ess-web
```

#### 3.2 Create ECS Cluster (Done)

```yaml
Cluster Name: ess-web-cluster
Launch Type: AWS Fargate
Region: ap-southeast-1
```

#### 3.3 Create Task Definition (Done)

```yaml
Family: ess-web-task
Revision: 1
CPU: 1024 (1 vCPU)
Memory: 3072 (3 GB)
Container:
  Name: ess-web
  Image: [ECR URI]:latest
  Port: 80
  Essential: true
```

#### 3.4 Create ECS Service (Done)

```yaml
Service Name: ess-web-task-service-zlakin2ki
Cluster: ess-web-cluster
Task Definition: ess-web-task:1
Desired Count: 1
Launch Type: Fargate
Network Mode: awsvpc
Public IP: Enabled
```

---

## Deployment Options

### Option 1: Manual Deployment (Quick Start)

**Use Case**: First deployment or when you need full control

**Script**: `DEPLOY-AUTO.bat`

**Process**:
1. Builds application locally (`npm run build`)
2. Creates Docker image from `dist/` folder
3. Logs into AWS ECR
4. Tags and pushes image to ECR
5. Displays success message

**Usage**:
```powershell
# Double-click the file or run:
.\DEPLOY-AUTO.bat
```

**Time**: ~5-10 minutes (depending on internet speed)

### Option 2: Update Existing Deployment

**Use Case**: When you make code changes and need to update live server

**Script**: `UPDATE-DEPLOYMENT.bat`

**Process**:
1. Builds application locally
2. Creates Docker image
3. Pushes to ECR (overwrites `:latest` tag)
4. Forces ECS service to deploy new image
5. ECS performs rolling update

**Usage**:
```powershell
.\UPDATE-DEPLOYMENT.bat
```

**Time**: ~5-8 minutes (build + deploy)

### Option 3: GitHub Actions CI/CD (Automated)

**Use Case**: Automatic deployments when code is pushed to GitHub

**Setup**: See [CI/CD with GitHub Actions](#cicd-with-github-actions)

**Process**:
1. Push code to GitHub
2. GitHub Actions automatically:
   - Runs build
   - Creates Docker image
   - Pushes to ECR
   - Updates ECS service
3. Changes are live in 3-5 minutes

**Usage**:
```bash
git add .
git commit -m "Your changes"
git push
```

**Time**: ~3-5 minutes (fully automated)

---

## Deployment Files Reference

### Docker Configuration

#### `Dockerfile.simple`
```dockerfile
FROM nginx:alpine

# Copy pre-built dist folder
COPY dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

**Purpose**: Creates production Docker image with pre-built React application

#### `nginx.conf`
```nginx
worker_processes auto;
events {
    worker_connections 1024;
}
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;
        
        # SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Cache static assets
        location /assets {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

**Purpose**: Nginx web server configuration for React SPA

#### `.dockerignore`
```
node_modules
npm-debug.log
# dist  # Commented out - needed for Dockerfile.simple
.git
.env
```

**Purpose**: Excludes unnecessary files from Docker build context

### Deployment Scripts

#### `DEPLOY-AUTO.bat`
```batch
@echo off
echo [STEP 1/5] Building application locally...
call npm run build

echo [STEP 2/5] Checking if dist folder exists...
if not exist "dist" (echo ERROR: dist folder not found! && pause && exit /b 1)

echo [STEP 3/5] Building Docker image...
docker build -f Dockerfile.simple -t ess-web:latest .

echo [STEP 4/5] Logging into AWS ECR...
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 085464833615.dkr.ecr.ap-southeast-1.amazonaws.com

echo [STEP 5/5] Tagging and pushing to ECR...
docker tag ess-web:latest 085464833615.dkr.ecr.ap-southeast-1.amazonaws.com/ess-web:latest
docker push 085464833615.dkr.ecr.ap-southeast-1.amazonaws.com/ess-web:latest

echo DEPLOYMENT SUCCESSFUL!
pause
```

#### `UPDATE-DEPLOYMENT.bat`
```batch
# Same as DEPLOY-AUTO.bat plus:
echo [STEP 5/5] Forcing ECS to update service...
aws ecs update-service --cluster ess-web-cluster --service ess-web-task-service-zlakin2ki --force-new-deployment --region ap-southeast-1
```

---

## Custom Domain & HTTPS

### Overview

Transform your application from `http://18.140.2.134` to `https://erp.yourdomain.com`

### Prerequisites

- Domain name (purchase from Route 53 or any registrar)
- AWS Certificate Manager access
- Application Load Balancer understanding

### Setup Process

**Detailed Guide**: See `SETUP-SSL-GUIDE.md`

**Quick Checklist**: See `SETUP-DOMAIN-GUIDE.txt`

### Steps Summary

1. **Request SSL Certificate** (AWS Certificate Manager)
   - Domain: `erp.yourdomain.com`
   - Validation: DNS (automatic via Route 53)
   - Cost: FREE

2. **Create Application Load Balancer**
   - Name: `ess-web-alb`
   - Listeners: HTTPS (443) + HTTP (80)
   - Target Group: ECS tasks
   - Cost: ~$23/month

3. **Update ECS Service**
   - Add load balancer configuration
   - Update security groups
   - Health checks enabled

4. **Configure DNS** (Route 53)
   - A Record: `erp` → ALB
   - Propagation: 5-30 minutes
   - Cost: $0.50/month

### Benefits

✅ Professional custom domain  
✅ HTTPS encryption (SSL/TLS)  
✅ Better SEO ranking  
✅ User trust (padlock icon)  
✅ Load balancing capabilities  
✅ Auto-scaling support  

### Cost Impact

| Component | Monthly Cost |
|-----------|--------------|
| Application Load Balancer | ~$23 |
| Route 53 Hosted Zone | $0.50 |
| SSL Certificate | FREE |
| **Total Additional** | **~$24/month** |

---

## CI/CD with GitHub Actions

### Overview

Automate deployments: Code push → Build → Test → Deploy → Live!

### Prerequisites

- GitHub account
- GitHub repository with your code
- AWS IAM user for GitHub Actions
- Access keys configured

### Setup Process

**Detailed Guide**: See `GITHUB-CICD-SETUP.md`

**Quick Checklist**: See `GITHUB-SETUP-CHECKLIST.txt`

### GitHub Actions Workflow

File: `.github/workflows/deploy.yml`

```yaml
name: Deploy to AWS ECS
on:
  push:
    branches: [main]
    
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js 20
      - Install dependencies
      - Build application
      - Configure AWS credentials
      - Login to ECR
      - Build & push Docker image
      - Update ECS task definition
      - Deploy to ECS service
```

### Setup Steps

1. **Create GitHub Repository**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/ESS-WEB.git
git push -u origin main
```

2. **Create AWS IAM User**
   - Username: `github-actions-ess-web`
   - Policies:
     - `AmazonEC2ContainerRegistryFullAccess`
     - `AmazonECS_FullAccess`
   - Create access keys

3. **Add GitHub Secrets**
   - Go to: Repository → Settings → Secrets
   - Add: `AWS_ACCESS_KEY_ID`
   - Add: `AWS_SECRET_ACCESS_KEY`

4. **Push Workflow File**
```bash
git add .github/workflows/deploy.yml
git commit -m "Add CI/CD workflow"
git push
```

5. **Watch Deployment**
   - Go to: Repository → Actions tab
   - See workflow running
   - Wait 3-5 minutes
   - Changes are live!

### Daily Usage

```bash
# 1. Make code changes
# 2. Commit and push
git add .
git commit -m "Add new feature"
git push

# 3. GitHub Actions automatically deploys
# 4. Check Actions tab for progress
# 5. Changes live in 3-5 minutes!
```

### Benefits

✅ Automatic deployments  
✅ Consistent builds  
✅ Deployment history  
✅ Rollback capability  
✅ No manual steps  
✅ Faster iterations  

### Cost

- **GitHub Actions**: FREE for public repos
- **Private repos**: 2,000 minutes/month FREE
- **Each deployment**: ~5-8 minutes
- **Result**: ~250-400 free deployments/month

---

## Maintenance & Operations

### Common Operations

#### View Live Logs

```powershell
# Stream logs from running container
aws logs tail /ecs/ess-web-task --follow --region ap-southeast-1
```

#### Check Service Status

```powershell
aws ecs describe-services `
  --cluster ess-web-cluster `
  --services ess-web-task-service-zlakin2ki `
  --region ap-southeast-1
```

#### Force New Deployment

```powershell
# Useful for pulling latest image without code changes
aws ecs update-service `
  --cluster ess-web-cluster `
  --service ess-web-task-service-zlakin2ki `
  --force-new-deployment `
  --region ap-southeast-1
```

#### Scale Service

```powershell
# Increase to 2 tasks
aws ecs update-service `
  --cluster ess-web-cluster `
  --service ess-web-task-service-zlakin2ki `
  --desired-count 2 `
  --region ap-southeast-1
```

#### Stop Service (Maintenance Mode)

```powershell
# Set desired count to 0
aws ecs update-service `
  --cluster ess-web-cluster `
  --service ess-web-task-service-zlakin2ki `
  --desired-count 0 `
  --region ap-southeast-1
```

#### Start Service

```powershell
# Restore service
aws ecs update-service `
  --cluster ess-web-cluster `
  --service ess-web-task-service-zlakin2ki `
  --desired-count 1 `
  --region ap-southeast-1
```

### Updating Environment Variables

1. Go to ECS Console → Task Definitions
2. Select `ess-web-task`
3. Click "Create new revision"
4. Scroll to Container → Environment variables
5. Add/modify variables
6. Click "Create"
7. Update service to use new revision

### Rollback to Previous Version

#### Method 1: Via Console
1. Go to ECS Service
2. Click "Update service"
3. Select previous task definition revision
4. Click "Update"

#### Method 2: Via CLI
```powershell
aws ecs update-service `
  --cluster ess-web-cluster `
  --service ess-web-task-service-zlakin2ki `
  --task-definition ess-web-task:1 `
  --region ap-southeast-1
```

---

## Monitoring & Logging

### CloudWatch Logs

**Log Group**: `/ecs/ess-web-task`

**Access via Console**:
https://ap-southeast-1.console.aws.amazon.com/cloudwatch/home?region=ap-southeast-1#logsV2:log-groups

**View logs via CLI**:
```powershell
# Last 100 lines
aws logs tail /ecs/ess-web-task --region ap-southeast-1

# Follow live logs
aws logs tail /ecs/ess-web-task --follow --region ap-southeast-1

# Filter by time
aws logs tail /ecs/ess-web-task --since 1h --region ap-southeast-1
```

### CloudWatch Metrics

Key metrics to monitor:

- **CPUUtilization**: Container CPU usage
- **MemoryUtilization**: Container memory usage
- **TargetResponseTime**: Response latency
- **HealthyHostCount**: Number of healthy tasks
- **RequestCount**: Number of requests

**Access**:
ECS Console → Cluster → Service → Metrics tab

### Setting Up Alarms

```powershell
# Create CPU alarm
aws cloudwatch put-metric-alarm `
  --alarm-name ess-web-high-cpu `
  --alarm-description "Alert when CPU > 80%" `
  --metric-name CPUUtilization `
  --namespace AWS/ECS `
  --statistic Average `
  --period 300 `
  --threshold 80 `
  --comparison-operator GreaterThanThreshold `
  --evaluation-periods 2 `
  --region ap-southeast-1
```

### Application Performance Monitoring

Recommended tools:
- AWS X-Ray (distributed tracing)
- CloudWatch Application Insights
- Third-party: New Relic, DataDog, Sentry

---

## Troubleshooting

### Common Issues

#### 1. Build Fails Locally

**Symptom**: `npm run build` fails

**Solutions**:
```powershell
# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install --legacy-peer-deps

# Check Node.js version
node --version  # Must be 20.x or higher

# Check for missing dependencies
npm install --save-dev @tailwindcss/postcss
```

#### 2. Docker Build Fails

**Symptom**: `docker build` command fails

**Solutions**:
```powershell
# Ensure dist/ folder exists
if (Test-Path dist) { Write-Host "dist exists" } else { npm run build }

# Check .dockerignore doesn't exclude dist
# Line should be: # dist  (commented out)

# Check Docker is running
docker ps

# Rebuild with no cache
docker build --no-cache -f Dockerfile.simple -t ess-web:latest .
```

#### 3. ECR Push Fails

**Symptom**: Cannot push to ECR

**Solutions**:
```powershell
# Re-authenticate
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 085464833615.dkr.ecr.ap-southeast-1.amazonaws.com

# Check AWS credentials
aws sts get-caller-identity

# Verify ECR repository exists
aws ecr describe-repositories --region ap-southeast-1
```

#### 4. ECS Task Won't Start

**Symptom**: Task status stuck in PENDING

**Solutions**:
- Check CloudWatch logs for errors
- Verify security group allows traffic
- Check task execution role has ECR permissions
- Verify subnet has internet access (public IP or NAT gateway)

#### 5. Application Returns 404 or Blank Page

**Symptom**: Can access IP but page doesn't load

**Solutions**:
- Check nginx.conf has correct SPA routing
- Verify dist/index.html exists in Docker image
- Check browser console for JavaScript errors
- Verify API endpoints in .env match backend

#### 6. GitHub Actions Fails

**Symptom**: Workflow fails in GitHub Actions

**Common causes**:
- AWS credentials not set in GitHub Secrets
- IAM permissions insufficient
- Build errors in workflow
- ECS service name mismatch

**Solutions**:
- Check Actions tab → Failed run → Expand error
- Verify GitHub Secrets are set correctly
- Test build locally first
- Review workflow file for typos

---

## Cost Management

### Current Monthly Costs (Singapore Region)

#### Base Infrastructure

| Service | Configuration | Monthly Cost |
|---------|--------------|--------------|
| **ECS Fargate** | 1 vCPU, 3GB RAM, 24/7 | ~$30.00 |
| **ECR Storage** | 1GB image storage | ~$1.00 |
| **CloudWatch Logs** | 1GB ingestion, 7-day retention | ~$0.50 |
| **Data Transfer** | Outbound (varies) | ~$0.12/GB |
| **Base Total** | | **~$32/month** |

#### With Custom Domain & HTTPS

| Additional Service | Monthly Cost |
|-------------------|--------------|
| Application Load Balancer | +$23.00 |
| Route 53 Hosted Zone | +$0.50 |
| SSL Certificate | FREE |
| **Total with HTTPS** | **~$56/month** |

### Cost Optimization Tips

1. **Right-size Resources**
   - Monitor CPU/Memory usage
   - Reduce to 0.5 vCPU / 1GB if underutilized
   - Potential savings: ~$15/month

2. **Optimize Images**
   - Use smaller base images
   - Multi-stage builds
   - Remove unused dependencies

3. **Configure Log Retention**
   ```powershell
   # Set 7-day retention
   aws logs put-retention-policy `
     --log-group-name /ecs/ess-web-task `
     --retention-in-days 7 `
     --region ap-southeast-1
   ```

4. **Use AWS Free Tier**
   - 750 hours of Application Load Balancer (first year)
   - 50GB data transfer out (monthly)

5. **Schedule Non-Production Environments**
   - Stop dev/test environments after hours
   - Use AWS Lambda to automate start/stop

### Budget Alerts

```powershell
# Create budget alert
aws budgets create-budget `
  --account-id 085464833615 `
  --budget file://budget.json
```

budget.json:
```json
{
  "BudgetName": "ESS-WEB-Monthly-Budget",
  "BudgetLimit": {
    "Amount": "60",
    "Unit": "USD"
  },
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST"
}
```

---

## Security Best Practices

### 1. Container Security

**Image Scanning**:
```powershell
# Enable ECR scan on push
aws ecr put-image-scanning-configuration `
  --repository-name ess-web `
  --image-scanning-configuration scanOnPush=true `
  --region ap-southeast-1
```

**Use Minimal Base Images**:
- Current: `nginx:alpine` (small, secure)
- Avoid: `nginx:latest` (large, unpredictable)

### 2. Network Security

**Security Group Rules**:
- ✅ Allow: HTTP (80) from ALB only
- ❌ Deny: Direct SSH access
- ❌ Deny: Unnecessary ports

**VPC Configuration**:
- Use private subnets for tasks
- Use NAT Gateway for outbound
- Enable VPC Flow Logs

### 3. IAM Best Practices

**Task Execution Role**:
- Minimal permissions
- Only ECR pull + CloudWatch logs

**GitHub Actions IAM User**:
- Specific to CI/CD only
- No console access
- Rotate keys regularly

### 4. Secrets Management

**Never commit**:
- AWS credentials
- API keys
- Database passwords
- .env files with secrets

**Use AWS Secrets Manager**:
```powershell
# Store secret
aws secretsmanager create-secret `
  --name ess-web/api-key `
  --secret-string "your-secret-value" `
  --region ap-southeast-1
```

**Reference in Task Definition**:
```json
{
  "secrets": [
    {
      "name": "API_KEY",
      "valueFrom": "arn:aws:secretsmanager:region:account:secret:ess-web/api-key"
    }
  ]
}
```

### 5. HTTPS/TLS

- ✅ Use AWS Certificate Manager (free SSL)
- ✅ Enforce HTTPS (redirect HTTP)
- ✅ Use TLS 1.2 or higher
- ✅ Enable HSTS headers

### 6. Monitoring & Auditing

**Enable CloudTrail**:
- Log all API calls
- Detect unusual activity
- Compliance auditing

**Set Up Alerts**:
- Failed login attempts
- IAM policy changes
- Service modifications

---

## Appendix

### A. AWS Resource Details

**Account ID**: `085464833615`  
**Region**: `ap-southeast-1` (Singapore)  

**ECR Repository**:
- Name: `ess-web`
- URI: `085464833615.dkr.ecr.ap-southeast-1.amazonaws.com/ess-web`

**ECS Cluster**:
- Name: `ess-web-cluster`
- Type: Fargate

**ECS Service**:
- Name: `ess-web-task-service-zlakin2ki`
- Task Definition: `ess-web-task`
- Desired Count: 1

**Container**:
- Name: `ess-web`
- Port: 80
- CPU: 1024 (1 vCPU)
- Memory: 3072 MB (3 GB)

### B. File Structure

```
ESS-WEB/
├── .github/
│   └── workflows/
│       └── deploy.yml                    # GitHub Actions CI/CD
├── .vscode/                              # VS Code settings
├── dist/                                 # Built application (generated)
├── node_modules/                         # Dependencies (gitignored)
├── public/                               # Static assets
│   └── assets/
├── src/                                  # Source code
│   ├── components/                       # React components
│   ├── pages/                            # Page components
│   ├── states/                           # Redux states
│   ├── routes/                           # Routing
│   ├── services/                         # API services
│   ├── GlobalFunction/                   # Utilities
│   ├── layouts/                          # Layout components
│   ├── App.jsx                           # Root component
│   ├── main.jsx                          # Entry point
│   └── index.css                         # Global styles
├── .dockerignore                         # Docker ignore rules
├── .env                                  # Environment variables (gitignored)
├── .gitignore                            # Git ignore rules
├── docker-compose.yml                    # Local Docker testing
├── Dockerfile                            # Full build Dockerfile
├── Dockerfile.simple                     # Simple copy Dockerfile ✅
├── nginx.conf                            # Nginx configuration
├── postcss.config.js                     # PostCSS configuration
├── package.json                          # Dependencies
├── vite.config.js                        # Vite configuration
├── eslint.config.js                      # ESLint configuration
├── index.html                            # HTML template
├── DEPLOY-AUTO.bat                       # Deployment script ✅
├── UPDATE-DEPLOYMENT.bat                 # Update script ✅
├── AWS-DEPLOYMENT-README.md              # This file ✅
├── DEPLOYMENT-SUMMARY.md                 # Quick overview
├── GITHUB-CICD-SETUP.md                  # CI/CD setup guide
├── GITHUB-SETUP-CHECKLIST.txt            # CI/CD checklist
├── SETUP-SSL-GUIDE.md                    # HTTPS setup guide
└── SETUP-DOMAIN-GUIDE.txt                # Domain checklist
```

### C. Useful Commands Reference

```powershell
# Build Application
npm install --legacy-peer-deps
npm run build

# Docker Commands
docker build -f Dockerfile.simple -t ess-web:latest .
docker run -p 8080:80 ess-web:latest
docker ps
docker logs [container-id]

# AWS ECR
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 085464833615.dkr.ecr.ap-southeast-1.amazonaws.com
docker tag ess-web:latest 085464833615.dkr.ecr.ap-southeast-1.amazonaws.com/ess-web:latest
docker push 085464833615.dkr.ecr.ap-southeast-1.amazonaws.com/ess-web:latest

# AWS ECS
aws ecs list-clusters --region ap-southeast-1
aws ecs list-services --cluster ess-web-cluster --region ap-southeast-1
aws ecs describe-services --cluster ess-web-cluster --services ess-web-task-service-zlakin2ki --region ap-southeast-1
aws ecs update-service --cluster ess-web-cluster --service ess-web-task-service-zlakin2ki --force-new-deployment --region ap-southeast-1

# CloudWatch Logs
aws logs tail /ecs/ess-web-task --follow --region ap-southeast-1

# Git Commands
git add .
git commit -m "Your message"
git push
```

### D. Support & Resources

**AWS Documentation**:
- ECS: https://docs.aws.amazon.com/ecs
- ECR: https://docs.aws.amazon.com/ecr
- Fargate: https://docs.aws.amazon.com/fargate

**Project Documentation**:
- Main README: `AWS-DEPLOYMENT-README.md` (this file)
- Deployment Summary: `DEPLOYMENT-SUMMARY.md`
- GitHub CI/CD: `GITHUB-CICD-SETUP.md`
- Custom Domain: `SETUP-SSL-GUIDE.md`

**Community**:
- AWS Forums: https://forums.aws.amazon.com
- Stack Overflow: Tag `amazon-ecs`, `aws-fargate`

### E. Changelog

**Version 1.0.0** (November 19, 2026)
- Initial deployment to AWS ECS Fargate
- Docker containerization completed
- ECR repository configured
- ECS cluster and service created
- Deployment scripts created
- GitHub Actions workflow configured
- Documentation completed

---

## Conclusion

You have successfully deployed a production-ready React application to AWS using modern containerization and orchestration technologies. This documentation provides everything you need to deploy, maintain, and scale your application.

**Key Achievements**:
✅ Containerized application with Docker  
✅ Deployed to AWS ECS Fargate (serverless)  
✅ Automated deployment scripts  
✅ CI/CD pipeline ready  
✅ Comprehensive documentation  
✅ Production-ready infrastructure  

**Next Steps**:
1. Set up custom domain with HTTPS
2. Configure GitHub Actions for automatic deployments
3. Implement monitoring and alerting
4. Plan for scaling and high availability
5. Regular security audits and updates

---

**Document Version**: 1.0.0  
**Last Updated**: November 19, 2026  
**Maintained By**: Development Team  
**Contact**: [Your Contact Information]

---

*This documentation is maintained in the project repository and should be updated whenever infrastructure changes are made.*
