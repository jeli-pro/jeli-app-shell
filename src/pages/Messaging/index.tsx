import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ConversationList } from "./components/ConversationList";
import { ContactProfile } from "./components/ContactProfile";
import { cn } from "@/lib/utils";

export default function MessagingPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [listWidth, setListWidth] = useState(384); // Default width (24rem)
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;
      // Clamp the width between min and max values
      setListWidth(Math.max(320, Math.min(newWidth, containerRect.width - 400)));
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className={cn("h-full w-full flex bg-background", isResizing && "cursor-col-resize select-none")}>
        <div style={{ width: `${listWidth}px` }} className="flex-shrink-0">
          <ConversationList />
        </div>
        <div onMouseDown={handleMouseDown} className="w-2 flex-shrink-0 cursor-col-resize group flex items-center justify-center">
          <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200" />
        </div>
        <ContactProfile conversationId={conversationId} />
    </div>
  );
}