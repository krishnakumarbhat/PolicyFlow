import { Download, Play, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

export const Toolbar = ({ onDownloadJson, onExportCode, onReset, onRun, onValidate, running }) => (
  <div className="panel-shell flex flex-col gap-3 rounded-3xl p-4 lg:flex-row lg:items-center lg:justify-between" data-testid="workspace-toolbar">
    <div>
      <p className="font-mono-ui text-[11px] uppercase tracking-[0.28em] text-zinc-500">PolicyFlow lab</p>
      <h1 className="mt-2 text-3xl font-semibold text-zinc-100 sm:text-4xl">Visual ML + LLM graph studio</h1>
      <p className="mt-2 max-w-3xl text-sm text-zinc-400 sm:text-base">
        Compose classical ML, SFT, LoRA, PPO, DPO, and exportable Python pipelines in one dense workspace.
      </p>
    </div>
    <div className="flex flex-wrap gap-2">
      <Link data-testid="toolbar-home-link" to="/">
        <Button size="sm" variant="ghost">
          <Sparkles size={15} />
          Overview
        </Button>
      </Link>
      <Button data-testid="toolbar-validate-button" onClick={onValidate} size="sm" variant="outline">
        <ShieldCheck size={15} />
        Validate DAG
      </Button>
      <Button data-testid="toolbar-run-button" onClick={onRun} size="sm">
        <Play size={15} />
        {running ? 'Running…' : 'Run graph'}
      </Button>
      <Button data-testid="toolbar-export-button" onClick={onExportCode} size="sm" variant="secondary">
        <Download size={15} />
        Export code
      </Button>
      <Button data-testid="toolbar-download-json-button" onClick={onDownloadJson} size="sm" variant="outline">
        <Download size={15} />
        Graph JSON
      </Button>
      <Button data-testid="toolbar-reset-button" onClick={onReset} size="sm" variant="ghost">
        <RefreshCw size={15} />
        Reset demo
      </Button>
    </div>
  </div>
);