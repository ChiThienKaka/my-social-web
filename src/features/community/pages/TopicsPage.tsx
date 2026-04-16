import { useState, useEffect } from 'react';
import { Plus, MoreVertical, TrendingUp, Edit, Trash2, Power } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { topicsService } from '../services/crudService';
import type { Topic } from '../data/mockData';

export function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
  });

  // Filter state
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
  });

  const totalItems = topics.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Load topics
  const loadTopics = async () => {
    setIsLoading(true);
    try {
      const data = await topicsService.getAll({
        status: filters.status !== 'all' ? filters.status : undefined,
        search: filters.search || undefined,
      });
      setTopics(data);
    } catch (error) {
      console.error('Failed to load topics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, [filters]);

  // Handle create
  const handleCreate = async () => {
    if (!formData.name.trim()) return;

    try {
      await topicsService.create({
        name: formData.name,
        description: formData.description,
        status: formData.status,
      });
      setIsCreateModalOpen(false);
      setFormData({ name: '', description: '', status: 'active' });
      loadTopics();
    } catch (error) {
      console.error('Failed to create topic:', error);
    }
  };

  // Handle edit
  const handleEdit = async () => {
    if (!selectedTopic || !formData.name.trim()) return;

    try {
      await topicsService.update(selectedTopic.id, {
        name: formData.name,
        description: formData.description,
        status: formData.status,
      });
      setIsEditModalOpen(false);
      setSelectedTopic(null);
      setFormData({ name: '', description: '', status: 'active' });
      loadTopics();
    } catch (error) {
      console.error('Failed to update topic:', error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedTopic) return;

    try {
      await topicsService.delete(selectedTopic.id);
      setIsDeleteDialogOpen(false);
      setSelectedTopic(null);
      loadTopics();
    } catch (error) {
      console.error('Failed to delete topic:', error);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (topic: Topic) => {
    try {
      await topicsService.toggleStatus(topic.id);
      loadTopics();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  // Open edit modal
  const openEditModal = (topic: Topic) => {
    setSelectedTopic(topic);
    setFormData({
      name: topic.name,
      description: topic.description,
      status: topic.status,
    });
    setIsEditModalOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (topic: Topic) => {
    setSelectedTopic(topic);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Community Topics"
        description="Manage discussion topics and categories for student community"
        action={{
          label: 'Create Topic',
          icon: <Plus size={18} className="mr-2" />,
          onClick: () => setIsCreateModalOpen(true),
        }}
      />

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search topics..."
        filters={[
          {
            id: 'status',
            label: 'Status',
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ],
          },
        ]}
        onSearch={(value) => setFilters({ ...filters, search: value })}
        onFilterChange={(id, value) => {
          if (id === 'status') {
            setFilters({ ...filters, status: value });
          }
        }}
        onClearFilters={() => setFilters({ status: 'all', search: '' })}
      />

      {/* Topics Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Topic Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[120px]">Posts</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[140px]">Created</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : topics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                  No topics found. Create your first topic to get started.
                </TableCell>
              </TableRow>
            ) : (
              topics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="font-medium">{topic.name}</TableCell>
                  <TableCell className="text-gray-600">{topic.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-700">
                      <TrendingUp size={14} />
                      {topic.postCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={topic.status} />
                  </TableCell>
                  <TableCell className="text-gray-600">{topic.createdAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditModal(topic)}>
                          <Edit size={14} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(topic)}>
                          <Power size={14} className="mr-2" />
                          {topic.status === 'active' ? 'Disable' : 'Enable'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(topic)}
                          className="text-red-600"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
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
            onPageSizeChange={setPageSize}
          />
        )}
      </div>

      {/* Create Topic Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Topic</DialogTitle>
            <DialogDescription>
              Add a new discussion topic for the student community
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Topic Name *</Label>
              <Input
                id="create-name"
                placeholder="e.g., Technology & Innovation"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-description">Description</Label>
              <Input
                id="create-description"
                placeholder="Brief description of the topic"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="create-active">Active Status</Label>
              <Switch
                id="create-active"
                checked={formData.status === 'active'}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, status: checked ? 'active' : 'inactive' })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!formData.name.trim()}>
              Create Topic
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Topic Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Topic</DialogTitle>
            <DialogDescription>
              Update topic information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Topic Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Technology & Innovation"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                placeholder="Brief description of the topic"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="edit-active">Active Status</Label>
              <Switch
                id="edit-active"
                checked={formData.status === 'active'}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, status: checked ? 'active' : 'inactive' })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={!formData.name.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Topic?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedTopic?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
