import { forwardRef } from 'react'
import { X, SlidersHorizontal } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'

export const RightPane = forwardRef<HTMLDivElement>((_props, ref) => {
  const { toggleSidePane, setIsResizingRightPane } = useAppStore()

  return (
    <aside ref={ref} className="bg-card border-l border-border flex flex-col h-full overflow-hidden fixed top-0 right-0 z-[60]">
      <div 
        className={cn(
          "absolute top-0 left-0 w-2 h-full bg-transparent hover:bg-primary/20 cursor-col-resize z-50 transition-colors duration-200 group -translate-x-1/2"
        )}
        onMouseDown={(e) => {
          e.preventDefault()
          setIsResizingRightPane(true)
        }}
      >
        <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200 mx-auto" />
      </div>
      <div className="flex items-center justify-between p-4 border-b border-border h-20 flex-shrink-0 pl-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          <h2 className="text-lg font-semibold whitespace-nowrap">Details Panel</h2>
        </div>
        <button
          onClick={toggleSidePane}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-muted-foreground">
          This is the side pane. It can be used to display contextual information, forms, or actions related to the main content.
        </p>
      </div>
    </aside>
  )
})

RightPane.displayName = "RightPane"