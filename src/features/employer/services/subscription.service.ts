import http from "@/lib/http";
import { API_ENDPOINTS } from "@/lib/api";

export interface SubscriptionPackage {
  package_id: number;
  package_name: string;
  price: string | number;
  duration_days: number;
  post_limit: number;
  featured_posts_limit: number;
  refresh_limit: number;
  support_priority: string;
  features:
    | string
    | {
        logo_highlight?: boolean;
        top_search?: boolean;
        analytics?: string;
      };
}

export interface Subscription {
  subscription_id: number;
  status: "active" | "expired" | "cancelled" | "pending";
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

export interface RecruiterPackage {
  package_id: number;
  package_name: string;
  price: number;
  duration_days: number;
  post_limit: number;
  featured_posts_limit: number;
  refresh_limit: number;
  support_priority: string;
  features: {
    logo_highlight: boolean;
    top_search: boolean;
    analytics: string;
  };
  is_active: boolean;
  display_order: number;
}

const MOCK_RECRUITER_PACKAGES: RecruiterPackage[] = [
  {
    package_id: 1,
    package_name: "Basic",
    price: 100000,
    duration_days: 30,
    post_limit: 3,
    featured_posts_limit: 0,
    refresh_limit: 5,
    support_priority: "standard",
    features: {
      logo_highlight: false,
      top_search: false,
      analytics: "none",
    },
    is_active: true,
    display_order: 1,
  },
  {
    package_id: 2,
    package_name: "Pro",
    price: 250000,
    duration_days: 60,
    post_limit: 20,
    featured_posts_limit: 5,
    refresh_limit: 50,
    support_priority: "priority",
    features: {
      logo_highlight: true,
      top_search: false,
      analytics: "basic",
    },
    is_active: true,
    display_order: 2,
  },
  {
    package_id: 3,
    package_name: "Premium",
    price: 700000,
    duration_days: 90,
    post_limit: 100,
    featured_posts_limit: 30,
    refresh_limit: 200,
    support_priority: "vip",
    features: {
      logo_highlight: true,
      top_search: true,
      analytics: "full",
    },
    is_active: true,
    display_order: 3,
  },
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
export async function fetchRecruiterPackages(): Promise<RecruiterPackage[]> {
  try {
    const res = await http.get<{ data: RecruiterPackage[] }>(
      API_ENDPOINTS.PUBLIC.RECRUITER_PACKAGES,
    );
    const packages = (res as any).data ?? [];
    return packages
      .filter((pkg: RecruiterPackage) => pkg.is_active)
      .sort((a: RecruiterPackage, b: RecruiterPackage) => a.display_order - b.display_order);
  } catch {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_RECRUITER_PACKAGES;
  }
}

export interface SubscribePayload {
  package_id: number;
}

export async function subscribeRecruiterPackage(payload: SubscribePayload): Promise<void> {
  await http.post("/recruiter-subscriptions/subscribe", payload);
}

export interface CreateVnpayPaymentPayload {
  route_home: string;
  subscription_id: number;
}

interface CreateVnpayPaymentResponse {
  payment_url: string;
}

export async function createVnpayPaymentUrl(
  payload: CreateVnpayPaymentPayload,
): Promise<string> {
  const res: any = await http.get<
    CreateVnpayPaymentResponse | { data: CreateVnpayPaymentResponse }
  >("/recruiter-payments/create-vnpay", {
    params: payload,
  });

  const paymentUrl = res?.payment_url ?? res?.data?.payment_url;

  if (!paymentUrl) {
    throw new Error("Không nhận được payment_url từ API VNPay");
  }

  return paymentUrl;
}

