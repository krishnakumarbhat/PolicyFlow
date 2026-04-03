"""06_graph_parser.py — Single Responsibility: DAG topological sort via Kahn's algorithm.

Why: Parsing the graph into execution order is the backbone of the pipeline.
Kahn's algorithm runs in O(V + E) time and O(V) space — optimal for DAG
linearisation with cycle detection.
"""

from collections import defaultdict, deque

from src import load_module

_m03 = load_module("03_graph_payload")
GraphPayload = _m03.GraphPayload


class GraphParser:
    """Parses a visual graph payload into a topologically sorted execution plan."""

    def topological_sort(self, payload: GraphPayload) -> list:
        """Kahn's algorithm — O(V + E). Raises ValueError on cycles."""
        node_map = {node.id: node for node in payload.nodes}
        indegree: dict[str, int] = {node.id: 0 for node in payload.nodes}
        adjacency: dict[str, list[str]] = defaultdict(list)

        for edge in payload.edges:
            if edge.source not in node_map or edge.target not in node_map:
                raise ValueError(f"Edge {edge.id} references missing nodes.")
            adjacency[edge.source].append(edge.target)
            indegree[edge.target] += 1

        queue = deque(nid for nid, deg in indegree.items() if deg == 0)
        execution_order: list = []

        while queue:
            node_id = queue.popleft()
            execution_order.append(node_map[node_id])
            for neighbor in adjacency[node_id]:
                indegree[neighbor] -= 1
                if indegree[neighbor] == 0:
                    queue.append(neighbor)

        if len(execution_order) != len(payload.nodes):
            raise ValueError("Graph must be a DAG. A cycle was detected.")

        return execution_order

    def describe_execution(self, payload: GraphPayload) -> list[dict]:
        """Return labelled execution order with upstream dependency info."""
        execution_order = self.topological_sort(payload)
        upstream_map: dict[str, list[str]] = defaultdict(list)

        for edge in payload.edges:
            upstream_map[edge.target].append(edge.source)

        return [
            {
                "id": node.id,
                "label": node.data.get("label", node.id),
                "type": node.type,
                "upstream": upstream_map.get(node.id, []),
            }
            for node in execution_order
        ]
