import { WebSocketServer } from 'ws';
import { PORT } from '@/config/env.config';
import { attachSocketHandlers, attachAuthHeader } from '@/handlers/socketHandlers';
import { clientManager } from '@/utils/clientManager';
import { SocketEvents } from '@workspace/config';
import { redisPublisher } from '@/services/redis'; // assumes redisPublisher is exported from redis service

export function createWebSocketServer() {
  const wss = new WebSocketServer({
    port: PORT,
  });

  // Attach headers middleware
  wss.on('headers', (headers, req) => {
    attachAuthHeader(headers, req);
  });

  wss.on('connection', (socket, req) => {
    clientManager.addClient(socket);
    attachSocketHandlers(socket, req);

    socket.on('message', async (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.event === SocketEvents.CHAT_MESSAGE_SENT) {
          const payload = JSON.stringify({
            event: SocketEvents.CHAT_MESSAGE_SENT,
            data: parsed.data,
          });
          clientManager.broadcast(payload);

          await redisPublisher.publish('chat-messages', JSON.stringify(parsed.data));
        }
      } catch (error) {
        console.error('Error handling incoming message:', error);
      }
    });

    socket.on('close', () => {
      clientManager.removeClient(socket);
    });
  });

  console.log(`WebSocket server listening on port ${PORT}`);

  return wss;
}
