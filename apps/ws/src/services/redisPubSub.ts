import { SocketEvents } from '@workspace/config';
import { redisSubscriber } from '@/services/redis';
import { clientManager } from '@/utils/clientManager';

export async function initializeRedisPubSub() {
  try {
    await redisSubscriber.subscribe('chat-messages', (message) => {
      try {
        const data = JSON.parse(message);
        const payload = JSON.stringify({
          event: SocketEvents.CHAT_MESSAGE_SENT,
          data,
        });
        clientManager.broadcast(payload);
      } catch (error) {
        console.error('Error processing Redis message:', error);
      }
    });
    console.log('Redis subscriber listening on chat-messages channel');
  } catch (error) {
    console.error('Redis subscription error:', error);
    throw error;
  }
}
