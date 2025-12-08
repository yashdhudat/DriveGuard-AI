import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# Load dataset
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "../../data/vehicle_sensor_data.csv")

df = pd.read_csv(DATA_PATH)

# Encode categorical target
df["Fault_Type"] = df["Fault_Type"].astype("category").cat.codes

# Features + Labels
# Correct feature selection
X = df[[
    "Engine_RPM",
    "Engine_Temp_C",
    "Oil_Pressure_psi",
    "Vibration_m_s2",
    "Battery_Voltage_V",
    "Brake_Wear_pct"
]]

y = df["Fault_Type"]


# Train model
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    random_state=42
)

model.fit(X, y)

# Save model
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
joblib.dump(model, MODEL_PATH)

print("Model trained & saved →", MODEL_PATH)
