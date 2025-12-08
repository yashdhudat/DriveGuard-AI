import React from "react";

export default function RiskGauge({ score }) {
  const percent = score * 100;

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h3>Risk Gauge</h3>
      <div
        style={{
          width: 200,
          height: 100,
          background: `conic-gradient(
            red ${percent}%,
            #ddd ${percent}%
          )`,
          borderRadius: "100px 100px 0 0",
        }}
      ></div>
      <strong>{percent.toFixed(1)}%</strong>
      <p>Fault Severity Risk</p>
    </div>
  );
}
