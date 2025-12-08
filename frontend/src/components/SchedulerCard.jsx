import React from "react";

export default function SchedulerCard({ slot, center }) {
  return (
    <div className="bg-slate-50 p-3 rounded border mt-2">
      <h4 className="font-medium">Service Appointment</h4>
      {slot ? (
        <>
          <p><strong>Center:</strong> {center}</p>
          <p><strong>Slot:</strong> {slot}</p>
        </>
      ) : (
        <p className="text-sm text-red-600">No appointment scheduled</p>
      )}
    </div>
  );
}
