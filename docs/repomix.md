# Directory Structure
```
src/
  components/
    AppShell.tsx
    DashboardContent.tsx
    DemoContent.tsx
    EnhancedSidebar.tsx
    index.ts
    MainContent.tsx
    RightPane.tsx
    SettingsContent.tsx
    SettingsPage.tsx
    TopBar.tsx
  lib/
    utils.ts
  store/
    appStore.ts
  App.tsx
  index.css
  main.tsx
index.html
package.json
postcss.config.js
tailwind.config.js
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: src/components/DashboardContent.tsx
```typescript
import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Calendar,
  Clock,
  MessageSquare,
  FileText,
  Star,
  ChevronRight,
  Plus,
  Filter,
  Search,
  MoreVertical,
  ArrowDown,
  PanelRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DemoContent } from './DemoContent'
import { useAppStore } from '@/store/appStore'
import { BODY_STATES } from '@/lib/utils'

interface StatsCard {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ReactNode
}

interface ActivityItem {
  id: string
  type: 'comment' | 'file' | 'meeting' | 'task'
  title: string
  description: string
  time: string
  user: string
}

const statsCards: StatsCard[] = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: <DollarSign className="w-5 h-5" />
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+180.1%",
    trend: "up",
    icon: <Users className="w-5 h-5" />
  },
  {
    title: "Conversion Rate",
    value: "12.5%",
    change: "+19%",
    trend: "up",
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    title: "Performance",
    value: "573ms",
    change: "-5.3%",
    trend: "down",
    icon: <Activity className="w-5 h-5" />
  }
]

const recentActivity: ActivityItem[] = [
  {
    id: "1",
    type: "comment",
    title: "New comment on Project Alpha",
    description: "Sarah Johnson added a comment to the design review",
    time: "2 minutes ago",
    user: "SJ"
  },
  {
    id: "2",
    type: "file",
    title: "Document uploaded",
    description: "quarterly-report.pdf was uploaded to Documents",
    time: "15 minutes ago",
    user: "MD"
  },
  {
    id: "3",
    type: "meeting",
    title: "Meeting scheduled",
    description: "Weekly standup meeting scheduled for tomorrow 9 AM",
    time: "1 hour ago",
    user: "RW"
  },
  {
    id: "4",
    type: "task",
    title: "Task completed",
    description: "UI wireframes for mobile app completed",
    time: "2 hours ago",
    user: "AL"
  }
]

interface DashboardContentProps {
  isInSidePane?: boolean;
}

export function DashboardContent({ isInSidePane = false }: DashboardContentProps) {
    const contentRef = useRef<HTMLDivElement>(null)
    const cardsRef = useRef<(HTMLDivElement | null)[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [showScrollToBottom, setShowScrollToBottom] = useState(false)
    const { bodyState, openSidePane } = useAppStore()

    const handleScroll = () => {
      if (!contentRef.current) return
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current
      // Show if scrolled down and not at the bottom
      setShowScrollToBottom(scrollTop > 200 && scrollTop < scrollHeight - clientHeight - 200)
    }

    useEffect(() => {
      const contentEl = contentRef.current
      if (contentEl) {
        contentEl.addEventListener('scroll', handleScroll)
        return () => contentEl.removeEventListener('scroll', handleScroll)
      }
    }, [])

    const scrollToBottom = () => {
      contentRef.current?.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }

    // Animate content based on body state
    useEffect(() => {
      if (!contentRef.current) return

      const content = contentRef.current
      const cards = cardsRef.current.filter(Boolean)

      switch (bodyState) {
        case BODY_STATES.FULLSCREEN:
          gsap.to(content, {
            scale: 1.02,
            duration: 0.4,
            ease: "power3.out"
          })
          break
        default:
          gsap.to(content, {
            scale: 1,
            duration: 0.4,
            ease: "power3.out"
          })
          break
      }

      // Stagger animation for cards
      gsap.fromTo(cards, 
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out"
        }
      )

    }, [bodyState])

    const getTypeIcon = (type: ActivityItem['type']) => {
      switch (type) {
        case 'comment':
          return <MessageSquare className="w-4 h-4" />
        case 'file':
          return <FileText className="w-4 h-4" />
        case 'meeting':
          return <Calendar className="w-4 h-4" />
        case 'task':
          return <Star className="w-4 h-4" />
        default:
          return <Activity className="w-4 h-4" />
      }
    }

    return (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome to the amazing app shell demo! Explore all the features and customization options.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border-none rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors">
                <Filter className="w-5 h-5" />
              </button>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 h-10">
                <Plus className="w-5 h-5" />
                <span>New Project</span>
              </button>
              {!isInSidePane && (
                <button
                  onClick={() => openSidePane('main')}
                  className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors" title="Move to Side Pane">
                  <PanelRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto space-y-8 pt-8"
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => (
                <div
                key={stat.title}
                ref={el => cardsRef.current[index] = el}
                className="bg-card p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    {stat.icon}
                  </div>
                  <div className={cn(
                    "text-sm font-medium",
                    stat.trend === 'up' ? "text-green-600" : "text-red-600"
                  )}>
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                </div>
              </div>
              ))}
            </div>

            {/* Demo Content */}
            <DemoContent />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Analytics Chart */}
              <div className="bg-card p-6 rounded-2xl border border-border/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Analytics Overview</h3>
                  <button className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Mock Chart */}
                <div className="h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-xl flex items-center justify-center border border-border/50">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">Chart visualization would go here</p>
                  </div>
                </div>
              </div>

              {/* Recent Projects */}
              <div className="bg-card p-6 rounded-2xl border border-border/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Recent Projects</h3>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1">
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: "E-commerce Platform", progress: 75, team: 5, deadline: "Dec 15" },
                    { name: "Mobile App Redesign", progress: 45, team: 3, deadline: "Jan 20" },
                    { name: "Marketing Website", progress: 90, team: 4, deadline: "Dec 5" }
                  ].map((project) => (
                    <div key={project.name} className="p-4 bg-accent/30 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{project.name}</h4>
                        <span className="text-sm text-muted-foreground">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mb-3">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{project.team} team members</span>
                        <span>Due {project.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-card p-6 rounded-2xl border border-border/50">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {[
                    { icon: <FileText className="w-4 h-4" />, label: "Create Document", color: "bg-blue-500/10 text-blue-600" },
                    { icon: <Calendar className="w-4 h-4" />, label: "Schedule Meeting", color: "bg-green-500/10 text-green-600" },
                    { icon: <Users className="w-4 h-4" />, label: "Invite Team", color: "bg-purple-500/10 text-purple-600" },
                    { icon: <BarChart3 className="w-4 h-4" />, label: "View Reports", color: "bg-orange-500/10 text-orange-600" }
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="w-full flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors text-left"
                    >
                      <div className={cn("p-2 rounded-full", action.color)}>
                        {action.icon}
                      </div>
                      <span className="font-medium">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-card p-6 rounded-2xl border border-border/50">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-accent/30 rounded-xl transition-colors cursor-pointer">
                      <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
                        {getTypeIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-1">{activity.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{activity.time}</span>
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-medium">
                            {activity.user}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {showScrollToBottom && (
            <button
              onClick={scrollToBottom}
              className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all animate-fade-in z-50"
              style={{ animation: 'bounce 2s infinite' }}
              title="Scroll to bottom"
            >
              <ArrowDown className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    )
}
```

## File: src/components/SettingsContent.tsx
```typescript
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

export function SettingsContent() {
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

  return (
    <div className="space-y-10">
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
              "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
              isDarkMode ? "bg-primary" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "inline-block h-5 w-5 transform rounded-full bg-background transition-transform",
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
              "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
              compactMode ? "bg-primary" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "inline-block h-5 w-5 transform rounded-full bg-background transition-transform",
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
              "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
              autoExpandSidebar ? "bg-primary" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "inline-block h-5 w-5 transform rounded-full bg-background transition-transform",
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
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer slider"
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
              "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
              reducedMotion ? "bg-primary" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "inline-block h-5 w-5 transform rounded-full bg-background transition-transform",
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
              setSidebarWidth(240)
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
          onClick={resetToDefaults}
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
```

## File: src/components/SettingsPage.tsx
```typescript
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
```

## File: src/lib/utils.ts
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SIDEBAR_STATES = {
  HIDDEN: 'hidden',
  COLLAPSED: 'collapsed', 
  EXPANDED: 'expanded',
  PEEK: 'peek'
} as const

export const BODY_STATES = {
  NORMAL: 'normal',
  FULLSCREEN: 'fullscreen',
  SIDE_PANE: 'side_pane'
} as const

export type SidebarState = typeof SIDEBAR_STATES[keyof typeof SIDEBAR_STATES]
export type BodyState = typeof BODY_STATES[keyof typeof BODY_STATES]
```

## File: src/main.tsx
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## File: index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Amazing App Shell</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## File: postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## File: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## File: src/App.tsx
```typescript
import { AppShell } from './components/AppShell'
import './index.css'

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <AppShell />
    </div>
  )
}

export default App
```

## File: src/index.css
```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 220 84% 60%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 220 84% 60%;
    --radius: 1rem;
  }

  .dark {
    --background: 240 6% 12%;
    --foreground: 210 40% 98%;
    --card: 240 6% 14%;
    --card-foreground: 210 40% 98%;
    --popover: 240 6% 14%;
    --popover-foreground: 210 40% 98%;
    --primary: 220 84% 60%;
    --primary-foreground: 210 40% 98%;
    --secondary: 240 5% 20%;
    --secondary-foreground: 210 40% 98%;
    --muted: 240 5% 20%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 240 5% 20%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 240 5% 20%;
    --input: 240 5% 20%;
    --ring: 220 84% 60%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom scrollbar styles */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-transparent;
}

::-webkit-scrollbar-thumb {
  @apply bg-border rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-muted-foreground/50;
}
```

## File: tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## File: tsconfig.node.json
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

## File: vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

## File: src/components/DemoContent.tsx
```typescript
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { 
  Sparkles, 
  Zap, 
  Rocket, 
  Star, 
  Heart,
  Layers,
  Code,
  Palette,
  Smartphone,
  Monitor,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/appStore'

export function DemoContent() {
  const { bodyState, sidebarState, isDarkMode, compactMode } = useAppStore()
  const contentRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!contentRef.current) return

    const cards = cardsRef.current.filter(Boolean)
    
    // Animate cards on mount
    gsap.fromTo(cards, 
      { y: 30, opacity: 0, scale: 0.95 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out"
      }
    )
  }, [])

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Amazing Animations",
      description: "Powered by GSAP for smooth, buttery animations",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Built with Vite and optimized for performance",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Multiple States",
      description: "Fullscreen, side pane, and normal viewing modes",
      color: "from-emerald-500 to-green-500"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "TypeScript",
      description: "Fully typed with excellent developer experience",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Beautiful Design",
      description: "Shadcn/ui components with Tailwind CSS",
      color: "from-teal-500 to-emerald-500"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Customizable",
      description: "Extensive settings and preferences panel",
      color: "from-slate-500 to-gray-500"
    }
  ]

  const stats = [
    { label: "Components", value: "12+", color: "text-emerald-600" },
    { label: "Animations", value: "25+", color: "text-teal-600" },
    { label: "States", value: "7", color: "text-primary" },
    { label: "Settings", value: "10+", color: "text-amber-600" }
  ]

  return (
    <div ref={contentRef} className="p-8 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Rocket className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Amazing App Shell
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A super amazing application shell with resizable sidebar, multiple body states, 
          smooth animations, and comprehensive settings - all built with modern web technologies.
        </p>
        
        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-12 mt-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={cn("text-2xl font-bold", stat.color)}>{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            ref={el => cardsRef.current[index] = el}
            className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-6 hover:border-primary/30 hover:bg-accent/30 transition-all duration-300 cursor-pointer"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-transform">
                {feature.icon}
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Technology Stack */}
      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500" />
          Technology Stack
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "React 18", desc: "Latest React with hooks" },
            { name: "TypeScript", desc: "Type-safe development" },
            { name: "Vite", desc: "Lightning fast build tool" },
            { name: "Tailwind CSS", desc: "Utility-first styling" },
            { name: "GSAP", desc: "Professional animations" },
            { name: "Zustand", desc: "Lightweight state management" },
            { name: "Shadcn/ui", desc: "Beautiful components" },
            { name: "Lucide Icons", desc: "Consistent iconography" }
          ].map((tech) => (
            <div key={tech.name} className="bg-background rounded-xl p-4 border border-border/50">
              <h4 className="font-medium">{tech.name}</h4>
              <p className="text-sm text-muted-foreground">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Current State Display */}
      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          Current App State
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-background rounded-xl">
            <div className="text-sm text-muted-foreground">Sidebar</div>
            <div className="font-medium capitalize">{sidebarState}</div>
          </div>
          <div className="text-center p-3 bg-background rounded-xl">
            <div className="text-sm text-muted-foreground">Body State</div>
            <div className="font-medium capitalize">{bodyState.replace('_', ' ')}</div>
          </div>
          <div className="text-center p-3 bg-background rounded-xl">
            <div className="text-sm text-muted-foreground">Theme</div>
            <div className="font-medium">{isDarkMode ? 'Dark' : 'Light'}</div>
          </div>
          <div className="text-center p-3 bg-background rounded-xl">
            <div className="text-sm text-muted-foreground">Mode</div>
            <div className="font-medium">{compactMode ? 'Compact' : 'Normal'}</div>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          Try It Out!
        </h2>
        <p className="text-muted-foreground">
          Use the controls in the top bar to explore different states, toggle the sidebar, 
          or open settings to customize the experience. The sidebar is resizable by dragging the edge!
        </p>
        
        <div className="flex items-center justify-center gap-4 pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Smartphone className="w-4 h-4" />
            <span>Responsive</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4" />
            <span>Fast</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="w-4 h-4" />
            <span>Beautiful</span>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## File: src/components/index.ts
```typescript
export { AppShell } from './AppShell'
export { TopBar } from './TopBar'
export { MainContent } from './MainContent'
export { RightPane } from './RightPane'
```

## File: package.json
```json
{
  "name": "amazing-app-shell",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "gsap": "^3.12.2",
    "zustand": "^4.4.7",
    "lucide-react": "^0.294.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.1.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2",
    "vite": "^4.5.0",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

## File: src/components/RightPane.tsx
```typescript
import { forwardRef } from 'react'
import { SlidersHorizontal, Settings, ChevronRight, LayoutDashboard, ChevronsLeftRight } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'
import { SettingsContent } from './SettingsContent'
import { DashboardContent } from './DashboardContent'

export const RightPane = forwardRef<HTMLDivElement>((_props, ref) => {
  const { closeSidePane, setIsResizingRightPane, sidePaneContent, setActivePage } = useAppStore()

  const isSettings = sidePaneContent === 'settings'
  const isMain = sidePaneContent === 'main'

  const handleMaximize = () => {
    if (isMain) {
      setActivePage('dashboard')
    } else if (isSettings) {
      setActivePage('settings')
    }
    closeSidePane()
  }

  return (
    <aside ref={ref} className="bg-card border-l border-border flex flex-col h-full overflow-hidden fixed top-0 right-0 z-[60]">
      <button
        onClick={closeSidePane}
        className="absolute top-1/2 -left-px -translate-y-1/2 -translate-x-full w-8 h-16 bg-card border border-r-0 border-border rounded-l-lg flex items-center justify-center hover:bg-accent transition-colors group z-10"
        title="Close pane"
      >
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
      </button>
      <div 
        className={cn(
          "absolute top-0 left-0 w-2 h-full bg-transparent hover:bg-primary/20 cursor-col-resize z-50 transition-colors duration-200 group -translate-x-1/2"
        )}
        onMouseDown={(e) => {
          e.preventDefault()
          setIsResizingRightPane(true)
        }}
      >
        <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200 mx-auto" />
      </div>
      <div className="flex items-center justify-between p-4 border-b border-border h-20 flex-shrink-0 pl-6">
        <div className="flex items-center gap-2">
          {isMain && <LayoutDashboard className="w-5 h-5" />}
          {isSettings && <Settings className="w-5 h-5" />}
          {!isMain && !isSettings && <SlidersHorizontal className="w-5 h-5" />}
          <h2 className="text-lg font-semibold whitespace-nowrap">
            {isMain ? 'Dashboard' : isSettings ? 'Settings' : 'Details Panel'}
          </h2>
        </div>
        
        {(isMain || isSettings) && (
          <button
            onClick={handleMaximize}
            className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors mr-2"
            title="Move to Main View"
          >
            <ChevronsLeftRight className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {isMain ? (
          <div className="p-6 h-full"><DashboardContent isInSidePane={true} /></div>
        ) : isSettings ? (
          <div className="p-6"><SettingsContent /></div>
        ) : (
          <div className="p-6"><p className="text-muted-foreground">This is the side pane. It can be used to display contextual information, forms, or actions related to the main content.</p></div>
        )}
      </div>
    </aside>
  )
})

RightPane.displayName = "RightPane"
```

## File: src/store/appStore.ts
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SIDEBAR_STATES, BODY_STATES, type SidebarState, type BodyState } from '@/lib/utils'

export type ActivePage = 'dashboard' | 'settings';

interface AppState {
  // UI States
  sidebarState: SidebarState
  bodyState: BodyState
  isDarkMode: boolean
  sidePaneContent: 'details' | 'settings' | 'main'
  activePage: ActivePage
  sidebarWidth: number
  rightPaneWidth: number
  isResizing: boolean
  isResizingRightPane: boolean
  
  // User Preferences
  autoExpandSidebar: boolean
  reducedMotion: boolean
  compactMode: boolean
  
  // Actions
  setSidebarState: (state: SidebarState) => void
  setBodyState: (state: BodyState) => void
  toggleDarkMode: () => void
  setActivePage: (page: ActivePage) => void
  setSidebarWidth: (width: number) => void
  setRightPaneWidth: (width: number) => void
  setIsResizing: (resizing: boolean) => void
  setIsResizingRightPane: (resizing: boolean) => void
  setAutoExpandSidebar: (auto: boolean) => void
  setReducedMotion: (reduced: boolean) => void
  setCompactMode: (compact: boolean) => void
  
  // Composite Actions
  toggleSidebar: () => void
  hideSidebar: () => void
  showSidebar: () => void
  peekSidebar: () => void
  toggleFullscreen: () => void
  openSidePane: (content: 'details' | 'settings' | 'main') => void
  closeSidePane: () => void
  resetToDefaults: () => void
}

const defaultState = {
  sidebarState: SIDEBAR_STATES.EXPANDED as SidebarState,
  bodyState: BODY_STATES.NORMAL as BodyState,
  sidePaneContent: 'details' as const,
  activePage: 'dashboard' as ActivePage,
  isDarkMode: false,
  sidebarWidth: 280,
  rightPaneWidth: typeof window !== 'undefined' ? Math.max(300, Math.round(window.innerWidth * 0.6)) : 400,
  isResizing: false,
  isResizingRightPane: false,
  autoExpandSidebar: true,
  reducedMotion: false,
  compactMode: false,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...defaultState,
      
      // Basic setters
      sidePaneContent: 'details',
      setSidebarState: (state) => set({ sidebarState: state }),
      setBodyState: (state) => set({ bodyState: state }),
      setActivePage: (page) => set({ activePage: page }),
      toggleDarkMode: () => {
        const newMode = !get().isDarkMode
        set({ isDarkMode: newMode })
        document.documentElement.classList.toggle('dark', newMode)
      },
      setSidebarWidth: (width) => set({ sidebarWidth: Math.max(200, Math.min(500, width)) }),
      setRightPaneWidth: (width) => set({ rightPaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, width)) }),
      setIsResizing: (resizing) => set({ isResizing: resizing }),
      setIsResizingRightPane: (resizing) => set({ isResizingRightPane: resizing }),
      setAutoExpandSidebar: (auto) => set({ autoExpandSidebar: auto }),
      setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
      setCompactMode: (compact) => set({ compactMode: compact }),
      
      // Composite actions
      toggleSidebar: () => {
        const current = get().sidebarState
        if (current === SIDEBAR_STATES.HIDDEN) {
          set({ sidebarState: SIDEBAR_STATES.COLLAPSED })
        } else if (current === SIDEBAR_STATES.COLLAPSED) {
          set({ sidebarState: SIDEBAR_STATES.EXPANDED })
        } else if (current === SIDEBAR_STATES.EXPANDED) {
          set({ sidebarState: SIDEBAR_STATES.COLLAPSED })
        }
      },
      
      hideSidebar: () => set({ sidebarState: SIDEBAR_STATES.HIDDEN }),
      showSidebar: () => set({ sidebarState: SIDEBAR_STATES.EXPANDED }),
      peekSidebar: () => set({ sidebarState: SIDEBAR_STATES.PEEK }),
      
      toggleFullscreen: () => {
        const current = get().bodyState
        set({ 
          bodyState: current === BODY_STATES.FULLSCREEN ? BODY_STATES.NORMAL : BODY_STATES.FULLSCREEN 
        })
      },
      
      openSidePane: (content) => {
        const { bodyState, sidePaneContent } = get()
        if (bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === content) {
          // If it's open with same content, close it.
          set({ bodyState: BODY_STATES.NORMAL });
        } else {
          // If closed, or different content, open with new content.
          set({ bodyState: BODY_STATES.SIDE_PANE, sidePaneContent: content });
        }
      },
      closeSidePane: () => {
        set({ bodyState: BODY_STATES.NORMAL })
      },
      
      resetToDefaults: () => set(defaultState),
    }),
    {
      name: 'app-preferences',
      partialize: (state) => ({
        sidebarState: state.sidebarState,
        bodyState: state.bodyState,
        activePage: state.activePage,
        sidePaneContent: state.sidePaneContent,
        isDarkMode: state.isDarkMode,
        sidebarWidth: state.sidebarWidth,
        rightPaneWidth: state.rightPaneWidth,
        autoExpandSidebar: state.autoExpandSidebar,
        reducedMotion: state.reducedMotion,
        compactMode: state.compactMode,
      }),
    }
  )
)

// Initialize dark mode on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('app-preferences')
  if (stored) {
    const parsed = JSON.parse(stored)
    if (parsed.state?.isDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }
}
```

## File: src/components/AppShell.tsx
```typescript
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { EnhancedSidebar } from './EnhancedSidebar'
import { MainContent } from './MainContent'
import { RightPane } from './RightPane'
import { TopBar } from './TopBar'
import { useAppStore } from '@/store/appStore'
import { SIDEBAR_STATES, BODY_STATES } from '@/lib/utils'

export function AppShell() {
  const {
    sidebarState,
    bodyState,
    sidebarWidth,
    isDarkMode,
    isResizing,
    rightPaneWidth,
    isResizingRightPane,
    setRightPaneWidth,
    setSidebarState,
    openSidePane,
    closeSidePane,
    setIsResizing,
    setSidebarWidth,
    toggleSidebar,
    peekSidebar,
    toggleFullscreen,
    setIsResizingRightPane,
    toggleDarkMode,
    reducedMotion,
    autoExpandSidebar
  } = useAppStore()
  
  const appRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const rightPaneRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const topBarContainerRef = useRef<HTMLDivElement>(null)

  // Animation duration based on reduced motion preference
  const animationDuration = reducedMotion ? 0.1 : 0.4

  // Resize functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const newWidth = Math.max(200, Math.min(500, e.clientX))
      setSidebarWidth(newWidth)
      
      if (sidebarRef.current) {
        gsap.set(sidebarRef.current, { width: newWidth })
      }
      if (resizeHandleRef.current) {
        gsap.set(resizeHandleRef.current, { left: newWidth })
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    if (isResizing) {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, setIsResizing, setSidebarWidth])

  // Resize functionality for Right Pane
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRightPane) return
      
      const newWidth = window.innerWidth - e.clientX
      setRightPaneWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizingRightPane(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    if (isResizingRightPane) {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
    }
  }, [isResizingRightPane, setIsResizingRightPane, setRightPaneWidth])

  // GSAP animations for sidebar transitions
  useEffect(() => {
    if (!sidebarRef.current || !mainContentRef.current || !resizeHandleRef.current) return

    const sidebar = sidebarRef.current
    const handle = resizeHandleRef.current
    
    let targetWidth = 0
    let targetOpacity = 1

    if (bodyState === BODY_STATES.FULLSCREEN) {
      targetWidth = 0;
      targetOpacity = 0;
    } else {
      switch (sidebarState) {
        case SIDEBAR_STATES.HIDDEN:
          targetWidth = 0
          targetOpacity = 0
          break
        case SIDEBAR_STATES.COLLAPSED:
          targetWidth = 64
          targetOpacity = 1
          break
        case SIDEBAR_STATES.EXPANDED:
          targetWidth = sidebarWidth
          targetOpacity = 1
          break
        case SIDEBAR_STATES.PEEK:
          targetWidth = sidebarWidth * 0.8
          targetOpacity = 0.95
          break
      }
    }

    const tl = gsap.timeline({ ease: "power3.out" })
    
    tl.to(sidebar, {
      width: targetWidth,
      opacity: targetOpacity,
      duration: animationDuration,
    })
    tl.to(handle, {
      left: targetWidth,
      duration: animationDuration,
    }, 0)

  }, [sidebarState, sidebarWidth, bodyState, animationDuration])

  // GSAP animations for body state transitions
  useEffect(() => {
    if (!mainContentRef.current || !sidebarRef.current || !rightPaneRef.current) return

    const ease = "power3.out"
    const isFullscreen = bodyState === BODY_STATES.FULLSCREEN
    const isSidePane = bodyState === BODY_STATES.SIDE_PANE

    // Right pane animation
    gsap.to(rightPaneRef.current, {
      width: rightPaneWidth,
      x: isSidePane ? 0 : rightPaneWidth + 5, // +5 to hide border
      duration: animationDuration,
      ease,
    })

    gsap.to(topBarContainerRef.current, {
      y: isFullscreen ? '-100%' : '0%',
      duration: animationDuration,
      ease,
    })
    
    // Add backdrop for side pane
    const backdrop = document.querySelector('.app-backdrop')
    if (isSidePane) {
      if (!backdrop) {
        const el = document.createElement('div')
        el.className = 'app-backdrop fixed inset-0 bg-black/30 z-[55]'
        appRef.current?.appendChild(el)
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: animationDuration })
        el.onclick = () => closeSidePane()
      }
    } else {
      if (backdrop) {
        gsap.to(backdrop, { opacity: 0, duration: animationDuration, onComplete: () => backdrop.remove() })
      }
    }
  }, [bodyState, animationDuration, rightPaneWidth, closeSidePane])

  return (
    <div 
      ref={appRef}
      className={cn(
        "relative h-screen w-screen overflow-hidden bg-background transition-colors duration-300",
        isDarkMode && "dark"
      )}
    >
      <div className="flex h-screen overflow-hidden">
        {/* Enhanced Sidebar */}
        <EnhancedSidebar
          ref={sidebarRef}
          onMouseEnter={() => {
            if (autoExpandSidebar && sidebarState === SIDEBAR_STATES.COLLAPSED) {
              peekSidebar()
            }
          }}
          onMouseLeave={() => {
            if (autoExpandSidebar && sidebarState === SIDEBAR_STATES.PEEK) {
              setSidebarState(SIDEBAR_STATES.COLLAPSED)
            }
          }}
        />

        {/* Resize Handle */}
        {sidebarState !== SIDEBAR_STATES.HIDDEN && (
          <div
            ref={resizeHandleRef}
            className={cn(
              "absolute top-0 w-2 h-full bg-transparent hover:bg-primary/20 cursor-col-resize z-50 transition-colors duration-200 group -translate-x-1/2"
            )}
            onMouseDown={(e) => {
              e.preventDefault()
              setIsResizing(true)
            }}
          >
            <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200 mx-auto" />
          </div>
        )}

        {/* Main Content Area */}
        <div className="relative flex-1 overflow-hidden bg-background">
          <div ref={topBarContainerRef} className="absolute inset-x-0 top-0 z-30">
            <TopBar
              onToggleSidebar={toggleSidebar}
              onToggleFullscreen={toggleFullscreen}
              onToggleDarkMode={toggleDarkMode}
            />
          </div>
          
          {/* Main Content */}
          <MainContent
            ref={mainContentRef}
            bodyState={bodyState}
            onToggleFullscreen={toggleFullscreen}
          />
        </div>
      </div>
      <RightPane ref={rightPaneRef} />
    </div>
  )
}
```

## File: src/components/MainContent.tsx
```typescript
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
      return null;
    }
    
    const isContentVisible = (activePage === 'dashboard' && !isDashboardInSidePane) || (activePage === 'settings' && !isSettingsInSidePane);

    return (
      <div
        ref={ref}
        className={cn(
        "flex flex-col h-full overflow-hidden transition-all duration-300 p-6 pt-[calc(80px+1.5rem)]",
        bodyState === BODY_STATES.FULLSCREEN && "absolute inset-0 z-40 bg-background !p-6"
        )}
      >
        {bodyState === BODY_STATES.FULLSCREEN && isContentVisible && (
          <button
            onClick={onToggleFullscreen}
            className="fixed top-6 right-6 z-[100] h-12 w-12 flex items-center justify-center rounded-full bg-card/50 backdrop-blur-sm hover:bg-card/75 transition-colors group"
            title="Exit Fullscreen"
          >
            <X className="w-6 h-6 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
          </button>
        )}

        <div className="h-full">
          {renderContent()}
        </div>
      </div>
    )
  }
)
```

## File: src/components/TopBar.tsx
```typescript
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
    sidePaneContent,
    activePage,
    setActivePage,
  } = useAppStore()

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
          onClick={handleSettingsClick}
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group"
          title="Settings"
        >
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>
    </div>
  )
}
```

## File: src/components/EnhancedSidebar.tsx
```typescript
import React, { forwardRef, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { 
  Home, 
  Search, 
  Bell, 
  User, 
  Settings, 
  HelpCircle, 
  FileText, 
  Calendar, 
  Mail,
  FolderOpen,
  Bookmark,
  Download,
  Star,
  Trash2,
  ChevronDown,
  Layout
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/appStore'
import { SIDEBAR_STATES, BODY_STATES } from '@/lib/utils'

interface NavItem {
  icon: React.ReactNode
  label: string
  href: string
  badge?: number
  isActive?: boolean
  children?: NavItem[]
}

interface NavSection {
  title: string
  items: NavItem[]
  collapsible?: boolean
  defaultExpanded?: boolean
}

const navigationSections: NavSection[] = [
  {
    title: "Main",
    items: [
      { icon: <Home className="w-4 h-4" />, label: "Dashboard", href: "/" },
      { icon: <Search className="w-4 h-4" />, label: "Search", href: "/search" },
      { icon: <Bell className="w-4 h-4" />, label: "Notifications", href: "/notifications", badge: 3 },
    ]
  },
  {
    title: "Workspace",
    collapsible: true,
    defaultExpanded: true,
    items: [
      { 
        icon: <FileText className="w-4 h-4" />, 
        label: "Documents", 
        href: "/documents",
        children: [
          { icon: <FileText className="w-3 h-3" />, label: "Recent", href: "/documents/recent" },
          { icon: <Star className="w-3 h-3" />, label: "Starred", href: "/documents/starred" },
          { icon: <Trash2 className="w-3 h-3" />, label: "Trash", href: "/documents/trash" },
        ]
      },
      { icon: <FolderOpen className="w-4 h-4" />, label: "Projects", href: "/projects" },
      { icon: <Calendar className="w-4 h-4" />, label: "Calendar", href: "/calendar" },
      { icon: <Mail className="w-4 h-4" />, label: "Messages", href: "/messages", badge: 12 },
    ]
  },
  {
    title: "Personal",
    collapsible: true,
    defaultExpanded: false,
    items: [
      { icon: <Bookmark className="w-4 h-4" />, label: "Bookmarks", href: "/bookmarks" },
      { icon: <Star className="w-4 h-4" />, label: "Favorites", href: "/favorites" },
      { icon: <Download className="w-4 h-4" />, label: "Downloads", href: "/downloads" },
    ]
  }
]

const bottomNavItems: NavItem[] = [
  { icon: <User className="w-4 h-4" />, label: "Profile", href: "/profile" },
  { icon: <Settings className="w-4 h-4" />, label: "Settings", href: "/settings" },
  { icon: <HelpCircle className="w-4 h-4" />, label: "Help", href: "/help" },
]

interface SidebarProps {
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export const EnhancedSidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ onMouseEnter, onMouseLeave }, ref) => {
    const { sidebarState, sidebarWidth, reducedMotion, compactMode, activePage, setActivePage, openSidePane, bodyState, sidePaneContent } = useAppStore()
    const contentRef = useRef<HTMLDivElement>(null)
    const sectionsRef = useRef<(HTMLDivElement | null)[]>([])
    const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
      new Set(navigationSections.filter(s => s.defaultExpanded).map(s => s.title))
    )

    const isCollapsed = sidebarState === SIDEBAR_STATES.COLLAPSED
    const isHidden = sidebarState === SIDEBAR_STATES.HIDDEN
    const isPeek = sidebarState === SIDEBAR_STATES.PEEK
    const animationDuration = reducedMotion ? 0.1 : 0.3

    // Toggle section expansion
    const toggleSection = (sectionTitle: string) => {
      setExpandedSections(prev => {
        const newSet = new Set(prev)
        if (newSet.has(sectionTitle)) {
          newSet.delete(sectionTitle)
        } else {
          newSet.add(sectionTitle)
        }
        return newSet
      })
    }

    // Animate content visibility
    useEffect(() => {
      if (!contentRef.current) return

      const labels = contentRef.current.querySelectorAll('.nav-label')
      const badges = contentRef.current.querySelectorAll('.nav-badge')
      const sectionTitles = contentRef.current.querySelectorAll('.section-title')
      const chevrons = contentRef.current.querySelectorAll('.section-chevron')

      if (isCollapsed) {
        gsap.to([labels, badges, sectionTitles, chevrons], {
          opacity: 0,
          scale: 0.8,
          duration: animationDuration,
          ease: "power2.out"
        })
      } else {
        gsap.to([labels, badges, sectionTitles, chevrons], {
          opacity: 1,
          scale: 1,
          duration: animationDuration,
          delay: 0.1,
          ease: "power2.out"
        })
      }
    }, [isCollapsed, animationDuration])

    // Hover animations for nav items
    const handleItemHover = (element: HTMLElement, isHovering: boolean) => {
      if (!element) return

      gsap.to(element, {
        scale: isHovering ? 1.02 : 1,
        x: isHovering ? 4 : 0,
        duration: animationDuration,
        ease: "power2.out"
      })
    }

    if (isHidden) {
      return null
    }

    const renderNavItem = (item: NavItem, depth = 0) => {
      const pageName = item.label.toLowerCase();
      const isDashboard = pageName === 'dashboard';
      const isSettings = pageName === 'settings';

      const isDashboardActive = activePage === 'dashboard';
      const isSettingsActive = activePage === 'settings' || (bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === 'settings');
      const isPageActive = (isDashboard && isDashboardActive) || (isSettings && isSettingsActive);

      const handleClick = () => {
        if (isDashboard) {
          setActivePage('dashboard');
        } else if (isSettings) {
          const isSettingsInSidePane = bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === 'settings'
          // If we're on the settings page and it's not in the side pane, treat this as a "minimize" action.
          if (activePage === 'settings' && !isSettingsInSidePane) {
            openSidePane('settings');
            setActivePage('dashboard');
          } else {
            // In all other cases (on dashboard page, or settings already in pane), just toggle the settings side pane.
            openSidePane('settings');
          }
        }
        // Could add logic for other links here if routing was implemented
      };

      return (
        <div key={item.label} className={cn("space-y-1", depth > 0 && "ml-6")}>
        <button
          className={cn(
            "group relative flex items-center gap-3 rounded-lg cursor-pointer transition-all duration-200 w-full text-left",
            compactMode ? "px-2 py-1.5" : "px-4 py-2.5",
            "hover:bg-accent",
            (item.isActive || isPageActive) && "bg-primary text-primary-foreground hover:bg-primary/90",
            depth > 0 && "text-sm",
            isCollapsed && "justify-center"
          )}
          onMouseEnter={(e) => handleItemHover(e.currentTarget, true)}
          onMouseLeave={(e) => handleItemHover(e.currentTarget, false)}
          onClick={handleClick}
        >
          <div className="flex-shrink-0">
            {item.icon}
          </div>
          
          {!isCollapsed && (
            <>
              <span className="nav-label flex-1 font-medium truncate">
                {item.label}
              </span>
              
              {item.badge && (
                <span className="nav-badge bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}

              {item.children && (
                <ChevronDown className="w-3 h-3 transition-transform" />
              )}
            </>
          )}

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {item.label}
              {item.badge && (
                <span className="ml-2 bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
          )}
        </button>

        {/* Children items */}
        {item.children && !isCollapsed && (
          <div className="space-y-1">
            {item.children.map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative bg-card flex-shrink-0",
          "h-full overflow-hidden",
          isPeek && "shadow-xl z-40",
          compactMode && "text-sm"
        )}
        style={{ width: sidebarWidth }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Background blur effect for peek mode */}
        {isPeek && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        )}

        <div 
          ref={contentRef}
          className={cn(
            "relative z-10 h-full flex flex-col",
            compactMode ? "p-3" : "p-4"
          )}
        >
          {/* Logo */}
          <div
            className={cn(
              "flex items-center gap-3",
              isCollapsed ? "justify-center" : "",
              compactMode ? "h-10" : "h-16"
            )}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center flex-shrink-0">
              <Layout className="w-5 h-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-xl text-foreground nav-label truncate">
                AppShell
              </span>
            )}
          </div>

          {/* Navigation Sections */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-6 pt-4">
            {navigationSections.map((section, sectionIndex) => {
              const isExpanded = expandedSections.has(section.title)
              
              return (
                <div 
                  key={section.title}
                  ref={el => sectionsRef.current[sectionIndex] = el}
                  className="space-y-1"
                >
                  {!isCollapsed && (
                    <div 
                      className={cn(
                        "flex items-center justify-between px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider",
                        section.collapsible && "cursor-pointer hover:text-foreground transition-colors"
                      )}
                      onClick={() => section.collapsible && toggleSection(section.title)}
                    >
                      <span className="section-title">{section.title}</span>
                      {section.collapsible && (
                        <ChevronDown 
                          className={cn(
                            "section-chevron w-3 h-3 transition-transform",
                            isExpanded ? "rotate-0" : "-rotate-90"
                          )} 
                        />
                      )}
                    </div>
                  )}
                  
                  {(!section.collapsible || isExpanded || isCollapsed) && (
                    <nav className="space-y-1">
                      {section.items.map(item => renderNavItem(item))}
                    </nav>
                  )}
                </div>
              )
            })}
          </div>

          {/* Bottom Navigation */}
          <div className={cn("pt-4 border-t border-border", compactMode && "pt-3")}>
            <nav className="space-y-1">
              {bottomNavItems.map((item) => renderNavItem(item))}
            </nav>

            {/* User Profile */}
            {!isCollapsed && (
              <div className={cn("mt-6 p-3 bg-accent/50 rounded-xl", compactMode && "mt-4 p-2")}>
                <div className="flex items-center gap-3">
                  <div className={cn("bg-primary rounded-full flex items-center justify-center", compactMode ? "w-8 h-8" : "w-10 h-10")}>
                    <User className={cn("text-primary-foreground", compactMode ? "w-4 h-4" : "w-5 h-5")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-medium truncate nav-label", compactMode ? "text-xs" : "text-sm")}>John Doe</p>
                    <p className={cn("text-muted-foreground truncate nav-label", compactMode ? "text-[11px]" : "text-xs")}>john@example.com</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)

EnhancedSidebar.displayName = "EnhancedSidebar"
```
