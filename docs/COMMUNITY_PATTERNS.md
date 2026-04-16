# Community Module - Design Patterns & Component Matrix

## Pattern Comparison

### Pattern A: List + Modal (Quick CRUD)

**Best for**: Simple entities with few fields, quick edits

```
┌────────────────────────────────────────┐
│ Page with Table                        │
│ ┌────────────────────────────────────┐ │
│ │ Item 1          [⋮ Edit]           │ │
│ │ Item 2          [⋮ Edit]           │ │
│ │ Item 3          [⋮ Edit]           │ │
│ └────────────────────────────────────┘ │
│                     [+ Create]          │
└────────────────────────────────────────┘
                  ↓
         ┌─────────────┐
         │   Modal     │
         │  [Form]     │
         └─────────────┘
```

**Pros**:
- ✅ Fast interaction (no page reload)
- ✅ Context preserved (see table while editing)
- ✅ Less code (one page)
- ✅ Good for mobile (less navigation)

**Cons**:
- ❌ Limited space for complex forms
- ❌ Can't deep link to edit view
- ❌ Less suitable for multi-step workflows

**Used in Community**:
- **Topics**: Create/Edit topic (3 fields)
- **Reports**: Review report (select action + notes)

---

### Pattern B: List → Detail (Deep Context)

**Best for**: Complex entities needing full-page context

```
┌────────────────────────────────────────┐
│ List Page                              │
│ ┌────────────────────────────────────┐ │
│ │ Item 1 preview      [View Detail] │ │
│ │ Item 2 preview      [View Detail] │ │
│ │ Item 3 preview      [View Detail] │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ Detail Page                             │
│ ← Back                                  │
│ ┌──────────────┬──────────────────────┐ │
│ │ Full Content │ Actions + Metadata   │ │
│ │ + Related    │                      │ │
│ └──────────────┴──────────────────────┘ │
└─────────────────────────────────────────┘
```

**Pros**:
- ✅ Shareable URLs (deep linking)
- ✅ More screen space
- ✅ Better for complex relationships (comments, reports)
- ✅ Easier to add tabs/sections
- ✅ Better for SEO/bookmarking

**Cons**:
- ❌ Requires navigation
- ❌ More files/routes to maintain
- ❌ Can feel slow on mobile

**Used in Community**:
- **Posts**: View post + comments + reports + moderation

---

## Component Matrix

| Component | Topics | Posts List | Post Detail | Reports | Reusable? |
|-----------|:------:|:----------:|:-----------:|:-------:|:---------:|
| **PageHeader** | ✅ | ✅ | ✅ | ✅ | ✅ 100% |
| **FilterBar** | ✅ | ✅ | ❌ | ✅ | ✅ 100% |
| **DataTablePagination** | ✅ | ✅ | ❌ | ✅ | ✅ 100% |
| **StatusBadge** | ✅ | ✅ | ✅ | ✅ | ✅ 100% |
| **Table** (shadcn) | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Dialog** (shadcn) | ✅ | ❌ | ❌ | ✅ | ✅ |
| **DropdownMenu** (shadcn) | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Card** (shadcn) | ❌ | ❌ | ✅ | ❌ | ✅ |
| **AlertDialog** (shadcn) | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Avatar** (shadcn) | ❌ | ✅ | ✅ | ✅ | ✅ |

**Key Insight**: 4 custom shared components cover 100% of common needs across all screens.

---

## Screen Flow Map

```
/admin/community/
│
├─ /topics ──────────────────────┐
│   ├─ View table                │
│   ├─ [+ Create] → Modal ──────→ Create
│   └─ [⋮ Edit] → Modal ────────→ Update
│
├─ /posts ──────────────────────┐
│   ├─ View table                │
│   ├─ Filter by topic/status    │
│   └─ [View] ─────────────────┐ │
│                                ↓ │
│   /:id ────────────────────────┘
│       ├─ View post content
│       ├─ View comments
│       ├─ View reports
│       ├─ [Hide] → AlertDialog → Update
│       └─ [Delete] → AlertDialog → Delete
│
└─ /reports ────────────────────┐
    ├─ View table               │
    ├─ Filter by status/category│
    └─ [Review] → Modal ────────→ Resolve report
```

---

## Data Relationships

```
┌─────────────┐
│   TOPICS    │
│  (managed)  │
└──────┬──────┘
       │ 1:N
       ↓
┌─────────────┐      ┌─────────────┐
│    POSTS    │←────→│  COMMENTS   │
│ (moderated) │ 1:N  │  (shown)    │
└──────┬──────┘      └─────────────┘
       │ 1:N
       ↓
┌─────────────┐
│   REPORTS   │
│  (reviewed) │
└─────────────┘
```

**Key Flows**:
1. **Student creates post** → Admin sees in Posts List
2. **Student reports post** → Admin sees in Reports List
3. **Admin reviews report** → Admin hides/deletes post → Post status updated
4. **Admin creates topic** → Students can tag posts with it

---

## State Management Patterns

### List Page State
```typescript
// Common state for all list pages
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(25);
const [searchQuery, setSearchQuery] = useState('');
const [filters, setFilters] = useState({});

// Derived
const totalPages = Math.ceil(totalItems / pageSize);
```

### Modal State
```typescript
// For List + Modal pattern
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

// Create vs Edit
const isEditMode = selectedItem !== null;
```

### Detail Page State
```typescript
// For List → Detail pattern
const { id } = useParams();
const [data, setData] = useState(null);
const [isLoading, setIsLoading] = useState(true);

// Confirmation dialogs
const [showDeleteDialog, setShowDeleteDialog] = useState(false);
```

---

## Responsive Behavior (Future)

### Mobile (<768px)
- Tables → Card lists (vertical stack)
- Filters → Drawer/bottom sheet
- Pagination → Simplified (prev/next only)
- Multi-column layouts → Single column

### Tablet (768-1024px)
- Slightly narrower sidebars
- Fewer table columns (hide less important)
- Modals → Full screen on small tablets

### Desktop (>1024px)
- Current layout (optimal)
- Optional: Add quick filters in sidebar

---

## Color Coding System

### Status Colors
```css
/* Active/Success */
--success: #10b981 (green-500)
--success-bg: #d1fae5 (green-100)

/* Inactive/Secondary */
--secondary: #6b7280 (gray-500)
--secondary-bg: #f3f4f6 (gray-100)

/* Pending/Warning */
--warning: #f59e0b (yellow-500)
--warning-bg: #fef3c7 (yellow-100)

/* Deleted/Destructive */
--destructive: #ef4444 (red-500)
--destructive-bg: #fee2e2 (red-100)

/* Info/Default */
--info: #3b82f6 (blue-500)
--info-bg: #dbeafe (blue-100)
```

### Usage by Screen
- **Topics**: Green (active) / Gray (inactive)
- **Posts**: Green (active) / Gray (hidden) / Red (deleted)
- **Reports**: Orange (pending) / Green (resolved)

---

## Action Button Patterns

### Primary Actions (List Pages)
```typescript
// Create new item
<Button onClick={openModal}>
  <Plus size={18} className="mr-2" />
  Create [Entity]
</Button>
```

### Row Actions (Tables)
```typescript
// Quick view/edit
<Button variant="outline" size="sm">
  <Eye size={14} className="mr-1" />
  View
</Button>

// More actions
<DropdownMenu>
  <DropdownMenuTrigger>
    <MoreVertical size={16} />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Destructive Actions (Detail Pages)
```typescript
// Requires confirmation
<Button 
  variant="destructive"
  onClick={showConfirmation}
>
  <Trash2 size={16} className="mr-2" />
  Delete Post
</Button>

// With AlertDialog
<AlertDialog>
  <AlertDialogContent>
    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
    <AlertDialogDescription>
      This action cannot be undone.
    </AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Confirm</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## Performance Optimizations (Future)

1. **Virtual Scrolling**: For tables with 1000+ rows
2. **Debounced Search**: Wait 300ms after user stops typing
3. **Pagination**: Server-side (already designed for it)
4. **Lazy Loading**: Load detail page data only when needed
5. **Memoization**: React.memo for table rows
6. **Code Splitting**: Lazy load pages with React.lazy

---

## Accessibility Checklist

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space to activate buttons
- [ ] Escape to close modals/dialogs
- [ ] Arrow keys for dropdown menus

### Screen Readers
- [ ] ARIA labels on icon-only buttons
- [ ] Table headers with proper scope
- [ ] Form labels associated with inputs
- [ ] Status announcements on actions

### Visual
- [ ] Color contrast ratios (WCAG AA)
- [ ] Focus indicators visible
- [ ] Text readable at 200% zoom
- [ ] No color-only information

---

## Testing Strategy

### Unit Tests
```typescript
// Shared components
✓ PageHeader renders with actions
✓ FilterBar calls callbacks correctly
✓ StatusBadge shows correct variant
✓ DataTablePagination disables at boundaries

// Pages
✓ TopicsPage renders empty state
✓ PostsListPage filters correctly
✓ PostDetailPage loads data
✓ ReportsPage opens modal
```

### Integration Tests
```typescript
// User flows
✓ Create topic → See in table
✓ Edit topic → Changes saved
✓ Hide post → Status updated
✓ Review report → Post hidden
✓ Filter posts → Table updated
```

### E2E Tests (Playwright/Cypress)
```typescript
✓ Admin logs in → Navigates to Community
✓ Creates topic → Sees success message
✓ Views reported post → Takes action
✓ Filters by status → Sees correct results
```

---

## Summary: Why These Patterns?

| Pattern | When to Use | Example |
|---------|-------------|---------|
| **List + Modal** | Simple CRUD, <5 fields, no nested data | Topics, Quick edits |
| **List → Detail** | Complex content, nested data, multiple actions | Posts with comments |
| **Stats Cards** | Dashboard/overview, KPIs | Reports pending count |
| **2-Col Layout** | Detail page, main + sidebar | Post detail + actions |
| **Confirmation Dialog** | Destructive actions | Delete, Ban, Permanent changes |
| **Filter Bar** | Any list with >25 items | All list pages |

**Golden Rule**: Use the simplest pattern that solves the user's need. Don't over-engineer.
