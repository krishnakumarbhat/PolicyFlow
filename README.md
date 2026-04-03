# PolicyFlow

Visual, node-based pipeline editor for classical ML and LLM fine-tuning.

See full documentation in [docs/](docs/README.md).

## Quick Start

```bash
# Backend
cd backend
pip install -r requirements-minimal.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Frontend (separate terminal)
cd frontend
npm install && npm run dev

# Tests
cd backend
python -m pytest tests/test_api.py -v
```

## Project Structure

```
PolicyFlow/
├── .gitignore
├── README.md
├── backend/
│   ├── server.py                 ← Entry point
│   ├── src/
│   │   ├── 00_app_factory.py     ← FastAPI + CORS
│   │   ├── 01_graph_node.py      ← GraphNode schema
│   │   ├── 02_graph_edge.py      ← GraphEdge schema
│   │   ├── 03_graph_payload.py   ← GraphPayload aggregate
│   │   ├── 04_node_registry.py   ← Singleton catalog
│   │   ├── 05_websocket_manager.py ← Observer pattern
│   │   ├── 06_graph_parser.py    ← Kahn's O(V+E) DAG sort
│   │   ├── 07_code_generator.py  ← Factory pattern codegen
│   │   ├── 08_execution_engine.py ← Strategy pattern
│   │   └── 09_routes.py          ← Route factory
│   └── tests/
├── frontend/                      ← React 19 + Vite
├── desktop/                       ← PyInstaller + pywebview
├── docs/                          ← HLD, LLD, UML, flow (.drawio)
└── scripts/                       ← Build automation
```

## Design Patterns

| Pattern | Class | Purpose |
|---|---|---|
| Singleton | `NodeRegistry` | Catalog built once, shared everywhere |
| Observer | `WebSocketManager` | Broadcast events to subscribed clients |
| Factory | `CodeGenerator` | Per-node-type code rendering dispatch |
| Strategy | `ExecutionEngine` | Classical vs LLM execution backends |

