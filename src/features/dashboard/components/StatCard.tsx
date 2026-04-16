import { TrendingUp, TrendingDown, Users, FileText, Clock, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
  color: string;
}

const iconMap: Record<string, React.ReactNode> = {
  users: <Users size={24} />,
  posts: <FileText size={24} />,
  pending: <Clock size={24} />,
  applications: <Briefcase size={24} />,
};

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
};

export function StatCard({ title, value, change, changeType, icon, color }: StatCardProps) {
  const IconComponent = iconMap[icon] || <FileText size={24} />;
  const bgColor = colorMap[color] || 'bg-blue-500';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            <div className="mt-4 flex items-center gap-2">
              {changeType === 'increase' ? (
                <TrendingUp size={16} className="text-green-600" />
              ) : (
                <TrendingDown size={16} className="text-red-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-600">vs last month</span>
            </div>
          </div>
          <div className={`rounded-lg p-3 ${bgColor} text-white`}>{IconComponent}</div>
        </div>
      </CardContent>
    </Card>
  );
}
