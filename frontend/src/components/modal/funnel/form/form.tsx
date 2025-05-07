import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Funnel } from '@/types/Funnel';
import { Textarea } from '@/components/ui/textarea';
import { formatDealStatus } from '@/utils/formats';

interface FormFunnelProps {
  data: Funnel;
  change: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,

    item: keyof Funnel,
  ) => void;
}

function FormFunnel({ data, change }: FormFunnelProps) {
  return (
    <CardContent className="space-y-2 w-full">
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
      <div className="space-y-1">
        <Label>Deal Status</Label>
        <div className="flex flex-col space-y-1">
          {['INPROGRESS', 'WON', 'LOST', 'ARCHIVED'].map((status) => (
            <label key={status} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.deal_status.includes(status)}
                onChange={(e) => {
                  const updatedStatus = e.target.checked
                    ? [...data.deal_status, status]
                    : data.deal_status.filter((s) => s !== status);
                  change(
                    {
                      target: { value: updatedStatus } as unknown,
                    } as React.ChangeEvent<HTMLInputElement>,
                    'deal_status'
                  );
                }}
              />
              <span>{formatDealStatus(status)}</span>
            </label>
          ))}
        </div>
      </div>
    </CardContent>
  );
}

export default FormFunnel