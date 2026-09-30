import React, { forwardRef } from 'react';

export const Textarea = forwardRef(function Textarea(
  { rows = 4, className = '', hasError = false, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`w-full min-h-[96px] p-4 bg-white border rounded-xl text-slate-900 text-sm font-medium transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed ${
        hasError ? 'border-red-500 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-slate-300'
      } ${className}`}
      {...props}
    />
  );
});
