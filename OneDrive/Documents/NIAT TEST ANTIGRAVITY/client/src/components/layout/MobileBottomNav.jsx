import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Landmark, PlusCircle, History, User } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider.jsx';
import { useT } from '../../i18n/useT.js';

export function MobileBottomNav() {
  const { user } = useAuth();
  const { t } = useT();
  const location = useLocation();

  if (!user) return null;

  const items = [
    { path: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { path: '/farms', label: t('farms'), icon: Landmark },
    { path: '/advisory/new', label: t('newAdvisory'), icon: PlusCircle, isPrimary: true },
    { path: '/history', label: t('history'), icon: History },
    { path: '/profile', label: t('profile'), icon: User },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 px-2 py-1 shadow-lg"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.isPrimary) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="p-3 bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-700/40 ring-4 ring-slate-900 active:scale-95 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-emerald-400 mt-0.5">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1.5 px-3 rounded-lg text-center transition-colors ${
                isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-[10px] font-semibold mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
