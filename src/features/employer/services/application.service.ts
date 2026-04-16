import http from "@/lib/http";

export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "interviewed"
  | "offered"
  | "accepted"
  | "rejected"
  | "withdrawn";

export interface ApplicationTimeline {
  status: ApplicationStatus;
  note: string | null;
  changed_at: string;
}

export interface Application {
  application_id: number;
  full_name?: string;
  name?: string;
  email: string;
  phone: string;
  cv_url: string;
  cover_letter?: string;
  status: ApplicationStatus;
  rating?: number | null;
  note?: string | null;
  rejection_reason?: string | null;
  interview_schedule?: string | null;
  interview_location?: string | null;
  interview_status?: string | null;
  applied_at: string;
  reviewed_at?: string | null;
  jobpost: { job_id: number; job_title: string };
  applicant?: { user_id: number; name: string; email: string };
  timelines?: ApplicationTimeline[];
}

export interface ApplicationListResponse {
  data: Application[];
  current_page: number;
  total_pages: number;
  total: number;
}

let MOCK_APPLICATIONS: Application[] = [
  {
    application_id: 1,
    full_name: "Nguyễn Văn An",
    email: "nvan@gmail.com",
    phone: "0901111111",
    cv_url: "https://example.com/cv1.pdf",
    cover_letter: "Kính gửi quý công ty, tôi muốn ứng tuyển vị trí này...",
    status: "shortlisted",
    rating: 4,
    note: "Ứng viên tiềm năng",
    rejection_reason: null,
    interview_schedule: null,
    interview_location: null,
    interview_status: null,
    applied_at: "2026-03-10T08:30:00.000000Z",
    reviewed_at: "2026-03-11T09:00:00.000000Z",
    jobpost: { job_id: 1, job_title: "Lập trình viên Backend PHP" },
    applicant: { user_id: 10, name: "Nguyễn Văn An", email: "nvan@gmail.com" },
    timelines: [
      { status: "pending", note: null, changed_at: "2026-03-10T08:30:00Z" },
      { status: "reviewed", note: "Đã xem hồ sơ", changed_at: "2026-03-11T09:00:00Z" },
      { status: "shortlisted", note: "Ứng viên tiềm năng", changed_at: "2026-03-12T10:00:00Z" },
    ],
  },
  {
    application_id: 2,
    full_name: "Trần Thị Bình",
    email: "ttbinh@gmail.com",
    phone: "0912222222",
    cv_url: "https://example.com/cv2.pdf",
    cover_letter: "Tôi có 3 năm kinh nghiệm phát triển ReactJS...",
    status: "reviewed",
    rating: 3,
    note: null,
    rejection_reason: null,
    interview_schedule: null,
    interview_location: null,
    interview_status: null,
    applied_at: "2026-03-12T10:00:00.000000Z",
    reviewed_at: "2026-03-13T08:00:00.000000Z",
    jobpost: { job_id: 2, job_title: "Frontend Developer ReactJS" },
    applicant: { user_id: 11, name: "Trần Thị Bình", email: "ttbinh@gmail.com" },
    timelines: [
      { status: "pending", note: null, changed_at: "2026-03-12T10:00:00Z" },
      { status: "reviewed", note: null, changed_at: "2026-03-13T08:00:00Z" },
    ],
  },
  {
    application_id: 3,
    full_name: "Lê Hoàng Cường",
    email: "lhcuong@gmail.com",
    phone: "0923333333",
    cv_url: "https://example.com/cv3.pdf",
    status: "interviewed",
    rating: 5,
    note: "Rất ấn tượng",
    rejection_reason: null,
    interview_schedule: "2026-04-15T09:00:00.000000Z",
    interview_location: "Tầng 3, 123 Đường ABC, Bình Dương",
    interview_status: "scheduled",
    applied_at: "2026-03-08T07:00:00.000000Z",
    reviewed_at: "2026-03-09T08:00:00.000000Z",
    jobpost: { job_id: 1, job_title: "Lập trình viên Backend PHP" },
    applicant: { user_id: 12, name: "Lê Hoàng Cường", email: "lhcuong@gmail.com" },
    timelines: [
      { status: "pending", note: null, changed_at: "2026-03-08T07:00:00Z" },
      { status: "reviewed", note: "Hồ sơ tốt", changed_at: "2026-03-09T08:00:00Z" },
      { status: "shortlisted", note: "Rất ấn tượng", changed_at: "2026-03-10T09:00:00Z" },
      { status: "interviewed", note: null, changed_at: "2026-03-14T10:00:00Z" },
    ],
  },
  {
    application_id: 4,
    full_name: "Phạm Thị Dung",
    email: "ptdung@gmail.com",
    phone: "0934444444",
    cv_url: "https://example.com/cv4.pdf",
    status: "pending",
    rating: null,
    note: null,
    rejection_reason: null,
    interview_schedule: null,
    interview_location: null,
    interview_status: null,
    applied_at: "2026-03-20T11:00:00.000000Z",
    reviewed_at: null,
    jobpost: { job_id: 2, job_title: "Frontend Developer ReactJS" },
    applicant: { user_id: 13, name: "Phạm Thị Dung", email: "ptdung@gmail.com" },
    timelines: [
      { status: "pending", note: null, changed_at: "2026-03-20T11:00:00Z" },
    ],
  },
  {
    application_id: 5,
    full_name: "Hoàng Minh Đức",
    email: "hmduc@gmail.com",
    phone: "0945555555",
    cv_url: "https://example.com/cv5.pdf",
    status: "rejected",
    rating: 2,
    note: "Kinh nghiệm chưa đủ",
    rejection_reason: "Kinh nghiệm chưa phù hợp với yêu cầu",
    interview_schedule: null,
    interview_location: null,
    interview_status: null,
    applied_at: "2026-03-05T08:00:00.000000Z",
    reviewed_at: "2026-03-06T09:00:00.000000Z",
    jobpost: { job_id: 1, job_title: "Lập trình viên Backend PHP" },
    applicant: { user_id: 14, name: "Hoàng Minh Đức", email: "hmduc@gmail.com" },
    timelines: [
      { status: "pending", note: null, changed_at: "2026-03-05T08:00:00Z" },
      { status: "reviewed", note: null, changed_at: "2026-03-06T09:00:00Z" },
      { status: "rejected", note: "Kinh nghiệm chưa đủ", changed_at: "2026-03-07T10:00:00Z" },
    ],
  },
];

export async function fetchApplications(params?: {
  per_page?: number;
  status?: string;
  job_id?: number;
  page?: number;
}): Promise<ApplicationListResponse> {
  try {
    const res = await http.get<ApplicationListResponse>(
      "/recruiter/application",
      { params },
    );
    return res as any;
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    let filtered = [...MOCK_APPLICATIONS];
    if (params?.status) {
      filtered = filtered.filter((a) => a.status === params.status);
    }
    if (params?.job_id) {
      filtered = filtered.filter((a) => a.jobpost.job_id === params.job_id);
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

export async function fetchApplicationDetail(id: number): Promise<Application> {
  try {
    const res = await http.get<{ data: Application }>(
      `/recruiter/application/${id}`,
    );
    return (res as any).data;
  } catch {
    await new Promise((r) => setTimeout(r, 300));
    const app = MOCK_APPLICATIONS.find((a) => a.application_id === id);
    if (!app) throw new Error("Đơn ứng tuyển không tồn tại.");
    return { ...app };
  }
}

export async function updateApplicationStatus(
  id: number,
  payload: {
    status: ApplicationStatus;
    note?: string;
    rating?: number;
    rejection_reason?: string;
  },
): Promise<Application> {
  try {
    const res = await http.patch<{ data: Application }>(
      `/recruiter/application/${id}/status`,
      payload,
    );
    return (res as any).data;
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    const idx = MOCK_APPLICATIONS.findIndex((a) => a.application_id === id);
    if (idx === -1) throw new Error("Đơn ứng tuyển không tồn tại.");
    const updated: Application = {
      ...MOCK_APPLICATIONS[idx],
      status: payload.status,
      note: payload.note ?? MOCK_APPLICATIONS[idx].note,
      rating: payload.rating ?? MOCK_APPLICATIONS[idx].rating,
      rejection_reason:
        payload.rejection_reason ?? MOCK_APPLICATIONS[idx].rejection_reason,
    };
    updated.timelines = [
      ...(updated.timelines ?? []),
      {
        status: payload.status,
        note: payload.note ?? null,
        changed_at: new Date().toISOString(),
      },
    ];
    MOCK_APPLICATIONS[idx] = updated;
    return updated;
  }
}

export async function scheduleInterview(
  id: number,
  payload: {
    interview_schedule: string;
    interview_location: string;
  },
): Promise<Application> {
  try {
    const res = await http.post<{ data: Application }>(
      `/recruiter/application/${id}/interview`,
      payload,
    );
    return (res as any).data;
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    const idx = MOCK_APPLICATIONS.findIndex((a) => a.application_id === id);
    if (idx === -1) throw new Error("Đơn ứng tuyển không tồn tại.");
    const updated: Application = {
      ...MOCK_APPLICATIONS[idx],
      interview_schedule: payload.interview_schedule,
      interview_location: payload.interview_location,
      interview_status: "scheduled",
      status: "interviewed",
    };
    updated.timelines = [
      ...(updated.timelines ?? []),
      {
        status: "interviewed",
        note: null,
        changed_at: new Date().toISOString(),
      },
    ];
    MOCK_APPLICATIONS[idx] = updated;
    return updated;
  }
}
