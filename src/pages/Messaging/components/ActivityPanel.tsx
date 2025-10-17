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