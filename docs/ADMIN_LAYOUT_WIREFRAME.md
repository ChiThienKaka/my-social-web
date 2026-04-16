# Admin Layout Wireframe - Low Fidelity

## Overview
This document describes the global admin layout structure for the University Social Media Admin system.

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                       TOP HEADER                            │
│  [Search Bar]              [🔔] [User Profile] [Menu]       │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                   │
│ SIDEBAR  │           MAIN CONTENT AREA                       │
│          │                                                   │
│ [Logo]   │         (Pages render here)                       │
│          │                                                   │
│ Nav:     │                                                   │
│ ├ 📊 Dashboard                                              │
│ ├ 🏢 Campus                                                 │
│ ├ 💬 Community                                              │
│ │  ├ Topics                                                 │
│ │  ├ Posts                                                  │
│ │  └ Reports                                                │
│ ├ 💼 Career                                                 │
│ │  ├ Recruiters                                             │
│ │  ├ Job Posts                                              │
│ │  └ Applications                                           │
│ ├ 👥 Users                                                  │
│ │  ├ Students                                               │
│ │  └ Admins                                                 │
│ ├ 🔔 Notifications                                          │
│ ├ 📄 Audit Logs                                             │
│ └ ⚙️ Settings                                               │
│    ├ System                                                 │
│    └ Roles & Permissions                                    │
│          │                                                   │
└──────────┴───────────────────────────────────────────────────┘
```

## Components

### 1. AdminLayout (Main Container)
**File**: `src/layouts/AdminLayout.tsx`

- **Purpose**: Global wrapper for all admin pages
- **Structure**: 
  - Flex container (horizontal)
  - Full screen height
  - Gray background (#f9fafb)

### 2. Sidebar Navigation
**File**: `src/layouts/Sidebar.tsx`

- **Width**: 256px (w-64)
- **Sections**:
  - **Header**: Logo + "Admin Panel" branding (h-16)
  - **Navigation Menu**: Scrollable list of nav items

- **Navigation Hierarchy** (8 main sections):
  1. **Dashboard** → `/admin` (no children)
  2. **Campus** → `/admin/campus` (no children)
  3. **Community** → expandable (3 children)
     - Topics
     - Posts
     - Reports
  4. **Career** → expandable (3 children)
     - Recruiters
     - Job Posts
     - Applications
  5. **Users** → expandable (2 children)
     - Students
     - Admins
  6. **Notifications** → `/admin/notifications` (no children)
  7. **Audit Logs** → `/admin/audit-logs` (no children)
  8. **Settings** → expandable (2 children)
     - System
     - Roles & Permissions

- **Interaction**:
  - Items with children show chevron icon
  - Click to expand/collapse sub-items
  - Hover states for all items

### 3. Top Header
**File**: `src/layouts/TopHeader.tsx`

- **Height**: 64px (h-16)
- **Layout**: Horizontal flex with space-between

- **Left Side**:
  - Search bar (w-96)
  - Search icon (left-aligned inside input)

- **Right Side**:
  - **Notifications Bell**: Badge indicator for unread
  - **Divider**: Vertical line separator
  - **User Profile**:
    - Avatar circle (placeholder)
    - Username: "Admin User"
    - Role badge: "SUPER_ADMIN"
    - Dropdown trigger icon

### 4. Main Content Container
- **Purpose**: Renders dynamic page content
- **Styling**: 
  - Flex-1 (takes remaining space)
  - Overflow auto (scrollable)
  - Padding: 1.5rem (p-6)

## Design Tokens

### Colors
- Background: `bg-gray-50` (#f9fafb)
- White surfaces: `bg-white` (#ffffff)
- Borders: `border-gray-200` (#e5e7eb)
- Text primary: `text-gray-900` (#111827)
- Text secondary: `text-gray-600` (#4b5563)
- Accent: `bg-blue-600` (#2563eb)
- Hover: `hover:bg-gray-100` (#f3f4f6)

### Spacing
- Sidebar width: 256px
- Header height: 64px
- Standard padding: 24px (p-6)
- Icon sizes: 18-20px

### Typography
- Primary font weight: 500-600 (medium/semibold)
- Text sizes: sm (14px), base (16px), 2xl (24px)

## States

### Navigation States
- **Default**: Gray text, transparent background
- **Hover**: Gray background (#f3f4f6)
- **Active**: Blue text + background (not implemented in wireframe)
- **Expanded**: Chevron rotates 90deg, children visible

### Header States
- **Notification badge**: Red dot when unread
- **Search**: Focus ring (blue) on input focus

## Notes
- No actual routing implemented (placeholders only)
- No dropdown menus implemented (structural only)
- No modals/toasts in this wireframe
- No page-specific content (tables, forms, etc.)
- Uses Lucide React icons
- Responsive breakpoints not included (desktop-first)

## Missing from Wireframe (per FEATURESMAP.json)
The following Career sub-modules are not in the sidebar:
- Packages (`/admin/career/packages`)
- Job Categories (`/admin/career/categories`)
- Job Skills (`/admin/career/skills`)
- Company Reviews (`/admin/career/reviews`)

**Recommendation**: Add these as additional children under Career menu, or manage via modals within existing pages.

## File Structure
```
src/
├── layouts/
│   ├── AdminLayout.tsx    (Main wrapper)
│   ├── Sidebar.tsx         (Navigation)
│   └── TopHeader.tsx       (Header bar)
└── App.tsx                 (Demo implementation)
```
