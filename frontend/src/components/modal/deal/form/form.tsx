import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';
import { Deal } from '@/types/Deal';
import { useEffect, useState } from 'react';
import { useContact } from '@/context/contact-context';
import { Combobox } from '@/components/combobox/combo';
import {
  formatComboContact,
  formatObject,
} from '@/utils/formats';
import { useFunnel } from '@/context/funnel-context';
import { useLoading } from '@/context/loading-context';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { ComboboxContact } from '@/components/combobox/combo-contact';
import { useProduct } from '@/context/product-context';
import { usePartner } from '@/context/partner-context';
import { Input } from '@/components/ui/input';

interface FormDealProps {
  data: Deal;
  change: (value: string, item: string) => void;
  setData: (data: Deal) => void;
}

function FormDeal({ data, change, setData }: FormDealProps) {
  const [contacts, setContacts] = useState([]);

  const { getContacts } = useContact();
  const { getPipelines } = useFunnel();
  const { getProducts } = useProduct();
  const { getPartners } = usePartner();
  const { onLoading, offLoading } = useLoading();
  const { funnelId } = useParams();
  const [pipelines, setPipelines] = useState([]);
  const [products, setProducts] = useState([]);
  const [partners, setPartners] = useState([]);

  async function getPipelinesData() {
    await onLoading();
    try {
      const response = await getPipelines(funnelId!);
      if (response.status === 200) {
        setPipelines(response.data);
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
  async function getContactsData() {
    await onLoading();
    try {
      const response = await getContacts({});
      console.log(response);
      if (response.status === 200) {
        setContacts(response.data);
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

  async function getProductsData() {
    await onLoading();
    try {
      const response = await getProducts();
      console.log(response);
      if (response.status === 200) {
        setProducts(response.data);
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

  async function getPartnersData() {
    await onLoading();
    try {
      const response = await getPartners();
      console.log(response);
      if (response.status === 200) {
        setPartners(response.data);
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

  useEffect(() => {
    getContactsData();
    getPipelinesData();
    getProductsData();
    getPartnersData();
  }, []);

  function setContactId(value: string) {
    setData({
      ...data,
      contact_id: value,
    });
  }
  function setPipelineId(value: string) {
    setData({
      ...data,
      pipeline_id: value,
    });
  }

  function setProductId(value: string) {
    setData({
      ...data,
      product_id: value,
    });
  }

  function setPartnerId(value: string) {
    setData({
      ...data,
      partner_id: value,
    });
  }

  return (
    <CardContent className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor="email">Contact</Label>
        <ComboboxContact
          placeholder="Selecione um perfil"
          options={formatComboContact(contacts)}
          filterkey="cpf_cnpj"
          setId={setContactId}
          value={data.contact_id!}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Pipeline</Label>
        <Combobox
          placeholder="Selecione um perfil"
          options={formatObject(pipelines, 'name', 'id')}
          value={data.pipeline_id!}
          setId={setPipelineId}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Produto</Label>
        <Combobox
          placeholder="Selecione um produto"
          options={formatObject(products, 'name', 'id')}
          value={data.product_id!}
          setId={setProductId}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Parceiro</Label>
        <Combobox
          placeholder="Selecione um produto"
          options={formatObject(partners, 'name', 'id')}
          value={data.partner_id!}
          setId={setPartnerId}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Valor</Label>
        <Input
          value={data.value! || 'R$0,00'}
          onChange={(e) => {
            const onlyNumbers = e.target.value.replace(/\D/g, ''); // tira tudo que não é número
            const number = parseFloat(onlyNumbers) / 100; // divide por 100 pra considerar centavos
            const formatted = number.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            });
            change(formatted, 'value');
          }}
          placeholder="Valor"
          className="resize-none"
          type="text"
          name="value"
          id="value"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Observações</Label>
        <Textarea
          value={data.observation}
          onChange={(e) => change(e.target.value, 'observation')}
          placeholder="Observações"
          className="resize-none"
          rows={3}
          name="observation"
          id="observation"
        />
      </div>
    </CardContent>
  );
}

export default FormDeal;
