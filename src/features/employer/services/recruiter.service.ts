import http from "@/lib/http";

export interface DashboardOverview {
  total_job_posts: number;
  posts_by_status: {
    pending: number;
    approved: number;
    rejected: number;
    draft: number;
  };
  total_applications: number;
  pending_applications: number;
  expiring_soon_posts: number;
}

const MOCK_OVERVIEW: DashboardOverview = {
  total_job_posts: 12,
  posts_by_status: {
    pending: 2,
    approved: 8,
    rejected: 1,
    draft: 1,
  },
  total_applications: 47,
  pending_applications: 10,
  expiring_soon_posts: 3,
};

export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  try {
    const res = await http.get<{ data: DashboardOverview }>(
      "/recruiter/dashboard/overview",
    );
    return (res as any).data;
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    return MOCK_OVERVIEW;
  }
}
