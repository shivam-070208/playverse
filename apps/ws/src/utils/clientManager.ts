import WebSocket from 'ws';

class ClientManager {
  private clients: Set<WebSocket> = new Set();

  addClient(socket: WebSocket) {
    this.clients.add(socket);
  }

  removeClient(socket: WebSocket) {
    this.clients.delete(socket);
  }

  getClients() {
    return this.clients;
  }

  broadcast(message: string) {
    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  getClientCount() {
    return this.clients.size;
  }
}

export const clientManager = new ClientManager();
