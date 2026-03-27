'use client';
import { WS_URL } from '@/config/enviroment.config';
import { createContext, useContext, useEffect, useState } from 'react';

if (!WS_URL) throw new Error('web socket server url is not provided');

interface ISocketContext {
  socket: WebSocket | null;
  isConnected: boolean;
}
const SocketContext = createContext<ISocketContext | undefined>(undefined);

const useSocketContextValues = (): ISocketContext => {
  const values = useContext(SocketContext);
  if (!values) throw new Error('SocketContext must be used inside SocketProvider');
  return values;
};

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    console.log('Connecting web socket');
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocket(ws);
    };

    return () => {
      ws.close();
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected: socket?.readyState === WebSocket.OPEN }}>
      {children}
    </SocketContext.Provider>
  );
};

export { useSocketContextValues, SocketProvider };
