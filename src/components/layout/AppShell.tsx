import React, { useRef, type ReactElement, useCallback, useEffect, useLayoutEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils'
import { gsap } from 'gsap';
import { CommandPalette } from '@/components/global/CommandPalette';
import { useAppStore } from '@/store/appStore'
import { useAppShell } from '@/context/AppShellContext';
import { SIDEBAR_STATES, BODY_STATES } from '@/lib/utils'
import { useResizableSidebar, useResizableRightPane } from '@/hooks/useResizablePanes.hook'
import { useSidebarAnimations, useBodyStateAnimations } from '@/hooks/useAppShellAnimations.hook'
import { ViewModeSwitcher } from './ViewModeSwitcher';

interface AppShellProps {
  sidebar: ReactElement;
  topBar: ReactElement;
  mainContent: ReactElement;
  rightPane: ReactElement;
  commandPalette?: ReactElement;
}

const pageToPaneMap: Record<string, 'main' | 'settings' | 'toaster' | 'notifications' | 'dataDemo'> = {
  dashboard: 'main',
  settings: 'settings',
  toaster: 'toaster',
  notifications: 'notifications',
  'data-demo': 'dataDemo',
};

// Helper hook to get the previous value of a prop or state
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}


export function AppShell({ sidebar, topBar, mainContent, rightPane, commandPalette }: AppShellProps) {
  const {
    sidebarState,
    dispatch,
    autoExpandSidebar,
    toggleSidebar,
    hoveredPane,
    peekSidebar,
    draggedPage,
    dragHoverTarget,
    bodyState,
    sidePaneContent,
    reducedMotion,
    isTopBarVisible,
  } = useAppShell();
  
  const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;

  const { isDarkMode, toggleDarkMode } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = location.pathname.split('/')[1] || 'dashboard';
  const appRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const rightPaneRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const topBarContainerRef = useRef<HTMLDivElement>(null)
  const mainAreaRef = useRef<HTMLDivElement>(null)

  const prevActivePage = usePrevious(activePage);
  const prevSidePaneContent = usePrevious(sidePaneContent);

  const isSplitView = bodyState === BODY_STATES.SPLIT_VIEW;

  // Custom hooks for logic
  useResizableSidebar(sidebarRef, resizeHandleRef);
  useResizableRightPane();
  useSidebarAnimations(sidebarRef, resizeHandleRef);
  useBodyStateAnimations(appRef, mainContentRef, rightPaneRef, topBarContainerRef, mainAreaRef);
  
  // Animation for pane swapping
  useLayoutEffect(() => {
    if (reducedMotion || bodyState !== BODY_STATES.SPLIT_VIEW || !prevActivePage || !prevSidePaneContent) {
      return;
    }

    const pageForPrevSidePane = Object.keys(pageToPaneMap).find(
      key => pageToPaneMap[key as keyof typeof pageToPaneMap] === prevSidePaneContent
    );

    // Check if a swap occurred by comparing current state with previous state
    if (activePage === pageForPrevSidePane && sidePaneContent === pageToPaneMap[prevActivePage as keyof typeof pageToPaneMap]) {
      const mainEl = mainAreaRef.current;
      const rightEl = rightPaneRef.current;

      if (mainEl && rightEl) {
        const mainWidth = mainEl.offsetWidth;
        const rightWidth = rightEl.offsetWidth;

        const tl = gsap.timeline();
        
        // Animate main content FROM where right pane was TO its new place
        tl.from(mainEl, {
          x: rightWidth, duration: 0.4, ease: 'power3.inOut'
        });

        // Animate right pane FROM where main content was TO its new place
        tl.from(rightEl, {
          x: -mainWidth, duration: 0.4, ease: 'power3.inOut'
        }, 0); // Start at the same time
      }
    }
  }, [activePage, sidePaneContent, bodyState, prevActivePage, prevSidePaneContent, reducedMotion]);
  
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

    // If we drop the page that's already in the side pane, just make it the main view.
    const paneContentOfDraggedPage = pageToPaneMap[draggedPage];
    if (paneContentOfDraggedPage === sidePaneContent && (bodyState === BODY_STATES.SIDE_PANE || bodyState === BODY_STATES.SPLIT_VIEW)) {
      navigate(`/${draggedPage}`, { replace: true });
    } 
    // New context-aware logic: if we are in normal view and drop a NEW page on the left
    else if (bodyState === BODY_STATES.NORMAL && draggedPage !== activePage) {
        const originalActivePagePaneContent = pageToPaneMap[activePage];
        if (originalActivePagePaneContent) {
            navigate(`/${draggedPage}?view=split&right=${originalActivePagePaneContent}`, { replace: true });
        } else {
            // Fallback for pages that can't be in a pane
            navigate(`/${draggedPage}`, { replace: true });
        }
    } else { // Default behavior: just make the dropped page the main one
      // If in split view, replace the main content and keep the right pane
      if (bodyState === BODY_STATES.SPLIT_VIEW) {
        const rightPane = location.search.split('right=')[1];
        if (rightPane) {
          navigate(`/${draggedPage}?view=split&right=${rightPane}`, { replace: true });
          return;
        }
      }
      navigate(`/${draggedPage}`, { replace: true });
    }
    
    dispatch({ type: 'SET_DRAGGED_PAGE', payload: null });
    dispatch({ type: 'SET_DRAG_HOVER_TARGET', payload: null });
  }, [draggedPage, activePage, bodyState, sidePaneContent, navigate, dispatch, location]);

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
      let mainPage = activePage;
      // If dropping the currently active page to the right,
      // set a default page (e.g., dashboard) as the new active page.
      if (draggedPage === activePage) {
        mainPage = 'dashboard';
      }

      navigate(`/${mainPage}?view=split&right=${pane}`, { replace: true });
    }
    dispatch({ type: 'SET_DRAGGED_PAGE', payload: null });
    dispatch({ type: 'SET_DRAG_HOVER_TARGET', payload: null });
  }, [draggedPage, dispatch, bodyState, activePage, navigate]);

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
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div
            ref={topBarContainerRef}
            className={cn(
              "absolute top-0 left-0 right-0 z-30",
              isFullscreen && "z-0"
            )}
            onMouseEnter={() => { if (isSplitView) dispatch({ type: 'SET_HOVERED_PANE', payload: null }); }}
          >
            {topBarWithProps}
          </div>

          <div className="flex flex-1 min-h-0">
            <div
              ref={mainAreaRef}
              className="relative flex-1 overflow-hidden bg-background"
              onMouseEnter={() => { if (isSplitView && !draggedPage) dispatch({ type: 'SET_HOVERED_PANE', payload: 'left' }); }}
              onMouseLeave={() => { if (isSplitView && !draggedPage) dispatch({ type: 'SET_HOVERED_PANE', payload: null }); }}
            >
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
              {isSplitView && hoveredPane === 'left' && !draggedPage && (
                <div className={cn("absolute right-4 z-50 transition-all", isTopBarVisible ? 'top-24' : 'top-4')}>
                  <ViewModeSwitcher pane="main" />
                </div>
              )}
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
                onMouseEnter={() => { if (isSplitView && !draggedPage) dispatch({ type: 'SET_HOVERED_PANE', payload: 'right' }); }}
                onMouseLeave={() => { if (isSplitView && !draggedPage) dispatch({ type: 'SET_HOVERED_PANE', payload: null }); }}
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
                {hoveredPane === 'right' && !draggedPage && (
                  <div className={cn("absolute right-4 z-[70] transition-all", isTopBarVisible ? 'top-24' : 'top-4')}>
                    <ViewModeSwitcher pane="right" />
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