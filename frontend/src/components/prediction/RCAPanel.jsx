import React from "react";

export default function RCAPanel({ health }) {
  const faults = health?.faults || [];

  if (!faults.length) {
    return (
      <div className="bg-[#11182F] rounded-xl p-4 border border-emerald-500/20 shadow mb-6">
        <h2 className="text-lg font-semibold mb-2 text-emerald-300">
          🔍 Root Cause & Maintenance
        </h2>
        <p className="text-sm text-slate-300">
          ✅ No critical anomalies detected. Continue routine maintenance and
          monitoring.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#11182F] rounded-xl p-4 border border-amber-500/30 shadow mb-6">
      <h2 className="text-lg font-semibold mb-3 text-amber-300">
        🔍 Root Cause & Maintenance Recommendations
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-slate-400 border-b border-slate-700/60">
            <tr>
              <th className="text-left py-2 pr-4">Component</th>
              <th className="text-left py-2 pr-4">Issue</th>
              <th className="text-left py-2 pr-4">Severity</th>
              <th className="text-left py-2">Recommended Action</th>
            </tr>
          </thead>
          <tbody>
            {faults.map((f, idx) => (
              <tr key={idx} className="border-b border-slate-800/60">
                <td className="py-2 pr-4">{f.component}</td>
                <td className="py-2 pr-4 text-slate-200">{f.issue}</td>
                <td className="py-2 pr-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      f.severity === "HIGH"
                        ? "bg-red-500/10 text-red-400 border border-red-500/40"
                        : "bg-yellow-500/10 text-yellow-300 border border-yellow-500/40"
                    }`}
                  >
                    {f.severity}
                  </span>
                </td>
                <td className="py-2 text-slate-300">{f.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
