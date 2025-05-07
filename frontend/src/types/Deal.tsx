import { Contact } from './Contact';
import { Partner } from './Partner';
import { Pipeline } from './Pipeline';

export interface Deal {
  id?: string;
  observation?: string;
  status: string;
  contact_id?: string;
  contact?: Contact;
  pipeline_id?: string;
  pipeline?: Pipeline;
  product_id?: string;
  product?: Pipeline;
  partner_id?: string;
  partner?: Partner;
  value?: string;
  created_at?: Date;
}
