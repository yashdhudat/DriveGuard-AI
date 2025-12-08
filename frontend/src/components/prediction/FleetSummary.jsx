import React from "react";

const VEHICLE_LABELS = {
  "car-1": "Mahindra XUV700",
  "car-2": "Hero Splendor XTEC",
  "car-3": "Mahindra Treo Zor",
};

export default function FleetSummary({ fleetHealth, activeVehicle, onSelectVehicle }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
      {Object.entries(VEHICLE_LABELS).map(([id, label]) => {
        const h = fleetHealth[id];
        const isActive = id === activeVehicle;

        return (
          <div
            key={id}
            onClick={() => onSelectVehicle(id)}
            className={`rounded-xl p-3 border text-xs cursor-pointer transition
              ${isActive 
                ? "bg-cyan-700 border-cyan-400 text-white shadow-lg scale-105"
                : "bg-[#11182F] border-slate-700/80 text-slate-300 hover:bg-[#1A223D] hover:border-cyan-300/40"
              }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold">{label}</span>
              {isActive && (
                <span className="text-[10px] text-white bg-cyan-500 px-1 rounded">
                  ACTIVE
                </span>
              )}
            </div>

            {h ? (
              <div className="flex justify-between">
                <span>
                  Health:{" "}
                  <span className="text-cyan-200 font-semibold">
                    {h.health_score}%
                  </span>
                </span>
                <span>
                  RUL:{" "}
                  <span className="text-yellow-300 font-semibold">
                    {h.rul_days} d
                  </span>
                </span>
              </div>
            ) : (
              <p className="text-slate-400">Click to monitor this vehicle</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
