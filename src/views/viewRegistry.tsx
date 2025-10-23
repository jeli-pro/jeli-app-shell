import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Settings,
  Component,
  Bell,
  Database,
  SlidersHorizontal,
  FileText,
  Inbox,
} from 'lucide-react';
import type { BodyState, SidebarState } from '@/lib/utils';
import { SIDEBAR_STATES } from '@/lib/utils';

// --- Lazy load components for better code splitting ---
import React from 'react';

// Correctly typed lazy imports
const DashboardContent = React.lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.DashboardContent })));
const SettingsPage = React.lazy(() => import('@/pages/Settings').then(module => ({ default: module.SettingsPage })));
const ToasterDemo = React.lazy(() => import('@/pages/ToasterDemo').then(module => ({ default: module.ToasterDemo })));
const NotificationsPage = React.lazy(() => import('@/pages/Notifications').then(module => ({ default: module.NotificationsPage })));
const DataDemoPage = React.lazy(() => import('@/pages/DataDemo'));
const MessagingPage = React.lazy(() => import('@/pages/Messaging'));
const DataDetailContent = React.lazy(() => import('@/pages/DataDemo/components/DataDetailContent').then(module => ({ default: module.DataDetailContent })));
const MessagingContent = React.lazy(() => import('@/pages/Messaging/components/MessagingContent').then(module => ({ default: module.MessagingContent })));

export type ViewId = 
  | 'dashboard'
  | 'settings'
  | 'toaster'
  | 'notifications'
  | 'data-demo'
  | 'messaging'
  | 'dataItemDetail'
  | 'messagingPage'
  | 'messagingContextPanel';

export interface ViewRegistration {
  id: ViewId;
  component?: React.ComponentType<any>; // Component is optional for composite views
  title: string;
  icon: LucideIcon;
  hasOwnScrolling?: boolean;
  
  // New behavioral properties
  isNavigable?: boolean; // Can it be navigated to via URL and appear in menus?
  renderTarget?: ('main' | 'pane')[]; // Where can this view be rendered?
  allowedBodyStates?: BodyState[]; // What layouts can this view exist in?
  defaultBehavior?: 'navigate' | 'openPane' | 'openSplit'; // Default action when triggered without context
  triggerBehaviors?: Record<string, 'navigate' | 'openPane' | 'openSplit'>; // Context-aware actions
  compositeView?: { // For "app-within-an-app" layouts
    main: ViewId;
    right: ViewId;
  };
  onNavigate?: { // Side-effects on navigation
    sidebar?: SidebarState;
  };
}

const suspenseWrapper = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (props: any) => (
  <React.Suspense fallback={<div className="p-6">Loading...</div>}>
    <Component {...props} />
  </React.Suspense>
);

export const viewRegistry: Record<ViewId, ViewRegistration> = {
  dashboard: {
    id: 'dashboard',
    component: suspenseWrapper(DashboardContent),
    title: 'Dashboard',
    icon: LayoutDashboard,
    isNavigable: true,
    renderTarget: ['main', 'pane'],
    allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
    defaultBehavior: 'navigate',
  },
  settings: {
    id: 'settings',
    component: suspenseWrapper(SettingsPage),
    title: 'Settings',
    icon: Settings,
    isNavigable: true,
    renderTarget: ['main', 'pane'],
    allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
    defaultBehavior: 'navigate',
    triggerBehaviors: {
      iconClick: 'openPane',
    },
  },
  toaster: {
    id: 'toaster',
    component: suspenseWrapper(ToasterDemo),
    title: 'Toaster Demo',
    icon: Component,
    isNavigable: true,
    renderTarget: ['main', 'pane'],
    allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
    defaultBehavior: 'navigate',
  },
  notifications: {
    id: 'notifications',
    component: suspenseWrapper(NotificationsPage),
    title: 'Notifications',
    icon: Bell,
    isNavigable: true,
    renderTarget: ['main', 'pane'],
    allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
    defaultBehavior: 'navigate',
    triggerBehaviors: {
      navClick: 'openPane',
    },
  },
  'data-demo': {
    id: 'data-demo',
    component: suspenseWrapper(DataDemoPage),
    title: 'Data Showcase',
    icon: Database,
    isNavigable: true,
    renderTarget: ['main'],
    allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
    defaultBehavior: 'navigate',
  },
  messaging: {
    id: 'messaging',
    isNavigable: true,
    title: 'Messaging',
    icon: Inbox,
    renderTarget: [], // It doesn't render a component itself
    allowedBodyStates: ['split_view', 'fullscreen'],
    defaultBehavior: 'navigate',
    compositeView: {
      main: 'messagingPage',
      right: 'messagingContextPanel',
    },
    onNavigate: { sidebar: SIDEBAR_STATES.COLLAPSED },
  },
  messagingPage: {
    id: 'messagingPage',
    component: suspenseWrapper(MessagingPage),
    title: 'Inbox',
    icon: Inbox, // icon is required, even if not shown
    isNavigable: false,
    renderTarget: ['main'],
    allowedBodyStates: ['split_view', 'fullscreen'],
    hasOwnScrolling: true,
  },
  messagingContextPanel: {
    id: 'messagingContextPanel',
    component: suspenseWrapper(MessagingContent),
    title: 'Task Details',
    icon: SlidersHorizontal, // icon is required
    isNavigable: false,
    renderTarget: ['pane'],
    allowedBodyStates: ['side_pane', 'split_view', 'fullscreen'],
  },
  dataItemDetail: {
    id: 'dataItemDetail',
    component: suspenseWrapper(DataDetailContent),
    title: 'Item Details',
    icon: FileText,
    isNavigable: false,
    renderTarget: ['main', 'pane'],
    allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
    defaultBehavior: 'openPane',
    hasOwnScrolling: true,
  },
};

export const getViewById = (id: string | null | undefined): ViewRegistration | null => {
  if (!id) return null;
  return viewRegistry[id as ViewId] || null;
}