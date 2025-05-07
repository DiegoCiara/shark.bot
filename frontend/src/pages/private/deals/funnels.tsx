import { useFunnel } from '@/context/funnel-context';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLoading } from '@/context/loading-context';
import { AxiosError } from 'axios';
import { Funnel } from '@/types/Funnel';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function DealFunnels() {
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Funnel[]>([]);
  const { getFunnels } = useFunnel();

  const navigate = useNavigate();

  async function fetchFunnel() {
    await onLoading();
    try {
      const { data } = await getFunnels();
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
    fetchFunnel();
  }, []);
  return (
    <>
      <main className="mt-[60px]">
        <section className="flex flex-col gap-5 items-start justify-start py-5 px-10">
          <div className="w-full flex items-center justify-between">
            <div className="flex w-full justify-between items-start">
              <h1 className="text-[1.5rem] font-medium m-0">
                Selecione um funil
              </h1>
            </div>
          </div>
          <div className="w-full">
            <div className="rounded-md grid grid-cols-[24.5%_24.5%_24.5%_24.5%] gap-2">
              {data.length > 0 && (
                <>
                  {data.map((funnel) => (
                    <Card
                      key={funnel.id}
                      className="w-full flex items-center justify-between p-4 border-b hover:cursor-pointer hover:border-gray-50 hover:scale-[101%] transition-all duration-200 ease-in-out"
                      onClick={() => navigate(funnel.id!)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <h3 className="font-medium">
                            {funnel.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {funnel.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
