import { useSession } from '@/context/session-context';
import { Dot, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Session } from '@/types/Session';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLoading } from '@/context/loading-context';
import DetailSessionModal from '@/components/modal/session/detail';
import DeleteSessionModal from '@/components/modal/session/delete';
import { AxiosError } from 'axios';
import CreateSessionModal from '@/components/modal/session/create';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { wppConnected } from '@/utils/formats';

export default function Sessions() {
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Session[]>([]);
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [detailModal, setDetailModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string>('');
  const { getSessions } = useSession();

  function controlCreateModal() {
    setCreateModal(!createModal);
  }

  function openDetailModal(id: string) {
    if (id) {
      setId(id);
      setDetailModal(!detailModal);
    }
  }
  function closeDetailModal() {
    setId('');
    setDetailModal(!detailModal);
  }

  function openDeleteModal(id: string) {
    if (id) {
      setDeleteId(id);
      setDeleteModal(!deleteModal);
    }
  }
  function closeDeleteModal() {
    setDeleteId('');
    setDeleteModal(!deleteModal);
  }

  async function fetchSessions() {
    await onLoading();
    try {
      const { data } = await getSessions();
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
    fetchSessions();
  }, []);

  return (
    <>
      {createModal && (
        <CreateSessionModal
          open={createModal}
          close={controlCreateModal}
          getData={fetchSessions}
        />
      )}
      {id && (
        <DetailSessionModal
          id={id}
          open={detailModal}
          close={closeDetailModal}
          getData={fetchSessions}
        />
      )}
      {deleteId && (
        <DeleteSessionModal
          id={deleteId}
          open={deleteModal}
          close={closeDeleteModal}
          getData={fetchSessions}
        />
      )}
      <main>
        <section className="flex flex-col gap-5 items-start justify-start py-2.5">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-[1.5rem] font-medium m-0">Sessões WhatsApp</h1>
            <Button onClick={() => controlCreateModal()}>
              Adicionar sessão
            </Button>
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((session) => (
              <Card className="relative" key={session.id}>
                <CardTitle className="p-5">{session.name}</CardTitle>
                  <CardDescription className='flex items-center ml-2 absolute bottom-2 right-4'><Dot className={`size-8 ${wppConnected(session.status) ? 'text-green-400': "text-yellow-400"}`}/>{wppConnected(session.status) ? 'Conectado': 'Desconectado'}</CardDescription>
                <CardContent>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 absolute top-2 right-2"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => openDetailModal(session.id!)}
                      >
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openDeleteModal(session.id!)}
                      >
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
