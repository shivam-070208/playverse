import { chatMessageConsumer } from './chat-message/consumer';
import { userStatusConsumer } from './user-status/consumer';

const initConsumer = async () => {
  await userStatusConsumer();
  await chatMessageConsumer();
};

export { initConsumer };
