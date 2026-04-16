import { Clock, AlertCircle, FileText, Briefcase, User, Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PendingApproval {
  id: string;
  type: 'campus_content' | 'job_post' | 'recruiter' | 'report';
  title: string;
  author: string;
  createdAt: string;
  priority: 'high' | 'medium' | 'low';
}

interface PendingApprovalsListProps {
  approvals: PendingApproval[];
}

const typeIcons = {
  campus_content: <FileText size={16} />,
  job_post: <Briefcase size={16} />,
  recruiter: <User size={16} />,
  report: <Flag size={16} />,
};

const typeLabels = {
  campus_content: 'Campus Content',
  job_post: 'Job Post',
  recruiter: 'Recruiter',
  report: 'Report',
};

const priorityColors = {
  high: 'bg-red-100 text-red-700 border-red-300',
  medium: 'bg-orange-100 text-orange-700 border-orange-300',
  low: 'bg-blue-100 text-blue-700 border-blue-300',
};

export function PendingApprovalsList({ approvals }: PendingApprovalsListProps) {
  const navigate = useNavigate();

  const handleView = (approval: PendingApproval) => {
    switch (approval.type) {
      case 'campus_content':
        navigate('/admin/campus');
        break;
      case 'job_post':
        navigate('/admin/career/jobs');
        break;
      case 'recruiter':
        navigate('/admin/users/recruiters');
        break;
      case 'report':
        navigate('/admin/community/reports');
        break;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock size={20} />
            Pending Approvals
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/community/reports')}>
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {approvals.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No pending approvals</div>
        ) : (
          <div className="space-y-3">
            {approvals.map((approval) => (
              <div
                key={approval.id}
                className="flex items-start justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-gray-600">{typeIcons[approval.type]}</div>
                    <Badge variant="outline" className={priorityColors[approval.priority]}>
                      {approval.priority}
                    </Badge>
                    <span className="text-xs text-gray-500">{typeLabels[approval.type]}</span>
                  </div>
                  <h4 className="mt-1 font-medium text-gray-900">{approval.title}</h4>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                    <span>{approval.author}</span>
                    <span>•</span>
                    <span>{approval.createdAt}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleView(approval)}>
                  Review
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
