import { WebSocketServer } from 'ws';
import { PORT } from '@/config/env.config';
import { attachSocketHandlers, attachAuthHeader } from '@/handlers/socketHandlers';
import { clientManager } from '@/utils/clientManager';
import { SocketEvents } from '@workspace/config';
import { redisPublisher } from '@/services/redis';

export function createWebSocketServer() {
  const wss = new WebSocketServer({
    port: PORT,
  });

  wss.on('headers', (headers, req) => {
    console.log(req.headers);
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
          const data = parsed.data;
          if (data && data.to) {
            clientManager.sendMessage(
              String(data.to),
              JSON.stringify({ event: SocketEvents.CHAT_MESSAGE_SENT, data }),
            );
            await redisPublisher.publish('chat-messages', JSON.stringify(data));
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
