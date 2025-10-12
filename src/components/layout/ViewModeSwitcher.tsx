import { cn } from '@/lib/utils'
import { useAppShell } from '@/context/AppShellContext'
import { useAppStore, type ActivePage } from '@/store/appStore'
import { BODY_STATES } from '@/lib/utils'
import { type AppShellState } from '@/context/AppShellContext'
import {
  Columns,
  PanelRightOpen,
  SplitSquareHorizontal,
  Maximize,
  Minimize,
  Layers,
  X,
  ArrowLeftRight
} from 'lucide-react'

const pageToPaneMap: Record<ActivePage, AppShellState['sidePaneContent']> = {
  dashboard: 'main',
  settings: 'settings',
  toaster: 'toaster',
  notifications: 'notifications',
};

export function ViewModeSwitcher({ pane }: { pane?: 'main' | 'right' }) {
  const {
    bodyState,
    sidePaneContent,
    openSidePane,
    closeSidePane,
    toggleFullscreen,
    toggleSplitView,
    fullscreenTarget,
    dispatch,
  } = useAppShell()
  const { activePage, setActivePage } = useAppStore()

  const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;
  const isThisPaneFullscreen = isFullscreen && (
    (pane === 'main' && fullscreenTarget !== 'right') ||
    (pane === 'right' && fullscreenTarget === 'right') ||
    (!pane && !fullscreenTarget) // Global switcher, global fullscreen
  );

  const handleSidePaneClick = () => {
    const paneContent = pageToPaneMap[activePage] || 'details';
    if (pane === 'right') return; // Don't allow opening a side pane from a side pane
    // If side pane is already open with the current page's content, clicking again should close it.
    if (bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === paneContent) {
      closeSidePane();
    } else {
      openSidePane(paneContent);
    }
  };
  
  const handleSplitViewClick = () => {
      const paneContent = pageToPaneMap[activePage] || 'details';
      if (pane === 'right') return; // Don't allow splitting from a side pane in this simple case
      toggleSplitView(paneContent);
  }

  const handleSwitchPanes = () => {
    if (bodyState !== BODY_STATES.SPLIT_VIEW) return;

    // 1. Get current active page's corresponding pane content
    const newSidePaneContent = pageToPaneMap[activePage];

    // 2. Find the page that corresponds to the current side pane content
    const newActivePage = Object.entries(pageToPaneMap).find(
      ([, value]) => value === sidePaneContent
    )?.[0] as ActivePage | undefined;

    if (newActivePage && newSidePaneContent) {
      // 3. Swap them
      setActivePage(newActivePage);
      dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: newSidePaneContent });
    }
  };

  const handleClosePane = () => {
    if (bodyState !== BODY_STATES.SPLIT_VIEW) return;
    if (pane === 'right') {
      closeSidePane();
    } else if (pane === 'main') {
      const pageToBecomeActive = Object.entries(pageToPaneMap).find(
        ([, value]) => value === sidePaneContent
      )?.[0] as ActivePage | undefined;
      
      if (pageToBecomeActive) {
        setActivePage(pageToBecomeActive);
      }
      closeSidePane();
    }
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-card rounded-full border border-border">
      <button
        onClick={() => {
            // "Normal view" button should always just close any open panes.
            if (bodyState === BODY_STATES.SIDE_PANE || bodyState === BODY_STATES.SPLIT_VIEW) {
              closeSidePane();
            }
            // This button is hidden in fullscreen, but as a fallback, it should exit.
            if (isFullscreen) {
              toggleFullscreen();
            }
        }}
        className={cn(
          'h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors group',
          bodyState === BODY_STATES.NORMAL && 'bg-accent text-accent-foreground'
        )}
        title="Normal View"
      >
        <Columns className="w-4 h-4" />
      </button>
      <button
        onClick={handleSidePaneClick}
        className={cn(
          'h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors group',
          bodyState === BODY_STATES.SIDE_PANE && 'bg-accent text-accent-foreground'
        )}
        title="Side Pane View"
      >
        <PanelRightOpen className="w-4 h-4" />
      </button>
      <button
        onClick={handleSplitViewClick}
        className={cn(
          'h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors group',
          bodyState === BODY_STATES.SPLIT_VIEW && 'bg-accent text-accent-foreground'
        )}
        title={bodyState === BODY_STATES.SPLIT_VIEW ? 'Switch to Overlay View' : 'Switch to Split View'}
      >
        {bodyState === BODY_STATES.SPLIT_VIEW ? <Layers className="w-4 h-4" /> : <SplitSquareHorizontal className="w-4 h-4" />}
      </button>
      <button
        onClick={() => toggleFullscreen(pane)}
        className={cn(
          'h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors group',
          isThisPaneFullscreen && 'bg-accent text-accent-foreground'
        )}
        title="Toggle Fullscreen"
      >
        {isThisPaneFullscreen ? (
          <Minimize className="w-4 h-4" />
        ) : (
          <Maximize className="w-4 h-4" />
        )}
      </button>
      {bodyState === BODY_STATES.SPLIT_VIEW && (
        <button
          onClick={handleSwitchPanes}
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors group"
          title="Switch Panes"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>
      )}
      {bodyState === BODY_STATES.SPLIT_VIEW && (
        <button
          onClick={handleClosePane}
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-destructive/20 transition-colors group"
          title="Close Pane"
        >
          <X className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
        </button>
      )}
    </div>
  )
}