// src/contexts/ThreadContext.js
import { api } from '@/api/api';
import { Thread } from '@/types/Thread';
import { AxiosResponse } from 'axios';
import { createContext, useContext, ReactNode } from 'react';
import { useContact } from './contact-context';
import { SendMessage } from '@/types/Message';

interface ThreadContextInterface {
  thread: Thread;
  messageSend: SendMessage
  getThread: (id: string) => Promise<AxiosResponse>;
  getThreads: () => Promise<AxiosResponse>;
  send: (id: string, body: SendMessage) => Promise<AxiosResponse>;
  assumeThread: (id: string) => Promise<AxiosResponse>;
  closeThread: (id: string) => Promise<AxiosResponse>;
}

const ThreadContext = createContext<ThreadContextInterface | undefined>(
  undefined,
);

interface ThreadProviderProps {
  children: ReactNode;
}

export const ThreadProvider = ({ children }: ThreadProviderProps) => {
  const { contact } = useContact();

  const messageSend = {
    content: '',
    media: '',
  };

  const thread = {
    id: '',
    messages: [],
    contact: contact,
    user: undefined,
    responsible: '',
    status: '',
    thread_id: '',
    created_at: '',
    updated_at: '',
    deleted_at: '',
  };

  async function getThread(id: string) {
    const response = await api.get(`/service/${id}`);
    return response;
  }

  async function getThreads() {
    const response = await api.get(`/service/`);
    return response;
  }

  async function send(id: string, body: SendMessage) {
    const response = await api.post(`/service/send/${id}`, body);
    return response;
  }

  async function assumeThread(id: string) {
    const response = await api.put(`/service/assume/${id}`);
    return response;
  }

  async function closeThread(id: string) {
    const response = await api.put(`/service/close-thread/${id}`);
    return response;
  }

  return (
    <ThreadContext.Provider
      value={{
        messageSend,
        thread,
        getThread,
        getThreads,
        send,
        assumeThread,
        closeThread,
      }}
    >
      {children}
    </ThreadContext.Provider>
  );
};

export const useThread = () => {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error('useThread must be used within an ThreadProvider');
  }
  return context;
};
