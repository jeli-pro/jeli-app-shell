import { create } from 'zustand';
import { mockTasks, mockContacts, mockAssignees } from '../data/mockData';
import type { Task, Contact, Channel, Assignee, TaskStatus, TaskPriority } from '../types';

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
}

interface MessagingActions {
  getTaskById: (id: string) => (Task & { contact: Contact, assignee: Assignee | null }) | undefined;
  getFilteredTasks: () => (Task & { contact: Contact, assignee: Assignee | null })[];
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<MessagingState['activeFilters']>) => void;
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id'>>) => void;
  getAssigneeById: (assigneeId: string) => Assignee | undefined;
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

  getTaskById: (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return undefined;

    const contact = get().contacts.find(c => c.id === task.contactId);
    if (!contact) return undefined;

    const assignee = get().assignees.find(a => a.id === task.assigneeId) || null;

    return { ...task, contact, assignee };
  },

  getFilteredTasks: () => {
    const { tasks, contacts, assignees, searchTerm, activeFilters } = get();
    const lowercasedSearch = searchTerm.toLowerCase();

    const mapped = tasks.map(task => {
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

  getAssigneeById: (assigneeId: string) => {
    return get().assignees.find(a => a.id === assigneeId);
  },

  getAvailableTags: () => {
    const contactTags = get().contacts.flatMap(c => c.tags);
    const taskTags = get().tasks.flatMap(t => t.tags);
    const allTags = new Set([...contactTags, ...taskTags]);
    return Array.from(allTags);
  }
}));