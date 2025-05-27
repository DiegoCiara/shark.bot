// src/contexts/SessionContext.js
import { api } from '@/api/api';
import { Session } from '@/types/Session';
import { AxiosResponse } from 'axios';
import { createContext, useContext, ReactNode } from 'react';

interface SessionContextInterface {
  session: Session;
  updateSession: (data: Session) => Promise<AxiosResponse>;
  createSession: (data: Session) => Promise<AxiosResponse>;
  getSession: (id: string) => Promise<AxiosResponse>;
  deleteSession: (id: string) => Promise<AxiosResponse>;
  getSessions: () => Promise<AxiosResponse>;
  getAccount: () => Promise<AxiosResponse>;
  connectWhatsApp: (id: string) => Promise<AxiosResponse>;
}

const SessionContext = createContext<SessionContextInterface | undefined>(
  undefined,
);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const session = {
    assistant_id: '',
    name: '',
    status: '',
    stop_trigger: '',
    close_trigger: '',
    waiting_time: 0,
  };

  async function getSession(id: string) {
    const response = await api.get(`/session/${id}`);
    return response;
  }

  async function getSessions() {
    const response = await api.get(`/session/`);
    return response;
  }

  async function getAccount() {
    const response = await api.get(`/session/account/`);
    return response;
  }

  async function createSession(data: Session) {
    const response = await api.post('/session', data);
    return response;
  }

  async function connectWhatsApp(id: string) {
    const response = await api.post(`/session/connect/${id}`);
    return response;
  }

  async function updateSession(data: Session) {
    const response = await api.put('/session/', data);
    return response;
  }

  async function deleteSession(id: string) {
    const response = await api.delete(`/session/${id}`);
    return response;
  }

  return (
    <SessionContext.Provider
      value={{
        session,
        createSession,
        getSession,
        updateSession,
        deleteSession,
        getSessions,
        connectWhatsApp,
        getAccount,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within an SessionProvider');
  }
  return context;
};
