import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Trash2,
  Edit2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Users,
} from "lucide-react";
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
import {
  fetchJobPosts,
  createJobPost,
  updateJobPost,
  deleteJobPost,
  refreshJobPost,
  type JobPost,
  type CreateJobPostPayload,
} from "../services/job-post.service";

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  approved: { label: "Đã duyệt", class: "bg-green-100 text-green-700 border-green-200" },
  pending: { label: "Chờ duyệt", class: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  rejected: { label: "Từ chối", class: "bg-red-100 text-red-700 border-red-200" },
  draft: { label: "Nháp", class: "bg-gray-100 text-gray-700 border-gray-200" },
};

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: "Toàn thời gian",
  part_time: "Bán thời gian",
  contract: "Hợp đồng",
  internship: "Thực tập",
  freelance: "Freelance",
};

const WORK_MODE_LABELS: Record<string, string> = {
  onsite: "Tại văn phòng",
  remote: "Từ xa",
  hybrid: "Kết hợp",
};

const defaultForm: CreateJobPostPayload = {
  job_title: "",
  job_description: "",
  requirements: "",
  benefits: "",
  job_type: "full_time",
  salary_min: undefined,
  salary_max: undefined,
  salary_type: "range",
  experience_level: "",
  education_level: "",
  number_of_positions: 1,
  work_mode: "onsite",
  gender_requirement: "any",
  location_province: "",
  location_district: "",
  location_address: "",
  application_deadline: "",
  contact_email: "",
  contact_phone: "",
  contact_person: "",
  category_id: 1,
};

function formatSalary(min?: string, max?: string, type?: string) {
  if (type === "negotiable") return "Thương lượng";
  if (!min && !max) return "Thương lượng";
  const fmt = (v: string) =>
    `${(parseInt(v) / 1_000_000).toFixed(0)}tr`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `Từ ${fmt(min)}`;
  return `Đến ${fmt(max!)}`;
}

export function JobsPage() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editJob, setEditJob] = useState<JobPost | null>(null);
  const [form, setForm] = useState<CreateJobPostPayload>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<JobPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [refreshing, setRefreshing] = useState<number | null>(null);

  const [viewJob, setViewJob] = useState<JobPost | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchJobPosts({
        page,
        per_page: 10,
        keyword: keyword || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setJobs(res.data);
      setTotal(res.total);
      setTotalPages(res.total_pages);
    } finally {
      setLoading(false);
    }
  }, [page, keyword, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditJob(null);
    setForm(defaultForm);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (job: JobPost) => {
    setEditJob(job);
    setForm({
      job_title: job.job_title,
      job_description: job.job_description ?? "",
      requirements: job.requirements ?? "",
      benefits: job.benefits ?? "",
      job_type: job.job_type,
      salary_min: job.salary_min ? parseInt(job.salary_min) : undefined,
      salary_max: job.salary_max ? parseInt(job.salary_max) : undefined,
      salary_type: job.salary_type,
      experience_level: job.experience_level ?? "",
      education_level: job.education_level ?? "",
      number_of_positions: job.number_of_positions ?? 1,
      work_mode: job.work_mode ?? "onsite",
      gender_requirement: job.gender_requirement ?? "any",
      location_province: job.location_province,
      location_district: job.location_district ?? "",
      location_address: job.location_address ?? "",
      application_deadline: job.application_deadline,
      contact_email: job.contact_email ?? "",
      contact_phone: job.contact_phone ?? "",
      contact_person: job.contact_person ?? "",
      category_id: job.category_id ?? 1,
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.job_title.trim()) {
      setFormError("Tiêu đề bài đăng là bắt buộc.");
      return;
    }
    if (!form.job_description.trim()) {
      setFormError("Mô tả công việc là bắt buộc.");
      return;
    }
    if (!form.location_province.trim()) {
      setFormError("Tỉnh/thành phố là bắt buộc.");
      return;
    }
    if (!form.application_deadline) {
      setFormError("Hạn nộp hồ sơ là bắt buộc.");
      return;
    }
    if (!form.contact_email.trim()) {
      setFormError("Email liên hệ là bắt buộc.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      if (editJob) {
        await updateJobPost(editJob.job_id, form);
      } else {
        await createJobPost(form);
      }
      setShowForm(false);
      setPage(1);
      load();
    } catch (e: any) {
      setFormError(e?.message ?? "Có lỗi xảy ra.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteJobPost(deleteTarget.job_id);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  const handleRefresh = async (job: JobPost) => {
    setRefreshing(job.job_id);
    try {
      await refreshJobPost(job.job_id);
      load();
    } catch (e: any) {
      alert(e?.message ?? "Không thể làm mới bài đăng.");
    } finally {
      setRefreshing(null);
    }
  };

  const handleSearch = () => {
    setKeyword(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý bài đăng tuyển dụng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tổng <span className="font-semibold text-blue-600">{total}</span> bài đăng
          </p>
        </div>
        <Button
          className="bg-linear-to-r from-blue-600 to-blue-700 text-white"
          onClick={openCreate}
        >
          <Plus className="mr-2 h-4 w-4" />
          Đăng tin mới
        </Button>
      </div>

      {/* Filters */}
      <Card className="border border-gray-200">
        <CardContent className="flex gap-3 p-4">
          <div className="flex flex-1 gap-2">
            <Input
              placeholder="Tìm theo tiêu đề bài đăng..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="max-w-xs"
            />
            <Button variant="outline" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => { setStatusFilter(v); setPage(1); }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="draft">Nháp</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
              <SelectItem value="approved">Đã duyệt</SelectItem>
              <SelectItem value="rejected">Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border border-gray-200">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-48 items-center justify-center text-gray-400">Đang tải...</div>
          ) : jobs.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3 text-gray-400">
              <Briefcase className="h-10 w-10 opacity-30" />
              <p>Chưa có bài đăng nào</p>
              <Button variant="outline" onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo bài đăng đầu tiên
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {jobs.map((job) => (
                <div key={job.job_id} className="flex items-start gap-4 p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{job.job_title}</h3>
                      <Badge
                        variant="outline"
                        className={`text-xs ${STATUS_CONFIG[job.status]?.class}`}
                      >
                        {STATUS_CONFIG[job.status]?.label ?? job.status}
                      </Badge>
                      {job.is_featured && (
                        <Badge className="bg-amber-100 text-amber-700 text-xs">Nổi bật</Badge>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" />
                        {JOB_TYPE_LABELS[job.job_type] ?? job.job_type}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location_province}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5" />
                        {formatSalary(job.salary_min, job.salary_max, job.salary_type)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Hết hạn: {job.application_deadline}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {job.application_count} đơn • {job.view_count} lượt xem
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      title="Xem chi tiết"
                      onClick={() => setViewJob(job)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(job.status === "draft" || job.status === "pending" || job.status === "rejected") && (
                      <Button
                        variant="outline"
                        size="sm"
                        title="Chỉnh sửa"
                        onClick={() => openEdit(job)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                    {job.status === "approved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        title="Làm mới bài đăng"
                        disabled={refreshing === job.job_id}
                        onClick={() => handleRefresh(job)}
                        className="text-blue-600 hover:border-blue-600 hover:bg-blue-50"
                      >
                        <RefreshCw className={`h-4 w-4 ${refreshing === job.job_id ? "animate-spin" : ""}`} />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      title="Xóa"
                      className="text-red-500 hover:border-red-500 hover:bg-red-50"
                      onClick={() => { setDeleteTarget(job); setShowDeleteConfirm(true); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

      {/* Create / Edit Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editJob ? "Chỉnh sửa bài đăng" : "Tạo bài đăng mới"}
            </DialogTitle>
            <DialogDescription aria-describedby={undefined}>
              {editJob ? "Cập nhật thông tin bài đăng tuyển dụng." : "Điền thông tin để tạo bài đăng tuyển dụng mới."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {formError && (
              <div className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Tiêu đề bài đăng *</Label>
                <Input
                  value={form.job_title}
                  onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                  placeholder="VD: Lập trình viên Backend PHP"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Loại công việc *</Label>
                <Select
                  value={form.job_type}
                  onValueChange={(v) => setForm({ ...form, job_type: v as any })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Toàn thời gian</SelectItem>
                    <SelectItem value="part_time">Bán thời gian</SelectItem>
                    <SelectItem value="contract">Hợp đồng</SelectItem>
                    <SelectItem value="internship">Thực tập</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Hình thức làm việc</Label>
                <Select
                  value={form.work_mode ?? "onsite"}
                  onValueChange={(v) => setForm({ ...form, work_mode: v as any })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onsite">Tại văn phòng</SelectItem>
                    <SelectItem value="remote">Từ xa (Remote)</SelectItem>
                    <SelectItem value="hybrid">Kết hợp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tỉnh/Thành phố *</Label>
                <Input
                  value={form.location_province}
                  onChange={(e) => setForm({ ...form, location_province: e.target.value })}
                  placeholder="VD: Bình Dương"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Quận/Huyện</Label>
                <Input
                  value={form.location_district ?? ""}
                  onChange={(e) => setForm({ ...form, location_district: e.target.value })}
                  placeholder="VD: Thủ Dầu Một"
                  className="mt-1"
                />
              </div>

              <div className="col-span-2">
                <Label>Địa chỉ cụ thể</Label>
                <Input
                  value={form.location_address ?? ""}
                  onChange={(e) => setForm({ ...form, location_address: e.target.value })}
                  placeholder="VD: 123 Đường ABC, Phường XYZ"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Kiểu lương</Label>
                <Select
                  value={form.salary_type ?? "range"}
                  onValueChange={(v) => setForm({ ...form, salary_type: v as any })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="range">Khoảng lương</SelectItem>
                    <SelectItem value="fixed">Cố định</SelectItem>
                    <SelectItem value="negotiable">Thương lượng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.salary_type !== "negotiable" && (
                <>
                  <div>
                    <Label>Lương tối thiểu (VNĐ)</Label>
                    <Input
                      type="number"
                      value={form.salary_min ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, salary_min: e.target.value ? parseInt(e.target.value) : undefined })
                      }
                      placeholder="VD: 10000000"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Lương tối đa (VNĐ)</Label>
                    <Input
                      type="number"
                      value={form.salary_max ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, salary_max: e.target.value ? parseInt(e.target.value) : undefined })
                      }
                      placeholder="VD: 20000000"
                      className="mt-1"
                    />
                  </div>
                </>
              )}

              <div>
                <Label>Hạn nộp hồ sơ *</Label>
                <Input
                  type="date"
                  value={form.application_deadline}
                  onChange={(e) => setForm({ ...form, application_deadline: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Số lượng tuyển</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.number_of_positions ?? 1}
                  onChange={(e) =>
                    setForm({ ...form, number_of_positions: parseInt(e.target.value) || 1 })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Kinh nghiệm yêu cầu</Label>
                <Input
                  value={form.experience_level ?? ""}
                  onChange={(e) => setForm({ ...form, experience_level: e.target.value })}
                  placeholder="VD: 2 năm"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Trình độ học vấn</Label>
                <Input
                  value={form.education_level ?? ""}
                  onChange={(e) => setForm({ ...form, education_level: e.target.value })}
                  placeholder="VD: Cao đẳng trở lên"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Email liên hệ *</Label>
                <Input
                  type="email"
                  value={form.contact_email}
                  onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                  placeholder="VD: hr@company.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Số điện thoại liên hệ</Label>
                <Input
                  value={form.contact_phone ?? ""}
                  onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                  placeholder="VD: 0901234567"
                  className="mt-1"
                />
              </div>

              <div className="col-span-2">
                <Label>Người liên hệ</Label>
                <Input
                  value={form.contact_person ?? ""}
                  onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                  placeholder="VD: Ms. Hương"
                  className="mt-1"
                />
              </div>

              <div className="col-span-2">
                <Label>Mô tả công việc *</Label>
                <Textarea
                  value={form.job_description}
                  onChange={(e) => setForm({ ...form, job_description: e.target.value })}
                  placeholder="Mô tả chi tiết công việc..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="col-span-2">
                <Label>Yêu cầu ứng viên</Label>
                <Textarea
                  value={form.requirements ?? ""}
                  onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                  placeholder="Yêu cầu kỹ năng, kinh nghiệm..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div className="col-span-2">
                <Label>Quyền lợi</Label>
                <Textarea
                  value={form.benefits ?? ""}
                  onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                  placeholder="Thưởng, bảo hiểm, du lịch..."
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {submitting
                ? "Đang lưu..."
                : editJob
                ? "Cập nhật"
                : "Đăng tin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa bài đăng</DialogTitle>
            <DialogDescription aria-describedby={undefined}>
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Bạn có chắc muốn xóa bài đăng{" "}
            <span className="font-semibold">"{deleteTarget?.job_title}"</span>? Hành động này không thể hoàn tác.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Detail Dialog */}
      <Dialog open={!!viewJob} onOpenChange={(o) => !o && setViewJob(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết bài đăng</DialogTitle>
            <DialogDescription aria-describedby={undefined}>
              Thông tin chi tiết về bài đăng tuyển dụng.
            </DialogDescription>
          </DialogHeader>
          {viewJob && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900">{viewJob.job_title}</h2>
                <Badge
                  variant="outline"
                  className={STATUS_CONFIG[viewJob.status]?.class}
                >
                  {STATUS_CONFIG[viewJob.status]?.label}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-4">
                <div>
                  <p className="text-xs text-gray-400">Loại hình</p>
                  <p className="font-medium">{JOB_TYPE_LABELS[viewJob.job_type]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Làm việc</p>
                  <p className="font-medium">{WORK_MODE_LABELS[viewJob.work_mode ?? ""] ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Địa điểm</p>
                  <p className="font-medium">{viewJob.location_province}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Mức lương</p>
                  <p className="font-medium">{formatSalary(viewJob.salary_min, viewJob.salary_max, viewJob.salary_type)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Hạn nộp</p>
                  <p className="font-medium">{viewJob.application_deadline}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Số lượng</p>
                  <p className="font-medium">{viewJob.number_of_positions ?? "-"}</p>
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
              {viewJob.job_description && (
                <div>
                  <p className="font-semibold text-gray-700">Mô tả công việc</p>
                  <p className="mt-1 text-gray-600 whitespace-pre-line">{viewJob.job_description}</p>
                </div>
              )}
              {viewJob.requirements && (
                <div>
                  <p className="font-semibold text-gray-700">Yêu cầu</p>
                  <p className="mt-1 text-gray-600 whitespace-pre-line">{viewJob.requirements}</p>
                </div>
              )}
              {viewJob.benefits && (
                <div>
                  <p className="font-semibold text-gray-700">Quyền lợi</p>
                  <p className="mt-1 text-gray-600 whitespace-pre-line">{viewJob.benefits}</p>
                </div>
              )}
              <div className="rounded-lg bg-blue-50 p-3">
                <p className="font-semibold text-gray-700 mb-1">Thông tin liên hệ</p>
                <p>Email: {viewJob.contact_email}</p>
                {viewJob.contact_phone && <p>SĐT: {viewJob.contact_phone}</p>}
                {viewJob.contact_person && <p>Người liên hệ: {viewJob.contact_person}</p>}
              </div>
            </div>
          )}
          <DialogFooter>
            {viewJob &&
              (viewJob.status === "draft" ||
                viewJob.status === "pending" ||
                viewJob.status === "rejected") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewJob(null);
                    openEdit(viewJob);
                  }}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </Button>
              )}
            <Button onClick={() => setViewJob(null)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
