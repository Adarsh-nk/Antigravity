import React, { forwardRef } from 'react';

export const Select = forwardRef(function Select(
  { children, className = '', hasError = false, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={`w-full min-h-[48px] px-4 py-2.5 bg-white border rounded-xl text-slate-900 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed ${
        hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300'
      } ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});
