// Mock data for Community module

export interface Topic {
  id: string;
  name: string;
  description: string;
  postCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    name?: string;
    full_name?: string;
    avatar: string;
    studentId: string;
  };
  topic: {
    id: string;
    name: string;
  };
  commentCount: number;
  reportCount: number;
  viewCount: number;
  status: 'active' | 'hidden' | 'deleted';
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name?: string;
    full_name?: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
}

export interface Report {
  id: string;
  postId: string;
  reporter: {
    id: string;
    name?: string;
    full_name?: string;
    avatar: string;
  };
  postAuthor: {
    id: string;
    name?: string;
    full_name?: string;
    avatar: string;
  };
  postContent: string;
  reason: string;
  category: 'spam' | 'harassment' | 'inappropriate' | 'misinformation' | 'other';
  status: 'pending' | 'resolved';
  createdAt: string;
}

// Mock Topics Data
export const mockTopics: Topic[] = [
  {
    id: '1',
    name: 'Technology & Innovation',
    description: 'Discuss latest tech trends, programming, and innovation',
    postCount: 245,
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-05',
  },
  {
    id: '2',
    name: 'Campus Events',
    description: 'Share and discuss upcoming campus events and activities',
    postCount: 128,
    status: 'active',
    createdAt: '2024-01-10',
    updatedAt: '2024-02-04',
  },
  {
    id: '3',
    name: 'Study Groups',
    description: 'Find study partners and collaborate on assignments',
    postCount: 89,
    status: 'active',
    createdAt: '2024-01-08',
    updatedAt: '2024-02-03',
  },
  {
    id: '4',
    name: 'Career & Jobs',
    description: 'Job opportunities, internships, and career advice',
    postCount: 156,
    status: 'active',
    createdAt: '2024-01-12',
    updatedAt: '2024-02-05',
  },
  {
    id: '5',
    name: 'Sports & Fitness',
    description: 'Sports events, fitness tips, and workout routines',
    postCount: 67,
    status: 'inactive',
    createdAt: '2023-12-20',
    updatedAt: '2024-01-15',
  },
];

// Mock Posts Data
export const mockPosts: Post[] = [
  {
    id: '1',
    content: 'Just finished building a React admin dashboard! Used shadcn/ui components and it looks amazing. Anyone else working on similar projects? Would love to share tips and tricks.',
    author: {
      id: 'user1',
      name: 'John Doe',
      avatar: '',
      studentId: 'ST001',
    },
    topic: {
      id: '1',
      name: 'Technology & Innovation',
    },
    commentCount: 12,
    reportCount: 0,
    viewCount: 245,
    status: 'active',
    createdAt: '2024-02-06 10:30',
    updatedAt: '2024-02-06 10:30',
  },
  {
    id: '2',
    content: 'Upcoming hackathon next week! Looking for teammates who are good at backend development. We need 2 more people. DM if interested!',
    author: {
      id: 'user2',
      name: 'Jane Smith',
      avatar: '',
      studentId: 'ST002',
    },
    topic: {
      id: '2',
      name: 'Campus Events',
    },
    commentCount: 8,
    reportCount: 2,
    viewCount: 189,
    status: 'active',
    createdAt: '2024-02-05 14:20',
    updatedAt: '2024-02-05 14:20',
  },
  {
    id: '3',
    content: 'Need help with calculus homework. Chapter 5 is really confusing. Anyone available to study together this weekend?',
    author: {
      id: 'user3',
      name: 'Mike Johnson',
      avatar: '',
      studentId: 'ST003',
    },
    topic: {
      id: '3',
      name: 'Study Groups',
    },
    commentCount: 5,
    reportCount: 0,
    viewCount: 98,
    status: 'active',
    createdAt: '2024-02-04 09:15',
    updatedAt: '2024-02-04 09:15',
  },
  {
    id: '4',
    content: 'Check out this amazing internship opportunity at Google! They are looking for software engineering interns. Application deadline is next month.',
    author: {
      id: 'user4',
      name: 'Sarah Williams',
      avatar: '',
      studentId: 'ST004',
    },
    topic: {
      id: '4',
      name: 'Career & Jobs',
    },
    commentCount: 23,
    reportCount: 1,
    viewCount: 456,
    status: 'active',
    createdAt: '2024-02-03 16:45',
    updatedAt: '2024-02-03 16:45',
  },
  {
    id: '5',
    content: 'This is spam content with promotional links. Please ignore this post.',
    author: {
      id: 'user5',
      name: 'Spam User',
      avatar: '',
      studentId: 'ST005',
    },
    topic: {
      id: '1',
      name: 'Technology & Innovation',
    },
    commentCount: 0,
    reportCount: 5,
    viewCount: 12,
    status: 'hidden',
    createdAt: '2024-02-02 11:00',
    updatedAt: '2024-02-02 15:30',
  },
];

// Mock Comments Data
export const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    author: {
      id: 'user6',
      name: 'Alice Brown',
      avatar: '',
    },
    content: 'Great work! I\'m also working on a similar project. Would love to collaborate!',
    createdAt: '2024-02-06 11:00',
  },
  {
    id: '2',
    postId: '1',
    author: {
      id: 'user7',
      name: 'Bob Wilson',
      avatar: '',
    },
    content: 'Which UI library did you use? I\'m considering shadcn/ui as well.',
    createdAt: '2024-02-06 11:30',
  },
  {
    id: '3',
    postId: '2',
    author: {
      id: 'user8',
      name: 'Charlie Davis',
      avatar: '',
    },
    content: 'I\'m interested! I have 3 years of backend experience. Let\'s connect!',
    createdAt: '2024-02-05 15:00',
  },
  {
    id: '4',
    postId: '3',
    author: {
      id: 'user9',
      name: 'Diana Martinez',
      avatar: '',
    },
    content: 'I can help! I\'m free Saturday afternoon. Send me a DM.',
    createdAt: '2024-02-04 10:00',
  },
];

// Mock Reports Data
export const mockReports: Report[] = [
  {
    id: '1',
    postId: '2',
    reporter: {
      id: 'user10',
      name: 'Emma Thompson',
      avatar: '',
    },
    postAuthor: {
      id: 'user2',
      name: 'Jane Smith',
      avatar: '',
    },
    postContent: 'Upcoming hackathon next week! Looking for teammates...',
    reason: 'This post contains promotional content and spam links',
    category: 'spam',
    status: 'pending',
    createdAt: '2024-02-05 16:00',
  },
  {
    id: '2',
    postId: '2',
    reporter: {
      id: 'user11',
      name: 'Frank Lee',
      avatar: '',
    },
    postAuthor: {
      id: 'user2',
      name: 'Jane Smith',
      avatar: '',
    },
    postContent: 'Upcoming hackathon next week! Looking for teammates...',
    reason: 'Suspicious activity, possible scam',
    category: 'spam',
    status: 'pending',
    createdAt: '2024-02-05 17:30',
  },
  {
    id: '3',
    postId: '4',
    reporter: {
      id: 'user12',
      name: 'Grace Chen',
      avatar: '',
    },
    postAuthor: {
      id: 'user4',
      name: 'Sarah Williams',
      avatar: '',
    },
    postContent: 'Check out this amazing internship opportunity at Google!...',
    reason: 'Misleading information about job opportunities',
    category: 'misinformation',
    status: 'pending',
    createdAt: '2024-02-03 18:00',
  },
  {
    id: '4',
    postId: '5',
    reporter: {
      id: 'user13',
      name: 'Henry Taylor',
      avatar: '',
    },
    postAuthor: {
      id: 'user5',
      name: 'Spam User',
      avatar: '',
    },
    postContent: 'This is spam content with promotional links...',
    reason: 'Obvious spam content',
    category: 'spam',
    status: 'resolved',
    createdAt: '2024-02-02 12:00',
  },
];
