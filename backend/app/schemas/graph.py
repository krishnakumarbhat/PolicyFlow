from typing import Any

from pydantic import BaseModel, Field


class GraphNode(BaseModel):
    id: str
    type: str
    position: dict[str, float] = Field(default_factory=dict)
    data: dict[str, Any] = Field(default_factory=dict)


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: str | None = None
    targetHandle: str | None = None


class GraphPayload(BaseModel):
    client_id: str | None = None
    nodes: list[GraphNode] = Field(default_factory=list)
    edges: list[GraphEdge] = Field(default_factory=list)