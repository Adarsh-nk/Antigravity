import React from 'react';
import { Sprout } from 'lucide-react';
import { Button } from './Button.jsx';

export function EmptyState({
  title = 'No records found',
  description = 'Get started by creating your first entry.',
  actionText,
  onAction,
  icon: Icon = Sprout,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
      <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl mb-4">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionText}
        </Button>
      )}
    </div>
  );
}
