import React, { useState } from "react";

const defaultPayload = {
  Engine_RPM: 3500,
  Engine_Temp_C: 125,
  Oil_Pressure_psi: 15,
  Vibration_m_s2: 0.6,
  Battery_Voltage_V: 13.8,
  Brake_Wear_pct: 40,
};

export default function TelemetryForm({ onSubmit }) {
  const [form, setForm] = useState(defaultPayload);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-3">Telemetry Input</h2>
      <div className="space-y-2">
        {Object.keys(defaultPayload).map((k) => (
          <div key={k} className="flex items-center gap-2">
            <label className="w-40 text-sm text-slate-700">{k}</label>
            <input
              className="flex-1 border rounded px-2 py-1"
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: parseFloat(e.target.value) })}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => onSubmit(form)}
        >
          Run Agent
        </button>
        <button
          className="bg-gray-200 px-4 py-2 rounded"
          onClick={() => setForm(defaultPayload)}
        >
          Reset
        </button>
      </div>
      <p className="text-xs text-slate-500 mt-2">Tip: use realistic values to demo scheduling & RCA.</p>
    </div>
  );
}
