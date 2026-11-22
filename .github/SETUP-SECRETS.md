# 🔐 GitHub Secrets Setup Guide

## Step-by-Step Instructions

### 1. Get Your AWS Credentials

You mentioned you already created an AWS user and access key. You should have:
- ✅ AWS Access Key ID (starts with `AKIA...`)
- ✅ AWS Secret Access Key (long random string)

**If you don't have these saved:**
1. Go to AWS IAM Console: https://console.aws.amazon.com/iam/
2. Click **Users** → Find your deployment user
3. Click **Security credentials** tab
4. Under **Access keys**, create a new key if needed
5. **⚠️ IMPORTANT:** Save both the Access Key ID and Secret Access Key NOW (you can't view the secret again!)

---

### 2. Add Secrets to GitHub

Go to your repository secrets page:
```
https://github.com/ess-erp/ESS-WEB/settings/secrets/actions
```

Or navigate manually:
1. Go to https://github.com/ess-erp/ESS-WEB
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**

---

### 3. Add Each Secret

#### Secret #1: AWS_ACCESS_KEY_ID
```
Name:  AWS_ACCESS_KEY_ID
Value: AKIA........................  (your AWS access key)
```
Click **Add secret**

#### Secret #2: AWS_SECRET_ACCESS_KEY
```
Name:  AWS_SECRET_ACCESS_KEY
Value: wJalrXUtn...................  (your AWS secret key)
```
Click **Add secret**

#### Secret #3: VITE_GOOGLE_CLIENT_ID
```
Name:  VITE_GOOGLE_CLIENT_ID
Value: 687932877026-8dadfhk85m3fgu62v556mm0kt5gedf86.apps.googleusercontent.com
```
Click **Add secret**

---

### 4. Verify Secrets Are Added

Your secrets page should show:
- ✅ `AWS_ACCESS_KEY_ID` - Updated X minutes ago
- ✅ `AWS_SECRET_ACCESS_KEY` - Updated X minutes ago
- ✅ `VITE_GOOGLE_CLIENT_ID` - Updated X minutes ago

**Note:** You can't view the secret values after adding them (for security).

---

### 5. Test the Setup

After adding secrets, push a commit to trigger deployment:

```bash
git add .
git commit -m "Setup GitHub Actions CI/CD"
git push origin main
```

Then watch the deployment:
```
https://github.com/ess-erp/ESS-WEB/actions
```

---

## ✅ Checklist

Before pushing to trigger deployment:

- [ ] Created AWS IAM user for deployment
- [ ] Created access key for that user
- [ ] Added `AWS_ACCESS_KEY_ID` to GitHub secrets
- [ ] Added `AWS_SECRET_ACCESS_KEY` to GitHub secrets
- [ ] Added `VITE_GOOGLE_CLIENT_ID` to GitHub secrets
- [ ] AWS user has permissions (ECR + ECS)
- [ ] Committed GitHub Actions workflows to repository

---

## 🔒 Security Best Practices

### DO:
✅ Use a dedicated AWS user for CI/CD (not your personal credentials)  
✅ Grant minimum required permissions (principle of least privilege)  
✅ Rotate access keys regularly (every 90 days)  
✅ Use GitHub secrets for sensitive data (never commit credentials)

### DON'T:
❌ Never commit AWS credentials to git  
❌ Never share access keys in chat or email  
❌ Never use root AWS account credentials  
❌ Never hardcode secrets in code

---

## 🛡️ AWS IAM User Permissions

Your deployment user needs these specific permissions:

### Option 1: Attach Managed Policies (Easiest)
1. Go to IAM → Users → Your deployment user
2. Click **Add permissions** → **Attach policies directly**
3. Search and select:
   - `AmazonEC2ContainerRegistryPowerUser`
   - `AmazonECS_FullAccess`
4. Click **Add permissions**

### Option 2: Create Custom Policy (Most Secure)
1. Go to IAM → Policies → **Create policy**
2. Click **JSON** tab
3. Paste this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRPermissions",
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ECSPermissions",
      "Effect": "Allow",
      "Action": [
        "ecs:UpdateService",
        "ecs:DescribeServices",
        "ecs:DescribeTasks",
        "ecs:ListTasks"
      ],
      "Resource": [
        "arn:aws:ecs:ap-southeast-1:085464833615:service/ess-web-cluster/*",
        "arn:aws:ecs:ap-southeast-1:085464833615:task/ess-web-cluster/*"
      ]
    },
    {
      "Sid": "EC2Permissions",
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeNetworkInterfaces"
      ],
      "Resource": "*"
    }
  ]
}
```

4. Click **Next** → Name it `ESS-WEB-Deployment-Policy`
5. Click **Create policy**
6. Go back to your user and attach this policy

---

## 🧪 Test Locally First

Before pushing, test that your credentials work:

```bash
# Configure AWS CLI with your deployment user credentials
aws configure --profile deployment

# Test ECR access
aws ecr describe-repositories --region ap-southeast-1 --profile deployment

# Test ECS access
aws ecs describe-services --cluster ess-web-cluster --services ess-web-task-service-ztakm2kh --region ap-southeast-1 --profile deployment
```

If these commands work, your credentials are correct!

---

## 📞 Need Help?

**GitHub Secrets not working?**
- Make sure secret names are EXACTLY as shown (case-sensitive)
- No extra spaces in the values
- Re-create the secret if you're unsure

**AWS permissions error?**
- Check the IAM user has the required policies
- Verify the access key is active (not disabled)
- Make sure the user is in the correct AWS account (085464833615)

**Deployment failing?**
- Check GitHub Actions logs for specific error
- Check AWS CloudWatch logs for container errors
- Verify ECS service name matches in workflow file
