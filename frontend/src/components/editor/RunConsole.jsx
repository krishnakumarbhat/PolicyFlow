import { Activity, ScrollText, TerminalSquare } from 'lucide-react';

export const RunConsole = ({ logs, metrics, runMode }) => (
  <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]" data-testid="run-console-panel">
    <div className="panel-shell rounded-3xl p-4">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <ScrollText className="text-zinc-400" size={16} />
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-zinc-500">Execution log</p>
        </div>
        <span className="rounded-full border border-zinc-700 px-2 py-1 font-mono-ui text-[10px] uppercase tracking-[0.18em] text-zinc-400" data-testid="run-mode-value">
          {runMode}
        </span>
      </div>
      <div className="mt-4 max-h-[240px] space-y-2 overflow-auto font-mono-ui text-xs text-zinc-300">
        {logs.length ? (
          logs.map((log, index) => (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/75 px-3 py-2" data-testid={`execution-log-${index}`} key={`${log.timestamp}-${index}`}>
              <span className="text-zinc-500">[{log.timestamp}]</span> {log.message}
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-800 px-3 py-6 text-center text-zinc-500">
            Run a graph to watch streamed logs appear here.
          </div>
        )}
      </div>
    </div>
    <div className="panel-shell rounded-3xl p-4">
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <Activity className="text-zinc-400" size={16} />
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-zinc-500">Live metrics</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {metrics.length ? (
          metrics.map((metric) => (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/75 p-4" data-testid={`metric-card-${metric.label}`} key={metric.label}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-zinc-500">{metric.label}</p>
                <TerminalSquare className="text-blue-300" size={14} />
              </div>
              <p className="mt-2 text-2xl font-semibold text-zinc-50" data-testid={`metric-value-${metric.label}`}>
                {metric.value}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{metric.context}</p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-800 px-3 py-6 text-center text-zinc-500">
            Loss, accuracy, reward score, and epoch progress stream here.
          </div>
        )}
      </div>
    </div>
  </section>
);