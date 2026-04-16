# 🔄 Migration Guide - Current → New Architecture

## Overview

This guide will help you migrate from the current folder structure to the new modular architecture that properly separates Public, Employer, and Admin concerns.

---

## Current vs New Structure

### Current Structure (Before)
```
src/
├── layouts/
│   ├── AdminLayout.tsx
│   ├── Sidebar.tsx
│   ├── TopHeader.tsx
│   ├── EmployerLayout.tsx        # Mixed with admin
│   ├── EmployerSidebar.tsx
│   └── EmployerHeader.tsx
├── features/
│   ├── auth/
│   ├── landing/
│   ├── subscription/
│   ├── employer/
│   ├── dashboard/
│   ├── community/
│   └── users/
└── components/
    └── ui/
```

### New Structure (After)
```
src/
├── app/
│   ├── layouts/            # All layouts here
│   ├── routes/             # All routes here
│   └── providers/          # Context providers
├── modules/
│   ├── public/             # Landing, pricing
│   ├── auth/               # Login, register
│   ├── employer/           # Employer portal
│   └── admin/              # Admin panel
├── components/
│   ├── ui/                 # shadcn/ui
│   └── shared/             # Reusable components
└── lib/
    ├── http.ts
    └── api.ts
```

---

## Step-by-Step Migration

### Phase 1: Setup New Structure (1-2 hours)

#### 1.1 Create New Folders
```bash
mkdir -p src/app/{layouts,routes,providers}
mkdir -p src/app/routes/guards
mkdir -p src/modules/{public,auth,employer,admin}
mkdir -p src/components/shared
mkdir -p src/lib
mkdir -p src/config
```

#### 1.2 Move Layouts
```bash
# Move all layout files to app/layouts
mv src/layouts/AdminLayout.tsx src/app/layouts/
mv src/layouts/Sidebar.tsx src/app/layouts/AdminSidebar.tsx
mv src/layouts/TopHeader.tsx src/app/layouts/AdminHeader.tsx
mv src/layouts/EmployerLayout.tsx src/app/layouts/
mv src/layouts/EmployerSidebar.tsx src/app/layouts/
mv src/layouts/EmployerHeader.tsx src/app/layouts/
```

Update imports in layout files:
```typescript
// Before
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

// After
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
```

---

### Phase 2: Migrate Public Module (2-3 hours)

#### 2.1 Create Public Module Structure
```bash
mkdir -p src/modules/public/{pages,components,services,types}
```

#### 2.2 Move Landing Pages
```bash
# Move landing page
mv src/features/landing/pages/LandingPage.tsx src/modules/public/pages/

# Move landing components
mkdir -p src/modules/public/components
# Move any landing-specific components
```

#### 2.3 Update Imports
```typescript
// Before
import { LandingPage } from '@/features/landing/pages/LandingPage';

// After
import { LandingPage } from '@/modules/public/pages/LandingPage';
```

---

### Phase 3: Migrate Auth Module (1-2 hours)

#### 3.1 Create Auth Module Structure
```bash
mkdir -p src/modules/auth/{pages,components,services,stores,types}
```

#### 3.2 Move Auth Files
```bash
# Move auth pages
mv src/features/auth/pages/* src/modules/auth/pages/

# Create auth service
# Create auth store (Zustand)
```

#### 3.3 Create Auth Store
```typescript
// src/modules/auth/stores/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginData) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (credentials) => {
        // Call API
        const response = await authService.login(credentials);
        set({ 
          user: response.user, 
          token: response.token,
          isAuthenticated: true 
        });
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

---

### Phase 4: Migrate Employer Module (3-4 hours)

#### 4.1 Create Employer Module Structure
```bash
mkdir -p src/modules/employer/{pages,components,services,stores,types,hooks}
mkdir -p src/modules/employer/components/{dashboard,jobs,subscription,profile}
```

#### 4.2 Move Employer Files
```bash
# Move employer pages
mv src/features/employer/pages/* src/modules/employer/pages/

# Move subscription pages
mv src/features/subscription/pages/* src/modules/employer/pages/
```

#### 4.3 Restructure Components
```typescript
// Organize by feature
src/modules/employer/components/
├── dashboard/
│   ├── StatsCard.tsx
│   └── ActivityChart.tsx
├── jobs/
│   ├── JobCard.tsx
│   ├── JobForm.tsx
│   └── JobFilters.tsx
├── subscription/
│   ├── PlanCard.tsx
│   └── SubscriptionHistory.tsx
└── profile/
    ├── CompanyInfoForm.tsx
    └── LogoUpload.tsx
```

#### 4.4 Create Employer Services
```typescript
// src/modules/employer/services/jobs.service.ts
import http from '@/lib/http';

export const jobsService = {
  getAll: () => http.get('/employer/jobs'),
  getById: (id: string) => http.get(`/employer/jobs/${id}`),
  create: (data: CreateJobDTO) => http.post('/employer/jobs', data),
  update: (id: string, data: UpdateJobDTO) => 
    http.put(`/employer/jobs/${id}`, data),
  delete: (id: string) => http.delete(`/employer/jobs/${id}`),
};
```

---

### Phase 5: Migrate Admin Module (3-4 hours)

#### 5.1 Create Admin Module Structure
```bash
mkdir -p src/modules/admin/{pages,components,services,stores,types,hooks}
mkdir -p src/modules/admin/pages/{users,employers,packages,categories,jobs,reports}
```

#### 5.2 Move Admin Files
```bash
# Move dashboard
mv src/features/dashboard/pages/DashboardPage.tsx \
   src/modules/admin/pages/DashboardPage.tsx

# Move community (if it's admin-related)
mv src/features/community/pages/* src/modules/admin/pages/

# Move users
mv src/features/users/pages/* src/modules/admin/pages/users/
```

#### 5.3 Organize Admin Components
```typescript
src/modules/admin/components/
├── dashboard/
│   ├── StatCard.tsx
│   └── RevenueChart.tsx
├── users/
│   ├── UserTable.tsx
│   └── UserFilters.tsx
├── employers/
│   ├── EmployerTable.tsx
│   └── VerificationModal.tsx
└── shared/
    ├── DataTable.tsx      # Admin-specific table
    └── FilterBar.tsx      # Admin-specific filters
```

---

### Phase 6: Setup Routing (2-3 hours)

#### 6.1 Create Route Files
```bash
touch src/app/routes/index.tsx
touch src/app/routes/public.routes.tsx
touch src/app/routes/employer.routes.tsx
touch src/app/routes/admin.routes.tsx
touch src/app/routes/guards/{EmployerGuard.tsx,AdminGuard.tsx}
```

#### 6.2 Implement Root Router
```typescript
// src/app/routes/index.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicRoutes } from './public.routes';
import { EmployerRoutes } from './employer.routes';
import { AdminRoutes } from './admin.routes';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/employer/*" element={<EmployerRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
```

#### 6.3 Implement Route Guards
```typescript
// src/app/routes/guards/EmployerGuard.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/stores/auth.store';

export function EmployerGuard() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/employer/login" replace />;
  }

  if (user?.role !== 'employer') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
```

#### 6.4 Update App.tsx
```typescript
// src/app/App.tsx
import { AppRouter } from './routes';
import { AppProvider } from './providers/AppProvider';

export function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
```

---

### Phase 7: Setup Shared Resources (1-2 hours)

#### 7.1 Create HTTP Client
```typescript
// src/lib/http.ts
import axios from 'axios';
import { useAuthStore } from '@/modules/auth/stores/auth.store';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Request interceptor
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default http;
```

#### 7.2 Create API Config
```typescript
// src/lib/api.ts
export const API_ENDPOINTS = {
  PUBLIC: {
    LANDING: '/public/landing',
    PRICING: '/public/pricing',
  },
  EMPLOYER: {
    DASHBOARD: '/employer/dashboard',
    JOBS: '/employer/jobs',
    SUBSCRIPTION: '/employer/subscription',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    EMPLOYERS: '/admin/employers',
  },
};
```

#### 7.3 Move Shared Components
```bash
# Move shared components to components/shared
mkdir -p src/components/shared
mv src/features/community/components/shared/* src/components/shared/
```

---

### Phase 8: Update Path Aliases (30 mins)

#### 8.1 Update tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/app/*": ["./src/app/*"],
      "@/modules/*": ["./src/modules/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/config/*": ["./src/config/*"]
    }
  }
}
```

#### 8.2 Update vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/modules': path.resolve(__dirname, './src/modules'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/config': path.resolve(__dirname, './src/config'),
    },
  },
});
```

---

### Phase 9: Update All Imports (2-3 hours)

Use find & replace to update import paths:

#### Find: `from '@/features/landing`
#### Replace: `from '@/modules/public`

#### Find: `from '@/features/employer`
#### Replace: `from '@/modules/employer`

#### Find: `from '@/features/dashboard`
#### Replace: `from '@/modules/admin/pages`

#### Find: `from '@/layouts`
#### Replace: `from '@/app/layouts`

---

### Phase 10: Testing & Cleanup (2-3 hours)

#### 10.1 Test Each Module
- [ ] Public pages load correctly
- [ ] Employer login works
- [ ] Employer dashboard accessible
- [ ] Employer features functional
- [ ] Admin login works
- [ ] Admin dashboard accessible
- [ ] Admin features functional

#### 10.2 Check Route Guards
- [ ] Unauthenticated users redirected to login
- [ ] Employers cannot access admin routes
- [ ] Admins cannot access employer routes

#### 10.3 Cleanup Old Files
```bash
# Remove old folders
rm -rf src/features/landing
rm -rf src/features/employer
rm -rf src/features/dashboard
rm -rf src/features/community
rm -rf src/features/users
rm -rf src/layouts
```

#### 10.4 Update Documentation
- [ ] Update README.md
- [ ] Update API documentation
- [ ] Update onboarding guide

---

## Checklist

### Pre-Migration
- [ ] Backup current codebase (Git commit/branch)
- [ ] Review ARCHITECTURE.md
- [ ] Review QUICK_REFERENCE.md
- [ ] Plan migration timeline

### During Migration
- [ ] Create new folder structure
- [ ] Move public module
- [ ] Move auth module
- [ ] Move employer module
- [ ] Move admin module
- [ ] Setup routing
- [ ] Setup route guards
- [ ] Update path aliases
- [ ] Update all imports
- [ ] Move shared components

### Post-Migration
- [ ] Test all routes
- [ ] Test authentication flows
- [ ] Test role-based access
- [ ] Run linter
- [ ] Run type checker
- [ ] Test build process
- [ ] Update documentation
- [ ] Deploy to staging
- [ ] QA testing
- [ ] Production deployment

---

## Common Issues & Solutions

### Issue: Import errors after migration
**Solution**: Update tsconfig.json paths and run `npm run type-check`

### Issue: Routes not working
**Solution**: Check route guards, verify user role in auth store

### Issue: Components not found
**Solution**: Update imports to use new path aliases

### Issue: Build fails
**Solution**: Check vite.config.ts alias configuration

### Issue: Auth not persisting
**Solution**: Verify Zustand persist middleware is configured

---

## Rollback Plan

If migration fails:

1. Revert to previous Git commit
2. Create new branch for migration
3. Review errors and fix incrementally
4. Test each phase before proceeding

---

## Timeline Estimate

| Phase | Time | Difficulty |
|-------|------|------------|
| Phase 1: Setup | 1-2h | Easy |
| Phase 2: Public | 2-3h | Medium |
| Phase 3: Auth | 1-2h | Medium |
| Phase 4: Employer | 3-4h | Hard |
| Phase 5: Admin | 3-4h | Hard |
| Phase 6: Routing | 2-3h | Medium |
| Phase 7: Shared | 1-2h | Easy |
| Phase 8: Aliases | 30m | Easy |
| Phase 9: Imports | 2-3h | Medium |
| Phase 10: Testing | 2-3h | Medium |
| **Total** | **18-27h** | **~3-4 days** |

---

## Team Coordination

### If multiple developers:

1. **Split by module**: One person per module
2. **Feature branches**: Each module gets its own branch
3. **Daily sync**: Review progress and resolve conflicts
4. **Code reviews**: Review each phase before merging
5. **Integration testing**: Test everything together at the end

---

## Success Metrics

- [ ] All pages render correctly
- [ ] No TypeScript errors
- [ ] No linter errors
- [ ] All tests pass
- [ ] Build completes successfully
- [ ] Role-based access working
- [ ] Performance maintained or improved
- [ ] Bundle size not increased significantly

---

**Good luck with your migration! 🚀**
