import 'dotenv/config';

import { initializeRedis } from '@/services/redis';
import { initializeKafka } from '@/services/kafka';
import { createWebSocketServer } from '@/services/websocket';
import { initializeRedisPubSub } from '@/services/redisPubSub';

async function startServer() {
  try {
    await initializeRedis();
    await initializeKafka();

    createWebSocketServer();

    await initializeRedisPubSub();

    console.log('Server initialized successfully');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
