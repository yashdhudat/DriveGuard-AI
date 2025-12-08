import React from "react";

export default function HealthPanel({ health }) {
  if (!health) {
    return (
      <div className="bg-[#11182F] rounded-xl p-4 border border-cyan-500/30 shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-cyan-300">
          🧠 Predictive Insights
        </h2>
        <p className="text-slate-300 text-sm italic">
          🧠 Awaiting analysis...
        </p>
      </div>
    );
  }

  const statusColor =
    health.priority === "HIGH"
      ? "text-red-400"
      : health.priority === "MEDIUM"
      ? "text-yellow-400"
      : "text-green-400";

  const showReasons = Array.isArray(health.reasoning);

  return (
    <div className="bg-[#11182F] rounded-xl p-4 border border-cyan-500/30 shadow-lg mb-4">
      <h2 className="text-xl font-semibold mb-4 text-cyan-300">
        🧠 Predictive Insights
      </h2>

      {/* TOP SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-slate-400">Vehicle Health</p>
          <p className="text-2xl font-bold text-cyan-400">
            {health.health_score}%
          </p>
        </div>

        <div>
          <p className="text-slate-400">RUL (Days)</p>
          <p className="text-2xl font-bold text-yellow-300">
            {health.rul_days}
          </p>
        </div>

        <div>
          <p className="text-slate-400">Critical Component</p>
          <p className="font-bold">{health.critical_comp}</p>
        </div>

        <div>
          <p className="text-slate-400">Priority / Failure Risk</p>
          <p className={`font-bold ${statusColor}`}>
            {health.priority} &nbsp;·&nbsp; {health.failure_prob}%
          </p>
        </div>
      </div>

      {/* INSIGHT SUMMARY */}
      <p className="mt-4 text-slate-300 text-sm italic">
        💭 {health.insight}
      </p>

      {/* RISK BREAKDOWN SECTION */}
      {health.faults && health.faults.length > 0 && (
        <div className="mt-5">
          <h3 className="font-semibold text-amber-400 mb-2">
            🔍 What triggered the alert?
          </h3>

          <div className="space-y-2">
            {health.faults.map((fault, index) => (
              <div
                key={index}
                className="p-3 rounded-md bg-black/40 border border-amber-500/20"
              >
                <p className="font-bold text-yellow-300">{fault.component}</p>
                <p className="text-sm text-slate-300">⚠ {fault.issue}</p>
                <p className="text-xs text-gray-400">
                  🛠 {fault.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PARAMETER CONTRIBUTION (Explainable AI) */}
      {showReasons && (
        <div className="mt-5">
          <h3 className="font-semibold text-cyan-400 mb-2">
            📊 Key Risk Contributors
          </h3>

          <div className="space-y-2">
            {health.reasoning.map((item, i) => (
              <div key={i} className="flex justify-between text-xs text-gray-300">
                <span>{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
