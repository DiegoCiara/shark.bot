import { useEffect, useState } from 'react';
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
// import { useUser } from '@/context/user-context';

export default function Service() {
  const { thread_id } = useParams();
  const navigate = useNavigate()
  const { onLoading, offLoading } = useLoading();
  const { getThread, getThreads } = useThread();
  const [data, setData] = useState<Thread>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);

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
    fetchService();
    if (thread_id) {
      fetchThread(thread_id);
    }
  }, []);

  return (
    <>
      <main className="mt-[60px]">
        <section className="flex flex-col gap-5 items-start justify-start py-4 px-10">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-[1rem] font-medium m-0 mt-1">Atendimento</h1>
          </div>
          <div className="w-full flex items-start gap-2 justify-start">
            <div className="flex flex-col p-2 gap-1 bg-primary-foreground rounded-lg h-[80vh] max-h-[80vh] w-[330px] overflow-auto">
              {threads.map((t) => (
                <Card
                  key={t.id}
                  className="flex items-center gap-4 p-4 rounded-lg shadow hover:bg-secondary transition cursor-pointer w-full relative"
                  onClick={() => navigate(t.id)}
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
                      <h3>{data?.contact!.phone}</h3>
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
                <div className="flex mb-2 flex-col gap-2 h-full overflow-y-auto rounded-b-lg border  p-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`${
                        msg.type === 'sent'
                          ? 'self-end bg-primary-foreground'
                          : 'self-start bg-blue-900 text-white'
                      } rounded-xl px-3 py-2 text-sm max-w-[70%]`}
                    >
                      <div>{msg.content}</div>
                      <div className="text-[10px] text-gray-500 text-right mt-1">
                        {new Date(msg.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <form className="flex flex-col items-start gap-2 relative">
                  {/* <div className="border w-[200px] h-[200px]"></div> */}
                  <div className="flex w-full items-start gap-2 border rounded-3xl p-2 pr-4">
                    <Button
                      className="cursor-pointer rounded-full px-2.5 py-2"
                      variant="outline"
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
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground text-sm">
                  Selecione uma conversa ao lado.
                </p>
              </div>
            )}
            {/* <div className="flex flex-col p-2 gap-1 bg-primary-foreground rounded-lg h-[80vh] max-h-[80vh]">
              {[1, 2, 3].map((item) => (
                <Card
                  key={item}
                  className="flex items-center gap-4 p-4 rounded-lg shadow hover:bg-secondary transition cursor-pointer w-[300px]"
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      Usuário {item}
                    </span>
                    <span className="text-xs">Última mensagem...</span>
                  </div>
                  <div className="ml-auto text-xs ">12:30</div>
                </Card>
              ))}
            </div> */}
          </div>
        </section>
      </main>
    </>
  );
}
