import React from 'react';
import { useMessagingStore } from '../store/messaging.store';
import type { Task, TaskStatus, TaskPriority, Assignee, Contact } from '../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, Inbox, Zap, Shield, Clock, Calendar, Plus, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const statusOptions: { value: TaskStatus; label: string; icon: React.ReactNode }[] = [
    { value: 'open', label: 'Open', icon: <Inbox className="w-4 h-4" /> },
    { value: 'in-progress', label: 'In Progress', icon: <Zap className="w-4 h-4" /> },
    { value: 'done', label: 'Done', icon: <Shield className="w-4 h-4" /> },
    { value: 'snoozed', label: 'Snoozed', icon: <Clock className="w-4 h-4" /> },
];

const priorityOptions: { value: TaskPriority; label: string; icon: React.ReactNode }[] = [
    { value: 'high', label: 'High', icon: <div className="w-2.5 h-2.5 rounded-full bg-red-500" /> },
    { value: 'medium', label: 'Medium', icon: <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> },
    { value: 'low', label: 'Low', icon: <div className="w-2.5 h-2.5 rounded-full bg-green-500" /> },
    { value: 'none', label: 'None', icon: <div className="w-2.5 h-2.5 rounded-full bg-gray-400" /> },
];


interface TaskHeaderProps {
  task: (Task & { contact: Contact; assignee: Assignee | null });
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({ task }) => {
  const { updateTask, assignees } = useMessagingStore();
  const currentStatus = statusOptions.find(o => o.value === task.status);
  const currentPriority = priorityOptions.find(o => o.value === task.priority);

  return (
    <div className="space-y-4">
      {/* Task Title & Contact */}
      <div className="overflow-hidden">
        <h2 className="font-bold text-xl lg:text-2xl truncate" title={task.title}>
          {task.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          With <a href="#" className="hover:underline font-medium text-foreground/80">{task.contact.name}</a>
          <span className="mx-1.5">&middot;</span>
          via <span className="capitalize font-medium text-foreground/80">{task.channel}</span>
        </p>
      </div>

      {/* Properties Bar */}
      <div className="flex flex-wrap items-center gap-y-2 text-sm">
        {/* Assignee Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 font-normal">
              {task.assignee ? (
                <Avatar className="h-5 w-5"><AvatarImage src={task.assignee.avatar} /><AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback></Avatar>
              ) : (
                <User className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="font-medium">{task.assignee?.name || 'Unassigned'}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup value={task.assigneeId || 'null'} onValueChange={val => updateTask(task.id, { assigneeId: val === 'null' ? null : val })}>
              <DropdownMenuRadioItem value="null">
                <User className="w-4 h-4 mr-2 text-muted-foreground" /> Unassigned
              </DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              {assignees.map(a => (
                <DropdownMenuRadioItem key={a.id} value={a.id}>
                  <Avatar className="h-5 w-5 mr-2"><AvatarImage src={a.avatar} /><AvatarFallback>{a.name.charAt(0)}</AvatarFallback></Avatar>
                  {a.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-2 h-4 w-px bg-border" />

        {/* Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              {currentStatus?.icon}
              <span className="font-medium text-foreground">{currentStatus?.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {statusOptions.map(o => (
              <DropdownMenuItem key={o.value} onClick={() => updateTask(task.id, { status: o.value })}>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2">{o.icon}</div>
                  <span>{o.label}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="mx-2 h-4 w-px bg-border" />
        
        {/* Priority Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              {currentPriority?.icon}
              <span className="font-medium text-foreground">{currentPriority?.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {priorityOptions.map(o => (
              <DropdownMenuItem key={o.value} onClick={() => updateTask(task.id, { priority: o.value })}>
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 mr-2">{o.icon}</div>
                  <span>{o.label}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-2 h-4 w-px bg-border" />

        {/* Due Date - for display, could be a popover trigger */}
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground cursor-default" disabled>
            <Calendar className="w-4 h-4" />
            <span className="font-medium text-foreground">{task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}</span>
        </Button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2">
        {task.tags.map(t => <Badge variant="secondary" key={t}>{t}</Badge>)}
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs rounded-md border-dashed">
          <Plus className="w-3 h-3 mr-1" /> Tag
        </Button>
      </div>
    </div>
  );
};
