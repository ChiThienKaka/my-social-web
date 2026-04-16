# Admin Layout - Visual Structure

## Component Tree

```
AdminLayout
├── Sidebar (w-64, fixed left)
│   ├── Logo Section (h-16)
│   │   └── [Blue Square] + "Admin Panel"
│   │
│   └── Navigation (scrollable)
│       ├── Dashboard ────────────────────► /admin
│       ├── Campus ───────────────────────► /admin/campus
│       ├── Community ▼
│       │   ├── Topics ───────────────────► /admin/community/topics
│       │   ├── Posts ────────────────────► /admin/community/posts
│       │   └── Reports ──────────────────► /admin/community/reports
│       ├── Career ▼
│       │   ├── Recruiters ───────────────► /admin/career/recruiters
│       │   ├── Job Posts ────────────────► /admin/career/jobs
│       │   └── Applications ─────────────► /admin/career/applications
│       ├── Users ▼
│       │   ├── Students ─────────────────► /admin/users/students
│       │   └── Admins ───────────────────► /admin/users/admins
│       ├── Notifications ────────────────► /admin/notifications
│       ├── Audit Logs ───────────────────► /admin/audit-logs
│       └── Settings ▼
│           ├── System ────────────────────► /admin/settings/system
│           └── Roles & Permissions ───────► /admin/settings/roles
│
├── Main Column (flex-1)
    ├── TopHeader (h-16, border-bottom)
    │   ├── Search Bar (left)
    │   │   └── [🔍 Search...]
    │   │
    │   └── Actions (right)
    │       ├── [🔔] Notification Badge
    │       ├── | (divider)
    │       └── User Profile
    │           ├── [Avatar Circle]
    │           ├── "Admin User"
    │           ├── "SUPER_ADMIN"
    │           └── [👤] Menu Icon
    │
    └── MainContent (flex-1, p-6)
        └── {children} ← Pages render here
```

## Spacing & Dimensions

```
┌─────────────────────────────────────────────────────────────┐
│  TOP HEADER (h: 64px)                                       │
│                                                             │
│  [Search 384px width]        [🔔][User][Menu]             │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                   │
│ SIDEBAR  │  MAIN CONTENT                                    │
│  (256px) │  (remaining width)                               │
│          │                                                   │
│   Logo   │  Padding: 24px all sides                         │
│  (64px)  │                                                   │
│          │  Content area:                                    │
│   Nav    │  - Scrollable                                     │
│  Items   │  - Full height                                    │
│  (auto)  │  - White/gray bg                                  │
│          │                                                   │
│          │                                                   │
│          │                                                   │
└──────────┴───────────────────────────────────────────────────┘
     256px              100vw - 256px
```

## Color Palette

```css
/* Backgrounds */
--bg-app: #f9fafb        /* gray-50 - App background */
--bg-surface: #ffffff    /* white - Cards, sidebar, header */
--bg-hover: #f3f4f6      /* gray-100 - Hover states */

/* Borders */
--border-default: #e5e7eb  /* gray-200 */

/* Text */
--text-primary: #111827    /* gray-900 */
--text-secondary: #6b7280  /* gray-500 */
--text-muted: #9ca3af      /* gray-400 */

/* Accents */
--accent-primary: #2563eb  /* blue-600 - Logo, active states */
--accent-danger: #ef4444   /* red-500 - Notification badge */
```

## Navigation Item States

### Collapsed Parent Item
```
┌─────────────────────────────┐
│ 💼  Career             >    │  ← Chevron pointing right
└─────────────────────────────┘
    Icon  Label    Chevron
```

### Expanded Parent Item
```
┌─────────────────────────────┐
│ 💼  Career             ∨    │  ← Chevron pointing down
├─────────────────────────────┤
│     ├─ Recruiters           │  ← Indented children
│     ├─ Job Posts            │
│     └─ Applications         │
└─────────────────────────────┘
```

### Single Item (No Children)
```
┌─────────────────────────────┐
│ 📊  Dashboard               │  ← No chevron
└─────────────────────────────┘
```

## Header Layout Breakdown

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [🔍  Search...]                 [🔔] │ [○] Admin User ⌄  │
│   ↑                                ↑    ↑    ↑    ↑    ↑   │
│  Icon   Placeholder              Badge | Avatar Name Role  │
│       (384px wide)                    Divider              │
└─────────────────────────────────────────────────────────────┘
   ← Left aligned                      Right aligned →
```

## Interaction Behaviors

### Sidebar Navigation
1. **Click parent with children** → Toggle expand/collapse
2. **Click leaf item** → Navigate to route (not implemented)
3. **Hover any item** → Show gray background

### Top Header
1. **Search input focus** → Blue ring outline
2. **Notification bell click** → Open notifications (not implemented)
3. **User profile click** → Open dropdown menu (not implemented)

## Responsive Notes (Future Enhancement)

This is a **desktop-first** wireframe. For responsive design:

- **Mobile (< 768px)**: 
  - Sidebar converts to drawer (hidden by default)
  - Add hamburger menu button in header
  - Search bar shrinks or moves to mobile search page

- **Tablet (768px - 1024px)**:
  - Sidebar width: 224px (w-56)
  - Consider collapsible sidebar

- **Desktop (> 1024px)**:
  - Current layout (256px sidebar)
  - Optional: Add right panel for quick actions
