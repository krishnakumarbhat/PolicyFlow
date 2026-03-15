# PolicyFlow

PolicyFlow is a visual, node-based pipeline editor for classical ML and LLM fine-tuning.

## What this scaffold includes

- Dense ReactFlow workspace with custom dataset, model, training, classical ML, and output nodes
- FastAPI DAG parser with topological sorting, readable Python export, and WebSocket log streaming
- Lightweight local execution for classical ML smoke tests plus validation/dry-run flow for heavy LLM graphs
- Desktop packaging path using frontend static build + FastAPI + pywebview + PyInstaller

## Project structure

```text
/app
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── engine/
│   │   ├── schemas/
│   │   └── services/
│   ├── requirements-desktop.txt
│   ├── requirements-optional.txt
│   ├── requirements.txt
│   └── server.py
├── desktop/
│   ├── launcher.py
│   └── pyinstaller/ml_forge.spec
├── docs/
│   └── architecture.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   └── pages/
│   ├── .env
│   └── vite.config.js
├── scripts/
│   ├── build_desktop.ps1
│   ├── build_desktop.sh
│   └── build_frontend.sh
└── tests/
    └── fixtures/
```

## Frontend

- React 19 + Vite
- TailwindCSS
- ReactFlow via `@xyflow/react`
- Dense node-lab layout with palette, canvas, inspector, logs, and metrics

## Backend

- FastAPI
- WebSocket event stream at `/api/ws/{client_id}`
- DAG validation at `/api/graphs/validate`
- Code export at `/api/export`
- Execution trigger at `/api/run`

## Packaging

```bash
bash /app/scripts/build_frontend.sh
bash /app/scripts/build_desktop.sh
```

Install optional heavy ML libraries only when you want full local training support:

```bash
pip install -r /app/backend/requirements-optional.txt
```
