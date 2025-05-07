import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/context/loading-context';
import { useProfile } from '@/context/profile-context';
import ModalContainer from '..';
import { useEffect, useState } from 'react';
import { Profile } from '@/types/Profile';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import FormProfile from './form/form';

interface UpdateProfileModalProps {
  id: string;
  open: boolean;
  close: () => void;
  getData: () => void;
}

export default function UpdateProfileModal({
  id,
  open,
  close,
  getData,
}: UpdateProfileModalProps) {
  const { profile, getProfile, updateProfile } = useProfile();
  const {  onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Profile>(profile);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await onLoading();
    try {
      const response = await updateProfile(id, data);
      if (response.status === 204) {
        toast.success('Perfil atualizado com sucesso');
        await getData();
        await close();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        return toast.error(
          error.response?.data?.message || 'Algo deu errado, tente novamente.',
        );
      }
    } finally {
      await offLoading();
    }
  };

  async function fetchProfiles() {
    await onLoading();
    try {
      const { data } = await getProfile(id);
      setData(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        return toast.error(
          error.response?.data?.message || 'Algo deu errado, tente novamente.',
        );
      }
    } finally {
      await offLoading();
    }
  }

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    setData(profile);
  }, [open]);

  const handleChangeObject = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    item: keyof Profile,
  ) => {
    setData({
      ...data,
      [item]: event.target.value,
    });
  };

  return (
    <ModalContainer open={open} close={close}>
      <form
        onSubmit={handleSubmit}
        className="w-[85vw] max-w-[400px] sm:w-full"
      >
        <Card className="border-none shadow-none sm:w-[400px]">
          <CardHeader>
            <CardTitle>Atualizar perfil</CardTitle>
            <CardDescription>
              Atualize os dados do perfil abaixo
            </CardDescription>
          </CardHeader>
          <FormProfile data={data} change={handleChangeObject} />
          <CardFooter className="w-full flex justify-end items-center gap-4">
            <Button type="submit">Enviar</Button>
          </CardFooter>
        </Card>
      </form>
    </ModalContainer>
  );
}
