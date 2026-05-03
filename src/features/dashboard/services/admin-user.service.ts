import http from "@/lib/http";

export interface User {
  user_id: number;
  name?: string;
  full_name?: string;
  email: string;
  role: number;
  role_name: string;
  status: "active" | "banned" | "inactive";
  created_at: string;
  last_login_at?: string | null;
  /** Một số API trả avatar ở root thay vì trong profile */
  avatar_url?: string | null;
  profile?: {
    phone?: string;
    avatar_url?: string;
    date_of_birth?: string;
    gender?: string;
  } | null;
}

/** Chi tiết user từ GET /admin/user/{id} */
export interface AdminUserDetail {
  user_id: number;
  email: string;
  full_name: string;
  phone: string | null;
  is_verified: boolean;
  status: string;
  role_name: string;
  created_at: string;
  company_name: string | null;
  student_code: string | null;
  avatar_url: string | null;
}

export interface UserListResponse {
  data: User[];
  current_page: number;
  total_pages: number;
  total: number;
}

let MOCK_USERS: User[] = [
  {
    user_id: 201,
    name: "Nguyễn Thị Lan",
    email: "ntl@student.edu.vn",
    role: 2,
    role_name: "Student",
    status: "active",
    created_at: "2025-09-01T08:00:00.000000Z",
    last_login_at: "2026-03-27T10:30:00.000000Z",
    avatar_url:
      "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-12.jpg",
    profile: {
      phone: "0912345678",
      avatar_url: null,
      date_of_birth: "2003-05-15",
      gender: "female",
    },
  },
  {
    user_id: 202,
    name: "Trần Văn Minh",
    email: "tvm@student.edu.vn",
    role: 2,
    role_name: "Student",
    status: "active",
    created_at: "2025-09-05T09:00:00.000000Z",
    last_login_at: "2026-03-26T14:20:00.000000Z",
    profile: {
      phone: "0923456789",
      avatar_url: null,
      date_of_birth: "2004-08-22",
      gender: "male",
    },
  },
  {
    user_id: 203,
    name: "Lê Thị Hương",
    email: "lth@student.edu.vn",
    role: 2,
    role_name: "Student",
    status: "banned",
    created_at: "2025-10-12T07:00:00.000000Z",
    last_login_at: "2026-03-15T08:00:00.000000Z",
    profile: {
      phone: "0934567890",
      avatar_url: null,
      date_of_birth: "2003-11-30",
      gender: "female",
    },
  },
  {
    user_id: 101,
    name: "Nguyễn Văn A",
    email: "nva@abc-tech.com",
    role: 4,
    role_name: "Recruiter",
    status: "active",
    created_at: "2026-01-15T08:00:00.000000Z",
    last_login_at: "2026-03-27T09:00:00.000000Z",
    profile: {
      phone: "0901111111",
      avatar_url: null,
    },
  },
  {
    user_id: 102,
    name: "Trần Thị B",
    email: "ttb@xyz-group.vn",
    role: 4,
    role_name: "Recruiter",
    status: "active",
    created_at: "2026-03-10T10:00:00.000000Z",
    last_login_at: "2026-03-26T16:00:00.000000Z",
    profile: {
      phone: "0902222222",
      avatar_url: null,
    },
  },
  {
    user_id: 103,
    name: "Lê Minh C",
    email: "lmc@startup-hub.io",
    role: 4,
    role_name: "Recruiter",
    status: "active",
    created_at: "2026-03-20T14:00:00.000000Z",
    last_login_at: "2026-03-27T11:00:00.000000Z",
    profile: {
      phone: "0903333333",
      avatar_url: null,
    },
  },
  {
    user_id: 1,
    name: "Super Admin",
    email: "admin@talenthub.vn",
    role: 1,
    role_name: "Admin",
    status: "active",
    created_at: "2025-08-01T00:00:00.000000Z",
    last_login_at: "2026-03-27T08:00:00.000000Z",
    profile: null,
  },
  {
    user_id: 2,
    name: "Moderator User",
    email: "mod@talenthub.vn",
    role: 1,
    role_name: "Admin",
    status: "active",
    created_at: "2025-08-15T00:00:00.000000Z",
    last_login_at: "2026-03-26T15:30:00.000000Z",
    profile: null,
  },
];

export async function fetchUsers(params?: {
  role_id?: number;
  per_page?: number;
  page?: number;
}): Promise<UserListResponse> {
  try {
    const res = await http.get<UserListResponse>("/admin/user", { params });
    return res as any;
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    let filtered = [...MOCK_USERS];
    if (params?.role_id) {
      filtered = filtered.filter((u) => u.role === params.role_id);
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

export async function fetchUserDetail(userId: number): Promise<AdminUserDetail> {
  try {
    const res = await http.get<{ data: AdminUserDetail }>(`/admin/user/${userId}`);
    return (res as { data: AdminUserDetail }).data;
  } catch {
    await new Promise((r) => setTimeout(r, 300));
    const u = MOCK_USERS.find((x) => x.user_id === userId);
    if (!u) throw new Error("Không tìm thấy người dùng.");
    return {
      user_id: u.user_id,
      email: u.email,
      full_name: u.full_name || u.name || "Người dùng",
      phone: u.profile?.phone ?? null,
      is_verified: true,
      status: u.status,
      role_name: u.role_name,
      created_at: u.created_at,
      company_name: null,
      student_code: null,
      avatar_url: u.avatar_url ?? u.profile?.avatar_url ?? null,
    };
  }
}

export async function toggleUserBan(userId: number): Promise<User> {
  try {
    const res = await http.patch<{ data: User }>(`/admin/user/${userId}/ban`);
    return (res as any).data;
  } catch {
    await new Promise((r) => setTimeout(r, 300));
    const idx = MOCK_USERS.findIndex((u) => u.user_id === userId);
    if (idx === -1) throw new Error("Người dùng không tồn tại.");
    MOCK_USERS[idx] = {
      ...MOCK_USERS[idx],
      status: MOCK_USERS[idx].status === "banned" ? "active" : "banned",
    };
    return MOCK_USERS[idx];
  }
}
