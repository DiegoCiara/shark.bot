import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/context/loading-context';
import { useSession } from '@/context/session-context';
import ModalContainer from '..';
import { useEffect, useState } from 'react';
import { Session } from '@/types/Session';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import FormSession from './form/form';

interface CreateSessionModalProps {
  open: boolean;
  close: () => void;
  getData: () => void;
}

export default function CreateSessionModal({
  open,
  close,
  getData,
}: CreateSessionModalProps) {
  const { session, createSession } = useSession();
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Session>(session);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await onLoading();
    try {
      const response = await createSession(data);
      if (response.status === 201) {
        toast.success('Usuário criado com sucesso');
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
    value: string,
    item: string,
  ) => {
    setData({
      ...data,
      [item]: value,
    });
  };

  useEffect(() => {
    setData(session);
  }, [open]);

  return (
    <ModalContainer open={open} close={close}>
      <form
        onSubmit={handleSubmit}
        className="w-[85vw] max-w-[400px] sm:w-full"
      >
        <Card className="border-none shadow-none sm:w-[400px]">
          <CardHeader>
            <CardTitle>Adicionar sessão</CardTitle>
            <CardDescription>
              Conecte seu WhatsApp em uma sessão para começar a usar sua assistente.
            </CardDescription>
          </CardHeader>
          <FormSession data={data} change={handleChangeObject} />
          <CardFooter className="w-full flex justify-end items-center gap-4">
            <Button type="submit">Enviar</Button>
          </CardFooter>
        </Card>
      </form>
    </ModalContainer>
  );
}
