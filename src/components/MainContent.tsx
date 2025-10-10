import { forwardRef } from 'react'
import { 
  X,
  LayoutDashboard,
  ChevronsLeftRight,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BODY_STATES, type BodyState } from '@/lib/utils'
import { DashboardContent } from './DashboardContent'
import { SettingsPage } from './SettingsPage'
import { ToasterDemo } from './ToasterDemo'
import { useAppStore } from '@/store/appStore'

interface MainContentProps {
  bodyState: BodyState
  onToggleFullscreen: () => void
}

export const MainContent = forwardRef<HTMLDivElement, MainContentProps>(
  ({ bodyState, onToggleFullscreen }, ref) => {
    const { sidePaneContent, openSidePane, activePage, setActivePage } = useAppStore()

    const isDashboardInSidePane = sidePaneContent === 'main' && bodyState === BODY_STATES.SIDE_PANE
    const isSettingsInSidePane = sidePaneContent === 'settings' && bodyState === BODY_STATES.SIDE_PANE

    const renderContent = () => {
      if (activePage === 'dashboard') {
        if (isDashboardInSidePane) {
          return (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <LayoutDashboard className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h2 className="text-2xl font-bold">Dashboard is in Side Pane</h2>
              <p className="text-muted-foreground mt-2 max-w-md">
                You've moved the dashboard to the side pane. You can bring it back or continue to navigate.
              </p>
              <button
                onClick={() => openSidePane('main')} // This will close it
                className="mt-6 bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 h-10"
              >
                <ChevronsLeftRight className="w-5 h-5" />
                <span>Bring Dashboard Back</span>
              </button>
            </div>
          )
        }
        return <DashboardContent />
      }

      if (activePage === 'settings') {
        if (isSettingsInSidePane) {
          return (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <Settings className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h2 className="text-2xl font-bold">Settings are in Side Pane</h2>
              <p className="text-muted-foreground mt-2 max-w-md">
                You've moved settings to the side pane. You can bring them back to the main view.
              </p>
              <button
                onClick={() => {
                  openSidePane('settings'); // This will close it
                  setActivePage('settings');
                }}
                className="mt-6 bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 h-10"
              >
                <ChevronsLeftRight className="w-5 h-5" />
                <span>Bring Settings Back</span>
              </button>
            </div>
          )
        }
        return <SettingsPage />
      }
      if (activePage === 'toaster') {
        return <ToasterDemo />
      }
      return null;
    }
    
    const isContentVisible = (activePage === 'dashboard' && !isDashboardInSidePane) || (activePage === 'settings' && !isSettingsInSidePane) || activePage === 'toaster';

    return (
      <div
        ref={ref}
        className={cn(
        "flex flex-col h-full overflow-hidden",
        bodyState === BODY_STATES.FULLSCREEN && "absolute inset-0 z-40 bg-background"
        )}
      >
        {bodyState === BODY_STATES.FULLSCREEN && isContentVisible && (
          <button
            onClick={onToggleFullscreen}
            className="fixed top-6 right-6 lg:right-12 z-[100] h-12 w-12 flex items-center justify-center rounded-full bg-card/50 backdrop-blur-sm hover:bg-card/75 transition-colors group"
            title="Exit Fullscreen"
          >
            <X className="w-6 h-6 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
          </button>
        )}

        <div className="flex-1 min-h-0">
          {renderContent()}
        </div>
      </div>
    )
  }
)