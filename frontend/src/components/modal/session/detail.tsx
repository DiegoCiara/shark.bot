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
import { useSession } from '@/context/session-context';
import ModalContainer from '..';
import { useEffect, useState } from 'react';
import { Session } from '@/types/Session';
import { toast } from 'react-toastify';
import DeleteSessionModal from './delete';
import { AxiosError } from 'axios';

interface DetailSessionModalProps {
  id: string;
  open: boolean;
  close: () => void;
  getData: () => void;
}

export default function DetailSessionModal({
  id,
  open,
  close,
  getData,
}: DetailSessionModalProps) {
  const { session, getSession } = useSession();
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Session>(session);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  async function fetchSession() {
    await onLoading();
    try {
      const { data } = await getSession(id);
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
    fetchSession();
  }, []);

  function controlDelete() {
    setDeleteModal(!deleteModal);
  }

  return (
    <ModalContainer open={open} close={close}>
      {id && deleteModal && (
        <DeleteSessionModal
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
          <CardTitle>Detalhes do usuário</CardTitle>
          <CardDescription>
            Veja abaixo os detalhes da conta do usuário.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Nome</Label>
            <br />
            <strong>{data.assistant_id}</strong>
          </div>
        </CardContent>
        <CardFooter className="gap-2 flex flex-col">
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
