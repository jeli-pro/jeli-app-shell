import React, { useState, useMemo } from 'react';
import { useMessagingStore } from '../store/messaging.store';
import { ContactInfoPanel } from './ContactInfoPanel';
import { AIInsightsPanel } from './AIInsightsPanel';
import { ActivityPanel } from './ActivityPanel';
import { NotesPanel } from './NotesPanel';
import { TaskHeader } from './TaskHeader';
import { AnimatedTabs } from '@/components/ui/animated-tabs';
import { TechOrbitDisplay } from '@/components/effects/OrbitingCircles';

interface MessagingContentProps {
  conversationId?: string;
}

export const MessagingContent: React.FC<MessagingContentProps> = ({ conversationId }) => {
  const [activeTab, setActiveTab] = useState('contact');
  const task = useMessagingStore(state => conversationId ? state.getTaskById(conversationId) : undefined);
  
  const tabs = useMemo(() => [
    { id: 'contact', label: 'Contact' },
    { id: 'ai', label: 'AI Insights' },
    { id: 'activity', label: 'Activity' },
    { id: 'notes', label: 'Notes' },
  ], []);

  if (!task) {
    return (
      <div className="h-full flex-1 flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
        <TechOrbitDisplay text="Context" />
        <div className="text-center z-10 bg-background/50 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="mt-4 text-lg font-medium">Select a Task</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Task details and contact information will appear here.
            </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex-1 flex flex-col bg-background overflow-hidden" data-testid="messaging-content-scroll-pane">
      <div className="flex-shrink-0 border-b p-6">
        <TaskHeader task={task} />
      </div>
      <AnimatedTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        size="sm" 
        className="px-6 border-b flex-shrink-0"
        wrapperClassName="flex-1 flex flex-col min-h-0"
        contentClassName="flex-1 min-h-0"
      >
        <div className="p-6 h-full overflow-y-auto"><ContactInfoPanel contact={task.contact} /></div>
        <div className="p-6 h-full overflow-y-auto"><AIInsightsPanel task={task} /></div>
        <div className="p-6 h-full overflow-y-auto"><ActivityPanel contact={task.contact} /></div>
        <div className="p-6 h-full overflow-y-auto"><NotesPanel contact={task.contact} /></div>
      </AnimatedTabs>
    </div>
  );
};