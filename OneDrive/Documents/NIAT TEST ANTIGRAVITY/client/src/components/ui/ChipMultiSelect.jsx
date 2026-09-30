import React from 'react';
import { Check } from 'lucide-react';

export function ChipMultiSelect({
  options,
  selected = [],
  onChange,
  maxSelections,
  minSelections,
}) {
  const toggleOption = (val) => {
    if (selected.includes(val)) {
      if (minSelections && selected.length <= minSelections) return;
      onChange(selected.filter((item) => item !== val));
    } else {
      if (maxSelections && selected.length >= maxSelections) return;
      onChange([...selected, val]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const val = typeof option === 'string' ? option : option.value;
        const label = typeof option === 'string' ? option : option.label;
        const isSelected = selected.includes(val);

        return (
          <button
            key={val}
            type="button"
            onClick={() => toggleOption(val)}
            className={`min-h-[44px] px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl border transition-all inline-flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              isSelected
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm font-semibold'
                : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50'
            }`}
          >
            {isSelected && <Check className="w-4 h-4 shrink-0" />}
            {label}
          </button>
        );
      })}
    </div>
  );
}
