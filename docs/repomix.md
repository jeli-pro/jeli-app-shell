# Directory Structure
```
src/
  components/
    ui/
      animated-tabs.tsx
  pages/
    Messaging/
      components/
        ConversationList.tsx
      index.tsx
  App.tsx
```

# Files

## File: src/components/ui/animated-tabs.tsx
```typescript
"use client"

import * as React from "react"
import { useState, useRef, useEffect, useLayoutEffect } from "react"
import { cn } from "@/lib/utils"

interface Tab {
  id: string
  label: React.ReactNode
}

interface AnimatedTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

const AnimatedTabs = React.forwardRef<HTMLDivElement, AnimatedTabsProps>(
  ({ className, tabs, activeTab, onTabChange, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" })
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

    // Update active index when controlled prop changes
    useEffect(() => {
      const newActiveIndex = tabs.findIndex(tab => tab.id === activeTab)
      if (newActiveIndex !== -1 && newActiveIndex !== activeIndex) {
        setActiveIndex(newActiveIndex)
      }
    }, [activeTab, tabs, activeIndex])
    
    // Update active indicator position
    useEffect(() => {
      const activeElement = tabRefs.current[activeIndex]
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        })
      }
    }, [activeIndex, tabs])

    // Set initial position of active indicator
    useLayoutEffect(() => {
        const initialActiveIndex = activeTab ? tabs.findIndex(tab => tab.id === activeTab) : 0
        const indexToUse = initialActiveIndex !== -1 ? initialActiveIndex : 0
        
        const firstElement = tabRefs.current[indexToUse]
        if (firstElement) {
          const { offsetLeft, offsetWidth } = firstElement
          setActiveStyle({
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          })
        }
    }, [tabs, activeTab])

    return (
      <div 
        ref={ref} 
        className={cn("relative flex w-full items-center", className)} 
        {...props}
      >
        {/* Active Indicator */}
        <div
          className="absolute -bottom-px h-0.5 bg-primary transition-all duration-300 ease-out"
          style={activeStyle}
        />

        {/* Tabs */}
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[index] = el)}
            className={cn(
              "group relative cursor-pointer px-4 py-5 text-center transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              index === activeIndex 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="flex items-center gap-2 text-lg font-semibold whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>
    )
  }
)
AnimatedTabs.displayName = "AnimatedTabs"

export { AnimatedTabs }
```

## File: src/pages/Messaging/components/ConversationList.tsx
```typescript
import { useState, useMemo, useCallback } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useMessagingStore } from '../store/messaging.store';
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

  return (
    <div className="h-full flex flex-col border-r bg-background/80">
      {/* Header */}
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold tracking-tight">Conversations</h2>
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
import React from "react";
import { ConversationList } from "./components/ConversationList";

export default function MessagingPage() {
  return (
    <div className="h-full w-full">
      <ConversationList />
    </div>
  );
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
    <div className="flex items-center gap-3">
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
