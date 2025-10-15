import React, { useRef } from 'react';
import { ContactProfile } from './ContactProfile';
import { MessageThread } from './MessageThread';
import { useAppShellStore } from '@/store/appShell.store';
import { useResizableMessagingProfile } from '@/hooks/useResizablePanes.hook';
import { cn } from '@/lib/utils';

interface MessagingContentProps {
  conversationId?: string;
}

export const MessagingContent: React.FC<MessagingContentProps> = ({ conversationId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { 
    messagingProfileWidth, 
    isResizingMessagingProfile, 
    isMessagingProfileCollapsed 
  } = useAppShellStore(s => ({
    messagingProfileWidth: s.messagingProfileWidth,
    isResizingMessagingProfile: s.isResizingMessagingProfile,
    isMessagingProfileCollapsed: s.isMessagingProfileCollapsed,
  }));
  const { setIsResizingMessagingProfile } = useAppShellStore.getState();

  useResizableMessagingProfile(containerRef);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMessagingProfileCollapsed) return;
    e.preventDefault();
    setIsResizingMessagingProfile(true);
  };
  
  const profileWidth = isMessagingProfileCollapsed ? 0 : messagingProfileWidth;

  return (
    <div ref={containerRef} className={cn(
      "h-full w-full flex bg-background", 
      isResizingMessagingProfile && !isMessagingProfileCollapsed && "cursor-col-resize select-none"
    )}>
      <div className="flex-1 min-w-0">
        <MessageThread conversationId={conversationId} />
      </div>

      {!isMessagingProfileCollapsed && (
        <div onMouseDown={handleMouseDown} className="w-2 flex-shrink-0 cursor-col-resize group flex items-center justify-center">
          <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200" />
        </div>
      )}

      <div 
        style={{ width: `${profileWidth}px` }} 
        className={cn(
          "flex-shrink-0 transition-[width] duration-300 ease-in-out overflow-hidden",
          isMessagingProfileCollapsed && "w-0"
        )}
      >
        <ContactProfile conversationId={conversationId} />
      </div>
    </div>
  );
};