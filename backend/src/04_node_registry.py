"""04_node_registry.py — Singleton Pattern: Canonical catalog of available pipeline nodes.

Why: The node catalog is immutable at runtime. A Singleton ensures the catalog
is built exactly once and shared across all request handlers — O(1) lookup.
"""


class NodeRegistry:
    """Singleton providing the canonical catalog of available node templates.

    Thread-safe classic Singleton via __new__.  The catalog dict is built
    once on first instantiation and never mutated.
    """

    _instance: "NodeRegistry | None" = None
    _catalog: dict | None = None

    def __new__(cls) -> "NodeRegistry":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._catalog = cls._build_catalog()
        return cls._instance

    def get_catalog(self) -> dict:
        """Return the full node catalog — O(1)."""
        return self._catalog  # type: ignore[return-value]

    @staticmethod
    def _build_catalog() -> dict:
        return {
            "groups": [
                {
                    "key": "data",
                    "label": "Data Nodes",
                    "templates": [
                        {
                            "id": "local_csv",
                            "label": "CSV / JSON Dataset",
                            "description": "Local files, JSONL corpora, parquet, or prompt-completion tables.",
                            "categoryLabel": "data ingress",
                            "tags": ["csv", "json", "parquet", "hf-ready"],
                        },
                        {
                            "id": "hf_dataset",
                            "label": "Hugging Face Dataset",
                            "description": "Hub-native datasets for SFT, DPO, reward modeling, and eval.",
                            "categoryLabel": "data ingress",
                            "tags": ["datasets", "hf hub", "sft", "dpo"],
                        },
                    ],
                },
                {
                    "key": "model",
                    "label": "Model Nodes",
                    "templates": [
                        {
                            "id": "base_llm",
                            "label": "Base LLM Loader",
                            "description": "Transformers, Unsloth, PyTorch, and TensorFlow-friendly loader.",
                            "categoryLabel": "foundation",
                            "tags": ["transformers", "peft", "unsloth", "pytorch"],
                        },
                        {
                            "id": "classical_model",
                            "label": "Classical ML Block",
                            "description": "XGBoost, LightGBM, CatBoost, Random Forest, and SVM options.",
                            "categoryLabel": "classical",
                            "tags": ["xgboost", "lightgbm", "catboost", "scikit-learn"],
                        },
                    ],
                },
                {
                    "key": "training",
                    "label": "Training + Alignment",
                    "templates": [
                        {
                            "id": "lora_adapter",
                            "label": "LoRA Adapter",
                            "description": "PEFT or Unsloth adapter stage with QLoRA support.",
                            "categoryLabel": "adapters",
                            "tags": ["lora", "qlora", "peft", "unsloth"],
                        },
                        {
                            "id": "sft_trainer",
                            "label": "SFT Trainer",
                            "description": "Supervised fine-tuning node for instruction tuning workflows.",
                            "categoryLabel": "alignment",
                            "tags": ["sft", "trl", "transformers", "keras"],
                        },
                        {
                            "id": "ppo_trainer",
                            "label": "PPO / RLHF Trainer",
                            "description": "TRL PPO orchestration with reward shaping and rollout controls.",
                            "categoryLabel": "alignment",
                            "tags": ["ppo", "rlhf", "trl", "reward-model"],
                        },
                        {
                            "id": "dpo_trainer",
                            "label": "DPO Trainer",
                            "description": "Preference optimization pipeline for chosen vs rejected pairs.",
                            "categoryLabel": "alignment",
                            "tags": ["dpo", "trl", "preferences", "alignment"],
                        },
                    ],
                },
                {
                    "key": "utility",
                    "label": "Utility / Output",
                    "templates": [
                        {
                            "id": "metrics_sink",
                            "label": "Metrics + Charts",
                            "description": "Loss curves, reward traces, accuracy snapshots, and eval sinks.",
                            "categoryLabel": "telemetry",
                            "tags": ["metrics", "charts", "evaluation", "streaming"],
                        },
                        {
                            "id": "inference_sandbox",
                            "label": "Inference Sandbox",
                            "description": "Prompt testing and regression checks after alignment or training.",
                            "categoryLabel": "deployment",
                            "tags": ["chat", "sandbox", "inference", "debug"],
                        },
                        {
                            "id": "demo_output",
                            "label": "Export to Hub",
                            "description": "Package scripts, adapters, configs, or checkpoints for handoff.",
                            "categoryLabel": "delivery",
                            "tags": ["hub", "export", "packaging", "script"],
                        },
                    ],
                },
            ],
            "runtime_options": {
                "llm": ["transformers", "trl", "peft", "unsloth", "pytorch", "tensorflow", "keras"],
                "classical": ["scikit-learn", "xgboost", "lightgbm", "catboost"],
            },
        }
