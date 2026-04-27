import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { PendingApprovalsList } from "@/features/dashboard/components/PendingApprovalsList";
import { RecentActionsList } from "@/features/dashboard/components/RecentActionsList";
import { TopPostsList } from "@/features/dashboard/components/TopPostsList";
import {
  LineChartComponent,
  ColumnChartComponent,
} from "@/features/dashboard/components/Charts";
import {
  pendingApprovals,
  recentActions,
  topPosts,
  jobPostsByCategory,
  activityByDay,
} from "../data/mockData";
import {
  fetchAdminDashboardOverview,
  fetchAdminRevenue,
  fetchAdminTrend,
  type AdminDashboardOverview,
  type RevenueData,
  type TrendData,
} from "../services/admin-dashboard.service";

export function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [overview, setOverview] = useState<AdminDashboardOverview | null>(null);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [trend, setTrend] = useState<TrendData[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [ov, rev, tr] = await Promise.all([
          fetchAdminDashboardOverview(),
          fetchAdminRevenue("month"),
          fetchAdminTrend(),
        ]);
        if (mounted) {
          setOverview(ov);
          setRevenue(rev);
          setTrend(tr);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const statCards = useMemo(
    () =>
      overview
        ? [
            {
              title: "Tổng người dùng",
              value: (overview.total_users ?? 0).toLocaleString(),
              change: 12.5,
              changeType: "increase" as const,
              icon: "users",
              color: "blue",
            },
            {
              title: "Tổng công ty",
              value: (overview.total_companies ?? 0).toLocaleString(),
              change: 8.2,
              changeType: "increase" as const,
              icon: "posts",
              color: "green",
            },
            {
              title: "Công ty chờ duyệt",
              value: (overview.pending_companies ?? 0).toLocaleString(),
              change: -5.3,
              changeType: "decrease" as const,
              icon: "pending",
              color: "orange",
            },
            {
              title: "Bài đăng tuyển dụng",
              value: (overview.total_job_posts ?? 0).toLocaleString(),
              change: 15.7,
              changeType: "increase" as const,
              icon: "applications",
              color: "purple",
            },
            {
              title: "Bài đăng chờ duyệt",
              value: (overview.pending_job_posts ?? 0).toLocaleString(),
              change: -10.2,
              changeType: "decrease" as const,
              icon: "pending",
              color: "red",
            },
            {
              title: "Đơn ứng tuyển",
              value: (overview.total_applications ?? 0).toLocaleString(),
              change: 22.3,
              changeType: "increase" as const,
              icon: "applications",
              color: "cyan",
            },
            {
              title: "Gói đang hoạt động",
              value: (overview.active_subscriptions ?? 0).toLocaleString(),
              change: 18.5,
              changeType: "increase" as const,
              icon: "users",
              color: "indigo",
            },
            {
              title: "Doanh thu tháng",
              value: revenue
                ? `${((revenue.total_revenue ?? 0) / 1_000_000).toFixed(1)}tr`
                : "—",
              change: 25.8,
              changeType: "increase" as const,
              icon: "posts",
              color: "emerald",
            },
          ]
        : [],
    [overview, revenue]
  );

  const trendChartData = useMemo(
    () =>
      (trend || []).map((t) => ({
        name: t.date
          ? new Date(t.date).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
            })
          : "—",
        value: t.count ?? 0,
        count: t.count ?? 0,
      })),
    [trend]
  );

  const revenueChartData = useMemo(
    () =>
      revenue?.by_package?.map((p) => ({
        name: p.package_name || "N/A",
        value: (p.revenue ?? 0) / 1_000_000,
        count: p.count ?? 0,
      })) ?? [],
    [revenue]
  );

  if (isLoading) {
    return (
      <div className="space-y-6 p-1">
        <Card className="border-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-sm">
          <CardContent className="p-6">
            <div className="h-6 w-48 animate-pulse rounded bg-white/20" />
            <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-white/15" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={`dashboard-skeleton-${index}`} className="border-border/70">
              <CardContent className="p-5">
                <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-7 w-20 animate-pulse rounded bg-slate-200" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      <Card className="border-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg">
        <CardContent className="flex flex-col gap-2 p-6 md:p-7">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Tổng quan hệ thống
          </h1>
          <p className="text-sm text-slate-200">
            Theo dõi các chỉ số quan trọng, hiệu suất nội dung và hoạt động hệ
            thống trong thời gian thực.
          </p>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Chỉ số chính</h2>
          <p className="text-sm text-slate-500">
            Tóm tắt nhanh các số liệu cốt lõi của nền tảng.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Phân tích doanh thu và xu hướng
          </h2>
          <p className="text-sm text-slate-500">
            Theo dõi biến động bài đăng mới và đóng góp doanh thu theo gói.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {trend.length > 0 && (
            <Card className="border-border/70 shadow-sm">
              <CardContent className="p-6">
                <LineChartComponent
                  data={trendChartData}
                  title="Xu hướng bài đăng mới (30 ngày)"
                  dataKeys={["count"]}
                  colors={["#3b82f6"]}
                />
              </CardContent>
            </Card>
          )}

          {revenueChartData.length > 0 && (
            <Card className="border-border/70 shadow-sm">
              <CardContent className="p-6">
                <ColumnChartComponent
                  data={revenueChartData}
                  title="Doanh thu theo gói (triệu VNĐ)"
                  dataKey="value"
                  color="#10b981"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Phân tích hành vi</h2>
          <p className="text-sm text-slate-500">
            Nắm bắt xu hướng nội dung theo danh mục và mức độ tương tác mỗi ngày.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card className="border-border/70 shadow-sm">
            <CardContent className="p-6">
              <ColumnChartComponent
                data={jobPostsByCategory}
                title="Bài đăng theo danh mục"
                dataKey="value"
                color="#3b82f6"
              />
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-sm">
            <CardContent className="p-6">
              <LineChartComponent
                data={activityByDay}
                title="Hoạt động theo ngày"
                dataKeys={["posts", "comments", "reports"]}
                colors={["#3b82f6", "#10b981", "#f59e0b"]}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Danh sách theo dõi</h2>
          <p className="text-sm text-slate-500">
            Các mục cần xử lý, hoạt động gần đây và bài viết nổi bật.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
          <PendingApprovalsList approvals={pendingApprovals.slice(0, 5)} />
          <RecentActionsList actions={recentActions.slice(0, 5)} />
          <TopPostsList posts={topPosts.slice(0, 5)} />
        </div>
      </section>
    </div>
  );
}
