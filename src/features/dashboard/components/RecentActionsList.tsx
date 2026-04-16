import { History, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface RecentAction {
  id: string;
  admin: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'approve' | 'reject';
}

interface RecentActionsListProps {
  actions: RecentAction[];
}

const actionIcons = {
  create: <Plus size={14} className="text-blue-600" />,
  update: <Edit size={14} className="text-orange-600" />,
  delete: <Trash2 size={14} className="text-red-600" />,
  approve: <CheckCircle size={14} className="text-green-600" />,
  reject: <XCircle size={14} className="text-red-600" />,
};

const actionColors = {
  create: 'bg-blue-100 text-blue-700',
  update: 'bg-orange-100 text-orange-700',
  delete: 'bg-red-100 text-red-700',
  approve: 'bg-green-100 text-green-700',
  reject: 'bg-red-100 text-red-700',
};

export function RecentActionsList({ actions }: RecentActionsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History size={20} />
          Recent Admin Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {actions.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No recent actions</div>
        ) : (
          <div className="space-y-3">
            {actions.map((action) => (
              <div key={action.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{action.admin[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {actionIcons[action.type]}
                    <span className="font-medium text-gray-900">{action.admin}</span>
                    <Badge variant="outline" className={actionColors[action.type]}>
                      {action.action}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{action.target}</p>
                  <p className="mt-1 text-xs text-gray-500">{action.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
