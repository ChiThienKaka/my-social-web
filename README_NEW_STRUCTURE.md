# 🚀 New Architecture - my-social-web

## ✅ Refactor Complete!

**Dev Server**: http://localhost:5175/  
**Status**: Running successfully  
**Architecture**: Modular role-based structure

---

## 📁 Quick Structure Guide

```
src/
├── app/                    # Application core
│   ├── layouts/           # Layouts + components
│   └── routes/            # Routing + guards
│
├── modules/               # Feature modules (by role)
│   ├── public/           # Landing pages
│   ├── auth/             # Login/Register + Auth store
│   ├── employer/         # Employer portal
│   └── admin/            # Admin panel
│
├── components/
│   ├── ui/               # shadcn/ui
│   └── shared/           # Reusable components
│
└── lib/                   # Core utilities
    ├── http.ts           # Axios client
    └── api.ts            # API endpoints
```

---

## 🛣️ URL Routes

### Public
- `/` - Landing Page
- `/pricing` - Pricing Page

### Employer
- `/employer/login` - Login
- `/employer/overview` - Dashboard (Protected)
- `/employer/subscription` - Manage Plan (Protected)

### Admin
- `/admin/login` - Login
- `/admin` - Dashboard (Protected)
- `/admin/users/*` - User Management (Protected)
- `/admin/community/*` - Community Management (Protected)

---

## 🔐 Authentication

**Auth Store**: `modules/auth/stores/auth.store.ts` (Zustand)

```typescript
const { user, isAuthenticated, login, logout } = useAuthStore();
```

**Route Guards**:
- `EmployerGuard` - Protects employer routes
- `AdminGuard` - Protects admin routes

---

## 🎯 Module Separation

**Admin** and **Employer** are completely separated:
- Different folders: `/modules/admin` vs `/modules/employer`
- Different routes: `/admin/*` vs `/employer/*`
- Different guards: `AdminGuard` vs `EmployerGuard`
- Different services: Isolated API calls
- Cannot mix business logic

---

## 📦 Tech Stack

- React 19 + Vite
- TypeScript
- React Router v6
- Zustand (State)
- shadcn/ui
- Tailwind CSS 4
- Axios (planned)

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

**Default port**: 5175 (if 5173/5174 are in use)

---

## 📚 Documentation

1. **ARCHITECTURE.md** - Complete architecture design
2. **QUICK_REFERENCE.md** - Developer quick guide
3. **MIGRATION_GUIDE.md** - Migration steps
4. **REFACTOR_COMPLETE.md** - Refactor summary

---

## ✨ Features

### Employer Portal
- Dashboard with stats
- Subscription management
- Company profile
- Job posts (coming soon)
- Applications (coming soon)

### Admin Panel
- Dashboard with charts
- User management (Students, Recruiters, Admins)
- Community management (Topics, Posts, Reports)
- Full CRUD operations
- Mock data services

---

## 🎨 Design System

- **Primary Color**: Blue (600/700)
- **Style**: Modern SaaS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts

---

**Status**: ✅ Production-ready architecture!
