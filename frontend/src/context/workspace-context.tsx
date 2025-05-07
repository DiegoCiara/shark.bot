import { api } from '@/api/api';
import { Workspace } from '@/types/Workspace';
import { AxiosResponse } from 'axios';
import { createContext, useContext, ReactNode } from 'react';

interface WorkspaceContextInterface {
  workspace: Workspace;
  createWorkspace: (data: Workspace) => Promise<AxiosResponse>;
  rectifiedWorkspace: (
    id: string,
    data: Workspace,
  ) => Promise<AxiosResponse>;
  getWorkspace: () => Promise<AxiosResponse>;
  // deleteWorkspace: (id: string) => Promise<AxiosResponse>;
  updateWorkspace: (data: Workspace) => Promise<AxiosResponse>;
}

const WorkspaceContext = createContext<
  WorkspaceContextInterface | undefined
>(undefined);

interface WorkspaceProviderProps {
  children: ReactNode;
}

export const WorkspaceProvider = ({ children }: WorkspaceProviderProps) => {

  const workspace: Workspace = {
    name: '',
  }

  async function getWorkspace() {
    const response = await api.get(`/workspace/`);
    return response;
  }

  async function createWorkspace(data: Workspace) {
    const response = await api.post('/workspace', data);
    return response;
  }

  async function rectifiedWorkspace(id: string, data: Workspace) {
    const response = await api.post(`/workspace/rectified/${id}`, data);
    return response;
  }

  // async function deleteWorkspace(id: string) {
  //   const response = await api.delete(`/workspace/${id}`);
  //   return response;
  // }

  async function updateWorkspace( data: Workspace) {
    const response = await api.put(`/workspace/`, data);
    return response;
  }

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        createWorkspace,
        getWorkspace,
        // deleteWorkspace,
        updateWorkspace,
        rectifiedWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error(
      'useWorkspace must be used within an WorkspaceProvider',
    );
  }
  return context;
};
