import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ComponentHealthBar({ result }) {
  if (!result) return null;

  const data = [
    { name: "Risk Score", value: result.risk_score * 100 },
    { name: "Brake Wear", value: result.input?.Brake_Wear_pct || 0 },
  ];

  return (
    <div style={{ background: "#fff", padding: 20, borderRadius: 10 }}>
      <h3>Component Health Indicators</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#1e90ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
