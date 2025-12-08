from fastapi import APIRouter
from pydantic import BaseModel
from app.ml.predictor import predict_fault
from app.utils.fault_mapping import FAULT_MAP

router = APIRouter()

class SensorData(BaseModel):
    Engine_RPM: float
    Engine_Temp_C: float
    Oil_Pressure_psi: float
    Vibration_m_s2: float
    Battery_Voltage_V: float
    Brake_Wear_pct: float

@router.post("/predict")
def predict_engine_fault(data: SensorData):
    fault_code = predict_fault(data.dict())
    fault_info = FAULT_MAP.get(fault_code, {})

    return {
        "fault_code": fault_code,
        "fault_type": fault_info["fault_type"],
        "severity": fault_info["severity"],
        "maintenance_required": fault_info["maintenance_required"],
        "recommended_action": fault_info["recommended_action"]
    }
