# 🚀 GitHub Actions Setup - Complete Guide

## ✅ What We Just Did

1. ✅ Changed git remote from `juancrazzy09/ESS-WEB` to `ess-erp/ESS-WEB`
2. ✅ Created GitHub Actions workflows for automatic deployment
3. ✅ Configured zero-downtime deployment using ECS rolling updates
4. ✅ Added comprehensive documentation
5. ✅ Pushed everything to the new repository

---

## 📋 Next Steps (IMPORTANT!)

### Step 1: Add GitHub Secrets (REQUIRED)

GitHub Actions won't work until you add these secrets:

1. **Go to:** https://github.com/ess-erp/ESS-WEB/settings/secrets/actions

2. **Click:** "New repository secret"

3. **Add these 3 secrets:**

| Secret Name | Value | Where to get it |
|-------------|-------|-----------------|
| `AWS_ACCESS_KEY_ID` | Your AWS access key | The one you just created |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret key | From AWS IAM user creation |
| `VITE_GOOGLE_CLIENT_ID` | `687932877026-8dadfhk85m3fgu62v556mm0kt5gedf86.apps.googleusercontent.com` | From .env file |

**⚠️ CRITICAL:** Without these secrets, deployments will fail!

**Detailed instructions:** See `.github/SETUP-SECRETS.md`

---

### Step 2: Test the Deployment

After adding secrets, test the workflow:

```bash
# Make a small change (like adding a comment)
# Then commit and push:

git add .
git commit -m "Test: GitHub Actions deployment"
git push origin main
```

Then watch it deploy automatically:
- **GitHub Actions:** https://github.com/ess-erp/ESS-WEB/actions
- **After 3-5 minutes:** https://erp.ess.edu.ph

---

## 🎯 How It Works Now

### Automatic Deployment Flow:

```
1. Developer pushes to main branch
   ↓
2. GitHub Actions triggers automatically
   ↓
3. Workflow runs:
   - Installs dependencies
   - Builds React app (npm run build)
   - Creates Docker image
   - Pushes to AWS ECR
   - Updates ECS service
   ↓
4. ECS performs zero-downtime rolling update:
   - Starts NEW task with new code
   - Waits for health check (30s)
   - Routes traffic to NEW task
   - Drains OLD task (30s)
   - Stops OLD task
   ↓
5. ✅ Deployment complete!
   - Users never experience downtime
   - New code is live at https://erp.ess.edu.ph
```

---

## 🔄 Zero-Downtime Explained

### What Happens During Deployment:

**Before (Old Way):**
```
User → [Old Container] → Site goes down → [New Container] → Site back up
        ❌ 30-60 second downtime!
```

**Now (Zero-Downtime):**
```
User → [Old Container] ──────────────────────────┐
                                                   │
       [New Container starting...] ←─ Health check │
       [New Container healthy!] ←───── Switch here │
                                                   ↓
User ───────────────────────────→ [New Container] ✅
       [Old Container draining...]
       [Old Container stopped]
```

**Result:** Users never notice the deployment! No interruption!

---

## 📊 Monitoring Deployments

### GitHub Actions Dashboard:
Visit: https://github.com/ess-erp/ESS-WEB/actions

You'll see:
- ✅ Green checkmark = Deployment succeeded
- ⏳ Yellow circle = Deployment in progress
- ❌ Red X = Deployment failed (check logs)

### View Deployment Logs:
1. Click on any workflow run
2. Click on "Build and Deploy to Production"
3. Expand each step to see detailed logs

### AWS ECS Console:
Visit: https://ap-southeast-1.console.aws.amazon.com/ecs/v2/clusters/ess-web-cluster/services/ess-web-task-service-ztakm2kh

You'll see:
- **Deployments** tab: Current rollout status
- **Events** tab: Real-time deployment events
- **Tasks** tab: Running containers

---

## 🌿 Branch Strategy

We set up two environments:

### 1. Production (main branch)
- **URL:** https://erp.ess.edu.ph
- **Deploy:** Push to `main` branch
- **Service:** `ess-web-task-service-ztakm2kh`
- **Purpose:** Live production site

### 2. Staging (develop branch)
- **URL:** http://[ECS-Task-IP]
- **Deploy:** Push to `develop` branch
- **Service:** `ess-web-task-service-zlakin2ki`
- **Purpose:** Testing before production

**Recommended Workflow:**
```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes and test locally
npm run dev

# 3. Push and create PR to develop
git push origin feature/my-feature
# → Create PR: feature/my-feature → develop

# 4. After PR approved, merge to develop
# → Auto-deploys to STAGING

# 5. Test on staging, if OK, create PR to main
# → Create PR: develop → main

# 6. After approval, merge to main
# → Auto-deploys to PRODUCTION
```

---

## 🛠️ Manual Deployment

Need to deploy without pushing code?

1. Go to: https://github.com/ess-erp/ESS-WEB/actions
2. Click **"Deploy to Production"** workflow
3. Click **"Run workflow"** button
4. Select branch: `main`
5. Click **"Run workflow"**

Same process for staging (use "Deploy to Staging" workflow).

---

## 🐛 Troubleshooting

### Deployment Failed?

**1. Check GitHub Actions Logs:**
- https://github.com/ess-erp/ESS-WEB/actions
- Click the failed run
- Look for red ❌ steps
- Read error messages

**Common Issues:**

| Error | Solution |
|-------|----------|
| `Error: Credentials could not be loaded` | Add `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` secrets |
| `npm run build failed` | Check build works locally, fix errors, push again |
| `denied: Your authorization token has expired` | AWS credentials invalid, update secrets |
| `Service ess-web-task-service-ztakm2kh not found` | Check ECS service name in workflow file |

**2. Check ECS Service Health:**
```bash
aws ecs describe-services \
  --cluster ess-web-cluster \
  --services ess-web-task-service-ztakm2kh \
  --region ap-southeast-1
```

**3. Check Container Logs:**
- Go to AWS CloudWatch
- Logs group: `/ecs/ess-web-task`
- Look for container errors

---

## 📝 Making Changes

### Small Changes (typo, bug fix):
```bash
# 1. Make change directly in main
git add .
git commit -m "Fix: typo in login page"
git push origin main

# 2. Automatically deploys to production
```

### Large Changes (new feature):
```bash
# 1. Create feature branch
git checkout -b feature/new-dashboard

# 2. Make changes, test locally
npm run dev

# 3. Push and create Pull Request
git push origin feature/new-dashboard

# 4. Get code review, then merge to main
# 5. Automatically deploys after merge
```

---

## 🔒 Security Best Practices

### DO:
✅ Use GitHub secrets for all credentials  
✅ Rotate AWS access keys every 90 days  
✅ Review code before merging to main  
✅ Test on staging before production  
✅ Monitor deployment logs  

### DON'T:
❌ Never commit `.env` files  
❌ Never hardcode credentials  
❌ Never push directly to main (use PRs)  
❌ Never skip code review  
❌ Never deploy untested code  

---

## 📚 Documentation

All documentation is in the repository:

- **GitHub Actions Setup:** `.github/README.md`
- **Adding Secrets:** `.github/SETUP-SECRETS.md`
- **Contributing Guide:** `CONTRIBUTING.md`
- **AWS Deployment:** `aws-deployment/README.md`
- **Quick Start:** `aws-deployment/QUICKSTART.md`

---

## ✅ Checklist: Is Everything Working?

Use this checklist after setup:

- [ ] Pushed code to https://github.com/ess-erp/ESS-WEB
- [ ] Added `AWS_ACCESS_KEY_ID` secret
- [ ] Added `AWS_SECRET_ACCESS_KEY` secret
- [ ] Added `VITE_GOOGLE_CLIENT_ID` secret
- [ ] Workflow ran successfully (green checkmark)
- [ ] Production site loads: https://erp.ess.edu.ph
- [ ] API calls go to `api.erp.ess.edu.ph` (not localhost)
- [ ] Google Sign-In works (after updating OAuth origins)
- [ ] Team members have access to repository

---

## 🎓 Learning Resources

### GitHub Actions:
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)

### AWS ECS:
- [ECS Deployment Types](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-types.html)
- [Rolling Updates](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html)

### Docker:
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

---

## 🚨 Emergency Rollback

If a deployment breaks production:

### Method 1: Revert via Git
```bash
# 1. Find the last good commit
git log

# 2. Revert to that commit
git revert <commit-sha>

# 3. Push (triggers automatic deployment)
git push origin main
```

### Method 2: Manual ECS Rollback
```bash
# Force ECS to redeploy previous image
aws ecs update-service \
  --cluster ess-web-cluster \
  --service ess-web-task-service-ztakm2kh \
  --force-new-deployment \
  --region ap-southeast-1
```

### Method 3: AWS Console
1. Go to ECS service
2. Click **"Deployments"** tab
3. Find previous successful deployment
4. Click **"Rollback"**

---

## 📞 Support

**Need help?**
- Check GitHub Actions logs first
- Review this documentation
- Check AWS CloudWatch logs
- Ask team lead or DevOps

**Useful Links:**
- **Repository:** https://github.com/ess-erp/ESS-WEB
- **Actions:** https://github.com/ess-erp/ESS-WEB/actions
- **Production:** https://erp.ess.edu.ph
- **AWS Console:** https://ap-southeast-1.console.aws.amazon.com/ecs

---

## 🎉 Congratulations!

You now have:
- ✅ Automated CI/CD pipeline
- ✅ Zero-downtime deployments
- ✅ Production-grade infrastructure
- ✅ Comprehensive documentation
- ✅ Professional workflow

**Push to main → Wait 3 minutes → Code is live! 🚀**

No manual builds, no Docker commands, no AWS CLI needed!

---

**Last Updated:** November 20, 2026  
**Repository:** https://github.com/ess-erp/ESS-WEB  
**Maintained by:** ESS ERP Team
