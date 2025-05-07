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
import ModalContainer from '../..';
import { useEffect, useState } from 'react';
import { Pipeline } from '@/types/Pipeline';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import FormPipeline from './form/form';

interface UpdatePipelineModalProps {
  id: string;
  open: boolean;
  close: () => void;
  getData: () => void;
}

export default function UpdatePipelineModal({
  id,
  open,
  close,
  getData,
}: UpdatePipelineModalProps) {
  const { pipeline, getPipeline, updatePipeline } = useFunnel();
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Pipeline>(pipeline);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await onLoading();
    try {
      const response = await updatePipeline(id, data);
      if (response.status === 204) {
        toast.success('Pipeline atualizado com sucesso');
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

  async function fetchPipeline() {
    await onLoading();
    try {
      const { data } = await getPipeline(id);
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
    fetchPipeline();
  }, []);

  const handleChangeObject = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    item: keyof Pipeline,
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
        className="sm:w-full"
      >
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Atualizar perfil</CardTitle>
            <CardDescription>
              Atualize os dados do perfil abaixo
            </CardDescription>
          </CardHeader>
          <div className="flex w-full items-center justify-center gap-1">
            <FormPipeline data={data} change={handleChangeObject} />
          </div>
          <CardFooter className="w-full flex justify-end items-center gap-4">
            <Button type="submit">Enviar</Button>
          </CardFooter>
        </Card>
      </form>
    </ModalContainer>
  );
}
