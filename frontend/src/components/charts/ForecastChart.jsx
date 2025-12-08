import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Label,
} from "recharts";

export default function ForecastChart({ forecast }) {
  if (!forecast || !forecast.forecast_days) {
    return (
      <div className="text-slate-500 p-4">
        No forecast data available.
      </div>
    );
  }

  const capacityLimit = 10; // service center max capacity
  const data = forecast.forecast_days.map((d) => ({
    date: d.date,
    demand: d.predicted_demand,
    over: d.predicted_demand > capacityLimit,
  }));

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">14-Day Service Demand Forecast</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis />
          <Tooltip />

          {/* Service Capacity Line */}
          <ReferenceLine y={capacityLimit} stroke="red" strokeDasharray="3 3">
            <Label position="right" fill="red" value="Capacity Limit" />
          </ReferenceLine>

          <Bar
            dataKey="demand"
            name="Predicted Demand"
            // Red if capacity exceeded, blue otherwise
            fill="#3b82f6"
            stroke="#1e3a8a"
            radius={[4, 4, 0, 0]}
            label={{ position: "top", fontSize: 10 }}
          >
            {data.map((entry, index) => (
              <cell
                key={`cell-${index}`}
                fill={entry.over ? "#ef4444" : "#3b82f6"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Summary Section */}
      <div className="mt-4 text-sm text-slate-700">
        <p>
          <strong>Average Load:</strong> {forecast.summary.avg_daily_load.toFixed(1)} vehicles/day
        </p>
        <p>
          <strong>Trend Direction:</strong> {forecast.summary.trend_direction}
        </p>
        <p>
          <strong>Peak Days:</strong>
          {forecast.summary.peak_days.length === 0
            ? " None"
            : forecast.summary.peak_days
                .map((d) => d.date + " (" + d.predicted_demand + ")")
                .join(", ")}
        </p>
        <p>
          <strong>Capacity Status:</strong>{" "}
          {forecast.summary.safe_capacity
            ? "Within Safe Limits"
            : "⚠ Over Capacity on some days"}
        </p>
      </div>
    </div>
  );
}
