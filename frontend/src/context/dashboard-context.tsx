// src/contexts/DashboardContext.js
import { Dashboard } from '@/types/Dashboard';
import { api } from '@/api/api';
import { AxiosResponse } from 'axios';
import { createContext, useContext, ReactNode } from 'react';

interface DashboardContextInterface {
  dashboard: Dashboard;
  updateDashboard: (data: Dashboard) => Promise<AxiosResponse>;
  createDashboard: (data: Dashboard) => Promise<AxiosResponse>;
  getDashboard: () => Promise<AxiosResponse>;
  deleteDashboard: (id: string) => Promise<AxiosResponse>;
  getDashboards: () => Promise<AxiosResponse>;
  getAccount: () => Promise<AxiosResponse>;
}

const DashboardContext = createContext<DashboardContextInterface | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider = ({ children }: DashboardProviderProps) => {

  const dashboard = {
    name: '',
    role: '',
    email: '',
  }

  async function getDashboard() {
    const response = await api.get(`/dashboard/`);
    return response;
  }

  async function getDashboards() {
    const response = await api.get(`/dashboard/`);
    return response;
  }

  async function getAccount() {
    const response = await api.get(`/dashboard/account/`);
    return response;
  }

  async function createDashboard(data: Dashboard) {
    const response = await api.post('/dashboard', data);
    return response;
  }

  async function updateDashboard(data: Dashboard) {
    const response = await api.put('/dashboard/', data);
    return response;
  }

  async function deleteDashboard(id: string) {
    const response = await api.delete(`/dashboard/${id}`);
    return response;
  }

  return (
    <DashboardContext.Provider value={{ dashboard, createDashboard, getDashboard, updateDashboard, deleteDashboard, getDashboards, getAccount}}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within an DashboardProvider');
  }
  return context;
};
