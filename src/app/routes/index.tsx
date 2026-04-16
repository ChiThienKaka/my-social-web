import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicRoutes } from './public.routes';
import { EmployerRoutes } from './employer.routes';
import { AdminRoutes } from './admin.routes';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Employer Routes */}
        <Route path="/employer/*" element={<EmployerRoutes />} />

        {/* Subscription Routes (part of employer flow) */}
        <Route path="/subscription/*" element={<EmployerRoutes />} />

        {/* Public Routes */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
