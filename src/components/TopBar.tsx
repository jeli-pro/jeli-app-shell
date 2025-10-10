import { 
  Menu, 
  Maximize, 
  Minimize, 
  Moon, 
  Sun,
  Settings,
  Command,
  Zap,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BODY_STATES } from '@/lib/utils'
import { useAppStore } from '@/store/appStore'

interface TopBarProps {
  onToggleSidebar: () => void
  onToggleFullscreen: () => void
  onToggleDarkMode: () => void
}

export function TopBar({
  onToggleSidebar,
  onToggleFullscreen,
  onToggleDarkMode
}: TopBarProps) {
  const { 
    bodyState, 
    isDarkMode, 
    openSidePane, 
    sidePaneContent 
  } = useAppStore()

  return (
    <div className="h-20 bg-card/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 z-50">
      {/* Left Section - Sidebar Controls & Breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* Sidebar Controls */}
        <button
          onClick={onToggleSidebar}
          className={cn(
            "h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
          )}
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2 text-sm">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Home</a>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-foreground">Dashboard</span>
        </div>
      </div>

      {/* Right Section - View Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Actions */}
        <button
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group"
          title="Command Palette (Ctrl+K)"
        >
          <Command className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        <button
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group"
          title="Quick Actions"
        >
          <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        <div className="w-px h-6 bg-border mx-2" />

        {/* Body State Controls */}
        <button
          onClick={() => openSidePane('details')}
          className={cn(
            "h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group",
            bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === 'details' && "bg-accent"
          )}
          title="Toggle Side Pane"
        >
          <div className="w-5 h-5 flex group-hover:scale-110 transition-transform">
            <div className="w-1/2 h-full bg-current opacity-60 rounded-l-sm" />
            <div className="w-1/2 h-full bg-current rounded-r-sm" />
          </div>
        </button>

        <button
          onClick={onToggleFullscreen}
          className={cn(
            "h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group",
            bodyState === BODY_STATES.FULLSCREEN && "bg-accent"
          )}
          title="Toggle Fullscreen"
        >
          {bodyState === BODY_STATES.FULLSCREEN ? (
            <Minimize className="w-5 h-5 group-hover:scale-110 transition-transform" />
          ) : (
            <Maximize className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
        </button>

        <div className="w-px h-6 bg-border mx-2" />

        {/* Theme and Settings */}
        <button
          onClick={onToggleDarkMode}
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 group-hover:scale-110 transition-transform" />
          ) : (
            <Moon className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
        </button>

        <button
          onClick={() => openSidePane('settings')}
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group"
          title="Settings"
        >
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>
    </div>
  )
}