import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Profiles from './profiles';
import Worksapce from './workspace';
import Users from './users';
import Products from './products';
import Funnels from './funnels';
import Partners from './partners';

export default function Settings() {
  return (
    <>
      <main className="mt-[60px]">
        <section className="flex flex-col gap-5 items-start justify-start py-5 px-10">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-[1rem] font-medium m-0">Configurações</h1>
          </div>
          <div className="w-full">
            <Tabs defaultValue="workspace" className="w-full">
              <TabsList className="">
                <TabsTrigger value="workspace">Workspace</TabsTrigger>
                <TabsTrigger value="users">Usuários</TabsTrigger>
                <TabsTrigger value="profile">Perfis</TabsTrigger>
                <TabsTrigger value="product">Produtos</TabsTrigger>
                <TabsTrigger value="partner">Parceiros</TabsTrigger>
                <TabsTrigger value="funnel">Funis de vendas</TabsTrigger>
              </TabsList>
              <TabsContent value="workspace">
                <Worksapce />
              </TabsContent>
              <TabsContent value="users">
                <Users/>
              </TabsContent>
              <TabsContent value="profile">
                <Profiles />
              </TabsContent>
              <TabsContent value="product">
                <Products />
              </TabsContent>
              <TabsContent value="partner">
                <Partners />
              </TabsContent>
              <TabsContent value="funnel">
                <Funnels />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </>
  );
}
