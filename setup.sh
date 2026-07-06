#!/usr/bin/env bash
set -euo pipefail

echo "============================================"
echo "  Crypto Pulse - Setup"
echo "============================================"
echo ""

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Error: Node.js is required but not installed."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "Error: npm is required but not installed."; exit 1; }

# Check for Docker (optional)
if command -v docker &> /dev/null; then
    echo "[✓] Docker found"
else
    echo "[!] Docker not found — mock API server won't auto-start"
    echo "    Install Docker or manually run: json-server --watch mock-api/data.json --port 3001"
fi

echo ""
echo "Installing dependencies..."
cd crypto-pulse-app
npm install

echo ""
echo "Copying environment config..."
cp .env.example .env 2>/dev/null || true

echo ""
echo "Starting mock API server (detached)..."
if command -v docker &> /dev/null; then
    cd ..
    docker compose up -d mock-api
    cd crypto-pulse-app
    echo "[✓] Mock API running at http://localhost:3001"
fi

echo ""
echo "============================================"
echo "  Setup complete!"
echo "============================================"
echo ""
echo "  Start the app:"
echo "    cd crypto-pulse-app"
echo "    npx expo start"
echo ""
echo "  Run tests:"
echo "    cd crypto-pulse-app"
echo "    npx jest"
echo ""
echo "  Mock API:"
echo "    http://localhost:3001/coins"
echo "    http://localhost:3001/portfolio"
echo ""
