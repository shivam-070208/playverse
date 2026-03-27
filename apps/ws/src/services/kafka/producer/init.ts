import { connectChatMessageProducer } from './chat-message/producer';
import { connectUserStatusProducer } from './user-status/producer';

const initProducers = async () => {
  await connectUserStatusProducer();
  await connectChatMessageProducer();
};

export { initProducers };
