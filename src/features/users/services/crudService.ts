// CRUD Service for Users module
import {
  mockStudents,
  mockRecruiters,
  mockAdmins,
  type Student,
  type Recruiter,
  type Admin,
} from '../data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let studentsData = [...mockStudents];
let recruitersData = [...mockRecruiters];
let adminsData = [...mockAdmins];

// ==================== STUDENTS CRUD ====================

export const studentsService = {
  // Get all students
  getAll: async (filters?: {
    status?: string;
    major?: string;
    year?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ students: Student[]; total: number }> => {
    await delay(400);
    let filtered = [...studentsData];

    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter((s) => s.status === filters.status);
    }

    if (filters?.major && filters.major !== 'all') {
      filtered = filtered.filter((s) => s.major === filters.major);
    }

    if (filters?.year && filters.year !== 'all') {
      filtered = filtered.filter((s) => s.year === filters.year);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          (s.full_name || s.name || "").toLowerCase().includes(searchLower) ||
          s.email.toLowerCase().includes(searchLower) ||
          s.studentId.toLowerCase().includes(searchLower)
      );
    }

    const total = filtered.length;
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 25;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      students: filtered.slice(start, end),
      total,
    };
  },

  // Get student by ID
  getById: async (id: string): Promise<Student | null> => {
    await delay(300);
    return studentsData.find((s) => s.id === id) || null;
  },

  // Ban student
  ban: async (id: string): Promise<Student> => {
    await delay(300);
    const student = studentsData.find((s) => s.id === id);
    if (!student) throw new Error('Student not found');

    student.status = 'banned';
    return student;
  },

  // Unban student
  unban: async (id: string): Promise<Student> => {
    await delay(300);
    const student = studentsData.find((s) => s.id === id);
    if (!student) throw new Error('Student not found');

    student.status = 'active';
    return student;
  },
};

// ==================== RECRUITERS CRUD ====================

export const recruitersService = {
  // Get all recruiters
  getAll: async (filters?: {
    status?: string;
    subscriptionStatus?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ recruiters: Recruiter[]; total: number }> => {
    await delay(400);
    let filtered = [...recruitersData];

    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter((r) => r.status === filters.status);
    }

    if (filters?.subscriptionStatus && filters.subscriptionStatus !== 'all') {
      filtered = filtered.filter((r) => r.subscriptionStatus === filters.subscriptionStatus);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          (r.full_name || r.name || "").toLowerCase().includes(searchLower) ||
          r.email.toLowerCase().includes(searchLower) ||
          r.company.toLowerCase().includes(searchLower)
      );
    }

    const total = filtered.length;
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 25;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      recruiters: filtered.slice(start, end),
      total,
    };
  },

  // Get recruiter by ID
  getById: async (id: string): Promise<Recruiter | null> => {
    await delay(300);
    return recruitersData.find((r) => r.id === id) || null;
  },

  // Verify recruiter
  verify: async (id: string): Promise<Recruiter> => {
    await delay(400);
    const recruiter = recruitersData.find((r) => r.id === id);
    if (!recruiter) throw new Error('Recruiter not found');

    recruiter.status = 'verified';
    recruiter.verifiedAt = new Date().toISOString().split('T')[0];
    return recruiter;
  },

  // Reject recruiter (delete pending)
  reject: async (id: string): Promise<void> => {
    await delay(300);
    recruitersData = recruitersData.filter((r) => r.id !== id);
  },

  // Suspend recruiter
  suspend: async (id: string): Promise<Recruiter> => {
    await delay(300);
    const recruiter = recruitersData.find((r) => r.id === id);
    if (!recruiter) throw new Error('Recruiter not found');

    recruiter.status = 'suspended';
    return recruiter;
  },

  // Unsuspend recruiter
  unsuspend: async (id: string): Promise<Recruiter> => {
    await delay(300);
    const recruiter = recruitersData.find((r) => r.id === id);
    if (!recruiter) throw new Error('Recruiter not found');

    recruiter.status = 'verified';
    return recruiter;
  },
};

// ==================== ADMINS CRUD ====================

export const adminsService = {
  // Get all admins
  getAll: async (filters?: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ admins: Admin[]; total: number }> => {
    await delay(400);
    let filtered = [...adminsData];

    if (filters?.role && filters.role !== 'all') {
      filtered = filtered.filter((a) => a.role === filters.role);
    }

    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter((a) => a.status === filters.status);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          (a.full_name || a.name || "").toLowerCase().includes(searchLower) ||
          a.email.toLowerCase().includes(searchLower)
      );
    }

    const total = filtered.length;
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 25;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      admins: filtered.slice(start, end),
      total,
    };
  },

  // Get admin by ID
  getById: async (id: string): Promise<Admin | null> => {
    await delay(300);
    return adminsData.find((a) => a.id === id) || null;
  },

  // Create admin
  create: async (data: {
    name: string;
    email: string;
    role: 'ADMIN' | 'MODERATOR';
    createdBy: string;
  }): Promise<Admin> => {
    await delay(500);
    const newAdmin: Admin = {
      id: String(Date.now()),
      name: data.name,
      email: data.email,
      avatar: '',
      role: data.role,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: data.createdBy,
    };
    adminsData.push(newAdmin);
    return newAdmin;
  },

  // Update admin role
  updateRole: async (id: string, role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR'): Promise<Admin> => {
    await delay(400);
    const admin = adminsData.find((a) => a.id === id);
    if (!admin) throw new Error('Admin not found');

    admin.role = role;
    return admin;
  },

  // Disable admin
  disable: async (id: string): Promise<Admin> => {
    await delay(300);
    const admin = adminsData.find((a) => a.id === id);
    if (!admin) throw new Error('Admin not found');

    admin.status = 'disabled';
    return admin;
  },

  // Enable admin
  enable: async (id: string): Promise<Admin> => {
    await delay(300);
    const admin = adminsData.find((a) => a.id === id);
    if (!admin) throw new Error('Admin not found');

    admin.status = 'active';
    return admin;
  },
};
