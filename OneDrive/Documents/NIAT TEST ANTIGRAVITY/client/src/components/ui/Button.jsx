import React from 'react';
import { Spinner } from './Spinner.jsx';

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]';

  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 focus:ring-emerald-500',
    secondary: 'bg-slate-800 hover:bg-slate-900 text-white shadow-md focus:ring-slate-700',
    outline: 'border-2 border-slate-300 hover:border-emerald-600 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 focus:ring-emerald-500',
    ghost: 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 focus:ring-emerald-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs min-h-[38px]',
    md: 'px-4 py-2.5 text-sm min-h-[48px]',
    lg: 'px-6 py-3 text-base min-h-[52px]',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Spinner size={size === 'sm' ? 'sm' : 'md'} className="mr-2" />
      ) : Icon ? (
        <Icon className={`shrink-0 ${size === 'sm' ? 'w-4 h-4 mr-1.5' : 'w-5 h-5 mr-2'}`} />
      ) : null}
      {children}
    </button>
  );
}
