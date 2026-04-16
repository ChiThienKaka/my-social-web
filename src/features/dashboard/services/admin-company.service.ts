import http from "@/lib/http";

export interface Company {
  company_id: number;
  company_name: string | null;
  company_tax_code: string | null;
  company_address: string | null;
  company_phone: string | null;
  company_email: string | null;
  company_logo?: string | null;
  company_website?: string | null;
  company_size?: string | null;
  company_industry?: string | null;
  company_url?: string | null;
  company_description?: string | null;
  verification_status: "pending" | "verified" | "rejected";
  verification_documents?: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    user_id: number;
    name?: string;
    full_name?: string;
    email: string;
    avatar_url?: string | null;
  };
}

export interface CompanyListResponse {
  data: Company[];
  current_page: number;
  total_pages: number;
  total: number;
}

let MOCK_COMPANIES: Company[] = [
  {
    company_id: 1,
    company_name: "Công ty TNHH Công Nghệ ABC",
    company_tax_code: "0123456789",
    company_address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    company_phone: "0281234567",
    company_email: "contact@abc-tech.com",
    company_size: "100-200",
    company_industry: "Công nghệ thông tin",
    company_url: "https://abc-tech.com",
    company_description: "Chuyên phát triển phần mềm và giải pháp công nghệ.",
    verification_status: "verified",
    verification_documents: "https://storage.example.com/docs/abc-tech.pdf",
    created_at: "2026-01-15T08:00:00.000000Z",
    updated_at: "2026-02-10T09:30:00.000000Z",
    user: { user_id: 101, name: "Nguyễn Văn A", email: "nva@abc-tech.com" },
  },
  {
    company_id: 2,
    company_name: "Tập đoàn XYZ",
    company_tax_code: "9876543210",
    company_address: "456 Võ Văn Tần, Quận 3, TP.HCM",
    company_phone: "0287654321",
    company_email: "info@xyz-group.vn",
    company_size: "500-1000",
    company_industry: "Thương mại điện tử",
    company_url: "https://xyz-group.vn",
    company_description: "Nền tảng thương mại điện tử hàng đầu Việt Nam.",
    verification_status: "pending",
    verification_documents: "https://storage.example.com/docs/xyz-group.pdf",
    created_at: "2026-03-10T10:00:00.000000Z",
    updated_at: "2026-03-10T10:00:00.000000Z",
    user: { user_id: 102, name: "Trần Thị B", email: "ttb@xyz-group.vn" },
  },
  {
    company_id: 3,
    company_name: "Startup Innovation Hub",
    company_tax_code: "5555555555",
    company_address: "789 Nguyễn Huệ, Quận 1, TP.HCM",
    company_phone: "0289999999",
    company_email: "hello@startup-hub.io",
    company_size: "10-50",
    company_industry: "Tư vấn và Đào tạo",
    company_url: "https://startup-hub.io",
    company_description: "Hỗ trợ startup và đổi mới sáng tạo.",
    verification_status: "pending",
    verification_documents: null,
    created_at: "2026-03-20T14:00:00.000000Z",
    updated_at: "2026-03-20T14:00:00.000000Z",
    user: { user_id: 103, name: "Lê Minh C", email: "lmc@startup-hub.io" },
  },
  {
    company_id: 4,
    company_name: "Doanh nghiệp DEF",
    company_tax_code: "1111111111",
    company_address: "321 Pasteur, Quận 3, TP.HCM",
    company_phone: "0283333333",
    company_email: "hr@def-corp.vn",
    company_size: "50-100",
    company_industry: "Sản xuất",
    company_url: null,
    company_description: null,
    verification_status: "rejected",
    verification_documents: "https://storage.example.com/docs/def-corp.pdf",
    created_at: "2026-02-28T11:00:00.000000Z",
    updated_at: "2026-03-05T16:00:00.000000Z",
    user: { user_id: 104, name: "Phạm Thị D", email: "ptd@def-corp.vn" },
  },
];

export async function fetchCompanyList(params?: {
  verification_status?: string;
  per_page?: number;
  page?: number;
  search?: string;
}): Promise<CompanyListResponse> {
  try {
    const apiParams: any = {
      per_page: params?.per_page,
      page: params?.page,
      keyword: params?.search,
    };

    if (params?.verification_status && params.verification_status !== "all") {
      apiParams.verification_status = params.verification_status;
    }

    const res = await http.get<CompanyListResponse>("/admin/company/list", {
      params: apiParams,
    });

    console.log("[fetchCompanyList SUCCESS]", res);

    // Trả về trực tiếp vì interceptor đã lấy response.data
    return res as any;
  } catch (error: any) {
    console.error("[fetchCompanyList ERROR]", error.response?.status, error.response?.data || error.message);
    await new Promise((r) => setTimeout(r, 400));
    let filtered = [...MOCK_COMPANIES];
    if (params?.verification_status && params.verification_status !== "all") {
      filtered = filtered.filter(
        (c) => c.verification_status === params.verification_status,
      );
    }
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          (c.company_name || "").toLowerCase().includes(searchLower) ||
          (c.company_tax_code || "").toLowerCase().includes(searchLower) ||
          (c.company_email || "").toLowerCase().includes(searchLower),
      );
    }
    const perPage = params?.per_page ?? 20;
    const page = params?.page ?? 1;
    const start = (page - 1) * perPage;
    const paginated = filtered.slice(start, start + perPage);
    return {
      data: paginated,
      current_page: page,
      total_pages: Math.ceil(filtered.length / perPage),
      total: filtered.length,
    };
  }
}

export async function fetchCompanyDetail(companyId: number): Promise<Company> {
  try {
    const res: any = await http.get(`/admin/company/${companyId}`);
    return res.data || res;
  } catch {
    await new Promise((r) => setTimeout(r, 300));
    const company = MOCK_COMPANIES.find((c) => c.company_id === companyId);
    if (!company) throw new Error("Công ty không tồn tại.");
    return company;
  }
}

export async function verifyCompany(
  companyId: number,
  status: "verified" | "rejected",
): Promise<Company> {
  try {
    const res: any = await http.patch(`/admin/company/${companyId}/verify`, {
      verification_status: status,
    });
    return res.data || res;
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    const idx = MOCK_COMPANIES.findIndex((c) => c.company_id === companyId);
    if (idx === -1) throw new Error("Công ty không tồn tại.");
    MOCK_COMPANIES[idx] = {
      ...MOCK_COMPANIES[idx],
      verification_status: status,
      updated_at: new Date().toISOString(),
    };
    return MOCK_COMPANIES[idx];
  }
}

export async function deleteCompany(companyId: number): Promise<void> {
  try {
    await http.delete(`/admin/company/${companyId}`);
  } catch {
    await new Promise((r) => setTimeout(r, 300));
    const idx = MOCK_COMPANIES.findIndex((c) => c.company_id === companyId);
    if (idx === -1) throw new Error("Công ty không tồn tại.");
    MOCK_COMPANIES.splice(idx, 1);
  }
}
