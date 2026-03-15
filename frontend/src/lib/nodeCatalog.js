const templateLibrary = {
  local_csv: {
    id: 'local_csv',
    renderer: 'dataset',
    label: 'CSV / JSON Dataset',
    category: 'data',
    categoryLabel: 'data ingress',
    badge: 'dataset',
    description: 'Local files, JSONL corpora, parquet, or prompt-completion tables.',
    subtitle: 'Load structured corpora or prompt pairs from a local or mounted path.',
    tags: ['csv', 'json', 'parquet', 'hf-ready'],
    params: {
      sourceType: 'local_file',
      datasetName: 'demo_conversations',
      format: 'csv',
      split: 'train',
    },
    schema: [
      { key: 'sourceType', label: 'Source type', type: 'select', options: ['local_file', 'jsonl', 'parquet', 's3_mount'] },
      { key: 'datasetName', label: 'Dataset name', type: 'text' },
      { key: 'format', label: 'Format', type: 'select', options: ['csv', 'json', 'parquet', 'text'] },
      { key: 'split', label: 'Split', type: 'select', options: ['train', 'validation', 'test'] },
    ],
  },
  hf_dataset: {
    id: 'hf_dataset',
    renderer: 'dataset',
    label: 'Hugging Face Dataset',
    category: 'data',
    categoryLabel: 'data ingress',
    badge: 'dataset',
    description: 'Pull datasets directly from the Hugging Face Hub.',
    subtitle: 'Supports instruction tuning, reward modeling, preference pairs, and evaluation sets.',
    tags: ['datasets', 'hf hub', 'sft', 'dpo'],
    params: {
      sourceType: 'huggingface',
      datasetName: 'trl-internal-testing/hh-rlhf-helpful-base-trl-style',
      format: 'json',
      split: 'train',
    },
    schema: [
      { key: 'sourceType', label: 'Source type', type: 'select', options: ['huggingface', 'local_file'] },
      { key: 'datasetName', label: 'Dataset id', type: 'text' },
      { key: 'format', label: 'Format', type: 'select', options: ['json', 'csv', 'parquet', 'arrow'] },
      { key: 'split', label: 'Split', type: 'select', options: ['train', 'test', 'validation'] },
    ],
  },
  base_llm: {
    id: 'base_llm',
    renderer: 'model',
    label: 'Base LLM Loader',
    category: 'model',
    categoryLabel: 'foundation',
    badge: 'llm',
    description: 'Load causal LMs from transformers, PEFT, or Unsloth-backed paths.',
    subtitle: 'Use HF ids, local checkpoints, quantized adapters, or fused LoRA stacks.',
    tags: ['transformers', 'peft', 'unsloth', 'pytorch'],
    params: {
      modelId: 'meta-llama/Llama-3.2-1B',
      runtime: 'transformers',
      precision: 'bf16',
      deviceMap: 'auto',
    },
    schema: [
      { key: 'modelId', label: 'Model id', type: 'text' },
      { key: 'runtime', label: 'Runtime', type: 'select', options: ['transformers', 'unsloth', 'pytorch', 'tensorflow'] },
      { key: 'precision', label: 'Precision', type: 'select', options: ['bf16', 'fp16', 'fp32', 'int4'] },
      { key: 'deviceMap', label: 'Device map', type: 'select', options: ['auto', 'cuda', 'cpu'] },
    ],
  },
  lora_adapter: {
    id: 'lora_adapter',
    renderer: 'training',
    label: 'LoRA Adapter',
    category: 'training',
    categoryLabel: 'adapters',
    badge: 'peft',
    description: 'Configure LoRA, QLoRA, target modules, rank, and alpha.',
    subtitle: 'Attach PEFT or Unsloth adapters before SFT, PPO, or DPO stages.',
    tags: ['lora', 'qlora', 'peft', 'unsloth'],
    params: {
      strategy: 'lora',
      library: 'peft',
      epochs: '1',
      learningRate: '0.0002',
    },
    schema: [
      { key: 'strategy', label: 'Strategy', type: 'select', options: ['lora', 'qlora'] },
      { key: 'library', label: 'Library', type: 'select', options: ['peft', 'unsloth'] },
      { key: 'epochs', label: 'Warmup epochs', type: 'text' },
      { key: 'learningRate', label: 'Init lr', type: 'text' },
    ],
  },
  sft_trainer: {
    id: 'sft_trainer',
    renderer: 'training',
    label: 'SFT Trainer',
    category: 'training',
    categoryLabel: 'alignment',
    badge: 'trl',
    description: 'Supervised fine-tuning with transformers, TRL, or Keras-compatible trainers.',
    subtitle: 'Great for instruction tuning, response style adaptation, or domain-specific corpora.',
    tags: ['sft', 'trl', 'transformers', 'keras'],
    params: {
      strategy: 'sft',
      library: 'trl',
      epochs: '3',
      learningRate: '0.00002',
    },
    schema: [
      { key: 'strategy', label: 'Strategy', type: 'select', options: ['sft'] },
      { key: 'library', label: 'Library', type: 'select', options: ['trl', 'transformers', 'keras'] },
      { key: 'epochs', label: 'Epochs', type: 'text' },
      { key: 'learningRate', label: 'Learning rate', type: 'text' },
    ],
  },
  ppo_trainer: {
    id: 'ppo_trainer',
    renderer: 'training',
    label: 'PPO / RLHF Trainer',
    category: 'training',
    categoryLabel: 'alignment',
    badge: 'rlhf',
    description: 'Configure policy optimization, rollout batch size, and reward shaping.',
    subtitle: 'Streams reward, KL penalty, and loss metrics back over WebSockets.',
    tags: ['ppo', 'rlhf', 'trl', 'reward-model'],
    params: {
      strategy: 'ppo',
      library: 'trl',
      epochs: '2',
      learningRate: '0.00001',
    },
    schema: [
      { key: 'strategy', label: 'Strategy', type: 'select', options: ['ppo', 'rlhf'] },
      { key: 'library', label: 'Library', type: 'select', options: ['trl', 'transformers', 'pytorch'] },
      { key: 'epochs', label: 'Epochs', type: 'text' },
      { key: 'learningRate', label: 'Learning rate', type: 'text' },
    ],
  },
  dpo_trainer: {
    id: 'dpo_trainer',
    renderer: 'training',
    label: 'DPO Trainer',
    category: 'training',
    categoryLabel: 'alignment',
    badge: 'dpo',
    description: 'Preference optimization for chosen vs rejected samples.',
    subtitle: 'Use pairwise preference data and export a production-ready DPO scaffold.',
    tags: ['dpo', 'trl', 'preferences', 'alignment'],
    params: {
      strategy: 'dpo',
      library: 'trl',
      epochs: '2',
      learningRate: '0.00001',
    },
    schema: [
      { key: 'strategy', label: 'Strategy', type: 'select', options: ['dpo'] },
      { key: 'library', label: 'Library', type: 'select', options: ['trl', 'transformers'] },
      { key: 'epochs', label: 'Epochs', type: 'text' },
      { key: 'learningRate', label: 'Learning rate', type: 'text' },
    ],
  },
  classical_model: {
    id: 'classical_model',
    renderer: 'classical',
    label: 'Classical ML Block',
    category: 'model',
    categoryLabel: 'classical',
    badge: 'ml',
    description: 'Choose XGBoost, LightGBM, CatBoost, Random Forest, or SVM.',
    subtitle: 'Small-data baselines and tabular experiments live next to your LLM graphs.',
    tags: ['xgboost', 'lightgbm', 'catboost', 'sklearn'],
    params: {
      algorithm: 'xgboost',
      library: 'xgboost',
      objective: 'classification',
      metric: 'accuracy',
    },
    schema: [
      { key: 'algorithm', label: 'Algorithm', type: 'select', options: ['xgboost', 'lightgbm', 'catboost', 'random_forest', 'svm'] },
      { key: 'library', label: 'Library', type: 'select', options: ['xgboost', 'lightgbm', 'catboost', 'scikit-learn', 'tensorflow'] },
      { key: 'objective', label: 'Objective', type: 'select', options: ['classification', 'regression', 'ranking'] },
      { key: 'metric', label: 'Metric', type: 'select', options: ['accuracy', 'f1', 'roc_auc', 'rmse'] },
    ],
  },
  metrics_sink: {
    id: 'metrics_sink',
    renderer: 'output',
    label: 'Metrics + Charts',
    category: 'utility',
    categoryLabel: 'telemetry',
    badge: 'metrics',
    description: 'Loss curves, reward traces, accuracy snapshots, and confusion tables.',
    subtitle: 'Attach evaluation sinks to any classical or LLM branch.',
    tags: ['metrics', 'charts', 'evaluation', 'streaming'],
    params: {
      mode: 'metrics',
      destination: 'workspace_console',
    },
    schema: [
      { key: 'mode', label: 'Mode', type: 'select', options: ['metrics', 'export'] },
      { key: 'destination', label: 'Destination', type: 'select', options: ['workspace_console', 'tensorboard', 'wandb_stub'] },
    ],
  },
  inference_sandbox: {
    id: 'inference_sandbox',
    renderer: 'output',
    label: 'Inference Sandbox',
    category: 'utility',
    categoryLabel: 'deployment',
    badge: 'sandbox',
    description: 'Chat-style sandbox for prompt testing, regression checks, and eval prompts.',
    subtitle: 'Use for quick prompt QA after SFT, PPO, or DPO stages.',
    tags: ['chat', 'sandbox', 'inference', 'debug'],
    params: {
      mode: 'sandbox',
      destination: 'local_preview',
    },
    schema: [
      { key: 'mode', label: 'Mode', type: 'select', options: ['sandbox', 'export'] },
      { key: 'destination', label: 'Destination', type: 'select', options: ['local_preview', 'fastapi_endpoint', 'hf_hub'] },
    ],
  },
  demo_output: {
    id: 'demo_output',
    renderer: 'output',
    label: 'Export to Hub',
    category: 'utility',
    categoryLabel: 'delivery',
    badge: 'ship',
    description: 'Export checkpoints, adapters, configs, and generated Python scripts.',
    subtitle: 'Acts as the final handoff node for packaging and code export flows.',
    tags: ['hub', 'export', 'packaging', 'script'],
    params: {
      mode: 'export',
      destination: 'huggingface_hub',
    },
    schema: [
      { key: 'mode', label: 'Mode', type: 'select', options: ['export'] },
      { key: 'destination', label: 'Destination', type: 'select', options: ['huggingface_hub', 'local_folder', 'desktop_bundle'] },
    ],
  },
};

const groupMap = [
  { key: 'data', label: 'Data Nodes' },
  { key: 'model', label: 'Model Nodes' },
  { key: 'training', label: 'Training + Alignment' },
  { key: 'utility', label: 'Utility / Output' },
];

export const fallbackGroups = groupMap.map((group) => ({
  ...group,
  templates: Object.values(templateLibrary).filter((template) => template.category === group.key),
}));

export const buildNode = (templateId, position, overrides = {}) => {
  const template = templateLibrary[templateId];

  if (!template) {
    throw new Error(`Unknown template ${templateId}`);
  }

  return {
    id: overrides.id ?? `${templateId}-${crypto.randomUUID().slice(0, 8)}`,
    type: template.renderer,
    position,
    data: {
      label: template.label,
      subtitle: template.subtitle,
      badge: template.badge,
      params: { ...template.params, ...(overrides.params ?? {}) },
      schema: template.schema,
    },
  };
};

export const sampleGraph = {
  nodes: [
    buildNode('hf_dataset', { x: 80, y: 150 }, { id: 'node-dataset-1' }),
    buildNode('base_llm', { x: 400, y: 110 }, { id: 'node-model-1' }),
    buildNode('lora_adapter', { x: 720, y: 90 }, { id: 'node-lora-1' }),
    buildNode('ppo_trainer', { x: 1030, y: 110 }, { id: 'node-ppo-1' }),
    buildNode('inference_sandbox', { x: 1340, y: 110 }, { id: 'node-sandbox-1' }),
    buildNode('classical_model', { x: 410, y: 360 }, { id: 'node-classical-1' }),
    buildNode('metrics_sink', { x: 730, y: 360 }, { id: 'node-metrics-1' }),
  ],
  edges: [
    { id: 'edge-1', source: 'node-dataset-1', target: 'node-model-1', animated: true },
    { id: 'edge-2', source: 'node-model-1', target: 'node-lora-1', animated: true },
    { id: 'edge-3', source: 'node-lora-1', target: 'node-ppo-1', animated: true },
    { id: 'edge-4', source: 'node-ppo-1', target: 'node-sandbox-1', animated: true },
    { id: 'edge-5', source: 'node-dataset-1', target: 'node-classical-1', animated: true },
    { id: 'edge-6', source: 'node-classical-1', target: 'node-metrics-1', animated: true },
  ],
};

export const serializeGraph = (nodes, edges) => ({
  nodes: nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: node.data,
  })),
  edges: edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
  })),
});