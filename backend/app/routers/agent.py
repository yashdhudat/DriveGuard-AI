# backend/app/routers/agent.py
from fastapi import APIRouter
from app.agents.master_agent import MasterAgent

router = APIRouter(prefix="/api/agent", tags=["MasterAgent"])

agent = MasterAgent()

@router.post("/run")
async def run_agent(payload: dict):
    sensor_payload = payload.get("sensor_payload", {})
    return agent.run(sensor_payload)
