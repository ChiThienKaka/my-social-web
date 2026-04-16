import { useEffect, useState, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, Users, Eye } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import {
  fetchApplications,
  type Application,
  type ApplicationStatus,
} from "../services/application.service";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; class: string }> = {
  pending: { label: "Chờ xem", class: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  reviewed: { label: "Đã xem", class: "bg-blue-100 text-blue-700 border-blue-200" },
  shortlisted: { label: "Tiềm năng", class: "bg-purple-100 text-purple-700 border-purple-200" },
  interviewed: { label: "Phỏng vấn", class: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  offered: { label: "Đề nghị", class: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  accepted: { label: "Chấp nhận", class: "bg-green-100 text-green-700 border-green-200" },
  rejected: { label: "Từ chối", class: "bg-red-100 text-red-700 border-red-200" },
  withdrawn: { label: "Rút hồ sơ", class: "bg-gray-100 text-gray-700 border-gray-200" },
};

const RATING_STARS = (r?: number | null) => {
  if (!r) return null;
  return "★".repeat(r) + "☆".repeat(5 - r);
};

export function ApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobIdFilter, setJobIdFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchApplications({
        page,
        per_page: 10,
        status: statusFilter !== "all" ? (statusFilter as ApplicationStatus) : undefined,
        job_id: jobIdFilter ? parseInt(jobIdFilter) : undefined,
      });
      setApplications(res.data);
      setTotal(res.total);
      setTotalPages(res.total_pages);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, jobIdFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn ứng tuyển</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tổng <span className="font-semibold text-blue-600">{total}</span> đơn ứng tuyển
          </p>
        </div>
      </div>

      {/* Status summary badges */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(STATUS_CONFIG) as ApplicationStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
              statusFilter === s
                ? STATUS_CONFIG[s].class + " ring-2 ring-offset-1 ring-current"
                : "border-gray-200 text-gray-500 hover:border-gray-400"
            }`}
          >
            {STATUS_CONFIG[s].label}
          </button>
        ))}
        {statusFilter !== "all" && (
          <button
            onClick={() => { setStatusFilter("all"); setPage(1); }}
            className="rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-500 hover:bg-gray-50"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Filters */}
      <Card className="border border-gray-200">
        <CardContent className="flex gap-3 p-4">
          <Select
            value={statusFilter}
            onValueChange={(v) => { setStatusFilter(v); setPage(1); }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {(Object.keys(STATUS_CONFIG) as ApplicationStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_CONFIG[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Input
              placeholder="Lọc theo ID bài đăng..."
              value={jobIdFilter}
              onChange={(e) => setJobIdFilter(e.target.value)}
              className="w-52"
              type="number"
            />
            <Button variant="outline" onClick={() => { setPage(1); load(); }}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100 bg-gray-50 py-3">
          <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase">
            <div className="col-span-3">Ứng viên</div>
            <div className="col-span-3">Vị trí ứng tuyển</div>
            <div className="col-span-2">Ngày nộp</div>
            <div className="col-span-2">Trạng thái</div>
            <div className="col-span-1">Đánh giá</div>
            <div className="col-span-1 text-right">Hành động</div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-48 items-center justify-center text-gray-400">Đang tải...</div>
          ) : applications.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3 text-gray-400">
              <Users className="h-10 w-10 opacity-30" />
              <p>Không có đơn ứng tuyển nào</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {applications.map((app) => {
                const displayName = app.full_name || app.name || "Ứng viên";
                return (
                  <div
                    key={app.application_id}
                    className="grid grid-cols-12 items-center gap-2 px-5 py-4 text-sm hover:bg-gray-50 transition-colors"
                  >
                    {/* Candidate */}
                    <div className="col-span-3 flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-blue-600 text-sm font-bold text-white">
                        {displayName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{app.email}</p>
                      </div>
                    </div>

                  {/* Job */}
                  <div className="col-span-3 min-w-0">
                    <p className="font-medium text-gray-700 truncate">{app.jobpost?.job_title ?? "—"}</p>
                    <p className="text-xs text-gray-400">#{app.jobpost?.job_id ?? "—"}</p>
                  </div>

                  {/* Date */}
                  <div className="col-span-2 text-gray-500 text-xs">
                    {formatDate(app.applied_at)}
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${STATUS_CONFIG[app.status]?.class ?? ""}`}
                    >
                      {STATUS_CONFIG[app.status]?.label ?? app.status}
                    </Badge>
                  </div>

                  {/* Rating */}
                  <div className="col-span-1 text-xs text-amber-500">
                    {RATING_STARS(app.rating) ?? <span className="text-gray-300">—</span>}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/employer/applications/${app.application_id}`)}
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
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
    </div>
  );
}
