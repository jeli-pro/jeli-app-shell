import { useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, Check, Inbox, Clock, Zap, Shield, Eye } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useMessagingStore } from '../store/messaging.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { cn, formatDistanceToNowShort } from '@/lib/utils';
import { AnimatedTabs } from '@/components/ui/animated-tabs';
import type { TaskStatus, TaskPriority, TaskView } from '../types';
import { useAppViewManager } from '@/hooks/useAppViewManager.hook';
import { useMessagingTaskCounts } from '../store/messaging.store';

// Local helpers for styling based on task properties
const getStatusIcon = (status: TaskStatus) => {
    switch(status) {
        case 'open': return <Inbox className="w-3 h-3 text-blue-500" />;
        case 'in-progress': return <Zap className="w-3 h-3 text-yellow-500" />;
        case 'done': return <Shield className="w-3 h-3 text-green-500" />;
        case 'snoozed': return <Clock className="w-3 h-3 text-gray-500" />;
    }
};

const getPriorityIcon = (priority: TaskPriority) => {
    switch(priority) {
        case 'high': return <div className="w-2 h-2 rounded-full bg-red-500" />;
        case 'medium': return <div className="w-2 h-2 rounded-full bg-yellow-500" />;
        case 'low': return <div className="w-2 h-2 rounded-full bg-green-500" />;
        default: return <div className="w-2 h-2 rounded-full bg-gray-400" />;
    }
};

const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'open', label: 'Open' }, { value: 'in-progress', label: 'In Progress' }, { value: 'done', label: 'Done' }, { value: 'snoozed', label: 'Snoozed' }
];
const priorityOptions: { value: TaskPriority; label: string }[] = [
    { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }, { value: 'none', label: 'None' }
];

const TABS_CONFIG: { id: TaskView, label: string }[] = [
  { id: 'all_open', label: 'Open' },
  { id: 'unassigned', label: 'Unassigned' },
  { id: 'me', label: 'Me' },
  { id: 'done', label: 'Done' }
];

export const TaskList = () => {
  const { conversationId } = useParams<{ conversationId: string }>(); // This will be taskId later
  const { 
    getFilteredTasks,
    setSearchTerm,
    activeFilters,
    setActiveTaskView,
    searchTerm,
   } = useMessagingStore();
   const { messagingView, setMessagingView } = useAppViewManager();
   const taskCounts = useMessagingTaskCounts();

  useEffect(() => {
    setActiveTaskView(messagingView || 'all_open');
  }, [messagingView, setActiveTaskView]);

  const filteredTasks = getFilteredTasks();
  const activeFilterCount = Object.values(activeFilters).reduce((count, filterArray) => count + filterArray.length, 0);

  const TABS = useMemo(() => 
    TABS_CONFIG.map(tab => ({
      ...tab,
      count: taskCounts[tab.id as keyof typeof taskCounts]
    })), 
    [taskCounts]
  );

  return (
    <div className="h-full flex flex-col bg-background/80">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-background/80 p-4 space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Inbox</h2>
        <div className="flex gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search tasks..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10 border-dashed gap-2">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                        {activeFilterCount > 0 && <Badge variant="secondary" className="rounded-sm px-1 font-normal">{activeFilterCount}</Badge>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0" align="end">
                    <FilterCommand />
                </PopoverContent>
            </Popover>
        </div>
      </div>
      <AnimatedTabs
        tabs={TABS}
        activeTab={messagingView || 'all_open'}
        onTabChange={(tabId) => setMessagingView(tabId as TaskView)}
        size="sm"
        className="px-4"
      />

      {/* Task List */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-1">
          {filteredTasks.map(task => {
            const currentUserId = 'user-1';
            const isHandledByOther = task.activeHandlerId && task.activeHandlerId !== currentUserId;

            return (
              <Link
                to={`/messaging/${task.id}`}
                key={task.id}
                className={cn(
                  "block p-3 rounded-lg text-left transition-all duration-200 hover:bg-accent/50",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none",
                  conversationId === task.id && "bg-accent"
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 mt-1">
                    <AvatarImage src={task.contact.avatar} alt={task.contact.name} />
                    <AvatarFallback>{task.contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-semibold truncate pr-2">
                        {task.contact.name} <span className="text-muted-foreground font-normal">&middot; {task.contact.company}</span>
                      </p>
                      <p className="text-sm truncate text-foreground mt-1">{task.title}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5" title={task.status}>
                              {getStatusIcon(task.status)}
                              <span className="capitalize">{task.status.replace('-', ' ')}</span>
                          </div>
                          <div className="flex items-center gap-1.5" title={task.priority}>
                              {getPriorityIcon(task.priority)}
                              <span className="capitalize">{task.priority}</span>
                          </div>
                          {task.assignee && (
                              <div className="flex items-center gap-1.5" title={`Assigned to ${task.assignee.name}`}>
                                  <Avatar className="h-4 w-4"><AvatarImage src={task.assignee.avatar} /></Avatar>
                              </div>
                          )}
                          {isHandledByOther && <Eye className="w-3.5 h-3.5" title="Being handled by another user" />}
                      </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1.5 flex-shrink-0">
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{formatDistanceToNowShort(new Date(task.lastActivity.timestamp))}</p>
                    {task.unreadCount > 0 ? (
                        <Badge className="bg-primary h-5 w-5 p-0 flex items-center justify-center">{task.unreadCount}</Badge>
                    ) : <div className="h-5 w-5" /> /* Spacer to maintain alignment */ }
                  </div>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  );
};

// Filter component for popover
function FilterCommand() {
    const { activeFilters, setFilters, assignees, getAvailableTags } = useMessagingStore();
    const availableTags = getAvailableTags();

    const handleSelect = (type: 'status' | 'priority' | 'assigneeId' | 'tags', value: string) => {
        const current = new Set(activeFilters[type]);
        current.has(value) ? current.delete(value) : current.add(value);
        setFilters({ [type]: Array.from(current) });
    };

    const hasActiveFilters = Object.values(activeFilters).some(arr => arr.length > 0);

    return (
        <Command>
            <CommandInput placeholder="Filter by..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Status">
                    {statusOptions.map(o => (
                        <CommandItem key={o.value} onSelect={() => handleSelect('status', o.value)}>
                            <div className={cn('mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary', activeFilters.status.includes(o.value) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible')}><Check className="h-4 w-4" /></div>
                            <span>{o.label}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Priority">
                    {priorityOptions.map(o => (
                        <CommandItem key={o.value} onSelect={() => handleSelect('priority', o.value)}>
                            <div className={cn('mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary', activeFilters.priority.includes(o.value) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible')}><Check className="h-4 w-4" /></div>
                            <span>{o.label}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Assignee">
                    {assignees.map(a => (
                        <CommandItem key={a.id} onSelect={() => handleSelect('assigneeId', a.id)}>
                            <div className={cn('mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary', activeFilters.assigneeId.includes(a.id) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible')}><Check className="h-4 w-4" /></div>
                            <Avatar className="h-5 w-5 mr-2"><AvatarImage src={a.avatar} /><AvatarFallback>{a.name.charAt(0)}</AvatarFallback></Avatar>
                            <span>{a.name}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Tags">
                    {availableTags.map(t => (
                        <CommandItem key={t} onSelect={() => handleSelect('tags', t)}>
                            <div className={cn('mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary', activeFilters.tags.includes(t) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible')}><Check className="h-4 w-4" /></div>
                            <span>{t}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>

                {hasActiveFilters && (
                    <>
                        <CommandSeparator />
                        <CommandGroup>
                            <CommandItem onSelect={() => setFilters({ status: [], priority: [], assigneeId: [], tags: [], channels: [] })} className="justify-center text-center text-sm">Clear all filters</CommandItem>
                        </CommandGroup>
                    </>
                )}
            </CommandList>
        </Command>
    );
}