export default function AlertExplainPanel({ health }) {
  if (!health) return null;
  if (!health.faults || health.faults.length === 0) return null;

  const faults = health.faults;

  return (
    <div className="bg-[#11182F] rounded-xl p-4 border border-amber-500/30 shadow-lg mt-6">
      <h3 className="text-lg font-semibold text-amber-400 mb-3">
        🔍 Alert Root Cause Details
      </h3>

      <div className="space-y-3">
        {faults.map((fault, idx) => (
          <div key={idx} className="bg-black/30 p-3 rounded-lg border border-amber-500/20">
            <p className="text-yellow-300 font-semibold">{fault.component}</p>
            <p className="text-sm text-gray-300">
              ⚠ {fault.issue}
            </p>
            <p className="text-sm">
              🛠 Action: <span className="text-cyan-300">{fault.action}</span>
            </p>
            <p className="text-sm text-gray-400">
              Severity: <span className="font-bold">{fault.severity}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
