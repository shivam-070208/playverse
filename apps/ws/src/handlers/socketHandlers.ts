import WebSocket from 'ws';
import { Request } from 'http';
import { SocketEvents } from '@workspace/config';
import { kafkaProducer } from '@/services/kafka';
import { redisPublisher } from '@/services/redis';
import { clientManager } from '@/utils/clientManager';

export function attachSocketHandlers(socket: WebSocket, req: Request) {
  const userId = req.url?.split('?userId=')[1]; // Simple parse for illustration

  // On connection, notify Kafka to update user status to ONLINE
  if (userId) {
    kafkaProducer
      .send({
        topic: 'user-status',
        messages: [
          {
            key: userId,
            value: JSON.stringify({
              userId,
              status: 'ONLINE',
              timestamp: Date.now(),
            }),
          },
        ],
      })
      .catch(console.error);
  }

  // Handle socket close event
  socket.on(SocketEvents.CLOSE, async () => {
    clientManager.removeClient(socket);

    // On disconnect, notify Kafka to update user status to OFFLINE
    if (userId) {
      await kafkaProducer.send({
        topic: 'user-status',
        messages: [
          {
            key: userId,
            value: JSON.stringify({
              userId,
              status: 'OFFLINE',
              timestamp: Date.now(),
            }),
          },
        ],
      });
    }
    console.log('User disconnected:', userId);
  });

  // Handle chat message events
  socket.on(SocketEvents.CHAT_MESSAGE_SENT, async (data) => {
    try {
      await redisPublisher.publish('chat-messages', JSON.stringify(data));
    } catch (err) {
      console.error('Redis publish error:', err);
    }
  });

  // Handle native close event (backup)
  socket.on('close', () => {
    clientManager.removeClient(socket);
  });
}

export function attachAuthHeader(headers: string[], req: Request) {
  if (!req.headers['authorization']) {
    headers.push('HTTP/1.1 401 Unauthorized');
    headers.push('content-type: text/plain');
    headers.push('connection: close');
  }
}
