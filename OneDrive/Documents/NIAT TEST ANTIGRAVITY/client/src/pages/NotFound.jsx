import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <Sprout className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-slate-900">404</h1>
        <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
        <p className="text-sm text-slate-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/dashboard" className="inline-block pt-2">
          <Button variant="primary">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
