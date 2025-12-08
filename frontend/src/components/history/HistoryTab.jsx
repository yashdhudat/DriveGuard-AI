import React from "react";
import TemperatureChart from "../charts/TemperatureChart";
import BatteryChart from "../charts/BatteryChart";
import BrakeWearGauge from "../charts/BrakeWearGauge";

export default function HistoryTab({ telemetry }) {
  if (!telemetry || telemetry.length < 5) {
    return (
      <div className="text-center bg-[#11182F] p-4 rounded-lg border border-cyan-400/20 text-slate-300">
        📡 Not enough data to show history…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#11182F] rounded-xl p-4 border border-purple-500/30 shadow-lg">
        <h3 className="text-lg font-semibold text-cyan-300 mb-2">
          🔥 Engine Temperature Trend
        </h3>
        <TemperatureChart data={telemetry} />
      </div>

      <div className="bg-[#11182F] rounded-xl p-4 border border-yellow-500/30 shadow-lg">
        <h3 className="text-lg font-semibold text-cyan-300 mb-2">
          🔋 Battery Voltage Stability
        </h3>
        <BatteryChart data={telemetry} />
      </div>

      <div className="bg-[#11182F] rounded-xl p-4 border border-red-500/30 shadow-lg">
        <h3 className="text-lg font-semibold text-cyan-300 mb-2">
          🛑 Brake Wear Progression
        </h3>
        <BrakeWearGauge value={telemetry.at(-1)?.Brake_Wear_pct || 0} />
      </div>
    </div>
  );
}
