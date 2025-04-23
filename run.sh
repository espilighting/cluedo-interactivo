#!/bin/bash

echo "🔧 Iniciando servidor Cluedo..."

cd backend
if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependencias backend..."
  npm install
fi
nohup node server.js > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend iniciado en http://localhost:3001 (PID $BACKEND_PID)"

cd ../frontend
if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependencias frontend..."
  npm install
fi
npm run dev

kill $BACKEND_PID
