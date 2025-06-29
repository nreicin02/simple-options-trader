# Deployment Guide

Complete deployment guide for Simple Options Trader.

## Prerequisites

- **Node.js 18+**
- **PostgreSQL 12+**
- **Domain name** (production)
- **SSL certificate** (production)
- **API keys** for external services

## Environment Setup

### Backend Environment

Create `.env` in backend directory:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# JWT Configuration
JWT_SECRET="your-super-secure-jwt-secret-key"

# Server Configuration
PORT=4000
NODE_ENV=production

# CORS Configuration
CORS_ORIGIN="https://yourdomain.com"

# API Keys
ALPHA_VANTAGE_API_KEY="your-alpha-vantage-api-key"

# Redis (Optional)
REDIS_URL="redis://host:port"

# Security
HELMET_ENABLED=true
COMPRESSION_ENABLED=true
```

### Frontend Environment

Create `.env` in shadcn-ui directory:

```env
VITE_API_BASE_URL=https://yourdomain.com/api
VITE_WS_URL=wss://yourdomain.com
VITE_APP_NAME="Simple Options Trader"
```

## Database Setup

### PostgreSQL Setup

1. **Install PostgreSQL**:
   ```bash
   # Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib

   # macOS
   brew install postgresql
   ```

2. **Create Database**:
   ```bash
   sudo -u postgres psql
   CREATE DATABASE simple_options_trader;
   CREATE USER trader_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE simple_options_trader TO trader_user;
   \q
   ```

3. **Run Migrations**:
   ```bash
   cd backend
   npx prisma migrate deploy
   npx prisma generate
   ```

### Cloud Database Options

#### AWS RDS
```bash
aws rds create-db-instance \
  --db-instance-identifier simple-options-trader \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password secure_password \
  --allocated-storage 20
```

#### Heroku Postgres
```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
```

## Backend Deployment

### 1. Build Application

```bash
cd backend
npm install
npm run build
```

### 2. Process Management

#### PM2 (Recommended)

```bash
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'simple-options-backend',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    }
  }]
}
EOF

pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

#### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["node", "dist/index.js"]
```

```bash
docker build -t simple-options-backend .
docker run -p 4000:4000 simple-options-backend
```

### 3. Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:5174;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Frontend Deployment

### 1. Build Application

```bash
cd shadcn-ui
npm install
npm run build
```

### 2. Serve Static Files

#### Using Nginx

```bash
# Copy built files
sudo cp -r dist/* /var/www/html/

# Configure Nginx
sudo nano /etc/nginx/sites-available/simple-options-trader
```

#### Using Vercel

```bash
npm install -g vercel
vercel --prod
```

#### Using Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## SSL/HTTPS Setup

### Let's Encrypt (Free)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Auto-renewal

```bash
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring

### PM2 Monitoring

```bash
pm2 monit
pm2 logs
```

### Nginx Monitoring

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Common Issues

1. **Database Connection**: Check DATABASE_URL and network connectivity
2. **CORS Errors**: Verify CORS_ORIGIN matches frontend URL
3. **JWT Issues**: Ensure JWT_SECRET is set and consistent
4. **Port Conflicts**: Check if ports 4000/5174 are available

### Logs

```bash
# Backend logs
pm2 logs simple-options-backend

# Nginx logs
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

## Platform-Specific Guides

### Heroku

```bash
# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### DigitalOcean App Platform

1. Connect GitHub repository
2. Configure environment variables
3. Set build commands
4. Deploy automatically

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] CORS_ORIGIN is properly configured
- [ ] SSL/HTTPS is enabled
- [ ] Database credentials are secure
- [ ] API keys are environment variables
- [ ] Rate limiting is enabled
- [ ] Helmet security headers are active 