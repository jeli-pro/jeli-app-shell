import { Search, SlidersHorizontal } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useMessagingStore } from '../store/messaging.store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChannelIcon } from './ChannelIcons';

export const ConversationList = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const conversations = useMessagingStore(state => state.getConversationsWithContact());

  return (
    <div className="h-full flex flex-col border-r bg-card/50 min-w-[320px] max-w-[400px] w-1/3">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold tracking-tight mb-4">Conversations</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-9 bg-background" />
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-1">
          {conversations.map(convo => (
            <Link
              to={`/messaging/${convo.id}`}
              key={convo.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg text-left transition-colors hover:bg-accent",
                conversationId === convo.id && "bg-accent"
              )}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={convo.contact.avatar} alt={convo.contact.name} />
                  <AvatarFallback>{convo.contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0">
                    <ChannelIcon channel={convo.channel} className="bg-background rounded-full p-0.5" />
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <p className="font-semibold truncate">{convo.contact.name}</p>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(convo.lastMessage.timestamp), { addSuffix: true })}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground truncate">{convo.lastMessage.text}</p>
              </div>
              {convo.unreadCount > 0 && (
                <div className="flex items-center justify-center self-center ml-auto">
                    <Badge className="bg-primary h-5 w-5 p-0 flex items-center justify-center">{convo.unreadCount}</Badge>
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};