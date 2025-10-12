import React from 'react';
import { cn } from '@/lib/utils';
import { useAppShell } from '@/context/AppShellContext';

interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement>;
  isInSidePane?: boolean;
}

export const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ children, onScroll, scrollRef, className, isInSidePane = false, ...props }, ref) => {
    const { isTopBarVisible, bodyState } = useAppShell();
    const isFullscreen = bodyState === 'fullscreen';

    return (
      <div
        ref={scrollRef}
        className={cn("h-full overflow-y-auto", className)}
        onScroll={onScroll}
      >
        <div ref={ref} className={cn(
          "space-y-8 transition-all duration-300",
          !isInSidePane ? "px-6 lg:px-12 pb-6" : "px-6 pb-6",
          isTopBarVisible && !isFullscreen ? "pt-24" : "pt-6"
        )}
        {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);

PageLayout.displayName = 'PageLayout';