"""00_app_factory.py — Application Factory: Creates and configures the FastAPI instance.

Why: The factory pattern decouples app construction from route registration
and static file serving. This is the composition root — the single place
where all parts are wired together.

Execution flow: 00_app_factory → 09_routes → (04-08 services/engine)
"""

import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from src import load_module

_m09 = load_module("09_routes")
register_routes = _m09.register_routes


def create_app() -> FastAPI:
    """Build the fully configured FastAPI application."""
    app = FastAPI(title="PolicyFlow API", version="0.2.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_routes(app)
    _mount_static(app)

    return app


def _mount_static(app: FastAPI) -> None:
    """Serve the built frontend if it exists on disk."""
    root_dir = Path(__file__).resolve().parent.parent.parent
    env_static = os.environ.get("POLICYFLOW_STATIC_DIR")

    candidates = []
    if env_static:
        candidates.append(Path(env_static))
    candidates.extend([root_dir / "frontend" / "dist", root_dir / "backend" / "static"])

    static_dir = next((p for p in candidates if p.exists() and (p / "index.html").exists()), None)
    if not static_dir:
        return

    assets_dir = static_dir / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="static-assets")

    @app.get("/{full_path:path}")
    async def frontend_app(full_path: str) -> FileResponse:
        requested = static_dir / full_path
        if full_path and requested.exists() and requested.is_file():
            return FileResponse(requested)
        return FileResponse(static_dir / "index.html")
