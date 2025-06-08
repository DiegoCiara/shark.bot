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
import { useThread } from '@/context/thread-context';
import { useLoading } from '@/context/loading-context';
import ModalContainer from '..';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';

interface DeleteThreadModalProps {
  id: string;
  open: boolean;
  close: () => void;
  getData: () => void;
}

interface DeleteThread {
  id: string;
}

export default function DeleteThreadModal({
  open,
  close,
  id,
  getData,
}: DeleteThreadModalProps) {
  const { thread, getThread, closeThread } = useThread();
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<DeleteThread>(thread);


  async function fetchThread() {
    await onLoading();
    try {
      const { data } = await getThread(id);
      setData(data.thread);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        return toast.error(
          error?.response?.data?.message ||
            'Não foi possível encontrar o usuário, tente novamente.',
        );
      }
    } finally {
      await offLoading();
    }
  }

  useEffect(() => {
    fetchThread();
  }, []);

  useEffect(() => {
    setData(thread);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onLoading();
    try {
      const response = await closeThread(id);
      console.log(response?.status, 'status');
      console.log(response.data);
      if (response.status === 204) {
        toast.success('Sessão removida com sucesso.');
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
                Deseja encerrar esse atendimento?<br></br><br></br>ID: {data.id}
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
