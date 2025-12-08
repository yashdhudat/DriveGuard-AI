from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.diagnostics import router as diagnostics_router
from app.api.agent_process import router as agent_router
from app.api.telemetry import router as telemetry_router
from app.api.ws import router as ws_router
from app.api.report import router as report_router
from app.routers.agent import router as agent_router
from app.api.scheduler import router as scheduler_router


app = FastAPI(
    title="DriveGuard AI Backend",
    version="1.0.0",
    description="Agentic AI Platform for Predictive Maintenance"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(health_router, prefix="/api")
app.include_router(diagnostics_router, prefix="/api")
app.include_router(agent_router, prefix="/api/agent")
app.include_router(telemetry_router)
app.include_router(ws_router, prefix="/api")
app.include_router(report_router, prefix="/api")
app.include_router(agent_router)
app.include_router(scheduler_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
