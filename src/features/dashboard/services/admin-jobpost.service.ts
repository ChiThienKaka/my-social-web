import http from "@/lib/http";

export interface AdminJobPost {
  job_id: number;
  job_title: string;
  slug: string;
  status: "pending" | "approved" | "rejected" | "expired" | "closed";
  job_type: string;
  location_province: string;
  salary_min?: string;
  salary_max?: string;
  salary_type: string;
  application_deadline: string;
  application_count: number;
  view_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  rejection_reason?: string | null;
  company: {
    company_id: number;
    company_name: string;
  };
  recruiter: {
    user_id: number;
    name?: string;
    full_name?: string;
    email: string;
  };
}

export interface JobPostListResponse {
  data: AdminJobPost[];
  current_page: number;
  total_pages: number;
  total: number;
}

export interface JobPostStats {
  pending: number;
  approved: number;
  rejected: number;
  expired: number;
  closed: number;
  total: number;
}

let MOCK_JOB_POSTS: AdminJobPost[] = [
  {
    job_id: 1,
    job_title: "Lập trình viên Backend PHP/Laravel",
    slug: "lap-trinh-vien-backend-php-laravel-1710000000",
    status: "approved",
    job_type: "full_time",
    location_province: "Bình Dương",
    salary_min: "10000000.00",
    salary_max: "20000000.00",
    salary_type: "range",
    application_deadline: "2026-04-30",
    application_count: 15,
    view_count: 320,
    is_featured: true,
    created_at: "2026-03-01T08:00:00.000000Z",
    updated_at: "2026-03-02T09:00:00.000000Z",
    rejection_reason: null,
    company: { company_id: 1, company_name: "Công ty TNHH Công Nghệ ABC" },
    recruiter: { user_id: 101, name: "Nguyễn Văn A", email: "nva@abc-tech.com" },
  },
  {
    job_id: 2,
    job_title: "Frontend Developer ReactJS",
    slug: "frontend-developer-reactjs-1710000001",
    status: "pending",
    job_type: "full_time",
    location_province: "Hồ Chí Minh",
    salary_min: "15000000.00",
    salary_max: "25000000.00",
    salary_type: "range",
    application_deadline: "2026-05-15",
    application_count: 0,
    view_count: 0,
    is_featured: false,
    created_at: "2026-03-20T10:00:00.000000Z",
    updated_at: "2026-03-20T10:00:00.000000Z",
    rejection_reason: null,
    company: { company_id: 2, company_name: "Tập đoàn XYZ" },
    recruiter: { user_id: 102, name: "Trần Thị B", email: "ttb@xyz-group.vn" },
  },
  {
    job_id: 3,
    job_title: "Marketing Executive",
    slug: "marketing-executive-1710000002",
    status: "pending",
    job_type: "full_time",
    location_province: "Hà Nội",
    salary_type: "negotiable",
    application_deadline: "2026-05-30",
    application_count: 0,
    view_count: 0,
    is_featured: false,
    created_at: "2026-03-22T14:00:00.000000Z",
    updated_at: "2026-03-22T14:00:00.000000Z",
    rejection_reason: null,
    company: { company_id: 3, company_name: "Startup Innovation Hub" },
    recruiter: { user_id: 103, name: "Lê Minh C", email: "lmc@startup-hub.io" },
  },
  {
    job_id: 4,
    job_title: "Content Creator (Spam - Vi phạm)",
    slug: "content-creator-spam-1710000003",
    status: "rejected",
    job_type: "freelance",
    location_province: "TP.HCM",
    salary_type: "negotiable",
    application_deadline: "2026-04-15",
    application_count: 0,
    view_count: 12,
    is_featured: false,
    created_at: "2026-03-15T09:00:00.000000Z",
    updated_at: "2026-03-18T10:00:00.000000Z",
    rejection_reason: "Nội dung vi phạm chính sách - spam từ khóa, không liên quan công việc.",
    company: { company_id: 4, company_name: "Doanh nghiệp DEF" },
    recruiter: { user_id: 104, name: "Phạm Thị D", email: "ptd@def-corp.vn" },
  },
  {
    job_id: 5,
    job_title: "Data Engineer",
    slug: "data-engineer-1710000004",
    status: "approved",
    job_type: "full_time",
    location_province: "Hà Nội",
    salary_min: "20000000.00",
    salary_max: "35000000.00",
    salary_type: "range",
    application_deadline: "2026-05-20",
    application_count: 8,
    view_count: 145,
    is_featured: false,
    created_at: "2026-03-05T11:00:00.000000Z",
    updated_at: "2026-03-06T08:00:00.000000Z",
    rejection_reason: null,
    company: { company_id: 1, company_name: "Công ty TNHH Công Nghệ ABC" },
    recruiter: { user_id: 101, name: "Nguyễn Văn A", email: "nva@abc-tech.com" },
  },
];

const MOCK_STATS: JobPostStats = {
  pending: 15,
  approved: 750,
  rejected: 45,
  expired: 62,
  closed: 20,
  total: 892,
};

export async function fetchJobPostList(params?: {
  status?: string;
  per_page?: number;
  page?: number;
  search?: string;
}): Promise<JobPostListResponse> {
  try {
    console.log("[fetchJobPostList] Calling API with params:", params);
    const res = await http.get<JobPostListResponse>("/admin/job-post/list", {
      params: {
        ...params,
        keyword: params?.search,
      },
    });
    console.log("[fetchJobPostList] API Success:", res);
    return res as any;
  } catch (error: any) {
    console.error("[fetchJobPostList] API Error:", error.response?.status, error.response?.data || error.message);
    await new Promise((r) => setTimeout(r, 400));
    let filtered = [...MOCK_JOB_POSTS];
    if (params?.status && params.status !== "all") {
      filtered = filtered.filter((j) => j.status === params.status);
    }
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.job_title.toLowerCase().includes(searchLower) ||
          j.company.company_name.toLowerCase().includes(searchLower),
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

export async function fetchJobPostStats(): Promise<JobPostStats> {
  try {
    console.log("[fetchJobPostStats] Calling API...");
    const res: any = await http.get("/admin/job-post/stats");
    console.log("[fetchJobPostStats] API Success:", res);
    return res.data || res;
  } catch (error: any) {
    console.error("[fetchJobPostStats] API Error:", error.response?.status, error.response?.data || error.message);
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_STATS;
  }
}

export async function updateJobPostStatus(
  jobId: number,
  payload: { status: "approved" | "rejected"; rejection_reason?: string },
): Promise<AdminJobPost> {
  try {
    const res: any = await http.patch(
      `/admin/job-post/${jobId}/status`,
      payload,
    );
    return res.data || res;
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    const idx = MOCK_JOB_POSTS.findIndex((j) => j.job_id === jobId);
    if (idx === -1) throw new Error("Bài đăng không tồn tại.");
    MOCK_JOB_POSTS[idx] = {
      ...MOCK_JOB_POSTS[idx],
      status: payload.status,
      rejection_reason: payload.rejection_reason ?? null,
      updated_at: new Date().toISOString(),
    };
    return MOCK_JOB_POSTS[idx];
  }
}
