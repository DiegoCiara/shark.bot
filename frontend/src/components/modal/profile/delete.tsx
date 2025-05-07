import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useProfile } from '@/context/profile-context';
import { useLoading } from '@/context/loading-context';
import ModalContainer from '..';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';

interface DeleteProfileModalProps {
  id: string;
  open: boolean;
  close: () => void;
  getData: () => void;
}

interface DeleteProfile {
  name: string;
}

export default function DeleteProfileModal({
  open,
  close,
  id,
  getData,
}: DeleteProfileModalProps) {
  const { profile, getProfile, deleteProfile } = useProfile();
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<DeleteProfile>(profile);


  async function fetchProfile() {
    await onLoading();
    try {
      const { data } = await getProfile(id);
      setData(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        return toast.error(
          error?.response?.data?.message ||
            'Não foi possível encontrar a perfil, tente novamente.',
        );
      }
    } finally {
      await offLoading();
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    setData(profile);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onLoading();
    try {
      const response = await deleteProfile(id);
      console.log(response?.status, 'status');
      console.log(response.data);
      if (response.status === 204) {
        toast.success('Declaração removida com sucesso.');
        await getData();
        await close();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        return toast.error(
          error?.response?.data?.message || 'Algo deu errado, tente novamente.',
        );
      }
      console.log(error);
    } finally {
      await offLoading();
    }
  };

  return (
    <div>
      <ModalContainer open={open} close={close}>
        <form className="w-[400px]" onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-red-600">Atenção</CardTitle>
              <CardDescription>
                Você está removendo uma perfil do ano de {data.name}, ao
                confirmar, esta perfil não ficará mais disponível.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <strong>Deseja prosseguir?</strong>
            </CardContent>
            <CardFooter className="gap-10">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => close()}
              >
                Cancelar
              </Button>
              <Button className="w-full" variant="destructive" type="submit">
                Confirmar
              </Button>
            </CardFooter>
          </Card>
        </form>
      </ModalContainer>
    </div>
  );
}
