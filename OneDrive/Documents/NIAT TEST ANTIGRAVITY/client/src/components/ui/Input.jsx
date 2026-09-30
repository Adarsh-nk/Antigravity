import React, { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  { type = 'text', className = '', hasError = false, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={`w-full min-h-[48px] px-4 py-2.5 bg-white border rounded-xl text-slate-900 text-sm font-medium transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed ${
        hasError ? 'border-red-500 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-slate-300'
      } ${className}`}
      {...props}
    />
  );
});
