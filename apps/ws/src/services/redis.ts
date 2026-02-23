import { createClient, RedisClientType } from 'redis';
import { REDIS_URL } from '@/config/env.config';
const redisPublisher: RedisClientType = createClient({
  url: REDIS_URL,
});

const redisSubscriber: RedisClientType = createClient({
  url: REDIS_URL,
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
