# Environment variables reference

Use `.env.development` for local and Docker dev (see README). Use `.env` as a local production reference only; do not commit. In production, set variables in your host dashboard.

Templates: `.env.example` (generic), `.env.development.example` (development).

---

## Required

| Variable | Description | Constraint / note |
|----------|-------------|--------------------|
| MONGODB_URI | MongoDB connection string | Valid URL. Local: `mongodb://localhost:27017/your-db`. Docker (API in container): `mongodb://mongodb:27017/your-db`. Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/your-db`. |
| FRONTEND_URL | Allowed CORS origin | Valid URL. Single origin the frontend is served from. |
| AWS_ACCESS_KEY_ID | AWS IAM access key | Used for S3 (and optional CloudFront). |
| AWS_SECRET_ACCESS_KEY | AWS IAM secret key | Same as above. |
| AWS_REGION | AWS region | e.g. `us-east-1`, `eu-west-1`. |
| AWS_BUCKET_NAME | S3 bucket name | Bucket used for uploads. |
| JWT_SECRET | Access token signing secret | Minimum 32 characters. Use a long random string in production. |
| JWT_REFRESH_SECRET | Refresh token signing secret | Minimum 32 characters. Different from JWT_SECRET. |
| ADMIN_EMAIL | Admin user email | Used by seed to create the initial admin. Valid email. |
| ADMIN_PASSWORD | Admin user password | Minimum 8 characters. Used by seed. |

---

## Optional

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | `development`. Use `production` when deploying. |
| PORT | Server port | `5000`. Host may set this (e.g. Railway, Render). |
| JWT_EXPIRE | Access token TTL | `7d`. |
| JWT_REFRESH_EXPIRE | Refresh token TTL | `30d`. |
| CLOUDFRONT_URL | CloudFront distribution URL | Not set. Set if you serve assets via CloudFront. Must be a valid URL. |
| LOG_LEVEL | Log level | `info`. |
| ADMIN_NAME | Admin display name | `Admin User`. Used by seed. |
| REDIS_URL | Redis connection URL | Not required by app; optional for future use. |

---

## Loading order

If `.env.development` exists, it is loaded first. Then `.env` is loaded. So development can use only `.env.development`; production relies on host-injected variables (or a `.env` file you keep locally as reference only).
