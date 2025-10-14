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