# backend/app/api/agent_process.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from fastapi.responses import JSONResponse

from app.agents.master_agent import MasterAgent

router = APIRouter()
master_agent = MasterAgent()

class SensorPayload(BaseModel):
    Engine_RPM: float
    Engine_Temp_C: float
    Oil_Pressure_psi: float
    Vibration_m_s2: float
    Battery_Voltage_V: float
    Brake_Wear_pct: float
    vehicle_id: Optional[str] = None
    timestamp: Optional[str] = None

# ⭐ ADD THIS ⭐
@router.options("/process")
async def options_handler():
    return JSONResponse(status_code=200, content="OK")

@router.post("/process", summary="Run full agent pipeline (Diagnosis → Scheduler → Voice → RCA)")
def run_agent_pipeline(payload: SensorPayload):
    try:
        result = master_agent.run(payload.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent pipeline error: {str(e)}")
