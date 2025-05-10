import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Users from './users';

export default function Settings() {
  return (
    <>
      <main className="mt-[60px]">
        <section className="flex flex-col gap-5 items-start justify-start py-5 px-10">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-[1rem] font-medium m-0">Configurações</h1>
          </div>
          <div className="w-full">
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="">
                <TabsTrigger value="users">Usuários</TabsTrigger>
              </TabsList>
              <TabsContent value="users">
                <Users/>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </>
  );
}
