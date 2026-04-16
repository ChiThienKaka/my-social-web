# 🚀 Quick Reference Guide

## URL Structure

```
/                        → Landing Page (Public)
/pricing                 → Pricing Page (Public)
/about                   → About Page (Public)

/employer/login          → Employer Login
/employer/register       → Employer Register
/employer                → Employer Dashboard (Protected)
/employer/subscription   → Subscription Management (Protected)
/employer/profile        → Company Profile (Protected)
/employer/jobs           → Jobs List (Protected)
/employer/jobs/new       → Create Job (Protected)
/employer/applications   → Applications (Protected)
/employer/billing        → Billing History (Protected)

/admin/login             → Admin Login
/admin                   → Admin Dashboard (Protected)
/admin/users             → Users Management (Protected)
/admin/employers         → Employers Management (Protected)
/admin/packages          → Package Management (Protected)
/admin/jobs              → Jobs Moderation (Protected)
/admin/reports           → Reports (Protected)
```

---

## File Organization Pattern

```
When adding a new feature to Employer:

1. Create page in:
   src/modules/employer/pages/NewFeaturePage.tsx

2. Create components in:
   src/modules/employer/components/new-feature/FeatureCard.tsx

3. Create service in:
   src/modules/employer/services/newFeature.service.ts

4. Create types in:
   src/modules/employer/types/newFeature.types.ts

5. Create hook (if needed):
   src/modules/employer/hooks/useNewFeature.ts

6. Add route in:
   src/app/routes/employer.routes.tsx
```

---

## Import Path Aliases

Configure in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/modules/*": ["./src/modules/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

Usage:

```typescript
// ✅ Good
import { Button } from "@/components/ui/button";
import { useAuth } from "@/modules/auth/stores/auth.store";
import http from "@/lib/http";

// ❌ Bad
import { Button } from "../../@/components/ui/button";
```

---

## State Management (Zustand)

### Auth Store (Shared)

```typescript
// src/modules/auth/stores/auth.store.ts
import { create } from "zustand";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginData) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => {
    // Login logic
    set({ user: userData, isAuthenticated: true });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
```

### Employer Store

```typescript
// src/modules/employer/stores/employer.store.ts
export const useEmployerStore = create<EmployerState>((set) => ({
  profile: null,
  jobs: [],
  subscription: null,
  // Employer-specific state
}));
```

### Admin Store

```typescript
// src/modules/admin/stores/admin.store.ts
export const useAdminStore = create<AdminState>((set) => ({
  stats: null,
  users: [],
  moderationQueue: [],
  // Admin-specific state
}));
```

---

## Service Layer Pattern

```typescript
// src/modules/employer/services/jobs.service.ts
import http from "@/lib/http";
import { API_ENDPOINTS } from "@/lib/api";
import type { Job, CreateJobDTO } from "../types/job.types";

export const jobsService = {
  getAll: () => http.get<Job[]>(API_ENDPOINTS.EMPLOYER.JOBS),

  getById: (id: string) =>
    http.get<Job>(`${API_ENDPOINTS.EMPLOYER.JOBS}/${id}`),

  create: (data: CreateJobDTO) =>
    http.post<Job>(API_ENDPOINTS.EMPLOYER.JOBS, data),

  update: (id: string, data: Partial<CreateJobDTO>) =>
    http.put<Job>(`${API_ENDPOINTS.EMPLOYER.JOBS}/${id}`, data),

  delete: (id: string) => http.delete(`${API_ENDPOINTS.EMPLOYER.JOBS}/${id}`),
};
```

---

## Custom Hook Pattern

```typescript
// src/modules/employer/hooks/useJobs.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsService } from "../services/jobs.service";
import { toast } from "@/hooks/useToast";

export function useJobs() {
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["employer-jobs"],
    queryFn: jobsService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: jobsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["employer-jobs"]);
      toast.success("Job created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create job");
    },
  });

  return {
    jobs,
    isLoading,
    createJob: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
}
```

---

## Component Structure Pattern

```typescript
// src/modules/employer/components/jobs/JobCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Job } from '../../types/job.types';

interface JobCardProps {
  job: Job;
  onEdit?: (job: Job) => void;
  onDelete?: (jobId: string) => void;
}

export function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold">{job.title}</h3>
            <Badge>{job.status}</Badge>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onEdit?.(job)}>Edit</Button>
            <Button
              variant="destructive"
              onClick={() => onDelete?.(job.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## Environment Variables

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=TalentHub
VITE_ENABLE_MOCK=true

# .env.production
VITE_API_BASE_URL=https://api.talenthub.com
VITE_APP_NAME=TalentHub
VITE_ENABLE_MOCK=false
```

Usage:

```typescript
// src/config/env.ts
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  appName: import.meta.env.VITE_APP_NAME,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
```

---

## Common Commands

```bash
# Development
npm run dev                # Start dev server

# Build
npm run build              # Build for production
npm run preview            # Preview production build

# Code Quality
npm run lint               # Run ESLint
npm run type-check         # Run TypeScript check
npm run format             # Format code with Prettier

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:e2e           # Run e2e tests
```

---

## Git Branch Strategy

```
main                       # Production-ready code
├── develop                # Development branch
    ├── feature/employer-dashboard
    ├── feature/admin-moderation
    ├── feature/subscription-flow
    └── bugfix/login-issue
```

---

## Code Review Checklist

- [ ] TypeScript: No `any` types
- [ ] Imports: Use path aliases (@/...)
- [ ] Components: Proper prop types
- [ ] Services: Error handling
- [ ] Routes: Proper guards
- [ ] State: No prop drilling
- [ ] Performance: Memo/Callback where needed
- [ ] Accessibility: ARIA labels
- [ ] Tests: Unit tests written
- [ ] Docs: JSDoc comments

---

## Common Patterns

### Loading State

```typescript
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return null;

return <DataDisplay data={data} />;
```

### Form Handling

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
});

export function JobForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### Error Boundary Usage

```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <EmployerDashboard />
</ErrorBoundary>
```

---

## Performance Tips

1. **Lazy Load Routes**

   ```typescript
   const EmployerRoutes = lazy(() => import("./routes/employer.routes"));
   ```

2. **Memoize Expensive Components**

   ```typescript
   export const JobCard = memo(JobCardComponent);
   ```

3. **Virtual Scrolling for Large Lists**

   ```typescript
   import { useVirtualizer } from "@tanstack/react-virtual";
   ```

4. **Debounce Search Inputs**
   ```typescript
   const debouncedSearch = useDebounce(searchTerm, 300);
   ```

---

## Troubleshooting

### Issue: Routes not working

- Check route guards are configured
- Verify user role in auth store
- Check route paths match exactly

### Issue: API calls failing

- Check `http.ts` interceptors
- Verify API_ENDPOINTS configuration
- Check network tab in DevTools

### Issue: State not updating

- Check Zustand store setup
- Verify mutations are calling `set()`
- Check React Query cache invalidation

### Issue: TypeScript errors

- Run `npm run type-check`
- Check tsconfig.json paths
- Verify all imports have types

---

## Resources

- [React Router Docs](https://reactrouter.com)
- [Zustand Docs](https://zustand-demo.pmnd.rs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Vite Docs](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Last Updated**: 2024-02-11
