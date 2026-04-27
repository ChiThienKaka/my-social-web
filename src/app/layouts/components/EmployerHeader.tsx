import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/features/auth/stores/auth.store";

export function EmployerHeader() {
  const [notificationCount] = useState(3);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Tên hiển thị lấy từ auth state (user.name)
  const companyName = user?.name || "Nhà tuyển dụng";

  // Get page title from current path
  const getPageTitle = () => {
    const path = window.location.pathname;
    if (path.includes('overview')) return 'Dashboard Overview';
    if (path.includes('subscription')) return 'My Subscription';
    if (path.includes('profile')) return 'Company Profile';
    if (path.includes('jobs')) return 'Job Posts';
    if (path.includes('applications')) return 'Applications';
    if (path.includes('billing')) return 'Billing History';
    return 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-xs backdrop-blur supports-[backdrop-filter]:bg-white/90 md:px-6 lg:px-8">
      {/* Page Title */}
      <div className="min-w-0">
        <h1 className="truncate border-l-4 border-blue-500 pl-3 text-lg font-semibold tracking-tight text-slate-900 md:text-2xl">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Notifications */}
        <button className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900">
          <Bell size={20} />
          {notificationCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-0 text-[10px] font-semibold text-white">
              {notificationCount}
            </Badge>
          )}
        </button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 gap-2 rounded-xl border-slate-200 bg-white px-2.5 transition-all hover:border-blue-500 hover:bg-blue-50 focus-visible:ring-blue-500 md:px-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
                <User size={16} className="text-blue-600" />
              </div>
              <span className="hidden max-w-[160px] truncate text-sm font-medium text-slate-900 sm:block">
                {companyName}
              </span>
              <ChevronDown size={16} className="text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 rounded-xl border-slate-200 p-1">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{companyName}</span>
                <span className="text-xs font-normal text-slate-500">
                  Employer Account
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer rounded-md">
              <User size={16} className="mr-2" />
              Company Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-md">
              <Bell size={16} className="mr-2" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={() => {
                logout();
                navigate("/employer/login", { replace: true });
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
