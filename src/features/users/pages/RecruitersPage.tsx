import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Ban, UserCheck, Building2 } from 'lucide-react';
import { PageHeader } from '../../community/components/shared/PageHeader';
import { FilterBar } from '../../community/components/shared/FilterBar';
import { DataTablePagination } from '../../community/components/shared/DataTablePagination';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { recruitersService, type Recruiter } from '../services/crudService';

export function RecruitersPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalItems, setTotalItems] = useState(0);

  // Filter state
  const [filters, setFilters] = useState({
    status: 'all',
    subscriptionStatus: 'all',
    search: '',
  });

  const totalPages = Math.ceil(totalItems / pageSize);

  // Load recruiters
  const loadRecruiters = async () => {
    setIsLoading(true);
    try {
      const result = await recruitersService.getAll({
        status: filters.status !== 'all' ? filters.status : undefined,
        subscriptionStatus:
          filters.subscriptionStatus !== 'all' ? filters.subscriptionStatus : undefined,
        search: filters.search || undefined,
        page: currentPage,
        pageSize,
      });
      setRecruiters(result.recruiters);
      setTotalItems(result.total);
    } catch (error) {
      console.error('Failed to load recruiters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecruiters();
  }, [currentPage, pageSize, filters]);

  // Handle verify
  const handleVerify = async () => {
    if (!selectedRecruiter) return;

    try {
      await recruitersService.verify(selectedRecruiter.id);
      setIsVerifyDialogOpen(false);
      setSelectedRecruiter(null);
      loadRecruiters();
    } catch (error) {
      console.error('Failed to verify recruiter:', error);
    }
  };

  // Handle reject
  const handleReject = async () => {
    if (!selectedRecruiter) return;

    try {
      await recruitersService.reject(selectedRecruiter.id);
      setIsRejectDialogOpen(false);
      setSelectedRecruiter(null);
      loadRecruiters();
    } catch (error) {
      console.error('Failed to reject recruiter:', error);
    }
  };

  // Handle suspend/unsuspend
  const handleSuspend = async () => {
    if (!selectedRecruiter) return;

    try {
      await recruitersService.suspend(selectedRecruiter.id);
      setIsSuspendDialogOpen(false);
      setSelectedRecruiter(null);
      loadRecruiters();
    } catch (error) {
      console.error('Failed to suspend recruiter:', error);
    }
  };

  const handleUnsuspend = async (recruiter: Recruiter) => {
    try {
      await recruitersService.unsuspend(recruiter.id);
      loadRecruiters();
    } catch (error) {
      console.error('Failed to unsuspend recruiter:', error);
    }
  };

  const getStatusBadge = (status: Recruiter['status']) => {
    switch (status) {
      case 'verified':
        return (
          <Badge variant="outline" className="border-green-500 text-green-700">
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-700">
            Pending
          </Badge>
        );
      case 'suspended':
        return (
          <Badge variant="outline" className="border-red-500 text-red-700">
            Suspended
          </Badge>
        );
    }
  };

  const getSubscriptionBadge = (status: Recruiter['subscriptionStatus']) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            Active
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-700">
            Expired
          </Badge>
        );
      case 'none':
        return <Badge variant="outline">No Subscription</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Recruiters Management"
        description="Verify, manage, and monitor recruiter accounts and subscriptions"
      />

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search by name, email, or company..."
        filters={[
          {
            id: 'status',
            label: 'Status',
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'verified', label: 'Verified' },
              { value: 'suspended', label: 'Suspended' },
            ],
          },
          {
            id: 'subscriptionStatus',
            label: 'Subscription',
            options: [
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'expired', label: 'Expired' },
              { value: 'none', label: 'No Subscription' },
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
          setFilters({ status: 'all', subscriptionStatus: 'all', search: '' });
          setCurrentPage(1);
        }}
      />

      {/* Recruiters Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Recruiter</TableHead>
              <TableHead className="w-[200px]">Company</TableHead>
              <TableHead className="w-[180px]">Email</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[130px]">Subscription</TableHead>
              <TableHead className="w-[100px]">Job Posts</TableHead>
              <TableHead className="w-[120px]">Joined</TableHead>
              <TableHead className="w-[200px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-gray-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : recruiters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-gray-500">
                  No recruiters found
                </TableCell>
              </TableRow>
            ) : (
              recruiters.map((recruiter) => {
                const displayName = recruiter.full_name || recruiter.name || "Nhà tuyển dụng";
                return (
                  <TableRow key={recruiter.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={recruiter.avatar} />
                          <AvatarFallback>{displayName[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{displayName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-gray-400" />
                        <span className="text-gray-700">{recruiter.company}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{recruiter.email}</TableCell>
                    <TableCell>{getStatusBadge(recruiter.status)}</TableCell>
                    <TableCell>{getSubscriptionBadge(recruiter.subscriptionStatus)}</TableCell>
                    <TableCell className="text-gray-600">{recruiter.jobPostsCount}</TableCell>
                    <TableCell className="text-gray-600">{recruiter.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {recruiter.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRecruiter(recruiter);
                                setIsVerifyDialogOpen(true);
                              }}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle size={14} className="mr-1" />
                              Verify
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRecruiter(recruiter);
                                setIsRejectDialogOpen(true);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle size={14} className="mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {recruiter.status === 'verified' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRecruiter(recruiter);
                              setIsSuspendDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Ban size={14} className="mr-1" />
                            Suspend
                          </Button>
                        )}
                        {recruiter.status === 'suspended' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnsuspend(recruiter)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <UserCheck size={14} className="mr-1" />
                            Unsuspend
                          </Button>
                        )}
                      </div>
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

      {/* Verify Confirmation Dialog */}
      <AlertDialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verify Recruiter?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to verify "
              {selectedRecruiter?.full_name || selectedRecruiter?.name}" from "
              {selectedRecruiter?.company}"? They will be able to post jobs after verification.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleVerify} className="bg-green-600 hover:bg-green-700">
              Verify
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Recruiter?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject "
              {selectedRecruiter?.full_name || selectedRecruiter?.name}"? This will
              remove their account from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suspend Confirmation Dialog */}
      <AlertDialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Recruiter?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend "
              {selectedRecruiter?.full_name || selectedRecruiter?.name}"? They will
              not be able to post jobs until unsuspended.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSuspend}
              className="bg-red-600 hover:bg-red-700"
            >
              Suspend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
