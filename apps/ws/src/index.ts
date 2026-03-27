import 'dotenv/config';
import { initKafka } from '@/services/kafka/init';
import { createWebSocketServer } from '@/services/wss/server';
import { initPubSub } from './services/pub-sub/init';

async function startServer() {
  try {
    await initKafka();
    initPubSub();
    createWebSocketServer();

    console.log('Server initialized successfully');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
