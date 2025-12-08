# backend/app/agents/voice_agent.py

from typing import Dict, Any

class VoiceBotAgent:
    """
    VoiceBotAgent:
    - Generates a natural spoken call script
    - Generates a short notification message
    - Provides reasoning for orchestration transparency
    """

    def __init__(self):
        pass

    def run(self, diagnosis: Dict[str, Any], severity: Dict[str, Any], schedule: Dict[str, Any]):
        fault = diagnosis.get("fault_type", "Unknown Fault")
        recommended_action = diagnosis.get("recommended_action", "Please check your vehicle.")
        severity_level = severity.get("severity", "Unknown")
        scheduled_slot = schedule.get("scheduled_slot", None)
        center = schedule.get("service_center", None)

        # Build call script
        if scheduled_slot and center:
            call_script = (
                f"Hello! This is DriveGuard AI calling regarding your vehicle's condition. "
                f"Our system detected a {severity_level} severity issue: {fault}. "
                f"{recommended_action}. "
                f"We have automatically scheduled a service appointment for you at {center} "
                f"on {scheduled_slot}. If you cannot attend, please reschedule via the DriveGuard dashboard. "
                f"Thank you for ensuring safe vehicle health."
            )
        else:
            call_script = (
                f"Hello! This is DriveGuard AI calling regarding your vehicle's condition. "
                f"Our system detected a {severity_level} severity issue: {fault}. "
                f"{recommended_action}. "
                f"However, no safe service slot was found within the recommended time window. "
                f"Please visit your nearest service center immediately for inspection."
            )

        # Short message (push notification)
        if scheduled_slot and center:
            short_msg = (
                f"DriveGuard Alert: {fault} detected ({severity_level}). "
                f"Service booked at {center}, {scheduled_slot}."
            )
        else:
            short_msg = (
                f"DriveGuard Alert: {fault} detected ({severity_level}). "
                f"No safe service slots available — immediate inspection recommended."
            )

        # Reasoning
        reasoning = (
            f"VoiceBotAgent: Generated message based on fault '{fault}', "
            f"severity '{severity_level}', and schedule availability="
            f"{'yes' if scheduled_slot else 'no'}."
        )

        return {
            "voice_call_script": call_script,
            "short_message": short_msg,
            "reasoning": reasoning
        }


# Manual test
if __name__ == "__main__":
    agent = VoiceBotAgent()
    diagnosis = {
        "fault_type": "Oil_Pressure_Low",
        "recommended_action": "Stop driving immediately and inspect oil system."
    }
    severity = {"severity": "High"}
    schedule = {
        "scheduled_slot": "2025-12-04 10:00",
        "service_center": "Mumbai Service Hub A"
    }

    print(agent.run(diagnosis, severity, schedule))
