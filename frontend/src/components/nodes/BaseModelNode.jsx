import { Box, Cpu, Sparkles } from 'lucide-react';
import { BaseNode } from './BaseNode';

const engineIcon = {
  transformers: Sparkles,
  unsloth: Cpu,
  pytorch: Box,
  tensorflow: Cpu,
};

export const BaseModelNode = ({ id, data }) => {
  const Icon = engineIcon[data.params?.runtime] ?? Box;

  return (
    <BaseNode accent="#22c55e" category="model" data={data} icon={Icon} id={id}>
      <div className="space-y-2 text-xs text-zinc-300">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3 py-2">
          <p className="font-mono-ui text-zinc-500">base model</p>
          <p className="mt-1 font-medium text-zinc-100" data-testid={`flow-node-${id}-model-id`}>
            {data.params?.modelId}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2">
            <p className="font-mono-ui text-zinc-500">runtime</p>
            <p data-testid={`flow-node-${id}-runtime`}>{data.params?.runtime}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2">
            <p className="font-mono-ui text-zinc-500">precision</p>
            <p data-testid={`flow-node-${id}-precision`}>{data.params?.precision}</p>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};