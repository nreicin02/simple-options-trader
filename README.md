# Simple Options Trader

A modern, full-stack options trading platform for simulating stock and options trades, tracking portfolios, and analyzing financial data. Built with React, TypeScript, Node.js, and PostgreSQL.

---

## 🚀 Features

### Real-Time Stock Data
- Fetches live stock quotes and market data from Alpha Vantage API
- **Automatic fallback to mock data** with user notification if API rate limits are reached
- Supports major tickers (AAPL, TSLA, MSFT, etc.) and custom symbols

### Options Trading Simulation
- View options chains for supported stocks
- Simulate buying/selling call and put options
- Calculates Greeks (Delta, Gamma, Theta, Vega) and risk metrics
- Expiration and strike selection

### Portfolio Management
- Track open positions, cash, and P&L in real time
- View day and total P&L, market value, and trade history
- Realistic order placement and position tracking

### Financial Analytics
- Company overview, sector, and market cap
- Income statement, balance sheet, and cash flow data
- Recent earnings and financial ratios

### Watchlist
- Add/remove stocks to a personal watchlist
- View real-time data for all watchlist symbols

### User Authentication
- Secure registration and login with JWT
- User experience level selection
- Protected routes for trading and portfolio

### Responsive UI & UX
- Built with shadcn/ui and Tailwind CSS for a modern, mobile-friendly interface
- Interactive charts (Recharts) for price and volume history
- Smart notifications for API status, errors, and mock data usage

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** for fast development
- **shadcn/ui** for UI components
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Router** for navigation

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** with **PostgreSQL**
- **JWT** for authentication
- **Alpha Vantage API** for market data
- **Redis** for caching (optional, app works without it)

### Dev Tools
- **ESLint** & **Prettier** for code quality
- **Vitest** for testing
- **Nodemon** for backend hot reload
- **Concurrently** for running both servers

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- Alpha Vantage API key ([get one free](https://www.alphavantage.co/))

### Setup
```bash
# Clone and install
git clone https://github.com/nreicin02/simple-options-trader.git
cd simple-options-trader
npm install
cd backend && npm install
cd ../shadcn-ui && npm install

# Set up environment variables (see docs/SETUP_GUIDE.md)
# Example for backend/.env:
# DATABASE_URL=postgresql://username:password@localhost:5432/simpli_options_dev
# JWT_SECRET=your-secret
# ALPHA_VANTAGE_API_KEY=your-api-key

# Set up database
cd backend
npx prisma migrate dev
npx prisma generate

# Start the app (from project root)
npm run dev
```
- Frontend: http://localhost:5174
- Backend: http://localhost:4000

---

## 📚 Documentation
- [Setup Guide](./docs/SETUP_GUIDE.md)
- [API Reference](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing](./CONTRIBUTING.md)

---

## 📊 Example API Endpoints

### Authentication
- `POST /api/users/register` — Register a new user
- `POST /api/users/login` — Login and receive JWT
- `GET /api/users/me` — Get current user profile

### Trading & Portfolio
- `GET /api/trading/portfolio` — Get portfolio overview
- `GET /api/trading/positions` — Get current positions
- `GET /api/trading/orders` — Get order history
- `POST /api/trading/orders` — Place a new order

### Market Data
- `GET /api/market/quote/:symbol` — Get real-time stock quote
- `GET /api/market/financial/:symbol` — Get comprehensive financial data
- `GET /api/market/options/:symbol` — Get options chain data

---

## 🔔 API Rate Limits & Mock Data
If the Alpha Vantage API rate limit is reached, the app automatically switches to mock data and displays a notification to users. This ensures uninterrupted demo and development experience.

---

## 🏗️ Project Structure
```
simple-options-trader/
├── backend/                # Backend API server (Node.js, Express, Prisma)
│   ├── src/                # Source code for backend
│   │   ├── routes/         # Express route handlers (API endpoints)
│   │   ├── controllers/    # Business logic for each route
│   │   ├── services/       # Service layer (database, external APIs)
│   │   ├── middleware/     # Express middleware (auth, error handling)
│   │   ├── config/         # Configuration files (db, logger, redis)
│   │   └── types/          # TypeScript types
│   ├── prisma/             # Prisma schema and migrations
│   ├── .env                # Backend environment variables
│   └── ...                 # Backend config, scripts, etc.
├── shadcn-ui/              # Frontend React app
│   ├── src/                # Source code for frontend
│   │   ├── components/     # Reusable React components (UI, layout, etc.)
│   │   ├── pages/          # Page components (TradePage, PortfolioPage, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── contexts/       # React context providers (auth, state)
│   │   ├── utils/          # Utility functions (formatters, helpers)
│   │   └── index.css       # Global styles
│   ├── public/             # Static assets (favicon, robots.txt)
│   ├── .env                # Frontend environment variables
│   └── ...                 # Frontend config, scripts, etc.
├── docs/                   # Documentation (API, setup, deployment, etc.)
├── .gitignore              # Git ignore rules
├── package.json            # Project metadata and scripts
├── README.md               # Project overview and instructions
└── ...                     # Other config, diagrams, scripts
```

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 🛠️ Troubleshooting & FAQ

### Port 4000 already in use / EADDRINUSE
- Stop any other process using port 4000: `lsof -ti:4000 | xargs kill -9`
- Restart the backend: `npm run dev`

### Redis connection failed
- Redis is optional. The app will work without it, but you can install Redis locally for caching.

### API rate limit reached
- The app will notify you and use mock data until the limit resets (see notification at the top of the dashboard).

### Database connection issues
- Ensure PostgreSQL is running and your `DATABASE_URL` is correct in `.env`.

---

## 📄 License
[MIT](./LICENSE)

---

**Built with ❤️ for the trading community.** 