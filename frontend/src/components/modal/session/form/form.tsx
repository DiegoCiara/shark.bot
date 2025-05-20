import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Session } from '@/types/Session';

interface FormUserProps {
  data: Session;
  change: (value: string, item: string) => void;
}

function FormUser({ data, change }: FormUserProps) {
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
    </CardContent>
  );
}

export default FormUser;
