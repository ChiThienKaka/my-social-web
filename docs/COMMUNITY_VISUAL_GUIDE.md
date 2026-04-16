# Community Module - Visual Guide

## Module Overview

```
┌────────────────────────────────────────────────────────────────┐
│                    COMMUNITY MODULE                            │
│                  (Student Social Moderation)                   │
└────────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
            ▼                 ▼                 ▼
    ┌───────────┐     ┌───────────┐    ┌───────────┐
    │  TOPICS   │     │   POSTS   │    │  REPORTS  │
    │ Management│     │Moderation │    │  Review   │
    └───────────┘     └───────────┘    └───────────┘
         │                   │                │
    List+Modal          List→Detail      List+Modal
```

---

## Screen Layouts

### 1. Topics Page (List + Modal Pattern)

```
┌─────────────────────────────────────────────────────────────┐
│ Community Topics                       [+ Create Topic]     │
│ Manage discussion topics and categories...                  │
├─────────────────────────────────────────────────────────────┤
│ [🔍 Search topics...]      [Status ▼]  [Clear]            │
├─────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Topic Name  │ Description │ Posts │ Status │ Created │⋮│ │
│ ├─────────────┼─────────────┼───────┼────────┼─────────┼─┤ │
│ │ Technology  │ Tech & AI   │  245  │ Active │ Jan 15  │ │ │
│ │ Events      │ Campus ev.  │  128  │ Active │ Jan 10  │ │ │
│ │ Study Group │ Collaborate │   89  │Inactive│ Dec 20  │ │ │
│ └───────────────────────────────────────────────────────┘  │
│                                                              │
│ Showing 1-25 of 50        [Page size: 25▼]   [◀ 1/2 ▶]   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ Click [+ Create] or [⋮ Edit]
                    ┌──────────────────┐
                    │  Modal Dialog    │
                    │ ┌──────────────┐ │
                    │ │ Topic Name * │ │
                    │ │ [Input____]  │ │
                    │ │              │ │
                    │ │ Description  │ │
                    │ │ [Input____]  │ │
                    │ │              │ │
                    │ │ Active [🔘]  │ │
                    │ └──────────────┘ │
                    │ [Cancel][Create] │
                    └──────────────────┘
```

---

### 2. Posts List Page (List View)

```
┌─────────────────────────────────────────────────────────────┐
│ Community Posts                                              │
│ Monitor and moderate student posts and discussions           │
├─────────────────────────────────────────────────────────────┤
│ [🔍 Search...]  [Topic ▼] [Status ▼] [Reports ▼]  [Clear] │
├─────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────┐  │
│ │Author│Content Preview   │Topic│💬│🚩│Status │Date │    │ │
│ ├──────┼──────────────────┼─────┼──┼──┼───────┼─────┼────┤ │
│ │[👤]  │Lorem ipsum dolor │Tech │5 │0 │Active │2/5  │View│ │
│ │John  │sit amet, consec. │     │  │  │       │     │    │ │
│ ├──────┼──────────────────┼─────┼──┼──┼───────┼─────┼────┤ │
│ │[👤]  │Discussion about  │Event│12│2 │Active │2/4  │View│ │
│ │Jane  │upcoming events..  │     │  │🔴│       │     │    │ │
│ ├──────┼──────────────────┼─────┼──┼──┼───────┼─────┼────┤ │
│ │[👤]  │Need study partner│Study│3 │0 │Hidden │2/3  │View│ │
│ │Mike  │for midterms...    │     │  │  │       │     │    │ │
│ └───────────────────────────────────────────────────────┘  │
│                                                              │
│ Showing 1-25 of 150       [Page size: 25▼]   [◀ 1/6 ▶]   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ Click [View]
                     (Navigate to Detail Page)
```

---

### 3. Post Detail Page (2-Column Layout)

```
┌──────────────────────────────────────────────────────────────┐
│ ← Back to Posts                                              │
│ Post Detail                                                  │
├────────────────────────────────┬─────────────────────────────┤
│ LEFT COLUMN (66%)              │ RIGHT SIDEBAR (33%)         │
│                                │                             │
│ ┌────────────────────────────┐ │ ┌─────────────────────────┐ │
│ │ 📝 POST CONTENT            │ │ │ ⚡ MODERATION ACTIONS  │ │
│ ├────────────────────────────┤ │ ├─────────────────────────┤ │
│ │ [👤] John Doe              │ │ │ [👁‍🗨 Hide Post]        │ │
│ │ ST001 • 2/6/24 10:30      │ │ │                         │ │
│ │ ──────────                 │ │ │ [🗑 Delete Post]       │ │
│ │                            │ │ │                         │ │
│ │ Lorem ipsum dolor sit amet,│ │ │ ───────────            │ │
│ │ consectetur adipiscing     │ │ │                         │ │
│ │ elit. Sed do eiusmod...   │ │ │ [👤 View Author]       │ │
│ │                            │ │ └─────────────────────────┘ │
│ │ ───────────                │ │                             │
│ │ 💬 5 comments 👁 120 views│ │ ┌─────────────────────────┐ │
│ └────────────────────────────┘ │ │ ℹ️ POST INFORMATION    │ │
│                                │ ├─────────────────────────┤ │
│ ┌────────────────────────────┐ │ │ Topic: Technology       │ │
│ │ 💬 COMMENTS (5)            │ │ │ Created: 2/6/24 10:30  │ │
│ ├────────────────────────────┤ │ │ Status: [Active]       │ │
│ │ [👤] Alice                 │ │ └─────────────────────────┘ │
│ │ Great post! Thanks for...  │ │                             │
│ │ 2h ago                     │ │ ┌─────────────────────────┐ │
│ ├────────────────────────────┤ │ │ 📝 ADMIN NOTES         │ │
│ │ [👤] Bob                   │ │ ├─────────────────────────┤ │
│ │ I agree with this...       │ │ │ Internal notes          │ │
│ │ 1h ago                     │ │ │ (admins only)           │ │
│ └────────────────────────────┘ │ │ ┌─────────────────────┐ │ │
│                                │ │ │                     │ │ │
│ ┌────────────────────────────┐ │ │ │                     │ │ │
│ │ ⚠️ REPORTS (2)            │ │ │ └─────────────────────┘ │ │
│ ├────────────────────────────┤ │ │ [Save Notes]            │ │
│ │ User1: "Spam content"      │ │ └─────────────────────────┘ │
│ │ 1h ago                     │ │                             │
│ ├────────────────────────────┤ │                             │
│ │ User2: "Inappropriate"     │ │                             │
│ │ 30m ago                    │ │                             │
│ └────────────────────────────┘ │                             │
└────────────────────────────────┴─────────────────────────────┘
```

---

### 4. Reports Page (List + Modal Pattern)

```
┌─────────────────────────────────────────────────────────────┐
│ Content Reports                                              │
│ Review and moderate reported posts from the community        │
├─────────────────────────────────────────────────────────────┤
│ ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│ │⚠️ Pending  │ │✅ Resolved │ │🔥 Urgent   │              │
│ │    12      │ │    45      │ │     3      │              │
│ └────────────┘ └────────────┘ └────────────┘              │
├─────────────────────────────────────────────────────────────┤
│ [🔍 Search...] [Status ▼] [Category ▼]        [Clear]     │
├─────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────┐  │
│ │Reporter│Post Content│Author│Category│#│Status│Date│   │  │
│ ├────────┼────────────┼──────┼────────┼─┼──────┼────┼───┤  │
│ │[👤]    │Spam link...│[👤]  │Spam    │3│Pend. │2/6 │Rev│  │
│ │User1   │            │John  │        │ │      │    │iew│  │
│ ├────────┼────────────┼──────┼────────┼─┼──────┼────┼───┤  │
│ │[👤]    │Offensive...│[👤]  │Harass. │1│Pend. │2/5 │Rev│  │
│ │User2   │            │Jane  │        │ │      │    │iew│  │
│ └───────────────────────────────────────────────────────┘  │
│                                                              │
│ Showing 1-25 of 80        [Page size: 25▼]   [◀ 1/4 ▶]   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ Click [Review]
                    ┌────────────────────┐
                    │  Review Report     │
                    │ ┌────────────────┐ │
                    │ │ ⚠️ 3 Reports   │ │
                    │ │ Category: Spam │ │
                    │ │ Reason: Promo. │ │
                    │ └────────────────┘ │
                    │                    │
                    │ Reported Post:     │
                    │ ┌────────────────┐ │
                    │ │ [👤] John Doe  │ │
                    │ │ Lorem ipsum... │ │
                    │ └────────────────┘ │
                    │                    │
                    │ Action: [Select ▼]│
                    │ ├ Dismiss        │ │
                    │ ├ Hide Post      │ │
                    │ ├ Delete Post    │ │
                    │ └ Ban Author     │ │
                    │                    │
                    │ Notes: [______]    │
                    │                    │
                    │ [Cancel][Confirm]  │
                    └────────────────────┘
```

---

## Component Hierarchy

### Topics Page
```
TopicsPage
├── PageHeader
│   └── Button (+ Create Topic)
├── FilterBar
│   ├── Input (Search)
│   ├── Select (Status filter)
│   └── Button (Clear)
├── Table
│   ├── TableHeader
│   ├── TableBody
│   │   └── TableRow (for each topic)
│   │       ├── TableCell × 6
│   │       ├── StatusBadge
│   │       └── DropdownMenu
│   │           └── DropdownMenuItem × 3
└── DataTablePagination
└── Dialog (Create/Edit Modal)
    ├── DialogHeader
    ├── Input × 2
    ├── Switch
    └── DialogFooter
        └── Button × 2
```

### Posts List Page
```
PostsListPage
├── PageHeader
├── FilterBar
│   └── Select × 3 (Topic, Status, Reports)
├── Table
│   └── TableRow (for each post)
│       ├── Avatar + Author name
│       ├── Content preview
│       ├── StatusBadge
│       └── Button (View)
└── DataTablePagination
```

### Post Detail Page
```
PostDetailPage
├── PageHeader (with back button)
└── Grid (2 columns)
    ├── Left Column
    │   ├── Card (Post Content)
    │   │   ├── Avatar + Author info
    │   │   ├── StatusBadge
    │   │   ├── Post text
    │   │   └── Stats
    │   ├── Card (Comments)
    │   │   └── Comment × N
    │   │       ├── Avatar
    │   │       └── Comment text
    │   └── Card (Reports) [conditional]
    │       └── Report × N
    └── Right Sidebar
        ├── Card (Moderation Actions)
        │   ├── Button (Hide Post)
        │   ├── Button (Delete Post)
        │   └── Button (View Author)
        ├── Card (Post Information)
        │   ├── Topic
        │   ├── Created date
        │   └── StatusBadge
        └── Card (Admin Notes)
            ├── Textarea
            └── Button (Save)
```

### Reports Page
```
ReportsPage
├── PageHeader
├── Stats Cards × 3
├── FilterBar
│   └── Select × 2 (Status, Category)
├── Table
│   └── TableRow (for each report)
│       ├── Avatar (Reporter)
│       ├── Avatar (Post Author)
│       ├── Badge (Category)
│       ├── Badge (Status)
│       └── Button (Review)
├── DataTablePagination
└── Dialog (Review Modal)
    ├── Alert box (Report info)
    ├── Post preview
    ├── Select (Moderation action)
    ├── Textarea (Admin notes)
    └── Button × 2
```

---

## Color Legend

### Status Colors
```
🟢 Active    → Green badge  (Posts, Topics)
⚪ Inactive  → Gray badge   (Topics)
⚫ Hidden    → Gray badge   (Posts)
🔴 Deleted   → Red badge    (Posts)
🟡 Pending   → Orange badge (Reports)
🟢 Resolved  → Green badge  (Reports)
```

### Action Colors
```
🔵 Primary   → Blue solid button    (Create, Save, Confirm)
⚪ Secondary → White outline button (Cancel, View, Edit)
🔴 Danger    → Red solid button     (Delete, Ban)
```

### Icon Usage
```
🔍 Search    → Search input
🔔 Filter    → Filter dropdown
✖️ Clear     → Clear filters
➕ Plus      → Create action
👁️ Eye       → View/visibility
👁‍🗨 EyeOff   → Hide action
🗑️ Trash     → Delete action
💬 Comment   → Comment count
🚩 Flag      → Report count/indicator
⚠️ Warning   → Alert/report box
✅ Check     → Success/resolved
⋮  More      → Actions menu
◀️ ▶️ Arrows  → Navigation
👤 User      → User profile
```

---

## Interaction Flows

### Create Topic Flow
```
1. [+ Create Topic] button clicked
2. Modal opens with empty form
3. User fills: Name*, Description, Active toggle
4. [Create] button → API call
5. Modal closes
6. Table refreshes with new topic
7. Success toast (not implemented)
```

### Moderate Post Flow
```
1. Browse Posts List
2. Click [View] on reported post
3. Detail page loads
4. Review post + comments + reports
5. Click [Hide Post] or [Delete Post]
6. Confirmation dialog appears
7. [Confirm] → API call
8. Status updated
9. Navigate back to list
```

### Review Report Flow
```
1. Browse Reports List
2. Click [Review] on pending report
3. Modal opens with report details
4. Review reported post content
5. Select moderation action (dropdown)
6. Add admin notes (optional)
7. [Confirm & Resolve] → API call
8. Modal closes
9. Report status updated to "Resolved"
10. Table refreshes
```

---

## Responsive Breakpoints (Future)

```
Mobile (<768px):
├── Tables → Vertical card lists
├── Filters → Bottom sheet
├── Modals → Full screen
└── Sidebar → Stacked below content

Tablet (768-1024px):
├── Tables → Fewer columns
├── Detail → Narrower sidebar
└── All features accessible

Desktop (>1024px):
└── Current design (optimal)
```

---

## Empty States

### No Data
```
┌───────────────────────────┐
│                           │
│     [📄 Icon]            │
│                           │
│   No topics found         │
│                           │
│   Create your first topic │
│   to get started          │
│                           │
│   [+ Create Topic]        │
│                           │
└───────────────────────────┘
```

### No Search Results
```
┌───────────────────────────┐
│                           │
│     [🔍 Icon]            │
│                           │
│   No results found        │
│                           │
│   Try different filters   │
│                           │
│   [Clear Filters]         │
│                           │
└───────────────────────────┘
```

---

## Loading States (Not Implemented)

```
┌───────────────────────────┐
│ ▓▓▓▓▓░░░░░░░░░░░░░░░     │ Skeleton row
│ ▓▓▓▓▓░░░░░░░░░░░░░░░     │ Skeleton row
│ ▓▓▓▓▓░░░░░░░░░░░░░░░     │ Skeleton row
└───────────────────────────┘
```

---

*Visual guide for Community Module wireframe*  
*All layouts are low-fidelity, no actual content/data*
