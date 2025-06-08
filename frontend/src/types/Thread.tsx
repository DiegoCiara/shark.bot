
import { Contact } from './Contact';
import type { Message } from './Message'; // adjust the import path as needed
import { User } from './User';

export interface Thread {
  id: string;
  messages?: Message[];
  contact: Contact; // assuming contact ID
  user?: User; // assuming user ID, nullable in backend
  responsible: string;
  status: string;
  thread_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}
