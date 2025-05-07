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
import { useFunnel } from '@/context/funnel-context';
import { useLoading } from '@/context/loading-context';
import ModalContainer from '..';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';

interface DeleteFunnelModalProps {
  id: string;
  open: boolean;
  close: () => void;
  getData: () => void;
}

interface DeleteFunnel {
  name: string;
}

export default function DeleteFunnelModal({
  open,
  close,
  id,
  getData,
}: DeleteFunnelModalProps) {
  const { funnel, getFunnel, deleteFunnel } = useFunnel();
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<DeleteFunnel>(funnel);

  async function fetchFunnel() {
    await onLoading();
    try {
      const { data } = await getFunnel(id);
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
    fetchFunnel();
  }, []);

  useEffect(() => {
    setData(funnel);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onLoading();
    try {
      const response = await deleteFunnel(id);
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
        <form className="w-[520px]" onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-red-600">Atenção</CardTitle>
              <CardDescription>
                Você está removendo o funil {data.name}, ao
                confirmar:
                <div className="flex flex-col gap-4 mt-4"></div>
                <li className='text-red-700'>Todas as oportunidades em andamento nesse funil serão arquivadas.</li>
                <li className='text-red-700'>Todos os pipelines desse funil serão removidos.</li>
                <li className='text-red-700'>Essa ação não poderá ser revertida.</li>
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
