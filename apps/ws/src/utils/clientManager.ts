import WebSocket from 'ws';

class ClientManager {
  // userId -> set of sockets (support multiple devices)
  private clients: Map<string, Set<WebSocket>> = new Map();

  addClient(userId: string, socket: WebSocket) {
    let set = this.clients.get(userId);
    if (!set) {
      set = new Set();
      this.clients.set(userId, set);
    }
    set.add(socket);
  }

  removeClientByUser(userId: string) {
    this.clients.delete(userId);
  }

  removeClientBySocket(socket: WebSocket) {
    for (const [userId, set] of this.clients.entries()) {
      if (set.has(socket)) {
        set.delete(socket);
        if (set.size === 0) this.clients.delete(userId);
        return userId;
      }
    }
    return undefined;
  }

  getClients() {
    return this.clients;
  }

  sendMessage(userId: string, data: string | object, senderId?: string) {
    const set = this.clients.get(userId);
    if (!set) return false;
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    for (const socket of set) {
      if (socket.readyState === socket.OPEN) {
        socket.send(payload, (err) => {
          if (err) console.error('Failed to send message to', userId, err);
        });
      }
    }
    return true;
  }

  getClientCount() {
    return this.clients.size;
  }
}

export const clientManager = new ClientManager();
