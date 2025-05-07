import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pipeline } from '@/types/Pipeline';
import { Textarea } from '@/components/ui/textarea';

interface FormPipelineProps {
  data: Pipeline;
  change: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    item: keyof Pipeline,
  ) => void;
}

function FormPipeline({ data, change }: FormPipelineProps) {
  return (
    <CardContent className="space-y-2 min-w-[400px]">
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
          value={data.description}
          placeholder="Nome do cliente"
          onChange={(e) => change(e, 'description')}
        />
      </div>
    </CardContent>
  );
}

export default FormPipeline