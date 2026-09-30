import React from 'react';

export function SegmentedControl({ options, value, onChange, className = '' }) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200 ${className}`}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`min-h-[44px] px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center flex items-center justify-center cursor-pointer ${
              isSelected
                ? 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-800'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
