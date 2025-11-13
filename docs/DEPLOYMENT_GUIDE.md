# Deployment Guide

## Quick Start

This guide will help you deploy the Super Pay application to production.

---

## Prerequisites

### Required Services

1. **PostgreSQL Database** (v14+)
   - Neon, AWS RDS, or any PostgreSQL provider
   - Recommended: Connection pooling enabled

2. **Redis Instance** (v6+)
   - For rate limiting and session management
   - Required for production
   - ElastiCache, Redis Cloud, or self-hosted

3. **Node.js** (v18+)
   - For running the application

4. **Hosting Provider**
   - Examples: joshua.app, Vercel, Railway, Heroku, AWS, Google Cloud
   - Must support Node.js applications
   - Must allow WebSocket connections

### Optional Services

1. **Stripe Account** (for payment processing)
2. **Sentry Account** (for error tracking)
3. **OpenAI API Key** (for AI features)
4. **SMS Provider** (for real OTP delivery)

---

## Environment Setup

### 1. Copy Environment Template

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` with your production values:

```env
# CRITICAL - MUST CHANGE
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
JWT_SECRET=<generate-strong-secret>

# Payment Processing
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional Services
OPENAI_API_KEY=sk-...
SENTRY_DSN=https://...
```

### 3. Generate Secure JWT Secret

```bash
# Generate a strong random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Database Setup

### 1. Create Production Database

On your PostgreSQL provider:
- Create a new database
- Note the connection URL
- Enable connection pooling (recommended)

### 2. Run Migrations

```bash
# Install dependencies
npm install

# Push schema to database
npm run db:push

# For production, use migrations instead:
# npx drizzle-kit generate:pg
# npx drizzle-kit migrate
```

### 3. Verify Database

```bash
# Check tables were created
psql $DATABASE_URL -c "\dt"
```

---

## Redis Setup

### 1. Provision Redis Instance

Choose one:
- **Redis Cloud**: Free tier available
- **AWS ElastiCache**: Production-grade
- **Self-hosted**: For full control

### 2. Configure Connection

Add to `.env`:
```env
REDIS_URL=redis://username:password@host:6379
```

### 3. Test Connection

```bash
redis-cli -u $REDIS_URL ping
# Should return: PONG
```

---

## Building the Application

### 1. Install Dependencies

```bash
npm ci --production
```

### 2. Run Type Check

```bash
npm run check
```

### 3. Build Application

```bash
npm run build
```

This creates:
- `dist/` - Backend build
- `dist/public/` - Frontend build

### 4. Verify Build

```bash
# Check build output
ls -la dist/
```

---

## Deployment Methods

### Method 1: Manual Deployment

```bash
# On your server
git clone <repository>
cd <project>
npm ci --production
npm run build
npm start
```

### Method 2: Docker (Recommended)

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --production

# Copy source
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 5000

# Start
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t superpay .
docker run -p 5000:5000 --env-file .env superpay
```

### Method 3: Platform as a Service

#### joshua.app
```bash
# Already on joshua.app - just push changes
git push
```

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Railway
```bash
npm install -g @railway/cli
railway up
```

#### Heroku
```bash
heroku create superpay
git push heroku main
```

---

## Post-Deployment Configuration

### 1. Configure Domain

Point your domain to the deployed application:
- A record: `your-domain.com` → `<server-ip>`
- CNAME: `www.your-domain.com` → `your-app.platform.com`

### 2. Enable SSL/TLS

Most platforms provide automatic SSL:
- joshua.app: Automatic
- Vercel: Automatic
- Railway: Automatic
- Heroku: Free SSL available

For manual setup:
- Use Let's Encrypt (free)
- Configure reverse proxy (nginx/Apache)

### 3. Configure CORS

Update `.env`:
```env
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 4. Configure CSP

Production CSP should be strict:
```env
CSP_SCRIPT_SRC=self
CSP_STYLE_SRC=self,https://fonts.googleapis.com
CSP_CONNECT_SRC=self,https://api.stripe.com
```

---

## Stripe Configuration

### 1. Set Up Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.updated`
4. Copy webhook signing secret

### 2. Update Environment

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 3. Test Webhook

```bash
stripe trigger payment_intent.succeeded
```

---

## Monitoring Setup

### 1. Configure Sentry

```env
SENTRY_DSN=https://...@sentry.io/...
SENTRY_TRACES_SAMPLE_RATE=0.1
```

### 2. Set Up Health Checks

Create uptime monitoring for:
- `https://yourdomain.com/health`
- Check every 1-5 minutes
- Alert on failures

Recommended services:
- UptimeRobot (free)
- Pingdom
- StatusCake

### 3. Log Aggregation

Consider using:
- Datadog
- Loggly
- Papertrail
- CloudWatch (AWS)

---

## Security Checklist

### Pre-Launch

- [ ] JWT_SECRET changed from default
- [ ] Database has strong password
- [ ] Redis has authentication enabled
- [ ] All API keys are environment variables
- [ ] CSP configured for production
- [ ] CORS limited to production domains
- [ ] HTTPS/TLS enabled
- [ ] Rate limiting enabled
- [ ] Input sanitization enabled

### Ongoing

- [ ] Regular dependency updates
- [ ] Security audit monthly
- [ ] Access logs reviewed
- [ ] Failed login attempts monitored
- [ ] Database backups verified

---

## Performance Optimization

### 1. Enable Compression

Install compression middleware:
```bash
npm install compression
```

Add to server:
```typescript
import compression from 'compression';
app.use(compression());
```

### 2. Configure Caching

Set cache headers:
```typescript
// Static assets - cache for 1 year
app.use('/assets', express.static('public/assets', {
  maxAge: '1y',
  immutable: true
}));
```

### 3. Database Optimization

- Enable connection pooling
- Add indexes on frequently queried fields
- Use read replicas for scaling

### 4. CDN for Static Assets

Upload `dist/public/assets/` to CDN:
- Cloudflare
- AWS CloudFront
- Vercel Edge Network

---

## Backup Strategy

### 1. Database Backups

Automated backups:
```bash
# Daily backup script
pg_dump $DATABASE_URL | gzip > backup-$(date +%Y%m%d).sql.gz

# Upload to S3
aws s3 cp backup-*.sql.gz s3://your-bucket/backups/
```

### 2. Environment Backups

Keep encrypted copy of:
- `.env` file
- SSL certificates
- API keys

### 3. Code Backups

Use git tags for releases:
```bash
git tag -a v1.0.0 -m "Production release 1.0.0"
git push origin v1.0.0
```

---

## Rollback Procedure

### Quick Rollback

```bash
# Revert to previous version
git checkout <previous-tag>
npm ci
npm run build
npm start

# Restart application
pm2 restart superpay
```

### Database Rollback

```bash
# Restore from backup
gunzip < backup-YYYYMMDD.sql.gz | psql $DATABASE_URL
```

---

## Troubleshooting

### Application Won't Start

Check logs:
```bash
# PM2
pm2 logs superpay

# Docker
docker logs <container-id>

# Direct
node dist/index.js
```

Common issues:
- Missing environment variables
- Database connection failed
- Port already in use
- Redis connection failed

### High Memory Usage

Monitor:
```bash
# Check memory
pm2 monit

# Restart if needed
pm2 restart superpay
```

### Database Connection Errors

1. Check connection string
2. Verify database is running
3. Check firewall rules
4. Verify SSL settings

### Stripe Webhooks Not Working

1. Check webhook URL is correct
2. Verify webhook secret
3. Check server logs for errors
4. Test with Stripe CLI

---

## Maintenance

### Regular Tasks

**Daily**:
- Monitor error rates
- Check uptime
- Review failed transactions

**Weekly**:
- Review access logs
- Check database size
- Verify backups

**Monthly**:
- Update dependencies
- Security audit
- Performance review
- Cost optimization

### Scaling

**Vertical Scaling** (increase server resources):
- More CPU
- More RAM
- Faster disk

**Horizontal Scaling** (add more servers):
- Load balancer
- Multiple app instances
- Read replicas for database
- Redis cluster

---

## Support

### Getting Help

1. Check logs first
2. Review documentation
3. Search error messages
4. Contact platform support

### Emergency Contacts

Document:
- Database provider support
- Hosting provider support
- Payment processor support
- On-call engineer contacts

---

## Conclusion

This deployment guide covers the essential steps for launching the Super Pay application to production. Always test thoroughly in a staging environment before deploying to production.

**Remember**: It's better to deploy slowly and carefully than to rush and face production issues.

For questions or issues, refer to:
- [Architecture Documentation](./ARCHITECTURE.md)
- [Coding Standards](./CODING_STANDARDS.md)
- [Production Readiness Checklist](./PRODUCTION_READINESS.md)
