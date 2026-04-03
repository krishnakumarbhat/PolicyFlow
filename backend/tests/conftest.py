"""Shared pytest fixtures for PolicyFlow backend tests.

Why: Centralising fixtures avoids duplication across test modules and ensures
consistent test data. Uses FastAPI TestClient (no running server needed).
"""

import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from server import app


@pytest.fixture(scope="session")
def client() -> TestClient:
    """FastAPI TestClient — runs tests in-process, no network required."""
    return TestClient(app)


@pytest.fixture(scope="session")
def sample_graph() -> dict:
    """Reusable graph fixture mirroring the shipped sample graph."""
    fixture = Path(__file__).resolve().parent.parent.parent / "tests" / "fixtures" / "sample_graph.json"
    return json.loads(fixture.read_text())
