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

function NotificationItem({ notification, onMarkAsRead, isInSidePane }: { notification: Notification; onMarkAsRead: (id: number) => void; isInSidePane?: boolean; }) {
  const Icon = iconMap[notification.type];

  return (
    <div className={cn(
      "group w-full py-4 rounded-xl hover:bg-accent/50 transition-colors duration-200",
      isInSidePane ? "" : "-mx-4 px-4"
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
  const { show: showToast } = useToast();

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    if (unreadCount === 0) {
      showToast({
        title: "Already up to date!",
        message: "You have no unread notifications.",
        variant: "default",
      });
      return;
    }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast({
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
              <NotificationItem key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} isInSidePane={isInSidePane} />
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