# AWS Deployment Architecture Guide

This guide details how to deploy and scale the **Medical Case Management System** securely on Amazon Web Services (AWS) adhering to medical data compliance standards.

---

## 1. High-Level AWS Architecture

```
                    [ Route 53 (DNS) ]
                            │
                            ▼
              [ AWS WAF + CloudFront / ALB ]
                 (SSL/TLS 1.3 Termination)
                            │
              ┌─────────────┴─────────────┐
              │    VPC (10.0.0.0/16)       │
              │                           │
  [ Public Subnets ]                      │
  ├─ ALB (Application Load Balancer)      │
  │  Security Group: sg-alb (Ports 80/443)│
  │                                       │
  [ Private Subnets (App Tier) ]          │
  ├─ EC2 Auto-Scaling Group (t4g.small)  │
  │  Nginx + PHP 8.3-FPM + Laravel App    │
  │  Security Group: sg-app (Inbound 80   │
  │  from sg-alb ONLY)                    │
  │                                       │
  [ Private Subnets (Data Tier) ]         │
  ├─ AWS RDS MySQL 8.0 (Multi-AZ)         │
  │  Security Group: sg-db (Inbound 3306  │
  │  from sg-app ONLY)                    │
  │                                       │
  [ AWS Managed Services ]                │
  ├─ AWS Secrets Manager (App Secrets)    │
  ├─ AWS S3 (Encrypted Document Bucket)   │
  └─ Amazon CloudWatch (Audit Logging)    │
                                          │
              └───────────────────────────┘
```

---

## 2. Infrastructure Components

### 2.1 Compute (Amazon EC2 & ALB)
- **Instances:** AWS Graviton3/4 instances (`t4g.small` or `c7g.medium`) running Amazon Linux 2023 or Ubuntu 24.04 LTS.
- **Process Management:** Nginx as reverse proxy with PHP 8.3-FPM, OPCache enabled, and Supervisor managing queue workers (`php artisan queue:work`).
- **Load Balancing:** AWS Application Load Balancer (ALB) across multiple Availability Zones, terminating TLS with AWS Certificate Manager (ACM).

### 2.2 Database (Amazon RDS for MySQL)
- **Engine:** MySQL 8.0 with InnoDB engine and automated daily snapshots.
- **High Availability:** Multi-AZ deployment for zero-downtime failover.
- **Storage Encryption:** AWS KMS (`aws/rds`) customer-managed or AWS-managed key for encryption at rest.

### 2.3 Storage (Amazon S3)
- Encrypted S3 bucket (`SSE-S3` or `SSE-KMS`) with **Block Public Access** strictly enabled for medical documents or surgical plan attachments.
- Access granted strictly through temporary AWS IAM pre-signed URLs with 15-minute expirations.

---

## 3. Security Groups & Network Isolation

| Security Group | Inbound Rules | Outbound Rules | Purpose |
| :--- | :--- | :--- | :--- |
| `sg-alb` | `0.0.0.0/0:443`, `0.0.0.0/0:80` (redirect to 443) | `sg-app:80` | Public traffic entry point with DDoS mitigation |
| `sg-app` | `sg-alb:80` | `0.0.0.0/0:443` (via NAT Gateway) | EC2 Laravel application instances |
| `sg-db` | `sg-app:3306` | None | Dedicated database isolation; no direct internet access |

---

## 4. Environment Secrets & Configuration

1. **AWS Secrets Manager / SSM Parameter Store:** Never commit `.env` files into source control. At instance startup, the EC2 `user-data` script pulls configuration secrets:
   ```bash
   aws secretsmanager get-secret-value --secret-id medical-cases/prod/env \
     --query SecretString --output text > /var/www/medical-cases/.env
   ```
2. **Key Generation:** Run `php artisan config:cache`, `php artisan route:cache`, and `php artisan view:cache` during CI/CD deployment.

---

## 5. Deployment Automation (CI/CD Pipeline)

```yaml
# Sample GitHub Actions Deploy Step
- name: Deploy to AWS EC2
  run: |
    ssh -o StrictHostKeyChecking=no deploy@app.jajalmedical.com << 'EOF'
      cd /var/www/medical-cases
      git pull origin main
      composer install --no-dev --optimize-autoloader
      php artisan migrate --force
      php artisan config:cache
      php artisan route:cache
      php artisan view:cache
      sudo systemctl reload php8.3-fpm
    EOF
```
