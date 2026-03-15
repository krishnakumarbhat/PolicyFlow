import { Code2, SlidersHorizontal } from 'lucide-react';
import { Input } from '../ui/input';

export const InspectorPanel = ({ exportedCode, onParamChange, selectedNode }) => {
  if (!selectedNode) {
    return (
      <aside className="panel-shell flex h-full flex-col rounded-3xl p-5" data-testid="inspector-panel-empty">
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.28em] text-zinc-500">Inspector</p>
        <h2 className="mt-3 text-lg font-semibold text-zinc-100">Select a node</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Click any node in the graph to edit its parameters and review the generated pipeline code.
        </p>
      </aside>
    );
  }

  return (
    <aside className="panel-shell flex h-full flex-col overflow-hidden rounded-3xl" data-testid="inspector-panel">
      <div className="border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="text-zinc-400" size={16} />
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.28em] text-zinc-500">Node config</p>
        </div>
        <h2 className="mt-2 text-lg font-semibold text-zinc-100">{selectedNode.data.label}</h2>
        <p className="mt-1 text-sm text-zinc-400">{selectedNode.data.subtitle}</p>
      </div>
      <div className="space-y-5 overflow-y-auto px-5 py-5">
        <section className="space-y-3" data-testid="inspector-fields-section">
          {selectedNode.data.schema?.map((field) => (
            <label className="block space-y-2" key={field.key}>
              <span className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-zinc-500">{field.label}</span>
              {field.type === 'select' ? (
                <select
                  className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 text-sm text-zinc-100 outline-none focus:border-blue-400"
                  data-testid={`inspector-field-${field.key}`}
                  onChange={(event) => onParamChange(selectedNode.id, field.key, event.target.value)}
                  value={selectedNode.data.params?.[field.key] ?? ''}
                >
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  data-testid={`inspector-field-${field.key}`}
                  onChange={(event) => onParamChange(selectedNode.id, field.key, event.target.value)}
                  value={selectedNode.data.params?.[field.key] ?? ''}
                />
              )}
            </label>
          ))}
        </section>

        <section className="space-y-3" data-testid="export-code-section">
          <div className="flex items-center gap-2">
            <Code2 className="text-zinc-400" size={15} />
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-zinc-500">Generated python</p>
          </div>
          <pre className="max-h-[340px] overflow-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-xs leading-6 text-zinc-300">
            <code data-testid="exported-python-preview">
              {exportedCode || '# Export the graph to preview readable Python code.'}
            </code>
          </pre>
        </section>
      </div>
    </aside>
  );
};