# Setup Custom Domain with HTTPS/SSL

## Overview
Transform: `http://18.140.2.134` → `https://erp.yourdomain.com`

---

## Step 1: Request SSL Certificate (ACM)

### Via AWS Console:

1. **Go to AWS Certificate Manager (ACM)**
   - URL: https://ap-southeast-1.console.aws.amazon.com/acm

2. **Click "Request certificate"**

3. **Choose certificate type:**
   - Select: **"Request a public certificate"**
   - Click "Next"

4. **Add domain names:**
   - **Domain name**: `erp.yourdomain.com`
   - Click "Add another name to this certificate"
   - **Domain name**: `*.yourdomain.com` (wildcard - optional but recommended)
   - Click "Next"

5. **Validation method:**
   - Select: **"DNS validation"** (recommended)
   - Click "Next"

6. **Add tags (optional):**
   - Key: `Name`, Value: `ESS-Web SSL`
   - Click "Next"

7. **Review and request:**
   - Click "Request"

8. **Validate domain ownership:**
   - Click "View certificate"
   - Click "Create records in Route 53" button
   - (If your domain is in Route 53, this is automatic)
   - Wait 5-30 minutes for validation

---

## Step 2: Create Application Load Balancer (ALB)

### Via AWS Console:

1. **Go to EC2 → Load Balancers**
   - URL: https://ap-southeast-1.console.aws.amazon.com/ec2/home#LoadBalancers

2. **Click "Create load balancer"**

3. **Choose load balancer type:**
   - Select: **"Application Load Balancer"**
   - Click "Create"

4. **Basic configuration:**
   - **Name**: `ess-web-alb`
   - **Scheme**: Internet-facing
   - **IP address type**: IPv4

5. **Network mapping:**
   - **VPC**: Select your VPC (same as ECS service)
   - **Availability Zones**: Select at least 2 subnets in different AZs
     - ✅ ap-southeast-1a
     - ✅ ap-southeast-1b

6. **Security groups:**
   - Click "Create new security group"
   - **Name**: `ess-web-alb-sg`
   - **Inbound rules:**
     - Type: HTTP, Port: 80, Source: 0.0.0.0/0
     - Type: HTTPS, Port: 443, Source: 0.0.0.0/0
   - Click "Create security group"
   - Select the new security group

7. **Listeners and routing:**
   
   **HTTPS Listener (port 443):**
   - Protocol: HTTPS, Port: 443
   - Click "Create target group"
     - **Target type**: IP addresses
     - **Name**: `ess-web-targets`
     - **Protocol**: HTTP, Port: 80
     - **VPC**: Same as above
     - **Health check path**: `/` (or `/health` if you have one)
     - Click "Next"
     - **Don't register any targets yet** - ECS will do this automatically
     - Click "Create target group"
   - Back to ALB creation:
     - Select the target group: `ess-web-targets`
     - **SSL certificate**: Select the certificate from Step 1
   
   **HTTP Listener (port 80) - Redirect to HTTPS:**
   - Click "Add listener"
   - Protocol: HTTP, Port: 80
   - **Default action**: Redirect to HTTPS (443)

8. **Click "Create load balancer"**

9. **Wait 2-3 minutes** for ALB to become "Active"

---

## Step 3: Update ECS Service to Use Load Balancer

### Via AWS Console:

1. **Go to ECS → Clusters → ess-web-cluster**
   - URL: https://ap-southeast-1.console.aws.amazon.com/ecs/v2/clusters/ess-web-cluster

2. **Click on your service**: `ess-web-task-service-zlakin2ki`

3. **Click "Update service"**

4. **Scroll to "Load balancing":**
   - **Load balancer type**: Application Load Balancer
   - **Load balancer**: Select `ess-web-alb`
   - **Container to load balance**: Select `ess-web:80`
   - **Target group**: Select `ess-web-targets`
   - **Health check grace period**: 60 seconds

5. **Update security group:**
   - Edit your ECS task security group
   - **Inbound rule**: Allow HTTP (80) from ALB security group
   - Remove the old rule that allowed HTTP from 0.0.0.0/0

6. **Click "Update"**

7. **Wait 2-3 minutes** for deployment to complete

---

## Step 4: Configure Domain in Route 53

### Via AWS Console:

1. **Go to Route 53 → Hosted zones**
   - URL: https://console.aws.amazon.com/route53/v2/hostedzones

2. **Click on your domain** (e.g., `yourdomain.com`)

3. **Click "Create record"**

4. **Record details:**
   - **Record name**: `erp` (will become erp.yourdomain.com)
   - **Record type**: A
   - **Alias**: Toggle ON
   - **Route traffic to**: 
     - Choose: "Alias to Application and Classic Load Balancer"
     - Region: ap-southeast-1
     - Load balancer: Select `ess-web-alb`
   - **Routing policy**: Simple routing
   - Click "Create records"

5. **Wait 5-10 minutes** for DNS propagation

---

## Step 5: Test Your Setup

1. **Test HTTPS:**
   ```
   https://erp.yourdomain.com
   ```
   - Should show your app with a padlock 🔒

2. **Test HTTP redirect:**
   ```
   http://erp.yourdomain.com
   ```
   - Should automatically redirect to HTTPS

3. **Check certificate:**
   - Click the padlock in your browser
   - Should show valid certificate

---

## Architecture Diagram

```
User Browser
    ↓ (HTTPS)
Route 53 DNS (erp.yourdomain.com)
    ↓
Application Load Balancer (ALB)
    ↓ (HTTP)
ECS Fargate Tasks
    ↓
Docker Container (Nginx + React App)
```

---

## Security Notes

1. ✅ ALB handles SSL/TLS termination
2. ✅ Traffic between ALB and ECS is HTTP (internal VPC - secure)
3. ✅ ECS tasks only accept traffic from ALB (security group rules)
4. ✅ HTTP automatically redirects to HTTPS
5. ✅ Free SSL certificate from AWS (auto-renews)

---

## Cost Estimate (Singapore region)

- **ALB**: ~$23/month (+ $0.008 per GB processed)
- **ECS Fargate**: ~$30/month (1 vCPU, 3GB RAM, 24/7)
- **ECR**: ~$1/month (1GB storage)
- **Data Transfer**: ~$0.12/GB outbound
- **SSL Certificate**: FREE
- **Route 53**: $0.50/month per hosted zone + $0.40 per million queries

**Total estimated**: ~$55-60/month (excluding data transfer)

---

## Troubleshooting

### Issue: Can't access via domain
- Check DNS propagation: https://dnschecker.org
- Verify Route 53 record points to ALB
- Check ALB is in "Active" state

### Issue: Certificate validation stuck
- Verify DNS records in Route 53
- Wait up to 30 minutes
- Check email if using email validation

### Issue: 504 Gateway Timeout
- Check ECS task is running
- Verify target group health checks are passing
- Check security group allows traffic from ALB

### Issue: "Not Secure" warning
- Verify correct certificate is attached to ALB listener
- Check domain name matches certificate
- Clear browser cache

---

## Next Steps (Optional)

1. **CloudFront CDN**: Add for faster global performance
2. **WAF**: Add Web Application Firewall for security
3. **Auto Scaling**: Scale ECS tasks based on load
4. **Monitoring**: Set up CloudWatch alarms
5. **Backup domain**: Add www.yourdomain.com as alias

