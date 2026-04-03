"""PolicyFlow — Main entry point.

Run: cd backend && uvicorn server:app --host 0.0.0.0 --port 8001 --reload
"""

import importlib

_factory = importlib.import_module("src.00_app_factory")
app = _factory.create_app()