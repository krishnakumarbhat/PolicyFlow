import { GitBranchPlus, Network, TimerReset } from 'lucide-react';

export const StatusStrip = ({ edgeCount, nodeCount, selectedName }) => {
  const stats = [
    { label: 'nodes', value: nodeCount, icon: Network },
    { label: 'edges', value: edgeCount, icon: GitBranchPlus },
    { label: 'selected', value: selectedName || 'none', icon: TimerReset },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3" data-testid="workspace-status-strip">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div className="hud-pill rounded-2xl px-4 py-3" data-testid={`status-card-${item.label}`} key={item.label}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300">
                <Icon size={15} />
              </div>
              <div>
                <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-zinc-500">{item.label}</p>
                <p className="text-sm font-semibold text-zinc-100">{item.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};