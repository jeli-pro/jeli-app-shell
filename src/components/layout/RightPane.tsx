import { forwardRef, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronRight, X } from 'lucide-react'
import { cn, BODY_STATES } from '@/lib/utils'
import { useAppShell } from '@/context/AppShellContext'

interface RightPaneProps {
  children?: ReactNode
  header?: ReactNode
  className?: string
}

export const RightPane = forwardRef<HTMLDivElement, RightPaneProps>(({ children, header, className }, ref) => {
  const { dispatch, bodyState, fullscreenTarget, toggleFullscreen } = useAppShell();
  const [, setSearchParams] = useSearchParams()
  const isSplitView = bodyState === BODY_STATES.SPLIT_VIEW;
  const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;

  if (isFullscreen && fullscreenTarget !== 'right') {
    return null;
  }

  return (
    <aside
      ref={ref}
      className={cn(
        "border-l border-border flex flex-col h-full overflow-hidden",
        isSplitView && "relative bg-background",
        !isSplitView && !isFullscreen && "fixed top-0 right-0 z-[60] bg-card", // side pane overlay
        isFullscreen && fullscreenTarget === 'right' && "fixed inset-0 z-[60] bg-card", // fullscreen
        className,
      )}
    >
      {isFullscreen && fullscreenTarget === 'right' && (
        <button
          onClick={() => toggleFullscreen()}
          className="fixed top-6 right-6 lg:right-12 z-[100] h-12 w-12 flex items-center justify-center rounded-full bg-card/50 backdrop-blur-sm hover:bg-card/75 transition-colors group"
          title="Exit Fullscreen"
        >
          <X className="w-6 h-6 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
        </button>
      )}
      {bodyState !== BODY_STATES.SPLIT_VIEW && !isFullscreen && (
        <button
          onClick={() => {
            setSearchParams(prev => {
              const newParams = new URLSearchParams(prev)
              newParams.delete('sidePane')
              return newParams
            }, { replace: true })
          }}
          className="absolute top-1/2 -left-px -translate-y-1/2 -translate-x-full w-8 h-16 bg-card border border-r-0 border-border rounded-l-lg flex items-center justify-center hover:bg-accent transition-colors group z-10"
          title="Close pane"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      )}
      <div 
        className={cn(
          "absolute top-0 left-0 w-2 h-full bg-transparent hover:bg-primary/20 cursor-col-resize z-50 transition-colors duration-200 group -translate-x-1/2"
        )}
        onMouseDown={(e) => {
          e.preventDefault()
          dispatch({ type: 'SET_IS_RESIZING_RIGHT_PANE', payload: true });
        }}
      >
        <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200 mx-auto" />
      </div>
      {header && (
        <div className="flex items-center justify-between p-4 border-b border-border h-20 flex-shrink-0 pl-6">
          {header}
        </div>
      )}
      <div className={cn("flex-1 overflow-y-auto")}>
        {children}
      </div>
    </aside>
  )
})
RightPane.displayName = "RightPane"