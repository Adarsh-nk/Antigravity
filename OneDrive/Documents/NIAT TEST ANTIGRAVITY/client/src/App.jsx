import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient.js';
import { AuthProvider } from './context/AuthProvider.jsx';
import { ToastProvider } from './context/ToastProvider.jsx';
import { ErrorBoundary } from './components/layout/ErrorBoundary.jsx';
import { AppLayout } from './components/layout/AppLayout.jsx';
import { ProtectedRoute } from './components/layout/ProtectedRoute.jsx';
import { PublicOnlyRoute } from './components/layout/PublicOnlyRoute.jsx';

import { Landing } from './pages/Landing.jsx';
import { Signup } from './pages/Signup.jsx';
import { Login } from './pages/Login.jsx';
import { ForgotPassword } from './pages/ForgotPassword.jsx';
import { ResetPassword } from './pages/ResetPassword.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Farms } from './pages/Farms.jsx';
import { FarmNew } from './pages/FarmNew.jsx';
import { FarmEdit } from './pages/FarmEdit.jsx';
import { AdvisoryNew } from './pages/AdvisoryNew.jsx';
import { AdvisoryForm } from './pages/AdvisoryForm.jsx';
import { AdvisoryDetail } from './pages/AdvisoryDetail.jsx';
import { History } from './pages/History.jsx';
import { Profile } from './pages/Profile.jsx';
import { NotFound } from './pages/NotFound.jsx';

import './print.css';

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<AppLayout />}>
                  {/* Public Routes */}
                  <Route
                    path="/"
                    element={
                      <PublicOnlyRoute>
                        <Landing />
                      </PublicOnlyRoute>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <PublicOnlyRoute>
                        <Signup />
                      </PublicOnlyRoute>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <PublicOnlyRoute>
                        <Login />
                      </PublicOnlyRoute>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <PublicOnlyRoute>
                        <ForgotPassword />
                      </PublicOnlyRoute>
                    }
                  />
                  <Route
                    path="/reset-password"
                    element={
                      <PublicOnlyRoute>
                        <ResetPassword />
                      </PublicOnlyRoute>
                    }
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/farms"
                    element={
                      <ProtectedRoute>
                        <Farms />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/farms/new"
                    element={
                      <ProtectedRoute>
                        <FarmNew />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/farms/:farmId/edit"
                    element={
                      <ProtectedRoute>
                        <FarmEdit />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/advisory/new"
                    element={
                      <ProtectedRoute>
                        <AdvisoryNew />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/advisory/new/:type"
                    element={
                      <ProtectedRoute>
                        <AdvisoryForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/advisory/:id"
                    element={
                      <ProtectedRoute>
                        <AdvisoryDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      <ProtectedRoute>
                        <History />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
