import React from 'react';

export function Slider({ value = 0, onChange, min = 0, max = 100, step = 5, unit = '%' }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm font-semibold text-slate-800">
        <span>Affected Field Area</span>
        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <div className="flex justify-between text-xs text-slate-400 font-medium">
        <span>0{unit} (Localized spot)</span>
        <span>50{unit} (Half field)</span>
        <span>100{unit} (Entire field)</span>
      </div>
    </div>
  );
}
