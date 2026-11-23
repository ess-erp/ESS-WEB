# Deployment Archive

This folder contains **legacy/deprecated deployment files** that are no longer used in the current workflow.

## ⚠️ Status: ARCHIVED (Not in Use)

These files were used during the initial manual deployment setup but have been **replaced by GitHub Actions CI/CD**.

---

## 📁 Archived Files

| File | Purpose | Status |
|------|---------|--------|
| `Dockerfile` | Original multi-stage Docker build | ❌ Replaced by `aws-deployment/Dockerfile.simple` |
| `nginx.conf` | Nginx configuration | ✅ Still used (copy in `aws-deployment/`) |
| `docker-compose.yml` | Local Docker Compose setup | ❌ Not needed (use `npm run dev` instead) |
| `ecs-task-definition.json` | Manual ECS task definition | ❌ Managed by GitHub Actions now |
| `deploy-to-aws.bat` | Manual deployment script | ❌ Replaced by GitHub Actions |
| `deploy-ecs.ps1` | PowerShell deployment script | ❌ Replaced by GitHub Actions |
| `quick-deploy-ecs.ps1` | Quick deploy script | ❌ Replaced by GitHub Actions |
| `create-ecs-service.ps1` | ECS service creation | ❌ One-time setup (already done) |
| `check-tools.ps1` | Tool prerequisite checker | ❌ Not needed with GitHub Actions |

---

## 🚀 Current Deployment Method

**We now use GitHub Actions for automated deployment!**

### To Deploy:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

That's it! GitHub Actions handles the rest automatically.

---

## 📚 Current Documentation

For the latest deployment documentation, see:

- **Main Guide:** `GITHUB-ACTIONS-SETUP.md` (root folder)
- **GitHub Actions:** `.github/README.md`
- **AWS Deployment:** `aws-deployment/README.md`
- **Quick Start:** `aws-deployment/QUICKSTART.md`

---

## 🗂️ Why These Files Were Archived

### Before (Manual Process):
1. ❌ Run multiple PowerShell scripts manually
2. ❌ Build Docker image locally
3. ❌ Push to ECR with AWS CLI commands
4. ❌ Update ECS service manually
5. ❌ 15+ minutes per deployment
6. ❌ Prone to human error
7. ❌ Required AWS CLI and Docker installed locally

### Now (Automated Process):
1. ✅ Just push to GitHub
2. ✅ GitHub Actions builds everything
3. ✅ Automatic Docker build and push
4. ✅ Automatic ECS deployment
5. ✅ 3-5 minutes per deployment
6. ✅ Consistent and reliable
7. ✅ No local tools required

---

## 🔧 If You Need These Files

These files are kept for reference in case you need to:
- Understand the original manual deployment process
- Debug issues by comparing old vs new setup
- Migrate to a different CI/CD system in the future
- Run a manual deployment in emergency

**However, you should NOT use these for normal deployments.**

---

## 🗑️ Can I Delete This Folder?

**Recommendation: Keep it for now.**

Reasons to keep:
- Reference for troubleshooting
- Historical context for new team members
- Fallback if GitHub Actions has issues
- Learning resource

If you want to delete it later:
- After 3+ months of successful GitHub Actions deployments
- After the team is comfortable with the new workflow
- After documenting any special configuration from these files

---

## 📞 Questions?

If you need to understand what any of these files did, check:
1. This README (you're reading it)
2. Git history: `git log -- deployment-archive/`
3. `aws-deployment/` folder (current deployment files)
4. Team lead or DevOps

---

**Archived Date:** November 23, 2026  
**Reason:** Replaced by GitHub Actions CI/CD  
**Current Method:** Automated deployment via `.github/workflows/`  
**Repository:** https://github.com/ess-erp/ESS-WEB
