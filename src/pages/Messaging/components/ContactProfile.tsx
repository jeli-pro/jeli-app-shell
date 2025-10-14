import React from 'react';
import { Mail, Phone, Bot, Sparkles, Reply, ThumbsUp, ThumbsDown, UserCheck } from 'lucide-react';
import { useMessagingStore } from '../store/messaging.store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ContactProfileProps {
  conversationId?: string;
}

export const ContactProfile: React.FC<ContactProfileProps> = ({ conversationId }) => {
  const conversation = useMessagingStore(state => 
    conversationId ? state.getConversationById(conversationId) : undefined
  );

  if (!conversation) {
    return (
      <div className="h-full flex-1 flex flex-col items-center justify-center bg-background p-6">
        <div className="text-center">
            <UserCheck className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Select a Conversation</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Contact details and AI summaries will appear here.
            </p>
        </div>
      </div>
    );
  }

  const { contact, aiSummary } = conversation;

  return (
    <div className="h-full flex-1 flex flex-col bg-background overflow-y-auto p-6 space-y-6">
      {/* Contact Header */}
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 mb-4 border-4 border-background ring-2 ring-primary">
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback className="text-3xl">{contact.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">{contact.name}</h2>
        <p className="text-sm text-muted-foreground">
          {contact.online ? 'Online' : `Last seen ${contact.lastSeen}`}
        </p>
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {contact.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </div>
      
      {/* Contact Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{contact.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{contact.phone}</span>
          </div>
        </CardContent>
      </Card>
      
      {/* AI Summary Card */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <span>AI Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Sentiment:</span>
            <Badge variant={
              aiSummary.sentiment === 'positive' ? 'default' : aiSummary.sentiment === 'negative' ? 'destructive' : 'secondary'
            } className="capitalize">
              {aiSummary.sentiment === 'positive' && <ThumbsUp className="w-3 h-3 mr-1.5" />}
              {aiSummary.sentiment === 'negative' && <ThumbsDown className="w-3 h-3 mr-1.5" />}
              {aiSummary.sentiment}
            </Badge>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-yellow-500" /> Key Points</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
              {aiSummary.summaryPoints.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2"><Reply className="w-4 h-4 text-blue-500" /> Suggested Replies</h4>
            <div className="flex flex-col gap-2">
              {aiSummary.suggestedReplies.map((reply, i) => (
                <Button key={i} variant="outline" size="sm" className="w-full justify-start text-left h-auto py-2">
                  {reply}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};