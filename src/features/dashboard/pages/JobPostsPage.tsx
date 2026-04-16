import { useEffect, useState, useCallback } from "react";
import {
  Briefcase,
  CheckCircle,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Users,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  fetchJobPostList,
  fetchJobPostStats,
  updateJobPostStatus,
  type AdminJobPost,
  type JobPostStats,
} from "../services/admin-jobpost.service";

const STATUS_CONFIG: Record<
  string,
  { label: string; class: string }
> = {
  pending: {
    label: "Chờ duyệt",
    class: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  approved: {
    label: "Đã duyệt",
    class: "bg-green-100 text-green-700 border-green-200",
  },
  rejected: {
    label: "Từ chối",
    class: "bg-red-100 text-red-700 border-red-200",
  },
  expired: {
    label: "Hết hạn",
    class: "bg-gray-100 text-gray-700 border-gray-200",
  },
  closed: {
    label: "Đóng",
    class: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: "Toàn thời gian",
  part_time: "Bán thời gian",
  contract: "Hợp đồng",
  internship: "Thực tập",
  freelance: "Freelance",
};

function formatSalary(min?: string, max?: string, type?: string) {
  if (type === "negotiable") return "Thương lượng";
  if (!min && !max) return "Thương lượng";
  const fmt = (v: string) => `${(parseInt(v) / 1_000_000).toFixed(0)}tr`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `Từ ${fmt(min)}`;
  return `Đến ${fmt(max!)}`;
}

export function JobPostsPage() {
  const [jobs, setJobs] = useState<AdminJobPost[]>([]);
  const [stats, setStats] = useState<JobPostStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const [viewJob, setViewJob] = useState<AdminJobPost | null>(null);
  const [moderating, setModerating] = useState(false);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<AdminJobPost | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [rejectError, setRejectError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    console.log("[JobPostsPage] Loading job posts and stats...");
    try {
      const [jobsRes, statsRes] = await Promise.all([
        fetchJobPostList({
          status: statusFilter !== "all" ? statusFilter : undefined,
          search: debouncedSearch || undefined,
          per_page: 15,
          page,
        }),
        fetchJobPostStats(),
      ]);
      console.log("[JobPostsPage] Data received:", { jobsRes, statsRes });
      setJobs(jobsRes.data);
      setTotal(jobsRes.total);
      setTotalPages(jobsRes.total_pages);
      setStats(statsRes);
    } catch (error) {
      console.error("[JobPostsPage] Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (jobId: number) => {
    setModerating(true);
    try {
      await updateJobPostStatus(jobId, { status: "approved" });
      setViewJob(null);
      load();
    } catch (e: any) {
      alert(e?.message ?? "Có lỗi xảy ra.");
    } finally {
      setModerating(false);
    }
  };

  const openRejectModal = (job: AdminJobPost) => {
    setRejectTarget(job);
    setRejectionReason("");
    setRejectError(null);
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setRejectError("Vui lòng nhập lý do từ chối.");
      return;
    }
    setRejecting(true);
    setRejectError(null);
    try {
      await updateJobPostStatus(rejectTarget!.job_id, {
        status: "rejected",
        rejection_reason: rejectionReason,
      });
      setShowRejectModal(false);
      setViewJob(null);
      load();
    } catch (e: any) {
      setRejectError(e?.message ?? "Có lỗi xảy ra.");
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kiểm duyệt bài đăng tuyển dụng</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tổng <span className="font-semibold text-blue-600">{total}</span> bài đăng
        </p>
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(stats)
            .filter(([k]) => k !== "total")
            .map(([key, value]) => (
              <Card key={key} className="border border-gray-200">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {STATUS_CONFIG[key]?.label ?? key}
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Filters */}
      <Card className="border border-gray-200">
        <CardContent className="flex flex-wrap gap-3 p-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm theo tiêu đề, công ty..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
              <SelectItem value="approved">Đã duyệt</SelectItem>
              <SelectItem value="rejected">Từ chối</SelectItem>
              <SelectItem value="expired">Hết hạn</SelectItem>
              <SelectItem value="closed">Đóng</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Job Posts List */}
      <Card className="border border-gray-200">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-48 items-center justify-center text-gray-400">Đang tải...</div>
          ) : jobs.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3 text-gray-400">
              <Briefcase className="h-10 w-10 opacity-30" />
              <p>Không có bài đăng nào</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {jobs.map((job) => (
                <div
                  key={job.job_id}
                  className="flex items-start gap-4 p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{job.job_title}</h3>
                      <Badge
                        variant="outline"
                        className={`text-xs ${STATUS_CONFIG[job.status]?.class}`}
                      >
                        {STATUS_CONFIG[job.status]?.label}
                      </Badge>
                      {job.is_featured && (
                        <Badge className="bg-amber-100 text-amber-700 text-xs">Nổi bật</Badge>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <Building2 className="h-3 w-3" />
                      <span className="font-medium">{job.company.company_name}</span>
                      <span className="text-gray-300">•</span>
                      <span>
                        {job.recruiter.full_name || job.recruiter.name || "Nhà tuyển dụng"}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {JOB_TYPE_LABELS[job.job_type] ?? job.job_type}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location_province}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatSalary(job.salary_min, job.salary_max, job.salary_type)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Hạn: {job.application_deadline}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {job.application_count} đơn • {job.view_count} lượt xem
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setViewJob(job)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {job.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 text-white hover:bg-green-700"
                          onClick={() => handleApprove(job.job_id)}
                          disabled={moderating}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Duyệt
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openRejectModal(job)}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Từ chối
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
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

      {/* View Detail Dialog */}
      <Dialog open={!!viewJob} onOpenChange={(o) => !o && setViewJob(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết bài đăng</DialogTitle>
            <DialogDescription aria-describedby={undefined}>
              Kiểm tra và kiểm duyệt bài đăng tuyển dụng.
            </DialogDescription>
          </DialogHeader>
          {viewJob && (
            <div className="space-y-4 text-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{viewJob.job_title}</h2>
                  <p className="text-xs text-gray-500">ID: #{viewJob.job_id}</p>
                </div>
                <Badge
                  variant="outline"
                  className={STATUS_CONFIG[viewJob.status]?.class}
                >
                  {STATUS_CONFIG[viewJob.status]?.label}
                </Badge>
              </div>

              <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                <p className="text-xs font-semibold uppercase text-blue-700 mb-2">Công ty</p>
                <p className="text-sm text-blue-900 font-medium">{viewJob.company.company_name}</p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Nhà tuyển dụng:{" "}
                  {viewJob.recruiter.full_name || viewJob.recruiter.name || "Nhà tuyển dụng"}{" "}
                  ({viewJob.recruiter.email})
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-4">
                <div>
                  <p className="text-xs text-gray-400">Loại hình</p>
                  <p className="font-medium">{JOB_TYPE_LABELS[viewJob.job_type] ?? viewJob.job_type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Địa điểm</p>
                  <p className="font-medium">{viewJob.location_province}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Mức lương</p>
                  <p className="font-medium">
                    {formatSalary(viewJob.salary_min, viewJob.salary_max, viewJob.salary_type)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Hạn nộp</p>
                  <p className="font-medium">{viewJob.application_deadline}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Đơn ứng tuyển</p>
                  <p className="font-medium">{viewJob.application_count}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Lượt xem</p>
                  <p className="font-medium">{viewJob.view_count}</p>
                </div>
              </div>

              {viewJob.rejection_reason && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-xs font-semibold uppercase text-red-700 mb-1">
                    Lý do từ chối
                  </p>
                  <p className="text-sm text-red-800">{viewJob.rejection_reason}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Tạo: {new Date(viewJob.created_at).toLocaleString("vi-VN")}</span>
                <span>Cập nhật: {new Date(viewJob.updated_at).toLocaleString("vi-VN")}</span>
              </div>

              {viewJob.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1 bg-green-600 text-white hover:bg-green-700"
                    disabled={moderating}
                    onClick={() => handleApprove(viewJob.job_id)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {moderating ? "Đang xử lý..." : "Duyệt bài đăng"}
                  </Button>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    disabled={moderating}
                    onClick={() => {
                      setViewJob(null);
                      openRejectModal(viewJob);
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Từ chối
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewJob(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Từ chối bài đăng</DialogTitle>
            <DialogDescription aria-describedby={undefined}>
              Nhập lý do từ chối để thông báo cho nhà tuyển dụng.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {rejectError && (
              <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
                {rejectError}
              </div>
            )}
            {rejectTarget && (
              <div className="rounded-lg bg-gray-50 p-3 text-sm">
                <p className="font-semibold text-gray-900">{rejectTarget.job_title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {rejectTarget.company.company_name}
                </p>
              </div>
            )}
            <div>
              <Label>
                Lý do từ chối <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="VD: Nội dung vi phạm chính sách - spam từ khóa, không liên quan công việc"
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              disabled={rejecting}
              onClick={handleReject}
            >
              {rejecting ? "Đang xử lý..." : "Xác nhận từ chối"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
