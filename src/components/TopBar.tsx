import { useState } from 'react'
import {
  Menu, 
  Maximize, 
  Minimize, 
  Moon, 
  Sun,
  Settings,
  Command,
  Zap,
  ChevronRight,
  Search,
  Filter,
  Plus,
  PanelRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BODY_STATES } from '@/lib/utils'
import { useAppStore } from '@/store/appStore'
import { UserDropdown } from './UserDropdown'

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
    sidePaneContent,
    activePage,
    setActivePage,
    searchTerm,
    setCommandPaletteOpen,
    setSearchTerm,
  } = useAppStore()

  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const handleSettingsClick = () => {
    const isSettingsInSidePane = bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === 'settings'

    // If we're on the settings page and it's not in the side pane, treat this as a "minimize" action.
    if (activePage === 'settings' && !isSettingsInSidePane) {
      openSidePane('settings');
      setActivePage('dashboard');
    } else {
      // In all other cases (on dashboard page, or settings already in pane),
      // just toggle the settings side pane.
      openSidePane('settings');
    }
  }

  const handleMoveToSidePane = () => {
    const mapping = { dashboard: 'main', settings: 'settings', toaster: 'toaster', notifications: 'notifications' } as const;
    openSidePane(mapping[activePage]);
    if (activePage !== 'dashboard') setActivePage('dashboard');
  };

  return (
    <div className={cn(
      "h-20 bg-background border-b border-border flex items-center justify-between px-6 z-50 gap-4",
      {
        'transition-all duration-300 ease-in-out': activePage === 'dashboard',
      }
    )}>
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
        <div className={cn("hidden md:flex items-center gap-2 text-sm transition-opacity", {
          "opacity-0 pointer-events-none": isSearchFocused && activePage === 'dashboard'
        })}>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Home</a>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-foreground capitalize">{activePage}</span>
        </div>
      </div>

      {/* Right Section - Search, page controls, and global controls */}
      <div className={cn("flex items-center gap-3", isSearchFocused && activePage === 'dashboard' ? 'flex-1' : '')}>
        {/* Page-specific: Dashboard search and actions */}
        {activePage === 'dashboard' && (
          <div className="flex items-center gap-2 flex-1 justify-end">
            <div className={cn("relative transition-all duration-300 ease-in-out", isSearchFocused ? 'flex-1 max-w-lg' : 'w-auto')}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "pl-9 pr-4 py-2 h-10 border-none rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ease-in-out w-full",
                  isSearchFocused ? 'bg-background' : 'w-48'
                )}
              />
            </div>
             <button className="h-10 w-10 flex-shrink-0 flex items-center justify-center hover:bg-accent rounded-full transition-colors">
              <Filter className="w-5 h-5" />
            </button>
             <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 h-10 flex-shrink-0">
              <Plus className="w-5 h-5" />
              <span className={cn(isSearchFocused ? 'hidden sm:inline' : 'inline')}>New Project</span>
            </button>
          </div>
        )}
        
        {/* Page-specific: Move to side pane */}
        <div className={cn('flex items-center', isSearchFocused && activePage === 'dashboard' ? 'hidden md:flex' : '')}>
          {['dashboard', 'settings', 'toaster', 'notifications'].includes(activePage) && (
            <button onClick={handleMoveToSidePane} className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors" title="Move to Side Pane"><PanelRight className="w-5 h-5" /></button>
          )}
        </div>

        {/* Separator */}
        <div className={cn(
          'w-px h-6 bg-border mx-2', 
          !['dashboard', 'settings', 'toaster', 'notifications'].includes(activePage) || (isSearchFocused && activePage === 'dashboard') ? 'hidden' : ''
        )} />

        {/* Quick Actions */}
        <div className={cn('flex items-center gap-3', isSearchFocused && activePage === 'dashboard' ? 'hidden lg:flex' : '')}>

          <button
            onClick={() => setCommandPaletteOpen(true)}
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
          onClick={handleSettingsClick}
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group"
          title="Settings"
        >
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>
        <UserDropdown />
        </div>
      </div>
    </div>
  )
}