# PolicyFlow

Visual, node-based pipeline editor for classical ML and LLM fine-tuning.

## Architecture

| Layer | Stack |
|---|---|
| Frontend | React 19 + Vite + ReactFlow + TailwindCSS |
| Backend | FastAPI + Pydantic + scikit-learn |
| Desktop | PyInstaller + pywebview |

## Quick Start

```bash
# Backend
cd backend
pip install -r requirements-minimal.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Frontend (separate terminal)
cd frontend
npm install
npm run dev

# Tests
cd backend
python -m pytest tests/ -v
```

## Execution Flow

```
00_app_factory  → Creates FastAPI app, wires CORS
01_graph_node   → GraphNode Pydantic schema
02_graph_edge   → GraphEdge Pydantic schema
03_graph_payload→ GraphPayload aggregate
04_node_registry→ Singleton node catalog
05_websocket_mgr→ Observer pattern for real-time events
06_graph_parser → Kahn's algorithm O(V+E) topological sort
07_code_generator→ Factory pattern code generation
08_exec_engine  → Strategy pattern ML execution
09_routes       → Route registration factory
```

## Design Patterns

- **Singleton**: `NodeRegistry` — catalog built once, shared across requests
- **Observer**: `WebSocketManager` — clients subscribe, engine broadcasts
- **Factory**: `CodeGenerator` — dispatches per-node-type code renderers
- **Strategy**: `ExecutionEngine` — classical vs LLM execution backends

## Documentation

See [docs/](docs/) for HLD, LLD, UML, and flow diagrams (`.drawio` format).
