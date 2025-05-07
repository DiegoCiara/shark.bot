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
import { useDeal } from '@/context/deal-context';
import ModalContainer from '..';
import { useEffect, useState } from 'react';
import { Deal } from '@/types/Deal';
import { toast } from 'react-toastify';
import UpdateDealModal from './update';
import DeleteDealModal from './delete';
import { AxiosError } from 'axios';
import { formatCpfCnpj, formatCurrency, formatDealStatus, formatPhone } from '@/utils/formats';

interface DetailDealModalProps {
  id: string;
  open: boolean;
  close: () => void;
  getData: () => void;
}

export default function DetailDealModal({
  id,
  open,
  close,
  getData,
}: DetailDealModalProps) {
  const { deal, getDeal } = useDeal();
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Deal>({
    contact: {
      name: '',
      cpf_cnpj: '',
      phone: '',
      email: '',
      profile: {
        name: '',
        id: '',
        created_at: new Date(),
      },
      id: '',
      created_at: new Date(),
    },
    pipeline: {
      name: '',
      id: '',
      created_at: new Date(),
    },
    id: '',
    observation: '',
    status: '',
    contact_id: '',
    pipeline_id: '',
    created_at: new Date(),
  });
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  async function fetchDeal() {
    await onLoading();
    try {
      const { data } = await getDeal(id);
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
    fetchDeal();
  }, []);

  useEffect(() => {
    setData(deal);
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
        <UpdateDealModal
          id={id}
          open={updateModal}
          close={controlUpdateModal}
          getData={async () => {
            await fetchDeal();
            await getData();
          }}
        />
      )}

      {id && deleteModal && (
        <DeleteDealModal
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
          <CardTitle>Detalhes da negociacao</CardTitle>
          <CardDescription>
            Veja abaixo os detalhes da conta da cliente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="name">Nome</Label>
              <br />
              <strong>{data?.contact?.name}</strong>
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">CPF/CNPJ</Label>
              <br />
              <strong>
                <p>{formatCpfCnpj(data?.contact?.cpf_cnpj as string) || ''}</p>
              </strong>
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">Telefone</Label>
              <br />
              <strong>
                <p>{formatPhone(data?.contact?.phone as string) || ''}</p>
              </strong>
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">E-mail</Label>
              <br />
              <strong>
                <p>{data?.contact?.email}</p>
              </strong>
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">Perfil de cliente</Label>
              <br />
              <strong>
                <p>{data.contact?.profile?.name}</p>
              </strong>
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">Etapa</Label>
              <br />
              <strong>
                <p>{data.pipeline?.name}</p>
              </strong>
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">Produto</Label>
              <br />
              <strong>
                <p>{(data.product?.name)}</p>
              </strong>
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">Valor</Label>
              <br />
              <strong>
                <p>{formatCurrency(data?.value?.toString() || '')}</p>
              </strong>
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">Status</Label>
              <br />
              <strong>
                <p>{formatDealStatus(data.status)}</p>
              </strong>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Observação</Label>
            <br />
            <strong>
              <p>{data?.observation || 'Sem observações'}</p>
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
