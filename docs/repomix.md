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
      radio-group.tsx
      scroll-area.tsx
      separator.tsx
      skeleton.tsx
      slider.tsx
      switch.tsx
      tabs.tsx
      textarea.tsx
      timeline.tsx
      toast.tsx
      tooltip.tsx
  features/
    dynamic-view/
      components/
        controls/
          ViewControls.tsx
          ViewModeSelector.tsx
        shared/
          AddDataItemCta.tsx
          AnimatedLoadingSkeleton.tsx
          DetailPanel.tsx
          DraggableSection.tsx
          EditableField.tsx
          EmptyState.tsx
          FieldRenderer.tsx
        views/
          CalendarView.tsx
          CardView.tsx
          KanbanView.tsx
          ListView.tsx
          TableView.tsx
      DynamicView.tsx
      DynamicViewContext.tsx
      types.ts
    settings/
      SettingsContent.tsx
      SettingsSection.tsx
      SettingsToggle.tsx
  hooks/
    useAppShellAnimations.hook.ts
    useAppViewManager.hook.ts
    useAutoAnimateStats.hook.ts
    useAutoAnimateTopBar.ts
    useCommandPaletteToggle.hook.ts
    usePageViewConfig.hook.ts
    usePaneDnd.hook.ts
    useResizablePanes.hook.ts
    useResizeObserver.hook.ts
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
      data/
        DataDemoItem.ts
        mockData.ts
      store/
        dataDemo.store.tsx
      DataDemo.config.tsx
      index.tsx
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

## File: src/components/ui/dropdown-menu.tsx
```typescript
import { Check, ChevronRight, Circle } from "lucide-react"
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

## File: src/components/ui/popover.tsx
```typescript
import { cn } from "@/lib/utils"
⋮----
interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  useTriggerWidth?: boolean
}
```

## File: src/components/ui/tabs.tsx
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

## File: postcss.config.js
```javascript

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

## File: src/components/shared/ScrollToBottomButton.tsx
```typescript
import { ArrowDown } from 'lucide-react';
⋮----
interface ScrollToBottomButtonProps {
  isVisible: boolean;
  onClick: () => void;
}
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

## File: src/components/ui/checkbox.tsx
```typescript
import { Check } from "lucide-react"
⋮----
import { cn } from "@/lib/utils"
⋮----
className=
```

## File: src/components/ui/radio-group.tsx
```typescript
import { Circle } from "lucide-react"
⋮----
import { cn } from "@/lib/utils"
⋮----
className=
```

## File: src/components/ui/scroll-area.tsx
```typescript
import { cn } from "@/lib/utils"
⋮----
className=
```

## File: src/components/ui/separator.tsx
```typescript
import { cn } from "@/lib/utils"
```

## File: src/components/ui/skeleton.tsx
```typescript
import { cn } from "@/lib/utils";
⋮----
className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
```

## File: src/components/ui/slider.tsx
```typescript
import { cn } from "@/lib/utils"
⋮----
className=
```

## File: src/components/ui/switch.tsx
```typescript
import { cn } from "@/lib/utils"
⋮----
className=
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

## File: src/components/ui/tooltip.tsx
```typescript
import { cn } from "@/lib/utils"
```

## File: src/features/dynamic-view/components/shared/DraggableSection.tsx
```typescript
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
⋮----
interface DraggableSectionProps {
  id: string;
  children: React.ReactNode;
}
⋮----
export function DraggableSection(
⋮----
<div ref=
```

## File: src/features/dynamic-view/components/shared/EditableField.tsx
```typescript
import React, { useState, useRef, useEffect } from 'react';
import { useDynamicView } from '../../DynamicViewContext';
import type { GenericItem, ControlOption } from '../../types';
import { FieldRenderer } from './FieldRenderer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Slider } from '@/components/ui/slider';
import { cn, getNestedValue } from '@/lib/utils';
import { mockDataItems } from '@/pages/DataDemo/data/mockData';
⋮----
interface EditableFieldProps<TFieldId extends string, TItem extends GenericItem> {
  item: TItem;
  fieldId: TFieldId;
  className?: string;
  options?: Record<string, any>;
}
⋮----
// Mock user list for assignee field
⋮----
const renderEditComponent = () =>
⋮----
case 'thumbnail': // For emoji
⋮----
onBlur=
⋮----
const filterableField = config.filterableFields.find((f)
⋮----
onValueCommit=
⋮----
{/* For Popover fields, the editor is always rendered when isEditing is true to control its open state */}
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

## File: src/hooks/useResizeObserver.hook.ts
```typescript
import { useState, useEffect } from 'react';
⋮----
interface Dimensions {
  width: number;
  height: number;
}
⋮----
export function useResizeObserver<T extends HTMLElement>(
  ref: React.RefObject<T>
): Dimensions
```

## File: src/pages/DataDemo/data/DataDemoItem.ts
```typescript
import type { GenericItem, Status, Priority } from '@/features/dynamic-view/types';
⋮----
export interface DataDemoItem extends GenericItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  status: Status;
  priority: Priority;
  assignee: {
    name: string;
    email: string;
    avatar: string;
  };
  tags: string[];
  metrics: {
    views: number;
    likes: number;
    shares: number;
    completion: number;
  };
  dueDate: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
⋮----
dueDate: string; // ISO date string
createdAt: string; // ISO date string
updatedAt: string; // ISO date string
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

## File: src/components/ui/timeline.tsx
```typescript
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Check,
  Clock,
  AlertCircle,
  X,
  Calendar,
  User,
  MapPin,
  MessageSquare,
  Award,
  Briefcase,
  GraduationCap,
  Heart,
} from "lucide-react";
⋮----
export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp?: string | Date;
  status?: "default" | "completed" | "active" | "pending" | "error";
  icon?: React.ReactNode;
  content?: React.ReactNode;
  metadata?: Record<string, any>;
}
⋮----
export interface TimelineProps extends VariantProps<typeof timelineVariants> {
  items: TimelineItem[];
  className?: string;
  showConnectors?: boolean;
  showTimestamps?: boolean;
  timestampPosition?: "top" | "bottom" | "inline";
}
⋮----
function getStatusIcon(status: TimelineItem["status"])
⋮----
function formatTimestamp(timestamp: string | Date): string
⋮----
className=
⋮----
{/* Connector Line */}
⋮----
{/* Icon */}
⋮----
{/* Content */}
⋮----
{/* Timestamp - Top */}
⋮----
{/* Title and Inline Timestamp */}
⋮----
{/* Description */}
⋮----
{/* Custom Content */}
⋮----
{/* Timestamp - Bottom */}
⋮----
// Example Components for Documentation
```

## File: src/features/dynamic-view/components/shared/EmptyState.tsx
```typescript
import { Eye } from 'lucide-react'
⋮----
export function EmptyState()
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
 * It sets the widths when config changes and resets them to the application defaults on unmount.
 * @param {PageViewConfig} config - The desired widths for side pane and split view.
 */
export function usePageViewConfig(config: PageViewConfig)
⋮----
// Return a cleanup function to reset widths when the component unmounts
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

## File: src/pages/DataDemo/data/mockData.ts
```typescript
import type { GenericItem } from '@/features/dynamic-view/types';
```

## File: src/pages/Messaging/components/ActivityPanel.tsx
```typescript
import React, { useMemo } from 'react';
import { Mail, StickyNote, PhoneCall, Calendar } from 'lucide-react';
import type { Contact, ActivityEventType } from '../types';
import { Timeline, type TimelineItem } from '@/components/ui/timeline';
import { capitalize } from '@/lib/utils';
⋮----
interface ActivityPanelProps {
  contact: Contact;
}
⋮----
export const ActivityPanel: React.FC<ActivityPanelProps> = (
```

## File: src/pages/Messaging/components/ContactInfoPanel.tsx
```typescript
import React from 'react';
import { Mail, Phone } from 'lucide-react';
import type { Contact } from '../types';
import { useMessagingStore } from '../store/messaging.store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
{/* Header */}
⋮----
{/* Contact Details */}
⋮----
{/* Colleagues */}
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

## File: src/features/dynamic-view/components/controls/ViewModeSelector.tsx
```typescript
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { List, Grid3X3, LayoutGrid, Table, LayoutDashboard, CalendarDays } from 'lucide-react'
import type { ViewMode } from '../../types';
import { useDynamicView } from '../../DynamicViewContext';
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

## File: src/features/dynamic-view/components/shared/AddDataItemCta.tsx
```typescript
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
⋮----
import type { ViewMode } from '../../types'
⋮----
interface AddDataItemCtaProps {
  viewMode: ViewMode
  colSpan?: number
}
```

## File: src/features/dynamic-view/components/shared/AnimatedLoadingSkeleton.tsx
```typescript
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ViewMode } from '../../types'
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
⋮----
kanban: "", // Kanban has its own skeleton
calendar: "" // Calendar has its own skeleton
```

## File: src/features/dynamic-view/DynamicViewContext.tsx
```typescript
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { ViewConfig, GenericItem, ViewMode, FilterConfig, SortConfig, CalendarDateProp, CalendarDisplayProp, CalendarColorProp, GroupableField } from './types';
⋮----
export interface DynamicViewContextProps<TFieldId extends string, TItem extends GenericItem> {
  config: ViewConfig<TFieldId, TItem>;
  data: TItem[];
  getFieldDef: (fieldId: TFieldId) => ViewConfig<TFieldId, TItem>['fields'][number] | undefined;

  // Data & State from parent
  items: TItem[];
  isLoading: boolean;
  isInitialLoading: boolean;
  totalItemCount: number;
  hasMore: boolean;

  // Controlled State Props from parent
  viewMode: ViewMode;
  filters: FilterConfig;
  sortConfig: SortConfig<TFieldId> | null;
  groupBy: GroupableField<TFieldId>;
  activeGroupTab: string;
  page: number;
  selectedItemId?: string;
  // Calendar-specific state
  calendarDateProp?: CalendarDateProp<TFieldId>;
  calendarDisplayProps?: CalendarDisplayProp<TFieldId>[];
  calendarItemLimit?: 'all' | number;
  calendarColorProp?: CalendarColorProp<TFieldId>;

  // Callbacks to parent
  onViewModeChange: (mode: ViewMode) => void;
  onFiltersChange: (filters: FilterConfig) => void;
  onSortChange: (sort: SortConfig<TFieldId> | null) => void;
  onGroupByChange: (group: GroupableField<TFieldId>) => void;
  onActiveGroupTabChange: (tab: string) => void;
  onPageChange: (page: number) => void;
  onItemSelect: (item: TItem) => void;
  onItemUpdate?: (itemId: string, updates: Partial<TItem>) => void;
  // Calendar-specific callbacks
  onCalendarDatePropChange?: (prop: CalendarDateProp<TFieldId>) => void;
  onCalendarDisplayPropsChange?: (props: CalendarDisplayProp<TFieldId>[]) => void;
  onCalendarItemLimitChange?: (limit: 'all' | number) => void;
  onCalendarColorPropChange?: (prop: CalendarColorProp<TFieldId>) => void;
}
⋮----
// Data & State from parent
⋮----
// Controlled State Props from parent
⋮----
// Calendar-specific state
⋮----
// Callbacks to parent
⋮----
// Calendar-specific callbacks
⋮----
interface DynamicViewProviderProps<TFieldId extends string, TItem extends GenericItem> extends Omit<DynamicViewContextProps<TFieldId, TItem>, 'getFieldDef' | 'config' | 'data'> {
  viewConfig: ViewConfig<TFieldId, TItem>,
  children: ReactNode;
}
⋮----
export function DynamicViewProvider<TFieldId extends string, TItem extends GenericItem>(
⋮----
const getFieldDef = (fieldId: TFieldId) =>
⋮----
data: rest.items, // alias for convenience
⋮----
export function useDynamicView<TFieldId extends string, TItem extends GenericItem>()
```

## File: src/hooks/useAutoAnimateStats.hook.ts
```typescript
import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
⋮----
/**
 * A hook that animates a stats container in and out of view based on scroll direction.
 * It creates a "sliver app bar" effect for the stats section.
 * @param scrollContainerRef Ref to the main scrolling element.
 * @param statsContainerRef Ref to the stats container element to be animated.
 */
export function useAutoAnimateStats(
  scrollContainerRef: React.RefObject<HTMLElement>,
  statsContainerRef: React.RefObject<HTMLElement>
)
⋮----
// Reveal on "pull to reveal" at the top
⋮----
// For non-scrollable containers (like Kanban), hide on any downward scroll
⋮----
// When component unmounts, kill any running animations on the stats ref
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

## File: src/components/shared/StatCard.tsx
```typescript
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
⋮----
interface StatCardProps {
  className?: string;
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
!chartData && "h-full", // Ensure cards without charts have consistent height if needed
```

## File: src/features/dynamic-view/components/shared/DetailPanel.tsx
```typescript
import React, { useRef, useState, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Clock, 
  Tag,
  User,
  BarChart3,
} from 'lucide-react'
import type { GenericItem, DetailViewConfig, DetailViewSection } from '../../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook';
import { EditableField } from './EditableField'
import { DraggableSection } from './DraggableSection'
import { getNestedValue } from '@/lib/utils'
import { useDynamicView } from '../../DynamicViewContext'
⋮----
interface DetailPanelProps<TFieldId extends string, TItem extends GenericItem> {
  item: TItem;
  config: DetailViewConfig<TFieldId>;
}
⋮----
const handleDragEnd = (event: DragEndEvent) =>
⋮----
{/* Header */}
⋮----
{/* Status badges */}
⋮----
{/* Progress */}
⋮----
{/* Content */}
```

## File: src/features/dynamic-view/components/shared/FieldRenderer.tsx
```typescript
import { useDynamicView } from '../../DynamicViewContext';
import type { GenericItem, BadgeFieldDefinition, FieldDefinition } from '../../types';
import { cn, getNestedValue } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Heart, Share } from 'lucide-react';
⋮----
interface FieldRendererProps<TFieldId extends string, TItem extends GenericItem> {
  item: TItem;
  fieldId: TFieldId;
  className?: string;
  options?: Record<string, any>; // For extra props like 'compact' for avatar
}
⋮----
options?: Record<string, any>; // For extra props like 'compact' for avatar
⋮----
// Custom render function takes precedence
⋮----
return null; // Or some placeholder like 'N/A'
⋮----
return <span className=
⋮----

⋮----
<div className=
⋮----
return <>
```

## File: src/features/dynamic-view/components/views/TableView.tsx
```typescript
import { useRef, useLayoutEffect, useMemo, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  ExternalLink
} from 'lucide-react'
import type { GenericItem } from '../../types'
import { EmptyState } from '../shared/EmptyState'
import { capitalize } from '@/lib/utils'
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'
⋮----
// Only select item rows for animation, not group headers
⋮----
const SortIcon = (
⋮----
const handleSortClick = (field: string) =>
⋮----
<h3 className="font-semibold text-sm">
⋮----
{/* Actions Column */}
```

## File: src/features/dynamic-view/DynamicView.tsx
```typescript
import { useMemo, useCallback, type ReactNode, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import { DynamicViewProvider } from '@/features/dynamic-view/DynamicViewContext';
import type { ViewConfig, GenericItem, ViewMode, FilterConfig, SortConfig, CalendarDateProp, CalendarDisplayProp, CalendarColorProp, StatItem, GroupableField } from './types';
import { ViewControls } from './components/controls/ViewControls';
import { ViewModeSelector } from './components/controls/ViewModeSelector';
import { AnimatedLoadingSkeleton } from './components/shared/AnimatedLoadingSkeleton';
import { ListView } from './components/views/ListView';
import { CardView } from './components/views/CardView';
import { TableView } from './components/views/TableView';
import { KanbanView } from './components/views/KanbanView';
import { CalendarView } from './components/views/CalendarView';
import { EmptyState } from './components/shared/EmptyState';
import { useAutoAnimateStats } from '@/hooks/useAutoAnimateStats.hook';
import { StatCard } from '@/components/shared/StatCard';
⋮----
// Define the props for the controlled DynamicView component
export interface DynamicViewProps<TFieldId extends string, TItem extends GenericItem> {
  // Config
  viewConfig: ViewConfig<TFieldId, TItem>;
  
  // Data & State
  items: TItem[];
  isLoading: boolean;
  isInitialLoading: boolean;
  totalItemCount: number;
  hasMore: boolean;
  
  // Controlled State Props
  viewMode: ViewMode;
  filters: FilterConfig;
  sortConfig: SortConfig<TFieldId> | null;
  groupBy: GroupableField<TFieldId>;
  activeGroupTab: string;
  page: number;
  selectedItemId?: string;
  // Calendar-specific state
  calendarDateProp?: CalendarDateProp<TFieldId>;
  calendarDisplayProps?: CalendarDisplayProp<TFieldId>[];
  calendarItemLimit?: 'all' | number;
  calendarColorProp?: CalendarColorProp<TFieldId>;
  statsData?: StatItem[];

  // State Change Callbacks
  onViewModeChange: (mode: ViewMode) => void;
  onFiltersChange: (filters: FilterConfig) => void;
  onSortChange: (sort: SortConfig<TFieldId> | null) => void;
  onGroupByChange: (group: GroupableField<TFieldId>) => void;
  onActiveGroupTabChange: (tab: string) => void;
  onPageChange: (page: number) => void;
  onItemSelect: (item: TItem) => void;
  onItemUpdate?: (itemId: string, updates: Partial<TItem>) => void;
  // Calendar-specific callbacks
  onCalendarDatePropChange?: (prop: CalendarDateProp<TFieldId>) => void;
  onCalendarDisplayPropsChange?: (props: CalendarDisplayProp<TFieldId>[]) => void;
  onCalendarItemLimitChange?: (limit: 'all' | number) => void;
  onCalendarColorPropChange?: (prop: CalendarColorProp<TFieldId>) => void;
  
  // Custom Renderers
  renderHeaderControls?: () => ReactNode;
  renderCta?: (viewMode: ViewMode, ctaProps: { colSpan?: number }) => ReactNode;
  loaderRef?: React.Ref<HTMLDivElement>;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}
⋮----
// Config
⋮----
// Data & State
⋮----
// Controlled State Props
⋮----
// Calendar-specific state
⋮----
// State Change Callbacks
⋮----
// Calendar-specific callbacks
⋮----
// Custom Renderers
⋮----
// Auto-hide stats container on scroll down
⋮----
// Animate stats cards in
⋮----
if (isInitialLoading)
⋮----
// This will be expanded later to handle group tabs
⋮----
{/* Loader for infinite scroll */}
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
  task: (Task & { contact: Contact; assignee: Assignee | null; activeHandler: Assignee | null });
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

## File: src/components/ui/animated-tabs.tsx
```typescript
import React, { useState, useRef, useEffect, useLayoutEffect, useId } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"
⋮----
interface Tab {
  id: string
  label: React.ReactNode
  count?: number
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

## File: src/features/dynamic-view/components/views/KanbanView.tsx
```typescript
import { useState, useEffect, Fragment } from "react";
import {
  GripVertical,
  Plus,
} from "lucide-react";
import type { GenericItem } from '../../types'
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EmptyState } from "../shared/EmptyState";
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'
⋮----
interface KanbanCardProps {
  item: GenericItem;
  isDragging: boolean;
}
⋮----
const getDropIndicatorIndex = (e: React.DragEvent, elements: HTMLElement[]) =>
⋮----
const handleDragOverCardsContainer = (e: React.DragEvent<HTMLDivElement>, columnId: string) =>
⋮----
const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) =>
⋮----
// Update local state for immediate feedback
⋮----
// Persist change to global store. The groupBy value tells us which property to update.
⋮----
const handleDragEnd = () =>
⋮----
const DropIndicator = ()
⋮----
className=
⋮----
onDragOver=
onDrop=
⋮----
onDragStart=
```

## File: src/lib/utils.ts
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from "date-fns"
⋮----
export function cn(...inputs: ClassValue[])
⋮----
export type SidebarState = typeof SIDEBAR_STATES[keyof typeof SIDEBAR_STATES]
export type BodyState = typeof BODY_STATES[keyof typeof BODY_STATES]
⋮----
export function capitalize(str: string): string
⋮----
export function formatDistanceToNowShort(date: Date | string): string
⋮----
export const getStatusColor = (status: string) =>
⋮----
// A helper to get nested properties from an object, e.g., 'metrics.views'
export function getNestedValue(obj: Record<string, any>, path: string): any
⋮----
export const getPrioritySolidColor = (priority: string) =>
⋮----
export const getPriorityColor = (priority: string) =>
```

## File: src/pages/DataDemo/DataDemo.config.tsx
```typescript
import { FieldRenderer } from "@/features/dynamic-view/components/shared/FieldRenderer";
import type {
  ViewConfig,
  FieldDefinition,
} from "@/features/dynamic-view/types";
import type { DataDemoItem } from "./data/DataDemoItem";
⋮----
// A custom field to replicate the composite "Project" column in the table view
⋮----
// Infer the field IDs from the const-asserted array.
⋮----
// 1. Field Definitions
⋮----
// 2. Control Definitions
⋮----
// 3. View Layouts
```

## File: src/pages/Messaging/components/ActivityFeed.tsx
```typescript
import React, { forwardRef } from 'react';
import { useMessagingStore } from '../store/messaging.store';
import type { Message, Contact, JourneyPointType } from '../types';
import { cn, formatDistanceToNowShort } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StickyNote, Info, MessageSquare, ShoppingCart, PackageCheck, AlertCircle, RefreshCw, MailQuestion, FileText, CreditCard, Truck, XCircle, Undo2, Star, type LucideIcon } from 'lucide-react';
⋮----
interface ActivityFeedProps {
  messages: Message[];
  contact: Contact;
  searchTerm?: string;
}
⋮----
<Icon className=
<span className=
<span className="text-xs text-muted-foreground font-normal whitespace-nowrap">
⋮----
// Default: 'comment' type
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

## File: src/features/dynamic-view/components/controls/ViewControls.tsx
```typescript
import { Check, ListFilter, Search, SortAsc, ChevronsUpDown, Settings } from 'lucide-react'
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
⋮----
import type { FilterConfig, CalendarDateProp, CalendarDisplayProp, CalendarColorProp, GenericItem, FilterableFieldConfig } from '../../types'
import { useDynamicView } from '../../DynamicViewContext';
⋮----
export interface DataViewControlsProps {
  // groupOptions will now come from config
}
⋮----
// groupOptions will now come from config
⋮----
const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) =>
⋮----
{/* Search */}
⋮----
{/* Filters */}
⋮----
{/* Spacer */}
⋮----
{/* Sorter */}
⋮----
{/* Group By Dropdown */}
⋮----
const handleSelect = (fieldId: string, value: string) =>
⋮----
const clearFilters = () =>
```

## File: src/features/dynamic-view/components/views/CardView.tsx
```typescript
import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'
import type { GenericItem } from '../../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import { EmptyState } from '../shared/EmptyState'
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'
⋮----
className=
⋮----
{/* Card Header with Thumbnail */}
⋮----
{/* Header Fields (e.g., priority indicator) */}
⋮----
{/* Card Content */}
⋮----
{/* Status and Category */}
⋮----
{/* Tags, Progress, Assignee */}
⋮----
{/* Metrics and Date */}
⋮----
{/* Hover gradient overlay */}
⋮----
{/* Selection indicator */}
```

## File: src/features/dynamic-view/components/views/ListView.tsx
```typescript
import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { GenericItem } from '../../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook'
import { EmptyState } from '../shared/EmptyState'
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'
⋮----
{/* Left side: Icon and Title */}
⋮----
{/* Right side: Metadata */}
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

## File: src/pages/Messaging/components/JourneyScrollbar.tsx
```typescript
import React, { useState, useLayoutEffect, useRef, useCallback } from 'react';
import type { Message, JourneyPointType } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { gsap } from 'gsap';
import { Info, MessageSquare, FileText, ShoppingCart, CreditCard, Truck, PackageCheck, XCircle, Undo2, AlertCircle, RefreshCw, MailQuestion, Star, type LucideIcon } from 'lucide-react';
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

## File: src/pages/Messaging/components/TaskList.tsx
```typescript
import { useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, Check, Inbox, Clock, Zap, Shield, Eye } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useMessagingStore } from '../store/messaging.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { cn, formatDistanceToNowShort } from '@/lib/utils';
import { AnimatedTabs } from '@/components/ui/animated-tabs';
import type { TaskStatus, TaskPriority, TaskView } from '../types';
import { useAppViewManager } from '@/hooks/useAppViewManager.hook';
import { useMessagingTaskCounts } from '../store/messaging.store';
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
) : <div className="h-5 w-5" /> /* Spacer to maintain alignment */ }
⋮----
// Filter component for popover
⋮----
const handleSelect = (type: 'status' | 'priority' | 'assigneeId' | 'tags', value: string) =>
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

## File: src/features/dynamic-view/components/views/CalendarView.tsx
```typescript
import { useState, useMemo, useRef, useLayoutEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isSameDay, } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
⋮----
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GenericItem } from '../../types';
import type { CalendarDateProp, CalendarColorProp, Status, Priority } from '../../types';
import { useResizeObserver } from "@/hooks/useResizeObserver.hook";
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'
⋮----
interface CalendarViewProps {
  data: GenericItem[];
}
⋮----
const getCategoryBgColor = (category: string) =>
⋮----
onDragStart=
⋮----
calendarDateProp = 'dueDate', // Provide default
calendarItemLimit = 3, // Provide default
calendarColorProp = 'none', // Provide default
⋮----
// Drag & Drop State
⋮----
// GSAP animation state
const [direction, setDirection] = useState(0); // 0: initial, 1: next, -1: prev
⋮----
// Responsive Calendar State
⋮----
const MIN_DAY_WIDTH = 160; // px
⋮----
const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
⋮----
// D&D Handlers
const handleDragStart = (e: React.DragEvent, itemId: string) =>
⋮----
const handleDragEnd = () =>
⋮----
const handleMonthChange = (direction: 'prev' | 'next') =>
⋮----
// Safety check: ensure user is still hovering on the correct edge
⋮----
// Schedule next accelerated change
⋮----
const handleDragOver = (e: React.DragEvent, day: Date) =>
⋮----
const edgeZoneWidth = 80; // 80px hotzone on each side
⋮----
const clearTimer = () =>
⋮----
// Check left edge
⋮----
// Check right edge
⋮----
// If not in an edge zone
⋮----
const handleDragLeave = () =>
⋮----
const handleDrop = (e: React.DragEvent, day: Date) =>
⋮----
// Preserve the time, only change the date part
⋮----
handleDragEnd(); // Reset state
⋮----
const handlePrevMonth = () =>
const handleNextMonth = () =>
const handleToday = () =>
⋮----
setDirection(0); // No animation for 'Today'
⋮----
{/* Left edge cue */}
⋮----
{/* Right edge cue */}
⋮----
key=
onDragOver=
⋮----
onDrop=
```

## File: src/features/dynamic-view/types.ts
```typescript
import type { ReactNode } from 'react';
⋮----
// --- GENERIC DATA & ITEM ---
export type GenericItem = Record<string, any> & { id: string };
⋮----
// --- FIELD DEFINITIONS ---
// Describes a single piece of data within a GenericItem.
export type FieldType =
  | 'string'
  | 'longtext'
  | 'badge'
  | 'avatar'
  | 'progress'
  | 'date'
  | 'tags'
  | 'metrics'
  | 'thumbnail'
  | 'custom';
⋮----
export interface BaseFieldDefinition<TFieldId extends string, TItem extends GenericItem> {
  id: TFieldId; // Corresponds to a key in GenericItem
  label: string;
  type: FieldType;
  // Optional custom render function for ultimate flexibility.
  render?: (item: TItem, options?: Record<string, any>) => ReactNode;
}
⋮----
id: TFieldId; // Corresponds to a key in GenericItem
⋮----
// Optional custom render function for ultimate flexibility.
⋮----
export interface BadgeFieldDefinition<TFieldId extends string, TItem extends GenericItem>
  extends BaseFieldDefinition<TFieldId, TItem> {
  type: 'badge';
  colorMap?: Record<string, string>; // e.g., { 'active': 'bg-green-500', 'pending': 'bg-yellow-500' }
  indicatorColorMap?: Record<string, string>; // e.g., { 'critical': 'bg-red-500' }
}
⋮----
colorMap?: Record<string, string>; // e.g., { 'active': 'bg-green-500', 'pending': 'bg-yellow-500' }
indicatorColorMap?: Record<string, string>; // e.g., { 'critical': 'bg-red-500' }
⋮----
// Add other specific field types if they need unique properties
// For now, most can be handled by the base definition.
⋮----
export type FieldDefinition<TFieldId extends string, TItem extends GenericItem> =
  | BaseFieldDefinition<TFieldId, TItem>
  | BadgeFieldDefinition<TFieldId, TItem>;
⋮----
// --- VIEW CONFIGURATION ---
// The master configuration object that defines the entire view.
⋮----
export type ViewMode = 'list' | 'cards' | 'grid' | 'table' | 'kanban' | 'calendar';
⋮----
export interface ListViewConfig<TFieldId extends string> {
  iconField: TFieldId;
  titleField: TFieldId;
  metaFields: readonly {
    fieldId: TFieldId;
    className?: string;
  }[];
}
⋮----
export interface CardViewConfig<TFieldId extends string> {
  thumbnailField: TFieldId;
  titleField: TFieldId;
  descriptionField: TFieldId;
  headerFields: readonly TFieldId[];
  // Specific fields to recreate the original layout
  statusField: TFieldId;
  categoryField: TFieldId;
  tagsField: TFieldId;
  progressField: TFieldId;
  assigneeField: TFieldId;
  metricsField: TFieldId;
  dateField: TFieldId;
}
⋮----
// Specific fields to recreate the original layout
⋮----
export interface TableColumnConfig<TFieldId extends string> {
  fieldId: TFieldId;
  label: string;
  isSortable: boolean;
}
⋮----
export interface TableViewConfig<TFieldId extends string> {
  columns: readonly TableColumnConfig<TFieldId>[];
}
⋮----
export interface KanbanViewConfig<TFieldId extends string> {
  groupByField: TFieldId; // Field ID to group by (e.g., 'status')
  cardFields: {
    titleField: TFieldId;
    descriptionField: TFieldId;
    priorityField: TFieldId;
    tagsField: TFieldId;
    // footer fields
    dateField: TFieldId;
    metricsField: TFieldId; // for comments/attachments
    assigneeField: TFieldId;
  };
}
⋮----
groupByField: TFieldId; // Field ID to group by (e.g., 'status')
⋮----
// footer fields
⋮----
metricsField: TFieldId; // for comments/attachments
⋮----
export interface CalendarViewConfig<TFieldId extends string> {
  dateField: TFieldId;
  titleField: TFieldId;
  displayFields: readonly TFieldId[];
  colorByField?: TFieldId; // Field ID to color events by (e.g., 'priority', 'status')
}
⋮----
colorByField?: TFieldId; // Field ID to color events by (e.g., 'priority', 'status')
⋮----
export interface ControlOption<TId extends string> {
  id: TId;
  label: string;
}
⋮----
export interface FilterableFieldConfig<TFieldId extends string> {
  id: TFieldId; // fieldId
  label: string;
  options: readonly ControlOption<string>[];
}
⋮----
id: TFieldId; // fieldId
⋮----
export interface ViewConfig<
  TFieldId extends string,
  TItem extends GenericItem,
> {
  fields: readonly FieldDefinition<TFieldId, TItem>[];
  sortableFields: readonly ControlOption<TFieldId>[];
  groupableFields: readonly ControlOption<TFieldId | 'none'>[];
  filterableFields: readonly FilterableFieldConfig<TFieldId>[];

  // Layouts for each view mode
  listView: ListViewConfig<TFieldId>;
  cardView: CardViewConfig<TFieldId>;
  tableView: TableViewConfig<TFieldId>;
  kanbanView: KanbanViewConfig<TFieldId>;
  calendarView: CalendarViewConfig<TFieldId>;
  detailView: DetailViewConfig<TFieldId>;
}
⋮----
// Layouts for each view mode
⋮----
// --- DETAIL VIEW ---
export interface DetailViewSection<TFieldId extends string> {
  title: string;
  fields: readonly TFieldId[];
}
⋮----
export interface DetailViewConfig<TFieldId extends string> {
  header: {
    thumbnailField: TFieldId;
    titleField: TFieldId;
    descriptionField: TFieldId;
    badgeFields: readonly TFieldId[];
    progressField: TFieldId;
  };
  body: {
    sections: readonly DetailViewSection<TFieldId>[];
  };
}
⋮----
// --- GENERIC CONTROL & DATA TYPES ---
⋮----
export type Status = 'active' | 'pending' | 'completed' | 'archived';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
⋮----
export interface FilterConfig {
  searchTerm: string;
  [key: string]: any; // For dynamic filter keys like status, priority
}
⋮----
[key: string]: any; // For dynamic filter keys like status, priority
⋮----
export interface SortConfig<TFieldId extends string> {
  key: TFieldId;
  direction: 'asc' | 'desc';
}
⋮----
export type GroupableField<TFieldId extends string> = TFieldId | 'none';
⋮----
export type CalendarDateProp<TFieldId extends string> = TFieldId;
export type CalendarDisplayProp<TFieldId extends string> = TFieldId;
export type CalendarColorProp<TFieldId extends string> = TFieldId | 'none';
⋮----
// --- STATS ---
export type StatItem = {
  title: string;
  value: string;
  icon: ReactNode;
  change: string;
  trend: 'up' | 'down';
  chartData?: number[];
};
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
// --- COMPANIES ---
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
    "@radix-ui/react-scroll-area": "^1.2.10",
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
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@faker-js/faker": "^10.1.0",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.2.8"
  }
}
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

## File: src/pages/DataDemo/store/dataDemo.store.tsx
```typescript
import { create } from "zustand";
import { mockDataItems } from "@/pages/DataDemo/data/mockData";
import type {
  GroupableField,
  FilterConfig,
  SortConfig,
} from "@/features/dynamic-view/types";
⋮----
import type { DataDemoItem } from "../data/DataDemoItem";
// --- State and Actions ---
interface DataDemoState {
  items: DataDemoItem[];
  hasMore: boolean;
  isLoading: boolean;
  isInitialLoading: boolean;
  totalItemCount: number;
}
⋮----
interface DataDemoActions {
  loadData: (params: {
    page: number;
    groupBy: GroupableField<string> | "none";
    filters: FilterConfig;
    sortConfig: SortConfig<string> | null;
    isFullLoad?: boolean;
  }) => void;
  updateItem: (itemId: string, updates: Partial<DataDemoItem>) => void;
}
⋮----
// Cast the mock data to our strict type to satisfy the store's requirements
⋮----
// --- Store Implementation ---
⋮----
const getNestedValue = (obj: DataDemoItem, path: string): unknown
⋮----
// In a real app, this would be an API call. Here we update the mock source.
⋮----
// Also update the currently loaded items in the store's state for UI consistency
⋮----
export const useSelectedItem = (itemId?: string) =>
```

## File: src/pages/Messaging/components/TaskDetail.tsx
```typescript
import React, { useRef, useEffect, useLayoutEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useMessagingStore } from '../store/messaging.store';
import { ActivityFeed } from './ActivityFeed';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Search, SendHorizontal, Smile, StickyNote, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { TakeoverBanner } from './TakeoverBanner';
import { useToast } from '@/components/ui/toast';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { useAppShellStore } from '@/store/appShell.store';
import { JourneyScrollbar } from './JourneyScrollbar';
⋮----
// In a real app, this would come from the auth store
⋮----
// Hooks and memoized values must be called unconditionally at the top level.
// Moved from below the early return to fix "rendered more hooks" error.
⋮----
// On conversation change, scroll to the bottom of the message list.
// This ensures the user sees the latest message and that the scrollbar
// component has the correct scrollHeight to calculate its visibility.
⋮----
const handleKeyDown = (event: KeyboardEvent) =>
⋮----
// Timeout to allow for the element to be rendered and transitioned
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
onMouseLeave=
⋮----
onChange=
⋮----
className=
⋮----
{/* Input Form */}
```

## File: src/pages/Messaging/index.tsx
```typescript
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { usePageViewConfig } from "@/hooks/usePageViewConfig.hook";
import { useAppShellStore } from "@/store/appShell.store";
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
// When a conversation is selected (split view), reset the pane width to default.
// When no conversation is selected, we don't want to manage the width, so pass undefined.
⋮----
className=
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
export type JourneyPointType = 'Inquiry' | 'Consult' | 'Quote' | 'Order' | 'Payment' | 'Shipped' | 'Delivered' | 'Canceled' | 'Refund' | 'Complain' | 'Reorder' | 'Follow-up' | 'Review';
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
export type TaskView = 'all_open' | 'unassigned' | 'me' | 'done';
```

## File: src/pages/Messaging/store/messaging.store.ts
```typescript
import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { mockTasks, mockContacts, mockAssignees } from '../data/mockData';
import type { Task, Contact, Channel, Assignee, TaskStatus, TaskPriority, TaskView } from '../types';
⋮----
const currentUserId = 'user-1'; // Mock current user
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
  getContactsByCompany: (companyName: string, currentContactId: string) => Contact[];
  getAvailableTags: () => string[];
}
⋮----
// Simulate a 2-second delay for the other user to "approve"
⋮----
export const useMessagingTaskCounts = () =>
⋮----
// Deferring the count calculation until after the first paint.
// This frees up the main thread for initial animations to run smoothly.
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

## File: src/hooks/useRightPaneContent.hook.tsx
```typescript
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Component,
  Bell,
  SlidersHorizontal,
  Database,
  MessageSquare,
  ExternalLink,
  Share,
} from 'lucide-react';
⋮----
import { DynamicViewProvider } from '@/features/dynamic-view/DynamicViewContext';
import { Button } from '@/components/ui/button';
import { DashboardContent } from "@/pages/Dashboard";
import { SettingsContent } from "@/features/settings/SettingsContent";
import { ToasterDemo } from "@/pages/ToasterDemo";
import { NotificationsPage } from "@/pages/Notifications";
import DataDemoPage from "@/pages/DataDemo/index";
import { DetailPanel } from '@/features/dynamic-view/components/shared/DetailPanel';
import { dataDemoViewConfig } from '@/pages/DataDemo/DataDemo.config';
import { mockDataItems } from "@/pages/DataDemo/data/mockData";
import type { DataDemoItem } from '@/pages/DataDemo/data/DataDemoItem';
import { MessagingContent } from "@/pages/Messaging/components/MessagingContent";
import type { AppShellState } from '@/store/appShell.store';
⋮----
{/* Application-specific actions can be composed here */}
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

## File: src/hooks/useAppViewManager.hook.ts
```typescript
import { useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAppShellStore, type AppShellState, type ActivePage } from '@/store/appShell.store';
import type { GenericItem, ViewMode, SortConfig, GroupableField, CalendarDateProp, CalendarDisplayProp, CalendarColorProp, FilterConfig } from '@/features/dynamic-view/types';
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
// Kanban view should default to grouping by status if no group is specified
⋮----
if (viewMode === 'kanban') return null; // Kanban is manually sorted
⋮----
if (!sortParam) return { key: 'updatedAt', direction: 'desc' }; // Default sort
⋮----
if (calDisplay === null) return []; // Default is now nothing
if (calDisplay === '') return []; // Explicitly empty is also nothing
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
const setSort = (config: SortConfig<string> | null) =>
const setTableSort = (field: string) =>
const setPage = (newPage: number) => handleParamsChange(
⋮----
// Calendar specific actions
const setCalendarDateProp = (prop: CalendarDateProp<string>) => handleParamsChange(
const setCalendarDisplayProps = (props: CalendarDisplayProp<string>[]) =>
⋮----
// Check for default state to keep URL clean
⋮----
const setCalendarItemLimit = (limit: number | 'all') => handleParamsChange(
const setCalendarColorProp = (prop: CalendarColorProp<string>) => handleParamsChange(
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

## File: src/pages/DataDemo/index.tsx
```typescript
import { useRef, useEffect, useCallback } from "react";
import {
  Layers,
  AlertTriangle,
  PlayCircle,
  TrendingUp,
  CheckCircle,
  Clock,
  Archive,
  PlusCircle,
} from "lucide-react";
import { DynamicView } from "@/features/dynamic-view/DynamicView";
import { PageLayout } from "@/components/shared/PageLayout";
import { useScrollToBottom } from "@/hooks/useScrollToBottom.hook";
import { ScrollToBottomButton } from "@/components/shared/ScrollToBottomButton";
import { mockDataItems } from "./data/mockData";
import { useAppViewManager } from "@/hooks/useAppViewManager.hook";
import { useDataDemoStore } from "./store/dataDemo.store";
import { AddDataItemCta } from "@/features/dynamic-view/components/shared/AddDataItemCta";
⋮----
import { dataDemoViewConfig } from "./DataDemo.config";
import type { StatItem } from "@/features/dynamic-view/types";
⋮----
export default function DataDemoPage()
⋮----
// Note: The `DynamicViewProvider` needs `GenericItem[]`.
// Our store uses `GenericItem` so no cast is needed.
⋮----
// Calculate stats from data
⋮----
// Controlled state
⋮----
// Callbacks
⋮----
// Custom Renderers
renderCta=
```
