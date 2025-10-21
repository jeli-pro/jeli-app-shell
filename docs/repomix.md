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

const MENU_ITEMS = {
  status: [
    { value: "focus", icon: "solar:emoji-funny-circle-line-duotone", label: "Focus" },
    { value: "offline", icon: "solar:moon-sleep-line-duotone", label: "Appear Offline" }
  ],
  profile: [
    { icon: "solar:user-circle-line-duotone", label: "Your profile", action: "profile" },
    { icon: "solar:sun-line-duotone", label: "Appearance", action: "appearance" },
    { icon: "solar:settings-line-duotone", label: "Settings", action: "settings" },
    { icon: "solar:bell-line-duotone", label: "Notifications", action: "notifications" }
  ],
  premium: [
    { 
      icon: "solar:star-bold", 
      label: "Upgrade to Pro", 
      action: "upgrade",
      iconClass: "text-amber-500",
      badge: { text: "20% off", className: "bg-amber-500 text-white text-[11px]" }
    },
    { icon: "solar:gift-line-duotone", label: "Referrals", action: "referrals" }
  ],
  support: [
    { icon: "solar:download-line-duotone", label: "Download app", action: "download" },
    { 
      icon: "solar:letter-unread-line-duotone", 
      label: "What's new?", 
      action: "whats-new",
      rightIcon: "solar:square-top-down-line-duotone"
    },
    { 
      icon: "solar:question-circle-line-duotone", 
      label: "Get help?", 
      action: "help",
      rightIcon: "solar:square-top-down-line-duotone"
    }
  ],
  account: [
    { 
      icon: "solar:users-group-rounded-bold-duotone", 
      label: "Switch account", 
      action: "switch",
      showAvatar: false
    },
    { icon: "solar:logout-2-bold-duotone", label: "Log out", action: "logout" }
  ]
};

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

interface User {
  name: string;
  username: string;
  avatar: string;
  initials: string;
  status: string;
}

interface UserDropdownProps {
  user?: User;
  onAction?: (action?: string) => void;
  onStatusChange?: (status: string) => void;
  selectedStatus?: string;
  promoDiscount?: string;
}

export const UserDropdown = ({ 
  user: propUser,
  onAction = (_action?: string) => {},
  onStatusChange = (_status: string) => {},
  selectedStatus = "online",
  promoDiscount = "20% off",
}: UserDropdownProps) => {
  const { user: authUser, logout } = useAuthStore();
  
  const user = propUser || {
    name: authUser?.name || "User",
    username: `@${authUser?.name?.toLowerCase() || "user"}`,
    avatar: `https://ui-avatars.com/api/?name=${authUser?.name || "User"}&background=0ea5e9&color=fff`,
    initials: authUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || "U",
    status: "online"
  };
  const handleAction = (action?: string) => {
    if (action === 'logout') {
      logout();
    } else {
      onAction(action);
    }
  };

  const renderMenuItem = (item: MenuItem, index: number) => (
    <DropdownMenuItem 
      key={index}
      className={cn(
        "px-3 py-2", // Consistent with base component
        item.badge || item.showAvatar || item.rightIcon ? "justify-between" : ""
      )}
      onClick={() => item.action && handleAction(item.action)}
    >
      <span className="flex items-center gap-2 font-medium">
        <Icon
          icon={item.icon}
          className={cn("h-5 w-5 text-muted-foreground", item.iconClass)}
        />
        {item.label}
      </span>
      {item.badge && (
        <Badge className={item.badge.className}>
          {promoDiscount || item.badge.text}
        </Badge>
      )}
      {item.rightIcon && (
        <Icon
          icon={item.rightIcon}
          className="h-4 w-4 text-muted-foreground"
        />
      )}
      {item.showAvatar && (
        <Avatar className="cursor-pointer h-6 w-6 shadow border-2 border-background">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
      )}
    </DropdownMenuItem>
  );

  const getStatusColor = (status: string) => {
    const colors = {
      online: "text-green-600 bg-green-100 border-green-300 dark:text-green-400 dark:bg-green-900/30 dark:border-green-500/50",
      offline: "text-muted-foreground bg-muted border-border",
      busy: "text-destructive bg-destructive/20 border-destructive/30"
    };
    return colors[status.toLowerCase() as keyof typeof colors] || colors.online;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer h-10 w-10 border-2 border-transparent hover:border-primary transition-colors">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="no-scrollbar w-[310px] p-2" align="end">
        <div className="flex items-center">
          <div className="flex-1 flex items-center gap-3">
            <Avatar className="cursor-pointer h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-muted-foreground text-sm">{user.username}</p>
            </div>
          </div>
          <Badge variant="outline" className={cn("border-[0.5px] text-xs font-normal rounded-md capitalize", getStatusColor(user.status))}>
            {user.status}
          </Badge>
        </div>
        
        <DropdownMenuSeparator className="my-2" />
        
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="w-full">
              <span className="flex items-center gap-2 font-medium">
                <Icon icon="solar:smile-circle-line-duotone" className="h-5 w-5" />
                Update status
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={selectedStatus} onValueChange={onStatusChange}>
                  {MENU_ITEMS.status.map((status, index) => (
                    <DropdownMenuRadioItem className="gap-2" key={index} value={status.value}>
                      <Icon icon={status.icon} className="h-5 w-5 text-muted-foreground" />
                      {status.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuGroup>
          {MENU_ITEMS.profile.map(renderMenuItem)}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuGroup>
          {MENU_ITEMS.premium.map(renderMenuItem)}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuGroup>
          {MENU_ITEMS.support.map(renderMenuItem)}
        </DropdownMenuGroup>
     
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuGroup>
          {MENU_ITEMS.account.map(renderMenuItem)}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

## File: src/components/shared/ContentInSidePanePlaceholder.tsx
```typescript
import { ChevronsLeftRight } from 'lucide-react'

interface ContentInSidePanePlaceholderProps {
  icon: React.ElementType
  title: string
  pageName: string
  onBringBack: () => void
}

export function ContentInSidePanePlaceholder({
  icon: Icon,
  title,
  pageName,
  onBringBack,
}: ContentInSidePanePlaceholderProps) {
  const capitalizedPageName = pageName
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4 h-full">
      <Icon className="w-16 h-16 text-muted-foreground/50 mb-4" />
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        You've moved {pageName} to the side pane. You can bring it back or
        continue to navigate.
      </p>
      <button
        onClick={onBringBack}
        className="mt-6 bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 h-10"
      >
        <ChevronsLeftRight className="w-5 h-5" />
        <span>Bring {capitalizedPageName} Back</span>
      </button>
    </div>
  )
}
```

## File: src/components/shared/PageHeader.tsx
```typescript
import * as React from 'react';

interface PageHeaderProps {
  title: string;
  description: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
```

## File: src/components/ui/avatar.tsx
```typescript
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
```

## File: src/components/ui/card.tsx
```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border bg-card text-card-foreground",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

## File: src/components/ui/command.tsx
```typescript
import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex h-14 items-center border-b px-4" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-full w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[450px] overflow-y-auto overflow-x-hidden p-2", className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-lg px-4 py-2.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
```

## File: src/components/ui/dialog.tsx
```typescript
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-card p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        "sm:rounded-2xl",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```

## File: src/components/ui/dropdown-menu.tsx
```typescript
import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-lg py-2 pl-8 pr-3 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-lg py-2 pl-8 pr-3 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
```

## File: src/components/ui/input.tsx
```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

## File: src/components/ui/label.tsx
```typescript
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

## File: src/components/ui/popover.tsx
```typescript
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  useTriggerWidth?: boolean
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  ({ className, align = "center", sideOffset = 4, useTriggerWidth = false, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-xl border bg-popover p-4 text-popover-foreground shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        useTriggerWidth && "w-[var(--radix-popover-trigger-width)]",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
export type { PopoverContentProps }
```

## File: src/components/ui/tabs.tsx
```typescript
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

## File: src/features/settings/SettingsSection.tsx
```typescript
import * as React from 'react'

interface SettingsSectionProps {
  icon: React.ReactElement
  title: string
  children: React.ReactNode
}

export function SettingsSection({ icon, title, children }: SettingsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        {React.cloneElement(icon, { className: 'w-4 h-4' })}
        {title}
      </h3>
      {children}
    </div>
  )
}
```

## File: src/features/settings/SettingsToggle.tsx
```typescript
import * as React from 'react'
import { cn } from '@/lib/utils'

interface SettingsToggleProps {
  icon: React.ReactNode
  title: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function SettingsToggle({
  icon,
  title,
  description,
  checked,
  onCheckedChange,
}: SettingsToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
          checked ? 'bg-primary' : 'bg-muted'
        )}
      >
        <span
          className={cn(
            'inline-block h-5 w-5 transform rounded-full bg-background transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  )
}
```

## File: src/pages/Settings/index.tsx
```typescript
import { SettingsContent } from '@/features/settings/SettingsContent';
import { useAutoAnimateTopBar } from '@/hooks/useAutoAnimateTopBar';
import { PageHeader } from '@/components/shared/PageHeader';
import { PageLayout } from '@/components/shared/PageLayout';

export function SettingsPage() {
  const { onScroll } = useAutoAnimateTopBar();

  return (
    <PageLayout onScroll={onScroll}>
      {/* Header */}
      <PageHeader
        title="Settings"
        description="Customize your experience. Changes are saved automatically."
      />
      <SettingsContent />
    </PageLayout>
  )
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

## File: postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
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

## File: src/components/auth/useLoginForm.hook.ts
```typescript
import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

type LoginState = 'login' | 'forgot-password' | 'reset-sent';

export function useLoginForm() {
  const [state, setState] = useState<LoginState>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, forgotPassword } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname + location.state?.from?.search || "/";

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      // In a real app, you'd show an error message to the user
      setErrors({ email: 'Invalid credentials', password: ' ' }); // Add a generic error
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setState('reset-sent');
    } catch (error) {
      console.error("Forgot password failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    // In a real app, navigate to sign up page
    console.log("Navigate to sign up page");
  };

  return {
    state,
    setState,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    errors,
    showPassword,
    setShowPassword,
    handleLoginSubmit,
    handleForgotSubmit,
    handleSignUp,
  };
}
```

## File: src/components/effects/AnimatedInput.tsx
```typescript
import React, { memo, forwardRef, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const AnimatedInput = memo(
	forwardRef(function Input(
		{ className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>,
		ref: React.ForwardedRef<HTMLInputElement>,
	) {
		const radius = 100;
		const wrapperRef = useRef<HTMLDivElement>(null);

		useEffect(() => {
			const wrapper = wrapperRef.current;
			if (!wrapper) return;

			let animationFrameId: number | null = null;

			const handleMouseMove = (e: MouseEvent) => {
				if (animationFrameId) {
					cancelAnimationFrame(animationFrameId);
				}

				animationFrameId = requestAnimationFrame(() => {
					if (!wrapper) return;
					const { left, top } = wrapper.getBoundingClientRect();
					const x = e.clientX - left;
					const y = e.clientY - top;
					wrapper.style.setProperty('--mouse-x', `${x}px`);
					wrapper.style.setProperty('--mouse-y', `${y}px`);
				});
			};

			const handleMouseEnter = () => {
				if (!wrapper) return;
				wrapper.style.setProperty('--radius', `${radius}px`);
			};

			const handleMouseLeave = () => {
				if (!wrapper) return;
				wrapper.style.setProperty('--radius', '0px');
				if (animationFrameId) {
					cancelAnimationFrame(animationFrameId);
					animationFrameId = null;
				}
			};

			wrapper.addEventListener('mousemove', handleMouseMove);
			wrapper.addEventListener('mouseenter', handleMouseEnter);
			wrapper.addEventListener('mouseleave', handleMouseLeave);

			return () => {
				wrapper.removeEventListener('mousemove', handleMouseMove);
				wrapper.removeEventListener('mouseenter', handleMouseEnter);
				wrapper.removeEventListener('mouseleave', handleMouseLeave);
				if (animationFrameId) {
					cancelAnimationFrame(animationFrameId);
				}
			};
		}, [radius]);

		return (
			<div
				ref={wrapperRef}
				style={
					{
						'--radius': '0px',
						'--mouse-x': '0px',
						'--mouse-y': '0px',
						background: `radial-gradient(var(--radius) circle at var(--mouse-x) var(--mouse-y), #3b82f6, transparent 80%)`,
					} as React.CSSProperties
				}
				className="group/input rounded-lg p-[2px] transition duration-300"
			>
				<input
					type={type}
					className={cn(
						`shadow-input dark:placeholder-text-neutral-600 flex h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-600`,
						className,
					)}
					ref={ref}
					{...props}
				/>
			</div>
		);
	}),
);
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

type BoxRevealProps = {
	children: ReactNode;
	width?: string;
	boxColor?: string;
	duration?: number;
	className?: string;
};

export const BoxReveal = memo(function BoxReveal({
	children,
	width = 'fit-content',
	boxColor,
	duration,
	className,
}: BoxRevealProps) {
	const sectionRef = useRef<HTMLDivElement>(null);
	const boxRef = useRef<HTMLDivElement>(null);
	const childRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						gsap.timeline()
							.set(childRef.current, { opacity: 0, y: 50 })
							.set(boxRef.current, { transformOrigin: 'right' })
							.to(boxRef.current, {
								scaleX: 0,
								duration: duration ?? 0.5,
								ease: 'power3.inOut',
							})
							.to(
								childRef.current,
								{ y: 0, opacity: 1, duration: duration ?? 0.5, ease: 'power3.out' },
								'-=0.3',
							);
						observer.unobserve(section);
					}
				});
			},
			{ threshold: 0.1 },
		);

		observer.observe(section);

		return () => {
			if (section) {
				observer.unobserve(section);
			}
		};
	}, [duration]);

	return (
		<div ref={sectionRef} style={{ width }} className={cn('relative overflow-hidden', className)}>
			<div ref={childRef}>{children}</div>
			<div
				ref={boxRef}
				style={{
					background: boxColor ?? 'hsl(var(--skeleton))',
				}}
				className="absolute top-1 bottom-1 left-0 right-0 z-20 rounded-sm"
			/>
		</div>
	);
});
```

## File: src/components/effects/OrbitingCircles.tsx
```typescript
import React, { ReactNode, memo } from 'react';
import { cn } from '@/lib/utils';

export const OrbitingCircles = memo(function OrbitingCircles({
	className,
	children,
	reverse = false,
	duration = 20,
	delay = 10,
	radius = 50,
	path = true,
}: {
	className?: string;
	children?: React.ReactNode;
	reverse?: boolean;
	duration?: number;
	delay?: number;
	radius?: number;
	path?: boolean;
}) {
	return (
		<>
			{path && (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					version="1.1"
					className="pointer-events-none absolute inset-0 size-full"
				>
					<circle
						className="stroke-black/10 stroke-1 dark:stroke-white/10"
						cx="50%"
						cy="50%"
						r={radius}
						fill="none"
					/>
				</svg>
			)}
			<div
				style={
					{
						'--duration': duration,
						'--radius': radius,
						'--delay': -delay,
					} as React.CSSProperties
				}
				className={cn(
					'absolute flex size-full transform-gpu animate-orbit items-center justify-center rounded-full border bg-black/10 [animation-delay:calc(var(--delay)*1s)] dark:bg-white/10',
					{ '[animation-direction:reverse]': reverse },
					className,
				)}
			>
				{children}
			</div>
		</>
	);
});


interface OrbitIcon {
	component: () => ReactNode;
	className: string;
	duration?: number;
	delay?: number;
	radius?: number;
	path?: boolean;
	reverse?: boolean;
}

const iconsArray: OrbitIcon[] = [
	{ component: () => <img width={30} height={30} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' alt='HTML5' />, className: 'size-[30px] border-none bg-transparent', duration: 20, delay: 20, radius: 100, path: false, reverse: false },
	{ component: () => <img width={30} height={30} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' alt='CSS3' />, className: 'size-[30px] border-none bg-transparent', duration: 20, delay: 10, radius: 100, path: false, reverse: false },
	{ component: () => <img width={50} height={50} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' alt='TypeScript' />, className: 'size-[50px] border-none bg-transparent', radius: 210, duration: 20, path: false, reverse: false },
	{ component: () => <img width={50} height={50} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' alt='JavaScript' />, className: 'size-[50px] border-none bg-transparent', radius: 210, duration: 20, delay: 20, path: false, reverse: false },
	{ component: () => <img width={30} height={30} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' alt='TailwindCSS' />, className: 'size-[30px] border-none bg-transparent', duration: 20, delay: 20, radius: 150, path: false, reverse: true },
	{ component: () => <img width={30} height={30} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg' alt='Nextjs' />, className: 'size-[30px] border-none bg-transparent', duration: 20, delay: 10, radius: 150, path: false, reverse: true },
	{ component: () => <img width={50} height={50} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' alt='React' />, className: 'size-[50px] border-none bg-transparent', radius: 270, duration: 20, path: false, reverse: true },
	{ component: () => <img width={50} height={50} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' alt='Figma' />, className: 'size-[50px] border-none bg-transparent', radius: 270, duration: 20, delay: 60, path: false, reverse: true },
	{ component: () => <img width={50} height={50} src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' alt='Git' />, className: 'size-[50px] border-none bg-transparent', radius: 320, duration: 20, delay: 20, path: false, reverse: false },
];

export const TechOrbitDisplay = memo(function TechOrbitDisplay({ text = 'Jeli App Shell' }: { text?: string }) {
	return (
		<div className="relative flex size-full flex-col items-center justify-center overflow-hidden rounded-lg">
			<span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-7xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
				{text}
			</span>
			{iconsArray.map((icon, index) => (
				<OrbitingCircles key={index} {...icon}>
					{icon.component()}
				</OrbitingCircles>
			))}
		</div>
	);
});
```

## File: src/components/effects/Ripple.tsx
```typescript
import React, { memo } from 'react';

interface RippleProps {
	mainCircleSize?: number;
	mainCircleOpacity?: number;
	numCircles?: number;
}

export const Ripple = memo(function Ripple({
	mainCircleSize = 210,
	mainCircleOpacity = 0.24,
	numCircles = 11,
}: RippleProps) {
	return (
		<div className="absolute inset-0 flex items-center justify-center [mask-image:linear-gradient(to_bottom,white,transparent)]">
			{Array.from({ length: numCircles }, (_, i) => {
				const size = mainCircleSize + i * 70;
				const opacity = mainCircleOpacity - i * 0.03;
				const animationDelay = `${i * 0.06}s`;
				const borderStyle = i === numCircles - 1 ? 'dashed' : 'solid';
				const borderOpacity = 5 + i * 5;

				return (
					<div
						key={i}
						className="absolute animate-ripple rounded-full border"
						style={
							{
								width: `${size}px`,
								height: `${size}px`,
								opacity: opacity,
								animationDelay: animationDelay,
								borderStyle: borderStyle,
								borderWidth: '1px',
								borderColor: `hsl(var(--foreground) / ${borderOpacity / 100})`,
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
							} as React.CSSProperties
						}
					/>
				);
			})}
		</div>
	);
});
```

## File: src/components/layout/WorkspaceSwitcher.tsx
```typescript
import * as React from 'react';
import { CheckIcon, ChevronsUpDownIcon, Search } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	type PopoverContentProps,
} from '@/components/ui/popover';

// Generic workspace interface - can be extended
export interface Workspace {
	id: string;
	name: string;
	logo?: string;
	plan?: string;
	[key: string]: unknown; // Allow additional properties
}

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WorkspaceContext = React.createContext<WorkspaceContextValue<any> | null>(
	null,
);

function useWorkspaceContext<T extends Workspace>() {
	const context = React.useContext(
		WorkspaceContext,
	) as WorkspaceContextValue<T> | null;
	if (!context) {
		throw new Error(
			'Workspace components must be used within WorkspaceProvider',
		);
	}
	return context;
}

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

function WorkspaceProvider<T extends Workspace>({
	children,
	workspaces,
	selectedWorkspaceId,
	onWorkspaceChange,
	open: controlledOpen,
	onOpenChange,
	getWorkspaceId = (workspace) => workspace.id,
	getWorkspaceName = (workspace) => workspace.name,
}: WorkspaceProviderProps<T>) {
	const [internalOpen, setInternalOpen] = React.useState(false);

	const open = controlledOpen ?? internalOpen;
	const setOpen = onOpenChange ?? setInternalOpen;

	const selectedWorkspace = React.useMemo(() => {
		if (!selectedWorkspaceId) return workspaces[0];
		return (
			workspaces.find((ws) => getWorkspaceId(ws) === selectedWorkspaceId) ||
			workspaces[0]
		);
	}, [workspaces, selectedWorkspaceId, getWorkspaceId]);

	const handleWorkspaceSelect = React.useCallback(
		(workspace: T) => {
			onWorkspaceChange?.(workspace);
			setOpen(false);
		},
		[onWorkspaceChange, setOpen],
	);

	const value: WorkspaceContextValue<T> = {
		open,
		setOpen,
		selectedWorkspace,
		workspaces,
		onWorkspaceSelect: handleWorkspaceSelect,
		getWorkspaceId,
		getWorkspaceName,
	};

	return (
		<WorkspaceContext.Provider value={value}>
			<Popover open={open} onOpenChange={setOpen}>
				{children}
			</Popover>
		</WorkspaceContext.Provider>
	);
}

// Trigger component
interface WorkspaceTriggerProps extends React.ComponentProps<'button'> {
	renderTrigger?: (workspace: Workspace, isOpen: boolean) => React.ReactNode;
  collapsed?: boolean;
  avatarClassName?: string;
}

function WorkspaceTrigger({
	className,
	renderTrigger,
  collapsed = false,
  avatarClassName,
	...props
}: WorkspaceTriggerProps) {
	const { open, selectedWorkspace, getWorkspaceName } = useWorkspaceContext();

	if (!selectedWorkspace) return null;

	if (renderTrigger) {
		return (
			<PopoverTrigger asChild>
				<button className={className} {...props}>
					{renderTrigger(selectedWorkspace, open)}
				</button>
			</PopoverTrigger>
		);
	}

	return (
		<PopoverTrigger asChild>
			<button
				data-state={open ? 'open' : 'closed'}
				className={cn(
					'flex w-full items-center justify-between text-sm',
					'focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none',
					className,
				)}
				{...props}
			>
				<div className={cn("flex items-center gap-3", collapsed ? "w-full justify-center" : "min-w-0 flex-1")}>
					<Avatar className={cn(avatarClassName)}>
						<AvatarImage
							src={selectedWorkspace.logo}
							alt={getWorkspaceName(selectedWorkspace)}
						/>
						<AvatarFallback className="text-xs">
							{getWorkspaceName(selectedWorkspace).charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					{!collapsed && (
						<div className="flex min-w-0 flex-1 flex-col items-start">
							<span className="truncate font-medium">{getWorkspaceName(selectedWorkspace)}</span>
							<span className="text-muted-foreground truncate text-xs">{selectedWorkspace.plan}</span>
						</div>
					)}
				</div>
				{!collapsed && <ChevronsUpDownIcon className="h-4 w-4 shrink-0 opacity-50" />}
			</button>
		</PopoverTrigger>
	);
}

// Content component
interface WorkspaceContentProps
	extends PopoverContentProps {
	renderWorkspace?: (
		workspace: Workspace,
		isSelected: boolean,
	) => React.ReactNode;
	title?: string;
	searchable?: boolean;
	onSearch?: (query: string) => void;
}

function WorkspaceContent({
	className,
	children,
	renderWorkspace,
	title = 'Workspaces',
	searchable = false,
	onSearch,
	side = 'right',
	align = 'start',
	sideOffset = 8,
	useTriggerWidth = false,
	...props
}: WorkspaceContentProps) {
	const {
		workspaces,
		selectedWorkspace,
		onWorkspaceSelect,
		getWorkspaceId,
		getWorkspaceName,
	} = useWorkspaceContext();

	const [searchQuery, setSearchQuery] = React.useState('');

	const filteredWorkspaces = React.useMemo(() => {
		if (!searchQuery) return workspaces;
		return workspaces.filter((ws) =>
			getWorkspaceName(ws).toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [workspaces, searchQuery, getWorkspaceName]);

	React.useEffect(() => {
		onSearch?.(searchQuery);
	}, [searchQuery, onSearch]);

	const defaultRenderWorkspace = (
		workspace: Workspace,
		isSelected: boolean,
	) => (
		<div className="flex min-w-0 flex-1 items-center gap-2">
			<Avatar className="h-6 w-6">
				<AvatarImage
					src={workspace.logo}
					alt={getWorkspaceName(workspace)}
				/>
				<AvatarFallback className="text-xs">
					{getWorkspaceName(workspace).charAt(0).toUpperCase()}
				</AvatarFallback>
			</Avatar>
			<div className="flex min-w-0 flex-1 flex-col items-start">
				<span className="truncate text-sm">{getWorkspaceName(workspace)}</span>
				{workspace.plan && (
					<span className="text-muted-foreground text-xs">
						{workspace.plan}
					</span>
				)}
			</div>
			{isSelected && <CheckIcon className="ml-auto h-4 w-4" />}
		</div>
	);

	return (
		<PopoverContent
			className={cn('p-0', className)}
			align={align}
			sideOffset={sideOffset}
			useTriggerWidth={useTriggerWidth}
			{...{ ...props, side }}
		>
			<div className="border-b px-4 py-3">
				<h3 className="text-sm font-semibold text-foreground">{title}</h3>
			</div>

			{searchable && (
				<div className="border-b p-2">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<input
							type="text"
							placeholder="Search workspaces..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="h-9 w-full rounded-md bg-transparent pl-9 text-sm placeholder:text-muted-foreground focus:bg-accent focus:outline-none"
						/>
					</div>
				</div>
			)}

			<div className="max-h-[300px] overflow-y-auto">
				{filteredWorkspaces.length === 0 ? (
					<div className="text-muted-foreground px-3 py-2 text-center text-sm">
						No workspaces found
					</div>
				) : (
					<div className="space-y-1 p-2">
						{filteredWorkspaces.map((workspace) => {
							const isSelected =
								selectedWorkspace &&
								getWorkspaceId(selectedWorkspace) === getWorkspaceId(workspace);

							return (
								<button
									key={getWorkspaceId(workspace)}
									onClick={() => onWorkspaceSelect(workspace)}
									className={cn(
										'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm',
										'hover:bg-accent hover:text-accent-foreground',
										'focus:outline-none',
										isSelected && 'bg-accent text-accent-foreground',
									)}
								>
									{renderWorkspace
										? renderWorkspace(workspace, !!isSelected)
										: defaultRenderWorkspace(workspace, !!isSelected)}
								</button>
							);
						})}
					</div>
				)}
			</div>

			{children && (
				<>
					<div className="border-t" />
					<div className="p-1">{children}</div>
				</>
			)}
		</PopoverContent>
	);
}

export { WorkspaceProvider as Workspaces, WorkspaceTrigger, WorkspaceContent };
```

## File: src/components/shared/ScrollToBottomButton.tsx
```typescript
import { ArrowDown } from 'lucide-react';

interface ScrollToBottomButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

export function ScrollToBottomButton({ isVisible, onClick }: ScrollToBottomButtonProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="absolute bottom-8 right-8 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all animate-fade-in z-[51]"
      style={{ animation: 'bounce 2s infinite' }}
      title="Scroll to bottom"
    >
      <ArrowDown className="w-6 h-6" />
    </button>
  );
}
```

## File: src/components/ui/badge.tsx
```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
```

## File: src/components/ui/button.tsx
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
```

## File: src/components/ui/checkbox.tsx
```typescript
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
```

## File: src/components/ui/radio-group.tsx
```typescript
"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
```

## File: src/components/ui/scroll-area.tsx
```typescript
"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
```

## File: src/components/ui/separator.tsx
```typescript
"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
```

## File: src/components/ui/skeleton.tsx
```typescript
import { cn } from "@/lib/utils";
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
export { Skeleton };
```

## File: src/components/ui/slider.tsx
```typescript
"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
```

## File: src/components/ui/switch.tsx
```typescript
"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
```

## File: src/components/ui/textarea.tsx
```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
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

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Variant = "default" | "success" | "error" | "warning";
type Position =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost";
}

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

export interface ToasterRef {
  show: (props: ToasterProps) => void;
}

const variantStyles: Record<Variant, string> = {
  default: "border-border",
  success: "border-green-600/50",
  error: "border-destructive/50",
  warning: "border-amber-600/50",
};

const titleColor: Record<Variant, string> = {
  default: "text-foreground",
  success: "text-green-600 dark:text-green-400",
  error: "text-destructive",
  warning: "text-amber-600 dark:text-amber-400",
};

const iconColor: Record<Variant, string> = {
  default: "text-muted-foreground",
  success: "text-green-600 dark:text-green-400",
  error: "text-destructive",
  warning: "text-amber-600 dark:text-amber-400",
};

const variantIcons: Record<
  Variant,
  React.ComponentType<{ className?: string }>
> = {
  default: Info,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
};

const CustomToast = ({
  toastId,
  title,
  message,
  variant = "default",
  actions,
  highlightTitle,
}: Omit<ToasterProps, "duration" | "position" | "onDismiss"> & {
  toastId: number | string;
}) => {
  const Icon = variantIcons[variant];

  const handleDismiss = () => {
    sonnerToast.dismiss(toastId);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between w-full max-w-sm p-4 rounded-lg border shadow-xl bg-popover text-popover-foreground",
        variantStyles[variant],
      )}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn("h-5 w-5 mt-0.5 flex-shrink-0", iconColor[variant])}
        />
        <div className="space-y-1">
          {title && (
            <h3
              className={cn(
                "text-sm font-semibold leading-none",
                titleColor[variant],
                highlightTitle && titleColor["success"],
              )}
            >
              {title}
            </h3>
          )}
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {actions?.label && (
          <Button
            variant={actions.variant || "outline"}
            size="sm"
            onClick={() => {
              actions.onClick();
              handleDismiss();
            }}
            className={cn(
              "h-8 px-3 text-xs cursor-pointer",
              variant === "success"
                ? "text-green-600 border-green-600 hover:bg-green-600/10 dark:hover:bg-green-400/20"
                : variant === "error"
                  ? "text-destructive border-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20"
                  : variant === "warning"
                    ? "text-amber-600 border-amber-600 hover:bg-amber-600/10 dark:hover:bg-amber-400/20"
                    : "text-foreground border-border hover:bg-muted/10 dark:hover:bg-muted/20",
            )}
          >
            {actions.label}
          </Button>
        )}
        <button
          onClick={handleDismiss}
          className="rounded-md p-1 hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

const Toaster = forwardRef<ToasterRef, { defaultPosition?: Position }>(
  ({ defaultPosition = "bottom-right" }, ref) => {
    useImperativeHandle(ref, () => ({
      show({
        title,
        message,
        variant = "default",
        duration = 4000,
        position = defaultPosition,
        actions,
        onDismiss,
        highlightTitle,
      }) {
        sonnerToast.custom(
          (toastId) => (
            <CustomToast
              toastId={toastId}
              title={title}
              message={message}
              variant={variant}
              actions={actions}
              highlightTitle={highlightTitle}
            />
          ),
          {
            duration,
            position,
            onDismiss,
          },
        );
      },
    }));

    return (
      <SonnerToaster
        position={defaultPosition}
        toastOptions={{
          // By removing `unstyled`, sonner handles positioning and animations.
          // We then use `classNames` to override only the styles we don't want,
          // allowing our custom component to define the appearance.
          classNames: {
            toast: "p-0 border-none shadow-none bg-transparent", // Neutralize wrapper styles
            // We can add specific styling to other parts if needed
            // closeButton: '...',
          },
        }}
        // The z-index is still useful as a safeguard
        className="z-[2147483647]"
      />
    );
  },
);
Toaster.displayName = "Toaster";

const ToasterContext = createContext<((props: ToasterProps) => void) | null>(
  null,
);

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error("useToast must be used within a ToasterProvider");
  }
  return { show: context };
};

export const ToasterProvider = ({ children }: { children: ReactNode }) => {
  const toasterRef = useRef<ToasterRef>(null);

  const showToast = useCallback((props: ToasterProps) => {
    toasterRef.current?.show(props);
  }, []);

  return (
    <ToasterContext.Provider value={showToast}>
      {children}
      <Toaster ref={toasterRef} />
    </ToasterContext.Provider>
  );
};
```

## File: src/components/ui/tooltip.tsx
```typescript
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
```

## File: src/features/dynamic-view/components/shared/DraggableSection.tsx
```typescript
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface DraggableSectionProps {
  id: string;
  children: React.ReactNode;
}

export function DraggableSection({ id, children }: DraggableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn('relative group', isDragging && 'opacity-50 z-50')}>
      <button
        {...attributes}
        {...listeners}
        className="absolute top-4 left-0 -translate-x-full pr-2 p-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-5 h-5" />
      </button>
      {children}
    </div>
  );
}
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

interface EditableFieldProps<TFieldId extends string, TItem extends GenericItem> {
  item: TItem;
  fieldId: TFieldId;
  className?: string;
  options?: Record<string, any>;
}

// Mock user list for assignee field
const userList = Array.from(new Set(mockDataItems.map(i => i.assignee.email)))
  .map(email => mockDataItems.find(i => i.assignee.email === email)?.assignee)
  .filter(Boolean) as { name: string; email: string; avatar: string }[];


export function EditableField<TFieldId extends string, TItem extends GenericItem>({
  item,
  fieldId,
  className,
  options,
}: EditableFieldProps<TFieldId, TItem>) {
  const { config, getFieldDef, onItemUpdate } = useDynamicView<TFieldId, TItem>();
  const [isEditing, setIsEditing] = useState(false);
  const fieldDef = getFieldDef(fieldId);
  const value = getNestedValue(item, fieldId);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && (fieldDef?.type === 'string' || fieldDef?.type === 'longtext' || fieldDef?.type === 'thumbnail')) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing, fieldDef]);

  if (!fieldDef || !onItemUpdate) {
    return <FieldRenderer item={item} fieldId={fieldId} className={className} options={options} />;
  }

  const handleUpdate = (newValue: any) => {
    if (value !== newValue) {
      onItemUpdate(item.id, { [fieldId]: newValue } as Partial<TItem>);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !(e.currentTarget instanceof HTMLTextAreaElement)) {
      handleUpdate(e.currentTarget.value);
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const renderEditComponent = () => {
    switch (fieldDef.type) {
      case 'string':
      case 'thumbnail': // For emoji
        return (
          <Input
            ref={inputRef as React.Ref<HTMLInputElement>}
            type="text"
            defaultValue={value}
            onBlur={(e) => handleUpdate(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-auto p-1 bg-transparent border-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
          />
        );
      case 'longtext':
        return (
          <Textarea
            ref={inputRef as React.Ref<HTMLTextAreaElement>}
            defaultValue={value}
            onBlur={(e) => handleUpdate(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-sm w-full p-1 bg-transparent border-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
          />
        );
      case 'badge': {
        const filterableField = config.filterableFields.find((f) => f.id === fieldId);
        const badgeOptions: readonly ControlOption<string>[] = filterableField?.options || [];
        return (
          <Popover open={isEditing} onOpenChange={setIsEditing}>
            <PopoverTrigger asChild>
              <div className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"></div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[200px]" align="start">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {badgeOptions.map((option) => (
                      <CommandItem key={option.id} onSelect={() => handleUpdate(option.id)}>
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      }
      case 'progress': {
        const progressValue = typeof value === 'number' ? value : 0;
        return (
           <div className="flex items-center gap-3 w-full">
            <Slider
              value={[progressValue]}
              max={100} step={1}
              onValueCommit={(val) => handleUpdate(val[0])}
              className="flex-1"
            />
            <span className="text-sm font-medium text-muted-foreground w-10 text-right">{progressValue}%</span>
           </div>
        );
      }
      case 'avatar': {
        return (
          <Popover open={isEditing} onOpenChange={setIsEditing}>
            <PopoverTrigger asChild>
               <div className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"></div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[250px]" align="start">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {userList.map((user) => (
                      <CommandItem key={user.email} onSelect={() => handleUpdate(user)}>
                          <FieldRenderer item={{ assignee: user } as TItem} fieldId={'assignee' as TFieldId} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      }
      case 'date': {
        return (
          <Input
            autoFocus
            type="date"
            defaultValue={value ? new Date(value).toISOString().split('T')[0] : ''}
            onChange={(e) => {
              const date = e.target.valueAsDate;
              if (date) {
                const originalDate = value ? new Date(value) : new Date();
                date.setHours(originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds());
                handleUpdate(date.toISOString());
              }
            }}
            onBlur={() => setIsEditing(false)}
            className="h-8"
          />
        )
      }
      default:
        return <FieldRenderer item={item} fieldId={fieldId} className={className} options={options} />;
    }
  };

  return (
    <div className={cn("w-full group relative", className)} onClick={() => !isEditing && setIsEditing(true)}>
      {isEditing ? (
        renderEditComponent()
      ) : (
        <div className={cn(
          "hover:bg-accent/50 rounded-md transition-colors cursor-text min-h-[32px] w-full p-1",
           fieldDef.type === 'longtext' ? 'flex items-start' : 'flex items-center'
        )}>
            <FieldRenderer item={item} fieldId={fieldId} options={options} />
        </div>
      )}
       {/* For Popover fields, the editor is always rendered when isEditing is true to control its open state */}
       {isEditing && ['badge', 'avatar'].includes(fieldDef.type) && renderEditComponent()}
    </div>
  );
}
```

## File: src/hooks/useCommandPaletteToggle.hook.ts
```typescript
import { useEffect } from 'react';
import { useAppShellStore } from '@/store/appShell.store';

export function useCommandPaletteToggle() {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        const { isCommandPaletteOpen, setCommandPaletteOpen } = useAppShellStore.getState();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
}
```

## File: src/hooks/useResizeObserver.hook.ts
```typescript
import { useState, useEffect } from 'react';

interface Dimensions {
  width: number;
  height: number;
}

export function useResizeObserver<T extends HTMLElement>(
  ref: React.RefObject<T>
): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [ref]);

  return dimensions;
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

interface AIInsightsPanelProps {
  task: (Task & { contact: Contact; assignee: Assignee | null });
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ task }) => {
    const { aiSummary } = task;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    return (
        <div className="space-y-6">
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
                      <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                    </Button>
                  ))}
                </div>
            </div>
        </div>
    )
}
```

## File: src/pages/Messaging/components/ChannelIcons.tsx
```typescript
import { Instagram, MessageCircle, Facebook } from 'lucide-react';
import type { Channel, ChannelIcon as ChannelIconType } from '../types';
import { cn } from '@/lib/utils';

export const channelMap: Record<Channel, ChannelIconType> = {
  whatsapp: { Icon: MessageCircle, color: 'text-green-500' },
  instagram: { Icon: Instagram, color: 'text-pink-500' },
  facebook: { Icon: Facebook, color: 'text-blue-600' },
};

export const ChannelIcon: React.FC<{ channel: Channel; className?: string }> = ({ channel, className }) => {
  const { Icon, color } = channelMap[channel];
  return <Icon className={cn('w-4 h-4', color, className)} />;
};
```

## File: src/pages/Messaging/components/NotesPanel.tsx
```typescript
import React from 'react';
import { format } from 'date-fns';
import { Send } from 'lucide-react';
import type { Contact } from '../types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface NotesPanelProps {
  contact: Contact;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({ contact }) => {
    return (
        <div className="space-y-4">
            {contact.notes.map(note => (
                <div key={note.id} className="text-sm bg-accent/50 p-3 rounded-lg"><p className="mb-1.5">{note.content}</p><p className="text-xs text-muted-foreground">{format(new Date(note.createdAt), "MMM d, yyyy")}</p></div>
            ))}
            <div className="relative">
                <Textarea placeholder="Add a new note..." className="min-h-[60px]" />
                <Button size="icon" className="absolute right-2 bottom-2 h-7 w-7"><Send className="w-3.5 h-3.5" /></Button>
            </div>
        </div>
    )
}
```

## File: src/pages/Messaging/components/TakeoverBanner.tsx
```typescript
import React from 'react';
import { Bot, UserCheck, Loader2 } from 'lucide-react';
import type { Assignee } from '../types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TakeoverBannerProps {
  activeHandler: Assignee;
  isRequesting: boolean;
  onTakeOver: () => void;
  onRequestTakeover: () => void;
}

export const TakeoverBanner: React.FC<TakeoverBannerProps> = ({
  activeHandler,
  isRequesting,
  onTakeOver,
  onRequestTakeover,
}) => {
  const isAi = activeHandler.type === 'ai';

  return (
    <div className="p-3 border-b bg-muted/30 text-sm text-foreground/80 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {isAi ? (
          <Bot className="w-5 h-5 text-blue-500 flex-shrink-0" />
        ) : (
          <UserCheck className="w-5 h-5 text-amber-500 flex-shrink-0" />
        )}
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={activeHandler.avatar} />
            <AvatarFallback>{activeHandler.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground/90">{activeHandler.name}</span>
          <span>{isAi ? 'is handling this task.' : 'is viewing this task.'}</span>
        </div>
      </div>
      
      {isAi ? (
        <Button size="sm" onClick={onTakeOver}>
          Take Over
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={onRequestTakeover} disabled={isRequesting}>
          {isRequesting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Requesting...
            </>
          ) : (
            'Request Takeover'
          )}
        </Button>
      )}
    </div>
  );
};
```

## File: src/pages/Notifications/notifications.store.ts
```typescript
import { create } from 'zustand';

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

const initialNotifications: Array<Notification> = [
    { id: 1, type: "comment", user: { name: "Amélie", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Amélie", fallback: "A" }, action: "commented in", target: "Dashboard 2.0", content: "Really love this approach. I think this is the best solution for the document sync UX issue.", timestamp: "Friday 3:12 PM", timeAgo: "2 hours ago", isRead: false },
    { id: 2, type: "follow", user: { name: "Sienna", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sienna", fallback: "S" }, action: "followed you", timestamp: "Friday 3:04 PM", timeAgo: "2 hours ago", isRead: false },
    { id: 3, type: "invitation", user: { name: "Ammar", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Ammar", fallback: "A" }, action: "invited you to", target: "Blog design", timestamp: "Friday 2:22 PM", timeAgo: "3 hours ago", isRead: true, hasActions: true },
    { id: 4, type: "file_share", user: { name: "Mathilde", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Mathilde", fallback: "M" }, action: "shared a file in", target: "Dashboard 2.0", file: { name: "Prototype recording 01.mp4", size: "14 MB", type: "MP4" }, timestamp: "Friday 1:40 PM", timeAgo: "4 hours ago", isRead: true },
    { id: 5, type: "mention", user: { name: "James", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=James", fallback: "J" }, action: "mentioned you in", target: "Project Alpha", content: "Hey @you, can you review the latest designs when you get a chance?", timestamp: "Thursday 11:30 AM", timeAgo: "1 day ago", isRead: true },
    { id: 6, type: "like", user: { name: "Sofia", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sofia", fallback: "S" }, action: "liked your comment in", target: "Team Meeting Notes", timestamp: "Thursday 9:15 AM", timeAgo: "1 day ago", isRead: true },
    { id: 7, type: "task_assignment", user: { name: "Admin", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Admin", fallback: "AD" }, action: "assigned you a new task in", target: "Q3 Marketing", content: "Finalize the social media campaign assets.", timestamp: "Wednesday 5:00 PM", timeAgo: "2 days ago", isRead: true },
    { id: 8, type: "system_update", user: { name: "System", avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=System", fallback: "SYS" }, action: "pushed a new update", content: "Version 2.1.0 is now live with improved performance and new features. Check out the release notes for more details.", timestamp: "Wednesday 9:00 AM", timeAgo: "2 days ago", isRead: true },
    { id: 9, type: 'comment', user: { name: 'Elena', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Elena', fallback: 'E' }, action: 'replied to your comment in', target: 'Dashboard 2.0', content: 'Thanks for the feedback! I\'ve updated the prototype.', timestamp: 'Tuesday 4:30 PM', timeAgo: '3 days ago', isRead: false },
    { id: 10, type: 'invitation', user: { name: 'Carlos', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Carlos', fallback: 'C' }, action: 'invited you to', target: 'API Integration', timestamp: 'Tuesday 10:00 AM', timeAgo: '3 days ago', isRead: true, hasActions: true },
];

// --- State and Actions ---
type ActiveTab = 'all' | 'verified' | 'mentions';

interface NotificationsState {
    notifications: Notification[];
    activeTab: ActiveTab;
}

interface NotificationsActions {
    markAsRead: (id: number) => void;
    markAllAsRead: () => number; // Returns number of items marked as read
    setActiveTab: (tab: ActiveTab) => void;
}

// --- Store ---
export const useNotificationsStore = create<NotificationsState & NotificationsActions>((set, get) => ({
    notifications: initialNotifications,
    activeTab: 'all',

    markAsRead: (id) => set(state => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
    })),

    markAllAsRead: () => {
        const unreadCount = get().notifications.filter(n => !n.isRead).length;
        if (unreadCount > 0) {
            set(state => ({
                notifications: state.notifications.map(n => ({ ...n, isRead: true }))
            }));
        }
        return unreadCount;
    },

    setActiveTab: (tab) => set({ activeTab: tab }),
}));

// --- Selectors ---
const selectNotifications = (state: NotificationsState) => state.notifications;
const selectActiveTab = (state: NotificationsState) => state.activeTab;

export const useFilteredNotifications = () => useNotificationsStore(state => {
    const notifications = selectNotifications(state);
    const activeTab = selectActiveTab(state);

    switch (activeTab) {
        case 'verified': return notifications.filter(n => n.type === 'follow' || n.type === 'like');
        case 'mentions': return notifications.filter(n => n.type === 'mention');
        default: return notifications;
    }
});

export const useNotificationCounts = () => useNotificationsStore(state => {
    const notifications = selectNotifications(state);
    const unreadCount = notifications.filter(n => !n.isRead).length;
    const verifiedCount = notifications.filter(n => (n.type === 'follow' || n.type === 'like') && !n.isRead).length;
    const mentionCount = notifications.filter(n => n.type === 'mention' && !n.isRead).length;
    return { unreadCount, verifiedCount, mentionCount };
});
```

## File: src/pages/ToasterDemo/index.tsx
```typescript
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { PageHeader } from '@/components/shared/PageHeader';
import { PageLayout } from '@/components/shared/PageLayout';
import { useAppShellStore } from '@/store/appShell.store';
import { cn, BODY_STATES } from '@/lib/utils';

type Variant = 'default' | 'success' | 'error' | 'warning';
type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

const variantColors = {
  default: 'border-border text-foreground hover:bg-muted/10 dark:hover:bg-muted/20',
  success: 'border-green-600 text-green-600 hover:bg-green-600/10 dark:hover:bg-green-400/20',
  error: 'border-destructive text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20',
  warning: 'border-amber-600 text-amber-600 hover:bg-amber-600/10 dark:hover:bg-amber-400/20',
}

const DemoSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section>
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    {children}
  </section>
);

export function ToasterDemo() {
  const toast = useToast();
  const bodyState = useAppShellStore(s => s.bodyState);
  const isInSidePane = bodyState === BODY_STATES.SIDE_PANE;

  const showToast = (variant: Variant, position: Position = 'bottom-right') => {
    toast.show({
      title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Notification`,
      message: `This is a ${variant} toast notification.`,
      variant,
      position,
      duration: 3000,
      onDismiss: () =>
        console.log(`${variant} toast at ${position} dismissed`),
    });
  };

  const simulateApiCall = async () => {
    toast.show({
      title: 'Scheduling...',
      message: 'Please wait while we schedule your meeting.',
      variant: 'default',
      position: 'bottom-right',
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.show({
        title: 'Meeting Scheduled',
        message: 'Your meeting is scheduled for July 4, 2025, at 3:42 PM IST.',
        variant: 'success',
        position: 'bottom-right',
        highlightTitle: true,
        actions: {
          label: 'Undo',
          onClick: () => console.log('Undoing meeting schedule'),
          variant: 'outline',
        },
      });
    } catch (error) {
      toast.show({
        title: 'Error Scheduling Meeting',
        message: 'Failed to schedule the meeting. Please try again.',
        variant: 'error',
        position: 'bottom-right',
      });
    }
  };

  return (
    <PageLayout>
      {/* Header */}
      {!isInSidePane && (
        <PageHeader
          title="Toaster"
          description="A customizable toast component for notifications."
        />
      )}
      <div className="space-y-6">
        <DemoSection title="Toast Variants">
          <div className="flex flex-wrap gap-4">
            {(['default', 'success', 'error', 'warning'] as Variant[]).map((variantKey) => (
              <Button
                key={variantKey}
                variant="outline"
                onClick={() => showToast(variantKey as Variant)}
                className={cn(variantColors[variantKey])}
              >
                {variantKey.charAt(0).toUpperCase() + variantKey.slice(1)} Toast
              </Button>
            ))}
          </div>
        </DemoSection>

        <DemoSection title="Toast Positions">
          <div className="flex flex-wrap gap-4">
            {[
              'top-left',
              'top-center',
              'top-right',
              'bottom-left',
              'bottom-center',
              'bottom-right',
            ].map((positionKey) => (
              <Button
                key={positionKey}
                variant="outline"
                onClick={() =>
                  showToast('default', positionKey as Position)
                }
                className="border-border text-foreground hover:bg-muted/10 dark:hover:bg-muted/20"
              >
                {positionKey
                  .replace('-', ' ')
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </Button>
            ))}
          </div>
        </DemoSection>

        <DemoSection title="Real-World Example">
          <Button
            variant="outline"
            onClick={simulateApiCall}
            className="border-border text-foreground hover:bg-muted/10 dark:hover:bg-muted/20"
          >
            Schedule Meeting
          </Button>
        </DemoSection>
      </div>
    </PageLayout>
  );
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

## File: src/main.tsx
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
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

interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

export const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ children, onScroll, scrollRef, className, ...props }, ref) => {
    const isTopBarVisible = useAppShellStore(s => s.isTopBarVisible);
    const bodyState = useAppShellStore(s => s.bodyState);
    const isFullscreen = bodyState === 'fullscreen';
    const isInSidePane = bodyState === BODY_STATES.SIDE_PANE;

    return (
      <div
        ref={scrollRef}
        className={cn("h-full overflow-y-auto", className)}
        onScroll={onScroll}
      >
        <div ref={ref} className={cn(
          "space-y-8 transition-all duration-300",
          !isInSidePane ? "px-6 lg:px-12 pb-6" : "px-6 pb-6",
          isTopBarVisible && !isFullscreen ? "pt-24" : "pt-6"
        )}
        {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);

PageLayout.displayName = 'PageLayout';
```

## File: src/components/ui/timeline.tsx
```typescript
"use client";

import * as React from "react";
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

const timelineVariants = cva("relative flex flex-col", {
  variants: {
    variant: {
      default: "gap-4",
      compact: "gap-2",
      spacious: "gap-8",
    },
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
  },
  defaultVariants: {
    variant: "default",
    orientation: "vertical",
  },
});

const timelineItemVariants = cva("relative flex gap-3 pb-2", {
  variants: {
    orientation: {
      vertical: "flex-row",
      horizontal: "flex-col min-w-64 shrink-0",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

const timelineConnectorVariants = cva("bg-border", {
  variants: {
    orientation: {
      vertical: "absolute left-3 top-9 h-full w-px",
      horizontal: "absolute top-3 left-8 w-full h-px",
    },
    status: {
      default: "bg-border",
      completed: "bg-primary",
      active: "bg-primary",
      pending: "bg-muted-foreground/30",
      error: "bg-destructive",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    status: "default",
  },
});

const timelineIconVariants = cva(
  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-background text-xs font-medium",
  {
    variants: {
      status: {
        default: "border-border text-muted-foreground",
        completed: "border-primary bg-primary text-primary-foreground",
        active: "border-primary bg-background text-primary animate-pulse",
        pending: "border-muted-foreground/30 text-muted-foreground",
        error: "border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      status: "default",
    },
  },
);

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

export interface TimelineProps extends VariantProps<typeof timelineVariants> {
  items: TimelineItem[];
  className?: string;
  showConnectors?: boolean;
  showTimestamps?: boolean;
  timestampPosition?: "top" | "bottom" | "inline";
}

function getStatusIcon(status: TimelineItem["status"]) {
  switch (status) {
    case "completed":
      return <Check className="h-3 w-3" />;
    case "active":
      return <Clock className="h-3 w-3" />;
    case "pending":
      return <Clock className="h-3 w-3" />;
    case "error":
      return <X className="h-3 w-3" />;
    default:
      return <div className="h-2 w-2 rounded-full bg-current" />;
  }
}

function formatTimestamp(timestamp: string | Date): string {
  if (!timestamp) return "";
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Timeline({
  items,
  className,
  variant,
  orientation = "vertical",
  showConnectors = true,
  showTimestamps = true,
  timestampPosition = "top",
  ...props
}: TimelineProps) {
  const timelineContent = (
    <div
      className={cn(
        timelineVariants({ variant, orientation }),
        orientation === "horizontal" ? "pb-4" : "",
      )}
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(timelineItemVariants({ orientation }))}
        >
          {/* Connector Line */}
          {showConnectors && index < items.length - 1 && (
            <div
              className={cn(
                timelineConnectorVariants({
                  orientation,
                  status: item.status,
                }),
              )}
            />
          )}

          {/* Icon */}
          <div className="relative z-10 flex shrink-0">
            <div className={cn(timelineIconVariants({ status: item.status }))}>
              {item.icon || getStatusIcon(item.status)}
            </div>
          </div>

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {/* Timestamp - Top */}
            {showTimestamps &&
              timestampPosition === "top" &&
              item.timestamp && (
                <time className="text-xs text-muted-foreground">
                  {formatTimestamp(item.timestamp)}
                </time>
              )}

            {/* Title and Inline Timestamp */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium leading-tight">{item.title}</h3>
              {showTimestamps &&
                timestampPosition === "inline" &&
                item.timestamp && (
                  <time className="shrink-0 text-xs text-muted-foreground">
                    {formatTimestamp(item.timestamp)}
                  </time>
                )}
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            )}

            {/* Custom Content */}
            {item.content && <div className="mt-3">{item.content}</div>}

            {/* Timestamp - Bottom */}
            {showTimestamps &&
              timestampPosition === "bottom" &&
              item.timestamp && (
                <time className="text-xs text-muted-foreground">
                  {formatTimestamp(item.timestamp)}
                </time>
              )}
          </div>
        </div>
      ))}
    </div>
  );

  if (orientation === "horizontal") {
    return (
      <ScrollArea
        className={cn("w-full", className)}
        {...props}
      >
        {timelineContent}
      </ScrollArea>
    );
  }

  return (
    <div className={className} {...props}>
      {timelineContent}
    </div>
  );
}

// Example Components for Documentation
export function BasicTimelineExample() {
  const items: TimelineItem[] = [
    {
      id: "1",
      title: "Project Started",
      description: "Initial project setup and planning phase",
      timestamp: new Date("2024-01-15T09:00:00"),
      status: "completed",
    },
    {
      id: "2",
      title: "Development Phase",
      description: "Core features implementation in progress",
      timestamp: new Date("2024-02-01T10:30:00"),
      status: "active",
    },
    {
      id: "3",
      title: "Testing & QA",
      description: "Quality assurance and testing phase",
      timestamp: new Date("2024-02-15T14:00:00"),
      status: "pending",
    },
    {
      id: "4",
      title: "Launch",
      description: "Production deployment and launch",
      timestamp: new Date("2024-03-01T16:00:00"),
      status: "pending",
    },
  ];

  return <Timeline items={items} />;
}

export function TimelineVariantsExample() {
  const items: TimelineItem[] = [
    {
      id: "1",
      title: "Task Completed",
      description: "Successfully finished the assigned task",
      status: "completed",
    },
    {
      id: "2",
      title: "In Progress",
      description: "Currently working on this item",
      status: "active",
    },
    {
      id: "3",
      title: "Upcoming",
      description: "Scheduled for later",
      status: "pending",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-sm font-medium">Default</h3>
        <Timeline items={items} variant="default" />
      </div>
      <div>
        <h3 className="mb-4 text-sm font-medium">Compact</h3>
        <Timeline items={items} variant="compact" />
      </div>
      <div>
        <h3 className="mb-4 text-sm font-medium">Spacious</h3>
        <Timeline items={items} variant="spacious" />
      </div>
    </div>
  );
}

export function HorizontalTimelineExample() {
  const items: TimelineItem[] = [
    {
      id: "1",
      title: "Planning",
      description: "Project planning and research",
      status: "completed",
    },
    {
      id: "2",
      title: "Design",
      description: "UI/UX design phase",
      status: "completed",
    },
    {
      id: "3",
      title: "Development",
      description: "Core development work",
      status: "active",
    },
    {
      id: "4",
      title: "Testing",
      description: "Quality assurance",
      status: "pending",
    },
    {
      id: "5",
      title: "Launch",
      description: "Production release",
      status: "pending",
    },
  ];

  return <Timeline items={items} orientation="horizontal" />;
}

export function TimelineWithCustomIconsExample() {
  const items: TimelineItem[] = [
    {
      id: "1",
      title: "Account Created",
      description: "Welcome to our platform!",
      timestamp: new Date("2024-01-01T08:00:00"),
      status: "completed",
      icon: <User className="h-3 w-3" />,
    },
    {
      id: "2",
      title: "Profile Updated",
      description: "Personal information has been updated",
      timestamp: new Date("2024-01-02T14:30:00"),
      status: "completed",
      icon: <User className="h-3 w-3" />,
    },
    {
      id: "3",
      title: "First Order Placed",
      description: "Order #12345 has been placed successfully",
      timestamp: new Date("2024-01-03T11:15:00"),
      status: "completed",
      icon: <Briefcase className="h-3 w-3" />,
    },
    {
      id: "4",
      title: "Delivery Scheduled",
      description: "Your order is out for delivery",
      timestamp: new Date("2024-01-04T09:45:00"),
      status: "active",
      icon: <MapPin className="h-3 w-3" />,
    },
  ];

  return <Timeline items={items} />;
}

export function TimelineWithContentExample() {
  const items: TimelineItem[] = [
    {
      id: "1",
      title: "Code Review Completed",
      description: "Pull request #123 has been reviewed",
      timestamp: new Date("2024-01-01T10:00:00"),
      status: "completed",
      content: (
        <div className="rounded-md bg-muted p-3 text-sm">
          <p className="font-medium">Changes approved by John Doe</p>
          <p className="text-muted-foreground">
            3 files changed, +45 -12 lines
          </p>
        </div>
      ),
    },
    {
      id: "2",
      title: "Build Failed",
      description: "CI/CD pipeline encountered errors",
      timestamp: new Date("2024-01-01T11:30:00"),
      status: "error",
      content: (
        <div className="rounded-md bg-destructive/10 p-3 text-sm">
          <p className="font-medium text-destructive">Build #456 failed</p>
          <p className="text-muted-foreground">Syntax error in main.tsx:45</p>
        </div>
      ),
    },
    {
      id: "3",
      title: "Issue Assigned",
      description: "Bug report assigned to development team",
      timestamp: new Date("2024-01-01T15:20:00"),
      status: "active",
      content: (
        <div className="rounded-md bg-primary/10 p-3 text-sm">
          <p className="font-medium">Issue #789: Login form validation</p>
          <p className="text-muted-foreground">
            Priority: High | Assigned to: Jane Smith
          </p>
        </div>
      ),
    },
  ];

  return <Timeline items={items} />;
}

export function ProjectTimelineExample() {
  const items: TimelineItem[] = [
    {
      id: "1",
      title: "Project Kickoff",
      description: "Initial meeting with stakeholders and team members",
      timestamp: new Date("2024-01-15T09:00:00"),
      status: "completed",
      icon: <Briefcase className="h-3 w-3" />,
      content: (
        <div className="space-y-2">
          <div className="flex gap-2 text-sm">
            <span className="font-medium">Attendees:</span>
            <span className="text-muted-foreground">5 team members</span>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="font-medium">Duration:</span>
            <span className="text-muted-foreground">2 hours</span>
          </div>
        </div>
      ),
    },
    {
      id: "2",
      title: "Requirements Gathering",
      description:
        "Detailed analysis of project requirements and specifications",
      timestamp: new Date("2024-01-20T14:00:00"),
      status: "completed",
      icon: <MessageSquare className="h-3 w-3" />,
    },
    {
      id: "3",
      title: "Design Phase",
      description: "UI/UX design and wireframe creation",
      timestamp: new Date("2024-02-01T10:00:00"),
      status: "active",
      icon: <Award className="h-3 w-3" />,
      content: (
        <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-sm">
          <p className="font-medium">Current Progress: 60%</p>
          <p className="text-muted-foreground">
            Expected completion: Feb 10, 2024
          </p>
        </div>
      ),
    },
    {
      id: "4",
      title: "Development Sprint 1",
      description: "Core functionality implementation",
      timestamp: new Date("2024-02-15T09:00:00"),
      status: "pending",
      icon: <GraduationCap className="h-3 w-3" />,
    },
    {
      id: "5",
      title: "Testing & QA",
      description: "Quality assurance and bug fixes",
      timestamp: new Date("2024-03-01T09:00:00"),
      status: "pending",
      icon: <AlertCircle className="h-3 w-3" />,
    },
  ];

  return <Timeline items={items} variant="spacious" />;
}

export function OrderTrackingTimelineExample() {
  const items: TimelineItem[] = [
    {
      id: "1",
      title: "Order Placed",
      description: "Your order has been successfully placed",
      timestamp: new Date("2024-01-01T10:30:00"),
      status: "completed",
      icon: <Check className="h-3 w-3" />,
    },
    {
      id: "2",
      title: "Payment Confirmed",
      description: "Payment has been processed successfully",
      timestamp: new Date("2024-01-01T10:35:00"),
      status: "completed",
      icon: <Check className="h-3 w-3" />,
    },
    {
      id: "3",
      title: "Order Processing",
      description: "Your order is being prepared for shipment",
      timestamp: new Date("2024-01-01T14:20:00"),
      status: "active",
      icon: <Clock className="h-3 w-3" />,
    },
    {
      id: "4",
      title: "Shipped",
      description: "Your order has been shipped",
      status: "pending",
      icon: <MapPin className="h-3 w-3" />,
    },
    {
      id: "5",
      title: "Delivered",
      description: "Package delivered to your address",
      status: "pending",
      icon: <Heart className="h-3 w-3" />,
    },
  ];

  return <Timeline items={items} timestampPosition="inline" />;
}

export function CompactTimelineExample() {
  const items: TimelineItem[] = [
    {
      id: "1",
      title: "Login",
      timestamp: new Date("2024-01-01T08:30:00"),
      status: "completed",
    },
    {
      id: "2",
      title: "File uploaded",
      timestamp: new Date("2024-01-01T08:35:00"),
      status: "completed",
    },
    {
      id: "3",
      title: "Processing started",
      timestamp: new Date("2024-01-01T08:40:00"),
      status: "active",
    },
    {
      id: "4",
      title: "Processing complete",
      status: "pending",
    },
  ];

  return (
    <Timeline
      items={items}
      variant="compact"
      timestampPosition="inline"
      showTimestamps={true}
    />
  );
}

export function ExtendedHorizontalTimelineExample() {
  const items: TimelineItem[] = [
    {
      id: "1",
      title: "Research",
      description: "Market research and analysis",
      timestamp: new Date("2024-01-01T09:00:00"),
      status: "completed",
      icon: <MessageSquare className="h-3 w-3" />,
    },
    {
      id: "2",
      title: "Planning",
      description: "Project planning and roadmap",
      timestamp: new Date("2024-01-05T10:00:00"),
      status: "completed",
      icon: <Calendar className="h-3 w-3" />,
    },
    {
      id: "3",
      title: "Design",
      description: "UI/UX design and wireframes",
      timestamp: new Date("2024-01-10T11:00:00"),
      status: "completed",
      icon: <Award className="h-3 w-3" />,
    },
    {
      id: "4",
      title: "Prototype",
      description: "Interactive prototype development",
      timestamp: new Date("2024-01-15T14:00:00"),
      status: "completed",
      icon: <Briefcase className="h-3 w-3" />,
    },
    {
      id: "5",
      title: "Development",
      description: "Core feature implementation",
      timestamp: new Date("2024-01-20T09:00:00"),
      status: "active",
      icon: <GraduationCap className="h-3 w-3" />,
    },
    {
      id: "6",
      title: "Testing",
      description: "Quality assurance and testing",
      timestamp: new Date("2024-02-01T10:00:00"),
      status: "pending",
      icon: <AlertCircle className="h-3 w-3" />,
    },
    {
      id: "7",
      title: "Review",
      description: "Stakeholder review and feedback",
      timestamp: new Date("2024-02-05T15:00:00"),
      status: "pending",
      icon: <User className="h-3 w-3" />,
    },
    {
      id: "8",
      title: "Deploy",
      description: "Production deployment",
      timestamp: new Date("2024-02-10T16:00:00"),
      status: "pending",
      icon: <MapPin className="h-3 w-3" />,
    },
    {
      id: "9",
      title: "Launch",
      description: "Product launch and marketing",
      timestamp: new Date("2024-02-15T09:00:00"),
      status: "pending",
      icon: <Heart className="h-3 w-3" />,
    },
  ];

  return <Timeline items={items} orientation="horizontal" variant="spacious" />;
}

export {
  timelineVariants,
  timelineItemVariants,
  timelineConnectorVariants,
  timelineIconVariants,
};
```

## File: src/features/dynamic-view/components/shared/EmptyState.tsx
```typescript
import { Eye } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Eye className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No items found</h3>
      <p className="text-muted-foreground">Try adjusting your search criteria</p>
    </div>
  )
}
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

const colorPresets = [
  { name: 'Default Blue', value: '220 84% 60%' },
  { name: 'Rose', value: '346.8 77.2% 49.8%' },
  { name: 'Green', value: '142.1 76.2% 36.3%' },
  { name: 'Orange', value: '24.6 95% 53.1%' },
  { name: 'Violet', value: '262.1 83.3% 57.8%' },
  { name: 'Slate', value: '215.3 20.3% 65.1%' }
]

export function SettingsContent() {
  const sidebarWidth = useAppShellStore(s => s.sidebarWidth);
  const compactMode = useAppShellStore(s => s.compactMode);
  const primaryColor = useAppShellStore(s => s.primaryColor);
  const autoExpandSidebar = useAppShellStore(s => s.autoExpandSidebar);
  const reducedMotion = useAppShellStore(s => s.reducedMotion);
  const isDarkMode = useAppShellStore(s => s.isDarkMode);
  
  const {
    setSidebarWidth, setCompactMode, setPrimaryColor, setAutoExpandSidebar,
    setReducedMotion, resetToDefaults, toggleDarkMode
  } = useAppShellStore.getState();

  const [tempSidebarWidth, setTempSidebarWidth] = useState(sidebarWidth)

  const handleSidebarWidthChange = (width: number) => {
    setTempSidebarWidth(width)
    setSidebarWidth(width);
  }

  const handleReset = () => {
    resetToDefaults();
    setTempSidebarWidth(280); // Reset temp state as well
  }

  const handleSetSidebarWidth = (payload: number) => {
    setSidebarWidth(payload);
    setTempSidebarWidth(payload);
  };

  return (
    <div className="space-y-10">
      {/* Appearance */}
      <SettingsSection icon={<Palette />} title="Appearance">
        {/* Dark Mode */}
        <SettingsToggle
          icon={isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          title="Dark Mode"
          description="Toggle dark theme"
          checked={isDarkMode}
          onCheckedChange={toggleDarkMode}
        />

        {/* Compact Mode */}
        <SettingsToggle
          icon={<Minimize2 className="w-4 h-4" />}
          title="Compact Mode"
          description="Reduce spacing and sizes"
          checked={compactMode}
          onCheckedChange={setCompactMode}
        />

        {/* Accent Color */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Palette className="w-4 h-4" />
            <div>
              <p className="font-medium">Accent Color</p>
              <p className="text-sm text-muted-foreground">Customize the main theme color</p>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2 pt-1">
            {colorPresets.map(color => {
              const isActive = color.value === primaryColor
              return (
                <button
                  key={color.name}
                  title={color.name}
                  onClick={() => setPrimaryColor(color.value)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center",
                    isActive ? 'border-primary' : 'border-transparent'
                  )}
                  style={{ backgroundColor: `hsl(${color.value})` }}
                >{isActive && <Check className="w-5 h-5 text-primary-foreground" />}</button>
              )
            })}
          </div>
        </div>
      </SettingsSection>

      {/* Behavior */}
      <SettingsSection icon={<Zap />} title="Behavior">
        {/* Auto Expand Sidebar */}
        <SettingsToggle
          icon={<Eye className="w-4 h-4" />}
          title="Auto Expand Sidebar"
          description="Expand on hover when collapsed"
          checked={autoExpandSidebar}
          onCheckedChange={setAutoExpandSidebar}
        />

        {/* Sidebar Width */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Monitor className="w-4 h-4" />
            <div>
              <p className="font-medium">Sidebar Width</p>
              <p className="text-sm text-muted-foreground">{tempSidebarWidth}px</p>
            </div>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="200"
              max="500"
              step="10"
              value={tempSidebarWidth}
              onChange={(e) => handleSidebarWidthChange(Number(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>200px</span>
              <span>350px</span>
              <span>500px</span>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Accessibility */}
      <SettingsSection icon={<Accessibility />} title="Accessibility">
        {/* Reduced Motion */}
        <SettingsToggle
          icon={<Zap className="w-4 h-4" />}
          title="Reduced Motion"
          description="Minimize animations"
          checked={reducedMotion}
          onCheckedChange={setReducedMotion}
        />
      </SettingsSection>

      {/* Presets */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Quick Presets
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => {
              setCompactMode(false)
              setReducedMotion(false)
              handleSetSidebarWidth(320)
            }}
            className="p-4 bg-accent/30 hover:bg-accent/50 rounded-xl transition-colors text-left"
          >
            <Monitor className="w-4 h-4 mb-2" />
            <p className="font-medium text-sm">Desktop</p>
            <p className="text-xs text-muted-foreground">Spacious layout</p>
          </button>
          
          <button 
            onClick={() => {
              setCompactMode(true)
              setReducedMotion(true)
              handleSetSidebarWidth(240)
            }}
            className="p-4 bg-accent/30 hover:bg-accent/50 rounded-xl transition-colors text-left"
          >
            <Smartphone className="w-4 h-4 mb-2" />
            <p className="font-medium text-sm">Mobile</p>
            <p className="text-xs text-muted-foreground">Compact layout</p>
          </button>
        </div>
      </div>
      <div className="pt-6 border-t border-border">
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}

// Custom slider styles
const sliderStyles = `
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: hsl(var(--primary));
  cursor: pointer;
  border: 3px solid hsl(var(--background));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: -7px;
}

.slider::-moz-range-thumb {
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: hsl(var(--primary));
  cursor: pointer;
  border: 3px solid hsl(var(--background));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = sliderStyles
  document.head.appendChild(styleSheet)
}
```

## File: src/hooks/useAutoAnimateStats.hook.ts
```typescript
import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

/**
 * A hook that animates a stats container in and out of view based on scroll direction.
 * It creates a "sliver app bar" effect for the stats section.
 * @param scrollContainerRef Ref to the main scrolling element.
 * @param statsContainerRef Ref to the stats container element to be animated.
 */
export function useAutoAnimateStats(
  scrollContainerRef: React.RefObject<HTMLElement>,
  statsContainerRef: React.RefObject<HTMLElement>
) {
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);
  const originalMarginTop = useRef<string | null>(null);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !statsContainerRef.current) return;

    const scrollY = scrollContainerRef.current.scrollTop;
    
    // Initialize original margin on first scroll event if not set
    if (originalMarginTop.current === null) {
      const computedStyle = getComputedStyle(statsContainerRef.current);
      originalMarginTop.current = computedStyle.getPropertyValue('margin-top');
    }

    // On any significant scroll down, hide the stats.
    // The small 10px threshold prevents firing on minor scroll-jiggles.
    if (scrollY > lastScrollY.current && scrollY > 10 && !isHidden.current) {
      isHidden.current = true;
      gsap.to(statsContainerRef.current, {
        duration: 0.4,
        height: 0,
        autoAlpha: 0,
        marginTop: 0,
        ease: 'power2.inOut',
        overwrite: true,
      });
    } 

    lastScrollY.current = scrollY < 0 ? 0 : scrollY;
  }, [scrollContainerRef, statsContainerRef]);

  const handleWheel = useCallback((event: WheelEvent) => {
    if (!scrollContainerRef.current || !statsContainerRef.current) return;
    
    const isAtTop = scrollContainerRef.current.scrollTop === 0;
    const isScrollingUp = event.deltaY < 0;

    // Only reveal if we are at the top, scrolling up, and stats are hidden.
    // This creates the "pull to reveal" effect.
    if (isAtTop && isScrollingUp && isHidden.current) {
        isHidden.current = false;
        gsap.to(statsContainerRef.current, {
          duration: 0.4,
          height: 'auto',
          autoAlpha: 1,
          marginTop: originalMarginTop.current || 0,
          ease: 'power2.out',
          overwrite: true,
        });
    }
  }, [scrollContainerRef, statsContainerRef]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      scrollContainer.addEventListener('wheel', handleWheel, { passive: true });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
        scrollContainer.removeEventListener('wheel', handleWheel);
      }
      // When component unmounts, kill any running animations on the stats ref
      if (statsContainerRef.current) {
        gsap.killTweensOf(statsContainerRef.current);
      }
    };
  }, [scrollContainerRef, statsContainerRef, handleScroll, handleWheel]);
}
```

## File: src/hooks/useAutoAnimateTopBar.ts
```typescript
import { useRef, useCallback, useEffect } from 'react';
import { useAppShellStore } from '@/store/appShell.store';
import { BODY_STATES } from '@/lib/utils';

export function useAutoAnimateTopBar(isPane = false) {
  const bodyState = useAppShellStore(s => s.bodyState);
  const lastScrollTop = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (isPane || bodyState === BODY_STATES.SPLIT_VIEW || bodyState === BODY_STATES.FULLSCREEN) return;

    // Clear previous timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    const { scrollTop } = event.currentTarget;
    const { setTopBarVisible } = useAppShellStore.getState();
    
    if (scrollTop > lastScrollTop.current && scrollTop > 200) {
      setTopBarVisible(false);
    } else if (scrollTop < lastScrollTop.current || scrollTop <= 0) {
      setTopBarVisible(true);
    }
    
    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;

    // Set new timeout to show top bar when scrolling stops
    scrollTimeout.current = setTimeout(() => {
      // Don't hide, just ensure it's visible after scrolling stops
      // and we are not at the top of the page.
      if (scrollTop > 0) {
        setTopBarVisible(true);
      }
    }, 250); // Adjust timeout as needed
  }, [isPane, bodyState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return { onScroll };
}
```

## File: src/hooks/usePageViewConfig.hook.ts
```typescript
import { useEffect } from 'react';
import { useAppShellStore } from '@/store/appShell.store';

interface PageViewConfig {
    sidePaneWidth?: number;
    splitPaneWidth?: number;
}

/**
 * A hook for a page component to declaratively set its desired pane widths.
 * It sets the widths when config changes and resets them to the application defaults on unmount.
 * @param {PageViewConfig} config - The desired widths for side pane and split view.
 */
export function usePageViewConfig(config: PageViewConfig) {
    const { setSidePaneWidth, setSplitPaneWidth, resetPaneWidths } = useAppShellStore.getState();
    const { sidePaneWidth, splitPaneWidth } = config;

    useEffect(() => {
        if (sidePaneWidth !== undefined) {
            setSidePaneWidth(sidePaneWidth);
        }
        if (splitPaneWidth !== undefined) {
            setSplitPaneWidth(splitPaneWidth);
        }

        // Return a cleanup function to reset widths when the component unmounts
        return () => {
            resetPaneWidths();
        };
    }, [sidePaneWidth, splitPaneWidth, setSidePaneWidth, setSplitPaneWidth, resetPaneWidths]);
}
```

## File: src/hooks/usePaneDnd.hook.ts
```typescript
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppShellStore } from '@/store/appShell.store';
import { BODY_STATES } from '@/lib/utils';

const pageToPaneMap: Record<string, 'main' | 'settings' | 'toaster' | 'notifications' | 'dataDemo' | 'messaging'> = {
  dashboard: 'main',
  settings: 'settings',
  toaster: 'toaster',
  notifications: 'notifications',
  'data-demo': 'dataDemo',
  messaging: 'messaging',
};

export function usePaneDnd() {
  const {
    draggedPage,
    dragHoverTarget,
    bodyState,
    sidePaneContent,
  } = useAppShellStore(state => ({
    draggedPage: state.draggedPage,
    dragHoverTarget: state.dragHoverTarget,
    bodyState: state.bodyState,
    sidePaneContent: state.sidePaneContent,
  }));
  const { setDraggedPage, setDragHoverTarget } = useAppShellStore.getState();
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = location.pathname.split('/')[1] || 'dashboard';

  const handleDragOverLeft = useCallback((e: React.DragEvent) => {
    if (!draggedPage) return;
    e.preventDefault();
    if (dragHoverTarget !== 'left') {
      setDragHoverTarget('left');
    }
  }, [draggedPage, dragHoverTarget, setDragHoverTarget]);

  const handleDropLeft = useCallback(() => {
    if (!draggedPage) return;

    const paneContentOfDraggedPage = pageToPaneMap[draggedPage as keyof typeof pageToPaneMap];
    if (paneContentOfDraggedPage === sidePaneContent && (bodyState === BODY_STATES.SIDE_PANE || bodyState === BODY_STATES.SPLIT_VIEW)) {
      navigate(`/${draggedPage}`, { replace: true });
    } 
    else if (bodyState === BODY_STATES.NORMAL && draggedPage !== activePage) {
        const originalActivePagePaneContent = pageToPaneMap[activePage as keyof typeof pageToPaneMap];
        if (originalActivePagePaneContent) {
            navigate(`/${draggedPage}?view=split&right=${originalActivePagePaneContent}`, { replace: true });
        } else {
            navigate(`/${draggedPage}`, { replace: true });
        }
    } else {
      if (bodyState === BODY_STATES.SPLIT_VIEW) {
        const rightPane = location.search.split('right=')[1];
        if (rightPane) {
          navigate(`/${draggedPage}?view=split&right=${rightPane}`, { replace: true });
          return;
        }
      }
      navigate(`/${draggedPage}`, { replace: true });
    }
    
    setDraggedPage(null);
    setDragHoverTarget(null);
  }, [draggedPage, activePage, bodyState, sidePaneContent, navigate, location.search, setDraggedPage, setDragHoverTarget]);

  const handleDragOverRight = useCallback((e: React.DragEvent) => {
    if (!draggedPage) return;
    e.preventDefault();
    if (dragHoverTarget !== 'right') {
      setDragHoverTarget('right');
    }
  }, [draggedPage, dragHoverTarget, setDragHoverTarget]);

  const handleDropRight = useCallback(() => {
    if (!draggedPage) return;
    const pane = pageToPaneMap[draggedPage as keyof typeof pageToPaneMap];
    if (pane) {
      let mainPage = activePage;
      if (draggedPage === activePage) {
        mainPage = 'dashboard';
      }
      navigate(`/${mainPage}?view=split&right=${pane}`, { replace: true });
    }
    setDraggedPage(null);
    setDragHoverTarget(null);
  }, [draggedPage, activePage, navigate, setDraggedPage, setDragHoverTarget]);

  const handleDragLeave = useCallback(() => {
      setDragHoverTarget(null);
  }, [setDragHoverTarget]);

  return {
    handleDragOverLeft,
    handleDropLeft,
    handleDragOverRight,
    handleDropRight,
    handleDragLeave,
  };
}
```

## File: src/hooks/useScrollToBottom.hook.ts
```typescript
import { useState, useCallback } from 'react';

export function useScrollToBottom(
  contentRef: React.RefObject<HTMLDivElement>
) {
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    // Show button if scrolled down more than 200px, and there's more than 200px left to scroll
    setShowScrollToBottom(scrollTop > 200 && scrollTop < scrollHeight - clientHeight - 200);
  }, [contentRef]);

  const scrollToBottom = () => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };

  return { showScrollToBottom, handleScroll, scrollToBottom };
}
```

## File: src/pages/Messaging/components/ActivityPanel.tsx
```typescript
import React, { useMemo } from 'react';
import { Mail, StickyNote, PhoneCall, Calendar } from 'lucide-react';
import type { Contact, ActivityEventType } from '../types';
import { Timeline, type TimelineItem } from '@/components/ui/timeline';
import { capitalize } from '@/lib/utils';

const iconMap: Record<ActivityEventType, React.ReactNode> = {
  note: <StickyNote className="w-3 h-3" />,
  call: <PhoneCall className="w-3 h-3" />,
  email: <Mail className="w-3 h-3" />,
  meeting: <Calendar className="w-3 h-3" />,
};

interface ActivityPanelProps {
  contact: Contact;
}

export const ActivityPanel: React.FC<ActivityPanelProps> = ({ contact }) => {
  const timelineItems = useMemo<TimelineItem[]>(() => {
    if (!contact.activity || contact.activity.length === 0) {
      return [];
    }

    return [...contact.activity]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .map(item => ({
        id: item.id,
        title: capitalize(item.type),
        description: item.content,
        timestamp: item.timestamp,
        icon: iconMap[item.type],
        status: 'default',
      }));
  }, [contact.activity]);

  if (timelineItems.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <StickyNote className="w-10 h-10 text-muted-foreground/50" />
            <h3 className="mt-4 text-sm font-medium">No Activity Yet</h3>
            <p className="mt-1 text-xs text-muted-foreground">
                Notes, calls, and emails will appear here.
            </p>
        </div>
    )
  }

  return (
    <Timeline 
      items={timelineItems} 
      variant="compact"
      timestampPosition="inline"
    />
  )
}
```

## File: src/pages/Messaging/components/ContactInfoPanel.tsx
```typescript
import React from 'react';
import { Mail, Phone } from 'lucide-react';
import type { Contact } from '../types';
import { useMessagingStore } from '../store/messaging.store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DetailRow: React.FC<{icon: React.ReactNode, children: React.ReactNode}> = ({ icon, children }) => (
    <div className="flex items-start gap-3 text-sm">
        <div className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0">{icon}</div>
        <div className="flex-1 text-foreground/90 break-all">{children}</div>
    </div>
);

interface ContactInfoPanelProps {
  contact: Contact;
}

export const ContactInfoPanel: React.FC<ContactInfoPanelProps> = ({ contact }) => {
    const getContactsByCompany = useMessagingStore(state => state.getContactsByCompany);
    const colleagues = getContactsByCompany(contact.company, contact.id);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-3">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="text-2xl">{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-bold">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground">{contact.role}</p>
                    <p className="text-sm text-muted-foreground font-medium">{contact.company}</p>
                </div>
            </div>
            
            <div className="border-b" />

            {/* Contact Details */}
            <div className="space-y-3">
                <h4 className="font-semibold text-sm">Contact Details</h4>
                <DetailRow icon={<Mail />}>{contact.email}</DetailRow>
                <DetailRow icon={<Phone />}>{contact.phone}</DetailRow>
            </div>

            {/* Colleagues */}
            {colleagues.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Colleagues from {contact.company}</h4>
                    {colleagues.map(colleague => (
                        <div key={colleague.id} className="flex items-center gap-3">
                             <Avatar className="h-8 w-8"><AvatarImage src={colleague.avatar} /><AvatarFallback>{colleague.name.charAt(0)}</AvatarFallback></Avatar>
                             <div>
                                <p className="text-sm font-medium">{colleague.name}</p>
                                <p className="text-xs text-muted-foreground">{colleague.role}</p>
                             </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
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
  const setDefaultPaneWidths = useAppShellStore(state => state.setDefaultPaneWidths);
  const setPrimaryColor = useAppShellStore(state => state.setPrimaryColor);
  const primaryColor = useAppShellStore(state => state.primaryColor);

  useEffect(() => {
    init({ appName, appLogo, defaultSplitPaneWidth });
  }, [appName, appLogo, defaultSplitPaneWidth, init]);

  useEffect(() => {
    setDefaultPaneWidths();
  }, [setDefaultPaneWidths]);

  // Side effect for primary color
  useEffect(() => {
    // This effect is here because the store itself can't run side-effects on init
    // before React has mounted. So we trigger it from the provider.
    setPrimaryColor(primaryColor);
  }, [primaryColor, setPrimaryColor]);

  return <>{children}</>;
}
```

## File: src/components/layout/MainContent.tsx
```typescript
import { forwardRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils';
import { BODY_STATES } from '@/lib/utils'
import { useAppShellStore } from '@/store/appShell.store'

interface MainContentProps {
  children?: React.ReactNode;
}

export const MainContent = forwardRef<HTMLDivElement, MainContentProps>(
  ({ children }, ref) => {
    const bodyState = useAppShellStore(s => s.bodyState);
    const fullscreenTarget = useAppShellStore(s => s.fullscreenTarget);
    const { toggleFullscreen } = useAppShellStore.getState();
    const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;

    if (isFullscreen && fullscreenTarget === 'right') {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
        "relative flex flex-col h-full overflow-hidden bg-background",
        isFullscreen && "fixed inset-0 z-[60]"
        )}
      >
        {isFullscreen && (
          <button
            onClick={() => toggleFullscreen()}
            className="fixed top-6 right-6 lg:right-12 z-[100] h-12 w-12 flex items-center justify-center rounded-full bg-card/50 backdrop-blur-sm hover:bg-card/75 transition-colors group"
            title="Exit Fullscreen"
          >
            <X className="w-6 h-6 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
          </button>
        )}

        <div className="flex-1 min-h-0 flex flex-col">
          {children}
        </div>
      </div>
    )
  }
)
MainContent.displayName = 'MainContent'
```

## File: src/features/dynamic-view/components/controls/ViewModeSelector.tsx
```typescript
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { List, Grid3X3, LayoutGrid, Table, LayoutDashboard, CalendarDays } from 'lucide-react'
import type { ViewMode } from '../../types';
import { useDynamicView } from '../../DynamicViewContext';

const viewModes = [
  { id: 'list' as ViewMode, label: 'List', icon: List, description: 'Compact list with details' },
  { id: 'cards' as ViewMode, label: 'Cards', icon: LayoutGrid, description: 'Rich card layout' },
  { id: 'kanban' as ViewMode, label: 'Kanban', icon: LayoutDashboard, description: 'Interactive Kanban board' },
  { id: 'calendar' as ViewMode, label: 'Calendar', icon: CalendarDays, description: 'Interactive calendar view' },
  { id: 'grid' as ViewMode, label: 'Grid', icon: Grid3X3, description: 'Masonry grid view' },
  { id: 'table' as ViewMode, label: 'Table', icon: Table, description: 'Structured data table' }
]

export function ViewModeSelector() {
  const { viewMode, onViewModeChange } = useDynamicView();
  const indicatorRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const updateIndicatorPosition = useCallback((immediate = false) => {
    if (!indicatorRef.current || !containerRef.current || isTransitioning) return

    const activeButton = containerRef.current.querySelector(`[data-mode="${viewMode}"]`) as HTMLElement
    if (!activeButton) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const buttonRect = activeButton.getBoundingClientRect()
    
    const left = buttonRect.left - containerRect.left
    const width = buttonRect.width

    if (immediate) {
      // Set position immediately without animation for initial load
      gsap.set(indicatorRef.current, {
        x: left,
        width: width
      })
    } else {
      gsap.to(indicatorRef.current, {
        duration: 0.3,
        x: left,
        width: width,
        ease: "power2.out"
      })
    }
  }, [viewMode, isTransitioning])

  // Initial setup - set position immediately without animation
  useEffect(() => {
    const timer = setTimeout(() => {
      updateIndicatorPosition(true)
    }, 0)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  useEffect(() => {
    if (!isTransitioning) {
      updateIndicatorPosition()
    }
  }, [viewMode, isTransitioning, updateIndicatorPosition])

  const handleMouseEnter = () => {
    setIsTransitioning(true)
    setIsExpanded(true)
    
    // Wait for expand animation to complete
    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  const handleMouseLeave = () => {
    setIsTransitioning(true)
    setIsExpanded(false)
    
    // Wait for collapse animation to complete
    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  return (
    <div 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex items-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-1.5 shadow-lg transition-all duration-500 ease-out",
        "hover:shadow-xl hover:bg-card/70",
        isExpanded ? "gap-1" : "gap-0"
      )}
    >
      {/* Animated indicator */}
      <div
        ref={indicatorRef}
        className="absolute inset-y-1.5 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20 rounded-xl transition-all duration-300"
        style={{ left: 0, width: 0 }}
      />
      
      {/* Mode buttons */}
      {viewModes.map((mode, index) => {
        const IconComponent = mode.icon
        const isActive = viewMode === mode.id
        
        return (
          <button
            key={mode.id}
            data-mode={mode.id}
            onClick={() => onViewModeChange(mode.id)}
            className={cn(
              "relative flex items-center justify-center rounded-xl transition-all duration-500 ease-out group overflow-hidden",
              "hover:bg-accent/20 active:scale-95",
              isActive && "text-primary",
              isExpanded ? "gap-3 px-4 py-2.5" : "gap-0 px-3 py-2.5"
            )}
            title={mode.description}
            style={{
              transitionDelay: isExpanded ? `${index * 50}ms` : `${(viewModes.length - index - 1) * 30}ms`
            }}
          >
            <IconComponent className={cn(
              "w-5 h-5 transition-all duration-300 flex-shrink-0",
              isActive && "scale-110",
              "group-hover:scale-105",
              isExpanded ? "rotate-0" : "rotate-0"
            )} />
            
            {/* Label with smooth expand/collapse */}
            <div className={cn(
              "overflow-hidden transition-all duration-500 ease-out",
              isExpanded ? "max-w-[80px] opacity-100" : "max-w-0 opacity-0"
            )}>
              <span className={cn(
                "font-medium whitespace-nowrap transition-all duration-300",
                isActive ? "text-primary" : "text-muted-foreground",
                "group-hover:text-foreground"
              )}>
                {mode.label}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
```

## File: src/features/dynamic-view/components/shared/AddDataItemCta.tsx
```typescript
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

import type { ViewMode } from '../../types'

interface AddDataItemCtaProps {
  viewMode: ViewMode
  colSpan?: number
}

export function AddDataItemCta({ viewMode, colSpan }: AddDataItemCtaProps) {
  const isTable = viewMode === 'table'
  const isList = viewMode === 'list'
  const isCard = viewMode === 'cards' || viewMode === 'grid'

  const content = (
    <div
      className={cn(
        "flex items-center justify-center text-center w-full h-full p-6 gap-6",
        isCard && "flex-col min-h-[300px]",
        isList && "flex-row",
        isTable && "flex-row py-8",
      )}
    >
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-primary/10 border-2 border-dashed border-primary/30 rounded-full flex items-center justify-center text-primary">
          <Plus className="w-8 h-8" />
        </div>
      </div>
      <div className={cn("flex-1", isCard && "text-center", isList && "text-left", isTable && "text-left")}>
        <h3 className="font-semibold text-lg mb-1 text-primary">
          Showcase Your Own Data
        </h3>
        <p className="text-muted-foreground text-sm">
          Click here to add a new item and see how it looks across all views in the demo.
        </p>
      </div>
    </div>
  )

  if (isTable) {
    return (
      <tr className="group transition-colors duration-200 hover:bg-accent/20 cursor-pointer">
        <td colSpan={colSpan}>
          {content}
        </td>
      </tr>
    )
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border-2 border-dashed border-border bg-transparent transition-all duration-300 cursor-pointer",
        "hover:bg-accent/50 hover:border-primary/30",
        isList && "rounded-2xl"
      )}
    >
      {content}
    </div>
  )
}
```

## File: src/features/dynamic-view/components/shared/AnimatedLoadingSkeleton.tsx
```typescript
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ViewMode } from '../../types'

interface GridConfig {
  numCards: number
  cols: number
}

export const AnimatedLoadingSkeleton = ({ viewMode }: { viewMode: ViewMode }) => {
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  const getGridConfig = (width: number): GridConfig => {
    if (width === 0) return { numCards: 8, cols: 2 }; // Default before measurement
    if (viewMode === 'list' || viewMode === 'table') {
      return { numCards: 5, cols: 1 }
    }
    // For card view
    if (viewMode === 'cards') {
      const cols = Math.max(1, Math.floor(width / 344)); // 320px card + 24px gap
      return { numCards: Math.max(8, cols * 2), cols }
    }
    // For grid view
    const cols = Math.max(1, Math.floor(width / 304)); // 280px card + 24px gap
    return { numCards: Math.max(8, cols * 2), cols }
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.kill()
    }
    if (!iconRef.current || !containerRef.current || containerWidth === 0) return

    // Allow DOM to update with new skeleton cards
    const timeoutId = setTimeout(() => {
      const cards = Array.from(containerRef.current!.children)
      if (cards.length === 0) return

      const shuffledCards = gsap.utils.shuffle(cards)

      const getCardPosition = (card: Element) => {
        const rect = card.getBoundingClientRect()
        const containerRect = containerRef.current!.getBoundingClientRect()
        const iconRect = iconRef.current!.getBoundingClientRect()

        return {
          x: rect.left - containerRect.left + rect.width / 2 - iconRect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2 - iconRect.height / 2,
        }
      }
      
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.5,
        defaults: { duration: 1, ease: 'power2.inOut' }
      });
      timelineRef.current = tl

      // Animate to a few random cards
      shuffledCards.slice(0, 5).forEach(card => {
        const pos = getCardPosition(card)
        tl.to(iconRef.current, { 
          x: pos.x,
          y: pos.y,
          scale: 1.2,
          duration: 0.8
        }).to(iconRef.current, {
          scale: 1,
          duration: 0.2
        })
      });

      // Loop back to the start
      const firstPos = getCardPosition(shuffledCards[0]);
      tl.to(iconRef.current, { x: firstPos.x, y: firstPos.y, duration: 0.8 });
    }, 100) // Small delay to ensure layout is calculated

    return () => {
      clearTimeout(timeoutId)
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }

  }, [containerWidth, viewMode])

  const config = getGridConfig(containerWidth)

  const renderSkeletonCard = (key: number) => {
    if (viewMode === 'list' || viewMode === 'table') {
      return (
        <div key={key} className="bg-card/30 border border-border/30 rounded-2xl p-6 flex items-start gap-4 animate-pulse">
          <div className="w-14 h-14 bg-muted rounded-xl flex-shrink-0"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-5/6"></div>
            <div className="flex gap-2 pt-2">
              <div className="h-6 bg-muted rounded-full w-20"></div>
              <div className="h-6 bg-muted rounded-full w-20"></div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div 
        key={key} 
        className={cn(
          "bg-card/30 border border-border/30 rounded-3xl p-6 space-y-4 animate-pulse",
        )}
      >
        <div className="flex items-start justify-between">
          <div className="w-16 h-16 bg-muted rounded-2xl"></div>
          <div className="w-4 h-4 bg-muted rounded-full"></div>
        </div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-3 bg-muted rounded w-full"></div>
        <div className="h-3 bg-muted rounded w-5/6"></div>
        <div className="h-2 w-full bg-muted rounded-full my-4"></div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-muted rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-2 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      </div>
    )
  }

  const gridClasses = {
    list: "space-y-4",
    table: "space-y-4",
    cards: "grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6",
    grid: "grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6",
    kanban: "", // Kanban has its own skeleton
    calendar: "" // Calendar has its own skeleton
  }

  return (
    <div className="relative overflow-hidden rounded-lg min-h-[500px]">
      <div 
        ref={iconRef}
        className="absolute z-10 p-3 bg-primary/20 rounded-full backdrop-blur-sm"
        style={{ willChange: 'transform' }}
      >
        <Search className="w-6 h-6 text-primary" />
      </div>

      <div 
        ref={containerRef}
        className={cn(gridClasses[viewMode])}
      >
        {[...Array(config.numCards)].map((_, i) => renderSkeletonCard(i))}
      </div>
    </div>
  )
}
```

## File: src/features/dynamic-view/DynamicViewContext.tsx
```typescript
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { ViewConfig, GenericItem, ViewMode, FilterConfig, SortConfig, CalendarDateProp, CalendarDisplayProp, CalendarColorProp, GroupableField } from './types';

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

const DynamicViewContext = createContext<DynamicViewContextProps<any, any> | null>(null);

interface DynamicViewProviderProps<TFieldId extends string, TItem extends GenericItem> extends Omit<DynamicViewContextProps<TFieldId, TItem>, 'getFieldDef' | 'config' | 'data'> {
  viewConfig: ViewConfig<TFieldId, TItem>,
  children: ReactNode;
}

export function DynamicViewProvider<TFieldId extends string, TItem extends GenericItem>({ viewConfig, children, ...rest }: DynamicViewProviderProps<TFieldId, TItem>) {
  const fieldDefsById = useMemo(() => {
    return new Map(viewConfig.fields.map(field => [field.id, field]));
  }, [viewConfig.fields]);

  const getFieldDef = (fieldId: TFieldId) => {
    return fieldDefsById.get(fieldId);
  };

  const value = useMemo(() => ({
    ...rest,
    config: viewConfig,
    data: rest.items, // alias for convenience
    getFieldDef,
  }), [viewConfig, getFieldDef, rest]);

  return (
    <DynamicViewContext.Provider value={value}>
      {children}
    </DynamicViewContext.Provider>
  );
}

export function useDynamicView<TFieldId extends string, TItem extends GenericItem>() {
  const context = useContext(DynamicViewContext);
  if (!context) {
    throw new Error('useDynamicView must be used within a DynamicViewProvider');
  }
  return context as DynamicViewContextProps<TFieldId, TItem>;
}
```

## File: src/hooks/useStaggeredAnimation.motion.hook.ts
```typescript
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAppShellStore } from '@/store/appShell.store';

interface StaggeredAnimationOptions {
	stagger?: number;
	duration?: number;
	y?: number;
	scale?: number;
	ease?: string;
	mode?: 'full' | 'incremental';
}

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
) {
	const reducedMotion = useAppShellStore(s => s.reducedMotion);
	const {
		stagger = 0.08,
		duration = 0.6,
		y = 30,
		scale = 1,
		ease = 'power3.out',
		mode = 'full',
	} = options;

	const animatedItemsCount = useRef(0);

	useLayoutEffect(() => {
		if (reducedMotion || !containerRef.current) return;

		const children = Array.from(containerRef.current.children) as HTMLElement[];

		if (mode === 'incremental') {
			// On dependency change, if the number of children is less than what we've animated,
			// it's a list reset (e.g., filtering), so reset the counter.
			if (children.length < animatedItemsCount.current) {
				animatedItemsCount.current = 0;
			}

			const newItems = children.slice(animatedItemsCount.current);

			if (newItems.length > 0) {
				gsap.fromTo(
					newItems,
					{ y, opacity: 0, scale },
					{
						duration,
						y: 0,
						opacity: 1,
						scale: 1,
						stagger,
						ease,
					},
				);
				animatedItemsCount.current = children.length;
			}
		} else {
			if (children.length) {
				gsap.fromTo(
					children,
					{ y, opacity: 0, scale },
					{
						duration,
						y: 0,
						opacity: 1,
						scale: 1,
						stagger,
						ease,
					},
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [containerRef, ...deps]);
}
```

## File: src/pages/Dashboard/hooks/useDashboardAnimations.motion.hook.ts
```typescript
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { useAppShellStore } from '@/store/appShell.store';
import { BODY_STATES } from '@/lib/utils';
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook';

export function useDashboardAnimations(
  contentRef: React.RefObject<HTMLDivElement>,
  statsCardsContainerRef: React.RefObject<HTMLDivElement>,
  featureCardsContainerRef: React.RefObject<HTMLDivElement>,
) {
  const bodyState = useAppShellStore(s => s.bodyState);
  const reducedMotion = useAppShellStore(s => s.reducedMotion);

  // Animate cards on mount
  useStaggeredAnimation(statsCardsContainerRef, [], { y: 20, scale: 0.95 });
  useStaggeredAnimation(featureCardsContainerRef, [], { y: 30, scale: 0.95, stagger: 0.05 });

  useEffect(() => {
    if (reducedMotion || !contentRef.current) return;

    const content = contentRef.current;

    switch (bodyState) {
      case BODY_STATES.FULLSCREEN:
        gsap.to(content, { scale: 1.02, duration: 0.4, ease: 'power3.out' });
        break;
      default:
        gsap.to(content, { scale: 1, duration: 0.4, ease: 'power3.out' });
        break;
    }
  }, [bodyState, contentRef, reducedMotion]);
}
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

import { PageLayout } from "@/components/shared/PageLayout";
import { 
  useNotificationsStore,
  useFilteredNotifications,
  useNotificationCounts,
  type Notification
} from "./notifications.store";

const iconMap: { [key: string]: React.ElementType } = {
  comment: MessageSquare,
  follow: UserPlus,
  invitation: Mail,
  file_share: FileIcon,
  mention: AtSign,
  like: Heart,
  task_assignment: ClipboardCheck,
  system_update: ShieldCheck,
};

function NotificationItem({ notification }: { notification: Notification; }) {
  const markAsRead = useNotificationsStore(s => s.markAsRead);
  const Icon = iconMap[notification.type];

  return (
    <div className={cn(
      "group w-full p-4 hover:bg-accent/50 rounded-lg transition-colors duration-200"
    )}>
      <div className="flex gap-3">
        <div className="relative h-10 w-10 shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={notification.user.avatar} alt={`${notification.user.name}'s profile picture`} />
            <AvatarFallback>{notification.user.fallback}</AvatarFallback>
          </Avatar>
          {Icon && (
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-background">
              <Icon className={cn("h-3 w-3", notification.type === 'like' ? 'text-red-500 fill-current' : 'text-muted-foreground')} />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col space-y-2">
          <div className="flex items-start justify-between">
            <div className="text-sm">
              <span className="font-semibold">{notification.user.name}</span>
              <span className="text-muted-foreground"> {notification.action} </span>
              {notification.target && <span className="font-semibold">{notification.target}</span>}
              <div className="mt-0.5 text-xs text-muted-foreground">{notification.timeAgo}</div>
            </div>
            <button
              onClick={() => !notification.isRead && markAsRead(notification.id)}
              title={notification.isRead ? "Read" : "Mark as read"}
              className={cn("size-2.5 rounded-full mt-1 shrink-0 transition-all duration-300",
                notification.isRead ? 'bg-transparent' : 'bg-primary hover:scale-125 cursor-pointer'
              )}
            ></button>
          </div>

          {notification.content && <div className="rounded-lg border bg-muted/50 p-3 text-sm">{notification.content}</div>}

          {notification.file && (
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2 border border-border">
              <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-background rounded-md border border-border">
                <FileIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{notification.file.name}</div>
                <div className="text-xs text-muted-foreground">{notification.file.type} • {notification.file.size}</div>
              </div>
              <Button variant="ghost" size="icon" className="size-8 shrink-0">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          )}

          {notification.hasActions && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Decline</Button>
              <Button size="sm">Accept</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function NotificationsPage() {
  const bodyState = useAppShellStore(s => s.bodyState);
  const isInSidePane = bodyState === BODY_STATES.SIDE_PANE;
  
  const { activeTab, setActiveTab, markAllAsRead } = useNotificationsStore(s => ({ activeTab: s.activeTab, setActiveTab: s.setActiveTab, markAllAsRead: s.markAllAsRead }));
  const filteredNotifications = useFilteredNotifications();
  const { unreadCount, verifiedCount, mentionCount } = useNotificationCounts();
  const { show: showToast } = useToast();

  const handleMarkAllAsRead = () => {
    const count = markAllAsRead();
    if (count === 0) {
      showToast({
        title: "Already up to date!",
        message: "You have no unread notifications.",
        variant: "default",
      });
      return;
    }
    showToast({
        title: "All Caught Up!",
        message: "All notifications have been marked as read.",
        variant: "success",
    });
  };

  const content = (
    <Card className={cn("flex w-full flex-col shadow-none", isInSidePane ? "border-none" : "")}>
      <CardHeader className={cn(isInSidePane ? "p-4" : "p-6")}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Your notifications
          </h3>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-8" onClick={handleMarkAllAsRead} title="Mark all as read">
              <CheckCheck className="size-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8">
              <Settings className="size-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'all' | 'verified' | 'mentions')} className="w-full flex-col justify-start mt-4">
          <TabsList className="gap-1.5">
            <TabsTrigger value="all" className="gap-1.5">
              View all {unreadCount > 0 && <Badge variant="secondary" className="rounded-full">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="verified" className="gap-1.5">
              Verified {verifiedCount > 0 && <Badge variant="secondary" className="rounded-full">{verifiedCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="mentions" className="gap-1.5">
              Mentions {mentionCount > 0 && <Badge variant="secondary" className="rounded-full">{mentionCount}</Badge>}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className={cn("h-full p-0", isInSidePane ? "px-2" : "px-6")}>
        <div className="space-y-2 divide-y divide-border">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2.5 py-12 text-center">
              <div className="rounded-full bg-muted p-4">
                <Bell className="text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No notifications yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <PageLayout>
      {!isInSidePane && (
        <PageHeader
          title="Notifications"
          description="Manage your notifications and stay up-to-date."
        />
      )}
      {content}
    </PageLayout>
  );
}
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

## File: src/components/shared/StatCard.tsx
```typescript
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  className?: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  chartData?: number[];
}

export function StatCard({ className, title, value, change, trend, icon, chartData }: StatCardProps) {
  const chartRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    // Only run animation if chartData is present
    if (chartRef.current && chartData) {
      const line = chartRef.current.querySelector('.chart-line');
      const area = chartRef.current.querySelector('.chart-area');
      if (line instanceof SVGPathElement && area) {
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(line, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' });
        gsap.fromTo(area, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.4 });
      }
    }
  }, [chartData]);

  // --- Chart rendering logic (only if chartData is provided) ---
  const renderChart = () => {
    if (!chartData || chartData.length < 2) return null;

    // SVG dimensions
    const width = 150;
    const height = 60;

    // Normalize data
    const max = Math.max(...chartData);
    const min = Math.min(...chartData);
    const range = max - min === 0 ? 1 : max - min;

    const points = chartData
      .map((val, i) => {
        const x = (i / (chartData.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 10) + 5; // Add vertical padding
        return `${x},${y}`;
      });

    const linePath = "M" + points.join(" L");
    const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

    return (
      <div className="mt-4 -mb-2 -mx-2">
        <svg ref={chartRef} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" className="text-primary" stopColor="currentColor" stopOpacity={0.3} />
              <stop offset="100%" className="text-primary" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          </defs>
          <path
            className="chart-area"
            d={areaPath}
            fill="url(#chartGradient)"
          />
          <path
            className="chart-line"
            d={linePath}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };
  // --- End of chart rendering logic ---

  return (
    <Card className={cn(
        "p-6 border-border/50 hover:border-primary/30 transition-all duration-300 group cursor-pointer flex flex-col justify-between",
        !chartData && "h-full", // Ensure cards without charts have consistent height if needed
        className
    )}>
      <div>
        <div className="flex items-center justify-between">
          <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
            {icon}
          </div>
          <div className={cn(
            "text-sm font-medium",
            trend === 'up' ? "text-green-600" : "text-red-600"
          )}>
            {change}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-sm text-muted-foreground mt-1">{title}</p>
        </div>
      </div>
      {renderChart()}
    </Card>
  );
}
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

interface DetailPanelProps<TFieldId extends string, TItem extends GenericItem> {
  item: TItem;
  config: DetailViewConfig<TFieldId>;
}

const SECTION_ICONS: Record<string, React.ElementType> = {
  "Assigned to": User,
  "Engagement Metrics": BarChart3,
  "Tags": Tag,
  "Timeline": Clock,
};

export function DetailPanel<TFieldId extends string, TItem extends GenericItem>({ item, config }: DetailPanelProps<TFieldId, TItem>) {
  const contentRef = useRef<HTMLDivElement>(null)
  useStaggeredAnimation(contentRef, [item]);
  
  const { getFieldDef } = useDynamicView<TFieldId, TItem>();
  const { header, body } = config;
  const [sections, setSections] = useState(body.sections);

  const sectionIds = useMemo(() => sections.map(s => s.title), [sections]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setSections((currentSections) => {
        const oldIndex = sectionIds.indexOf(active.id as string);
        const newIndex = sectionIds.indexOf(over!.id as string);
        return arrayMove(currentSections, oldIndex, newIndex);
      });
    }
  };

  if (!item) {
    return null
  }
  
  return (
    <div ref={contentRef} className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
             <EditableField item={item} fieldId={header.thumbnailField} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold mb-1 leading-tight">
              <EditableField item={item} fieldId={header.titleField} />
            </h1>
            <p className="text-muted-foreground">
              <EditableField item={item} fieldId={header.descriptionField} />
            </p>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {header.badgeFields.map((fieldId: TFieldId) => (
            <EditableField key={fieldId} item={item} fieldId={fieldId} />
          ))}
        </div>

        {/* Progress */}
        <EditableField item={item} fieldId={header.progressField} options={{ showPercentage: true }} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sectionIds}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section) => {
                const IconComponent = SECTION_ICONS[section.title];
                const hasContent = section.fields.some((fieldId: TFieldId) => {
                  const value = getNestedValue(item, fieldId as string);
                  return value !== null && typeof value !== 'undefined';
                });

                if (!hasContent) return null;

                return (
                  <DraggableSection key={section.title} id={section.title} >
                    <div className="p-4 bg-card/30 rounded-2xl border border-border/30">
                      <div className="flex items-center gap-1 mb-3">
                        {IconComponent && <IconComponent className="w-4 h-4 text-muted-foreground" />}
                        <h3 className="font-semibold text-sm">{section.title}</h3>
                      </div>
                      <div className="space-y-3">
                        {section.fields.map((fieldId: TFieldId) => {
                          const fieldDef = getFieldDef(fieldId);
                          return (
                            <div key={fieldId} className="flex items-start gap-4 text-sm">
                              <div className="w-1/3 text-muted-foreground pt-1.5 shrink-0">{fieldDef?.label}</div>
                              <div className="w-2/3 grow"><EditableField item={item} fieldId={fieldId} /></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </DraggableSection>
                );
              })}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  )
}
```

## File: src/features/dynamic-view/components/shared/FieldRenderer.tsx
```typescript
import { useDynamicView } from '../../DynamicViewContext';
import type { GenericItem, BadgeFieldDefinition, FieldDefinition } from '../../types';
import { cn, getNestedValue } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Heart, Share } from 'lucide-react';

interface FieldRendererProps<TFieldId extends string, TItem extends GenericItem> {
  item: TItem;
  fieldId: TFieldId;
  className?: string;
  options?: Record<string, any>; // For extra props like 'compact' for avatar
}

export function FieldRenderer<TFieldId extends string, TItem extends GenericItem>({ item, fieldId, className, options }: FieldRendererProps<TFieldId, TItem>) {
  const { getFieldDef } = useDynamicView<TFieldId, TItem>();
  const fieldDef = getFieldDef(fieldId);
  const value = getNestedValue(item, fieldId);

  // Custom render function takes precedence
  if (fieldDef?.render) {
    return <>{(fieldDef as FieldDefinition<TFieldId, TItem>).render?.(item, options)}</>;
  }

  if (!fieldDef) {
    console.warn(`[FieldRenderer] No field definition found for ID: ${fieldId}`);
    return <span className="text-red-500">?</span>;
  }

  if (value === null || typeof value === 'undefined') {
    return null; // Or some placeholder like 'N/A'
  }
  
  switch (fieldDef.type) {
    case 'string':
    case 'longtext':
      return <span className={cn("truncate", className)}>{String(value)}</span>;
    
    case 'thumbnail':
      return <span className={cn("text-xl", className)}>{String(value)}</span>;

    case 'badge': {
      const { colorMap, indicatorColorMap } = fieldDef as BadgeFieldDefinition<TFieldId, TItem>;
      
      if (options?.displayAs === 'indicator' && indicatorColorMap) {
        const indicatorColorClass = indicatorColorMap[String(value)] || 'bg-muted-foreground';
        return (
          <div className={cn("w-3 h-3 rounded-full", indicatorColorClass, className)} />
        );
      }

      const colorClass = colorMap?.[String(value)] || '';
      return (
        <Badge variant="outline" className={cn("font-medium capitalize", colorClass, className)}>
          {String(value)}
        </Badge>
      );
    }
    
    case 'avatar': {
      const { compact = false, avatarClassName = "w-8 h-8" } = options || {};
      const avatarUrl = getNestedValue(value, 'avatar');
      const name = getNestedValue(value, 'name');
      const email = getNestedValue(value, 'email');
      const fallback = name?.split(' ').map((n: string) => n[0]).join('') || '?';

      const avatarEl = (
        <Avatar className={cn("border-2 border-transparent group-hover:border-primary/50 transition-colors", avatarClassName)}>
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      );
      if (compact) return avatarEl;

      return (
        <div className={cn("flex items-center gap-2 group", className)}>
          {avatarEl}
          <div className="min-w-0 hidden sm:block">
            <p className="font-medium text-sm truncate">{name}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>
      );
    }
    
    case 'progress': {
      const { showPercentage = false } = options || {};
      const bar = (
        <div className="w-full bg-muted rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-primary to-primary/80 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${value}%` }}
          />
        </div>
      );
      if (!showPercentage) return bar;
      
      return (
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">{bar}</div>
          <span className="text-sm font-medium text-muted-foreground">{value}%</span>
        </div>
      );
    }

    case 'date':
      return (
        <div className={cn("flex items-center gap-1.5 text-sm", className)}>
          <Clock className="w-4 h-4" />
          <span>{new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      );

    case 'tags': {
      const MAX_TAGS = 2;
      const tags = Array.isArray(value) ? value : [];
      const remainingTags = tags.length - MAX_TAGS;
      return (
        <div className={cn("flex items-center gap-1.5 flex-wrap", className)}>
          {tags.slice(0, MAX_TAGS).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
          {remainingTags > 0 && (
            <Badge variant="outline" className="text-xs">+{remainingTags}</Badge>
          )}
        </div>
      );
    }

    case 'metrics': {
      const views = getNestedValue(value, 'views') || 0;
      const likes = getNestedValue(value, 'likes') || 0;
      const shares = getNestedValue(value, 'shares') || 0;
      return (
        <div className={cn("flex items-center gap-3 text-sm", className)}>
          <div className="flex items-center gap-1"><Eye className="w-4 h-4" /> {views}</div>
          <div className="flex items-center gap-1"><Heart className="w-4 h-4" /> {likes}</div>
          <div className="flex items-center gap-1"><Share className="w-4 h-4" /> {shares}</div>
        </div>
      );
    }
      
    default:
      return <>{String(value)}</>;
  }
}
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

export function TableView({ data, ctaElement }: { data: GenericItem[], ctaElement?: ReactNode }) {
  const { config, sortConfig, onSortChange, groupBy, onItemSelect, selectedItemId } = useDynamicView<string, GenericItem>();
  const { tableView: viewConfig } = config;

  const tableRef = useRef<HTMLTableElement>(null)
  const animatedItemsCount = useRef(0)

  useLayoutEffect(() => {
    if (tableRef.current) {
      // Only select item rows for animation, not group headers
      const newItems = Array.from( 
        tableRef.current.querySelectorAll('tbody tr')
      ).filter(tr => !(tr as HTMLElement).dataset.groupHeader)
       .slice(animatedItemsCount.current);
      gsap.fromTo(newItems,
        { y: 20, opacity: 0 },
        {
          duration: 0.5,
          y: 0,
          opacity: 1,
          stagger: 0.05,
          ease: "power2.out",
        },
      );
      animatedItemsCount.current = data.length;
    }
  }, [data]);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortConfig?.key !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp className="w-4 h-4 text-primary" />
    }
    if (sortConfig.direction === 'desc') {
      return <ArrowDown className="w-4 h-4 text-primary" />
    }
    return <ArrowUpDown className="w-4 h-4 opacity-50" />
  }

  const handleSortClick = (field: string) => {
    const newDirection = (sortConfig?.key === field && sortConfig.direction === 'desc') ? 'asc' : 'desc';
    onSortChange({ key: field, direction: newDirection });
  }

  const groupedData = useMemo(() => {
    if (groupBy === 'none') return null;
    return (data as GenericItem[]).reduce((acc, item) => {
      const groupKey = item[groupBy as 'status' | 'priority' | 'category'] || 'N/A';
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    }, {} as Record<string, GenericItem[]>);
  }, [data, groupBy]);

  if (data.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table ref={tableRef} className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20">
              {viewConfig.columns.map(col => (
                <th key={col.fieldId} className="text-left p-4 font-semibold text-sm">
                  {col.isSortable ? (
                    <button
                      onClick={() => handleSortClick(col.fieldId)}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      {col.label}
                      <SortIcon field={col.fieldId} />
                    </button>
                  ) : (
                    <span>{col.label}</span>
                  )}
                </th>
              ))}
              <th className="text-center p-4 font-semibold text-sm w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groupedData
              ? Object.entries(groupedData).flatMap(([groupName, items]) => [
                  <tr key={groupName} data-group-header="true" className="sticky top-0 z-10">
                    <td colSpan={viewConfig.columns.length + 1} className="p-2 bg-muted/50 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{capitalize(groupName)}</h3>
                        <span className="text-xs px-2 py-0.5 bg-background rounded-full font-medium">{items.length}</span>
                      </div>
                    </td>
                  </tr>,
                  ...items.map(item => <TableRow key={item.id} item={item} isSelected={selectedItemId === item.id} onItemSelect={onItemSelect} />)
                ])
              : data.map(item => <TableRow key={item.id} item={item} isSelected={selectedItemId === item.id} onItemSelect={onItemSelect} />)
            }
            {ctaElement}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TableRow({ item, isSelected, onItemSelect }: { item: GenericItem; isSelected: boolean; onItemSelect: (item: GenericItem) => void }) {
  const { config } = useDynamicView<string, GenericItem>();
  return (
    <tr
      onClick={() => onItemSelect(item)}
      className={cn(
        "group border-b border-border/30 transition-all duration-200 cursor-pointer",
        "hover:bg-accent/20 hover:border-primary/20",
        isSelected && "bg-primary/5 border-primary/30"
      )}
    >
      {config.tableView.columns.map(col => (
        <td key={col.fieldId} className="p-4">
          <FieldRenderer item={item} fieldId={col.fieldId} options={{ showPercentage: true }} />
        </td>
      ))}
      {/* Actions Column */}
      <td className="p-4">
        <button 
          onClick={(e) => {
            e.stopPropagation()
            onItemSelect(item)
          }}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-accent transition-colors"
          title="View details"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </td>
    </tr>
  )
}
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

export function DynamicView<TFieldId extends string, TItem extends GenericItem>({ viewConfig, ...rest }: DynamicViewProps<TFieldId, TItem>) {
  
  const { viewMode, isInitialLoading, isLoading, hasMore, items, groupBy, statsData, scrollContainerRef } = rest;
  const statsRef = useRef<HTMLDivElement>(null);

  // Auto-hide stats container on scroll down
  useAutoAnimateStats(scrollContainerRef!, statsRef);

  useEffect(() => {
    // Animate stats cards in
    if (!isInitialLoading && statsRef.current) {
      gsap.fromTo(statsRef.current.children,
        { y: 30, opacity: 0 },
        {
          duration: 0.5,
          y: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "power2.out"
        }
      )
    }
  }, [isInitialLoading]);

  const groupedData = useMemo(() => {
    if (groupBy === 'none' || viewMode !== 'kanban') {
        return null;
    }
    return (items as TItem[]).reduce((acc, item) => {
        const groupKey = String(item[groupBy as keyof TItem]) || 'N/A';
        if (!acc[groupKey]) {
            acc[groupKey] = [] as TItem[];
        }
        acc[groupKey].push(item);
        return acc;
    }, {} as Record<string, TItem[]>);
  }, [items, groupBy, viewMode]);

  const renderViewForData = useCallback((data: TItem[], cta: ReactNode) => {
    switch (viewMode) {
        case 'table': return <TableView data={data} ctaElement={cta} />;
        case 'cards': return <CardView data={data} ctaElement={cta} />;
        case 'grid': return <CardView data={data} isGrid ctaElement={cta} />;
        case 'list': default: return <ListView data={data} ctaElement={cta} />;
    }
  }, [viewMode]);

  const renderContent = () => {
    if (isInitialLoading) {
      return <AnimatedLoadingSkeleton viewMode={viewMode} />;
    }

    if (viewMode === 'calendar') {
        return <CalendarView data={items} />;
    }

    if (viewMode === 'kanban') {
        return groupedData ? (
          <KanbanView data={groupedData} />
        ) : (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            Group data by a metric to use the Kanban view.
          </div>
        );
    }
    
    if (items.length === 0 && !isInitialLoading) {
        return <EmptyState />;
    }
    
    const ctaProps = {
        colSpan: viewMode === 'table' ? viewConfig.tableView.columns.length + 1 : undefined,
    };
    const ctaElement = rest.renderCta
        ? rest.renderCta(viewMode, ctaProps)
        : null;
    
    // This will be expanded later to handle group tabs
    return renderViewForData(items, ctaElement);
  };

  return (
    <DynamicViewProvider<TFieldId, TItem> viewConfig={viewConfig} {...rest}>
      <div className="space-y-6">
          <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                      {rest.renderHeaderControls ? rest.renderHeaderControls() : (
                          <>
                              <h1 className="text-2xl font-bold tracking-tight">Data Showcase</h1>
                              <p className="text-muted-foreground">
                                  {isInitialLoading 
                                      ? "Loading projects..." 
                                      : `Showing ${items.length} of ${rest.totalItemCount} item(s)`}
                              </p>
                          </>
                      )}
                  </div>
                  <ViewModeSelector />
              </div>
              <ViewControls />
          </div>

          {!isInitialLoading && statsData && statsData.length > 0 && (
            <div ref={statsRef} className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
              {statsData.map((stat) => (
                <StatCard
                  className="w-64 md:w-72 flex-shrink-0"
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  trend={stat.trend}
                  icon={stat.icon}
                  chartData={stat.chartData}
                />
              ))}
            </div>
          )}
          
          <div className="min-h-[500px]">
              {renderContent()}
          </div>

          {/* Loader for infinite scroll */}
          <div ref={rest.loaderRef} className="flex justify-center items-center py-6">
            {isLoading && !isInitialLoading && groupBy === 'none' && viewMode !== 'calendar' && viewMode !== 'kanban' && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading more...</span>
              </div>
            )}
            {!isLoading && !hasMore && items.length > 0 && !isInitialLoading && groupBy === 'none' && viewMode !== 'calendar' && viewMode !== 'kanban' && (
              <p className="text-muted-foreground">You've reached the end.</p>
            )}
          </div>
      </div>
    </DynamicViewProvider>
  );
}
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

export const DemoContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function DemoContent(props, ref) {
  const bodyState = useAppShellStore(s => s.bodyState);
  const sidebarState = useAppShellStore(s => s.sidebarState);
  const compactMode = useAppShellStore(s => s.compactMode);
  const isDarkMode = useAppShellStore(s => s.isDarkMode);
  const contentRef = useRef<HTMLDivElement>(null)

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Amazing Animations",
      description: "Powered by GSAP for smooth, buttery animations",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Built with Vite and optimized for performance",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Multiple States",
      description: "Fullscreen, side pane, and normal viewing modes",
      color: "from-emerald-500 to-green-500"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "TypeScript",
      description: "Fully typed with excellent developer experience",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Beautiful Design",
      description: "Shadcn/ui components with Tailwind CSS",
      color: "from-teal-500 to-emerald-500"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Customizable",
      description: "Extensive settings and preferences panel",
      color: "from-slate-500 to-gray-500"
    }
  ]

  const stats = [
    { label: "Components", value: "12+", color: "text-emerald-600" },
    { label: "Animations", value: "25+", color: "text-teal-600" },
    { label: "States", value: "7", color: "text-primary" },
    { label: "Settings", value: "10+", color: "text-amber-600" }
  ]

  return (
    <div ref={contentRef} className="p-8 space-y-12" {...props}>
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Rocket className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Jeli App Shell</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A super flexible application shell with resizable sidebar, multiple body states, 
          smooth animations, and comprehensive settings - all built with modern web technologies.
        </p>
        
        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-12 mt-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={cn("text-2xl font-bold", stat.color)}>{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="group relative overflow-hidden border-border/50 p-6 hover:border-primary/30 hover:bg-accent/30 transition-all duration-300 cursor-pointer"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-transform">
                {feature.icon}
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Technology Stack */}
      <Card className="border-border/50 p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500" />
          Technology Stack
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "React 18", desc: "Latest React with hooks" },
            { name: "TypeScript", desc: "Type-safe development" },
            { name: "Vite", desc: "Lightning fast build tool" },
            { name: "Tailwind CSS", desc: "Utility-first styling" },
            { name: "GSAP", desc: "Professional animations" },
            { name: "Zustand", desc: "Lightweight state management" },
            { name: "Shadcn/ui", desc: "Beautiful components" },
            { name: "Lucide Icons", desc: "Consistent iconography" }
          ].map((tech) => (
            <div key={tech.name} className="bg-background rounded-xl p-4 border border-border/50">
              <h4 className="font-medium">{tech.name}</h4>
              <p className="text-sm text-muted-foreground">{tech.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Current State Display */}
      <Card className="border-border/50 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          Current App State
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-background rounded-xl">
            <div className="text-sm text-muted-foreground">Sidebar</div>
            <div className="font-medium capitalize">{sidebarState}</div>
          </div>
          <div className="text-center p-3 bg-background rounded-xl">
            <div className="text-sm text-muted-foreground">Body State</div>
            <div className="font-medium capitalize">{bodyState.replace('_', ' ')}</div>
          </div>
          <div className="text-center p-3 bg-background rounded-xl">
            <div className="text-sm text-muted-foreground">Theme</div>
            <div className="font-medium">{isDarkMode ? 'Dark' : 'Light'}</div>
          </div>
          <div className="text-center p-3 bg-background rounded-xl">
            <div className="text-sm text-muted-foreground">Mode</div>
            <div className="font-medium">{compactMode ? 'Compact' : 'Normal'}</div>
          </div>
        </div>
      </Card>

      {/* Interactive Demo */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          Try It Out!
        </h2>
        <p className="text-muted-foreground">
          Use the controls in the top bar to explore different states, toggle the sidebar, 
          or open settings to customize the experience. The sidebar is resizable by dragging the edge!
        </p>
        
        <div className="flex items-center justify-center gap-4 pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Smartphone className="w-4 h-4" />
            <span>Responsive</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4" />
            <span>Fast</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="w-4 h-4" />
            <span>Beautiful</span>
          </div>
        </div>
      </div>
    </div>
  )
})
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

interface MessagingContentProps {
  conversationId?: string;
}

export const MessagingContent: React.FC<MessagingContentProps> = ({ conversationId }) => {
  const [activeTab, setActiveTab] = useState('contact');
  const task = useMessagingStore(state => conversationId ? state.getTaskById(conversationId) : undefined);
  
  const tabs = useMemo(() => [
    { id: 'contact', label: 'Contact' },
    { id: 'ai', label: 'AI Insights' },
    { id: 'activity', label: 'Activity' },
    { id: 'notes', label: 'Notes' },
  ], []);

  if (!task) {
    return (
      <div className="h-full flex-1 flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
        <TechOrbitDisplay text="Context" />
        <div className="text-center z-10 bg-background/50 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="mt-4 text-lg font-medium">Select a Task</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Task details and contact information will appear here.
            </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex-1 flex flex-col bg-background overflow-hidden" data-testid="messaging-content-scroll-pane">
      <div className="flex-shrink-0 border-b p-6">
        <TaskHeader task={task} />
      </div>
      <AnimatedTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        size="sm" 
        className="px-6 border-b flex-shrink-0"
        wrapperClassName="flex-1 flex flex-col min-h-0"
        contentClassName="flex-1 min-h-0"
      >
        <div className="p-6 h-full overflow-y-auto"><ContactInfoPanel contact={task.contact} /></div>
        <div className="p-6 h-full overflow-y-auto"><AIInsightsPanel task={task} /></div>
        <div className="p-6 h-full overflow-y-auto"><ActivityPanel contact={task.contact} /></div>
        <div className="p-6 h-full overflow-y-auto"><NotesPanel contact={task.contact} /></div>
      </AnimatedTabs>
    </div>
  );
};
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

const statusOptions: { value: TaskStatus; label: string; icon: React.ReactNode }[] = [
    { value: 'open', label: 'Open', icon: <Inbox className="w-4 h-4" /> },
    { value: 'in-progress', label: 'In Progress', icon: <Zap className="w-4 h-4" /> },
    { value: 'done', label: 'Done', icon: <Shield className="w-4 h-4" /> },
    { value: 'snoozed', label: 'Snoozed', icon: <Clock className="w-4 h-4" /> },
];

const priorityOptions: { value: TaskPriority; label: string; icon: React.ReactNode }[] = [
    { value: 'high', label: 'High', icon: <div className="w-2.5 h-2.5 rounded-full bg-red-500" /> },
    { value: 'medium', label: 'Medium', icon: <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> },
    { value: 'low', label: 'Low', icon: <div className="w-2.5 h-2.5 rounded-full bg-green-500" /> },
    { value: 'none', label: 'None', icon: <div className="w-2.5 h-2.5 rounded-full bg-gray-400" /> },
];


interface TaskHeaderProps {
  task: (Task & { contact: Contact; assignee: Assignee | null; activeHandler: Assignee | null });
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({ task }) => {
  const { updateTask, assignees } = useMessagingStore();
  const currentStatus = statusOptions.find(o => o.value === task.status);
  const currentPriority = priorityOptions.find(o => o.value === task.priority);
  const currentUserId = 'user-1'; // Mock current user
  const isHandledByOther = task.activeHandler && task.activeHandlerId !== currentUserId;


  return (
    <div className="space-y-4">
      {/* Task Title & Contact */}
      <div className="overflow-hidden">
        <h2 className="font-bold text-xl lg:text-2xl truncate" title={task.title}>
          {task.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          With <a href="#" className="hover:underline font-medium text-foreground/80">{task.contact.name}</a> from <strong className="font-medium text-foreground/80">{task.contact.company}</strong>
          <span className="mx-1">&middot;</span>
          via <span className="capitalize font-medium text-foreground/80">{task.channel}</span>
        </p>
      </div>

      {/* Properties Bar */}
      <div className="flex flex-wrap items-center gap-y-2 text-sm">
        {/* Assignee Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 font-normal">
              {task.assignee ? (
                <Avatar className="h-5 w-5"><AvatarImage src={task.assignee.avatar} /><AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback></Avatar>
              ) : (
                <User className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="font-medium">{task.assignee?.name || 'Unassigned'}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup value={task.assigneeId || 'null'} onValueChange={val => updateTask(task.id, { assigneeId: val === 'null' ? null : val })}>
              <DropdownMenuRadioItem value="null">
                <User className="w-4 h-4 mr-2 text-muted-foreground" /> Unassigned
              </DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              {assignees.map(a => (
                <DropdownMenuRadioItem key={a.id} value={a.id}>
                  <Avatar className="h-5 w-5 mr-2"><AvatarImage src={a.avatar} /><AvatarFallback>{a.name.charAt(0)}</AvatarFallback></Avatar>
                  {a.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {isHandledByOther && (
            <>
                <div className="mx-2 h-4 w-px bg-border" />
                <Badge variant="outline" className="gap-2 font-normal text-amber-600 border-amber-600/50">
                    <Eye className="w-3.5 h-3.5" /> Viewing: {task.activeHandler?.name}
                </Badge>
            </>
        )}
        <div className="mx-2 h-4 w-px bg-border" />

        {/* Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              {currentStatus?.icon}
              <span className="font-medium text-foreground">{currentStatus?.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {statusOptions.map(o => (
              <DropdownMenuItem key={o.value} onClick={() => updateTask(task.id, { status: o.value })}>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2">{o.icon}</div>
                  <span>{o.label}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="mx-2 h-4 w-px bg-border" />
        
        {/* Priority Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              {currentPriority?.icon}
              <span className="font-medium text-foreground">{currentPriority?.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {priorityOptions.map(o => (
              <DropdownMenuItem key={o.value} onClick={() => updateTask(task.id, { priority: o.value })}>
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 mr-2">{o.icon}</div>
                  <span>{o.label}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-2 h-4 w-px bg-border" />

        {/* Due Date - for display, could be a popover trigger */}
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground cursor-default" disabled>
            <Calendar className="w-4 h-4" />
            <span className="font-medium text-foreground">{task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}</span>
        </Button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2">
        {task.tags.map(t => <Badge variant="secondary" key={t}>{t}</Badge>)}
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs rounded-md border-dashed">
          <Plus className="w-3 h-3 mr-1" /> Tag
        </Button>
      </div>
    </div>
  );
};
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

// ==================== Main LoginPage Component ====================
export function LoginPage() {
	const {
		state,
		setState,
		email,
		setEmail,
		setPassword,
		isLoading,
		errors,
		showPassword,
		setShowPassword,
		handleLoginSubmit,
		handleForgotSubmit,
	} = useLoginForm();


	const renderContent = () => {
		if (state === 'reset-sent') {
			return (
				<div className="w-full max-w-md mx-auto text-center flex flex-col gap-4">
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.5}>
						<div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
							<Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
						</div>
					</BoxReveal>
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.5}>
						<h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
					</BoxReveal>
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.5}>
						<p className="text-muted-foreground">We've sent a password reset link to <strong>{email}</strong></p>
					</BoxReveal>
					<BoxReveal width="100%" boxColor="hsl(var(--skeleton))" duration={0.5}>
						<button onClick={() => setState('login')} className="text-sm text-blue-500 hover:underline">
							<div className="flex items-center justify-center gap-2">
								<ArrowLeft className="w-4 h-4" /> Back to login
							</div>
						</button>
					</BoxReveal>
				</div>
			);
		}

		const isLogin = state === 'login';
		const formFields = isLogin
			? [
				{ label: 'Email', required: true, type: 'email', placeholder: 'Enter your email address', onChange: (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) },
				{ label: 'Password', required: true, type: 'password', placeholder: 'Enter your password', onChange: (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value) },
			]
			: [{ label: 'Email', required: true, type: 'email', placeholder: 'Enter your email address', onChange: (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) }];

		return (
			<div className="w-full max-w-md mx-auto flex flex-col gap-4">
				<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3}>
					<h2 className="font-bold text-3xl text-neutral-800 dark:text-neutral-200">{isLogin ? 'Welcome back' : 'Reset Password'}</h2>
				</BoxReveal>
				<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3} className="pb-2">
					<p className="text-neutral-600 text-sm max-w-sm dark:text-neutral-300">{isLogin ? 'Sign in to your account to continue' : 'Enter your email to receive a reset link'}</p>
				</BoxReveal>
				{isLogin && (
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3} width="100%" className="overflow-visible">
						<button className="g-button group/btn bg-transparent w-full rounded-md border h-10 font-medium outline-hidden hover:cursor-pointer" type="button">
							<span className="flex items-center justify-center w-full h-full gap-3">
								<img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" width={26} height={26} alt="Google Icon" />
								Sign in with Google
							</span>
							<BottomGradient />
						</button>
					</BoxReveal>
				)}
				{isLogin && (
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3} width="100%">
						<div className="flex items-center gap-4">
							<hr className="flex-1 border-1 border-dashed border-neutral-300 dark:border-neutral-700" />
							<p className="text-neutral-700 text-sm dark:text-neutral-300">or</p>
							<hr className="flex-1 border-1 border-dashed border-neutral-300 dark:border-neutral-700" />
						</div>
					</BoxReveal>
				)}
				<form onSubmit={isLogin ? handleLoginSubmit : handleForgotSubmit}>
					{formFields.map((field) => (
						<div key={field.label} className="flex flex-col gap-2 mb-4">
							<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3}>
								<Label htmlFor={field.label}>{field.label} <span className="text-red-500">*</span></Label>
							</BoxReveal>
							<BoxReveal width="100%" boxColor="hsl(var(--skeleton))" duration={0.3} className="flex flex-col space-y-2 w-full">
								<div className="relative">
									<AnimatedInput type={field.type === 'password' ? (showPassword ? 'text' : 'password') : field.type} id={field.label} placeholder={field.placeholder} onChange={field.onChange} />
									{field.type === 'password' && (
										<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
											{showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
										</button>
									)}
								</div>
								<div className="h-4">{errors[field.label.toLowerCase() as keyof typeof errors] && <p className="text-red-500 text-xs">{errors[field.label.toLowerCase() as keyof typeof errors]}</p>}</div>
							</BoxReveal>
						</div>
					))}

					<BoxReveal width="100%" boxColor="hsl(var(--skeleton))" duration={0.3} className="overflow-visible">
						<button
							className="bg-gradient-to-br relative group/btn from-zinc-200 dark:from-zinc-900 dark:to-zinc-900 to-zinc-200 block dark:bg-zinc-800 w-full text-black dark:text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] outline-hidden hover:cursor-pointer disabled:opacity-50"
							type="submit" disabled={isLoading}
						>
							{isLoading ? (
								<div className="flex items-center justify-center gap-2">
									<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
									<span>Processing...</span>
								</div>
							) : (
								<>{isLogin ? 'Sign in' : 'Send reset link'} &rarr;</>
							)}
							<BottomGradient />
						</button>
					</BoxReveal>
					<BoxReveal boxColor="hsl(var(--skeleton))" duration={0.3}>
						<div className="mt-4 text-center">
							<button type="button" className="text-sm text-blue-500 hover:underline" onClick={() => setState(isLogin ? 'forgot-password' : 'login')}>
								{isLogin ? 'Forgot password?' : 'Back to login'}
							</button>
						</div>
					</BoxReveal>
				</form>
			</div>
		);
	};

	return (
		<section className="flex max-lg:justify-center min-h-screen w-full login-page-theme bg-background text-foreground">
			{/* Left Side */}
			<div className="flex flex-col justify-center w-1/2 max-lg:hidden relative bg-muted">
				<Ripple />
				<TechOrbitDisplay />
			</div>

			{/* Right Side */}
			<div className="w-1/2 h-screen flex flex-col justify-center items-center max-lg:w-full max-lg:px-[10%]">
				{renderContent()}
			</div>
		</section>
	);
}
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

export function CommandPalette() {
  const { setCompactMode, toggleFullscreen, setCommandPaletteOpen, toggleDarkMode } = useAppShellStore.getState();
  const isCommandPaletteOpen = useAppShellStore(s => s.isCommandPaletteOpen);
  const isDarkMode = useAppShellStore(s => s.isDarkMode);
  const viewManager = useAppViewManager();
  useCommandPaletteToggle()
  
  const runCommand = (command: () => void) => {
    setCommandPaletteOpen(false);
    command()
  }

  return (
    <CommandDialog open={isCommandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => viewManager.navigateTo('dashboard'))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Go to Dashboard</span>
            <CommandShortcut>G D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => viewManager.navigateTo('settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Go to Settings</span>
            <CommandShortcut>G S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => viewManager.navigateTo('toaster'))}>
            <Component className="mr-2 h-4 w-4" />
            <span>Go to Toaster Demo</span>
            <CommandShortcut>G T</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => viewManager.navigateTo('notifications'))}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Go to Notifications</span>
            <CommandShortcut>G N</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(toggleDarkMode)}>
            {isDarkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            <span>Toggle Theme</span>
            <CommandShortcut>⌘T</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(toggleFullscreen)}>
            <Maximize className="mr-2 h-4 w-4" />
            <span>Toggle Fullscreen</span>
            <CommandShortcut>⌘F</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => viewManager.openSidePane('settings'))}>
            <PanelRight className="mr-2 h-4 w-4" />
            <span>Open Settings in Side Pane</span>
            <CommandShortcut>⌥S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Preferences">
          <CommandItem onSelect={() => runCommand(() => setCompactMode(true))}>
            <Smartphone className="mr-2 h-4 w-4" />
            <span>Enable Compact Mode</span>
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setCompactMode(false))}>
            <Monitor className="mr-2 h-4 w-4" />
            <span>Disable Compact Mode</span>
            <CommandShortcut>⇧⌘C</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

## File: src/components/ui/animated-tabs.tsx
```typescript
"use client"

import React, { useState, useRef, useEffect, useLayoutEffect, useId } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"

interface Tab {
  id: string
  label: React.ReactNode
  count?: number
}

interface AnimatedTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void,
  size?: 'default' | 'sm',
  children?: React.ReactNode,
  wrapperClassName?: string,
  contentClassName?: string
}

const AnimatedTabs = React.forwardRef<HTMLDivElement, AnimatedTabsProps>(
  ({ className, tabs, activeTab, onTabChange, size = 'default', children, wrapperClassName, contentClassName, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [hoveredTabId, setHoveredTabId] = useState<string | null>(null)
    const contentTrackRef = useRef<HTMLDivElement>(null)
    const uniqueId = useId()
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
    useLayoutEffect(() => {
      const activeElement = tabRefs.current[activeIndex];
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
        activeElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }, [activeIndex, tabs]);

    // Animate content track position
    useLayoutEffect(() => {
      if (contentTrackRef.current) {
        gsap.to(contentTrackRef.current, {
          xPercent: -100 * activeIndex,
          duration: 0.4,
          ease: "power3.inOut",
        })
      }
    }, [activeIndex]);

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

    const tabHeadersRootProps = {
      className: cn("overflow-x-auto overflow-y-hidden no-scrollbar", className),
      role: "tablist",
      ...props
    };

    const TabHeadersContent = (
      <div className="relative flex w-max items-center whitespace-nowrap">
        {/* Active Indicator */}
        <div
          className="absolute -bottom-px h-0.5 bg-primary transition-all duration-300 ease-out"
          style={activeStyle}
        />

        {/* Tabs */}
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`tab-${uniqueId}-${tab.id}`}
            ref={(el) => (tabRefs.current[index] = el)}
            role="tab"
            aria-selected={index === activeIndex}
            aria-controls={`tabpanel-${uniqueId}-${tab.id}`}
            className={cn(
              "group relative cursor-pointer text-center transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              size === 'default' ? "px-4 py-5" : "px-3 py-2.5",
              index === activeIndex 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => onTabChange(tab.id)}
            onMouseEnter={() => setHoveredTabId(tab.id)}
            onMouseLeave={() => setHoveredTabId(null)}
          >
            <span className={cn(
              "flex items-center gap-2",
              size === 'default' 
                ? "text-lg font-semibold"
                : "text-sm font-medium"
            )}>
              {tab.label}
              {typeof tab.count === 'number' && (tab.id === activeTab || tab.id === hoveredTabId) && (
                <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    );

    if (!children) {
      return (
        <div ref={ref} {...tabHeadersRootProps}>
          {TabHeadersContent}
        </div>
      );
    }

    return (
      <div ref={ref} className={wrapperClassName}>
        <div {...tabHeadersRootProps}>{TabHeadersContent}</div>
        <div className={cn("relative overflow-hidden", contentClassName)}>
          <div ref={contentTrackRef} className="flex h-full w-full">
            {React.Children.map(children, (child, index) => (
              <div
                key={tabs[index].id}
                id={`tabpanel-${uniqueId}-${tabs[index].id}`}
                role="tabpanel"
                aria-labelledby={`tab-${uniqueId}-${tabs[index].id}`}
                aria-hidden={activeIndex !== index}
                className="h-full w-full flex-shrink-0"
              >
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
)
AnimatedTabs.displayName = "AnimatedTabs"

export { AnimatedTabs }
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

interface KanbanCardProps {
  item: GenericItem;
  isDragging: boolean;
}

function KanbanCard({ item, isDragging, ...props }: KanbanCardProps & React.HTMLAttributes<HTMLDivElement>) {
  const { config, onItemSelect } = useDynamicView<string, GenericItem>();
  const { kanbanView: viewConfig } = config;

  return (
    <Card
      {...props}
      data-draggable-id={item.id}
      onClick={() => onItemSelect(item)}
      className={cn(
        "cursor-pointer transition-all duration-300 border bg-card/60 dark:bg-neutral-800/60 backdrop-blur-sm hover:bg-card/70 dark:hover:bg-neutral-700/70 active:cursor-grabbing",
        isDragging && "opacity-50 ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      <CardContent className="p-5">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-card-foreground dark:text-neutral-100 leading-tight">
              <FieldRenderer item={item} fieldId={viewConfig.cardFields.titleField} />
            </h4>
            <GripVertical className="w-5 h-5 text-muted-foreground/60 dark:text-neutral-400 cursor-grab flex-shrink-0" />
          </div>

          <p className="text-sm text-muted-foreground dark:text-neutral-300 leading-relaxed line-clamp-2">
            <FieldRenderer item={item} fieldId={viewConfig.cardFields.descriptionField} />
          </p>

          <div className="flex flex-wrap gap-2">
            <FieldRenderer item={item} fieldId={viewConfig.cardFields.priorityField} />
            <FieldRenderer item={item} fieldId={viewConfig.cardFields.tagsField} />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/30 dark:border-neutral-700/30">
            <div className="flex items-center gap-4 text-muted-foreground/80 dark:text-neutral-400">
              <FieldRenderer item={item} fieldId={viewConfig.cardFields.dateField} />
              <FieldRenderer item={item} fieldId={viewConfig.cardFields.metricsField} />
            </div>
            <FieldRenderer item={item} fieldId={viewConfig.cardFields.assigneeField} options={{ compact: true, avatarClassName: 'w-8 h-8 ring-2 ring-white/50 dark:ring-neutral-700/50' }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DataKanbanViewProps {
  data: Record<string, GenericItem[]>;
}

export function KanbanView({ data }: DataKanbanViewProps) {
  const [columns, setColumns] = useState(data);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{ columnId: string; index: number } | null>(null);
  const { groupBy, onItemUpdate } = useDynamicView<string, GenericItem>();

  useEffect(() => {
    setColumns(data);
  }, [data]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: GenericItem, sourceColumnId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ itemId: item.id, sourceColumnId }));
    setDraggedItemId(item.id);
  };

  const getDropIndicatorIndex = (e: React.DragEvent, elements: HTMLElement[]) => {
    const mouseY = e.clientY;
    let closestIndex = elements.length;

    elements.forEach((el, index) => {
      const { top, height } = el.getBoundingClientRect();
      const offset = mouseY - (top + height / 2);
      if (offset < 0 && index < closestIndex) {
        closestIndex = index;
      }
    });
    return closestIndex;
  };

  const handleDragOverCardsContainer = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    const container = e.currentTarget;
    const draggableElements = Array.from(container.querySelectorAll('[data-draggable-id]')) as HTMLElement[];
    const index = getDropIndicatorIndex(e, draggableElements);

    if (dropIndicator?.columnId === columnId && dropIndicator.index === index) return;
    setDropIndicator({ columnId, index });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    setDropIndicator(null);
    try {
      const { itemId, sourceColumnId } = JSON.parse(e.dataTransfer.getData('text/plain'));

      const droppedItem = columns[sourceColumnId]?.find(i => i.id === itemId);
      if (!droppedItem) return;

      // Update local state for immediate feedback
      setColumns(prev => {
        const newColumns = { ...prev };
        const sourceCol = prev[sourceColumnId].filter(i => i.id !== itemId);

        if (sourceColumnId === targetColumnId) {
          const dropIndex = dropIndicator?.columnId === targetColumnId ? dropIndicator.index : sourceCol.length;
          sourceCol.splice(dropIndex, 0, droppedItem);
          newColumns[sourceColumnId] = sourceCol;
        } else {
          const targetCol = [...prev[targetColumnId]];
          const dropIndex = dropIndicator?.columnId === targetColumnId ? dropIndicator.index : targetCol.length;
          targetCol.splice(dropIndex, 0, droppedItem);
          
          newColumns[sourceColumnId] = sourceCol;
          newColumns[targetColumnId] = targetCol;
        }
        return newColumns;
      });
      
      // Persist change to global store. The groupBy value tells us which property to update.
      if (groupBy !== 'none' && sourceColumnId !== targetColumnId) {
        onItemUpdate?.(itemId, { [groupBy]: targetColumnId } as Partial<GenericItem>);
      }

    } catch (err) {
      console.error("Failed to parse drag data", err)
    } finally {
      setDraggedItemId(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDropIndicator(null);
  };

  const initialColumns = Object.entries(data);

  if (!initialColumns || initialColumns.length === 0) {
    return <EmptyState />;
  }

  const statusColors: Record<string, string> = {
    active: "bg-blue-500", pending: "bg-yellow-500", completed: "bg-green-500", archived: "bg-gray-500",
    low: "bg-green-500", medium: "bg-blue-500", high: "bg-orange-500", critical: "bg-red-500",
  };

  const DropIndicator = () => <div className="h-1 my-2 rounded-full bg-primary/60" />;

  return (
    <div className="flex items-start gap-6 pb-4 overflow-x-auto -mx-6 px-6">
      {Object.entries(columns).map(([columnId, items]) => (
        <div
          key={columnId}
          className={cn(
            "w-80 flex-shrink-0 bg-card/20 dark:bg-neutral-900/20 backdrop-blur-xl rounded-3xl p-5 border border-border dark:border-neutral-700/50 transition-all duration-300",
            dropIndicator?.columnId === columnId && "bg-primary/10 border-primary/30"
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn("w-3.5 h-3.5 rounded-full", statusColors[columnId] || "bg-muted-foreground")} />
              <h3 className="font-semibold text-card-foreground dark:text-neutral-100 capitalize truncate">{columnId}</h3>
              <span className="text-sm font-medium text-muted-foreground bg-background/50 rounded-full px-2 py-0.5">{items.length}</span>
            </div>
            <button className="p-1 rounded-full bg-card/30 dark:bg-neutral-800/30 hover:bg-card/50 dark:hover:bg-neutral-700/50 transition-colors">
              <Plus className="w-4 h-4 text-muted-foreground dark:text-neutral-300" />
            </button>
          </div>

          <div
            onDragOver={(e) => handleDragOverCardsContainer(e, columnId)}
            onDrop={(e) => handleDrop(e, columnId)}
            onDragLeave={() => setDropIndicator(null)}
            className="space-y-4 min-h-[100px]"
          >
            {items.map((item, index) => (
              <Fragment key={item.id}>
                {dropIndicator?.columnId === columnId && dropIndicator.index === index && (
                  <DropIndicator />
                )}
                <KanbanCard
                  item={item}
                  isDragging={draggedItemId === item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item, columnId)}
                  onDragEnd={handleDragEnd}
                />
              </Fragment>
            ))}
            {dropIndicator?.columnId === columnId && dropIndicator.index === items.length && (
              <DropIndicator />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

## File: src/lib/utils.ts
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SIDEBAR_STATES = {
  HIDDEN: 'hidden',
  COLLAPSED: 'collapsed', 
  EXPANDED: 'expanded',
  PEEK: 'peek'
} as const

export const BODY_STATES = {
  NORMAL: 'normal',
  FULLSCREEN: 'fullscreen',
  SIDE_PANE: 'side_pane',
  SPLIT_VIEW: 'split_view'
} as const

export type SidebarState = typeof SIDEBAR_STATES[keyof typeof SIDEBAR_STATES]
export type BodyState = typeof BODY_STATES[keyof typeof BODY_STATES]

export function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatDistanceToNowShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const result = formatDistanceToNow(dateObj, { addSuffix: true });

  if (result === 'less than a minute ago') return 'now';

  return result
    .replace('about ', '')
    .replace(' minutes', 'm')
    .replace(' minute', 'm')
    .replace(' hours', 'h')
    .replace(' hour', 'h')
    .replace(' days', 'd')
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500/20 text-green-700 border-green-500/30'
    case 'pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
    case 'completed': return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
    case 'archived': return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
    default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
  }
}

// A helper to get nested properties from an object, e.g., 'metrics.views'
export function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

export const getPrioritySolidColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-500'
    case 'high': return 'bg-orange-500'
    case 'medium': return 'bg-blue-500'
    case 'low': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-500/20 text-red-700 border-red-500/30'
    case 'high': return 'bg-orange-500/20 text-orange-700 border-orange-500/30'
    case 'medium': return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
    case 'low': return 'bg-green-500/20 text-green-700 border-green-500/30'
    default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
  }
}
```

## File: src/pages/DataDemo/DataDemo.config.tsx
```typescript
import { FieldRenderer } from "@/features/dynamic-view/components/shared/FieldRenderer";
import type {
  ViewConfig,
  FieldDefinition,
} from "@/features/dynamic-view/types";
import type { DataDemoItem } from "./data/DataDemoItem";

const fields: readonly FieldDefinition<string, DataDemoItem>[] = [
  { id: "id", label: "ID", type: "string" },
  { id: "title", label: "Title", type: "string" },
  { id: "description", label: "Description", type: "longtext" },
  { id: "thumbnail", label: "Thumbnail", type: "thumbnail" },
  { id: "category", label: "Category", type: "badge" },
  {
    id: "status",
    label: "Status",
    type: "badge",
    colorMap: {
      active: "bg-sky-500/10 text-sky-600 border-sky-500/20",
      pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      completed: "bg-emerald-600/10 text-emerald-700 border-emerald-600/20",
      archived: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20",
    },
  },
  {
    id: "priority",
    label: "Priority",
    type: "badge",
    colorMap: {
      critical: "bg-red-600/10 text-red-700 border-red-600/20",
      high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
      medium: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      low: "bg-green-500/10 text-green-600 border-green-500/20",
    },
    indicatorColorMap: {
      critical: "bg-red-500",
      high: "bg-orange-500",
      medium: "bg-blue-500",
      low: "bg-green-500",
    },
  },
  { id: "assignee", label: "Assignee", type: "avatar" },
  { id: "tags", label: "Tags", type: "tags" },
  { id: "metrics", label: "Engagement", type: "metrics" },
  { id: "metrics.completion", label: "Progress", type: "progress" },
  { id: "dueDate", label: "Due Date", type: "date" },
  { id: "createdAt", label: "Created At", type: "date" },
  { id: "updatedAt", label: "Last Updated", type: "date" },
  // A custom field to replicate the composite "Project" column in the table view
  {
    id: "project_details",
    label: "Project",
    type: "custom",
    render: (item: DataDemoItem) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
          <FieldRenderer item={item} fieldId="thumbnail" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-medium group-hover:text-primary transition-colors truncate">
            <FieldRenderer item={item} fieldId="title" />
          </h4>
          <p className="text-sm text-muted-foreground truncate">
            <FieldRenderer item={item} fieldId="category" />
          </p>
        </div>
      </div>
    ),
  },
] as const;

// Infer the field IDs from the const-asserted array.
type DataDemoFieldId = (typeof fields)[number]["id"];

export const dataDemoViewConfig: ViewConfig<DataDemoFieldId, DataDemoItem> = {
  // 1. Field Definitions
  fields,
  // 2. Control Definitions
  sortableFields: [
    { id: "updatedAt", label: "Last Updated" },
    { id: "title", label: "Title" },
    { id: "status", label: "Status" },
    { id: "priority", label: "Priority" },
    { id: "metrics.completion", label: "Progress" },
  ],
  groupableFields: [
    { id: "none", label: "None" },
    { id: "status", label: "Status" },
    { id: "priority", label: "Priority" },
    { id: "category", label: "Category" },
  ],
  filterableFields: [
    {
      id: "status",
      label: "Status",
      options: [
        { id: "active", label: "Active" },
        { id: "pending", label: "Pending" },
        { id: "completed", label: "Completed" },
        { id: "archived", label: "Archived" },
      ],
    },
    {
      id: "priority",
      label: "Priority",
      options: [
        { id: "critical", label: "Critical" },
        { id: "high", label: "High" },
        { id: "medium", label: "Medium" },
        { id: "low", label: "Low" },
      ],
    },
  ],
  // 3. View Layouts
  listView: {
    iconField: "thumbnail",
    titleField: "title",
    metaFields: [
      { fieldId: "status", className: "hidden sm:flex" },
      { fieldId: "tags", className: "hidden lg:flex" },
      { fieldId: "updatedAt", className: "hidden md:flex" },
      { fieldId: "assignee" },
      { fieldId: "priority", className: "hidden xs:flex" },
    ],
  },
  cardView: {
    thumbnailField: "thumbnail",
    titleField: "title",
    descriptionField: "description",
    headerFields: ["priority"],
    statusField: "status",
    categoryField: "category",
    tagsField: "tags",
    progressField: "metrics.completion",
    assigneeField: "assignee",
    metricsField: "metrics",
    dateField: "updatedAt",
  },
  tableView: {
    columns: [
      { fieldId: "project_details", label: "Project", isSortable: true },
      { fieldId: "status", label: "Status", isSortable: true },
      { fieldId: "priority", label: "Priority", isSortable: true },
      { fieldId: "assignee", label: "Assignee", isSortable: true },
      { fieldId: "metrics.completion", label: "Progress", isSortable: true },
      { fieldId: "metrics", label: "Engagement", isSortable: true },
      { fieldId: "updatedAt", label: "Last Updated", isSortable: true },
    ],
  },
  kanbanView: {
    groupByField: "status",
    cardFields: {
      titleField: "title",
      descriptionField: "description",
      priorityField: "priority",
      tagsField: "tags",
      dateField: "dueDate",
      metricsField: "metrics",
      assigneeField: "assignee",
    },
  },
  calendarView: {
    dateField: "dueDate",
    titleField: "title",
    displayFields: ["tags", "priority", "assignee"],
    colorByField: "priority",
  },
  detailView: {
    header: {
      thumbnailField: "thumbnail",
      titleField: "title",
      descriptionField: "description",
      badgeFields: ["status", "priority", "category"],
      progressField: "metrics.completion",
    },
    body: {
      sections: [
        { title: "Assigned to", fields: ["assignee"] },
        { title: "Engagement Metrics", fields: ["metrics"] },
        { title: "Tags", fields: ["tags"] },
        {
          title: "Timeline",
          fields: ["createdAt", "updatedAt", "dueDate"],
        },
      ],
    },
  },
};
```

## File: src/pages/Messaging/components/ActivityFeed.tsx
```typescript
import React, { forwardRef } from 'react';
import { useMessagingStore } from '../store/messaging.store';
import type { Message, Contact, JourneyPointType } from '../types';
import { cn, formatDistanceToNowShort } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StickyNote, Info, MessageSquare, ShoppingCart, PackageCheck, AlertCircle, RefreshCw, MailQuestion, FileText, CreditCard, Truck, XCircle, Undo2, Star, type LucideIcon } from 'lucide-react';

const journeyInfoMap: Record<JourneyPointType, { Icon: LucideIcon; textColor: string; bgColor: string; }> = {
  Inquiry: { Icon: Info, textColor: 'text-cyan-500', bgColor: 'bg-cyan-500' },
  Consult: { Icon: MessageSquare, textColor: 'text-blue-500', bgColor: 'bg-blue-500' },
  Quote: { Icon: FileText, textColor: 'text-orange-500', bgColor: 'bg-orange-500' },
  Order: { Icon: ShoppingCart, textColor: 'text-green-500', bgColor: 'bg-green-500' },
  Payment: { Icon: CreditCard, textColor: 'text-lime-500', bgColor: 'bg-lime-500' },
  Shipped: { Icon: Truck, textColor: 'text-sky-500', bgColor: 'bg-sky-500' },
  Delivered: { Icon: PackageCheck, textColor: 'text-emerald-500', bgColor: 'bg-emerald-500' },
  Canceled: { Icon: XCircle, textColor: 'text-slate-500', bgColor: 'bg-slate-500' },
  Refund: { Icon: Undo2, textColor: 'text-rose-500', bgColor: 'bg-rose-500' },
  Complain: { Icon: AlertCircle, textColor: 'text-red-500', bgColor: 'bg-red-500' },
  Reorder: { Icon: RefreshCw, textColor: 'text-indigo-500', bgColor: 'bg-indigo-500' },
  'Follow-up': { Icon: MailQuestion, textColor: 'text-yellow-500', bgColor: 'bg-yellow-500' },
  Review: { Icon: Star, textColor: 'text-amber-500', bgColor: 'bg-amber-500' },
};

interface ActivityFeedProps {
  messages: Message[];
  contact: Contact;
  searchTerm?: string;
}

const Highlight = ({ text, highlight }: { text: string; highlight?: string }) => {
  if (!highlight) {
    return <>{text}</>;
  }
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i} className="bg-primary/20 text-primary-foreground rounded px-0.5">{part}</mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export const ActivityFeed = forwardRef<HTMLDivElement, ActivityFeedProps>(({ messages, contact, searchTerm }, ref) => {
  const getAssigneeById = useMessagingStore(state => state.getAssigneeById);

  return (
    <div ref={ref} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
      {messages.map((message) => {
        const assignee = message.userId ? getAssigneeById(message.userId) : null;
        
        if (message.journeyPoint) {
          const journeyInfo = journeyInfoMap[message.journeyPoint];
          const { Icon } = journeyInfo;
          return (
            <div key={message.id} data-message-id={message.id} className="relative py-3">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-dashed" />
              </div>
              <div className="relative flex justify-center">
                <div className="bg-background px-3 flex items-center gap-2 text-sm font-medium">
                  <Icon className={cn("w-4 h-4", journeyInfo.textColor)} />
                  <span className={cn("font-semibold", journeyInfo.textColor)}>{message.journeyPoint}</span>
                  <span className="text-xs text-muted-foreground font-normal whitespace-nowrap">{formatDistanceToNowShort(new Date(message.timestamp))}</span>
                </div>
              </div>
            </div>
          );
        }
        
        if (message.type === 'system') {
          return (
            <div key={message.id} data-message-id={message.id} className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Info className="w-3.5 h-3.5" />
              <p><Highlight text={message.text} highlight={searchTerm} /></p>
              <p className="whitespace-nowrap">{formatDistanceToNowShort(new Date(message.timestamp))}</p>
            </div>
          );
        }

        if (message.type === 'note') {
          return (
            <div key={message.id} data-message-id={message.id} className="flex items-start gap-3">
              <div className="p-1.5 bg-yellow-400/20 text-yellow-600 rounded-full mt-1.5">
                <StickyNote className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm">{assignee?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{formatDistanceToNowShort(new Date(message.timestamp))}</p>
                </div>
                <div className="bg-card border rounded-lg p-3 text-sm">
                  <p><Highlight text={message.text} highlight={searchTerm} /></p>
                </div>
              </div>
            </div>
          );
        }

        // Default: 'comment' type
        return (
          <div key={message.id} data-message-id={message.id} className={cn(
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
              <p className="text-sm"><Highlight text={message.text} highlight={searchTerm} /></p>
            </div>
          </div>
        );
      })}
    </div>
  );
});

ActivityFeed.displayName = 'ActivityFeed';
```

## File: src/index.ts
```typescript
// Context
export { AppShellProvider } from './providers/AppShellProvider';
export { useAppShellStore } from './store/appShell.store';

// Layout Components
export { AppShell } from './components/layout/AppShell';
export { MainContent } from './components/layout/MainContent';
export { ViewModeSwitcher } from './components/layout/ViewModeSwitcher';
export { RightPane } from './components/layout/RightPane';
export { TopBar } from './components/layout/TopBar';
export { UserDropdown } from './components/layout/UserDropdown';
export { Workspaces as WorkspaceProvider, WorkspaceTrigger, WorkspaceContent } from './components/layout/WorkspaceSwitcher';

// Sidebar Primitives
export {
  Sidebar,
  SidebarBody,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSection,
  SidebarTitle,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarLabel,
  SidebarBadge,
  SidebarTooltip,
  SidebarIcon,
  useSidebar,
} from './components/layout/Sidebar';

// Shared Components
export { ContentInSidePanePlaceholder } from './components/shared/ContentInSidePanePlaceholder';
export { PageHeader } from './components/shared/PageHeader';
export { PageLayout } from './components/shared/PageLayout';

// Feature Components
export { SettingsContent } from './features/settings/SettingsContent';
export { SettingsSection } from './features/settings/SettingsSection';
export { SettingsToggle } from './features/settings/SettingsToggle';
export { LoginPage } from './components/auth/LoginPage';

// UI Components
export * from './components/ui/avatar';
export * from './components/ui/badge';
export * from './components/ui/button';
export * from './components/ui/card';
export * from './components/ui/command';
export * from './components/ui/dialog';
export * from './components/ui/dropdown-menu';
export * from './components/ui/input';
export * from './components/ui/label';
export * from './components/ui/popover';
export * from './components/ui/tabs';
export * from './components/ui/toast';
export * from './components/ui/tooltip';
export { AnimatedTabs } from './components/ui/animated-tabs';

// Effects Components
export { AnimatedInput } from './components/effects/AnimatedInput';
export { BottomGradient } from './components/effects/BottomGradient';
export { BoxReveal } from './components/effects/BoxReveal';
export { OrbitingCircles, TechOrbitDisplay } from './components/effects/OrbitingCircles';
export { Ripple } from './components/effects/Ripple';


// Global Components
export { CommandPalette } from './components/global/CommandPalette';

// Hooks
export { useAutoAnimateTopBar } from './hooks/useAutoAnimateTopBar';
export { useCommandPaletteToggle } from './hooks/useCommandPaletteToggle.hook';

// Lib
export * from './lib/utils';

// Store
export type { ActivePage } from './store/appShell.store';
export { useAuthStore } from './store/authStore';
```

## File: src/features/dynamic-view/components/controls/ViewControls.tsx
```typescript
import * as React from 'react'
import { Check, ListFilter, Search, SortAsc, ChevronsUpDown, Settings } from 'lucide-react'

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

import type { FilterConfig, CalendarDateProp, CalendarDisplayProp, CalendarColorProp, GenericItem, FilterableFieldConfig } from '../../types'
import { useDynamicView } from '../../DynamicViewContext';

export interface DataViewControlsProps {
  // groupOptions will now come from config
}

export function ViewControls() {
  const {
    config,
    filters,
    onFiltersChange,
    sortConfig,
    onSortChange,
    groupBy,
    onGroupByChange,
    viewMode,
  } = useDynamicView<string, GenericItem>();
  const sortOptions = config.sortableFields;
  const groupOptions = config.groupableFields;
  const filterableFields = config.filterableFields;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, searchTerm: event.target.value });
  }
  
  const activeFilterCount = filterableFields.reduce((acc, field) => acc + (filters[field.id]?.length || 0), 0)

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
      {/* Search */}
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-9 w-full sm:w-64"
          value={filters.searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filters */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 w-full sm:w-auto justify-start border-dashed">
            <ListFilter className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <>
                <div className="mx-2 h-4 w-px bg-muted-foreground/50" />
                <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                  {activeFilterCount}
                </Badge>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0" align="start">
          <CombinedFilter filters={filters} onFiltersChange={onFiltersChange} filterableFields={filterableFields} />
        </PopoverContent>
      </Popover>

      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={() => onFiltersChange({ searchTerm: filters.searchTerm, status: [], priority: [] })}>Reset</Button>
      )}

      {/* Spacer */}
      <div className="hidden md:block flex-grow" />

      {viewMode === 'calendar' ? (
        <CalendarSpecificControls />
      ) : (
        <>
          {/* Sorter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 w-full sm:w-auto justify-start">
                <SortAsc className="mr-2 h-4 w-4" />
                Sort by: {sortOptions.find(o => o.id === sortConfig?.key)?.label || 'Default'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={`${sortConfig?.key || 'default'}-${sortConfig?.direction || ''}`}
                onValueChange={(value) => {
                  if (value.startsWith('default')) {
                    onSortChange(null);
                  } else {
                    const [key, direction] = value.split('-')
                    onSortChange({ key: key, direction: direction as 'asc' | 'desc' });
                  }
                }}
              >
                <DropdownMenuRadioItem value="default-">Default</DropdownMenuRadioItem>
                <DropdownMenuSeparator />
                {sortOptions.map(option => (
                  <React.Fragment key={option.id}>
                    <DropdownMenuRadioItem value={`${option.id}-desc`}>{option.label} (Desc)</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={`${option.id}-asc`}>{option.label} (Asc)</DropdownMenuRadioItem>
                  </React.Fragment>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Group By Dropdown */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 w-full justify-between">
                  Group by: {groupOptions.find(o => o.id === groupBy)?.label}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[180px]">
                <DropdownMenuRadioGroup value={groupBy} onValueChange={onGroupByChange}>
                  {groupOptions.map(option => (
                    <DropdownMenuRadioItem key={option.id} value={option.id}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </div>
  )
}

function CalendarSpecificControls() {
    const {
        calendarDateProp, onCalendarDatePropChange,
        calendarDisplayProps, onCalendarDisplayPropsChange,
        calendarItemLimit, onCalendarItemLimitChange,
        calendarColorProp, onCalendarColorPropChange,
    } = useDynamicView<string, GenericItem>();

    const handleDisplayPropChange = (prop: CalendarDisplayProp<string>, checked: boolean) => {
        const newProps = checked 
            ? [...(calendarDisplayProps || []), prop] 
            : (calendarDisplayProps || []).filter((p) => p !== prop);
        onCalendarDisplayPropsChange?.(newProps);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                    <Settings className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h4 className="font-medium leading-none">Calendar Settings</h4>
                        <p className="text-sm text-muted-foreground">
                            Customize the calendar view.
                        </p>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                        <Label className="font-semibold">Item Background Color</Label>
                        <RadioGroup value={calendarColorProp} onValueChange={(v) => onCalendarColorPropChange?.(v as CalendarColorProp<string>)} className="gap-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="none" id="color-none" />
                                <Label htmlFor="color-none" className="font-normal">None</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="priority" id="color-priority" />
                                <Label htmlFor="color-priority" className="font-normal">By Priority</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="status" id="color-status" />
                                <Label htmlFor="color-status" className="font-normal">By Status</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="category" id="color-category" />
                                <Label htmlFor="color-category" className="font-normal">By Category</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                        <Label className="font-semibold">Date Property</Label>
                        <RadioGroup value={calendarDateProp} onValueChange={(v) => onCalendarDatePropChange?.(v as CalendarDateProp<string>)} className="gap-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dueDate" id="dueDate" />
                                <Label htmlFor="dueDate" className="font-normal">Due Date</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="createdAt" id="createdAt" />
                                <Label htmlFor="createdAt" className="font-normal">Created Date</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="updatedAt" id="updatedAt" />
                                <Label htmlFor="updatedAt" className="font-normal">Updated Date</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-3">
                        <Label className="font-semibold">Card Details</Label>
                        <div className="space-y-2">
                            {(['priority', 'assignee', 'tags'] as CalendarDisplayProp<string>[]).map(prop => (
                                <div key={prop} className="flex items-center space-x-2">
                                    <Checkbox id={prop} checked={(calendarDisplayProps || []).includes(prop)} onCheckedChange={(c) => handleDisplayPropChange(prop, !!c)} />
                                    <Label htmlFor={prop} className="capitalize font-normal">{prop}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                         <div className="space-y-0.5">
                            <Label htmlFor="show-all" className="font-semibold">Show all items</Label>
                            <p className="text-xs text-muted-foreground">Display all items on a given day.</p>
                        </div>
                        <Switch id="show-all" checked={calendarItemLimit === 'all'} onCheckedChange={(c) => onCalendarItemLimitChange?.(c ? 'all' : 3)} />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

function CombinedFilter({
  filters,
  onFiltersChange,
  filterableFields,
}: {
  filters: FilterConfig;
  onFiltersChange: (filters: FilterConfig) => void;
  filterableFields: readonly FilterableFieldConfig<string>[];
}) {
  const handleSelect = (fieldId: string, value: string) => {
    const currentValues = new Set(filters[fieldId] || []);
    currentValues.has(value) ? currentValues.delete(value) : currentValues.add(value);
    
    onFiltersChange({ ...filters, [fieldId]: Array.from(currentValues) });
  };

  const hasActiveFilters = filterableFields.some(field => (filters[field.id] || []).length > 0);

  const clearFilters = () => {
    const clearedFilters: Partial<FilterConfig> = {};
    filterableFields.forEach(field => {
      clearedFilters[field.id as keyof Omit<FilterConfig, 'searchTerm'>] = [];
    });
    onFiltersChange({ searchTerm: filters.searchTerm, ...clearedFilters });
  }

  return (
    <Command>
      <CommandInput placeholder="Filter by..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {filterableFields.map((field, index) => (
          <React.Fragment key={field.id}>
            <CommandGroup heading={field.label}>
              {field.options.map((option) => {
            const isSelected = (filters[field.id] || []).includes(option.id);
            return (
              <CommandItem
                key={option.id}
                onSelect={() => handleSelect(field.id, option.id)}
              >
                <div
                  className={cn(
                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                    isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                  )}
                >
                  <Check className={cn('h-4 w-4')} />
                </div>
                <span>{option.label}</span>
              </CommandItem>
            );
          })}
            </CommandGroup>
            {index < filterableFields.length - 1 && <CommandSeparator />}
          </React.Fragment>
        ))}

        {hasActiveFilters && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={clearFilters}
                className="justify-center text-center text-sm"
              >
                Clear filters
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  )
}
```

## File: src/features/dynamic-view/components/views/CalendarView.tsx
```typescript
import { useState, useMemo, useRef, useLayoutEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isSameDay, } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GenericItem } from '../../types';
import type { CalendarDateProp, CalendarColorProp, Status, Priority } from '../../types';
import { useResizeObserver } from "@/hooks/useResizeObserver.hook";
import { useDynamicView } from '../../DynamicViewContext'
import { FieldRenderer } from '../shared/FieldRenderer'

interface CalendarViewProps {
  data: GenericItem[];
}

const PRIORITY_BG_COLORS: Record<Priority, string> = {
  low: 'bg-blue-500/80 border-blue-600/80 text-white',
  medium: 'bg-yellow-500/80 border-yellow-600/80 text-yellow-950',
  high: 'bg-orange-500/80 border-orange-600/80 text-white',
  critical: 'bg-red-600/80 border-red-700/80 text-white',
};

const STATUS_BG_COLORS: Record<Status, string> = {
  active: 'bg-sky-500/80 border-sky-600/80 text-white',
  pending: 'bg-amber-500/80 border-amber-600/80 text-amber-950',
  completed: 'bg-emerald-600/80 border-emerald-700/80 text-white',
  archived: 'bg-zinc-500/80 border-zinc-600/80 text-white',
};

const CATEGORY_BG_COLORS = [
  'bg-rose-500/80 border-rose-600/80 text-white',
  'bg-fuchsia-500/80 border-fuchsia-600/80 text-white',
  'bg-indigo-500/80 border-indigo-600/80 text-white',
  'bg-teal-500/80 border-teal-600/80 text-white',
  'bg-lime-500/80 border-lime-600/80 text-lime-950',
];

const getCategoryBgColor = (category: string) => {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % CATEGORY_BG_COLORS.length);
  return CATEGORY_BG_COLORS[index];
};

function CalendarHeader({ currentDate, onPrevMonth, onNextMonth, onToday }: {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <h2 className="text-xl font-bold md:text-2xl tracking-tight">
        {format(currentDate, "MMMM yyyy")}
      </h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToday}>Today</Button>
        <div className="flex items-center">
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={onPrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={onNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function CalendarEvent({ item, isSelected, isDragging, onDragStart, colorProp }: { 
    item: GenericItem; 
    isSelected: boolean;
    isDragging: boolean;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, itemId: string) => void
    colorProp: CalendarColorProp<string>;
  }) {
  const { config, onItemSelect } = useDynamicView<string, GenericItem>();
  const { calendarView: viewConfig } = config;

    const colorClass = useMemo(() => {
      switch (colorProp) {
        case 'priority': return PRIORITY_BG_COLORS[item.priority as Priority];
        case 'status': return STATUS_BG_COLORS[item.status as Status];
        case 'category': return getCategoryBgColor(item.category as string);
        default: return null;
      }
    }, [colorProp, item]);

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, item.id)}
            onClick={() => onItemSelect(item)}
            className={cn(
                "p-2 rounded-lg cursor-grab transition-all duration-200 border space-y-1",
                isSelected && "ring-2 ring-primary ring-offset-background ring-offset-2",
                isDragging && "opacity-50 ring-2 ring-primary cursor-grabbing",
                colorClass 
                  ? `${colorClass} hover:brightness-95 dark:hover:brightness-110`
                  : "bg-card/60 dark:bg-neutral-800/60 backdrop-blur-sm hover:bg-card/80 dark:hover:bg-neutral-700/70"
            )}
        >
            <div className={cn(
              "font-semibold text-sm leading-tight line-clamp-2",
              colorClass ? "text-inherit" : "text-card-foreground/90"
            )}>
              <FieldRenderer item={item} fieldId={viewConfig.titleField} />
            </div>

            {viewConfig.displayFields.includes('tags') && <FieldRenderer item={item} fieldId="tags" />}

            {(viewConfig.displayFields.includes('priority') || viewConfig.displayFields.includes('assignee')) && (
                <div className={cn(
                    "flex items-center justify-between pt-1 border-t",
                    colorClass ? "border-black/10 dark:border-white/10" : "border-border/30 dark:border-neutral-700/50"
                )}>
                    <div>
                      {viewConfig.displayFields.includes('priority') && <FieldRenderer item={item} fieldId="priority" />}
                    </div>
                    <div>
                      {viewConfig.displayFields.includes('assignee') && <FieldRenderer item={item} fieldId="assignee" options={{ compact: true, avatarClassName: 'w-5 h-5' }}/>}
                    </div>
                </div>
            )}
        </div>
    );
}

const datePropLabels: Record<CalendarDateProp<string>, string> = {
  dueDate: 'due dates',
  createdAt: 'creation dates',
  updatedAt: 'update dates',
};

export function CalendarView({ data }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const {
    selectedItemId,
    onItemUpdate,
    calendarDateProp = 'dueDate', // Provide default
    calendarItemLimit = 3, // Provide default
    calendarColorProp = 'none', // Provide default
  } = useDynamicView<string, GenericItem>();
  
  // Drag & Drop State
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dropTargetDate, setDropTargetDate] = useState<Date | null>(null);

  // GSAP animation state
  const [direction, setDirection] = useState(0); // 0: initial, 1: next, -1: prev

  // Responsive Calendar State
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const { width } = useResizeObserver(calendarContainerRef);
  const MIN_DAY_WIDTH = 160; // px
  const numColumns = useMemo(() => {
    if (width === 0) return 7;
    const cols = Math.floor(width / MIN_DAY_WIDTH);
    return Math.max(3, Math.min(7, cols));
  }, [width]);

  const gridRef = useRef<HTMLDivElement>(null);
  const itemsByDateProp = useMemo(() => data.filter(item => !!item[calendarDateProp]), [data, calendarDateProp]);

  const eventsByDate = useMemo(() => {
    const eventsMap = new Map<string, GenericItem[]>();
    itemsByDateProp.forEach(item => {
      const dateValue = item[calendarDateProp];
      if (!dateValue) return;
      const date = new Date(dateValue as string);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!eventsMap.has(dateKey)) {
        eventsMap.set(dateKey, []);
      }
      eventsMap.get(dateKey)?.push(item);
    });
    return eventsMap;
  }, [itemsByDateProp, calendarDateProp]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // D&D Handlers
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
    setDraggedItemId(itemId);
  };
  
  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDropTargetDate(null);
  };

  const handleDragOver = (e: React.DragEvent, day: Date) => {
    e.preventDefault();
    if (dropTargetDate === null || !isSameDay(day, dropTargetDate)) {
        setDropTargetDate(day);
    }
  };

  const handleDragLeave = () => {
    setDropTargetDate(null);
  };

  const handleDrop = (e: React.DragEvent, day: Date) => {
    e.preventDefault();
    const itemIdToUpdate = e.dataTransfer.getData('text/plain');
    if (itemIdToUpdate) {
        const originalItem = itemsByDateProp.find(i => i.id === itemIdToUpdate);
        if (originalItem && originalItem[calendarDateProp]) {
            const originalDate = new Date(originalItem[calendarDateProp] as string);
            // Preserve the time, only change the date part
            const newDueDate = new Date(day);
            newDueDate.setHours(originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds(), originalDate.getMilliseconds());
            onItemUpdate?.(itemIdToUpdate, { [calendarDateProp]: newDueDate.toISOString() });
        }
    }
    handleDragEnd(); // Reset state
  };
  
  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentDate(subMonths(currentDate, 1));
  };
  const handleNextMonth = () => {
    setDirection(1);
    setCurrentDate(addMonths(currentDate, 1));
  };
  const handleToday = () => {
    setDirection(0); // No animation for 'Today'
    setCurrentDate(new Date());
  };

  useLayoutEffect(() => {
    if (direction === 0 || !gridRef.current) return;
    gsap.fromTo(gridRef.current, 
      { opacity: 0, x: 30 * direction }, 
      { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
    );
  }, [currentDate]);

  return (
    <div ref={calendarContainerRef} className="-mx-4 md:-mx-6">
      <div className="px-4 md:px-6 pb-2">
        <CalendarHeader currentDate={currentDate} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} onToday={handleToday} />
      </div>
      {itemsByDateProp.length === 0 ? (
        <div className="flex items-center justify-center h-96 text-muted-foreground rounded-lg border bg-card/30 mx-4 md:mx-6">
          No items with {datePropLabels[calendarDateProp]} to display on the calendar.
        </div>
      ) : (
        <div className="px-2" onDragEnd={handleDragEnd}>
          {numColumns === 7 && (
            <div className="grid grid-cols-7">
              {weekdays.map(day => (
                <div key={day} className="py-2 px-3 text-center text-xs font-semibold text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
          )}

            <div
              ref={gridRef}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${numColumns}, minmax(0, 1fr))`,
                gap: '0.5rem',
              }}
            >
              {days.map(day => {
                const dateKey = format(day, "yyyy-MM-dd");
                const dayEvents = eventsByDate.get(dateKey) || [];
                const visibleEvents = calendarItemLimit === 'all' 
                    ? dayEvents 
                    : dayEvents.slice(0, calendarItemLimit as number);
                const hiddenEventsCount = dayEvents.length - visibleEvents.length;
                const isCurrentMonthDay = isSameMonth(day, currentDate);
                const isDropTarget = dropTargetDate && isSameDay(day, dropTargetDate);
                return (
                  <div
                    key={day.toString()}
                    onDragOver={(e) => handleDragOver(e, day)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, day)}
                    className={cn(
                      "relative min-h-[150px] rounded-2xl p-2 flex flex-col gap-2 transition-all duration-300 border",
                      isCurrentMonthDay ? "bg-card/40 dark:bg-neutral-900/40 border-transparent" : "bg-muted/30 dark:bg-neutral-800/20 border-transparent text-muted-foreground/60",
                      isDropTarget ? "border-primary/50 bg-primary/10" : "hover:border-primary/20 hover:bg-card/60"
                    )}
                  >
                    <div className="font-semibold text-sm">
                      {isToday(day) ? (
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground">
                          {format(day, 'd')}
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1.5 px-1 py-0.5">
                          {numColumns < 7 && <span className="text-xs opacity-70">{format(day, 'eee')}</span>}
                          <span>{format(day, 'd')}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 overflow-y-auto flex-grow custom-scrollbar">
                      {visibleEvents.map(item => (
                        <CalendarEvent
                          key={item.id} 
                          item={item} 
                          isSelected={selectedItemId === item.id}
                          isDragging={draggedItemId === item.id}
                          onDragStart={handleDragStart}
                          colorProp={calendarColorProp}
                        />
                      ))}
                    </div>
                    {hiddenEventsCount > 0 && (
                      <div className="absolute bottom-1 right-2 text-xs font-bold text-muted-foreground">
                        +{hiddenEventsCount} more
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
        </div>
      )}
    </div>
  );
}
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

export function CardView({ data, isGrid = false, ctaElement }: { data: GenericItem[]; isGrid?: boolean, ctaElement?: ReactNode }) {
  const { config, onItemSelect, selectedItemId } = useDynamicView<string, GenericItem>();
  const { cardView: viewConfig } = config;

  const containerRef = useRef<HTMLDivElement>(null)
  useStaggeredAnimation(containerRef, [data], { mode: 'incremental', y: 40 });

  const items = Array.isArray(data) ? data : [];
  if (items.length === 0) {
    return <EmptyState />
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "gap-6",
        isGrid
          ? "grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]"
          : "grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))]",
        "pb-4"
      )}
    >
      {items.map((item: GenericItem) => {
        const isSelected = selectedItemId === item.id
        
        return (
          <div
            key={item.id}
            onClick={() => onItemSelect(item)}
            className={cn(
              "group relative overflow-hidden rounded-3xl border bg-card/50 backdrop-blur-sm transition-all duration-500 cursor-pointer",
              "hover:bg-card/80 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-2",
              "active:scale-[0.98]",
              isSelected && "ring-2 ring-primary/30 border-primary/40 bg-card/90 shadow-lg shadow-primary/20",
            )}
          >
            {/* Card Header with Thumbnail */}
            <div className="relative p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                  <FieldRenderer item={item} fieldId={viewConfig.thumbnailField} />
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </div>

              {/* Header Fields (e.g., priority indicator) */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {viewConfig.headerFields.map(fieldId => (
                  <FieldRenderer key={fieldId} item={item} fieldId={fieldId} options={{ displayAs: 'indicator' }} />
                ))}
              </div>
            </div>

            {/* Card Content */}
            <div className="px-6 pb-6">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                <FieldRenderer item={item} fieldId={viewConfig.titleField} />
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                <FieldRenderer item={item} fieldId={viewConfig.descriptionField} />
              </p>

              {/* Status and Category */}
              <div className="flex items-center gap-2 mb-4">
                <FieldRenderer item={item} fieldId={viewConfig.statusField} />
                <FieldRenderer item={item} fieldId={viewConfig.categoryField} />
              </div>

              {/* Tags, Progress, Assignee */}
              <div className="space-y-4 mb-4">
                <FieldRenderer item={item} fieldId={viewConfig.tagsField} />
                <FieldRenderer item={item} fieldId={viewConfig.progressField} />
                <FieldRenderer item={item} fieldId={viewConfig.assigneeField} />
              </div>

              {/* Metrics and Date */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <FieldRenderer item={item} fieldId={viewConfig.metricsField} />
                <FieldRenderer item={item} fieldId={viewConfig.dateField} />
              </div>
            </div>

            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 pointer-events-none" />
            )}
          </div>
        )
      })}
      {ctaElement}
    </div>
  )
}
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

export function ListView({ data, ctaElement }: { data: GenericItem[], ctaElement?: ReactNode }) {
  const { config, onItemSelect, selectedItemId } = useDynamicView<string, GenericItem>();

  const listRef = useRef<HTMLDivElement>(null)
  useStaggeredAnimation(listRef, [data], { mode: 'incremental', scale: 1, y: 20, stagger: 0.05, duration: 0.4 });

  const items = Array.isArray(data) ? data : [];
  if (items.length === 0) {
    return <EmptyState />
  }

  return (
    <div ref={listRef}>
      {items.map((item: GenericItem) => {
        const isSelected = selectedItemId === item.id
        
        return (
          <div key={item.id} className="px-2">
            <div
              onClick={() => onItemSelect(item)}
              className={cn(
                "group flex items-center px-2 py-2 rounded-md transition-colors duration-200 cursor-pointer",
                "hover:bg-accent/80",
                isSelected ? "bg-accent" : "bg-transparent"
              )}
            >
              {/* Left side: Icon and Title */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-8 text-center">
                  <FieldRenderer item={item} fieldId={config.listView.iconField} className="text-xl" />
                </div>
                <div className="font-medium truncate text-card-foreground group-hover:text-primary">
                  <FieldRenderer item={item} fieldId={config.listView.titleField} />
                </div>
              </div>

              {/* Right side: Metadata */}
              <div className="flex shrink-0 items-center gap-2 sm:gap-4 md:gap-6 ml-4 text-sm text-muted-foreground">
                {config.listView.metaFields.map(fieldConfig => (
                  <div key={fieldConfig.fieldId} className={fieldConfig.className}>
                    <FieldRenderer item={item} fieldId={fieldConfig.fieldId} options={{ avatarClassName: 'w-7 h-7' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
      {ctaElement}
    </div>
  )
}
```

## File: src/hooks/useResizablePanes.hook.ts
```typescript
import { useEffect, useRef } from 'react';
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

export function useResizableRightPane(
  rightPaneRef: React.RefObject<HTMLDivElement>
) {
  const isResizingRightPane = useAppShellStore(s => s.isResizingRightPane);
  const bodyState = useAppShellStore(s => s.bodyState);
  const { setSplitPaneWidth, setSidePaneWidth, setIsResizingRightPane, setReducedMotion } = useAppShellStore.getState();
  const finalWidthRef = useRef<number | null>(null);
  const originalReducedMotionRef = useRef<boolean | null>(null);

  // This effect temporarily disables animations during resizing to prevent the
  // pane's enter/exit animation from firing incorrectly.
  useEffect(() => {
    if (isResizingRightPane) {
      // When resizing starts, store the original setting and disable animations.
      if (originalReducedMotionRef.current === null) {
        originalReducedMotionRef.current = useAppShellStore.getState().reducedMotion;
        setReducedMotion(true);
      }
    } else {
      // When resizing ends, restore the original setting after a brief delay.
      // This ensures the final width is rendered before animations are re-enabled.
      if (originalReducedMotionRef.current !== null) {
        // Use requestAnimationFrame to ensure we re-enable animations *after* the browser
        // has painted the new, non-animated pane width. This is more reliable than setTimeout(0).
        requestAnimationFrame(() => {
          setReducedMotion(originalReducedMotionRef.current!);
          originalReducedMotionRef.current = null;
        });
      }
    }
  }, [isResizingRightPane, setReducedMotion]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRightPane) return;

      const newWidth = window.innerWidth - e.clientX;
      finalWidthRef.current = newWidth;
      if (rightPaneRef.current) {
        gsap.set(rightPaneRef.current, { width: newWidth });
      }
    };

    const handleMouseUp = () => {
      if (finalWidthRef.current !== null) {
        if (bodyState === BODY_STATES.SPLIT_VIEW) {
          setSplitPaneWidth(finalWidthRef.current);
        } else {
          setSidePaneWidth(finalWidthRef.current);
        }
        finalWidthRef.current = null;
      }
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
  }, [isResizingRightPane, setSplitPaneWidth, setSidePaneWidth, setIsResizingRightPane, bodyState, rightPaneRef]);
}
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

interface StatsCard {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ReactNode
}

interface ActivityItem {
  id: string
  type: 'comment' | 'file' | 'meeting' | 'task'
  title: string
  description: string
  time: string
  user: string
}

const statsCards: StatsCard[] = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: <DollarSign className="w-5 h-5" />
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+180.1%",
    trend: "up",
    icon: <Users className="w-5 h-5" />
  },
  {
    title: "Conversion Rate",
    value: "12.5%",
    change: "+19%",
    trend: "up",
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    title: "Performance",
    value: "573ms",
    change: "-5.3%",
    trend: "down",
    icon: <Activity className="w-5 h-5" />
  }
]

const recentActivity: ActivityItem[] = [
  {
    id: "1",
    type: "comment",
    title: "New comment on Project Alpha",
    description: "Sarah Johnson added a comment to the design review",
    time: "2 minutes ago",
    user: "SJ"
  },
  {
    id: "2",
    type: "file",
    title: "Document uploaded",
    description: "quarterly-report.pdf was uploaded to Documents",
    time: "15 minutes ago",
    user: "MD"
  },
  {
    id: "3",
    type: "meeting",
    title: "Meeting scheduled",
    description: "Weekly standup meeting scheduled for tomorrow 9 AM",
    time: "1 hour ago",
    user: "RW"
  },
  {
    id: "4",
    type: "task",
    title: "Task completed",
    description: "UI wireframes for mobile app completed",
    time: "2 hours ago",
    user: "AL"
  }
]

export function DashboardContent() {
    const scrollRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null);
    const statsCardsContainerRef = useRef<HTMLDivElement>(null);
    const featureCardsContainerRef = useRef<HTMLDivElement>(null);
    const bodyState = useAppShellStore(s => s.bodyState);
    const isInSidePane = bodyState === BODY_STATES.SIDE_PANE;
    
    const { onScroll: handleTopBarScroll } = useAutoAnimateTopBar(isInSidePane);
    const { showScrollToBottom, scrollToBottom, handleScroll: handleScrollToBottom } = useScrollToBottom(scrollRef);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        handleTopBarScroll(e);
        handleScrollToBottom();
    }, [handleTopBarScroll, handleScrollToBottom]);

    useDashboardAnimations(contentRef, statsCardsContainerRef, featureCardsContainerRef);

    const getTypeIcon = (type: ActivityItem['type']) => {
      switch (type) {
        case 'comment':
          return <MessageSquare className="w-4 h-4" />
        case 'file':
          return <FileText className="w-4 h-4" />
        case 'meeting':
          return <Calendar className="w-4 h-4" />
        case 'task':
          return <Star className="w-4 h-4" />
        default:
          return <Activity className="w-4 h-4" />
      }
    }

    return (
      <PageLayout scrollRef={scrollRef} onScroll={handleScroll} ref={contentRef}>
        {/* Header */}
        {!isInSidePane && (
          <PageHeader
            title="Dashboard"
            description="Welcome to the Jeli App Shell demo! Explore all the features and customization options."
          />
        )}
          {/* Stats Cards */}
        <div ref={statsCardsContainerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Demo Content */}
        <DemoContent ref={featureCardsContainerRef} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Analytics Chart */}
          <Card className="p-6 border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Analytics Overview</h3>
              <button className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-full transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            {/* Mock Chart */}
            <div className="h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-xl flex items-center justify-center border border-border/50">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Chart visualization would go here</p>
              </div>
            </div>
          </Card>

          {/* Recent Projects */}
          <Card className="p-6 border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Projects</h3>
              <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "E-commerce Platform", progress: 75, team: 5, deadline: "Dec 15" },
                { name: "Mobile App Redesign", progress: 45, team: 3, deadline: "Jan 20" },
                { name: "Marketing Website", progress: 90, team: 4, deadline: "Dec 5" }
              ].map((project) => (
                <div key={project.name} className="p-4 bg-accent/30 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{project.name}</h4>
                    <span className="text-sm text-muted-foreground">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-3">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{project.team} team members</span>
                    <span>Due {project.deadline}</span>
                    </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6 border-border/50">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { icon: <FileText className="w-4 h-4" />, label: "Create Document", color: "bg-blue-500/10 text-blue-600" },
                { icon: <Calendar className="w-4 h-4" />, label: "Schedule Meeting", color: "bg-green-500/10 text-green-600" },
                { icon: <Users className="w-4 h-4" />, label: "Invite Team", color: "bg-purple-500/10 text-purple-600" },
                { icon: <BarChart3 className="w-4 h-4" />, label: "View Reports", color: "bg-orange-500/10 text-orange-600" }
              ].map((action) => (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors text-left"
                >
                  <div className={cn("p-2 rounded-full", action.color)}>
                    {action.icon}
                  </div>
                  <span className="font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 border-border/50">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-accent/30 rounded-xl transition-colors cursor-pointer">
                  <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
                    {getTypeIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{activity.time}</span>
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-medium">
                        {activity.user}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <ScrollToBottomButton isVisible={showScrollToBottom} onClick={scrollToBottom} />
      </PageLayout>
    )
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
  const { setSidebarState, peekSidebar, setHoveredPane, setTopBarHovered } = useAppShellStore.getState();
  
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
  useResizableRightPane(rightPaneRef);
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
            onMouseEnter={() => {
              if (isSplitView) {
                setTopBarHovered(true);
                setHoveredPane(null);
              }
            }}
            onMouseLeave={() => {
              if (isSplitView) {
                setTopBarHovered(false);
              }
            }}
          >
            {topBar}
          </div>

          {/* Invisible trigger area for top bar in split view */}
          {isSplitView && (
            <div
              className="absolute top-0 left-0 right-0 h-4 z-20"
              onMouseEnter={() => {
                setTopBarHovered(true);
                setHoveredPane(null);
              }}
            />
          )}

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

export const RightPane = memo(forwardRef<HTMLDivElement, { className?: string }>(({ className }, ref) => {
  const fullscreenTarget = useAppShellStore(s => s.fullscreenTarget)
  const bodyState = useAppShellStore(s => s.bodyState)
  const { toggleFullscreen, setIsResizingRightPane } =
    useAppShellStore.getState()

  const viewManager = useAppViewManager()
  const { sidePaneContent, closeSidePane } = viewManager
  
  const { meta, content: children } = useRightPaneContent(sidePaneContent)
  
  const isSplitView = bodyState === BODY_STATES.SPLIT_VIEW;
  const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;

  const header = useMemo(() => (
    <div className="flex items-center justify-between p-4 border-b border-border h-20 flex-shrink-0 pl-6">
      {bodyState !== BODY_STATES.SPLIT_VIEW && 'icon' in meta ? (
        <div className="flex items-center gap-2">
          {meta.icon && createElement(meta.icon, { className: "w-5 h-5" })}
          <h2 className="text-lg font-semibold whitespace-nowrap">{meta.title}</h2>
        </div>
      ) : <div />}
      <div className="flex items-center">
        {bodyState === BODY_STATES.SIDE_PANE && 'page' in meta && meta.page && <ViewModeSwitcher pane="right" targetPage={meta.page} />}
      </div>
    </div>
  ), [bodyState, meta]);

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
      {!isSplitView && !isFullscreen && header}
      <div className={cn("flex-1 overflow-y-auto")}>
        {children}
      </div>
    </aside>
  )
}));
RightPane.displayName = "RightPane"
```

## File: src/pages/Messaging/components/JourneyScrollbar.tsx
```typescript
import React, { useState, useLayoutEffect, useRef, useCallback } from 'react';
import type { Message, JourneyPointType } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { gsap } from 'gsap';
import { Info, MessageSquare, FileText, ShoppingCart, CreditCard, Truck, PackageCheck, XCircle, Undo2, AlertCircle, RefreshCw, MailQuestion, Star, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JourneyScrollbarProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  journeyPoints: Message[];
  onDotClick: (messageId: string) => void;
  onHoverChange?: (isHovering: boolean) => void;
  showAllTooltips?: boolean;
}

const journeyInfoMap: Record<JourneyPointType, { Icon: LucideIcon; textColor: string; bgColor: string; }> = {
  Inquiry: { Icon: Info, textColor: 'text-cyan-500', bgColor: 'bg-cyan-500' },
  Consult: { Icon: MessageSquare, textColor: 'text-blue-500', bgColor: 'bg-blue-500' },
  Quote: { Icon: FileText, textColor: 'text-orange-500', bgColor: 'bg-orange-500' },
  Order: { Icon: ShoppingCart, textColor: 'text-green-500', bgColor: 'bg-green-500' },
  Payment: { Icon: CreditCard, textColor: 'text-lime-500', bgColor: 'bg-lime-500' },
  Shipped: { Icon: Truck, textColor: 'text-sky-500', bgColor: 'bg-sky-500' },
  Delivered: { Icon: PackageCheck, textColor: 'text-emerald-500', bgColor: 'bg-emerald-500' },
  Canceled: { Icon: XCircle, textColor: 'text-slate-500', bgColor: 'bg-slate-500' },
  Refund: { Icon: Undo2, textColor: 'text-rose-500', bgColor: 'bg-rose-500' },
  Complain: { Icon: AlertCircle, textColor: 'text-red-500', bgColor: 'bg-red-500' },
  Reorder: { Icon: RefreshCw, textColor: 'text-indigo-500', bgColor: 'bg-indigo-500' },
  'Follow-up': { Icon: MailQuestion, textColor: 'text-yellow-500', bgColor: 'bg-yellow-500' },
  Review: { Icon: Star, textColor: 'text-amber-500', bgColor: 'bg-amber-500' },
};

export const JourneyScrollbar: React.FC<JourneyScrollbarProps> = ({
  scrollContainerRef,
  journeyPoints,
  onDotClick,
  onHoverChange,
  showAllTooltips,
}) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotsContainerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragOffsetY = useRef(0);
  const activeJourneyPointIdRef = useRef<string | null>(null);

  const updateScrollbar = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !trackRef.current || !thumbRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    
    if (scrollHeight <= clientHeight) {
      gsap.to(thumbRef.current, { autoAlpha: 0, duration: 0.1 });
      return;
    }

    gsap.to(thumbRef.current, { autoAlpha: 1, duration: 0.1 });

    // Calculate proportional thumb height, but cap it at 10% of the container height
    // to prevent it from looking too long. A minimum of 20px is enforced for usability.
    const thumbHeight = Math.max(20, Math.min((clientHeight / scrollHeight) * clientHeight, clientHeight * 0.1));
    const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - thumbHeight);
    
    gsap.to(thumbRef.current, {
      height: thumbHeight,
      y: thumbTop,
      duration: 0.1,
      ease: 'power1.out',
    });

    // Active journey point logic
    const viewportCenter = scrollTop + clientHeight / 2;
    let closestPointId: string | null = null;
    let minDistance = Infinity;

    journeyPoints.forEach(point => {
      const element = container.querySelector(`[data-message-id="${point.id}"]`) as HTMLElement;
      if (element) {
        const elementCenter = element.offsetTop + element.offsetHeight / 2;
        const distance = Math.abs(viewportCenter - elementCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestPointId = point.id;
        }
      }
    });

    if (closestPointId && activeJourneyPointIdRef.current !== closestPointId) {
      if (activeJourneyPointIdRef.current) {
        const oldActiveDot = trackRef.current.querySelector(`[data-dot-id="${activeJourneyPointIdRef.current}"]`);
        gsap.to(oldActiveDot, { scale: 1, opacity: 0.5, duration: 0.2, ease: 'back.out' });
      }
      
      const newActiveDot = trackRef.current.querySelector(`[data-dot-id="${closestPointId}"]`);
      if (newActiveDot) {
        gsap.to(newActiveDot, { scale: 1.75, opacity: 1, duration: 0.2, ease: 'back.out' });       
        if (isOverflowing) {
          (newActiveDot as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
      activeJourneyPointIdRef.current = closestPointId;
    }
  }, [scrollContainerRef, journeyPoints, isOverflowing]);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const handleScroll = () => {
        if (!isDraggingRef.current) {
          updateScrollbar();
        }
      };
      updateScrollbar();
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [scrollContainerRef, updateScrollbar]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || journeyPoints.length === 0) return;

    const MIN_DOT_SPACING = 32; // Corresponds to h-8 in Tailwind

    const checkOverflow = () => {
      const requiredHeight = journeyPoints.length * MIN_DOT_SPACING;
      const trackHeight = track.clientHeight;
      setIsOverflowing(requiredHeight > trackHeight);
    };
    
    checkOverflow();
    const resizeObserver = new ResizeObserver(() => {
        checkOverflow();
        updateScrollbar();
    });
    resizeObserver.observe(trackRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [journeyPoints.length, updateScrollbar]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current || !trackRef.current || !thumbRef.current) return;
    
    e.preventDefault();
    const container = scrollContainerRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    
    const { scrollHeight, clientHeight } = container;
    const scrollableDist = scrollHeight - clientHeight;
    if (scrollableDist <= 0) return;
    
    const trackRect = track.getBoundingClientRect();
    const thumbHeight = thumb.offsetHeight;
    
    const newThumbTop = e.clientY - trackRect.top - dragOffsetY.current;
    const clampedThumbTop = Math.max(0, Math.min(newThumbTop, trackRect.height - thumbHeight));
    
    const scrollRatio = clampedThumbTop / (trackRect.height - thumbHeight);
    
    gsap.to(container, {
      scrollTop: scrollRatio * scrollableDist,
      duration: 0,
      onUpdate: updateScrollbar
    });

  }, [scrollContainerRef, updateScrollbar]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!scrollContainerRef.current || !thumbRef.current) return;
    
    isDraggingRef.current = true;
    const thumbRect = thumbRef.current.getBoundingClientRect();
    dragOffsetY.current = e.clientY - thumbRect.top;
    
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [scrollContainerRef, handleMouseMove, handleMouseUp]);
  
  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
     if (e.target === thumbRef.current || (e.target as HTMLElement).closest('[data-dot-id]')) return;

    const container = scrollContainerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;
    
    const { scrollHeight, clientHeight } = container;
    const trackRect = track.getBoundingClientRect();
    const clickY = e.clientY - trackRect.top;
    
    const thumbHeight = Math.max(20, Math.min((clientHeight / scrollHeight) * clientHeight, clientHeight * 0.1));
    const clickRatio = (clickY - thumbHeight / 2) / (trackRect.height - thumbHeight);
    
    gsap.to(container, {
      scrollTop: (scrollHeight - clientHeight) * Math.max(0, Math.min(1, clickRatio)),
      duration: 0.3,
      ease: 'power2.out'
    });
    
  }, [scrollContainerRef]);

  return (
    <div
      ref={trackRef}
      className="absolute top-0 right-0 h-full w-8 py-2 z-10 cursor-pointer"
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onMouseDown={handleTrackClick}
    >
        <TooltipProvider delayDuration={100}>
            <div className="relative h-full w-full">
                {/* Track Line */}
                <div className="track-line absolute top-0 left-1/2 -translate-x-1/2 h-full w-1 bg-border rounded-full" />

                {/* Thumb */}
                <div
                    ref={thumbRef}
                    className="absolute left-1/2 -translate-x-1/2 w-2 bg-muted-foreground hover:bg-muted-foreground/80 rounded-sm cursor-grab active:cursor-grabbing opacity-0"
                    onMouseDown={handleMouseDown}
                />

                {/* Journey Dots */}
                <div
                  ref={dotsContainerRef}
                  className={cn(
                    // This container is click-through so the thumb and track can be interactive.
                    // Individual dots will re-enable pointer events for themselves.
                    "absolute top-0 left-0 w-full h-full pointer-events-none",
                    isOverflowing 
                      ? "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                      : "flex flex-col"
                  )}
                >
                  {journeyPoints.map((point) => {
                    const journeyInfo = point.journeyPoint ? journeyInfoMap[point.journeyPoint] : null;
                    return (
                      <div 
                        key={point.id} 
                        className={cn("flex items-center justify-center", isOverflowing ? "h-8 flex-shrink-0" : "flex-1")}
                      >
                          <Tooltip open={showAllTooltips}>
                              <TooltipTrigger asChild>
                                <button
                                    data-dot-id={point.id}
                                    onClick={(e) => { e.stopPropagation(); onDotClick(point.id); }}
                                    // Dots are on top of the thumb and are clickable.
                                    className={cn("relative z-10 pointer-events-auto w-2.5 h-2.5 opacity-50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-background transition-all duration-200 hover:scale-125 hover:opacity-100",
                                        journeyInfo ? journeyInfo.bgColor : 'bg-primary'
                                    )}
                                    aria-label={`Jump to message: ${point.text.substring(0, 30)}...`}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="left" className="text-sm p-2 w-auto max-w-xs shadow-xl" sideOffset={8}>
                                {journeyInfo && <div className="flex items-center gap-2 font-semibold mb-1.5"><journeyInfo.Icon className={cn("w-4 h-4", journeyInfo.textColor)} /><span>{point.journeyPoint}</span></div>}
                                <p className="line-clamp-3 text-muted-foreground">{point.text}</p>
                              </TooltipContent>
                          </Tooltip>
                      </div>
                    );
                  })}
                </div>
            </div>
        </TooltipProvider>
    </div>
  );
};
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

const TABS_CONFIG: { id: TaskView, label: string }[] = [
  { id: 'all_open', label: 'Open' },
  { id: 'unassigned', label: 'Unassigned' },
  { id: 'me', label: 'Me' },
  { id: 'done', label: 'Done' }
];

export const TaskList = () => {
  const { conversationId } = useParams<{ conversationId: string }>(); // This will be taskId later
  const { 
    getFilteredTasks,
    setSearchTerm,
    activeFilters,
    setActiveTaskView,
    searchTerm,
   } = useMessagingStore();
   const { messagingView, setMessagingView } = useAppViewManager();
   const taskCounts = useMessagingTaskCounts();

  useEffect(() => {
    setActiveTaskView(messagingView || 'all_open');
  }, [messagingView, setActiveTaskView]);

  const filteredTasks = getFilteredTasks();
  const activeFilterCount = Object.values(activeFilters).reduce((count, filterArray) => count + filterArray.length, 0);

  const TABS = useMemo(() => 
    TABS_CONFIG.map(tab => ({
      ...tab,
      count: taskCounts[tab.id as keyof typeof taskCounts]
    })), 
    [taskCounts]
  );

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
      <AnimatedTabs
        tabs={TABS}
        activeTab={messagingView || 'all_open'}
        onTabChange={(tabId) => setMessagingView(tabId as TaskView)}
        size="sm"
        className="px-4"
      />

      {/* Task List */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-1">
          {filteredTasks.map(task => {
            const currentUserId = 'user-1';
            const isHandledByOther = task.activeHandlerId && task.activeHandlerId !== currentUserId;

            return (
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
                      <p className="text-sm font-semibold truncate pr-2">
                        {task.contact.name} <span className="text-muted-foreground font-normal">&middot; {task.contact.company}</span>
                      </p>
                      <p className="text-sm truncate text-foreground mt-1">{task.title}</p>
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
                          {isHandledByOther && <Eye className="w-3.5 h-3.5" title="Being handled by another user" />}
                      </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1.5 flex-shrink-0">
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{formatDistanceToNowShort(new Date(task.lastActivity.timestamp))}</p>
                    {task.unreadCount > 0 ? (
                        <Badge className="bg-primary h-5 w-5 p-0 flex items-center justify-center">{task.unreadCount}</Badge>
                    ) : <div className="h-5 w-5" /> /* Spacer to maintain alignment */ }
                  </div>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  );
};

// Filter component for popover
function FilterCommand() {
    const { activeFilters, setFilters, assignees, getAvailableTags } = useMessagingStore();
    const availableTags = getAvailableTags();

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

interface TopBarProps {
  breadcrumbs?: React.ReactNode
  pageControls?: React.ReactNode
}

export const TopBar = React.memo(({
  breadcrumbs,
  pageControls,
}: TopBarProps) => {
  const bodyState = useAppShellStore(s => s.bodyState)
  const isDarkMode = useAppShellStore(s => s.isDarkMode);
  const { 
    setCommandPaletteOpen,
    toggleDarkMode,
  } = useAppShellStore.getState();
  const viewManager = useAppViewManager();

  return (
    <div className={cn(
      "h-20 bg-background border-b border-border flex items-center justify-between px-6 z-50 gap-4"
    )}>
      {/* Left Section - Sidebar Controls & Breadcrumbs */}
      <div className="flex items-center gap-4">
        {breadcrumbs}
      </div>

      {/* Right Section - page controls, and global controls */}
      <div className="flex items-center gap-3">
        {pageControls}

        {/* Separator */}
        <div className="w-px h-6 bg-border mx-2" />

        {/* Quick Actions */}
        <div className="flex items-center gap-3">

          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group"
            title="Command Palette (Ctrl+K)"
          >
            <Command className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

        <button
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group"
          title="Quick Actions"
        >
          <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {bodyState !== BODY_STATES.SPLIT_VIEW && <ViewModeSwitcher />}

        <div className="w-px h-6 bg-border mx-2" />

        {/* Theme and Settings */}
        <button
          onClick={toggleDarkMode}
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 group-hover:scale-110 transition-transform" />
          ) : (
            <Moon className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
        </button>

        <button
          onClick={() => viewManager.toggleSidePane('settings')}
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group"
          title="Settings"
        >
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>
        <UserDropdown />
        </div>
      </div>
    </div>
  )
});
```

## File: src/features/dynamic-view/types.ts
```typescript
import type { ReactNode } from 'react';

// --- GENERIC DATA & ITEM ---
export type GenericItem = Record<string, any> & { id: string };

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

export interface BaseFieldDefinition<TFieldId extends string, TItem extends GenericItem> {
  id: TFieldId; // Corresponds to a key in GenericItem
  label: string;
  type: FieldType;
  // Optional custom render function for ultimate flexibility.
  render?: (item: TItem, options?: Record<string, any>) => ReactNode;
}

export interface BadgeFieldDefinition<TFieldId extends string, TItem extends GenericItem>
  extends BaseFieldDefinition<TFieldId, TItem> {
  type: 'badge';
  colorMap?: Record<string, string>; // e.g., { 'active': 'bg-green-500', 'pending': 'bg-yellow-500' }
  indicatorColorMap?: Record<string, string>; // e.g., { 'critical': 'bg-red-500' }
}

// Add other specific field types if they need unique properties
// For now, most can be handled by the base definition.

export type FieldDefinition<TFieldId extends string, TItem extends GenericItem> =
  | BaseFieldDefinition<TFieldId, TItem>
  | BadgeFieldDefinition<TFieldId, TItem>;

// --- VIEW CONFIGURATION ---
// The master configuration object that defines the entire view.

export type ViewMode = 'list' | 'cards' | 'grid' | 'table' | 'kanban' | 'calendar';

export interface ListViewConfig<TFieldId extends string> {
  iconField: TFieldId;
  titleField: TFieldId;
  metaFields: readonly {
    fieldId: TFieldId;
    className?: string;
  }[];
}

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

export interface TableColumnConfig<TFieldId extends string> {
  fieldId: TFieldId;
  label: string;
  isSortable: boolean;
}

export interface TableViewConfig<TFieldId extends string> {
  columns: readonly TableColumnConfig<TFieldId>[];
}

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

export interface CalendarViewConfig<TFieldId extends string> {
  dateField: TFieldId;
  titleField: TFieldId;
  displayFields: readonly TFieldId[];
  colorByField?: TFieldId; // Field ID to color events by (e.g., 'priority', 'status')
}

export interface ControlOption<TId extends string> {
  id: TId;
  label: string;
}

export interface FilterableFieldConfig<TFieldId extends string> {
  id: TFieldId; // fieldId
  label: string;
  options: readonly ControlOption<string>[];
}

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

// --- DETAIL VIEW ---
export interface DetailViewSection<TFieldId extends string> {
  title: string;
  fields: readonly TFieldId[];
}

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

// --- GENERIC CONTROL & DATA TYPES ---

export type Status = 'active' | 'pending' | 'completed' | 'archived';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface FilterConfig {
  searchTerm: string;
  [key: string]: any; // For dynamic filter keys like status, priority
}

export interface SortConfig<TFieldId extends string> {
  key: TFieldId;
  direction: 'asc' | 'desc';
}

export type GroupableField<TFieldId extends string> = TFieldId | 'none';

export type CalendarDateProp<TFieldId extends string> = TFieldId;
export type CalendarDisplayProp<TFieldId extends string> = TFieldId;
export type CalendarColorProp<TFieldId extends string> = TFieldId | 'none';

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

## File: src/hooks/useAppShellAnimations.hook.ts
```typescript
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useSearchParams } from 'react-router-dom';
import { useAppShellStore, useRightPaneWidth } from '@/store/appShell.store';
import { SIDEBAR_STATES, BODY_STATES } from '@/lib/utils';

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export function useSidebarAnimations(
  sidebarRef: React.RefObject<HTMLDivElement>,
  resizeHandleRef: React.RefObject<HTMLDivElement>
) {
  const sidebarState = useAppShellStore(s => s.sidebarState);
  const sidebarWidth = useAppShellStore(s => s.sidebarWidth);
  const bodyState = useAppShellStore(s => s.bodyState);
  const reducedMotion = useAppShellStore(s => s.reducedMotion);
  const animationDuration = reducedMotion ? 0 : 0.4;

  useEffect(() => {
    if (!sidebarRef.current || !resizeHandleRef.current) return;

    const sidebar = sidebarRef.current;
    const handle = resizeHandleRef.current;
    
    let targetWidth = 0;
    let targetOpacity = 1;

    if (bodyState === BODY_STATES.FULLSCREEN) {
      targetWidth = 0;
      targetOpacity = 0;
    } else {
      switch (sidebarState) {
        case SIDEBAR_STATES.HIDDEN:
          targetWidth = 0;
          targetOpacity = 0;
          break;
        case SIDEBAR_STATES.COLLAPSED:
          targetWidth = 64;
          targetOpacity = 1;
          break;
        case SIDEBAR_STATES.EXPANDED:
          targetWidth = sidebarWidth;
          targetOpacity = 1;
          break;
        case SIDEBAR_STATES.PEEK:
          targetWidth = sidebarWidth * 0.8;
          targetOpacity = 0.95;
          break;
      }
    }

    const tl = gsap.timeline({ ease: "power3.out" });
    
    tl.to(sidebar, {
      width: targetWidth,
      opacity: targetOpacity,
      duration: animationDuration,
    });
    tl.to(handle, {
      left: targetWidth,
      duration: animationDuration,
    }, 0);

  }, [sidebarState, sidebarWidth, bodyState, animationDuration, sidebarRef, resizeHandleRef]);
}

export function useBodyStateAnimations(
  appRef: React.RefObject<HTMLDivElement>,
  mainContentRef: React.RefObject<HTMLDivElement>,
  rightPaneRef: React.RefObject<HTMLDivElement>,
  topBarContainerRef: React.RefObject<HTMLDivElement>,
  mainAreaRef: React.RefObject<HTMLDivElement>
) {
  const bodyState = useAppShellStore(s => s.bodyState);
  const reducedMotion = useAppShellStore(s => s.reducedMotion);
  const isTopBarVisible = useAppShellStore(s => s.isTopBarVisible);
  const isTopBarHovered = useAppShellStore(s => s.isTopBarHovered);
  const fullscreenTarget = useAppShellStore(s => s.fullscreenTarget);
  const rightPaneWidth = useRightPaneWidth();
  const animationDuration = reducedMotion ? 0 : 0.4;
  const prevBodyState = usePrevious(bodyState);
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!mainContentRef.current || !rightPaneRef.current || !topBarContainerRef.current || !mainAreaRef.current) return;

    const ease = "power3.out";
    const isSidePane = bodyState === BODY_STATES.SIDE_PANE;
    const isSplitView = bodyState === BODY_STATES.SPLIT_VIEW;

    // Kill any existing animations on the right pane to prevent conflicts
    gsap.killTweensOf(rightPaneRef.current);

    // Right pane animation
    if (isSidePane) {
      // Ensure correct width and position are set.
      gsap.set(rightPaneRef.current, { width: rightPaneWidth, x: '0%' });
      // Animate entrance only when changing TO side pane view to prevent re-animation on resize.
      if (prevBodyState !== BODY_STATES.SIDE_PANE) {
        gsap.fromTo(rightPaneRef.current, { x: '100%' }, {
            x: '0%',
            duration: animationDuration,
            ease,
        });
      }
    } else if (isSplitView) {
        // SHOW AS SPLIT: Set transform immediately, animate width.
        gsap.set(rightPaneRef.current, { x: '0%' });
        gsap.to(rightPaneRef.current, {
            width: rightPaneWidth,
            duration: animationDuration,
            ease,
        });
    } else {
        // HIDE PANE: Determine how to hide based on the state we are coming FROM.
        if (prevBodyState === BODY_STATES.SIDE_PANE) {
            // It was an overlay, so slide it out.
            gsap.to(rightPaneRef.current, {
          x: '100%',
          duration: animationDuration,
          ease,
            });
        } else { // Covers coming from SPLIT_VIEW, FULLSCREEN, or NORMAL
            // It was docked or fullscreen, so shrink its width.
            gsap.to(rightPaneRef.current, { width: 0, duration: animationDuration, ease });
        }
    }

    // Determine top bar position based on state
    let topBarY = '0%';
    if (bodyState === BODY_STATES.FULLSCREEN) { // Always hide in fullscreen
      topBarY = '-100%';
    } else if (bodyState === BODY_STATES.SPLIT_VIEW && !isTopBarHovered) { // Hide in split view unless hovered
      topBarY = '-100%';
    } else if (bodyState === BODY_STATES.NORMAL && !isTopBarVisible) { // Hide only in normal mode when scrolled
      topBarY = '-100%';
    }

    gsap.to(topBarContainerRef.current, {
      y: topBarY,
      duration: animationDuration,
      ease,
    });
    
    // Add backdrop for side pane
    const backdrop = document.querySelector('.app-backdrop');
    if (isSidePane) { // This is correct because isSidePane is false when bodyState is split_view
      if (!backdrop) {
        const el = document.createElement('div');
        el.className = 'app-backdrop fixed inset-0 bg-black/30 z-[55]';
        appRef.current?.appendChild(el);
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: animationDuration });
        el.onclick = () => {
          setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.delete('sidePane');
            return newParams;
          }, { replace: true });
        };
      }
    } else {
      if (backdrop) {
        gsap.to(backdrop, { opacity: 0, duration: animationDuration, onComplete: () => backdrop.remove() });
      }
    }
  }, [bodyState, prevBodyState, animationDuration, rightPaneWidth, isTopBarVisible, isTopBarHovered, appRef, mainContentRef, rightPaneRef, topBarContainerRef, mainAreaRef, fullscreenTarget, setSearchParams]);
}
```

## File: src/pages/Messaging/data/mockData.ts
```typescript
import type { Contact, Task, Message, ActivityEvent, Note, Assignee, TaskStatus, TaskPriority, Channel, JourneyPointType } from '../types';
import { faker } from '@faker-js/faker';

// --- ASSIGNEES ---
export const mockAssignees: Assignee[] = [
  { id: 'user-1', name: 'You', avatar: `https://avatar.vercel.sh/you.png`, type: 'human' },
  { id: 'user-2', name: 'Alex Johnson', avatar: `https://avatar.vercel.sh/alex.png`, type: 'human' },
  { id: 'user-3', name: 'Samira Kumar', avatar: `https://avatar.vercel.sh/samira.png`, type: 'human' },
  { id: 'user-4', name: 'Casey Lee', avatar: `https://avatar.vercel.sh/casey.png`, type: 'human' },
  { id: 'user-5', name: 'Jordan Rivera', avatar: `https://avatar.vercel.sh/jordan.png`, type: 'human' },
  { id: 'user-ai-1', name: 'AI Assistant', avatar: `https://avatar.vercel.sh/ai.png`, type: 'ai' },
];

// --- HELPERS ---
const generateNotes = (contactName: string): Note[] => [
  { id: `note-${faker.string.uuid()}`, content: `Initial discovery call with ${contactName}. Seemed very interested in our enterprise package.`, createdAt: faker.date.past().toISOString() },
  { id: `note-${faker.string.uuid()}`, content: `Followed up via email with pricing details.`, createdAt: faker.date.recent().toISOString() },
];

const generateActivity = (contactName: string): ActivityEvent[] => [
  { id: `act-${faker.string.uuid()}`, type: 'email', content: `Sent follow-up email regarding pricing.`, timestamp: faker.date.past().toISOString() },
  { id: `act-${faker.string.uuid()}`, type: 'call', content: `Had a 30-minute discovery call with ${contactName}.`, timestamp: faker.date.recent().toISOString() },
  { id: `act-${faker.string.uuid()}`, type: 'meeting', content: `Scheduled a demo for next week.`, timestamp: faker.date.soon().toISOString() },
];

// --- COMPANIES ---
const mockCompanies = Array.from({ length: 25 }, () => faker.company.name());

// --- CONTACTS ---
export const mockContacts: Contact[] = Array.from({ length: 80 }, (_, i) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const company = faker.helpers.arrayElement(mockCompanies);
    return {
        id: `contact-${i + 1}`,
        name,
        avatar: `https://avatar.vercel.sh/${firstName.toLowerCase()}${lastName.toLowerCase()}.png`,
        online: faker.datatype.boolean(),
        tags: faker.helpers.arrayElements(['VIP', 'New Lead', 'Returning Customer', 'Support Request', 'High Value'], { min: 1, max: 3 }),
        email: faker.internet.email({ firstName, lastName }),
        phone: faker.phone.number(),
        lastSeen: faker.datatype.boolean() ? 'online' : `${faker.number.int({ min: 2, max: 59 })} minutes ago`,
        company,
        role: faker.person.jobTitle(),
        activity: generateActivity(name),
        notes: generateNotes(name),
    };
});

// --- MESSAGE GENERATOR ---
const generateMessages = (messageCount: number, contactName: string, journeyPath: JourneyPointType[]): Message[] => {
  const messages: Message[] = [];
  const now = new Date();
  
  const journeyPointsWithIndices = journeyPath.map((point, index) => ({
      point,
      index: Math.floor((messageCount / journeyPath.length) * (index + Math.random() * 0.8))
  }));

  for (let i = 0; i < messageCount; i++) {
    const random = Math.random();
    let sender: Message['sender'] = 'contact';
    let type: Message['type'] = 'comment';
    let text = faker.lorem.sentence();
    let userId: string | undefined = undefined;

    if (random > 0.85) { // Internal Note
      sender = 'user';
      type = 'note';
      const user = faker.helpers.arrayElement(mockAssignees.filter(u => u.type === 'human'));
      userId = user.id;
      text = `Internal note from ${user.name}: ${faker.lorem.sentence()}`;
    } else if (random > 0.7) { // System message
      sender = 'system';
      type = 'system';
      text = faker.helpers.arrayElement(['Task status changed to "in-progress"', 'Task assigned to Alex Johnson', 'User joined the conversation']);
    } else if (random > 0.35) { // User comment
      sender = 'user';
      type = 'comment';
      userId = 'user-1'; // "You"
      text = faker.lorem.sentence();
    }
    
    const journeyPointInfo = journeyPointsWithIndices.find(jp => jp.index === i);

    messages.push({
      id: `msg-${faker.string.uuid()}`,
      text,
      timestamp: new Date(now.getTime() - (messageCount - i) * 60 * 60 * 100).toISOString(),
      sender,
      type,
      read: i < messageCount - faker.number.int({min: 0, max: 5}),
      userId,
      journeyPoint: journeyPointInfo?.point
    });
  }
  
  // Ensure the last message is from the contact for preview purposes
  messages[messages.length - 1] = {
    ...messages[messages.length-1],
    sender: 'contact',
    type: 'comment',
    text: `Hey! This is the latest message from ${contactName}. ${faker.lorem.sentence()}`,
    userId: undefined
  };
  return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// --- TASK GENERATOR ---
const generateTasks = (count: number): Task[] => {
    const tasks: Task[] = [];
    const statuses: TaskStatus[] = ['open', 'in-progress', 'done', 'snoozed'];
    const priorities: TaskPriority[] = ['none', 'low', 'medium', 'high'];
    const channels: Channel[] = ['whatsapp', 'instagram', 'facebook', 'email'];
    const possibleJourneys: JourneyPointType[][] = [
        ['Inquiry', 'Consult', 'Quote', 'Order', 'Payment', 'Shipped', 'Delivered', 'Review'],
        ['Inquiry', 'Consult', 'Quote', 'Order', 'Payment', 'Shipped', 'Delivered', 'Follow-up'],
        ['Inquiry', 'Consult', 'Follow-up'],
        ['Inquiry', 'Consult', 'Quote', 'Order', 'Canceled'],
        ['Consult', 'Order', 'Payment', 'Shipped', 'Delivered', 'Complain', 'Refund'],
        ['Consult', 'Order', 'Payment', 'Shipped', 'Complain', 'Follow-up'],
        ['Order', 'Delivered', 'Review', 'Reorder', 'Delivered'],
        ['Complain', 'Follow-up', 'Refund'],
        ['Quote', 'Follow-up', 'Order', 'Payment', 'Shipped', 'Delivered'],
        ['Inquiry', 'Quote', 'Order', 'Payment', 'Shipped', 'Canceled', 'Refund'],
        ['Consult', 'Follow-up'],
        ['Complain'],
        ['Order', 'Delivered'],
    ];

    for (let i = 0; i < count; i++) {
        const contact = faker.helpers.arrayElement(mockContacts);
        const status = faker.helpers.arrayElement(statuses);
        const unreadCount = status === 'open' || status === 'in-progress' ? faker.number.int({ min: 0, max: 8 }) : 0;
        const messageCount = faker.number.int({ min: 10, max: 150 });
        const journey = faker.helpers.arrayElement(possibleJourneys);
        const messages = generateMessages(messageCount, contact.name, journey);
        const assignee = faker.datatype.boolean(0.8) ? faker.helpers.arrayElement(mockAssignees) : null;

        const task: Task = {
            id: `task-${i + 1}`,
            title: faker.lorem.sentence({ min: 3, max: 7 }),
            contactId: contact.id,
            channel: faker.helpers.arrayElement(channels),
            unreadCount,
            messages,
            get lastActivity() { return this.messages[this.messages.length - 1]; },
            status,
            assigneeId: assignee?.id || null,
            dueDate: faker.datatype.boolean() ? faker.date.future().toISOString() : null,
            priority: faker.helpers.arrayElement(priorities),
            tags: faker.helpers.arrayElements(['onboarding', 'pricing', 'bug-report', 'urgent', 'tech-support'], faker.number.int({min: 0, max: 2})),
            aiSummary: {
                sentiment: faker.helpers.arrayElement(['positive', 'negative', 'neutral']),
                summaryPoints: Array.from({ length: 3 }, () => faker.lorem.sentence()),
                suggestedReplies: Array.from({ length: 2 }, () => faker.lorem.words({ min: 3, max: 6})),
            },
            activeHandlerId: faker.helpers.arrayElement([assignee?.id ?? null, null, 'user-ai-1']),
        };
        tasks.push(task);
    }
    return tasks;
}

export const mockTasks: Task[] = generateTasks(200);
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

## File: src/pages/DataDemo/store/dataDemo.store.tsx
```typescript
import { create } from "zustand";
import { mockDataItems } from "@/pages/DataDemo/data/mockData";
import type {
  GroupableField,
  FilterConfig,
  SortConfig,
} from "@/features/dynamic-view/types";

import type { DataDemoItem } from "../data/DataDemoItem";
// --- State and Actions ---
interface DataDemoState {
  items: DataDemoItem[];
  hasMore: boolean;
  isLoading: boolean;
  isInitialLoading: boolean;
  totalItemCount: number;
}

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

const defaultState: DataDemoState = {
  items: [],
  hasMore: true,
  isLoading: true,
  isInitialLoading: true,
  totalItemCount: 0,
};

// Cast the mock data to our strict type to satisfy the store's requirements
const typedMockData = mockDataItems as DataDemoItem[];

// --- Store Implementation ---
export const useDataDemoStore = create<DataDemoState & DataDemoActions>(
  (set) => ({
    ...defaultState,

    loadData: ({ page, groupBy, filters, sortConfig, isFullLoad }) => {
      set({ isLoading: true, ...(page === 1 && { isInitialLoading: true }) });
      const isFirstPage = page === 1;

      const filteredAndSortedData = (() => {
        const filteredItems = typedMockData.filter((item) => {
          const searchTermMatch =
            item.title
              .toLowerCase()
              .includes(filters.searchTerm.toLowerCase()) ||
            item.description
              .toLowerCase()
              .includes(filters.searchTerm.toLowerCase());
          const statusMatch =
            filters.status.length === 0 || filters.status.includes(item.status);
          const priorityMatch =
            filters.priority.length === 0 ||
            filters.priority.includes(item.priority);
          return searchTermMatch && statusMatch && priorityMatch;
        });

        if (sortConfig) {
          filteredItems.sort((a, b) => {
            const getNestedValue = (obj: DataDemoItem, path: string): unknown =>
              path.split(".").reduce((o: any, k) => (o || {})[k], obj);

            const aValue = getNestedValue(a, sortConfig.key);
            const bValue = getNestedValue(b, sortConfig.key);

            if (aValue === undefined || bValue === undefined) return 0;
            if (typeof aValue === "string" && typeof bValue === "string") {
              return sortConfig.direction === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
            }
            if (typeof aValue === "number" && typeof bValue === "number") {
              return sortConfig.direction === "asc"
                ? aValue - bValue
                : bValue - aValue;
            }
            if (
              sortConfig.key === "updatedAt" ||
              sortConfig.key === "createdAt"
            ) {
              if (typeof aValue === "string" && typeof bValue === "string") {
                return sortConfig.direction === "asc"
                  ? new Date(aValue).getTime() - new Date(bValue).getTime()
                  : new Date(bValue).getTime() - new Date(aValue).getTime();
              }
            }
            return 0;
          });
        }
        return filteredItems;
      })();

      const totalItemCount = filteredAndSortedData.length;

      setTimeout(
        () => {
          if (groupBy !== "none" || isFullLoad) {
            set({
              items: filteredAndSortedData,
              hasMore: false,
              isLoading: false,
              isInitialLoading: false,
              totalItemCount,
            });
            return;
          }

          const pageSize = 12;
          const newItems = filteredAndSortedData.slice(
            (page - 1) * pageSize,
            page * pageSize,
          );

          set((state) => ({
            items: isFirstPage ? newItems : [...state.items, ...newItems],
            hasMore: totalItemCount > page * pageSize,
            isLoading: false,
            isInitialLoading: false,
            totalItemCount,
          }));
        },
        isFirstPage ? 1500 : 500,
      );
    },

    updateItem: (itemId, updates) => {
      // In a real app, this would be an API call. Here we update the mock source.
      const itemIndex = typedMockData.findIndex((i) => i.id === itemId);
      if (itemIndex > -1) {
        typedMockData[itemIndex] = { ...typedMockData[itemIndex], ...updates };
      }

      // Also update the currently loaded items in the store's state for UI consistency
      set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item,
        ),
      }));
    },
  }),
);

export const useSelectedItem = (itemId?: string) => {
  if (!itemId) return null;
  return (
    (typedMockData.find((item) => item.id === itemId) as DataDemoItem) ?? null
  );
};
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


export const TaskDetail: React.FC = () => {
  const { conversationId: taskId } = useParams<{ conversationId: string }>();
  const { show } = useToast();
  const { getTaskById, takeOverTask, requestAndSimulateTakeover } = useMessagingStore();
  const reducedMotion = useAppShellStore(s => s.reducedMotion);
  
  const task = taskId ? getTaskById(taskId) : undefined;

  // In a real app, this would come from the auth store
  const currentUserId = 'user-1'; 

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isLocked = !!task?.activeHandlerId && task.activeHandlerId !== currentUserId;
  const inputAreaRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const [isJourneyHovered, setIsJourneyHovered] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isHoveringThread, setIsHoveringThread] = useState(false);

  // Hooks and memoized values must be called unconditionally at the top level.
  // Moved from below the early return to fix "rendered more hooks" error.
  const journeyPoints = useMemo(
    () => task?.messages.filter((m) => m.journeyPoint) ?? [],
    [task?.messages],
  );
  const filteredMessages = useMemo(() => {
    if (!task?.messages) return [];
    if (!searchTerm) return task.messages;
    return task.messages.filter(msg => msg.text.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [task?.messages, searchTerm]);

  useLayoutEffect(() => {
    // On conversation change, scroll to the bottom of the message list.
    // This ensures the user sees the latest message and that the scrollbar
    // component has the correct scrollHeight to calculate its visibility.
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [taskId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        setIsSearchVisible(true);
      }
      if (event.key === 'Escape' && isSearchVisible) {
        setIsSearchVisible(false);
        setSearchTerm('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchVisible]);

  useEffect(() => {
    if (isSearchVisible) {
      // Timeout to allow for the element to be rendered and transitioned
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchVisible]);

  useEffect(() => {
    if (!inputAreaRef.current) return;

    const initialBorderWidth = '1px'; // from 'border-t'
    const initialPadding = '1rem';    // from 'p-4'

    const target = isLocked
      ? {
          y: 20,
          opacity: 0,
          maxHeight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          borderTopWidth: 0,
          pointerEvents: 'none' as const,
        }
      : {
          y: 0,
          opacity: 1,
          maxHeight: 500, // Ample room for the input
          paddingTop: initialPadding,
          paddingBottom: initialPadding,
          borderTopWidth: initialBorderWidth,
          pointerEvents: 'auto' as const,
        };

    if (reducedMotion) {
      gsap.set(inputAreaRef.current, target);
      return;
    }
    
    if (isFirstRender.current) {
      gsap.set(inputAreaRef.current, target);
      isFirstRender.current = false;
    } else {
      gsap.to(inputAreaRef.current, {
        ...target,
        duration: 0.35,
        ease: 'power2.inOut',
      });
    }
  }, [isLocked, reducedMotion]);

  if (!taskId || !task) {
    return (
        <div className="h-full flex flex-col items-center justify-center p-6 bg-background">
            <p className="text-muted-foreground">Select a task to see its details.</p>
        </div>
    );
  }

  const handleDotClick = (messageId: string) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const element = container.querySelector(`[data-message-id="${messageId}"]`);
    
    if (element) {
      // Using 'center' to avoid the message being at the very top/bottom of the view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleTakeOver = () => {
    takeOverTask(task.id, currentUserId);
    show({
        variant: 'success',
        title: 'Task Taken Over',
        message: `You are now handling the task from ${task.contact.name}.`
    });
  };

  const handleRequestTakeover = () => {
    requestAndSimulateTakeover(task.id, currentUserId);
    if (task.activeHandler) {
        show({
            variant: 'default',
            title: 'Request Sent',
            message: `A takeover request has been sent to ${task.activeHandler.name}.`
        });
    }
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {isLocked && task.activeHandler && (
        <TakeoverBanner
            activeHandler={task.activeHandler}
            isRequesting={!!task.takeoverRequested}
            onTakeOver={handleTakeOver}
            onRequestTakeover={handleRequestTakeover}
        />
      )}
      <div
        className="relative flex-1 overflow-hidden"
        onMouseEnter={() => setIsHoveringThread(true)}
        onMouseLeave={() => setIsHoveringThread(false)}
      >
        <div className={cn(
          "absolute top-4 right-4 z-10 transition-all duration-300",
          isJourneyHovered && "opacity-0 pointer-events-none",
          !isHoveringThread && !isSearchVisible && "opacity-0"
        )}>
          <div className={cn(
            "transition-opacity duration-300",
            isSearchVisible ? "opacity-0 pointer-events-none" : "opacity-100"
          )}>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full shadow-lg bg-background/80 backdrop-blur-sm"
              onClick={() => setIsSearchVisible(true)}
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
          <div className={cn(
            "absolute top-0 right-0 transition-all duration-300 w-64 origin-right",
            isSearchVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 pointer-events-none"
          )}>
            <div className="relative w-full bg-background/80 backdrop-blur-sm rounded-full shadow-lg border">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search conversation..."
                className="pl-9 pr-9 h-10 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Button
                variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                onClick={() => { setIsSearchVisible(false); setSearchTerm(''); }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <div
          ref={scrollContainerRef}
          className={cn(
            "h-full overflow-y-auto pr-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
            "transition-all duration-200",
            isJourneyHovered && "blur-sm pointer-events-none"
          )}
        >
          <ActivityFeed messages={filteredMessages} contact={task.contact} searchTerm={searchTerm} />
        </div>
        {journeyPoints.length > 0 && (
            <JourneyScrollbar
                scrollContainerRef={scrollContainerRef}
                journeyPoints={journeyPoints}
                onDotClick={handleDotClick}
                onHoverChange={setIsJourneyHovered}
                showAllTooltips={isJourneyHovered}
            />
        )}
      </div>

      {/* Input Form */}
      <div ref={inputAreaRef} className="p-4 border-t flex-shrink-0 bg-background/50">
        <Tabs defaultValue="comment" className="w-full" >
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="comment" disabled={isLocked}>Comment</TabsTrigger>
            <TabsTrigger value="note" disabled={isLocked}><StickyNote className="w-4 h-4 mr-2" />Internal Note</TabsTrigger>
          </TabsList>
          <TabsContent value="comment">
             <div className="relative">
                <Textarea placeholder={isLocked ? "Take over to reply..." : `Reply to ${task.contact.name}...`} className="pr-24 min-h-[52px]" disabled={isLocked} />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" disabled={isLocked}><Smile className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" disabled={isLocked}><Paperclip className="w-4 h-4" /></Button>
                    <Button size="icon" className="rounded-full h-8 w-8" disabled={isLocked}><SendHorizontal className="w-4 h-4" /></Button>
                </div>
            </div>
          </TabsContent>
          <TabsContent value="note">
            <div className="relative">
                <Textarea placeholder={isLocked ? "Take over to add a note..." : "Add an internal note..."} className="pr-24 min-h-[52px] bg-yellow-400/10 border-yellow-400/30 focus-visible:ring-yellow-500" disabled={isLocked} />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                    <Button size="icon" className="rounded-full h-8 w-8" disabled={isLocked}><SendHorizontal className="w-4 h-4" /></Button>
                </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
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

  const defaultSplitPaneWidth = useAppShellStore((s) => s.defaultSplitPaneWidth);
  // When a conversation is selected (split view), reset the pane width to default.
  // When no conversation is selected, we don't want to manage the width, so pass undefined.
  const desiredSplitPaneWidth = conversationId ? defaultSplitPaneWidth : undefined;
  usePageViewConfig({ splitPaneWidth: desiredSplitPaneWidth });

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
  type: 'human' | 'ai';
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

export type JourneyPointType = 'Inquiry' | 'Consult' | 'Quote' | 'Order' | 'Payment' | 'Shipped' | 'Delivered' | 'Canceled' | 'Refund' | 'Complain' | 'Reorder' | 'Follow-up' | 'Review';

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
  activeHandlerId: string | null;
  takeoverRequested?: boolean;
}

export type TaskView = 'all_open' | 'unassigned' | 'me' | 'done';
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

export function ViewModeSwitcher({ pane, targetPage }: { pane?: 'main' | 'right', targetPage?: string }) {
  const bodyState = useAppShellStore(s => s.bodyState);
  const fullscreenTarget = useAppShellStore(s => s.fullscreenTarget);
  const { toggleFullscreen } = useAppShellStore.getState();
  const {
    currentActivePage,
    toggleSidePane,
    toggleSplitView,
    setNormalView,
    navigateTo,
    switchSplitPanes,
    closeSplitPane,
  } = useAppViewManager();

  const activePage = targetPage || currentActivePage;
  const [isExpanded, setIsExpanded] = useState(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;
  const isThisPaneFullscreen = isFullscreen && (
    (pane === 'main' && fullscreenTarget !== 'right') ||
    (pane === 'right' && fullscreenTarget === 'right') ||
    (!pane && !fullscreenTarget) // Global switcher, global fullscreen
  );

  useEffect(() => {
    const buttonsToAnimate = buttonRefs.current.filter(Boolean) as HTMLButtonElement[];
    if (buttonsToAnimate.length === 0) return;

    gsap.killTweensOf(buttonsToAnimate);

    if (isExpanded) {
        gsap.to(buttonsToAnimate, {
            width: 32, // h-8 w-8
            opacity: 1,
            pointerEvents: 'auto',
            marginLeft: 4, // from gap-1 in original
            duration: 0.2,
            stagger: {
                each: 0.05,
                from: 'start'
            },
            ease: 'power2.out'
        });
    } else {
        gsap.to(buttonsToAnimate, {
            width: 0,
            opacity: 0,
            pointerEvents: 'none',
            marginLeft: 0,
            duration: 0.2,
            stagger: {
                each: 0.05,
                from: 'end'
            },
            ease: 'power2.in'
        });
    }
  }, [isExpanded, bodyState]); // re-run if bodyState changes to recalc buttons

  const handlePaneClick = (type: 'side-pane' | 'split-view') => {
    const pageToPaneMap: Record<string, AppShellState['sidePaneContent']> = {
      dashboard: 'main', settings: 'settings', toaster: 'toaster', notifications: 'notifications', 'data-demo': 'dataDemo',
      messaging: 'messaging',
    };
    const basePage = activePage.split('/')[0];
    const paneContent = pageToPaneMap[basePage];
    if (type === 'side-pane') toggleSidePane(paneContent);
    else toggleSplitView();
  }

  const handleNormalViewClick = () => {
    if (isFullscreen) {
      toggleFullscreen();
    }
    if (targetPage && targetPage !== currentActivePage) {
      navigateTo(targetPage);
    } else {
      setNormalView();
    }
  }

  const buttons = [
    {
      id: 'normal',
      onClick: handleNormalViewClick,
      active: bodyState === BODY_STATES.NORMAL,
      title: "Normal View",
      icon: <Columns className="w-4 h-4" />
    },
    {
      id: 'side-pane',
      onClick: () => handlePaneClick('side-pane'),
      active: bodyState === BODY_STATES.SIDE_PANE,
      title: "Side Pane View",
      icon: <PanelRightOpen className="w-4 h-4" />
    },
    {
      id: 'split-view',
      onClick: () => handlePaneClick('split-view'),
      active: bodyState === BODY_STATES.SPLIT_VIEW,
      title: bodyState === BODY_STATES.SPLIT_VIEW ? 'Switch to Overlay View' : 'Switch to Split View',
      icon: bodyState === BODY_STATES.SPLIT_VIEW ? <Layers className="w-4 h-4" /> : <SplitSquareHorizontal className="w-4 h-4" />
    },
    {
      id: 'fullscreen',
      onClick: () => {
        if (targetPage && targetPage !== currentActivePage ) {
          navigateTo(targetPage);
          setTimeout(() => toggleFullscreen(pane), 50);
        } else {
          toggleFullscreen(pane);
        }
      },
      active: isThisPaneFullscreen,
      title: "Toggle Fullscreen",
      icon: isThisPaneFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />
    }
  ];

  if (bodyState === BODY_STATES.SPLIT_VIEW) {
    buttons.push({
      id: 'switch',
      onClick: switchSplitPanes,
      active: false,
      title: "Switch Panes",
      icon: <ArrowLeftRight className="w-4 h-4" />
    });
    buttons.push({
      id: 'close',
      onClick: () => closeSplitPane(pane || 'right'),
      active: false,
      title: "Close Pane",
      icon: <X className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
    });
  }

  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="flex items-center gap-0 p-1 bg-card rounded-full border border-border"
    >
        <button
            className='h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-accent transition-colors'
            title="View Modes"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <Layers className="w-4 h-4" />
        </button>
      
      {buttons.map((btn, index) => (
        <button
          key={btn.id}
          ref={el => buttonRefs.current[index] = el}
          onClick={btn.onClick}
          className={cn(
            'h-8 w-0 flex items-center justify-center rounded-full hover:bg-accent transition-colors group opacity-0',
            btn.active && 'bg-accent text-accent-foreground',
            btn.id === 'close' && 'hover:bg-destructive/20'
          )}
          style={{ pointerEvents: 'none', marginLeft: 0, overflow: 'hidden' }}
          title={btn.title}
        >
          {btn.icon}
        </button>
      ))}
    </div>
  )
}
```

## File: src/pages/Messaging/store/messaging.store.ts
```typescript
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
              <AppMenuItem icon={Database} label="Data Demo" page="data-demo"  />
              <MessagingSidebarItems />
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
  onClick?: () => void;
  isActive?: boolean;
}

const AppMenuItem: React.FC<AppMenuItemProps> = ({ icon: Icon, label, badge, hasActions, children, isSubItem = false, page, opensInSidePane = false, onClick, isActive: isActiveProp }) => {
  const compactMode = useAppShellStore(state => state.compactMode);
  const { setDraggedPage, setDragHoverTarget } = useAppShellStore.getState()
  const { isCollapsed } = useSidebar();
  const viewManager = useAppViewManager();

  const calculatedIsActive = (
    (!opensInSidePane && page && viewManager.currentActivePage === page)
  ) || (
    opensInSidePane && page === 'notifications' && viewManager.sidePaneContent === 'notifications'
  );

  const isActive = isActiveProp ?? calculatedIsActive;

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
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

const MessagingSidebarItems = () => {
  const { currentActivePage, messagingView, navigateTo } = useAppViewManager();
  const totalUnread = 7; // Mock data, could come from a store

  return (
    <AppMenuItem
      icon={Mail}
      label="Messaging"
      badge={totalUnread}
      page="messaging"
      isActive={currentActivePage === 'messaging'}
      onClick={() => navigateTo('messaging', { messagingView: 'all_open' })}
    >
      <AppMenuItem
        icon={Inbox}
        label="All Open"
        isSubItem
        page="messaging"
        isActive={currentActivePage === 'messaging' && (messagingView === 'all_open' || !messagingView)}
        onClick={() => navigateTo('messaging', { messagingView: 'all_open' })}
      />
      <AppMenuItem
        icon={UserX}
        label="Unassigned"
        isSubItem
        page="messaging"
        isActive={currentActivePage === 'messaging' && messagingView === 'unassigned'}
        onClick={() => navigateTo('messaging', { messagingView: 'unassigned' })}
      />
      <AppMenuItem
        icon={CheckCircle2}
        label="Done"
        isSubItem
        page="messaging"
        isActive={currentActivePage === 'messaging' && messagingView === 'done'}
        onClick={() => navigateTo('messaging', { messagingView: 'done' })}
      />
    </AppMenuItem>
  );
};
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

export function useRightPaneContent(sidePaneContent: AppShellState['sidePaneContent']) {
  const { itemId, conversationId } = useParams<{ itemId: string; conversationId: string }>();

  const staticContentMap = useMemo(() => ({
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
      content: <div className="p-6"><SettingsContent /></div>,
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
  }), []);

  const contentMap = useMemo(() => ({
    ...staticContentMap,
    messaging: {
      title: "Conversation",
      icon: MessageSquare,
      page: "messaging",
      content: <MessagingContent conversationId={conversationId} />,
    },
  }), [conversationId, staticContentMap]);

  const selectedItem = useMemo(() => {
    if (!itemId) return null;
    return (mockDataItems.find(item => item.id === itemId) as DataDemoItem) ?? null;
  }, [itemId]);

  const { meta, content } = useMemo(() => {
    if (sidePaneContent === 'dataItem' && selectedItem) {
      return {
        meta: { title: "Item Details", icon: Database, page: `data-demo/${itemId}` },
        content: (
          <DynamicViewProvider
            viewConfig={dataDemoViewConfig}
            items={mockDataItems as DataDemoItem[]}
            isLoading={false}
            isInitialLoading={false}
            totalItemCount={0}
            hasMore={false}
            viewMode="list"
            filters={{ searchTerm: "" }}
            sortConfig={null}
            groupBy="none"
            activeGroupTab=""
            page={1}
            onViewModeChange={() => {}}
            onFiltersChange={() => {}}
            onSortChange={() => {}}
            onGroupByChange={() => {}}
            onActiveGroupTabChange={() => {}}
            onPageChange={() => {}}
            onItemSelect={() => {}}
          >
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <DetailPanel item={selectedItem} config={dataDemoViewConfig.detailView} />
              </div>
              {/* Application-specific actions can be composed here */}
              <div className="p-6 border-t border-border/50 bg-card/30">
                <div className="flex gap-3">
                  <Button className="flex-1" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Project
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </DynamicViewProvider>
        ),
      };
    }
    const mappedContent = contentMap[sidePaneContent as keyof typeof contentMap] || contentMap.details;
    return {
      meta: mappedContent,
      content: mappedContent.content,
    };
  }, [sidePaneContent, selectedItem, contentMap, itemId]);

  return { meta, content };
}
```

## File: src/hooks/useAppViewManager.hook.ts
```typescript
import { useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAppShellStore, type AppShellState, type ActivePage } from '@/store/appShell.store';
import type { GenericItem, ViewMode, SortConfig, GroupableField, CalendarDateProp, CalendarDisplayProp, CalendarColorProp, FilterConfig } from '@/features/dynamic-view/types';
import type { TaskView } from '@/pages/Messaging/types';
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
  const messagingView = searchParams.get('messagingView') as TaskView | null;
  const q = searchParams.get('q');
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const sort = searchParams.get('sort');
  const calDate = searchParams.get('calDate');
  const calDisplay = searchParams.get('calDisplay');
  const calLimit = searchParams.get('calLimit');
  const calColor = searchParams.get('calColor');

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
  const viewMode = useMemo(() => (searchParams.get('dataView') as ViewMode) || 'list', [searchParams]);
	const page = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams]);
	const groupBy = useMemo(() => (searchParams.get('groupBy') as GroupableField<string> | 'none') || 'none', [searchParams]);
	const activeGroupTab = useMemo(() => searchParams.get('tab') || 'all', [searchParams]);
	const filters = useMemo<FilterConfig>(
		() => ({
			searchTerm: q || '',
			status: (status?.split(',') || []).filter(Boolean),
			priority: (priority?.split(',') || []).filter(Boolean),
		}),
		[q, status, priority],
	);
	const sortConfig = useMemo<SortConfig<string> | null>(() => {
		const sortParam = sort;
		if (!sortParam) return { key: 'updatedAt', direction: 'desc' }; // Default sort
		if (sortParam === 'default') return null;

		const [key, direction] = sortParam.split('-');
		return { key, direction: direction as 'asc' | 'desc' };
	}, [sort]);
  const calendarDateProp = useMemo(() => (calDate || 'dueDate') as CalendarDateProp<string>, [calDate]);
  const calendarDisplayProps = useMemo(
    () => {
      if (calDisplay === null) return []; // Default is now nothing
      if (calDisplay === '') return []; // Explicitly empty is also nothing
      return calDisplay.split(',') as CalendarDisplayProp<string>[];
    },
    [calDisplay]
  );
  const calendarItemLimit = useMemo(() => {
    const limit = parseInt(calLimit || '3', 10);
    if (calLimit === 'all') return 'all';
    return isNaN(limit) ? 3 : limit;
  }, [calLimit]);
  const calendarColorProp = useMemo(() => (calColor || 'none') as CalendarColorProp<string>, [calColor]);

  // --- MUTATOR ACTIONS ---

  const handleParamsChange = useCallback(
		(newParams: Record<string, string | number | string[] | null | undefined>, resetPage = false) => {
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

  const navigateTo = useCallback((page: string, params?: Record<string, string | null>) => {
    const targetPath = page.startsWith('/') ? page : `/${page}`;
    const isSamePage = location.pathname === targetPath;
    
    const newSearchParams = new URLSearchParams(isSamePage ? searchParams : undefined);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === undefined) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      }
    }

    navigate({ pathname: targetPath, search: newSearchParams.toString() });
  }, [navigate, location.pathname, searchParams]);

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
  const setViewMode = (mode: ViewMode) => handleParamsChange({ dataView: mode === 'list' ? null : mode });
  const setGroupBy = (val: string) => handleParamsChange({ groupBy: val === 'none' ? null : val }, true);
  const setActiveGroupTab = (tab: string) => handleParamsChange({ tab: tab === 'all' ? null : tab });
  const setFilters = (newFilters: FilterConfig) => {
    handleParamsChange({ q: newFilters.searchTerm, status: newFilters.status, priority: newFilters.priority }, true);
  }
  const setSort = (config: SortConfig<string> | null) => {
    if (!config) {
      handleParamsChange({ sort: null }, true);
    } else {
      handleParamsChange({ sort: `${config.key}-${config.direction}` }, true);
    }
  }
  const setTableSort = (field: string) => {
    let newSort: string | null = `${field}-desc`;
    if (sortConfig && sortConfig.key === field) {
      if (sortConfig.direction === 'desc') newSort = `${field}-asc`;
      else if (sortConfig.direction === 'asc') newSort = null;
    }
    handleParamsChange({ sort: newSort }, true);
  };
  const setPage = (newPage: number) => handleParamsChange({ page: newPage > 1 ? newPage.toString() : null });

  // Calendar specific actions
  const setCalendarDateProp = (prop: CalendarDateProp<string>) => handleParamsChange({ calDate: prop === 'dueDate' ? null : prop });
  const setCalendarDisplayProps = (props: CalendarDisplayProp<string>[]) => {
    // Check for default state to keep URL clean
    const isDefault = props.length === 0;
    handleParamsChange({ calDisplay: isDefault ? null : props.join(',') });
  };
  const setCalendarItemLimit = (limit: number | 'all') => handleParamsChange({ calLimit: limit === 3 ? null : String(limit) });
  const setCalendarColorProp = (prop: CalendarColorProp<string>) => handleParamsChange({ calColor: prop === 'none' ? null : prop });

  const onItemSelect = useCallback((item: GenericItem) => {
		navigate(`/data-demo/${item.id}${location.search}`);
	}, [navigate, location.search]);

  const setMessagingView = (view: TaskView) => handleParamsChange({ messagingView: view });


  return useMemo(() => ({
    // State
    bodyState,
    sidePaneContent,
    currentActivePage,
    itemId,
    messagingView,
    // DataDemo State
    viewMode,
    page,
    groupBy,
    activeGroupTab,
    filters,
    sortConfig,
    calendarDateProp,
    calendarDisplayProps,
    calendarItemLimit,
    calendarColorProp,
    // Actions
    navigateTo,
    openSidePane,
    closeSidePane,
    toggleSidePane,
    toggleSplitView,
    setNormalView,
    switchSplitPanes,
    setMessagingView,
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
    setCalendarDateProp,
    setCalendarDisplayProps,
    setCalendarItemLimit,
    setCalendarColorProp,
  }), [
    bodyState, sidePaneContent, currentActivePage, itemId, messagingView, viewMode,
    page, groupBy, activeGroupTab, filters, sortConfig, calendarDateProp,
    calendarDisplayProps, calendarItemLimit, calendarColorProp,
    navigateTo, openSidePane, closeSidePane, toggleSidePane, toggleSplitView, setNormalView, setMessagingView,
    switchSplitPanes, closeSplitPane, onItemSelect, setViewMode, setGroupBy, setActiveGroupTab, setFilters,
    setSort, setTableSort, setPage, setCalendarDateProp, setCalendarDisplayProps, setCalendarItemLimit, setCalendarColorProp
  ]);
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
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

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

// Breadcrumbs for the Top Bar
function AppBreadcrumbs() {
  const { currentActivePage } = useAppViewManager();
  const activePageName = currentActivePage.replace('-', ' ');

  return (
    <div className="hidden md:flex items-center gap-2 text-sm">
      <a
        href="#"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Home
      </a>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
      <span className="font-medium text-foreground capitalize">
        {activePageName}
      </span>
    </div>
  );
}

// Page-specific controls for the Top Bar
function TopBarPageControls() {
  const { currentActivePage, filters, setFilters } = useAppViewManager();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  if (currentActivePage === 'dashboard') {
    return (
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
            placeholder="Search dashboard..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="pl-9 pr-4 py-2 h-10 border-none rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ease-in-out w-full"
          />
        </div>
        <Button variant="ghost" size="icon" className="flex-shrink-0">
          <Filter className="w-5 h-5" />
        </Button>
        <Button className="flex-shrink-0">
          <Plus className="w-5 h-5 mr-0 sm:mr-2" />
          <span className={cn(isSearchFocused ? "hidden sm:inline" : "inline")}>
            New Project
          </span>
        </Button>
      </div>
    );
  }

  if (currentActivePage === 'data-demo') {
    return (
      <div className="flex items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search items..."
            className="pl-9 bg-card border-none"
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Item
        </Button>
      </div>
    );
  }

  return null;
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
        <TopBar breadcrumbs={<AppBreadcrumbs />} pageControls={<TopBarPageControls />} />
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

import { dataDemoViewConfig } from "./DataDemo.config";
import type { StatItem } from "@/features/dynamic-view/types";

export default function DataDemoPage() {
  const {
    viewMode,
    groupBy,
    activeGroupTab,
    setGroupBy,
    setSort,
    setActiveGroupTab,
    page,
    filters,
    sortConfig,
    setPage,
    setFilters,
    setViewMode,
    onItemSelect,
  } = useAppViewManager();

  const {
    items: allItems,
    hasMore,
    isLoading,
    isInitialLoading,
    totalItemCount,
    loadData,
    updateItem,
  } = useDataDemoStore((state) => ({
    items: state.items,
    hasMore: state.hasMore,
    isLoading: state.isLoading,
    isInitialLoading: state.isInitialLoading,
    totalItemCount: state.totalItemCount,
    loadData: state.loadData,
    updateItem: state.updateItem,
  }));

  const scrollRef = useRef<HTMLDivElement>(null);

  // Note: The `DynamicViewProvider` needs `GenericItem[]`.
  // Our store uses `GenericItem` so no cast is needed.

  // Calculate stats from data
  const totalItems = mockDataItems.length;
  const { showScrollToBottom, scrollToBottom, handleScroll } =
    useScrollToBottom(scrollRef);

  const activeItems = mockDataItems.filter(
    (item) => item.status === "active",
  ).length;
  const highPriorityItems = mockDataItems.filter(
    (item) => item.priority === "high" || item.priority === "critical",
  ).length;
  const avgCompletion =
    totalItems > 0
      ? Math.round(
          mockDataItems.reduce(
            (acc, item) => acc + item.metrics.completion,
            0,
          ) / totalItems,
        )
      : 0;

  const stats: StatItem[] = [
    {
      title: "Total Projects",
      value: totalItems.toString(),
      icon: <Layers className="w-5 h-5" />,
      change: "+5.2% this month",
      trend: "up" as const,
      chartData: [120, 125, 122, 130, 135, 138, 142],
    },
    {
      title: "Active Projects",
      value: activeItems.toString(),
      icon: <PlayCircle className="w-5 h-5" />,
      change: "+2 this week",
      trend: "up" as const,
      chartData: [45, 50, 48, 55, 53, 60, 58],
    },
    {
      title: "High Priority",
      value: highPriorityItems.toString(),
      icon: <AlertTriangle className="w-5 h-5" />,
      change: "-1 from last week",
      trend: "down" as const,
      chartData: [25, 26, 28, 27, 26, 24, 23],
    },
    {
      title: "Avg. Completion",
      value: `${avgCompletion}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      change: "+3.2%",
      trend: "up" as const,
      chartData: [65, 68, 70, 69, 72, 75, 78],
    },
    {
      title: "Completion Rate",
      value: "88%",
      icon: <CheckCircle className="w-5 h-5" />,
      change: "+1.5% this month",
      trend: "up" as const,
      chartData: [80, 82, 81, 84, 85, 87, 88],
    },
    {
      title: "Overdue Items",
      value: "8",
      icon: <Clock className="w-5 h-5" />,
      change: "-3 this week",
      trend: "down" as const,
    },
    {
      title: "New This Week",
      value: "12",
      icon: <PlusCircle className="w-5 h-5" />,
      change: "+2 from last week",
      trend: "up" as const,
    },
    {
      title: "Archived Projects",
      value: "153",
      icon: <Archive className="w-5 h-5" />,
      change: "+20 this month",
      trend: "up" as const,
    },
  ];

  useEffect(() => {
    loadData({
      page,
      groupBy,
      filters,
      sortConfig,
      isFullLoad: viewMode === "calendar" || viewMode === "kanban",
    });
  }, [page, groupBy, filters, sortConfig, loadData, viewMode]);

  const observer = useRef<IntersectionObserver>();
  const loaderRef = useCallback(
    (node: Element | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, page, setPage],
  );

  useEffect(() => {
    // Auto-group by status when switching to kanban view for the first time
    if (viewMode === "kanban" && groupBy === "none") {
      setGroupBy("status");
      setSort(null); // Kanban is manually sorted, so disable programmatic sort
    }
    // For calendar view, we don't want grouping.
    else if (viewMode === "calendar" && groupBy !== "none") {
      setGroupBy("none");
    }
  }, [viewMode, groupBy, setGroupBy, setSort]);

  return (
    <PageLayout scrollRef={scrollRef} onScroll={handleScroll}>
      <DynamicView
        viewConfig={dataDemoViewConfig}
        items={allItems}
        isLoading={isLoading}
        isInitialLoading={isInitialLoading}
        totalItemCount={totalItemCount}
        hasMore={hasMore}
        // Controlled state
        viewMode={viewMode}
        filters={filters}
        sortConfig={sortConfig}
        groupBy={groupBy}
        activeGroupTab={activeGroupTab}
        page={page}
        // Callbacks
        onViewModeChange={setViewMode}
        onFiltersChange={setFilters}
        onSortChange={setSort}
        onGroupByChange={setGroupBy}
        onActiveGroupTabChange={setActiveGroupTab}
        onPageChange={setPage}
        onItemUpdate={updateItem}
        onItemSelect={onItemSelect}
        loaderRef={loaderRef}
        scrollContainerRef={scrollRef}
        statsData={stats}
        // Custom Renderers
        renderCta={(viewMode, ctaProps) => (
          <AddDataItemCta viewMode={viewMode} colSpan={ctaProps.colSpan} />
        )}
      />

      <ScrollToBottomButton
        isVisible={showScrollToBottom}
        onClick={scrollToBottom}
      />
    </PageLayout>
  );
}
```
