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
import { useProduct } from '@/context/product-context';
import ModalContainer from '..';
import { useEffect, useState } from 'react';
import { Product } from '@/types/Product';
import { toast } from 'react-toastify';
import UpdateProductModal from './update';
import DeleteProductModal from './delete';
import { AxiosError } from 'axios';
import { Copy } from 'lucide-react';

interface DetailProductModalProps {
  id: string;
  open: boolean;
  close: () => void;
  getData: () => void;
}

export default function DetailProductModal({
  id,
  open,
  close,
  getData,
}: DetailProductModalProps) {
  const { product, getProduct } = useProduct();
  const { onLoading, offLoading } = useLoading();
  const [data, setData] = useState<Product>(product);
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  async function fetchProduct() {
    await onLoading();
    try {
      const { data } = await getProduct(id);
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

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    setData(product);
  }, [open]);

  function controlUpdateModal() {
    setUpdateModal(!updateModal);
  }

  function controlDelete() {
    setDeleteModal(!deleteModal);
  }

  return (
    <ModalContainer open={open} close={close}>
      {id && updateModal && (
        <UpdateProductModal
          id={id}
          open={updateModal}
          close={controlUpdateModal}
          getData={async () => {
            await fetchProduct();
            await getData()
          }}
        />
      )}

      {id && deleteModal && (
        <DeleteProductModal
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
          <CardTitle>Detalhes do perfil</CardTitle>
          <CardDescription>
            Veja abaixo os detalhes da conta da perfil.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-xs flex w-full items-center justify-between text-muted-foreground font-bold bg-slate-300 p-1 px-2 rounded-sm">
            <span>{id}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                navigator.clipboard.writeText(id);
                toast.info('ID copiado!');
              }}
            >
              <Copy />
            </Button>
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Nome</Label>
            <br />
            <strong>{data.name}</strong>
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Descrição</Label>
            <br />
            <strong>
              <p>{data.description}</p>
            </strong>
          </div>
        </CardContent>
        <CardFooter className="gap-2 flex flex-col">
          <Button
            className="w-full"
            variant={'secondary'}
            type="submit"
            onClick={() => controlUpdateModal()}
          >
            Editar
          </Button>
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
