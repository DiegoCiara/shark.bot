import React from 'react';
import { useWorkspace } from '@/context/workspace-context';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLoading } from '@/context/loading-context';
import { AxiosError } from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Workspace } from '@/types/Workspace';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Worksapce() {
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Workspace>({
    name: '',
    created_at: '',
  });
  const { getWorkspace, updateWorkspace } = useWorkspace();

  async function fetchWorksapce() {
    await onLoading();
    try {
      const { data } = await getWorkspace();
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

  async function upWorkspace(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await onLoading()
    try {
      const response = await updateWorkspace(data);
      if(response.status === 204){
        toast.success('Workspace atualizado com sucesso')
      }
    } catch (error) {
      console.log(error)
    } finally {
      await offLoading()
    }
  }

  useEffect(() => {
    fetchWorksapce();
  }, []);

  return (
    <>
      <main>
        <section className="flex flex-col gap-5 items-start justify-start py-2.5">
          <div className="w-full">
            <form onSubmit={upWorkspace}>
              <Card className=" sm:w-[400px] shadow-none border-none">
                <CardHeader className='px-0 pt-1.5'>
                  <CardTitle>Dados do Workspace</CardTitle>
                  <CardDescription>
                    Adicione um perfil preenchendo os dados abaixo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 px-0">
                  <div className="space-y-1">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      type="text"
                      id="name"
                      required
                      value={data.name}
                      placeholder="Nome do cliente"
                      onChange={(e) =>
                        setData({ ...data, name: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter className='px-0'>
                  <Button>Salvar</Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
