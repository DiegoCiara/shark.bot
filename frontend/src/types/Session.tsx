
export interface Session {
  id?: string;
  assistant_id: string;
  name: string;
  status: string;
  phone?: string;
  waiting_time?: number;
  human_support_phone?: string;
  stop_trigger: string;
  close_trigger: string;
}
