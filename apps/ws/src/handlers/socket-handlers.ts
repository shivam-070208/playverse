import WebSocket from 'ws';

import { SocketEvents } from '@workspace/config';
import { kafkaProducer } from '@/services/kafka';
import { redisPublisher } from '@/services/redis';
import { clientManager } from '@/utils/clientManager';
import { IncomingMessage } from 'node:http';

export function attachSocketHandlers(socket: WebSocket, req: IncomingMessage) {
  let userId: string | undefined;
  try {
    const url = new URL(req.url || '', 'http://localhost');
    userId = url.searchParams.get('userId') || undefined;
  } catch (e) {
    userId = undefined;
  }

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

  socket.on(SocketEvents.CLOSE, async () => {
    const removedUser = clientManager.removeClientBySocket(socket);

    if (removedUser) {
      await kafkaProducer.send({
        topic: 'user-status',
        messages: [
          {
            key: removedUser,
            value: JSON.stringify({
              userId: removedUser,
              status: 'OFFLINE',
              timestamp: Date.now(),
            }),
          },
        ],
      });
      console.log('User disconnected:', removedUser);
    }
  });

  socket.on(SocketEvents.CHAT_MESSAGE_SENT, async (data) => {
    try {
      await redisPublisher.publish('chat-messages', JSON.stringify(data));
    } catch (err) {
      console.error('Redis publish error:', err);
    }
  });

  socket.on('close', () => {
    clientManager.removeClientBySocket(socket);
  });
}

export function attachAuthHeader(headers: string[], req: IncomingMessage) {
  if (!req.headers.authorization) {
    headers.push('HTTP/1.1 401 Unauthorized');
    headers.push('content-type: text/plain');
    headers.push('connection: close');
  }
}
