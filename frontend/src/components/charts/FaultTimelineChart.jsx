import React from "react";

const severityColor = (sev) => {
  if (sev === "HIGH") return "bg-red-400";
  if (sev === "MEDIUM") return "bg-amber-400";
  return "bg-emerald-400";
};

export default function FaultTimelineChart({ events }) {
  if (!events || events.length === 0) {
    return (
      <div>
        <h3 className="font-semibold mb-2">Fault Timeline</h3>
        <p className="text-xs text-slate-400">
          ✅ No fault events detected in the current window. Vehicle is
          operating within normal thresholds.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-3">Fault Timeline</h3>

      {/* Legend */}
      <div className="flex gap-4 text-[10px] text-slate-400 mb-2">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-400" /> High
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400" /> Medium
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400" /> Low
        </span>
      </div>

      {/* Horizontal timeline dots */}
      <div className="relative mt-3">
        <div className="h-px bg-slate-700/70 w-full absolute top-3 left-0" />
        <div className="flex overflow-x-auto gap-4 pb-2">
          {events.map((e) => (
            <div
              key={e.id}
              className="min-w-[80px] text-center text-[11px] text-slate-200"
            >
              <div className="relative mb-2">
                <span
                  className={`w-3 h-3 rounded-full inline-block ${severityColor(
                    e.severity
                  )} shadow`}
                />
              </div>
              <div className="truncate font-semibold">{e.component}</div>
              <div className="truncate text-[10px] text-slate-400">
                {e.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
