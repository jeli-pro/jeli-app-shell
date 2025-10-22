import { forwardRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BODY_STATES } from '@/lib/utils';
import { useAppShellStore } from '@/store/appShell.store';
import { ViewRenderer } from './ViewRenderer';

interface MainContentProps {
  viewId: string | null;
}

export const MainContent = forwardRef<HTMLDivElement, MainContentProps>(
  ({ viewId }, ref) => {
    const bodyState = useAppShellStore(s => s.bodyState);
    const fullscreenTarget = useAppShellStore(s => s.fullscreenTarget);
    const { toggleFullscreen } = useAppShellStore.getState();
    const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;

    if (isFullscreen && fullscreenTarget === 'right') {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
        "relative flex flex-col h-full overflow-hidden bg-background",
        isFullscreen && "fixed inset-0 z-[60]"
        )}
      >
        {isFullscreen && (
          <button
            onClick={() => toggleFullscreen()}
            className="fixed top-6 right-6 lg:right-12 z-[100] h-12 w-12 flex items-center justify-center rounded-full bg-card/50 backdrop-blur-sm hover:bg-card/75 transition-colors group"
            title="Exit Fullscreen"
          >
            <X className="w-6 h-6 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
          </button>
        )}

        <div className="flex-1 min-h-0 flex flex-col">
          <ViewRenderer viewId={viewId} />
        </div>
      </div>
    );
  }
);
MainContent.displayName = 'MainContent';