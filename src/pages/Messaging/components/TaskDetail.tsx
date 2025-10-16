import React from 'react';
import { useParams } from 'react-router-dom';
import { useMessagingStore } from '../store/messaging.store';
import { ActivityFeed } from './ActivityFeed';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, SendHorizontal, Smile, StickyNote } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export const TaskDetail: React.FC = () => {
  const { conversationId: taskId } = useParams<{ conversationId: string }>();
  const task = useMessagingStore(state => taskId ? state.getTaskById(taskId) : undefined);
  
  if (!taskId || !task) {
    return (
        <div className="h-full flex flex-col items-center justify-center p-6 bg-background">
            <p className="text-muted-foreground">Select a task to see its details.</p>
        </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <ActivityFeed messages={task.messages} contact={task.contact} />

      {/* Input Form */}
      <div className="p-4 border-t flex-shrink-0 bg-background/50">
        <Tabs defaultValue="comment" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="comment">Comment</TabsTrigger>
            <TabsTrigger value="note"><StickyNote className="w-4 h-4 mr-2" />Internal Note</TabsTrigger>
          </TabsList>
          <TabsContent value="comment">
             <div className="relative">
                <Textarea placeholder={`Reply to ${task.contact.name}...`} className="pr-24 min-h-[52px]" />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8"><Smile className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8"><Paperclip className="w-4 h-4" /></Button>
                    <Button size="icon" className="rounded-full h-8 w-8"><SendHorizontal className="w-4 h-4" /></Button>
                </div>
            </div>
          </TabsContent>
          <TabsContent value="note">
            <div className="relative">
                <Textarea placeholder="Add an internal note..." className="pr-24 min-h-[52px] bg-yellow-400/10 border-yellow-400/30 focus-visible:ring-yellow-500" />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                    <Button size="icon" className="rounded-full h-8 w-8"><SendHorizontal className="w-4 h-4" /></Button>
                </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};