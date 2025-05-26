
export interface Session {
  id?: string;
  assistant_id: string;
  name: string;
  status: string;
  phone?: string;
  waiting_time?: number;
  stop_trigger: string;
}
