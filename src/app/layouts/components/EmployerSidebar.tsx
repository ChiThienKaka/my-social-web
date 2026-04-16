import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  Building2,
  Briefcase,
  FileText,
  Receipt,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/features/auth/stores/auth.store";

const navigationItems = [
  {
    label: "Tổng quan",
    icon: <LayoutDashboard size={20} />,
    href: "/employer/overview",
  },
  {
    label: "Gói đăng ký",
    icon: <CreditCard size={20} />,
    href: "/employer/subscription",
  },
  {
    label: "Hồ sơ công ty",
    icon: <Building2 size={20} />,
    href: "/employer/profile",
  },
  {
    label: "Bài đăng tuyển dụng",
    icon: <Briefcase size={20} />,
    href: "/employer/jobs",
  },
  {
    label: "Đơn ứng tuyển",
    icon: <FileText size={20} />,
    href: "/employer/applications",
  },
  {
    label: "Lịch sử thanh toán",
    icon: <Receipt size={20} />,
    href: "/employer/billing",
  },
];

export function EmployerSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-blue-700">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900">TalentHub</div>
          <div className="text-xs text-gray-500">Employer Portal</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={isActive ? "text-blue-600" : "text-gray-500"}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={() => {
            logout();
            navigate("/employer/login", { replace: true });
          }}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
