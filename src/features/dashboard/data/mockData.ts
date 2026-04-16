// Mock data for Dashboard

export interface StatCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
  color: string;
}

export interface PendingApproval {
  id: string;
  type: 'campus_content' | 'job_post' | 'recruiter' | 'report';
  title: string;
  author: string;
  createdAt: string;
  priority: 'high' | 'medium' | 'low';
}

export interface RecentAction {
  id: string;
  admin: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'approve' | 'reject';
}

export interface TopPost {
  id: string;
  title: string;
  author: string;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

// Stats Cards
export const statCards: StatCard[] = [
  {
    title: 'Total Users',
    value: '12,458',
    change: 12.5,
    changeType: 'increase',
    icon: 'users',
    color: 'blue',
  },
  {
    title: 'Active Posts',
    value: '3,247',
    change: 8.2,
    changeType: 'increase',
    icon: 'posts',
    color: 'green',
  },
  {
    title: 'Pending Approvals',
    value: '23',
    change: -5.3,
    changeType: 'decrease',
    icon: 'pending',
    color: 'orange',
  },
  {
    title: 'Job Applications',
    value: '1,892',
    change: 15.7,
    changeType: 'increase',
    icon: 'applications',
    color: 'purple',
  },
];

// Pending Approvals
export const pendingApprovals: PendingApproval[] = [
  {
    id: '1',
    type: 'campus_content',
    title: 'New Campus Event Announcement',
    author: 'Campus Admin',
    createdAt: '2 hours ago',
    priority: 'high',
  },
  {
    id: '2',
    type: 'job_post',
    title: 'Software Engineer Position',
    author: 'TechCorp Solutions',
    createdAt: '5 hours ago',
    priority: 'high',
  },
  {
    id: '3',
    type: 'recruiter',
    title: 'New Recruiter Registration',
    author: 'StartupHub',
    createdAt: '1 day ago',
    priority: 'medium',
  },
  {
    id: '4',
    type: 'report',
    title: 'Content Report Review',
    author: 'Student Report',
    createdAt: '3 hours ago',
    priority: 'high',
  },
  {
    id: '5',
    type: 'job_post',
    title: 'Marketing Intern Position',
    author: 'BigCompany Inc',
    createdAt: '6 hours ago',
    priority: 'medium',
  },
];

// Recent Admin Actions
export const recentActions: RecentAction[] = [
  {
    id: '1',
    admin: 'Admin User',
    action: 'approved',
    target: 'Campus Content: Spring Festival',
    timestamp: '10 minutes ago',
    type: 'approve',
  },
  {
    id: '2',
    admin: 'Moderator One',
    action: 'deleted',
    target: 'Post: Spam Content',
    timestamp: '25 minutes ago',
    type: 'delete',
  },
  {
    id: '3',
    admin: 'Super Admin',
    action: 'created',
    target: 'Topic: Technology & Innovation',
    timestamp: '1 hour ago',
    type: 'create',
  },
  {
    id: '4',
    admin: 'Admin User',
    action: 'banned',
    target: 'Student: Sarah Williams',
    timestamp: '2 hours ago',
    type: 'update',
  },
  {
    id: '5',
    admin: 'Moderator Two',
    action: 'verified',
    target: 'Recruiter: TechCorp Solutions',
    timestamp: '3 hours ago',
    type: 'approve',
  },
];

// Top Posts
export const topPosts: TopPost[] = [
  {
    id: '1',
    title: 'Just finished building a React admin dashboard!',
    author: 'John Doe',
    views: 1245,
    likes: 89,
    comments: 23,
    createdAt: '2 days ago',
  },
  {
    id: '2',
    title: 'Upcoming hackathon next week! Looking for teammates',
    author: 'Jane Smith',
    views: 892,
    likes: 67,
    comments: 15,
    createdAt: '3 days ago',
  },
  {
    id: '3',
    title: 'Check out this amazing internship opportunity at Google!',
    author: 'Sarah Williams',
    views: 756,
    likes: 54,
    comments: 12,
    createdAt: '4 days ago',
  },
  {
    id: '4',
    title: 'Need help with calculus homework. Chapter 5 is confusing',
    author: 'Mike Johnson',
    views: 623,
    likes: 42,
    comments: 18,
    createdAt: '5 days ago',
  },
  {
    id: '5',
    title: 'Study group for midterms - anyone interested?',
    author: 'David Brown',
    views: 512,
    likes: 38,
    comments: 9,
    createdAt: '6 days ago',
  },
];

// User Growth Data (Line Chart)
export const userGrowthData: ChartData[] = [
  { name: 'Jan', users: 8500, students: 7200, recruiters: 1300 },
  { name: 'Feb', users: 9200, students: 7800, recruiters: 1400 },
  { name: 'Mar', users: 9800, students: 8300, recruiters: 1500 },
  { name: 'Apr', users: 10500, students: 8900, recruiters: 1600 },
  { name: 'May', users: 11200, students: 9500, recruiters: 1700 },
  { name: 'Jun', users: 12000, students: 10100, recruiters: 1900 },
  { name: 'Jul', users: 12458, students: 10500, recruiters: 1958 },
];

// Post Status Distribution (Pie Chart)
export const postStatusData: ChartData[] = [
  { name: 'Active', value: 3247, color: '#10b981' },
  { name: 'Hidden', value: 156, color: '#6b7280' },
  { name: 'Deleted', value: 89, color: '#ef4444' },
  { name: 'Pending', value: 23, color: '#f59e0b' },
];

// Job Posts by Category (Column Chart)
export const jobPostsByCategory: ChartData[] = [
  { name: 'Technology', value: 245, color: '#3b82f6' },
  { name: 'Business', value: 189, color: '#8b5cf6' },
  { name: 'Marketing', value: 156, color: '#ec4899' },
  { name: 'Design', value: 134, color: '#f59e0b' },
  { name: 'Engineering', value: 98, color: '#10b981' },
  { name: 'Other', value: 67, color: '#6b7280' },
];

// Activity by Day (Line Chart)
export const activityByDay: ChartData[] = [
  { name: 'Mon', posts: 45, comments: 120, reports: 8 },
  { name: 'Tue', posts: 52, comments: 135, reports: 12 },
  { name: 'Wed', posts: 48, comments: 128, reports: 10 },
  { name: 'Thu', posts: 61, comments: 145, reports: 15 },
  { name: 'Fri', posts: 55, comments: 138, reports: 11 },
  { name: 'Sat', posts: 38, comments: 95, reports: 6 },
  { name: 'Sun', posts: 32, comments: 78, reports: 5 },
];
