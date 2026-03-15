import { KAFKA_BROKERS } from '@/config/env.config';
import { Kafka, logLevel } from 'kafkajs';
import { db } from '@workspace/db';

const kafka = new Kafka({
  clientId: 'ws-server',
  brokers: KAFKA_BROKERS,
  logLevel: logLevel.ERROR,
});

const kafkaProducer = kafka.producer();
const kafkaConsumer = kafka.consumer({ groupId: 'ws-chat-consumer' });

type ChatKafkaPayload = {
  from: string;
  to: string;
  text?: string;
  [key: string]: unknown;
};

async function handleChatMessagePersist(payload: ChatKafkaPayload) {
  const from = String(payload.from ?? '');
  const to = String(payload.to ?? '');
  const text = typeof payload.text === 'string' ? payload.text : '';

  if (!from || !to || !text) return;

  let chat = await db.chat.findFirst({
    where: {
      OR: [
        { user1Id: from, user2Id: to },
        { user1Id: to, user2Id: from },
      ],
    },
  });

  if (!chat) {
    chat = await db.chat.create({
      data: {
        user1Id: from,
        user2Id: to,
      },
    });
  }

  await db.message.create({
    data: {
      senderId: from,
      receiverId: to,
      data: { text },
      chatId: chat.id,
    },
  });
}

export async function initializeKafka() {
  try {
    await kafkaProducer.connect();
    console.log('Kafka producer connected');

    await kafkaConsumer.connect();
    console.log('Kafka consumer connected');

    await kafkaConsumer.subscribe({ topic: 'chat-messages', fromBeginning: false });

    await kafkaConsumer.run({
      eachMessage: async ({ message }) => {
        try {
          if (!message.value) return;
          const raw = message.value.toString();
          const payload = JSON.parse(raw) as ChatKafkaPayload;
          await handleChatMessagePersist(payload);
        } catch (error) {
          console.error('Error processing Kafka chat message:', error);
        }
      },
    });
  } catch (error) {
    console.error('Kafka connection / consumer error:', error);
    throw error;
  }
}

export async function disconnectKafka() {
  try {
    await kafkaProducer.disconnect();
    await kafkaConsumer.disconnect();
    console.log('Kafka producer and consumer disconnected');
  } catch (error) {
    console.error('Kafka disconnection error:', error);
  }
}

export { kafkaProducer };
