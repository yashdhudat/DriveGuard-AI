import React from "react";

const badgeColor = (sev) => {
  if (sev === "HIGH") return "bg-red-500/10 text-red-300 border-red-500/40";
  if (sev === "MEDIUM")
    return "bg-amber-500/10 text-amber-300 border-amber-500/40";
  return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";
};

export default function AlertFeed({ events }) {
  if (!events || events.length === 0) {
    return (
      <div>
        <h3 className="font-semibold mb-3">Live Alert Feed</h3>
        <p className="text-xs text-slate-400">
          ✅ No active alerts. All systems look stable right now.
        </p>
      </div>
    );
  }

  const ordered = [...events].slice(-15).reverse(); // latest first

  return (
    <div>
      <h3 className="font-semibold mb-3">Live Alert Feed</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {ordered.map((e) => (
          <div
            key={e.id}
            className="border border-slate-700/70 rounded-lg p-2 text-xs bg-[#0B1022]"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-100">
                {e.component}
              </span>
              <span
                className={
                  "px-2 py-0.5 rounded-full border text-[10px] font-semibold " +
                  badgeColor(e.severity)
                }
              >
                {e.severity}
              </span>
            </div>
            <p className="text-slate-300 mb-1">{e.issue}</p>
            <p className="text-[10px] text-slate-400">
              Health: <span className="text-cyan-300">{e.health_score}%</span> ·
              RUL:{" "}
              <span className="text-yellow-300">{e.rul_days} days</span> ·
              Failure risk:{" "}
              <span className="text-rose-300">{e.failure_prob}%</span>
            </p>
            <p className="text-[10px] text-slate-500 mt-1">{e.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
