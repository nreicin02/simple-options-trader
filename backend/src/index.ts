import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import logger from './config/logger';
import router from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'SimpliOptions backend is healthy' });
});

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SimpliOptions API',
    version: '1.0.0',
    description: 'API documentation for SimpliOptions backend',
  },
  servers: [
    { url: '/api' }
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', router);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack || err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server if not in test mode
if (process.env['NODE_ENV'] !== 'test') {
  const port = process.env['PORT'] || 4000;
  (async () => {
    try {
      await connectDatabase();
    } catch (error) {
      logger.warn('Database connection failed, continuing without database...');
    }
    
    try {
      await connectRedis();
    } catch (error) {
      logger.warn('Redis connection failed, continuing without cache...');
    }
    
    app.listen(port, () => {
      logger.info(`🚀 SimpliOptions backend running on port ${port}`);
      logger.info(`📚 API Documentation available at http://localhost:${port}/api/docs`);
    });
  })();
}

export default app; 