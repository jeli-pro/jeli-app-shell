import { useState } from 'react'
import { 
  Menu, 
  Maximize, 
  Minimize, 
  Moon, 
  Sun, 
  PanelLeft, 
  PanelLeftClose,
  Sidebar,
  Eye,
  Layout,
  Settings,
  Command,
  Zap
} from 'lucide-react'
import { SettingsPanel } from './SettingsPanel'
import { cn } from '@/lib/utils'
import { SIDEBAR_STATES, BODY_STATES, type SidebarState, type BodyState } from '@/lib/utils'

interface TopBarProps {
  sidebarState: SidebarState
  bodyState: BodyState
  isDarkMode: boolean
  onToggleSidebar: () => void
  onToggleFullscreen: () => void
  onToggleSidePane: () => void
  onToggleDarkMode: () => void
  onHideSidebar: () => void
  onShowSidebar: () => void
  onPeekSidebar: () => void
}

export function TopBar({
  sidebarState,
  bodyState,
  isDarkMode,
  onToggleSidebar,
  onToggleFullscreen,
  onToggleSidePane,
  onToggleDarkMode,
  onHideSidebar,
  onShowSidebar,
  onPeekSidebar
}: TopBarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-4 z-50">
      {/* Left Section - Logo and Sidebar Controls */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
            <Layout className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg text-foreground">Jeli</span>
        </div>

        {/* Sidebar Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleSidebar}
            className={cn(
              "p-2 rounded-md hover:bg-accent transition-colors",
              "tooltip-trigger"
            )}
            title="Toggle Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          <button
            onClick={onHideSidebar}
            className={cn(
              "p-2 rounded-md hover:bg-accent transition-colors",
              sidebarState === SIDEBAR_STATES.HIDDEN && "bg-accent"
            )}
            title="Hide Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>

          <button
            onClick={onShowSidebar}
            className={cn(
              "p-2 rounded-md hover:bg-accent transition-colors",
              sidebarState === SIDEBAR_STATES.EXPANDED && "bg-accent"
            )}
            title="Show Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onPeekSidebar}
            className={cn(
              "p-2 rounded-md hover:bg-accent transition-colors",
              sidebarState === SIDEBAR_STATES.PEEK && "bg-accent"
            )}
            title="Peek Sidebar"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Section - Status Indicators */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
          <Sidebar className="w-3 h-3" />
          <span className="capitalize">{sidebarState}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
          <Layout className="w-3 h-3" />
          <span className="capitalize">{bodyState.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Right Section - View Controls */}
      <div className="flex items-center gap-1">
        {/* Quick Actions */}
        <button
          className="p-2 rounded-md hover:bg-accent transition-colors group"
          title="Command Palette (Ctrl+K)"
        >
          <Command className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>

        <button
          className="p-2 rounded-md hover:bg-accent transition-colors group"
          title="Quick Actions"
        >
          <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Body State Controls */}
        <button
          onClick={onToggleSidePane}
          className={cn(
            "p-2 rounded-md hover:bg-accent transition-colors group",
            bodyState === BODY_STATES.SIDE_PANE && "bg-accent"
          )}
          title="Toggle Side Pane"
        >
          <div className="w-4 h-4 flex group-hover:scale-110 transition-transform">
            <div className="w-2 h-4 bg-current opacity-60" />
            <div className="w-2 h-4 bg-current" />
          </div>
        </button>

        <button
          onClick={onToggleFullscreen}
          className={cn(
            "p-2 rounded-md hover:bg-accent transition-colors group",
            bodyState === BODY_STATES.FULLSCREEN && "bg-accent"
          )}
          title="Toggle Fullscreen"
        >
          {bodyState === BODY_STATES.FULLSCREEN ? (
            <Minimize className="w-4 h-4 group-hover:scale-110 transition-transform" />
          ) : (
            <Maximize className="w-4 h-4 group-hover:scale-110 transition-transform" />
          )}
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Theme and Settings */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-md hover:bg-accent transition-colors group"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 group-hover:scale-110 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 group-hover:scale-110 transition-transform" />
          )}
        </button>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded-md hover:bg-accent transition-colors group"
          title="Settings"
        >
          <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  )
}