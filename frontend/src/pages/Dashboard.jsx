import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";

import EngineChart from "../components/charts/EngineChart";
import TemperatureChart from "../components/charts/TemperatureChart";
import OilChart from "../components/charts/OilChart";
import BatteryChart from "../components/charts/BatteryChart";
import VibrationChart from "../components/charts/VibrationChart";
import BrakeWearGauge from "../components/charts/BrakeWearGauge";
import { connectTelemetry, disconnectTelemetry } from "../api/ws";
import HealthPanel from "../components/prediction/HealthPanel";
import RCAPanel from "../components/prediction/RCAPanel";
import RULTrendChart from "../components/charts/RULTrendChart";
import FleetSummary from "../components/prediction/FleetSummary";
import FaultTimelineChart from "../components/charts/FaultTimelineChart";
import AlertFeed from "../components/prediction/AlertFeed";
import AlertExplainPanel from "../components/prediction/AlertExplainPanel";
import ForecastChart from "../components/charts/ForecastChart";
import ServiceScheduler from "../components/scheduler/ServiceScheduler";


export default function Dashboard() {
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const [activeVehicle, setActiveVehicle] = useState("car-1");
  const [fleetHealth, setFleetHealth] = useState({
    "car-1": null,
    "car-2": null,
    "car-3": null,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Enhancement states
  const [showForecastOverlay, setShowForecastOverlay] = useState(false);

  // MasterAgent result (diagnosis + forecast + reasoning)
  const [result, setResult] = useState(null);

  const [health, setHealth] = useState(null);

  // Chart refs for PDF capture
  const engineRef = useRef(null);
  const tempRef = useRef(null);
  const oilRef = useRef(null);
  const batteryRef = useRef(null);
  const vibrationRef = useRef(null);
  const rulRef = useRef(null);
  const faultsRef = useRef(null);
  const forecastRef = useRef(null);

  const latest = telemetryHistory.at(-1) || null;

  // WebSocket telemetry
  useEffect(() => {
    const ws = connectTelemetry((data) =>
      setTelemetryHistory((prev) => [...prev.slice(-119), data])
    );
    return () => disconnectTelemetry();
  }, [activeVehicle]);

  const computeHealth = (sample) => {
    if (!sample) return null;
    const rpm = sample.Engine_RPM || 0;
    const temp = sample.Engine_Temp_C || 0;
    const oil = sample.Oil_Pressure_psi || 0;
    const vib = sample.Vibration_m_s2 || 0;
    const brake = sample.Brake_Wear_pct || 0;
    const battery = sample.Battery_Voltage_V || 0;

    const faults = [];
    if (brake > 70)
      faults.push({
        component: "Brakes",
        severity: "HIGH",
        issue: "High brake wear",
        action: "Replace soon",
      });
    if (temp > 120)
      faults.push({
        component: "Engine Cooling",
        severity: "HIGH",
        issue: "Overheating",
        action: "Inspect coolant system",
      });
    if (oil < 25)
      faults.push({
        component: "Oil System",
        severity: "HIGH",
        issue: "Low oil pressure",
        action: "Check oil immediately",
      });
    if (battery < 12.2)
      faults.push({
        component: "Battery",
        severity: "MEDIUM",
        issue: "Low voltage",
        action: "Test alternator",
      });
    if (vib > 8)
      faults.push({
        component: "Chassis",
        severity: "MEDIUM",
        issue: "High vibration",
        action: "Inspect suspension",
      });

    const stress =
      (rpm / 7000) * 0.2 +
      (temp / 150) * 0.25 +
      ((100 - oil) / 100) * 0.2 +
      (vib / 20) * 0.15 +
      (brake / 100) * 0.2;

    const score = Math.max(1, Math.round((1 - stress) * 100));
    const priority = score < 40 ? "HIGH" : score < 60 ? "MEDIUM" : "LOW";

    return {
      health_score: score,
      rul_days: Math.max(1, Math.round(score / 2)),
      priority,
      faults,
      critical_comp: faults[0]?.component || "None",
      insight:
        priority === "HIGH"
          ? "Urgent maintenance needed"
          : priority === "MEDIUM"
          ? "Monitor health closely"
          : "Healthy vehicle",
    };
  };

  // Fetch MasterAgent result when latest telemetry or vehicle changes
  useEffect(() => {
    // Build a small sensor payload (if no telemetry yet, send a minimal object)
    const payload = latest || {
      Engine_RPM: 0,
      Engine_Temp_C: 0,
      Oil_Pressure_psi: 0,
      Vibration_m_s2: 0,
      Battery_Voltage_V: 0,
      Brake_Wear_pct: 0,
      vehicle_id: activeVehicle,
    };

    // call the master agent API (POST) — modify URL if different in your API
    const callAgent = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/agent/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sensor_payload: payload, vehicle_id: activeVehicle }),
        });
        if (!res.ok) {
          console.warn("Agent API returned", res.status);
          setResult(null);
          return;
        }
        const data = await res.json();
        setResult(data);
      } catch (err) {
        console.error("Agent fetch failed:", err);
        setResult(null);
      }
    };

    // call once
    callAgent();
    // (optional) you may poll or debounce if you want repeated updates
  }, [latest, activeVehicle]);

  // Health + fleet update from telemetry (unchanged)
  useEffect(() => {
    if (!latest) return;
    const h = computeHealth(latest);
    setHealth(h);

    if (h.priority === "HIGH") {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }

    setFleetHealth((prev) => ({
      ...prev,
      [activeVehicle]: h,
    }));
  }, [latest, activeVehicle]);

  const rulTrendData = telemetryHistory.map((s, i) => ({
    index: i,
    label: `T${i + 1}`,
    rul: computeHealth(s)?.rul_days,
  }));

  // ---------- Fault / Alert events ----------
  const faultEventsRaw = telemetryHistory
    .map((s, i) => {
      const h = computeHealth(s);
      if (!h) return null;

      const label = s.timestamp || s.time || `T${i + 1}`;
      const events = [];

      if (h.faults && h.faults.length > 0) {
        h.faults.forEach((f, idx) => {
          events.push({
            id: `${i}-${idx}-${f.component}`,
            index: i,
            label,
            component: f.component,
            severity: f.severity,
            priority: h.priority,
            message: `${f.component}: ${f.issue}`,
            action: f.action,
            kind: "FAULT",
          });
        });
      }

      return events;
    })
    .flat()
    .filter(Boolean);

  const faultEvents =
    faultEventsRaw.length > 0
      ? faultEventsRaw
      : [
          {
            id: "no-faults",
            index: 0,
            label: "Now",
            component: "System",
            severity: "LOW",
            priority: "LOW",
            message:
              "No fault events detected in the current window. Vehicle is operating within normal thresholds.",
            action: "Continue monitoring.",
            kind: "INFO",
          },
        ];

  // --------- Forecast helpers (defensive) ----------
  const extractForecastValues = (f) => {
    if (!f) return [];
    // common shapes:
    // 1) { forecast_days: [{predicted_demand}] }
    // 2) { predictions: [{value}] } or array of numbers
    // 3) { values: [...] }
    if (Array.isArray(f)) {
      return f.map((v) => (typeof v === "number" ? v : v?.predicted_demand ?? v?.value ?? null)).filter(Boolean);
    }
    if (f.forecast_days && Array.isArray(f.forecast_days)) {
      return f.forecast_days.map((d) => d?.predicted_demand ?? d?.value ?? null).filter(Boolean);
    }
    if (f.predictions && Array.isArray(f.predictions)) {
      return f.predictions.map((p) => p?.value ?? null).filter(Boolean);
    }
    if (f.values && Array.isArray(f.values)) {
      return f.values.map((v) => (typeof v === "number" ? v : v?.value ?? null)).filter(Boolean);
    }
    // fallback numbers
    return Object.values(f).filter((v) => typeof v === "number");
  };

  const computeForecastSummary = (f) => {
    const vals = extractForecastValues(f);
    if (!vals.length) return null;
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const recent = telemetryHistory.slice(-10).map((s) => s?.Service_Load ?? s?.load ?? null).filter(Boolean);
    const recentMean = recent.length ? recent.reduce((a, b) => a + b, 0) / recent.length : null;
    const pct = recentMean ? Math.round(((mean - recentMean) / recentMean) * 100) : null;
    return { mean, pct, points: vals };
  };

  // Helper: locate forecast in the master agent response (robust)
  const locateForecastFromResult = (res) => {
    if (!res) return null;

    // Typical shape you showed: { reasoning_trace, final_output: {...} }
    const foCand = res?.final_output?.forecast_days ?? res?.final_output?.forecast ?? res?.forecast ?? res?.demand_out ?? null;

    // If demand_out is present and includes forecast_days, return that object
    if (res?.final_output?.demand_out) return res.final_output.demand_out;
    if (res?.demand_out) return res.demand_out;
    // direct forecast_days inside final_output
    if (res?.final_output?.forecast_days) return { forecast_days: res.final_output.forecast_days, summary: res.final_output.forecast_summary ?? null };
    // fallback to top-level forecast
    if (res?.forecast) return res.forecast;
    // final_output may have a numeric forecastDemandInRegion or similar — return that as summary
    if (res?.final_output?.forecast_demand_in_region) {
      return { summary: { avg_daily_load: res.final_output.forecast_demand_in_region } };
    }

    // last fallback: nothing
    return null;
  };

  // --------- PDF Download ----------
  const handleDownloadReport = async () => {
    const captureChart = async (ref) => {
      if (!ref || !ref.current) return null;
      try {
        const canvas = await html2canvas(ref.current, {
          backgroundColor: "#0A0F1F",
        });
        return canvas.toDataURL("image/png");
      } catch (err) {
        console.error("Chart capture failed:", err);
        return null;
      }
    };

    const charts = {
      engine_rpm: await captureChart(engineRef),
      engine_temp: await captureChart(tempRef),
      oil_pressure: await captureChart(oilRef),
      battery_voltage: await captureChart(batteryRef),
      vibration: await captureChart(vibrationRef),
      rul_trend: await captureChart(rulRef),
      fault_timeline: await captureChart(faultsRef),
      forecast_chart: await captureChart(forecastRef),
    };

    const payload = {
      vehicle_id: activeVehicle,
      vehicle_label: activeVehicle.toUpperCase(),
      generated_at: new Date().toISOString(),
      health: health || null,
      agent_result: result || null,
      charts,
    };

    console.log("PDF payload:", payload);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/report/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to generate PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${activeVehicle}_driveguard_report.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download failed:", error);
    }
  };

  // --------- AI Insight generator (uses both health and master agent result) ----------
  const generateAIInsight = () => {
    const pieces = [];

    if (!health && !result) return "No telemetry or agent data available to generate insights.";

    if (health) {
      // RUL & priority
      pieces.push(`RUL ~${health.rul_days} days.`);
      pieces.push(`${health.insight}.`);
      if (health.faults && health.faults.length) {
        const f = health.faults[0];
        pieces.push(`${f.component} shows ${f.severity.toLowerCase()} risk — ${f.action}.`);
      }
    }

    // Add agent diagnosis/severity/scheduler if available
    const fo = locateForecastFromResult(result);
    const foSummary = fo ? computeForecastSummary(fo) : null;

    if (result?.final_output) {
      const foText = result.final_output.fault_type ? `Fault: ${result.final_output.fault_type}.` : null;
      if (foText) pieces.push(foText);

      const sev = result.final_output.severity;
      if (sev) pieces.push(`Agent severity: ${sev}.`);

      const slot = result.final_output.scheduled_slot;
      if (slot) pieces.push(`Recommended slot: ${slot}.`);
    }

    if (foSummary) {
      if (foSummary.pct !== null) {
        if (foSummary.pct > 10) pieces.push(`Forecast predicts +${foSummary.pct}% service load — consider adding capacity.`);
        else if (foSummary.pct < -10) pieces.push(`Forecast predicts ${foSummary.pct}% drop — consider resource reallocation.`);
        else pieces.push(`Forecast stable (~${foSummary.pct}% change).`);
      } else {
        pieces.push(`Forecast mean: ${Math.round(foSummary.mean)} (no recent baseline).`);
      }
    } else if (result && !fo) {
      // If agent ran but no forecast, be explicit
      pieces.push("Agent ran but forecast not included in the response. Consider returning full demand_out from MasterAgent.");
    }

    // combine into a readable paragraph
    return pieces.join(" ");
  };

  // ------------------------------------
  // UI RENDER
  // ------------------------------------

  // Fleet forecast summary (per vehicle, defensive)
  const fleetForecastSummary = Object.keys(fleetHealth).map((veh) => {
    const hv = fleetHealth[veh];
    const fs = computeForecastSummary(hv?.forecast ?? null);
    return {
      vehicle: veh,
      mean: fs?.mean ?? null,
      pct: fs?.pct ?? null,
    };
  });

  // Active vehicle forecast summary (from the agent result)
  const locatedForecast = locateForecastFromResult(result);
  const activeForecastSummary = computeForecastSummary(locatedForecast);

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white px-6 py-8">
      {/* 🔥 Auto popup alert */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 px-4 py-2 rounded-lg shadow-lg">
          ⚠️ Critical Risk Detected!
        </div>
      )}

      {/* 🚀 Top Navigation Tabs */}
      <div className="flex gap-4 mb-6 border-b border-cyan-600/30 pb-2">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            activeTab === "dashboard"
              ? "bg-cyan-600"
              : "bg-[#11182F] border border-cyan-700/20"
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 Live Dashboard
        </button>

        <button
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            activeTab === "history"
              ? "bg-cyan-600"
              : "bg-[#11182F] border border-cyan-700/20"
          }`}
          onClick={() => setActiveTab("history")}
        >
          📈 History Trends
        </button>

        <button
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            activeTab === "scheduler"
              ? "bg-cyan-600"
              : "bg-[#11182F] border border-cyan-700/20"
          }`}
          onClick={() => setActiveTab("scheduler")}
        >
          🛠 Service Scheduling
        </button>
        
      </div>

      {/* TABS SWITCHING */}
      {activeTab === "dashboard" && (
        <>
          <header className="flex justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400">
                DriveGuard AI — Dashboard
              </h1>
              <p className="text-slate-400 text-sm">
                Real-time Telemetry Insights
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Forecast Overlay Toggle */}
              <label className="flex items-center gap-2 text-sm mr-2">
                <input
                  type="checkbox"
                  checked={showForecastOverlay}
                  onChange={(e) => setShowForecastOverlay(e.target.checked)}
                />
                <span className="text-slate-300">Show Forecast Overlay</span>
              </label>

              {/* PDF BUTTON */}
              <button
                onClick={handleDownloadReport}
                className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg font-semibold text-sm"
              >
                📄 Download Report
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fleet summary (left) */}
            <div className="lg:col-span-2">
              <FleetSummary
                fleetHealth={fleetHealth}
                activeVehicle={activeVehicle}
                onSelectVehicle={setActiveVehicle}
              />
            </div>

            {/* Forecast Summary (right) */}
            <div className="bg-[#11182F] rounded-xl p-4 shadow-md border border-cyan-500/20">
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">Forecast Summary</h3>
              <div className="text-sm text-slate-300 mb-3">
                Active vehicle ({activeVehicle}):
                {activeForecastSummary ? (
                  <div className="mt-2">
                    <div>Predicted mean: <strong>{Math.round(activeForecastSummary.mean)}</strong></div>
                    {activeForecastSummary.pct !== null && (
                      <div>
                        Trend vs recent:{" "}
                        <strong className={activeForecastSummary.pct > 0 ? "text-rose-400" : "text-emerald-300"}>
                          {activeForecastSummary.pct > 0 ? `+${activeForecastSummary.pct}%` : `${activeForecastSummary.pct}%`}
                        </strong>
                      </div>
                    )}
                    <div className="mt-2 text-xs text-slate-400">
                      {locatedForecast?.summary?.reasoning ?? locatedForecast?.reasoning ?? result?.reasoning_trace?.[0] ?? ""}
                    </div>
                  </div>
                ) : result ? (
                  <div className="mt-2 text-slate-400">Agent ran, but no forecast payload found. Consider returning `demand_out` from MasterAgent.final_output.</div>
                ) : (
                  <div className="mt-2 text-slate-400">Waiting for agent to run...</div>
                )}
              </div>

              <div className="mt-3">
                <h4 className="text-sm text-cyan-300 font-medium mb-2">Fleet (quick view)</h4>
                <div className="space-y-2 text-sm">
                  {fleetForecastSummary.map((f) => (
                    <div key={f.vehicle} className="flex justify-between">
                      <div>{f.vehicle}</div>
                      <div>
                        {f.mean ? (
                          <span className={f.pct > 0 ? "text-rose-400" : "text-emerald-300"}>
                            {Math.round(f.mean)} ({f.pct !== null ? (f.pct > 0 ? `+${f.pct}%` : `${f.pct}%`) : "—"})
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Health, RCA, AlertExplain */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <HealthPanel health={health} />
              <RCAPanel health={health} />
              <AlertExplainPanel health={health} />
            </div>

            {/* AI Insight Panel */}
            <div className="bg-[#11182F] rounded-xl p-4 shadow-md border border-cyan-500/20">
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">AI Insight</h3>
              <p className="text-sm text-slate-300">{generateAIInsight()}</p>
              {result?.reasoning_trace && (
                <details className="mt-3 text-xs text-slate-500">
                  <summary>Show reasoning trace</summary>
                  <ol className="list-decimal list-inside mt-2">
                    {result.reasoning_trace.map((r, idx) => (
                      <li key={idx} className="mb-1">{r}</li>
                    ))}
                  </ol>
                </details>
              )}
            </div>
          </div>

          {/* 🔥 MAIN CHART GRID */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div ref={engineRef}>
              <EngineChart data={telemetryHistory} forecastOverlay={showForecastOverlay ? locatedForecast : null} />
            </div>

            <BrakeWearGauge value={latest?.Brake_Wear_pct || 0} />

            <div ref={tempRef}>
              <TemperatureChart data={telemetryHistory} forecastOverlay={showForecastOverlay ? locatedForecast : null} />
            </div>

            <div ref={oilRef}>
              <OilChart data={telemetryHistory} />
            </div>

            <div ref={batteryRef}>
              <BatteryChart data={telemetryHistory} />
            </div>

            <div ref={rulRef}>
              <RULTrendChart data={rulTrendData} forecastOverlay={showForecastOverlay ? locatedForecast : null} />
            </div>

            <div ref={vibrationRef}>
              <VibrationChart data={telemetryHistory} forecastOverlay={showForecastOverlay ? locatedForecast : null} />
            </div>

            {/* 🔥 DEMAND FORECAST CHART with Insight badge */}
            {locatedForecast && (
              <div
                className="col-span-1 md:col-span-3 bg-[#11182F] p-4 rounded-xl shadow-md border border-cyan-500/20"
                ref={forecastRef}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-cyan-300">Demand Forecast</h3>
                  {(() => {
                    const fs = computeForecastSummary(locatedForecast);
                    if (!fs) return null;
                    const pct = fs.pct;
                    const label =
                      pct === null
                        ? `Avg ${Math.round(fs.mean)}`
                        : pct > 0
                        ? `Projected +${pct}%`
                        : `Projected ${pct}%`;
                    return (
                      <div className={`text-sm px-3 py-1 rounded-full font-medium ${pct === null ? "bg-cyan-800 text-cyan-200" : pct > 5 ? "bg-rose-800 text-rose-200" : pct < -5 ? "bg-emerald-800 text-emerald-200" : "bg-cyan-700 text-cyan-100"}`}>
                        {label}
                      </div>
                    );
                  })()}
                </div>

                <ForecastChart forecast={locatedForecast} />
              </div>
            )}
          </section>

          {/* Fault Timeline + Alert Feed */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 pb-10">
            <div
              className="lg:col-span-2 bg-[#11182F] rounded-xl p-4 shadow-md border border-cyan-500/20"
              ref={faultsRef}
            >
              <FaultTimelineChart events={faultEvents} />
            </div>
            <div className="bg-[#11182F] rounded-xl p-4 shadow-md border border-cyan-500/20">
              <AlertFeed events={faultEvents} />
            </div>
          </section>
        </>
      )}

      {/* 📌 HISTORY VIEW */}
      {activeTab === "history" && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            📈 Historical Performance Trends
          </h2>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RULTrendChart data={rulTrendData} />
            <EngineChart data={telemetryHistory} height={250} />
            <TemperatureChart data={telemetryHistory} height={250} />
          </section>

          {/* Historical Forecast Trends */}
          <div className="mt-6 bg-[#11182F] rounded-xl p-4 shadow-md border border-cyan-500/20">
            <h3 className="text-lg font-semibold text-cyan-300 mb-3">Historical Forecast Trends</h3>
            {locatedForecast ? (
              <div>
                <ForecastChart forecast={locatedForecast} showHistory />
                <div className="mt-3 text-sm text-slate-300">
                  <strong>Note:</strong> This chart shows predicted load for upcoming periods. Use this to plan service slots and manpower.
                </div>
              </div>
            ) : (
              <div className="text-slate-400">No forecast data available for historical view.</div>
            )}
          </div>

          <div className="mt-10 text-slate-400 text-sm">
            Data auto-aggregates over time. Useful for degradation analysis.
          </div>
        </div>
      )}
      {activeTab === "scheduler" && (
        <ServiceScheduler />
      )}

    </div>
  );
}
