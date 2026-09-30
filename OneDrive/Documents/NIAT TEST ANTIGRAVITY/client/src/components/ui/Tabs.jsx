import React from 'react';

export function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`py-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              isActive
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
