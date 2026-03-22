import { UserStatus } from '@workspace/db';
import { kafka } from '../../lib/client';
import { KafkaTopics } from '../../utils/kafka-topics';

const userStatusProducer = kafka.producer();

const connectUserStatusProducer = async () => {
  await userStatusProducer.connect();
};

const sendUserStatusUpdate = async (userId: string, statusUpdate: UserStatus) => {
  await userStatusProducer.send({
    topic: KafkaTopics.USER_STATUS_UPDATE,
    messages: [
      {
        key: userId,
        value: JSON.stringify({
          status: statusUpdate,
        }),
      },
    ],
  });
  console.log('Sent');
};

export { userStatusProducer, connectUserStatusProducer, sendUserStatusUpdate };
