#!/bin/bash

# SynkBot - Script de Despliegue para Railway

set -e

echo "🚀 Desplegando SynkBot..."

# Verificar que existe la API key
if [ -z "$GROQ_API_KEY" ]; then
    echo "❌ Error: GROQ_API_KEY no está configurada"
    echo "   Ejecuta: export GROQ_API_KEY=tu_api_key"
    exit 1
fi

# Build y deploy del backend
echo "📦 Construyendo backend..."
docker build -f Dockerfile.backend -t synkbot-backend .

# Verificar que el contenedor funciona
echo "✅ Verificando contenedor..."
docker run -d --name synkbot-backend-test \
    -e GROQ_API_KEY=$GROQ_API_KEY \
    -p 8000:8000 \
    synkbot-backend

# Esperar a que esté listo
sleep 5

# Health check
if curl -f http://localhost:8000/api/v1/health > /dev/null 2>&1; then
    echo "✅ Backend funcionando correctamente"
else
    echo "❌ Error: El backend no respondió al health check"
    docker logs synkbot-backend-test
    exit 1
fi

# Limpiar contenedor de test
docker stop synkbot-backend-test
docker rm synkbot-backend-test

echo ""
echo "✅ Backend listo para deploy en Railway!"
echo ""
echo "Para desplegar en Railway:"
echo "1. Sube este código a GitHub"
echo "2. Conecta el repo en railway.app"
echo "3. Agrega la variable GROQ_API_KEY"
echo "4. Deploy automático 🚀"