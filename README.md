# Praxis Healthcare Voice Agent

![Version](https://img.shields.io/badge/version-2.1-blue)
![Stack](https://img.shields.io/badge/stack-Pipecat%20%2B%20LangGraph-purple)
![Type](https://img.shields.io/badge/type-FYP-orange)
![Python](https://img.shields.io/badge/python-3.11-green)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## Executive Summary

Praxis is a production-grade, AI-powered telephony receptionist for healthcare clinics. Built on a **Pipecat** real-time voice pipeline layered over a **LangGraph** multi-agent orchestration graph, it handles inbound patient calls end-to-end: identifying callers by phone number, routing intent to specialist sub-agents (booking, triage, knowledge, escalation), managing appointments against a live PostgreSQL database, and providing a secure React admin dashboard for clinic staff. The system is designed to operate at sub-500ms end-to-end voice latency, handle up to five concurrent calls, and gracefully degrade to human escalation at any point in the conversation flow.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PIPECAT LAYER                               │
│                                                                     │
│  Twilio PSTN ──► WebSocket ──► STT (Deepgram Nova-2, <250ms)       │
│                                    │                                │
│                               VAD + Transcript                      │
│                                    │                                │
│                          LangGraph Dispatch                         │
│                                    │                                │
│                TTS (ElevenLabs, streaming) ──► Filler Audio         │
│                                    │                                │
│                          Twilio Media Stream ──► Caller             │
└────────────────────────────────────┬────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────┐
│                        LANGGRAPH LAYER                              │
│                                                                     │
│   ┌────────────────┐      JSON routing decision                     │
│   │  Orchestrator  │◄─────────────────────────────────────────┐    │
│   │  (GPT-4o)      │                                           │    │
│   └───────┬────────┘                                           │    │
│           │                                                    │    │
│     ┌─────▼──────────────────────────────────────┐            │    │
│     │              Intent Router                  │            │    │
│     └──┬──────────┬──────────┬──────────┬────────┘            │    │
│        │          │          │          │                      │    │
│   ┌────▼───┐ ┌────▼───┐ ┌───▼────┐ ┌───▼────┐                │    │
│   │Booking │ │Triage  │ │Knowl.  │ │Escalat.│                │    │
│   │(GPT-4o)│ │(GPT-4o)│ │(GPT-4o)│ │(GPT-4o)│                │    │
│   └────┬───┘ └────┬───┘ └───┬────┘ └───┬────┘                │    │
│        │          │          │          │                      │    │
│   ┌────▼──────────▼──────────▼──────────▼────┐                │    │
│   │           Summarizer (GPT-4o-mini)        │────────────────┘    │
│   └────────────────────────────────────────────┘                    │
│                                                                     │
│   ┌────────────────────────────────────────────┐                    │
│   │  Tools: PostgreSQL · Redis · ChromaDB      │                    │
│   │  Celery: SMS dispatch · Callback scheduler │                    │
│   └────────────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites

- Docker Desktop 4.x+ with Docker Compose v2
- A publicly accessible URL (ngrok, Cloudflare Tunnel, or a server) for Twilio webhooks
- API keys for OpenAI, ElevenLabs, Deepgram, and Twilio (see `.env.example`)

### Step 1 — Clone and configure environment

```bash
git clone https://github.com/your-org/praxis.git
cd praxis
cp .env.example .env
# Edit .env with your API keys and configuration
```

### Step 2 — Start all services

```bash
docker compose up -d
```

This starts: PostgreSQL 16, Redis 7, ChromaDB, FastAPI backend, Celery worker, Celery beat, and the React frontend.

### Step 3 — Run database migrations

```bash
docker compose exec backend alembic upgrade head
```

### Step 4 — Seed the knowledge base (optional)

```bash
docker compose exec backend python -m app.scripts.seed_knowledge
```

### Step 5 — Configure Twilio webhook

In your Twilio console, set the **Voice webhook** for your phone number to:

```
https://your-domain.com/webhook/voice
```

The WebSocket media stream will be handled at `wss://your-domain.com/ws/call`.

Services will be available at:
- **Frontend / Admin dashboard**: http://localhost:3000
- **Backend API + docs**: http://localhost:8000/docs
- **ChromaDB**: http://localhost:8001

---

## Development Setup

### Backend (Python)

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
cp ../.env.example ../.env  # configure as needed

# Run local services only (DB, Redis, Chroma)
docker compose up -d postgres redis chromadb

# Apply migrations
alembic upgrade head

# Start dev server with hot-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Celery Workers (separate terminals)

```bash
# Worker
celery -A app.tasks.celery_app worker --loglevel=info --concurrency=2

# Beat scheduler
celery -A app.tasks.celery_app beat --loglevel=info
```

### Frontend (Node)

```bash
cd frontend
npm install
npm run dev   # Vite dev server at http://localhost:5173
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | ✅ | OpenAI API key (GPT-4o for agents, GPT-4o-mini for summarizer) |
| `ELEVENLABS_API_KEY` | ✅ | ElevenLabs API key for TTS |
| `ELEVENLABS_VOICE_ID` | ✅ | ElevenLabs voice ID used for all agent speech |
| `DEEPGRAM_API_KEY` | ✅ | Deepgram API key for STT (Nova-2 model) |
| `TWILIO_ACCOUNT_SID` | ✅ | Twilio Account SID (starts with AC) |
| `TWILIO_AUTH_TOKEN` | ✅ | Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | ✅ | Twilio phone number in E.164 format |
| `TWILIO_WEBSOCKET_URL` | ✅ | Publicly accessible WebSocket URL for Pipecat |
| `RECEPTIONIST_EXTENSION` | ✅ | Twilio extension number to transfer calls to a human |
| `DATABASE_URL` | ✅ | PostgreSQL async connection string |
| `REDIS_URL` | ✅ | Redis URL for session state (db/0) |
| `CELERY_BROKER_URL` | ✅ | Redis URL for Celery broker (db/1) |
| `JWT_SECRET` | ✅ | Minimum 32-character secret for admin JWT tokens |
| `ADMIN_USERNAME` | ✅ | Admin dashboard username |
| `ADMIN_PASSWORD_HASH` | ✅ | bcrypt hash of the admin password |
| `DEBUG` | ❌ | Enable debug logging (default: false) |
| `MAX_CONCURRENT_CALLS` | ❌ | Max simultaneous Pipecat sessions (default: 5) |
| `CONTEXT_MAX_TOKENS` | ❌ | Max tokens injected as turn history context (default: 3000) |

---

## Agent Architecture

| Agent | Model | LangGraph Node | Responsibility |
|---|---|---|---|
| **Orchestrator** | GPT-4o | `orchestrator` | Classifies patient intent into 7 categories. Returns structured JSON routing decision. Never answers patient questions directly. |
| **Booking Agent** | GPT-4o | `booking` | Manages appointment booking, cancellation, and rescheduling via tool calls. Enforces confirmation before writes. |
| **Knowledge Agent** | GPT-4o | `knowledge` | Answers clinic FAQs strictly from ChromaDB-retrieved context blocks. Never fabricates information. |
| **Triage Agent** | GPT-4o | `triage` | Classifies symptom urgency (EMERGENCY / URGENT / ROUTINE). Always includes medical disclaimer. EMERGENCY bypasses booking entirely. |
| **Escalation Agent** | GPT-4o | `escalation` | Handles handoff to human staff via Twilio transfer or callback. Covers patient request, AI failure, and out-of-scope cases. |
| **Summarizer** | GPT-4o-mini | `summarizer` | Produces a 3–5 sentence factual prose summary after each turn for context injection into subsequent turns. |

---

## Latency Targets

| Stage | Target | Notes |
|---|---|---|
| STT (Deepgram Nova-2) | < 250 ms | Streaming, end-of-utterance detection |
| Orchestrator classification | < 400 ms | JSON-only output, low token count |
| Specialist agent response | < 800 ms | With tool calls up to 1.5s |
| TTS first audio chunk (ElevenLabs) | < 300 ms | Streaming output |
| Filler audio gap-fill | < 50 ms | Pre-generated, played during LLM processing |
| **End-to-end voice round trip** | **< 1.5 s** | P95 target under 5 concurrent calls |

---

## Architectural Principles

1. **Voice-first design**: All agent output is written for text-to-speech. No markdown, symbols, lists, or URLs in any spoken response.
2. **Strict agent separation**: Each LangGraph node has a single, enumerated responsibility. No agent performs tasks outside its domain.
3. **Tool-call confirmation**: The Booking Agent never performs write operations (book, cancel, reschedule) without explicit verbal confirmation from the patient.
4. **Hallucination prevention**: The Knowledge Agent is constrained to only the retrieved ChromaDB context. It never infers or fabricates clinic information.
5. **Emergency override**: EMERGENCY triage classification immediately routes to emergency services, bypassing all other agents and the normal booking flow.
6. **Graceful degradation**: If the Orchestrator fails to classify intent after 3 attempts, it escalates to a human. No patient is ever left in a classification loop.
7. **Filler audio continuity**: ElevenLabs filler audio clips are played during LLM processing gaps to maintain a natural conversation cadence and prevent silence-induced hang-ups.
8. **Async-first backend**: FastAPI with asyncpg and aioredis throughout. All I/O is non-blocking to support concurrent call sessions.
9. **Prompt versioning**: All system prompts are external `.txt` files with a standardised header (ID, version, date, author, test coverage, status). Hot-reloaded via Docker volume mount.
10. **Audit trail**: Every call session generates a `call_log` record capturing intent sequence, agent path, tool calls, and final disposition. Used for quality assurance and dashboard analytics.

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/webhook/voice` | Twilio sig | Twilio inbound call webhook. Returns TwiML. |
| `WebSocket` | `/ws/call` | — | Pipecat media stream socket for Twilio audio |
| `GET` | `/health/live` | — | Liveness probe. Returns `{"status": "ok"}` |
| `GET` | `/health/ready` | — | Readiness probe. Checks DB + Redis connectivity |
| `POST` | `/api/auth/login` | — | Admin login, returns JWT |
| `GET` | `/api/calls` | JWT | Paginated list of all call logs |
| `GET` | `/api/calls/{id}` | JWT | Full call log detail with transcript |
| `GET` | `/api/analytics/summary` | JWT | Call volume, intent breakdown, agent path stats |
| `GET` | `/api/appointments` | JWT | Paginated list of all appointments |
| `POST` | `/api/appointments` | JWT | Manually create an appointment |
| `PATCH` | `/api/appointments/{id}` | JWT | Update appointment status |
| `GET` | `/api/patients` | JWT | Paginated list of patients |
| `GET` | `/api/patients/{id}` | JWT | Patient detail with appointment history |
| `POST` | `/api/knowledge/ingest` | JWT | Upload a document to ChromaDB |
| `GET` | `/api/knowledge` | JWT | List all ingested knowledge documents |

---

## Project Structure

```
PRAXIS/
├── docker-compose.yml              # All services (postgres, redis, chroma, backend, frontend)
├── .env.example                    # Environment variable template
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── alembic/
│   │   └── versions/               # Database migration files
│   ├── prompts/
│   │   ├── SYS-ORCH-001.txt        # Orchestrator system prompt
│   │   ├── SYS-BOOK-001.txt        # Booking agent system prompt
│   │   ├── SYS-KNOW-001.txt        # Knowledge agent system prompt
│   │   ├── SYS-TRIAGE-001.txt      # Triage agent system prompt
│   │   ├── SYS-ESC-001.txt         # Escalation agent system prompt
│   │   └── SYS-SUM-001.txt         # Summarizer system prompt
│   ├── filler_audio/               # Pre-generated ElevenLabs filler .wav files
│   └── app/
│       ├── main.py                 # FastAPI app factory, router registration
│       ├── config.py               # Pydantic settings from environment
│       ├── database.py             # SQLAlchemy async engine + session
│       ├── models/
│       │   ├── patient.py          # Patient ORM model
│       │   ├── appointment.py      # Appointment ORM model
│       │   └── call_log.py         # Call log ORM model
│       ├── schemas/                # Pydantic request/response schemas
│       ├── routers/
│       │   ├── webhook.py          # Twilio voice webhook handler
│       │   ├── websocket.py        # Pipecat WebSocket handler
│       │   ├── calls.py            # Call log API endpoints
│       │   ├── appointments.py     # Appointment CRUD endpoints
│       │   ├── patients.py         # Patient management endpoints
│       │   ├── analytics.py        # Dashboard analytics endpoints
│       │   ├── knowledge.py        # ChromaDB ingestion endpoints
│       │   ├── auth.py             # JWT auth endpoints
│       │   └── health.py           # Liveness and readiness probes
│       ├── agents/
│       │   ├── graph.py            # LangGraph StateGraph definition
│       │   ├── orchestrator.py     # Orchestrator node
│       │   ├── booking.py          # Booking agent node
│       │   ├── knowledge.py        # Knowledge agent node
│       │   ├── triage.py           # Triage agent node
│       │   ├── escalation.py       # Escalation agent node
│       │   └── summarizer.py       # Summarizer node
│       ├── tools/
│       │   ├── booking_tools.py    # check_availability, book_appointment, etc.
│       │   ├── knowledge_tools.py  # ChromaDB retrieval
│       │   └── escalation_tools.py # store_callback_request
│       ├── services/
│       │   ├── pipecat_session.py  # Pipecat pipeline factory
│       │   ├── patient_lookup.py   # Phone-based caller identification
│       │   ├── sms.py              # Twilio SMS dispatch
│       │   └── prompt_loader.py    # Hot-reload prompt files from disk
│       └── tasks/
│           ├── celery_app.py       # Celery app instance + config
│           ├── sms_tasks.py        # Async SMS dispatch tasks
│           └── callback_tasks.py   # Scheduled callback tasks
│
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── pages/
│       │   ├── Dashboard.tsx       # Call volume charts, live session list
│       │   ├── Calls.tsx           # Call log table with transcript viewer
│       │   ├── Appointments.tsx    # Appointment management table
│       │   ├── Patients.tsx        # Patient records
│       │   ├── Knowledge.tsx       # Document upload and knowledge list
│       │   └── Login.tsx           # Admin login page
│       ├── components/             # Reusable UI components
│       ├── api/                    # Axios API client wrappers
│       └── store/                  # Zustand state management
│
└── tests/
    ├── test_orchestrator.py        # 22 orchestrator routing tests
    ├── test_booking.py             # 22 booking flow tests
    ├── test_triage.py              # Urgency classification tests
    ├── test_knowledge.py           # RAG grounding tests
    ├── test_escalation.py          # Escalation path tests
    └── test_summarizer.py          # 10 summarizer output tests
```

---

## Running Tests

### Unit and integration tests

```bash
cd backend
pytest tests/ -v
```

### Run a specific agent test suite

```bash
pytest tests/test_orchestrator.py -v
pytest tests/test_booking.py -v
pytest tests/test_summarizer.py -v
```

### With coverage report

```bash
pytest tests/ --cov=app --cov-report=term-missing
```

### End-to-end call simulation (requires all services running)

```bash
pytest tests/e2e/ -v --timeout=60
```

---

## License

MIT License — Copyright © 2025 Abdul. All rights reserved.

This project was developed as a Final Year Project (FYP). It is provided for educational and demonstration purposes. The triage functionality within this system is not a substitute for professional medical advice, diagnosis, or treatment.
