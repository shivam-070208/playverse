export enum SocketEvents {
  // Connection lifecycle
  CONNECT = 'connection',
  DISCONNECT = 'disconnect',
  AUTH_ERROR = 'auth_error',
  CLOSE = 'close',

  // Lobby / room management
  JOIN_LOBBY = 'join_lobby',
  LEAVE_LOBBY = 'leave_lobby',
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',

  // Chat messaging
  CHAT_MESSAGE_SENT = 'chat:message-sent',
  CHAT_MESSAGE_RECIEVED = 'chat:message-received',
  CHAT_MESSAGE_ACK = 'chat:message-acknowledge',

  // Presence & typing
  TYPING_START = 'typing_start',
  TYPING_STOP = 'typing_stop',
  PRESENCE_UPDATE = 'presence_update',

  // Health
  PING = 'ping',
  PONG = 'pong',

  // Generic
  ERROR = 'error',
}

export default SocketEvents;
