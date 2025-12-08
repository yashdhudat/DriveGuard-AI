import { useState, useEffect } from "react";

export default function ServiceScheduler() {
  const [vehicle, setVehicle] = useState("car-1");
  const [skills, setSkills] = useState(["engine"]);
  const [priority, setPriority] = useState(5);

  // NEW STATES
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // -----------------------------------------
  // 1️⃣ Load all service centers
  // -----------------------------------------
  const fetchCenters = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/scheduler/centers");
      const data = await res.json();
      setCenters(data);
    } catch {
      console.error("Failed to load centers");
    }
  };

  // Load once
  useEffect(() => {
    fetchCenters();
  }, []);

  // -----------------------------------------
  // 2️⃣ Fetch available slots for selected center
  // -----------------------------------------
  const fetchSlots = async (centerId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/scheduler/slots/${centerId}`);
      const data = await res.json();
      setSlots(data);
    } catch {
      console.error("Failed to load slots");
    }
  };

  // -----------------------------------------
  // 3️⃣ Submit scheduling request
  // -----------------------------------------
  const scheduleService = async () => {
    setLoading(true);
    setResult(null);

    const payload = {
      vehicle_id: vehicle,
      required_skills: skills,
      priority: priority,

      // IMPORTANT: Include selected center & slot
      selected_center_id: selectedCenter?.id || null,
      selected_slot_time: selectedSlot || null,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/scheduler/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResult(data);

      // Refresh center load after booking
      fetchCenters();
      if (selectedCenter) fetchSlots(selectedCenter.id);

    } catch {
      setResult({ error: "Scheduler API unreachable." });
    }

    setLoading(false);
  };

  return (
    <div className="bg-[#11182F] p-6 rounded-xl border border-cyan-600/20">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">
        🛠 Service Center Scheduling
      </h2>

      {/* VEHICLE */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Select Vehicle</label>
        <select
          className="bg-[#0A0F1F] border border-cyan-600/40 p-2 rounded w-full"
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
        >
          <option value="car-1">car-1</option>
          <option value="car-2">car-2</option>
          <option value="car-3">car-3</option>
        </select>
      </div>

      {/* SKILL */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Required Skill</label>
        <select
          className="bg-[#0A0F1F] border border-cyan-600/40 p-2 rounded w-full"
          value={skills[0]}
          onChange={(e) => setSkills([e.target.value])}
        >
          <option value="engine">Engine</option>
          <option value="brake">Brake</option>
          <option value="battery">Battery</option>
        </select>
      </div>

      {/* PRIORITY */}
      <div className="mb-6">
        <label className="block text-sm mb-1">Priority (1 = most urgent)</label>
        <input
          type="number"
          min="1"
          max="5"
          className="bg-[#0A0F1F] border border-cyan-600/40 p-2 rounded w-full"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
        />
      </div>

      {/* --------------------------------------- */}
      {/* 4️⃣ SERVICE CENTER LIST WITH LOAD       */}
      {/* --------------------------------------- */}
      <h3 className="text-xl font-semibold text-cyan-300 mb-2">
        🏢 Select Service Center
      </h3>

      <div className="grid gap-3 mb-4">
        {centers.map((c) => (
          <div
            key={c.id}
            onClick={() => {
              setSelectedCenter(c);
              setSelectedSlot(null);
              fetchSlots(c.id);
            }}
            className={`p-3 rounded cursor-pointer border ${
              selectedCenter?.id === c.id
                ? "border-cyan-500 bg-cyan-600/20"
                : "border-cyan-600/30 bg-[#0A0F1F]"
            }`}
          >
            <div className="font-bold text-white">{c.name}</div>
            <div className="text-sm text-slate-400">
              Load: {c.load_pct}% ({c.bookings_today}/{c.capacity_daily})
            </div>

            <div
              className={`mt-1 px-2 py-1 inline-block rounded text-xs ${
                c.status === "green"
                  ? "bg-green-600/40 text-green-300"
                  : c.status === "yellow"
                  ? "bg-yellow-600/40 text-yellow-300"
                  : "bg-red-600/40 text-red-300"
              }`}
            >
              {c.status.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* --------------------------------------- */}
      {/* 5️⃣ SLOT SELECTION UI                  */}
      {/* --------------------------------------- */}
      {selectedCenter && (
        <>
          <h3 className="text-lg font-semibold text-cyan-300 mb-2">
            ⏰ Select an Available Slot
          </h3>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {slots.map((s, idx) => (
              <button
                key={idx}
                disabled={!s.available}
                onClick={() => setSelectedSlot(s.time)}
                className={`p-2 rounded border text-sm ${
                  !s.available
                    ? "bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed"
                    : selectedSlot === s.time
                    ? "bg-cyan-600 text-white border-cyan-300"
                    : "bg-[#0A0F1F] text-white border-cyan-600/40"
                }`}
              >
                {s.time}
              </button>
            ))}
          </div>
        </>
      )}

      {/* --------------------------------------- */}
      {/* 6️⃣ SUBMIT BUTTON                      */}
      {/* --------------------------------------- */}
      <button
        onClick={scheduleService}
        className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg font-semibold w-full"
      >
        {loading
          ? "Processing..."
          : selectedSlot
          ? "Schedule Selected Slot"
          : "Assign Best Service Center Automatically"}
      </button>

      {/* RESULT */}
      {result && (
        <div className="mt-6 bg-[#0A0F1F] p-4 rounded border border-cyan-600/20">
          <h3 className="text-lg font-semibold text-cyan-300 mb-2">Result:</h3>
          <pre className="text-sm text-slate-300 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
