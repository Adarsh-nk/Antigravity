import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm.jsx';
import { Sprout } from 'lucide-react';
import { useT } from '../i18n/useT.js';

export function Login() {
  const { t } = useT();

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">{t('welcomeBack')}</h1>
          <p className="text-xs text-slate-600">Sign in to manage your farms and access crop advisories.</p>
        </div>

        <LoginForm />

        <div className="text-center text-xs text-slate-600 pt-4 border-t border-slate-100">
          Don't have an account yet?{' '}
          <Link to="/signup" className="font-bold text-emerald-700 hover:underline">
            {t('signup')}
          </Link>
        </div>
      </div>
    </div>
  );
}
