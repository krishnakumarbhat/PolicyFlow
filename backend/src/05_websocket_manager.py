"""05_websocket_manager.py — Observer Pattern: Real-time client event broadcasting.

Why: Decouples the execution engine from transport concerns. Clients subscribe
via WebSocket; the manager broadcasts events to all observers for a given
client_id — O(k) per broadcast where k = connections for that client.
"""

from collections import defaultdict

from fastapi import WebSocket


class WebSocketManager:
    """Observer: Manages WebSocket connections and broadcasts events."""

    def __init__(self) -> None:
        self._connections: dict[str, list[WebSocket]] = defaultdict(list)

    async def connect(self, client_id: str, websocket: WebSocket) -> None:
        """Accept and register a new WebSocket observer."""
        await websocket.accept()
        self._connections[client_id].append(websocket)

    def disconnect(self, client_id: str, websocket: WebSocket) -> None:
        """Remove a specific WebSocket from the observer list."""
        active = [ws for ws in self._connections.get(client_id, []) if ws is not websocket]
        if active:
            self._connections[client_id] = active
        elif client_id in self._connections:
            del self._connections[client_id]

    async def send_json(self, client_id: str, payload: dict) -> None:
        """Broadcast a JSON payload to all observers for a client — O(k)."""
        stale: list[WebSocket] = []

        for websocket in self._connections.get(client_id, []):
            try:
                await websocket.send_json(payload)
            except Exception:
                stale.append(websocket)

        for websocket in stale:
            self.disconnect(client_id, websocket)
