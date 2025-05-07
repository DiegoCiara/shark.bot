import { api } from '@/api/api';
import { Profile } from '@/types/Profile';
import { AxiosResponse } from 'axios';
import { createContext, useContext, ReactNode } from 'react';

interface ProfileContextInterface {
  profile: Profile;
  createProfile: (data: Profile) => Promise<AxiosResponse>;
  rectifiedProfile: (
    id: string,
    data: Profile,
  ) => Promise<AxiosResponse>;
  getProfiles: () => Promise<AxiosResponse>;
  getProfile: (id: string) => Promise<AxiosResponse>;
  deleteProfile: (id: string) => Promise<AxiosResponse>;
  updateProfile: (id: string, data: Profile) => Promise<AxiosResponse>;
}

const ProfileContext = createContext<
  ProfileContextInterface | undefined
>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider = ({ children }: ProfileProviderProps) => {

  const profile: Profile = {
    name: '',
    description: ''
  }

  async function getProfiles() {
    const response = await api.get('/profile');
    return response;
  }

  async function getProfile(id: string) {
    const response = await api.get(`/profile/${id}`);
    return response;
  }

  async function createProfile(data: Profile) {
    const response = await api.post('/profile', data);
    return response;
  }

  async function rectifiedProfile(id: string, data: Profile) {
    const response = await api.post(`/profile/rectified/${id}`, data);
    return response;
  }

  async function deleteProfile(id: string) {
    const response = await api.delete(`/profile/${id}`);
    return response;
  }

  async function updateProfile(id: string, data: Profile) {
    const response = await api.put(`/profile/${id}`, data);
    return response;
  }

  return (
    <ProfileContext.Provider
      value={{
        profile,
        getProfiles,
        createProfile,
        getProfile,
        deleteProfile,
        updateProfile,
        rectifiedProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error(
      'useProfile must be used within an ProfileProvider',
    );
  }
  return context;
};
