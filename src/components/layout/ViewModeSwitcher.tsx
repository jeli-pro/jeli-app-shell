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
  Layers
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
  } = useAppShell()
  const { activePage } = useAppStore()

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
    </div>
  )
}