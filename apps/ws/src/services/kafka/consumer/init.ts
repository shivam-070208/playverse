import { userStatusConsumer } from './user-status';

const initConsumer = async () => {
  await userStatusConsumer();
};

export { initConsumer };
