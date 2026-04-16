import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Eye, CheckCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FilterBar } from '@/components/shared/FilterBar';
import { DataTablePagination } from '@/components/shared/DataTablePagination';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { reportsService, statsService } from '../services/crudService';
import type { Report } from '../data/mockData';

export function ReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    resolved: 0,
    resolvedToday: 0,
    urgent: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [moderationAction, setModerationAction] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // Filter state
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: '',
  });

  const totalPages = Math.ceil(totalItems / pageSize);

  // Load stats
  const loadStats = async () => {
    try {
      const data = await statsService.getReportsStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  // Load reports
  const loadReports = async () => {
    setIsLoading(true);
    try {
      const result = await reportsService.getAll({
        status: filters.status !== 'all' ? filters.status : undefined,
        category: filters.category !== 'all' ? filters.category : undefined,
        search: filters.search || undefined,
        page: currentPage,
        pageSize,
      });
      setReports(result.reports);
      setTotalItems(result.total);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadReports();
  }, [currentPage, pageSize, filters]);

  // Refresh stats after resolving
  useEffect(() => {
    if (!isDetailModalOpen) {
      loadStats();
    }
  }, [isDetailModalOpen]);

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setModerationAction('');
    setAdminNotes('');
    setIsDetailModalOpen(true);
  };

  const handleResolveReport = async () => {
    if (!selectedReport || !moderationAction) return;

    try {
      await reportsService.resolve(selectedReport.id, {
        moderationAction,
        adminNotes: adminNotes || undefined,
      });
      setIsDetailModalOpen(false);
      setSelectedReport(null);
      setModerationAction('');
      setAdminNotes('');
      loadReports();
    } catch (error) {
      console.error('Failed to resolve report:', error);
    }
  };

  // Get report count for a post
  const getReportCountForPost = (postId: string) => {
    return reports.filter((r) => r.postId === postId).length;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Content Reports"
        description="Review and moderate reported posts from the community"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertTriangle size={16} className="text-orange-500" />
            Pending Reports
          </div>
          <div className="mt-2 text-2xl font-bold">{stats.pending}</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle size={16} className="text-green-500" />
            Resolved Today
          </div>
          <div className="mt-2 text-2xl font-bold">{stats.resolvedToday}</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Eye size={16} className="text-blue-500" />
            Requires Attention
          </div>
          <div className="mt-2 text-2xl font-bold">{stats.urgent}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search reports..."
        filters={[
          {
            id: 'status',
            label: 'Status',
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'resolved', label: 'Resolved' },
            ],
          },
          {
            id: 'category',
            label: 'Category',
            options: [
              { value: 'all', label: 'All Categories' },
              { value: 'spam', label: 'Spam' },
              { value: 'harassment', label: 'Harassment' },
              { value: 'inappropriate', label: 'Inappropriate Content' },
              { value: 'misinformation', label: 'Misinformation' },
              { value: 'other', label: 'Other' },
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
          setFilters({ status: 'all', category: 'all', search: '' });
          setCurrentPage(1);
        }}
      />

      {/* Reports Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Reporter</TableHead>
              <TableHead>Post Content</TableHead>
              <TableHead className="w-[180px]">Post Author</TableHead>
              <TableHead className="w-[140px]">Category</TableHead>
              <TableHead className="w-[100px]">Reports</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px]">Reported</TableHead>
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
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-gray-500">
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => {
                const reportCount = getReportCountForPost(report.postId);
                const reporterName =
                  report.reporter.full_name || report.reporter.name || "U";
                const authorName =
                  report.postAuthor.full_name || report.postAuthor.name || "U";
                return (
                  <TableRow
                    key={report.id}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={report.reporter.avatar} />
                          <AvatarFallback>{reporterName[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {reporterName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-gray-600">
                      {report.postContent}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={report.postAuthor.avatar} />
                          <AvatarFallback>{authorName[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{authorName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {reportCount > 1 ? (
                        <span className="font-semibold text-red-600">{reportCount}</span>
                      ) : (
                        <span className="text-gray-600">1</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {report.status === 'pending' ? (
                        <Badge variant="outline" className="border-orange-500 text-orange-700">
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-green-500 text-green-700">
                          Resolved
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600">{report.createdAt}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewReport(report)}
                      >
                        Review
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

      {/* Report Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Report</DialogTitle>
            <DialogDescription>
              Take appropriate moderation action on this reported content
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 py-4">
              {/* Report Info */}
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-orange-900">
                      {getReportCountForPost(selectedReport.postId)}{' '}
                      {getReportCountForPost(selectedReport.postId) === 1 ? 'Report' : 'Reports'}
                    </div>
                    <div className="text-sm text-orange-700 mt-1">
                      Category: <span className="font-medium">{selectedReport.category}</span>
                    </div>
                    <div className="text-sm text-orange-700 mt-2">
                      <strong>Reason:</strong> {selectedReport.reason}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Post Content */}
              <div>
                <Label className="text-base">Reported Post</Label>
                <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedReport.postAuthor.avatar} />
                      <AvatarFallback>
                        {(selectedReport.postAuthor.full_name ||
                          selectedReport.postAuthor.name ||
                          "U")[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {selectedReport.postAuthor.full_name ||
                        selectedReport.postAuthor.name}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedReport.postContent}
                  </p>
                </div>
                <Button
                  variant="link"
                  className="mt-2 p-0 h-auto"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    navigate(`/admin/community/posts/${selectedReport.postId}`);
                  }}
                >
                  <Eye size={14} className="mr-1" />
                  View Full Post
                </Button>
              </div>

              <Separator />

              {/* Moderation Action */}
              <div className="space-y-3">
                <Label>Moderation Action *</Label>
                <Select value={moderationAction} onValueChange={setModerationAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dismiss">Dismiss Report</SelectItem>
                    <SelectItem value="hide">Hide Post</SelectItem>
                    <SelectItem value="delete">Delete Post</SelectItem>
                    <SelectItem value="warn">Warn Author</SelectItem>
                    <SelectItem value="ban">Ban Author</SelectItem>
                  </SelectContent>
                </Select>

                <div>
                  <Label htmlFor="admin-notes">Admin Notes (Internal)</Label>
                  <Textarea
                    id="admin-notes"
                    placeholder="Add notes about your decision..."
                    className="mt-2"
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResolveReport} disabled={!moderationAction}>
              Confirm & Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
