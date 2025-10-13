# Directory Structure
```
src/
  components/
    ui/
      badge.tsx
      button.tsx
      command.tsx
      dropdown-menu.tsx
      input.tsx
      popover.tsx
  pages/
    DataDemo/
      components/
        DataCardView.tsx
        DataListView.tsx
        DataTableView.tsx
        DataToolbar.tsx
        DataViewModeSelector.tsx
        EmptyState.tsx
      data/
        mockData.ts
      index.tsx
      types.ts
index.html
package.json
postcss.config.js
README.md
tailwind.config.js
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: src/pages/DataDemo/components/DataToolbar.tsx
````typescript
import * as React from 'react'
import { Check, ListFilter, Search, SortAsc, X } from 'lucide-react'

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

import { DataViewModeSelector } from './DataViewModeSelector'
import type { ViewMode, SortConfig, SortableField, Status, Priority } from '../types'

export interface FilterConfig {
  searchTerm: string
  status: Status[]
  priority: Priority[]
}

interface DataToolbarProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
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
  viewMode,
  onViewModeChange,
  filters,
  onFiltersChange,
  sortConfig,
  onSortChange,
}: DataToolbarProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, searchTerm: event.target.value })
  }
  
  const activeFilterCount =
    (filters.status.length > 0 ? 1 : 0) +
    (filters.priority.length > 0 ? 1 : 0)

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Left side: Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            size="sm"
            className="pl-9 w-full sm:w-64"
            value={filters.searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Status Filter */}
        <MultiSelectFilter
          title="Status"
          options={statusOptions}
          selected={filters.status}
          onChange={(selected) => onFiltersChange({ ...filters, status: selected as Status[] })}
        />

        {/* Priority Filter */}
        <MultiSelectFilter
          title="Priority"
          options={priorityOptions}
          selected={filters.priority}
          onChange={(selected) => onFiltersChange({ ...filters, priority: selected as Priority[] })}
        />

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFiltersChange({ searchTerm: filters.searchTerm, status: [], priority: [] })}
            className="px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Right side: Sorter and View Mode */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full sm:w-auto justify-start">
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

        <DataViewModeSelector viewMode={viewMode} onChange={onViewModeChange} />
      </div>
    </div>
  )
}

function MultiSelectFilter({
  title,
  options,
  selected,
  onChange,
}: {
  title: string
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
}) {
  const selectedSet = new Set(selected)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full sm:w-auto justify-start border-dashed">
          <ListFilter className="mr-2 h-4 w-4" />
          {title}
          {selected.length > 0 && (
            <>
              <div className="mx-2 h-4 w-px bg-muted-foreground/50" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                {selected.length}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Filter ${title.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedSet.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedSet.delete(option.value)
                      } else {
                        selectedSet.add(option.value)
                      }
                      onChange(Array.from(selectedSet))
                    }}
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
                )
              })}
            </CommandGroup>
            {selected.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onChange([])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
````

## File: src/components/ui/badge.tsx
````typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
````

## File: src/components/ui/button.tsx
````typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
````

## File: src/components/ui/command.tsx
````typescript
import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex h-14 items-center border-b px-4" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-full w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[450px] overflow-y-auto overflow-x-hidden p-2", className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-lg px-4 py-2.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
````

## File: src/components/ui/input.tsx
````typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-10 py-2",
        sm: "h-9 py-1",
        lg: "h-11 py-2",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
````

## File: src/pages/DataDemo/components/EmptyState.tsx
````typescript
import { Eye } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Eye className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No items found</h3>
      <p className="text-muted-foreground">Try adjusting your search criteria</p>
    </div>
  )
}
````

## File: src/pages/DataDemo/types.ts
````typescript
export type ViewMode = 'list' | 'cards' | 'grid' | 'table'

export type SortableField = 'title' | 'status' | 'priority' | 'updatedAt' | 'assignee.name' | 'metrics.views' | 'metrics.completion' | 'createdAt'
export type SortDirection = 'asc' | 'desc'
export interface SortConfig {
  key: SortableField
  direction: SortDirection
}

export interface DataItem {
  id: string
  title: string
  description: string
  category: string
  status: 'active' | 'pending' | 'completed' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee: {
    name: string
    avatar: string
    email: string
  }
  metrics: {
    views: number
    likes: number
    shares: number
    completion: number
  }
  tags: string[]
  createdAt: string
  updatedAt: string
  dueDate?: string
  thumbnail?: string
  content?: {
    summary: string
    details: string
    attachments?: Array<{
      name: string
      type: string
      size: string
      url: string
    }>
  }
}

export interface ViewProps {
  data: DataItem[]
  onItemSelect: (item: DataItem) => void
  selectedItem: DataItem | null
  isGrid?: boolean

  // Props for table view specifically
  sortConfig?: SortConfig | null
  onSort?: (field: SortableField) => void
}

export type Status = DataItem['status']
export type Priority = DataItem['priority']
````

## File: postcss.config.js
````javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
````

## File: src/components/ui/dropdown-menu.tsx
````typescript
import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-lg py-2 pl-8 pr-3 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-lg py-2 pl-8 pr-3 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
````

## File: src/components/ui/popover.tsx
````typescript
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  useTriggerWidth?: boolean
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  ({ className, align = "center", sideOffset = 4, useTriggerWidth = false, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-xl border bg-popover p-4 text-popover-foreground shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        useTriggerWidth && "w-[var(--radix-popover-trigger-width)]",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
export type { PopoverContentProps }
````

## File: src/pages/DataDemo/components/DataViewModeSelector.tsx
````typescript
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { List, Grid3X3, LayoutGrid, Table } from 'lucide-react'
import type { ViewMode } from '../types'

interface DataViewModeSelectorProps {
  viewMode: ViewMode
  onChange: (mode: ViewMode) => void
}

const viewModes = [
  { id: 'list' as ViewMode, label: 'List', icon: List },
  { id: 'cards' as ViewMode, label: 'Cards', icon: LayoutGrid },
  { id: 'grid' as ViewMode, label: 'Grid', icon: Grid3X3 },
  { id: 'table' as ViewMode, label: 'Table', icon: Table }
]

export function DataViewModeSelector({ viewMode, onChange }: DataViewModeSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
      {viewModes.map((mode) => {
        const IconComponent = mode.icon
        const isActive = viewMode === mode.id
        
        return (
          <Button
            key={mode.id}
            variant={isActive ? "secondary" : "ghost"}
            size="icon"
            onClick={() => onChange(mode.id)}
            className={cn(
              "h-7 w-7 rounded-lg",
              isActive && "shadow-sm"
            )}
            title={mode.label}
          >
            <IconComponent className="w-4 h-4" />
          </Button>
        )
      })}
    </div>
  )
}
````

## File: src/pages/DataDemo/data/mockData.ts
````typescript
import type { DataItem } from '../types'

export const mockDataItems: DataItem[] = [
  {
    id: '1',
    title: 'Mobile App Redesign Project',
    description: 'Complete overhaul of the mobile application user interface with focus on accessibility and modern design patterns.',
    category: 'Design',
    status: 'active',
    priority: 'high',
    assignee: {
      name: 'Sarah Chen',
      avatar: '🎨',
      email: 'sarah.chen@company.com'
    },
    metrics: {
      views: 1247,
      likes: 89,
      shares: 23,
      completion: 65
    },
    tags: ['UI/UX', 'Mobile', 'Accessibility', 'Figma'],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    dueDate: '2024-02-28T23:59:59Z',
    thumbnail: '🎨',
    content: {
      summary: 'Redesigning the mobile app to improve user experience and accessibility compliance.',
      details: 'This project involves a complete redesign of our mobile application interface. The focus is on creating a more intuitive user experience while ensuring full accessibility compliance. We\'re implementing modern design patterns and conducting extensive user testing.',
      attachments: [
        { name: 'Design_Mockups_v2.fig', type: 'Figma', size: '2.4 MB', url: '#' },
        { name: 'User_Research_Report.pdf', type: 'PDF', size: '1.8 MB', url: '#' },
        { name: 'Accessibility_Guidelines.docx', type: 'Document', size: '850 KB', url: '#' }
      ]
    }
  },
  {
    id: '2',
    title: 'API Performance Optimization',
    description: 'Optimize backend API endpoints to reduce response times and improve scalability for high-traffic scenarios.',
    category: 'Development',
    status: 'pending',
    priority: 'critical',
    assignee: {
      name: 'Marcus Rodriguez',
      avatar: '⚡',
      email: 'marcus.rodriguez@company.com'
    },
    metrics: {
      views: 892,
      likes: 156,
      shares: 45,
      completion: 25
    },
    tags: ['Backend', 'Performance', 'API', 'Optimization'],
    createdAt: '2024-01-18T11:15:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
    dueDate: '2024-01-30T23:59:59Z',
    thumbnail: '⚡',
    content: {
      summary: 'Critical performance improvements needed for API endpoints experiencing high latency.',
      details: 'Our API endpoints are experiencing significant performance issues during peak traffic. This optimization project will focus on database query optimization, caching strategies, and implementing rate limiting to ensure consistent performance.',
      attachments: [
        { name: 'Performance_Analysis.xlsx', type: 'Spreadsheet', size: '3.2 MB', url: '#' },
        { name: 'Database_Schema_Updates.sql', type: 'SQL', size: '45 KB', url: '#' }
      ]
    }
  },
  {
    id: '3',
    title: 'Customer Feedback Dashboard',
    description: 'Build a comprehensive dashboard for analyzing customer feedback trends and sentiment analysis.',
    category: 'Analytics',
    status: 'completed',
    priority: 'medium',
    assignee: {
      name: 'Emma Thompson',
      avatar: '📊',
      email: 'emma.thompson@company.com'
    },
    metrics: {
      views: 2341,
      likes: 234,
      shares: 67,
      completion: 100
    },
    tags: ['Dashboard', 'Analytics', 'Customer Experience', 'Data Viz'],
    createdAt: '2024-01-05T08:30:00Z',
    updatedAt: '2024-01-19T17:20:00Z',
    thumbnail: '📊',
    content: {
      summary: 'Successfully launched customer feedback dashboard with real-time analytics.',
      details: 'Completed the development of a comprehensive customer feedback dashboard that provides real-time insights into customer sentiment, trending topics, and satisfaction metrics. The dashboard includes interactive visualizations and automated reporting.',
      attachments: [
        { name: 'Dashboard_Demo.mp4', type: 'Video', size: '15.7 MB', url: '#' },
        { name: 'User_Guide.pdf', type: 'PDF', size: '2.1 MB', url: '#' },
        { name: 'Technical_Specs.md', type: 'Markdown', size: '23 KB', url: '#' }
      ]
    }
  },
  {
    id: '4',
    title: 'Security Audit & Compliance',
    description: 'Comprehensive security audit of all systems and implementation of compliance measures for data protection.',
    category: 'Security',
    status: 'active',
    priority: 'critical',
    assignee: {
      name: 'David Kim',
      avatar: '🔒',
      email: 'david.kim@company.com'
    },
    metrics: {
      views: 567,
      likes: 78,
      shares: 12,
      completion: 45
    },
    tags: ['Security', 'Compliance', 'GDPR', 'Audit'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-23T13:15:00Z',
    dueDate: '2024-03-15T23:59:59Z',
    thumbnail: '🔒',
    content: {
      summary: 'Ongoing security audit to ensure compliance with data protection regulations.',
      details: 'Comprehensive security assessment covering all systems, applications, and data handling processes. The audit includes penetration testing, vulnerability assessments, and implementation of GDPR compliance measures.',
      attachments: [
        { name: 'Security_Checklist.xlsx', type: 'Spreadsheet', size: '1.5 MB', url: '#' },
        { name: 'Compliance_Report_Draft.pdf', type: 'PDF', size: '4.2 MB', url: '#' }
      ]
    }
  },
  {
    id: '5',
    title: 'AI-Powered Content Recommendations',
    description: 'Implement machine learning algorithms to provide personalized content recommendations for users.',
    category: 'AI/ML',
    status: 'pending',
    priority: 'medium',
    assignee: {
      name: 'Priya Patel',
      avatar: '🤖',
      email: 'priya.patel@company.com'
    },
    metrics: {
      views: 1456,
      likes: 201,
      shares: 89,
      completion: 15
    },
    tags: ['Machine Learning', 'AI', 'Recommendations', 'Personalization'],
    createdAt: '2024-01-22T14:20:00Z',
    updatedAt: '2024-01-24T09:10:00Z',
    dueDate: '2024-04-10T23:59:59Z',
    thumbnail: '🤖',
    content: {
      summary: 'Building AI-driven recommendation system to enhance user engagement.',
      details: 'Development of a sophisticated recommendation engine using machine learning algorithms. The system will analyze user behavior patterns, content preferences, and engagement metrics to provide highly personalized content suggestions.',
      attachments: [
        { name: 'ML_Model_Proposal.pdf', type: 'PDF', size: '3.8 MB', url: '#' },
        { name: 'Training_Data_Analysis.ipynb', type: 'Jupyter Notebook', size: '892 KB', url: '#' }
      ]
    }
  },
  {
    id: '6',
    title: 'Cloud Infrastructure Migration',
    description: 'Migrate legacy systems to cloud infrastructure for improved scalability and cost efficiency.',
    category: 'Infrastructure',
    status: 'active',
    priority: 'high',
    assignee: {
      name: 'Alex Johnson',
      avatar: '☁️',
      email: 'alex.johnson@company.com'
    },
    metrics: {
      views: 734,
      likes: 92,
      shares: 34,
      completion: 70
    },
    tags: ['Cloud', 'Migration', 'AWS', 'Infrastructure'],
    createdAt: '2024-01-10T07:45:00Z',
    updatedAt: '2024-01-24T11:30:00Z',
    dueDate: '2024-02-15T23:59:59Z',
    thumbnail: '☁️',
    content: {
      summary: 'Migrating critical systems to cloud infrastructure for better performance and scalability.',
      details: 'Comprehensive migration of our legacy on-premise infrastructure to AWS cloud services. This includes database migration, application containerization, and implementation of auto-scaling capabilities.',
      attachments: [
        { name: 'Migration_Plan.pdf', type: 'PDF', size: '5.1 MB', url: '#' },
        { name: 'Cost_Analysis.xlsx', type: 'Spreadsheet', size: '1.9 MB', url: '#' },
        { name: 'Architecture_Diagram.png', type: 'Image', size: '2.3 MB', url: '#' }
      ]
    }
  },
  {
    id: '7',
    title: 'User Onboarding Experience',
    description: 'Design and implement an intuitive onboarding flow to improve new user activation rates.',
    category: 'Product',
    status: 'completed',
    priority: 'medium',
    assignee: {
      name: 'Lisa Zhang',
      avatar: '🚀',
      email: 'lisa.zhang@company.com'
    },
    metrics: {
      views: 1876,
      likes: 298,
      shares: 156,
      completion: 100
    },
    tags: ['Onboarding', 'UX', 'Product', 'Conversion'],
    createdAt: '2024-01-02T12:00:00Z',
    updatedAt: '2024-01-16T18:45:00Z',
    thumbnail: '🚀',
    content: {
      summary: 'Successfully launched new user onboarding experience with 40% improvement in activation rates.',
      details: 'Designed and implemented a streamlined onboarding flow that guides new users through key product features. The new experience includes interactive tutorials, progress tracking, and personalized setup recommendations.',
      attachments: [
        { name: 'Onboarding_Flow.sketch', type: 'Sketch', size: '4.7 MB', url: '#' },
        { name: 'A_B_Test_Results.pdf', type: 'PDF', size: '1.4 MB', url: '#' },
        { name: 'User_Journey_Map.png', type: 'Image', size: '3.2 MB', url: '#' }
      ]
    }
  },
  {
    id: '8',
    title: 'Real-time Collaboration Features',
    description: 'Implement real-time collaborative editing and communication features for team productivity.',
    category: 'Development',
    status: 'active',
    priority: 'high',
    assignee: {
      name: 'Jordan Miller',
      avatar: '👥',
      email: 'jordan.miller@company.com'
    },
    metrics: {
      views: 1123,
      likes: 167,
      shares: 78,
      completion: 55
    },
    tags: ['Collaboration', 'Real-time', 'WebSocket', 'Team Tools'],
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-25T10:20:00Z',
    dueDate: '2024-03-01T23:59:59Z',
    thumbnail: '👥',
    content: {
      summary: 'Building real-time collaboration features to enhance team productivity and communication.',
      details: 'Development of real-time collaborative editing capabilities using WebSocket technology. Features include live cursor tracking, simultaneous editing, instant messaging, and presence indicators for team members.',
      attachments: [
        { name: 'Technical_Architecture.pdf', type: 'PDF', size: '2.8 MB', url: '#' },
        { name: 'WebSocket_Implementation.js', type: 'JavaScript', size: '67 KB', url: '#' },
        { name: 'UI_Mockups.fig', type: 'Figma', size: '3.1 MB', url: '#' }
      ]
    }
  },
  {
    id: '9',
    title: 'Mobile App Redesign Project',
    description: 'Complete overhaul of the mobile application user interface with focus on accessibility and modern design patterns.',
    category: 'Design',
    status: 'active',
    priority: 'high',
    assignee: {
      name: 'Sarah Chen',
      avatar: '🎨',
      email: 'sarah.chen@company.com'
    },
    metrics: {
      views: 1247,
      likes: 89,
      shares: 23,
      completion: 65
    },
    tags: ['UI/UX', 'Mobile', 'Accessibility', 'Figma'],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    dueDate: '2024-02-28T23:59:59Z',
    thumbnail: '🎨',
    content: {
      summary: 'Redesigning the mobile app to improve user experience and accessibility compliance.',
      details: 'This project involves a complete redesign of our mobile application interface. The focus is on creating a more intuitive user experience while ensuring full accessibility compliance. We\'re implementing modern design patterns and conducting extensive user testing.',
      attachments: [
        { name: 'Design_Mockups_v2.fig', type: 'Figma', size: '2.4 MB', url: '#' },
        { name: 'User_Research_Report.pdf', type: 'PDF', size: '1.8 MB', url: '#' },
        { name: 'Accessibility_Guidelines.docx', type: 'Document', size: '850 KB', url: '#' }
      ]
    }
  },
  {
    id: '10',
    title: 'API Performance Optimization',
    description: 'Optimize backend API endpoints to reduce response times and improve scalability for high-traffic scenarios.',
    category: 'Development',
    status: 'pending',
    priority: 'critical',
    assignee: {
      name: 'Marcus Rodriguez',
      avatar: '⚡',
      email: 'marcus.rodriguez@company.com'
    },
    metrics: {
      views: 892,
      likes: 156,
      shares: 45,
      completion: 25
    },
    tags: ['Backend', 'Performance', 'API', 'Optimization'],
    createdAt: '2024-01-18T11:15:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
    dueDate: '2024-01-30T23:59:59Z',
    thumbnail: '⚡',
    content: {
      summary: 'Critical performance improvements needed for API endpoints experiencing high latency.',
      details: 'Our API endpoints are experiencing significant performance issues during peak traffic. This optimization project will focus on database query optimization, caching strategies, and implementing rate limiting to ensure consistent performance.',
      attachments: [
        { name: 'Performance_Analysis.xlsx', type: 'Spreadsheet', size: '3.2 MB', url: '#' },
        { name: 'Database_Schema_Updates.sql', type: 'SQL', size: '45 KB', url: '#' }
      ]
    }
  },
  {
    id: '11',
    title: 'Customer Feedback Dashboard',
    description: 'Build a comprehensive dashboard for analyzing customer feedback trends and sentiment analysis.',
    category: 'Analytics',
    status: 'completed',
    priority: 'medium',
    assignee: {
      name: 'Emma Thompson',
      avatar: '📊',
      email: 'emma.thompson@company.com'
    },
    metrics: {
      views: 2341,
      likes: 234,
      shares: 67,
      completion: 100
    },
    tags: ['Dashboard', 'Analytics', 'Customer Experience', 'Data Viz'],
    createdAt: '2024-01-05T08:30:00Z',
    updatedAt: '2024-01-19T17:20:00Z',
    thumbnail: '📊',
    content: {
      summary: 'Successfully launched customer feedback dashboard with real-time analytics.',
      details: 'Completed the development of a comprehensive customer feedback dashboard that provides real-time insights into customer sentiment, trending topics, and satisfaction metrics. The dashboard includes interactive visualizations and automated reporting.',
      attachments: [
        { name: 'Dashboard_Demo.mp4', type: 'Video', size: '15.7 MB', url: '#' },
        { name: 'User_Guide.pdf', type: 'PDF', size: '2.1 MB', url: '#' },
        { name: 'Technical_Specs.md', type: 'Markdown', size: '23 KB', url: '#' }
      ]
    }
  },
  {
    id: '12',
    title: 'Security Audit & Compliance',
    description: 'Comprehensive security audit of all systems and implementation of compliance measures for data protection.',
    category: 'Security',
    status: 'active',
    priority: 'critical',
    assignee: {
      name: 'David Kim',
      avatar: '🔒',
      email: 'david.kim@company.com'
    },
    metrics: {
      views: 567,
      likes: 78,
      shares: 12,
      completion: 45
    },
    tags: ['Security', 'Compliance', 'GDPR', 'Audit'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-23T13:15:00Z',
    dueDate: '2024-03-15T23:59:59Z',
    thumbnail: '🔒',
    content: {
      summary: 'Ongoing security audit to ensure compliance with data protection regulations.',
      details: 'Comprehensive security assessment covering all systems, applications, and data handling processes. The audit includes penetration testing, vulnerability assessments, and implementation of GDPR compliance measures.',
      attachments: [
        { name: 'Security_Checklist.xlsx', type: 'Spreadsheet', size: '1.5 MB', url: '#' },
        { name: 'Compliance_Report_Draft.pdf', type: 'PDF', size: '4.2 MB', url: '#' }
      ]
    }
  },
  {
    id: '13',
    title: 'AI-Powered Content Recommendations',
    description: 'Implement machine learning algorithms to provide personalized content recommendations for users.',
    category: 'AI/ML',
    status: 'pending',
    priority: 'medium',
    assignee: {
      name: 'Priya Patel',
      avatar: '🤖',
      email: 'priya.patel@company.com'
    },
    metrics: {
      views: 1456,
      likes: 201,
      shares: 89,
      completion: 15
    },
    tags: ['Machine Learning', 'AI', 'Recommendations', 'Personalization'],
    createdAt: '2024-01-22T14:20:00Z',
    updatedAt: '2024-01-24T09:10:00Z',
    dueDate: '2024-04-10T23:59:59Z',
    thumbnail: '🤖',
    content: {
      summary: 'Building AI-driven recommendation system to enhance user engagement.',
      details: 'Development of a sophisticated recommendation engine using machine learning algorithms. The system will analyze user behavior patterns, content preferences, and engagement metrics to provide highly personalized content suggestions.',
      attachments: [
        { name: 'ML_Model_Proposal.pdf', type: 'PDF', size: '3.8 MB', url: '#' },
        { name: 'Training_Data_Analysis.ipynb', type: 'Jupyter Notebook', size: '892 KB', url: '#' }
      ]
    }
  },
  {
    id: '14',
    title: 'Cloud Infrastructure Migration',
    description: 'Migrate legacy systems to cloud infrastructure for improved scalability and cost efficiency.',
    category: 'Infrastructure',
    status: 'active',
    priority: 'high',
    assignee: {
      name: 'Alex Johnson',
      avatar: '☁️',
      email: 'alex.johnson@company.com'
    },
    metrics: {
      views: 734,
      likes: 92,
      shares: 34,
      completion: 70
    },
    tags: ['Cloud', 'Migration', 'AWS', 'Infrastructure'],
    createdAt: '2024-01-10T07:45:00Z',
    updatedAt: '2024-01-24T11:30:00Z',
    dueDate: '2024-02-15T23:59:59Z',
    thumbnail: '☁️',
    content: {
      summary: 'Migrating critical systems to cloud infrastructure for better performance and scalability.',
      details: 'Comprehensive migration of our legacy on-premise infrastructure to AWS cloud services. This includes database migration, application containerization, and implementation of auto-scaling capabilities.',
      attachments: [
        { name: 'Migration_Plan.pdf', type: 'PDF', size: '5.1 MB', url: '#' },
        { name: 'Cost_Analysis.xlsx', type: 'Spreadsheet', size: '1.9 MB', url: '#' },
        { name: 'Architecture_Diagram.png', type: 'Image', size: '2.3 MB', url: '#' }
      ]
    }
  },
  {
    id: '15',
    title: 'User Onboarding Experience',
    description: 'Design and implement an intuitive onboarding flow to improve new user activation rates.',
    category: 'Product',
    status: 'completed',
    priority: 'medium',
    assignee: {
      name: 'Lisa Zhang',
      avatar: '🚀',
      email: 'lisa.zhang@company.com'
    },
    metrics: {
      views: 1876,
      likes: 298,
      shares: 156,
      completion: 100
    },
    tags: ['Onboarding', 'UX', 'Product', 'Conversion'],
    createdAt: '2024-01-02T12:00:00Z',
    updatedAt: '2024-01-16T18:45:00Z',
    thumbnail: '🚀',
    content: {
      summary: 'Successfully launched new user onboarding experience with 40% improvement in activation rates.',
      details: 'Designed and implemented a streamlined onboarding flow that guides new users through key product features. The new experience includes interactive tutorials, progress tracking, and personalized setup recommendations.',
      attachments: [
        { name: 'Onboarding_Flow.sketch', type: 'Sketch', size: '4.7 MB', url: '#' },
        { name: 'A_B_Test_Results.pdf', type: 'PDF', size: '1.4 MB', url: '#' },
        { name: 'User_Journey_Map.png', type: 'Image', size: '3.2 MB', url: '#' }
      ]
    }
  },
  {
    id: '16',
    title: 'Real-time Collaboration Features',
    description: 'Implement real-time collaborative editing and communication features for team productivity.',
    category: 'Development',
    status: 'active',
    priority: 'high',
    assignee: {
      name: 'Jordan Miller',
      avatar: '👥',
      email: 'jordan.miller@company.com'
    },
    metrics: {
      views: 1123,
      likes: 167,
      shares: 78,
      completion: 55
    },
    tags: ['Collaboration', 'Real-time', 'WebSocket', 'Team Tools'],
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-25T10:20:00Z',
    dueDate: '2024-03-01T23:59:59Z',
    thumbnail: '👥',
    content: {
      summary: 'Building real-time collaboration features to enhance team productivity and communication.',
      details: 'Development of real-time collaborative editing capabilities using WebSocket technology. Features include live cursor tracking, simultaneous editing, instant messaging, and presence indicators for team members.',
      attachments: [
        { name: 'Technical_Architecture.pdf', type: 'PDF', size: '2.8 MB', url: '#' },
        { name: 'WebSocket_Implementation.js', type: 'JavaScript', size: '67 KB', url: '#' },
        { name: 'UI_Mockups.fig', type: 'Figma', size: '3.1 MB', url: '#' }
      ]
    }
  },
  {
    id: '17',
    title: 'Mobile App Redesign Project',
    description: 'Complete overhaul of the mobile application user interface with focus on accessibility and modern design patterns.',
    category: 'Design',
    status: 'active',
    priority: 'high',
    assignee: {
      name: 'Sarah Chen',
      avatar: '🎨',
      email: 'sarah.chen@company.com'
    },
    metrics: {
      views: 1247,
      likes: 89,
      shares: 23,
      completion: 65
    },
    tags: ['UI/UX', 'Mobile', 'Accessibility', 'Figma'],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    dueDate: '2024-02-28T23:59:59Z',
    thumbnail: '🎨',
    content: {
      summary: 'Redesigning the mobile app to improve user experience and accessibility compliance.',
      details: 'This project involves a complete redesign of our mobile application interface. The focus is on creating a more intuitive user experience while ensuring full accessibility compliance. We\'re implementing modern design patterns and conducting extensive user testing.',
      attachments: [
        { name: 'Design_Mockups_v2.fig', type: 'Figma', size: '2.4 MB', url: '#' },
        { name: 'User_Research_Report.pdf', type: 'PDF', size: '1.8 MB', url: '#' },
        { name: 'Accessibility_Guidelines.docx', type: 'Document', size: '850 KB', url: '#' }
      ]
    }
  },
  {
    id: '18',
    title: 'API Performance Optimization',
    description: 'Optimize backend API endpoints to reduce response times and improve scalability for high-traffic scenarios.',
    category: 'Development',
    status: 'pending',
    priority: 'critical',
    assignee: {
      name: 'Marcus Rodriguez',
      avatar: '⚡',
      email: 'marcus.rodriguez@company.com'
    },
    metrics: {
      views: 892,
      likes: 156,
      shares: 45,
      completion: 25
    },
    tags: ['Backend', 'Performance', 'API', 'Optimization'],
    createdAt: '2024-01-18T11:15:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
    dueDate: '2024-01-30T23:59:59Z',
    thumbnail: '⚡',
    content: {
      summary: 'Critical performance improvements needed for API endpoints experiencing high latency.',
      details: 'Our API endpoints are experiencing significant performance issues during peak traffic. This optimization project will focus on database query optimization, caching strategies, and implementing rate limiting to ensure consistent performance.',
      attachments: [
        { name: 'Performance_Analysis.xlsx', type: 'Spreadsheet', size: '3.2 MB', url: '#' },
        { name: 'Database_Schema_Updates.sql', type: 'SQL', size: '45 KB', url: '#' }
      ]
    }
  },
  {
    id: '19',
    title: 'Customer Feedback Dashboard',
    description: 'Build a comprehensive dashboard for analyzing customer feedback trends and sentiment analysis.',
    category: 'Analytics',
    status: 'completed',
    priority: 'medium',
    assignee: {
      name: 'Emma Thompson',
      avatar: '📊',
      email: 'emma.thompson@company.com'
    },
    metrics: {
      views: 2341,
      likes: 234,
      shares: 67,
      completion: 100
    },
    tags: ['Dashboard', 'Analytics', 'Customer Experience', 'Data Viz'],
    createdAt: '2024-01-05T08:30:00Z',
    updatedAt: '2024-01-19T17:20:00Z',
    thumbnail: '📊',
    content: {
      summary: 'Successfully launched customer feedback dashboard with real-time analytics.',
      details: 'Completed the development of a comprehensive customer feedback dashboard that provides real-time insights into customer sentiment, trending topics, and satisfaction metrics. The dashboard includes interactive visualizations and automated reporting.',
      attachments: [
        { name: 'Dashboard_Demo.mp4', type: 'Video', size: '15.7 MB', url: '#' },
        { name: 'User_Guide.pdf', type: 'PDF', size: '2.1 MB', url: '#' },
        { name: 'Technical_Specs.md', type: 'Markdown', size: '23 KB', url: '#' }
      ]
    }
  },
  {
    id: '20',
    title: 'Security Audit & Compliance',
    description: 'Comprehensive security audit of all systems and implementation of compliance measures for data protection.',
    category: 'Security',
    status: 'active',
    priority: 'critical',
    assignee: {
      name: 'David Kim',
      avatar: '🔒',
      email: 'david.kim@company.com'
    },
    metrics: {
      views: 567,
      likes: 78,
      shares: 12,
      completion: 45
    },
    tags: ['Security', 'Compliance', 'GDPR', 'Audit'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-23T13:15:00Z',
    dueDate: '2024-03-15T23:59:59Z',
    thumbnail: '🔒',
    content: {
      summary: 'Ongoing security audit to ensure compliance with data protection regulations.',
      details: 'Comprehensive security assessment covering all systems, applications, and data handling processes. The audit includes penetration testing, vulnerability assessments, and implementation of GDPR compliance measures.',
      attachments: [
        { name: 'Security_Checklist.xlsx', type: 'Spreadsheet', size: '1.5 MB', url: '#' },
        { name: 'Compliance_Report_Draft.pdf', type: 'PDF', size: '4.2 MB', url: '#' }
      ]
    }
  },
  {
    id: '21',
    title: 'AI-Powered Content Recommendations',
    description: 'Implement machine learning algorithms to provide personalized content recommendations for users.',
    category: 'AI/ML',
    status: 'pending',
    priority: 'medium',
    assignee: {
      name: 'Priya Patel',
      avatar: '🤖',
      email: 'priya.patel@company.com'
    },
    metrics: {
      views: 1456,
      likes: 201,
      shares: 89,
      completion: 15
    },
    tags: ['Machine Learning', 'AI', 'Recommendations', 'Personalization'],
    createdAt: '2024-01-22T14:20:00Z',
    updatedAt: '2024-01-24T09:10:00Z',
    dueDate: '2024-04-10T23:59:59Z',
    thumbnail: '🤖',
    content: {
      summary: 'Building AI-driven recommendation system to enhance user engagement.',
      details: 'Development of a sophisticated recommendation engine using machine learning algorithms. The system will analyze user behavior patterns, content preferences, and engagement metrics to provide highly personalized content suggestions.',
      attachments: [
        { name: 'ML_Model_Proposal.pdf', type: 'PDF', size: '3.8 MB', url: '#' },
        { name: 'Training_Data_Analysis.ipynb', type: 'Jupyter Notebook', size: '892 KB', url: '#' }
      ]
    }
  },
  {
    id: '22',
    title: 'Cloud Infrastructure Migration',
    description: 'Migrate legacy systems to cloud infrastructure for improved scalability and cost efficiency.',
    category: 'Infrastructure',
    status: 'active',
    priority: 'high',
    assignee: {
      name: 'Alex Johnson',
      avatar: '☁️',
      email: 'alex.johnson@company.com'
    },
    metrics: {
      views: 734,
      likes: 92,
      shares: 34,
      completion: 70
    },
    tags: ['Cloud', 'Migration', 'AWS', 'Infrastructure'],
    createdAt: '2024-01-10T07:45:00Z',
    updatedAt: '2024-01-24T11:30:00Z',
    dueDate: '2024-02-15T23:59:59Z',
    thumbnail: '☁️',
    content: {
      summary: 'Migrating critical systems to cloud infrastructure for better performance and scalability.',
      details: 'Comprehensive migration of our legacy on-premise infrastructure to AWS cloud services. This includes database migration, application containerization, and implementation of auto-scaling capabilities.',
      attachments: [
        { name: 'Migration_Plan.pdf', type: 'PDF', size: '5.1 MB', url: '#' },
        { name: 'Cost_Analysis.xlsx', type: 'Spreadsheet', size: '1.9 MB', url: '#' },
        { name: 'Architecture_Diagram.png', type: 'Image', size: '2.3 MB', url: '#' }
      ]
    }
  },
  {
    id: '23',
    title: 'User Onboarding Experience',
    description: 'Design and implement an intuitive onboarding flow to improve new user activation rates.',
    category: 'Product',
    status: 'completed',
    priority: 'medium',
    assignee: {
      name: 'Lisa Zhang',
      avatar: '🚀',
      email: 'lisa.zhang@company.com'
    },
    metrics: {
      views: 1876,
      likes: 298,
      shares: 156,
      completion: 100
    },
    tags: ['Onboarding', 'UX', 'Product', 'Conversion'],
    createdAt: '2024-01-02T12:00:00Z',
    updatedAt: '2024-01-16T18:45:00Z',
    thumbnail: '🚀',
    content: {
      summary: 'Successfully launched new user onboarding experience with 40% improvement in activation rates.',
      details: 'Designed and implemented a streamlined onboarding flow that guides new users through key product features. The new experience includes interactive tutorials, progress tracking, and personalized setup recommendations.',
      attachments: [
        { name: 'Onboarding_Flow.sketch', type: 'Sketch', size: '4.7 MB', url: '#' },
        { name: 'A_B_Test_Results.pdf', type: 'PDF', size: '1.4 MB', url: '#' },
        { name: 'User_Journey_Map.png', type: 'Image', size: '3.2 MB', url: '#' }
      ]
    }
  },
  {
    id: '24',
    title: 'Real-time Collaboration Features',
    description: 'Implement real-time collaborative editing and communication features for team productivity.',
    category: 'Development',
    status: 'active',
    priority: 'high',
    assignee: {
      name: 'Jordan Miller',
      avatar: '👥',
      email: 'jordan.miller@company.com'
    },
    metrics: {
      views: 1123,
      likes: 167,
      shares: 78,
      completion: 55
    },
    tags: ['Collaboration', 'Real-time', 'WebSocket', 'Team Tools'],
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-25T10:20:00Z',
    dueDate: '2024-03-01T23:59:59Z',
    thumbnail: '👥',
    content: {
      summary: 'Building real-time collaboration features to enhance team productivity and communication.',
      details: 'Development of real-time collaborative editing capabilities using WebSocket technology. Features include live cursor tracking, simultaneous editing, instant messaging, and presence indicators for team members.',
      attachments: [
        { name: 'Technical_Architecture.pdf', type: 'PDF', size: '2.8 MB', url: '#' },
        { name: 'WebSocket_Implementation.js', type: 'JavaScript', size: '67 KB', url: '#' },
        { name: 'UI_Mockups.fig', type: 'Figma', size: '3.1 MB', url: '#' }
      ]
    }
  }
]
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Library Build */
    "declaration": true,
    "emitDeclarationOnly": true,
    "declarationDir": "dist",

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": [
    "dist",
    "src/App.tsx",
    "src/main.tsx",
    "src/pages"
  ],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

## File: src/pages/DataDemo/components/DataCardView.tsx
````typescript
import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Calendar, Eye, Heart, Share, ArrowUpRight, Tag } from 'lucide-react'
import type { ViewProps } from '../types'
import { getStatusColor, getPriorityColor } from '../utils'
import { EmptyState } from './EmptyState'

export function DataCardView({ data, onItemSelect, selectedItem, isGrid = false }: ViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animatedItemsCount = useRef(0)

  useLayoutEffect(() => {
    if (containerRef.current && data.length > animatedItemsCount.current) {
      const newItems = Array.from(containerRef.current.children).slice(
        animatedItemsCount.current
      );
      gsap.fromTo(
        newItems,
        { y: 40, opacity: 0, scale: 0.95 },
        {
          duration: 0.6,
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          ease: 'power2.out',
        },
      );
      animatedItemsCount.current = data.length;
    }
  }, [data]);

  if (data.length === 0) {
    return <EmptyState />
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "gap-6",
        isGrid 
          ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 space-y-6" 
          : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      )}
    >
      {data.map((item) => {
        const isSelected = selectedItem?.id === item.id
        
        return (
          <div
            key={item.id}
            onClick={() => onItemSelect(item)}
            className={cn(
              "group relative overflow-hidden rounded-3xl border bg-card/50 backdrop-blur-sm transition-all duration-500 cursor-pointer",
              "hover:bg-card/80 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-2",
              "active:scale-[0.98]",
              isSelected && "ring-2 ring-primary/30 border-primary/40 bg-card/90 shadow-lg shadow-primary/20",
              isGrid && "break-inside-avoid mb-6"
            )}
          >
            {/* Card Header with Thumbnail */}
            <div className="relative p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                  {item.thumbnail}
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </div>

              {/* Priority indicator */}
              <div className="absolute top-4 right-4">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  item.priority === 'critical' && "bg-red-500",
                  item.priority === 'high' && "bg-orange-500",
                  item.priority === 'medium' && "bg-blue-500",
                  item.priority === 'low' && "bg-green-500"
                )} />
              </div>
            </div>

            {/* Card Content */}
            <div className="px-6 pb-6">
              {/* Title and Description */}
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {item.description}
              </p>

              {/* Status and Category */}
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
                <Badge variant="outline" className="bg-accent/50 text-xs">
                  {item.category}
                </Badge>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1 mb-4">
                <Tag className="w-3 h-3 text-muted-foreground" />
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs font-semibold">{item.metrics.completion}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${item.metrics.completion}%` }}
                  />
                </div>
              </div>

              {/* Assignee */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-8 h-8 text-sm">
                  {item.assignee.avatar}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {item.assignee.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.assignee.email}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {item.metrics.views}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {item.metrics.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <Share className="w-3 h-3" />
                    {item.metrics.shares}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 pointer-events-none" />
            )}
          </div>
        )
      })}
    </div>
  )
}
````

## File: src/pages/DataDemo/components/DataListView.tsx
````typescript
import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Calendar, Eye, Heart, Share, ArrowRight } from 'lucide-react'
import type { ViewProps } from '../types'
import { getStatusColor, getPriorityColor } from '../utils'
import { EmptyState } from './EmptyState'

export function DataListView({ data, onItemSelect, selectedItem }: ViewProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const animatedItemsCount = useRef(0)

  useLayoutEffect(() => {
    if (listRef.current && data.length > animatedItemsCount.current) {
      const newItems = Array.from(listRef.current.children).slice(animatedItemsCount.current);
      gsap.fromTo(newItems,
        { y: 30, opacity: 0 },
        {
          duration: 0.5,
          y: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "power2.out",
        },
      );
      animatedItemsCount.current = data.length;
    }
  }, [data]);

  if (data.length === 0) {
    return <EmptyState />
  }

  return (
    <div ref={listRef} className="space-y-4">
      {data.map((item) => {
        const isSelected = selectedItem?.id === item.id
        
        return (
          <div
            key={item.id}
            onClick={() => onItemSelect(item)}
            className={cn(
              "group relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm transition-all duration-300 cursor-pointer",
              "hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20",
              "active:scale-[0.99]",
              isSelected && "ring-2 ring-primary/20 border-primary/30 bg-card/90"
            )}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center text-2xl">
                    {item.thumbnail}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 ml-4 flex-shrink-0" />
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                    <Badge variant="outline" className="bg-accent/50">
                      {item.category}
                    </Badge>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Assignee */}
                      <div className="flex items-center gap-2">
                        <Avatar className="w-7 h-7 text-sm">
                          {item.assignee.avatar}
                        </Avatar>
                        <span className="text-sm text-muted-foreground font-medium">
                          {item.assignee.name}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.metrics.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {item.metrics.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share className="w-3 h-3" />
                        {item.metrics.shares}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-medium">{item.metrics.completion}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary/80 h-1.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${item.metrics.completion}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        )
      })}
    </div>
  )
}
````

## File: src/pages/DataDemo/components/DataTableView.tsx
````typescript
import { useState, useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { 
  Calendar, 
  Eye, 
  Heart, 
  Share, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react'
import type { ViewProps, DataItem, SortableField } from '../types'
import { getStatusColor, getPriorityColor } from '../utils'
import { EmptyState } from './EmptyState'

export function DataTableView({ data, onItemSelect, selectedItem, sortConfig, onSort }: ViewProps) {
  const tableRef = useRef<HTMLTableElement>(null)
  const animatedItemsCount = useRef(0)

  useLayoutEffect(() => {
    if (tableRef.current && data.length > animatedItemsCount.current) {
      const newItems = Array.from(
        tableRef.current.querySelectorAll('tbody tr')
      ).slice(animatedItemsCount.current);
      gsap.fromTo(newItems,
        { y: 20, opacity: 0 },
        {
          duration: 0.5,
          y: 0,
          opacity: 1,
          stagger: 0.05,
          ease: "power2.out",
        },
      );
      animatedItemsCount.current = data.length;
    }
  }, [data]);

  const SortIcon = ({ field }: { field: SortableField }) => {
    if (sortConfig?.key !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp className="w-4 h-4 text-primary" />
    }
    if (sortConfig.direction === 'desc') {
      return <ArrowDown className="w-4 h-4 text-primary" />
    }
    return <ArrowUpDown className="w-4 h-4 opacity-50" />
  }

  const handleSortClick = (field: SortableField) => {
    onSort?.(field)
  }

  if (data.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table ref={tableRef} className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20">
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSortClick('title')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Project
                  <SortIcon field="title" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSortClick('status')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Status
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSortClick('priority')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Priority
                  <SortIcon field="priority" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSortClick('assignee.name')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Assignee
                  <SortIcon field="assignee.name" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSortClick('metrics.completion')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Progress
                  <SortIcon field="metrics.completion" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">
                <button
                  onClick={() => handleSortClick('metrics.views')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Engagement
                  <SortIcon field="metrics.views" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-sm">Last Updated</th>
              <th className="text-center p-4 font-semibold text-sm w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const isSelected = selectedItem?.id === item.id
              
              return (
                <tr
                  key={item.id}
                  onClick={() => onItemSelect(item)}
                  className={cn(
                    "group border-b border-border/30 transition-all duration-200 cursor-pointer",
                    "hover:bg-accent/20 hover:border-primary/20",
                    isSelected && "bg-primary/5 border-primary/30"
                  )}
                >
                  {/* Project Column */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {item.thumbnail}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium group-hover:text-primary transition-colors truncate">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="p-4">
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </td>

                  {/* Priority Column */}
                  <td className="p-4">
                    <Badge variant="outline" className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                  </td>

                  {/* Assignee Column */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8 text-sm">
                        {item.assignee.avatar}
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.assignee.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Progress Column */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.metrics.completion}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {item.metrics.completion}%
                      </span>
                    </div>
                  </td>

                  {/* Engagement Column */}
                  <td className="p-4">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.metrics.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {item.metrics.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share className="w-3 h-3" />
                        {item.metrics.shares}
                      </div>
                    </div>
                  </td>

                  {/* Date Column */}
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="p-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        onItemSelect(item)
                      }}
                      className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-accent transition-colors"
                      title="View details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
````

## File: index.html
````html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jeli App Shell</title>
  </head>
  <body>
    <div id="root"></div>
    <div id="toaster-container"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
````

## File: tailwind.config.js
````javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        DEFAULT: "0.5rem",
      },
      boxShadow: {
        input: [
          "0px 2px 3px -1px rgba(0, 0, 0, 0.1)",
          "0px 1px 0px 0px rgba(25, 28, 33, 0.02)",
          "0px 0px 0px 1px rgba(25, 28, 33, 0.08)",
        ].join(", "),
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        ripple: "ripple 2s ease calc(var(--i, 0) * 0.2s) infinite",
        orbit: "orbit calc(var(--duration) * 1s) linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        ripple: {
          "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
          "50%": { transform: "translate(-50%, -50%) scale(0.9)" },
        },
        orbit: {
          "0%": {
            transform:
              "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
          },
          "100%": {
            transform:
              "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
          },
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
````

## File: tsconfig.node.json
````json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true
  },
  "include": ["vite.config.ts"]
}
````

## File: src/pages/DataDemo/index.tsx
````typescript
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { 
  Layers, 
  AlertTriangle, 
  PlayCircle, 
  TrendingUp,
  Loader2
} from 'lucide-react'
import { gsap } from 'gsap'
import { PageLayout } from '@/components/shared/PageLayout'
import { DataListView } from './components/DataListView'
import { DataCardView } from './components/DataCardView'
import { DataTableView } from './components/DataTableView'
import { DataDetailPanel } from './components/DataDetailPanel'
import { AnimatedLoadingSkeleton } from './components/AnimatedLoadingSkeleton'
import { StatChartCard } from './components/StatChartCard'
import { DataToolbar, FilterConfig } from './components/DataToolbar'
import { useAppShell } from '@/context/AppShellContext'
import { mockDataItems } from './data/mockData'
import type { DataItem, ViewMode, SortConfig, SortableField } from './types'

type Stat = {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down';
  type?: 'card';
};

type ChartStat = {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down';
  type: 'chart';
  chartData: number[];
};

type StatItem = Stat | ChartStat;

export default function DataDemoPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [filters, setFilters] = useState<FilterConfig>({
    searchTerm: '',
    status: [],
    priority: [],
  })
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'updatedAt', direction: 'desc' })
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null)  
  const [items, setItems] = useState<DataItem[]>([])
  const [page, setPage] = useState(0) // Start at 0 to trigger initial load effect
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const observer = useRef<IntersectionObserver>()
  const { openSidePane } = useAppShell()

  const isInitialLoading = isLoading && items.length === 0

  // Centralized data processing
  const processedData = useMemo(() => {
    let filteredItems = mockDataItems.filter(item => {
      const searchTermMatch =
        item.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.searchTerm.toLowerCase())

      const statusMatch = filters.status.length === 0 || filters.status.includes(item.status)
      const priorityMatch = filters.priority.length === 0 || filters.priority.includes(item.priority)

      return searchTermMatch && statusMatch && priorityMatch
    })

    if (sortConfig) {
      filteredItems.sort((a, b) => {
        let aValue: any
        let bValue: any

        const getNestedValue = (obj: any, path: string) => path.split('.').reduce((o, k) => (o || {})[k], obj)

        aValue = getNestedValue(a, sortConfig.key)
        bValue = getNestedValue(b, sortConfig.key)

        if (aValue === undefined || bValue === undefined) return 0;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
        }
        // Date sorting (assuming ISO strings)
        if (sortConfig.key === 'updatedAt' || sortConfig.key === 'createdAt') {
            return sortConfig.direction === 'asc'
                ? new Date(aValue).getTime() - new Date(aValue).getTime()
                : new Date(bValue).getTime() - new Date(bValue).getTime()
        }
        return 0
      })
    }
    return filteredItems
  }, [filters, sortConfig])

  // Calculate stats from data
  const totalItems = mockDataItems.length
  const activeItems = mockDataItems.filter(item => item.status === 'active').length
  const highPriorityItems = mockDataItems.filter(item => item.priority === 'high' || item.priority === 'critical').length
  const avgCompletion = totalItems > 0 ? Math.round(
    mockDataItems.reduce((acc, item) => acc + item.metrics.completion, 0) / totalItems
  ) : 0

  // Reset pagination when filters or sort change
  useEffect(() => {
    setItems([])
    setPage(0) // This will be incremented to 1 in the loader `useEffect`, triggering a fresh load
    setHasMore(true)
    // This timeout helps prevent a flicker between old and new filtered data
    setTimeout(() => setPage(1), 50)
  }, [processedData])

  // Infinite scroll logic
  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    if (page === 0) return;

    const fetchItems = () => {
      setIsLoading(true);
      const isFirstPage = page === 1
      
      const pageSize = 12;
      const newItems = processedData.slice((page - 1) * pageSize, page * pageSize);
      
      // Simulate network delay, longer for initial load to showcase skeleton
      setTimeout(() => {
        setItems(prev => (isFirstPage ? newItems : [...prev, ...newItems]))
        setHasMore(processedData.length > page * pageSize)
        setIsLoading(false)
      }, isFirstPage && items.length === 0 ? 1500 : 500)
    };

    if (hasMore) fetchItems();
  }, [page]);

  const loaderRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const stats: StatItem[] = [
    {
      title: "Total Projects",
      value: totalItems.toString(),
      icon: <Layers className="w-5 h-5" />,
      change: "+5.2% this month",
      trend: "up" as const,
      type: 'chart',
      chartData: [120, 125, 122, 130, 135, 138, 142]
    },
    {
      title: "Active Projects",
      value: activeItems.toString(),
      icon: <PlayCircle className="w-5 h-5" />,
      change: "+2 this week", 
      trend: "up" as const,
      type: 'chart',
      chartData: [45, 50, 48, 55, 53, 60, 58]
    },
    {
      title: "High Priority",
      value: highPriorityItems.toString(),
      icon: <AlertTriangle className="w-5 h-5" />,
      change: "-1 from last week",
      trend: "down" as const,
      type: 'chart',
      chartData: [25, 26, 28, 27, 26, 24, 23]
    },
    {
      title: "Avg. Completion",
      value: `${avgCompletion}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      change: "+3.2%",
      trend: "up" as const,
      type: 'chart',
      chartData: [65, 68, 70, 69, 72, 75, 78]
    }
  ]

  useEffect(() => {
    // Animate stats cards in
    if (!isInitialLoading && statsRef.current) {
      gsap.fromTo(statsRef.current.children,
        { y: 30, opacity: 0 },
        {
          duration: 0.6,
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: "power2.out"
        }
      )
    }
  }, [isInitialLoading])

  const handleSortChange = (config: SortConfig | null) => {
    setSortConfig(config)
  }

  // For table view header clicks
  const handleTableSort = (field: SortableField) => {
    if (sortConfig?.key === field) {
      if (sortConfig.direction === 'desc') {
        // Cycle: desc -> asc
        setSortConfig({ key: field, direction: 'asc' })
      } else {
        // Cycle: asc -> default
        setSortConfig(null)
      }
    } else {
      // New field, default to desc
      setSortConfig({ key: field, direction: 'desc' })
    }
  }

  const handleFilterChange = (newFilters: FilterConfig) => {
    setFilters(newFilters)
  }
  
  // Handle item selection and open side panel
  const handleItemSelect = (item: DataItem) => {
    setSelectedItem(item)
    openSidePane('data-details')
  }

  const renderView = () => {
    const commonProps = {
      data: items,
      onItemSelect: handleItemSelect,
      selectedItem,
      sortConfig,
      onSort: handleTableSort,
    }

    switch (viewMode) {
      case 'list':
        return <DataListView {...commonProps} />
      case 'cards':
        return <DataCardView {...commonProps} />
      case 'grid':
        return <DataCardView {...commonProps} isGrid />
      case 'table':
        return <DataTableView {...commonProps} />
      default:
        return <DataListView {...commonProps} />
    }
  }

  return (
    <PageLayout
      // Note: Search functionality is handled by a separate SearchBar in the TopBar
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Data Showcase</h1>
            <p className="text-muted-foreground">
              {isInitialLoading 
                ? "Loading projects..." 
                : `Showing ${processedData.length} item(s)`}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        {!isInitialLoading && (
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              if (stat.type === 'chart') {
                return (
                  <StatChartCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    change={stat.change}
                    trend={stat.trend}
                    icon={stat.icon}
                    chartData={stat.chartData}
                  />
                )
              }
            })}
          </div>
        )}

        <div className="space-y-6">
          <DataToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            filters={filters}
            onFiltersChange={handleFilterChange}
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
          />
          <div ref={contentRef} className="min-h-[500px]">
            {isInitialLoading ? <AnimatedLoadingSkeleton viewMode={viewMode} /> : renderView()}
          </div>
        </div>

        {/* Loader for infinite scroll */}
        <div ref={loaderRef} className="flex justify-center items-center py-6">
          {isLoading && !isInitialLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more...</span>
            </div>
          )}
          {!isLoading && !hasMore && processedData.length > 0 && !isInitialLoading && (
            <p className="text-muted-foreground">You've reached the end.</p>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      <DataDetailPanel 
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </PageLayout>
  )
}
````

## File: vite.config.ts
````typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'
import { resolve } from 'path'
import pkg from './package.json' with { type: 'json' }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'JeliAppShell',
      fileName: (format) => `jeli-app-shell.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: Object.keys(pkg.peerDependencies || {}),
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          tailwindcss: 'tailwindcss',
          gsap: 'gsap',
          'lucide-react': 'lucide-react',
          zustand: 'zustand',
          sonner: 'sonner'
        },
      },
    },
  },
})
````

## File: README.md
````markdown
# Jeli App Shell

[![npm version](https://img.shields.io/npm/v/jeli-app-shell.svg?style=flat)](https://www.npmjs.com/package/jeli-app-shell)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/travis/com/your-username/jeli-app-shell.svg)](https://travis-ci.com/your-username/jeli-app-shell)

A fully-featured, animated, and customizable application shell for React, built with TypeScript, Tailwind CSS, and powered by GSAP for smooth animations. Provide a modern, desktop-grade user experience out of the box.

This library provides all the necessary components and hooks to build a complex application layout with a resizable sidebar, a dynamic main content area, a contextual side pane, and more.

[**Live Demo (Storybook) →**](https://your-demo-link.com)

 <!-- TODO: Add a real preview image -->

---

## Key Features

-   **Component-Based Architecture**: Build your shell by composing flexible and powerful React components.
-   **Resizable Sidebar**: Draggable resizing with multiple states: `Expanded`, `Collapsed`, `Hidden`, and `Peek` (on hover).
-   **Dynamic Body States**: Seamlessly switch between `Normal`, `Fullscreen`, and `Side Pane` views.
-   **Smooth Animations**: Fluid transitions powered by GSAP for a premium feel.
-   **Dark Mode Support**: First-class dark mode support, easily toggled.
-   **Customizable Theming**: Easily theme your application using CSS variables, just like shadcn/ui.
-   **State Management Included**: Simple and powerful state management via React Context and Zustand.
-   **Command Palette**: Built-in command palette for quick navigation and actions.
-   **TypeScript & Modern Tools**: Built with TypeScript, React, Vite, and Tailwind CSS for a great developer experience.

## Installation

Install the package and its peer dependencies using your preferred package manager.
```bash
npm install jeli-app-shell react react-dom tailwindcss gsap lucide-react tailwind-merge class-variance-authority clsx tailwindcss-animate
```

or

```bash
yarn add jeli-app-shell react react-dom tailwindcss gsap lucide-react tailwind-merge class-variance-authority clsx tailwindcss-animate
```

## Getting Started

Follow these steps to integrate Jeli App Shell into your project.

### 1. Configure Tailwind CSS

You need to configure Tailwind CSS to correctly process the styles from the library.

**`tailwind.config.js`**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  // ... your other config
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // Add the path to the library's components
    './node_modules/jeli-app-shell/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    // ...
  },
  plugins: [require('tailwindcss-animate')],
};
```

**`index.css` (or your main CSS file)**

You need to import the library's stylesheet. It contains all the necessary base styles and CSS variables for theming.

```css
/* Import Tailwind's base, components, and utilities */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Import the App Shell's stylesheet */
@import 'jeli-app-shell/dist/style.css';
```

### 2. Set Up Providers

Wrap your application's root component with `AppShellProvider` and `ToasterProvider`.

**`App.tsx`**

```tsx
import React from 'react';
import { AppShellProvider } from 'jeli-app-shell';
import { ToasterProvider } from 'jeli-app-shell'; // Re-exported for convenience
import { Rocket } from 'lucide-react';
import { YourAppComponent } from './YourAppComponent';

function App() {
  const myLogo = (
    <div className="p-2 bg-primary/20 rounded-lg">
      <Rocket className="w-5 h-5 text-primary" />
    </div>
  );

  return (
    <AppShellProvider appName="My Awesome App" appLogo={myLogo}>
      <ToasterProvider>
        <YourAppComponent />
      </ToasterProvider>
    </AppShellProvider>
  );
}

export default App;
```

### 3. Compose Your Shell

The `<AppShell>` component is the heart of the library. You compose your layout by passing the `sidebar`, `topBar`, `mainContent`, and `rightPane` components as props.

Here's a complete example:

**`YourAppComponent.tsx`**

```tsx
import {
  // Main Layout
  AppShell,
  MainContent,
  RightPane,
  TopBar,

  // Sidebar Primitives
  Sidebar,
  SidebarBody,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarIcon,
  SidebarLabel,

  // Hooks & Context
  useAppShell,
} from 'jeli-app-shell';
import { Home, Settings, PanelRight } from 'lucide-react';

// 1. Build your custom sidebar
const MySidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <SidebarTitle>My App</SidebarTitle>
        </SidebarHeader>
        <SidebarBody>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <SidebarIcon><Home /></SidebarIcon>
              <SidebarLabel>Dashboard</SidebarLabel>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <SidebarIcon><Settings /></SidebarIcon>
              <SidebarLabel>Settings</SidebarLabel>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarBody>
      </SidebarContent>
    </Sidebar>
  );
};

// 2. Build your custom top bar content
const MyTopBarContent = () => {
  const { openSidePane } = useAppShell();
  return (
    <button onClick={() => openSidePane('details')} title="Open Details">
      <PanelRight />
    </button>
  );
};

// 3. Build your main content
const MyMainContent = () => {
  return (
    <div>
      <h1>Welcome to your Dashboard!</h1>
      <p>This is the main content area.</p>
    </div>
  );
};

// 4. Build your right pane
const MyRightPane = () => {
  return (
    <div>
      <h3>Details Panel</h3>
      <p>Contextual information goes here.</p>
    </div>
  );
};

// 5. Assemble the App Shell
export function YourAppComponent() {
  return (
    <AppShell
      sidebar={<MySidebar />}
      topBar={<TopBar><MyTopBarContent /></TopBar>}
      mainContent={<MainContent><MyMainContent /></MainContent>}
      rightPane={<RightPane>{<MyRightPane />}</RightPane>}
    />
  );
}
```

## Component API

### Layout Components

-   `<AppShellProvider>`: Wraps your app and provides the context for all hooks and components.
-   `<AppShell>`: The main container that orchestrates the layout. Requires `sidebar`, `topBar`, `mainContent`, and `rightPane` props.
-   `<TopBar>`: The header component. It's a container for your own controls and branding.
-   `<MainContent>`: The primary content area of your application.
-   `<RightPane>`: A panel that slides in from the right, perfect for details, forms, or secondary information.

### Sidebar Primitives

The sidebar is built using a set of highly composable components.

-   `<Sidebar>`: The root sidebar component.
-   `<SidebarContent>`: Wrapper for all sidebar content.
-   `<SidebarHeader>`, `<SidebarBody>`, `<SidebarFooter>`: Structural components to organize sidebar content.
-   `<SidebarTitle>`: The title of your app, automatically hidden when the sidebar is collapsed.
-   `<SidebarSection>`: A component to group menu items with an optional title.
-   `<SidebarMenuItem>`: A wrapper for a single menu item, including the button and potential actions.
-   `<SidebarMenuButton>`: The main clickable button for a menu item.
-   `<SidebarIcon>`, `<SidebarLabel>`, `<SidebarBadge>`, `<SidebarTooltip>`: Atomic parts of a menu item.

### Ready-to-use Components

-   `<UserDropdown>`: A pre-styled user profile dropdown menu.
-   `<WorkspaceSwitcher>`: A complete workspace/tenant switcher component.
-   `<PageHeader>`: A standardized header for your main content pages.
-   `<LoginPage>`: A beautiful, animated login page component.
-   `<CommandPalette>`: A powerful command palette for your application.

### UI Primitives

The library also exports a set of UI components (Button, Card, Badge, etc.) based on shadcn/ui. You can import them directly from `jeli-app-shell`.

## Hooks

-   `useAppShell()`: The primary hook to control the shell's state.
    -   `sidebarState`: Current state of the sidebar (`expanded`, `collapsed`, etc.).
    -   `bodyState`: Current body state (`normal`, `fullscreen`, `side_pane`).
    -   `toggleSidebar()`: Toggles the sidebar between expanded and collapsed.
    -   `openSidePane(content: string)`: Opens the right-hand pane.
    -   `closeSidePane()`: Closes the right-hand pane.
    -   `toggleFullscreen()`: Toggles fullscreen mode.
    -   `dispatch`: For more granular state control.
-   `useToast()`: A hook to display toast notifications.
    -   `show({ title, message, variant, ... })`

## Theming

Customizing the look and feel is straightforward. The library uses CSS variables for colors, border radius, etc., which you can override in your global CSS file.

**`index.css`**

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 262.1 83.3% 57.8%; /* New primary color: Violet */
    --primary-foreground: 210 40% 98%;
    --radius: 0.75rem; /* New border radius */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 262.1 83.3% 57.8%;
    --primary-foreground: 210 40% 98%;
  }
}
```

## Contributing

Contributions are welcome! Please read our [contributing guidelines](./CONTRIBUTING.md) to get started.

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.
````

## File: package.json
````json
{
  "name": "jeli-app-shell",
  "private": false,
  "version": "1.0.1",
  "type": "module",
  "files": [
    "dist"
  ],
  "main": "./dist/jeli-app-shell.umd.js",
  "module": "./dist/jeli-app-shell.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/jeli-app-shell.es.js",
      "require": "./dist/jeli-app-shell.umd.js"
    },
    "./dist/style.css": "./dist/style.css"
  },
  "sideEffects": [
    "**/*.css"
  ],
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {},
  "peerDependencies": {
    "@iconify/react": "^4.1.1",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "cmdk": "^0.2.0",
    "gsap": "^3.12.2",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "sonner": "^1.2.4",
    "tailwind-merge": "^2.0.0",
    "tailwindcss": "^3.3.5",
    "zustand": "^4.5.7"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.1.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5.2.2",
    "vite": "^4.5.0"
  }
}
````
