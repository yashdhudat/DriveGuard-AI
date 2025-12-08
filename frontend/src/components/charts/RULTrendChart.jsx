import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function RULTrendChart({ data }) {
  if (!data || !data.length) {
    return (
      <div>
        <h3 className="font-semibold mb-2">RUL Trend (Days)</h3>
        <p className="text-xs text-slate-400">
          Waiting for enough telemetry samples...
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">RUL Trend (Days)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" hide />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="rul"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
