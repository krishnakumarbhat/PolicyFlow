import { Code2, FlaskConical, LineChart } from 'lucide-react';
import { BaseNode } from './BaseNode';

const outputIcon = {
  metrics: LineChart,
  sandbox: FlaskConical,
  export: Code2,
};

export const OutputNode = ({ id, data }) => {
  const Icon = outputIcon[data.params?.mode] ?? Code2;

  return (
    <BaseNode accent="#f97316" category="evaluation" data={data} icon={Icon} id={id}>
      <div className="space-y-2 text-xs text-zinc-300">
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/8 px-3 py-2">
          <p className="font-mono-ui text-zinc-500">mode</p>
          <p className="mt-1 text-zinc-100" data-testid={`flow-node-${id}-mode`}>
            {data.params?.mode}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2">
          <p className="font-mono-ui text-zinc-500">target</p>
          <p data-testid={`flow-node-${id}-target`}>{data.params?.destination}</p>
        </div>
      </div>
    </BaseNode>
  );
};