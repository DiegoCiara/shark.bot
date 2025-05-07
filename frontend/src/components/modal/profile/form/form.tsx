import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Profile } from '@/types/Profile';
import { Textarea } from '@/components/ui/textarea';

interface FormProfileProps {
  data: Profile;
  change: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
      
    item: keyof Profile,
  ) => void;
}

function FormProfile({ data, change }: FormProfileProps) {
  return (
    <CardContent className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor="rent">Nome</Label>
        <Input
          type="text"
          id="rent"
          maxLength={25}
          value={data.name}
          placeholder="Nome do cliente"
          onChange={(e) => change(e, 'name')}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="rent">Description</Label>
        <Textarea
          id="rent"
          maxLength={25}
          value={data.description}
          placeholder="Nome do cliente"
          onChange={(e) => change(e, 'description')}
        />
      </div>
    </CardContent>
  );
}


export default FormProfile