import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function EngineTelemetryChart({ data }) {
  if (!data || data.length === 0) return <p>No telemetry history yet.</p>;

  return (
    <div style={{ background: "#fff", padding: 20, borderRadius: 10 }}>
      <h3>Engine Telemetry Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line type="monotone" dataKey="Engine_RPM" stroke="red" />
          <Line type="monotone" dataKey="Engine_Temp_C" stroke="orange" />
          <Line type="monotone" dataKey="Oil_Pressure_psi" stroke="blue" />
          <Line type="monotone" dataKey="Battery_Voltage_V" stroke="green" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
