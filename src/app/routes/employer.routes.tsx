import { Routes, Route, Navigate } from "react-router-dom";
import { EmployerGuard } from "./guards/EmployerGuard";
import { EmployerLayout } from "@/app/layouts/EmployerLayout";
import { OverviewPage } from "@/features/employer/pages/OverviewPage";
import { SubscriptionPage } from "@/features/employer/pages/SubscriptionPage";
import { ProfilePage } from "@/features/employer/pages/ProfilePage";
import { JobsPage } from "@/features/employer/pages/JobsPage";
import { ApplicationsPage } from "@/features/employer/pages/ApplicationsPage";
import { ApplicationDetailPage } from "@/features/employer/pages/ApplicationDetailPage";
import { OrderSummaryPage } from "@/features/subscription/pages/OrderSummaryPage";
import { AuthPage } from "@/features/subscription/pages/AuthPage";

export function EmployerRoutes() {
  return (
    <Routes>
      {/* Auth Routes (No Guard) */}
      <Route path="login" element={<AuthPage />} />
      <Route path="register" element={<AuthPage />} />
      <Route path="company-info" element={<ProfilePage />} />
      <Route path="order-summary" element={<OrderSummaryPage />} />

      {/* Protected Routes (With Guard) */}
      <Route element={<EmployerGuard />}>
        <Route element={<EmployerLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="applications/:id" element={<ApplicationDetailPage />} />
          <Route path="billing" element={<SubscriptionPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
