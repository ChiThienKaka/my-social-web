import http from '@/lib/http';
import { API_ENDPOINTS } from '@/lib/api';

export interface RecruiterPackage {
  package_id: number;
  package_name: string;
  price: number;
  duration_days: number;
  post_limit: number;
  featured_posts_limit: number;
  refresh_limit: number;
  support_priority: 'standard' | 'priority' | 'vip' | string;
  features: {
    logo_highlight: boolean;
    top_search: boolean;
    analytics: 'none' | 'basic' | 'full' | string;
  };
  is_active: boolean;
  display_order: number;
}

interface RecruiterPackagesResponse {
  data: RecruiterPackage[];
}

export async function fetchRecruiterPackages(): Promise<RecruiterPackage[]> {
  const res = await http.get<RecruiterPackagesResponse>(
    API_ENDPOINTS.PUBLIC.RECRUITER_PACKAGES,
  );

  const items = res?.data ?? [];

  return items
    .filter((pkg) => pkg.is_active)
    .sort((a, b) => a.display_order - b.display_order);
}

