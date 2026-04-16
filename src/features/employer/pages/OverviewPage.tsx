import { useEffect, useState } from "react";
import { TrendingUp, Users, Briefcase, FileText, ArrowRight, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  fetchDashboardOverview,
  type DashboardOverview,
} from "../services/recruiter.service";
import {
  fetchApplications,
  type Application,
} from "../services/application.service";
import {
  fetchJobPosts,
  type JobPost,
} from "../services/job-post.service";

const STATUS_COLORS: Record<string, string> = {
  pending: "border-yellow-500 text-yellow-600 bg-yellow-50",
  reviewed: "border-blue-500 text-blue-600 bg-blue-50",
  shortlisted: "border-purple-500 text-purple-600 bg-purple-50",
  interviewed: "border-indigo-500 text-indigo-600 bg-indigo-50",
  offered: "border-green-500 text-green-600 bg-green-50",
  accepted: "border-emerald-500 text-emerald-600 bg-emerald-50",
  rejected: "border-red-500 text-red-600 bg-red-50",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xem",
  reviewed: "Đã xem",
  shortlisted: "Tiềm năng",
  interviewed: "Phỏng vấn",
  offered: "Đề nghị",
  accepted: "Chấp nhận",
  rejected: "Từ chối",
};

const JOB_STATUS_COLORS: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  draft: "bg-gray-100 text-gray-700",
};

const JOB_STATUS_LABELS: Record<string, string> = {
  approved: "Đã duyệt",
  pending: "Chờ duyệt",
  rejected: "Từ chối",
  draft: "Nháp",
};

export function OverviewPage() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [activeJobs, setActiveJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [ov, apps, jobs] = await Promise.all([
          fetchDashboardOverview(),
          fetchApplications({ per_page: 5 }),
          fetchJobPosts({ status: "approved", per_page: 5 }),
        ]);
        if (mounted) {
          setOverview(ov);
          setRecentApps(apps.data);
          setActiveJobs(jobs.data);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  const stats = overview
    ? [
        {
          label: "Tổng bài đăng",
          value: overview.total_job_posts,
          sub: `${overview.posts_by_status.approved} đã duyệt`,
          icon: <Briefcase className="h-6 w-6 text-blue-600" />,
          bg: "bg-blue-50",
        },
        {
          label: "Tổng đơn ứng tuyển",
          value: overview.total_applications,
          sub: `${overview.pending_applications} chưa xem`,
          icon: <FileText className="h-6 w-6 text-green-600" />,
          bg: "bg-green-50",
        },
        {
          label: "Đơn chưa xem",
          value: overview.pending_applications,
          sub: "Cần xử lý",
          icon: <Users className="h-6 w-6 text-purple-600" />,
          bg: "bg-purple-50",
        },
        {
          label: "Bài sắp hết hạn",
          value: overview.expiring_soon_posts,
          sub: "Trong 7 ngày tới",
          icon: <Clock className="h-6 w-6 text-orange-600" />,
          bg: "bg-orange-50",
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <Card className="border-2 border-blue-100 bg-linear-to-r from-blue-50 to-white">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Xin chào! 👋</h2>
            <p className="mt-1 text-gray-600">
              Tổng quan hoạt động tuyển dụng của bạn hôm nay
            </p>
          </div>
          <Button
            className="bg-linear-to-r from-blue-600 to-blue-700"
            onClick={() => navigate("/employer/jobs")}
          >
            Đăng tin tuyển dụng
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border border-gray-200 transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="mt-1 text-xs text-gray-500">{stat.sub}</p>
                </div>
                <div className={`rounded-lg p-3 ${stat.bg}`}>{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status breakdown */}
      {overview && (
        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200 bg-white">
            <h3 className="text-lg font-bold text-gray-900">Phân loại bài đăng theo trạng thái</h3>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(overview.posts_by_status).map(([status, count]) => (
                <div
                  key={status}
                  className="flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50 p-4"
                >
                  <span className="text-3xl font-bold text-gray-900">{count}</span>
                  <Badge className={`mt-2 ${JOB_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700"}`}>
                    {JOB_STATUS_LABELS[status] ?? status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Two column */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Đơn ứng tuyển gần đây</h3>
              <Button variant="outline" size="sm" onClick={() => navigate("/employer/applications")}>
                Xem tất cả
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentApps.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-gray-400 text-sm">
                Chưa có đơn ứng tuyển
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentApps.map((app) => {
                  const displayName = app.full_name || app.name || "Ứng viên";
                  return (
                    <div
                      key={app.application_id}
                      className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-gray-50"
                      onClick={() =>
                        navigate(`/employer/applications/${app.application_id}`)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                          {displayName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {displayName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {app.jobpost.job_title}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${STATUS_COLORS[app.status] ?? ""}`}
                      >
                        {STATUS_LABELS[app.status] ?? app.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Jobs */}
        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Bài đăng đang hoạt động</h3>
              <Button variant="outline" size="sm" onClick={() => navigate("/employer/jobs")}>
                Quản lý
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {activeJobs.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-gray-400 text-sm">
                Chưa có bài đăng nào được duyệt
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {activeJobs.map((job) => (
                  <div key={job.job_id} className="p-4 transition-colors hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{job.job_title}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {job.application_count} đơn
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {job.view_count} lượt xem
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2 shrink-0 text-xs"
                        onClick={() => navigate("/employer/jobs")}
                      >
                        Quản lý
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-200 bg-white">
          <h3 className="text-lg font-bold text-gray-900">Thao tác nhanh</h3>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 border-2 hover:border-blue-600 hover:bg-blue-50"
              onClick={() => navigate("/employer/jobs")}
            >
              <Briefcase className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium">Đăng tin mới</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 border-2 hover:border-green-600 hover:bg-green-50"
              onClick={() => navigate("/employer/applications")}
            >
              <Users className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium">Xem ứng viên</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 border-2 hover:border-purple-600 hover:bg-purple-50"
              onClick={() => navigate("/employer/profile")}
            >
              <FileText className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium">Hồ sơ công ty</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 border-2 hover:border-orange-600 hover:bg-orange-50"
              onClick={() => navigate("/employer/subscription")}
            >
              <AlertCircle className="h-6 w-6 text-orange-600" />
              <span className="text-sm font-medium">Gói đăng ký</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
