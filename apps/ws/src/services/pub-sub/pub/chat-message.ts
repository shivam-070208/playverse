import RedisConfig from '@/config/redis.config';
import { PubSubChannels } from '../types/channels';

const redisConfig = new RedisConfig();
const redisClient = redisConfig.getClient();

import type { ChatMessagePayload } from '../types/chat-message-payload';

export async function publishChatMessage(message: ChatMessagePayload): Promise<void> {
  try {
    const serialized = JSON.stringify(message);
    await redisClient.publish(PubSubChannels.CHAT_MESSAGE_RECIEVED, serialized);
  } catch (err) {
    console.error('Failed to publish chat message:', err);
  }
}
