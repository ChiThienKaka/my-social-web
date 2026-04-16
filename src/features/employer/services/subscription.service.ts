import http from "@/lib/http";

export interface SubscriptionPackage {
  package_id: number;
  package_name: string;
  price: string;
  duration_days: number;
  post_limit: number;
  featured_posts_limit: number;
  refresh_limit: number;
  support_priority: string;
  features: string;
}

export interface Subscription {
  subscription_id: number;
  status: "active" | "expired" | "cancelled";
  start_date: string;
  end_date: string;
  package: SubscriptionPackage;
}

const MOCK_ACTIVE: Subscription = {
  subscription_id: 2,
  status: "active",
  start_date: "2026-03-01",
  end_date: "2026-05-31",
  package: {
    package_id: 1,
    package_name: "Gói Cơ Bản",
    price: "500000.00",
    duration_days: 90,
    post_limit: 10,
    featured_posts_limit: 2,
    refresh_limit: 5,
    support_priority: "normal",
    features:
      "10 bài đăng tuyển dụng, 2 bài nổi bật, Làm mới 5 lần/tháng, Hỗ trợ thường, Xem hồ sơ ứng viên không giới hạn",
  },
};

const MOCK_HISTORY: Subscription[] = [
  {
    subscription_id: 1,
    status: "expired",
    start_date: "2025-12-01",
    end_date: "2026-02-28",
    package: {
      package_id: 1,
      package_name: "Gói Cơ Bản",
      price: "500000.00",
      duration_days: 90,
      post_limit: 10,
      featured_posts_limit: 2,
      refresh_limit: 5,
      support_priority: "normal",
      features: "10 bài đăng tuyển dụng",
    },
  },
  MOCK_ACTIVE,
];

export async function fetchActiveSubscription(): Promise<Subscription | null> {
  try {
    const res = await http.get<{ data: Subscription | null }>(
      "/recruiter/subscription",
    );
    return (res as any).data ?? null;
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    return MOCK_ACTIVE;
  }
}

export async function fetchSubscriptionHistory(): Promise<{
  data: Subscription[];
  total: number;
}> {
  try {
    const res = await http.get<{ data: Subscription[]; total: number }>(
      "/recruiter/subscription/history",
    );
    return res as any;
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    return { data: MOCK_HISTORY, total: MOCK_HISTORY.length };
  }
}
