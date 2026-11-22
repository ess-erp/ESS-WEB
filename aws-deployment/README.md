# AWS Deployment Resources

This folder contains all AWS deployment configuration files, scripts, and documentation.

---

## 📁 Folder Contents

### 🐳 Docker Configuration
- **`Dockerfile`** - Full build Dockerfile (builds app inside Docker)
- **`Dockerfile.simple`** - Production Dockerfile (copies pre-built dist/)  ✅ **Used in production**
- **`docker-compose.yml`** - Local Docker testing configuration
- **`.dockerignore`** - Files to exclude from Docker builds
- **`nginx.conf`** - Nginx web server configuration
- **`postcss.config.js`** - PostCSS configuration for Tailwind CSS

### 🚀 Deployment Scripts
- **`deploy-to-aws.bat`** - Initial deployment script
- **`deploy-ecs.ps1`** - PowerShell ECS deployment
- **`create-ecs-service.ps1`** - ECS service creation
- **`quick-deploy-ecs.ps1`** - Quick deployment script
- **`check-tools.ps1`** - Prerequisites checker

---

## 🎯 Quick Start

### Deploy to AWS

1. **Prerequisites**:
   ```powershell
   # Check if you have required tools
   .\check-tools.ps1
   ```

2. **Build Application**:
   ```powershell
   # In project root
   npm run build
   ```

3. **Deploy**:
   ```powershell
   # Run deployment script
   .\deploy-to-aws.bat
   ```

---

## 📖 Documentation Location

All comprehensive documentation has been created and should be placed in this folder:

### Main Documentation Files
- `START-HERE.md` - **Start here!** Navigation to all docs
- `README.md` - This file
- `QUICKSTART.md` - 5-minute quick start
- `AWS-DEPLOYMENT-README.md` - Complete 117KB reference guide
- `DEPLOYMENT-SUMMARY.md` - Current deployment status
- `DOCUMENTATION-INDEX.md` - Complete documentation index
- `ARCHITECTURE-DIAGRAM.md` - Visual architecture diagrams

### Setup Guides
- `GITHUB-CICD-SETUP.md` - Complete CI/CD automation guide
- `GITHUB-SETUP-CHECKLIST.txt` - 15-minute CI/CD checklist
- `SETUP-SSL-GUIDE.md` - Custom domain + HTTPS guide
- `SETUP-DOMAIN-GUIDE.txt` - Domain setup checklist

### Deployment Scripts
- `UPDATE-DEPLOYMENT.bat` - Update existing deployment
- `DEPLOY-AUTO.bat` - Automated deployment
- `DEPLOY-NOW.bat` - Quick deployment
- `create-ecs-execution-role.bat` - Create IAM role

---

## 🏗️ Current Deployment

**Status**: ✅ Live  
**URL**: http://18.140.2.134  
**Platform**: AWS ECS Fargate  
**Region**: ap-southeast-1 (Singapore)  
**Cost**: ~$32/month  

### AWS Resources

| Resource | Name | Details |
|----------|------|---------|
| **ECR Repository** | `ess-web` | Container images |
| **ECS Cluster** | `ess-web-cluster` | Fargate cluster |
| **ECS Service** | `ess-web-task-service-zlakin2ki` | Running service |
| **Task Definition** | `ess-web-task:1` | 1 vCPU, 3GB RAM |
| **Container** | `ess-web` | Nginx + React app |

---

## 🔄 Common Tasks

### Update Application
```powershell
# Build and deploy changes
cd f:\ERP-2026\ESS-WEB
npm run build
cd aws-deployment
.\deploy-to-aws.bat
```

### View Logs
```powershell
aws logs tail /ecs/ess-web-task --follow --region ap-southeast-1
```

### Check Service Status
```powershell
aws ecs describe-services --cluster ess-web-cluster --services ess-web-task-service-zlakin2ki --region ap-southeast-1
```

---

## 📚 File Organization

```
aws-deployment/
├── README.md (this file)
│
├── Docker Configuration
│   ├── Dockerfile
│   ├── Dockerfile.simple ✅
│   ├── docker-compose.yml
│   ├── .dockerignore
│   ├── nginx.conf
│   └── postcss.config.js
│
├── Deployment Scripts
│   ├── deploy-to-aws.bat
│   ├── deploy-ecs.ps1
│   ├── create-ecs-service.ps1
│   ├── quick-deploy-ecs.ps1
│   └── check-tools.ps1
│
└── Documentation (to be added)
    ├── START-HERE.md
    ├── QUICKSTART.md
    ├── AWS-DEPLOYMENT-README.md
    ├── DEPLOYMENT-SUMMARY.md
    ├── DOCUMENTATION-INDEX.md
    ├── ARCHITECTURE-DIAGRAM.md
    ├── GITHUB-CICD-SETUP.md
    ├── GITHUB-SETUP-CHECKLIST.txt
    ├── SETUP-SSL-GUIDE.md
    └── SETUP-DOMAIN-GUIDE.txt
```

---

## 🔗 AWS Console Links

- **ECS Cluster**: https://ap-southeast-1.console.aws.amazon.com/ecs/v2/clusters/ess-web-cluster
- **ECR Repository**: https://ap-southeast-1.console.aws.amazon.com/ecr/repositories/ess-web
- **CloudWatch Logs**: https://ap-southeast-1.console.aws.amazon.com/cloudwatch/home?region=ap-southeast-1#logsV2:log-groups

---

## 🆘 Need Help?

1. Check the documentation files in this folder
2. Review AWS Console for resource status
3. Check CloudWatch Logs for application logs
4. Refer to main project README.md

---

**Last Updated**: November 19, 2026  
**Version**: 1.0.0
