import socket from '@/api/socket';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import { Socket } from 'socket.io-client';

interface SocketContextInterface {
  socket: Socket
}

const SocketContext = createContext<SocketContextInterface | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  useEffect(() => {
    // Opcional: adicione código para responder a eventos de conexão/desconexão
    const handleConnect = () => console.warn('Conectado ao servidor de sockets');
    const handleDisconnect = () => console.warn('Desconectado do servidor de sockets');

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      // Limpeza ao desmontar
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error('useSocket deve ser usado dentro de um SocketProvider');
  }

  return context;
};