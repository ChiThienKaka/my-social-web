import { useEffect, useState, useCallback } from "react";
import {
  Users as UsersIcon,
  Shield,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  Lock,
  LockOpen,
  Building2,
  GraduationCap,
  BadgeCheck,
  BadgeX,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
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
  fetchUserDetail,
  toggleUserBan,
  type AdminUserDetail,
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

function UserAvatar({
  src,
  name,
  sizeClass = "h-9 w-9",
  textClass = "text-sm",
}: {
  src?: string | null;
  name: string;
  sizeClass?: string;
  textClass?: string;
}) {
  const [broken, setBroken] = useState(false);
  const initial = (name?.trim() || "?").charAt(0).toUpperCase();
  if (src && !broken) {
    return (
      <img
        src={src}
        alt=""
        className={cn(
          "shrink-0 rounded-full object-cover ring-2 ring-gray-100",
          sizeClass,
        )}
        onError={() => setBroken(true)}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-blue-600 font-bold text-white ring-2 ring-gray-100",
        sizeClass,
        textClass,
      )}
    >
      {initial}
    </div>
  );
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");

  const [banTarget, setBanTarget] = useState<User | null>(null);
  const [banning, setBanning] = useState(false);

  const [detailId, setDetailId] = useState<number | null>(null);
  const [detailData, setDetailData] = useState<AdminUserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const openUserDetail = (userId: number) => {
    setDetailId(userId);
    setDetailData(null);
    setDetailError(null);
    setDetailLoading(true);
    fetchUserDetail(userId)
      .then(setDetailData)
      .catch((e: unknown) => {
        setDetailError(e instanceof Error ? e.message : "Không tải được chi tiết người dùng.");
      })
      .finally(() => setDetailLoading(false));
  };

  const closeUserDetail = () => {
    setDetailId(null);
    setDetailData(null);
    setDetailError(null);
    setDetailLoading(false);
  };

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

                const avatarSrc = user.avatar_url ?? user.profile?.avatar_url ?? null;

                return (
                  <div
                    key={user.user_id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openUserDetail(user.user_id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openUserDetail(user.user_id);
                      }
                    }}
                    className="grid grid-cols-12 items-center gap-2 px-5 py-4 text-sm transition-colors hover:bg-gray-50 cursor-pointer"
                  >
                    {/* User Info */}
                    <div className="col-span-3 flex items-center gap-3 min-w-0">
                      <UserAvatar src={avatarSrc} name={displayName} />
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
                        onClick={(e) => {
                          e.stopPropagation();
                          setBanTarget(user);
                        }}
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

      {/* User detail */}
      <Dialog
        open={detailId !== null}
        onOpenChange={(o) => {
          if (!o) closeUserDetail();
        }}
      >
        <DialogContent className="max-w-lg" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
            <DialogDescription>
              Bao gồm email, vai trò và trạng thái hoạt động.
            </DialogDescription>
          </DialogHeader>

          {detailLoading && (
            <div className="flex h-40 items-center justify-center text-sm text-gray-500">
              Đang tải...
            </div>
          )}

          {!detailLoading && detailError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {detailError}
            </p>
          )}

          {!detailLoading && detailData && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                <UserAvatar
                  src={detailData.avatar_url}
                  name={detailData.full_name}
                  sizeClass="h-20 w-20"
                  textClass="text-2xl"
                />
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <p className="text-lg font-semibold text-gray-900">{detailData.full_name}</p>
                  <p className="truncate text-sm text-gray-500">#{detailData.user_id}</p>
                  <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                    <Badge variant="outline" className="text-xs capitalize">
                      {detailData.role_name}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${(STATUS_CONFIG[detailData.status] ?? STATUS_CONFIG.active).class}`}
                    >
                      {(STATUS_CONFIG[detailData.status] ?? STATUS_CONFIG.active).label}
                    </Badge>
                    {detailData.is_verified ? (
                      <Badge variant="outline" className="border-green-200 bg-green-50 text-xs text-green-800">
                        <BadgeCheck className="mr-1 h-3 w-3" />
                        Đã xác thực
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-xs text-amber-800">
                        <BadgeX className="mr-1 h-3 w-3" />
                        Chưa xác thực
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="space-y-1">
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Email</dt>
                  <dd className="flex items-start gap-2 font-medium text-gray-900">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <span className="break-all">{detailData.email}</span>
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Điện thoại</dt>
                  <dd className="flex items-center gap-2 text-gray-900">
                    <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                    {detailData.phone ?? "—"}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Ngày tạo</dt>
                  <dd className="flex items-center gap-2 text-gray-900">
                    <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
                    {new Date(detailData.created_at).toLocaleString("vi-VN")}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Mã sinh viên</dt>
                  <dd className="flex items-center gap-2 text-gray-900">
                    <GraduationCap className="h-4 w-4 shrink-0 text-gray-400" />
                    {detailData.student_code ?? "—"}
                  </dd>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Công ty</dt>
                  <dd className="flex items-center gap-2 text-gray-900">
                    <Building2 className="h-4 w-4 shrink-0 text-gray-400" />
                    {detailData.company_name ?? "—"}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeUserDetail}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
