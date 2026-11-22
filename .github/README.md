# GitHub Actions CI/CD Setup

This repository uses **GitHub Actions** for automated deployment to AWS ECS with **zero-downtime**.

## 🚀 Workflows

### 1. **Production Deployment** (`deploy-production.yml`)
- **Triggers:** Push to `main` branch or manual trigger
- **Deploys to:** `ess-web-task-service-ztakm2kh` (https://erp.ess.edu.ph)
- **Features:** Zero-downtime rolling updates via ECS

### 2. **Staging Deployment** (`deploy-staging.yml`)
- **Triggers:** Push to `develop` branch or manual trigger
- **Deploys to:** `ess-web-task-service-zlakin2ki` (direct IP access)
- **Purpose:** Testing before production

---

## 🔐 Required GitHub Secrets

You **MUST** configure these secrets in your GitHub repository before deployments will work:

### How to Add Secrets:
1. Go to: `https://github.com/ess-erp/ESS-WEB/settings/secrets/actions`
2. Click **"New repository secret"**
3. Add each secret below:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `AWS_ACCESS_KEY_ID` | AWS IAM user access key ID | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM user secret access key | `wJalrXUtn...` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `687932877026-...` |

---

## 📋 AWS IAM User Setup

The AWS user needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
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
      "Effect": "Allow",
      "Action": [
        "ecs:UpdateService",
        "ecs:DescribeServices",
        "ecs:DescribeTasks",
        "ecs:ListTasks"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeNetworkInterfaces"
      ],
      "Resource": "*"
    }
  ]
}
```

**OR** attach these AWS managed policies:
- `AmazonEC2ContainerRegistryPowerUser`
- `AmazonECS_FullAccess` (or a custom policy with just `ecs:UpdateService` and `ecs:DescribeServices`)

---

## 🔄 Zero-Downtime Deployment

### How it works:

1. **Old Task Running** → Users are served by current container
2. **New Task Starts** → GitHub Actions builds and deploys new image
3. **Health Check** → ECS waits for new task to pass health checks
4. **Traffic Switch** → Load balancer routes traffic to new task
5. **Old Task Drains** → Old container gracefully stops after 30s
6. **Complete** → Zero downtime! Users never experience interruption

### ECS Service Configuration:
- **Deployment Strategy:** ROLLING
- **Minimum Healthy:** 100%
- **Maximum Percent:** 200%
- **Circuit Breaker:** Enabled with auto-rollback

This means:
- At least 1 task always running (100% minimum)
- Can temporarily have 2 tasks during deployment (200% maximum)
- If new task fails health checks, automatically rolls back

---

## 🎯 Deployment Workflow

### Automatic Deployment (Production):
```bash
git add .
git commit -m "Your changes"
git push origin main
```
→ GitHub Actions automatically deploys to production

### Automatic Deployment (Staging):
```bash
git checkout develop
git add .
git commit -m "Test changes"
git push origin develop
```
→ GitHub Actions automatically deploys to staging

### Manual Deployment:
1. Go to: https://github.com/ess-erp/ESS-WEB/actions
2. Select workflow (Production or Staging)
3. Click **"Run workflow"**
4. Choose branch
5. Click **"Run workflow"**

---

## 📊 Monitoring Deployments

### GitHub Actions:
- View logs: https://github.com/ess-erp/ESS-WEB/actions
- Each deployment shows:
  - Build logs
  - Docker image tag
  - ECS deployment status
  - Public URL

### AWS Console:
- ECS Service: https://ap-southeast-1.console.aws.amazon.com/ecs/v2/clusters/ess-web-cluster/services/ess-web-task-service-ztakm2kh
- ECR Repository: https://ap-southeast-1.console.aws.amazon.com/ecr/repositories/private/085464833615/ess-web

---

## 🐛 Troubleshooting

### Deployment Failed?

**Check GitHub Actions logs:**
```
https://github.com/ess-erp/ESS-WEB/actions
```

**Common issues:**

1. **AWS credentials invalid**
   - Verify secrets are correct in GitHub settings
   - Check IAM user has required permissions

2. **Build failed**
   - Check `npm run build` works locally
   - Verify all dependencies in `package.json`

3. **ECS deployment timeout**
   - Check ECS service logs in AWS CloudWatch
   - Verify Docker container starts successfully

4. **Health check failing**
   - Nginx must serve on port 80
   - Container must start within health check grace period

### View ECS Service Events:
```bash
aws ecs describe-services \
  --cluster ess-web-cluster \
  --services ess-web-task-service-ztakm2kh \
  --region ap-southeast-1 \
  --query 'services[0].events[:10]'
```

---

## 🔧 Local Testing

Test the exact same build that will run in production:

```bash
# Build locally
npm run build

# Build Docker image
docker build -f aws-deployment/Dockerfile.simple -t ess-web:test .

# Run locally
docker run -p 8080:80 ess-web:test

# Open browser
http://localhost:8080
```

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS ECS Deployment](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-types.html)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## 🆘 Support

For issues or questions:
1. Check GitHub Actions logs
2. Check AWS CloudWatch logs
3. Review ECS service events
4. Contact DevOps team

**Production URL:** https://erp.ess.edu.ph  
**GitHub Repository:** https://github.com/ess-erp/ESS-WEB
