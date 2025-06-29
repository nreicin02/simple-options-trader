# Simple Options Trader 📊💹

A comprehensive trading platform built with React, TypeScript, and Node.js that provides real-time stock trading, options trading, financial analysis, and interactive charts with advanced performance analytics.

## 🚀 Features

- **Stock Trading**: Buy and sell stocks with market and limit orders
- **Options Trading**: Trade call and put options with Greeks calculation
- **Real-time Data**: Live stock quotes and market data via Alpha Vantage API
- **Portfolio Management**: Track positions, P&L, and performance metrics
- **Performance Analytics**: Comprehensive P&L analysis with win/loss ratios
- **Financial Analysis**: Company overview, financial statements, earnings data
- **Interactive Charts**: Price history and volume analysis with multiple timeframes
- **Watchlists**: Track multiple stocks in real-time

## 🛠️ Tech Stack

**Frontend**: React 18, TypeScript, Vite, shadcn/ui, Recharts, Tailwind CSS
**Backend**: Node.js, Express.js, Prisma, PostgreSQL, JWT, Alpha Vantage API
**Development**: ESLint, Prettier, TypeScript, Nodemon

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- PostgreSQL database
- Alpha Vantage API key (free from https://www.alphavantage.co/)

### Setup
```bash
# Clone and install
git clone https://github.com/yourusername/simple-options-trader.git
cd simple-options-trader
npm run install:all

# Set up environment variables
# Create .env files in backend/ and shadcn-ui/ directories (see SETUP_GUIDE.md)

# Set up database
cd backend
npx prisma generate
npx prisma db push

# Start development servers
cd ..
npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173 (or next available port)
- **Backend API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/api/docs

## 📖 Documentation

- [Setup Guide](./docs/SETUP_GUIDE.md) - Detailed setup instructions
- [API Documentation](./docs/API.md) - Backend API reference
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment

## 🎯 Usage

1. **Register/Login**: Create an account or use demo credentials
2. **Stock Trading**: Search for stocks (AAPL, TSLA, MSFT) and place orders
3. **Options Trading**: View options chains and trade with Greeks analysis
4. **Performance**: Analyze P&L, win rates, and trading statistics
5. **Financial Data**: Access comprehensive company financial information
6. **Watchlists**: Track your favorite stocks in real-time

## 📊 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user profile

### Trading
- `GET /api/trading/portfolio` - Get portfolio overview
- `GET /api/trading/positions` - Get current positions
- `GET /api/trading/orders` - Get order history
- `GET /api/trading/trades` - Get trade history
- `POST /api/trading/orders` - Place new order

### Market Data
- `GET /api/market/quote/:symbol` - Get real-time stock quote
- `GET /api/market/financial/:symbol` - Get comprehensive financial data
- `GET /api/market/options/:symbol` - Get options chain data

## 🏗️ Project Structure

```
simple-options-trader/
├── backend/                 # Backend API server
│   ├── src/routes/         # API routes and controllers
│   ├── src/models/         # Database models
│   ├── src/services/       # Business logic
│   └── prisma/             # Database schema
├── shadcn-ui/              # Frontend React app
│   ├── src/components/     # React components
│   ├── src/pages/          # Page components
│   ├── src/hooks/          # Custom hooks
│   └── src/utils/          # Utility functions
└── docs/                   # Documentation
```

## 🔧 Development

```bash
# Run both servers
npm run dev

# Run individually
npm run dev:backend
npm run dev:frontend

# Code quality
npm run lint
npm run format
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines. 