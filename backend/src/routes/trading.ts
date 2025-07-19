import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { stockDataCache } from './market';

const router = express.Router();
const prisma = new PrismaClient();

// Helper: Get latest price from cache or fallback
async function getLatestPrice(symbol: string): Promise<number> {
  const cacheKey = `quote_${symbol.toUpperCase()}`;
  const cached = stockDataCache.get(cacheKey);
  if (cached && cached.data && cached.data.price) {
    return cached.data.price;
  }
  // fallback: fetch from market route
  // (in production, call getRealStockQuote or similar)
  return 100; // fallback price
}

// Place a new order (market/limit/option)
router.post('/order', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = (req as AuthRequest).user;
    const { symbol, type, side, quantity, price, orderType, strike, expiration } = req.body;
    if (!symbol || !type || !side || !quantity || !orderType) {
      return res.status(400).json({ message: 'Missing required order fields' });
    }

    // Simulate market fill for market orders
    let fillPrice = price;
    if (type === 'market' || !price) {
      fillPrice = await getLatestPrice(symbol);
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        symbol: symbol.toUpperCase(),
        type,
        side,
        quantity,
        price: fillPrice,
        status: 'filled',
        filledQuantity: quantity,
        filledPrice: fillPrice,
        orderType,
        strike,
        expiration,
        commission: 0.0,
      },
    });

    // Update portfolio and positions
    let portfolio = await prisma.portfolio.findUnique({ where: { userId } });
    if (!portfolio) {
      portfolio = await prisma.portfolio.create({ data: { userId } });
    }
    let cash = portfolio.cash;
    let totalValue = portfolio.totalValue;
    const cost = fillPrice * quantity;
    if (side === 'buy') {
      cash -= cost;
    } else {
      cash += cost;
    }
    totalValue = cash; // will add positions value below

    // Update or create position
    let position = await prisma.position.findFirst({
      where: {
        userId,
        symbol: symbol.toUpperCase(),
        type: orderType,
        strike,
        expiration,
      },
    });
    if (side === 'buy') {
      if (position) {
        // Update position
        const newQty = position.quantity + quantity;
        const newAvg = ((position.avgPrice * position.quantity) + (fillPrice * quantity)) / newQty;
        position = await prisma.position.update({
          where: { id: position.id },
          data: {
            quantity: newQty,
            avgPrice: newAvg,
            currentPrice: fillPrice,
          },
        });
      } else {
        // Create new position
        position = await prisma.position.create({
          data: {
            userId,
            portfolioId: portfolio.id,
            symbol: symbol.toUpperCase(),
            type: orderType,
            quantity,
            avgPrice: fillPrice,
            currentPrice: fillPrice,
            strike,
            expiration,
          },
        });
      }
    } else if (side === 'sell' && position) {
      // Reduce or close position
      const newQty = position.quantity - quantity;
      if (newQty > 0) {
        position = await prisma.position.update({
          where: { id: position.id },
          data: { quantity: newQty, currentPrice: fillPrice },
        });
      } else {
        await prisma.position.delete({ where: { id: position.id } });
        position = null;
      }
    }

    // Update portfolio value (add positions value)
    const positions = await prisma.position.findMany({ where: { portfolioId: portfolio.id } });
    let positionsValue = 0;
    for (const pos of positions) {
      positionsValue += pos.currentPrice * pos.quantity;
    }
    totalValue = cash + positionsValue;
    await prisma.portfolio.update({ where: { id: portfolio.id }, data: { cash, totalValue } });

    // Create trade record
    const trade = await prisma.trade.create({
      data: {
        userId,
        orderId: order.id,
        symbol: symbol.toUpperCase(),
        side,
        quantity,
        price: fillPrice,
        tradeType: orderType,
        strike,
        expiration,
        commission: 0.0,
        totalAmount: fillPrice * quantity,
      },
    });

    return res.json({ order, trade, portfolio });
  } catch (error) {
    console.error('Order placement error:', error);
    return res.status(500).json({ message: 'Order placement failed', error: (error as Error).message });
  }
});

// Get user orders
router.get('/orders', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = (req as AuthRequest).user;
    const orders = await prisma.order.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get user trades
router.get('/trades', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = (req as AuthRequest).user;
    const trades = await prisma.trade.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    return res.json(trades);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch trades' });
  }
});

// Get portfolio summary
router.get('/portfolio', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = (req as AuthRequest).user;
    const portfolio = await prisma.portfolio.findUnique({ where: { userId } });
    return res.json(portfolio);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch portfolio' });
  }
});

// Get open positions
router.get('/positions', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = (req as AuthRequest).user;
    const positions = await prisma.position.findMany({ where: { userId } });
    return res.json(positions);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch positions' });
  }
});

export default router; 