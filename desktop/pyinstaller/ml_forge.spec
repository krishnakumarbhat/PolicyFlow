# -*- mode: python ; coding: utf-8 -*-
from pathlib import Path

from PyInstaller.utils.hooks import collect_submodules

project_root = Path('/app')
datas = [
    (str(project_root / 'frontend' / 'dist'), 'frontend/dist'),
    (str(project_root / 'backend'), 'backend'),
]

hiddenimports = collect_submodules('uvicorn') + collect_submodules('webview')

a = Analysis(
    [str(project_root / 'desktop' / 'launcher.py')],
    pathex=[str(project_root)],
    binaries=[],
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=['tkinter'],
    noarchive=False,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='PolicyFlow',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
)