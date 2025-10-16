# Directory Structure
```
src/
  components/
    layout/
      EnhancedSidebar.tsx
      Sidebar.tsx
  hooks/
    useAppViewManager.hook.ts
  pages/
    Messaging/
      components/
        TaskList.tsx
      store/
        messaging.store.ts
      index.tsx
      types.ts
  store/
    appShell.store.ts
index.html
package.json
postcss.config.js
tailwind.config.js
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## File: src/pages/Messaging/components/TaskList.tsx
```typescript
import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Check, Inbox, Clock, Zap, Shield } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useMessagingStore } from '../store/messaging.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { AnimatedTabs } from '@/components/ui/animated-tabs';
import type { TaskStatus, TaskPriority } from '../types';

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

export const TaskList = () => {
  const { conversationId } = useParams<{ conversationId: string }>(); // This will be taskId later
  const { 
    getFilteredTasks,
    searchTerm,
    setSearchTerm,
    activeFilters,
   } = useMessagingStore();
  const tasks = getFilteredTasks();
  const [activeTab, setActiveTab] = useState('all');

  const tabs = useMemo(() => [{ id: 'all', label: 'All Tasks' }, { id: 'unread', label: 'Unread' }], []);

  const filteredTasks = useMemo(() => {
    if (activeTab === 'unread') {
      return tasks.filter(task => task.unreadCount > 0);
    }
    return tasks;
  }, [tasks, activeTab]);
  
  const activeFilterCount = Object.values(activeFilters).reduce((count, filterArray) => count + filterArray.length, 0);


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
      <AnimatedTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Task List */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-1">
          {filteredTasks.map(task => (
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
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-semibold truncate pr-2">{task.contact.name}</p>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">{formatDistanceToNow(new Date(task.lastActivity.timestamp), { addSuffix: true })}</p>
                    </div>
                    <p className="text-sm truncate text-foreground">{task.title}</p>
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
                    </div>
                </div>
                {task.unreadCount > 0 && (
                    <div className="flex items-center justify-center self-center ml-auto">
                        <Badge className="bg-primary h-5 w-5 p-0 flex items-center justify-center">{task.unreadCount}</Badge>
                    </div>
                )}
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

// Filter component for popover
function FilterCommand() {
    const { activeFilters, setFilters, assignees, getAvailableTags } = useMessagingStore();
    const availableTags = useMemo(() => getAvailableTags(), [getAvailableTags]);

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
```

## File: src/pages/Messaging/store/messaging.store.ts
```typescript
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
```

## File: src/pages/Messaging/types.ts
```typescript
import type { LucideIcon } from "lucide-react";

export type Channel = 'whatsapp' | 'instagram' | 'facebook' | 'email';

export interface ChannelIcon {
  Icon: LucideIcon;
  color: string;
}

export interface Contact {
  id: string;
  name:string;
  avatar: string;
  online: boolean;
  tags: string[];
  email: string;
  phone: string;
  lastSeen: string;
  company: string;
  role: string;
  activity: ActivityEvent[];
  notes: Note[];
}

export interface Assignee {
  id: string;
  name: string;
  avatar: string;
}

export type ActivityEventType = 'note' | 'call' | 'email' | 'meeting';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  content: string;
  timestamp: string;
}
export interface Note {
  id: string;
  content: string;
  createdAt: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'contact' | 'system';
  type: 'comment' | 'note' | 'system';
  read: boolean;
  userId?: string; // for notes or system messages from users
}

export interface AISummary {
  sentiment: 'positive' | 'negative' | 'neutral';
  summaryPoints: string[];
  suggestedReplies: string[];
}

export type TaskStatus = 'open' | 'in-progress' | 'done' | 'snoozed';
export type TaskPriority = 'none' | 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  contactId: string;
  channel: Channel;
  unreadCount: number;
  lastActivity: Message;
  messages: Message[];
  status: TaskStatus;
  assigneeId: string | null;
  dueDate: string | null;
  priority: TaskPriority;
  tags: string[];
  aiSummary: AISummary;
}
```

## File: tsconfig.json
```json
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
  ]
}
```

## File: index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jeli App Shell</title>
    <script>
      (function() {
        try {
          const storageKey = 'app-shell-storage';
          const storageValue = localStorage.getItem(storageKey);
          let isDarkMode;

          if (storageValue) {
            isDarkMode = JSON.parse(storageValue)?.state?.isDarkMode;
          }
          
          if (typeof isDarkMode !== 'boolean') {
            isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
          }
          
          document.documentElement.classList.toggle('dark', isDarkMode);
        } catch (e) { /* Fails safely */ }
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <div id="toaster-container"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## File: tailwind.config.js
```javascript
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
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss/plugin")(function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      });
    }),
  ],
}
```

## File: tsconfig.node.json
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

## File: vite.config.ts
```typescript
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
```

## File: src/components/layout/Sidebar.tsx
```typescript
import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';
import { useAppShellStore } from '@/store/appShell.store';
import { SIDEBAR_STATES } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// --- Context ---
interface SidebarContextValue {
  isCollapsed: boolean;
  isPeek: boolean;
  compactMode: boolean;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a Sidebar component');
  }
  return context;
};

// --- Main Sidebar Component ---
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ children, className, ...props }, ref) => {
    const sidebarState = useAppShellStore(s => s.sidebarState);
    const compactMode = useAppShellStore(s => s.compactMode);
    const isCollapsed = sidebarState === SIDEBAR_STATES.COLLAPSED;
    const isPeek = sidebarState === SIDEBAR_STATES.PEEK;

    return (
      <SidebarContext.Provider value={{ isCollapsed, isPeek, compactMode }}>
        <div
          ref={ref}
          className={cn(
            'relative bg-card flex-shrink-0',
            'h-full',
            isPeek && 'shadow-xl z-40',
            compactMode && 'text-sm',
            className,
          )}
          {...props}
        >
          {isPeek && <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />}
          {children}
        </div>
      </SidebarContext.Provider>
    );
  },
);
Sidebar.displayName = 'Sidebar';

// --- Sidebar Content Wrapper ---
const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { compactMode } = useSidebar();
  return (
    <div
      ref={ref}
      className={cn(
        'relative z-10 h-full flex flex-col',
        compactMode ? 'p-3' : 'p-4',
        className,
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = 'SidebarContent';

// --- Sidebar Header ---
const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebar();
  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-3',
        isCollapsed ? 'justify-center' : 'px-3',
        'h-16',
        className,
      )}
      {...props}
    />
  );
});
SidebarHeader.displayName = 'SidebarHeader';

const SidebarTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebar();
  if (isCollapsed) return null;
  return (
    <h1
      ref={ref}
      className={cn('text-lg font-bold nav-label', className)}
      {...props}
    />
  );
});
SidebarTitle.displayName = 'SidebarTitle';

// --- Sidebar Body ---
const SidebarBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex-1 overflow-y-auto space-y-6 pt-4',
      className,
    )}
    {...props}
  />
));
SidebarBody.displayName = 'SidebarBody';

// --- Sidebar Footer ---
const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { compactMode } = useSidebar();
  return (
    <div
      ref={ref}
      className={cn('pt-4 border-t border-border', compactMode && 'pt-3', className)}
      {...props}
    />
  );
});
SidebarFooter.displayName = 'SidebarFooter';

// --- Sidebar Section ---
const SidebarSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    collapsible?: boolean;
    defaultExpanded?: boolean;
  }
>(({ title, collapsible = false, defaultExpanded = true, children, ...props }, ref) => {
  const { isCollapsed } = useSidebar();
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  const handleToggle = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div ref={ref} className="space-y-1" {...props}>
      {!isCollapsed && title && (
        <div
          className={cn(
            'flex items-center justify-between px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider',
            collapsible && 'cursor-pointer hover:text-foreground transition-colors',
          )}
          onClick={handleToggle}
        >
          <span className="section-title">{title}</span>
          {collapsible && (
            <ChevronDown
              className={cn(
                'section-chevron w-3 h-3 transition-transform',
                isExpanded ? 'rotate-0' : '-rotate-90',
              )}
            />
          )}
        </div>
      )}
      {(!collapsible || isExpanded || isCollapsed) && (
        <nav className="space-y-1">{children}</nav>
      )}
    </div>
  );
});
SidebarSection.displayName = 'SidebarSection';

// --- Sidebar Menu Item ---
const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('group/item relative flex items-stretch', className)} {...props} />;
});
SidebarMenuItem.displayName = 'SidebarMenuItem';


// --- Sidebar Menu Button ---
interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isActive?: boolean;
}
const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, asChild = false, isActive, ...props }, ref) => {
    const { isCollapsed, compactMode } = useSidebar();
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(
          'group flex items-center gap-3 rounded-lg cursor-pointer transition-all duration-200 w-full text-left flex-1',
          compactMode ? 'px-2 py-1.5' : 'px-4 py-2.5',
          'hover:bg-accent',
          isActive && 'bg-primary text-primary-foreground hover:bg-primary/90',
          isCollapsed && 'justify-center',
          className
        )}
        {...props}
      />
    );
  }
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

// --- Sidebar Menu Action ---
const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebar();
  if (isCollapsed) return null;
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(
        'absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md opacity-0 group-hover/item:opacity-100 transition-opacity',
        'focus:opacity-100', // show on focus for accessibility
        className
      )}
      {...props}
    />
  );
});
SidebarMenuAction.displayName = 'SidebarMenuAction';

// --- Sidebar Menu Label ---
const SidebarLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebar();
  if (isCollapsed) return null;
  return (
    <span
      ref={ref}
      className={cn('nav-label flex-1 font-medium truncate', className)}
      {...props}
    />
  );
});
SidebarLabel.displayName = 'SidebarLabel';


// --- Sidebar Menu Badge ---
const SidebarBadge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => {
  const { isCollapsed } = useSidebar();
  if (isCollapsed) return null;
  const badgeContent = typeof children === 'number' && children > 99 ? '99+' : children;
  return (
    <span
      ref={ref}
      className={cn(
        'nav-badge bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center',
        className
      )}
      {...props}
    >
      {badgeContent}
    </span>
  );
});
SidebarBadge.displayName = 'SidebarBadge';


// --- Sidebar Tooltip ---
interface SidebarTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  badge?: number | string;
}
const SidebarTooltip = ({ label, badge, className, ...props }: SidebarTooltipProps) => {
  const { isCollapsed } = useSidebar();
  if (!isCollapsed) return null;
  return (
    <div
      className={cn(
        'absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50',
        className
      )}
      {...props}
    >
      {label}
      {badge && (
        <span className="ml-2 bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
          {typeof badge === 'number' && badge > 99 ? '99+' : badge}
        </span>
      )}
    </div>
  );
};
SidebarTooltip.displayName = 'SidebarTooltip';


// --- Icon Wrapper for consistent sizing ---
const SidebarIcon = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("flex-shrink-0 w-4 h-4", className)}>
      {children}
    </div>
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
  SidebarBody,
  SidebarFooter,
  SidebarSection,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarLabel,
  SidebarBadge,
  SidebarTooltip,
  SidebarIcon
};
```

## File: src/hooks/useAppViewManager.hook.ts
```typescript
import { useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAppShellStore, type AppShellState, type ActivePage } from '@/store/appShell.store';
import type { DataItem, ViewMode, SortConfig, SortableField, GroupableField, Status, Priority } from '@/pages/DataDemo/types';
import type { FilterConfig } from '@/pages/DataDemo/components/DataToolbar';
import { BODY_STATES, SIDEBAR_STATES } from '@/lib/utils';

const pageToPaneMap: Record<string, AppShellState['sidePaneContent']> = {
  dashboard: 'main',
  settings: 'settings',
  toaster: 'toaster',
  notifications: 'notifications',
  'data-demo': 'dataDemo',
  messaging: 'messaging',
};

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

/**
 * A centralized hook to manage and synchronize all URL-based view states.
 * This is the single source of truth for view modes, side panes, split views,
 * and page-specific parameters.
 */
export function useAppViewManager() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ itemId: string; conversationId: string }>();
  const { itemId, conversationId } = params;
  const { setSidebarState, sidebarState } = useAppShellStore();

  // --- DERIVED STATE FROM URL ---

  const view = searchParams.get('view');
  const sidePane = searchParams.get('sidePane');
  const right = searchParams.get('right');

  const { bodyState, sidePaneContent } = useMemo(() => {
    const validPanes: AppShellState['sidePaneContent'][] = ['details', 'settings', 'main', 'toaster', 'notifications', 'dataDemo', 'messaging'];
    
    // 1. Priority: Explicit side pane overlay via URL param
    if (sidePane && validPanes.includes(sidePane as AppShellState['sidePaneContent'])) {
      return { bodyState: BODY_STATES.SIDE_PANE, sidePaneContent: sidePane as AppShellState['sidePaneContent'] };
    }

    // 2. Data item detail view (can be overlay or split)
    if (itemId) {
      if (view === 'split') {
        return { bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: 'dataItem' as const };
      }
      return { bodyState: BODY_STATES.SIDE_PANE, sidePaneContent: 'dataItem' as const };
    }

    // 3. Messaging conversation view (always split)
    if (conversationId) {
      return { bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: 'messaging' as const };
    }

    // 4. Generic split view via URL param
    if (view === 'split' && right && validPanes.includes(right as AppShellState['sidePaneContent'])) {
      return { bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: right as AppShellState['sidePaneContent'] };
    }

    return { bodyState: BODY_STATES.NORMAL, sidePaneContent: 'details' as const };
  }, [itemId, conversationId, view, sidePane, right]);
  
  const currentActivePage = useMemo(() => (location.pathname.split('/')[1] || 'dashboard') as ActivePage, [location.pathname]);
  const prevActivePage = usePrevious(currentActivePage);

  // --- SIDE EFFECTS ---
  useEffect(() => {
    // On navigating to messaging page, collapse sidebar if it's expanded.
    // This ensures a good default view but allows the user to expand it again if they wish.
    if (currentActivePage === 'messaging' && prevActivePage !== 'messaging' && sidebarState === SIDEBAR_STATES.EXPANDED) {
      setSidebarState(SIDEBAR_STATES.COLLAPSED);
    }
  }, [currentActivePage, prevActivePage, sidebarState, setSidebarState]);

  // DataDemo specific state
  const viewMode = useMemo(() => (searchParams.get('view') as ViewMode) || 'list', [searchParams]);
	const page = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams]);
	const groupBy = useMemo(() => (searchParams.get('groupBy') as GroupableField | 'none') || 'none', [searchParams]);
	const activeGroupTab = useMemo(() => searchParams.get('tab') || 'all', [searchParams]);
	const filters = useMemo<FilterConfig>(
		() => ({
			searchTerm: searchParams.get('q') || '',
			status: (searchParams.get('status')?.split(',') || []).filter(Boolean) as Status[],
			priority: (searchParams.get('priority')?.split(',') || []).filter(Boolean) as Priority[],
		}),
		[searchParams],
	);
	const sortConfig = useMemo<SortConfig | null>(() => {
		const sortParam = searchParams.get('sort');
		if (!sortParam) return { key: 'updatedAt', direction: 'desc' }; // Default sort
		if (sortParam === 'default') return null;

		const [key, direction] = sortParam.split('-');
		return { key: key as SortableField, direction: direction as 'asc' | 'desc' };
	}, [searchParams]);

  // --- MUTATOR ACTIONS ---

  const handleParamsChange = useCallback(
		(newParams: Record<string, string | string[] | null | undefined>, resetPage = false) => {
			setSearchParams(
				(prev) => {
					const updated = new URLSearchParams(prev);
					
					for (const [key, value] of Object.entries(newParams)) {
						if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || value === '') {
							updated.delete(key);
						} else if (Array.isArray(value)) {
							updated.set(key, value.join(','));
						} else {
							updated.set(key, String(value));
						}
					}

					if (resetPage) {
						updated.delete('page');
					}
					if ('groupBy' in newParams) {
						updated.delete('tab');
					}

					return updated;
				},
				{ replace: true },
			);
		},
		[setSearchParams],
	);

  const navigateTo = useCallback((page: string) => {
    navigate(page.startsWith('/') ? page : `/${page}`);
  }, [navigate]);

  const openSidePane = useCallback((pane: AppShellState['sidePaneContent']) => {
    if (location.pathname === `/${Object.keys(pageToPaneMap).find(key => pageToPaneMap[key] === pane)}`) {
        navigate({ pathname: '/dashboard', search: `?sidePane=${pane}` }, { replace: true });
    } else {
        handleParamsChange({ sidePane: pane, view: null, right: null });
    }
  }, [handleParamsChange, navigate, location.pathname]);

  const closeSidePane = useCallback(() => {
    if (itemId) {
      navigate('/data-demo');
    } else {
      handleParamsChange({ sidePane: null, view: null, right: null });
    }
  }, [itemId, navigate, handleParamsChange]);

  const toggleSidePane = useCallback((pane: AppShellState['sidePaneContent']) => {
    if (sidePane === pane) {
      closeSidePane();
    } else {
      openSidePane(pane);
    }
  }, [sidePane, openSidePane, closeSidePane]);

  const toggleSplitView = useCallback(() => {
    if (bodyState === BODY_STATES.SIDE_PANE) {
      handleParamsChange({ view: 'split', right: sidePane, sidePane: null });
    } else if (bodyState === BODY_STATES.SPLIT_VIEW) {
      handleParamsChange({ sidePane: right, view: null, right: null });
    } else { // From normal
      const paneContent = pageToPaneMap[currentActivePage] || 'details';
      handleParamsChange({ view: 'split', right: paneContent, sidePane: null });
    }
  }, [bodyState, sidePane, right, currentActivePage, handleParamsChange]);
  
  const setNormalView = useCallback(() => {
      handleParamsChange({ sidePane: null, view: null, right: null });
  }, [handleParamsChange]);

  const switchSplitPanes = useCallback(() => {
    if (bodyState !== BODY_STATES.SPLIT_VIEW) return;
    const newSidePaneContent = pageToPaneMap[currentActivePage];
    const newActivePage = Object.entries(pageToPaneMap).find(
      ([, value]) => value === sidePaneContent
    )?.[0] as ActivePage | undefined;

    if (newActivePage && newSidePaneContent) {
      navigate(`/${newActivePage}?view=split&right=${newSidePaneContent}`, { replace: true });
    }
  }, [bodyState, currentActivePage, sidePaneContent, navigate]);
  
  const closeSplitPane = useCallback((paneToClose: 'main' | 'right') => {
    if (bodyState !== BODY_STATES.SPLIT_VIEW) return;
    if (paneToClose === 'right') {
      navigate(`/${currentActivePage}`, { replace: true });
    } else { // Closing main pane
      const pageToBecomeActive = Object.entries(pageToPaneMap).find(
        ([, value]) => value === sidePaneContent
      )?.[0] as ActivePage | undefined;
      
      if (pageToBecomeActive) {
        navigate(`/${pageToBecomeActive}`, { replace: true });
      } else {
        navigate(`/dashboard`, { replace: true });
      }
    }
  }, [bodyState, currentActivePage, sidePaneContent, navigate]);
  
  // DataDemo actions
  const setViewMode = (mode: ViewMode) => handleParamsChange({ view: mode });
  const setGroupBy = (val: string) => handleParamsChange({ groupBy: val === 'none' ? null : val }, true);
  const setActiveGroupTab = (tab: string) => handleParamsChange({ tab: tab === 'all' ? null : tab });
  const setFilters = (newFilters: FilterConfig) => {
    handleParamsChange({ q: newFilters.searchTerm, status: newFilters.status, priority: newFilters.priority }, true);
  }
  const setSort = (config: SortConfig | null) => {
    if (!config) {
      handleParamsChange({ sort: 'default' }, true);
    } else {
      handleParamsChange({ sort: `${config.key}-${config.direction}` }, true);
    }
  }
  const setTableSort = (field: SortableField) => {
    let newSort: string | null = `${field}-desc`;
    if (sortConfig?.key === field) {
      if (sortConfig.direction === 'desc') newSort = `${field}-asc`;
      else if (sortConfig.direction === 'asc') newSort = 'default';
    }
    handleParamsChange({ sort: newSort }, true);
  };
  const setPage = (newPage: number) => handleParamsChange({ page: newPage.toString() });

  const onItemSelect = useCallback((item: DataItem) => {
		navigate(`/data-demo/${item.id}${location.search}`);
	}, [navigate, location.search]);


  return useMemo(() => ({
    // State
    bodyState,
    sidePaneContent,
    currentActivePage,
    itemId,
    // DataDemo State
    viewMode,
    page,
    groupBy,
    activeGroupTab,
    filters,
    sortConfig,
    // Actions
    navigateTo,
    openSidePane,
    closeSidePane,
    toggleSidePane,
    toggleSplitView,
    setNormalView,
    switchSplitPanes,
    closeSplitPane,
    // DataDemo Actions
    onItemSelect,
    setViewMode,
    setGroupBy,
    setActiveGroupTab,
    setFilters,
    setSort,
    setTableSort,
    setPage,
  }), [
    bodyState, sidePaneContent, currentActivePage, itemId,
    viewMode, page, groupBy, activeGroupTab, filters, sortConfig,
    navigateTo, openSidePane, closeSidePane, toggleSidePane, toggleSplitView, setNormalView, 
    switchSplitPanes, closeSplitPane, onItemSelect, setViewMode, setGroupBy, setActiveGroupTab, setFilters,
    setSort, setTableSort, setPage
  ]);
}
```

## File: src/pages/Messaging/index.tsx
```typescript
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { TaskList } from "./components/TaskList";
import { TaskDetail } from "./components/TaskDetail";
import { cn } from "@/lib/utils";

const useResizableMessagingPanes = (
  containerRef: React.RefObject<HTMLDivElement>,
  initialWidth: number = 320
) => {
  const [isResizing, setIsResizing] = useState(false);
  const [listWidth, setListWidth] = useState(initialWidth);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;
      // Constraints for the conversation list pane
      setListWidth(Math.max(280, Math.min(newWidth, containerRect.width - 500)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp, { once: true });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (document.body) {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
  }, [isResizing, containerRef]);

  return { listWidth, handleMouseDown, isResizing };
};

export default function MessagingPage() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const containerRef = useRef<HTMLDivElement>(null);

  const { listWidth, handleMouseDown, isResizing } = useResizableMessagingPanes(containerRef);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "h-full w-full flex bg-background",
        isResizing && "cursor-col-resize select-none"
      )}
    >
      <div style={{ width: `${listWidth}px` }} className="flex-shrink-0 h-full">
        <TaskList />
      </div>
      <div onMouseDown={handleMouseDown} className="w-2 flex-shrink-0 cursor-col-resize group flex items-center justify-center">
        <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200" />
      </div>
      <div className="flex-1 min-w-0 h-full">
        <TaskDetail />
      </div>
    </div>
  );
}
```

## File: src/store/appShell.store.ts
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type ReactElement } from 'react';
import { SIDEBAR_STATES, BODY_STATES, type SidebarState, type BodyState } from '@/lib/utils';

export type ActivePage = 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo' | 'messaging';

// --- State and Action Types ---

export interface AppShellState {
  sidebarState: SidebarState;
  bodyState: BodyState;
  sidePaneContent: 'details' | 'settings' | 'main' | 'toaster' | 'notifications' | 'dataDemo' | 'dataItem' | 'messaging';
  sidebarWidth: number;
  sidePaneWidth: number;
  splitPaneWidth: number;
  defaultSidePaneWidth: number;
  defaultSplitPaneWidth: number;
  defaultWidthsSet: boolean;
  previousBodyState: BodyState;
  fullscreenTarget: 'main' | 'right' | null;
  isResizing: boolean;
  isResizingRightPane: boolean;
  isTopBarVisible: boolean;
  isTopBarHovered: boolean;
  autoExpandSidebar: boolean;
  reducedMotion: boolean;
  compactMode: boolean;
  primaryColor: string;
  isCommandPaletteOpen: boolean;
  isDarkMode: boolean;
  appName?: string;
  appLogo?: ReactElement;
  draggedPage: 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo' | 'messaging' | null;
  dragHoverTarget: 'left' | 'right' | null;
  hoveredPane: 'left' | 'right' | null;
}

export interface AppShellActions {
    // Initialization
    init: (config: { appName?: string; appLogo?: ReactElement; defaultSplitPaneWidth?: number }) => void;
    
    // Direct state setters
    setSidebarState: (payload: SidebarState) => void;
    setBodyState: (payload: BodyState) => void;
    setSidePaneContent: (payload: AppShellState['sidePaneContent']) => void;
    setSidebarWidth: (payload: number) => void;
    setSidePaneWidth: (payload: number) => void;
    setDefaultPaneWidths: () => void;
    resetPaneWidths: () => void;
    setSplitPaneWidth: (payload: number) => void;
    setIsResizing: (payload: boolean) => void;
    setFullscreenTarget: (payload: 'main' | 'right' | null) => void;
    setIsResizingRightPane: (payload: boolean) => void;
    setTopBarVisible: (payload: boolean) => void;
    setAutoExpandSidebar: (payload: boolean) => void;
    setReducedMotion: (payload: boolean) => void;
    setCompactMode: (payload: boolean) => void;
    setPrimaryColor: (payload: string) => void;
    setDraggedPage: (payload: AppShellState['draggedPage']) => void;
    setCommandPaletteOpen: (open: boolean) => void;
    toggleDarkMode: () => void;
    setDragHoverTarget: (payload: 'left' | 'right' | null) => void;
    setTopBarHovered: (isHovered: boolean) => void;
    setHoveredPane: (payload: 'left' | 'right' | null) => void;
    
    // Composite actions
    toggleSidebar: () => void;
    hideSidebar: () => void;
    showSidebar: () => void;
    peekSidebar: () => void;
    toggleFullscreen: (target?: 'main' | 'right' | null) => void;
    resetToDefaults: () => void;
}

const defaultState: AppShellState = {
  sidebarState: SIDEBAR_STATES.EXPANDED,
  bodyState: BODY_STATES.NORMAL,
  sidePaneContent: 'details',
  sidebarWidth: 280,
  sidePaneWidth: typeof window !== 'undefined' ? Math.max(300, Math.round(window.innerWidth * 0.6)) : 400,
  splitPaneWidth: typeof window !== 'undefined' ? Math.max(300, Math.round(window.innerWidth * 0.35)) : 400,
  defaultSidePaneWidth: 400,
  defaultSplitPaneWidth: 400,
  defaultWidthsSet: false,
  previousBodyState: BODY_STATES.NORMAL,
  fullscreenTarget: null,
  isResizing: false,
  isResizingRightPane: false,
  isTopBarVisible: true,
  isTopBarHovered: false,
  autoExpandSidebar: true,
  reducedMotion: false,
  compactMode: false,
  primaryColor: '220 84% 60%',
  isCommandPaletteOpen: false,
  isDarkMode: false,
  appName: 'Jeli App',
  appLogo: undefined,
  draggedPage: null,
  dragHoverTarget: null,
  hoveredPane: null,
};


export const useAppShellStore = create<AppShellState & AppShellActions>()(
  persist(
    (set, get) => ({
      ...defaultState,

      init: ({ appName, appLogo, defaultSplitPaneWidth }) => set(state => ({
        ...state,
        ...(appName && { appName }),
        ...(appLogo && { appLogo }),
        ...(defaultSplitPaneWidth && { splitPaneWidth: defaultSplitPaneWidth }),
      })),
      
      setSidebarState: (payload) => set({ sidebarState: payload }),
      setBodyState: (payload) => {
        // If we're leaving fullscreen, reset the target and previous state
        if (get().bodyState === BODY_STATES.FULLSCREEN && payload !== BODY_STATES.FULLSCREEN) {
          set({ bodyState: payload, fullscreenTarget: null, previousBodyState: BODY_STATES.NORMAL });
        } else {
          set({ bodyState: payload });
        }
      },
      setSidePaneContent: (payload) => set({ sidePaneContent: payload }),
      setSidebarWidth: (payload) => set({ sidebarWidth: Math.max(200, Math.min(500, payload)) }),
      setSidePaneWidth: (payload) => set({ sidePaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, payload)) }),
      setDefaultPaneWidths: () => {
        if (get().defaultWidthsSet) return;
        set(state => ({
            defaultSidePaneWidth: state.sidePaneWidth,
            defaultSplitPaneWidth: state.splitPaneWidth,
            defaultWidthsSet: true,
        }));
      },
      resetPaneWidths: () => set(state => ({
        sidePaneWidth: state.defaultSidePaneWidth,
        splitPaneWidth: state.defaultSplitPaneWidth,
      })),
      setSplitPaneWidth: (payload) => set({ splitPaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, payload)) }),
      setIsResizing: (payload) => set({ isResizing: payload }),
      setFullscreenTarget: (payload) => set({ fullscreenTarget: payload }),
      setIsResizingRightPane: (payload) => set({ isResizingRightPane: payload }),
      setTopBarVisible: (payload) => set({ isTopBarVisible: payload }),
      setAutoExpandSidebar: (payload) => set({ autoExpandSidebar: payload }),
      setReducedMotion: (payload) => set({ reducedMotion: payload }),
      setCompactMode: (payload) => set({ compactMode: payload }),
      setPrimaryColor: (payload) => {
        if (typeof document !== 'undefined') {
            document.documentElement.style.setProperty('--primary-hsl', payload);
        }
        set({ primaryColor: payload });
      },
      setDraggedPage: (payload) => set({ draggedPage: payload }),
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDragHoverTarget: (payload) => set({ dragHoverTarget: payload }),
      setTopBarHovered: (isHovered) => set({ isTopBarHovered: isHovered }),
      setHoveredPane: (payload) => set({ hoveredPane: payload }),
      
      toggleSidebar: () => {
        const current = get().sidebarState;
        if (current === SIDEBAR_STATES.HIDDEN) set({ sidebarState: SIDEBAR_STATES.COLLAPSED });
        else if (current === SIDEBAR_STATES.COLLAPSED) set({ sidebarState: SIDEBAR_STATES.EXPANDED });
        else if (current === SIDEBAR_STATES.EXPANDED) set({ sidebarState: SIDEBAR_STATES.COLLAPSED });
      },
      hideSidebar: () => set({ sidebarState: SIDEBAR_STATES.HIDDEN }),
      showSidebar: () => set({ sidebarState: SIDEBAR_STATES.EXPANDED }),
      peekSidebar: () => set({ sidebarState: SIDEBAR_STATES.PEEK }),
      
      toggleFullscreen: (target = null) => {
        const { bodyState, previousBodyState } = get();
        if (bodyState === BODY_STATES.FULLSCREEN) {
          set({ 
            bodyState: previousBodyState || BODY_STATES.NORMAL,
            fullscreenTarget: null,
            previousBodyState: BODY_STATES.NORMAL,
          });
        } else {
          set({ 
            previousBodyState: bodyState, 
            bodyState: BODY_STATES.FULLSCREEN, 
            fullscreenTarget: target 
          });
        }
      },
      
      resetToDefaults: () => {
        // Preserve props passed to provider and session defaults
        set(state => {
          const currentPrimaryColor = defaultState.primaryColor;
          if (typeof document !== 'undefined') {
            document.documentElement.style.setProperty('--primary-hsl', currentPrimaryColor);
          }
          return {
            ...defaultState,
            primaryColor: currentPrimaryColor,
            appName: state.appName,
            appLogo: state.appLogo,
            defaultSidePaneWidth: state.defaultSidePaneWidth,
            defaultSplitPaneWidth: state.defaultSplitPaneWidth,
            defaultWidthsSet: state.defaultWidthsSet,
            // Also reset current widths to the defaults
            sidePaneWidth: state.defaultSidePaneWidth,
            splitPaneWidth: state.defaultSplitPaneWidth,
          };
        });
      },
    }),
    {
      name: 'app-shell-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        sidebarState: state.sidebarState,
        sidebarWidth: state.sidebarWidth,
        sidePaneWidth: state.sidePaneWidth,
        splitPaneWidth: state.splitPaneWidth,
        autoExpandSidebar: state.autoExpandSidebar,
        reducedMotion: state.reducedMotion,
        compactMode: state.compactMode,
        primaryColor: state.primaryColor,
      }),
    }
  )
);

// Add a selector for the derived rightPaneWidth
export const useRightPaneWidth = () => useAppShellStore(state => 
    state.bodyState === BODY_STATES.SPLIT_VIEW ? state.splitPaneWidth : state.sidePaneWidth
);
```

## File: src/components/layout/EnhancedSidebar.tsx
```typescript
import React from 'react';
import {
  Home,
  Settings,
  HelpCircle,
  Component,
  Rocket,
  MoreHorizontal,
  Bell,
  Search,
  FileText,
  Star,
  Trash2,
  FolderOpen,
  Mail,
  Bookmark,
  Download,
  User,
  Plus,
  Database,
  PanelLeftClose,
} from 'lucide-react';
import { useAppShellStore, type ActivePage } from '@/store/appShell.store';
import {
  Workspaces,
  WorkspaceTrigger,
  WorkspaceContent,
  type Workspace,
} from './WorkspaceSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
  SidebarBody,
  SidebarFooter,
  SidebarSection,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarLabel,
  SidebarBadge,
  SidebarTooltip,
  SidebarIcon,
  useSidebar,
} from './Sidebar';
import { ViewModeSwitcher } from './ViewModeSwitcher';
import { cn } from '@/lib/utils';
import { useAppViewManager } from '@/hooks/useAppViewManager.hook';

interface MyWorkspace extends Workspace {
  logo: string;
  plan: string;
}

const mockWorkspaces: MyWorkspace[] = [
  { id: 'ws1', name: 'Acme Inc.', logo: 'https://avatar.vercel.sh/acme.png', plan: 'Pro' },
  { id: 'ws2', name: 'Monsters Inc.', logo: 'https://avatar.vercel.sh/monsters.png', plan: 'Free' },
  { id: 'ws3', name: 'Stark Industries', logo: 'https://avatar.vercel.sh/stark.png', plan: 'Enterprise' },
];

const SidebarWorkspaceTrigger = () => {
  const { isCollapsed, compactMode } = useSidebar();

  return (
    <WorkspaceTrigger
      collapsed={isCollapsed}
      className={cn(
        'rounded-xl transition-colors hover:bg-accent/50 w-full',
        isCollapsed ? 'p-2' : 'p-3 bg-accent/50',
      )}
      avatarClassName={cn(compactMode ? 'h-8 w-8' : 'h-10 w-10')}
    />
  );
};

const SidebarToggleButton = () => {
  const { isCollapsed } = useSidebar();
  const { toggleSidebar } = useAppShellStore.getState();

  if (isCollapsed) return null;

  return (
    <button
      onClick={toggleSidebar}
      className="ml-auto h-9 w-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
      title="Collapse Sidebar"
    >
      <PanelLeftClose className="w-5 h-5" />
    </button>
  );
};

interface SidebarProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const EnhancedSidebar = React.memo(React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ onMouseEnter, onMouseLeave }, ref) => {
    const sidebarWidth = useAppShellStore(s => s.sidebarWidth);
    const compactMode = useAppShellStore(s => s.compactMode);
    const appName = useAppShellStore(s => s.appName);
    const appLogo = useAppShellStore(s => s.appLogo);
    const [selectedWorkspace, setSelectedWorkspace] = React.useState(mockWorkspaces[0]);
    return (
      <Sidebar
        ref={ref}
        style={{ width: sidebarWidth }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <SidebarContent>
          <SidebarHeader>
            {appLogo || (
              <div className="p-2 bg-primary/20 rounded-lg">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
            )}
            <SidebarTitle>{appName}</SidebarTitle>
            <SidebarToggleButton />
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection title="Main">
              <AppMenuItem icon={Home} label="Dashboard" page="dashboard" />
              <AppMenuItem icon={Database} label="Data Demo" page="data-demo" />
              <AppMenuItem icon={Mail} label="Messaging" page="messaging" badge={7} />
              <AppMenuItem icon={Search} label="Search" />
              <AppMenuItem icon={Bell} label="Notifications" badge={3} page="notifications" opensInSidePane />
            </SidebarSection>
            
            <SidebarSection title="Workspace" collapsible defaultExpanded>
              <AppMenuItem icon={FileText} label="Documents" hasActions>
                <AppMenuItem icon={FileText} label="Recent" isSubItem />
                <AppMenuItem icon={Star} label="Starred" isSubItem />
                <AppMenuItem icon={Trash2} label="Trash" isSubItem />
              </AppMenuItem>
              <AppMenuItem icon={FolderOpen} label="Projects" hasActions />
              <AppMenuItem icon={Mail} label="Messages" badge={12} />
            </SidebarSection>
            
            <SidebarSection title="Personal" collapsible>
              <AppMenuItem icon={Bookmark} label="Bookmarks" />
              <AppMenuItem icon={Star} label="Favorites" />
              <AppMenuItem icon={Download} label="Downloads" />
            </SidebarSection>

            <SidebarSection title="Components" collapsible defaultExpanded>
              <AppMenuItem icon={Component} label="Toaster" page="toaster" />
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter>
            <SidebarSection>
              <AppMenuItem icon={User} label="Profile" />
              <AppMenuItem icon={Settings} label="Settings" page="settings" />
              <AppMenuItem icon={HelpCircle} label="Help" />
            </SidebarSection>

            <div className={cn(compactMode ? 'mt-4' : 'mt-6')}>
              <Workspaces
                workspaces={mockWorkspaces}
                selectedWorkspaceId={selectedWorkspace.id}
                onWorkspaceChange={(ws) => setSelectedWorkspace(ws as MyWorkspace)}
              >
                <SidebarWorkspaceTrigger />
                <WorkspaceContent>
                  <button className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:outline-none">
                    <Plus className="h-4 w-4" />
                    <span>Create Workspace</span>
                  </button>
                </WorkspaceContent>
              </Workspaces>
            </div>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
    );
  },
));
EnhancedSidebar.displayName = 'EnhancedSidebar';


// Example of a reusable menu item component built with the new Sidebar primitives
interface AppMenuItemProps {
  icon: React.ElementType;
  label: string;
  badge?: number;
  hasActions?: boolean;
  children?: React.ReactNode;
  isSubItem?: boolean;
  page?: ActivePage;
  opensInSidePane?: boolean;
}

const AppMenuItem: React.FC<AppMenuItemProps> = ({ icon: Icon, label, badge, hasActions, children, isSubItem = false, page, opensInSidePane = false }) => {
  const compactMode = useAppShellStore(state => state.compactMode);
  const { setDraggedPage, setDragHoverTarget } = useAppShellStore.getState()
  const { isCollapsed } = useSidebar();
  const viewManager = useAppViewManager();

  const isActive = (
    (!opensInSidePane && page && viewManager.currentActivePage === page)
  ) || (
    opensInSidePane && page === 'notifications' && viewManager.sidePaneContent === 'notifications'
  );

  const handleClick = () => {
    if (page) {
      if (opensInSidePane) {
        // The only item using this is Notifications
        viewManager.toggleSidePane('notifications');
      } else {
        viewManager.navigateTo(page);
      }
    }
  };

  return (
    <div className={isSubItem ? (compactMode ? 'ml-4' : 'ml-6') : ''}>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={handleClick}
          isActive={isActive}
          draggable={!!page}
          onDragStart={(_e) => {
            if (page) {
              // set dragged page in AppShell store
              setDraggedPage(page);
            }
          }}
          onDragEnd={() => {
            setDraggedPage(null);
            setDragHoverTarget(null);
          }}
        >
          <SidebarIcon>
            <Icon className={isSubItem ? "w-3 h-3" : "w-4 h-4"}/>
          </SidebarIcon>
          <SidebarLabel>{label}</SidebarLabel>
          {badge && <SidebarBadge>{badge}</SidebarBadge>}
          <SidebarTooltip label={label} badge={badge} />
        </SidebarMenuButton>

        {page && !isCollapsed && ( // Always render switcher if there's a page
          <div className={cn(
            "absolute top-1/2 -translate-y-1/2 z-10",
            "opacity-0 group-hover/item:opacity-100 group-focus-within/item:opacity-100",
            "transition-opacity pointer-events-none group-hover/item:pointer-events-auto",
            // If there are actions, move left to make space for the action button
            hasActions ? "right-10" : "right-2"
          )}>
            <ViewModeSwitcher targetPage={page} />
          </div>
        )}

        {hasActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction>
                <MoreHorizontal className="h-4 w-4" />
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
              <DropdownMenuItem>
                <span>Edit {label}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Delete {label}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
      {!isCollapsed && children && (
        <div className="space-y-1 mt-1">{children}</div>
      )}
    </div>
  );
};
```

## File: package.json
```json
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
    "date-fns": "^3.6.0",
    "gsap": "^3.13.0",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3",
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
  },
  "dependencies": {
    "@radix-ui/react-checkbox": "^1.3.3"
  }
}
```
