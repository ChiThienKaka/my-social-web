// Mock data for Users module

export interface Student {
  id: string;
  studentId: string;
  name?: string;
  full_name?: string;
  email: string;
  avatar: string;
  phone?: string;
  major: string;
  year: string;
  status: 'active' | 'banned';
  skills: string[];
  createdAt: string;
  lastLoginAt?: string;
  postCount: number;
  commentCount: number;
}

export interface Recruiter {
  id: string;
  name?: string;
  full_name?: string;
  email: string;
  avatar: string;
  company: string;
  companyLogo?: string;
  phone?: string;
  status: 'pending' | 'verified' | 'suspended';
  subscriptionStatus: 'active' | 'expired' | 'none';
  subscriptionExpiresAt?: string;
  jobPostsCount: number;
  createdAt: string;
  verifiedAt?: string;
}

export interface Admin {
  id: string;
  name?: string;
  full_name?: string;
  email: string;
  avatar: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR';
  status: 'active' | 'disabled';
  lastLoginAt?: string;
  createdAt: string;
  createdBy?: string;
}

// Mock Students Data
export const mockStudents: Student[] = [
  {
    id: '1',
    studentId: 'ST001',
    name: 'John Doe',
    email: 'john.doe@university.edu',
    avatar: '',
    phone: '+84 123 456 789',
    major: 'Computer Science',
    year: 'Senior',
    status: 'active',
    skills: ['React', 'Node.js', 'TypeScript', 'Python'],
    createdAt: '2023-09-01',
    lastLoginAt: '2024-02-06 10:30',
    postCount: 15,
    commentCount: 42,
  },
  {
    id: '2',
    studentId: 'ST002',
    name: 'Jane Smith',
    email: 'jane.smith@university.edu',
    avatar: '',
    phone: '+84 987 654 321',
    major: 'Business Administration',
    year: 'Junior',
    status: 'active',
    skills: ['Marketing', 'Management', 'Finance'],
    createdAt: '2023-09-05',
    lastLoginAt: '2024-02-05 14:20',
    postCount: 8,
    commentCount: 23,
  },
  {
    id: '3',
    studentId: 'ST003',
    name: 'Mike Johnson',
    email: 'mike.johnson@university.edu',
    avatar: '',
    major: 'Engineering',
    year: 'Sophomore',
    status: 'active',
    skills: ['CAD', 'Mechanical Design', 'Mathematics'],
    createdAt: '2023-09-10',
    lastLoginAt: '2024-02-04 09:15',
    postCount: 5,
    commentCount: 12,
  },
  {
    id: '4',
    studentId: 'ST004',
    name: 'Sarah Williams',
    email: 'sarah.williams@university.edu',
    avatar: '',
    phone: '+84 555 123 456',
    major: 'Information Technology',
    year: 'Senior',
    status: 'banned',
    skills: ['Java', 'Database', 'Cloud Computing'],
    createdAt: '2023-08-20',
    lastLoginAt: '2024-01-15 16:00',
    postCount: 0,
    commentCount: 0,
  },
  {
    id: '5',
    studentId: 'ST005',
    name: 'David Brown',
    email: 'david.brown@university.edu',
    avatar: '',
    major: 'Data Science',
    year: 'Graduate',
    status: 'active',
    skills: ['Machine Learning', 'Python', 'SQL', 'Statistics'],
    createdAt: '2023-09-15',
    lastLoginAt: '2024-02-06 08:45',
    postCount: 12,
    commentCount: 35,
  },
];

// Mock Recruiters Data
export const mockRecruiters: Recruiter[] = [
  {
    id: '1',
    name: 'Alice Chen',
    email: 'alice.chen@techcorp.com',
    avatar: '',
    company: 'TechCorp Solutions',
    companyLogo: '',
    phone: '+84 111 222 333',
    status: 'verified',
    subscriptionStatus: 'active',
    subscriptionExpiresAt: '2024-12-31',
    jobPostsCount: 8,
    createdAt: '2023-10-01',
    verifiedAt: '2023-10-02',
  },
  {
    id: '2',
    name: 'Bob Wilson',
    email: 'bob.wilson@startup.io',
    avatar: '',
    company: 'StartupHub',
    phone: '+84 444 555 666',
    status: 'pending',
    subscriptionStatus: 'none',
    jobPostsCount: 0,
    createdAt: '2024-02-01',
  },
  {
    id: '3',
    name: 'Carol Martinez',
    email: 'carol.martinez@bigcompany.com',
    avatar: '',
    company: 'BigCompany Inc',
    companyLogo: '',
    phone: '+84 777 888 999',
    status: 'verified',
    subscriptionStatus: 'active',
    subscriptionExpiresAt: '2024-06-30',
    jobPostsCount: 15,
    createdAt: '2023-11-15',
    verifiedAt: '2023-11-16',
  },
  {
    id: '4',
    name: 'Daniel Lee',
    email: 'daniel.lee@recruiting.com',
    avatar: '',
    company: 'Recruiting Pro',
    phone: '+84 333 444 555',
    status: 'suspended',
    subscriptionStatus: 'expired',
    subscriptionExpiresAt: '2024-01-15',
    jobPostsCount: 3,
    createdAt: '2023-12-01',
    verifiedAt: '2023-12-02',
  },
];

// Mock Admins Data
export const mockAdmins: Admin[] = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'superadmin@university.edu',
    avatar: '',
    role: 'SUPER_ADMIN',
    status: 'active',
    lastLoginAt: '2024-02-06 09:00',
    createdAt: '2023-01-01',
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@university.edu',
    avatar: '',
    role: 'ADMIN',
    status: 'active',
    lastLoginAt: '2024-02-06 08:30',
    createdAt: '2023-02-15',
    createdBy: '1',
  },
  {
    id: '3',
    name: 'Moderator One',
    email: 'moderator1@university.edu',
    avatar: '',
    role: 'MODERATOR',
    status: 'active',
    lastLoginAt: '2024-02-05 16:20',
    createdAt: '2023-03-10',
    createdBy: '1',
  },
  {
    id: '4',
    name: 'Moderator Two',
    email: 'moderator2@university.edu',
    avatar: '',
    role: 'MODERATOR',
    status: 'disabled',
    lastLoginAt: '2024-01-20 10:00',
    createdAt: '2023-04-05',
    createdBy: '2',
  },
];
