export const API_ENDPOINTS = {
  // Public endpoints
  PUBLIC: {
    LANDING: "/public/landing",
    PRICING: "/public/pricing",
    CONTACT: "/public/contact",
    RECRUITER_PACKAGES: "/recruiter-packages",
  },

  // Auth endpoints
  AUTH: {
    EMPLOYER_LOGIN: "/employer/login",
    EMPLOYER_REGISTER: "/auth/employer/register",
    ADMIN_LOGIN: "/auth/admin/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },

  // Employer endpoints
  EMPLOYER: {
    DASHBOARD: "/employer/dashboard",
    PROFILE: "/employer/profile",
    SUBSCRIPTION: "/employer/subscription",
    JOBS: "/employer/jobs",
    APPLICATIONS: "/employer/applications",
    BILLING: "/employer/billing",
  },

  // Admin endpoints
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    STUDENTS: "/admin/users/students",
    RECRUITERS: "/admin/users/recruiters",
    ADMINS: "/admin/users/admins",
    EMPLOYERS: "/admin/employers",
    PACKAGES: "/admin/packages",
    CATEGORIES: "/admin/categories",
    JOBS: "/admin/jobs",
    REPORTS: "/admin/reports",
    COMMUNITY: "/admin/community",
    TOPICS: "/admin/community/topics",
    POSTS: "/admin/community/posts",
  },
};
