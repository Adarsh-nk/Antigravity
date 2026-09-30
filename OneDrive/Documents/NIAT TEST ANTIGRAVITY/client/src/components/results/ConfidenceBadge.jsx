import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export function ConfidenceBadge({ confidence }) {
  const configs = {
    high: {
      label: 'High Confidence',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      icon: ShieldCheck,
    },
    medium: {
      label: 'Medium Confidence',
      bg: 'bg-amber-50 text-amber-800 border-amber-300',
      icon: AlertTriangle,
    },
    low: {
      label: 'Low Confidence (Escalation Advised)',
      bg: 'bg-rose-50 text-rose-800 border-rose-300',
      icon: ShieldAlert,
    },
  };

  const config = configs[confidence] || configs.medium;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.bg}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {config.label}
    </span>
  );
}
