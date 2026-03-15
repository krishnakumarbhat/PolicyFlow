# PolicyFlow Architecture

## 1. System layout

### Frontend
- **React + ReactFlow** powers the visual node editor.
- **TailwindCSS** handles the dense dark-mode UI.
- **Workspace regions**: node palette, graph canvas, inspector/code preview, run console/metrics.

### Backend
- **FastAPI** receives serialized DAG payloads.
- **GraphParser** validates edges and performs topological sorting.
- **CodeGenerator** translates graph nodes into readable config-driven Python scripts.
- **ExecutionEngine** streams run logs/metrics over WebSockets and performs lightweight local smoke tests.

### Desktop packaging
- Build the frontend to static assets.
- Serve those assets through FastAPI.
- Launch a native desktop window with **pywebview**.
- Package the launcher, backend, and frontend build using **PyInstaller**.

## 2. Graph flow

1. User adds node templates in the React workspace.
2. Frontend serializes nodes and edges into a JSON DAG.
3. Backend validates the graph and resolves execution order.
4. Code generator builds a standalone Python script matching the DAG.
5. Execution engine either:
   - runs a lightweight local classical-ML smoke test, or
   - performs dependency-aware dry-run validation for advanced LLM graphs.
6. WebSocket messages stream logs and metrics back to the UI.

## 3. Node families supported

- **Data**: CSV/JSON/parquet, Hugging Face datasets
- **Model**: base LLM loaders, classical ML block
- **Training**: LoRA, SFT, PPO/RLHF, DPO
- **Output**: metrics, inference sandbox, export sink

## 4. Algorithm / library breadth

- LLM stack: `transformers`, `trl`, `peft`, `unsloth`, `pytorch`, `tensorflow`, `keras`
- Classical ML: `scikit-learn`, `xgboost`, `lightgbm`, `catboost`
- Packaging: `pywebview`, `pyinstaller`

## 5. Recommended next steps

- Add persistent project save/load to disk or database
- Add a proper training job queue for long-running GPU workloads
- Add per-node form schemas driven directly from backend metadata
- Add a richer inference sandbox with multi-turn chat and eval prompts