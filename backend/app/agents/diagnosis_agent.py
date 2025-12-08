# backend/app/agents/diagnosis_agent.py
from typing import Dict, Any
from app.ml.predictor import predict_fault
from app.utils.fault_mapping import FAULT_MAP

class DiagnosisAgent:
    """
    DiagnosisAgent:
    - Calls the ML predictor
    - Maps numeric code → human-friendly fault info
    - Produces a reasoning snippet (explainable)
    - Returns structured output used by MasterAgent
    """

    def __init__(self):
        # nothing to init for now, model is loaded inside predictor
        pass

    def run(self, sensor_payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        sensor_payload: dict with keys:
            Engine_RPM, Engine_Temp_C, Oil_Pressure_psi,
            Vibration_m_s2, Battery_Voltage_V, Brake_Wear_pct
        returns dict with:
            - reasoning: str
            - diagnosis: {fault_code, fault_type, severity, maintenance_required, recommended_action}
        """
        # call the predictor (returns int code)
        try:
            fault_code = predict_fault(sensor_payload)
        except Exception as e:
            # defensive: return error in structured format
            return {
                "reasoning": f"DiagnosisAgent error: {str(e)}",
                "diagnosis": None,
                "error": True
            }

        # map code → fault info
        fault_info = FAULT_MAP.get(fault_code, {
            "fault_type": "Unknown",
            "severity": "Unknown",
            "maintenance_required": True,
            "recommended_action": "Inspect vehicle."
        })

        # build short human-readable reasoning (explainable)
        components = []
        # Example rules for reasoning text (keeps it simple & transparent)
        rpm = sensor_payload.get("Engine_RPM")
        temp = sensor_payload.get("Engine_Temp_C")
        oil = sensor_payload.get("Oil_Pressure_psi")
        vib = sensor_payload.get("Vibration_m_s2")
        volt = sensor_payload.get("Battery_Voltage_V")
        brake = sensor_payload.get("Brake_Wear_pct")

        # Add observations
        if temp is not None and temp > 115:
            components.append(f"engine_temp={temp}°C (high)")
        if oil is not None and oil < 20:
            components.append(f"oil_pressure={oil} psi (low)")
        if vib is not None and vib > 3.0:
            components.append(f"vibration={vib} m/s² (high)")
        if volt is not None and volt < 12.0:
            components.append(f"battery_voltage={volt} V (low)")
        if brake is not None and brake > 85:
            components.append(f"brake_wear={brake}% (critical)")

        # fallback: include sampled sensor snapshot if components empty
        if not components:
            components.append(f"snapshot: RPM={rpm}, Temp={temp}, Oil={oil}")

        reasoning_text = (
            f"DiagnosisAgent: ML predicted code={fault_code} ({fault_info['fault_type']}). "
            f"Observations: {', '.join(components)}."
        )

        diagnosis = {
            "fault_code": fault_code,
            "fault_type": fault_info["fault_type"],
            "severity": fault_info["severity"],
            "maintenance_required": fault_info["maintenance_required"],
            "recommended_action": fault_info["recommended_action"]
        }

        return {
            "reasoning": reasoning_text,
            "diagnosis": diagnosis,
            "error": False
        }


# quick manual test when run as script
if __name__ == "__main__":
    # sample payload
    sample = {
        "Engine_RPM": 3500,
        "Engine_Temp_C": 125,
        "Oil_Pressure_psi": 15,
        "Vibration_m_s2": 0.6,
        "Battery_Voltage_V": 13.8,
        "Brake_Wear_pct": 40
    }

    agent = DiagnosisAgent()
    out = agent.run(sample)
    print(out)
