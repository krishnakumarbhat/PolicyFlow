import { Handle, Position } from '@xyflow/react';
import { cn } from '../../lib/utils';

const badgeStyles = {
  data: 'bg-sky-500/12 text-sky-300 border-sky-500/30',
  model: 'bg-emerald-500/12 text-emerald-300 border-emerald-500/30',
  training: 'bg-violet-500/12 text-violet-300 border-violet-500/30',
  evaluation: 'bg-orange-500/12 text-orange-300 border-orange-500/30',
};

export const BaseNode = ({ id, data, icon: Icon, category, accent, children }) => {
  const sourcePosition = data.sourcePosition ?? Position.Right;
  const targetPosition = data.targetPosition ?? Position.Left;

  return (
    <div
      className="panel-shell min-w-[280px] rounded-2xl border border-zinc-800/90 bg-zinc-950/95 text-zinc-100 transition-transform duration-200 hover:-translate-y-0.5"
      data-testid={`flow-node-${id}`}
    >
      {data.showTarget !== false && (
        <Handle
          className="!bg-zinc-300"
          id={`${id}-target`}
          position={targetPosition}
          type="target"
        />
      )}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10"
            style={{ backgroundColor: `${accent}22`, color: accent }}
          >
            <Icon size={18} strokeWidth={2} />
          </div>
          <div>
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              {category}
            </p>
            <h3 className="font-mono-ui text-sm font-semibold text-zinc-100">{data.label}</h3>
          </div>
        </div>
        <span
          className={cn(
            'rounded-full border px-2 py-1 font-mono-ui text-[10px] uppercase tracking-[0.18em]',
            badgeStyles[category] ?? badgeStyles.data,
          )}
          data-testid={`flow-node-${id}-category`}
        >
          {data.badge || category}
        </span>
      </div>
      <div className="space-y-3 p-4">
        {data.subtitle && (
          <p className="text-xs leading-relaxed text-zinc-400" data-testid={`flow-node-${id}-subtitle`}>
            {data.subtitle}
          </p>
        )}
        {children}
      </div>
      {data.showSource !== false && (
        <Handle
          className="!bg-zinc-300"
          id={`${id}-source`}
          position={sourcePosition}
          type="source"
        />
      )}
    </div>
  );
};