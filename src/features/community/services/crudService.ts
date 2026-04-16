// CRUD Service for Community module
import http from '@/lib/http';
import {
  mockTopics,
  mockPosts,
  mockComments,
  mockReports,
  type Topic,
  type Post,
  type Comment,
  type Report,
} from '../data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ==================== TOPICS CRUD ====================

let topicsData = [...mockTopics];
let postsData = [...mockPosts];
let commentsData = [...mockComments];
let reportsData = [...mockReports];

export const topicsService = {
  // Get all topics
  getAll: async (filters?: { status?: string; search?: string }): Promise<Topic[]> => {
    try {
      const res: any = await http.get('/admin/community/topic', { params: filters });
      return res.data || res;
    } catch {
      await delay(300);
      let filtered = [...topicsData];

      if (filters?.status && filters.status !== 'all') {
        filtered = filtered.filter((t) => t.status === filters.status);
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.name.toLowerCase().includes(searchLower) ||
            t.description.toLowerCase().includes(searchLower),
        );
      }

      return filtered;
    }
  },

  // Get topic by ID
  getById: async (id: string): Promise<Topic | null> => {
    try {
      const res: any = await http.get(`/admin/community/topic/${id}`);
      return res.data || res;
    } catch {
      await delay(200);
      return topicsData.find((t) => t.id === id) || null;
    }
  },

  // Create topic
  create: async (
    data: Omit<Topic, 'id' | 'postCount' | 'createdAt' | 'updatedAt'>,
  ): Promise<Topic> => {
    try {
      const res: any = await http.post('/admin/community/topic', data);
      return res.data || res;
    } catch {
      await delay(400);
      const newTopic: Topic = {
        ...data,
        id: String(Date.now()),
        postCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      topicsData.push(newTopic);
      return newTopic;
    }
  },

  // Update topic
  update: async (
    id: string,
    data: Partial<Omit<Topic, 'id' | 'createdAt'>>,
  ): Promise<Topic> => {
    try {
      const res: any = await http.put(`/admin/community/topic/${id}`, data);
      return res.data || res;
    } catch {
      await delay(400);
      const index = topicsData.findIndex((t) => t.id === id);
      if (index === -1) throw new Error('Topic not found');

      topicsData[index] = {
        ...topicsData[index],
        ...data,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      return topicsData[index];
    }
  },

  // Delete topic
  delete: async (id: string): Promise<void> => {
    try {
      await http.delete(`/admin/community/topic/${id}`);
    } catch {
      await delay(300);
      topicsData = topicsData.filter((t) => t.id !== id);
    }
  },

  // Toggle topic status
  toggleStatus: async (id: string): Promise<Topic> => {
    try {
      const res: any = await http.patch(`/admin/community/topic/${id}/toggle`);
      return res.data || res;
    } catch {
      await delay(300);
      const topic = topicsData.find((t) => t.id === id);
      if (!topic) throw new Error('Topic not found');

      topic.status = topic.status === 'active' ? 'inactive' : 'active';
      topic.updatedAt = new Date().toISOString().split('T')[0];
      return topic;
    }
  },
};

// ==================== POSTS CRUD ====================

export const postsService = {
  // Get all posts
  getAll: async (filters?: {
    topic?: string;
    status?: string;
    reports?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ posts: Post[]; total: number }> => {
    try {
      const res: any = await http.get('/admin/community/post', {
        params: {
          topic_id: filters?.topic !== 'all' ? filters?.topic : undefined,
          status: filters?.status !== 'all' ? filters?.status : undefined,
          is_reported: filters?.reports === 'reported' ? 1 : filters?.reports === 'no-reports' ? 0 : undefined,
          search: filters?.search,
          page: filters?.page,
          per_page: filters?.pageSize,
        },
      });
      
      // Handle response structure { data: Post[], total: number } or similar
      if (res.posts && typeof res.total === 'number') {
        return res;
      }
      
      return {
        posts: res.data || res,
        total: res.total || (res.data || res).length || 0,
      };
    } catch {
      await delay(400);
      let filtered = [...postsData];

      if (filters?.topic && filters.topic !== 'all') {
        filtered = filtered.filter((p) => p.topic.id === filters.topic);
      }

      if (filters?.status && filters.status !== 'all') {
        filtered = filtered.filter((p) => p.status === filters.status);
      }

      if (filters?.reports === 'reported') {
        filtered = filtered.filter((p) => p.reportCount > 0);
      } else if (filters?.reports === 'no-reports') {
        filtered = filtered.filter((p) => p.reportCount === 0);
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.content.toLowerCase().includes(searchLower) ||
            p.author.name.toLowerCase().includes(searchLower),
        );
      }

      const total = filtered.length;
      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 25;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      return {
        posts: filtered.slice(start, end),
        total,
      };
    }
  },

  // Get post by ID
  getById: async (id: string): Promise<Post | null> => {
    try {
      const res: any = await http.get(`/admin/community/post/${id}`);
      return res.data || res;
    } catch {
      await delay(300);
      return postsData.find((p) => p.id === id) || null;
    }
  },

  // Hide post
  hide: async (id: string): Promise<Post> => {
    try {
      const res: any = await http.patch(`/admin/community/post/${id}/hide`);
      return res.data || res;
    } catch {
      await delay(300);
      const post = postsData.find((p) => p.id === id);
      if (!post) throw new Error('Post not found');

      post.status = 'hidden';
      post.updatedAt = new Date().toISOString();
      return post;
    }
  },

  // Unhide post
  unhide: async (id: string): Promise<Post> => {
    try {
      const res: any = await http.patch(`/admin/community/post/${id}/unhide`);
      return res.data || res;
    } catch {
      await delay(300);
      const post = postsData.find((p) => p.id === id);
      if (!post) throw new Error('Post not found');

      post.status = 'active';
      post.updatedAt = new Date().toISOString();
      return post;
    }
  },

  // Delete post
  delete: async (id: string): Promise<void> => {
    try {
      await http.delete(`/admin/community/post/${id}`);
    } catch {
      await delay(300);
      const post = postsData.find((p) => p.id === id);
      if (!post) throw new Error('Post not found');

      post.status = 'deleted';
      post.updatedAt = new Date().toISOString();
    }
  },
};

// ==================== COMMENTS CRUD ====================

export const commentsService = {
  // Get comments by post ID
  getByPostId: async (postId: string): Promise<Comment[]> => {
    try {
      const res: any = await http.get(`/admin/community/post/${postId}/comments`);
      return res.data || res;
    } catch {
      await delay(200);
      return commentsData.filter((c) => c.postId === postId);
    }
  },
};

// ==================== REPORTS CRUD ====================

export const reportsService = {
  // Get all reports
  getAll: async (filters?: {
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ reports: Report[]; total: number }> => {
    try {
      const res: any = await http.get('/admin/community/report', {
        params: {
          status: filters?.status !== 'all' ? filters?.status : undefined,
          category: filters?.category !== 'all' ? filters?.category : undefined,
          search: filters?.search,
          page: filters?.page,
          per_page: filters?.pageSize,
        },
      });
      
      if (res.reports && typeof res.total === 'number') {
        return res;
      }
      
      return {
        reports: res.data || res,
        total: res.total || (res.data || res).length || 0,
      };
    } catch {
      await delay(400);
      let filtered = [...reportsData];

      if (filters?.status && filters.status !== 'all') {
        filtered = filtered.filter((r) => r.status === filters.status);
      }

      if (filters?.category && filters.category !== 'all') {
        filtered = filtered.filter((r) => r.category === filters.category);
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.postContent.toLowerCase().includes(searchLower) ||
            r.reporter.name.toLowerCase().includes(searchLower) ||
            r.postAuthor.name.toLowerCase().includes(searchLower),
        );
      }

      const total = filtered.length;
      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 25;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      return {
        reports: filtered.slice(start, end),
        total,
      };
    }
  },

  // Get report by ID
  getById: async (id: string): Promise<Report | null> => {
    try {
      const res: any = await http.get(`/admin/community/report/${id}`);
      return res.data || res;
    } catch {
      await delay(200);
      return reportsData.find((r) => r.id === id) || null;
    }
  },

  // Get reports by post ID
  getByPostId: async (postId: string): Promise<Report[]> => {
    try {
      const res: any = await http.get(`/admin/community/post/${postId}/reports`);
      return res.data || res;
    } catch {
      await delay(200);
      return reportsData.filter((r) => r.postId === postId);
    }
  },

  // Resolve report
  resolve: async (
    id: string,
    action: {
      moderationAction: string;
      adminNotes?: string;
    },
  ): Promise<Report> => {
    try {
      const res: any = await http.patch(`/admin/community/report/${id}/resolve`, action);
      return res.data || res;
    } catch {
      await delay(500);
      const report = reportsData.find((r) => r.id === id);
      if (!report) throw new Error('Report not found');

      report.status = 'resolved';

      // Apply moderation action to post if needed
      if (action.moderationAction === 'hide') {
        const post = postsData.find((p) => p.id === report.postId);
        if (post) {
          post.status = 'hidden';
          post.updatedAt = new Date().toISOString();
        }
      } else if (action.moderationAction === 'delete') {
        const post = postsData.find((p) => p.id === report.postId);
        if (post) {
          post.status = 'deleted';
          post.updatedAt = new Date().toISOString();
        }
      }

      return report;
    }
  },
};

// ==================== STATS ====================

export const statsService = {
  getReportsStats: async () => {
    try {
      const res: any = await http.get('/admin/community/stats/reports');
      return res.data || res;
    } catch {
      await delay(200);
      const pending = reportsData.filter((r) => r.status === 'pending').length;
      const resolved = reportsData.filter((r) => r.status === 'resolved').length;
      const today = new Date().toISOString().split('T')[0];
      const resolvedToday = reportsData.filter(
        (r) => r.status === 'resolved' && r.createdAt.startsWith(today),
      ).length;
      const urgent = reportsData.filter(
        (r) => r.status === 'pending' && r.reportCount > 2,
      ).length;

      return {
        pending,
        resolved,
        resolvedToday,
        urgent,
      };
    }
  },
};
