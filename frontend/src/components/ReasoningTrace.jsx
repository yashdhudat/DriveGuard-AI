import React from "react";

export default function ReasoningTrace({ trace = [] }) {
  if (!trace || trace.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Agent Reasoning Trace</h3>
      <ol className="list-decimal ml-5 space-y-2 text-sm text-slate-700">
        {trace.map((t, i) => (
          <li key={i}><pre className="whitespace-pre-wrap">{t}</pre></li>
        ))}
      </ol>
    </div>
  );
}
