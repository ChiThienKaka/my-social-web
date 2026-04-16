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
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    href: '/admin',
  },
  {
    label: 'Campus',
    icon: <Building2 size={20} />,
    href: '/admin/campus',
  },
  {
    label: 'Community',
    icon: <MessageSquare size={20} />,
    children: [
      { label: 'Topics', icon: null, href: '/admin/community/topics' },
      { label: 'Posts', icon: null, href: '/admin/community/posts' },
      { label: 'Reports', icon: null, href: '/admin/community/reports' },
    ],
  },
  {
    label: 'Career',
    icon: <Briefcase size={20} />,
    children: [
      { label: 'Recruiters', icon: null, href: '/admin/career/recruiters' },
      { label: 'Job Posts', icon: null, href: '/admin/career/jobs' },
      { label: 'Applications', icon: null, href: '/admin/career/applications' },
    ],
  },
  {
    label: 'Users',
    icon: <Users size={20} />,
    children: [
      { label: 'Students', icon: null, href: '/admin/users/students' },
      { label: 'Recruiters', icon: null, href: '/admin/users/recruiters' },
      { label: 'Admins', icon: null, href: '/admin/users/admins' },
    ],
  },
  {
    label: 'Notifications',
    icon: <Bell size={20} />,
    href: '/admin/notifications',
  },
  {
    label: 'Audit Logs',
    icon: <FileText size={20} />,
    href: '/admin/audit-logs',
  },
  {
    label: 'Settings',
    icon: <Settings size={20} />,
    children: [
      { label: 'System', icon: null, href: '/admin/settings/system' },
      { label: 'Roles & Permissions', icon: null, href: '/admin/settings/roles' },
    ],
  },
];

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  return (
    <aside className="w-64 border-r border-gray-200 bg-white">
      {/* Logo/Branding Area */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-blue-600"></div>
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

function NavItemComponent({ item, isExpanded, onToggle }: NavItemComponentProps) {
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
            className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          />
        </button>
      ) : (
        <Link
          to={item.href || '#'}
          className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
            isActive
              ? 'bg-blue-50 text-blue-700 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
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
                  to={child.href || '#'}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    isChildActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
