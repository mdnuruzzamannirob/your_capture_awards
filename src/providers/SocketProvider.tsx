'use client';

import { useAuth } from '@/hooks/useAuth';
import { getSocketBaseUrl } from '@/utils/getSocketBaseUrl';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketContextValue = {
  socket: Socket | null;
  isConnected: boolean;
  isAuthenticated: boolean;
};

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  isAuthenticated: false,
});

export const useSocket = () => useContext(SocketContext);

// Connects a single shared socket as soon as the app loads, so "currently
// online" reflects every visitor browsing the site, not just users in chat.
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const instance = io(getSocketBaseUrl(), {
      transports: ['websocket'],
    });

    socketRef.current = instance;
    setSocket(instance);

    instance.on('connect', () => setIsConnected(true));
    instance.on('disconnect', () => {
      setIsConnected(false);
      setIsAuthenticated(false);
    });

    return () => {
      instance.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, []);

  useEffect(() => {
    const instance = socketRef.current;
    if (!instance || !token) {
      setIsAuthenticated(false);
      return;
    }

    const authenticate = () => {
      instance.emit('authenticate', token, (response: { success?: boolean }) => {
        setIsAuthenticated(!!response?.success);
      });
    };

    if (instance.connected) authenticate();
    instance.on('connect', authenticate);

    return () => {
      instance.off('connect', authenticate);
    };
  }, [token, socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, isAuthenticated }}>
      {children}
    </SocketContext.Provider>
  );
};
