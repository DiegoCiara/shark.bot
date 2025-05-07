import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/context/loading-context';
import { useFunnel } from '@/context/funnel-context';
import ModalContainer from '..';
import { useEffect, useState } from 'react';
import { Funnel } from '@/types/Funnel';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import FormFunnel from './form/form';
import Pipelines from './form/pipelines';
import { Pipeline } from '@/types/Pipeline';

interface UpdateFunnelModalProps {
  id: string;
  open: boolean;
  close: () => void;
  getData: () => void;
}

export default function UpdateFunnelModal({
  id,
  open,
  close,
  getData,
}: UpdateFunnelModalProps) {
  const { funnel, getFunnel, updateFunnel } = useFunnel();
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Funnel>(funnel);

  const handleSubmit = async () => {

    await onLoading();
    try {
      const response = await updateFunnel(id, data);
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

  async function fetchFunnels() {
    await onLoading();
    try {
      const { data } = await getFunnel(id);
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
    fetchFunnels();
  }, []);

  useEffect(() => {
    setData(funnel);
  }, [open]);

  const handleChangeObject = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    item: keyof Funnel,
  ) => {
    setData({
      ...data,
      [item]: event.target.value,
    });
  };

  function setPipelines(pipelines: Pipeline[]) {
    setData({ ...data, pipelines: pipelines });
  }

  return (
    <ModalContainer open={open} close={close}>
      <div
        className="min-w-[60vw]  sm:w-full"
      >
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Atualizar perfil</CardTitle>
            <CardDescription>
              Atualize os dados do perfil abaixo
            </CardDescription>
          </CardHeader>
          <div className="flex w-full items-center justify-center gap-1">
            <FormFunnel data={data} change={handleChangeObject} />
            <Pipelines
              funnelId={id}
              pipelines={data.pipelines!}
              setPipelines={setPipelines}
              getData={fetchFunnels}
            />
          </div>
          <CardFooter className="w-full flex justify-end items-center gap-4">
            <Button type="submit" onClick={() => handleSubmit()}>Enviar</Button>
          </CardFooter>
        </Card>
      </div>
    </ModalContainer>
  );
}
