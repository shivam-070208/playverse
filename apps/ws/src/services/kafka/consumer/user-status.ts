import { kafka } from '../lib/client';
import { KafkaTopics } from '../utils/kafka-topics';

const userStatusConsumer = async () => {
  const consumer = kafka.consumer({ groupId: 'user-status-group' });
  await consumer.connect();

  await consumer.subscribe({ topic: KafkaTopics.USER_STATUS_UPDATE, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const key = message.key?.toString();
      const value = message.value?.toString();

      try {
        const statusUpdate = JSON.parse(value || '{}');
        console.log(`[UserStatus][${key}]:`, statusUpdate);
      } catch (err) {
        console.error(`[UserStatus][${key}] Error parsing message:`, err);
      }
    },
  });
};

export { userStatusConsumer };
