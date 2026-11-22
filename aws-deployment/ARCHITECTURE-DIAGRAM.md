# ESS-WEB Architecture Diagrams

Visual guide to understanding the deployment architecture.

---

## 📊 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         USERS / BROWSERS                          │
│                    (Students, Faculty, Staff)                     │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            │ HTTPS/HTTP
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│                     INTERNET / PUBLIC WEB                         │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        │ Current Setup                         │ Optional (Future)
        ↓                                       ↓
┌──────────────────┐              ┌─────────────────────────────┐
│   Public IP      │              │   Route 53 DNS              │
│  18.140.2.134    │              │  erp.yourdomain.com         │
└────────┬─────────┘              └──────────┬──────────────────┘
         │                                   │
         │                                   ↓
         │                        ┌─────────────────────────────┐
         │                        │ Application Load Balancer   │
         │                        │  • HTTPS Listener (443)     │
         │                        │  • HTTP → HTTPS Redirect    │
         │                        │  • SSL/TLS Termination      │
         │                        │  • Health Checks            │
         │                        └──────────┬──────────────────┘
         │                                   │
         └───────────────┬───────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│                         AWS CLOUD                                 │
│  Region: ap-southeast-1 (Singapore)                              │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              AMAZON ECS CLUSTER                             │ │
│  │              Name: ess-web-cluster                          │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │           ECS SERVICE                                 │  │ │
│  │  │  Name: ess-web-task-service-zlakin2ki                │  │ │
│  │  │  Launch Type: AWS Fargate (Serverless)               │  │ │
│  │  │  Desired Count: 1                                    │  │ │
│  │  │                                                       │  │ │
│  │  │  ┌────────────────────────────────────────────────┐  │  │ │
│  │  │  │         FARGATE TASK                            │  │  │ │
│  │  │  │  Task Definition: ess-web-task:1                │  │  │ │
│  │  │  │  CPU: 1 vCPU (1024 units)                       │  │  │ │
│  │  │  │  Memory: 3 GB (3072 MB)                         │  │  │ │
│  │  │  │  Network: awsvpc                                │  │  │ │
│  │  │  │                                                  │  │  │ │
│  │  │  │  ┌────────────────────────────────────────┐     │  │  │ │
│  │  │  │  │     DOCKER CONTAINER                   │     │  │  │ │
│  │  │  │  │  Name: ess-web                         │     │  │  │ │
│  │  │  │  │  Port: 80                              │     │  │  │ │
│  │  │  │  │                                        │     │  │  │ │
│  │  │  │  │  ┌──────────────────────────────┐     │     │  │  │ │
│  │  │  │  │  │   NGINX WEB SERVER           │     │     │  │  │ │
│  │  │  │  │  │   (Alpine Linux)             │     │     │  │  │ │
│  │  │  │  │  │                              │     │     │  │  │ │
│  │  │  │  │  │   Serves: React Build        │     │     │  │  │ │
│  │  │  │  │  │   Location: /usr/share/nginx │     │     │  │  │ │
│  │  │  │  │  │            /html             │     │     │  │  │ │
│  │  │  │  │  └──────────────────────────────┘     │     │  │  │ │
│  │  │  │  └────────────────────────────────────────┘     │  │  │ │
│  │  │  └────────────────────────────────────────────────┘  │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │           AMAZON ECR (Container Registry)                  │ │
│  │  Repository: ess-web                                       │ │
│  │  URI: 085464833615.dkr.ecr.ap-southeast-1.amazonaws.com   │ │
│  │       /ess-web:latest                                      │ │
│  │                                                            │ │
│  │  Contains: Docker Images                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                         ↑                                         │
│  ┌──────────────────────┘                                        │
│  │                                                                │
│  │  ┌──────────────────────────────────────────────────────────┐│
│  │  │         CLOUDWATCH LOGS                                  ││
│  │  │  Log Group: /ecs/ess-web-task                           ││
│  │  │  Retention: 7 days                                       ││
│  │  │  Purpose: Application & Container Logs                   ││
│  │  └──────────────────────────────────────────────────────────┘│
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                            ↑
                            │
                    Docker Push / Pull
                            │
┌──────────────────────────────────────────────────────────────────┐
│                   BUILD & DEPLOYMENT                              │
│                                                                   │
│  Option 1: LOCAL                Option 2: GITHUB ACTIONS         │
│  ┌──────────────────┐          ┌────────────────────────┐       │
│  │ Developer Machine│          │  GitHub Repository      │       │
│  │                  │          │                         │       │
│  │ 1. npm run build │          │  1. git push            │       │
│  │ 2. docker build  │          │  2. GitHub Actions:     │       │
│  │ 3. docker push   │          │     - npm run build     │       │
│  │ 4. ecs update    │          │     - docker build      │       │
│  └──────────────────┘          │     - docker push       │       │
│                                │     - ecs update         │       │
│                                └────────────────────────┘       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Deployment Flow

### Manual Deployment (UPDATE-DEPLOYMENT.bat)

```
┌─────────────────┐
│ Developer Makes │
│  Code Changes   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Run Script:     │
│ UPDATE-         │
│ DEPLOYMENT.bat  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Step 1:         │
│ npm run build   │
│ Creates dist/   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Step 2:         │
│ docker build    │
│ Creates image   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Step 3:         │
│ AWS ECR Login   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Step 4:         │
│ docker tag      │
│ Tag as :latest  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Step 5:         │
│ docker push     │
│ Upload to ECR   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Step 6:         │
│ ECS Update      │
│ Force Deploy    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ ECS Rolling     │
│ Update:         │
│ • Stop old task │
│ • Start new task│
│ • Health check  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ ✅ Live!        │
│ Changes visible │
│ in 3-5 minutes  │
└─────────────────┘
```

---

### CI/CD Deployment (GitHub Actions)

```
┌─────────────────┐
│ Developer:      │
│ git push        │
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────────────┐
│ GitHub Actions Workflow Triggered       │
│ File: .github/workflows/deploy.yml      │
└────────┬────────────────────────────────┘
         │
         ├─→ Job 1: Checkout Code
         │         └─→ actions/checkout@v4
         │
         ├─→ Job 2: Setup Node.js 20
         │         └─→ actions/setup-node@v4
         │
         ├─→ Job 3: Install Dependencies
         │         └─→ npm install --legacy-peer-deps
         │
         ├─→ Job 4: Build Application
         │         └─→ npm run build
         │
         ├─→ Job 5: Configure AWS Credentials
         │         └─→ From GitHub Secrets
         │
         ├─→ Job 6: Login to ECR
         │         └─→ aws-actions/amazon-ecr-login@v2
         │
         ├─→ Job 7: Build & Push Docker Image
         │         ├─→ docker build
         │         ├─→ docker tag
         │         └─→ docker push
         │
         ├─→ Job 8: Update Task Definition
         │         └─→ Download current + update image
         │
         └─→ Job 9: Deploy to ECS
                   └─→ aws-actions/amazon-ecs-deploy@v1
                             │
                             ↓
                   ┌─────────────────┐
                   │ ✅ Deployed!    │
                   │ Auto in 3-5 min │
                   └─────────────────┘
```

---

## 🌐 Network Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      INTERNET                               │
└────────────────────┬───────────────────────────────────────┘
                     │
                     ↓
┌────────────────────────────────────────────────────────────┐
│  AWS REGION: ap-southeast-1 (Singapore)                    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  VPC (Virtual Private Cloud)                         │  │
│  │                                                       │  │
│  │  ┌─────────────────────┐  ┌──────────────────────┐  │  │
│  │  │  Public Subnet A    │  │  Public Subnet B     │  │  │
│  │  │  (ap-southeast-1a)  │  │  (ap-southeast-1b)   │  │  │
│  │  │                     │  │                      │  │  │
│  │  │  ┌───────────────┐  │  │  ┌────────────────┐ │  │  │
│  │  │  │  ECS Task     │  │  │  │  ALB Target   │ │  │  │
│  │  │  │  (Fargate)    │  │  │  │  Group        │ │  │  │
│  │  │  │  Public IP:   │  │  │  │  (Optional)   │ │  │  │
│  │  │  │  18.140.2.134 │  │  │  └────────────────┘ │  │  │
│  │  │  └───────┬───────┘  │  │                      │  │  │
│  │  │          │          │  │                      │  │  │
│  │  │  ┌───────▼────────┐ │  │                      │  │  │
│  │  │  │ Security Group │ │  │                      │  │  │
│  │  │  │ Allow:         │ │  │                      │  │  │
│  │  │  │ • HTTP (80)    │ │  │                      │  │  │
│  │  │  │ from 0.0.0.0/0 │ │  │                      │  │  │
│  │  │  └────────────────┘ │  │                      │  │  │
│  │  └─────────────────────┘  └──────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │  Internet Gateway                               │ │  │
│  │  │  Provides public internet access                │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

## 💾 Data Flow

### User Request Flow

```
1. User enters: http://18.140.2.134
                      │
                      ↓
2. DNS resolves to AWS public IP
                      │
                      ↓
3. Request hits ECS task on port 80
                      │
                      ↓
4. Security Group allows traffic
                      │
                      ↓
5. Docker container receives request
                      │
                      ↓
6. Nginx processes request
                      │
                      ↓
7. Serves file from /usr/share/nginx/html
                      │
                      ↓
8. React app (index.html + JS bundles) sent to browser
                      │
                      ↓
9. Browser renders React application
                      │
                      ↓
10. React app makes API calls to backend
                      │
                      ↓
11. User sees ESS-WEB dashboard
```

---

## 🔄 Container Lifecycle

```
┌──────────────────┐
│ Image in ECR     │
│ :latest tag      │
└────────┬─────────┘
         │
         │ ECS Task starts
         ↓
┌──────────────────┐
│ Image Pull       │
│ From ECR to Node │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│ Container Start  │
│ nginx -g daemon  │
│ off              │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│ Health Check     │
│ HTTP GET :80/    │
└────────┬─────────┘
         │
         ↓ Pass
┌──────────────────┐
│ RUNNING State    │
│ Receiving traffic│
└────────┬─────────┘
         │
         │ During deployment
         ↓
┌──────────────────┐
│ Rolling Update   │
│ • New task starts│
│ • Health check   │
│ • Old task stops │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│ Updated RUNNING  │
│ New version live │
└──────────────────┘
```

---

## 📊 Cost Architecture

```
┌──────────────────────────────────────────────────┐
│  MONTHLY AWS COSTS                               │
│                                                  │
│  Base Setup:                                     │
│  ┌────────────────────────────────────────────┐ │
│  │ ECS Fargate                                │ │
│  │ • 1 vCPU × 730 hours                       │ │
│  │ • 3 GB RAM × 730 hours                     │ │
│  │ • Cost: ~$30/month                         │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ ECR Storage                                │ │
│  │ • ~1 GB image storage                      │ │
│  │ • Cost: ~$1/month                          │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ CloudWatch Logs                            │ │
│  │ • Log ingestion & storage                  │ │
│  │ • Cost: ~$1/month                          │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Base Total: ~$32/month                          │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Optional: Application Load Balancer        │ │
│  │ • HTTPS/SSL termination                    │ │
│  │ • Custom domain support                    │ │
│  │ • Cost: +$23/month                         │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Optional: Route 53                         │ │
│  │ • Hosted zone for domain                   │ │
│  │ • Cost: +$0.50/month                       │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  With HTTPS Total: ~$56/month                    │
└──────────────────────────────────────────────────┘
```

---

## 🔐 Security Layers

```
┌─────────────────────────────────────────────────────┐
│  Layer 1: Network Security                          │
│  • VPC isolation                                    │
│  • Security Groups (firewall rules)                 │
│  • Public/Private subnets                           │
└─────────────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────┐
│  Layer 2: IAM Security                              │
│  • Task Execution Role (ECR + CloudWatch)           │
│  • Least privilege principle                        │
│  • No hardcoded credentials                         │
└─────────────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────┐
│  Layer 3: Container Security                        │
│  • Minimal base image (Alpine)                      │
│  • Image scanning (ECR)                             │
│  • Read-only root filesystem                        │
│  • No privileged mode                               │
└─────────────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────┐
│  Layer 4: Application Security                      │
│  • HTTPS encryption (with ALB)                      │
│  • Environment variable secrets                     │
│  • Regular dependency updates                       │
│  • Input validation                                 │
└─────────────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────┐
│  Layer 5: Monitoring & Audit                        │
│  • CloudWatch Logs                                  │
│  • CloudTrail (API auditing)                        │
│  • Alerts & Notifications                           │
└─────────────────────────────────────────────────────┘
```

---

## 📈 Scaling Architecture (Future)

```
Current State:                  Future State:
┌──────────────┐               ┌──────────────────────────────┐
│ 1 ECS Task   │               │ Auto Scaling Group           │
│ (Manual)     │               │ • Min: 2 tasks               │
└──────────────┘               │ • Max: 10 tasks              │
                               │ • Target: 70% CPU            │
                               └──────────────────────────────┘
                                         │
                                         ↓
                               ┌──────────────────────────────┐
                               │ Application Load Balancer    │
                               │ • Distributes traffic        │
                               │ • Health checks              │
                               └──────────────────────────────┘
                                         │
                   ┌─────────────────────┼─────────────────────┐
                   │                     │                     │
                   ↓                     ↓                     ↓
           ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
           │  Task 1      │    │  Task 2      │    │  Task N      │
           │  (Active)    │    │  (Active)    │    │  (Scaling)   │
           └──────────────┘    └──────────────┘    └──────────────┘
```

---

**Last Updated**: November 19, 2026  
**Version**: 1.0.0

