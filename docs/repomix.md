# Directory Structure
```
src/
  components/
    ui/
      avatar.tsx
      badge.tsx
      button.tsx
      card.tsx
      command.tsx
      dialog.tsx
      dropdown-menu.tsx
      popover.tsx
      tabs.tsx
      toast.tsx
    AppShell.tsx
    CommandPalette.tsx
    ContentInSidePanePlaceholder.tsx
    DashboardContent.tsx
    DemoContent.tsx
    EnhancedSidebar.tsx
    index.ts
    MainContent.tsx
    NotificationsPage.tsx
    PageHeader.tsx
    RightPane.tsx
    SettingsContent.tsx
    SettingsPage.tsx
    SettingsSection.tsx
    SettingsToggle.tsx
    Sidebar.tsx
    ToasterDemo.tsx
    TopBar.tsx
    UserDropdown.tsx
    WorkspaceSwitcher.tsx
  hooks/
    useAutoAnimateTopBar.ts
  lib/
    utils.ts
  store/
    appStore.ts
  App.tsx
  index.css
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

## File: src/components/NotificationsPage.tsx
```typescript
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "./PageHeader";
import { useToast } from "./ui/toast";
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


type Notification = {
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
  {
    id: 1,
    type: "comment",
    user: { name: "Amélie", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Amélie", fallback: "A" },
    action: "commented in",
    target: "Dashboard 2.0",
    content: "Really love this approach. I think this is the best solution for the document sync UX issue.",
    timestamp: "Friday 3:12 PM",
    timeAgo: "2 hours ago",
    isRead: false,
  },
  {
    id: 2,
    type: "follow",
    user: { name: "Sienna", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sienna", fallback: "S" },
    action: "followed you",
    timestamp: "Friday 3:04 PM",
    timeAgo: "2 hours ago",
    isRead: false,
  },
  {
    id: 3,
    type: "invitation",
    user: { name: "Ammar", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Ammar", fallback: "A" },
    action: "invited you to",
    target: "Blog design",
    timestamp: "Friday 2:22 PM",
    timeAgo: "3 hours ago",
    isRead: true,
    hasActions: true,
  },
  {
    id: 4,
    type: "file_share",
    user: { name: "Mathilde", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Mathilde", fallback: "M" },
    action: "shared a file in",
    target: "Dashboard 2.0",
    file: { name: "Prototype recording 01.mp4", size: "14 MB", type: "MP4" },
    timestamp: "Friday 1:40 PM",
    timeAgo: "4 hours ago",
    isRead: true,
  },
  {
    id: 5,
    type: "mention",
    user: { name: "James", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=James", fallback: "J" },
    action: "mentioned you in",
    target: "Project Alpha",
    content: "Hey @you, can you review the latest designs when you get a chance?",
    timestamp: "Thursday 11:30 AM",
    timeAgo: "1 day ago",
    isRead: true,
  },
  {
    id: 6,
    type: "like",
    user: { name: "Sofia", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sofia", fallback: "S" },
    action: "liked your comment in",
    target: "Team Meeting Notes",
    timestamp: "Thursday 9:15 AM",
    timeAgo: "1 day ago",
    isRead: true,
  },
  {
    id: 7,
    type: "task_assignment",
    user: { name: "Admin", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Admin", fallback: "AD" },
    action: "assigned you a new task in",
    target: "Q3 Marketing",
    content: "Finalize the social media campaign assets.",
    timestamp: "Wednesday 5:00 PM",
    timeAgo: "2 days ago",
    isRead: true,
  },
  {
    id: 8,
    type: "system_update",
    user: { name: "System", avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=System", fallback: "SYS" },
    action: "pushed a new update",
    content: "Version 2.1.0 is now live with improved performance and new features. Check out the release notes for more details.",
    timestamp: "Wednesday 9:00 AM",
    timeAgo: "2 days ago",
    isRead: true,
  },
  {
    id: 9,
    type: 'comment',
    user: { name: 'Elena', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Elena', fallback: 'E' },
    action: 'replied to your comment in',
    target: 'Dashboard 2.0',
    content: 'Thanks for the feedback! I\'ve updated the prototype.',
    timestamp: 'Tuesday 4:30 PM',
    timeAgo: '3 days ago',
    isRead: false,
  },
  {
    id: 10,
    type: 'invitation',
    user: { name: 'Carlos', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Carlos', fallback: 'C' },
    action: 'invited you to',
    target: 'API Integration',
    timestamp: 'Tuesday 10:00 AM',
    timeAgo: '3 days ago',
    isRead: true,
    hasActions: true,
  },
];

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

function NotificationItem({ notification, onMarkAsRead }: { notification: Notification; onMarkAsRead: (id: number) => void }) {
  const Icon = iconMap[notification.type];

  return (
    <div className="group w-full -mx-4 px-4 py-4 rounded-xl hover:bg-accent/50 transition-colors duration-200">
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
              onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
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

export function NotificationsPage({ isInSidePane = false }: { isInSidePane?: boolean }) {
  const [notifications, setNotifications] = React.useState<Notification[]>(initialNotifications);
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const { show } = useToast();

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    if (unreadCount === 0) {
      show({
        title: "Already up to date!",
        message: "You have no unread notifications.",
        variant: "default",
      });
      return;
    }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    show({
        title: "All Caught Up!",
        message: "All notifications have been marked as read.",
        variant: "success",
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const verifiedNotifications = notifications.filter((n) => n.type === "follow" || n.type === "like");
  const mentionNotifications = notifications.filter((n) => n.type === "mention");

  const verifiedCount = verifiedNotifications.filter(n => !n.isRead).length;
  const mentionCount = mentionNotifications.filter(n => !n.isRead).length;

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case "verified": return verifiedNotifications;
      case "mentions": return mentionNotifications;
      default: return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();

  const content = (
    <Card className={cn("flex w-full flex-col shadow-none", isInSidePane ? "border-none" : "p-6 lg:p-8")}>
      <CardHeader className="p-0">
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-col justify-start mt-4">
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

      <CardContent className="h-full p-0 mt-6">
        <div className="space-y-0 divide-y divide-border">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />
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
    <div className={cn("overflow-y-auto", !isInSidePane ? "h-full p-6 lg:px-12 space-y-8" : "h-full")}>
      {!isInSidePane && (
        <PageHeader
          title="Notifications"
          description="Manage your notifications and stay up-to-date."
        />
      )}
      {content}
    </div>
  );
};
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

export { Button, buttonVariants }
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

## File: src/components/CommandPalette.tsx
```typescript
import * as React from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { useAppStore, type ActivePage } from '@/store/appStore'
import { Home, Settings, Moon, Sun, Monitor, Smartphone, PanelRight, Maximize, Component, Bell } from 'lucide-react'

export function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setActivePage,
    toggleDarkMode,
    isDarkMode,
    setCompactMode,
    toggleFullscreen,
    openSidePane,
  } = useAppStore()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandPaletteOpen(!isCommandPaletteOpen)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [isCommandPaletteOpen, setCommandPaletteOpen])
  
  const runCommand = (command: () => void) => {
    setCommandPaletteOpen(false)
    command()
  }

  return (
    <CommandDialog open={isCommandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => setActivePage('dashboard'))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Go to Dashboard</span>
            <CommandShortcut>G D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActivePage('settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Go to Settings</span>
            <CommandShortcut>G S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActivePage('toaster'))}>
            <Component className="mr-2 h-4 w-4" />
            <span>Go to Toaster Demo</span>
            <CommandShortcut>G T</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActivePage('notifications' as ActivePage))}>
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
          <CommandItem onSelect={() => runCommand(() => openSidePane('settings'))}>
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

## File: src/components/ContentInSidePanePlaceholder.tsx
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

## File: src/components/PageHeader.tsx
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

## File: src/components/SettingsSection.tsx
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

## File: src/components/SettingsToggle.tsx
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

## File: src/components/UserDropdown.tsx
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

export const UserDropdown = ({ 
  user = {
    name: "Ayman Echakar",
    username: "@aymanch-03",
    avatar: "https://avatars.githubusercontent.com/u/126724835?v=4",
    initials: "AE",
    status: "online"
  },
  onAction = (_action?: string) => {},
  onStatusChange = () => {},
  selectedStatus = "online",
  promoDiscount = "20% off",
}) => {
  const renderMenuItem = (item: MenuItem, index: number) => (
    <DropdownMenuItem 
      key={index}
      className={cn(
        "px-3 py-2", // Consistent with base component
        item.badge || item.showAvatar || item.rightIcon ? "justify-between" : ""
      )}
      onClick={() => item.action && onAction(item.action)}
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

## File: src/lib/utils.ts
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
  SIDE_PANE: 'side_pane'
} as const

export type SidebarState = typeof SIDEBAR_STATES[keyof typeof SIDEBAR_STATES]
export type BodyState = typeof BODY_STATES[keyof typeof BODY_STATES]
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
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
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

## File: src/hooks/useAutoAnimateTopBar.ts
```typescript
import { useRef, useCallback, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';

export function useAutoAnimateTopBar(isPane = false) {
  const setTopBarVisible = useAppStore((state) => state.setTopBarVisible);
  const lastScrollTop = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (isPane) return;

    // Clear previous timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    const { scrollTop } = event.currentTarget;
    
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
  }, [isPane, setTopBarVisible]);

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

## File: src/App.tsx
```typescript
import { AppShell } from './components/AppShell'
import './index.css'

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <AppShell />
    </div>
  )
}

export default App
```

## File: src/main.tsx
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ToasterProvider } from './components/ui/toast'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToasterProvider>
      <App />
    </ToasterProvider>
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
    <title>Amazing App Shell</title>
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
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
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
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
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
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

## File: vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

## File: src/components/index.ts
```typescript
export { AppShell } from './AppShell'
export { TopBar } from './TopBar'
export { MainContent } from './MainContent'
export { RightPane } from './RightPane'
```

## File: src/components/Sidebar.tsx
```typescript
import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';
import { useAppStore } from '@/store/appStore';
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
    const { sidebarState, compactMode } = useAppStore();
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
        'h-full w-8 rounded-l-none opacity-0 group-hover/item:opacity-100 transition-opacity',
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

## File: src/components/ToasterDemo.tsx
```typescript
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { PageHeader } from '@/components/PageHeader';
import { cn } from '@/lib/utils';

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

export function ToasterDemo({ isInSidePane = false }: { isInSidePane?: boolean }) {
  const toast = useToast();

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
    <div className={cn("overflow-y-auto p-6 lg:px-12 space-y-8", !isInSidePane && "h-full")}>
      {/* Header */}
      <PageHeader
        title="Toaster"
        description="A customizable toast component for notifications."
      />
      <div className="space-y-6">
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
      </div>
    </div>
  );
}
```

## File: src/components/WorkspaceSwitcher.tsx
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
	[key: string]: any; // Allow additional properties
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
							src={(selectedWorkspace as any).logo}
							alt={getWorkspaceName(selectedWorkspace)}
						/>
						<AvatarFallback className="text-xs">
							{getWorkspaceName(selectedWorkspace).charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					{!collapsed && (
						<div className="flex min-w-0 flex-1 flex-col items-start">
							<span className="truncate font-medium">{getWorkspaceName(selectedWorkspace)}</span>
							<span className="text-muted-foreground truncate text-xs">{(selectedWorkspace as any).plan}</span>
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
					src={(workspace as any).logo}
					alt={getWorkspaceName(workspace)}
				/>
				<AvatarFallback className="text-xs">
					{getWorkspaceName(workspace).charAt(0).toUpperCase()}
				</AvatarFallback>
			</Avatar>
			<div className="flex min-w-0 flex-1 flex-col items-start">
				<span className="truncate text-sm">{getWorkspaceName(workspace)}</span>
				{(workspace as any).plan && (
					<span className="text-muted-foreground text-xs">
						{(workspace as any).plan}
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

## File: src/components/DemoContent.tsx
```typescript
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
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
import { useAppStore } from '@/store/appStore'
import { Card } from '@/components/ui/card'

export function DemoContent() {
  const { bodyState, sidebarState, isDarkMode, compactMode } = useAppStore()
  const contentRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!contentRef.current) return

    const cards = cardsRef.current.filter(Boolean)
    
    // Animate cards on mount
    gsap.fromTo(cards, 
      { y: 30, opacity: 0, scale: 0.95 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out"
      }
    )
  }, [])

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
    <div ref={contentRef} className="p-8 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Rocket className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Amazing App Shell
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A super amazing application shell with resizable sidebar, multiple body states, 
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card
            key={feature.title}
            ref={el => cardsRef.current[index] = el}
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
}
```

## File: src/components/SettingsContent.tsx
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
import { useAppStore } from '@/store/appStore'
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
  const {
    isDarkMode,
    reducedMotion,
    compactMode,
    autoExpandSidebar,
    sidebarWidth,
    primaryColor,
    toggleDarkMode,
    setReducedMotion,
    setCompactMode,
    setAutoExpandSidebar,
    setPrimaryColor,
    setSidebarWidth,
    resetToDefaults
  } = useAppStore()

  const [tempSidebarWidth, setTempSidebarWidth] = useState(sidebarWidth)

  const handleSidebarWidthChange = (width: number) => {
    setTempSidebarWidth(width)
    setSidebarWidth(width)
  }

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
              setSidebarWidth(320)
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
              setSidebarWidth(240)
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
          onClick={resetToDefaults}
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

## File: src/components/DashboardContent.tsx
```typescript
import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
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
  MoreVertical,
  ArrowDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DemoContent } from './DemoContent';
import { useAppStore } from '@/store/appStore';
import { BODY_STATES } from '@/lib/utils';
import { useAutoAnimateTopBar } from '@/hooks/useAutoAnimateTopBar';
import { PageHeader } from './PageHeader';
import { Card } from '@/components/ui/card';

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

interface DashboardContentProps {
  isInSidePane?: boolean;
}

export function DashboardContent({ isInSidePane = false }: DashboardContentProps) {
    const contentRef = useRef<HTMLDivElement>(null)
    const cardsRef = useRef<(HTMLDivElement | null)[]>([])
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const { bodyState } = useAppStore();
    const { onScroll: handleTopBarScroll } = useAutoAnimateTopBar(isInSidePane);

    const scrollToBottom = () => {
      contentRef.current?.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      handleTopBarScroll(e);
      if (!contentRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      // Show if scrolled down and not at the bottom
      setShowScrollToBottom(scrollTop > 200 && scrollTop < scrollHeight - clientHeight - 200);
    };

    // Animate content based on body state
    useEffect(() => {
      if (!contentRef.current) return

      const content = contentRef.current
      const cards = cardsRef.current.filter(Boolean)

      switch (bodyState) {
        case BODY_STATES.FULLSCREEN:
          gsap.to(content, {
            scale: 1.02,
            duration: 0.4,
            ease: "power3.out"
          })
          break
        default:
          gsap.to(content, {
            scale: 1,
            duration: 0.4,
            ease: "power3.out"
          })
          break
      }

      // Stagger animation for cards
      gsap.fromTo(cards, 
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out"
        }
      )

    }, [bodyState])

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
        <div 
          ref={contentRef}
          className="h-full overflow-y-auto space-y-8 p-6 lg:px-12"
          onScroll={handleScroll}
        >
          {/* Header */}
          <PageHeader
            title="Dashboard"
            description="Welcome to the amazing app shell demo! Explore all the features and customization options."
          />
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => (
                <Card
                key={stat.title}
                ref={el => cardsRef.current[index] = el}
                className="p-6 border-border/50 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    {stat.icon}
                  </div>
                  <div className={cn(
                    "text-sm font-medium",
                    stat.trend === 'up' ? "text-green-600" : "text-red-600"
                  )}>
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                </div>
              </Card>
              ))}
            </div>

            {/* Demo Content */}
            <DemoContent />

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
          {showScrollToBottom && (
            <button
              onClick={scrollToBottom}
              className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all animate-fade-in z-[51]"
              style={{ animation: 'bounce 2s infinite' }}
              title="Scroll to bottom"
            >
              <ArrowDown className="w-6 h-6" />
            </button>
          )}
      </div>
    )
}
```

## File: src/components/SettingsPage.tsx
```typescript
import { SettingsContent } from './SettingsContent';
import { useAutoAnimateTopBar } from '@/hooks/useAutoAnimateTopBar';
import { PageHeader } from './PageHeader';

export function SettingsPage() {
  const { onScroll } = useAutoAnimateTopBar();

  return (
    <div
      className="h-full overflow-y-auto p-6 lg:px-12 space-y-8"
      onScroll={onScroll}
    >
      {/* Header */}
      <PageHeader
        title="Settings"
        description="Customize your experience. Changes are saved automatically."
      />
      <SettingsContent />
    </div>
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
```

## File: src/components/RightPane.tsx
```typescript
import { forwardRef } from 'react'
import { SlidersHorizontal, Settings, ChevronRight, LayoutDashboard, ChevronsLeftRight, Component, Bell } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'
import { SettingsContent } from './SettingsContent'
import { DashboardContent } from './DashboardContent'
import { ToasterDemo } from './ToasterDemo'
import { NotificationsPage } from './NotificationsPage'

export const RightPane = forwardRef<HTMLDivElement>((_props, ref) => {
  const { closeSidePane, setIsResizingRightPane, sidePaneContent, setActivePage } = useAppStore();

  const contentMap = {
    main: { title: 'Dashboard', icon: LayoutDashboard, page: 'dashboard', content: <DashboardContent isInSidePane={true} /> },
    settings: { title: 'Settings', icon: Settings, page: 'settings', content: <SettingsContent /> },
    toaster: { title: 'Toaster Demo', icon: Component, page: 'toaster', content: <ToasterDemo isInSidePane={true} /> },
    notifications: { title: 'Notifications', icon: Bell, page: 'notifications', content: <NotificationsPage isInSidePane={true} /> },
    details: { title: 'Details Panel', icon: SlidersHorizontal, content: <p className="text-muted-foreground">This is the side pane. It can be used to display contextual information, forms, or actions related to the main content.</p> }
  } as const;

  const currentContent = contentMap[sidePaneContent as keyof typeof contentMap] || contentMap.details;
  const CurrentIcon = currentContent.icon;

  const handleMaximize = () => {
    if ('page' in currentContent && currentContent.page) {
      setActivePage(currentContent.page);
    }
    closeSidePane()
  }

  return (
    <aside ref={ref} className="bg-card border-l border-border flex flex-col h-full overflow-hidden fixed top-0 right-0 z-[60]">
      <button
        onClick={closeSidePane}
        className="absolute top-1/2 -left-px -translate-y-1/2 -translate-x-full w-8 h-16 bg-card border border-r-0 border-border rounded-l-lg flex items-center justify-center hover:bg-accent transition-colors group z-10"
        title="Close pane"
      >
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
      </button>
      <div 
        className={cn(
          "absolute top-0 left-0 w-2 h-full bg-transparent hover:bg-primary/20 cursor-col-resize z-50 transition-colors duration-200 group -translate-x-1/2"
        )}
        onMouseDown={(e) => {
          e.preventDefault()
          setIsResizingRightPane(true)
        }}
      >
        <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200 mx-auto" />
      </div>
      <div className="flex items-center justify-between p-4 border-b border-border h-20 flex-shrink-0 pl-6">
        <div className="flex items-center gap-2">
          <CurrentIcon className="w-5 h-5" />
          <h2 className="text-lg font-semibold whitespace-nowrap">
            {currentContent.title}
          </h2>
        </div>
        
        {'page' in currentContent && currentContent.page && (
          <button
            onClick={handleMaximize}
            className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors mr-2"
            title="Move to Main View"
          >
            <ChevronsLeftRight className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {currentContent.content}
      </div>
    </aside>
  )
})

RightPane.displayName = "RightPane"
```

## File: package.json
```json
{
  "name": "amazing-app-shell",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "gsap": "^3.12.2",
    "zustand": "^4.4.7",
    "lucide-react": "^0.294.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "class-variance-authority": "^0.7.0",
    "@radix-ui/react-slot": "^1.0.2",
    "sonner": "^1.2.4",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-dialog": "^1.0.5",
    "cmdk": "^0.2.0",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@iconify/react": "^4.1.1",
    "@radix-ui/react-tabs": "^1.0.4"
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
    "typescript": "^5.2.2",
    "vite": "^4.5.0",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

## File: src/components/AppShell.tsx
```typescript
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { EnhancedSidebar } from './EnhancedSidebar'
import { MainContent } from './MainContent'
import { RightPane } from './RightPane'
import { TopBar } from './TopBar'
import { CommandPalette } from './CommandPalette'
import { useAppStore } from '@/store/appStore'
import { SIDEBAR_STATES, BODY_STATES } from '@/lib/utils'

export function AppShell() {
  const {
    sidebarState,
    bodyState,
    sidebarWidth,
    isDarkMode,
    isResizing,
    rightPaneWidth,
    isResizingRightPane,
    setRightPaneWidth,
    isTopBarVisible,
    setSidebarState,
    closeSidePane,
    setIsResizing,
    setSidebarWidth,
    toggleSidebar,
    peekSidebar,
    toggleFullscreen,
    setIsResizingRightPane,
    toggleDarkMode,
    reducedMotion,
    autoExpandSidebar,
    primaryColor
  } = useAppStore()
  
  const appRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const rightPaneRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const topBarContainerRef = useRef<HTMLDivElement>(null)

  // Animation duration based on reduced motion preference
  const animationDuration = reducedMotion ? 0.1 : 0.4

  // Set primary color
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-hsl', primaryColor)
  }, [primaryColor])

  // Resize functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const newWidth = Math.max(200, Math.min(500, e.clientX))
      setSidebarWidth(newWidth)
      
      if (sidebarRef.current) {
        gsap.set(sidebarRef.current, { width: newWidth })
      }
      if (resizeHandleRef.current) {
        gsap.set(resizeHandleRef.current, { left: newWidth })
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    if (isResizing) {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, setIsResizing, setSidebarWidth])

  // Resize functionality for Right Pane
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRightPane) return
      
      const newWidth = window.innerWidth - e.clientX
      setRightPaneWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizingRightPane(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    if (isResizingRightPane) {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
    }
  }, [isResizingRightPane, setIsResizingRightPane, setRightPaneWidth])

  // GSAP animations for sidebar transitions
  useEffect(() => {
    if (!sidebarRef.current || !mainContentRef.current || !resizeHandleRef.current) return

    const sidebar = sidebarRef.current
    const handle = resizeHandleRef.current
    
    let targetWidth = 0
    let targetOpacity = 1

    if (bodyState === BODY_STATES.FULLSCREEN) {
      targetWidth = 0;
      targetOpacity = 0;
    } else {
      switch (sidebarState) {
        case SIDEBAR_STATES.HIDDEN:
          targetWidth = 0
          targetOpacity = 0
          break
        case SIDEBAR_STATES.COLLAPSED:
          targetWidth = 64
          targetOpacity = 1
          break
        case SIDEBAR_STATES.EXPANDED:
          targetWidth = sidebarWidth
          targetOpacity = 1
          break
        case SIDEBAR_STATES.PEEK:
          targetWidth = sidebarWidth * 0.8
          targetOpacity = 0.95
          break
      }
    }

    const tl = gsap.timeline({ ease: "power3.out" })
    
    tl.to(sidebar, {
      width: targetWidth,
      opacity: targetOpacity,
      duration: animationDuration,
    })
    tl.to(handle, {
      left: targetWidth,
      duration: animationDuration,
    }, 0)

  }, [sidebarState, sidebarWidth, bodyState, animationDuration])

  // GSAP animations for body state transitions
  useEffect(() => {
    if (!mainContentRef.current || !sidebarRef.current || !rightPaneRef.current) return

    const ease = "power3.out"
    const isFullscreen = bodyState === BODY_STATES.FULLSCREEN

    const isSidePane = bodyState === BODY_STATES.SIDE_PANE

    // Right pane animation
    gsap.to(rightPaneRef.current, {
      width: rightPaneWidth,
      x: isSidePane ? 0 : rightPaneWidth + 5, // +5 to hide border
      duration: animationDuration,
      ease,
    })

    gsap.to(mainContentRef.current, {
      paddingTop: isFullscreen ? '0rem' : isTopBarVisible ? '5rem' : '0rem', // h-20 is 5rem
      duration: animationDuration,
      ease,
    })

    gsap.to(topBarContainerRef.current, {
      y: (isFullscreen || !isTopBarVisible) ? '-100%' : '0%',
      duration: animationDuration,
      ease,
    })
    
    // Add backdrop for side pane
    const backdrop = document.querySelector('.app-backdrop')
    if (isSidePane) {
      if (!backdrop) {
        const el = document.createElement('div')
        el.className = 'app-backdrop fixed inset-0 bg-black/30 z-[55]'
        appRef.current?.appendChild(el)
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: animationDuration })
        el.onclick = () => closeSidePane()
      }
    } else {
      if (backdrop) {
        gsap.to(backdrop, { opacity: 0, duration: animationDuration, onComplete: () => backdrop.remove() })
      }
    }
  }, [bodyState, animationDuration, rightPaneWidth, closeSidePane, isTopBarVisible])

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
        <EnhancedSidebar
          ref={sidebarRef}
          onMouseEnter={() => {
            if (autoExpandSidebar && sidebarState === SIDEBAR_STATES.COLLAPSED) {
              peekSidebar()
            }
          }}
          onMouseLeave={() => {
            if (autoExpandSidebar && sidebarState === SIDEBAR_STATES.PEEK) {
              setSidebarState(SIDEBAR_STATES.COLLAPSED)
            }
          }}
        />

        {/* Resize Handle */}
        {sidebarState !== SIDEBAR_STATES.HIDDEN && (
          <div
            ref={resizeHandleRef}
            className={cn(
              "absolute top-0 w-2 h-full bg-transparent hover:bg-primary/20 cursor-col-resize z-50 transition-colors duration-200 group -translate-x-1/2"
            )}
            onMouseDown={(e) => {
              e.preventDefault()
              setIsResizing(true)
            }}
          >
            <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200 mx-auto" />
          </div>
        )}

        {/* Main Content Area */}
        <div className="relative flex-1 overflow-hidden bg-background">
          <div ref={topBarContainerRef} className="absolute inset-x-0 top-0 z-30">
            <TopBar
              onToggleSidebar={toggleSidebar}
              onToggleFullscreen={toggleFullscreen}
              onToggleDarkMode={toggleDarkMode}
            />
          </div>
          
          {/* Main Content */}
          <MainContent
            ref={mainContentRef}
            bodyState={bodyState}
            onToggleFullscreen={toggleFullscreen}
          />
        </div>
      </div>
      <RightPane ref={rightPaneRef} />
      <CommandPalette />
    </div>
  )
}
```

## File: src/components/EnhancedSidebar.tsx
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
  Plus
} from 'lucide-react';
import { useAppStore, type ActivePage } from '@/store/appStore';
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
import { cn } from '@/lib/utils';

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

interface SidebarProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const EnhancedSidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ onMouseEnter, onMouseLeave }, ref) => {
    const { sidebarWidth, compactMode } = useAppStore();
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
            <div className="p-2 bg-primary/20 rounded-lg">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            <SidebarTitle>Amazing App</SidebarTitle>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection title="Main">
              <AppMenuItem icon={Home} label="Dashboard" page="dashboard" />
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
                onWorkspaceChange={setSelectedWorkspace}
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
);
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
  const { handleNavigation, isPageActive, openSidePane } = useAppStore();
  const isActive = page ? isPageActive(page) : false;
  const { compactMode } = useAppStore();
  const { isCollapsed } = useSidebar();

  const handleClick = () => {
    if (page) {
      if (opensInSidePane) {
        const pageToPaneMap: { [key in ActivePage]?: 'main' | 'settings' | 'toaster' | 'notifications' } = {
          dashboard: 'main',
          settings: 'settings',
          toaster: 'toaster',
          notifications: 'notifications',
        };
        if (pageToPaneMap[page]) openSidePane(pageToPaneMap[page]!);
      } else {
        handleNavigation(page);
      }
    }
  };

  return (
    <div className={isSubItem ? (compactMode ? 'ml-4' : 'ml-6') : ''}>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={handleClick} isActive={isActive}>
          <SidebarIcon>
            <Icon className={isSubItem ? "w-3 h-3" : "w-4 h-4"}/>
          </SidebarIcon>
          <SidebarLabel>{label}</SidebarLabel>
          {badge && <SidebarBadge>{badge}</SidebarBadge>}
          <SidebarTooltip label={label} badge={badge} />
        </SidebarMenuButton>

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

## File: src/components/MainContent.tsx
```typescript
import { forwardRef } from 'react'
import { 
  X,
  LayoutDashboard,
  Settings,
  Component,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BODY_STATES, type BodyState } from '@/lib/utils'
import { DashboardContent } from './DashboardContent'
import { SettingsPage } from './SettingsPage'
import { ToasterDemo } from './ToasterDemo'
import { useAppStore } from '@/store/appStore'
import { NotificationsPage } from './NotificationsPage'
import { ContentInSidePanePlaceholder } from './ContentInSidePanePlaceholder'

interface MainContentProps {
  bodyState: BodyState
  onToggleFullscreen: () => void
}

export const MainContent = forwardRef<HTMLDivElement, MainContentProps>(
  ({ bodyState, onToggleFullscreen }, ref) => {
    const { sidePaneContent, openSidePane, activePage, setActivePage } = useAppStore()

    const isDashboardInSidePane = sidePaneContent === 'main' && bodyState === BODY_STATES.SIDE_PANE
    const isSettingsInSidePane = sidePaneContent === 'settings' && bodyState === BODY_STATES.SIDE_PANE
    const isToasterInSidePane = sidePaneContent === 'toaster' && bodyState === BODY_STATES.SIDE_PANE
    const isNotificationsInSidePane = sidePaneContent === 'notifications' && bodyState === BODY_STATES.SIDE_PANE

    const renderContent = () => {
      if (activePage === 'dashboard') {
        if (isDashboardInSidePane) {
          return <ContentInSidePanePlaceholder 
            icon={LayoutDashboard} 
            title="Dashboard is in Side Pane" 
            pageName="dashboard"
            onBringBack={() => openSidePane('main')} 
          />;
        }
        return <DashboardContent />
      }

      if (activePage === 'settings') {
        if (isSettingsInSidePane) {
          return <ContentInSidePanePlaceholder 
            icon={Settings} 
            title="Settings are in Side Pane" 
            pageName="settings"
            onBringBack={() => {
              openSidePane('settings'); 
              setActivePage('settings');
            }}
          />;
        }
        return <SettingsPage />
      }
      if (activePage === 'toaster') {
        if (isToasterInSidePane) {
          return <ContentInSidePanePlaceholder
            icon={Component}
            title="Toaster Demo is in Side Pane"
            pageName="toaster demo"
            onBringBack={() => {
              openSidePane('toaster');
              setActivePage('toaster');
            }}
          />;
        }
        return <ToasterDemo />
      }
      if (activePage === 'notifications') {
        if (isNotificationsInSidePane) {
          return <ContentInSidePanePlaceholder
            icon={Bell}
            title="Notifications are in Side Pane"
            pageName="notifications"
            onBringBack={() => {
              openSidePane('notifications');
              setActivePage('notifications');
            }}
          />;
        }
        return <NotificationsPage />
      }
      return null;
    }
    
    const isContentVisible = (activePage === 'dashboard' && !isDashboardInSidePane) || 
                           (activePage === 'settings' && !isSettingsInSidePane) || 
                           (activePage === 'toaster' && !isToasterInSidePane) ||
                           (activePage === 'notifications' && !isNotificationsInSidePane);

    return (
      <div
        ref={ref}
        className={cn(
        "flex flex-col h-full overflow-hidden",
        bodyState === BODY_STATES.FULLSCREEN && "absolute inset-0 z-40 bg-background"
        )}
      >
        {bodyState === BODY_STATES.FULLSCREEN && isContentVisible && (
          <button
            onClick={onToggleFullscreen}
            className="fixed top-6 right-6 lg:right-12 z-[100] h-12 w-12 flex items-center justify-center rounded-full bg-card/50 backdrop-blur-sm hover:bg-card/75 transition-colors group"
            title="Exit Fullscreen"
          >
            <X className="w-6 h-6 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
          </button>
        )}

        <div className="flex-1 min-h-0 flex flex-col">
          {renderContent()}
        </div>
      </div>
    )
  }
)
```

## File: src/components/TopBar.tsx
```typescript
import { useState } from 'react'
import {
  Menu, 
  Maximize, 
  Minimize, 
  Moon, 
  Sun,
  Settings,
  Command,
  Zap,
  ChevronRight,
  Search,
  Filter,
  Plus,
  PanelRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BODY_STATES } from '@/lib/utils'
import { useAppStore } from '@/store/appStore'
import { UserDropdown } from './UserDropdown'

interface TopBarProps {
  onToggleSidebar: () => void
  onToggleFullscreen: () => void
  onToggleDarkMode: () => void
}

export function TopBar({
  onToggleSidebar,
  onToggleFullscreen,
  onToggleDarkMode
}: TopBarProps) {
  const { 
    bodyState, 
    isDarkMode, 
    openSidePane,
    sidePaneContent,
    activePage,
    setActivePage,
    searchTerm,
    setCommandPaletteOpen,
    setSearchTerm,
  } = useAppStore()

  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const handleSettingsClick = () => {
    const isSettingsInSidePane = bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === 'settings'

    // If we're on the settings page and it's not in the side pane, treat this as a "minimize" action.
    if (activePage === 'settings' && !isSettingsInSidePane) {
      openSidePane('settings');
      setActivePage('dashboard');
    } else {
      // In all other cases (on dashboard page, or settings already in pane),
      // just toggle the settings side pane.
      openSidePane('settings');
    }
  }

  const handleMoveToSidePane = () => {
    const mapping = { dashboard: 'main', settings: 'settings', toaster: 'toaster', notifications: 'notifications' } as const;
    openSidePane(mapping[activePage]);
    if (activePage !== 'dashboard') setActivePage('dashboard');
  };

  return (
    <div className={cn(
      "h-20 bg-card/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 z-50 gap-4",
      {
        'transition-all duration-300 ease-in-out': activePage === 'dashboard',
      }
    )}>
      {/* Left Section - Sidebar Controls & Breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* Sidebar Controls */}
        <button
          onClick={onToggleSidebar}
          className={cn(
            "h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
          )}
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs */}
        <div className={cn("hidden md:flex items-center gap-2 text-sm transition-opacity", {
          "opacity-0 pointer-events-none": isSearchFocused && activePage === 'dashboard'
        })}>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Home</a>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-foreground capitalize">{activePage}</span>
        </div>
      </div>

      {/* Right Section - Search, page controls, and global controls */}
      <div className={cn("flex items-center gap-3", isSearchFocused && activePage === 'dashboard' ? 'flex-1' : '')}>
        {/* Page-specific: Dashboard search and actions */}
        {activePage === 'dashboard' && (
          <div className="flex items-center gap-2 flex-1 justify-end">
            <div className={cn("relative transition-all duration-300 ease-in-out", isSearchFocused ? 'flex-1 max-w-lg' : 'w-auto')}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "pl-9 pr-4 py-2 h-10 border-none rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ease-in-out w-full",
                  isSearchFocused ? 'bg-background' : 'w-48'
                )}
              />
            </div>
             <button className="h-10 w-10 flex-shrink-0 flex items-center justify-center hover:bg-accent rounded-full transition-colors">
              <Filter className="w-5 h-5" />
            </button>
             <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 h-10 flex-shrink-0">
              <Plus className="w-5 h-5" />
              <span className={cn(isSearchFocused ? 'hidden sm:inline' : 'inline')}>New Project</span>
            </button>
          </div>
        )}
        
        {/* Page-specific: Move to side pane */}
        <div className={cn('flex items-center', isSearchFocused && activePage === 'dashboard' ? 'hidden md:flex' : '')}>
          {['dashboard', 'settings', 'toaster', 'notifications'].includes(activePage) && (
            <button onClick={handleMoveToSidePane} className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors" title="Move to Side Pane"><PanelRight className="w-5 h-5" /></button>
          )}
        </div>

        {/* Separator */}
        <div className={cn(
          'w-px h-6 bg-border mx-2', 
          !['dashboard', 'settings', 'toaster', 'notifications'].includes(activePage) || (isSearchFocused && activePage === 'dashboard') ? 'hidden' : ''
        )} />

        {/* Quick Actions */}
        <div className={cn('flex items-center gap-3', isSearchFocused && activePage === 'dashboard' ? 'hidden lg:flex' : '')}>

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

        {/* Body State Controls */}
        <button
          onClick={() => openSidePane('details')}
          className={cn(
            "h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group",
            bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === 'details' && "bg-accent"
          )}
          title="Toggle Side Pane"
        >
          <div className="w-5 h-5 flex group-hover:scale-110 transition-transform">
            <div className="w-1/2 h-full bg-current opacity-60 rounded-l-sm" />
            <div className="w-1/2 h-full bg-current rounded-r-sm" />
          </div>
        </button>

        <button
          onClick={onToggleFullscreen}
          className={cn(
            "h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group",
            bodyState === BODY_STATES.FULLSCREEN && "bg-accent"
          )}
          title="Toggle Fullscreen"
        >
          {bodyState === BODY_STATES.FULLSCREEN ? (
            <Minimize className="w-5 h-5 group-hover:scale-110 transition-transform" />
          ) : (
            <Maximize className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
        </button>

        <div className="w-px h-6 bg-border mx-2" />

        {/* Theme and Settings */}
        <button
          onClick={onToggleDarkMode}
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
          onClick={handleSettingsClick}
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
}
```

## File: src/store/appStore.ts
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SIDEBAR_STATES, BODY_STATES, type SidebarState, type BodyState } from '@/lib/utils'

export type ActivePage = 'dashboard' | 'settings' | 'toaster' | 'notifications';

interface AppState {
  // UI States
  sidebarState: SidebarState
  bodyState: BodyState
  isDarkMode: boolean
  sidePaneContent: 'details' | 'settings' | 'main' | 'toaster' | 'notifications'
  activePage: ActivePage
  sidebarWidth: number
  rightPaneWidth: number
  isResizing: boolean
  isResizingRightPane: boolean
  isTopBarVisible: boolean
  isCommandPaletteOpen: boolean
  searchTerm: string
  
  // User Preferences
  autoExpandSidebar: boolean
  reducedMotion: boolean
  compactMode: boolean
  primaryColor: string
  
  // Actions
  setSidebarState: (state: SidebarState) => void
  setBodyState: (state: BodyState) => void
  toggleDarkMode: () => void
  setActivePage: (page: ActivePage) => void
  setSidebarWidth: (width: number) => void
  setRightPaneWidth: (width: number) => void
  setIsResizing: (resizing: boolean) => void
  setIsResizingRightPane: (resizing: boolean) => void
  setTopBarVisible: (visible: boolean) => void
  setAutoExpandSidebar: (auto: boolean) => void
  setReducedMotion: (reduced: boolean) => void
  setCompactMode: (compact: boolean) => void
  setPrimaryColor: (color: string) => void
  setCommandPaletteOpen: (open: boolean) => void
  setSearchTerm: (term: string) => void
  
  // Composite Actions
  toggleSidebar: () => void
  hideSidebar: () => void
  showSidebar: () => void
  peekSidebar: () => void
  toggleFullscreen: () => void
  openSidePane: (content: 'details' | 'settings' | 'main' | 'toaster' | 'notifications') => void
  closeSidePane: () => void
  resetToDefaults: () => void
  handleNavigation: (page: ActivePage) => void
  isPageActive: (page: ActivePage) => boolean
}

const defaultState = {
  sidebarState: SIDEBAR_STATES.EXPANDED as SidebarState,
  bodyState: BODY_STATES.NORMAL as BodyState,
  sidePaneContent: 'details' as const,
  activePage: 'dashboard' as ActivePage,
  isDarkMode: false,
  sidebarWidth: 280,
  rightPaneWidth: typeof window !== 'undefined' ? Math.max(300, Math.round(window.innerWidth * 0.6)) : 400,
  isResizing: false,
  isResizingRightPane: false,
  isTopBarVisible: true,
  isCommandPaletteOpen: false,
  autoExpandSidebar: true,
  reducedMotion: false,
  compactMode: false,
  primaryColor: '220 84% 60%',
  searchTerm: '',
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...defaultState,
      
      // Basic setters
      sidePaneContent: 'details',
      setSidebarState: (state) => set({ sidebarState: state }),
      setBodyState: (state) => set({ bodyState: state }),
      setActivePage: (page) => set({ activePage: page }),
      toggleDarkMode: () => {
        const newMode = !get().isDarkMode
        set({ isDarkMode: newMode })
        document.documentElement.classList.toggle('dark', newMode)
      },
      setSidebarWidth: (width) => set({ sidebarWidth: Math.max(200, Math.min(500, width)) }),
      setRightPaneWidth: (width) => set({ rightPaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, width)) }),
      setIsResizing: (resizing) => set({ isResizing: resizing }),
      setIsResizingRightPane: (resizing) => set({ isResizingRightPane: resizing }),
      setTopBarVisible: (visible) => set({ isTopBarVisible: visible }),
      setAutoExpandSidebar: (auto) => set({ autoExpandSidebar: auto }),
      setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
      setCompactMode: (compact) => set({ compactMode: compact }),
      setPrimaryColor: (color) => set({ primaryColor: color }),
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      
      // Composite actions
      toggleSidebar: () => {
        const current = get().sidebarState
        if (current === SIDEBAR_STATES.HIDDEN) {
          set({ sidebarState: SIDEBAR_STATES.COLLAPSED })
        } else if (current === SIDEBAR_STATES.COLLAPSED) {
          set({ sidebarState: SIDEBAR_STATES.EXPANDED })
        } else if (current === SIDEBAR_STATES.EXPANDED) {
          set({ sidebarState: SIDEBAR_STATES.COLLAPSED })
        }
      },
      
      hideSidebar: () => set({ sidebarState: SIDEBAR_STATES.HIDDEN }),
      showSidebar: () => set({ sidebarState: SIDEBAR_STATES.EXPANDED }),
      peekSidebar: () => set({ sidebarState: SIDEBAR_STATES.PEEK }),
      
      toggleFullscreen: () => {
        const current = get().bodyState
        set({ 
          bodyState: current === BODY_STATES.FULLSCREEN ? BODY_STATES.NORMAL : BODY_STATES.FULLSCREEN 
        })
      },
      
      openSidePane: (content) => {
        const { bodyState, sidePaneContent } = get()
        if (bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === content) {
          // If it's open with same content, close it.
          set({ bodyState: BODY_STATES.NORMAL });
        } else {
          // If closed, or different content, open with new content.
          set({ bodyState: BODY_STATES.SIDE_PANE, sidePaneContent: content });
        }
      },
      closeSidePane: () => {
        set({ bodyState: BODY_STATES.NORMAL })
      },
      
      resetToDefaults: () => {
        set(defaultState)
        // Also reset dark mode class on html element
        if (defaultState.isDarkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },
      handleNavigation: (page) => {
        set({ activePage: page });
      },
      isPageActive: (page) => {
        const { activePage, bodyState, sidePaneContent } = get();
        const pageToSidePaneContent = {
          dashboard: 'main',
          settings: 'settings',
          toaster: 'toaster',
          notifications: 'notifications',
        };
        return activePage === page || (bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === pageToSidePaneContent[page]);
      },
    }),
    {
      name: 'app-preferences',
      partialize: (state) => ({
        sidebarState: state.sidebarState,
        bodyState: state.bodyState,
        activePage: state.activePage,
        sidePaneContent: state.sidePaneContent,
        isDarkMode: state.isDarkMode,
        sidebarWidth: state.sidebarWidth,
        rightPaneWidth: state.rightPaneWidth,
        autoExpandSidebar: state.autoExpandSidebar,
        reducedMotion: state.reducedMotion,
        compactMode: state.compactMode,
        primaryColor: state.primaryColor,
        // searchTerm is not persisted
      }),
    }
  )
)

// Initialize dark mode on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('app-preferences')
  if (stored) {
    const parsed = JSON.parse(stored)
    if (parsed.state?.isDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }
}
```
