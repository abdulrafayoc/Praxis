from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api import webhooks, health, auth, calls, appointments, doctors, patients, knowledge, notifications, prompts
from app.config import settings
from app.middleware.rate_limiter import setup_rate_limiter
from app.middleware.twilio_signature import TwilioSignatureMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Praxis Voice Agent API starting up...")
    yield
    # Shutdown
    print("Praxis Voice Agent API shutting down...")

app = FastAPI(
    title="Praxis Voice Agent API",
    lifespan=lifespan
)

setup_rate_limiter(app)
app.add_middleware(TwilioSignatureMiddleware, twilio_auth_token=settings.twilio_auth_token)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(webhooks.router)
app.include_router(auth.router, prefix="/api/auth")
app.include_router(calls.router, prefix="/api/calls")
app.include_router(appointments.router, prefix="/api/appointments")
app.include_router(doctors.router, prefix="/api/doctors")
app.include_router(patients.router, prefix="/api/patients")
app.include_router(knowledge.router, prefix="/api/knowledge")
app.include_router(notifications.router, prefix="/api/notifications")
app.include_router(prompts.router, prefix="/api/prompts")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=settings.debug)
