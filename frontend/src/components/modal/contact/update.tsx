import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/context/loading-context';
import { useContact } from '@/context/contact-context';
import ModalContainer from '..';
import { useEffect, useState } from 'react';
import { Contact } from '@/types/Contact';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import FormContact from './form/form';

interface UpdateContactModalProps {
  id: string;
  open: boolean;
  close: () => void;
  getData: () => void;
}

export default function UpdateContactModal({
  id,
  open,
  close,
  getData,
}: UpdateContactModalProps) {
  const { contact, getContact, updateContact } = useContact();
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Contact>(contact);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await onLoading();
    try {
      const response = await updateContact(id, data);
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

  async function fetchContacts() {
    await onLoading();
    try {
      const { data } = await getContact(id);
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
    fetchContacts();
  }, []);

  useEffect(() => {
    setData(contact);
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
          <FormContact data={data} change={handleChangeObject} />
          <CardFooter className="w-full flex justify-end items-center gap-4">
            <Button type="submit">Enviar</Button>
          </CardFooter>
        </Card>
      </form>
    </ModalContainer>
  );
}
