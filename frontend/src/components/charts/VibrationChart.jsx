import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import { smoothData } from "../../utils/smoothing";

export default function VibrationChart({ data }) {
  const smoothed = smoothData(data, "Vibration_m_s2", 6);

  const chartData = smoothed.map((d, idx) => ({
    time: d.time || `T${idx}`,
    Vibration_m_s2: d.Vibration_m_s2 ?? 0,
  }));

  return (
    <div>
      <h3 className="font-semibold mb-2">Vibration (m/s²)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="time" hide />
          <YAxis domain={["auto", "auto"]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "white" }} />
          <Line type="monotone" dataKey="Vibration_m_s2" stroke="#a855f7" strokeWidth={2.3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
