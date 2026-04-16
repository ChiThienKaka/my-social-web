import { Routes, Route } from "react-router-dom";
import { LandingPage } from "@/features/landing/pages/LandingPage";
import { PricingPage } from "@/features/subscription/pages/PricingPage";

export function PublicRoutes() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="pricing" element={<PricingPage />} />
    </Routes>
  );
}
