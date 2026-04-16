import { Badge } from '@/components/ui/badge';

type StatusType = 'active' | 'inactive' | 'pending' | 'hidden' | 'deleted' | 'resolved';

interface StatusBadgeProps {
  status: StatusType;
}

const statusConfig: Record<StatusType, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Active', variant: 'default' },
  inactive: { label: 'Inactive', variant: 'secondary' },
  pending: { label: 'Pending', variant: 'outline' },
  hidden: { label: 'Hidden', variant: 'secondary' },
  deleted: { label: 'Deleted', variant: 'destructive' },
  resolved: { label: 'Resolved', variant: 'default' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}
