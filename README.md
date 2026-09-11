# NOVA Learning Digital Twin

NOVA is a hackathon-ready MVP for a personal learning digital twin. It models a student's mastery, confidence, accuracy, study rhythm, and recent activity, then turns that state into focused practice recommendations.

## What's included

- Next.js App Router dashboard with local demo data
- Adaptive quiz at `/quiz` with weak-topic targeting
- Performance trend, topic mastery, study rhythm, recent activity, and prerequisite map
- FastAPI service with twin, activity submission, prediction, and health endpoints
- Explainable twin update and recommendation services
- PostgreSQL + pgvector schema and Docker Compose service
- Backend unit tests for mastery updates

## Run the frontend

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The first run uses demo data and does not require API keys or a database.

## Run the backend

From the project root, create a virtual environment and install the backend requirements:

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```

The API is available at `http://localhost:8000`, with interactive docs at `/docs`.

Run backend tests with:

```bash
python -m pytest backend/tests
```

## Optional PostgreSQL

```bash
docker compose up -d postgres
```

The schema creates students, topics, learning states, and activity tables. Set `DATABASE_URL` from `.env.example` when wiring persistence into the API.

## MVP API

- `GET /health`
- `GET /api/twin/{student_id}`
- `POST /api/twin/{student_id}/activity`
- `GET /api/predictions/{topic}`

The current API stores a demo state in memory so the core feedback loop is easy to test. PostgreSQL is prepared for the next persistence pass.
