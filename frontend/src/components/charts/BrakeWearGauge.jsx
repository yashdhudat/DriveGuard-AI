import React from "react";

export default function BrakeWearGauge({ value }) {
  const percent = Math.min(100, Math.max(0, value));

  return (
    <div className="text-center">
      <h3 className="font-semibold mb-2">Brake Wear (%)</h3>

      <div className="relative w-32 h-32 mx-auto">
        <svg viewBox="0 0 36 36" className="w-full h-full">
          <path
            className="text-gray-300"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            d="M18 2 
               a 16 16 0 1 1 0 32 
               a 16 16 0 1 1 0 -32"
          />

          <path
            className="text-red-500"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${percent}, 100`}
            d="M18 2 
               a 16 16 0 1 1 0 32 
               a 16 16 0 1 1 0 -32"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
          {percent}%
        </div>
      </div>
    </div>
  );
}
