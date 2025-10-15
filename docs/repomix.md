# Directory Structure
```
src/
  components/
    layout/
      AppShell.tsx
      RightPane.tsx
  hooks/
    useAppViewManager.hook.ts
    useResizablePanes.hook.ts
    useRightPaneContent.hook.tsx
  pages/
    Messaging/
      components/
        ContactProfile.tsx
        ConversationList.tsx
        MessageThread.tsx
      store/
        messaging.store.ts
      index.tsx
      types.ts
  providers/
    AppShellProvider.tsx
  store/
    appShell.store.ts
    authStore.ts
  App.tsx
  index.css
index.html
package.json
postcss.config.js
tailwind.config.js
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: src/pages/Messaging/components/MessageThread.tsx
```typescript
import React from 'react';
import { Paperclip, SendHorizontal, Smile, PanelRightClose, PanelRightOpen } from 'lucide-react';

import { useMessagingStore } from '../store/messaging.store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChannelIcon } from './ChannelIcons';
import { cn } from '@/lib/utils';
import { useAppShellStore } from '@/store/appShell.store';

interface MessageThreadProps {
  conversationId?: string;
}

export const MessageThread: React.FC<MessageThreadProps> = ({ conversationId }) => {
  const conversation = useMessagingStore(state =>
    conversationId ? state.getConversationById(conversationId) : undefined
  );
  const { isMessagingProfileCollapsed } = useAppShellStore(s => ({
    isMessagingProfileCollapsed: s.isMessagingProfileCollapsed,
  }));
  const { toggleMessagingProfileCollapsed } = useAppShellStore.getState();
  
  
  if (!conversationId || !conversation) {
    return (
        <div className="h-full flex flex-col items-center justify-center p-6 bg-background">
            <p className="text-muted-foreground">Select a conversation to see the messages.</p>
        </div>
    );
  }

  const { contact, messages } = conversation;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div 
        className="flex items-center gap-3 p-4 border-b h-20 flex-shrink-0 cursor-pointer group"
        onClick={toggleMessagingProfileCollapsed}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{contact.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className={cn("w-2 h-2 rounded-full", contact.online ? 'bg-green-500' : 'bg-gray-400')} />
            {contact.online ? 'Online' : 'Offline'}
          </p>
        </div>
        <ChannelIcon channel={conversation.channel} className="w-5 h-5" />
        {isMessagingProfileCollapsed 
          ? <PanelRightOpen className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors ml-auto" />
          : <PanelRightClose className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors ml-auto" />
        }
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={cn(
            "flex items-end gap-3",
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          )}>
            {message.sender === 'contact' && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={contact.avatar} />
                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div className={cn(
              "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl",
              message.sender === 'user' 
                ? 'bg-primary text-primary-foreground rounded-br-none' 
                : 'bg-card border rounded-bl-none'
            )}>
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t flex-shrink-0 bg-card/30">
        <div className="relative">
          <Input placeholder="Type a message..." className="pr-32 h-12 rounded-full bg-background" />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button variant="ghost" size="icon" className="rounded-full">
                <Smile className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
                <Paperclip className="w-5 h-5" />
            </Button>
            <Button size="icon" className="rounded-full">
                <SendHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## File: src/providers/AppShellProvider.tsx
```typescript
import { useEffect, type ReactNode, type ReactElement } from 'react';
import { useAppShellStore } from '@/store/appShell.store';

interface AppShellProviderProps {
  children: ReactNode;
  appName?: string;
  appLogo?: ReactElement;
  defaultSplitPaneWidth?: number;
}

export function AppShellProvider({ children, appName, appLogo, defaultSplitPaneWidth }: AppShellProviderProps) {
  const init = useAppShellStore(state => state.init);
  const setPrimaryColor = useAppShellStore(state => state.setPrimaryColor);
  const primaryColor = useAppShellStore(state => state.primaryColor);

  useEffect(() => {
    init({ appName, appLogo, defaultSplitPaneWidth });
  }, [appName, appLogo, defaultSplitPaneWidth, init]);

  // Side effect for primary color
  useEffect(() => {
    // This effect is here because the store itself can't run side-effects on init
    // before React has mounted. So we trigger it from the provider.
    setPrimaryColor(primaryColor);
  }, [primaryColor, setPrimaryColor]);

  return <>{children}</>;
}
```

## File: postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## File: src/pages/Messaging/components/ContactProfile.tsx
```typescript
import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Mail, Phone, Sparkles, Reply, ThumbsUp, ThumbsDown, Copy, Briefcase, StickyNote, PhoneCall, CheckSquare, Calendar, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useMessagingStore } from '../store/messaging.store';
import type { ActivityEvent, ActivityEventType } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AnimatedTabs } from '@/components/ui/animated-tabs';
import { TechOrbitDisplay } from '@/components/effects/OrbitingCircles';
import { cn } from '@/lib/utils';

interface ContactProfileProps {
  conversationId?: string;
}

export const ContactProfile: React.FC<ContactProfileProps> = ({ conversationId }) => {
  const [activeTab, setActiveTab] = useState('insights');

  const conversation = useMessagingStore(state => 
    conversationId ? state.getConversationById(conversationId) : undefined
  );

  const tabs = useMemo(() => [
    { id: 'insights', label: 'AI' },
    { id: 'details', label: 'Details' },
    { id: 'activity', label: 'Activity' },
    { id: 'notes', label: 'Notes' },
  ], []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const activityIcons: Record<ActivityEventType, React.ElementType> = {
    note: StickyNote,
    call: PhoneCall,
    email: Mail,
    meeting: Calendar,
  };
  
  const ActivityItem = ({ item }: { item: ActivityEvent }) => {
    const Icon = activityIcons[item.type];
    return (
      <div className="flex items-start gap-3">
        <div className="mt-1"><Icon className="w-4 h-4 text-muted-foreground" /></div>
        <div className="flex-1 text-sm"><p>{item.content}</p><p className="text-xs text-muted-foreground mt-1">{format(new Date(item.timestamp), "MMM d, yyyy 'at' h:mm a")}</p></div>
      </div>
    )
  }
  if (!conversation) {
    return (
      <div className="h-full flex-1 flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
        <TechOrbitDisplay text="Contact Intel" />
        <div className="text-center z-10 bg-background/50 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="mt-4 text-lg font-medium">Select a Conversation</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                AI-powered insights and contact details will appear here.
            </p>
        </div>
      </div>
    );
  }

  const { contact, aiSummary } = conversation;

  return (
    <div className="h-full flex-1 flex flex-col bg-background overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Contact Header */}
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4 border-4 border-background ring-2 ring-primary">
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback className="text-3xl">{contact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">{contact.name}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {contact.online ? 'Online' : `Last seen ${contact.lastSeen}`}
          </p>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {contact.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button variant="outline" size="sm" className="gap-2"><StickyNote className="w-4 h-4" /> Note</Button>
            <Button variant="outline" size="sm" className="gap-2"><PhoneCall className="w-4 h-4" /> Call</Button>
            <Button variant="outline" size="sm" className="gap-2"><Mail className="w-4 h-4" /> Email</Button>
            <Button variant="outline" size="sm" className="gap-2"><CheckSquare className="w-4 h-4" /> Task</Button>
        </div>

        {/* Tabs for Details and AI Insights */}
        <Card className="overflow-hidden">
          <AnimatedTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className="px-6 border-b" />
          
          {activeTab === 'details' && (
            <CardContent className="space-y-4 text-sm pt-6 leading-relaxed">
               <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground break-all">{contact.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground">{contact.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground">{contact.role} at <strong>{contact.company}</strong></span>
              </div>
            </CardContent>
          )}

          {activeTab === 'insights' && (
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Sentiment:</span>
                <Badge variant={
                  aiSummary.sentiment === 'positive' ? 'default' : aiSummary.sentiment === 'negative' ? 'destructive' : 'secondary'
                } className="capitalize">
                  {aiSummary.sentiment === 'positive' && <ThumbsUp className="w-3 h-3 mr-1.5" />}
                  {aiSummary.sentiment === 'negative' && <ThumbsDown className="w-3 h-3 mr-1.5" />}
                  {aiSummary.sentiment}
                </Badge>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm"><Sparkles className="w-4 h-4 text-yellow-500" /> Key Points</h4>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground pl-2">
                  {aiSummary.summaryPoints.map((point, i) => <li key={i}>{point}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm"><Reply className="w-4 h-4 text-blue-500" /> Suggested Replies</h4>
                <div className="flex flex-col gap-2">
                  {aiSummary.suggestedReplies.map((reply, i) => (
                    <Button 
                      key={i} 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-between text-left h-auto py-2 px-3 group"
                      onClick={() => handleCopy(reply)}
                    >
                      <span className="pr-4">{reply}</span>
                      <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          )}

          {activeTab === 'activity' && (
            <CardContent className="pt-6">
              <div className="space-y-5 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {contact.activity.map(item => <ActivityItem key={item.id} item={item} />)}
              </div>
            </CardContent>
          )}

          {activeTab === 'notes' && (
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-4">
                {contact.notes.map(note => (
                  <div key={note.id} className="text-sm bg-accent/50 p-3 rounded-lg"><p className="mb-1.5">{note.content}</p><p className="text-xs text-muted-foreground">{format(new Date(note.createdAt), "MMM d, yyyy")}</p></div>
                ))}
              </div>
              <Textarea placeholder="Add a new note..." className="min-h-[60px]" />
              <Button size="sm" className="w-full gap-2"><Send className="w-4 h-4" /> Save Note</Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};
```

## File: src/pages/Messaging/store/messaging.store.ts
```typescript
import { create } from 'zustand';
import { mockConversations, mockContacts } from '../data/mockData';
import type { Conversation, Contact, Channel } from '../types';

interface MessagingState {
  conversations: Conversation[];
  contacts: Contact[];
  searchTerm: string;
  activeFilters: {
    channels: Channel[];
    tags: string[];
  };
}

interface MessagingActions {
  getConversationById: (id: string) => (Conversation & { contact: Contact }) | undefined;
  getConversationsWithContact: () => (Conversation & { contact: Contact })[];
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<MessagingState['activeFilters']>) => void;
  getAvailableTags: () => string[];
}

export const useMessagingStore = create<MessagingState & MessagingActions>((set, get) => ({
  conversations: mockConversations,
  contacts: mockContacts,
  searchTerm: '',
  activeFilters: {
    channels: [],
    tags: [],
  },

  getConversationById: (id) => {
    const conversation = get().conversations.find(c => c.id === id);
    if (!conversation) return undefined;

    const contact = get().contacts.find(c => c.id === conversation.contactId);
    if (!contact) return undefined; // Should not happen with consistent data

    return { ...conversation, contact };
  },

  getConversationsWithContact: () => {
    const { conversations, contacts, searchTerm, activeFilters } = get();
    const lowercasedSearch = searchTerm.toLowerCase();

    const mapped = conversations.map(convo => {
      const contact = contacts.find(c => c.id === convo.contactId) as Contact;
      return { ...convo, contact };
    });

    const filtered = mapped.filter(convo => {
      const searchMatch = convo.contact.name.toLowerCase().includes(lowercasedSearch);
      const channelMatch = activeFilters.channels.length === 0 || activeFilters.channels.includes(convo.channel);
      const tagMatch = activeFilters.tags.length === 0 || activeFilters.tags.some(tag => convo.contact.tags.includes(tag));
      return searchMatch && channelMatch && tagMatch;
    });

    return filtered.sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
  },

  setSearchTerm: (term) => set({ searchTerm: term }),

  setFilters: (newFilters) => set(state => ({
    activeFilters: { ...state.activeFilters, ...newFilters }
  })),

  getAvailableTags: () => {
    const allTags = new Set(get().contacts.flatMap(c => c.tags));
    return Array.from(allTags);
  }
}));
```

## File: src/pages/Messaging/types.ts
```typescript
import type { LucideIcon } from "lucide-react";

export type Channel = 'whatsapp' | 'instagram' | 'facebook';

export interface ChannelIcon {
  Icon: LucideIcon;
  color: string;
}

export interface Contact {
  id: string;
  name: string;
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
  sender: 'user' | 'contact';
  read: boolean;
}

export interface AISummary {
  sentiment: 'positive' | 'negative' | 'neutral';
  summaryPoints: string[];
  suggestedReplies: string[];
}

export interface Conversation {
  id: string;
  contactId: string;
  channel: Channel;
  unreadCount: number;
  lastMessage: Message;
  messages: Message[];
  aiSummary: AISummary;
}
```

## File: src/store/authStore.ts
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  user: {
    email: string
    name: string
  } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  forgotPassword: (email: string) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock authentication - in real app, validate with backend
        if (email && password) {
          set({
            isAuthenticated: true,
            user: {
              email,
              name: email.split('@')[0], // Simple name extraction
            },
          })
        } else {
          throw new Error('Invalid credentials')
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        })
      },

      forgotPassword: async (email: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // In real app, send reset email via backend
        console.log(`Password reset link sent to: ${email}`)
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated, user: state.user }),
    },
  ),
)
```

## File: src/hooks/useRightPaneContent.hook.tsx
```typescript
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Component,
  Bell,
  SlidersHorizontal,
  Database,
  MessageSquare,
} from 'lucide-react';

import { DashboardContent } from "@/pages/Dashboard";
import { SettingsContent } from "@/features/settings/SettingsContent";
import { ToasterDemo } from "@/pages/ToasterDemo";
import { NotificationsPage } from "@/pages/Notifications";
import DataDemoPage from "@/pages/DataDemo";
import { DataDetailPanel } from "@/pages/DataDemo/components/DataDetailPanel";
import { mockDataItems } from "@/pages/DataDemo/data/mockData";
import { MessagingContent } from "@/pages/Messaging/components/MessagingContent";
import type { AppShellState } from '@/store/appShell.store';

export function useRightPaneContent(sidePaneContent: AppShellState['sidePaneContent']) {
  const navigate = useNavigate();
  const { itemId, conversationId } = useParams<{ itemId: string; conversationId: string }>();

  const contentMap = useMemo(() => ({
    main: {
      title: "Dashboard",
      icon: LayoutDashboard,
      page: "dashboard",
      content: <DashboardContent />,
    },
    settings: {
      title: "Settings",
      icon: Settings,
      page: "settings",
      content: <div className="p-6"><SettingsContent /></div>
    },
    toaster: {
      title: "Toaster Demo",
      icon: Component,
      page: "toaster",
      content: <ToasterDemo />,
    },
    notifications: {
      title: "Notifications",
      icon: Bell,
      page: "notifications",
      content: <NotificationsPage />,
    },
    dataDemo: {
      title: "Data Showcase",
      icon: Database,
      page: "data-demo",
      content: <DataDemoPage />,
    },
    messaging: {
      title: "Conversation",
      icon: MessageSquare,
      page: "messaging",
      content: <MessagingContent conversationId={conversationId} />,
    },
    details: {
      title: "Details Panel",
      icon: SlidersHorizontal,
      content: (
        <div className="p-6">
          <p className="text-muted-foreground">
            This is the side pane. It can be used to display contextual
            information, forms, or actions related to the main content.
          </p>
        </div>
      ),
    },
  }), [conversationId]);

  const selectedItem = useMemo(() => {
    if (!itemId) return null;
    return mockDataItems.find(item => item.id === itemId) ?? null;
  }, [itemId]);

  const { meta, content } = useMemo(() => {
    if (sidePaneContent === 'dataItem' && selectedItem) {
      return {
        meta: { title: "Item Details", icon: Database, page: `data-demo/${itemId}` },
        content: <DataDetailPanel item={selectedItem} onClose={() => navigate('/data-demo')} />,
      };
    }
    if (sidePaneContent === 'messaging') {
      return {
       meta: contentMap.messaging,
       content: <MessagingContent conversationId={conversationId} />,
     };
   }
    const mappedContent = contentMap[sidePaneContent as keyof typeof contentMap] || contentMap.details;
    return {
      meta: mappedContent,
      content: mappedContent.content,
    };
  }, [sidePaneContent, selectedItem, navigate, contentMap, itemId, conversationId]);

  return { meta, content };
}
```

## File: src/pages/Messaging/components/ConversationList.tsx
```typescript
import { useState, useMemo, useCallback } from 'react';
import { Search, SlidersHorizontal, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useMessagingStore } from '../store/messaging.store';
import { useAppShellStore } from '@/store/appShell.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { AnimatedTabs } from '@/components/ui/animated-tabs';
import { ChannelIcon } from './ChannelIcons';
import type { Channel } from '../types';

const channels: { id: Channel, label: string }[] = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
];

export const ConversationList = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { isMessagingListCollapsed } = useAppShellStore();
  const { toggleMessagingListCollapsed } = useAppShellStore.getState();
  const { 
    getConversationsWithContact,
    searchTerm,
    setSearchTerm,
    activeFilters,
    setFilters,
    getAvailableTags,
   } = useMessagingStore();
  const conversations = getConversationsWithContact();
  const [activeTab, setActiveTab] = useState('all');
  const availableTags = useMemo(() => getAvailableTags(), [getAvailableTags]);

  const tabs = useMemo(() => [{ id: 'all', label: 'All' }, { id: 'unread', label: 'Unread' }], []);

  const handleChannelFilterChange = useCallback((channelId: Channel) => {
    const newChannels = activeFilters.channels.includes(channelId)
      ? activeFilters.channels.filter(c => c !== channelId)
      : [...activeFilters.channels, channelId];
    setFilters({ channels: newChannels });
  }, [activeFilters.channels, setFilters]);

  const handleTagFilterChange = useCallback((tag: string) => {
    const newTags = activeFilters.tags.includes(tag)
      ? activeFilters.tags.filter(t => t !== tag)
      : [...activeFilters.tags, tag];
    setFilters({ tags: newTags });
  }, [activeFilters.tags, setFilters]);

  const filteredConversations = useMemo(() => {
    if (activeTab === 'unread') {
      return conversations.filter(convo => convo.unreadCount > 0); // This now filters on the already filtered list from store
    }
    return conversations;
  }, [conversations, activeTab]);
  
  if (isMessagingListCollapsed) {
    return (
      <div className="h-full flex flex-col items-center border-r bg-background/80 py-4 gap-4">
        <Button variant="ghost" size="icon" onClick={toggleMessagingListCollapsed}>
          <PanelLeftOpen className="w-5 h-5" />
        </Button>
        <div className="flex-1 overflow-y-auto no-scrollbar pt-2">
            <nav className="flex flex-col gap-3 items-center">
              {filteredConversations.map(convo => (
                <Link
                  to={`/messaging/${convo.id}`}
                  key={convo.id}
                  title={convo.contact.name}
                  className={cn(
                    "relative flex items-start p-1 rounded-full text-left transition-all duration-200",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none",
                    conversationId === convo.id && "ring-2 ring-offset-2 ring-offset-background ring-primary"
                  )}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={convo.contact.avatar} alt={convo.contact.name} />
                    <AvatarFallback>{convo.contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1">
                      <ChannelIcon channel={convo.channel} className="bg-background rounded-full p-0.5" />
                  </div>
                  {convo.unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-primary h-5 w-5 p-0 flex items-center justify-center border-2 border-background">
                        {convo.unreadCount}
                      </Badge>
                  )}
                </Link>
              ))}
            </nav>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border-r bg-background/80">
      {/* Header */}
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold tracking-tight">Conversations</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMessagingListCollapsed}>
            <PanelLeftClose className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Channels</h4>
                  <div className="space-y-2">
                    {channels.map(channel => (
                      <div key={channel.id} className="flex items-center gap-2">
                        <Checkbox 
                          id={`channel-${channel.id}`} 
                          checked={activeFilters.channels.includes(channel.id)}
                          onCheckedChange={() => handleChannelFilterChange(channel.id)}
                        />
                        <label htmlFor={`channel-${channel.id}`} className="text-sm cursor-pointer">{channel.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Tags</h4>
                  <div className="space-y-2">
                    {availableTags.map(tag => (
                      <div key={tag} className="flex items-center gap-2">
                        <Checkbox 
                          id={`tag-${tag}`} 
                          checked={activeFilters.tags.includes(tag)}
                          onCheckedChange={() => handleTagFilterChange(tag)}
                        />
                        <label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer">{tag}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <AnimatedTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-3 space-y-1">
          {filteredConversations.map(convo => (
            <Link
              to={`/messaging/${convo.id}`}
              key={convo.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-200 hover:bg-accent/50",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none",
                conversationId === convo.id && "bg-accent border-l-4 border-primary pl-3"
              )}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={convo.contact.avatar} alt={convo.contact.name} />
                  <AvatarFallback>{convo.contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0">
                    <ChannelIcon channel={convo.channel} className="bg-background rounded-full p-0.5" />
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <p className="font-semibold truncate">{convo.contact.name}</p>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{formatDistanceToNow(new Date(convo.lastMessage.timestamp), { addSuffix: false })}</p>
                </div>
                <p className="text-sm text-muted-foreground truncate">{convo.lastMessage.text}</p>
              </div>
              {convo.unreadCount > 0 && (
                <div className="flex items-center justify-center self-center ml-auto">
                    <Badge className="bg-primary h-5 w-5 p-0 flex items-center justify-center">{convo.unreadCount}</Badge>
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
```

## File: src/pages/Messaging/index.tsx
```typescript
import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { ConversationList } from "./components/ConversationList";
import { cn } from "@/lib/utils";
import { MessagingContent } from "./components/MessagingContent";
import { useAppShellStore } from "@/store/appShell.store";
import { useResizableMessagingList } from "@/hooks/useResizablePanes.hook";

export default function MessagingPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const COLLAPSED_WIDTH = 80;

  const { messagingListWidth, isResizingMessagingList, isMessagingListCollapsed } = useAppShellStore(s => ({
    messagingListWidth: s.messagingListWidth,
    isResizingMessagingList: s.isResizingMessagingList,
    isMessagingListCollapsed: s.isMessagingListCollapsed,
  }));
  const { setIsResizingMessagingList } = useAppShellStore.getState();

  useResizableMessagingList(containerRef);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMessagingListCollapsed) return;
    e.preventDefault();
    setIsResizingMessagingList(true);
  };

  const listWidth = isMessagingListCollapsed ? COLLAPSED_WIDTH : messagingListWidth;

  return (
    <div ref={containerRef} className={cn(
      "h-full w-full flex bg-background", 
      isResizingMessagingList && !isMessagingListCollapsed && "cursor-col-resize select-none"
    )}>
        <div style={{ width: `${listWidth}px` }} className="flex-shrink-0 transition-[width] duration-300 ease-in-out">
          <ConversationList />
        </div>
        {!isMessagingListCollapsed && (
          <div onMouseDown={handleMouseDown} className="w-2 flex-shrink-0 cursor-col-resize group flex items-center justify-center">
            <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200" />
          </div>
        )}
        <div className="flex-1 min-w-0"><MessagingContent conversationId={conversationId} /></div>
    </div>
  );
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
  </head>
  <body>
    <div id="root"></div>
    <div id="toaster-container"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
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

## File: src/hooks/useAppViewManager.hook.ts
```typescript
import { useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import type { AppShellState, ActivePage } from '@/store/appShell.store';
import type { DataItem, ViewMode, SortConfig, SortableField, GroupableField, Status, Priority } from '@/pages/DataDemo/types';
import type { FilterConfig } from '@/pages/DataDemo/components/DataToolbar';
import { BODY_STATES } from '@/lib/utils';

const pageToPaneMap: Record<string, AppShellState['sidePaneContent']> = {
  dashboard: 'main',
  settings: 'settings',
  toaster: 'toaster',
  notifications: 'notifications',
  'data-demo': 'dataDemo',
  messaging: 'messaging',
};

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

  // --- DERIVED STATE FROM URL ---

  const view = searchParams.get('view');
  const sidePane = searchParams.get('sidePane');
  const right = searchParams.get('right');

  const { bodyState, sidePaneContent } = useMemo(() => {
    const validPanes: AppShellState['sidePaneContent'][] = ['details', 'settings', 'main', 'toaster', 'notifications', 'dataDemo', 'messaging'];
    
    if (conversationId) {
      return { bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: 'messaging' as const };
    }

    if (itemId) {
      if (view === 'split') {
        return { bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: 'dataItem' as const };
      }
      return { bodyState: BODY_STATES.SIDE_PANE, sidePaneContent: 'dataItem' as const };
    }
    
    if (sidePane && validPanes.includes(sidePane as AppShellState['sidePaneContent'])) {
      return { bodyState: BODY_STATES.SIDE_PANE, sidePaneContent: sidePane as AppShellState['sidePaneContent'] };
    }
    
    if (view === 'split' && right && validPanes.includes(right as AppShellState['sidePaneContent'])) {
      return { bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: right as AppShellState['sidePaneContent'] };
    }
    
    return { bodyState: BODY_STATES.NORMAL, sidePaneContent: 'details' as const };
  }, [itemId, conversationId, view, sidePane, right]);
  
  const currentActivePage = useMemo(() => (location.pathname.split('/')[1] || 'dashboard') as ActivePage, [location.pathname]);

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

## File: src/store/appShell.store.ts
```typescript
import { create } from 'zustand';
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
  messagingListWidth: number;
  messagingProfileWidth: number;
  previousBodyState: BodyState;
  fullscreenTarget: 'main' | 'right' | null;
  isResizing: boolean;
  isResizingRightPane: boolean;
  isResizingMessagingList: boolean;
  isResizingMessagingProfile: boolean;
  isMessagingListCollapsed: boolean;
  isMessagingProfileCollapsed: boolean;
  isTopBarVisible: boolean;
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
    setSplitPaneWidth: (payload: number) => void;
    setMessagingListWidth: (payload: number) => void;
    setIsResizing: (payload: boolean) => void;
    setMessagingProfileWidth: (payload: number) => void;
    setFullscreenTarget: (payload: 'main' | 'right' | null) => void;
    setIsResizingRightPane: (payload: boolean) => void;
    setIsResizingMessagingList: (payload: boolean) => void;
    setIsResizingMessagingProfile: (payload: boolean) => void;
    toggleMessagingListCollapsed: () => void;
    toggleMessagingProfileCollapsed: () => void;
    setTopBarVisible: (payload: boolean) => void;
    setAutoExpandSidebar: (payload: boolean) => void;
    setReducedMotion: (payload: boolean) => void;
    setCompactMode: (payload: boolean) => void;
    setPrimaryColor: (payload: string) => void;
    setDraggedPage: (payload: AppShellState['draggedPage']) => void;
    setCommandPaletteOpen: (open: boolean) => void;
    toggleDarkMode: () => void;
    setDragHoverTarget: (payload: 'left' | 'right' | null) => void;
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
  messagingListWidth: 384,
  messagingProfileWidth: 384,
  previousBodyState: BODY_STATES.NORMAL,
  fullscreenTarget: null,
  isResizing: false,
  isResizingRightPane: false,
  isResizingMessagingList: false,
  isResizingMessagingProfile: false,
  isMessagingListCollapsed: false,
  isMessagingProfileCollapsed: false,
  isTopBarVisible: true,
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


export const useAppShellStore = create<AppShellState & AppShellActions>((set, get) => ({
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
  setSplitPaneWidth: (payload) => set({ splitPaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, payload)) }),
  setMessagingListWidth: (payload) => set({ messagingListWidth: Math.max(320, Math.min(payload, window.innerWidth - 400)) }),
  setMessagingProfileWidth: (payload) => set({ messagingProfileWidth: Math.max(320, Math.min(payload, window.innerWidth - 400)) }),
  setIsResizing: (payload) => set({ isResizing: payload }),
  setFullscreenTarget: (payload) => set({ fullscreenTarget: payload }),
  setIsResizingRightPane: (payload) => set({ isResizingRightPane: payload }),
  setIsResizingMessagingList: (payload) => set({ isResizingMessagingList: payload }),
  setIsResizingMessagingProfile: (payload) => set({ isResizingMessagingProfile: payload }),
  toggleMessagingListCollapsed: () => set(state => ({ isMessagingListCollapsed: !state.isMessagingListCollapsed })),
  toggleMessagingProfileCollapsed: () => set(state => ({ isMessagingProfileCollapsed: !state.isMessagingProfileCollapsed })),
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
    // Preserve props passed to provider
    const { appName, appLogo } = get();
    const currentPrimaryColor = defaultState.primaryColor;
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--primary-hsl', currentPrimaryColor);
    }
    set({ ...defaultState, primaryColor: currentPrimaryColor, appName, appLogo });
  },
}));

// Add a selector for the derived rightPaneWidth
export const useRightPaneWidth = () => useAppShellStore(state => 
    state.bodyState === BODY_STATES.SPLIT_VIEW ? state.splitPaneWidth : state.sidePaneWidth
);
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

## File: src/hooks/useResizablePanes.hook.ts
```typescript
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { useAppShellStore } from '@/store/appShell.store';
import { BODY_STATES } from '@/lib/utils';

export function useResizableSidebar(
  sidebarRef: React.RefObject<HTMLDivElement>,
  resizeHandleRef: React.RefObject<HTMLDivElement>
) {
  const isResizing = useAppShellStore(s => s.isResizing);
  const { setSidebarWidth, setIsResizing } = useAppShellStore.getState();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = Math.max(200, Math.min(500, e.clientX));
      setSidebarWidth(newWidth);

      if (sidebarRef.current) {
        gsap.set(sidebarRef.current, { width: newWidth });
      }
      if (resizeHandleRef.current) {
        gsap.set(resizeHandleRef.current, { left: newWidth });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setSidebarWidth, setIsResizing, sidebarRef, resizeHandleRef]);
}

export function useResizableRightPane() {
  const isResizingRightPane = useAppShellStore(s => s.isResizingRightPane);
  const bodyState = useAppShellStore(s => s.bodyState);
  const { setSplitPaneWidth, setSidePaneWidth, setIsResizingRightPane } = useAppShellStore.getState();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRightPane) return;

      const newWidth = window.innerWidth - e.clientX;
      if (bodyState === BODY_STATES.SPLIT_VIEW) {
        setSplitPaneWidth(newWidth);
      } else {
        setSidePaneWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingRightPane(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizingRightPane) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isResizingRightPane, setSplitPaneWidth, setSidePaneWidth, setIsResizingRightPane, bodyState]);
}

export function useResizableMessagingList(containerRef: React.RefObject<HTMLDivElement>) {
  const isResizingMessagingList = useAppShellStore(s => s.isResizingMessagingList);
  const { setMessagingListWidth, setIsResizingMessagingList } = useAppShellStore.getState();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingMessagingList || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;
      
      setMessagingListWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingMessagingList(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizingMessagingList) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizingMessagingList, setMessagingListWidth, setIsResizingMessagingList, containerRef]);
}

export function useResizableMessagingProfile(containerRef: React.RefObject<HTMLDivElement>) {
  const isResizingMessagingProfile = useAppShellStore(s => s.isResizingMessagingProfile);
  const { setMessagingProfileWidth, setIsResizingMessagingProfile } = useAppShellStore.getState();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingMessagingProfile || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = containerRect.right - e.clientX;
      
      setMessagingProfileWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingMessagingProfile(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizingMessagingProfile) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isResizingMessagingProfile, setMessagingProfileWidth, setIsResizingMessagingProfile, containerRef]);
}
```

## File: src/index.css
```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@layer base {
  :root {
    --primary-hsl: 220 84% 60%;
    --background: 210 40% 96.1%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: var(--primary-hsl);
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: var(--primary-hsl);
    --radius: 1rem;
  }

  .dark {
    --background: 240 6% 9%;
    --foreground: 210 40% 98%;
    --card: 240 6% 14%;
    --card-foreground: 210 40% 98%;
    --popover: 240 6% 12%;
    --popover-foreground: 210 40% 98%;
    --primary: var(--primary-hsl);
    --primary-foreground: 210 40% 98%;
    --secondary: 240 5% 20%;
    --secondary-foreground: 210 40% 98%;
    --muted: 240 5% 20%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 240 5% 20%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 240 5% 20%;
    --input: 240 5% 20%;
    --ring: var(--primary-hsl);
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom scrollbar styles */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-transparent;
}

::-webkit-scrollbar-thumb {
  @apply bg-border rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-muted-foreground/50;
}

/* For UserDropdown */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

@layer base {
  .login-page-theme {
    --background: hsl(0 0% 100%);
    --foreground: hsl(0 0% 0%);
    --skeleton: hsl(0 0% 90%);
    --border: hsl(220 20% 90%);
    --btn-border: hsl(214.3 31.8% 91.4%);
    --input: hsl(220 20% 90%);
    --radius: 0.5rem;
  }
 
  .dark .login-page-theme {
    --background: hsl(222 94% 5%);
    --foreground: hsl(0 0% 100%);
    --skeleton: hsl(218 36% 16%);
    --border: hsl(220 20% 90%);
    --btn-border: hsl(217 32.6% 17.5%);
    --input: hsl(219 63% 16%);
    --radius: 0.5rem;
  }
}

@layer components {
  .g-button {
    @apply rounded-[var(--radius)] border;
    border-color: var(--btn-border);
  }
}
```

## File: src/components/layout/RightPane.tsx
```typescript
import { forwardRef, useMemo, useCallback, createElement, memo } from 'react'
import {
  ChevronRight,
  X,
  Layers,
  SplitSquareHorizontal,
  ChevronsLeftRight,
} from 'lucide-react'
import { cn, BODY_STATES } from '@/lib/utils';
import { useAppShellStore } from '@/store/appShell.store';
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import { useRightPaneContent } from '@/hooks/useRightPaneContent.hook'

export const RightPane = memo(forwardRef<HTMLDivElement, { className?: string }>(({ className }, ref) => {
  const fullscreenTarget = useAppShellStore(s => s.fullscreenTarget)
  const bodyState = useAppShellStore(s => s.bodyState)
  const { toggleFullscreen, setIsResizingRightPane } =
    useAppShellStore.getState()

  const viewManager = useAppViewManager()
  const { sidePaneContent, closeSidePane, toggleSplitView, navigateTo } = viewManager
  
  const { meta, content: children } = useRightPaneContent(sidePaneContent)
  
  const isSplitView = bodyState === BODY_STATES.SPLIT_VIEW;
  const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;

  const handleMaximize = useCallback(() => {
    if ("page" in meta && meta.page) {
      navigateTo(meta.page);
    }
  }, [meta, navigateTo]);

  const header = useMemo(() => (
    <div className="flex items-center justify-between p-4 border-b border-border h-20 flex-shrink-0 pl-6">
      {bodyState !== BODY_STATES.SPLIT_VIEW && 'icon' in meta ? (
        <div className="flex items-center gap-2">
          {meta.icon && createElement(meta.icon, { className: "w-5 h-5" })}
          <h2 className="text-lg font-semibold whitespace-nowrap">{meta.title}</h2>
        </div>
      ) : <div />}
      <div className="flex items-center">
        {(bodyState === BODY_STATES.SIDE_PANE || bodyState === BODY_STATES.SPLIT_VIEW) && (
          <button onClick={toggleSplitView} className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors" title={bodyState === BODY_STATES.SIDE_PANE ? "Switch to Split View" : "Switch to Overlay View"}>
            {bodyState === BODY_STATES.SPLIT_VIEW ? <Layers className="w-5 h-5" /> : <SplitSquareHorizontal className="w-5 h-5" />}
          </button>
        )}
        {bodyState !== BODY_STATES.SPLIT_VIEW && "page" in meta && meta.page && (
          <button onClick={handleMaximize} className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors mr-2" title="Move to Main View">
            <ChevronsLeftRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  ), [bodyState, meta, handleMaximize, toggleSplitView]);

  if (isFullscreen && fullscreenTarget !== 'right') {
    return null;
  }

  return (
    <aside
      ref={ref}
      className={cn(
        "border-l border-border flex flex-col h-full overflow-hidden",
        isSplitView && "relative bg-background",
        !isSplitView && !isFullscreen && "fixed top-0 right-0 z-[60] bg-card", // side pane overlay
        isFullscreen && fullscreenTarget === 'right' && "fixed inset-0 z-[60] bg-card", // fullscreen
        className,
      )}
    >
      {isFullscreen && fullscreenTarget === 'right' && (
        <button
          onClick={() => toggleFullscreen()}
          className="fixed top-6 right-6 lg:right-12 z-[100] h-12 w-12 flex items-center justify-center rounded-full bg-card/50 backdrop-blur-sm hover:bg-card/75 transition-colors group"
          title="Exit Fullscreen"
        >
          <X className="w-6 h-6 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
        </button>
      )}
      {bodyState !== BODY_STATES.SPLIT_VIEW && !isFullscreen && (
        <button
          onClick={closeSidePane}
          className="absolute top-1/2 -left-px -translate-y-1/2 -translate-x-full w-8 h-16 bg-card border border-r-0 border-border rounded-l-lg flex items-center justify-center hover:bg-accent transition-colors group z-10"
          title="Close pane"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      )}
      <div 
        className={cn(
          "absolute top-0 left-0 w-2 h-full bg-transparent hover:bg-primary/20 cursor-col-resize z-50 transition-colors duration-200 group -translate-x-1/2"
        )}
        onMouseDown={(e) => {
          e.preventDefault()
          setIsResizingRightPane(true);
        }}
      >
        <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200 mx-auto" />
      </div>
      {header}
      <div className={cn("flex-1 overflow-y-auto")}>
        {children}
      </div>
    </aside>
  )
}));
RightPane.displayName = "RightPane"
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

## File: src/components/layout/AppShell.tsx
```typescript
import React, { useRef, type ReactElement, useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils'
import { gsap } from 'gsap';
import { CommandPalette } from '@/components/global/CommandPalette';
import { useAppShellStore } from '@/store/appShell.store';
import { SIDEBAR_STATES, BODY_STATES } from '@/lib/utils'
import { useResizableSidebar, useResizableRightPane } from '@/hooks/useResizablePanes.hook'
import { useSidebarAnimations, useBodyStateAnimations } from '@/hooks/useAppShellAnimations.hook'
import { ViewModeSwitcher } from './ViewModeSwitcher';
import { usePaneDnd } from '@/hooks/usePaneDnd.hook';

interface AppShellProps {
  sidebar: ReactElement;
  topBar: ReactElement;
  mainContent: ReactElement;
  rightPane: ReactElement;
  commandPalette?: ReactElement;
  onOverlayClick?: () => void;
}

const pageToPaneMap: Record<string, 'main' | 'settings' | 'toaster' | 'notifications' | 'dataDemo'> = {
  dashboard: 'main',
  settings: 'settings',
  toaster: 'toaster',
  notifications: 'notifications',
  'data-demo': 'dataDemo',
};

// Helper hook to get the previous value of a prop or state
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}


export function AppShell({ sidebar, topBar, mainContent, rightPane, commandPalette, onOverlayClick }: AppShellProps) {
  const sidebarState = useAppShellStore(s => s.sidebarState);
  const autoExpandSidebar = useAppShellStore(s => s.autoExpandSidebar);
  const hoveredPane = useAppShellStore(s => s.hoveredPane);
  const draggedPage = useAppShellStore(s => s.draggedPage);
  const dragHoverTarget = useAppShellStore(s => s.dragHoverTarget);
  const bodyState = useAppShellStore(s => s.bodyState);
  const sidePaneContent = useAppShellStore(s => s.sidePaneContent);
  const reducedMotion = useAppShellStore(s => s.reducedMotion);
  const isTopBarVisible = useAppShellStore(s => s.isTopBarVisible);
  const isDarkMode = useAppShellStore(s => s.isDarkMode);
  const { setSidebarState, peekSidebar, setHoveredPane } = useAppShellStore.getState();
  
  const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;
  const isSidePaneOpen = bodyState === BODY_STATES.SIDE_PANE;
  const location = useLocation();
  const activePage = location.pathname.split('/')[1] || 'dashboard';
  const appRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const rightPaneRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const topBarContainerRef = useRef<HTMLDivElement>(null)
  const mainAreaRef = useRef<HTMLDivElement>(null)

  const prevActivePage = usePrevious(activePage);
  const prevSidePaneContent = usePrevious(sidePaneContent);

  const isSplitView = bodyState === BODY_STATES.SPLIT_VIEW;
  const dndHandlers = usePaneDnd();

  // Custom hooks for logic
  useResizableSidebar(sidebarRef, resizeHandleRef);
  useResizableRightPane();
  useSidebarAnimations(sidebarRef, resizeHandleRef);
  useBodyStateAnimations(appRef, mainContentRef, rightPaneRef, topBarContainerRef, mainAreaRef);
  
  // Animation for pane swapping
  useLayoutEffect(() => {
    if (reducedMotion || bodyState !== BODY_STATES.SPLIT_VIEW || !prevActivePage || !prevSidePaneContent) {
      return;
    }

    const pageForPrevSidePane = Object.keys(pageToPaneMap).find(
      key => pageToPaneMap[key as keyof typeof pageToPaneMap] === prevSidePaneContent
    );

    // Check if a swap occurred by comparing current state with previous state
    if (activePage === pageForPrevSidePane && sidePaneContent === pageToPaneMap[prevActivePage as keyof typeof pageToPaneMap]) {
      const mainEl = mainAreaRef.current;
      const rightEl = rightPaneRef.current;

      if (mainEl && rightEl) {
        const mainWidth = mainEl.offsetWidth;
        const rightWidth = rightEl.offsetWidth;

        const tl = gsap.timeline();
        
        // Animate main content FROM where right pane was TO its new place
        tl.from(mainEl, {
          x: rightWidth, duration: 0.4, ease: 'power3.inOut'
        });

        // Animate right pane FROM where main content was TO its new place
        tl.from(rightEl, {
          x: -mainWidth, duration: 0.4, ease: 'power3.inOut'
        }, 0); // Start at the same time
      }
    }
  }, [activePage, sidePaneContent, bodyState, prevActivePage, prevSidePaneContent, reducedMotion]);
  
  const sidebarWithProps = React.cloneElement(sidebar, { 
    ref: sidebarRef,
    onMouseEnter: () => {
      if (autoExpandSidebar && sidebarState === SIDEBAR_STATES.COLLAPSED) {
        peekSidebar()
      }
    },
    onMouseLeave: () => {
      if (autoExpandSidebar && sidebarState === SIDEBAR_STATES.PEEK) {
        setSidebarState(SIDEBAR_STATES.COLLAPSED);
      }
    }
  });

  const mainContentWithProps = React.cloneElement(mainContent, {
    ref: mainContentRef,
  });

  const rightPaneWithProps = React.cloneElement(rightPane, { ref: rightPaneRef });

  return (
    <div 
      ref={appRef}
      className={cn(
        "relative h-screen w-screen overflow-hidden bg-background transition-colors duration-300",
        isDarkMode && "dark"
      )}
    >
      <div className="flex h-screen overflow-hidden">
        {/* Enhanced Sidebar */}
        {sidebarWithProps}

        {/* Resize Handle */}
        {sidebarState !== SIDEBAR_STATES.HIDDEN && (
          <div
            ref={resizeHandleRef}
            className={cn(
              "absolute top-0 w-2 h-full bg-transparent hover:bg-primary/20 cursor-col-resize z-50 transition-colors duration-200 group -translate-x-1/2"
            )}
            onMouseDown={(e) => {
              e.preventDefault()
              useAppShellStore.getState().setIsResizing(true);
            }}
          >
            <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200 mx-auto" />
          </div>
        )}

        {/* Main area wrapper */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div
            ref={topBarContainerRef}
            className={cn(
              "absolute top-0 left-0 right-0 z-30",
              isFullscreen && "z-0"
            )}
            onMouseEnter={() => { if (isSplitView) setHoveredPane(null); }}
          >
            {topBar}
          </div>

          <div className="flex flex-1 min-h-0">
            <div
              ref={mainAreaRef}
              className="relative flex-1 overflow-hidden bg-background"
              onMouseEnter={() => { if (isSplitView && !draggedPage) setHoveredPane('left'); }}
              onMouseLeave={() => { if (isSplitView && !draggedPage) setHoveredPane(null); }}
            >
              {/* Side Pane Overlay */}
              <div
                role="button"
                aria-label="Close side pane"
                tabIndex={isSidePaneOpen ? 0 : -1}
                className={cn(
                  "absolute inset-0 bg-black/40 z-40 transition-opacity duration-300",
                  isSidePaneOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                )}
                onClick={onOverlayClick}
              />
              {/* Left drop overlay */}
              <div
                className={cn(
                  "absolute inset-y-0 left-0 z-40 border-2 border-transparent transition-all",
                  draggedPage
                    ? cn("pointer-events-auto", isSplitView ? 'w-full' : 'w-1/2')
                    : "pointer-events-none w-0",
                  dragHoverTarget === 'left' && "bg-primary/10 border-primary"
                )}
                onDragOver={dndHandlers.handleDragOverLeft}
                onDrop={dndHandlers.handleDropLeft}
                onDragLeave={dndHandlers.handleDragLeave}
              >
                {draggedPage && dragHoverTarget === 'left' && (
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-primary-foreground/80 pointer-events-none">
                    <span className="px-3 py-1 rounded-md bg-primary/70">{isSplitView ? 'Drop to Replace' : 'Drop to Left'}</span>
                  </div>
                )}
              </div>
              {mainContentWithProps}
              {isSplitView && hoveredPane === 'left' && !draggedPage && (
                <div className={cn("absolute right-4 z-50 transition-all", isTopBarVisible ? 'top-24' : 'top-4')}>
                  <ViewModeSwitcher pane="main" />
                </div>
              )}
              {/* Right drop overlay (over main area, ONLY when NOT in split view) */}
              {!isSplitView && (
                <div
                  className={cn(
                    "absolute inset-y-0 right-0 z-40 border-2 border-transparent",
                    draggedPage ? "pointer-events-auto w-1/2" : "pointer-events-none",
                    dragHoverTarget === 'right' && "bg-primary/10 border-primary"
                  )}
                  onDragOver={dndHandlers.handleDragOverRight}
                  onDrop={dndHandlers.handleDropRight}
                  onDragLeave={dndHandlers.handleDragLeave}
                >
                  {draggedPage && dragHoverTarget === 'right' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="px-3 py-1 rounded-md bg-primary/70 text-sm font-medium text-primary-foreground/80">Drop to Right</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            {isSplitView ? (
              <div
                className="relative"
                onMouseEnter={() => { if (isSplitView && !draggedPage) setHoveredPane('right'); }}
                onMouseLeave={() => { if (isSplitView && !draggedPage) setHoveredPane(null); }}
                onDragOver={dndHandlers.handleDragOverRight}
              >
                {rightPaneWithProps}
                {draggedPage && (
                  <div
                    className={cn(
                      'absolute inset-0 z-50 transition-all',
                      dragHoverTarget === 'right'
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'pointer-events-none'
                    )}
                    onDragLeave={dndHandlers.handleDragLeave}
                    onDrop={dndHandlers.handleDropRight}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {dragHoverTarget === 'right' && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="px-3 py-1 rounded-md bg-primary/70 text-sm font-medium text-primary-foreground/80">
                          Drop to Replace
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {hoveredPane === 'right' && !draggedPage && (
                  <div className={cn("absolute right-4 z-[70] transition-all", isTopBarVisible ? 'top-24' : 'top-4')}>
                    <ViewModeSwitcher pane="right" />
                  </div>
                )}
              </div>
            ) : rightPaneWithProps}
          </div>
        </div>
      </div>
      {commandPalette || <CommandPalette />}
    </div>
  )
}
```

## File: src/App.tsx
```typescript
import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useNavigate, // used in LoginPageWrapper
  useLocation,
} from "react-router-dom";

import { AppShell } from "./components/layout/AppShell";
import { AppShellProvider } from "./providers/AppShellProvider";
import { useAppShellStore } from "./store/appShell.store";
import { useAuthStore } from "./store/authStore";
import "./index.css";

// Import library components
import { EnhancedSidebar } from "./components/layout/EnhancedSidebar";
import { MainContent } from "./components/layout/MainContent";
import { RightPane } from "./components/layout/RightPane";
import { TopBar } from "./components/layout/TopBar";
import { CommandPalette } from "./components/global/CommandPalette";
import { ToasterProvider } from "./components/ui/toast";

// --- Page/Content Components for Pages and Panes ---
import { DashboardContent } from "./pages/Dashboard";
import { SettingsPage } from "./pages/Settings";
import { ToasterDemo } from "./pages/ToasterDemo";
import { NotificationsPage } from "./pages/Notifications";
import DataDemoPage from "./pages/DataDemo";
import MessagingPage from "./pages/Messaging";
import { LoginPage } from "./components/auth/LoginPage";

// --- Icons ---
import {
  Search,
  Filter,
  Plus,
  ChevronRight,
  Rocket,
} from "lucide-react";

// --- Utils & Hooks ---
import { cn } from "./lib/utils";
import { useAppViewManager } from "./hooks/useAppViewManager.hook";
import { useRightPaneContent } from "./hooks/useRightPaneContent.hook";
import { BODY_STATES } from "./lib/utils";

// Checks for authentication and redirects to login if needed
function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

// A root component to apply global styles and effects
function Root() {
  const isDarkMode = useAppShellStore((state) => state.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return <Outlet />;
}

// The main layout for authenticated parts of the application
function ProtectedLayout() {

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <AppShellProvider
        appName="Jeli App"
        appLogo={
          <div className="p-2 bg-primary/20 rounded-lg">
            <Rocket className="w-5 h-5 text-primary" />
          </div>
        }
      >
        <ComposedApp />
      </AppShellProvider>
    </div>
  );
}

// Content for the Top Bar (will be fully refactored in Part 2)
function AppTopBar() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const location = useLocation();
  const activePage = location.pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'dashboard';

  return (
    <div className="flex items-center gap-3 flex-1">
      <div
        className={cn(
          "hidden md:flex items-center gap-2 text-sm transition-opacity",
          {
            "opacity-0 pointer-events-none":
              isSearchFocused && activePage === "dashboard",
          },
        )}
      >
        <a
          href="#"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Home
        </a>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-foreground capitalize">
          {activePage}
        </span>
      </div>

      <div className="flex-1" />

      {/* Page-specific: Dashboard search and actions */}
      {activePage === "dashboard" && (
        <div className="flex items-center gap-2 flex-1 justify-end">
          <div
            className={cn(
              "relative transition-all duration-300 ease-in-out",
              isSearchFocused ? "flex-1 max-w-lg" : "w-auto",
            )}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={cn(
                "pl-9 pr-4 py-2 h-10 border-none rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ease-in-out w-full",
                isSearchFocused ? "bg-background" : "w-48",
              )}
            />
          </div>
          <button className="h-10 w-10 flex-shrink-0 flex items-center justify-center hover:bg-accent rounded-full transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 h-10 flex-shrink-0">
            <Plus className="w-5 h-5" />
            <span
              className={cn(isSearchFocused ? "hidden sm:inline" : "inline")}
            >
              New Project
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

// The main App component that composes the shell
function ComposedApp() {
  const { setBodyState, setSidePaneContent } = useAppShellStore();
  const viewManager = useAppViewManager();

  // Sync URL state with AppShellStore
  useEffect(() => {
    setBodyState(viewManager.bodyState);
    setSidePaneContent(viewManager.sidePaneContent);
  }, [viewManager.bodyState, viewManager.sidePaneContent, setBodyState, setSidePaneContent]);

  return (
    <AppShell
      sidebar={<EnhancedSidebar />}
      onOverlayClick={viewManager.closeSidePane}
      topBar={
        <TopBar>
          <AppTopBar />
        </TopBar>
      }
      mainContent={
        <MainContent>
          <Outlet />
        </MainContent>
      }
      rightPane={<RightPane />}
      commandPalette={<CommandPalette />}
    />
  );
}

function App() {
  const router = createBrowserRouter([
    {
      element: <Root />,
      children: [
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/",
          element: <ProtectedRoute />,
          children: [
            {
              path: "/",
              element: <ProtectedLayout />,
              children: [
                { index: true, element: <Navigate to="/dashboard" replace /> },
                { path: "dashboard", element: <DashboardContent /> },
                { path: "settings", element: <SettingsPage /> },
                { path: "toaster", element: <ToasterDemo /> },
                { path: "notifications", element: <NotificationsPage /> },
                { path: "data-demo", element: <DataDemoPage /> },
                { path: "data-demo/:itemId", element: <DataDemoPage /> },
                { path: "messaging", element: <MessagingPage /> },
                { path: "messaging/:conversationId", element: <MessagingPage /> },
              ],
            },
          ],
        },
      ],
    },
  ]);

  return (
    <ToasterProvider>
      <RouterProvider router={router} />
    </ToasterProvider>
  );
}

export default App;
```
