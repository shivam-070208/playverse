import { kafka } from '../lib/client';
import { KafkaTopics } from '../utils/kafka-topics';

const initAdmin = async () => {
  const admin = kafka.admin();
  await admin.connect();

  const _topics = [
    {
      topic: KafkaTopics.CHAT_MESSAGE,
      numPartitions: 1,
      replicationFactor: 1,
    },
    {
      topic: KafkaTopics.USER_STATUS_UPDATE,
      numPartitions: 1,
      replicationFactor: 1,
    },
  ];

  const existingTopics = await admin.listTopics();

  for (const _topic of _topics) {
    if (!existingTopics.includes(_topic.topic)) {
      await admin.createTopics({
        topics: [_topic],
      });
      console.log(`Topic "${_topic.topic}" created`);
    } else {
      console.log(`Topic "${_topic.topic}" already exists`);
    }
  }
  console.log('admin initialized');
  await admin.disconnect();
};

export { initAdmin };
