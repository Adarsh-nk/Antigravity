import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, LayoutDashboard, Landmark, PlusCircle, History, User, LogOut, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider.jsx';
import { useT } from '../../i18n/useT.js';
import { useProfile } from '../../hooks/useProfile.js';

export function Navbar() {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { t, lang, setLanguage } = useT(profile?.preferred_language);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { path: '/farms', label: t('farms'), icon: Landmark },
    { path: '/advisory/new', label: t('newAdvisory'), icon: PlusCircle },
    { path: '/history', label: t('history'), icon: History },
  ];

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="p-2 bg-emerald-700 group-hover:bg-emerald-800 rounded-xl transition-colors">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-tight">
                {t('brandName')}
              </span>
              <span className="text-[10px] font-medium text-emerald-400 block leading-none">
                AI Agri Advisor
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-emerald-700/80 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Actions: Language Switcher & Profile/Auth */}
          <div className="flex items-center gap-3">
            {/* Language Dropdown */}
            <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold">
              <Globe className="w-4 h-4 text-emerald-400 mr-1.5 shrink-0" />
              <select
                value={lang}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-1"
                aria-label="Select UI Language"
              >
                <option value="en" className="bg-slate-900 text-white">English</option>
                <option value="hi" className="bg-slate-900 text-white">हिन्दी</option>
                <option value="mr" className="bg-slate-900 text-white">मराठी</option>
              </select>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                  title={t('profile')}
                  aria-label={t('profile')}
                >
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={signOut}
                  className="p-2 text-slate-300 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  title={t('logout')}
                  aria-label={t('logout')}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-xs sm:text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-sm transition-colors"
                >
                  {t('signup')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
