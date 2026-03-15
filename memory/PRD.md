# PolicyFlow PRD

## Original Problem Statement
Build a comprehensive visual, drag-and-drop, node-based pipeline editor for Machine Learning and LLM fine-tuning similar to ComfyUI, covering classical ML, SFT, RLHF, PPO, DPO, code export, live WebSocket feedback, and desktop packaging. The user chose full scope, maximum library breadth, hybrid execution, dense pro node-lab UI, and readable + config-driven code export.

## Architecture Decisions
- Frontend uses React + Vite + ReactFlow + TailwindCSS with a dense dark node-lab layout, separate overview and workspace pages, and custom node renderers.
- Backend uses FastAPI with a GraphParser for DAG validation/topological sorting, a CodeGenerator for readable Python export, and an ExecutionEngine for lightweight local runs plus dry-run validation for heavy LLM flows.
- WebSocket streaming is exposed at `/api/ws/{client_id}` for logs, run status, and metrics.
- Desktop packaging uses frontend static build + FastAPI serving + pywebview launcher + PyInstaller spec.
- Broad algorithm coverage is exposed through node options for transformers, TRL, PEFT, Unsloth, PyTorch, TensorFlow/Keras, scikit-learn, XGBoost, LightGBM, and CatBoost.

## What's Implemented
- ReactFlow workspace with custom Dataset, Base Model, Training, Classical ML, and Output nodes.
- Node palette, inspector panel, graph JSON export, code export preview, run console, and live metrics cards.
- FastAPI endpoints: `/api/health`, `/api/node-catalog`, `/api/graphs/validate`, `/api/export`, `/api/run`, and `/api/ws/{client_id}`.
- Readable Python generator for dataset -> model -> LoRA/SFT/PPO/DPO and classical ML blocks.
- Lightweight local execution for classical smoke tests and dry-run validation/log streaming for advanced LLM graphs.
- Desktop packaging assets: launcher, optional desktop requirements, build scripts, and dynamic PyInstaller spec.
- Docs: README, architecture overview, sample graph fixture.

## Prioritized Backlog
### P0
- Add persistent save/load for projects and graph versions.
- Add long-running GPU job orchestration and queued execution workers.
- Add richer backend validation for port compatibility, datatype compatibility, and training-node prerequisites.

### P1
- Add tokenizer, reward model, train/test split, evaluation matrix, and Hugging Face Hub auth/publish flows.
- Add richer inference sandbox with multi-turn chat, prompt sets, and regression testing.
- Add schema-driven forms sourced entirely from backend node definitions.

### P2
- Add collaborative editing, templates marketplace, and run history dashboards.
- Add visual loss charts, experiment comparison, and artifact lineage views.
- Add native installer polish, icons, signing, and platform-specific build automation.

## Next Tasks
1. Expand execution engine from smoke-test/dry-run into full trainer adapters for GPU-backed jobs.
2. Add project persistence and artifact storage.
3. Add deeper node library coverage and per-node validation constraints.
