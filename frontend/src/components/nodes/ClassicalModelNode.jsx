import { BrainCircuit, ChartColumn } from 'lucide-react';
import { BaseNode } from './BaseNode';

const classicalIcon = {
  xgboost: ChartColumn,
  lightgbm: ChartColumn,
  catboost: ChartColumn,
  random_forest: BrainCircuit,
  svm: BrainCircuit,
};

export const ClassicalModelNode = ({ id, data }) => {
  const Icon = classicalIcon[data.params?.algorithm] ?? ChartColumn;

  return (
    <BaseNode accent="#f97316" category="evaluation" data={data} icon={Icon} id={id}>
      <div className="space-y-2 text-xs text-zinc-300">
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/8 px-3 py-2">
          <p className="font-mono-ui text-zinc-500">algorithm</p>
          <p className="mt-1 text-zinc-100" data-testid={`flow-node-${id}-algorithm`}>
            {data.params?.algorithm}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2">
            <p className="font-mono-ui text-zinc-500">library</p>
            <p data-testid={`flow-node-${id}-classical-library`}>{data.params?.library}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2">
            <p className="font-mono-ui text-zinc-500">objective</p>
            <p data-testid={`flow-node-${id}-objective`}>{data.params?.objective}</p>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};