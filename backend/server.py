import asyncio
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.core.node_registry import get_node_catalog
from app.engine.code_generator import CodeGenerator
from app.engine.executor import ExecutionEngine
from app.engine.parser import GraphParser
from app.schemas.graph import GraphPayload
from app.services.websocket_manager import WebSocketManager

app = FastAPI(title="PolicyFlow API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

websocket_manager = WebSocketManager()
graph_parser = GraphParser()
code_generator = CodeGenerator()
execution_engine = ExecutionEngine(parser=graph_parser)


@app.get("/api/health")
async def health_check() -> dict:
    return {"status": "ok", "service": "policyflow-backend"}


@app.get("/api/node-catalog")
async def node_catalog() -> dict:
    return get_node_catalog()


@app.post("/api/graphs/validate")
async def validate_graph(payload: GraphPayload) -> dict:
    try:
        return {"execution_order": graph_parser.describe_execution(payload)}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@app.post("/api/export")
async def export_graph_code(payload: GraphPayload) -> dict:
    try:
        execution_order = graph_parser.describe_execution(payload)
        artifact = code_generator.generate(payload, execution_order)
        return artifact
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@app.post("/api/run")
async def run_graph(payload: GraphPayload) -> dict:
    try:
        execution_order = graph_parser.describe_execution(payload)
        artifact = code_generator.generate(payload, execution_order)
        asyncio.create_task(execution_engine.execute(payload, websocket_manager))
        return {"execution_order": execution_order, "mode": execution_engine.select_mode(payload), **artifact}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@app.websocket("/api/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str) -> None:
    await websocket_manager.connect(client_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        websocket_manager.disconnect(client_id, websocket)


ROOT_DIR = Path(__file__).resolve().parent.parent
env_static_dir = os.environ.get("POLICYFLOW_STATIC_DIR")
STATIC_CANDIDATES = []
if env_static_dir:
    STATIC_CANDIDATES.append(Path(env_static_dir))
STATIC_CANDIDATES.extend([ROOT_DIR / "frontend" / "dist", ROOT_DIR / "backend" / "static"])
STATIC_DIR = next((path for path in STATIC_CANDIDATES if path.exists() and (path / "index.html").exists()), None)

if STATIC_DIR:
    assets_dir = STATIC_DIR / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="static-assets")

    @app.get("/{full_path:path}")
    async def frontend_app(full_path: str) -> FileResponse:
        requested = STATIC_DIR / full_path
        if full_path and requested.exists() and requested.is_file():
            return FileResponse(requested)
        return FileResponse(STATIC_DIR / "index.html")