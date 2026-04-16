import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Mail,
  Phone,
  Star,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  fetchApplicationDetail,
  updateApplicationStatus,
  scheduleInterview,
  type Application,
  type ApplicationStatus,
} from "../services/application.service";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Chờ xem", color: "text-yellow-700", bg: "bg-yellow-100" },
  reviewed: { label: "Đã xem", color: "text-blue-700", bg: "bg-blue-100" },
  shortlisted: { label: "Tiềm năng", color: "text-purple-700", bg: "bg-purple-100" },
  interviewed: { label: "Phỏng vấn", color: "text-indigo-700", bg: "bg-indigo-100" },
  offered: { label: "Đã đề nghị", color: "text-cyan-700", bg: "bg-cyan-100" },
  accepted: { label: "Chấp nhận", color: "text-green-700", bg: "bg-green-100" },
  rejected: { label: "Từ chối", color: "text-red-700", bg: "bg-red-100" },
  withdrawn: { label: "Rút hồ sơ", color: "text-gray-700", bg: "bg-gray-100" },
};

const STATUS_FLOW: ApplicationStatus[] = [
  "pending",
  "reviewed",
  "shortlisted",
  "interviewed",
  "offered",
  "accepted",
];

function getNextStatuses(current: ApplicationStatus): ApplicationStatus[] {
  const idx = STATUS_FLOW.indexOf(current);
  if (idx === -1) return [];
  const next: ApplicationStatus[] = [];
  if (idx < STATUS_FLOW.length - 1) next.push(STATUS_FLOW[idx + 1]);
  if (current !== "rejected" && current !== "accepted" && current !== "withdrawn") {
    next.push("rejected");
  }
  return next;
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className={`text-2xl transition-colors ${
            i <= value ? "text-amber-400" : "text-gray-200 hover:text-amber-300"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("reviewed");
  const [statusNote, setStatusNote] = useState("");
  const [statusRating, setStatusRating] = useState(0);
  const [rejectionReason, setRejectionReason] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewSchedule, setInterviewSchedule] = useState("");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [schedulingInterview, setSchedulingInterview] = useState(false);
  const [interviewError, setInterviewError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    const load = async () => {
      try {
        const data = await fetchApplicationDetail(parseInt(id));
        if (mounted) setApp(data);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Không tải được đơn ứng tuyển.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  const openStatusModal = (status: ApplicationStatus) => {
    setNewStatus(status);
    setStatusNote("");
    setStatusRating(app?.rating ?? 0);
    setRejectionReason("");
    setStatusError(null);
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    if (newStatus === "rejected" && !rejectionReason.trim()) {
      setStatusError("Vui lòng nhập lý do từ chối.");
      return;
    }
    setUpdatingStatus(true);
    setStatusError(null);
    try {
      const updated = await updateApplicationStatus(app!.application_id, {
        status: newStatus,
        note: statusNote || undefined,
        rating: statusRating || undefined,
        rejection_reason: newStatus === "rejected" ? rejectionReason : undefined,
      });
      setApp(updated);
      setShowStatusModal(false);
    } catch (e: any) {
      setStatusError(e?.message ?? "Có lỗi xảy ra.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleScheduleInterview = async () => {
    if (!interviewSchedule) {
      setInterviewError("Vui lòng chọn thời gian phỏng vấn.");
      return;
    }
    if (!interviewLocation.trim()) {
      setInterviewError("Vui lòng nhập địa điểm phỏng vấn.");
      return;
    }
    setSchedulingInterview(true);
    setInterviewError(null);
    try {
      const updated = await scheduleInterview(app!.application_id, {
        interview_schedule: interviewSchedule.replace("T", " ") + ":00",
        interview_location: interviewLocation,
      });
      setApp(updated);
      setShowInterviewModal(false);
    } catch (e: any) {
      setInterviewError(e?.message ?? "Có lỗi xảy ra.");
    } finally {
      setSchedulingInterview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">Đang tải...</div>
    );
  }

  if (error || !app) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-gray-500">
        <p>{error ?? "Không tìm thấy đơn ứng tuyển."}</p>
        <Button variant="outline" onClick={() => navigate("/employer/applications")}>
          Quay lại
        </Button>
      </div>
    );
  }

  const nextStatuses = getNextStatuses(app.status);
  const cfg = STATUS_CONFIG[app.status];

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/employer/applications")}
        className="gap-1 text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách
      </Button>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Candidate Info */}
        <div className="col-span-1 space-y-4">
          {/* Profile Card */}
          <Card className="border-2 border-blue-100">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-blue-600 text-2xl font-bold text-white">
                  {(app.full_name || app.name || "Ứ")[0]}
                </div>
                <h2 className="mt-3 text-lg font-bold text-gray-900">
                  {app.full_name || app.name}
                </h2>
                <Badge
                  className={`mt-2 ${cfg.bg} ${cfg.color} border-0`}
                >
                  {cfg.label}
                </Badge>
                {app.rating != null && (
                  <div className="mt-2 text-amber-400 text-lg">
                    {"★".repeat(app.rating)}{"☆".repeat(5 - app.rating)}
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                  <span className="truncate">{app.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>{app.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                  <a
                    href={app.cv_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Xem CV <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
                <p>Ứng tuyển: <span className="font-medium text-gray-700">{app.jobpost?.job_title ?? "—"}</span></p>
                <p className="mt-1">Ngày nộp: {new Date(app.applied_at).toLocaleDateString("vi-VN")}</p>
                {app.reviewed_at && (
                  <p className="mt-1">Đã xem: {new Date(app.reviewed_at).toLocaleDateString("vi-VN")}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {nextStatuses.length > 0 && (
            <Card className="border border-gray-200">
              <CardHeader className="border-b border-gray-100 pb-3">
                <h3 className="font-semibold text-gray-900 text-sm">Cập nhật trạng thái</h3>
              </CardHeader>
              <CardContent className="space-y-2 p-4">
                {nextStatuses.map((s) => (
                  <Button
                    key={s}
                    variant="outline"
                    size="sm"
                    className={`w-full justify-start ${
                      s === "rejected"
                        ? "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400"
                        : "border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                    }`}
                    onClick={() => openStatusModal(s)}
                  >
                    {s === "rejected" ? (
                      <XCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                    )}
                    Chuyển: {STATUS_CONFIG[s].label}
                  </Button>
                ))}
                {(app.status === "shortlisted" || app.status === "reviewed") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    onClick={() => {
                      setInterviewSchedule("");
                      setInterviewLocation("");
                      setInterviewError(null);
                      setShowInterviewModal(true);
                    }}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Lên lịch phỏng vấn
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Interview Info */}
          {app.interview_schedule && (
            <Card className="border border-indigo-200 bg-indigo-50">
              <CardContent className="p-4 text-sm">
                <h3 className="font-semibold text-indigo-800 mb-2 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Lịch phỏng vấn
                </h3>
                <p className="text-indigo-700">
                  {new Date(app.interview_schedule).toLocaleString("vi-VN")}
                </p>
                {app.interview_location && (
                  <p className="mt-1 text-indigo-600 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {app.interview_location}
                  </p>
                )}
                <Badge className="mt-2 bg-indigo-100 text-indigo-700 text-xs">
                  {app.interview_status === "scheduled" ? "Đã lên lịch" : app.interview_status}
                </Badge>
              </CardContent>
            </Card>
          )}

          {/* Rejection reason */}
          {app.rejection_reason && (
            <Card className="border border-red-200 bg-red-50">
              <CardContent className="p-4 text-sm">
                <h3 className="font-semibold text-red-800 mb-1">Lý do từ chối</h3>
                <p className="text-red-700">{app.rejection_reason}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Detail + Timeline */}
        <div className="col-span-2 space-y-4">
          {/* Cover Letter */}
          {app.cover_letter && (
            <Card className="border border-gray-200">
              <CardHeader className="border-b border-gray-100 bg-white py-4">
                <h3 className="font-semibold text-gray-900">Thư xin việc</h3>
              </CardHeader>
              <CardContent className="p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {app.cover_letter}
              </CardContent>
            </Card>
          )}

          {/* Note */}
          {app.note && (
            <Card className="border border-gray-200">
              <CardHeader className="border-b border-gray-100 bg-white py-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-400" />
                  Ghi chú nội bộ
                </h3>
              </CardHeader>
              <CardContent className="p-5 text-sm text-gray-700">{app.note}</CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card className="border border-gray-200">
            <CardHeader className="border-b border-gray-100 bg-white py-4">
              <h3 className="font-semibold text-gray-900">Lịch sử trạng thái</h3>
            </CardHeader>
            <CardContent className="p-5">
              {!app.timelines || app.timelines.length === 0 ? (
                <p className="text-sm text-gray-400">Chưa có lịch sử.</p>
              ) : (
                <div className="relative space-y-0">
                  {app.timelines.map((tl, idx) => {
                    const cfg = STATUS_CONFIG[tl.status] ?? {
                      label: tl.status,
                      color: "text-gray-700",
                      bg: "bg-gray-100",
                    };
                    const isLast = idx === app.timelines!.length - 1;
                    return (
                      <div key={idx} className="flex gap-4">
                        {/* Vertical line */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${cfg.bg}`}
                          >
                            {isLast ? (
                              <CheckCircle2 className={`h-4 w-4 ${cfg.color}`} />
                            ) : (
                              <Clock className={`h-4 w-4 ${cfg.color}`} />
                            )}
                          </div>
                          {!isLast && (
                            <div className="my-1 w-0.5 flex-1 bg-gray-200" />
                          )}
                        </div>
                        <div className={`pb-6 ${isLast ? "" : ""}`}>
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold text-sm ${cfg.color}`}>
                              {cfg.label}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(tl.changed_at).toLocaleString("vi-VN")}
                            </span>
                          </div>
                          {tl.note && (
                            <p className="mt-0.5 text-xs text-gray-500">{tl.note}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Update Status Modal */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Cập nhật trạng thái:{" "}
              <span className={STATUS_CONFIG[newStatus]?.color}>
                {STATUS_CONFIG[newStatus]?.label}
              </span>
            </DialogTitle>
            <DialogDescription aria-describedby={undefined}>
              Cập nhật trạng thái xử lý đơn ứng tuyển.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {statusError && (
              <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">{statusError}</div>
            )}

            <div>
              <Label>Đánh giá ứng viên</Label>
              <div className="mt-1">
                <StarRating value={statusRating} onChange={setStatusRating} />
              </div>
            </div>

            <div>
              <Label>Ghi chú nội bộ</Label>
              <Textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Ghi chú về ứng viên này..."
                rows={3}
                className="mt-1"
              />
            </div>

            {newStatus === "rejected" && (
              <div>
                <Label>
                  Lý do từ chối <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="VD: Kinh nghiệm chưa phù hợp với yêu cầu..."
                  rows={3}
                  className="mt-1"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusModal(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={updatingStatus}
              className={
                newStatus === "rejected"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }
            >
              {updatingStatus ? "Đang lưu..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Interview Modal */}
      <Dialog open={showInterviewModal} onOpenChange={setShowInterviewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Lên lịch phỏng vấn</DialogTitle>
            <DialogDescription aria-describedby={undefined}>
              Chọn thời gian và địa điểm phỏng vấn cho ứng viên.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {interviewError && (
              <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
                {interviewError}
              </div>
            )}
            <div>
              <Label>
                Thời gian phỏng vấn <span className="text-red-500">*</span>
              </Label>
              <Input
                type="datetime-local"
                value={interviewSchedule}
                onChange={(e) => setInterviewSchedule(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>
                Địa điểm phỏng vấn <span className="text-red-500">*</span>
              </Label>
              <Input
                value={interviewLocation}
                onChange={(e) => setInterviewLocation(e.target.value)}
                placeholder="VD: Tầng 3, 123 Đường ABC, Bình Dương"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInterviewModal(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleScheduleInterview}
              disabled={schedulingInterview}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {schedulingInterview ? "Đang lưu..." : "Xác nhận lịch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
