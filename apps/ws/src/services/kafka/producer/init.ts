import { connectUserStatusProducer } from './user-status/producer';

const initProducers = async () => {
  await connectUserStatusProducer();
};

export { initProducers };
