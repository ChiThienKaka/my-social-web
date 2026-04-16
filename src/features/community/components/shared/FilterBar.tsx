import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterBarProps {
  searchPlaceholder?: string;
  filters?: FilterOption[];
  onSearch?: (value: string) => void;
  onFilterChange?: (filterId: string, value: string) => void;
  onClearFilters?: () => void;
}

interface FilterOption {
  id: string;
  label: string;
  options: { value: string; label: string }[];
}

export function FilterBar({
  searchPlaceholder = 'Search...',
  filters = [],
  onSearch,
  onFilterChange,
  onClearFilters,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[280px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder={searchPlaceholder}
          className="pl-10"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      {/* Filter Dropdowns */}
      {filters.map((filter) => (
        <Select
          key={filter.id}
          onValueChange={(value) => onFilterChange?.(filter.id, value)}
        >
          <SelectTrigger className="w-[180px]">
            <Filter size={16} className="mr-2" />
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {/* Clear Filters */}
      {filters.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-gray-600"
        >
          <X size={16} className="mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
