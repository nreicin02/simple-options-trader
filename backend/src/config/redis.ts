import { createClient, RedisClientType } from 'redis';

import env from './env';

// Redis client configuration
const redisClient: RedisClientType = createClient({
  url: env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
  },
});

// Redis connection management
export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    console.log('✅ Redis connected successfully');
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    throw error; // Re-throw to allow caller to handle
  }
};

export const disconnectRedis = async (): Promise<void> => {
  try {
    await redisClient.disconnect();
    console.log('🔌 Redis disconnected');
  } catch (error) {
    console.error('Error disconnecting Redis:', error);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectRedis();
});

process.on('SIGTERM', async () => {
  await disconnectRedis();
});

export default redisClient; 