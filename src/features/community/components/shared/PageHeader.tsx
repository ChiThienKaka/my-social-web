import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
  backButton?: {
    label: string;
    onClick: () => void;
  };
}

export function PageHeader({ title, description, action, backButton }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        {backButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={backButton.onClick}
            className="mb-2 -ml-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            {backButton.label}
          </Button>
        )}
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
      </div>

      {action && (
        <Button onClick={action.onClick}>
          {action.icon}
          {action.label}
        </Button>
      )}
    </div>
  );
}
