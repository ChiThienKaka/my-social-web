import http from "@/lib/http";

export interface AdminDashboardOverview {
  total_users: number;
  total_companies: number;
  total_job_posts: number;
  total_applications: number;
  pending_companies: number;
  pending_job_posts: number;
  active_subscriptions: number;
}

export interface RevenueData {
  period: string;
  total_revenue: number;
  by_package: Array<{
    package_name: string;
    revenue: number;
    count: number;
  }>;
}

export interface TrendData {
  date: string;
  count: number;
}

const MOCK_OVERVIEW: AdminDashboardOverview = {
  total_users: 12458,
  total_companies: 345,
  total_job_posts: 892,
  total_applications: 1892,
  pending_companies: 23,
  pending_job_posts: 15,
  active_subscriptions: 287,
};

const MOCK_REVENUE: RevenueData = {
  period: "2026-03",
  total_revenue: 143500000,
  by_package: [
    { package_name: "Gói Cơ Bản", revenue: 50000000, count: 100 },
    { package_name: "Gói Nâng Cao", revenue: 60000000, count: 60 },
    { package_name: "Gói Cao Cấp", revenue: 33500000, count: 27 },
  ],
};

const MOCK_TREND: TrendData[] = [
  { date: "2026-02-25", count: 12 },
  { date: "2026-02-26", count: 15 },
  { date: "2026-02-27", count: 18 },
  { date: "2026-02-28", count: 14 },
  { date: "2026-03-01", count: 20 },
  { date: "2026-03-02", count: 22 },
  { date: "2026-03-03", count: 17 },
  { date: "2026-03-04", count: 19 },
  { date: "2026-03-05", count: 25 },
  { date: "2026-03-06", count: 23 },
  { date: "2026-03-07", count: 21 },
  { date: "2026-03-08", count: 24 },
  { date: "2026-03-09", count: 18 },
  { date: "2026-03-10", count: 26 },
  { date: "2026-03-11", count: 28 },
  { date: "2026-03-12", count: 22 },
  { date: "2026-03-13", count: 20 },
  { date: "2026-03-14", count: 24 },
  { date: "2026-03-15", count: 27 },
  { date: "2026-03-16", count: 19 },
  { date: "2026-03-17", count: 21 },
  { date: "2026-03-18", count: 23 },
  { date: "2026-03-19", count: 25 },
  { date: "2026-03-20", count: 29 },
  { date: "2026-03-21", count: 31 },
  { date: "2026-03-22", count: 28 },
  { date: "2026-03-23", count: 26 },
  { date: "2026-03-24", count: 30 },
  { date: "2026-03-25", count: 32 },
  { date: "2026-03-26", count: 27 },
];

export async function fetchAdminDashboardOverview(): Promise<AdminDashboardOverview> {
  try {
    const res: any = await http.get("/admin/dashboard/overview");
    // Handle both { data: ... } and direct response
    return res.data || res;
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    return MOCK_OVERVIEW;
  }
}

export async function fetchAdminRevenue(
  period?: string,
): Promise<RevenueData> {
  try {
    const res: any = await http.get("/admin/dashboard/revenue", {
      params: period ? { period } : undefined,
    });
    return res.data || res;
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    return MOCK_REVENUE;
  }
}

export async function fetchAdminTrend(): Promise<TrendData[]> {
  try {
    const res: any = await http.get("/admin/dashboard/trend");
    return res.data || res;
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    return MOCK_TREND;
  }
}
