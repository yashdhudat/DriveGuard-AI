import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import { smoothData } from "../../utils/smoothing";

export default function EngineChart({ data }) {
  const smoothed = smoothData(data, "Engine_RPM", 8);

  const chartData = smoothed.map((d, idx) => ({
    time: d.time || `T${idx}`,
    Engine_RPM: d.Engine_RPM ?? 0,
  }));

  return (
    <div>
      <h3 className="font-semibold mb-2">Engine RPM</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="time" hide />
          <YAxis domain={["auto", "auto"]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "white" }} />
          <Line type="monotone" dataKey="Engine_RPM" stroke="#38bdf8" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
