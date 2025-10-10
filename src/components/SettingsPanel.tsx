import { useState } from 'react'
import { 
  Settings, 
  X, 
  Moon, 
  Sun, 
  Zap, 
  Eye, 
  Minimize2, 
  RotateCcw,
  Monitor,
  Smartphone,
  Palette,
  Accessibility
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/appStore'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const {
    isDarkMode,
    reducedMotion,
    compactMode,
    autoExpandSidebar,
    sidebarWidth,
    toggleDarkMode,
    setReducedMotion,
    setCompactMode,
    setAutoExpandSidebar,
    setSidebarWidth,
    resetToDefaults
  } = useAppStore()

  const [tempSidebarWidth, setTempSidebarWidth] = useState(sidebarWidth)

  const handleSidebarWidthChange = (width: number) => {
    setTempSidebarWidth(width)
    setSidebarWidth(width)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] animate-fade-in">
      <div className="fixed right-0 top-0 h-full w-96 bg-card border-l border-border shadow-2xl animate-slide-in">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Appearance */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Appearance
              </h3>
              
              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Toggle dark theme</p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    isDarkMode ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
                      isDarkMode ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>

              {/* Compact Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Minimize2 className="w-4 h-4" />
                  <div>
                    <p className="font-medium">Compact Mode</p>
                    <p className="text-sm text-muted-foreground">Reduce spacing and sizes</p>
                  </div>
                </div>
                <button
                  onClick={() => setCompactMode(!compactMode)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    compactMode ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
                      compactMode ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Behavior */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Behavior
              </h3>

              {/* Auto Expand Sidebar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-4 h-4" />
                  <div>
                    <p className="font-medium">Auto Expand Sidebar</p>
                    <p className="text-sm text-muted-foreground">Expand on hover when collapsed</p>
                  </div>
                </div>
                <button
                  onClick={() => setAutoExpandSidebar(!autoExpandSidebar)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    autoExpandSidebar ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
                      autoExpandSidebar ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>

              {/* Sidebar Width */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Monitor className="w-4 h-4" />
                  <div>
                    <p className="font-medium">Sidebar Width</p>
                    <p className="text-sm text-muted-foreground">{tempSidebarWidth}px</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="200"
                    max="500"
                    step="10"
                    value={tempSidebarWidth}
                    onChange={(e) => handleSidebarWidthChange(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>200px</span>
                    <span>350px</span>
                    <span>500px</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Accessibility className="w-4 h-4" />
                Accessibility
              </h3>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4" />
                  <div>
                    <p className="font-medium">Reduced Motion</p>
                    <p className="text-sm text-muted-foreground">Minimize animations</p>
                  </div>
                </div>
                <button
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    reducedMotion ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
                      reducedMotion ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Quick Presets
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    setCompactMode(false)
                    setReducedMotion(false)
                    setSidebarWidth(320)
                  }}
                  className="p-3 bg-accent/30 hover:bg-accent/50 rounded-lg transition-colors text-left"
                >
                  <Monitor className="w-4 h-4 mb-2" />
                  <p className="font-medium text-sm">Desktop</p>
                  <p className="text-xs text-muted-foreground">Spacious layout</p>
                </button>
                
                <button 
                  onClick={() => {
                    setCompactMode(true)
                    setReducedMotion(true)
                    setSidebarWidth(240)
                  }}
                  className="p-3 bg-accent/30 hover:bg-accent/50 rounded-lg transition-colors text-left"
                >
                  <Smartphone className="w-4 h-4 mb-2" />
                  <p className="font-medium text-sm">Mobile</p>
                  <p className="text-xs text-muted-foreground">Compact layout</p>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <button
              onClick={resetToDefaults}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Custom slider styles
const sliderStyles = `
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: hsl(var(--primary));
  cursor: pointer;
  border: 2px solid hsl(var(--background));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: hsl(var(--primary));
  cursor: pointer;
  border: 2px solid hsl(var(--background));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = sliderStyles
  document.head.appendChild(styleSheet)
}