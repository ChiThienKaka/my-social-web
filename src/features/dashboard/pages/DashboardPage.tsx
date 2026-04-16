import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { PendingApprovalsList } from "@/features/dashboard/components/PendingApprovalsList";
import { RecentActionsList } from "@/features/dashboard/components/RecentActionsList";
import { TopPostsList } from "@/features/dashboard/components/TopPostsList";
import {
  PieChartComponent,
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

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500">Đang tải dữ liệu dashboard...</div>
        </div>
      </div>
    );
  }

  const statCards = overview
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
          value:
            revenue
              ? `${((revenue.total_revenue ?? 0) / 1_000_000).toFixed(1)}tr`
              : "—",
          change: 25.8,
          changeType: "increase" as const,
          icon: "posts",
          color: "emerald",
        },
      ]
    : [];

  const trendChartData = (trend || []).map((t) => ({
    name: t.date ? new Date(t.date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    }) : "—",
    count: t.count ?? 0,
  }));

  const revenueChartData =
    revenue?.by_package?.map((p) => ({
      name: p.package_name || "N/A",
      value: (p.revenue ?? 0) / 1_000_000,
      count: p.count ?? 0,
    })) ?? [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tổng quan hệ thống</h1>
        <p className="mt-1 text-sm text-gray-600">
          Theo dõi các chỉ số và hoạt động quan trọng của hệ thống
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Trend Line Chart */}
        {trend.length > 0 && (
          <Card>
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

        {/* Revenue by Package */}
        {revenueChartData.length > 0 && (
          <Card>
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

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Job Posts by Category Column Chart */}
        <Card>
          <CardContent className="p-6">
            <ColumnChartComponent
              data={jobPostsByCategory}
              title="Bài đăng theo danh mục"
              dataKey="value"
              color="#3b82f6"
            />
          </CardContent>
        </Card>

        {/* Activity by Day Line Chart */}
        <Card>
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

      {/* Bottom Row - Lists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pending Approvals */}
        <PendingApprovalsList approvals={pendingApprovals.slice(0, 5)} />

        {/* Recent Actions */}
        <RecentActionsList actions={recentActions.slice(0, 5)} />

        {/* Top Posts */}
        <TopPostsList posts={topPosts.slice(0, 5)} />
      </div>
    </div>
  );
}
