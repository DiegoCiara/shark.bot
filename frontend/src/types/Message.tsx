import { Thread } from "./Thread";
import { User } from "./User";

export interface Message {
  id: string;
  thread: Thread; // assuming the frontend uses the thread ID
  from: 'USER' | 'ASSISTANT' | 'CONTACT';
  viewed: boolean;
  content: string;
  type: string;
  media?: string;
  user?: User; // assuming the frontend uses the user ID
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}