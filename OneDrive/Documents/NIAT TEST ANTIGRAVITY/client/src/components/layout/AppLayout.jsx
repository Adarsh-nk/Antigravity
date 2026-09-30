import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { MobileBottomNav } from './MobileBottomNav.jsx';
import { Footer } from './Footer.jsx';

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
