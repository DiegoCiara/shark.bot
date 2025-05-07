import { Pipeline } from "./Pipeline";

export interface Funnel {
  id?: string;
  name: string;
  description?: string;
  deal_status: string[];
  pipelines?: Pipeline[];
  created_at?: Date
}
