import { Boxes, Database, FlaskConical, Plus, Sparkles, Zap } from 'lucide-react';
import { Button } from '../ui/button';

const icons = {
  data: Database,
  model: Boxes,
  training: Zap,
  utility: FlaskConical,
};

export const NodePalette = ({ groups, onAddNode }) => (
  <aside className="panel-shell flex h-full flex-col overflow-hidden rounded-3xl" data-testid="node-palette-panel">
    <div className="border-b border-zinc-800 px-5 py-4">
      <p className="font-mono-ui text-[11px] uppercase tracking-[0.28em] text-zinc-500">Node palette</p>
      <h2 className="mt-2 text-lg font-semibold text-zinc-100">Modeling primitives</h2>
      <p className="mt-1 text-sm text-zinc-400">Drop in datasets, model stacks, adapters, trainers, and outputs.</p>
    </div>
    <div className="space-y-5 overflow-y-auto px-4 py-4">
      {groups.map((group) => {
        const Icon = icons[group.key] ?? Sparkles;

        return (
          <section key={group.key} className="space-y-3" data-testid={`node-group-${group.key}`}>
            <div className="flex items-center gap-2 px-1">
              <Icon className="text-zinc-400" size={15} />
              <h3 className="font-mono-ui text-xs uppercase tracking-[0.2em] text-zinc-400">{group.label}</h3>
            </div>
            <div className="space-y-2">
              {group.templates.map((template) => (
                <button
                  className="group flex w-full flex-col rounded-2xl border border-zinc-800 bg-zinc-900/75 px-3 py-3 text-left transition-[border-color,transform,background-color] duration-200 hover:-translate-y-0.5 hover:border-blue-400/60 hover:bg-zinc-900"
                  data-testid={`palette-template-${template.id}`}
                  key={template.id}
                  onClick={() => onAddNode(template.id)}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-ui text-xs uppercase tracking-[0.14em] text-zinc-500">
                      {template.categoryLabel}
                    </span>
                    <Plus className="text-zinc-500 transition-colors group-hover:text-blue-300" size={14} />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-zinc-100">{template.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">{template.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {template.tags.slice(0, 4).map((tag) => (
                      <span
                        className="rounded-full border border-zinc-700 px-2 py-1 font-mono-ui text-[10px] uppercase tracking-[0.16em] text-zinc-400"
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
    <div className="border-t border-zinc-800 px-4 py-4">
      <Button
        className="w-full"
        data-testid="palette-add-demo-graph-button"
        onClick={() => onAddNode('demo_output')}
        variant="outline"
      >
        <Sparkles size={16} />
        Add export sink
      </Button>
    </div>
  </aside>
);