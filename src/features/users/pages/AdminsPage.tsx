import { useState, useEffect } from 'react';
import { Plus, Shield, ShieldCheck, ShieldAlert, UserX, UserCheck, MoreVertical } from 'lucide-react';
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
  DialogFooter,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { adminsService, type Admin } from '../services/crudService';

export function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalItems, setTotalItems] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'MODERATOR' as 'ADMIN' | 'MODERATOR',
  });

  // Filter state
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    search: '',
  });

  const totalPages = Math.ceil(totalItems / pageSize);

  // Load admins
  const loadAdmins = async () => {
    setIsLoading(true);
    try {
      const result = await adminsService.getAll({
        role: filters.role !== 'all' ? filters.role : undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        search: filters.search || undefined,
        page: currentPage,
        pageSize,
      });
      setAdmins(result.admins);
      setTotalItems(result.total);
    } catch (error) {
      console.error('Failed to load admins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, [currentPage, pageSize, filters]);

  // Handle create admin
  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.email.trim()) return;

    try {
      await adminsService.create({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdBy: '1', // Current admin ID (mock)
      });
      setIsCreateModalOpen(false);
      setFormData({ name: '', email: '', role: 'MODERATOR' });
      loadAdmins();
    } catch (error) {
      console.error('Failed to create admin:', error);
    }
  };

  // Handle update role
  const handleUpdateRole = async () => {
    if (!selectedAdmin) return;

    try {
      await adminsService.updateRole(selectedAdmin.id, formData.role as any);
      setIsRoleModalOpen(false);
      setSelectedAdmin(null);
      loadAdmins();
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  // Handle disable/enable
  const handleDisable = async () => {
    if (!selectedAdmin) return;

    try {
      await adminsService.disable(selectedAdmin.id);
      setIsDisableDialogOpen(false);
      setSelectedAdmin(null);
      loadAdmins();
    } catch (error) {
      console.error('Failed to disable admin:', error);
    }
  };

  const handleEnable = async (admin: Admin) => {
    try {
      await adminsService.enable(admin.id);
      loadAdmins();
    } catch (error) {
      console.error('Failed to enable admin:', error);
    }
  };

  const openRoleModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setFormData({ ...formData, role: admin.role });
    setIsRoleModalOpen(true);
  };

  const openDisableDialog = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsDisableDialogOpen(true);
  };

  const getRoleIcon = (role: Admin['role']) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <ShieldAlert size={16} className="text-purple-600" />;
      case 'ADMIN':
        return <ShieldCheck size={16} className="text-blue-600" />;
      case 'MODERATOR':
        return <Shield size={16} className="text-gray-600" />;
    }
  };

  const getRoleBadge = (role: Admin['role']) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-700">
            Super Admin
          </Badge>
        );
      case 'ADMIN':
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            Admin
          </Badge>
        );
      case 'MODERATOR':
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-700">
            Moderator
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Admin Accounts"
        description="Manage admin accounts, assign roles, and control access"
        action={{
          label: 'Create Admin',
          icon: <Plus size={18} className="mr-2" />,
          onClick: () => setIsCreateModalOpen(true),
        }}
      />

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search by name or email..."
        filters={[
          {
            id: 'role',
            label: 'Role',
            options: [
              { value: 'all', label: 'All Roles' },
              { value: 'SUPER_ADMIN', label: 'Super Admin' },
              { value: 'ADMIN', label: 'Admin' },
              { value: 'MODERATOR', label: 'Moderator' },
            ],
          },
          {
            id: 'status',
            label: 'Status',
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'disabled', label: 'Disabled' },
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
          setFilters({ role: 'all', status: 'all', search: '' });
          setCurrentPage(1);
        }}
      />

      {/* Admins Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Admin</TableHead>
              <TableHead className="w-[180px]">Email</TableHead>
              <TableHead className="w-[140px]">Role</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[140px]">Last Login</TableHead>
              <TableHead className="w-[120px]">Created</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                  No admins found
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => {
                const displayName = admin.full_name || admin.name || "Admin";
                return (
                  <TableRow key={admin.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={admin.avatar} />
                          <AvatarFallback>{displayName[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{displayName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{admin.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(admin.role)}
                        {getRoleBadge(admin.role)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={admin.status === 'active' ? 'active' : 'inactive'} />
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {admin.lastLoginAt || 'Never'}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">{admin.createdAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openRoleModal(admin)}>
                            Assign Role
                          </DropdownMenuItem>
                          {admin.status === 'active' ? (
                            <DropdownMenuItem
                              onClick={() => openDisableDialog(admin)}
                              className="text-red-600"
                            >
                              <UserX size={14} className="mr-2" />
                              Disable
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleEnable(admin)}>
                              <UserCheck size={14} className="mr-2" />
                              Enable
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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

      {/* Create Admin Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Admin Account</DialogTitle>
            <DialogDescription>
              Add a new admin account with appropriate role and permissions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Full Name *</Label>
              <Input
                id="create-name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-email">Email *</Label>
              <Input
                id="create-email"
                type="email"
                placeholder="admin@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value as 'ADMIN' | 'MODERATOR' })
                }
              >
                <SelectTrigger id="create-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MODERATOR">Moderator</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Super Admin role can only be assigned manually
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formData.name.trim() || !formData.email.trim()}
            >
              Create Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Role Modal */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Change role for "{selectedAdmin?.full_name || selectedAdmin?.name}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role-select">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value as any })
                }
              >
                <SelectTrigger id="role-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MODERATOR">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable Confirmation Dialog */}
      <AlertDialog open={isDisableDialogOpen} onOpenChange={setIsDisableDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disable Admin Account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disable "
              {selectedAdmin?.full_name || selectedAdmin?.name}"? They will not
              be able to access the admin panel until re-enabled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisable}
              className="bg-red-600 hover:bg-red-700"
            >
              Disable
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
