import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/auth.store';

export function EmployerGuard() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/employer/login" replace />;
  }

  if (user?.role !== 'employer') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
