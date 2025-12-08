# backend/app/agents/severity_agent.py

from typing import Dict, Any

class SeverityAgent:
    """
    SeverityAgent:
    - Takes diagnosis + sensor readings
    - Computes severity, risk score, and estimated time to failure
    - Produces explainable reasoning
    """

    def __init__(self):
        pass

    def run(self, sensor_payload: Dict[str, Any], diagnosis: Dict[str, Any]):
        fault_type = diagnosis["fault_type"]
        severity_base = diagnosis["severity"]  # Initial severity from FAULT_MAP

        rpm = sensor_payload.get("Engine_RPM")
        temp = sensor_payload.get("Engine_Temp_C")
        oil = sensor_payload.get("Oil_Pressure_psi")
        vib = sensor_payload.get("Vibration_m_s2")
        volt = sensor_payload.get("Battery_Voltage_V")
        brake = sensor_payload.get("Brake_Wear_pct")

        risk_score = 0.0
        reasoning_parts = []

        # ------------------------------
        # Base severity contributions
        # ------------------------------
        base_map = {
            "Low": 0.2,
            "Medium": 0.5,
            "High": 0.75,
            "Critical": 0.9
        }

        risk_score += base_map.get(severity_base, 0.4)

        # ------------------------------
        # Additional sensor-based risk
        # ------------------------------

        if temp and temp > 115:
            risk_score += 0.15
            reasoning_parts.append(f"Very high engine temperature ({temp}°C)")
        
        if oil and oil < 20:
            risk_score += 0.15
            reasoning_parts.append(f"Low oil pressure ({oil} psi)")
        
        if vib and vib > 3.0:
            risk_score += 0.10
            reasoning_parts.append(f"High vibration ({vib} m/s²)")
        
        if volt and volt < 12.0:
            risk_score += 0.10
            reasoning_parts.append(f"Low battery voltage ({volt} V)")
        
        if brake and brake > 85:
            risk_score += 0.10
            reasoning_parts.append(f"Brake wear critical ({brake}%)")

        # Clamp max score
        risk_score = min(risk_score, 1.0)

        # ------------------------------
        # Estimate time-to-failure
        # ------------------------------
        if risk_score < 0.3:
            ttf = 72  # hours
        elif risk_score < 0.5:
            ttf = 48
        elif risk_score < 0.7:
            ttf = 24
        elif risk_score < 0.85:
            ttf = 12
        else:
            ttf = 4

        # ------------------------------
        # Final severity label
        # ------------------------------
        if risk_score < 0.3:
            final_severity = "Low"
        elif risk_score < 0.55:
            final_severity = "Medium"
        elif risk_score < 0.75:
            final_severity = "High"
        else:
            final_severity = "Critical"

        # Build reasoning
        reasoning = (
            f"SeverityAgent: Fault={fault_type}. Base severity={severity_base}. "
            f"Sensor analysis → {', '.join(reasoning_parts) if reasoning_parts else 'no critical anomalies'}. "
            f"Computed risk_score={risk_score:.2f}, estimated time-to-failure={ttf}h."
        )

        return {
            "severity": final_severity,
            "risk_score": round(risk_score, 2),
            "time_to_failure_hours": ttf,
            "reasoning": reasoning
        }


# Test block
if __name__ == "__main__":
    agent = SeverityAgent()
    print(agent.run(
        {
            "Engine_RPM": 3500,
            "Engine_Temp_C": 125,
            "Oil_Pressure_psi": 15,
            "Vibration_m_s2": 0.6,
            "Battery_Voltage_V": 13.8,
            "Brake_Wear_pct": 40
        },
        {
            "fault_type": "Overheating",
            "severity": "Critical",
            "maintenance_required": True,
            "recommended_action": "Check coolant"
        }
    ))
