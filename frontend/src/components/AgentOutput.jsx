import React from "react";
import SchedulerCard from "./SchedulerCard";
import VoiceScript from "./VoiceScript";

export default function AgentOutput({ data, loading }) {
  if (loading) {
    return <div className="p-4 bg-white rounded shadow">Running agents…</div>;
  }
  if (!data) {
    return <div className="p-4 bg-white rounded shadow">No result yet — submit telemetry.</div>;
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Agent Final Output</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Fault:</strong> {data.fault_type}</p>
          <p><strong>Severity:</strong> {data.severity}</p>
          <p><strong>Risk score:</strong> {data.risk_score}</p>
          <p className="mt-2"><strong>Recommended action:</strong> {data.recommended_action}</p>
          <p className="mt-2"><strong>RCA:</strong> {data.rca_summary}</p>
          <p className="mt-2"><strong>CAPA:</strong> {data.capa}</p>
        </div>

        <div>
          <SchedulerCard slot={data.scheduled_slot} center={data.service_center} />
          <VoiceScript script={data.voice_call_script} message={data.notification_message} />
        </div>
      </div>
    </div>
  );
}
