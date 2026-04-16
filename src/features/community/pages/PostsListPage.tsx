import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, MessageSquare } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FilterBar } from '@/components/shared/FilterBar';
import { DataTablePagination } from '@/components/shared/DataTablePagination';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { postsService } from '../services/crudService';
import { topicsService } from '../services/crudService';
import type { Post, Topic } from '../data/mockData';

export function PostsListPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalItems, setTotalItems] = useState(0);

  // Filter state
  const [filters, setFilters] = useState({
    topic: 'all',
    status: 'all',
    reports: 'all',
    search: '',
  });

  const totalPages = Math.ceil(totalItems / pageSize);

  // Load topics for filter
  useEffect(() => {
    topicsService.getAll().then(setTopics);
  }, []);

  // Load posts
  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const result = await postsService.getAll({
        topic: filters.topic !== 'all' ? filters.topic : undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        reports: filters.reports !== 'all' ? filters.reports : undefined,
        search: filters.search || undefined,
        page: currentPage,
        pageSize,
      });
      setPosts(result.posts);
      setTotalItems(result.total);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [currentPage, pageSize, filters]);

  const handleViewPost = (postId: string) => {
    navigate(`/admin/community/posts/${postId}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Community Posts"
        description="Monitor and moderate student posts and discussions"
      />

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search posts by content or author..."
        filters={[
          {
            id: 'topic',
            label: 'Topic',
            options: [
              { value: 'all', label: 'All Topics' },
              ...topics.map((t) => ({ value: t.id, label: t.name })),
            ],
          },
          {
            id: 'status',
            label: 'Status',
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'hidden', label: 'Hidden' },
              { value: 'deleted', label: 'Deleted' },
            ],
          },
          {
            id: 'reports',
            label: 'Reports',
            options: [
              { value: 'all', label: 'All' },
              { value: 'reported', label: 'Has Reports' },
              { value: 'no-reports', label: 'No Reports' },
            ],
          },
        ]}
        onSearch={(value) => {
          setFilters({ ...filters, search: value });
          setCurrentPage(1);
        }}
        onFilterChange={(id, value) => {
          setFilters({ ...filters, [id]: value });
          setCurrentPage(1);
        }}
        onClearFilters={() => {
          setFilters({ topic: 'all', status: 'all', reports: 'all', search: '' });
          setCurrentPage(1);
        }}
      />

      {/* Posts Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Author</TableHead>
              <TableHead>Content Preview</TableHead>
              <TableHead className="w-[140px]">Topic</TableHead>
              <TableHead className="w-[100px]">Comments</TableHead>
              <TableHead className="w-[100px]">Reports</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px]">Created</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-gray-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-gray-500">
                  No posts found
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => {
                const authorName = post.author.full_name || post.author.name || "Người dùng";
                return (
                  <TableRow
                    key={post.id}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{authorName[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{authorName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[400px] truncate text-gray-600">
                      {post.content}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {post.topic.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-700">
                        <MessageSquare size={14} />
                        {post.commentCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.reportCount > 0 ? (
                        <span className="font-medium text-red-600">
                          {post.reportCount}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={post.status} />
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {post.createdAt}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPost(post.id)}
                      >
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalItems > 0 && (
          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
}
