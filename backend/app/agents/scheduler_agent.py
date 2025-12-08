# backend/app/agents/scheduler_agent.py

from datetime import datetime, timedelta
from typing import Dict, Any, List

class SchedulerAgent:
    """
    Smart SchedulerAgent:
    - Supports multiple service centers
    - Chooses the earliest SAFE slot based on severity + time-to-failure
    - Produces reasoning
    """

    def __init__(self):
        # Simulate 3 service centers with different loads
        self.service_centers = {
            "Center_A": {
                "location": "Mumbai Service Hub A",
                "slots": []  # Filled dynamically
            },
            "Center_B": {
                "location": "Pune Service Hub B",
                "slots": []
            },
            "Center_C": {
                "location": "Nashik Service Hub C",
                "slots": []
            }
        }

        self._generate_slots()

    def _generate_slots(self):
        """Generate slots for today + next 2 days (10AM–6PM, 30 min intervals)."""
        now = datetime.now()

        for center in self.service_centers.values():
            center["slots"] = []
            for day in range(0, 3):  # today + 2 days
                date = now + timedelta(days=day)
                start_time = datetime(date.year, date.month, date.day, 10, 0)
                end_time = datetime(date.year, date.month, date.day, 18, 0)

                curr = start_time
                while curr <= end_time:
                    center["slots"].append({
                        "time": curr,
                        "available": True
                    })
                    curr += timedelta(minutes=30)

    def _find_best_slot(self, severity: str, ttf_hours: int) -> Dict[str, Any]:
        """
        Find earliest safe slot:
        - Severity defines priority
        - Slot must be before time-to-failure window
        """
        now = datetime.now()
        safe_deadline = now + timedelta(hours=ttf_hours)

        # Weight based on severity
        severity_priority = {
            "Critical": 1,
            "High": 2,
            "Medium": 3,
            "Low": 4
        }

        # Sort centers by severity priority (lowest number = highest priority)
        sorted_centers = sorted(self.service_centers.items(),
                                key=lambda x: severity_priority.get(severity, 3))

        # Look for first safe slot across centers
        for center_name, center in sorted_centers:
            for slot in center["slots"]:
                if slot["available"] and slot["time"] <= safe_deadline:
                    # Select and block this slot
                    slot["available"] = False
                    return {
                        "center": center_name,
                        "center_location": center["location"],
                        "time": slot["time"],
                        "reasoning": f"Scheduled at {center_name} based on severity '{severity}' "
                                     f"and safe window before {safe_deadline.strftime('%Y-%m-%d %H:%M')}."
                    }

        # If no slot found in safe window
        return {
            "center": None,
            "center_location": None,
            "time": None,
            "reasoning": "No safe slot available before estimated failure time."
        }

    def run(self, severity_payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        severity_payload:
            severity: Low/Medium/High/Critical
            time_to_failure_hours: int
        """
        severity = severity_payload["severity"]
        ttf = severity_payload["time_to_failure_hours"]

        result = self._find_best_slot(severity, ttf)

        if result["time"]:
            scheduled_time = result["time"].strftime("%Y-%m-%d %H:%M")
            return {
                "scheduled_slot": scheduled_time,
                "service_center": result["center_location"],
                "reasoning": result["reasoning"]
            }
        else:
            return {
                "scheduled_slot": None,
                "service_center": None,
                "reasoning": result["reasoning"]
            }


# Manual test
if __name__ == "__main__":
    sched = SchedulerAgent()
    test_in = {
        "severity": "Critical",
        "time_to_failure_hours": 12
    }
    print(sched.run(test_in))
