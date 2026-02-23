'use client';
import { WS_URL } from '@/config/enviroment.config';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface ISocketContext {}
const SocketContext = createContext<ISocketContext | undefined>(undefined);
const useSocketContextValues = (): ISocketContext => {
  const values = useContext(SocketContext);
  if (!values) throw new Error('Socket COntext must be use inside socket context provider');
  return values;
};

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    let _socket: WebSocket | null = null;
    if (!socket) {
      _socket = new WebSocket(WS_URL);
      _socket.onopen = () => {
        console.log('WebSocket connected');
      };
      _socket.onerror = () => {
        console.log('WebSocket connection failed');
      };
      setSocket(_socket);
    }
    return () => {
      if (_socket) {
        _socket.close();
      }
    };
  }, [socket]);

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

export { useSocketContextValues, SocketProvider };
