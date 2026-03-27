import { db } from '@workspace/db';
import { kafka } from '../../lib/client';
import { KafkaTopics } from '../../utils/kafka-topics';

const chatMessageConsumer = async () => {
  const consumer = kafka.consumer({ groupId: 'chat-message-group' });
  await consumer.connect();

  await consumer.subscribe({ topic: KafkaTopics.CHAT_MESSAGE, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const key = message.key?.toString();
      const value = message.value?.toString();

      try {
        const chatMessage = JSON.parse(value || '{}');
        let chat = await db.chat.findFirst({
          where: {
            OR: [
              {
                user1Id: chatMessage.from,
                user2Id: chatMessage.to,
              },
              {
                user1Id: chatMessage.to,
                user2Id: chatMessage.from,
              },
            ],
          },
        });

        if (!chat) {
          chat = await db.chat.create({
            data: {
              user1Id: chatMessage.from,
              user2Id: chatMessage.to,
            },
          });
        }

        await db.message.create({
          data: {
            senderId: chatMessage.from as string,
            receiverId: chatMessage.to as string,
            data: { text: chatMessage.text as string },
            chatId: chat.id,
          },
        });
      } catch (error) {
        console.error(`[ChatMessage][${key}] Error processing message:`, error);
      }
    },
  });
};

export { chatMessageConsumer };
