import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Pipeline } from '@/types/Pipeline';
import { Edit, Trash } from 'lucide-react';
import CreatePipelineModal from '../pipelines/create';
import { Label } from '@/components/ui/label';
import UpdatePipelineModal from '../pipelines/update';
import { useFunnel } from '@/context/funnel-context';
import DeletePipelineModal from '../pipelines/delete';

interface PipelinesProps {
  funnelId: string;
  pipelines: Pipeline[];
  setPipelines: (pipelines: Pipeline[]) => void;
  getData: () => void;
}

function Pipelines({
  funnelId,
  pipelines,
  setPipelines,
  getData,
}: PipelinesProps) {
  const sortedPipelines = [...pipelines].sort(
    (a, b) => a.position! - b.position!,
  );
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [id, setId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const { createPipeline } = useFunnel()

  const handleCreatePipeline = (funnelId: string, newPipeline: Pipeline) => {
    console.log('funnelId', funnelId);
    const updatedPipelines = [
      ...pipelines,
      { ...newPipeline, position: pipelines.length },
    ];
    setPipelines(updatedPipelines);
  };

  const handleRemovePipeline = (index: number) => {
    const updatedPipelines = [...sortedPipelines];
    updatedPipelines.splice(index, 1);
    updatedPipelines.forEach((p, idx) => (p.position = idx));
    setPipelines(updatedPipelines);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newPipelines = [...sortedPipelines];
    [newPipelines[index - 1], newPipelines[index]] = [
      newPipelines[index],
      newPipelines[index - 1],
    ];
    newPipelines.forEach((p, idx) => (p.position = idx));
    setPipelines(newPipelines);
  };

  const moveDown = (index: number) => {
    if (index === sortedPipelines.length - 1) return;
    const newPipelines = [...sortedPipelines];
    [newPipelines[index], newPipelines[index + 1]] = [
      newPipelines[index + 1],
      newPipelines[index],
    ];
    newPipelines.forEach((p, idx) => (p.position = idx));
    setPipelines(newPipelines);
  };

  function openPipeline(id: string) {
    setId(id);
    setUpdateModal(!updateModal);
  }

  function deletePipeline(id: string) {
    setDeleteId(id);
    setDeleteModal(!deleteModal);
  }

  return (
    <>
      {createModal && (
        <CreatePipelineModal
          open={createModal}
          funnelId={funnelId}
          close={() => setCreateModal(false)}
          createPipeline={!funnelId ? handleCreatePipeline : createPipeline}
          getData={getData}
        />
      )}
      {id && updateModal && (
        <UpdatePipelineModal
          id={id}
          open={updateModal}
          close={() => openPipeline('')}
          getData={getData}
        />
      )}
      {deleteId && deleteModal && (
        <DeletePipelineModal
          id={deleteId}
          open={deleteModal}
          close={() => deletePipeline('')}
          getData={getData}
        />
      )}
      <CardContent className="space-y-2 w-full flex flex-col justify-start items-center h-[280px] overflow-auto">
        <Label htmlFor="pipelines" className="w-full text-start">
          Pipelines
        </Label>

        {sortedPipelines.map((e, index) => (
          <div
            key={e.name}
            className="grid grid-cols-3 items-center gap-2 border border-slate-500 w-full p-3 rounded-lg relative"
          >
            <div className="flex flex-col items-start gap-2">
              <h3>{e.name}</h3>
              <span className="text-[10px] text-muted-foreground max-w-[200px] text-nowrap overflow-hidden overflow-ellipsis">
                {e.description}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span>{e.position}</span>
              <div className="flex flex-col">
                <Button
                  size={'icon'}
                  variant={'ghost'}
                  type="button"
                  onClick={() => moveUp(index)}
                  className="text-sm text-blue-500 h-auto"
                >
                  ↑
                </Button>
                <Button
                  onClick={() => moveDown(index)}
                  className="text-sm text-blue-500 h-auto"
                  size={'icon'}
                  variant={'ghost'}
                  type="button"
                >
                  ↓
                </Button>
              </div>
            </div>
            <Button
              onClick={() => openPipeline(e.id!)}
              className="text-sm"
              variant={'ghost'}
              type="button"
              size={'icon'}
            >
              <Edit />
            </Button>
            <Button
              onClick={() => !funnelId ? handleRemovePipeline(index) : deletePipeline(e.id!)}
              className="text-sm text-red-500 absolute right-3 top-[25%]"
              variant={'ghost'}
              type="button"
              size={'icon'}
            >
              <Trash />
            </Button>
          </div>
        ))}
        {pipelines.length == 0 && (
          <span className="w-full text-start text-[11px] text-muted-foreground">
            Adicione etapas ao seu funil
          </span>
        )}
        <Button
          className="w-full"
          type="button"
          onClick={() => setCreateModal(true)}
        >
          Adicionar pipeline
        </Button>
      </CardContent>
    </>
  );
}

export default Pipelines;
