import { PORT } from '@/config/env.config';
import { SocketEvents } from '@workspace/config';
import { UserStatus } from '@workspace/db';
import { WebSocketServer } from 'ws';
import { sendUserStatusUpdate } from '@/services/kafka/producer/user-status/producer';
import { isAuthorize } from './middleware/auth';
import { IncomingMessage } from 'node:http';
import { publishChatMessage } from '../pub-sub/pub/chat-message';
import { clientManager } from './utils/client-manager';
import { sendChatMessage } from '../kafka/producer/chat-message/producer';

export const createWebSocketServer = async () => {
  const wss = new WebSocketServer({
    port: PORT,
  });

  wss.on('listening', () => {
    console.log('Websocket listening to port', PORT);
  });
  wss.on(SocketEvents.CONNECT, async (ws, _req: IncomingMessage) => {
    const req = await isAuthorize(_req);
    if (!req) {
      ws.close(1008, 'Unauthorized');
      return;
    }

    const userId = req.session.user.id;
    await sendUserStatusUpdate(userId, UserStatus.ONLINE);
    clientManager.addClient(userId, ws);

    ws.on('message', async (data) => {
      let parsed;
      try {
        parsed = JSON.parse(data.toString());
      } catch {
        return;
      }

      if (parsed?.event === SocketEvents.CHAT_MESSAGE_SENT) {
        const message_payload = {
          from: userId,
          to: parsed.data.to,
          text: parsed.data.text,
        };
        await publishChatMessage(message_payload);
        await sendChatMessage(message_payload);
      }
    });

    ws.on(SocketEvents.DISCONNECT, async () => {
      await sendUserStatusUpdate(userId, UserStatus.OFFLINE);
      clientManager.removeClientByUser(userId);
    });
  });

  wss.on('error', (err) => {
    console.error('Websocket server error', err);
  });
  return wss;
};
