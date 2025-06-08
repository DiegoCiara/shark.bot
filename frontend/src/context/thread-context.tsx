// src/contexts/ThreadContext.js
import { api } from '@/api/api';
import { Thread } from '@/types/Thread';
import { AxiosResponse } from 'axios';
import { createContext, useContext, ReactNode } from 'react';
import { useContact } from './contact-context';

interface ThreadContextInterface {
  thread: Thread;
  getThread: (id: string) => Promise<AxiosResponse>;
  getThreads: () => Promise<AxiosResponse>;
}

const ThreadContext = createContext<ThreadContextInterface | undefined>(
  undefined,
);

interface ThreadProviderProps {
  children: ReactNode;
}

export const ThreadProvider = ({ children }: ThreadProviderProps) => {

  const { contact } = useContact()
  const thread = {
    id: '',
    messages: [],
    contact: contact,
    user: undefined,
    responsible: "",
    status: '',
    thread_id: '',
    created_at: '',
    updated_at: '',
    deleted_at: '',
  };

  async function getThread(id: string) {
    const response = await api.get(`/thread/${id}`);
    return response;
  }

  async function getThreads() {
    const response = await api.get(`/thread/`);
    return response;
  }

  return (
    <ThreadContext.Provider
      value={{
        thread,
        getThread,
        getThreads,
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
