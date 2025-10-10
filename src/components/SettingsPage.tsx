import { useRef } from 'react'
import { SettingsContent } from './SettingsContent'
import { useAppStore } from '@/store/appStore'

export function SettingsPage() {
  const { setTopBarVisible } = useAppStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastScrollTop = useRef(0)

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
      </div>

      <SettingsContent />
    </div>
  )
}