import * as React from 'react'
import { Check, ListFilter, Search, SortAsc } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

import type { SortConfig, SortableField, Status, Priority } from '../types'

export interface FilterConfig {
  searchTerm: string
  status: Status[]
  priority: Priority[]
}

interface DataToolbarProps {
  filters: FilterConfig
  onFiltersChange: (filters: FilterConfig) => void
  sortConfig: SortConfig | null
  onSortChange: (config: SortConfig | null) => void
}

const statusOptions: { value: Status; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const sortOptions: { value: SortableField, label: string }[] = [
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'title', label: 'Title' },
  { value: 'status', label: 'Status' },
  { value: 'priority', label: 'Priority' },
  { value: 'metrics.completion', label: 'Progress' },
]


export function DataToolbar({
  filters,
  onFiltersChange,
  sortConfig,
  onSortChange,
}: DataToolbarProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, searchTerm: event.target.value })
  }
  
  const activeFilterCount = filters.status.length + filters.priority.length

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
      {/* Left side: Search, Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9 w-full sm:w-64"
            value={filters.searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 w-full sm:w-auto justify-start border-dashed">
              <ListFilter className="mr-2 h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <>
                  <div className="mx-2 h-4 w-px bg-muted-foreground/50" />
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {activeFilterCount}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[240px] p-0" align="start">
            <CombinedFilter filters={filters} onFiltersChange={onFiltersChange} />
          </PopoverContent>
        </Popover>

        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={() => onFiltersChange({ searchTerm: filters.searchTerm, status: [], priority: [] })}>Reset</Button>
        )}
      </div>

      {/* Right side: Sorter */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-start md:justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto justify-start">
              <SortAsc className="mr-2 h-4 w-4" />
              Sort by: {sortOptions.find(o => o.value === sortConfig?.key)?.label || 'Default'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={`${sortConfig?.key || 'default'}-${sortConfig?.direction || ''}`}
              onValueChange={(value) => {
                if (value.startsWith('default')) {
                  onSortChange(null)
                } else {
                  const [key, direction] = value.split('-')
                  onSortChange({ key: key as SortableField, direction: direction as 'asc' | 'desc' })
                }
              }}
            >
              <DropdownMenuRadioItem value="default-">Default</DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              {sortOptions.map(option => (
                <React.Fragment key={option.value}>
                  <DropdownMenuRadioItem value={`${option.value}-desc`}>{option.label} (Desc)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={`${option.value}-asc`}>{option.label} (Asc)</DropdownMenuRadioItem>
                </React.Fragment>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

function CombinedFilter({
  filters,
  onFiltersChange,
}: {
  filters: FilterConfig;
  onFiltersChange: (filters: FilterConfig) => void;
}) {
  const selectedStatus = new Set(filters.status);
  const selectedPriority = new Set(filters.priority);

  const handleStatusSelect = (status: Status) => {
    selectedStatus.has(status) ? selectedStatus.delete(status) : selectedStatus.add(status);
    onFiltersChange({ ...filters, status: Array.from(selectedStatus) });
  };

  const handlePrioritySelect = (priority: Priority) => {
    selectedPriority.has(priority) ? selectedPriority.delete(priority) : selectedPriority.add(priority);
    onFiltersChange({ ...filters, priority: Array.from(selectedPriority) });
  };

  const hasActiveFilters = filters.status.length > 0 || filters.priority.length > 0;

  return (
    <Command>
      <CommandInput placeholder="Filter by..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Status">
          {statusOptions.map((option) => {
            const isSelected = selectedStatus.has(option.value);
            return (
              <CommandItem
                key={option.value}
                onSelect={() => handleStatusSelect(option.value)}
              >
                <div
                  className={cn(
                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                    isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                  )}
                >
                  <Check className={cn('h-4 w-4')} />
                </div>
                <span>{option.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Priority">
          {priorityOptions.map((option) => {
            const isSelected = selectedPriority.has(option.value);
            return (
              <CommandItem
                key={option.value}
                onSelect={() => handlePrioritySelect(option.value)}
              >
                <div
                  className={cn(
                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                    isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                  )}
                >
                  <Check className={cn('h-4 w-4')} />
                </div>
                <span>{option.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        {hasActiveFilters && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => onFiltersChange({ ...filters, status: [], priority: [] })}
                className="justify-center text-center text-sm"
              >
                Clear filters
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  )
}