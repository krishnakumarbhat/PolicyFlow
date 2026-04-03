"""08_execution_engine.py — Strategy Pattern: Selects and runs the appropriate ML backend.

Why: Classical ML and LLM training require fundamentally different execution
strategies. The Strategy pattern encapsulates each variant so new backends
(e.g., GPU cluster submission) can be added without touching existing code.
"""

import asyncio
import importlib.util

from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC

from src import load_module

_m03 = load_module("03_graph_payload")
_m05 = load_module("05_websocket_manager")
_m06 = load_module("06_graph_parser")

GraphPayload = _m03.GraphPayload
WebSocketManager = _m05.WebSocketManager
GraphParser = _m06.GraphParser


class ExecutionEngine:
    """Strategy: Chooses lightweight-local or validation-dry-run based on graph content."""

    def __init__(self, parser: GraphParser) -> None:
        self._parser = parser

    def select_mode(self, payload: GraphPayload) -> str:
        """Strategy selector — O(n) scan of node types."""
        graph_types = {node.type for node in payload.nodes}
        return "lightweight-local" if "classical" in graph_types else "validation-dry-run"

    async def execute(self, payload: GraphPayload, ws_manager: WebSocketManager) -> None:
        """Dispatch to the correct execution strategy."""
        client_id = payload.client_id or "anonymous"
        execution_order = self._parser.describe_execution(payload)

        await ws_manager.send_json(client_id, {"type": "run_status", "status": "executing"})
        await ws_manager.send_json(client_id, {"type": "log", "message": f"Resolved {len(execution_order)} nodes."})

        try:
            if any(node.type == "classical" for node in payload.nodes):
                await self._strategy_classical(payload, ws_manager, client_id)
            else:
                await self._strategy_llm_dry(payload, ws_manager, client_id)

            await ws_manager.send_json(client_id, {"type": "run_status", "status": "completed"})
        except Exception as error:
            await ws_manager.send_json(client_id, {"type": "run_status", "status": "failed"})
            await ws_manager.send_json(client_id, {"type": "log", "message": f"Execution failed: {error}"})

    # --- Strategy: LLM dry run ---

    async def _strategy_llm_dry(
        self, payload: GraphPayload, ws_manager: WebSocketManager, client_id: str
    ) -> None:
        execution_order = self._parser.describe_execution(payload)
        installed = {
            pkg: bool(importlib.util.find_spec(pkg))
            for pkg in ["transformers", "trl", "peft", "unsloth", "tensorflow"]
        }

        await ws_manager.send_json(client_id, {"type": "log", "message": f"LLM dry run dependencies: {installed}"})

        for idx, node in enumerate(execution_order, start=1):
            await asyncio.sleep(0.45)
            await ws_manager.send_json(
                client_id, {"type": "log", "message": f"[{idx}/{len(execution_order)}] Prepared {node['label']}"}
            )

            if node["type"] == "training":
                strategy = (
                    next(n for n in payload.nodes if n.id == node["id"])
                    .data.get("params", {})
                    .get("strategy", "train")
                )
                await ws_manager.send_json(client_id, {
                    "type": "metric",
                    "label": "loss",
                    "value": round(max(0.12, 1.15 - idx * 0.18), 4),
                    "context": f"{strategy.upper()} warmup",
                })
                await ws_manager.send_json(client_id, {
                    "type": "metric",
                    "label": "reward",
                    "value": round(0.15 + idx * 0.11, 4),
                    "context": "Policy / reward estimate",
                })

        await ws_manager.send_json(
            client_id,
            {"type": "log", "message": "Dry run complete. Exported code is ready for full training on a GPU machine."},
        )

    # --- Strategy: Classical ML local execution ---

    async def _strategy_classical(
        self, payload: GraphPayload, ws_manager: WebSocketManager, client_id: str
    ) -> None:
        classical_node = next(n for n in payload.nodes if n.type == "classical")
        params = classical_node.data.get("params", {})
        algorithm = params.get("algorithm", "random_forest")

        await ws_manager.send_json(
            client_id, {"type": "log", "message": f"Launching lightweight classical run for {algorithm}."}
        )

        dataset = load_breast_cancer(as_frame=True)
        x_train, x_test, y_train, y_test = train_test_split(
            dataset.data, dataset.target, random_state=42, test_size=0.2
        )

        model = self._build_classical_model(algorithm, ws_manager, client_id)

        await asyncio.sleep(0.35)
        model.fit(x_train, y_train)
        preds = model.predict(x_test)
        acc = round(float(accuracy_score(y_test, preds)), 4)
        f1 = round(float(f1_score(y_test, preds)), 4)

        await ws_manager.send_json(client_id, {"type": "metric", "label": "accuracy", "value": acc, "context": algorithm})
        await ws_manager.send_json(client_id, {"type": "metric", "label": "f1", "value": f1, "context": "breast_cancer smoke test"})
        await ws_manager.send_json(client_id, {"type": "log", "message": f"Local smoke test complete. accuracy={acc}, f1={f1}"})

    @staticmethod
    def _build_classical_model(algorithm: str, ws_manager=None, client_id=None):
        """Factory method for classical ML model instantiation."""
        if algorithm == "svm":
            return SVC(kernel="rbf", probability=True)
        if algorithm == "random_forest":
            return RandomForestClassifier(n_estimators=200, random_state=42)

        xgb_spec = importlib.util.find_spec("xgboost")
        if xgb_spec:
            from xgboost import XGBClassifier
            return XGBClassifier(max_depth=4, n_estimators=160, learning_rate=0.08, subsample=0.9)

        return RandomForestClassifier(n_estimators=200, random_state=42)
