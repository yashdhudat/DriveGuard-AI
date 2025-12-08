import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";

import { smoothData } from "../../utils/smoothing";

export default function TemperatureChart({ data }) {
  // Apply smoothing (reduces noise)
  const smoothed = smoothData(data, "Engine_Temp_C", 6);

  const chartData = smoothed.map((d, idx) => ({
    time: d.time || `T${idx}`,
    Engine_Temp_C: d.Engine_Temp_C ?? 0,
  }));

  return (
    <div>
      <h3 className="font-semibold mb-2">Engine Temperature (°C)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="time" hide />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "white" }}
          />
          <Line
            type="monotone"
            dataKey="Engine_Temp_C"
            stroke="#ef4444"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
