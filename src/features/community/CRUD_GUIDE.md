# Community Module - CRUD Operations Guide

## Overview

The Community module now includes **full CRUD operations** with mock data. All operations simulate API calls with realistic delays.

## Features Implemented

### ✅ Topics Management
- **Create** - Add new topics
- **Read** - List all topics with filtering
- **Update** - Edit topic name, description, status
- **Delete** - Remove topics permanently
- **Toggle Status** - Enable/disable topics

### ✅ Posts Moderation
- **Read** - List posts with pagination and filters
- **View Detail** - Full post view with comments and reports
- **Hide/Unhide** - Toggle post visibility
- **Delete** - Soft delete posts (status: deleted)

### ✅ Reports Review
- **Read** - List all reports with stats
- **Resolve** - Take moderation actions on reported posts
- **Filter** - By status, category, search

### ✅ Comments
- **Read** - View comments on post detail page

## Mock Data Structure

### Topics
```typescript
{
  id: string;
  name: string;
  description: string;
  postCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
```

### Posts
```typescript
{
  id: string;
  content: string;
  author: { id, name, avatar, studentId };
  topic: { id, name };
  commentCount: number;
  reportCount: number;
  viewCount: number;
  status: 'active' | 'hidden' | 'deleted';
  createdAt: string;
  updatedAt: string;
}
```

### Reports
```typescript
{
  id: string;
  postId: string;
  reporter: { id, name, avatar };
  postAuthor: { id, name, avatar };
  postContent: string;
  reason: string;
  category: 'spam' | 'harassment' | 'inappropriate' | 'misinformation' | 'other';
  status: 'pending' | 'resolved';
  createdAt: string;
}
```

## Usage Examples

### Topics CRUD

#### Create Topic
```typescript
import { topicsService } from '../services/crudService';

const newTopic = await topicsService.create({
  name: 'New Topic',
  description: 'Description here',
  status: 'active',
});
```

#### Update Topic
```typescript
await topicsService.update(topicId, {
  name: 'Updated Name',
  description: 'Updated description',
  status: 'inactive',
});
```

#### Delete Topic
```typescript
await topicsService.delete(topicId);
```

#### Toggle Status
```typescript
await topicsService.toggleStatus(topicId);
```

### Posts CRUD

#### Get Posts with Filters
```typescript
import { postsService } from '../services/crudService';

const result = await postsService.getAll({
  topic: '1', // topic ID
  status: 'active',
  reports: 'reported', // 'reported' | 'no-reports'
  search: 'keyword',
  page: 1,
  pageSize: 25,
});

// result.posts - array of posts
// result.total - total count
```

#### Hide Post
```typescript
await postsService.hide(postId);
```

#### Unhide Post
```typescript
await postsService.unhide(postId);
```

#### Delete Post
```typescript
await postsService.delete(postId);
```

### Reports CRUD

#### Get Reports
```typescript
import { reportsService } from '../services/crudService';

const result = await reportsService.getAll({
  status: 'pending',
  category: 'spam',
  search: 'keyword',
  page: 1,
  pageSize: 25,
});
```

#### Resolve Report
```typescript
await reportsService.resolve(reportId, {
  moderationAction: 'hide', // 'dismiss' | 'hide' | 'delete' | 'warn' | 'ban'
  adminNotes: 'Internal notes here',
});
```

## State Management

All pages use React `useState` and `useEffect` for state management:

- **Loading states** - Show loading indicators
- **Error handling** - Console errors (can be enhanced with toast notifications)
- **Optimistic updates** - UI updates immediately after actions
- **Auto-refresh** - Data reloads after mutations

## Filtering & Search

### Topics Page
- Search by name/description
- Filter by status (active/inactive)

### Posts Page
- Search by content/author name
- Filter by topic
- Filter by status (active/hidden/deleted)
- Filter by reports (has reports/no reports)

### Reports Page
- Search by post content/reporter/author
- Filter by status (pending/resolved)
- Filter by category (spam/harassment/etc.)

## Pagination

All list pages support pagination:
- Page size options: 10, 25, 50, 100
- Page navigation: First, Previous, Next, Last
- Results count display
- Auto-reset to page 1 on filter changes

## Moderation Actions

### Available Actions (Reports)
1. **Dismiss Report** - No action on post
2. **Hide Post** - Hide from public view
3. **Delete Post** - Soft delete (status: deleted)
4. **Warn Author** - Send warning (not implemented)
5. **Ban Author** - Ban user (not implemented)

## Data Persistence

⚠️ **Note**: Mock data is stored in memory and resets on page refresh.

To persist data:
1. Replace `crudService.ts` with real API calls
2. Use React Query for caching and synchronization
3. Add backend API endpoints

## Next Steps

### To Connect Real API:

1. **Install React Query**:
```bash
npm install @tanstack/react-query
```

2. **Replace service calls**:
```typescript
// Before (mock)
const topics = await topicsService.getAll();

// After (real API)
const { data: topics } = useQuery({
  queryKey: ['topics', filters],
  queryFn: () => api.get('/topics', { params: filters }),
});
```

3. **Add mutations**:
```typescript
const mutation = useMutation({
  mutationFn: (data) => api.post('/topics', data),
  onSuccess: () => {
    queryClient.invalidateQueries(['topics']);
  },
});
```

## Testing

### Manual Testing Checklist

- [x] Create topic → Appears in list
- [x] Edit topic → Changes saved
- [x] Delete topic → Removed from list
- [x] Toggle topic status → Status badge updates
- [x] Filter topics → List filtered correctly
- [x] Search topics → Results filtered
- [x] View posts → List loads with data
- [x] Filter posts → Multiple filters work
- [x] View post detail → Full content displayed
- [x] Hide post → Status changes to hidden
- [x] Unhide post → Status changes to active
- [x] Delete post → Navigates back to list
- [x] View reports → List loads with stats
- [x] Resolve report → Status updates, stats refresh
- [x] Pagination → Page navigation works
- [x] Page size change → Results update

## Performance

- **API Simulation**: 200-500ms delays
- **Pagination**: Server-side (simulated)
- **Filtering**: Client-side on mock data
- **Optimistic Updates**: Immediate UI feedback

## Error Handling

Currently errors are logged to console. To enhance:

```typescript
try {
  await topicsService.create(data);
} catch (error) {
  // Show toast notification
  toast.error('Failed to create topic');
  // Or use error boundary
}
```

## File Structure

```
community/
├── data/
│   └── mockData.ts          # Mock data arrays
├── services/
│   └── crudService.ts       # CRUD operations
├── pages/
│   ├── TopicsPage.tsx       # Full CRUD
│   ├── PostsListPage.tsx    # Read + filters
│   ├── PostDetailPage.tsx   # Read + actions
│   └── ReportsPage.tsx      # Read + resolve
└── CRUD_GUIDE.md           # This file
```

---

**Status**: ✅ Full CRUD implemented with mock data  
**Ready for**: API integration, real backend connection
