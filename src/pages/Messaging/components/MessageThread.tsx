import React from 'react';
import { Paperclip, SendHorizontal, Smile } from 'lucide-react';

import { useMessagingStore } from '../store/messaging.store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChannelIcon } from './ChannelIcons';
import { cn } from '@/lib/utils';

interface MessageThreadProps {
  conversationId?: string;
}

export const MessageThread: React.FC<MessageThreadProps> = ({ conversationId }) => {
  const conversation = useMessagingStore(state =>
    conversationId ? state.getConversationById(conversationId) : undefined
  );
  
  if (!conversationId || !conversation) {
    return (
        <div className="h-full flex flex-col items-center justify-center p-6 bg-background">
            <p className="text-muted-foreground">Select a conversation to see the messages.</p>
        </div>
    );
  }

  const { contact, messages } = conversation;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b h-20 flex-shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{contact.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className={cn("w-2 h-2 rounded-full", contact.online ? 'bg-green-500' : 'bg-gray-400')} />
            {contact.online ? 'Online' : 'Offline'}
          </p>
        </div>
        <ChannelIcon channel={conversation.channel} className="w-5 h-5" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={cn(
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
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t flex-shrink-0 bg-card/30">
        <div className="relative">
          <Input placeholder="Type a message..." className="pr-32 h-12 rounded-full bg-background" />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button variant="ghost" size="icon" className="rounded-full">
                <Smile className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
                <Paperclip className="w-5 h-5" />
            </Button>
            <Button size="icon" className="rounded-full">
                <SendHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};