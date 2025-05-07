import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Overview from './overview';

export default function Dashoard() {
  return (
    <>
      <main className="mt-[60px]">
        <section className="flex flex-1 flex-col">
          <Tabs defaultValue="overview" className="w-full">
            <div className="w-full flex items-center justify-between px-10 pt-5">
              <div className="flex flex-col items-start gap-4">
                <h1 className="text-[1.5rem] font-medium m-0">Dashboard</h1>
                {/* <Button onClick={() => controlCreateModal()}>
                Adicionar cliente
                </Button> */}
                <TabsList className="">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="users">Vendas</TabsTrigger>
                  <TabsTrigger value="profile">Contatos</TabsTrigger>
                  <TabsTrigger value="product">Equipe</TabsTrigger>
                </TabsList>
              </div>
            </div>

            <div className="flex flex-1 flex-col">
              <TabsContent value="overview">
                <Overview />
              </TabsContent>
            </div>
          </Tabs>
        </section>
      </main>
    </>
  );
}
