import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RCAMatchChart({ matches }) {
  if (!matches || matches.length === 0) return null;

  const data = matches.map((m) => ({
    title: m.title,
    score: m.score,
  }));

  return (
    <div style={{ background: "#fff", padding: 20, borderRadius: 10 }}>
      <h3>RCA Match Scores</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart layout="vertical" data={data}>
          <XAxis type="number" />
          <YAxis type="category" dataKey="title" width={200} />
          <Tooltip />
          <Bar dataKey="score" fill="#ff7f50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
