import { PORT } from '@/config/env.config';
import { SocketEvents } from '@workspace/config';
import { UserStatus } from '@workspace/db';
import { WebSocketServer } from 'ws';
import { sendUserStatusUpdate } from './kafka/producer/user-status/producer';

export const createWebSocketServer = async () => {
  const wss = new WebSocketServer({
    port: PORT,
  });

  wss.on('listening', () => {
    console.log('Websocket listening to port', PORT);
  });

  wss.on(SocketEvents.CONNECT, async (ws, request) => {
    console.log('users connected');
    await sendUserStatusUpdate('64664', UserStatus.ONLINE);
  });

  wss.on('error', (err) => {
    console.error('Websocket server error', err);
  });
  return wss;
};
