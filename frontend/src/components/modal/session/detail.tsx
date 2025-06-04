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
import { formatPhone } from '@/utils/formats';
// import socket from '@/api/socket';
// import FormSession from './form/form';

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
  const { session, getSession, connectWhatsApp } = useSession();
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Session>(session);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [counter, setCounter] = useState(60);

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

  async function createConnection() {
    setLoading(true);
    try {
      const response = await connectWhatsApp(id);

      if (response.status === 200) {
        let qr = response.data.qr_code.qrcode;
        if (!qr.startsWith('data:image')) {
          qr = `data:image/png;base64,${qr}`;
        }
        setQrCode(qr);
        startCounter();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        return toast.error(
          error?.response?.data?.message || 'Algo deu errado, tente novamente.',
        );
      }
    } finally {
      await setLoading(false);
    }
  }

  // function getStatusConnection() {
  //   socket.on(`qrCode:${id}`, (data) => {
  //     if (data.url) {
  //       setLoading(false);
  //       setQrCode(data.url);
  //       if (counter === 0) {
  //         setCounter(60);
  //       }
  //     } else {
  //       setLoading(false);
  //       setQrCode('');
  //     }
  //   });

  //   return () => {
  //     socket.off('qr');
  //   };
  // }

  useEffect(() => {
    fetchSession();
    // getStatusConnection()
  }, []);

  function controlDelete() {
    setDeleteModal(!deleteModal);
  }

  function startCounter() {
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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
          <CardTitle>Detalhes da sessão</CardTitle>
          <CardDescription>
            Veja abaixo os detalhes da conta do usuário.
          </CardDescription>
        </CardHeader>
        {/* <FormSession data={data} setData={setData} /> */}
        <div className='flex items-start justify-center min-w-[600px]'>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">OpenAI Assistant ID</Label>
              <p className="text-sm text-muted-foreground">
                {data.assistant_id}
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="name">
                Tempo de espera de novas mensagens em segundos
              </Label>
              <p className="text-sm text-muted-foreground">
                {data.waiting_time}
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="name">Gatilho de assumir atendimento</Label>
              <p className="text-sm text-muted-foreground">
                {data.stop_trigger}
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="name">Gatilho de fechar conversa</Label>
              <p className="text-sm text-muted-foreground">
                {data.close_trigger}
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="name">
                WhatsApp do atendimento humano (Apenas números com 55 no inínio)
              </Label>
              <p className="text-sm text-muted-foreground">
                {formatPhone(data.human_support_phone || '')}
              </p>
            </div>
          </CardContent>
          <CardContent>
            <CardContent className="space-y-4 h-[500px] w-[500px] bg-slate-400/10 p-2 flex flex-col items-center justify-center rounded-md text-center">
              {qrCode ? (
                <>
                  <img
                    src={qrCode}
                    className="h-[300px] w-[300px] rounded-lg"
                    alt="QR Code"
                  />
                  <span className="text-sm text-muted-foreground">
                    Conecte seu WhatsApp no QR Code acima.
                    <br />
                    Esse código irá expirar em{' '}
                    <b className="text-red-600">{counter}</b> segundos
                  </span>
                </>
              ) : (
                <></>
              )}
              {loading ? <span>Gerando Qr Code...</span> : <></>}
              {!loading && qrCode === '' && (
                <>
                  <span>Gere um QR Code para Conectar</span>
                  <div className="ButtonConect">
                    <Button onClick={createConnection}>Conectar</Button>
                  </div>
                </>
              )}
            </CardContent>
          </CardContent>
        </div>
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
