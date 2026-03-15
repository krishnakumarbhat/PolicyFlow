import json
from textwrap import dedent

from app.schemas.graph import GraphPayload


class CodeGenerator:
    def generate(self, payload: GraphPayload, execution_order: list[dict]) -> dict:
        config = self._build_config(payload, execution_order)
        script = self._render_script(payload, config)
        return {"config": config, "script": script}

    def _build_config(self, payload: GraphPayload, execution_order: list[dict]) -> dict:
        node_map = {node.id: node for node in payload.nodes}
        ordered_nodes = []

        for item in execution_order:
            node = node_map[item["id"]]
            ordered_nodes.append(
                {
                    "id": node.id,
                    "type": node.type,
                    "label": node.data.get("label", node.id),
                    "params": node.data.get("params", {}),
                    "upstream": item["upstream"],
                }
            )

        return {
            "project": "PolicyFlow",
            "node_count": len(payload.nodes),
            "edge_count": len(payload.edges),
            "execution_order": ordered_nodes,
        }

    def _render_script(self, payload: GraphPayload, config: dict) -> str:
        ordered_nodes = config["execution_order"]
        types = {node["type"] for node in ordered_nodes}
        strategies = {node["params"].get("strategy") for node in ordered_nodes if node["type"] == "training"}

        import_lines = [
            "from pathlib import Path",
            "import json",
        ]

        if "dataset" in types:
            import_lines.extend(
                [
                    "# Optional: pip install datasets pandas",
                    "from datasets import load_dataset",
                ]
            )
        if {"model", "training"} & types:
            import_lines.extend(
                [
                    "# Optional: pip install transformers accelerate",
                    "from transformers import AutoModelForCausalLM, AutoTokenizer",
                ]
            )
        if any(strategy in {"lora", "qlora"} for strategy in strategies):
            import_lines.extend(
                [
                    "# Optional: pip install peft",
                    "from peft import LoraConfig, get_peft_model",
                ]
            )
        if any(strategy in {"sft", "ppo", "rlhf", "dpo"} for strategy in strategies):
            import_lines.extend(
                [
                    "# Optional: pip install trl",
                    "from trl import DPOConfig, DPOTrainer, PPOConfig, PPOTrainer, SFTConfig, SFTTrainer",
                ]
            )
        if "classical" in types:
            import_lines.extend(
                [
                    "from sklearn.metrics import accuracy_score, f1_score",
                    "from sklearn.model_selection import train_test_split",
                    "from sklearn.ensemble import RandomForestClassifier",
                    "from sklearn.svm import SVC",
                ]
            )

        node_lines = []

        for node in ordered_nodes:
            params = node["params"]
            variable_name = self._safe_name(node["id"])
            section_header = f"\n    # --- {node['label']} ({node['type']}) ---"
            node_lines.append(section_header)

            if node["type"] == "dataset":
                if params.get("sourceType") == "huggingface":
                    node_lines.extend(
                        [
                            f"    {variable_name}_cfg = graph_nodes['{node['id']}']",
                            f"    {variable_name} = load_dataset({variable_name}_cfg['params']['datasetName'], split={variable_name}_cfg['params']['split'])",
                        ]
                    )
                else:
                    node_lines.extend(
                        [
                            f"    {variable_name}_cfg = graph_nodes['{node['id']}']",
                            f"    {variable_name}_path = Path({variable_name}_cfg['params']['datasetName'])",
                            "    # Replace with pandas.read_csv / read_json / parquet loader as needed",
                            f"    {variable_name} = {{'path': str({variable_name}_path), 'format': {variable_name}_cfg['params']['format']}}",
                        ]
                    )

            if node["type"] == "model":
                node_lines.extend(
                    [
                        f"    {variable_name}_cfg = graph_nodes['{node['id']}']",
                        f"    {variable_name}_tokenizer = AutoTokenizer.from_pretrained({variable_name}_cfg['params']['modelId'])",
                        f"    {variable_name}_model = AutoModelForCausalLM.from_pretrained({variable_name}_cfg['params']['modelId'])",
                    ]
                )

            if node["type"] == "training":
                strategy = params.get("strategy")
                if strategy in {"lora", "qlora"}:
                    node_lines.extend(
                        [
                            f"    {variable_name}_cfg = graph_nodes['{node['id']}']",
                            f"    {variable_name}_adapter = LoraConfig(r=16, lora_alpha=32, target_modules=['q_proj', 'v_proj'])",
                            "    base_model_node = next(item for item in graph_config['execution_order'] if item['type'] == 'model')",
                            "    base_model_key = base_model_node['id'].replace('-', '_')",
                            f"    {variable_name}_model = get_peft_model(locals()[base_model_key + '_model'], {variable_name}_adapter)",
                        ]
                    )
                if strategy == "sft":
                    node_lines.extend(
                        [
                            f"    {variable_name}_cfg = graph_nodes['{node['id']}']",
                            f"    {variable_name}_args = SFTConfig(output_dir='artifacts/sft', learning_rate=float({variable_name}_cfg['params']['learningRate']), num_train_epochs=int({variable_name}_cfg['params']['epochs']))",
                            "    dataset_node = next(item for item in graph_config['execution_order'] if item['type'] == 'dataset')",
                            "    model_node = next(item for item in graph_config['execution_order'] if item['type'] == 'model')",
                            "    dataset_key = dataset_node['id'].replace('-', '_')",
                            "    model_key = model_node['id'].replace('-', '_')",
                            f"    {variable_name}_trainer = SFTTrainer(model=locals()[model_key + '_model'], tokenizer=locals()[model_key + '_tokenizer'], train_dataset=locals()[dataset_key], args={variable_name}_args)",
                            f"    {variable_name}_trainer.train()",
                        ]
                    )
                if strategy in {"ppo", "rlhf"}:
                    node_lines.extend(
                        [
                            f"    {variable_name}_cfg = graph_nodes['{node['id']}']",
                            f"    {variable_name}_args = PPOConfig(learning_rate=float({variable_name}_cfg['params']['learningRate']), batch_size=4, mini_batch_size=2)",
                            "    dataset_node = next(item for item in graph_config['execution_order'] if item['type'] == 'dataset')",
                            "    model_node = next(item for item in graph_config['execution_order'] if item['type'] == 'model')",
                            "    dataset_key = dataset_node['id'].replace('-', '_')",
                            "    model_key = model_node['id'].replace('-', '_')",
                            f"    {variable_name}_trainer = PPOTrainer(config={variable_name}_args, model=locals()[model_key + '_model'], tokenizer=locals()[model_key + '_tokenizer'], dataset=locals()[dataset_key])",
                            "    # Plug in your reward model / reward function before calling .step(...) in production.",
                            f"    print('PPO pipeline ready:', {variable_name}_trainer)",
                        ]
                    )
                if strategy == "dpo":
                    node_lines.extend(
                        [
                            f"    {variable_name}_cfg = graph_nodes['{node['id']}']",
                            f"    {variable_name}_args = DPOConfig(output_dir='artifacts/dpo', learning_rate=float({variable_name}_cfg['params']['learningRate']), num_train_epochs=int({variable_name}_cfg['params']['epochs']))",
                            "    dataset_node = next(item for item in graph_config['execution_order'] if item['type'] == 'dataset')",
                            "    model_node = next(item for item in graph_config['execution_order'] if item['type'] == 'model')",
                            "    dataset_key = dataset_node['id'].replace('-', '_')",
                            "    model_key = model_node['id'].replace('-', '_')",
                            f"    {variable_name}_trainer = DPOTrainer(model=locals()[model_key + '_model'], args={variable_name}_args, train_dataset=locals()[dataset_key], processing_class=locals()[model_key + '_tokenizer'])",
                            f"    {variable_name}_trainer.train()",
                        ]
                    )

            if node["type"] == "classical":
                algorithm = params.get("algorithm")
                node_lines.extend(
                    [
                        f"    {variable_name}_cfg = graph_nodes['{node['id']}']",
                        "    from sklearn.datasets import load_breast_cancer",
                        "    demo = load_breast_cancer(as_frame=True)",
                        "    X_train, X_test, y_train, y_test = train_test_split(demo.data, demo.target, test_size=0.2, random_state=42)",
                    ]
                )
                if algorithm == "svm":
                    node_lines.append(f"    {variable_name}_model = SVC(kernel='rbf', probability=True)")
                elif algorithm == "random_forest":
                    node_lines.append(f"    {variable_name}_model = RandomForestClassifier(n_estimators=200, random_state=42)")
                else:
                    node_lines.extend(
                        [
                            "    try:",
                            "        from xgboost import XGBClassifier",
                            f"        {variable_name}_model = XGBClassifier(max_depth=4, n_estimators=200, learning_rate=0.1, subsample=0.9)",
                            "    except Exception:",
                            f"        {variable_name}_model = RandomForestClassifier(n_estimators=200, random_state=42)",
                        ]
                    )
                node_lines.extend(
                    [
                        f"    {variable_name}_model.fit(X_train, y_train)",
                        f"    {variable_name}_preds = {variable_name}_model.predict(X_test)",
                        f"    print('accuracy', accuracy_score(y_test, {variable_name}_preds))",
                        f"    print('f1', f1_score(y_test, {variable_name}_preds))",
                    ]
                )

            if node["type"] == "output":
                node_lines.extend(
                    [
                        f"    {variable_name}_cfg = graph_nodes['{node['id']}']",
                        f"    print('Output node ready ->', {variable_name}_cfg['params'])",
                    ]
                )

        config_json = json.dumps(config, indent=2)
        imports = "\n".join(dict.fromkeys(import_lines))
        body = "\n".join(node_lines)

        return dedent(
            f"""
            # Auto-generated by PolicyFlow
            # This script mirrors the current DAG and keeps node configs readable.

            {imports}

            graph_config = {config_json}
            graph_nodes = {{node['id']: node for node in graph_config['execution_order']}}


            def main() -> None:
                Path('artifacts').mkdir(exist_ok=True)
                print('Execution order:', [node['label'] for node in graph_config['execution_order']])
            {body}


            if __name__ == '__main__':
                main()
            """
        ).strip()

    def _safe_name(self, value: str) -> str:
        return value.replace("-", "_")