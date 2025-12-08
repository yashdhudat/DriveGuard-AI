import React, { useState } from "react";

export default function VoiceScript({ script, message }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3">
      <h4 className="font-medium">Voice Notification</h4>
      <p className="text-sm">{message}</p>

      <button
        className="mt-2 text-sm text-blue-600"
        onClick={() => setOpen(!open)}
      >
        {open ? "Hide call script" : "Show call script"}
      </button>

      {open && (
        <pre className="bg-black text-white p-3 rounded mt-2 whitespace-pre-wrap text-sm">
          {script}
        </pre>
      )}
    </div>
  );
}
