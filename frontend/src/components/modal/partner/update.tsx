import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/context/loading-context';
import { usePartner } from '@/context/partner-context';
import ModalContainer from '..';
import { useEffect, useState } from 'react';
import { Partner } from '@/types/Partner';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import FormPartner from './form/form';

interface UpdatePartnerModalProps {
  id: string;
  open: boolean;
  close: () => void;
  getData: () => void;
}

export default function UpdatePartnerModal({
  id,
  open,
  close,
  getData,
}: UpdatePartnerModalProps) {
  const { partner, getPartner, updatePartner } = usePartner();
  const {  onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Partner>(partner);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await onLoading();
    try {
      const response = await updatePartner(id, data);
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

  async function fetchPartners() {
    await onLoading();
    try {
      const { data } = await getPartner(id);
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
    fetchPartners();
  }, []);

  useEffect(() => {
    setData(partner);
  }, [open]);

  const handleChangeObject = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    item: keyof Partner,
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
        className="w-[85vw] max-w-[400px] sm:w-full"
      >
        <Card className="border-none shadow-none sm:w-[400px]">
          <CardHeader>
            <CardTitle>Atualizar perfil</CardTitle>
            <CardDescription>
              Atualize os dados do perfil abaixo
            </CardDescription>
          </CardHeader>
          <FormPartner data={data} change={handleChangeObject} />
          <CardFooter className="w-full flex justify-end items-center gap-4">
            <Button type="submit">Enviar</Button>
          </CardFooter>
        </Card>
      </form>
    </ModalContainer>
  );
}
