import React from 'react';
import { ResetPasswordForm } from '../components/auth/ResetPasswordForm.jsx';
import { KeyRound } from 'lucide-react';

export function ResetPassword() {
  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Set New Password</h1>
          <p className="text-xs text-slate-600">Enter your new password below.</p>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  );
}
