import { api } from '@/api/api';
import { Deal } from '@/types/Deal';
import { AxiosResponse } from 'axios';
import { createContext, useContext, ReactNode } from 'react';

interface DealContextInterface {
  deal: Deal;
  createDeal: (data: Deal) => Promise<AxiosResponse>;
  getDeals: (filters: Record<string, string>) => Promise<AxiosResponse>;
  getDeal: (id: string) => Promise<AxiosResponse>;
  deleteDeal: (id: string) => Promise<AxiosResponse>;
  updateDeal: (id: string, data: Deal) => Promise<AxiosResponse>;
}

const DealContext = createContext<DealContextInterface | undefined>(undefined);

interface DealProviderProps {
  children: ReactNode;
}

export const DealProvider = ({ children }: DealProviderProps) => {
  const deal: Deal = {
    id: '',
    observation: '',
    status: '',
    contact_id: '',
    contact: undefined,
    pipeline_id: '',
    pipeline: undefined,
    created_at: new Date(),
  };
  
  async function getDeals(filters: Record<string, string>) {
    const queryString = new URLSearchParams(filters).toString();
    const response = await api.get(`/deal?${queryString}`);
    return response;
  }
  async function getDeal(id: string) {
    const response = await api.get(`/deal/${id}`);
    return response;
  }

  async function createDeal(data: Deal) {
    const response = await api.post('/deal', data);
    return response;
  }

  async function deleteDeal(id: string) {
    const response = await api.delete(`/deal/${id}`);
    return response;
  }

  async function updateDeal(id: string, data: Deal) {
    const response = await api.put(`/deal/${id}`, data);
    return response;
  }

  return (
    <DealContext.Provider
      value={{
        deal,
        getDeals,
        createDeal,
        getDeal,
        deleteDeal,
        updateDeal,
      }}
    >
      {children}
    </DealContext.Provider>
  );
};

export const useDeal = () => {
  const context = useContext(DealContext);
  if (!context) {
    throw new Error('useDeal must be used within an DealProvider');
  }
  return context;
};
