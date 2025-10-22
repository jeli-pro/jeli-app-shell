import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Settings,
  Component,
  Bell,
  Database,
  MessageSquare,
  SlidersHorizontal,
} from 'lucide-react';

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

export type ViewId = 
  | 'dashboard'
  | 'settings'
  | 'toaster'
  | 'notifications'
  | 'data-demo'
  | 'messaging'
  | 'dataItemDetail'
  | 'details';

export interface ViewRegistration {
  id: ViewId;
  component: React.ComponentType<any>;
  title: string;
  icon: LucideIcon;
  hasOwnScrolling?: boolean;
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
  },
  settings: {
    id: 'settings',
    component: suspenseWrapper(SettingsPage),
    title: 'Settings',
    icon: Settings,
  },
  toaster: {
    id: 'toaster',
    component: suspenseWrapper(ToasterDemo),
    title: 'Toaster Demo',
    icon: Component,
  },
  notifications: {
    id: 'notifications',
    component: suspenseWrapper(NotificationsPage),
    title: 'Notifications',
    icon: Bell,
  },
  'data-demo': {
    id: 'data-demo',
    component: suspenseWrapper(DataDemoPage),
    title: 'Data Showcase',
    icon: Database,
  },
  messaging: {
    id: 'messaging',
    component: suspenseWrapper(MessagingPage),
    title: 'Messaging',
    icon: MessageSquare,
    hasOwnScrolling: true,
  },
  dataItemDetail: {
    id: 'dataItemDetail',
    component: suspenseWrapper(DataDetailContent),
    title: 'Item Details',
    icon: Database,
    hasOwnScrolling: true,
  },
  details: {
    id: 'details',
    component: () => (
      <div className="p-6">
        <p className="text-muted-foreground">
          This is the side pane. It can be used to display contextual
          information, forms, or actions related to the main content.
        </p>
      </div>
    ),
    title: 'Details Panel',
    icon: SlidersHorizontal,
  },
};

export const getViewById = (id: string | null | undefined): ViewRegistration | null => {
  if (!id) return null;
  return viewRegistry[id as ViewId] || null;
}