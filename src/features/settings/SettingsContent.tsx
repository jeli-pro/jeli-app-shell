import { useState } from 'react'
import { 
  Moon, 
  Sun, 
  Zap, 
  Eye, 
  Minimize2, 
  RotateCcw,
  Monitor,
  Smartphone,
  Palette,
  Accessibility,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppShellStore } from '@/store/appShell.store'
import { SettingsToggle } from './SettingsToggle'
import { SettingsSection } from './SettingsSection'

const colorPresets = [
  { name: 'Default Blue', value: '220 84% 60%' },
  { name: 'Rose', value: '346.8 77.2% 49.8%' },
  { name: 'Green', value: '142.1 76.2% 36.3%' },
  { name: 'Orange', value: '24.6 95% 53.1%' },
  { name: 'Violet', value: '262.1 83.3% 57.8%' },
  { name: 'Slate', value: '215.3 20.3% 65.1%' }
]

export function SettingsContent() {
  const sidebarWidth = useAppShellStore(s => s.sidebarWidth);
  const compactMode = useAppShellStore(s => s.compactMode);
  const primaryColor = useAppShellStore(s => s.primaryColor);
  const autoExpandSidebar = useAppShellStore(s => s.autoExpandSidebar);
  const reducedMotion = useAppShellStore(s => s.reducedMotion);
  const isDarkMode = useAppShellStore(s => s.isDarkMode);
  
  const {
    setSidebarWidth, setCompactMode, setPrimaryColor, setAutoExpandSidebar,
    setReducedMotion, resetToDefaults, toggleDarkMode
  } = useAppShellStore.getState();

  const [tempSidebarWidth, setTempSidebarWidth] = useState(sidebarWidth)

  const handleSidebarWidthChange = (width: number) => {
    setTempSidebarWidth(width)
    setSidebarWidth(width);
  }

  const handleReset = () => {
    resetToDefaults();
    setTempSidebarWidth(280); // Reset temp state as well
  }

  const handleSetSidebarWidth = (payload: number) => {
    setSidebarWidth(payload);
    setTempSidebarWidth(payload);
  };

  return (
    <div className="space-y-10">
      {/* Appearance */}
      <SettingsSection icon={<Palette />} title="Appearance">
        {/* Dark Mode */}
        <SettingsToggle
          icon={isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          title="Dark Mode"
          description="Toggle dark theme"
          checked={isDarkMode}
          onCheckedChange={toggleDarkMode}
        />

        {/* Compact Mode */}
        <SettingsToggle
          icon={<Minimize2 className="w-4 h-4" />}
          title="Compact Mode"
          description="Reduce spacing and sizes"
          checked={compactMode}
          onCheckedChange={setCompactMode}
        />

        {/* Accent Color */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Palette className="w-4 h-4" />
            <div>
              <p className="font-medium">Accent Color</p>
              <p className="text-sm text-muted-foreground">Customize the main theme color</p>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2 pt-1">
            {colorPresets.map(color => {
              const isActive = color.value === primaryColor
              return (
                <button
                  key={color.name}
                  title={color.name}
                  onClick={() => setPrimaryColor(color.value)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center",
                    isActive ? 'border-primary' : 'border-transparent'
                  )}
                  style={{ backgroundColor: `hsl(${color.value})` }}
                >{isActive && <Check className="w-5 h-5 text-primary-foreground" />}</button>
              )
            })}
          </div>
        </div>
      </SettingsSection>

      {/* Behavior */}
      <SettingsSection icon={<Zap />} title="Behavior">
        {/* Auto Expand Sidebar */}
        <SettingsToggle
          icon={<Eye className="w-4 h-4" />}
          title="Auto Expand Sidebar"
          description="Expand on hover when collapsed"
          checked={autoExpandSidebar}
          onCheckedChange={setAutoExpandSidebar}
        />

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
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>200px</span>
              <span>350px</span>
              <span>500px</span>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Accessibility */}
      <SettingsSection icon={<Accessibility />} title="Accessibility">
        {/* Reduced Motion */}
        <SettingsToggle
          icon={<Zap className="w-4 h-4" />}
          title="Reduced Motion"
          description="Minimize animations"
          checked={reducedMotion}
          onCheckedChange={setReducedMotion}
        />
      </SettingsSection>

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
              handleSetSidebarWidth(320)
            }}
            className="p-4 bg-accent/30 hover:bg-accent/50 rounded-xl transition-colors text-left"
          >
            <Monitor className="w-4 h-4 mb-2" />
            <p className="font-medium text-sm">Desktop</p>
            <p className="text-xs text-muted-foreground">Spacious layout</p>
          </button>
          
          <button 
            onClick={() => {
              setCompactMode(true)
              setReducedMotion(true)
              handleSetSidebarWidth(240)
            }}
            className="p-4 bg-accent/30 hover:bg-accent/50 rounded-xl transition-colors text-left"
          >
            <Smartphone className="w-4 h-4 mb-2" />
            <p className="font-medium text-sm">Mobile</p>
            <p className="text-xs text-muted-foreground">Compact layout</p>
          </button>
        </div>
      </div>
      <div className="pt-6 border-t border-border">
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}

// Custom slider styles
const sliderStyles = `
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: hsl(var(--primary));
  cursor: pointer;
  border: 3px solid hsl(var(--background));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: -7px;
}

.slider::-moz-range-thumb {
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: hsl(var(--primary));
  cursor: pointer;
  border: 3px solid hsl(var(--background));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = sliderStyles
  document.head.appendChild(styleSheet)
}