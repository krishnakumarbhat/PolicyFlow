import { ArrowRight, Box, Cpu, FolderTree, MonitorSmartphone, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const architectureCards = [
  {
    icon: Workflow,
    title: 'Visual graph editor',
    text: 'React + ReactFlow drive a dense node-lab workspace with palette, inspector, graph export, and run console.',
  },
  {
    icon: Cpu,
    title: 'Execution engine',
    text: 'FastAPI parses DAGs, streams logs over WebSockets, resolves dependency order, and runs lightweight local demos.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Desktop packaging',
    text: 'Frontend builds to static assets, FastAPI serves the bundle, and PyInstaller + pywebview package native executables.',
  },
];

const folderTree = `policyflow/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   └── pages/
│   ├── .env
│   └── vite.config.js
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── engine/
│   │   ├── schemas/
│   │   └── services/
│   ├── server.py
│   └── requirements.txt
├── desktop/
│   ├── launcher.py
│   └── pyinstaller/ml_forge.spec
├── docs/
├── scripts/
└── tests/fixtures/`;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-transparent px-4 py-6 text-zinc-50 sm:px-6 lg:px-8" data-testid="home-page">
      <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-6">
        <section className="panel-shell overflow-hidden rounded-[32px] px-6 py-8 sm:px-8 lg:px-10" data-testid="home-hero-section">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.32em] text-sky-300">Principal AI architecture</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
                PolicyFlow turns ML, SFT, RLHF, DPO, and classical training into an executable visual graph.
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
                This starter ships a complete scaffold: node-based editor, backend DAG parser, live WebSocket feedback,
                readable Python export, and desktop packaging support.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link data-testid="open-workspace-link" to="/workspace">
                  <Button size="lg">
                    Open workspace
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <a data-testid="read-architecture-link" href="#architecture-overview">
                  <Button size="lg" variant="outline">
                    Architecture plan
                  </Button>
                </a>
              </div>
            </div>

            <div className="grid gap-3" data-testid="hero-capability-grid">
              {[
                'PyTorch / Transformers / PEFT / TRL / Unsloth',
                'TensorFlow / Keras / scikit-learn / XGBoost / LightGBM / CatBoost',
                'Live logs, metrics, JSON DAG export, readable code generation, desktop bundling',
              ].map((item) => (
                <div className="hud-pill rounded-2xl p-4 text-sm text-zinc-300" data-testid={`hero-capability-${item.slice(0, 12)}`} key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3" data-testid="architecture-card-grid" id="architecture-overview">
          {architectureCards.map((card) => {
            const Icon = card.icon;

            return (
              <article className="panel-shell rounded-3xl p-6" data-testid={`architecture-card-${card.title}`} key={card.title}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 text-zinc-100">
                  <Icon size={20} />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-zinc-100">{card.title}</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{card.text}</p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="panel-shell rounded-3xl p-6" data-testid="folder-structure-card">
            <div className="flex items-center gap-2">
              <FolderTree className="text-zinc-400" size={18} />
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-zinc-500">Folder structure</p>
            </div>
            <pre className="mt-4 overflow-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-xs leading-6 text-zinc-300">
              <code data-testid="folder-structure-code">{folderTree}</code>
            </pre>
          </article>

          <article className="panel-shell rounded-3xl p-6" data-testid="implementation-scope-card">
            <div className="flex items-center gap-2">
              <Box className="text-zinc-400" size={18} />
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-zinc-500">What’s implemented</p>
            </div>
            <div className="mt-4 grid gap-3">
              {[
                'Custom node types: dataset, base LLM, LoRA/SFT/PPO training, classical ML, metrics, inference/export.',
                'FastAPI DAG parser with topological sorting, validation endpoint, code export endpoint, and /api/ws live stream.',
                'Readable config-first Python export for transformers, TRL, PEFT, classical ML, and packaging-ready serving.',
                'Desktop packaging scripts using built frontend assets + FastAPI + pywebview + PyInstaller spec file.',
              ].map((item) => (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-300" data-testid={`implemented-item-${item.slice(0, 14)}`} key={item}>
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}