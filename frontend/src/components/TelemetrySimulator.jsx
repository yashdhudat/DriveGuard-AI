import React, { useEffect, useRef, useState } from "react";

/**
 * TelemetrySimulator
 * Props:
 *  - onSample(sample)         -> called for every generated telemetry sample
 *  - autoTrigger (bool)       -> whether to call onAutoTrigger(sample) when threshold exceeded
 *  - onAutoTrigger(sample)    -> callback when a critical threshold is crossed (debounced)
 *
 * Usage: <TelemetrySimulator onSample={...} onAutoTrigger={...} />
 */

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

function jitter(value, pct = 0.02) {
  // small jitter ±pct
  const delta = value * pct;
  return value + (Math.random() * 2 - 1) * delta;
}

export default function TelemetrySimulator({
  onSample,
  onAutoTrigger,
  running = false,
  intervalMs = 1000,
  autoTriggerEnabled = false,
  triggerConfig = { Engine_Temp_C: 110, Oil_Pressure_psi: 18, Vibration_m_s2: 3.0 },
}) {
  const [isRunning, setIsRunning] = useState(running);
  const [rateMs, setRateMs] = useState(intervalMs);
  const [autoEnabled, setAutoEnabled] = useState(autoTriggerEnabled);
  const triggerRef = useRef(triggerConfig);
  triggerRef.current = triggerConfig;

  const debounceRef = useRef({ last: 0, cooldownMs: 15000 }); // don't auto-trigger more often than 15s

  // base "nominal" telemetry state (you can tweak to demo different scenarios)
  const base = useRef({
    Engine_RPM: 2000,
    Engine_Temp_C: 85,
    Oil_Pressure_psi: 38,
    Vibration_m_s2: 0.4,
    Battery_Voltage_V: 13.8,
    Brake_Wear_pct: 30,
    Odometer_km: 12345,
  });

  // optional external control
  useEffect(() => setIsRunning(running), [running]);

  useEffect(() => {
    if (!isRunning) return;

    let mounted = true;
    const timer = setInterval(() => {
      if (!mounted) return;

      // simulate slow drift + occasional spikes
      // drift: add small jitter to base
      const sample = {
        time: new Date().toLocaleTimeString(),
        Engine_RPM: Math.round(jitter(base.current.Engine_RPM, 0.08)),
        Engine_Temp_C: parseFloat(jitter(base.current.Engine_Temp_C, 0.03).toFixed(1)),
        Oil_Pressure_psi: parseFloat(jitter(base.current.Oil_Pressure_psi, 0.05).toFixed(1)),
        Vibration_m_s2: parseFloat(jitter(base.current.Vibration_m_s2, 0.12).toFixed(2)),
        Battery_Voltage_V: parseFloat(jitter(base.current.Battery_Voltage_V, 0.02).toFixed(2)),
        Brake_Wear_pct: Math.min(100, Math.round(jitter(base.current.Brake_Wear_pct, 0.01))),
      };

      // occasional spike event (1 in 40)
      if (Math.random() < 0.025) {
        // spike engine temp or vibration or oil pressure drop
        const r = Math.random();
        if (r < 0.33) sample.Engine_Temp_C = parseFloat((randRange(110, 130)).toFixed(1));
        else if (r < 0.66) sample.Vibration_m_s2 = parseFloat((randRange(3.5, 6.0)).toFixed(2));
        else sample.Oil_Pressure_psi = parseFloat((randRange(8, 18)).toFixed(1));
      }

      // slight random battery sag (simulate weak battery occasionally)
      if (Math.random() < 0.02) sample.Battery_Voltage_V = parseFloat(randRange(10.8, 12.2).toFixed(2));

      // call into parent
      try {
        onSample && onSample(sample);
      } catch (e) {
        // swallow errors from parent
        console.warn("onSample error", e);
      }

      // Auto-trigger logic
      if (autoEnabled && onAutoTrigger) {
        const now = Date.now();
        const last = debounceRef.current.last || 0;
        if (now - last > debounceRef.current.cooldownMs) {
          const t = triggerRef.current;
          let critical = false;
          if (t.Engine_Temp_C && sample.Engine_Temp_C >= t.Engine_Temp_C) critical = true;
          if (t.Oil_Pressure_psi && sample.Oil_Pressure_psi <= t.Oil_Pressure_psi) critical = true;
          if (t.Vibration_m_s2 && sample.Vibration_m_s2 >= t.Vibration_m_s2) critical = true;

          if (critical) {
            // update last trigger and call parent
            debounceRef.current.last = now;
            onAutoTrigger(sample);
          }
        }
      }

    }, rateMs);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [isRunning, rateMs, autoEnabled, onSample, onAutoTrigger]);

  return (
    <div className="bg-white rounded p-3 shadow">
      <h4 className="font-semibold">Live Telemetry Simulator</h4>

      <div className="flex items-center gap-2 mt-2">
        <button
          className={`px-3 py-1 rounded ${isRunning ? "bg-red-500 text-white" : "bg-green-600 text-white"}`}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? "Stop" : "Start"}
        </button>

        <label className="text-sm ml-3">Rate (ms):</label>
        <input
          type="number"
          value={rateMs}
          onChange={(e) => setRateMs(Math.max(200, Number(e.target.value)))}
          className="border rounded px-2 py-1 w-24"
        />

        <label className="text-sm ml-3">Auto-trigger:</label>
        <input
          type="checkbox"
          checked={autoEnabled}
          onChange={(e) => setAutoEnabled(e.target.checked)}
        />

        <div className="ml-auto text-sm text-slate-600">
          Debounce: {debounceRef.current.cooldownMs / 1000}s
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <div>
          <label className="block text-xs text-slate-500">Temp threshold</label>
          <input
            type="number"
            defaultValue={triggerConfig.Engine_Temp_C}
            onBlur={(e) => (triggerRef.current.Engine_Temp_C = Number(e.target.value))}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500">Oil pressure min</label>
          <input
            type="number"
            defaultValue={triggerConfig.Oil_Pressure_psi}
            onBlur={(e) => (triggerRef.current.Oil_Pressure_psi = Number(e.target.value))}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500">Vibration threshold</label>
          <input
            type="number"
            defaultValue={triggerConfig.Vibration_m_s2}
            onBlur={(e) => (triggerRef.current.Vibration_m_s2 = Number(e.target.value))}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-2">
        When "Auto-trigger" is ON the simulator will call the onAutoTrigger callback (debounced)
        when telemetry crosses thresholds.
      </p>
    </div>
  );
}
