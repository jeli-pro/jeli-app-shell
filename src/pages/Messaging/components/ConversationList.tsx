import { useState, useMemo, useCallback } from 'react';
import { Search, SlidersHorizontal, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useMessagingStore } from '../store/messaging.store';
import { useAppShellStore } from '@/store/appShell.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { AnimatedTabs } from '@/components/ui/animated-tabs';
import { ChannelIcon } from './ChannelIcons';
import type { Channel } from '../types';

const channels: { id: Channel, label: string }[] = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
];

export const ConversationList = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { isMessagingListCollapsed } = useAppShellStore();
  const { toggleMessagingListCollapsed } = useAppShellStore.getState();
  const { 
    getConversationsWithContact,
    searchTerm,
    setSearchTerm,
    activeFilters,
    setFilters,
    getAvailableTags,
   } = useMessagingStore();
  const conversations = getConversationsWithContact();
  const [activeTab, setActiveTab] = useState('all');
  const availableTags = useMemo(() => getAvailableTags(), [getAvailableTags]);

  const tabs = useMemo(() => [{ id: 'all', label: 'All' }, { id: 'unread', label: 'Unread' }], []);

  const handleChannelFilterChange = useCallback((channelId: Channel) => {
    const newChannels = activeFilters.channels.includes(channelId)
      ? activeFilters.channels.filter(c => c !== channelId)
      : [...activeFilters.channels, channelId];
    setFilters({ channels: newChannels });
  }, [activeFilters.channels, setFilters]);

  const handleTagFilterChange = useCallback((tag: string) => {
    const newTags = activeFilters.tags.includes(tag)
      ? activeFilters.tags.filter(t => t !== tag)
      : [...activeFilters.tags, tag];
    setFilters({ tags: newTags });
  }, [activeFilters.tags, setFilters]);

  const filteredConversations = useMemo(() => {
    if (activeTab === 'unread') {
      return conversations.filter(convo => convo.unreadCount > 0); // This now filters on the already filtered list from store
    }
    return conversations;
  }, [conversations, activeTab]);
  
  if (isMessagingListCollapsed) {
    return (
      <div className="h-full flex flex-col items-center border-r bg-background/80 py-4 gap-4">
        <Button variant="ghost" size="icon" onClick={toggleMessagingListCollapsed}>
          <PanelLeftOpen className="w-5 h-5" />
        </Button>
        <div className="flex-1 overflow-y-auto no-scrollbar pt-2">
            <nav className="flex flex-col gap-3 items-center">
              {filteredConversations.map(convo => (
                <Link
                  to={`/messaging/${convo.id}`}
                  key={convo.id}
                  title={convo.contact.name}
                  className={cn(
                    "relative flex items-start p-1 rounded-full text-left transition-all duration-200",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none",
                    conversationId === convo.id && "ring-2 ring-offset-2 ring-offset-background ring-primary"
                  )}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={convo.contact.avatar} alt={convo.contact.name} />
                    <AvatarFallback>{convo.contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1">
                      <ChannelIcon channel={convo.channel} className="bg-background rounded-full p-0.5" />
                  </div>
                  {convo.unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-primary h-5 w-5 p-0 flex items-center justify-center border-2 border-background">
                        {convo.unreadCount}
                      </Badge>
                  )}
                </Link>
              ))}
            </nav>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border-r bg-background/80">
      {/* Header */}
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold tracking-tight">Conversations</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMessagingListCollapsed}>
            <PanelLeftClose className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Channels</h4>
                  <div className="space-y-2">
                    {channels.map(channel => (
                      <div key={channel.id} className="flex items-center gap-2">
                        <Checkbox 
                          id={`channel-${channel.id}`} 
                          checked={activeFilters.channels.includes(channel.id)}
                          onCheckedChange={() => handleChannelFilterChange(channel.id)}
                        />
                        <label htmlFor={`channel-${channel.id}`} className="text-sm cursor-pointer">{channel.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Tags</h4>
                  <div className="space-y-2">
                    {availableTags.map(tag => (
                      <div key={tag} className="flex items-center gap-2">
                        <Checkbox 
                          id={`tag-${tag}`} 
                          checked={activeFilters.tags.includes(tag)}
                          onCheckedChange={() => handleTagFilterChange(tag)}
                        />
                        <label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer">{tag}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <AnimatedTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-3 space-y-1">
          {filteredConversations.map(convo => (
            <Link
              to={`/messaging/${convo.id}`}
              key={convo.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-200 hover:bg-accent/50",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none",
                conversationId === convo.id && "bg-accent border-l-4 border-primary pl-3"
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
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{formatDistanceToNow(new Date(convo.lastMessage.timestamp), { addSuffix: false })}</p>
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