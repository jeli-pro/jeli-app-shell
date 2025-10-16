import React from 'react';
import { format } from 'date-fns';
import { Mail, StickyNote, PhoneCall, Calendar } from 'lucide-react';
import type { Contact, ActivityEvent, ActivityEventType } from '../types';

const activityIcons: Record<ActivityEventType, React.ElementType> = {
    note: StickyNote,
    call: PhoneCall,
    email: Mail,
    meeting: Calendar,
};

const ActivityItem = ({ item }: { item: ActivityEvent }) => {
    const Icon = activityIcons[item.type];
    return (
      <div className="flex items-start gap-4">
        <div className="mt-1.5 h-8 flex items-center justify-center">
            <div className="h-full w-0.5 bg-border"></div>
            <div className="absolute p-1.5 bg-background border rounded-full">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
        </div>
        <div className="flex-1 text-sm pt-1.5 pb-5"><p>{item.content}</p><p className="text-xs text-muted-foreground mt-1">{format(new Date(item.timestamp), "MMM d, yyyy 'at' h:mm a")}</p></div>
      </div>
    )
};

interface ActivityPanelProps {
  contact: Contact;
}

export const ActivityPanel: React.FC<ActivityPanelProps> = ({ contact }) => {
    return (
        <div className="relative">
            {contact.activity.map(item => <ActivityItem key={item.id} item={item} />)}
        </div>
    )
}