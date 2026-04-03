"""09_routes.py — Factory: Attaches all API endpoints to the FastAPI application.

Why: Centralising route registration in one file makes the API surface
discoverable and keeps the app factory (00) free of business logic.
"""

import asyncio

from fastapi import HTTPException, WebSocket, WebSocketDisconnect

from src import load_module

_m03 = load_module("03_graph_payload")
_m04 = load_module("04_node_registry")
_m05 = load_module("05_websocket_manager")
_m06 = load_module("06_graph_parser")
_m07 = load_module("07_code_generator")
_m08 = load_module("08_execution_engine")

GraphPayload = _m03.GraphPayload
NodeRegistry = _m04.NodeRegistry
WebSocketManager = _m05.WebSocketManager
GraphParser = _m06.GraphParser
CodeGenerator = _m07.CodeGenerator
ExecutionEngine = _m08.ExecutionEngine


def register_routes(app) -> None:
    """Wire all HTTP and WebSocket routes onto the given FastAPI instance."""

    # Singletons / shared instances
    registry = NodeRegistry()
    ws_manager = WebSocketManager()
    parser = GraphParser()
    codegen = CodeGenerator()
    engine = ExecutionEngine(parser=parser)

    @app.get("/api/health")
    async def health_check() -> dict:
        return {"status": "ok", "service": "policyflow-backend"}

    @app.get("/api/node-catalog")
    async def node_catalog() -> dict:
        return registry.get_catalog()

    @app.post("/api/graphs/validate")
    async def validate_graph(payload: GraphPayload) -> dict:
        try:
            return {"execution_order": parser.describe_execution(payload)}
        except ValueError as error:
            raise HTTPException(status_code=400, detail=str(error)) from error

    @app.post("/api/export")
    async def export_graph_code(payload: GraphPayload) -> dict:
        try:
            execution_order = parser.describe_execution(payload)
            return codegen.generate(payload, execution_order)
        except ValueError as error:
            raise HTTPException(status_code=400, detail=str(error)) from error

    @app.post("/api/run")
    async def run_graph(payload: GraphPayload) -> dict:
        try:
            execution_order = parser.describe_execution(payload)
            artifact = codegen.generate(payload, execution_order)
            asyncio.create_task(engine.execute(payload, ws_manager))
            return {
                "execution_order": execution_order,
                "mode": engine.select_mode(payload),
                **artifact,
            }
        except ValueError as error:
            raise HTTPException(status_code=400, detail=str(error)) from error

    @app.websocket("/api/ws/{client_id}")
    async def websocket_endpoint(websocket: WebSocket, client_id: str) -> None:
        await ws_manager.connect(client_id, websocket)
        try:
            while True:
                await websocket.receive_text()
        except WebSocketDisconnect:
            ws_manager.disconnect(client_id, websocket)
