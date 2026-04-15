# SynkBot - Asistente Virtual de SynkData

🤖 Bot conversacional con IA para SynkData que actúa como agente de ventas activo.

## Stack Tecnológico

- **Backend**: FastAPI (Python) + Groq (Llama 3 70B)
- **RAG**: ChromaDB para base de conocimiento vectorial
- **Frontend**: React + TailwindCSS
- **Despliegue**: Docker + Railway

## Características

- 💬 Chat con IA que habla como humano, no como bot
- 📚 RAG dinámico para información de productos y servicios
- 🔍 Búsqueda vectorial en base de conocimiento
- 📅 Captura de leads al final de conversaciones
- 📤 Panel admin para gestionar documentos RAG
- 🎨 Interfaz con diseño profesional de SynkData

## Estructura del Proyecto

```
synkdata-bot/
├── backend/              # API FastAPI
│   ├── app/
│   │   ├── api/          # Rutas de la API
│   │   ├── core/         # Configuración y LLM
│   │   ├── models/       # Schemas Pydantic
│   │   └── services/     # RAG y conversaciones
│   └── requirements.txt
├── frontend/            # Interfaz web del bot
├── admin/                # Panel de gestión RAG
├── docker-compose.yml
└── README.md
```

## Configuración

### 1. Backend

```bash
cd backend
cp .env.example .env
# Editar .env y agregar tu GROQ_API_KEY
```

Obtén tu API key de Groq en: https://console.groq.com/keys

### 2. Variables de Entorno Backend

```env
GROQ_API_KEY=tu_api_key_aqui
CHROMA_PERSIST_DIR=./chroma_data
PORT=8000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# En desarrollo: VITE_API_URL=http://localhost:8000/api/v1
# En producción: VITE_API_URL=https://api.tudominio.com/api/v1
```

## Ejecución Local

### Con Docker

```bash
# Backend
docker build -f Dockerfile.backend -t synkbot-backend .
docker run -p 8000:8000 --env-file backend/.env synkbot-backend

# Frontend
docker build -f Dockerfile.frontend -t synkbot-frontend .
docker run -p 3000:80 synkbot-frontend
```

### Sin Docker

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/chat` | Chat con el bot |
| GET | `/api/v1/rag/documents` | Listar documentos |
| POST | `/api/v1/rag/documents` | Agregar documento |
| POST | `/api/v1/rag/upload-file` | Subir archivo |
| DELETE | `/api/v1/rag/documents/{id}` | Eliminar documento |
| POST | `/api/v1/lead` | Capturar lead |
| GET | `/api/v1/rag/stats` | Estadísticas |

## Despliegue en Railway

1. Fork o sube este repo a GitHub
2. Conecta tu repo a Railway
3. Agrega la variable `GROQ_API_KEY` en Railway
4. Deploy automatico

### URLs sugeridas

- **Bot**: `https://synkbot.synkdata.online`
- **Admin**: `https://synkbot-admin.synkdata.online`
- **API**: `https://api.synkdata.online`

## Gestión de RAG

El panel admin permite:

- 📄 Ver todos los documentos indexados
- 📤 Subir archivos .txt o .md
- ✏️ Agregar documentos manualmente
- 🗑️ Eliminar documentos

### Categorías sugeridas

- `VentasPro` - Info del CRM y gestión de ventas
- `IMSS-Intel` - Integraciones gubernamentales
- `DevOps` - Servicios de infraestructura
- `precios` - Cotizaciones y tiempos estimados
- `general` - Info general de la empresa

## Personalización del System Prompt

El System Prompt está en `backend/app/api/routes.py`. Puedes modificarlo para ajustar:

- Tono de voz y personalidad
- Servicios que conoce
- Proceso de venta
- Manejo de objeciones
- Informações de contacto

## Licencia

MIT - SynkData © 2024