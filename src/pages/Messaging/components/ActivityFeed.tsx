import React, { forwardRef } from 'react';
import { useMessagingStore } from '../store/messaging.store';
import type { Message, Contact, Assignee } from '../types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { StickyNote, Info } from 'lucide-react';

interface ActivityFeedProps {
  messages: Message[];
  contact: Contact;
}

export const ActivityFeed = forwardRef<HTMLDivElement, ActivityFeedProps>(({ messages, contact }, ref) => {
  const getAssigneeById = useMessagingStore(state => state.getAssigneeById);

  return (
    <div ref={ref} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
      {messages.map((message) => {
        const assignee = message.userId ? getAssigneeById(message.userId) : null;
        
        if (message.type === 'system') {
          return (
            <div key={message.id} data-message-id={message.id} className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Info className="w-3.5 h-3.5" />
              <p>{message.text}</p>
              <p className="whitespace-nowrap">{formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}</p>
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
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}</p>
                </div>
                <div className="bg-card border rounded-lg p-3 text-sm">
                  <p>{message.text}</p>
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
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
});

ActivityFeed.displayName = 'ActivityFeed';
