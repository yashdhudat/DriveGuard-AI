import random
from fastapi import APIRouter, WebSocket
import asyncio

router = APIRouter()

async def generate_telemetry():
    return {
        "Engine_RPM": random.randint(1800, 3500),
        "Engine_Temp_C": random.uniform(70, 130),
        "Oil_Pressure_psi": random.uniform(20, 60),
        "Vibration_m_s2": random.uniform(1, 12),
        "Brake_Wear_pct": random.randint(5, 90),
        "Battery_Voltage_V": random.uniform(12.0, 14.7),
    }

@router.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connected")

    try:
        while True:
            data = await generate_telemetry()

            await websocket.send_json({
                "type": "telemetry",
                "data": data
            })

            await asyncio.sleep(2)  # Send every 2 seconds

    except Exception:
        print("WebSocket closed")
