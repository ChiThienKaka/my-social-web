# Community Module - Wireframe Documentation

## Module Overview

**Purpose**: Content moderation system for student social community (posts, topics, reports)

**Sub-modules**: 3 screens
- Topics Management
- Posts Moderation
- Reports Review

---

## Screen Grouping & Patterns

### Pattern A: List + Modal (Topics, Reports)
**Used for**: Quick CRUD operations that don't require separate pages

```
┌─────────────────────────────────────────┐
│  Page Header + Action Button            │
│  Filter Bar                              │
│  ┌─────────────────────────────────┐   │
│  │   Data Table                    │   │
│  │   - Inline actions (dropdown)   │   │
│  │   - View/Edit triggers modal    │   │
│  └─────────────────────────────────┘   │
│  Pagination                              │
└─────────────────────────────────────────┘

                  ↓ Click Action
                  
        ┌──────────────────┐
        │  Modal Dialog    │
        │  - Form fields   │
        │  - Actions       │
        └──────────────────┘
```

**Screens using this pattern**:
- `/admin/community/topics` → Create/Edit Topic Modal
- `/admin/community/reports` → Report Detail Modal

---

### Pattern B: List → Detail (Posts)
**Used for**: Complex items requiring dedicated detail pages

```
┌─────────────────────────────────────────┐
│  LIST PAGE                               │
│  Page Header                             │
│  Filter Bar                              │
│  ┌─────────────────────────────────┐   │
│  │   Data Table                    │   │
│  │   - Preview content             │   │
│  │   - "View" button → Detail     │   │
│  └─────────────────────────────────┘   │
│  Pagination                              │
└─────────────────────────────────────────┘

                  ↓ Click "View"
                  
┌─────────────────────────────────────────┐
│  DETAIL PAGE                             │
│  Back Button + Page Header               │
│  ┌───────────────┬──────────────────┐   │
│  │ Main Content  │  Sidebar         │   │
│  │ - Post        │  - Actions       │   │
│  │ - Comments    │  - Metadata      │   │
│  │ - Reports     │  - Admin Notes   │   │
│  └───────────────┴──────────────────┘   │
└─────────────────────────────────────────┘
```

**Screens using this pattern**:
- `/admin/community/posts` (List)
- `/admin/community/posts/:id` (Detail)

---

## Shared Components Library

All shared components follow CMS best practices and are reusable across Community (and other) modules.

### 1. PageHeader
**Location**: `src/features/community/components/shared/PageHeader.tsx`

**Purpose**: Consistent page titles with optional actions

**Props**:
```typescript
{
  title: string;                    // Page title
  description?: string;              // Subtitle/description
  action?: {                         // Primary action button
    label: string;
    icon?: ReactNode;
    onClick: () => void;
  };
  backButton?: {                     // Navigation back
    label: string;
    onClick: () => void;
  };
}
```

**Usage**:
- Topics List → "Create Topic" button
- Posts List → No action
- Post Detail → Back button
- Reports → No action

---

### 2. FilterBar
**Location**: `src/features/community/components/shared/FilterBar.tsx`

**Purpose**: Universal search + filter interface

**Features**:
- Search input with icon
- Multiple dropdown filters
- Clear filters button
- Responsive layout

**Props**:
```typescript
{
  searchPlaceholder?: string;
  filters?: FilterOption[];          // Dropdown configs
  onSearch?: (value: string) => void;
  onFilterChange?: (id, value) => void;
  onClearFilters?: () => void;
}
```

**Used in**:
- Topics: Status filter
- Posts: Topic, Status, Reports filters
- Reports: Status, Category filters

---

### 3. DataTablePagination
**Location**: `src/features/community/components/shared/DataTablePagination.tsx`

**Purpose**: Standardized pagination controls

**Features**:
- Results count display
- Page size selector (10, 25, 50, 100)
- First/Previous/Next/Last navigation
- Disabled states for boundaries

**Props**:
```typescript
{
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}
```

**Used in**: All list pages (Topics, Posts, Reports)

---

### 4. StatusBadge
**Location**: `src/features/community/components/shared/StatusBadge.tsx`

**Purpose**: Visual status indicators

**Variants**:
- `active` → Blue badge (default)
- `inactive` → Gray badge (secondary)
- `pending` → Outlined badge
- `hidden` → Gray badge
- `deleted` → Red badge (destructive)
- `resolved` → Green badge

**Used in**:
- Topics table (active/inactive)
- Posts table (active/hidden/deleted)
- Post detail page
- Reports table (pending/resolved)

---

## Screen Specifications

### Screen 1: Topics Management
**Route**: `/admin/community/topics`  
**File**: `src/features/community/pages/TopicsPage.tsx`

**Layout**:
```
┌─────────────────────────────────────────┐
│ Community Topics        [+ Create Topic]│
│ Manage discussion topics...             │
├─────────────────────────────────────────┤
│ [🔍 Search] [Status ▼] [Clear]         │
├─────────────────────────────────────────┤
│ Topic Name | Description | Posts | ... │
│ ──────────────────────────────────────  │
│ Technology | Tech discuss| 245   | ... │
│ Events     | Campus ev..  | 128   | ... │
│ ──────────────────────────────────────  │
├─────────────────────────────────────────┤
│ Showing 1-25 of 50  [◀ 1/2 ▶]          │
└─────────────────────────────────────────┘
```

**Components**:
- `PageHeader` with "Create Topic" action
- `FilterBar` (search + status filter)
- `Table` from shadcn
- `StatusBadge` for active/inactive
- `DropdownMenu` for row actions (Edit, View Stats, Enable/Disable)
- `DataTablePagination`

**Modal** (Create/Edit):
- Topic Name (input)
- Description (input)
- Active Status (switch)
- Cancel/Create buttons

**Actions**:
- ✅ Create topic → Opens modal
- ✅ Edit topic → Opens modal with pre-filled data
- ✅ Enable/Disable → Toggle status
- ✅ View statistics → (Not implemented in wireframe)

---

### Screen 2: Posts List
**Route**: `/admin/community/posts`  
**File**: `src/features/community/pages/PostsListPage.tsx`

**Layout**:
```
┌─────────────────────────────────────────┐
│ Community Posts                          │
│ Monitor and moderate student posts       │
├─────────────────────────────────────────┤
│ [🔍 Search] [Topic ▼] [Status ▼] [...] │
├─────────────────────────────────────────┤
│ Author | Content | Topic | 💬 | 🚩 |...│
│ ───────────────────────────────────────  │
│ [👤] John | Lorem ipsum...| Tech | 5 |..│
│ [👤] Jane | Discussion..  | Even | 2 |..│
│ ───────────────────────────────────────  │
│                                   [View] │
├─────────────────────────────────────────┤
│ Showing 1-25 of 150  [◀ 1/6 ▶]         │
└─────────────────────────────────────────┘
```

**Components**:
- `PageHeader` (no action button)
- `FilterBar` (search + topic/status/reports filters)
- `Table` with avatar/author column
- `StatusBadge` for post status
- `DataTablePagination`

**Table Columns**:
1. Author (avatar + name)
2. Content Preview (truncated)
3. Topic
4. Comment count (icon + number)
5. Report count (highlighted if > 0)
6. Status badge
7. Created date
8. "View" button → Detail page

**Actions**:
- ✅ View post → Navigate to detail page
- ✅ Filter by topic/status
- ✅ Search content/author

---

### Screen 3: Post Detail
**Route**: `/admin/community/posts/:id`  
**File**: `src/features/community/pages/PostDetailPage.tsx`

**Layout** (2/3 + 1/3 grid):
```
┌─────────────────────────────────────────────────┐
│ ← Back to Posts                                 │
│ Post Detail                                     │
├──────────────────────────┬──────────────────────┤
│ LEFT COLUMN (2/3)        │ RIGHT SIDEBAR (1/3) │
│                          │                      │
│ ┌──────────────────────┐ │ ┌────────────────┐ │
│ │ Post Content Card    │ │ │ Moderation     │ │
│ │ - Author info        │ │ │ Actions        │ │
│ │ - Post text          │ │ │ [Hide Post]    │ │
│ │ - Stats (💬 👁 🚩)  │ │ │ [Delete Post]  │ │
│ └──────────────────────┘ │ │ [View Author]  │ │
│                          │ └────────────────┘ │
│ ┌──────────────────────┐ │                    │
│ │ Comments (N)         │ │ ┌────────────────┐ │
│ │ - Comment 1          │ │ │ Post Info      │ │
│ │ - Comment 2          │ │ │ Topic: Tech    │ │
│ └──────────────────────┘ │ │ Created: ...   │ │
│                          │ │ Status: Active │ │
│ ┌──────────────────────┐ │ └────────────────┘ │
│ │ Reports (N) ⚠️      │ │                    │
│ │ - Report 1           │ │ ┌────────────────┐ │
│ │ - Report 2           │ │ │ Admin Notes    │ │
│ └──────────────────────┘ │ │ [Textarea]     │ │
│                          │ │ [Save]         │ │
│                          │ └────────────────┘ │
└──────────────────────────┴──────────────────────┘
```

**Components**:
- `PageHeader` with back button
- `Card` components for sections
- `Avatar` for author/commenters
- `StatusBadge`
- `Separator` for dividers
- `Button` for actions
- `AlertDialog` for confirmations (Hide/Delete)
- `Textarea` for admin notes

**Left Column**:
1. **Post Content Card**:
   - Author avatar + name + student ID + timestamp
   - Status badge
   - Post text content
   - Stats bar (comments, views, reports)

2. **Comments Section**:
   - List of comments with avatars
   - Comment text + timestamp
   - Empty state if no comments

3. **Reports Section** (if any):
   - Warning color scheme (red/orange)
   - Reporter name + reason + timestamp
   - Only visible if post has reports

**Right Sidebar**:
1. **Moderation Actions Card**:
   - Hide/Unhide Post button
   - Delete Post button (destructive)
   - View Author Profile link

2. **Post Information Card**:
   - Topic
   - Created date
   - Current status

3. **Admin Notes Card**:
   - Textarea for internal notes
   - Save button

**Actions**:
- ✅ Hide post → Confirmation dialog → Update status
- ✅ Delete post → Confirmation dialog → Permanent deletion
- ✅ View author → Navigate to user profile
- ✅ Save admin notes → Internal logging

---

### Screen 4: Reports List
**Route**: `/admin/community/reports`  
**File**: `src/features/community/pages/ReportsPage.tsx`

**Layout**:
```
┌─────────────────────────────────────────┐
│ Content Reports                          │
│ Review and moderate reported posts       │
├─────────────────────────────────────────┤
│ [Pending: 12] [Resolved: 45] [Urgent: 3]│ ← Stats
├─────────────────────────────────────────┤
│ [🔍 Search] [Status ▼] [Category ▼]    │
├─────────────────────────────────────────┤
│ Reporter | Post | Author | Cat | 🚩 |..│
│ ────────────────────────────────────────│
│ [👤] User1 | Lorem..| John | Spam | 3│ │
│ [👤] User2 | Text.. | Jane | Haras| 1│ │
│ ────────────────────────────────────────│
│                             [Review]     │
├─────────────────────────────────────────┤
│ Showing 1-25 of 80  [◀ 1/4 ▶]          │
└─────────────────────────────────────────┘
```

**Components**:
- `PageHeader`
- Stats cards (3 KPI cards at top)
- `FilterBar` (search + status/category filters)
- `Table` with multiple avatars
- `Badge` for categories and status
- `DataTablePagination`
- `Dialog` for report review modal

**Stats Cards** (Top row):
1. Pending Reports (orange)
2. Resolved Today (green)
3. Requires Attention (blue)

**Table Columns**:
1. Reporter (avatar + name)
2. Post Content (truncated)
3. Post Author (avatar + name)
4. Category badge
5. Report count (highlighted if multiple)
6. Status (pending/resolved)
7. Reported date
8. "Review" button → Opens modal

**Review Modal**:
```
┌──────────────────────────────────────┐
│ Review Report                         │
│ Take appropriate moderation action    │
├──────────────────────────────────────┤
│ ⚠️ 3 Reports - Category: Spam       │ ← Alert box
│ Reason: Promotional content...       │
├──────────────────────────────────────┤
│ Reported Post:                        │
│ ┌────────────────────────────────┐  │
│ │ [👤] John Doe                  │  │
│ │ Lorem ipsum dolor sit amet...   │  │
│ └────────────────────────────────┘  │
├──────────────────────────────────────┤
│ Moderation Action: [Select ▼]       │
│ Options: Dismiss, Hide, Delete...    │
│                                      │
│ Admin Notes:                         │
│ [Textarea]                           │
├──────────────────────────────────────┤
│              [Cancel] [Confirm]      │
└──────────────────────────────────────┘
```

**Actions**:
- ✅ Review report → Opens modal
- ✅ Select moderation action (dropdown)
- ✅ Add admin notes
- ✅ Confirm & resolve
- ✅ Filter by status/category

---

## Shared UI Patterns (CMS Best Practices)

### 1. Consistent Table Structure
All tables follow the same pattern:
- Header with sortable columns (visual only in wireframe)
- Row hover states
- Action column (right-aligned)
- Empty state messaging
- Loading states (not implemented)

### 2. Modal Workflow
- Triggered by buttons or row actions
- Clear title + description
- Form fields in logical order
- Required field indicators (*)
- Cancel + Primary action buttons
- Close on backdrop click

### 3. Confirmation Dialogs
- Used for destructive actions (Delete, Ban)
- Clear warning message
- Two-button choice (Cancel + Confirm)
- Destructive button uses red color

### 4. Filter Bar Pattern
- Always below page header
- Search on left (largest width)
- Filters in middle (consistent widths)
- Clear button on right (only if filters applied)

### 5. Status Badges
- Consistent color coding across module
- Small, rounded, uppercase text
- Using shadcn Badge variants

### 6. Action Buttons
- Primary actions → Solid buttons
- Secondary actions → Outline buttons
- Destructive actions → Red solid buttons
- Icons + text for clarity

---

## Data Flow (CRUD Operations)

### Topics CRUD
```
CREATE:  [+ Create Topic] → Modal → API → Refresh table
READ:    On page load → API → Display in table
UPDATE:  [Edit] → Modal (prefilled) → API → Refresh table
DELETE:  Not implemented (soft delete via status)
TOGGLE:  [Enable/Disable] → API → Update badge
```

### Posts Moderation
```
READ LIST:   On page load → API → Display in table
READ DETAIL: [View] → Navigate → API → Display content
UPDATE:      [Hide/Delete] → Confirmation → API → Update
FILTER:      Change filters → API → Refresh table
```

### Reports Review
```
READ:    On page load → API → Display in table
REVIEW:  [Review] → Modal → Load post data
RESOLVE: [Confirm] → API → Update status + post action
FILTER:  Change filters → API → Refresh table
```

---

## Component Dependencies

### shadcn/ui Components Used
✅ Installed via: `npx shadcn@latest add [component]`

- `table` - All list pages
- `badge` - Status indicators, categories
- `button` - All actions
- `input` - Search, forms
- `label` - Form fields
- `select` - Filters, dropdowns
- `switch` - Toggle fields
- `avatar` - User images
- `card` - Content containers
- `separator` - Visual dividers
- `dialog` - Modals (Create/Edit Topic, Report Review)
- `dropdown-menu` - Row actions (Topics table)
- `alert-dialog` - Confirmations (Hide/Delete Post)
- `textarea` - Admin notes, long text

### Lucide Icons Used
- `Plus` - Create action
- `Search` - Search input
- `Filter` - Filter indicator
- `X` - Clear filters
- `ChevronLeft/Right` - Pagination
- `ChevronsLeft/Right` - First/Last page
- `MoreVertical` - Row actions menu
- `TrendingUp` - Post count indicator
- `Eye` - View action
- `EyeOff` - Hide action
- `MessageSquare` - Comments
- `Flag` - Reports
- `Trash2` - Delete action
- `User` - User profile
- `AlertTriangle` - Warning/reports
- `CheckCircle` - Resolved status
- `ArrowLeft` - Back navigation

---

## File Structure

```
src/features/community/
├── components/
│   └── shared/
│       ├── PageHeader.tsx           ← Reusable header
│       ├── FilterBar.tsx            ← Search + filters
│       ├── DataTablePagination.tsx  ← Pagination controls
│       └── StatusBadge.tsx          ← Status indicators
│
├── pages/
│   ├── TopicsPage.tsx               ← /admin/community/topics
│   ├── PostsListPage.tsx            ← /admin/community/posts
│   ├── PostDetailPage.tsx           ← /admin/community/posts/:id
│   └── ReportsPage.tsx              ← /admin/community/reports
│
└── types/
    └── index.ts                     ← TypeScript interfaces (not created)
```

---

## Next Steps (Not Implemented)

To make this production-ready:

1. **State Management**:
   - Add Zustand/Redux for global state
   - Implement loading/error states
   - Add optimistic updates

2. **API Integration**:
   - Create API client service
   - Add React Query for data fetching
   - Implement pagination on backend

3. **Real Data**:
   - Replace mock data with API calls
   - Add TypeScript interfaces
   - Implement proper error handling

4. **Advanced Features**:
   - Sorting on table columns
   - Bulk actions (select multiple rows)
   - Export to CSV
   - Real-time updates (WebSocket)
   - Image/media preview in posts

5. **Accessibility**:
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

6. **Testing**:
   - Unit tests for components
   - Integration tests for flows
   - E2E tests for critical paths

---

## Summary

✅ **3 sub-modules** implemented with consistent patterns  
✅ **4 shared components** for reusability  
✅ **13 shadcn components** installed and configured  
✅ **2 UI patterns**: List+Modal, List→Detail  
✅ **CMS best practices**: Filters, pagination, confirmations, status badges  
✅ **Production-ready structure**: Feature-based folders, shared components  

**Status**: Low-fidelity wireframe complete, ready for data integration
