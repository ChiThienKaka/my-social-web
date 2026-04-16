import http from "@/lib/http";

export interface Package {
  package_id: number;
  package_name: string;
  price: string;
  duration_days: number;
  post_limit: number;
  featured_posts_limit: number;
  refresh_limit: number;
  support_priority: string;
  features: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePackagePayload {
  package_name: string;
  price: number;
  duration_days: number;
  post_limit: number;
  featured_posts_limit?: number;
  refresh_limit?: number;
  support_priority?: string;
  features?: string;
  is_active?: boolean;
}

let MOCK_PACKAGES: Package[] = [
  {
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
    is_active: true,
    created_at: "2026-01-01T00:00:00.000000Z",
    updated_at: "2026-01-01T00:00:00.000000Z",
  },
  {
    package_id: 2,
    package_name: "Gói Nâng Cao",
    price: "1000000.00",
    duration_days: 90,
    post_limit: 30,
    featured_posts_limit: 5,
    refresh_limit: 15,
    support_priority: "high",
    features:
      "30 bài đăng, 5 bài nổi bật, Làm mới 15 lần/tháng, Hỗ trợ ưu tiên, Tìm kiếm ứng viên nâng cao, Báo cáo chi tiết",
    is_active: true,
    created_at: "2026-01-01T00:00:00.000000Z",
    updated_at: "2026-01-01T00:00:00.000000Z",
  },
  {
    package_id: 3,
    package_name: "Gói Cao Cấp",
    price: "2500000.00",
    duration_days: 90,
    post_limit: 100,
    featured_posts_limit: 20,
    refresh_limit: 50,
    support_priority: "premium",
    features:
      "100 bài đăng, 20 bài nổi bật, Làm mới không giới hạn, Hỗ trợ 24/7, Quản lý ứng viên chuyên nghiệp, API tích hợp, Account Manager riêng",
    is_active: true,
    created_at: "2026-01-01T00:00:00.000000Z",
    updated_at: "2026-01-01T00:00:00.000000Z",
  },
  {
    package_id: 4,
    package_name: "Gói Dùng Thử (Cũ)",
    price: "0.00",
    duration_days: 30,
    post_limit: 3,
    featured_posts_limit: 0,
    refresh_limit: 1,
    support_priority: "low",
    features: "3 bài đăng, Không nổi bật, Hỗ trợ cơ bản",
    is_active: false,
    created_at: "2025-12-01T00:00:00.000000Z",
    updated_at: "2026-02-15T10:00:00.000000Z",
  },
];

let nextPackageId = 5;

export async function fetchPackages(): Promise<Package[]> {
  try {
    const res: any = await http.get("/admin/package");
    return res.data || res;
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    return [...MOCK_PACKAGES];
  }
}

export async function createPackage(
  payload: CreatePackagePayload,
): Promise<Package> {
  try {
    const res: any = await http.post("/admin/package", payload);
    return res.data || res;
  } catch {
    await new Promise((r) => setTimeout(r, 500));
    const newPackage: Package = {
      package_id: nextPackageId++,
      package_name: payload.package_name,
      price: payload.price.toFixed(2),
      duration_days: payload.duration_days,
      post_limit: payload.post_limit,
      featured_posts_limit: payload.featured_posts_limit ?? 0,
      refresh_limit: payload.refresh_limit ?? 0,
      support_priority: payload.support_priority ?? "normal",
      features: payload.features ?? "",
      is_active: payload.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_PACKAGES.push(newPackage);
    return newPackage;
  }
}

export async function togglePackageStatus(
  packageId: number,
): Promise<Package> {
  try {
    const res: any = await http.patch(`/admin/package/${packageId}/toggle`);
    return res.data || res;
  } catch {
    await new Promise((r) => setTimeout(r, 300));
    const idx = MOCK_PACKAGES.findIndex((p) => p.package_id === packageId);
    if (idx === -1) throw new Error("Gói không tồn tại.");
    MOCK_PACKAGES[idx] = {
      ...MOCK_PACKAGES[idx],
      is_active: !MOCK_PACKAGES[idx].is_active,
      updated_at: new Date().toISOString(),
    };
    return MOCK_PACKAGES[idx];
  }
}
