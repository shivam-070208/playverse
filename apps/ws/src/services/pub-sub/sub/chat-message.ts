import RedisConfig from '@/config/redis.config';
import { PubSubChannels } from '../types/channels';
import { clientManager } from '@/services/wss/utils/client-manager';
import { SocketEvents } from '@workspace/config';

const redisConfig = new RedisConfig();
const redisClient = redisConfig.getClient();

export function subscribeToChatMessages() {
  redisClient.subscribe(PubSubChannels.CHAT_MESSAGE_RECIEVED, (err, count) => {
    if (err) {
      console.error('Failed to subscribe to chat messages:', err);
    } else {
      console.log(`Subscribed to ${PubSubChannels.CHAT_MESSAGE_RECIEVED}, count: ${count}`);
    }
  });

  redisClient.on('message', (channel, message) => {
    if (channel === PubSubChannels.CHAT_MESSAGE_RECIEVED) {
      try {
        const chatMessage = JSON.parse(message);
        const payload = {
          event: SocketEvents.CHAT_MESSAGE_RECIEVED,
          data: {
            from: chatMessage.from,
            to: chatMessage.to,
            text: chatMessage.text,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        };
        clientManager.sendMessage(chatMessage.to, payload, chatMessage.from);
      } catch (parseErr) {
        console.error('Error parsing chat message:', parseErr);
      }
    }
  });
}
