# Directory Structure
```
src/
  components/
    auth/
      LoginPage.tsx
      useLoginForm.hook.ts
    effects/
      AnimatedInput.tsx
      BottomGradient.tsx
      BoxReveal.tsx
      OrbitingCircles.tsx
      Ripple.tsx
    global/
      CommandPalette.tsx
    layout/
      AppShell.tsx
      EnhancedSidebar.tsx
      MainContent.tsx
      RightPane.tsx
      Sidebar.tsx
      TopBar.tsx
      UserDropdown.tsx
      ViewModeSwitcher.tsx
      WorkspaceSwitcher.tsx
    shared/
      ContentInSidePanePlaceholder.tsx
      PageHeader.tsx
      PageLayout.tsx
      ScrollToBottomButton.tsx
      StatCard.tsx
    ui/
      animated-tabs.tsx
      avatar.tsx
      badge.tsx
      button.tsx
      card.tsx
      checkbox.tsx
      command.tsx
      dialog.tsx
      dropdown-menu.tsx
      input.tsx
      label.tsx
      popover.tsx
      tabs.tsx
      textarea.tsx
      toast.tsx
      tooltip.tsx
  features/
    settings/
      SettingsContent.tsx
      SettingsSection.tsx
      SettingsToggle.tsx
  hooks/
    useAppShellAnimations.hook.ts
    useAppViewManager.hook.ts
    useAutoAnimateTopBar.ts
    useCommandPaletteToggle.hook.ts
    usePageViewConfig.hook.ts
    usePaneDnd.hook.ts
    useResizablePanes.hook.ts
    useRightPaneContent.hook.tsx
    useScrollToBottom.hook.ts
    useStaggeredAnimation.motion.hook.ts
  lib/
    utils.ts
  pages/
    Dashboard/
      hooks/
        useDashboardAnimations.motion.hook.ts
      DemoContent.tsx
      index.tsx
    DataDemo/
      components/
        shared/
          AddDataItemCta.tsx
          DataItemParts.tsx
        AnimatedLoadingSkeleton.tsx
        DataCardView.tsx
        DataDetailActions.tsx
        DataDetailPanel.tsx
        DataListView.tsx
        DataTableView.tsx
        DataToolbar.tsx
        DataViewModeSelector.tsx
        EmptyState.tsx
      store/
        dataDemo.store.tsx
      index.tsx
      types.ts
    Messaging/
      components/
        ActivityFeed.tsx
        ActivityPanel.tsx
        AIInsightsPanel.tsx
        ChannelIcons.tsx
        ContactInfoPanel.tsx
        JourneyScrollbar.tsx
        MessagingContent.tsx
        NotesPanel.tsx
        TakeoverBanner.tsx
        TaskDetail.tsx
        TaskHeader.tsx
        TaskList.tsx
      data/
        mockData.ts
      store/
        messaging.store.ts
      index.tsx
      types.ts
    Notifications/
      index.tsx
      notifications.store.ts
    Settings/
      index.tsx
    ToasterDemo/
      index.tsx
  providers/
    AppShellProvider.tsx
  store/
    appShell.store.ts
    authStore.ts
  App.tsx
  index.css
  index.ts
  main.tsx
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

```

## File: src/components/auth/useLoginForm.hook.ts
```typescript
import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
⋮----
type LoginState = 'login' | 'forgot-password' | 'reset-sent';
⋮----
export function useLoginForm()
⋮----
const handleLoginSubmit = async (e: FormEvent) =>
⋮----
// In a real app, you'd show an error message to the user
setErrors({ email: 'Invalid credentials', password: ' ' }); // Add a generic error
⋮----
const handleForgotSubmit = async (e: FormEvent) =>
⋮----
const handleSignUp = () =>
⋮----
// In a real app, navigate to sign up page
```

## File: src/components/effects/AnimatedInput.tsx
```typescript
import React, { memo, forwardRef, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
⋮----
const handleMouseMove = (e: MouseEvent) =>
⋮----
const handleMouseEnter = () =>
⋮----
const handleMouseLeave = () =>
```

## File: src/components/effects/BottomGradient.tsx
```typescript
export const BottomGradient = () => (
	<>
		<span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
		<span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
	</>
);
```

## File: src/components/effects/BoxReveal.tsx
```typescript
import { ReactNode, useEffect, useRef, memo } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
⋮----
type BoxRevealProps = {
	children: ReactNode;
	width?: string;
	boxColor?: string;
	duration?: number;
	className?: string;
};
⋮----
<div ref=
```

## File: src/components/effects/OrbitingCircles.tsx
```typescript
import React, { ReactNode, memo } from 'react';
import { cn } from '@/lib/utils';
⋮----
className=
⋮----
{ component: () => <img width={30} height={30} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' alt='HTML5' />, className: 'size-[30px] border-none bg-transparent', duration: 20, delay: 20, radius: 100, path: false, reverse: false },
{ component: () => <img width={30} height={30} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' alt='CSS3' />, className: 'size-[30px] border-none bg-transparent', duration: 20, delay: 10, radius: 100, path: false, reverse: false },
{ component: () => <img width={50} height={50} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' alt='TypeScript' />, className: 'size-[50px] border-none bg-transparent', radius: 210, duration: 20, path: false, reverse: false },
{ component: () => <img width={50} height={50} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' alt='JavaScript' />, className: 'size-[50px] border-none bg-transparent', radius: 210, duration: 20, delay: 20, path: false, reverse: false },
{ component: () => <img width={30} height={30} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' alt='TailwindCSS' />, className: 'size-[30px] border-none bg-transparent', duration: 20, delay: 20, radius: 150, path: false, reverse: true },
{ component: () => <img width={30} height={30} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg' alt='Nextjs' />, className: 'size-[30px] border-none bg-transparent', duration: 20, delay: 10, radius: 150, path: false, reverse: true },
{ component: () => <img width={50} height={50} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' alt='React' />, className: 'size-[50px] border-none bg-transparent', radius: 270, duration: 20, path: false, reverse: true },
{ component: () => <img width={50} height={50} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' alt='Figma' />, className: 'size-[50px] border-none bg-transparent', radius: 270, duration: 20, delay: 60, path: false, reverse: true },
{ component: () => <img width={50} height={50} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' alt='Git' />, className: 'size-[50px] border-none bg-transparent', radius: 320, duration: 20, delay: 20, path: false, reverse: false },
```

## File: src/components/effects/Ripple.tsx
```typescript
import React, { memo } from 'react';
⋮----
interface RippleProps {
	mainCircleSize?: number;
	mainCircleOpacity?: number;
	numCircles?: number;
}
```

## File: src/components/shared/ContentInSidePanePlaceholder.tsx
```typescript
import { ChevronsLeftRight } from 'lucide-react'
⋮----
interface ContentInSidePanePlaceholderProps {
  icon: React.ElementType
  title: string
  pageName: string
  onBringBack: () => void
}
⋮----
export function ContentInSidePanePlaceholder({
  icon: Icon,
  title,
  pageName,
  onBringBack,
}: ContentInSidePanePlaceholderProps)
```

## File: src/components/shared/PageHeader.tsx
```typescript
interface PageHeaderProps {
  title: string;
  description: React.ReactNode;
  children?: React.ReactNode;
}
⋮----
export function PageHeader(
```

## File: src/components/shared/ScrollToBottomButton.tsx
```typescript
import { ArrowDown } from 'lucide-react';
⋮----
interface ScrollToBottomButtonProps {
  isVisible: boolean;
  onClick: () => void;
}
```

## File: src/components/shared/StatCard.tsx
```typescript
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
⋮----
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  chartData?: number[];
}
⋮----
// Only run animation if chartData is present
⋮----
// --- Chart rendering logic (only if chartData is provided) ---
const renderChart = () =>
⋮----
// SVG dimensions
⋮----
// Normalize data
⋮----
const y = height - ((val - min) / range) * (height - 10) + 5; // Add vertical padding
⋮----
// --- End of chart rendering logic ---
⋮----
!chartData && "h-full" // Ensure cards without charts have consistent height if needed
```

## File: src/components/ui/avatar.tsx
```typescript
import { cn } from "@/lib/utils"
```

## File: src/components/ui/card.tsx
```typescript
import { cn } from "@/lib/utils"
⋮----
className=
⋮----
<div ref=
```

## File: src/components/ui/checkbox.tsx
```typescript
import { Check } from "lucide-react"
⋮----
import { cn } from "@/lib/utils"
⋮----
className=
```

## File: src/components/ui/command.tsx
```typescript
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"
⋮----
import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"
⋮----
className=
```

## File: src/components/ui/dialog.tsx
```typescript
import { X } from "lucide-react"
⋮----
import { cn } from "@/lib/utils"
⋮----
className=
```

## File: src/components/ui/input.tsx
```typescript
import { cn } from "@/lib/utils"
⋮----
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}
⋮----
className=
```

## File: src/components/ui/label.tsx
```typescript
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/lib/utils"
```

## File: src/components/ui/tabs.tsx
```typescript
import { cn } from "@/lib/utils"
```

## File: src/components/ui/textarea.tsx
```typescript
import { cn } from "@/lib/utils"
⋮----
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
⋮----
className=
```

## File: src/components/ui/tooltip.tsx
```typescript
import { cn } from "@/lib/utils"
```

## File: src/features/settings/SettingsSection.tsx
```typescript
interface SettingsSectionProps {
  icon: React.ReactElement
  title: string
  children: React.ReactNode
}
⋮----
export function SettingsSection(
```

## File: src/features/settings/SettingsToggle.tsx
```typescript
import { cn } from '@/lib/utils'
⋮----
interface SettingsToggleProps {
  icon: React.ReactNode
  title: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}
```

## File: src/hooks/usePageViewConfig.hook.ts
```typescript
import { useEffect } from 'react';
import { useAppShellStore } from '@/store/appShell.store';
⋮----
interface PageViewConfig {
    sidePaneWidth?: number;
    splitPaneWidth?: number;
}
⋮----
/**
 * A hook for a page component to declaratively set its desired pane widths.
 * It sets the widths on mount and resets them to the application defaults on unmount.
 * @param {PageViewConfig} config - The desired widths for side pane and split view.
 */
export function usePageViewConfig(config: PageViewConfig)
⋮----
// Return a cleanup function to reset widths when the component unmounts
⋮----
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Run only once on mount and cleanup on unmount
```

## File: src/hooks/useScrollToBottom.hook.ts
```typescript
import { useState, useCallback } from 'react';
⋮----
export function useScrollToBottom(
  contentRef: React.RefObject<HTMLDivElement>
)
⋮----
// Show button if scrolled down more than 200px, and there's more than 200px left to scroll
⋮----
const scrollToBottom = () =>
```

## File: src/pages/DataDemo/components/shared/AddDataItemCta.tsx
```typescript
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
⋮----
interface AddDataItemCtaProps {
  viewMode: 'list' | 'cards' | 'grid' | 'table'
  colSpan?: number
}
```

## File: src/pages/DataDemo/components/DataDetailActions.tsx
```typescript
import { Button } from '@/components/ui/button';
import { ExternalLink, Share } from 'lucide-react';
⋮----
export function DataDetailActions()
```

## File: src/pages/DataDemo/components/EmptyState.tsx
```typescript
import { Eye } from 'lucide-react'
⋮----
export function EmptyState()
```

## File: src/pages/DataDemo/store/dataDemo.store.tsx
```typescript
import { create } from 'zustand';
import { type ReactNode } from 'react';
import { capitalize, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { mockDataItems } from '../data/mockData';
import type { DataItem, GroupableField, SortConfig } from '../types';
import type { FilterConfig } from '../components/DataToolbar';
⋮----
// --- State and Actions ---
interface DataDemoState {
    items: DataItem[];
    hasMore: boolean;
    isLoading: boolean;
    isInitialLoading: boolean;
    totalItemCount: number;
}
⋮----
interface DataDemoActions {
    loadData: (params: {
        page: number;
        groupBy: GroupableField | 'none';
        filters: FilterConfig;
        sortConfig: SortConfig | null;
    }) => void;
}
⋮----
// --- Store Implementation ---
⋮----
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNestedValue = (obj: DataItem, path: string): any
⋮----
// --- Selectors ---
```

## File: src/pages/Messaging/components/ActivityPanel.tsx
```typescript
import React from 'react';
import { format } from 'date-fns';
import { Mail, StickyNote, PhoneCall, Calendar } from 'lucide-react';
import type { Contact, ActivityEvent, ActivityEventType } from '../types';
⋮----
const ActivityItem = (
⋮----
interface ActivityPanelProps {
  contact: Contact;
}
```

## File: src/pages/Messaging/components/AIInsightsPanel.tsx
```typescript
import React from 'react';
import type { Task, Contact, Assignee } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Reply, ThumbsUp, ThumbsDown, Copy } from 'lucide-react';
import { toast } from 'sonner';
⋮----
interface AIInsightsPanelProps {
  task: (Task & { contact: Contact; assignee: Assignee | null });
}
⋮----
const handleCopy = (text: string) =>
```

## File: src/pages/Messaging/components/ChannelIcons.tsx
```typescript
import { Instagram, MessageCircle, Facebook } from 'lucide-react';
import type { Channel, ChannelIcon as ChannelIconType } from '../types';
import { cn } from '@/lib/utils';
⋮----
export const ChannelIcon: React.FC<
```

## File: src/pages/Messaging/components/ContactInfoPanel.tsx
```typescript
import React from 'react';
import { Mail, Phone, Briefcase } from 'lucide-react';
import type { Contact } from '../types';
⋮----
const DetailRow: React.FC<{icon: React.ReactNode, children: React.ReactNode}> = ({ icon, children }) => (
    <div className="flex items-start gap-3 text-sm">
        <div className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0">{icon}</div>
        <div className="flex-1 text-foreground/90 break-all">{children}</div>
    </div>
);
⋮----
interface ContactInfoPanelProps {
  contact: Contact;
}
⋮----
export const ContactInfoPanel: React.FC<ContactInfoPanelProps> = (
```

## File: src/pages/Messaging/components/NotesPanel.tsx
```typescript
import React from 'react';
import { format } from 'date-fns';
import { Send } from 'lucide-react';
import type { Contact } from '../types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
⋮----
interface NotesPanelProps {
  contact: Contact;
}
```

## File: src/pages/Messaging/components/TakeoverBanner.tsx
```typescript
import React from 'react';
import { Bot, UserCheck, Loader2 } from 'lucide-react';
import type { Assignee } from '../types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
⋮----
interface TakeoverBannerProps {
  activeHandler: Assignee;
  isRequesting: boolean;
  onTakeOver: () => void;
  onRequestTakeover: () => void;
}
```

## File: src/pages/Notifications/notifications.store.ts
```typescript
import { create } from 'zustand';
⋮----
// --- Types ---
export type Notification = {
  id: number;
  type: string;
  user: {
    name: string;
    avatar: string;
    fallback: string;
  };
  action: string;
  target?: string;
  content?: string;
  timestamp: string;
  timeAgo: string;
  isRead: boolean;
  hasActions?: boolean;
  file?: {
    name: string;
    size: string;
    type: string;
  };
};
⋮----
// --- State and Actions ---
type ActiveTab = 'all' | 'verified' | 'mentions';
⋮----
interface NotificationsState {
    notifications: Notification[];
    activeTab: ActiveTab;
}
⋮----
interface NotificationsActions {
    markAsRead: (id: number) => void;
    markAllAsRead: () => number; // Returns number of items marked as read
    setActiveTab: (tab: ActiveTab) => void;
}
⋮----
markAllAsRead: () => number; // Returns number of items marked as read
⋮----
// --- Store ---
⋮----
// --- Selectors ---
const selectNotifications = (state: NotificationsState)
const selectActiveTab = (state: NotificationsState)
⋮----
export const useFilteredNotifications = () => useNotificationsStore(state =>
⋮----
export const useNotificationCounts = () => useNotificationsStore(state =>
```

## File: src/components/layout/UserDropdown.tsx
```typescript
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react";
import { useAuthStore } from "@/store/authStore";
⋮----
// Interface for menu item for better type safety
interface MenuItem {
  value?: string;
  icon: string;
  label: string;
  action?: string;
  iconClass?: string;
  badge?: { text: string; className: string };
  rightIcon?: string;
  showAvatar?: boolean;
}
⋮----
interface User {
  name: string;
  username: string;
  avatar: string;
  initials: string;
  status: string;
}
⋮----
interface UserDropdownProps {
  user?: User;
  onAction?: (action?: string) => void;
  onStatusChange?: (status: string) => void;
  selectedStatus?: string;
  promoDiscount?: string;
}
⋮----
const handleAction = (action?: string) =>
⋮----
"px-3 py-2", // Consistent with base component
⋮----
className=
```

## File: src/components/layout/WorkspaceSwitcher.tsx
```typescript
import { CheckIcon, ChevronsUpDownIcon, Search } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	type PopoverContentProps,
} from '@/components/ui/popover';
⋮----
// Generic workspace interface - can be extended
export interface Workspace {
	id: string;
	name: string;
	logo?: string;
	plan?: string;
	[key: string]: unknown; // Allow additional properties
}
⋮----
[key: string]: unknown; // Allow additional properties
⋮----
// Context for workspace state management
interface WorkspaceContextValue<T extends Workspace> {
	open: boolean;
	setOpen: (open: boolean) => void;
	selectedWorkspace: T | undefined;
	workspaces: T[];
	onWorkspaceSelect: (workspace: T) => void;
	getWorkspaceId: (workspace: T) => string;
	getWorkspaceName: (workspace: T) => string;
}
⋮----
// eslint-disable-next-line @typescript-eslint/no-explicit-any
⋮----
function useWorkspaceContext<T extends Workspace>()
⋮----
// Main provider component
interface WorkspaceProviderProps<T extends Workspace> {
	children: React.ReactNode;
	workspaces: T[];
	selectedWorkspaceId?: string;
	onWorkspaceChange?: (workspace: T) => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	getWorkspaceId?: (workspace: T) => string;
	getWorkspaceName?: (workspace: T) => string;
}
⋮----
function WorkspaceProvider<T extends Workspace>({
	children,
	workspaces,
	selectedWorkspaceId,
	onWorkspaceChange,
	open: controlledOpen,
	onOpenChange,
	getWorkspaceId = (workspace) => workspace.id,
	getWorkspaceName = (workspace) => workspace.name,
}: WorkspaceProviderProps<T>)
⋮----
// Trigger component
interface WorkspaceTriggerProps extends React.ComponentProps<'button'> {
	renderTrigger?: (workspace: Workspace, isOpen: boolean) => React.ReactNode;
  collapsed?: boolean;
  avatarClassName?: string;
}
⋮----
className=
⋮----
<Avatar className=
⋮----
alt=
⋮----
// Content component
⋮----
key=
```

## File: src/components/ui/badge.tsx
```typescript
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/lib/utils"
⋮----
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}
⋮----
<div className=
⋮----
// eslint-disable-next-line react-refresh/only-export-components
```

## File: src/components/ui/button.tsx
```typescript
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/lib/utils"
⋮----
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
⋮----
// eslint-disable-next-line react-refresh/only-export-components
```

## File: src/components/ui/dropdown-menu.tsx
```typescript
import { Check, ChevronRight, Circle } from "lucide-react"
⋮----
import { cn } from "@/lib/utils"
⋮----
className=
```

## File: src/components/ui/popover.tsx
```typescript
import { cn } from "@/lib/utils"
⋮----
interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  useTriggerWidth?: boolean
}
```

## File: src/components/ui/toast.tsx
```typescript
import {
  forwardRef,
  useImperativeHandle,
  createContext,
  useContext,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
⋮----
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
⋮----
type Variant = "default" | "success" | "error" | "warning";
type Position =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
⋮----
interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost";
}
⋮----
export interface ToasterProps {
  title?: string;
  message: string;
  variant?: Variant;
  duration?: number;
  position?: Position;
  actions?: ActionButton;
  onDismiss?: () => void;
  highlightTitle?: boolean;
}
⋮----
export interface ToasterRef {
  show: (props: ToasterProps) => void;
}
⋮----
const handleDismiss = () =>
⋮----
className=
⋮----
show({
        title,
        message,
        variant = "default",
        duration = 4000,
        position = defaultPosition,
        actions,
        onDismiss,
        highlightTitle,
})
⋮----
// By removing `unstyled`, sonner handles positioning and animations.
// We then use `classNames` to override only the styles we don't want,
// allowing our custom component to define the appearance.
⋮----
toast: "p-0 border-none shadow-none bg-transparent", // Neutralize wrapper styles
// We can add specific styling to other parts if needed
// closeButton: '...',
⋮----
// The z-index is still useful as a safeguard
⋮----
// eslint-disable-next-line react-refresh/only-export-components
⋮----
export const ToasterProvider = (
```

## File: src/hooks/useCommandPaletteToggle.hook.ts
```typescript
import { useEffect } from 'react';
import { useAppShellStore } from '@/store/appShell.store';
⋮----
export function useCommandPaletteToggle()
⋮----
const down = (e: KeyboardEvent) =>
```

## File: src/hooks/usePaneDnd.hook.ts
```typescript
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppShellStore } from '@/store/appShell.store';
import { BODY_STATES } from '@/lib/utils';
⋮----
export function usePaneDnd()
```

## File: src/pages/DataDemo/components/shared/DataItemParts.tsx
```typescript
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn, getStatusColor, getPriorityColor } from '@/lib/utils'
import { Clock, Eye, Heart, Share } from 'lucide-react'
import type { DataItem } from '../../types'
⋮----
export function ItemStatusBadge(
⋮----
export function ItemPriorityBadge(
⋮----
export function AssigneeInfo({
  assignee,
  avatarClassName = "w-8 h-8",
}: {
  assignee: DataItem['assignee']
  avatarClassName?: string
})
⋮----
export function ItemMetrics(
```

## File: src/pages/Messaging/components/ActivityFeed.tsx
```typescript
import React, { forwardRef } from 'react';
import { useMessagingStore } from '../store/messaging.store';
import type { Message, Contact, Assignee } from '../types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { StickyNote, Info } from 'lucide-react';
⋮----
interface ActivityFeedProps {
  messages: Message[];
  contact: Contact;
}
⋮----
// Default: 'comment' type
```

## File: src/pages/Messaging/components/TaskHeader.tsx
```typescript
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
import { ChevronDown, Inbox, Zap, Shield, Clock, Calendar, Plus, User, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
⋮----
interface TaskHeaderProps {
  task: (Task & { contact: Contact; assignee: Assignee | null });
}
⋮----
const currentUserId = 'user-1'; // Mock current user
⋮----
{/* Task Title & Contact */}
⋮----
{/* Properties Bar */}
⋮----
{/* Assignee Dropdown */}
⋮----
{/* Status Dropdown */}
⋮----
{/* Priority Dropdown */}
⋮----
{/* Due Date - for display, could be a popover trigger */}
⋮----
{/* Tags */}
```

## File: src/providers/AppShellProvider.tsx
```typescript
import { useEffect, type ReactNode, type ReactElement } from 'react';
import { useAppShellStore } from '@/store/appShell.store';
⋮----
interface AppShellProviderProps {
  children: ReactNode;
  appName?: string;
  appLogo?: ReactElement;
  defaultSplitPaneWidth?: number;
}
⋮----
export function AppShellProvider(
⋮----
// Side effect for primary color
⋮----
// This effect is here because the store itself can't run side-effects on init
// before React has mounted. So we trigger it from the provider.
```

## File: src/store/authStore.ts
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
⋮----
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
⋮----
// Simulate API call
⋮----
// Mock authentication - in real app, validate with backend
⋮----
name: email.split('@')[0], // Simple name extraction
⋮----
// Simulate API call
⋮----
// In real app, send reset email via backend
```

## File: src/main.tsx
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
```

## File: tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
⋮----
].join(", "),
⋮----
addUtilities({
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

## File: src/components/shared/PageLayout.tsx
```typescript
import React from 'react';
import { cn } from '@/lib/utils';
import { useAppShellStore } from '@/store/appShell.store';
import { BODY_STATES } from '@/lib/utils';
⋮----
interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement>;
}
⋮----
className=
```

## File: src/hooks/useStaggeredAnimation.motion.hook.ts
```typescript
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAppShellStore } from '@/store/appShell.store';
⋮----
interface StaggeredAnimationOptions {
	stagger?: number;
	duration?: number;
	y?: number;
	scale?: number;
	ease?: string;
	mode?: 'full' | 'incremental';
}
⋮----
/**
 * Animates the direct children of a container element with a staggered fade-in effect.
 *
 * @param containerRef Ref to the container element.
 * @param deps Dependency array to trigger the animation.
 * @param options Animation options.
 * @param options.mode - 'full' (default): animates all children every time deps change.
 *                       'incremental': only animates new children added to the container.
 */
export function useStaggeredAnimation<T extends HTMLElement>(
	containerRef: React.RefObject<T>,
	deps: React.DependencyList,
	options: StaggeredAnimationOptions = {},
)
⋮----
// On dependency change, if the number of children is less than what we've animated,
// it's a list reset (e.g., filtering), so reset the counter.
⋮----
// eslint-disable-next-line react-hooks/exhaustive-deps
```

## File: src/lib/utils.ts
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
⋮----
export function cn(...inputs: ClassValue[])
⋮----
export type SidebarState = typeof SIDEBAR_STATES[keyof typeof SIDEBAR_STATES]
export type BodyState = typeof BODY_STATES[keyof typeof BODY_STATES]
⋮----
export function capitalize(str: string): string
⋮----
export const getStatusColor = (status: string) =>
⋮----
export const getPriorityColor = (priority: string) =>
```

## File: src/pages/Dashboard/hooks/useDashboardAnimations.motion.hook.ts
```typescript
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { useAppShellStore } from '@/store/appShell.store';
import { BODY_STATES } from '@/lib/utils';
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook';
⋮----
export function useDashboardAnimations(
  contentRef: React.RefObject<HTMLDivElement>,
  statsCardsContainerRef: React.RefObject<HTMLDivElement>,
  featureCardsContainerRef: React.RefObject<HTMLDivElement>,
)
⋮----
// Animate cards on mount
```

## File: src/pages/DataDemo/components/AnimatedLoadingSkeleton.tsx
```typescript
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ViewMode } from '../types'
⋮----
interface GridConfig {
  numCards: number
  cols: number
}
⋮----
const getGridConfig = (width: number): GridConfig =>
⋮----
if (width === 0) return { numCards: 8, cols: 2 }; // Default before measurement
⋮----
// For card view
⋮----
const cols = Math.max(1, Math.floor(width / 344)); // 320px card + 24px gap
⋮----
// For grid view
const cols = Math.max(1, Math.floor(width / 304)); // 280px card + 24px gap
⋮----
// Allow DOM to update with new skeleton cards
⋮----
const getCardPosition = (card: Element) =>
⋮----
// Animate to a few random cards
⋮----
// Loop back to the start
⋮----
}, 100) // Small delay to ensure layout is calculated
⋮----
className=
```

## File: src/pages/DataDemo/components/DataToolbar.tsx
```typescript
import { Check, ListFilter, Search, SortAsc } from 'lucide-react'
⋮----
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
⋮----
import type { SortableField, Status, Priority } from '../types'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
⋮----
export interface FilterConfig {
  searchTerm: string
  status: Status[]
  priority: Priority[]
}
⋮----
const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) =>
⋮----
{/* Left side: Search, Filters */}
⋮----
{/* Right side: Sorter */}
⋮----
const handleStatusSelect = (status: Status) =>
⋮----
const handlePrioritySelect = (priority: Priority) =>
```

## File: src/pages/DataDemo/types.ts
```typescript
export type ViewMode = 'list' | 'cards' | 'grid' | 'table'
⋮----
export type GroupableField = 'status' | 'priority' | 'category'
⋮----
export type SortableField = 'title' | 'status' | 'priority' | 'updatedAt' | 'assignee.name' | 'metrics.views' | 'metrics.completion' | 'createdAt'
export type SortDirection = 'asc' | 'desc'
export interface SortConfig {
  key: SortableField
  direction: SortDirection
}
⋮----
export interface DataItem {
  id: string
  title: string
  description: string
  category: string
  status: 'active' | 'pending' | 'completed' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee: {
    name: string
    avatar: string
    email: string
  }
  metrics: {
    views: number
    likes: number
    shares: number
    completion: number
  }
  tags: string[]
  createdAt: string
  updatedAt: string
  dueDate?: string
  thumbnail?: string
  content?: {
    summary: string
    details: string
    attachments?: Array<{
      name: string
      type: string
      size: string
      url: string
    }>
  }
}
⋮----
export interface ViewProps {
  data: DataItem[] | Record<string, DataItem[]>
  onItemSelect: (item: DataItem) => void
  selectedItem: DataItem | null
  isGrid?: boolean

  // Props for table view specifically
  sortConfig?: SortConfig | null
  onSort?: (field: SortableField) => void
}
⋮----
// Props for table view specifically
⋮----
export type Status = DataItem['status']
export type Priority = DataItem['priority']
```

## File: src/pages/Settings/index.tsx
```typescript
import { SettingsContent } from '@/features/settings/SettingsContent';
import { useAutoAnimateTopBar } from '@/hooks/useAutoAnimateTopBar';
import { PageHeader } from '@/components/shared/PageHeader';
import { PageLayout } from '@/components/shared/PageLayout';
⋮----
export function SettingsPage()
⋮----
{/* Header */}
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

## File: vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'
import { resolve } from 'path'
import pkg from './package.json' with { type: 'json' }
⋮----
// https://vitejs.dev/config/
⋮----
// make sure to externalize deps that shouldn't be bundled
// into your library
⋮----
// Provide global variables to use in the UMD build
// for externalized deps
```

## File: src/components/ui/animated-tabs.tsx
```typescript
import React, { useState, useRef, useEffect, useLayoutEffect, useId } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"
⋮----
interface Tab {
  id: string
  label: React.ReactNode
}
⋮----
interface AnimatedTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void,
  size?: 'default' | 'sm',
  children?: React.ReactNode,
  wrapperClassName?: string,
  contentClassName?: string
}
⋮----
// Update active index when controlled prop changes
⋮----
// Update active indicator position
⋮----
// Animate content track position
⋮----
// Set initial position of active indicator
⋮----
{/* Active Indicator */}
⋮----
{/* Tabs */}
```

## File: src/features/settings/SettingsContent.tsx
```typescript
import { useState } from 'react'
import { 
  Moon, 
  Sun, 
  Zap, 
  Eye, 
  Minimize2, 
  RotateCcw,
  Monitor,
  Smartphone,
  Palette,
  Accessibility,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppShellStore } from '@/store/appShell.store'
import { SettingsToggle } from './SettingsToggle'
import { SettingsSection } from './SettingsSection'
⋮----
const handleSidebarWidthChange = (width: number) =>
⋮----
const handleReset = () =>
⋮----
setTempSidebarWidth(280); // Reset temp state as well
⋮----
const handleSetSidebarWidth = (payload: number) =>
⋮----
{/* Appearance */}
⋮----
{/* Dark Mode */}
⋮----
{/* Compact Mode */}
⋮----
{/* Accent Color */}
⋮----
{/* Behavior */}
⋮----
{/* Auto Expand Sidebar */}
⋮----
{/* Sidebar Width */}
⋮----
onChange=
⋮----
{/* Accessibility */}
⋮----
{/* Reduced Motion */}
⋮----
{/* Presets */}
⋮----
// Custom slider styles
⋮----
// Inject styles
```

## File: src/pages/Messaging/components/MessagingContent.tsx
```typescript
import React, { useState, useMemo } from 'react';
import { useMessagingStore } from '../store/messaging.store';
import { ContactInfoPanel } from './ContactInfoPanel';
import { AIInsightsPanel } from './AIInsightsPanel';
import { ActivityPanel } from './ActivityPanel';
import { NotesPanel } from './NotesPanel';
import { TaskHeader } from './TaskHeader';
import { AnimatedTabs } from '@/components/ui/animated-tabs';
import { TechOrbitDisplay } from '@/components/effects/OrbitingCircles';
⋮----
interface MessagingContentProps {
  conversationId?: string;
}
```

## File: src/pages/Messaging/components/TaskList.tsx
```typescript
import { useEffect } from 'react';
import { Search, SlidersHorizontal, Check, Inbox, Clock, Zap, Shield, Eye } from 'lucide-react';
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
import type { TaskStatus, TaskPriority, TaskView } from '../types';
import { useAppViewManager } from '@/hooks/useAppViewManager.hook';
⋮----
// Local helpers for styling based on task properties
const getStatusIcon = (status: TaskStatus) =>
⋮----
const getPriorityIcon = (priority: TaskPriority) =>
⋮----
const { conversationId } = useParams<{ conversationId: string }>(); // This will be taskId later
⋮----
{/* Header */}
⋮----
onTabChange=
⋮----
{/* Task List */}
⋮----
className=
⋮----
// Filter component for popover
⋮----
const handleSelect = (type: 'status' | 'priority' | 'assigneeId' | 'tags', value: string) =>
```

## File: src/index.css
```css
@layer base {
⋮----
:root {
⋮----
.dark {
⋮----
* {
⋮----
@apply border-border;
⋮----
body {
⋮----
/* Custom scrollbar styles */
::-webkit-scrollbar {
⋮----
::-webkit-scrollbar-track {
⋮----
@apply bg-transparent;
⋮----
::-webkit-scrollbar-thumb {
⋮----
::-webkit-scrollbar-thumb:hover {
⋮----
/* For UserDropdown */
.no-scrollbar::-webkit-scrollbar {
.no-scrollbar {
⋮----
-ms-overflow-style: none; /* IE and Edge */
scrollbar-width: none; /* Firefox */
⋮----
.login-page-theme {
⋮----
.dark .login-page-theme {
⋮----
@layer components {
⋮----
.g-button {
```

## File: src/pages/Messaging/data/mockData.ts
```typescript
import type { Contact, Task, Message, ActivityEvent, Note, Assignee, TaskStatus, TaskPriority, Channel, JourneyPointType } from '../types';
import { faker } from '@faker-js/faker';
⋮----
// --- ASSIGNEES ---
⋮----
// --- HELPERS ---
const generateNotes = (contactName: string): Note[]
⋮----
const generateActivity = (contactName: string): ActivityEvent[]
⋮----
// --- CONTACTS ---
⋮----
// --- MESSAGE GENERATOR ---
const generateMessages = (messageCount: number, contactName: string, journeyPath: JourneyPointType[]): Message[] =>
⋮----
if (random > 0.85) { // Internal Note
⋮----
} else if (random > 0.7) { // System message
⋮----
} else if (random > 0.35) { // User comment
⋮----
userId = 'user-1'; // "You"
⋮----
// Ensure the last message is from the contact for preview purposes
⋮----
// --- TASK GENERATOR ---
const generateTasks = (count: number): Task[] =>
⋮----
get lastActivity()
```

## File: src/pages/ToasterDemo/index.tsx
```typescript
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { PageHeader } from '@/components/shared/PageHeader';
import { PageLayout } from '@/components/shared/PageLayout';
import { useAppShellStore } from '@/store/appShell.store';
import { cn, BODY_STATES } from '@/lib/utils';
⋮----
type Variant = 'default' | 'success' | 'error' | 'warning';
type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';
⋮----
const DemoSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section>
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    {children}
  </section>
);
⋮----
const showToast = (variant: Variant, position: Position = 'bottom-right') =>
⋮----
const simulateApiCall = async () =>
⋮----
{/* Header */}
```

## File: src/components/layout/Sidebar.tsx
```typescript
import { ChevronDown } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';
import { useAppShellStore } from '@/store/appShell.store';
import { SIDEBAR_STATES } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
⋮----
// --- Context ---
interface SidebarContextValue {
  isCollapsed: boolean;
  isPeek: boolean;
  compactMode: boolean;
}
⋮----
// eslint-disable-next-line react-refresh/only-export-components
export const useSidebar = () =>
⋮----
// --- Main Sidebar Component ---
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
⋮----
className=
⋮----
// --- Sidebar Content Wrapper ---
⋮----
// --- Sidebar Header ---
⋮----
// --- Sidebar Body ---
⋮----
// --- Sidebar Footer ---
⋮----
// --- Sidebar Section ---
⋮----
const handleToggle = () =>
⋮----
// --- Sidebar Menu Item ---
⋮----
return <div ref=
⋮----
// --- Sidebar Menu Button ---
⋮----
// --- Sidebar Menu Action ---
⋮----
'focus:opacity-100', // show on focus for accessibility
⋮----
// --- Sidebar Menu Label ---
⋮----
// --- Sidebar Menu Badge ---
⋮----
// --- Sidebar Tooltip ---
interface SidebarTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  badge?: number | string;
}
⋮----
// --- Icon Wrapper for consistent sizing ---
const SidebarIcon = (
```

## File: src/hooks/useRightPaneContent.hook.tsx
```typescript
import { useMemo, useCallback } from 'react';
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
⋮----
import { DashboardContent } from "@/pages/Dashboard";
import { SettingsContent } from "@/features/settings/SettingsContent";
import { ToasterDemo } from "@/pages/ToasterDemo";
import { NotificationsPage } from "@/pages/Notifications";
import DataDemoPage from "@/pages/DataDemo";
import { DataDetailPanel } from "@/pages/DataDemo/components/DataDetailPanel";
import { mockDataItems } from "@/pages/DataDemo/data/mockData";
import { MessagingContent } from "@/pages/Messaging/components/MessagingContent";
import type { AppShellState } from '@/store/appShell.store';
```

## File: src/pages/Messaging/components/JourneyScrollbar.tsx
```typescript
import React, { useState, useLayoutEffect, useRef, useCallback } from 'react';
import type { Message, JourneyPointType } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { gsap } from 'gsap';
import { MessageSquare, ShoppingCart, PackageCheck, AlertCircle, RefreshCw, MailQuestion, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
⋮----
interface JourneyScrollbarProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  journeyPoints: Message[];
  onDotClick: (messageId: string) => void;
  onHoverChange?: (isHovering: boolean) => void;
  showAllTooltips?: boolean;
}
⋮----
// Calculate proportional thumb height, but cap it at 10% of the container height
// to prevent it from looking too long. A minimum of 20px is enforced for usability.
⋮----
// Active journey point logic
⋮----
const handleScroll = () =>
⋮----
const MIN_DOT_SPACING = 32; // Corresponds to h-8 in Tailwind
⋮----
const checkOverflow = () =>
⋮----
{/* Track Line */}
⋮----
{/* Thumb */}
⋮----
{/* Journey Dots */}
⋮----
// This container is click-through so the thumb and track can be interactive.
// Individual dots will re-enable pointer events for themselves.
⋮----
// Dots are on top of the thumb and are clickable.
```

## File: src/pages/Messaging/components/TaskDetail.tsx
```typescript
import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMessagingStore } from '../store/messaging.store';
import { ActivityFeed } from './ActivityFeed';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, SendHorizontal, Smile, StickyNote } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TakeoverBanner } from './TakeoverBanner';
import { useToast } from '@/components/ui/toast';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { useAppShellStore } from '@/store/appShell.store';
import { JourneyScrollbar } from './JourneyScrollbar';
⋮----
// In a real app, this would come from the auth store
⋮----
// On conversation change, scroll to the bottom of the message list.
// This ensures the user sees the latest message and that the scrollbar
// component has the correct scrollHeight to calculate its visibility.
⋮----
const initialBorderWidth = '1px'; // from 'border-t'
const initialPadding = '1rem';    // from 'p-4'
⋮----
maxHeight: 500, // Ample room for the input
⋮----
const handleDotClick = (messageId: string) =>
⋮----
// Using 'center' to avoid the message being at the very top/bottom of the view
⋮----
const handleTakeOver = () =>
⋮----
const handleRequestTakeover = () =>
⋮----
className=
⋮----
{/* Input Form */}
```

## File: src/pages/Notifications/index.tsx
```typescript
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { 
  CheckCheck, 
  Download, 
  Settings, 
  Bell,
  MessageSquare,
  UserPlus,
  Mail,
  File as FileIcon,
  Heart,
  AtSign,
  ClipboardCheck,
  ShieldCheck,
} from "lucide-react";
import { useAppShellStore } from "@/store/appShell.store";
import { BODY_STATES } from "@/lib/utils";
⋮----
import { PageLayout } from "@/components/shared/PageLayout";
import { 
  useNotificationsStore,
  useFilteredNotifications,
  useNotificationCounts,
  type Notification
} from "./notifications.store";
⋮----
const handleMarkAllAsRead = () =>
⋮----
<Tabs value=
```

## File: src/components/auth/LoginPage.tsx
```typescript
import { ChangeEvent } from 'react';
import { Eye, EyeOff, Mail, ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { AnimatedInput } from '../effects/AnimatedInput';
import { BoxReveal } from '../effects/BoxReveal';
import { Ripple } from '../effects/Ripple';
import { TechOrbitDisplay } from '../effects/OrbitingCircles';
import { BottomGradient } from '../effects/BottomGradient';
import { useLoginForm } from './useLoginForm.hook';
⋮----
// ==================== Main LoginPage Component ====================
⋮----
{/* Left Side */}
⋮----
{/* Right Side */}
```

## File: src/hooks/useAutoAnimateTopBar.ts
```typescript
import { useRef, useCallback, useEffect } from 'react';
import { useAppShellStore } from '@/store/appShell.store';
import { BODY_STATES } from '@/lib/utils';
⋮----
export function useAutoAnimateTopBar(isPane = false)
⋮----
// Clear previous timeout
⋮----
// Set new timeout to show top bar when scrolling stops
⋮----
// Don't hide, just ensure it's visible after scrolling stops
// and we are not at the top of the page.
⋮----
}, 250); // Adjust timeout as needed
⋮----
// Cleanup on unmount
```

## File: src/pages/DataDemo/components/DataDetailPanel.tsx
```typescript
import React, { useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Clock, 
  Download,
  FileText,
  Image,
  Video,
  File,
  Tag,
  User,
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Circle
} from 'lucide-react'
import type { DataItem } from '../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import {
  AssigneeInfo,
  ItemProgressBar,
  ItemPriorityBadge,
  ItemTags,
} from './shared/DataItemParts'
import { DataDetailActions } from './DataDetailActions'
interface DataDetailPanelProps {
  item: DataItem | null
  onClose: () => void
}
⋮----
const getFileIcon = (type: string) =>
⋮----
const getStatusIcon = (status: string) =>
⋮----
{/* Header */}
⋮----
{/* Status badges */}
⋮----
{/* Progress */}
⋮----
{/* Content */}
⋮----
{/* Assignee Info */}
⋮----
{/* Metrics */}
⋮----
{/* Tags */}
⋮----
{/* Content Details */}
⋮----
{/* Attachments */}
⋮----
{/* Timeline */}
⋮----

⋮----
{/* Footer Actions */}
```

## File: src/pages/DataDemo/components/DataViewModeSelector.tsx
```typescript
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { List, Grid3X3, LayoutGrid, Table } from 'lucide-react'
import type { ViewMode } from '../types'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
⋮----
// Set position immediately without animation for initial load
⋮----
// Initial setup - set position immediately without animation
⋮----
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []) // Only run once on mount
⋮----
const handleMouseEnter = () =>
⋮----
// Wait for expand animation to complete
⋮----
const handleMouseLeave = () =>
⋮----
// Wait for collapse animation to complete
⋮----
{/* Animated indicator */}
⋮----
{/* Mode buttons */}
⋮----
{/* Label with smooth expand/collapse */}
```

## File: src/pages/Messaging/store/messaging.store.ts
```typescript
import { create } from 'zustand';
import { mockTasks, mockContacts, mockAssignees } from '../data/mockData';
import type { Task, Contact, Channel, Assignee, TaskStatus, TaskPriority, TaskView, Message, JourneyPointType } from '../types';
⋮----
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
⋮----
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
  getAvailableTags: () => string[];
}
⋮----
// Simulate a 2-second delay for the other user to "approve"
```

## File: src/pages/Messaging/types.ts
```typescript
import type { LucideIcon } from "lucide-react";
⋮----
export type Channel = 'whatsapp' | 'instagram' | 'facebook' | 'email';
⋮----
export interface ChannelIcon {
  Icon: LucideIcon;
  color: string;
}
⋮----
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
⋮----
export interface Assignee {
  id: string;
  name: string;
  avatar: string;
  type: 'human' | 'ai';
}
⋮----
export type ActivityEventType = 'note' | 'call' | 'email' | 'meeting';
⋮----
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
⋮----
export type JourneyPointType = 'Consult' | 'Order' | 'Delivered' | 'Complain' | 'Reorder' | 'Follow-up';
⋮----
export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'contact' | 'system';
  type: 'comment' | 'note' | 'system';
  read: boolean;
  userId?: string; // for notes or system messages from users
  journeyPoint?: JourneyPointType;
}
⋮----
userId?: string; // for notes or system messages from users
⋮----
export interface AISummary {
  sentiment: 'positive' | 'negative' | 'neutral';
  summaryPoints: string[];
  suggestedReplies: string[];
}
⋮----
export type TaskStatus = 'open' | 'in-progress' | 'done' | 'snoozed';
export type TaskPriority = 'none' | 'low' | 'medium' | 'high';
⋮----
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
  activeHandlerId: string | null;
  takeoverRequested?: boolean;
}
⋮----
export type TaskView = 'all_open' | 'unassigned' | 'done';
```

## File: src/components/global/CommandPalette.tsx
```typescript
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { useCommandPaletteToggle } from '@/hooks/useCommandPaletteToggle.hook'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook';
import { useAppShellStore } from '@/store/appShell.store';
import { Home, Settings, Moon, Sun, Monitor, Smartphone, PanelRight, Maximize, Component, Bell } from 'lucide-react'
⋮----
const runCommand = (command: () => void) =>
```

## File: src/pages/Dashboard/DemoContent.tsx
```typescript
import React, { useRef } from 'react'
import { 
  Sparkles, 
  Zap, 
  Rocket, 
  Star, 
  Heart,
  Layers,
  Code,
  Palette,
  Smartphone,
  Monitor,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppShellStore } from '@/store/appShell.store'
import { Card } from '@/components/ui/card'
⋮----
{/* Hero Section */}
⋮----
{/* Quick Stats */}
⋮----
<div className=
⋮----
{/* Feature Cards */}
⋮----
{/* Technology Stack */}
⋮----
{/* Current State Display */}
⋮----
{/* Interactive Demo */}
```

## File: src/pages/Messaging/index.tsx
```typescript
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { TaskList } from "./components/TaskList";
import { TaskDetail } from "./components/TaskDetail";
import { cn } from "@/lib/utils";
⋮----
const useResizableMessagingPanes = (
  containerRef: React.RefObject<HTMLDivElement>,
  initialWidth: number = 320
) =>
⋮----
const handleMouseMove = (e: MouseEvent) =>
⋮----
// Constraints for the conversation list pane
⋮----
const handleMouseUp = () =>
⋮----
className=
```

## File: src/hooks/useAppViewManager.hook.ts
```typescript
import { useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAppShellStore, type AppShellState, type ActivePage } from '@/store/appShell.store';
import type { DataItem, ViewMode, SortConfig, SortableField, GroupableField, Status, Priority } from '@/pages/DataDemo/types';
import type { FilterConfig } from '@/pages/DataDemo/components/DataToolbar';
import type { TaskView } from '@/pages/Messaging/types';
import { BODY_STATES, SIDEBAR_STATES } from '@/lib/utils';
⋮----
function usePrevious<T>(value: T): T | undefined
⋮----
/**
 * A centralized hook to manage and synchronize all URL-based view states.
 * This is the single source of truth for view modes, side panes, split views,
 * and page-specific parameters.
 */
export function useAppViewManager()
⋮----
// --- DERIVED STATE FROM URL ---
⋮----
// 1. Priority: Explicit side pane overlay via URL param
⋮----
// 2. Data item detail view (can be overlay or split)
⋮----
// 3. Messaging conversation view (always split)
⋮----
// 4. Generic split view via URL param
⋮----
// --- SIDE EFFECTS ---
⋮----
// On navigating to messaging page, collapse sidebar if it's expanded.
// This ensures a good default view but allows the user to expand it again if they wish.
⋮----
// DataDemo specific state
⋮----
if (!sortParam) return { key: 'updatedAt', direction: 'desc' }; // Default sort
⋮----
// --- MUTATOR ACTIONS ---
⋮----
} else { // From normal
⋮----
} else { // Closing main pane
⋮----
// DataDemo actions
const setViewMode = (mode: ViewMode) => handleParamsChange(
const setGroupBy = (val: string) => handleParamsChange(
const setActiveGroupTab = (tab: string) => handleParamsChange(
const setFilters = (newFilters: FilterConfig) =>
const setSort = (config: SortConfig | null) =>
const setTableSort = (field: SortableField) =>
const setPage = (newPage: number) => handleParamsChange(
⋮----
const setMessagingView = (view: TaskView) => handleParamsChange(
⋮----
// State
⋮----
// DataDemo State
⋮----
// Actions
⋮----
// DataDemo Actions
```

## File: src/index.ts
```typescript
// Context
⋮----
// Layout Components
⋮----
// Sidebar Primitives
⋮----
// Shared Components
⋮----
// Feature Components
⋮----
// UI Components
⋮----
// Effects Components
⋮----
// Global Components
⋮----
// Hooks
⋮----
// Lib
⋮----
// Store
```

## File: src/components/layout/MainContent.tsx
```typescript
import { forwardRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils';
import { BODY_STATES } from '@/lib/utils'
import { useAppShellStore } from '@/store/appShell.store'
⋮----
interface MainContentProps {
  children?: React.ReactNode;
}
⋮----
className=
```

## File: src/hooks/useResizablePanes.hook.ts
```typescript
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAppShellStore } from '@/store/appShell.store';
import { BODY_STATES } from '@/lib/utils';
⋮----
export function useResizableSidebar(
  sidebarRef: React.RefObject<HTMLDivElement>,
  resizeHandleRef: React.RefObject<HTMLDivElement>
)
⋮----
const handleMouseMove = (e: MouseEvent) =>
⋮----
const handleMouseUp = () =>
⋮----
export function useResizableRightPane(
  rightPaneRef: React.RefObject<HTMLDivElement>
)
⋮----
// This effect temporarily disables animations during resizing to prevent the
// pane's enter/exit animation from firing incorrectly.
⋮----
// When resizing starts, store the original setting and disable animations.
⋮----
// When resizing ends, restore the original setting after a brief delay.
// This ensures the final width is rendered before animations are re-enabled.
⋮----
// Use requestAnimationFrame to ensure we re-enable animations *after* the browser
// has painted the new, non-animated pane width. This is more reliable than setTimeout(0).
```

## File: src/pages/DataDemo/components/DataListView.tsx
```typescript
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import type { DataItem } from '../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import { EmptyState } from './EmptyState'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import { 
  useSelectedItem,
} from '../store/dataDemo.store'
import {
  AssigneeInfo,
  ItemMetrics,
  ItemProgressBar,
  ItemStatusBadge,
  ItemPriorityBadge,
  ItemDateInfo,
} from './shared/DataItemParts'
import { AddDataItemCta } from './shared/AddDataItemCta'
⋮----
{/* Thumbnail */}
⋮----
{/* Content */}
⋮----
{/* Badges */}
⋮----
{/* Meta info */}
⋮----
{/* Assignee */}
⋮----
{/* Date */}
⋮----
{/* Metrics */}
⋮----
{/* Progress bar */}
⋮----
{/* Hover gradient overlay */}
```

## File: src/store/appShell.store.ts
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type ReactElement } from 'react';
import { SIDEBAR_STATES, BODY_STATES, type SidebarState, type BodyState } from '@/lib/utils';
⋮----
export type ActivePage = 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo' | 'messaging';
⋮----
// --- State and Action Types ---
⋮----
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
⋮----
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
⋮----
// Initialization
⋮----
// Direct state setters
⋮----
// Composite actions
⋮----
// If we're leaving fullscreen, reset the target and previous state
⋮----
// Preserve props passed to provider and session defaults
⋮----
// Also reset current widths to the defaults
⋮----
// Add a selector for the derived rightPaneWidth
export const useRightPaneWidth = ()
```

## File: src/pages/Dashboard/index.tsx
```typescript
import { useRef, useCallback } from 'react'
import {
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Calendar,
  Clock,
  MessageSquare,
  FileText,
  Star,
  ChevronRight,
  MoreVertical
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DemoContent } from './DemoContent';
import { useDashboardAnimations } from './hooks/useDashboardAnimations.motion.hook'
import { useAutoAnimateTopBar } from '@/hooks/useAutoAnimateTopBar';
import { useScrollToBottom } from '@/hooks/useScrollToBottom.hook';
import { useAppShellStore } from '@/store/appShell.store'
import { BODY_STATES } from '@/lib/utils'
import { PageHeader } from '@/components/shared/PageHeader';
import { ScrollToBottomButton } from '@/components/shared/ScrollToBottomButton';
import { StatCard } from '@/components/shared/StatCard';
import { Card } from '@/components/ui/card';
import { PageLayout } from '@/components/shared/PageLayout';
⋮----
interface StatsCard {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ReactNode
}
⋮----
interface ActivityItem {
  id: string
  type: 'comment' | 'file' | 'meeting' | 'task'
  title: string
  description: string
  time: string
  user: string
}
⋮----
const getTypeIcon = (type: ActivityItem['type']) =>
⋮----
{/* Header */}
⋮----
{/* Stats Cards */}
⋮----
{/* Demo Content */}
⋮----
{/* Main Content Grid */}
⋮----
{/* Chart Area */}
⋮----
{/* Analytics Chart */}
⋮----
{/* Mock Chart */}
⋮----
{/* Recent Projects */}
⋮----
{/* Sidebar Content */}
⋮----
{/* Quick Actions */}
⋮----
<div className=
⋮----
{/* Recent Activity */}
```

## File: src/pages/DataDemo/components/DataTableView.tsx
```typescript
import { useRef, useLayoutEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  ExternalLink
} from 'lucide-react'
import type { DataItem, SortableField } from '../types'
import { EmptyState } from './EmptyState'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import {
  useSelectedItem,
} from '../store/dataDemo.store'
import { capitalize } from '@/lib/utils'
import {
  AssigneeInfo,
  ItemMetrics,
  ItemStatusBadge,
  ItemPriorityBadge,
  ItemDateInfo,
  ItemProgressBar,
} from './shared/DataItemParts'
import { AddDataItemCta } from './shared/AddDataItemCta'
⋮----
// Only select item rows for animation, not group headers
⋮----
const SortIcon = (
⋮----
const handleSortClick = (field: SortableField) =>
⋮----
<h3 className="font-semibold text-sm">
⋮----
{/* Project Column */}
⋮----
{/* Status Column */}
⋮----
{/* Priority Column */}
⋮----
{/* Assignee Column */}
⋮----
{/* Progress Column */}
{/* Note: This progress bar is custom for the table, so we don't use the shared component here. */}
⋮----
{/* Engagement Column */}
⋮----
{/* Date Column */}
⋮----
{/* Actions Column */}
⋮----
e.stopPropagation()
onItemSelect(item)
```

## File: src/pages/DataDemo/components/DataCardView.tsx
```typescript
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight } from 'lucide-react'
import type { DataItem } from '../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import { EmptyState } from './EmptyState'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import {
  useSelectedItem,
} from '../store/dataDemo.store'
import {
  AssigneeInfo,
  ItemMetrics,
  ItemProgressBar,
  ItemStatusBadge,
  ItemTags,
  ItemDateInfo,
} from './shared/DataItemParts'
import { AddDataItemCta } from './shared/AddDataItemCta'
⋮----
{/* Card Header with Thumbnail */}
⋮----
{/* Priority indicator */}
⋮----
{/* Card Content */}
⋮----
{/* Title and Description */}
⋮----
{/* Status and Category */}
⋮----
{/* Tags */}
⋮----
{/* Progress */}
⋮----
{/* Assignee */}
⋮----
{/* Metrics */}
⋮----
{/* Hover gradient overlay */}
⋮----
{/* Selection indicator */}
```

## File: src/components/layout/ViewModeSwitcher.tsx
```typescript
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils'
import { useAppShellStore, type AppShellState } from '@/store/appShell.store'
import { BODY_STATES } from '@/lib/utils'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import {
  Columns,
  PanelRightOpen,
  SplitSquareHorizontal,
  Maximize,
  Minimize,
  Layers,
  X,
  ArrowLeftRight
} from 'lucide-react'
⋮----
(!pane && !fullscreenTarget) // Global switcher, global fullscreen
⋮----
width: 32, // h-8 w-8
⋮----
marginLeft: 4, // from gap-1 in original
⋮----
}, [isExpanded, bodyState]); // re-run if bodyState changes to recalc buttons
⋮----
const handlePaneClick = (type: 'side-pane' | 'split-view') =>
⋮----
const handleNormalViewClick = () =>
⋮----
className=
```

## File: src/components/layout/TopBar.tsx
```typescript
import React from 'react';
import {
  Moon, 
  Sun,
  Settings,
  Command,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BODY_STATES } from '@/lib/utils'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import { UserDropdown } from './UserDropdown'
import { ViewModeSwitcher } from './ViewModeSwitcher'
import { useAppShellStore } from '@/store/appShell.store'
⋮----
interface TopBarProps {
  breadcrumbs?: React.ReactNode
  pageControls?: React.ReactNode
}
⋮----
{/* Left Section - Sidebar Controls & Breadcrumbs */}
⋮----
{/* Right Section - page controls, and global controls */}
⋮----
{/* Separator */}
⋮----
{/* Quick Actions */}
⋮----
{/* Theme and Settings */}
```

## File: src/hooks/useAppShellAnimations.hook.ts
```typescript
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useSearchParams } from 'react-router-dom';
import { useAppShellStore, useRightPaneWidth } from '@/store/appShell.store';
import { SIDEBAR_STATES, BODY_STATES } from '@/lib/utils';
⋮----
function usePrevious<T>(value: T): T | undefined
⋮----
export function useSidebarAnimations(
  sidebarRef: React.RefObject<HTMLDivElement>,
  resizeHandleRef: React.RefObject<HTMLDivElement>
)
⋮----
export function useBodyStateAnimations(
  appRef: React.RefObject<HTMLDivElement>,
  mainContentRef: React.RefObject<HTMLDivElement>,
  rightPaneRef: React.RefObject<HTMLDivElement>,
  topBarContainerRef: React.RefObject<HTMLDivElement>,
  mainAreaRef: React.RefObject<HTMLDivElement>
)
⋮----
// Kill any existing animations on the right pane to prevent conflicts
⋮----
// Right pane animation
⋮----
// Ensure correct width and position are set.
⋮----
// Animate entrance only when changing TO side pane view to prevent re-animation on resize.
⋮----
// SHOW AS SPLIT: Set transform immediately, animate width.
⋮----
// HIDE PANE: Determine how to hide based on the state we are coming FROM.
⋮----
// It was an overlay, so slide it out.
⋮----
} else { // Covers coming from SPLIT_VIEW, FULLSCREEN, or NORMAL
// It was docked or fullscreen, so shrink its width.
⋮----
// Determine top bar position based on state
⋮----
if (bodyState === BODY_STATES.FULLSCREEN) { // Always hide in fullscreen
⋮----
} else if (bodyState === BODY_STATES.SPLIT_VIEW && !isTopBarHovered) { // Hide in split view unless hovered
⋮----
} else if (bodyState === BODY_STATES.NORMAL && !isTopBarVisible) { // Hide only in normal mode when scrolled
⋮----
// Add backdrop for side pane
⋮----
if (isSidePane) { // This is correct because isSidePane is false when bodyState is split_view
```

## File: src/components/layout/RightPane.tsx
```typescript
import { forwardRef, useMemo, createElement, memo } from 'react'
import {
  ChevronRight,
  X,
} from 'lucide-react'
import { cn, BODY_STATES } from '@/lib/utils';
import { useAppShellStore } from '@/store/appShell.store';
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import { useRightPaneContent } from '@/hooks/useRightPaneContent.hook'
import { ViewModeSwitcher } from './ViewModeSwitcher';
⋮----
className=
⋮----
!isSplitView && !isFullscreen && "fixed top-0 right-0 z-[60] bg-card", // side pane overlay
isFullscreen && fullscreenTarget === 'right' && "fixed inset-0 z-[60] bg-card", // fullscreen
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
  Inbox,
  UserX,
  CheckCircle2,
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
⋮----
interface MyWorkspace extends Workspace {
  logo: string;
  plan: string;
}
⋮----
interface SidebarProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
⋮----
// Example of a reusable menu item component built with the new Sidebar primitives
⋮----
// The only item using this is Notifications
⋮----
// set dragged page in AppShell store
⋮----
{page && !isCollapsed && ( // Always render switcher if there's a page
⋮----
// If there are actions, move left to make space for the action button
⋮----
const MessagingSidebarItems = () =>
⋮----
const totalUnread = 7; // Mock data, could come from a store
⋮----
onClick=
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
    "@faker-js/faker": "^10.1.0",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-tooltip": "^1.2.8"
  }
}
```

## File: src/pages/DataDemo/index.tsx
```typescript
import { useRef, useEffect, useCallback, useMemo } from 'react'
import {
  Layers, 
  AlertTriangle, 
  PlayCircle, 
  TrendingUp,
  Loader2,
  ChevronsUpDown
} from 'lucide-react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { PageLayout } from '@/components/shared/PageLayout'
import { useScrollToBottom } from '@/hooks/useScrollToBottom.hook';
import { ScrollToBottomButton } from '@/components/shared/ScrollToBottomButton';
import { DataListView } from './components/DataListView'
import { DataCardView } from './components/DataCardView'
import { DataTableView } from './components/DataTableView'
import { DataViewModeSelector } from './components/DataViewModeSelector'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { StatCard } from '@/components/shared/StatCard'
import { AnimatedLoadingSkeleton } from './components/AnimatedLoadingSkeleton'
import { DataToolbar } from './components/DataToolbar'
import { mockDataItems } from './data/mockData'
import type { GroupableField, DataItem } from './types'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import { 
  useDataDemoStore, 
  useGroupTabs
} from './store/dataDemo.store'
⋮----
type Stat = {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down';
  type?: 'card';
};
⋮----
type ChartStat = {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down';
  type: 'chart';
  chartData: number[];
};
⋮----
type StatItem = Stat | ChartStat;
⋮----
// Calculate stats from data
⋮----
// Animate stats cards in
⋮----
// Note: Search functionality is handled by a separate SearchBar in the TopBar
⋮----
{/* Header */}
⋮----
{/* Stats Section */}
⋮----
{/* Controls Area */}
⋮----
// Not grouped view
⋮----
<div className="flex-grow border-b" /> {/* Mimic tab border */}
⋮----
// Grouped view with AnimatedTabs
⋮----
{/* Loader for infinite scroll */}
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
⋮----
interface AppShellProps {
  sidebar: ReactElement;
  topBar: ReactElement;
  mainContent: ReactElement;
  rightPane: ReactElement;
  commandPalette?: ReactElement;
  onOverlayClick?: () => void;
}
⋮----
// Helper hook to get the previous value of a prop or state
function usePrevious<T>(value: T): T | undefined
⋮----
// Custom hooks for logic
⋮----
// Animation for pane swapping
⋮----
// Check if a swap occurred by comparing current state with previous state
⋮----
// Animate main content FROM where right pane was TO its new place
⋮----
// Animate right pane FROM where main content was TO its new place
⋮----
}, 0); // Start at the same time
⋮----
className=
⋮----
{/* Enhanced Sidebar */}
⋮----
{/* Resize Handle */}
⋮----
e.preventDefault()
⋮----
{/* Main area wrapper */}
⋮----
{/* Invisible trigger area for top bar in split view */}
⋮----
{/* Side Pane Overlay */}
⋮----
{/* Left drop overlay */}
⋮----
{/* Right drop overlay (over main area, ONLY when NOT in split view) */}
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
⋮----
useNavigate, // used in LoginPageWrapper
⋮----
import { AppShell } from "./components/layout/AppShell";
import { AppShellProvider } from "./providers/AppShellProvider";
import { useAppShellStore } from "./store/appShell.store";
import { useAuthStore } from "./store/authStore";
⋮----
// Import library components
import { EnhancedSidebar } from "./components/layout/EnhancedSidebar";
import { MainContent } from "./components/layout/MainContent";
import { RightPane } from "./components/layout/RightPane";
import { TopBar } from "./components/layout/TopBar";
import { CommandPalette } from "./components/global/CommandPalette";
import { ToasterProvider } from "./components/ui/toast";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
⋮----
// --- Page/Content Components for Pages and Panes ---
import { DashboardContent } from "./pages/Dashboard";
import { SettingsPage } from "./pages/Settings";
import { ToasterDemo } from "./pages/ToasterDemo";
import { NotificationsPage } from "./pages/Notifications";
import DataDemoPage from "./pages/DataDemo";
import MessagingPage from "./pages/Messaging";
import { LoginPage } from "./components/auth/LoginPage";
⋮----
// --- Icons ---
import {
  Search,
  Filter,
  Plus,
  ChevronRight,
  Rocket,
} from "lucide-react";
⋮----
// --- Utils & Hooks ---
import { cn } from "./lib/utils";
import { useAppViewManager } from "./hooks/useAppViewManager.hook";
import { useRightPaneContent } from "./hooks/useRightPaneContent.hook";
import { BODY_STATES } from "./lib/utils";
⋮----
// Checks for authentication and redirects to login if needed
⋮----
// A root component to apply global styles and effects
⋮----
// The main layout for authenticated parts of the application
⋮----
// Breadcrumbs for the Top Bar
⋮----
// Page-specific controls for the Top Bar
⋮----
// The main App component that composes the shell
⋮----
// Sync URL state with AppShellStore
⋮----
function App()
```
