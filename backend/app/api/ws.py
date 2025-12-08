import random
import asyncio
from fastapi import APIRouter, WebSocket

router = APIRouter()

async def generate_telemetry():
    return {
        "Engine_RPM": random.randint(1800, 3500),
        "Engine_Temp_C": random.uniform(75, 120),
        "Oil_Pressure_psi": random.uniform(20, 50),
        "Vibration_m_s2": random.uniform(1, 10),
        "Brake_Wear_pct": random.uniform(5, 70),
        "Battery_Voltage_V": random.uniform(12.3, 14.2),
    }

async def calculate_health(data):
    rpm = data.get("Engine_RPM", 0)
    temp = data.get("Engine_Temp_C", 0)
    oil = data.get("Oil_Pressure_psi", 0)
    vib = data.get("Vibration_m_s2", 0)
    brake = data.get("Brake_Wear_pct", 0)
    battery = data.get("Battery_Voltage_V", 0)

    stress = (
        (rpm / 7000) * 0.2 +
        (temp / 150) * 0.25 +
        ((100 - oil) / 100) * 0.2 +
        (vib / 20) * 0.15 +
        (brake / 100) * 0.2
    )

    health = max(0, min(100, (1 - stress) * 100))
    rul = max(1, round(health / 2))

    return {
        "health": round(health),
        "rul_days": rul,
        "priority": "HIGH" if health < 40 else "MEDIUM" if health < 70 else "LOW",
    }

@router.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket opened")

    try:
        while True:
            data = await generate_telemetry()
            health = await calculate_health(data)

            await websocket.send_json({
                "type": "telemetry",
                "data": data,
                "predictions": health
            })

            await asyncio.sleep(1)

    except Exception as e:
        print("WebSocket closed:", e)
