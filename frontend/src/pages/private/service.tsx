import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useLoading } from '@/context/loading-context';
import { AxiosError } from 'axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Menu, Send } from 'lucide-react';
import { useThread } from '@/context/thread-context';
import { Thread } from '@/types/Thread';
import { useNavigate, useParams } from 'react-router-dom';
import { Message } from '@/types/Message';
import { formatPhone } from '@/utils/formats';
import { useSocket } from '@/context/socket-context';
// import { CardContent } from '@mui/material';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Contact } from '@/types/Contact';
// import { useUser } from '@/context/user-context';

export default function Service() {
  const { thread_id } = useParams();
  const navigate = useNavigate();
  const { onLoading, offLoading } = useLoading();
  const { socket } = useSocket()
  const { thread, getThread, getThreads, assumeThread } = useThread();
  // const [contact, setContact] = useState<Contact>()
  const [data, setData] = useState<Thread>(thread);
  const [messages, setMessages] = useState<Message[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  async function fetchService() {
    await onLoading();
    try {
      const { data } = await getThreads();
      setThreads(data);
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
  async function fetchThread(id: string) {
    await onLoading();
    try {
      const { data } = await getThread(id);
      setData(data.thread);
      setMessages(data.messages);
      console.log(messages);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        return toast.error(
          error.response?.data?.message || 'Algo deu errado, tente novamente.',
        );
      }
    } finally {
      setTimeout(async () => {
        await offLoading();
      }, 500);
    }
  }
  async function assumeService() {
    await onLoading();
    try {
      const response = await assumeThread(data.id);
      if (response.status === 200) {
        await fetchThread(data.id);
        toast.success(response.data.message);
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
  }
  function receivedMessage() {
    socket.on(`${thread_id}`, (message: Message) => {
      setMessages((prevMessages) => {
        const alreadyExists = prevMessages.some(
          (msg) => msg.id === message.id
        );
        if (alreadyExists) return prevMessages;
        return [...prevMessages, message];
      });
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    });

    return () => {
      socket.off(`${thread_id}`);
    };
  }

  useEffect(() => {
    receivedMessage()
  },[])

  useEffect(() => {
    fetchService();
    if (thread_id) {
      fetchThread(thread_id);
    }
  }, [thread_id]);

  function returnContent(msg: Message) {
    switch (msg.type) {
      case 'image':
        return (
          <>
            <img className="max-h-[450px]" src={msg.media} />
            <div>{msg.content}</div>
          </>
        );
        break;
      case 'ptt':
        return <audio controls src={msg.media} className="w-300px" />;
        break;
      default:
        return <div>{msg.content}</div>;
        break;
    }
  }

  function returnInput() {
    switch (data?.status) {
      case 'OPEN':
        switch (data.responsible) {
          case 'ASSISTANT':
            return (
              <Button onClick={assumeService} className="self-center">
                Assumir conversa
              </Button>
            );
            break;

          case 'USER':
            return (
              <form className="flex flex-col items-start gap-2 relative">
                {/* <div className="border w-[200px] h-[200px]"></div> */}
                <div className="flex w-full items-start gap-2 border rounded-3xl p-2 pr-4">
                  <Button
                    className="cursor-pointer rounded-full px-2.5 py-2"
                    variant="outline"
                    type="button"
                  >
                    📎
                    <input type="file" accept="image/*,audio/*" hidden />
                  </Button>
                  <Textarea
                    placeholder="Digite sua mensagem..."
                    className="flex-1 border-none rounded-2xl px-3 py-2 text-sm focus:outline-transparent focus:border-transparent min-h-[20px]"
                    // rows={1}
                  />
                  <Button
                    type="submit"
                    className="bg-primary px-2.5 py-2 rounded-full text-sm"
                  >
                    <Send />
                  </Button>
                </div>
              </form>
            );
            break;

          default:
            break;
        }
        break;

      case 'CLOSED':
        return (
          <div>
            <p className="text-muted-foreground text-sm">
              Esta conversa foi encerrada.
            </p>
          </div>
        );
        break;

      default:
        break;
    }
  }

  return (
    <>
      <main className="mt-[60px]">
        <section className="flex flex-col gap-5 items-start justify-start py-4 px-10">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-[1.5rem] font-medium m-0">Atendimento</h1>
            <Button disabled>Iniciar conversa</Button>
          </div>
          <div className="w-full flex items-start gap-2 justify-start">
            <div className="flex flex-col p-2 gap-1 bg-primary-foreground rounded-lg h-[80vh] max-h-[80vh] min-w-[330px] overflow-auto">
              {threads.map((t) => (
                <Card
                  key={t.id}
                  className={`flex items-center gap-4 p-4 rounded-lg shadow hover:bg-secondary transition cursor-pointer w-full relative ${
                    data.id && t.id === data.id && 'bg-blue-900'
                  }`}
                  onClick={() => navigate(`/service/${t.id}`)}
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {formatPhone(t.contact.phone)}
                    </span>
                    <span className="text-xs">Última mensagem...</span>
                  </div>
                  <div className="ml-auto text-xs absolute bottom-2 right-2">
                    {new Date(t.updated_at).getDate()}
                  </div>
                </Card>
              ))}
            </div>
            {data?.id ? (
              <div className="w-full flex flex-col justify-end h-[80vh]">
                <header className="border border-b-0 p-2 rounded-t-lg flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="flex flex-col gap-0">
                      <h3>{formatPhone(data.contact.phone)}</h3>
                      {/* <span className='text-xs text-muted-foreground'>{formatPhone(`81997052688`)}</span> */}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    disabled
                    className="cursor-not-allowed"
                  >
                    <Menu />
                  </Button>
                </header>
                <div className="flex mb-2 flex-col gap-2 h-full overflow-y-scroll rounded-b-lg border p-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`${
                        msg.from === 'CONTACT'
                          ? 'self-start bg-blue-900 text-white'
                          : 'self-end bg-primary-foreground'
                      } rounded-xl px-3 py-2 text-sm max-w-[70%] flex flex-col items-start gap-2`}
                    >
                      {returnContent(msg)}
                      <div className="text-[10px] self-end text-gray-500 text-right mt-1">
                        {new Date(msg.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                {returnInput()}
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground text-sm">
                  Selecione uma conversa ao lado.
                </p>
              </div>
            )}

            {/* <Card
              // key={item}
              className="flex flex-col h-[80vh] max-h-[80vh] min-w-[300px]"
            >
              <CardHeader>
                <CardTitle>Dados do contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    type="text"
                    id="name"
                    required
                    value={contact?.name}
                    // placeholder="Nome do usuário"
                    // onChange={(e) => change(e.target.value, 'name')}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="E-mail do usuário"
                    value={contact?.email}
                    // onChange={(e) => change(e.target.value, 'email')}
                  />
                </div>
              </CardContent>
            </Card> */}
          </div>
        </section>
      </main>
    </>
  );
}
