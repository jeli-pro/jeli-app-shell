import * as React from 'react'
import { Check, ListFilter, Search, SortAsc, ChevronsUpDown } from 'lucide-react'

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

import type { FilterConfig } from '../../types'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import { useDynamicView } from '../../DynamicViewContext'

export interface DataViewControlsProps {
  // groupOptions will now come from config
}

export function ViewControls() {
  const {
    filters,
    setFilters,
    sortConfig,
    setSort,
    groupBy,
    setGroupBy,
    viewMode,
  } = useAppViewManager();
  const { config } = useDynamicView();
  const sortOptions = config.sortableFields;
  const groupOptions = config.groupableFields;
  const filterableFields = config.filterableFields;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchTerm: event.target.value })
  }
  
  const activeFilterCount = filterableFields.reduce((acc, field) => acc + (filters[field.id]?.length || 0), 0)

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
      {/* Search */}
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-9 w-full sm:w-64"
          value={filters.searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filters */}
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
          <CombinedFilter filters={filters} onFiltersChange={setFilters} filterableFields={filterableFields} />
        </PopoverContent>
      </Popover>

      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={() => setFilters({ searchTerm: filters.searchTerm, status: [], priority: [] })}>Reset</Button>
      )}

      {/* Spacer */}
      <div className="hidden md:block flex-grow" />

      {/* Sorter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 w-full sm:w-auto justify-start">
            <SortAsc className="mr-2 h-4 w-4" />
            Sort by: {sortOptions.find(o => o.id === sortConfig?.key)?.label || 'Default'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={`${sortConfig?.key || 'default'}-${sortConfig?.direction || ''}`}
            onValueChange={(value) => {
              if (value.startsWith('default')) {
                setSort(null)
              } else {
                const [key, direction] = value.split('-')
                setSort({ key: key, direction: direction as 'asc' | 'desc' })
              }
            }}
          >
            <DropdownMenuRadioItem value="default-">Default</DropdownMenuRadioItem>
            <DropdownMenuSeparator />
            {sortOptions.map(option => (
              <React.Fragment key={option.id}>
                <DropdownMenuRadioItem value={`${option.id}-desc`}>{option.label} (Desc)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={`${option.id}-asc`}>{option.label} (Asc)</DropdownMenuRadioItem>
              </React.Fragment>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Group By Dropdown */}
      {viewMode !== 'calendar' && (
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 w-full justify-between">
                Group by: {groupOptions.find(o => o.id === groupBy)?.label}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[180px]">
              <DropdownMenuRadioGroup value={groupBy} onValueChange={setGroupBy}>
                {groupOptions.map(option => (
                  <DropdownMenuRadioItem key={option.id} value={option.id}>
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}

function CombinedFilter({
  filters,
  onFiltersChange,
  filterableFields,
}: {
  filters: FilterConfig;
  onFiltersChange: (filters: FilterConfig) => void;
  filterableFields: { id: string; label: string; options: { id: string; label: string }[] }[];
}) {
  const handleSelect = (fieldId: string, value: string) => {
    const currentValues = new Set(filters[fieldId] || []);
    currentValues.has(value) ? currentValues.delete(value) : currentValues.add(value);
    
    onFiltersChange({ ...filters, [fieldId]: Array.from(currentValues) });
  };

  const hasActiveFilters = filterableFields.some(field => (filters[field.id] || []).length > 0);

  const clearFilters = () => {
    const clearedFilters: Partial<FilterConfig> = {};
    filterableFields.forEach(field => {
      clearedFilters[field.id as keyof Omit<FilterConfig, 'searchTerm'>] = [];
    });
    onFiltersChange({ searchTerm: filters.searchTerm, ...clearedFilters });
  }

  return (
    <Command>
      <CommandInput placeholder="Filter by..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {filterableFields.map((field, index) => (
          <React.Fragment key={field.id}>
            <CommandGroup heading={field.label}>
              {field.options.map((option) => {
            const isSelected = (filters[field.id] || []).includes(option.id);
            return (
              <CommandItem
                key={option.id}
                onSelect={() => handleSelect(field.id, option.id)}
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
            {index < filterableFields.length - 1 && <CommandSeparator />}
          </React.Fragment>
        ))}

        {hasActiveFilters && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={clearFilters}
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