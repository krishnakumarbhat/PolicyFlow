Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

bash /app/scripts/build_frontend.sh
pip install -r /app/backend/requirements.txt -r /app/backend/requirements-desktop.txt
pyinstaller /app/desktop/pyinstaller/ml_forge.spec --noconfirm

Write-Output 'Desktop bundle available in /app/dist'