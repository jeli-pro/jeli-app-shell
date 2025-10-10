import { useRef } from 'react'
import { PanelRight } from 'lucide-react'
import { SettingsContent } from './SettingsContent'
import { useAppStore } from '@/store/appStore'

export function SettingsPage() {
  const { openSidePane, setActivePage, setTopBarVisible } = useAppStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastScrollTop = useRef(0)

  const handleMoveToSidePane = () => {
    openSidePane('settings');
    setActivePage('dashboard');
  }

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto p-6 lg:px-12 space-y-8"
      onScroll={() => {
        if (!scrollRef.current) return
        const { scrollTop } = scrollRef.current
        
        if (scrollTop > lastScrollTop.current && scrollTop > 200) {
          setTopBarVisible(false);
        } else if (scrollTop < lastScrollTop.current || scrollTop <= 0) {
          setTopBarVisible(true);
        }
        
        lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Customize your experience. Changes are saved automatically.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
            <button
              onClick={handleMoveToSidePane}
              className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors" title="Move to Side Pane">
              <PanelRight className="w-5 h-5" />
            </button>
        </div>
      </div>

      <SettingsContent />
    </div>
  )
}