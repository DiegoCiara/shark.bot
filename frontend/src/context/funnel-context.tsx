import { api } from '@/api/api';
import { Funnel } from '@/types/Funnel';
import { Pipeline } from '@/types/Pipeline';
import { AxiosResponse } from 'axios';
import { createContext, useContext, ReactNode } from 'react';

interface FunnelContextInterface {
  funnel: Funnel;
  pipeline: Pipeline;
  createPipeline: (id: string, data: Pipeline) => Promise<AxiosResponse>;
  createFunnel: (data: Funnel) => Promise<AxiosResponse>;
  getFunnels: () => Promise<AxiosResponse>;
  getFunnel: (id: string) => Promise<AxiosResponse>;
  getPipeline: (id: string) => Promise<AxiosResponse>;
  getPipelines: (funnelId: string) => Promise<AxiosResponse>;
  deleteFunnel: (id: string) => Promise<AxiosResponse>;
  deletePipeline: (id: string) => Promise<AxiosResponse>;
  updateFunnel: (id: string, data: Funnel) => Promise<AxiosResponse>;
  updatePipeline: (id: string, data: Pipeline) => Promise<AxiosResponse>;
}

const FunnelContext = createContext<
  FunnelContextInterface | undefined
>(undefined);

interface FunnelProviderProps {
  children: ReactNode;
}

export const FunnelProvider = ({ children }: FunnelProviderProps) => {

  const funnel: Funnel = {
    name: '',
    description: '',
    deal_status: [],
    pipelines: [],
  }
  const pipeline: Pipeline = {
    name: '',
    description: '',
    position: 0
  }

  async function getFunnels() {
    const response = await api.get('/funnel');
    return response;
  }

  async function getFunnel(id: string) {
    const response = await api.get(`/funnel/${id}`);
    return response;
  }

  async function getPipeline(id: string) {
    const response = await api.get(`/funnel/pipeline/${id}`);
    return response;
  }

  async function getPipelines(funnelId: string) {
    const response = await api.get(`/funnel/pipelines/${funnelId}`);
    return response;
  }

  async function createFunnel(data: Funnel) {
    const response = await api.post('/funnel', data);
    return response;
  }

  async function createPipeline(id: string, data: Pipeline) {
    const response = await api.post(`/funnel/pipeline/${id}`, data);
    return response;
  }

  async function deleteFunnel(id: string) {
    const response = await api.delete(`/funnel/${id}`);
    return response;
  }

  async function deletePipeline(id: string) {
    const response = await api.delete(`/funnel/pipeline/${id}`);
    return response;
  }

  async function updateFunnel(id: string, data: Funnel) {
    const response = await api.put(`/funnel/${id}`, data);
    return response;
  }
  async function updatePipeline(id: string, data: Pipeline) {
    const response = await api.put(`/funnel/pipeline/${id}`, data);
    return response;
  }

  return (
    <FunnelContext.Provider
      value={{
        funnel,
        pipeline,
        getFunnels,
        getPipeline,
        createFunnel,
        createPipeline,
        getFunnel,
        deleteFunnel,
        deletePipeline,
        updatePipeline,
        updateFunnel,
        getPipelines,
      }}
    >
      {children}
    </FunnelContext.Provider>
  );
};

export const useFunnel = () => {
  const context = useContext(FunnelContext);
  if (!context) {
    throw new Error(
      'useFunnel must be used within an FunnelProvider',
    );
  }
  return context;
};
