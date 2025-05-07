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
import { useFunnel } from '@/context/funnel-context';
import ModalContainer from '..';
import { useEffect, useState } from 'react';
import { Funnel } from '@/types/Funnel';
import { toast } from 'react-toastify';
import UpdateFunnelModal from './update';
import DeleteFunnelModal from './delete';
import { AxiosError } from 'axios';
import { Copy } from 'lucide-react';
import { formatDealStatus } from '@/utils/formats';

interface DetailFunnelModalProps {
  id: string;
  open: boolean;
  close: () => void;
  getData: () => void;
}

export default function DetailFunnelModal({
  id,
  open,
  close,
  getData,
}: DetailFunnelModalProps) {
  const { funnel, getFunnel } = useFunnel();
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Funnel>(funnel);
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  async function fetchFunnel() {
    await onLoading();
    try {
      const { data } = await getFunnel(id);
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
    fetchFunnel();
  }, []);

  useEffect(() => {
    setData(funnel);
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
        <UpdateFunnelModal
          id={id}
          open={updateModal}
          close={controlUpdateModal}
          getData={async () => {
            await fetchFunnel();
            await getData();
          }}
        />
      )}

      {id && deleteModal && (
        <DeleteFunnelModal
          id={id}
          open={deleteModal}
          close={controlDelete}
          getData={async () => {
            await getData();
            await close();
          }}
        />
      )}
      <Card className="min-w-[60vw]">
        <CardHeader>
          <CardTitle>Detalhes do perfil</CardTitle>
          <CardDescription>
            Veja abaixo os detalhes da conta da perfil.
          </CardDescription>
        </CardHeader>
        <div className="flex w-full items-center justify-center gap-1">
          <CardContent className="space-y-4 w-full">
            <div className="text-xs flex w-full items-center justify-between text-muted-foreground font-bold bg-slate-300 p-1 px-2 rounded-sm">
              <span>{id}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  navigator.clipboard.writeText(id);
                  toast.info('ID copiado!');
                }}
              >
                <Copy />
              </Button>
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">Nome</Label>
              <br />
              <strong>{data.name}</strong>
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">Descrição</Label>
              <br />
              <strong>
                <p>{data.description}</p>
              </strong>
            </div>
            <div className="space-y-1">
              <Label>Negociações com status:</Label>
              <div className="flex flex-col space-y-1">
                {data.deal_status.map((status) => (
                  <li>{formatDealStatus(status)}</li>
                ))}
              </div>
            </div>
          </CardContent>

          <CardContent className="space-y-2 w-full flex flex-col justify-start items-center h-[280px] overflow-auto">
            <Label htmlFor="pipelines" className="w-full text-start">
              Pipelines
            </Label>
            {data.pipelines!.length == 0 && (
              <span className="w-full text-start text-[11px] text-muted-foreground">
                Não há pipelines adicionados neste funil.
              </span>
            )}

            {data.pipelines!.map((e) => (
              <div
                key={e.name}
                className="grid grid-cols-2 items-center gap-2 border border-slate-500 w-full p-3 rounded-lg relative"
              >
                <div className="flex flex-col items-start gap-2">
                  <h3>{e.name}</h3>
                  <span className="text-[10px] text-muted-foreground max-w-[200px] text-nowrap overflow-hidden overflow-ellipsis">
                    {e.description}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </div>
        <CardFooter className="gap-2 flex ">
          <Button
            variant={'secondary'}
            type="submit"
            onClick={() => controlUpdateModal()}
          >
            Editar
          </Button>
          <Button
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
