# Simple Options Trader

A modern, full-stack options trading platform with AI-powered insights, comprehensive options analysis, and real-time portfolio management. Built with React, TypeScript, Node.js, and PostgreSQL.

---

## 🚀 Features

### 🤖 AI-Powered Trading Assistant
- **Natural Language Chat Interface** - Ask questions about trading strategies, market analysis, and options concepts
- **AI Trading Advisor** - Get personalized options strategy recommendations based on market conditions and risk profile
- **Intelligent Risk Management** - AI-powered portfolio analysis and risk alerts
- **Strategy Recommendations** - Receive AI-generated trading suggestions with confidence scores

### 📈 Enhanced Options Trading
- **Comprehensive Options Chain** - View calls and puts with real-time pricing and Greeks
- **Advanced Strategy Builder** - Create complex multi-leg options strategies (spreads, straddles, iron condors)
- **Options Calculator** - Black-Scholes pricing model with Greeks calculation and profit/loss scenarios
- **Portfolio Greeks Exposure** - Monitor Delta, Gamma, Theta, and Vega across your entire portfolio
- **Risk Management Tools** - Position sizing, stress testing, and automated risk alerts

### 💹 Real-Time Market Data
- Live stock quotes and market data from Alpha Vantage API
- **Automatic fallback to mock data** with user notification if API rate limits are reached
- Interactive price charts with multiple timeframes (1D, 1W, 1M, 3M)
- Comprehensive financial data including income statements, balance sheets, and ratios

### 📊 Portfolio Management
- Real-time portfolio tracking with P&L calculations
- Position management with average cost and unrealized gains/losses
- Trade history and order management
- Watchlist functionality with real-time updates

### 🎨 Modern UI/UX
- **Sleek, Professional Interface** - Built with shadcn/ui and Tailwind CSS
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Intuitive Navigation** - Clean tab-based interface with logical grouping
- **Interactive Components** - Hover tooltips, real-time updates, and smooth animations
- **Accessibility Features** - Proper contrast, keyboard navigation, and screen reader support

### 🔐 User Authentication & Security
- Secure JWT-based authentication
- User experience level selection
- Protected routes and API endpoints
- Session management and auto-logout

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** for fast development and building
- **shadcn/ui** for modern, accessible UI components
- **Tailwind CSS** for utility-first styling
- **Recharts** for interactive data visualization
- **React Router** for client-side routing
- **OpenAI API** for AI-powered features

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** with **PostgreSQL** for data persistence
- **JWT** for secure authentication
- **Alpha Vantage API** for real-time market data
- **OpenAI API** for AI assistant functionality
- **Redis** for caching (optional)

### Development & Quality
- **ESLint** & **Prettier** for code quality and formatting
- **TypeScript** for type safety across the stack
- **Nodemon** for backend hot reload
- **Concurrently** for running both servers simultaneously

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- Alpha Vantage API key ([get one free](https://www.alphavantage.co/))
- OpenAI API key ([get one here](https://platform.openai.com/))

### Setup
```bash
# Clone and install
git clone https://github.com/nreicin02/simple-options-trader.git
cd simple-options-trader
npm install
cd backend && npm install
cd ../shadcn-ui && npm install

# Set up environment variables
# Backend (.env):
DATABASE_URL=postgresql://username:password@localhost:5432/simpli_options_dev
JWT_SECRET=your-secret-key
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-key
OPENAI_API_KEY=your-openai-key

# Frontend (.env):
VITE_API_URL=http://localhost:4000

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

## 🎯 Key Features in Detail

### AI Trading Assistant
- **Natural Language Interface**: Ask questions like "What's a good options strategy for a bullish outlook on AAPL?"
- **Strategy Recommendations**: Get AI-generated suggestions based on market conditions and your risk profile
- **Educational Content**: Learn about options trading concepts and strategies
- **Risk Analysis**: AI-powered portfolio risk assessment and alerts

### Options Trading Suite
- **Options Chain Display**: View all available calls and puts with real-time data
- **Strategy Builder**: Create complex strategies with visual payoff diagrams
- **Greeks Calculator**: Real-time calculation of Delta, Gamma, Theta, and Vega
- **Risk Management**: Portfolio-wide Greeks exposure monitoring

### Portfolio Analytics
- **Real-time P&L**: Track day and total profit/loss
- **Position Management**: Monitor individual positions with cost basis
- **Trade History**: Complete record of all trades and orders
- **Performance Metrics**: Portfolio performance analysis

---

## 📊 API Endpoints

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

### AI Features
- `POST /api/ai/chat` — AI chat assistant
- `POST /api/ai/advisor` — AI trading recommendations

---

## 🔔 Smart Data Management
The platform intelligently manages API rate limits by:
- **Caching** frequently requested data
- **Automatic fallback** to realistic mock data when limits are reached
- **User notifications** about data source status
- **Seamless switching** between real and mock data

---

## 🏗️ Project Structure
```
simple-options-trader/
├── backend/                # Backend API server
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── controllers/    # Business logic
│   │   ├── services/       # External APIs and database
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── config/         # Database, Redis, logging
│   │   └── types/          # TypeScript definitions
│   ├── prisma/             # Database schema and migrations
│   └── .env                # Environment variables
├── shadcn-ui/              # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   └── ...         # Custom components
│   │   ├── pages/          # Main application pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── contexts/       # State management
│   │   ├── services/       # API client and utilities
│   │   └── utils/          # Helper functions
│   ├── public/             # Static assets
│   └── .env                # Frontend environment
├── docs/                   # Documentation
└── ...                     # Configuration files
```

---

## 🚀 Recent Updates

### v2.0 - AI Integration & Enhanced Options Trading
- ✅ **AI Chat Assistant** with natural language interface
- ✅ **Advanced Options Strategy Builder** with visual payoff diagrams
- ✅ **Comprehensive Options Calculator** with Black-Scholes model
- ✅ **Portfolio Greeks Exposure** monitoring
- ✅ **AI Trading Advisor** with personalized recommendations
- ✅ **Enhanced UI/UX** with improved spacing, typography, and responsiveness
- ✅ **Risk Management Tools** with automated alerts
- ✅ **Professional Interface** with consistent design system

### v1.0 - Core Platform
- ✅ Real-time stock data and portfolio management
- ✅ Basic options trading simulation
- ✅ User authentication and security
- ✅ Financial data and analytics
- ✅ Watchlist and trade history

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 🛠️ Troubleshooting

### Common Issues
- **Port conflicts**: Use `lsof -ti:4000 | xargs kill -9` to free up ports
- **Database issues**: Ensure PostgreSQL is running and DATABASE_URL is correct
- **API limits**: The app automatically switches to mock data with notifications
- **Redis errors**: Redis is optional - the app works without it

### Performance Tips
- Enable Redis for better caching performance
- Use production builds for better frontend performance
- Monitor API usage to stay within rate limits

---

## 📄 License
[MIT](./LICENSE)

---

**Built with ❤️ for the trading community. Empowering traders with AI-driven insights and professional-grade tools.** 