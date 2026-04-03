import importlib
import os
import socket
import sys
import threading
import time
from pathlib import Path

import uvicorn
import webview


def bundle_root() -> Path:
    if getattr(sys, "frozen", False):
        return Path(getattr(sys, "_MEIPASS"))
    return Path(__file__).resolve().parent.parent


ROOT_DIR = bundle_root()
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIST = ROOT_DIR / "frontend" / "dist"

sys.path.insert(0, str(BACKEND_DIR))
os.environ.setdefault("POLICYFLOW_STATIC_DIR", str(FRONTEND_DIST))

_factory = importlib.import_module("src.00_app_factory")
app = _factory.create_app()


def find_free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def serve(port: int) -> None:
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="info")


def main() -> None:
    port = find_free_port()
    thread = threading.Thread(target=serve, args=(port,), daemon=True)
    thread.start()
    time.sleep(1.2)
    webview.create_window(
        title="PolicyFlow",
        url=f"http://127.0.0.1:{port}",
        width=1600,
        height=980,
        min_size=(1280, 840),
    )
    webview.start()


if __name__ == "__main__":
    main()