import { WebSocketServer } from 'ws';
import { PORT } from '@/config/env.config';
import { attachSocketHandlers, attachAuthHeader } from '@/handlers/socket-handlers';
import { clientManager } from '@/utils/clientManager';
import { SocketEvents } from '@workspace/config';
import { redisPublisher } from '@/services/redis';
import { kafkaProducer } from '@/services/kafka';

export function createWebSocketServer() {
  const wss = new WebSocketServer({
    port: PORT,
  });

  wss.on('headers', (headers, req) => {
    attachAuthHeader(headers, req);
  });

  wss.on('connection', (socket, req) => {
    console.log(`socket client connected `);
    let userId: string | undefined;
    try {
      userId = req.headers['x-user-id'] as string | undefined;
    } catch (e) {
      userId = undefined;
    }

    if (userId) clientManager.addClient(userId, socket);
    attachSocketHandlers(socket, req);

    socket.on('message', async (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.event === SocketEvents.CHAT_MESSAGE_SENT) {
          const payload = parsed.data;
          if (payload && payload.to && payload.from) {
            clientManager.sendMessage(
              String(payload.to),
              JSON.stringify({ event: SocketEvents.CHAT_MESSAGE_SENT, data: payload }),
            );

            await redisPublisher.publish('chat-messages', JSON.stringify(payload));

            try {
              await kafkaProducer.send({
                topic: 'chat-messages',
                messages: [
                  {
                    key: String(payload.to),
                    value: JSON.stringify(payload),
                  },
                ],
              });
            } catch (kafkaError) {
              console.error('Kafka publish error (chat-messages):', kafkaError);
            }
          }
        }
      } catch (error) {
        console.error('Error handling incoming message:', error);
      }
    });

    socket.on('close', () => {
      clientManager.removeClientBySocket(socket);
    });
  });

  console.log(`WebSocket server listening on port ${PORT}`);

  return wss;
}
