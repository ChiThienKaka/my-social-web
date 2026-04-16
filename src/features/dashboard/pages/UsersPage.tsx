import { useEffect, useState, useCallback } from "react";
import {
  Users as UsersIcon,
  Shield,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  Lock,
  LockOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  fetchUsers,
  toggleUserBan,
  type User,
} from "../services/admin-user.service";

const ROLE_CONFIG: Record<number, { label: string; class: string; icon: React.ReactNode }> = {
  1: {
    label: "Admin",
    class: "bg-red-100 text-red-700 border-red-200",
    icon: <Shield className="h-3 w-3" />,
  },
  2: {
    label: "Sinh viên",
    class: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <UsersIcon className="h-3 w-3" />,
  },
  4: {
    label: "Nhà tuyển dụng",
    class: "bg-purple-100 text-purple-700 border-purple-200",
    icon: <UsersIcon className="h-3 w-3" />,
  },
};

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  active: { label: "Hoạt động", class: "bg-green-100 text-green-700 border-green-200" },
  banned: { label: "Bị khóa", class: "bg-red-100 text-red-700 border-red-200" },
  inactive: { label: "Không hoạt động", class: "bg-gray-100 text-gray-600 border-gray-200" },
};

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");

  const [banTarget, setBanTarget] = useState<User | null>(null);
  const [banning, setBanning] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchUsers({
        role_id: roleFilter !== "all" ? parseInt(roleFilter) : undefined,
        per_page: 15,
        page,
      });
      setUsers(res.data);
      setTotal(res.total);
      setTotalPages(res.total_pages);
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggleBan = async () => {
    if (!banTarget) return;
    setBanning(true);
    try {
      await toggleUserBan(banTarget.user_id);
      setBanTarget(null);
      load();
    } catch (e: any) {
      alert(e?.message ?? "Có lỗi xảy ra.");
    } finally {
      setBanning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tổng <span className="font-semibold text-blue-600">{total}</span> người dùng
        </p>
      </div>

      {/* Filters */}
      <Card className="border border-gray-200">
        <CardContent className="flex gap-3 p-4">
          <Select
            value={roleFilter}
            onValueChange={(v) => {
              setRoleFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="1">Admin</SelectItem>
              <SelectItem value="2">Sinh viên</SelectItem>
              <SelectItem value="4">Nhà tuyển dụng</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100 bg-gray-50 py-3">
          <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase">
            <div className="col-span-3">Người dùng</div>
            <div className="col-span-2">Vai trò</div>
            <div className="col-span-2">Liên hệ</div>
            <div className="col-span-2">Đăng nhập lần cuối</div>
            <div className="col-span-2">Trạng thái</div>
            <div className="col-span-1 text-right">Hành động</div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-48 items-center justify-center text-gray-400">Đang tải...</div>
          ) : users.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3 text-gray-400">
              <UsersIcon className="h-10 w-10 opacity-30" />
              <p>Không có người dùng nào</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {users.map((user) => {
                const displayName = user.full_name || user.name || "Người dùng";
                const roleCfg = ROLE_CONFIG[user.role] ?? {
                  label: `Role ${user.role}`,
                  class: "bg-gray-100 text-gray-600",
                  icon: <UsersIcon className="h-3 w-3" />,
                };
                const statusCfg = STATUS_CONFIG[user.status] ?? STATUS_CONFIG.active;

                return (
                  <div
                    key={user.user_id}
                    className="grid grid-cols-12 items-center gap-2 px-5 py-4 text-sm hover:bg-gray-50 transition-colors"
                  >
                    {/* User Info */}
                    <div className="col-span-3 flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-blue-600 text-sm font-bold text-white">
                        {displayName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-400">ID: #{user.user_id}</p>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="col-span-2">
                      <Badge variant="outline" className={`text-xs ${roleCfg.class}`}>
                        {roleCfg.icon}
                        <span className="ml-1">{roleCfg.label}</span>
                      </Badge>
                    </div>

                    {/* Contact */}
                    <div className="col-span-2 space-y-1 text-xs text-gray-500 min-w-0">
                      <div className="flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.profile?.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 shrink-0" />
                          <span>{user.profile.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Last Login */}
                    <div className="col-span-2 text-xs text-gray-500">
                      {user.last_login_at
                        ? new Date(user.last_login_at).toLocaleDateString("vi-VN")
                        : "Chưa đăng nhập"}
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <Badge variant="outline" className={`text-xs ${statusCfg.class}`}>
                        {statusCfg.label}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className={
                          user.status === "banned"
                            ? "text-green-600 hover:bg-green-50 hover:border-green-300"
                            : "text-red-600 hover:bg-red-50 hover:border-red-300"
                        }
                        onClick={() => setBanTarget(user)}
                        title={user.status === "banned" ? "Mở khóa" : "Khóa tài khoản"}
                      >
                        {user.status === "banned" ? (
                          <LockOpen className="h-4 w-4" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
            <span className="text-sm text-gray-500">
              Trang {page} / {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Ban/Unban Confirm */}
      <Dialog open={!!banTarget} onOpenChange={(o) => !o && setBanTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {banTarget?.status === "banned" ? "Mở khóa tài khoản" : "Khóa tài khoản"}
            </DialogTitle>
            <DialogDescription aria-describedby={undefined}>
              {banTarget?.status === "banned"
                ? "Người dùng sẽ có thể đăng nhập và sử dụng hệ thống trở lại."
                : "Người dùng sẽ không thể đăng nhập và sử dụng hệ thống."}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            {banTarget?.status === "banned" ? "Mở khóa" : "Khóa"} tài khoản{" "}
            <span className="font-semibold">
              "{banTarget?.full_name || banTarget?.name || "Người dùng"}"
            </span>{" "}
            ({banTarget?.email})?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanTarget(null)}>
              Hủy
            </Button>
            <Button
              className={
                banTarget?.status === "banned"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }
              disabled={banning}
              onClick={handleToggleBan}
            >
              {banning
                ? "Đang xử lý..."
                : banTarget?.status === "banned"
                ? "Mở khóa"
                : "Khóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
