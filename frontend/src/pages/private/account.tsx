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
import { User } from '@/types/User';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/user-context';

export default function Account() {
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<User>({
    name: '',
    email: '',
    role: '',
  });
  const { getAccount } = useUser();

  async function fetchAccount() {
    await onLoading();
    try {
      const { data } = await getAccount();
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

  // async function upUser(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault()
  //   await onLoading()
  //   try {
  //     const response = await updateUser(data);
  //     if(response.status === 204){
  //       toast.success('User atualizado com sucesso')
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     await offLoading()
  //   }
  // }

  useEffect(() => {
    fetchAccount();
  }, []);

  return (
    <>
      <main className="mt-[60px]">
        <section className="flex flex-col gap-5 items-start justify-start py-5 px-10">
          <div className="w-full">
            <form>
              <Card className="p-0 sm:w-[400px] pb-1 shadow-none border-none">
                <CardHeader>
                  <CardTitle>Minha conta</CardTitle>
                  <CardDescription>
                    Verifique os detalhes da conta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
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
                  <div className="space-y-1">
                    <Label htmlFor="name">E-mail</Label>
                    <Input
                      type="text"
                      id="name"
                      required
                      value={data.email}
                      placeholder="Nome do cliente"
                      onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Salvar</Button>
                </CardFooter>
              </Card>
                <span className='text-[10px] px-6 text-muted-foreground'>
                  Para redefinir sua senha, vá para a tela de login e clique em
                  "Esqueci minha senha", depois prossiga com o passo a passo
                </span>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
