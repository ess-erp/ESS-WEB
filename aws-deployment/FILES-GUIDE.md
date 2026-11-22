# AWS Deployment Files Guide

Quick reference for all files in this folder.

---

## 📂 Current Files

### ✅ Docker Configuration Files

| File | Purpose | Status |
|------|---------|--------|
| **Dockerfile** | Full build (builds app inside Docker) | ⚪ Reference |
| **Dockerfile.simple** | Production (copies pre-built dist/) | ✅ **Active** |
| **docker-compose.yml** | Local Docker testing | ⚪ Optional |
| **.dockerignore** | Docker build exclusions | ✅ Active |
| **nginx.conf** | Web server configuration | ✅ Active |
| **postcss.config.js** | Tailwind CSS PostCSS config | ✅ Active |

### ✅ Deployment Scripts

| File | Purpose | When to Use |
|------|---------|-------------|
| **deploy-to-aws.bat** | Main deployment script | Initial or full deployment |
| **deploy-ecs.ps1** | PowerShell ECS deploy | Alternative method |
| **create-ecs-service.ps1** | Create ECS service | First-time setup |
| **quick-deploy-ecs.ps1** | Quick deployment | Fast updates |
| **check-tools.ps1** | Check prerequisites | Before deployment |

### 📄 Documentation Files (To Be Added)

These documentation files should be placed in this folder for complete reference:

| File | Description | Size |
|------|-------------|------|
| **START-HERE.md** | Navigation guide (start here!) | - |
| **QUICKSTART.md** | 5-minute quick start | ~5 KB |
| **AWS-DEPLOYMENT-README.md** | Complete reference guide | ~117 KB |
| **DEPLOYMENT-SUMMARY.md** | Current deployment status | ~7 KB |
| **DOCUMENTATION-INDEX.md** | Complete doc index | ~8 KB |
| **ARCHITECTURE-DIAGRAM.md** | Visual diagrams | ~30 KB |
| **GITHUB-CICD-SETUP.md** | CI/CD automation | ~10 KB |
| **GITHUB-SETUP-CHECKLIST.txt** | CI/CD quick setup | Text |
| **SETUP-SSL-GUIDE.md** | Custom domain + HTTPS | ~6 KB |
| **SETUP-DOMAIN-GUIDE.txt** | Domain quick setup | Text |

### 🔄 Additional Scripts (To Be Added)

| File | Purpose |
|------|---------|
| **UPDATE-DEPLOYMENT.bat** | Update existing deployment |
| **DEPLOY-AUTO.bat** | Automated full deployment |
| **create-ecs-execution-role.bat** | Create IAM execution role |

---

## 🎯 Which File Do I Need?

### I want to deploy my app
→ Use **deploy-to-aws.bat**

### I want to test Docker locally
→ Use **docker-compose.yml** + `docker-compose up`

### I want to update the web server config
→ Edit **nginx.conf**

### I want to change Docker build process
→ Edit **Dockerfile.simple** (production) or **Dockerfile** (full build)

### I need deployment documentation
→ Check documentation files listed above

### I want to check my tools are installed
→ Run **check-tools.ps1**

---

## 🔧 File Dependencies

```
Deployment Flow:
├── check-tools.ps1 (verify prerequisites)
├── npm run build (in project root)
├── Dockerfile.simple (read this file)
│   ├── nginx.conf (copied into image)
│   └── dist/ folder (copied from project root)
├── .dockerignore (excludes files)
└── deploy-to-aws.bat (orchestrates everything)
```

---

## 📝 File Modifications

### Common Modifications

**nginx.conf** - Change web server behavior:
- Port configuration
- Routing rules
- Cache settings
- Security headers

**Dockerfile.simple** - Change container build:
- Base image version
- File locations
- Exposed ports
- Startup command

**.dockerignore** - Change what's excluded:
- Add/remove excluded files
- Include necessary files

**deploy-to-aws.bat** - Change deployment process:
- AWS region
- ECR repository name
- ECS cluster/service names
- Deployment steps

---

## 🚀 Usage Examples

### Deploy Changes
```powershell
# 1. Build app (from project root)
cd f:\ERP-2026\ESS-WEB
npm run build

# 2. Deploy (from aws-deployment folder)
cd aws-deployment
.\deploy-to-aws.bat
```

### Test Docker Locally
```powershell
# Build image
docker build -f Dockerfile.simple -t ess-web:test ..

# Run container
docker run -p 8080:80 ess-web:test

# Open browser: http://localhost:8080
```

### Check Configuration
```powershell
# Verify nginx config
docker run --rm nginx:alpine nginx -t -c /etc/nginx/nginx.conf

# Check Dockerfile syntax
docker build --dry-run -f Dockerfile.simple -t test ..
```

---

## 📦 Complete File List

```
aws-deployment/
├── README.md               ← Start here
├── FILES-GUIDE.md          ← This file
│
├── Docker Files
│   ├── Dockerfile
│   ├── Dockerfile.simple   ✅ Production
│   ├── docker-compose.yml
│   ├── .dockerignore
│   ├── nginx.conf          ✅ Production
│   └── postcss.config.js
│
├── Scripts
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

## ✅ File Status Checklist

- [x] Dockerfile created
- [x] Dockerfile.simple created
- [x] docker-compose.yml created
- [x] .dockerignore configured
- [x] nginx.conf created
- [x] postcss.config.js created
- [x] Deployment scripts created
- [x] README.md created
- [ ] Complete documentation files to be added

---

**Last Updated**: November 19, 2026  
**Version**: 1.0.0
