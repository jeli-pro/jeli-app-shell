import React, { useRef, type ReactElement, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { CommandPalette } from '@/components/global/CommandPalette';
import { useAppStore } from '@/store/appStore';
import { useAppShell } from '@/context/AppShellContext';
import { SIDEBAR_STATES, BODY_STATES } from '@/lib/utils'
import { useResizableSidebar, useResizableRightPane } from '@/hooks/useResizablePanes.hook'
import { useSidebarAnimations, useBodyStateAnimations } from '@/hooks/useAppShellAnimations.hook'

interface AppShellProps {
  sidebar: ReactElement;
  topBar: ReactElement;
  mainContent: ReactElement;
  rightPane: ReactElement;
  commandPalette?: ReactElement;
}

const pageToPaneMap: Record<string, 'main' | 'settings' | 'toaster' | 'notifications'> = {
  dashboard: 'main',
  settings: 'settings',
  toaster: 'toaster',
  notifications: 'notifications',
};


export function AppShell({ sidebar, topBar, mainContent, rightPane, commandPalette }: AppShellProps) {
  const {
    sidebarState,
    dispatch,
    autoExpandSidebar,
    toggleSidebar,
    peekSidebar,
    draggedPage,
    dragHoverTarget,
    toggleSplitView,
    openSidePane,
    bodyState,
    rightPaneWidth,
    sidePaneContent,
    closeSidePane,
  } = useAppShell();
  
  const { isDarkMode, toggleDarkMode, handleNavigation, activePage } = useAppStore();
  const appRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const rightPaneRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const topBarContainerRef = useRef<HTMLDivElement>(null)
  const mainAreaRef = useRef<HTMLDivElement>(null)

  const isSplitView = bodyState === BODY_STATES.SPLIT_VIEW;

  // Custom hooks for logic
  useResizableSidebar(sidebarRef, resizeHandleRef);
  useResizableRightPane();
  useSidebarAnimations(sidebarRef, resizeHandleRef);
  useBodyStateAnimations(appRef, mainContentRef, rightPaneRef, topBarContainerRef, mainAreaRef);
  
  const sidebarWithProps = React.cloneElement(sidebar, { 
    ref: sidebarRef,
    onMouseEnter: () => {
      if (autoExpandSidebar && sidebarState === SIDEBAR_STATES.COLLAPSED) {
        peekSidebar()
      }
    },
    onMouseLeave: () => {
      if (autoExpandSidebar && sidebarState === SIDEBAR_STATES.PEEK) {
        dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.COLLAPSED });
      }
    }
  });

  const topBarWithProps = React.cloneElement(topBar, {
    onToggleSidebar: toggleSidebar,
    onToggleDarkMode: toggleDarkMode,
  });

  const mainContentWithProps = React.cloneElement(mainContent, {
    ref: mainContentRef,
  });

  const rightPaneWithProps = React.cloneElement(rightPane, { ref: rightPaneRef });

  // Drag and drop handlers for docking
  const handleDragOverLeft = useCallback((e: React.DragEvent) => {
    if (!draggedPage) return;
    e.preventDefault();
    if (dragHoverTarget !== 'left') {
      dispatch({ type: 'SET_DRAG_HOVER_TARGET', payload: 'left' });
    }
  }, [draggedPage, dragHoverTarget, dispatch]);

  const handleDropLeft = useCallback(() => {
    if (!draggedPage) return;
    
    const originalActivePage = activePage;
    const originalActivePagePaneContent = pageToPaneMap[originalActivePage];

    // If we drop the page that's already in the side pane, just make it the main view.
    const paneContentOfDraggedPage = pageToPaneMap[draggedPage];
    if (paneContentOfDraggedPage === sidePaneContent && (bodyState === BODY_STATES.SIDE_PANE || bodyState === BODY_STATES.SPLIT_VIEW)) {
      closeSidePane();
      handleNavigation(draggedPage);
    } 
    // New context-aware logic: if we are in normal view and drop a NEW page on the left
    else if (bodyState === BODY_STATES.NORMAL && draggedPage !== originalActivePage) {
        if (originalActivePagePaneContent) {
            // 1. Set the right pane content to be the original page
            dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: originalActivePagePaneContent });
            // 2. Set the main page to be the new dragged page
            handleNavigation(draggedPage);
            // 3. Switch to split view
            dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SPLIT_VIEW });
        } else {
            // Fallback for pages that can't be in a pane
            handleNavigation(draggedPage);
        }
    } else { // Default behavior: just make the dropped page the main one
      handleNavigation(draggedPage);
    }
    
    dispatch({ type: 'SET_DRAGGED_PAGE', payload: null });
    dispatch({ type: 'SET_DRAG_HOVER_TARGET', payload: null });
  }, [draggedPage, activePage, bodyState, sidePaneContent, handleNavigation, dispatch, closeSidePane]);

  const handleDragOverRight = useCallback((e: React.DragEvent) => {
    if (!draggedPage) return;
    e.preventDefault();
    if (dragHoverTarget !== 'right') {
      dispatch({ type: 'SET_DRAG_HOVER_TARGET', payload: 'right' });
    }
  }, [draggedPage, dragHoverTarget, dispatch]);

  const handleDropRight = useCallback(() => {
    if (!draggedPage) return;
    const pane = pageToPaneMap[draggedPage as keyof typeof pageToPaneMap];
    if (pane) {
      // If dropping the currently active page to the right,
      // set a default page (e.g., dashboard) as the new active page.
      if (draggedPage === activePage) {
        handleNavigation('dashboard');
      }

      // Set the right pane content and ensure split view
      dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: pane });
      if (bodyState === BODY_STATES.NORMAL) {
        toggleSplitView(pane);
      } else if (bodyState === BODY_STATES.SIDE_PANE) {
        toggleSplitView();
      }
    }
    dispatch({ type: 'SET_DRAGGED_PAGE', payload: null });
    dispatch({ type: 'SET_DRAG_HOVER_TARGET', payload: null });
  }, [draggedPage, toggleSplitView, dispatch, bodyState, activePage, handleNavigation]);

  return (
    <div 
      ref={appRef}
      className={cn(
        "relative h-screen w-screen overflow-hidden bg-background transition-colors duration-300",
        isDarkMode && "dark"
      )}
    >
      <div className="flex h-screen overflow-hidden">
        {/* Enhanced Sidebar */}
        {sidebarWithProps}

        {/* Resize Handle */}
        {sidebarState !== SIDEBAR_STATES.HIDDEN && (
          <div
            ref={resizeHandleRef}
            className={cn(
              "absolute top-0 w-2 h-full bg-transparent hover:bg-primary/20 cursor-col-resize z-50 transition-colors duration-200 group -translate-x-1/2"
            )}
            onMouseDown={(e) => {
              e.preventDefault()
              dispatch({ type: 'SET_IS_RESIZING', payload: true });
            }}
          >
            <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200 mx-auto" />
          </div>
        )}

        {/* Main area wrapper */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div ref={topBarContainerRef} className="relative z-30">
            {topBarWithProps}
          </div>

          <div className="flex flex-1 min-h-0">
            <div ref={mainAreaRef} className="relative flex-1 overflow-hidden bg-background">
              {/* Left drop overlay */}
              <div
                className={cn(
                  "absolute inset-y-0 left-0 z-40 border-2 border-transparent transition-all",
                  draggedPage
                    ? cn("pointer-events-auto", isSplitView ? 'w-full' : 'w-1/2')
                    : "pointer-events-none w-0",
                  dragHoverTarget === 'left' && "bg-primary/10 border-primary"
                )}
                onDragOver={handleDragOverLeft}
                onDrop={handleDropLeft}
                onDragLeave={() => {
                  if (dragHoverTarget === 'left') dispatch({ type: 'SET_DRAG_HOVER_TARGET', payload: null });
                }}
              >
                {draggedPage && dragHoverTarget === 'left' && (
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-primary-foreground/80 pointer-events-none">
                    <span className="px-3 py-1 rounded-md bg-primary/70">{isSplitView ? 'Drop to Replace' : 'Drop to Left'}</span>
                  </div>
                )}
              </div>
              {mainContentWithProps}
              {/* Right drop overlay (over main area, ONLY when NOT in split view) */}
              {!isSplitView && (
                <div
                  className={cn(
                    "absolute inset-y-0 right-0 z-40 border-2 border-transparent",
                    draggedPage ? "pointer-events-auto w-1/2" : "pointer-events-none",
                    dragHoverTarget === 'right' && "bg-primary/10 border-primary"
                  )}
                  onDragOver={handleDragOverRight}
                  onDrop={handleDropRight}
                  onDragLeave={() => {
                    if (dragHoverTarget === 'right') dispatch({ type: 'SET_DRAG_HOVER_TARGET', payload: null });
                  }}
                >
                  {draggedPage && dragHoverTarget === 'right' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="px-3 py-1 rounded-md bg-primary/70 text-sm font-medium text-primary-foreground/80">Drop to Right</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            {isSplitView ? (
              <div
                className="relative"
                onDragOver={handleDragOverRight}
              >
                {rightPaneWithProps}
                {draggedPage && (
                  <div
                    className={cn(
                      'absolute inset-0 z-50 transition-all',
                      dragHoverTarget === 'right'
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'pointer-events-none'
                    )}
                    onDragLeave={() => {
                      if (dragHoverTarget === 'right')
                        dispatch({ type: 'SET_DRAG_HOVER_TARGET', payload: null });
                    }}
                    onDrop={handleDropRight}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {dragHoverTarget === 'right' && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="px-3 py-1 rounded-md bg-primary/70 text-sm font-medium text-primary-foreground/80">
                          Drop to Replace
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : rightPaneWithProps}
          </div>
        </div>
      </div>
      {commandPalette || <CommandPalette />}
    </div>
  )
}