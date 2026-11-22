# ESS-WEB Deployment - Quick Start Guide

**Get your app deployed to AWS in 30 minutes!**

---

## 📌 Current Status

✅ **Your app is LIVE**: `http://18.140.2.134`  
✅ **AWS Region**: Singapore (ap-southeast-1)  
✅ **Platform**: ECS Fargate (Serverless Containers)

---

## 🎯 What You Can Do Now

### Option 1: Update Your App (Most Common)

**When you make code changes:**

```powershell
# Run this script:
.\UPDATE-DEPLOYMENT.bat

# Wait 5 minutes → Your changes are live!
```

---

### Option 2: Set Up Automatic Deployments

**Push to GitHub → Auto-deploy!**

📖 **Full Guide**: `GITHUB-CICD-SETUP.md`  
✅ **Checklist**: `GITHUB-SETUP-CHECKLIST.txt`

**Quick Steps**:
1. Push code to GitHub
2. Create AWS IAM user for GitHub
3. Add AWS credentials to GitHub Secrets
4. Push `.github/workflows/deploy.yml`
5. Done! Now `git push` auto-deploys

**Time**: 15 minutes setup  
**Result**: Automatic deployments forever!

---

### Option 3: Add Custom Domain + HTTPS

**Transform**: `http://18.140.2.134` → `https://erp.yourdomain.com`

📖 **Full Guide**: `SETUP-SSL-GUIDE.md`  
✅ **Checklist**: `SETUP-DOMAIN-GUIDE.txt`

**Quick Steps**:
1. Request SSL certificate (AWS Certificate Manager)
2. Create Application Load Balancer
3. Update ECS service
4. Configure DNS in Route 53
5. Done! Professional URL with HTTPS

**Time**: 45 minutes setup  
**Cost**: +$24/month  
**Benefit**: Professional domain + Security

---

## 📚 All Documentation Files

| File | Purpose | When to Use |
|------|---------|-------------|
| **QUICKSTART.md** | This file - quick overview | First time orientation |
| **AWS-DEPLOYMENT-README.md** | Complete documentation | Full reference guide |
| **DEPLOYMENT-SUMMARY.md** | Overview of what's deployed | Quick status check |
| **UPDATE-DEPLOYMENT.bat** | Script to update app | When you change code |
| **GITHUB-CICD-SETUP.md** | Automatic deployments | Set up CI/CD |
| **GITHUB-SETUP-CHECKLIST.txt** | Quick CI/CD steps | Fast CI/CD setup |
| **SETUP-SSL-GUIDE.md** | Custom domain + HTTPS | Professional URL |
| **SETUP-DOMAIN-GUIDE.txt** | Quick domain steps | Fast domain setup |

---

## 🚀 Common Tasks

### Deploy Code Changes

```powershell
# Build and deploy
.\UPDATE-DEPLOYMENT.bat
```

### View Live Logs

```powershell
aws logs tail /ecs/ess-web-task --follow --region ap-southeast-1
```

### Check Service Status

```powershell
aws ecs describe-services --cluster ess-web-cluster --services ess-web-task-service-zlakin2ki --region ap-southeast-1
```

### Stop Application (Maintenance)

```powershell
aws ecs update-service --cluster ess-web-cluster --service ess-web-task-service-zlakin2ki --desired-count 0 --region ap-southeast-1
```

### Start Application

```powershell
aws ecs update-service --cluster ess-web-cluster --service ess-web-task-service-zlakin2ki --desired-count 1 --region ap-southeast-1
```

---

## 🔍 Important Links

### AWS Console Links

- **ECS Cluster**: https://ap-southeast-1.console.aws.amazon.com/ecs/v2/clusters/ess-web-cluster
- **ECR Repository**: https://ap-southeast-1.console.aws.amazon.com/ecr/repositories/ess-web
- **CloudWatch Logs**: https://ap-southeast-1.console.aws.amazon.com/cloudwatch/home?region=ap-southeast-1#logsV2:log-groups

### Your Application

- **Current URL**: http://18.140.2.134
- **Future URL** (after domain setup): https://erp.yourdomain.com

---

## 💰 Monthly Costs

| Configuration | Cost |
|---------------|------|
| **Current** (ECS + ECR only) | ~$32/month |
| **With Custom Domain + HTTPS** | ~$56/month |

Breakdown:
- ECS Fargate (1 vCPU, 3GB): $30
- ECR Storage: $1
- CloudWatch Logs: $1
- *Application Load Balancer*: $23 (if added)
- *Route 53 Domain*: $0.50 (if added)

---

## 🆘 Troubleshooting

### Build Fails?

```powershell
# Clear and reinstall
Remove-Item -Recurse -Force node_modules
npm install --legacy-peer-deps
npm run build
```

### Docker Build Fails?

```powershell
# Check if dist exists
npm run build

# Rebuild Docker
docker build -f Dockerfile.simple -t ess-web:latest .
```

### Can't Push to ECR?

```powershell
# Re-login to ECR
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 085464833615.dkr.ecr.ap-southeast-1.amazonaws.com
```

### Application Not Loading?

1. Check ECS service is running (AWS Console)
2. Check CloudWatch logs for errors
3. Verify security group allows HTTP on port 80

---

## 🎓 Learning Path

**New to AWS Deployment?**

1. **Start Here**: Read this file (QUICKSTART.md)
2. **Understand What's Running**: Read DEPLOYMENT-SUMMARY.md
3. **Make Your First Update**: Run UPDATE-DEPLOYMENT.bat
4. **Set Up Auto-Deploy**: Follow GITHUB-SETUP-CHECKLIST.txt
5. **Add Custom Domain**: Follow SETUP-DOMAIN-GUIDE.txt
6. **Deep Dive**: Read full AWS-DEPLOYMENT-README.md

---

## ✅ You're All Set!

Your application is deployed and running on AWS. You have:

✅ Production-ready infrastructure  
✅ Automated deployment scripts  
✅ Optional CI/CD pipeline  
✅ Complete documentation  
✅ Custom domain capability  

**Need help?** Check the detailed guides or AWS documentation.

**Ready to deploy changes?** Run `UPDATE-DEPLOYMENT.bat`!

---

**Last Updated**: November 19, 2026  
**Version**: 1.0.0
