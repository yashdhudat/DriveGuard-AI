# backend/app/agents/rca_agent.py
import os
from typing import Dict, Any, List
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

DATA_LOGS_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "..", "data", "maintenance_logs.csv")

# Fallback corpus (used if maintenance_logs.csv not present)
FALLBACK_NOTES = [
    {
        "title": "Oil pump failure due to low viscosity oil and worn pump",
        "note": "Vehicle exhibited falling oil pressure to <20 psi over repeated cycles. Inspection revealed worn oil pump gear and use of low-viscosity oil causing poor lubrication. Replaced oil pump, changed oil to recommended viscosity, and added oil filter replacement to scheduled maintenance."
    },
    {
        "title": "Coolant leak at hose junction causing overheating",
        "note": "Engine temperature rose gradually then spiked above 120°C. Found coolant leak at radiator hose clamp and degraded thermostat. Replaced hose, tightened clamps, flushed coolant, and replaced thermostat. Added periodic coolant system checks to CAPA."
    },
    {
        "title": "Battery discharge due to weak alternator",
        "note": "Battery voltage dropped below 12 V even when idling. Alternator output below spec. Replaced alternator, tested battery, and added alternator test to routine service checks."
    },
    {
        "title": "Wheel imbalance and broken engine mount causing vibration",
        "note": "High vibration readings ( >3 m/s² ) correlated with wheel speeds. Found wheel imbalance and a cracked engine mount. Balanced wheels and replaced engine mount. Added wheel-balance and mount inspection in 10k km service."
    },
    {
        "title": "Brake pad wear due to aggressive city driving",
        "note": "Brake wear >85% observed. Pads were degraded and rotors showed scoring. Replaced pads, machined rotors, and adjusted driving recommendation; increased brake inspection frequency for heavy urban use."
    },
    {
        "title": "Intermittent sensor fault reported as random anomaly",
        "note": "Intermittent unusual readings traced to corroded sensor connector. Cleaned contacts and replaced sensor harness. Added sensor connector inspection to preventive checklist."
    }
]

class RCAAgent:
    """
    RCAAgent:
    - Accepts diagnosis + sensor snapshot
    - Searches past maintenance notes using TF-IDF similarity
    - Returns top matches + a concise RCA summary and CAPA suggestions
    """

    def __init__(self):
        # load logs if available
        self.corpus = []
        self.titles = []
        self._load_corpus()
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.tfidf = self.vectorizer.fit_transform(self.corpus)

    def _load_corpus(self):
        # try to load user-provided maintenance logs CSV
        try:
            if os.path.exists(DATA_LOGS_PATH):
                df = pd.read_csv(DATA_LOGS_PATH)
                # expect columns 'title' and 'note' or 'log'
                if 'note' in df.columns:
                    notes = df['note'].astype(str).tolist()
                elif 'log' in df.columns:
                    notes = df['log'].astype(str).tolist()
                else:
                    # combine all text-like columns
                    notes = df.astype(str).agg(' '.join, axis=1).tolist()

                titles = df['title'].astype(str).tolist() if 'title' in df.columns else [f"log_{i}" for i in range(len(notes))]
                self.corpus = notes if notes else [n['note'] for n in FALLBACK_NOTES]
                self.titles = titles if titles else [n['title'] for n in FALLBACK_NOTES]
                return
        except Exception:
            # fall through to fallback
            pass

        # fallback
        self.corpus = [n['note'] for n in FALLBACK_NOTES]
        self.titles = [n['title'] for n in FALLBACK_NOTES]

    def _build_query(self, diagnosis: Dict[str, Any], sensor_payload: Dict[str, Any]) -> str:
        parts = []
        parts.append(f"Fault:{diagnosis.get('fault_type')}")
        # add maintenance_required and severity
        parts.append(f"Severity:{diagnosis.get('severity')}")
        # add key sensor readings that matter
        for k in ["Engine_Temp_C", "Oil_Pressure_psi", "Vibration_m_s2", "Battery_Voltage_V", "Brake_Wear_pct", "Engine_RPM"]:
            v = sensor_payload.get(k)
            if v is not None:
                parts.append(f"{k}={v}")
        # short human summary
        return " ".join(parts)

    def run(self, sensor_payload: Dict[str, Any], diagnosis: Dict[str, Any], top_k: int = 2) -> Dict[str, Any]:
        """
        Returns:
            {
              "rca_matches": [ {title, note, score}, ... ],
              "rca_summary": "Concise RCA sentence.",
              "capa": "Recommended CAPA actions"
            }
        """
        # Defensive checks
        if not self.corpus:
            return {
                "rca_matches": [],
                "rca_summary": "No maintenance logs available to infer RCA.",
                "capa": "Collect maintenance logs for richer RCA."
            }

        query = self._build_query(diagnosis, sensor_payload)
        q_vec = self.vectorizer.transform([query])
        scores = cosine_similarity(q_vec, self.tfidf).flatten()
        ranked_idx = scores.argsort()[::-1][:top_k]

        matches: List[Dict[str, Any]] = []
        for idx in ranked_idx:
            matches.append({
                "title": self.titles[idx] if idx < len(self.titles) else f"log_{idx}",
                "note": self.corpus[idx],
                "score": float(round(scores[idx], 3))
            })

        # Create concise RCA and CAPA based on matched top result + diagnosis heuristics
        top = matches[0] if matches else None

        # Heuristic summarizer (short)
        fault = diagnosis.get("fault_type", "Unknown")
        rc_parts = []
        if fault == "Oil_Pressure_Low":
            rc_parts.append("Oil pressure critically low; possible oil pump failure, leak, or clogged oil passage.")
            capa = "Inspect oil pump and lines, change oil to recommended grade, replace filter, schedule leak test."
        elif fault == "High_Vibration":
            rc_parts.append("High vibration indicates possible wheel imbalance, damaged engine mount, or bearing failure.")
            capa = "Perform wheel balance, inspect engine mounts and bearings, replace worn components."
        elif fault == "Battery_Weak":
            rc_parts.append("Battery voltage low; likely a weak battery or faulty alternator/charging system.")
            capa = "Test alternator output and battery capacity; replace battery or alternator as needed."
        elif fault == "Overheating":
            rc_parts.append("Engine overheating likely due to coolant leak, failed thermostat, or cooling fan issue.")
            capa = "Check coolant level, inspect hoses and radiator, test thermostat and fan, flush cooling system."
        elif fault == "Brake_Worn":
            rc_parts.append("Brake wear above safe threshold; pads/rotors are worn.")
            capa = "Replace brake pads, machine or replace rotors, inspect brake fluid and calipers."
        elif fault == "Random_Anomaly":
            rc_parts.append("Intermittent sensor anomaly likely due to connector/cable issues or sensor faults.")
            capa = "Inspect sensor connectors, clean and reseat; replace sensor if fault persists."
        else:
            rc_parts.append(f"Analysis suggests potential cause related to {fault}.")
            capa = "Perform detailed inspection and log findings."

        # If we have a top matched note, include it as evidence
        evidence = f"Referenced log: {top['title']}" if top else "No historical evidence found."

        rca_summary = " ".join(rc_parts) + " " + evidence

        return {
            "rca_matches": matches,
            "rca_summary": rca_summary,
            "capa": capa
        }


# Quick manual test when run directly
if __name__ == "__main__":
    agent = RCAAgent()
    sensor = {
        "Engine_RPM": 3500,
        "Engine_Temp_C": 125,
        "Oil_Pressure_psi": 15,
        "Vibration_m_s2": 0.6,
        "Battery_Voltage_V": 13.8,
        "Brake_Wear_pct": 40
    }
    diagnosis = {"fault_type": "Oil_Pressure_Low", "severity": "High"}
    out = agent.run(sensor, diagnosis)
    import json
    print(json.dumps(out, indent=2))
