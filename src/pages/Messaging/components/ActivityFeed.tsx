import React, { forwardRef } from 'react';
import { useMessagingStore } from '../store/messaging.store';
import type { Message, Contact, Assignee, JourneyPointType } from '../types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
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
}

export const ActivityFeed = forwardRef<HTMLDivElement, ActivityFeedProps>(({ messages, contact }, ref) => {
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
                  <span className="text-xs text-muted-foreground font-normal whitespace-nowrap">{formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          );
        }
        
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
