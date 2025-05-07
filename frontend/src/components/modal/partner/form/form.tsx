import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Partner } from '@/types/Partner';
import { Textarea } from '@/components/ui/textarea';

interface FormPartnerProps {
  data: Partner;
  change: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,

    item: keyof Partner,
  ) => void;
}

function FormPartner({ data, change }: FormPartnerProps) {
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


export default FormPartner