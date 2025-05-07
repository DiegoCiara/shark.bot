import { api } from '@/api/api';
import { Contact } from '@/types/Contact';
import { AxiosResponse } from 'axios';
import { createContext, useContext, ReactNode } from 'react';

interface ContactContextInterface {
  contact: Contact;
  createContact: (data: Contact) => Promise<AxiosResponse>;
  getContacts: (filters: Record<string, string>) => Promise<AxiosResponse>;
  getContact: (id: string) => Promise<AxiosResponse>;
  deleteContact: (id: string) => Promise<AxiosResponse>;
  updateContact: (id: string, data: Contact) => Promise<AxiosResponse>;
}

const ContactContext = createContext<ContactContextInterface | undefined>(
  undefined,
);

interface ContactProviderProps {
  children: ReactNode;
}

export const ContactProvider = ({ children }: ContactProviderProps) => {
  const contact: Contact = {
    name: '',
    cpf_cnpj: '',
    phone: '',
    email: '',
    profile_id: '',
    profile_name: '',
  };
  async function getContacts(filters: Record<string, string>) {
    const queryString = new URLSearchParams(filters).toString();
    const response = await api.get(`/contact?${queryString}`);
    return response;
  }
  async function getContact(id: string) {
    const response = await api.get(`/contact/${id}`);
    return response;
  }

  async function createContact(data: Contact) {
    const response = await api.post('/contact', data);
    return response;
  }

  async function deleteContact(id: string) {
    const response = await api.delete(`/contact/${id}`);
    return response;
  }

  async function updateContact(id: string, data: Contact) {
    const response = await api.put(`/contact/${id}`, data);
    return response;
  }

  return (
    <ContactContext.Provider
      value={{
        contact,
        getContacts,
        createContact,
        getContact,
        deleteContact,
        updateContact,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContact must be used within an ContactProvider');
  }
  return context;
};
