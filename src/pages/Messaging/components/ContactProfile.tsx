import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Mail, Phone, Sparkles, Reply, ThumbsUp, ThumbsDown, Copy, Briefcase, StickyNote, PhoneCall, CheckSquare, Calendar, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useMessagingStore } from '../store/messaging.store';
import type { ActivityEvent, ActivityEventType } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AnimatedTabs } from '@/components/ui/animated-tabs';
import { TechOrbitDisplay } from '@/components/effects/OrbitingCircles';
import { cn } from '@/lib/utils';

interface ContactProfileProps {
  conversationId?: string;
}

export const ContactProfile: React.FC<ContactProfileProps> = ({ conversationId }) => {
  const [activeTab, setActiveTab] = useState('insights');

  const conversation = useMessagingStore(state => 
    conversationId ? state.getConversationById(conversationId) : undefined
  );

  const tabs = useMemo(() => [
    { id: 'insights', label: 'AI' },
    { id: 'details', label: 'Details' },
    { id: 'activity', label: 'Activity' },
    { id: 'notes', label: 'Notes' },
  ], []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const activityIcons: Record<ActivityEventType, React.ElementType> = {
    note: StickyNote,
    call: PhoneCall,
    email: Mail,
    meeting: Calendar,
  };
  
  const ActivityItem = ({ item }: { item: ActivityEvent }) => {
    const Icon = activityIcons[item.type];
    return (
      <div className="flex items-start gap-3">
        <div className="mt-1"><Icon className="w-4 h-4 text-muted-foreground" /></div>
        <div className="flex-1 text-sm"><p>{item.content}</p><p className="text-xs text-muted-foreground mt-1">{format(new Date(item.timestamp), "MMM d, yyyy 'at' h:mm a")}</p></div>
      </div>
    )
  }
  if (!conversation) {
    return (
      <div className="h-full flex-1 flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
        <TechOrbitDisplay text="Contact Intel" />
        <div className="text-center z-10 bg-background/50 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="mt-4 text-lg font-medium">Select a Conversation</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                AI-powered insights and contact details will appear here.
            </p>
        </div>
      </div>
    );
  }

  const { contact, aiSummary } = conversation;

  return (
    <div className="h-full flex-1 flex flex-col bg-background overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Contact Header */}
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4 border-4 border-background ring-2 ring-primary">
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback className="text-3xl">{contact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">{contact.name}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {contact.online ? 'Online' : `Last seen ${contact.lastSeen}`}
          </p>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {contact.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button variant="outline" size="sm" className="gap-2"><StickyNote className="w-4 h-4" /> Note</Button>
            <Button variant="outline" size="sm" className="gap-2"><PhoneCall className="w-4 h-4" /> Call</Button>
            <Button variant="outline" size="sm" className="gap-2"><Mail className="w-4 h-4" /> Email</Button>
            <Button variant="outline" size="sm" className="gap-2"><CheckSquare className="w-4 h-4" /> Task</Button>
        </div>

        {/* Tabs for Details and AI Insights */}
        <Card className="overflow-hidden">
          <AnimatedTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className="px-6 border-b" />
          
          {activeTab === 'details' && (
            <CardContent className="space-y-4 text-sm pt-6 leading-relaxed">
               <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground break-all">{contact.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground">{contact.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground">{contact.role} at <strong>{contact.company}</strong></span>
              </div>
            </CardContent>
          )}

          {activeTab === 'insights' && (
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Sentiment:</span>
                <Badge variant={
                  aiSummary.sentiment === 'positive' ? 'default' : aiSummary.sentiment === 'negative' ? 'destructive' : 'secondary'
                } className="capitalize">
                  {aiSummary.sentiment === 'positive' && <ThumbsUp className="w-3 h-3 mr-1.5" />}
                  {aiSummary.sentiment === 'negative' && <ThumbsDown className="w-3 h-3 mr-1.5" />}
                  {aiSummary.sentiment}
                </Badge>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm"><Sparkles className="w-4 h-4 text-yellow-500" /> Key Points</h4>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground pl-2">
                  {aiSummary.summaryPoints.map((point, i) => <li key={i}>{point}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm"><Reply className="w-4 h-4 text-blue-500" /> Suggested Replies</h4>
                <div className="flex flex-col gap-2">
                  {aiSummary.suggestedReplies.map((reply, i) => (
                    <Button 
                      key={i} 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-between text-left h-auto py-2 px-3 group"
                      onClick={() => handleCopy(reply)}
                    >
                      <span className="pr-4">{reply}</span>
                      <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          )}

          {activeTab === 'activity' && (
            <CardContent className="pt-6">
              <div className="space-y-5 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {contact.activity.map(item => <ActivityItem key={item.id} item={item} />)}
              </div>
            </CardContent>
          )}

          {activeTab === 'notes' && (
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-4">
                {contact.notes.map(note => (
                  <div key={note.id} className="text-sm bg-accent/50 p-3 rounded-lg"><p className="mb-1.5">{note.content}</p><p className="text-xs text-muted-foreground">{format(new Date(note.createdAt), "MMM d, yyyy")}</p></div>
                ))}
              </div>
              <Textarea placeholder="Add a new note..." className="min-h-[60px]" />
              <Button size="sm" className="w-full gap-2"><Send className="w-4 h-4" /> Save Note</Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};