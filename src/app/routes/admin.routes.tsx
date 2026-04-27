import { Routes, Route, Navigate } from "react-router-dom";
import { AdminGuard } from "./guards/AdminGuard";
import { AdminLayout } from "@/app/layouts/AdminLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { CompaniesPage } from "@/features/dashboard/pages/CompaniesPage";
import { JobPostsPage } from "@/features/dashboard/pages/JobPostsPage";
import { PackagesPage } from "@/features/dashboard/pages/PackagesPage";
import { UsersPage } from "@/features/dashboard/pages/UsersPage";
import { StudentsPage } from "@/features/users/pages/StudentsPage";
import { RecruitersPage } from "@/features/users/pages/RecruitersPage";
import { AdminsPage } from "@/features/users/pages/AdminsPage";
import { TopicsPage } from "@/features/community/pages/TopicsPage";
import { PostsListPage } from "@/features/community/pages/PostsListPage";
import { PostDetailPage } from "@/features/community/pages/PostDetailPage";
import { ReportsPage } from "@/features/community/pages/ReportsPage";
import { CampusContentComingSoonPage } from "@/features/dashboard/pages/CampusContent_Coming soonPage";

export function AdminRoutes() {
  return (
    <Routes>
      {/* Auth Route (No Guard) */}
      <Route path="login" element={<LoginPage />} />

      {/* Protected Routes (With Guard) */}
      <Route element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />

        {/* Career Management (from Admin API doc) */}
        <Route path="career/companies" element={<CompaniesPage />} />
        <Route path="career/jobs" element={<JobPostsPage />} />
        <Route path="career/packages" element={<PackagesPage />} />
        <Route
          path="career/applications"
          // element={<div className="p-6">Applications - Coming soon</div>}
          element={<CampusContentComingSoonPage />}
        />

        {/* User Management */}
        <Route path="users" element={<UsersPage />} />
        <Route path="users/students" element={<StudentsPage />} />
        <Route path="users/recruiters" element={<RecruitersPage />} />
        <Route path="users/admins" element={<AdminsPage />} />

        {/* Community Management */}
        <Route path="community/topics" element={<TopicsPage />} />
        <Route path="community/posts" element={<PostsListPage />} />
        <Route path="community/posts/:id" element={<PostDetailPage />} />
        <Route path="community/reports" element={<ReportsPage />} />

        {/* Placeholders */}
        <Route
          path="campus"
          // element={<div className="p-6">Campus Content - Coming soon</div>}
          element={<CampusContentComingSoonPage />}
        />
        <Route
          path="notifications"
          element={<div className="p-6">Notifications - Coming soon</div>}
        />
        <Route
          path="audit-logs"
          element={<div className="p-6">Audit Logs - Coming soon</div>}
        />
        <Route
          path="settings/system"
          element={<div className="p-6">System Settings - Coming soon</div>}
        />
        <Route
          path="settings/roles"
          element={<div className="p-6">Roles & Permissions - Coming soon</div>}
        />

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Route>
  </Routes>
  );
}
