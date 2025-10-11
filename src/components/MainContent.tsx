import { forwardRef } from 'react'
import { 
  X,
  LayoutDashboard,
  Settings,
  Component,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BODY_STATES, type BodyState } from '@/lib/utils'
import { DashboardContent } from './DashboardContent'
import { SettingsPage } from './SettingsPage'
import { ToasterDemo } from './ToasterDemo'
import { useAppStore } from '@/store/appStore'
import { NotificationsPage } from './NotificationsPage'
import { ContentInSidePanePlaceholder } from './ContentInSidePanePlaceholder'

interface MainContentProps {
  bodyState: BodyState
  onToggleFullscreen: () => void
}

export const MainContent = forwardRef<HTMLDivElement, MainContentProps>(
  ({ bodyState, onToggleFullscreen }, ref) => {
    const { sidePaneContent, openSidePane, activePage, setActivePage } = useAppStore()

    const isDashboardInSidePane = sidePaneContent === 'main' && bodyState === BODY_STATES.SIDE_PANE
    const isSettingsInSidePane = sidePaneContent === 'settings' && bodyState === BODY_STATES.SIDE_PANE
    const isToasterInSidePane = sidePaneContent === 'toaster' && bodyState === BODY_STATES.SIDE_PANE
    const isNotificationsInSidePane = sidePaneContent === 'notifications' && bodyState === BODY_STATES.SIDE_PANE

    const renderContent = () => {
      if (activePage === 'dashboard') {
        if (isDashboardInSidePane) {
          return <ContentInSidePanePlaceholder 
            icon={LayoutDashboard} 
            title="Dashboard is in Side Pane" 
            pageName="dashboard"
            onBringBack={() => openSidePane('main')} 
          />;
        }
        return <DashboardContent />
      }

      if (activePage === 'settings') {
        if (isSettingsInSidePane) {
          return <ContentInSidePanePlaceholder 
            icon={Settings} 
            title="Settings are in Side Pane" 
            pageName="settings"
            onBringBack={() => {
              openSidePane('settings'); 
              setActivePage('settings');
            }}
          />;
        }
        return <SettingsPage />
      }
      if (activePage === 'toaster') {
        if (isToasterInSidePane) {
          return <ContentInSidePanePlaceholder
            icon={Component}
            title="Toaster Demo is in Side Pane"
            pageName="toaster demo"
            onBringBack={() => {
              openSidePane('toaster');
              setActivePage('toaster');
            }}
          />;
        }
        return <ToasterDemo />
      }
      if (activePage === 'notifications') {
        if (isNotificationsInSidePane) {
          return <ContentInSidePanePlaceholder
            icon={Bell}
            title="Notifications are in Side Pane"
            pageName="notifications"
            onBringBack={() => {
              openSidePane('notifications');
              setActivePage('notifications');
            }}
          />;
        }
        return <NotificationsPage />
      }
      return null;
    }
    
    const isContentVisible = (activePage === 'dashboard' && !isDashboardInSidePane) || 
                           (activePage === 'settings' && !isSettingsInSidePane) || 
                           (activePage === 'toaster' && !isToasterInSidePane) ||
                           (activePage === 'notifications' && !isNotificationsInSidePane);

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

        <div className="flex-1 min-h-0 flex flex-col">
          {renderContent()}
        </div>
      </div>
    )
  }
)