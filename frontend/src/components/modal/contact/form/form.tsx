import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Contact } from '@/types/Contact';
import { useEffect, useState } from 'react';
import { useProfile } from '@/context/profile-context';
import { Combobox } from '@/components/combobox/combo';
import { formatCpfCnpj, formatObject, formatPhone } from '@/utils/formats';

interface FormContactProps {
  data: Contact;
  change: (value: string, item: string) => void;
}

function FormContact({ data, change  }: FormContactProps) {
  const [profiles, setProfiles] = useState([]);

  const { getProfiles } = useProfile();

  async function fetchProfiles() {
    try {
      const response = await getProfiles();
      console.log(response);
      if (response.status === 200) {
        setProfiles(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchProfiles();
  }, []);

  function setProfileId(value: string) {
    change(value, 'profile_id');
  }
  return (
    <CardContent className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor="name">Nome</Label>
        <Input
          type="text"
          id="name"
          required
          value={data.name}
          placeholder="Nome do cliente"
          onChange={(e) => change(e.target.value, 'name')}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="rent">CPF/CNPJ</Label>
        <Input
          type="text"
          id="cpf_cnpj"
          value={formatCpfCnpj(data.cpf_cnpj)}
          required
          placeholder="Nome do cliente"
          onChange={(e) => change(e.target.value, 'cpf_cnpj')}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="deduction">Telefone</Label>
        <Input
          id="phone"
          placeholder="Telegone do cliente"
          maxLength={15}
          required
          value={formatPhone(data.phone)}
          onChange={(e) => change(e.target.value, 'phone')}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="E-mail do cliente"
          value={data.email}
          onChange={(e) => change(e.target.value, 'email')}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Perfil</Label>
        <Combobox
          placeholder="Selecione um perfil"
          options={formatObject(profiles, 'name', 'id')}
          value={data.profile_id!}
          setId={setProfileId}
        />
      </div>
    </CardContent>
  );
}

export default FormContact;
