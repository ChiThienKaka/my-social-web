import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/auth.store';

export function AdminGuard() {
  const { isAuthenticated, user } = useAuthStore();

  console.log("AdminGuard - isAuthenticated:", isAuthenticated);
  console.log("AdminGuard - user role:", user?.role);

  if (!isAuthenticated) {
    console.log("AdminGuard - Not authenticated, redirecting to /admin/login");
    return <Navigate to="/admin/login" replace />;
  }

  if (user?.role !== 'admin') {
    console.log("AdminGuard - Not an admin, redirecting to /");
    return <Navigate to="/" replace />;
  }

  console.log("AdminGuard - Access granted");
  return <Outlet />;
}
