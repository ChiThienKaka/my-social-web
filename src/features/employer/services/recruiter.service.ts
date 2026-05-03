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

/** Hồ sơ recruiter (avatar, tên) — đổi path nếu backend dùng khác, ví dụ /auth/me */
export interface RecruiterSessionProfile {
  avatar_url?: string | null;
  full_name?: string | null;
}

export async function fetchRecruiterSessionProfile(): Promise<RecruiterSessionProfile | null> {
  try {
    const res = await http.get<{ data: RecruiterSessionProfile & Record<string, unknown> }>(
      "/recruiter/profile",
    );
    const raw = (res as { data?: unknown }).data;
    if (!raw || typeof raw !== "object") return null;
    const d = raw as Record<string, unknown>;
    const nested =
      d.user && typeof d.user === "object" ? (d.user as Record<string, unknown>) : null;
    const avatar_url =
      (d.avatar_url as string | null | undefined) ??
      (nested?.avatar_url as string | null | undefined) ??
      null;
    const full_name =
      (d.full_name as string | null | undefined) ??
      (nested?.full_name as string | null | undefined) ??
      null;
    if (avatar_url == null && full_name == null) return null;
    return { avatar_url, full_name };
  } catch {
    return null;
  }
}

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
