"""03_graph_payload.py — Single Responsibility: GraphPayload aggregate schema.

Why: The API request envelope depends on both GraphNode and GraphEdge.
Keeping it separate respects the aggregate pattern.
"""

from pydantic import BaseModel, Field

from src import load_module

_m01 = load_module("01_graph_node")
_m02 = load_module("02_graph_edge")

GraphNode = _m01.GraphNode
GraphEdge = _m02.GraphEdge


class GraphPayload(BaseModel):
    """API request body containing the full graph definition."""

    client_id: str | None = None
    nodes: list[GraphNode] = Field(default_factory=list)
    edges: list[GraphEdge] = Field(default_factory=list)
