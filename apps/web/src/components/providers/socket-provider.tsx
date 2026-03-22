'use client';
import { WS_URL } from '@/config/enviroment.config';
import { authClient } from '@/lib/auth-client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

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
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const encodedWS_URL = useMemo(() => {
    if (!userId) return null;
    return `${WS_URL}?userId=${encodeURIComponent(userId)}`;
  }, [userId]);
  useEffect(() => {
    if (!encodedWS_URL) return;
    console.log('Connecting web socket');
    const ws = new WebSocket(encodedWS_URL);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocket(ws);
    };

    return () => {
      ws.close();
      setSocket(null);
    };
  }, [encodedWS_URL]);

  return (
    <SocketContext.Provider value={{ socket, isConnected: socket?.readyState === WebSocket.OPEN }}>
      {children}
    </SocketContext.Provider>
  );
};

export { useSocketContextValues, SocketProvider };
