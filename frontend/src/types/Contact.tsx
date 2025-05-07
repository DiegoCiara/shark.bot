import { Profile } from './Profile';

export interface Contact {
  id?: string;
  cpf_cnpj: string;
  name: string;
  phone: string;
  email?: string;
  created_at?: Date;
  profile_id?: string;
  profile_name?: string;
  profile?: Profile;
}
