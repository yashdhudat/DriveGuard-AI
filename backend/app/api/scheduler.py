# backend/app/api/scheduler.py

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta

router = APIRouter(prefix="/scheduler", tags=["Scheduler"])

# ------------------------------------------------------------
# In-memory mock service centers (replace with DB later)
# ------------------------------------------------------------
SERVICE_CENTERS = [
    {
        "id": 1,
        "name": "Mahindra Service Hub A",
        "capacity_daily": 10,
        "skills": ["engine", "brake", "battery"],
        "bookings": []  # each: {"vehicle_id", "scheduled_for", "priority"}
    },
    {
        "id": 2,
        "name": "Hero Service Center",
        "capacity_daily": 8,
        "skills": ["engine", "battery"],
        "bookings": []
    },
    {
        "id": 3,
        "name": "Bosch Multi-brand Garage",
        "capacity_daily": 12,
        "skills": ["brake", "battery"],
        "bookings": []
    }
]

# ------------------------------------------------------------
# Request body model
# ------------------------------------------------------------
class ServiceRequest(BaseModel):
    vehicle_id: str
    earliest_slot: Optional[datetime] = None
    required_skills: Optional[List[str]] = []
    priority: int = 5

    # NEW FIELDS (from Slot Calendar UI)
    selected_center_id: Optional[int] = None
    selected_slot_time: Optional[str] = None  # "14:00"


# ------------------------------------------------------------
# Helper: Get today's bookings
# ------------------------------------------------------------
def get_bookings_for_today(center):
    today = datetime.now().date()
    return [
        b for b in center["bookings"]
        if b["scheduled_for"].date() == today
    ]


# ------------------------------------------------------------
# API 1: Return load status of all service centers
# ------------------------------------------------------------
@router.get("/centers")
def get_centers():
    today = datetime.now().date()
    centers_out = []

    for c in SERVICE_CENTERS:
        todays_bookings = get_bookings_for_today(c)
        load_pct = round((len(todays_bookings) / c["capacity_daily"]) * 100, 1)

        centers_out.append({
            "id": c["id"],
            "name": c["name"],
            "capacity_daily": c["capacity_daily"],
            "skills": c["skills"],
            "bookings_today": len(todays_bookings),
            "load_pct": load_pct,
            "status": "green" if load_pct < 60 else
                      "yellow" if load_pct < 90 else "red"
        })

    return centers_out


# ------------------------------------------------------------
# API 2: Return available time slots for selected center
# ------------------------------------------------------------
@router.get("/slots/{center_id}")
def get_available_slots(center_id: int):
    center = next((c for c in SERVICE_CENTERS if c["id"] == center_id), None)
    if not center:
        return {"error": "Center not found"}

    todays_bookings = get_bookings_for_today(center)

    # Simple hourly slots: 10:00 to 10 + capacity hours
    base_hour = 10
    slots = []

    for i in range(center["capacity_daily"]):
        slot_time = datetime.now().replace(hour=base_hour + i, minute=0, second=0, microsecond=0)
        
        booked = any(b["scheduled_for"].hour == slot_time.hour for b in todays_bookings)

        slots.append({
            "time": slot_time.strftime("%H:%M"),
            "available": not booked
        })

    return slots


# ------------------------------------------------------------
# API 3: Assign or auto-select service center
# ------------------------------------------------------------
@router.post("/request")
def assign_service_center(req: ServiceRequest):

    today = datetime.now().date()

    # --------------------------------------------------------
    # CASE 1: User SELECTED center + slot manually
    # --------------------------------------------------------
    if req.selected_center_id and req.selected_slot_time:
        center = next((c for c in SERVICE_CENTERS if c["id"] == req.selected_center_id), None)
        if not center:
            return {"assigned": False, "detail": "Selected center not found"}

        # Build datetime slot
        hour, minute = map(int, req.selected_slot_time.split(":"))
        slot_dt = datetime.now().replace(hour=hour, minute=minute, second=0, microsecond=0)

        # Check if slot is available
        if any(b["scheduled_for"].hour == hour for b in get_bookings_for_today(center)):
            return {"assigned": False, "detail": "Slot already booked"}

        # Save booking
        booking = {
            "vehicle_id": req.vehicle_id,
            "scheduled_for": slot_dt,
            "priority": req.priority
        }
        center["bookings"].append(booking)

        return {
            "assigned": True,
            "center_id": center["id"],
            "center_name": center["name"],
            "scheduled_for": slot_dt,
            "manual_selection": True,
            "skills_used": req.required_skills,
            "priority": req.priority
        }

    # --------------------------------------------------------
    # CASE 2: AUTO-SELECTION MODE (no UI slot chosen)
    # --------------------------------------------------------
    assigned_center = None
    required = set(req.required_skills or [])

    for center in SERVICE_CENTERS:
        # skill check
        if not required.issubset(set(center["skills"])):
            continue

        todays_bookings = get_bookings_for_today(center)
        if len(todays_bookings) < center["capacity_daily"]:
            assigned_center = center
            break

    if not assigned_center:
        return {"assigned": False, "detail": "All centers full today"}

    # Auto-assign earliest available slot
    next_slot_hour = 10 + len(get_bookings_for_today(assigned_center))
    slot_time = datetime.now().replace(hour=next_slot_hour, minute=0, second=0, microsecond=0)

    booking = {
        "vehicle_id": req.vehicle_id,
        "scheduled_for": slot_time,
        "priority": req.priority
    }
    assigned_center["bookings"].append(booking)

    return {
        "assigned": True,
        "center_id": assigned_center["id"],
        "center_name": assigned_center["name"],
        "scheduled_for": slot_time,
        "manual_selection": False,
        "skills_used": req.required_skills,
        "priority": req.priority
    }
