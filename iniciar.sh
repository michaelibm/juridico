#!/bin/bash

echo "============================================"
echo "  Sistema Jurídico — Inicializando..."
echo "============================================"

# Verifica Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Instale em: https://docs.docker.com/get-docker/"
    exit 1
fi

# Verifica Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não encontrado."
    exit 1
fi

echo "✅ Docker encontrado."

# Sobe os containers
echo ""
echo "🚀 Iniciando containers..."
docker-compose up --build -d

echo ""
echo "⏳ Aguardando banco de dados ficar pronto (30s)..."
sleep 30

echo ""
echo "============================================"
echo "  ✅ Sistema iniciado com sucesso!"
echo "============================================"
echo ""
echo "  🌐 Frontend:  http://localhost:3000"
echo "  🔌 Backend:   http://localhost:3001"
echo "  🗄️  Banco:     localhost:5432"
echo ""
echo "  👤 Login padrão:"
echo "     E-mail: admin@juridico.com"
echo "     Senha:  Admin@2024"
echo ""
echo "  Para parar: docker-compose down"
echo "============================================"
