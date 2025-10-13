import {
  Menu, 
  Moon, 
  Sun,
  Settings,
  Command,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { BODY_STATES } from '@/lib/utils'
import { useAppStore } from '@/store/appStore'
import { useAppShell } from '@/context/AppShellContext'
import { UserDropdown } from './UserDropdown'
import { ViewModeSwitcher } from './ViewModeSwitcher'

interface TopBarProps {
  onToggleSidebar?: () => void
  onToggleDarkMode?: () => void
  children?: React.ReactNode
}

export function TopBar({
  onToggleSidebar,
  onToggleDarkMode,
  children,
}: TopBarProps) {
  const { bodyState } = useAppShell()
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    setCommandPaletteOpen,
    isDarkMode,
  } = useAppStore()

  const handleSettingsClick = () => {
    if (location.pathname === '/settings') {
      navigate({ pathname: '/dashboard', search: '?sidePane=settings' }, { replace: true });
    } else {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        if (newParams.get('sidePane') === 'settings') {
          newParams.delete('sidePane');
        } else {
          newParams.set('sidePane', 'settings');
          newParams.delete('view');
          newParams.delete('right');
        }
        return newParams;
      }, { replace: true });
    }
  };

  return (
    <div className={cn(
      "h-20 bg-background border-b border-border flex items-center justify-between px-6 z-50 gap-4"
    )}>
      {/* Left Section - Sidebar Controls & Breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* Sidebar Controls */}
        <button
          onClick={() => onToggleSidebar?.()}
          className={cn(
            "h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
          )}
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

      </div>

      {/* Right Section - page controls, and global controls */}
      <div className="flex items-center gap-3">
        {children}

        {/* Separator */}
        <div className="w-px h-6 bg-border mx-2" />

        {/* Quick Actions */}
        <div className="flex items-center gap-3">

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

        {bodyState !== BODY_STATES.SPLIT_VIEW && <ViewModeSwitcher />}

        <div className="w-px h-6 bg-border mx-2" />

        {/* Theme and Settings */}
        <button
          onClick={() => onToggleDarkMode?.()}
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