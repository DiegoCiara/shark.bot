import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
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
import UpdateContactModal from './update';
import DeleteContactModal from './delete';
import { AxiosError } from 'axios';

interface DetailContactModalProps {
  id: string;
  open: boolean;
  close: () => void;
  getData: () => void;
}

export default function DetailContactModal({
  id,
  open,
  close,
  getData,
}: DetailContactModalProps) {
  const { contact, getContact } = useContact();
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Contact>(contact);
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  async function fetchContact() {
    await onLoading();
    try {
      const { data } = await getContact(id);
      setData(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        return toast.error(
          error?.response?.data?.message || 'Algo deu errado, tente novamente.',
        );
      }
    } finally {
      await offLoading();
    }
  }

  useEffect(() => {
    fetchContact();
  }, []);

  useEffect(() => {
    setData(contact);
  }, [open]);

  function controlUpdateModal() {
    setUpdateModal(!updateModal);
  }

  function controlDelete() {
    setDeleteModal(!deleteModal);
  }

  return (
    <ModalContainer open={open} close={close}>
      {id && updateModal && (
        <UpdateContactModal
          id={id}
          open={updateModal}
          close={controlUpdateModal}
          getData={async () => {
            await fetchContact();
            await getData();
          }}
        />
      )}

      {id && deleteModal && (
        <DeleteContactModal
          id={id}
          open={deleteModal}
          close={controlDelete}
          getData={async () => {
            await getData();
            await close();
          }}
        />
      )}
      <Card className="card-modal">
        <CardHeader>
          <CardTitle>Detalhes da cliente</CardTitle>
          <CardDescription>
            Veja abaixo os detalhes da conta da cliente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Nome</Label>
            <br />
            <strong>{data.name}</strong>
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">CPF/CNPJ</Label>
            <br />
            <strong>
              <p>{data.cpf_cnpj}</p>
            </strong>
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Telefone</Label>
            <br />
            <strong>
              <p>{data.phone}</p>
            </strong>
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">E-mail</Label>
            <br />
            <strong>
              <p>{data.email}</p>
            </strong>
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Perfil de cliente</Label>
            <br />
            <strong>
              <p>{data.profile_name}</p>
            </strong>
          </div>
        </CardContent>
        <CardFooter className="gap-2 flex flex-col">
          <Button
            className="w-full"
            variant={'secondary'}
            type="submit"
            onClick={() => controlUpdateModal()}
          >
            Editar
          </Button>
          <Button
            className="w-full"
            variant={'destructive'}
            type="submit"
            onClick={() => controlDelete()}
          >
            Remover
          </Button>
        </CardFooter>
      </Card>
    </ModalContainer>
  );
}
