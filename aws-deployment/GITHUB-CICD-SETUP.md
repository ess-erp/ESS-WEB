# GitHub Actions CI/CD Setup Guide

## 🎯 What This Does

Automatically deploys your app to AWS ECS whenever you push code to GitHub!

**Workflow:**
```
Push to GitHub → Build → Test → Docker Image → Push to ECR → Deploy to ECS → Live!
```

**Time:** ~3-5 minutes from push to live deployment

---

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Your code in a GitHub repository
- ✅ AWS account with ECS already set up (done!)

---

## 🔧 Setup Steps

### Step 1: Create GitHub Repository (if you haven't already)

#### Option A: Create new repo on GitHub.com

1. Go to https://github.com/new
2. **Repository name**: `ESS-WEB` (or your preferred name)
3. **Visibility**: Private (recommended for production code)
4. **Do NOT** initialize with README (we already have code)
5. Click "Create repository"

#### Option B: Use existing repo

Skip to Step 2 if you already have a GitHub repo.

---

### Step 2: Push Your Code to GitHub

Open terminal in your project folder and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - ESS-WEB ERP System"

# Add GitHub remote (replace YOUR-USERNAME and YOUR-REPO)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

### Step 3: Create AWS Access Keys for GitHub

GitHub needs AWS credentials to deploy to ECS.

#### 3.1: Create IAM User

1. **Go to IAM Console:**
   https://console.aws.amazon.com/iam

2. **Click "Users" → "Create user"**

3. **User details:**
   - User name: `github-actions-ess-web`
   - Click "Next"

4. **Set permissions:**
   - Click "Attach policies directly"
   - Search and select these policies:
     - ✅ `AmazonEC2ContainerRegistryFullAccess`
     - ✅ `AmazonECS_FullAccess`
   - Click "Next"

5. **Review and create:**
   - Click "Create user"

#### 3.2: Create Access Keys

1. **Click on the user** you just created: `github-actions-ess-web`

2. **Go to "Security credentials" tab**

3. **Click "Create access key"**

4. **Use case:**
   - Select: "Third-party service"
   - Check the confirmation box
   - Click "Next"

5. **Description (optional):**
   - `GitHub Actions deployment for ESS-WEB`
   - Click "Create access key"

6. **⚠️ IMPORTANT - Save these credentials!** (you'll only see them once)
   - **Access key ID**: `AKIA...` (20 characters)
   - **Secret access key**: `wJalr...` (40 characters)
   - Click "Download .csv file" (backup)

---

### Step 4: Add AWS Credentials to GitHub Secrets

1. **Go to your GitHub repository**

2. **Click "Settings" tab**

3. **In left sidebar: "Secrets and variables" → "Actions"**

4. **Click "New repository secret"**

5. **Add first secret:**
   - **Name**: `AWS_ACCESS_KEY_ID`
   - **Secret**: (paste your Access key ID from Step 3.2)
   - Click "Add secret"

6. **Add second secret:**
   - Click "New repository secret" again
   - **Name**: `AWS_SECRET_ACCESS_KEY`
   - **Secret**: (paste your Secret access key from Step 3.2)
   - Click "Add secret"

✅ You should now have 2 secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

---

### Step 5: Update Workflow File (if needed)

The workflow file `.github/workflows/deploy.yml` is already created!

**Review these values and update if different:**

```yaml
env:
  AWS_REGION: ap-southeast-1  # Your AWS region
  ECR_REPOSITORY: ess-web  # Your ECR repository name
  ECS_CLUSTER: ess-web-cluster  # Your ECS cluster name
  ECS_SERVICE: ess-web-task-service-zlakin2ki  # Your ECS service name
  CONTAINER_NAME: ess-web  # Container name from task definition
```

---

### Step 6: Commit and Push Workflow File

```bash
# Add the workflow file
git add .github/workflows/deploy.yml

# Commit
git commit -m "Add GitHub Actions CI/CD workflow"

# Push to GitHub
git push
```

---

### Step 7: Watch Your First Automated Deployment! 🎉

1. **Go to your GitHub repository**

2. **Click "Actions" tab**

3. **You should see your workflow running!**
   - Name: "Deploy to AWS ECS"
   - Status: 🟡 In progress → ✅ Success (in ~3-5 minutes)

4. **Click on the workflow run to see details:**
   - Checkout code
   - Setup Node.js
   - Install dependencies
   - Build application
   - Configure AWS credentials
   - Login to Amazon ECR
   - Build, tag, and push Docker image
   - Update task definition
   - Deploy to Amazon ECS
   - Deployment summary

5. **Once complete, your changes are LIVE!**
   - Check your app at: http://18.140.2.134
   - Or your custom domain if configured

---

## 🎯 How to Use CI/CD Daily

### Make Changes and Deploy:

```bash
# 1. Make your code changes
# Edit any file in src/...

# 2. Test locally (optional but recommended)
npm run build

# 3. Commit changes
git add .
git commit -m "Add new feature: user dashboard"

# 4. Push to GitHub
git push

# 5. That's it! GitHub Actions does the rest:
#    - Builds your app
#    - Creates Docker image
#    - Pushes to ECR
#    - Updates ECS service
#    - Your app is live in 3-5 minutes!
```

---

## 🔍 Monitoring Deployments

### Via GitHub:
- **Actions tab**: See all deployment runs
- **Green checkmark**: Deployment successful ✅
- **Red X**: Deployment failed ❌ (click to see logs)

### Via AWS:
- **ECS Console**: https://ap-southeast-1.console.aws.amazon.com/ecs
- **Cluster** → **Service** → **Deployments** tab
- See "Primary" deployment status

### Via Your App:
- Just refresh your app URL
- Changes should appear after 3-5 minutes

---

## 🚨 Troubleshooting

### Issue: "AWS credentials not found"
**Solution:**
- Check GitHub Secrets are set correctly
- Verify secret names match exactly (case-sensitive)
- Secrets: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

### Issue: "Access denied to ECR"
**Solution:**
- Verify IAM user has `AmazonEC2ContainerRegistryFullAccess`
- Check AWS region matches in workflow file

### Issue: "Task definition not found"
**Solution:**
- Verify `ECS_SERVICE` name in workflow file
- Check task definition name: `ess-web-task`

### Issue: "Build failed"
**Solution:**
- Click on the failed workflow run
- Expand the failed step to see error
- Common causes:
  - npm install errors (missing dependencies)
  - Build errors (code issues)
  - Docker build errors (Dockerfile issues)

### Issue: "Deployment timeout"
**Solution:**
- ECS service might be unhealthy
- Check ECS service health in AWS Console
- Check CloudWatch logs for errors

---

## 🎛️ Advanced Features

### Deploy Only Specific Branches

Edit `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - main  # Only deploy main branch
      - production  # And production branch
```

### Add Staging Environment

Create `.github/workflows/deploy-staging.yml`:

```yaml
on:
  push:
    branches:
      - develop  # Deploy develop branch to staging

env:
  ECS_CLUSTER: ess-web-staging-cluster
  ECS_SERVICE: ess-web-staging-service
```

### Manual Approval Before Production

Add to workflow:

```yaml
- name: Wait for approval
  uses: trstringer/manual-approval@v1
  with:
    secret: ${{ github.TOKEN }}
    approvers: your-github-username
```

### Slack Notifications

Add at the end of workflow:

```yaml
- name: Slack notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment to production completed!'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
  if: always()
```

---

## 📊 CI/CD Pipeline Diagram

```
┌─────────────────┐
│  Code Changes   │
│   (Local Dev)   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   git push      │
│   to GitHub     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ GitHub Actions  │
│   Triggered     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  npm install    │
│  npm run build  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Docker Build    │
│ Create Image    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Push to ECR   │
│ (Image Registry)│
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Update ECS      │
│ Task Definition │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Deploy New      │
│ Container       │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Live on AWS! 🚀│
│ (3-5 minutes)   │
└─────────────────┘
```

---

## 💰 Cost Impact

**GitHub Actions:**
- ✅ FREE for public repositories
- ✅ 2,000 minutes/month FREE for private repos
- Each deployment uses ~5-8 minutes
- **~250-400 free deployments/month**

**No additional AWS costs** - uses existing ECS/ECR resources

---

## 🎉 Summary

You now have:
✅ Automatic deployments from GitHub
✅ No manual building or pushing required
✅ Deployment history and logs in GitHub
✅ Rollback capability (re-run old workflow)
✅ Professional CI/CD pipeline

**From now on:**
1. Make code changes
2. `git push`
3. Wait 3-5 minutes
4. Your changes are live!

---

## 📚 Next Steps

- [ ] Set up branch protection (require reviews before merge)
- [ ] Add automated tests before deployment
- [ ] Set up staging environment
- [ ] Configure deployment notifications
- [ ] Add deployment badges to README

