import { SocketEvents } from '@workspace/config';
import { redisSubscriber } from '@/services/redis';
import { clientManager } from '@/utils/clientManager';

export async function initializeRedisPubSub() {
  try {
    await redisSubscriber.subscribe('chat-messages', (message) => {
      try {
        const data = JSON.parse(message); // expected { to, text, ... }
        if (data && data.to) {
          clientManager.sendMessage(
            String(data.to),
            JSON.stringify({ event: SocketEvents.CHAT_MESSAGE_SENT, data }),
          );
        }
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
