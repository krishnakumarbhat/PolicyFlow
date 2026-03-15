import { Database, FileJson2, FileSpreadsheet } from 'lucide-react';
import { BaseNode } from './BaseNode';

const formatIcon = {
  csv: FileSpreadsheet,
  json: FileJson2,
  parquet: Database,
  text: Database,
};

export const DatasetNode = ({ id, data }) => {
  const SourceIcon = formatIcon[data.params?.format] ?? Database;

  return (
    <BaseNode accent="#0ea5e9" category="data" data={data} icon={SourceIcon} id={id}>
      <div className="grid gap-2 text-xs text-zinc-300">
        <div className="flex items-center justify-between rounded-xl border border-sky-500/20 bg-sky-500/8 px-3 py-2">
          <span className="font-mono-ui text-zinc-400">source</span>
          <span data-testid={`flow-node-${id}-source-value`}>{data.params?.sourceType}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2">
          <span className="font-mono-ui text-zinc-400">dataset</span>
          <span data-testid={`flow-node-${id}-dataset-name`}>{data.params?.datasetName}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2">
          <span className="font-mono-ui text-zinc-400">format</span>
          <span data-testid={`flow-node-${id}-dataset-format`}>{data.params?.format}</span>
        </div>
      </div>
    </BaseNode>
  );
};