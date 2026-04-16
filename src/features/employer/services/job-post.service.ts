import http from "@/lib/http";

export interface JobPost {
  job_id: number;
  job_title: string;
  slug: string;
  status: "draft" | "pending" | "approved" | "rejected";
  job_type: "full_time" | "part_time" | "contract" | "internship" | "freelance";
  location_province: string;
  location_district?: string;
  location_address?: string;
  salary_min?: string;
  salary_max?: string;
  salary_type: "fixed" | "negotiable" | "range";
  application_deadline: string;
  application_count: number;
  view_count: number;
  is_featured: boolean;
  created_at: string;
  job_description?: string;
  requirements?: string;
  benefits?: string;
  experience_level?: string;
  education_level?: string;
  number_of_positions?: number;
  work_mode?: "onsite" | "remote" | "hybrid";
  gender_requirement?: "any" | "male" | "female";
  contact_email?: string;
  contact_phone?: string;
  contact_person?: string;
  category_id?: number;
  category?: { category_id: number; category_name: string };
}

export interface JobPostListResponse {
  data: JobPost[];
  current_page: number;
  total_pages: number;
  total: number;
}

export interface JobApplication {
  application_id: number;
  full_name: string;
  email: string;
  phone: string;
  cv_url: string;
  status: string;
  applied_at: string;
}

export interface CreateJobPostPayload {
  job_title: string;
  job_description: string;
  requirements?: string;
  benefits?: string;
  job_type: string;
  salary_min?: number;
  salary_max?: number;
  salary_type?: string;
  experience_level?: string;
  education_level?: string;
  number_of_positions?: number;
  work_mode?: string;
  gender_requirement?: string;
  location_province: string;
  location_district?: string;
  location_address?: string;
  application_deadline: string;
  contact_email: string;
  contact_phone?: string;
  contact_person?: string;
  category_id?: number;
}

let MOCK_JOBS: JobPost[] = [
  {
    job_id: 1,
    job_title: "Lập trình viên Backend PHP",
    slug: "lap-trinh-vien-backend-php-1710000000",
    status: "approved",
    job_type: "full_time",
    location_province: "Bình Dương",
    location_district: "Thủ Dầu Một",
    location_address: "123 Đường ABC, Phường XYZ",
    salary_min: "10000000.00",
    salary_max: "20000000.00",
    salary_type: "range",
    application_deadline: "2026-04-30",
    application_count: 5,
    view_count: 120,
    is_featured: false,
    created_at: "2026-03-01T07:00:00.000000Z",
    job_description: "Phát triển và bảo trì hệ thống backend sử dụng PHP/Laravel.",
    requirements: "Yêu cầu: 2 năm kinh nghiệm PHP, Laravel",
    benefits: "Thưởng OT, du lịch hàng năm",
    work_mode: "onsite",
    gender_requirement: "any",
    experience_level: "2 năm",
    education_level: "Cao đẳng trở lên",
    number_of_positions: 2,
    contact_email: "hr@congtyabc.com",
    contact_phone: "0901234567",
    contact_person: "Ms. Hương",
    category_id: 1,
    category: { category_id: 1, category_name: "Công nghệ thông tin" },
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
    application_count: 12,
    view_count: 200,
    is_featured: true,
    created_at: "2026-03-10T07:00:00.000000Z",
    job_description: "Xây dựng giao diện người dùng bằng ReactJS/TypeScript.",
    work_mode: "hybrid",
    gender_requirement: "any",
    contact_email: "hr@congtyabc.com",
    category: { category_id: 1, category_name: "Công nghệ thông tin" },
  },
  {
    job_id: 3,
    job_title: "Business Analyst",
    slug: "business-analyst-1710000002",
    status: "draft",
    job_type: "full_time",
    location_province: "Hà Nội",
    salary_type: "negotiable",
    application_deadline: "2026-06-01",
    application_count: 0,
    view_count: 0,
    is_featured: false,
    created_at: "2026-03-15T07:00:00.000000Z",
    contact_email: "hr@congtyabc.com",
    category: { category_id: 2, category_name: "Kinh doanh" },
  },
  {
    job_id: 4,
    job_title: "Nhân viên Kinh doanh",
    slug: "nhan-vien-kinh-doanh-1710000003",
    status: "rejected",
    job_type: "full_time",
    location_province: "Bình Dương",
    salary_min: "8000000.00",
    salary_max: "15000000.00",
    salary_type: "range",
    application_deadline: "2026-04-20",
    application_count: 3,
    view_count: 45,
    is_featured: false,
    created_at: "2026-02-20T07:00:00.000000Z",
    contact_email: "hr@congtyabc.com",
    category: { category_id: 2, category_name: "Kinh doanh" },
  },
];

let nextId = 5;

export async function fetchJobPosts(params?: {
  per_page?: number;
  status?: string;
  keyword?: string;
  page?: number;
}): Promise<JobPostListResponse> {
  try {
    const res = await http.get<JobPostListResponse>("/recruiter/job-post", {
      params,
    });
    return res as any;
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    let filtered = [...MOCK_JOBS];
    if (params?.status) {
      filtered = filtered.filter((j) => j.status === params.status);
    }
    if (params?.keyword) {
      filtered = filtered.filter((j) =>
        j.job_title.toLowerCase().includes(params.keyword!.toLowerCase()),
      );
    }
    const perPage = params?.per_page ?? 15;
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

export async function fetchJobPostDetail(jobId: number): Promise<JobPost> {
  try {
    const res = await http.get<{ data: JobPost }>(
      `/recruiter/job-post/${jobId}`,
    );
    return (res as any).data;
  } catch {
    await new Promise((r) => setTimeout(r, 300));
    const job = MOCK_JOBS.find((j) => j.job_id === jobId);
    if (!job) throw new Error("Bài đăng không tồn tại hoặc không thuộc về bạn.");
    return job;
  }
}

export async function createJobPost(
  payload: CreateJobPostPayload,
): Promise<JobPost> {
  try {
    const res = await http.post<{ data: JobPost }>(
      "/recruiter/job-post",
      payload,
    );
    return (res as any).data;
  } catch {
    await new Promise((r) => setTimeout(r, 500));
    const newJob: JobPost = {
      job_id: nextId++,
      job_title: payload.job_title,
      slug: `${payload.job_title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      status: "pending",
      job_type: payload.job_type as JobPost["job_type"],
      location_province: payload.location_province,
      location_district: payload.location_district,
      location_address: payload.location_address,
      salary_min: payload.salary_min?.toString(),
      salary_max: payload.salary_max?.toString(),
      salary_type: (payload.salary_type ?? "negotiable") as JobPost["salary_type"],
      application_deadline: payload.application_deadline,
      application_count: 0,
      view_count: 0,
      is_featured: false,
      created_at: new Date().toISOString(),
      job_description: payload.job_description,
      requirements: payload.requirements,
      benefits: payload.benefits,
      work_mode: payload.work_mode as JobPost["work_mode"],
      gender_requirement: (payload.gender_requirement ?? "any") as JobPost["gender_requirement"],
      experience_level: payload.experience_level,
      education_level: payload.education_level,
      number_of_positions: payload.number_of_positions,
      contact_email: payload.contact_email,
      contact_phone: payload.contact_phone,
      contact_person: payload.contact_person,
      category_id: payload.category_id,
    };
    MOCK_JOBS.unshift(newJob);
    return newJob;
  }
}

export async function updateJobPost(
  jobId: number,
  payload: Partial<CreateJobPostPayload>,
): Promise<JobPost> {
  try {
    const res = await http.put<{ data: JobPost }>(
      `/recruiter/job-post/${jobId}`,
      payload,
    );
    return (res as any).data;
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    const idx = MOCK_JOBS.findIndex((j) => j.job_id === jobId);
    if (idx === -1) throw new Error("Bài đăng không tồn tại.");
    MOCK_JOBS[idx] = { ...MOCK_JOBS[idx], ...payload } as JobPost;
    return MOCK_JOBS[idx];
  }
}

export async function deleteJobPost(jobId: number): Promise<void> {
  try {
    await http.delete(`/recruiter/job-post/${jobId}`);
  } catch {
    await new Promise((r) => setTimeout(r, 300));
    const idx = MOCK_JOBS.findIndex((j) => j.job_id === jobId);
    if (idx === -1) throw new Error("Bài đăng không tồn tại.");
    MOCK_JOBS.splice(idx, 1);
  }
}

export async function refreshJobPost(jobId: number): Promise<JobPost> {
  try {
    const res = await http.patch<{ data: JobPost }>(
      `/recruiter/job-post/${jobId}/refresh`,
    );
    return (res as any).data;
  } catch {
    await new Promise((r) => setTimeout(r, 300));
    const job = MOCK_JOBS.find((j) => j.job_id === jobId);
    if (!job) throw new Error("Bài đăng không tồn tại.");
    if (job.status !== "approved")
      throw new Error("Chỉ có thể làm mới bài đăng đã được duyệt.");
    return job;
  }
}

export async function fetchJobApplications(
  jobId: number,
  perPage = 15,
): Promise<{ data: JobApplication[]; total: number }> {
  try {
    const res = await http.get<{ data: JobApplication[]; total: number }>(
      `/recruiter/job-post/${jobId}/applications`,
      { params: { per_page: perPage } },
    );
    return res as any;
  } catch {
    await new Promise((r) => setTimeout(r, 300));
    return {
      data: [
        {
          application_id: 5,
          full_name: "Nguyễn Văn A",
          email: "nva@gmail.com",
          phone: "0901234567",
          cv_url: "https://example.com/cv.pdf",
          status: "pending",
          applied_at: "2026-03-10T08:30:00.000000Z",
        },
        {
          application_id: 6,
          full_name: "Trần Thị B",
          email: "ttb@gmail.com",
          phone: "0912345678",
          cv_url: "https://example.com/cv2.pdf",
          status: "reviewed",
          applied_at: "2026-03-11T09:00:00.000000Z",
        },
      ],
      total: 2,
    };
  }
}
