import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { ConversationList } from "./components/ConversationList";
import { cn } from "@/lib/utils";
import { MessagingContent } from "./components/MessagingContent";
import { useAppShellStore } from "@/store/appShell.store";
import { useResizableMessagingList } from "@/hooks/useResizablePanes.hook";
import { BODY_STATES } from "@/lib/utils";

export default function MessagingPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const COLLAPSED_WIDTH = 80;

  const { messagingListWidth, isResizingMessagingList, isMessagingListCollapsed, bodyState } = useAppShellStore(s => ({
    messagingListWidth: s.messagingListWidth,
    isResizingMessagingList: s.isResizingMessagingList,
    isMessagingListCollapsed: s.isMessagingListCollapsed,
    bodyState: s.bodyState,
  }));
  const { setIsResizingMessagingList } = useAppShellStore.getState();

  useResizableMessagingList(containerRef);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMessagingListCollapsed) return;
    e.preventDefault();
    setIsResizingMessagingList(true);
  };

  const listWidth = isMessagingListCollapsed ? COLLAPSED_WIDTH : messagingListWidth;

  if (bodyState === BODY_STATES.SPLIT_VIEW) {
    return (
      <div className="h-full w-full">
        <ConversationList />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn(
      "h-full w-full flex bg-background", 
      isResizingMessagingList && !isMessagingListCollapsed && "cursor-col-resize select-none"
    )}>
        <div style={{ width: `${listWidth}px` }} className="flex-shrink-0 transition-[width] duration-300 ease-in-out">
          <ConversationList />
        </div>
        {!isMessagingListCollapsed && (
          <div onMouseDown={handleMouseDown} className="w-2 flex-shrink-0 cursor-col-resize group flex items-center justify-center">
            <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200" />
          </div>
        )}
        <div className="flex-1 min-w-0"><MessagingContent conversationId={conversationId} /></div>
    </div>
  );
}