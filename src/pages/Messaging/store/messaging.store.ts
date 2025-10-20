import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { mockTasks, mockContacts, mockAssignees } from '../data/mockData';
import type { Task, Contact, Channel, Assignee, TaskStatus, TaskPriority, TaskView } from '../types';

const currentUserId = 'user-1'; // Mock current user

interface MessagingState {
  tasks: Task[];
  contacts: Contact[];
  assignees: Assignee[];
  searchTerm: string;
  activeFilters: {
    channels: Channel[];
    tags: string[];
    status: TaskStatus[];
    priority: TaskPriority[];
    assigneeId: string[];
  };
  activeTaskView: TaskView;
}

interface MessagingActions {
  getTaskById: (id: string) => (Task & { contact: Contact, assignee: Assignee | null, activeHandler: Assignee | null }) | undefined;
  getFilteredTasks: () => (Task & { contact: Contact, assignee: Assignee | null })[];
  setSearchTerm: (term: string) => void;
  setActiveTaskView: (view: TaskView) => void;
  setFilters: (filters: Partial<MessagingState['activeFilters']>) => void;
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id'>>) => void;
  takeOverTask: (taskId: string, userId: string) => void;
  requestAndSimulateTakeover: (taskId: string, requestedByUserId: string) => void;
  getAssigneeById: (assigneeId: string) => Assignee | undefined;
  getContactsByCompany: (companyName: string, currentContactId: string) => Contact[];
  getAvailableTags: () => string[];
}

export const useMessagingStore = create<MessagingState & MessagingActions>((set, get) => ({
  tasks: mockTasks,
  contacts: mockContacts,
  assignees: mockAssignees,
  searchTerm: '',
  activeFilters: {
    channels: [],
    tags: [],
    status: [],
    priority: [],
    assigneeId: [],
  },
  activeTaskView: 'all_open',

  getTaskById: (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return undefined;

    const contact = get().contacts.find(c => c.id === task.contactId);
    if (!contact) return undefined;

    const assignee = get().assignees.find(a => a.id === task.assigneeId) || null;
    const activeHandler = get().assignees.find(a => a.id === task.activeHandlerId) || null;

    return { ...task, contact, assignee, activeHandler };
  },

  getFilteredTasks: () => {
    const { tasks, contacts, assignees, searchTerm, activeFilters, activeTaskView } = get();
    const lowercasedSearch = searchTerm.toLowerCase();

    const viewFilteredTasks = tasks.filter(task => {
      switch (activeTaskView) {
        case 'all_open':
          return task.status === 'open' || task.status === 'in-progress';
        case 'unassigned':
          return !task.assigneeId && (task.status === 'open' || task.status === 'in-progress');
        case 'me':
          return task.assigneeId === currentUserId && (task.status === 'open' || task.status === 'in-progress');
        case 'done':
          return task.status === 'done';
        default:
          return true;
      }
    });
    const mapped = viewFilteredTasks.map(task => {
      const contact = contacts.find(c => c.id === task.contactId) as Contact;
      const assignee = assignees.find(a => a.id === task.assigneeId) || null;
      return { ...task, contact, assignee };
    });

    const filtered = mapped.filter(task => {
      const searchMatch = task.title.toLowerCase().includes(lowercasedSearch) || task.contact.name.toLowerCase().includes(lowercasedSearch);
      const channelMatch = activeFilters.channels.length === 0 || activeFilters.channels.includes(task.channel);
      const tagMatch = activeFilters.tags.length === 0 || activeFilters.tags.some(tag => task.tags.includes(tag));
      const statusMatch = activeFilters.status.length === 0 || activeFilters.status.includes(task.status);
      const priorityMatch = activeFilters.priority.length === 0 || activeFilters.priority.includes(task.priority);
      const assigneeMatch = activeFilters.assigneeId.length === 0 || (task.assigneeId && activeFilters.assigneeId.includes(task.assigneeId));
      
      return searchMatch && channelMatch && tagMatch && statusMatch && priorityMatch && assigneeMatch;
    });

    return filtered.sort((a, b) => new Date(b.lastActivity.timestamp).getTime() - new Date(a.lastActivity.timestamp).getTime());
  },

  setSearchTerm: (term) => set({ searchTerm: term }),
  
  setActiveTaskView: (view) => set({ activeTaskView: view }),

  setFilters: (newFilters) => set(state => ({
    activeFilters: { ...state.activeFilters, ...newFilters }
  })),

  updateTask: (taskId, updates) => set(state => ({
    tasks: state.tasks.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, lastActivity: { ...task.lastActivity, timestamp: new Date().toISOString() } } 
        : task
    )
  })),

  takeOverTask: (taskId, userId) => set(state => ({
    tasks: state.tasks.map(task => 
      task.id === taskId 
        ? { ...task, activeHandlerId: userId, takeoverRequested: false } 
        : task
    )
  })),

  requestAndSimulateTakeover: (taskId, requestedByUserId) => {
    set(state => ({
      tasks: state.tasks.map(task => 
        task.id === taskId ? { ...task, takeoverRequested: true } : task
      )
    }));
    // Simulate a 2-second delay for the other user to "approve"
    setTimeout(() => get().takeOverTask(taskId, requestedByUserId), 2000);
  },

  getAssigneeById: (assigneeId: string) => {
    return get().assignees.find(a => a.id === assigneeId);
  },

  getContactsByCompany: (companyName, currentContactId) => {
    return get().contacts.filter(
      c => c.company === companyName && c.id !== currentContactId
    );
  },

  getAvailableTags: () => {
    const contactTags = get().contacts.flatMap(c => c.tags);
    const taskTags = get().tasks.flatMap(t => t.tags);
    const allTags = new Set([...contactTags, ...taskTags]);
    return Array.from(allTags);
  }
}));

export const useMessagingTaskCounts = () => {
  const tasks = useMessagingStore(s => s.tasks);
  const [counts, setCounts] = useState<Record<TaskView, number>>({
    all_open: 0,
    unassigned: 0,
    me: 0,
    done: 0,
  });

  useEffect(() => {
    // Deferring the count calculation until after the first paint.
    // This frees up the main thread for initial animations to run smoothly.
    const animationFrameId = requestAnimationFrame(() => {
        const newCounts: Record<TaskView, number> = {
            all_open: 0,
            unassigned: 0,
            me: 0,
            done: 0,
        };

        for (const task of tasks) {
            const isOpenOrInProgress = task.status === 'open' || task.status === 'in-progress';

            if (isOpenOrInProgress) {
                newCounts.all_open++;
                if (!task.assigneeId) newCounts.unassigned++;
                if (task.assigneeId === currentUserId) newCounts.me++;
            } else if (task.status === 'done') {
                newCounts.done++;
            }
        }
        setCounts(newCounts);
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, [tasks]);

  return counts;
};