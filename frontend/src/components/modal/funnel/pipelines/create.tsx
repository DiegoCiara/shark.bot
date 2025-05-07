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
import { useState } from 'react';
import { Pipeline } from '@/types/Pipeline';
import { toast } from 'react-toastify';
import { AxiosError, AxiosResponse } from 'axios';
import FormPipeline from './form/form';

interface CreatePipelineModalProps {
  funnelId: string;
  open: boolean;
  close: () => void;
  createPipeline: (id: string, data: Pipeline) => void | Promise<AxiosResponse>;
  getData: () => void;
}

export default function CreatePipelineModal({
  funnelId,
  open,
  close,
  createPipeline,
  getData,
}: CreatePipelineModalProps) {
  const { pipeline} = useFunnel();
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Pipeline>(pipeline);

  const handleSubmit = async () => {
    await onLoading();
    try {
      const response = await createPipeline(funnelId, data);

      if (response!.status === 201) {
        toast.success('Produto criado com sucesso');
        await getData();
        await close();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        return toast.error(
          error.response?.data?.message || 'Algo deu pipelien, tente novamente.',
        );
      }
    } finally {
      await offLoading();
    }
  };

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
      <div
        className="w-[85vw] max-w-[400px] sm:w-full"
      >
        <Card className="border-none shadow-none sm:w-[400px]">
          <CardHeader>
            <CardTitle>Adicionar funil</CardTitle>
            <CardDescription>
              Adicione um perfil preenchendo os dados abaixo
            </CardDescription>
          </CardHeader>
          <div>
            <FormPipeline data={data} change={handleChangeObject} />
          </div>
          <CardFooter className="w-full flex justify-end items-center gap-4">
            <Button onClick={handleSubmit} type='button' >Enviar</Button>
          </CardFooter>
        </Card>
      </div>
    </ModalContainer>
  );
}
