# Community Module

Student social community moderation system for admins to manage topics, posts, comments, and reports.

## Quick Start

```typescript
// Import pages in your routing config
import { TopicsPage } from '@/features/community/pages/TopicsPage';
import { PostsListPage } from '@/features/community/pages/PostsListPage';
import { PostDetailPage } from '@/features/community/pages/PostDetailPage';
import { ReportsPage } from '@/features/community/pages/ReportsPage';

// Example routes (React Router)
<Route path="/admin/community/topics" element={<TopicsPage />} />
<Route path="/admin/community/posts" element={<PostsListPage />} />
<Route path="/admin/community/posts/:id" element={<PostDetailPage />} />
<Route path="/admin/community/reports" element={<ReportsPage />} />
```

## Module Structure

```
community/
├── components/
│   └── shared/              # Reusable components
│       ├── PageHeader.tsx
│       ├── FilterBar.tsx
│       ├── DataTablePagination.tsx
│       └── StatusBadge.tsx
│
├── pages/                   # Screen components
│   ├── TopicsPage.tsx       # /topics
│   ├── PostsListPage.tsx    # /posts
│   ├── PostDetailPage.tsx   # /posts/:id
│   └── ReportsPage.tsx      # /reports
│
└── README.md                # This file
```

## Features by Screen

### 1. Topics Management (`/topics`)
- ✅ Create/Edit topics via modal
- ✅ Enable/Disable topics
- ✅ View topic statistics
- ✅ Filter by status

### 2. Posts List (`/posts`)
- ✅ View all student posts
- ✅ Filter by topic, status, reports
- ✅ Search by content/author
- ✅ Click to view detail

### 3. Post Detail (`/posts/:id`)
- ✅ View full post content
- ✅ View all comments
- ✅ View reports (if any)
- ✅ Hide/Delete post
- ✅ Add admin notes
- ✅ View author profile

### 4. Reports Review (`/reports`)
- ✅ View all content reports
- ✅ Filter by status/category
- ✅ Review reports via modal
- ✅ Take moderation actions
- ✅ Resolve with notes

## Shared Components

### PageHeader
Page title with optional action button and back navigation.

```typescript
<PageHeader
  title="Community Topics"
  description="Manage discussion topics"
  action={{
    label: "Create Topic",
    icon: <Plus />,
    onClick: handleCreate
  }}
/>
```

### FilterBar
Universal search + filter interface.

```typescript
<FilterBar
  searchPlaceholder="Search..."
  filters={[
    {
      id: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active' }
      ]
    }
  ]}
  onSearch={handleSearch}
  onFilterChange={handleFilter}
/>
```

### StatusBadge
Visual status indicators.

```typescript
<StatusBadge status="active" />  // Blue badge
<StatusBadge status="inactive" />  // Gray badge
<StatusBadge status="deleted" />  // Red badge
```

### DataTablePagination
Standardized pagination controls.

```typescript
<DataTablePagination
  currentPage={1}
  totalPages={10}
  pageSize={25}
  totalItems={250}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
/>
```

## Design Patterns

### Pattern 1: List + Modal (Topics, Reports)
Fast CRUD operations without leaving the page.

**When to use**: Simple entities with few fields.

### Pattern 2: List → Detail (Posts)
Dedicated detail page for complex content.

**When to use**: Nested data (comments), multiple actions, shareable URLs.

## Data Flow

### Topics
```
CREATE → Modal → API → Refresh table
UPDATE → Modal → API → Refresh table
TOGGLE → Dropdown → API → Update badge
```

### Posts
```
LIST → API → Display table → [View] → Navigate to detail
DETAIL → API → Display content → [Hide/Delete] → Confirmation → API
```

### Reports
```
LIST → API → Display table → [Review] → Modal → [Resolve] → API
```

## Next Steps

To make this production-ready:

1. **Add API integration**:
   - Replace mock data with real API calls
   - Add loading/error states
   - Implement React Query for caching

2. **Add TypeScript interfaces**:
   ```typescript
   // types/index.ts
   export interface Topic {
     id: string;
     name: string;
     description: string;
     status: 'active' | 'inactive';
     postCount: number;
     createdAt: string;
   }
   ```

3. **Add routing**:
   - Install React Router
   - Configure routes
   - Add protected route wrapper

4. **Add state management** (optional):
   - Zustand for global state
   - Context for theme/user

5. **Add validation**:
   - Form validation with zod
   - React Hook Form integration

## Documentation

See `/docs` folder for detailed wireframe documentation:
- `COMMUNITY_MODULE_WIREFRAME.md` - Full specifications
- `COMMUNITY_PATTERNS.md` - Design patterns & best practices

## Dependencies

### shadcn/ui Components
All installed via: `npx shadcn@latest add [component]`

- table, badge, button, input, label
- select, switch, avatar, card, separator
- dialog, dropdown-menu, alert-dialog, textarea

### Icons
- Lucide React (already in package.json)

## Status

✅ Low-fidelity wireframe complete  
⏳ Awaiting API integration  
⏳ Awaiting real data  
⏳ Awaiting routing setup
