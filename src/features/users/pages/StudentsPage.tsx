import { useState, useEffect } from 'react';
import { Ban, UserCheck, UserX, Eye, GraduationCap } from 'lucide-react';
import { PageHeader } from '../../community/components/shared/PageHeader';
import { FilterBar } from '../../community/components/shared/FilterBar';
import { DataTablePagination } from '../../community/components/shared/DataTablePagination';
import { StatusBadge } from '../../community/components/shared/StatusBadge';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { studentsService, type Student } from '../services/crudService';

export function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalItems, setTotalItems] = useState(0);

  // Filter state
  const [filters, setFilters] = useState({
    status: 'all',
    major: 'all',
    year: 'all',
    search: '',
  });

  const totalPages = Math.ceil(totalItems / pageSize);

  // Get unique majors and years for filters
  const majors = Array.from(new Set(students.map((s) => s.major)));
  const years = Array.from(new Set(students.map((s) => s.year)));

  // Load students
  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const result = await studentsService.getAll({
        status: filters.status !== 'all' ? filters.status : undefined,
        major: filters.major !== 'all' ? filters.major : undefined,
        year: filters.year !== 'all' ? filters.year : undefined,
        search: filters.search || undefined,
        page: currentPage,
        pageSize,
      });
      setStudents(result.students);
      setTotalItems(result.total);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [currentPage, pageSize, filters]);

  // Handle ban/unban
  const handleBanStudent = async () => {
    if (!selectedStudent) return;

    try {
      await studentsService.ban(selectedStudent.id);
      setIsBanDialogOpen(false);
      setSelectedStudent(null);
      loadStudents();
    } catch (error) {
      console.error('Failed to ban student:', error);
    }
  };

  const handleUnbanStudent = async (student: Student) => {
    try {
      await studentsService.unban(student.id);
      loadStudents();
    } catch (error) {
      console.error('Failed to unban student:', error);
    }
  };

  const openProfileDrawer = (student: Student) => {
    setSelectedStudent(student);
    setIsProfileDrawerOpen(true);
  };

  const openBanDialog = (student: Student) => {
    setSelectedStudent(student);
    setIsBanDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Students Management"
        description="Manage student accounts, view profiles, and handle account status"
      />

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search by name, email, or student ID..."
        filters={[
          {
            id: 'status',
            label: 'Status',
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'banned', label: 'Banned' },
            ],
          },
          {
            id: 'major',
            label: 'Major',
            options: [
              { value: 'all', label: 'All Majors' },
              ...majors.map((m) => ({ value: m, label: m })),
            ],
          },
          {
            id: 'year',
            label: 'Year',
            options: [
              { value: 'all', label: 'All Years' },
              ...years.map((y) => ({ value: y, label: y })),
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
          setFilters({ status: 'all', major: 'all', year: 'all', search: '' });
          setCurrentPage(1);
        }}
      />

      {/* Students Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Student</TableHead>
              <TableHead className="w-[150px]">Student ID</TableHead>
              <TableHead className="w-[180px]">Email</TableHead>
              <TableHead className="w-[150px]">Major</TableHead>
              <TableHead className="w-[100px]">Year</TableHead>
              <TableHead className="w-[120px]">Skills</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[140px]">Activity</TableHead>
              <TableHead className="w-[120px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center text-gray-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center text-gray-500">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => {
                const displayName = student.full_name || student.name || "Sinh viên";
                return (
                  <TableRow key={student.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>{displayName[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{displayName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{student.studentId}</TableCell>
                    <TableCell className="text-gray-600">{student.email}</TableCell>
                    <TableCell className="text-gray-600">{student.major}</TableCell>
                    <TableCell className="text-gray-600">{student.year}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {student.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {student.skills.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{student.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={student.status === 'active' ? 'active' : 'inactive'} />
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      <div>{student.postCount} posts</div>
                      <div className="text-xs">{student.commentCount} comments</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openProfileDrawer(student)}
                        >
                          <Eye size={14} className="mr-1" />
                          View
                        </Button>
                        {student.status === 'active' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openBanDialog(student)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Ban size={14} />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnbanStudent(student)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <UserCheck size={14} />
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

      {/* Student Profile Drawer */}
      <Dialog open={isProfileDrawerOpen} onOpenChange={setIsProfileDrawerOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
            <DialogDescription>View detailed student information</DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6 py-4">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedStudent.avatar} />
                  <AvatarFallback className="text-2xl">
                    {(selectedStudent.full_name || selectedStudent.name || "S")[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">
                    {selectedStudent.full_name || selectedStudent.name}
                  </h3>
                  <p className="text-gray-600">{selectedStudent.email}</p>
                  <div className="mt-2">
                    <StatusBadge
                      status={selectedStudent.status === 'active' ? 'active' : 'inactive'}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Student ID</Label>
                  <div className="font-medium">{selectedStudent.studentId}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Phone</Label>
                  <div className="font-medium">{selectedStudent.phone || 'N/A'}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Major</Label>
                  <div className="font-medium">{selectedStudent.major}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Year</Label>
                  <div className="font-medium">{selectedStudent.year}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Joined</Label>
                  <div className="font-medium">{selectedStudent.createdAt}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Last Login</Label>
                  <div className="font-medium">{selectedStudent.lastLoginAt || 'Never'}</div>
                </div>
              </div>

              <Separator />

              {/* Skills */}
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Activity Stats */}
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Activity Statistics</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-gray-200 p-3">
                    <div className="text-sm text-gray-600">Posts</div>
                    <div className="text-2xl font-bold">{selectedStudent.postCount}</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3">
                    <div className="text-sm text-gray-600">Comments</div>
                    <div className="text-2xl font-bold">{selectedStudent.commentCount}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            {selectedStudent?.status === 'active' ? (
              <Button
                variant="destructive"
                onClick={() => {
                  setIsProfileDrawerOpen(false);
                  openBanDialog(selectedStudent);
                }}
              >
                <Ban size={16} className="mr-2" />
                Ban Student
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setIsProfileDrawerOpen(false);
                  handleUnbanStudent(selectedStudent!);
                }}
              >
                <UserCheck size={16} className="mr-2" />
                Unban Student
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsProfileDrawerOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ban Confirmation Dialog */}
      <AlertDialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ban Student?</AlertDialogTitle>
            <AlertDialogDescription>
            Are you sure you want to ban "
            {selectedStudent?.full_name || selectedStudent?.name}"? They will
            not be able to access the platform until unbanned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBanStudent}
              className="bg-red-600 hover:bg-red-700"
            >
              Ban Student
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
