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

interface CreateProfileModalProps {
  open: boolean;
  close: () => void;
  getData: () => void;
}

export default function CreateProfileModal({
  open,
  close,
  getData,
}: CreateProfileModalProps) {
  const { profile, createProfile } = useProfile();
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Profile>(profile);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await onLoading();
    try {
      const response = await createProfile(data);
      if (response.status === 204) {
        toast.success('Declaração atualizada com sucesso');
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

  const handleChangeObject = (
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> ,
    item: keyof Profile,
  ) => {
    setData({
      ...data,
      [item]: event.target.value
    });
  };

  useEffect(() => {
    setData(profile);
  }, [open]);

  return (
    <ModalContainer open={open} close={close}>
      <form
        onSubmit={handleSubmit}
        className="w-[85vw] max-w-[400px] sm:w-full"
      >
        <Card className="border-none shadow-none sm:w-[400px]">
          <CardHeader>
            <CardTitle>Adicionar perfil</CardTitle>
            <CardDescription>
              Adicione um perfil preenchendo os dados abaixo
            </CardDescription>
          </CardHeader>
          <FormProfile data={data} change={handleChangeObject}/>
          <CardFooter className="w-full flex justify-end items-center gap-4">
            <Button type="submit">Enviar</Button>
          </CardFooter>
        </Card>
      </form>
    </ModalContainer>
  );
}
