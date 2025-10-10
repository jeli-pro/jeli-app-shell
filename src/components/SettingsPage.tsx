import { PanelRight } from 'lucide-react'
import { SettingsContent } from './SettingsContent'
import { useAppStore } from '@/store/appStore'

export function SettingsPage() {
  const { openSidePane, setActivePage } = useAppStore()

  const handleMoveToSidePane = () => {
    openSidePane('settings');
    setActivePage('dashboard');
  }

  return (
    <div className="h-full flex flex-col">
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
      <div className="flex-1 overflow-y-auto pt-8">
        <SettingsContent />
      </div>
    </div>
  )
}