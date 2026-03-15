import { Settings2, Zap } from 'lucide-react';
import { BaseNode } from './BaseNode';

const modeIcon = {
  sft: Settings2,
  ppo: Zap,
  dpo: Zap,
  rlhf: Zap,
  lora: Settings2,
};

export const TrainingNode = ({ id, data }) => {
  const Icon = modeIcon[data.params?.strategy] ?? Zap;

  return (
    <BaseNode accent="#a855f7" category="training" data={data} icon={Icon} id={id}>
      <div className="grid gap-2 text-xs text-zinc-300">
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/8 px-3 py-2">
          <p className="font-mono-ui text-zinc-500">strategy</p>
          <p className="mt-1 text-zinc-100" data-testid={`flow-node-${id}-strategy`}>
            {data.params?.strategy}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2">
            <p className="font-mono-ui text-zinc-500">epochs</p>
            <p data-testid={`flow-node-${id}-epochs`}>{data.params?.epochs}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2">
            <p className="font-mono-ui text-zinc-500">lr</p>
            <p data-testid={`flow-node-${id}-lr`}>{data.params?.learningRate}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2">
            <p className="font-mono-ui text-zinc-500">lib</p>
            <p data-testid={`flow-node-${id}-library`}>{data.params?.library}</p>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};