# backend/app/agents/demand_forecast_agent.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class DemandForecastAgent:

    def __init__(self):
        try:
            self.df = pd.read_csv("app/data/service_history.csv")
            self.df["date"] = pd.to_datetime(self.df["date"])
        except:
            # fallback synthetic dataset (30 days)
            today = datetime.now()
            dates = [today - timedelta(days=i) for i in range(30)]
            demand = np.random.randint(2, 12, size=len(dates))
            self.df = pd.DataFrame({
                "date": dates,
                "count": demand
            })
        self._prepare()

    def _prepare(self):
        if "count" not in self.df.columns:
            self.df = self.df.groupby("date").size().reset_index(name="count")
        self.df = self.df.sort_values("date")

    def forecast(self, days=14):
        """Hybrid simple model:
           - Moving average
           - Trend component (linear drift)
           - Weekly seasonality (weekends higher)
        """

        df = self.df.copy()
        df["day_num"] = np.arange(len(df))
        # trend
        z = np.polyfit(df["day_num"], df["count"], 1)
        trend_slope = z[0]

        # moving average
        mov_avg = df["count"].tail(7).mean()

        # forecast generation
        future = []
        start_date = df["date"].max()

        for i in range(1, days + 1):
            date = start_date + timedelta(days=i)
            base = mov_avg + trend_slope * i

            # weekend boost
            if date.weekday() >= 5:
                base *= 1.15

            # maintenance seasonality (first week of month high)
            if date.day <= 7:
                base *= 1.20

            demand = max(1, round(base))
            future.append({"date": date.strftime("%Y-%m-%d"), "predicted_demand": demand})

        # highlight peak days (center capacity assumed 10/day)
        peaks = [f for f in future if f["predicted_demand"] > 10]

        summary = {
            "avg_daily_load": float(df["count"].mean()),
            "trend_direction": "increasing" if trend_slope > 0 else "decreasing",
            "peak_days": peaks,
            "safe_capacity": all(f["predicted_demand"] <= 10 for f in future),
        }

        return {
            "forecast_days": future,
            "summary": summary,
            "reasoning": (
                f"DemandForecastAgent: Trend slope={trend_slope:.2f}, "
                f"7-day moving avg={mov_avg:.1f}; "
                "applied seasonality for weekends & first-week-of-month."
            )
        }

    def run(self, days=14):
        return self.forecast(days)
