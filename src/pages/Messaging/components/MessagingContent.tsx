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
    <div className="h-full flex-1 flex flex-col bg-background overflow-y-auto" data-testid="messaging-content-scroll-pane">
      {/* Combined Header */}
      <div className="flex-shrink-0 border-b">
        <div className="p-6">
          <TaskHeader task={task} />
        </div>
        <AnimatedTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} size="sm" className="px-6" />
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6">
        {activeTab === 'contact' && <ContactInfoPanel contact={task.contact} />}
        {activeTab === 'ai' && <AIInsightsPanel task={task} />}
        {activeTab === 'activity' && <ActivityPanel contact={task.contact} />}
        {activeTab === 'notes' && <NotesPanel contact={task.contact} />}
      </div>
    </div>
  );
};