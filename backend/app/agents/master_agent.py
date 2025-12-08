# backend/app/agents/master_agent.py

from typing import Dict, Any

from app.agents.diagnosis_agent import DiagnosisAgent
from app.agents.severity_agent import SeverityAgent
from app.agents.rca_agent import RCAAgent
from app.agents.scheduler_agent import SchedulerAgent
from app.agents.voice_agent import VoiceBotAgent
from app.agents.demand_forecast_agent import DemandForecastAgent


class MasterAgent:
    """
    MasterAgent (Advanced Multi-Agent Orchestrator)
    Executes full pipeline with reasoning trace:
        1. Diagnosis → Fault + Required Action
        2. Severity → Risk Score + TTF
        3. RCA → Historical Pattern Summary
        4. Scheduler → Service Slot Suggestion
        5. Demand Forecast → Expected Failure Count
        6. Voice → User Communication Style
    """

    def __init__(self):
        self.diagnosis_agent = DiagnosisAgent()
        self.severity_agent = SeverityAgent()
        self.rca_agent = RCAAgent()
        self.scheduler_agent = SchedulerAgent()
        self.demand_agent = DemandForecastAgent()
        self.voice_agent = VoiceBotAgent()

    def run(self, sensor_payload: Dict[str, Any]) -> Dict[str, Any]:

        reasoning_log = []

        try:
            # STEP 1 — Diagnosis
            diag_out = self.diagnosis_agent.run(sensor_payload)
            reasoning_log.append(diag_out.get("reasoning", "Diagnosis step done."))

            if diag_out["error"]:
                return {"error": "DiagnosisAgent failed", "trace": reasoning_log}

            diagnosis = diag_out["diagnosis"]

            # STEP 2 — Severity Estimation
            severity_out = self.severity_agent.run(sensor_payload, diagnosis)
            reasoning_log.append(severity_out.get("reasoning", "Severity step done."))

            # STEP 3 — Root Cause Analysis
            rca_out = self.rca_agent.run(sensor_payload, diagnosis)
            reasoning_log.append(rca_out.get("reasoning", "RCA step done."))

            # STEP 4 — Service Scheduler
            if diagnosis["maintenance_required"]:
                schedule_out = self.scheduler_agent.run({
                    "severity": severity_out["severity"],
                    "time_to_failure_hours": severity_out["time_to_failure_hours"]
                })
                reasoning_log.append(schedule_out.get("reasoning", "Scheduler step done."))
            else:
                schedule_out = {
                    "scheduled_slot": None,
                    "service_center": None,
                    "reasoning": "Maintenance NOT required → Skipped"
                }
                reasoning_log.append(schedule_out["reasoning"])

            # STEP 5 — Demand Forecast (NEW)
            demand_out = self.demand_agent.run()
            reasoning_log.append(demand_out.get("reasoning", "Forecast step done."))

            # STEP 6 — Voice Bot Message
            voice_out = self.voice_agent.run(diagnosis, severity_out, schedule_out)
            reasoning_log.append(voice_out.get("reasoning", "Voice message step done."))

        except Exception as err:
            reasoning_log.append(f"⚠️ Pipeline crashed: {str(err)}")
            return {"error": "MasterAgent Pipeline Failure", "trace": reasoning_log}

        # FINAL RESPONSE
        final_output = {
            "fault_type": diagnosis["fault_type"],
            "severity": severity_out["severity"],
            "risk_score": severity_out["risk_score"],
            "recommended_action": diagnosis["recommended_action"],
            "rca_summary": rca_out.get("rca_summary"),
            "capa": rca_out.get("capa"),
            "scheduled_slot": schedule_out.get("scheduled_slot"),
            "service_center": schedule_out.get("service_center"),

            # ⭐ THE IMPORTANT LINE YOU ARE STILL MISSING
            "demand_out": demand_out,

            # optional legacy field — safe to keep or remove
            "forecast_demand_in_region": demand_out.get("forecast_count") if isinstance(demand_out, dict) else None,

            "voice_call_script": voice_out.get("voice_call_script"),
            "notification_message": voice_out.get("short_message"),
        }




        return {
            "reasoning_trace": reasoning_log,
            "final_output": final_output
        }


# Quick test
if __name__ == "__main__":
    agent = MasterAgent()
    sample = {
        "Engine_RPM": 3500,
        "Engine_Temp_C": 125,
        "Oil_Pressure_psi": 15,
        "Vibration_m_s2": 0.6,
        "Battery_Voltage_V": 13.8,
        "Brake_Wear_pct": 40
    }
    from pprint import pprint
    pprint(agent.run(sample))
