"""PolicyFlow backend source package.

Execution flow: 00 → 01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09

Provides importlib-based loader for numbered modules since Python
identifiers cannot start with digits.
"""

import importlib


def load_module(name: str):
    """Load a numbered source module by name (e.g. '01_graph_node')."""
    return importlib.import_module(f".{name}", __package__)
