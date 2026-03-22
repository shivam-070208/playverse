import { initAdmin } from './admin/init';
import { initConsumer } from './consumer/init';
import { initProducers } from './producer/init';

const initKafka = async () => {
  await initAdmin();
  await initConsumer();
  await initProducers();
};

export { initKafka };
