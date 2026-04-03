"""02_graph_edge.py — Single Responsibility: GraphEdge Pydantic schema.

Why: Edges are a distinct concept from nodes; isolating them keeps
validation logic for edge fields independent.
"""

from pydantic import BaseModel


class GraphEdge(BaseModel):
    """Represents a directed edge between two graph nodes."""

    id: str
    source: str
    target: str
    sourceHandle: str | None = None
    targetHandle: str | None = None
