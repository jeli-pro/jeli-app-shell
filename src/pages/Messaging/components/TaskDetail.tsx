import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useMessagingStore } from '../store/messaging.store';
import { ActivityFeed } from './ActivityFeed';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, SendHorizontal, Smile, StickyNote } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TakeoverBanner } from './TakeoverBanner';
import { useToast } from '@/components/ui/toast';


export const TaskDetail: React.FC = () => {
  const { conversationId: taskId } = useParams<{ conversationId: string }>();
  const { show } = useToast();
  const { getTaskById, takeOverTask, requestAndSimulateTakeover } = useMessagingStore();

  const task = useMemo(() => taskId ? getTaskById(taskId) : undefined, [taskId, getTaskById]);

  // In a real app, this would come from the auth store
  const currentUserId = 'user-1'; 

  const isLocked = !!task?.activeHandlerId && task.activeHandlerId !== currentUserId;

  if (!taskId || !task) {
    return (
        <div className="h-full flex flex-col items-center justify-center p-6 bg-background">
            <p className="text-muted-foreground">Select a task to see its details.</p>
        </div>
    );
  }

  const handleTakeOver = () => {
    takeOverTask(task.id, currentUserId);
    show({
        variant: 'success',
        title: 'Task Taken Over',
        message: `You are now handling the task from ${task.contact.name}.`
    });
  };

  const handleRequestTakeover = () => {
    requestAndSimulateTakeover(task.id, currentUserId);
    if (task.activeHandler) {
        show({
            variant: 'default',
            title: 'Request Sent',
            message: `A takeover request has been sent to ${task.activeHandler.name}.`
        });
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {isLocked && task.activeHandler && (
        <TakeoverBanner
            activeHandler={task.activeHandler}
            isRequesting={!!task.takeoverRequested}
            onTakeOver={handleTakeOver}
            onRequestTakeover={handleRequestTakeover}
        />
      )}
      <ActivityFeed messages={task.messages} contact={task.contact} />

      {/* Input Form */}
      <div className="p-4 border-t flex-shrink-0 bg-background/50">
        <Tabs defaultValue="comment" className="w-full" >
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="comment" disabled={isLocked}>Comment</TabsTrigger>
            <TabsTrigger value="note" disabled={isLocked}><StickyNote className="w-4 h-4 mr-2" />Internal Note</TabsTrigger>
          </TabsList>
          <TabsContent value="comment">
             <div className="relative">
                <Textarea placeholder={isLocked ? "Take over to reply..." : `Reply to ${task.contact.name}...`} className="pr-24 min-h-[52px]" disabled={isLocked} />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" disabled={isLocked}><Smile className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" disabled={isLocked}><Paperclip className="w-4 h-4" /></Button>
                    <Button size="icon" className="rounded-full h-8 w-8" disabled={isLocked}><SendHorizontal className="w-4 h-4" /></Button>
                </div>
            </div>
          </TabsContent>
          <TabsContent value="note">
            <div className="relative">
                <Textarea placeholder={isLocked ? "Take over to add a note..." : "Add an internal note..."} className="pr-24 min-h-[52px] bg-yellow-400/10 border-yellow-400/30 focus-visible:ring-yellow-500" disabled={isLocked} />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                    <Button size="icon" className="rounded-full h-8 w-8" disabled={isLocked}><SendHorizontal className="w-4 h-4" /></Button>
                </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};