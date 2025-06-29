# API Documentation

Complete API reference for the Simple Options Trader platform.

## Base URL

- **Development**: `http://localhost:4000/api`
- **Production**: `https://yourdomain.com/api`

## Authentication

Most endpoints require JWT authentication. Include in headers:
```
Authorization: Bearer <your-jwt-token>
```

## Error Format

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Endpoints

### Authentication

#### POST /api/users/register
Register a new user account.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### POST /api/users/login
Authenticate user and receive JWT token.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### GET /api/users/me
Get current user profile (requires auth).

### Trading

#### GET /api/trading/portfolio
Get user's portfolio overview (requires auth).

**Response:**
```json
{
  "success": true,
  "data": {
    "portfolio": {
      "totalValue": 50000.00,
      "cash": 10000.00,
      "investedValue": 40000.00,
      "dayPnL": 250.50,
      "totalPnL": 1500.75,
      "dayPnLPercent": 0.5,
      "totalPnLPercent": 3.0
    }
  }
}
```

#### GET /api/trading/positions
Get user's current positions (requires auth).

#### GET /api/trading/orders
Get user's order history (requires auth).

**Query Parameters:**
- `status` (optional): pending, filled, cancelled
- `limit` (optional): Number of orders (default: 50)
- `offset` (optional): Skip orders (default: 0)

#### POST /api/trading/orders
Place a new order (requires auth).

**Body:**
```json
{
  "symbol": "AAPL",
  "quantity": 100,
  "orderType": "market",
  "side": "buy",
  "price": 150.00
}
```

#### GET /api/trading/trades
Get user's trade history (requires auth).

### Market Data

#### GET /api/market/quote/{symbol}
Get real-time quote for a symbol.

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "price": 150.25,
    "change": 2.50,
    "changePercent": 1.69,
    "volume": 50000000,
    "marketCap": 2500000000000
  }
}
```

#### GET /api/market/search
Search for stocks by symbol or company name.

**Query Parameters:**
- `q`: Search query

#### GET /api/market/history/{symbol}
Get historical price data.

**Query Parameters:**
- `period`: 1d, 5d, 1m, 3m, 6m, 1y, 5y

### Financial Data

#### GET /api/financial/overview/{symbol}
Get company overview and key metrics.

#### GET /api/financial/income/{symbol}
Get income statement data.

#### GET /api/financial/balance/{symbol}
Get balance sheet data.

#### GET /api/financial/cashflow/{symbol}
Get cash flow statement data.

#### GET /api/financial/earnings/{symbol}
Get earnings data and estimates.

### Performance Analytics

#### GET /api/analytics/performance
Get user's performance metrics (requires auth).

#### GET /api/analytics/returns
Get return calculations and analysis (requires auth).

#### GET /api/analytics/risk
Get risk metrics and analysis (requires auth).

### Watchlists

#### GET /api/watchlists
Get user's watchlists (requires auth).

#### POST /api/watchlists
Create a new watchlist (requires auth).

#### POST /api/watchlists/{id}/symbols
Add symbol to watchlist (requires auth).

#### DELETE /api/watchlists/{id}/symbols/{symbol}
Remove symbol from watchlist (requires auth).

## Rate Limiting

- **Default**: 100 requests per 15 minutes
- **Market Data**: 1000 requests per hour
- **Trading**: 50 requests per minute

## WebSocket Endpoints

### Real-time Data
- **Connection**: `ws://localhost:4000/ws`
- **Authentication**: Send JWT token in connection message
- **Events**: price updates, order status, portfolio changes 