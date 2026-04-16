import { Bell, Search, User, LogOut, Settings } from 'lucide-react';

export function TopHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Search Bar */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative rounded-md p-2 text-gray-600 hover:bg-gray-100">
          <Bell size={20} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300"></div>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-300"></div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">Admin User</div>
              <div className="text-xs text-gray-500">SUPER_ADMIN</div>
            </div>
          </div>

          {/* Dropdown Trigger (Placeholder) */}
          <button className="rounded-md p-1 text-gray-600 hover:bg-gray-100">
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
