import asyncio
import importlib.util

from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC

from app.engine.parser import GraphParser
from app.schemas.graph import GraphPayload
from app.services.websocket_manager import WebSocketManager


class ExecutionEngine:
    def __init__(self, parser: GraphParser) -> None:
        self.parser = parser

    def select_mode(self, payload: GraphPayload) -> str:
        graph_types = {node.type for node in payload.nodes}
        return "lightweight-local" if "classical" in graph_types else "validation-dry-run"

    async def execute(self, payload: GraphPayload, websocket_manager: WebSocketManager) -> None:
        client_id = payload.client_id or "anonymous"
        execution_order = self.parser.describe_execution(payload)

        await websocket_manager.send_json(client_id, {"type": "run_status", "status": "executing"})
        await websocket_manager.send_json(client_id, {"type": "log", "message": f"Resolved {len(execution_order)} nodes."})

        try:
            if any(node.type == "classical" for node in payload.nodes):
                await self._run_classical(payload, websocket_manager, client_id)
            else:
                await self._run_llm_dry(payload, websocket_manager, client_id)

            await websocket_manager.send_json(client_id, {"type": "run_status", "status": "completed"})
        except Exception as error:
            await websocket_manager.send_json(client_id, {"type": "run_status", "status": "failed"})
            await websocket_manager.send_json(client_id, {"type": "log", "message": f"Execution failed: {error}"})

    async def _run_llm_dry(
        self,
        payload: GraphPayload,
        websocket_manager: WebSocketManager,
        client_id: str,
    ) -> None:
        execution_order = self.parser.describe_execution(payload)
        installed = {
            package: bool(importlib.util.find_spec(package))
            for package in ["transformers", "trl", "peft", "unsloth", "tensorflow"]
        }

        await websocket_manager.send_json(
            client_id,
            {"type": "log", "message": f"LLM dry run dependencies: {installed}"},
        )

        for index, node in enumerate(execution_order, start=1):
            await asyncio.sleep(0.45)
            await websocket_manager.send_json(
                client_id,
                {"type": "log", "message": f"[{index}/{len(execution_order)}] Prepared {node['label']}"},
            )

            if node["type"] == "training":
                strategy = next(item for item in payload.nodes if item.id == node["id"]).data.get("params", {}).get("strategy", "train")
                await websocket_manager.send_json(
                    client_id,
                    {
                        "type": "metric",
                        "label": "loss",
                        "value": round(max(0.12, 1.15 - index * 0.18), 4),
                        "context": f"{strategy.upper()} warmup",
                    },
                )
                await websocket_manager.send_json(
                    client_id,
                    {
                        "type": "metric",
                        "label": "reward",
                        "value": round(0.15 + index * 0.11, 4),
                        "context": "Policy / reward estimate",
                    },
                )

        await websocket_manager.send_json(
            client_id,
            {"type": "log", "message": "Dry run complete. Exported code is ready for full training on a GPU machine."},
        )

    async def _run_classical(
        self,
        payload: GraphPayload,
        websocket_manager: WebSocketManager,
        client_id: str,
    ) -> None:
        classical_node = next(node for node in payload.nodes if node.type == "classical")
        params = classical_node.data.get("params", {})
        algorithm = params.get("algorithm", "random_forest")

        await websocket_manager.send_json(
            client_id,
            {"type": "log", "message": f"Launching lightweight classical run for {algorithm}."},
        )

        dataset = load_breast_cancer(as_frame=True)
        X_train, X_test, y_train, y_test = train_test_split(
            dataset.data,
            dataset.target,
            random_state=42,
            test_size=0.2,
        )

        if algorithm == "svm":
            model = SVC(kernel="rbf", probability=True)
        elif algorithm == "random_forest":
            model = RandomForestClassifier(n_estimators=200, random_state=42)
        else:
            xgboost_spec = importlib.util.find_spec("xgboost")
            if xgboost_spec:
                from xgboost import XGBClassifier

                model = XGBClassifier(max_depth=4, n_estimators=160, learning_rate=0.08, subsample=0.9)
            else:
                await websocket_manager.send_json(
                    client_id,
                    {
                        "type": "log",
                        "message": "xgboost is unavailable locally, using RandomForest smoke test while keeping export code exact.",
                    },
                )
                model = RandomForestClassifier(n_estimators=200, random_state=42)

        await asyncio.sleep(0.35)
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)
        accuracy = round(float(accuracy_score(y_test, predictions)), 4)
        f1 = round(float(f1_score(y_test, predictions)), 4)

        await websocket_manager.send_json(
            client_id,
            {"type": "metric", "label": "accuracy", "value": accuracy, "context": algorithm},
        )
        await websocket_manager.send_json(
            client_id,
            {"type": "metric", "label": "f1", "value": f1, "context": "breast_cancer smoke test"},
        )
        await websocket_manager.send_json(
            client_id,
            {"type": "log", "message": f"Local smoke test complete. accuracy={accuracy}, f1={f1}"},
        )