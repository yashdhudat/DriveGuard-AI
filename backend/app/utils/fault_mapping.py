FAULT_MAP = {
    0: {
        "fault_type": "None",
        "severity": "Low",
        "maintenance_required": False,
        "recommended_action": "No action needed. Vehicle is operating normally."
    },
    1: {
        "fault_type": "High_Vibration",
        "severity": "Medium",
        "maintenance_required": True,
        "recommended_action": "Inspect engine mounts, wheel balancing, and suspension system."
    },
    2: {
        "fault_type": "Oil_Pressure_Low",
        "severity": "High",
        "maintenance_required": True,
        "recommended_action": "Check engine oil level, oil pump, and lubrication system immediately."
    },
    3: {
        "fault_type": "Battery_Weak",
        "severity": "Medium",
        "maintenance_required": True,
        "recommended_action": "Test battery voltage and alternator output. Replace if needed."
    },
    4: {
        "fault_type": "Overheating",
        "severity": "Critical",
        "maintenance_required": True,
        "recommended_action": "Stop vehicle. Check coolant level, radiator, thermostat, and cooling fan."
    },
    5: {
        "fault_type": "Brake_Worn",
        "severity": "High",
        "maintenance_required": True,
        "recommended_action": "Replace brake pads and check rotor condition."
    },
    6: {
        "fault_type": "Random_Anomaly",
        "severity": "Low",
        "maintenance_required": False,
        "recommended_action": "Recheck sensors. No immediate action required."
    }
}
