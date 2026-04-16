import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  Bell,
  FileText,
  Settings,
  MessageSquare,
  ChevronRight,
  Package,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    label: "Tổng quan",
    icon: <LayoutDashboard size={20} />,
    href: "/admin",
  },
  {
    label: "Campus",
    icon: <GraduationCap size={20} />,
    href: "/admin/campus",
  },
  {
    label: "Cộng đồng",
    icon: <MessageSquare size={20} />,
    children: [
      { label: "Chủ đề", icon: null, href: "/admin/community/topics" },
      { label: "Bài viết", icon: null, href: "/admin/community/posts" },
      { label: "Báo cáo vi phạm", icon: null, href: "/admin/community/reports" },
    ],
  },
  {
    label: "Tuyển dụng",
    icon: <Briefcase size={20} />,
    children: [
      { label: "Công ty", icon: null, href: "/admin/career/companies" },
      { label: "Bài đăng tuyển dụng", icon: null, href: "/admin/career/jobs" },
      { label: "Gói dịch vụ", icon: null, href: "/admin/career/packages" },
      { label: "Đơn ứng tuyển", icon: null, href: "/admin/career/applications" },
    ],
  },
  {
    label: "Người dùng",
    icon: <Users size={20} />,
    children: [
      { label: "Tất cả người dùng", icon: null, href: "/admin/users" },
      { label: "Sinh viên", icon: null, href: "/admin/users/students" },
      { label: "Nhà tuyển dụng", icon: null, href: "/admin/users/recruiters" },
      { label: "Quản trị viên", icon: null, href: "/admin/users/admins" },
    ],
  },
  {
    label: "Thông báo",
    icon: <Bell size={20} />,
    href: "/admin/notifications",
  },
  {
    label: "Nhật ký hệ thống",
    icon: <FileText size={20} />,
    href: "/admin/audit-logs",
  },
  {
    label: "Cài đặt",
    icon: <Settings size={20} />,
    children: [
      { label: "Hệ thống", icon: null, href: "/admin/settings/system" },
      { label: "Vai trò & Quyền", icon: null, href: "/admin/settings/roles" },
    ],
  },
];

export function AdminSidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>(["Tuyển dụng"]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  return (
    <aside className="w-64 border-r border-gray-200 bg-white">
      {/* Logo/Branding Area */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <NavItemComponent
              key={item.label}
              item={item}
              isExpanded={expandedItems.includes(item.label)}
              onToggle={() => toggleExpand(item.label)}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

interface NavItemComponentProps {
  item: NavItem;
  isExpanded: boolean;
  onToggle: () => void;
}

function NavItemComponent({
  item,
  isExpanded,
  onToggle,
}: NavItemComponentProps) {
  const hasChildren = item.children && item.children.length > 0;
  const location = useLocation();
  const isActive = item.href === location.pathname;

  return (
    <li>
      {hasChildren ? (
        <button
          onClick={onToggle}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          {item.icon}
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronRight
            size={16}
            className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}
          />
        </button>
      ) : (
        <Link
          to={item.href || "#"}
          className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
            isActive
              ? "bg-blue-50 text-blue-700 font-medium"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {item.icon}
          <span className="flex-1 text-left">{item.label}</span>
        </Link>
      )}

      {/* Sub-items */}
      {hasChildren && isExpanded && (
        <ul className="ml-8 mt-1 space-y-1 border-l border-gray-200 pl-3">
          {item.children?.map((child) => {
            const isChildActive = child.href === location.pathname;
            return (
              <li key={child.label}>
                <Link
                  to={child.href || "#"}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    isChildActive
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
