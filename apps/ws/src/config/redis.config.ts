import Redis, { RedisOptions } from 'ioredis';

class RedisConfig {
  private client: Redis;

  constructor(options?: RedisOptions) {
    this.client = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      ...options,
    });

    this.client.on('connect', () => {
      console.log('Redis connected');
    });

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  public getClient(): Redis {
    return this.client;
  }
}

export default RedisConfig;
