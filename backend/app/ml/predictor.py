import joblib
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

model = joblib.load(MODEL_PATH)

# Same order of features as training
FEATURES = [
    "Engine_RPM",
    "Engine_Temp_C",
    "Oil_Pressure_psi",
    "Vibration_m_s2",
    "Battery_Voltage_V",
    "Brake_Wear_pct"
]

def predict_fault(data: dict):
    df = pd.DataFrame([data], columns=FEATURES)
    prediction = model.predict(df)[0]
    return int(prediction)
