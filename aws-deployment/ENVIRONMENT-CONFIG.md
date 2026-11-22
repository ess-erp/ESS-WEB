# 🔧 Environment Configuration Guide

**Managing Environment Variables for ESS-WEB**

---

## 📋 Current Configuration

### Development (.env - Local)
```env
VITE_BASE_URL=https://localhost:44301/api
VITE_FILE_URL=https://localhost:44301/
VITE_GOOGLE_CLIENT_ID=687932877026-8dadfhk85m3fgu62v556mm0kt5gedf86.apps.googleusercontent.com
VITE_REALTIME_URL=https://localhost:44301/realtimeHub
```

**Status**: ✅ Works for local development  
**Issue**: ⚠️ Won't work in AWS deployment (points to localhost)

---

## 🎯 Quick Solutions

### Solution 1: Use Cloudflare Tunnel (Fastest - 5 minutes)

**Pros**: Works immediately, no AWS changes needed  
**Cons**: Temporary URL, tunnel must stay running  

#### Steps:

1. **Update .env file** (in project root):
```env
# Comment out localhost
# VITE_BASE_URL=https://localhost:44301/api
# VITE_FILE_URL=https://localhost:44301/
# VITE_REALTIME_URL=https://localhost:44301/realtimeHub

# Uncomment Cloudflare
VITE_BASE_URL=https://recordings-seminars-colleague-oclc.trycloudflare.com/api
VITE_FILE_URL=https://recordings-seminars-colleague-oclc.trycloudflare.com/
VITE_GOOGLE_CLIENT_ID=687932877026-8dadfhk85m3fgu62v556mm0kt5gedf86.apps.googleusercontent.com
VITE_REALTIME_URL=https://recordings-seminars-colleague-oclc.trycloudflare.com/realtimeHub
```

2. **Rebuild and redeploy**:
```powershell
# In project root
npm run build

# Deploy
cd aws-deployment
.\UPDATE-DEPLOYMENT.bat
```

3. **Wait 3-5 minutes** for deployment to complete

4. **Test**: http://18.140.2.134

**Important**: Keep your Cloudflare tunnel running!

---

### Solution 2: Create Production .env (Recommended)

**Pros**: Separate configs for dev/prod, best practice  
**Cons**: Need to deploy backend first  

#### Steps:

1. **Create `.env.production` file** (in project root):
```env
# Production API endpoints (replace with your actual backend URL)
VITE_BASE_URL=https://api.your-domain.com/api
VITE_FILE_URL=https://api.your-domain.com/
VITE_GOOGLE_CLIENT_ID=687932877026-8dadfhk85m3fgu62v556mm0kt5gedf86.apps.googleusercontent.com
VITE_REALTIME_URL=https://api.your-domain.com/realtimeHub
```

2. **Keep `.env` for development**:
```env
# Development (localhost)
VITE_BASE_URL=https://localhost:44301/api
VITE_FILE_URL=https://localhost:44301/
VITE_GOOGLE_CLIENT_ID=687932877026-8dadfhk85m3fgu62v556mm0kt5gedf86.apps.googleusercontent.com
VITE_REALTIME_URL=https://localhost:44301/realtimeHub
```

3. **Update build command** (Vite automatically uses .env.production for production builds):
```powershell
npm run build  # Automatically uses .env.production
```

4. **Deploy**:
```powershell
cd aws-deployment
.\UPDATE-DEPLOYMENT.bat
```

---

### Solution 3: Environment-Specific Builds

**Pros**: Maximum flexibility, supports multiple environments  
**Cons**: More complex setup  

#### Create Multiple Environment Files:

```
.env                    # Default / Development
.env.local              # Local overrides (gitignored)
.env.production         # Production
.env.staging            # Staging (optional)
```

#### Build Commands:
```powershell
# Development
npm run build

# Production
npm run build  # Uses .env.production automatically

# Staging (if you create .env.staging)
$env:NODE_ENV="staging"; npm run build
```

---

## 🔐 Secure Environment Variables (Advanced)

### Using AWS Systems Manager Parameter Store

**When to use**: Sensitive data like API keys, database credentials

#### Step 1: Store Secrets in AWS
```powershell
# Store API URL
aws ssm put-parameter `
    --name "/ess-web/api-url" `
    --value "https://api.your-domain.com" `
    --type "String" `
    --region ap-southeast-1

# Store sensitive keys
aws ssm put-parameter `
    --name "/ess-web/google-client-id" `
    --value "your-google-client-id" `
    --type "SecureString" `
    --region ap-southeast-1
```

#### Step 2: Update Task Definition

1. **Edit task definition JSON**:
```json
{
  "containerDefinitions": [
    {
      "name": "ess-web",
      "secrets": [
        {
          "name": "VITE_BASE_URL",
          "valueFrom": "/ess-web/api-url"
        },
        {
          "name": "VITE_GOOGLE_CLIENT_ID",
          "valueFrom": "/ess-web/google-client-id"
        }
      ]
    }
  ]
}
```

2. **Update IAM execution role** to allow reading parameters

**Note**: For Vite/React apps, environment variables are baked into the build at compile time, so this approach requires rebuilding with the correct values.

---

## 🏗️ Backend Deployment Options

Your frontend needs a backend. Here are your options:

### Option A: Deploy .NET API to AWS ECS Fargate (Recommended)

**Why**: Same platform as frontend, easy to manage

**Steps**:
1. Create Dockerfile for .NET API
2. Push to ECR
3. Create ECS task definition
4. Deploy to same cluster

**I can help!** Just say: "Deploy .NET backend to ECS"

**Cost**: ~$22-30/month (1 vCPU, 2GB RAM)

---

### Option B: AWS Elastic Beanstalk

**Why**: Easiest for .NET applications

**Steps**:
1. Install EB CLI
2. `eb init` and `eb create`
3. Automatic deployment

**Pros**: 
- Very easy
- Automatic scaling
- .NET optimized

**Cons**:
- Less control than ECS
- Slightly higher cost

**Cost**: ~$35-45/month

---

### Option C: AWS App Runner

**Why**: Simplest fully-managed option

**Steps**:
1. Push code to GitHub
2. Connect App Runner to repo
3. Automatic builds and deploys

**Pros**:
- Simplest setup
- Auto-scaling
- Pay per use

**Cons**:
- Limited control
- Newer service

**Cost**: ~$25-40/month (varies with traffic)

---

### Option D: Keep Backend On-Premises, Use Tunnel

**Why**: Don't want to migrate backend yet

**Options**:
- **Cloudflare Tunnel**: Free, easy, temporary URLs
- **ngrok**: Paid, custom domains, persistent
- **AWS VPN**: Complex, enterprise solution

**Pros**: Backend stays local
**Cons**: Not production-ready, single point of failure

---

## 📝 Configuration Checklist

### For Local Development
- [ ] `.env` file with localhost URLs
- [ ] Backend running locally
- [ ] Google OAuth configured for localhost
- [ ] `npm run dev` works

### For AWS Production (Current - Frontend Only)
- [x] Frontend deployed to ECS
- [x] Docker container running
- [x] Accessible via public IP
- [ ] **Backend API accessible** ⚠️
- [ ] Environment variables point to production API
- [ ] Google OAuth configured for production domain

### For Full Production (Target State)
- [ ] Frontend on ECS Fargate with custom domain
- [ ] Backend on ECS Fargate with custom domain
- [ ] HTTPS/SSL enabled (Certificate Manager)
- [ ] Load balancer configured
- [ ] DNS configured (Route 53)
- [ ] Google OAuth configured for production domain
- [ ] CI/CD automated deployments
- [ ] Monitoring enabled

---

## 🎯 Recommended Path Forward

### Today (30 minutes)
1. **Quick fix**: Use Cloudflare tunnel (Solution 1 above)
2. **Test**: Verify app works end-to-end
3. **Document**: Note which features work/don't work

### This Week (2-4 hours)
1. **Deploy backend** to AWS ECS Fargate
2. **Create `.env.production`** with production URLs
3. **Update Google OAuth** for production domain
4. **Test** full application flow

### Next Week (1-2 hours)
1. **Setup custom domain** (e.g., ess.your-company.com)
2. **Enable HTTPS/SSL** with Certificate Manager
3. **Setup GitHub CI/CD** for automated deployments
4. **Configure monitoring** and alerts

### Ongoing
1. Monitor costs and optimize
2. Scale resources as needed
3. Keep dependencies updated
4. Regular security reviews

---

## 🔄 Quick Deployment Script

I'll create a smart deployment script that handles environment switching:

**File**: `aws-deployment/DEPLOY-WITH-ENV.bat`

```batch
@echo off
echo ================================
echo ESS-WEB Deployment with Environment
echo ================================
echo.

echo Which environment?
echo 1. Development (localhost)
echo 2. Production (AWS/Cloud)
echo 3. Cloudflare Tunnel
echo.
set /p choice="Enter choice (1-3): "

if "%choice%"=="1" (
    echo Using .env for development...
    copy /Y .env .env.active
)

if "%choice%"=="2" (
    echo Using .env.production...
    if exist .env.production (
        copy /Y .env.production .env.active
    ) else (
        echo ERROR: .env.production not found!
        pause
        exit /b 1
    )
)

if "%choice%"=="3" (
    echo Using Cloudflare tunnel config...
    echo Please ensure Cloudflare tunnel is running!
    pause
)

echo.
echo Building application...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Build successful! Deploy to AWS?
pause

echo.
echo Deploying to AWS...
call aws-deployment\UPDATE-DEPLOYMENT.bat

echo.
echo ================================
echo Deployment Complete!
echo ================================
echo.
echo Your app will be live in 3-5 minutes at:
echo http://18.140.2.134
echo.
pause
```

---

## 🆘 Troubleshooting

### Frontend Can't Connect to Backend

**Symptom**: Blank pages, API errors in console

**Check**:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Look for failed API calls

**Common Issues**:
```
ERR_NAME_NOT_RESOLVED → URL is wrong
ERR_CONNECTION_REFUSED → Backend not running
CORS error → Backend not configured for frontend domain
401/403 → Authentication issue
```

**Solutions**:
1. Verify backend is running and accessible
2. Check `.env` has correct URLs
3. Rebuild and redeploy after .env changes
4. Configure CORS on backend for frontend domain

---

### Environment Variables Not Updating

**Issue**: Changed .env but app still uses old values

**Reason**: Vite bakes env vars into build at compile time

**Solution**:
```powershell
# Must rebuild after changing .env
npm run build

# Then redeploy
cd aws-deployment
.\UPDATE-DEPLOYMENT.bat
```

---

### Google OAuth Not Working

**Issue**: OAuth redirect fails

**Reason**: Google OAuth configured for localhost only

**Solution**:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Edit OAuth 2.0 Client ID
4. Add authorized JavaScript origins:
   - `http://18.140.2.134`
   - `https://your-domain.com` (when you have custom domain)
5. Add authorized redirect URIs:
   - `http://18.140.2.134/auth/callback`
   - `https://your-domain.com/auth/callback`

---

## 📞 Need Help?

**Immediate issue?**
- Check CloudWatch logs in AWS Console
- Check browser DevTools console (F12)
- Review deployment logs

**Want to deploy backend?**
Say: "Deploy my .NET backend to AWS"

**Want custom domain?**
Say: "Setup custom domain with HTTPS"

**Want CI/CD?**
Say: "Setup GitHub Actions"

I'm here to help! 🚀

---

**Last Updated**: August 25, 2026  
**Status**: Frontend deployed, backend configuration needed

