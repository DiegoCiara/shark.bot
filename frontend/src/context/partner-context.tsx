import { api } from '@/api/api';
import { Partner } from '@/types/Partner';
import { AxiosResponse } from 'axios';
import { createContext, useContext, ReactNode } from 'react';

interface PartnerContextInterface {
  partner: Partner;
  createPartner: (data: Partner) => Promise<AxiosResponse>;
  getPartners: () => Promise<AxiosResponse>;
  getPartner: (id: string) => Promise<AxiosResponse>;
  deletePartner: (id: string) => Promise<AxiosResponse>;
  updatePartner: (id: string, data: Partner) => Promise<AxiosResponse>;
}

const PartnerContext = createContext<
  PartnerContextInterface | undefined
>(undefined);

interface PartnerProviderProps {
  children: ReactNode;
}

export const PartnerProvider = ({ children }: PartnerProviderProps) => {

  const partner: Partner = {
    name: '',
    description: ''
  }

  async function getPartners() {
    const response = await api.get('/partner');
    return response;
  }

  async function getPartner(id: string) {
    const response = await api.get(`/partner/${id}`);
    return response;
  }

  async function createPartner(data: Partner) {
    const response = await api.post('/partner', data);
    return response;
  }

  async function deletePartner(id: string) {
    const response = await api.delete(`/partner/${id}`);
    return response;
  }

  async function updatePartner(id: string, data: Partner) {
    const response = await api.put(`/partner/${id}`, data);
    return response;
  }

  return (
    <PartnerContext.Provider
      value={{
        partner,
        getPartners,
        createPartner,
        getPartner,
        deletePartner,
        updatePartner,
      }}
    >
      {children}
    </PartnerContext.Provider>
  );
};

export const usePartner = () => {
  const context = useContext(PartnerContext);
  if (!context) {
    throw new Error(
      'usePartner must be used within an PartnerProvider',
    );
  }
  return context;
};
