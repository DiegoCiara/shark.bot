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

interface CreateFunnelModalProps {
  open: boolean;
  close: () => void;
  getData: () => void;
}

export default function CreateFunnelModal({
  open,
  close,
  getData,
}: CreateFunnelModalProps) {
  const { funnel, createFunnel } = useFunnel();
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Funnel>(funnel);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await onLoading();
    try {
      const response = await createFunnel(data);
      if (response.status === 201) {
        toast.success('Produto criado com sucesso');
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

  useEffect(() => {
    setData(funnel);
  }, [open]);

  function setPipelines(pipelines: Pipeline[]){
    setData({...data, pipelines: pipelines})
  }

  return (
    <ModalContainer open={open} close={close}>
      <form
        onSubmit={handleSubmit}
        className="min-w-[60vw]  sm:w-full"
      >
        <Card className="border-none shadow-none sm:w-[]">
          <CardHeader>
            <CardTitle>Adicionar funil</CardTitle>
            <CardDescription>
              Adicione um perfil preenchendo os dados abaixo
            </CardDescription>
          </CardHeader>
          <div className='flex w-full items-center justify-center gap-1'>
            <FormFunnel data={data} change={handleChangeObject} />
            <Pipelines funnelId='' pipelines={data.pipelines!} setPipelines={setPipelines} getData={() => {}}/>
          </div>
          <CardFooter className="w-full flex justify-end items-center gap-4">
            <Button type="submit">Enviar</Button>
          </CardFooter>
        </Card>
      </form>
    </ModalContainer>
  );
}
