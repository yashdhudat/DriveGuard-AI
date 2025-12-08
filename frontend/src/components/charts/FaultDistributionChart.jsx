import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#ff4757", "#ffa502", "#2ed573", "#1e90ff"];

export default function FaultDistributionChart({ fault }) {
  if (!fault) return null;

  const data = [
    { name: fault.fault_type, value: 1 },
    { name: "Other", value: 9 },
  ];

  return (
    <div style={{ background: "#fff", padding: 20, borderRadius: 10 }}>
      <h3>Fault Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={90}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
