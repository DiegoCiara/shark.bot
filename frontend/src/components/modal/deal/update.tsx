import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/context/loading-context';
import { useDeal } from '@/context/deal-context';
import ModalContainer from '..';
import { useEffect, useState } from 'react';
import { Deal } from '@/types/Deal';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import FormDeal from './form/form';
import { formatInt } from '@/utils/formats';

interface UpdateDealModalProps {
  id: string;
  open: boolean;
  close: () => void;
  getData: () => void;
}

export default function UpdateDealModal({
  id,
  open,
  close,
  getData,
}: UpdateDealModalProps) {
  const { deal, getDeal, updateDeal } = useDeal();
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Deal>(deal);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onLoading();
    try {
      const response = await updateDeal(id, {...data, value: formatInt(data.value || '0')});
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

  async function fetchDeals() {
    await onLoading();
    try {
      const { data } = await getDeal(id);
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
    fetchDeals();
  }, []);

  useEffect(() => {
    setData(deal);
  }, [open]);

  const handleChangeObject = (event: string, item: string) => {
    setData({
      ...data,
      [item]: event,
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
            <CardTitle>Atualizar cliente</CardTitle>
            <CardDescription>
              Atualize os dados do seu cliente abaixo
            </CardDescription>
          </CardHeader>
          <FormDeal data={data} change={handleChangeObject} setData={setData}/>
          <CardFooter className="w-full flex justify-end items-center gap-4">
            <Button type="submit">Enviar</Button>
          </CardFooter>
        </Card>
      </form>
    </ModalContainer>
  );
}
