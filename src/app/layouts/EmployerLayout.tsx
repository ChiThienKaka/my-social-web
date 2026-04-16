import { Outlet } from 'react-router-dom';
import { EmployerSidebar } from './components/EmployerSidebar';
import { EmployerHeader } from './components/EmployerHeader';

export function EmployerLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <EmployerSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <EmployerHeader />
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
