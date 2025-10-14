I will now execute Part 1 of the plan, focusing on establishing the foundational architecture for the new Omni-channel CRM messaging page.

### Part 1: Foundation, Routing, and Data Modeling

First, I'll create the necessary files for the new messaging feature, including type definitions, mock data, and a Zustand store.

```typescript // src/pages/Messaging/types.ts
import { Icon } from 'lucide-react';
import type { ComponentType } from 'react';

export type Channel = 'whatsapp' | 'instagram' | 'facebook' | 'sms';

export type ContactStatus = 'active' | 'away' | 'offline';

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: ContactStatus;
  lastSeen: string;
  tags: string[];
  email?: string;
  phone?: string;
  location?: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
  };
  aiSummary: {
    personality: string[];
    recentTopics: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
  };
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: 'contact' | 'agent';
  agentName?: string;
  agentAvatar?: string;
  read: boolean;
  type: 'text' | 'image' | 'file';
  attachment?: {
    url: string;
    name?: string;
    size?: string;
  };
}

export interface Conversation {
  id: string;
  contact: Contact;
  channel: Channel;
  unreadCount: number;
  lastMessage: Message;
  messages: Message[];
}

export interface ChannelConfig {
  icon: ComponentType<{ className?: string }>;
  color: string;
  name: string;
}
```

```typescript // src/pages/Messaging/data/mockData.ts
import { Instagram, MessageSquare, Facebook } from 'lucide-react';
import { SiWhatsapp } from '@icons-pack/react-simple-icons';
import type { Conversation, ChannelConfig } from '../types';

export const channelConfig: Record<string, ChannelConfig> = {
  whatsapp: {
    icon: SiWhatsapp,
    color: 'text-green-500',
    name: 'WhatsApp',
  },
  instagram: {
    icon: Instagram,
    color: 'text-pink-500',
    name: 'Instagram',
  },
  facebook: {
    icon: Facebook,
    color: 'text-blue-600',
    name: 'Facebook',
  },
  sms: {
    icon: MessageSquare,
    color: 'text-sky-500',
    name: 'SMS',
  }
};


export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    contact: {
      id: 'contact-1',
      name: 'Elena Rodriguez',
      avatar: 'https://avatar.vercel.sh/er.png',
      status: 'active',
      lastSeen: 'online',
      tags: ['VIP', 'New Lead'],
      email: 'elena.r@example.com',
      phone: '+1 234 567 8901',
      location: 'Madrid, Spain',
      socials: {
        linkedin: 'linkedin.com/in/elenarodriguez',
      },
      aiSummary: {
        personality: ['Inquisitive', 'Direct', 'Detail-oriented'],
        recentTopics: ['Pricing plans', 'API integration', 'Support SLAs'],
        sentiment: 'positive',
      },
    },
    channel: 'whatsapp',
    unreadCount: 2,
    lastMessage: {
      id: 'msg-1-3',
      content: "That sounds great, thank you! I'll review the new proposal.",
      timestamp: '2024-05-21T10:45:00Z',
      sender: 'contact',
      read: false,
      type: 'text',
    },
    messages: [
      { id: 'msg-1-1', content: 'Hi, I have a question about your enterprise plan.', timestamp: '2024-05-21T10:30:00Z', sender: 'contact', read: true, type: 'text' },
      { id: 'msg-1-2', content: 'Hello Elena! Happy to help. What would you like to know?', timestamp: '2024-05-21T10:32:00Z', sender: 'agent', agentName: 'Alex', read: true, type: 'text' },
      { id: 'msg-1-3', content: "That sounds great, thank you! I'll review the new proposal.", timestamp: '2024-05-21T10:45:00Z', sender: 'contact', read: false, type: 'text' },
    ],
  },
  {
    id: 'conv-2',
    contact: {
      id: 'contact-2',
      name: 'Ben Carter',
      avatar: 'https://avatar.vercel.sh/bc.png',
      status: 'away',
      lastSeen: '2 hours ago',
      tags: ['Returning Customer'],
      email: 'ben.c@example.com',
      phone: '+44 20 7946 0958',
      location: 'London, UK',
      aiSummary: {
        personality: ['Concise', 'Friendly'],
        recentTopics: ['Order status', 'Shipping options'],
        sentiment: 'neutral',
      },
    },
    channel: 'instagram',
    unreadCount: 0,
    lastMessage: {
      id: 'msg-2-2',
      content: 'Perfect, thanks for the update!',
      timestamp: '2024-05-21T08:15:00Z',
      sender: 'agent',
      read: true,
      type: 'text',
    },
    messages: [
       { id: 'msg-2-1', content: 'Hey, any update on my order #12345?', timestamp: '2024-05-21T08:10:00Z', sender: 'contact', read: true, type: 'text' },
       { id: 'msg-2-2', content: 'Perfect, thanks for the update!', timestamp: '2024-05-21T08:15:00Z', sender: 'agent', agentName: 'Chloe', read: true, type: 'text' },
    ],
  },
  {
    id: 'conv-3',
    contact: {
      id: 'contact-3',
      name: 'Aisha Khan',
      avatar: 'https://avatar.vercel.sh/ak.png',
      status: 'offline',
      lastSeen: 'yesterday',
      tags: ['High Value'],
      email: 'aisha.k@example.com',
      location: 'Dubai, UAE',
      aiSummary: {
        personality: ['Analytical', 'Patient'],
        recentTopics: ['Feature comparison', 'Data security'],
        sentiment: 'positive',
      },
    },
    channel: 'facebook',
    unreadCount: 1,
    lastMessage: {
      id: 'msg-3-3',
      content: 'Could you send over the security compliance document?',
      timestamp: '2024-05-20T16:20:00Z',
      sender: 'contact',
      read: false,
      type: 'text',
    },
    messages: [
        { id: 'msg-3-1', content: 'Hi, I saw your ad and wanted to learn more.', timestamp: '2024-05-20T16:00:00Z', sender: 'contact', read: true, type: 'text' },
        { id: 'msg-3-2', content: 'Hi Aisha, thanks for reaching out! We have a full feature list on our website.', timestamp: '2024-05-20T16:05:00Z', sender: 'agent', agentName: 'Alex', read: true, type: 'text' },
        { id: 'msg-3-3', content: 'Could you send over the security compliance document?', timestamp: '2024-05-20T16:20:00Z', sender: 'contact', read: false, type: 'text' },
    ],
  },
  {
    id: 'conv-4',
    contact: {
      id: 'contact-4',
      name: 'Marcus Holloway',
      avatar: 'https://avatar.vercel.sh/mh.png',
      status: 'active',
      lastSeen: 'online',
      tags: ['Tech Issue', 'Enterprise'],
      email: 'marcus.h@example.com',
      location: 'San Francisco, USA',
      aiSummary: {
        personality: ['Technical', 'Pragmatic'],
        recentTopics: ['Bug report', 'System logs'],
        sentiment: 'negative',
      },
    },
    channel: 'sms',
    unreadCount: 0,
    lastMessage: {
      id: 'msg-4-2',
      content: "I've attached the logs. Please escalate this issue.",
      timestamp: '2024-05-21T11:05:00Z',
      sender: 'contact',
      read: true,
      type: 'text',
    },
    messages: [
       { id: 'msg-4-1', content: 'The new update broke our integration.', timestamp: '2024-05-21T11:00:00Z', sender: 'contact', read: true, type: 'text' },
       { id: 'msg-4-2', content: "I've attached the logs. Please escalate this issue.", timestamp: '2024-05-21T11:05:00Z', sender: 'contact', read: true, type: 'text' },
    ],
  },
];
```

```typescript // src/pages/Messaging/store/messaging.store.ts
import { create } from 'zustand';
import { mockConversations } from '../data/mockData';
import type { Conversation } from '../types';

interface MessagingState {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
}

interface MessagingActions {
  getConversations: () => Conversation[];
  getConversationById: (id: string) => Conversation | undefined;
}

export const useMessagingStore = create<MessagingState & MessagingActions>((set, get) => ({
  conversations: [],
  isLoading: true,
  error: null,

  // Actions
  getConversations: () => {
    // Simulate API fetch
    if (get().conversations.length === 0) {
      setTimeout(() => {
        set({ conversations: mockConversations, isLoading: false });
      }, 500);
    }
    return get().conversations.sort((a, b) =>
      new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
    );
  },

  getConversationById: (id: string) => {
    // Ensure conversations are loaded
    if (get().conversations.length === 0) {
      get().getConversations();
    }
    return get().conversations.find(c => c.id === id);
  },
}));
```

```typescript // src/pages/Messaging/index.tsx
import { useParams } from "react-router-dom";

export default function MessagingPage() {
    const { conversationId } = useParams<{ conversationId: string }>();

    return (
        <div className="h-full w-full flex">
            <div className="w-1/3 border-r">
                <p className="p-4">Conversation List</p>
                {conversationId && <p className="p-4">Selected: {conversationId}</p>}
            </div>
            <div className="w-2/3">
                <p className="p-4">Contact Details / Empty State</p>
                {conversationId && <p className="p-4">Showing details for {conversationId}</p>}
            </div>
        </div>
    );
}
```

Next, I'll add the necessary package for the WhatsApp icon and update the app shell's global state and hooks to recognize the new messaging page.

```json // package.json standard-diff
--- package.json
+++ package.json
@@ -43,6 +43,7 @@
     "preview": "vite preview"
   },
   "peerDependencies": {
+    "@icons-pack/react-simple-icons": "^9.5.0",
     "@iconify/react": "^4.1.1",
     "@radix-ui/react-avatar": "^1.0.4",
     "@radix-ui/react-dialog": "^1.0.5",

```

```typescript // src/store/appShell.store.ts standard-diff
--- src/store/appShell.store.ts
+++ src/store/appShell.store.ts
@@ -3,11 +3,11 @@
 import { SIDEBAR_STATES, BODY_STATES, type SidebarState, type BodyState } from '@/lib/utils';

-export type ActivePage = 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo';
+export type ActivePage = 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo' | 'messaging';

 // --- State and Action Types ---

 export interface AppShellState {
   sidebarState: SidebarState;
   bodyState: BodyState;
-  sidePaneContent: 'details' | 'settings' | 'main' | 'toaster' | 'notifications' | 'dataDemo' | 'dataItem';
+  sidePaneContent: 'details' | 'settings' | 'main' | 'toaster' | 'notifications' | 'dataDemo' | 'dataItem' | 'messaging';
   sidebarWidth: number;
   sidePaneWidth: number;
   splitPaneWidth: number;
@@ -25,7 +25,7 @@
   isDarkMode: boolean;
   appName?: string;
   appLogo?: ReactElement;
-  draggedPage: 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo' | null;
+  draggedPage: ActivePage | null;
   dragHoverTarget: 'left' | 'right' | null;
   hoveredPane: 'left' | 'right' | null;
 }
@@ -49,7 +49,7 @@
     setReducedMotion: (payload: boolean) => void;
     setCompactMode: (payload: boolean) => void;
     setPrimaryColor: (payload: string) => void;
-    setDraggedPage: (payload: 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo' | null) => void;
+    setDraggedPage: (payload: ActivePage | null) => void;
     setCommandPaletteOpen: (open: boolean) => void;
     toggleDarkMode: () => void;
     setDragHoverTarget: (payload: 'left' | 'right' | null) => void;

```

```typescript // src/hooks/useAppViewManager.hook.ts standard-diff
--- src/hooks/useAppViewManager.hook.ts
+++ src/hooks/useAppViewManager.hook.ts
@@ -7,6 +7,7 @@
   settings: 'settings',
   toaster: 'toaster',
   notifications: 'notifications',
   'data-demo': 'dataDemo',
+  messaging: 'messaging',
 };

 /**
@@ -19,13 +20,13 @@
   const [searchParams, setSearchParams] = useSearchParams();
   const navigate = useNavigate();
   const location = useLocation();
-  const { itemId } = useParams<{ itemId: string }>();
+  const { itemId, conversationId } = useParams<{ itemId: string; conversationId: string }>();

   // --- DERIVED STATE FROM URL ---

   const view = searchParams.get('view');
   const sidePane = searchParams.get('sidePane');
   const right = searchParams.get('right');

   const { bodyState, sidePaneContent } = useMemo(() => {
-    const validPanes: AppShellState['sidePaneContent'][] = ['details', 'settings', 'main', 'toaster', 'notifications', 'dataDemo'];
+    const validPanes: AppShellState['sidePaneContent'][] = ['details', 'settings', 'main', 'toaster', 'notifications', 'dataDemo', 'messaging'];

     if (itemId) {
       if (view === 'split') {
@@ -34,6 +35,10 @@
       return { bodyState: BODY_STATES.SIDE_PANE, sidePaneContent: 'dataItem' as const };
     }

+    if (conversationId) {
+      return { bodyState: BODY_STATES.SPLIT_VIEW, sidePaneContent: 'messaging' as const };
+    }
+
     if (sidePane && validPanes.includes(sidePane as AppShellState['sidePaneContent'])) {
       return { bodyState: BODY_STATES.SIDE_PANE, sidePaneContent: sidePane as AppShellState['sidePaneContent'] };
     }
@@ -43,7 +48,7 @@
     }

     return { bodyState: BODY_STATES.NORMAL, sidePaneContent: 'details' as const };
-  }, [itemId, view, sidePane, right]);
+  }, [itemId, conversationId, view, sidePane, right]);

   const currentActivePage = useMemo(() => (location.pathname.split('/')[1] || 'dashboard') as ActivePage, [location.pathname]);


```

```typescript // src/hooks/usePaneDnd.hook.ts standard-diff
--- src/hooks/usePaneDnd.hook.ts
+++ src/hooks/usePaneDnd.hook.ts
@@ -3,11 +3,12 @@
 import { useAppShellStore } from '@/store/appShell.store';
 import { BODY_STATES } from '@/lib/utils';

-const pageToPaneMap: Record<string, 'main' | 'settings' | 'toaster' | 'notifications' | 'dataDemo'> = {
+const pageToPaneMap: Record<string, 'main' | 'settings' | 'toaster' | 'notifications' | 'dataDemo' | 'messaging'> = {
   dashboard: 'main',
   settings: 'settings',
   toaster: 'toaster',
   notifications: 'notifications',
   'data-demo': 'dataDemo',
+  messaging: 'messaging',
 };

 export function usePaneDnd() {

```

```typescript // src/hooks/useRightPaneContent.hook.tsx standard-diff
--- src/hooks/useRightPaneContent.hook.tsx
+++ src/hooks/useRightPaneContent.hook.tsx
@@ -5,6 +5,7 @@
   Bell,
   SlidersHorizontal,
   Database,
+  MessageCircle,
 } from 'lucide-react';

 import { DashboardContent } from "@/pages/Dashboard";
@@ -16,7 +17,7 @@
 import type { AppShellState } from '@/store/appShell.store';

 export function useRightPaneContent(sidePaneContent: AppShellState['sidePaneContent']) {
   const navigate = useNavigate();
-  const { itemId } = useParams<{ itemId: string }>();
+  const { itemId, conversationId } = useParams<{ itemId: string, conversationId: string }>();

   const contentMap = useMemo(() => ({
     main: {
@@ -58,7 +59,12 @@
         </div>
       ),
     },
-  }), []);
+    messaging: {
+      title: "Conversation",
+      icon: MessageCircle,
+      content: <div className="p-6">Message Thread for {conversationId}</div>,
+    },
+  }), [conversationId]);

   const selectedItem = useMemo(() => {
     if (!itemId) return null;
@@ -76,7 +82,7 @@
       meta: mappedContent,
       content: mappedContent.content,
     };
-  }, [sidePaneContent, selectedItem, navigate, contentMap, itemId]);
+  }, [sidePaneContent, selectedItem, navigate, contentMap, itemId, conversationId]);

   return { meta, content };
 }

```

Finally, I'll integrate the new page into the application's router and add a navigation link in the sidebar.

```typescript // src/components/layout/EnhancedSidebar.tsx standard-diff
--- src/components/layout/EnhancedSidebar.tsx
+++ src/components/layout/EnhancedSidebar.tsx
@@ -118,6 +118,7 @@
           <SidebarBody>
             <SidebarSection title="Main">
               <AppMenuItem icon={Home} label="Dashboard" page="dashboard" />
+              <AppMenuItem icon={Mail} label="Messaging" page="messaging" />
               <AppMenuItem icon={Database} label="Data Demo" page="data-demo" />
               <AppMenuItem icon={Search} label="Search" />
               <AppMenuItem icon={Bell} label="Notifications" badge={3} page="notifications" opensInSidePane />
@@ -128,8 +129,7 @@
                 <AppMenuItem icon={Star} label="Starred" isSubItem />
                 <AppMenuItem icon={Trash2} label="Trash" isSubItem />
               </AppMenuItem>
-              <AppMenuItem icon={FolderOpen} label="Projects" hasActions />
-              <AppMenuItem icon={Mail} label="Messages" badge={12} />
+              <AppMenuItem icon={FolderOpen} label="Projects" hasActions />
             </SidebarSection>

             <SidebarSection title="Personal" collapsible>

```

```typescript // src/App.tsx standard-diff
--- src/App.tsx
+++ src/App.tsx
@@ -19,6 +19,7 @@
 import { SettingsPage } from "./pages/Settings";
 import { ToasterDemo } from "./pages/ToasterDemo";
 import { NotificationsPage } from "./pages/Notifications";
 import DataDemoPage from "./pages/DataDemo";
+import MessagingPage from "./pages/Messaging";
 import { LoginPage } from "./components/auth/LoginPage";

 // --- Icons ---
@@ -216,6 +217,8 @@
                 { path: "notifications", element: <NotificationsPage /> },
                 { path: "data-demo", element: <DataDemoPage /> },
                 { path: "data-demo/:itemId", element: <DataDemoPage /> },
+                { path: "messaging", element: <MessagingPage /> },
+                { path: "messaging/:conversationId", element: <MessagingPage /> },
               ],
             },
           ],

```

This completes Part 1. The foundational elements are now in place, and the application is aware of the new messaging feature, its routes, and its potential view states.

```yaml
projectId: jeli-app-shell
uuid: 44bbd414-b6c8-4770-87a3-e7f847ffde58
changeSummary:
  - new: src/pages/Messaging/types.ts
  - new: src/pages/Messaging/data/mockData.ts
  - new: src/pages/Messaging/store/messaging.store.ts
  - new: src/pages/Messaging/index.tsx
  - edit: package.json
  - edit: src/store/appShell.store.ts
  - edit: src/hooks/useAppViewManager.hook.ts
  - edit: src/hooks/usePaneDnd.hook.ts
  - edit: src/hooks/useRightPaneContent.hook.tsx
  - edit: src/components/layout/EnhancedSidebar.tsx
  - edit: src/App.tsx
promptSummary: I need to create an omni-channel CRM messaging page. The page should be in split view mode: the left pane will have a message list and a profile detail column, and the right pane will show the message thread. This response executes part 1 of the plan, which is to lay the foundation, set up routing, and model the data.
gitCommitMsg: >-
  feat(messaging): scaffold foundation for omni-channel CRM page

  - Establishes the directory structure, data types, mock data, and a Zustand store for the new messaging feature.
  - Integrates the messaging page into the application's core systems:
    - Adds new routes for `/messaging` and `/messaging/:conversationId`.
    - Updates the main sidebar with a navigation link to the new page.
    - Extends the `useAppShellStore` and core view management hooks (`useAppViewManager`, `useRightPaneContent`, `usePaneDnd`) to recognize and handle the `'messaging'` page and its associated view states.
  - Adds `@icons-pack/react-simple-icons` for channel-specific iconography.
```
