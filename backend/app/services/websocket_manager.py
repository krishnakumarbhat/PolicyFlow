from collections import defaultdict

from fastapi import WebSocket


class WebSocketManager:
    def __init__(self) -> None:
        self.connections: dict[str, list[WebSocket]] = defaultdict(list)

    async def connect(self, client_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.connections[client_id].append(websocket)

    def disconnect(self, client_id: str, websocket: WebSocket) -> None:
        active = [item for item in self.connections.get(client_id, []) if item is not websocket]
        if active:
            self.connections[client_id] = active
        elif client_id in self.connections:
            del self.connections[client_id]

    async def send_json(self, client_id: str, payload: dict) -> None:
        stale: list[WebSocket] = []

        for websocket in self.connections.get(client_id, []):
            try:
                await websocket.send_json(payload)
            except Exception:
                stale.append(websocket)

        for websocket in stale:
            self.disconnect(client_id, websocket)