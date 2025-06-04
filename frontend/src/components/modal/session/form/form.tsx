import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Session } from '@/types/Session';

interface FormSessionProps {
  data: Session;
  change: (value: string, item: string) => void;
}

function FormSession({ data, change }: FormSessionProps) {
  return (
    <CardContent className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor="name">OpenAI Assistant ID</Label>
        <Input
          type="text"
          id="name"
          required
          value={data.assistant_id}
          placeholder="ID da assistente"
          onChange={(e) => change(e.target.value, 'assistant_id')}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="name">Tempo de espera (em segundos)</Label>
        <Input
          type="number"
          id="name"
          required
          value={data.waiting_time}
          placeholder="20"
          onChange={(e) => change(e.target.value, 'waiting_time')}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="name">Gatilho para transferência do atendimento</Label>
        <Input
          type="text"
          id="name"
          required
          value={data.stop_trigger}
          placeholder="Exemplo: Assumir atendimento"
          onChange={(e) => change(e.target.value, 'stop_trigger')}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="name">Gatilho para encerrar o atendimento</Label>
        <Input
          type="text"
          id="name"
          required
          value={data.close_trigger}
          placeholder="Exemplo: Assumir atendimento"
          onChange={(e) => change(e.target.value, 'close_trigger')}
        />
      </div>
    </CardContent>
  );
}

export default FormSession;
