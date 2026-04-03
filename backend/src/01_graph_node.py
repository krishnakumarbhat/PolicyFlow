"""01_graph_node.py — Single Responsibility: GraphNode Pydantic schema.

Why: Isolates the node data model so schema changes propagate from one place.
"""

from typing import Any

from pydantic import BaseModel, Field


class GraphNode(BaseModel):
    """Represents a single node in the visual pipeline graph."""

    id: str
    type: str
    position: dict[str, float] = Field(default_factory=dict)
    data: dict[str, Any] = Field(default_factory=dict)
