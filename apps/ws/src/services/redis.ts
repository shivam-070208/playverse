import { createClient, RedisClientType } from 'redis';

const redisPublisher: RedisClientType = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

const redisSubscriber: RedisClientType = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisPublisher.on('error', (err) => {
  console.error('Redis Publisher Error:', err);
});

redisSubscriber.on('error', (err) => {
  console.error('Redis Subscriber Error:', err);
});

export async function initializeRedis() {
  try {
    await redisPublisher.connect();
    await redisSubscriber.connect();
    console.log('Redis clients connected');
  } catch (error) {
    console.error('Redis connection error:', error);
    throw error;
  }
}

export { redisPublisher, redisSubscriber };
