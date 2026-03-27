import { kafka } from '../../lib/client';
import { KafkaTopics } from '../../utils/kafka-topics';

type ChatMessagePayload = {
  from: string;
  to: string;
  text: string;
};

const chatMessageProducer = kafka.producer();

const connectChatMessageProducer = async () => {
  await chatMessageProducer.connect();
};

const sendChatMessage = async (payload: ChatMessagePayload) => {
  await chatMessageProducer.send({
    topic: KafkaTopics.CHAT_MESSAGE,
    messages: [
      {
        key: payload.to,
        value: JSON.stringify(payload),
      },
    ],
  });
};

export { chatMessageProducer, connectChatMessageProducer, sendChatMessage };
