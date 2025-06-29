# Setup Guide

Quick setup instructions for the Simple Options Trader platform.

## Prerequisites

- Node.js 18.0.0 or higher
- PostgreSQL database
- Alpha Vantage API key (free from https://www.alphavantage.co/)

## Quick Setup

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/simple-options-trader.git
cd simple-options-trader
npm run install:all
```

### 2. Environment Configuration

**Backend** - Create `backend/.env`:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/simpli_options"
JWT_SECRET="your-super-secret-jwt-key-here"
ALPHA_VANTAGE_API_KEY="your-alpha-vantage-api-key"
PORT=4000
NODE_ENV=development
```

**Frontend** - Create `shadcn-ui/.env`:
```bash
VITE_API_BASE_URL=http://localhost:4000
```

### 3. Database Setup
```bash
cd backend
npx prisma generate
npx prisma db push
```

### 4. Start Development Servers
```bash
# From root directory
npm run dev
```

## Access Points

- **Frontend**: http://localhost:5173 (or next available port)
- **Backend API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/api/docs

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Frontend will automatically try the next available port
   - Check terminal output for the actual URL

2. **Database Connection Issues**
   - Ensure PostgreSQL is running
   - Verify DATABASE_URL in backend/.env
   - Check database permissions

3. **API Key Issues**
   - Get a free Alpha Vantage API key from https://www.alphavantage.co/
   - Free tier has rate limits; consider paid plan for production

4. **Redis Connection Issues**
   - Redis is optional; the app will continue without it
   - Install Redis: `brew install redis` (macOS) or `sudo apt-get install redis-server` (Ubuntu)

### Development Commands
```bash
# Code quality
npm run lint
npm run format

# Individual servers
npm run dev:backend
npm run dev:frontend
```

## Production Deployment

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md). 