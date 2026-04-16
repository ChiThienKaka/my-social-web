import http from "@/lib/http";

export interface RecruiterCompany {
  company_id: number;
  company_name: string;
  company_tax_code: string;
  company_address: string;
  company_phone: string;
  company_email: string;
  company_size: string | null;
  company_industry: string | null;
  company_url: string | null;
  company_website?: string | null;
  company_logo?: string | null;
  company_description?: string | null;
  verification_documents?: string | null;
  verification_status?: "pending" | "verified" | "rejected";
  created_at?: string;
  updated_at?: string;
}

export interface UpdateCompanyPayload {
  company_name?: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;
  company_size?: string;
  company_industry?: string;
  company_url?: string;
}

const MOCK_COMPANY: RecruiterCompany = {
  company_id: 3,
  company_name: "Công ty TNHH ABC",
  company_tax_code: "1234567890",
  company_address: "123 Đường ABC, Bình Dương",
  company_phone: "0274123456",
  company_email: "contact@congtyabc.com",
  company_size: "50-100",
  company_industry: "Công nghệ thông tin",
  company_url: "https://congtyabc.com",
  company_website: "https://congtyabc.com",
  company_logo: null,
  company_description:
    "Công ty TNHH ABC chuyên phát triển phần mềm và cung cấp giải pháp công nghệ thông tin cho doanh nghiệp.",
  verification_documents: null,
  verification_status: "verified",
  created_at: "2026-01-01T00:00:00.000000Z",
  updated_at: "2026-03-01T00:00:00.000000Z",
};

let mockCompany = { ...MOCK_COMPANY };

export async function fetchRecruiterCompanyInfo(): Promise<RecruiterCompany | null> {
  try {
    const res = await http.get<{ data: RecruiterCompany }>(
      "/recruiter/company",
    );
    return (res as any).data ?? null;
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    return mockCompany;
  }
}

export async function updateRecruiterCompany(
  payload: UpdateCompanyPayload,
): Promise<RecruiterCompany> {
  try {
    const res = await http.put<{ data: RecruiterCompany }>(
      "/recruiter/company",
      payload,
    );
    return (res as any).data;
  } catch {
    await new Promise((r) => setTimeout(r, 500));
    mockCompany = { ...mockCompany, ...payload };
    return mockCompany;
  }
}
