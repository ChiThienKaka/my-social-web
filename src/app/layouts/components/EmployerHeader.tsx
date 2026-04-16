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
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
          <Bell size={20} />
          {notificationCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-0 text-xs text-white">
              {notificationCount}
            </Badge>
          )}
        </button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <User size={16} className="text-blue-600" />
              </div>
              <span className="max-w-[150px] truncate font-medium text-gray-900">
                {companyName}
              </span>
              <ChevronDown size={16} className="text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{companyName}</span>
                <span className="text-xs font-normal text-gray-500">
                  Employer Account
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User size={16} className="mr-2" />
              Company Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
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
