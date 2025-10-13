# Directory Structure
```
src/
  components/
    layout/
      AppShell.tsx
      EnhancedSidebar.tsx
      MainContent.tsx
      ViewModeSwitcher.tsx
  context/
    AppShellContext.tsx
  pages/
    DataDemo/
      index.tsx
  store/
    appStore.ts
    authStore.ts
  App.tsx
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

## File: src/store/authStore.ts
```typescript
import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  user: {
    email: string
    name: string
  } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  forgotPassword: (email: string) => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  user: null,
  
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock authentication - in real app, validate with backend
    if (email && password) {
      set({
        isAuthenticated: true,
        user: {
          email,
          name: email.split('@')[0], // Simple name extraction
        },
      })
    } else {
      throw new Error('Invalid credentials')
    }
  },
  
  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
    })
  },
  
  forgotPassword: async (email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In real app, send reset email via backend
    console.log(`Password reset link sent to: ${email}`)
  },
}))
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
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Library Build */
    "declaration": true,
    "emitDeclarationOnly": true,
    "declarationDir": "dist",

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": [
    "dist",
    "src/App.tsx",
    "src/main.tsx",
    "src/pages"
  ],
  "references": [{ "path": "./tsconfig.node.json" }]
}
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
    <title>Jeli App Shell</title>
  </head>
  <body>
    <div id="root"></div>
    <div id="toaster-container"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
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
        DEFAULT: "0.5rem",
      },
      boxShadow: {
        input: [
          "0px 2px 3px -1px rgba(0, 0, 0, 0.1)",
          "0px 1px 0px 0px rgba(25, 28, 33, 0.02)",
          "0px 0px 0px 1px rgba(25, 28, 33, 0.08)",
        ].join(", "),
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        ripple: "ripple 2s ease calc(var(--i, 0) * 0.2s) infinite",
        orbit: "orbit calc(var(--duration) * 1s) linear infinite",
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
        ripple: {
          "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
          "50%": { transform: "translate(-50%, -50%) scale(0.9)" },
        },
        orbit: {
          "0%": {
            transform:
              "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
          },
          "100%": {
            transform:
              "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
          },
        }
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
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true
  },
  "include": ["vite.config.ts"]
}
```

## File: vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'
import { resolve } from 'path'
import pkg from './package.json' with { type: 'json' }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'JeliAppShell',
      fileName: (format) => `jeli-app-shell.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: Object.keys(pkg.peerDependencies || {}),
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          tailwindcss: 'tailwindcss',
          gsap: 'gsap',
          'lucide-react': 'lucide-react',
          zustand: 'zustand',
          sonner: 'sonner'
        },
      },
    },
  },
})
```

## File: src/components/layout/MainContent.tsx
```typescript
import { forwardRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils';
import { BODY_STATES } from '@/lib/utils'
import { useAppShell } from '@/context/AppShellContext'

interface MainContentProps {
  children?: React.ReactNode;
}

export const MainContent = forwardRef<HTMLDivElement, MainContentProps>(
  ({ children }, ref) => {
    const { bodyState, fullscreenTarget, toggleFullscreen } = useAppShell();
    const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;

    if (isFullscreen && fullscreenTarget === 'right') {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
        "flex flex-col h-full overflow-hidden bg-background",
        isFullscreen && "fixed inset-0 z-[60]"
        )}
      >
        {isFullscreen && (
          <button
            onClick={() => toggleFullscreen()}
            className="fixed top-6 right-6 lg:right-12 z-[100] h-12 w-12 flex items-center justify-center rounded-full bg-card/50 backdrop-blur-sm hover:bg-card/75 transition-colors group"
            title="Exit Fullscreen"
          >
            <X className="w-6 h-6 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
          </button>
        )}

        <div className="flex-1 min-h-0 flex flex-col">
          {children}
        </div>
      </div>
    )
  }
)
MainContent.displayName = 'MainContent'
```

## File: src/components/layout/EnhancedSidebar.tsx
```typescript
import React from 'react';
import {
  Home,
  Settings,
  HelpCircle,
  Component,
  Rocket,
  MoreHorizontal,
  Bell,
  Search,
  FileText,
  Star,
  Trash2,
  FolderOpen,
  Mail,
  Bookmark,
  Download,
  User,
  Plus,
  Database
} from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { type ActivePage } from '@/store/appStore';
import { useAppShell } from '@/context/AppShellContext';
import {
  Workspaces,
  WorkspaceTrigger,
  WorkspaceContent,
  type Workspace,
} from './WorkspaceSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
  SidebarBody,
  SidebarFooter,
  SidebarSection,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarLabel,
  SidebarBadge,
  SidebarTooltip,
  SidebarIcon,
  useSidebar,
} from './Sidebar';
import { ViewModeSwitcher } from './ViewModeSwitcher';
import { cn } from '@/lib/utils';

interface MyWorkspace extends Workspace {
  logo: string;
  plan: string;
}

const mockWorkspaces: MyWorkspace[] = [
  { id: 'ws1', name: 'Acme Inc.', logo: 'https://avatar.vercel.sh/acme.png', plan: 'Pro' },
  { id: 'ws2', name: 'Monsters Inc.', logo: 'https://avatar.vercel.sh/monsters.png', plan: 'Free' },
  { id: 'ws3', name: 'Stark Industries', logo: 'https://avatar.vercel.sh/stark.png', plan: 'Enterprise' },
];

const SidebarWorkspaceTrigger = () => {
  const { isCollapsed, compactMode } = useSidebar();

  return (
    <WorkspaceTrigger
      collapsed={isCollapsed}
      className={cn(
        'rounded-xl transition-colors hover:bg-accent/50 w-full',
        isCollapsed ? 'p-2' : 'p-3 bg-accent/50',
      )}
      avatarClassName={cn(compactMode ? 'h-8 w-8' : 'h-10 w-10')}
    />
  );
};

interface SidebarProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const EnhancedSidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ onMouseEnter, onMouseLeave }, ref) => {
    const { sidebarWidth, compactMode, appName, appLogo } = useAppShell();
    const [selectedWorkspace, setSelectedWorkspace] = React.useState(mockWorkspaces[0]);

    return (
      <Sidebar
        ref={ref}
        style={{ width: sidebarWidth }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <SidebarContent>
          <SidebarHeader>
            {appLogo || (
              <div className="p-2 bg-primary/20 rounded-lg">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
            )}
            <SidebarTitle>{appName}</SidebarTitle>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection title="Main">
              <AppMenuItem icon={Home} label="Dashboard" page="dashboard" />
              <AppMenuItem icon={Database} label="Data Demo" page="data-demo" />
              <AppMenuItem icon={Search} label="Search" />
              <AppMenuItem icon={Bell} label="Notifications" badge={3} page="notifications" opensInSidePane />
            </SidebarSection>
            
            <SidebarSection title="Workspace" collapsible defaultExpanded>
              <AppMenuItem icon={FileText} label="Documents" hasActions>
                <AppMenuItem icon={FileText} label="Recent" isSubItem />
                <AppMenuItem icon={Star} label="Starred" isSubItem />
                <AppMenuItem icon={Trash2} label="Trash" isSubItem />
              </AppMenuItem>
              <AppMenuItem icon={FolderOpen} label="Projects" hasActions />
              <AppMenuItem icon={Mail} label="Messages" badge={12} />
            </SidebarSection>
            
            <SidebarSection title="Personal" collapsible>
              <AppMenuItem icon={Bookmark} label="Bookmarks" />
              <AppMenuItem icon={Star} label="Favorites" />
              <AppMenuItem icon={Download} label="Downloads" />
            </SidebarSection>

            <SidebarSection title="Components" collapsible defaultExpanded>
              <AppMenuItem icon={Component} label="Toaster" page="toaster" />
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter>
            <SidebarSection>
              <AppMenuItem icon={User} label="Profile" />
              <AppMenuItem icon={Settings} label="Settings" page="settings" />
              <AppMenuItem icon={HelpCircle} label="Help" />
            </SidebarSection>

            <div className={cn(compactMode ? 'mt-4' : 'mt-6')}>
              <Workspaces
                workspaces={mockWorkspaces}
                selectedWorkspaceId={selectedWorkspace.id}
                onWorkspaceChange={setSelectedWorkspace}
              >
                <SidebarWorkspaceTrigger />
                <WorkspaceContent>
                  <button className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:outline-none">
                    <Plus className="h-4 w-4" />
                    <span>Create Workspace</span>
                  </button>
                </WorkspaceContent>
              </Workspaces>
            </div>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
    );
  },
);
EnhancedSidebar.displayName = 'EnhancedSidebar';


// Example of a reusable menu item component built with the new Sidebar primitives
interface AppMenuItemProps {
  icon: React.ElementType;
  label: string;
  badge?: number;
  hasActions?: boolean;
  children?: React.ReactNode;
  isSubItem?: boolean;
  page?: ActivePage;
  opensInSidePane?: boolean;
}

const AppMenuItem: React.FC<AppMenuItemProps> = ({ icon: Icon, label, badge, hasActions, children, isSubItem = false, page, opensInSidePane = false }) => {
  const { compactMode, dispatch } = useAppShell()
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageToPaneMap: { [key in ActivePage]?: 'main' | 'settings' | 'toaster' | 'notifications' | 'data-demo' } = {
    dashboard: 'main',
    settings: 'settings',
    toaster: 'toaster',
    notifications: 'notifications',
    'data-demo': 'main',
  };
  const paneContentForPage = page ? pageToPaneMap[page] : undefined;

  const isActive = (
    (!opensInSidePane && page && location.pathname === `/${page}`)
  ) || (
    opensInSidePane && paneContentForPage && searchParams.get('sidePane') === paneContentForPage
  );

  const handleClick = () => {
    if (page) {
      if (opensInSidePane) {
        const isCurrentlyInSidePane = searchParams.get('sidePane') === paneContentForPage;

        if (isCurrentlyInSidePane) {
          const newParams = new URLSearchParams(searchParams);
          newParams.delete('sidePane');
          setSearchParams(newParams, { replace: true });
        } else if (paneContentForPage) {
          // If opening a side pane for a page that is the current main view,
          // navigate main view to dashboard to avoid content duplication.
          if (location.pathname === `/${page}`) {
            navigate({ pathname: '/dashboard', search: `?sidePane=${paneContentForPage}` }, { replace: true });
          } else {
            const newParams = new URLSearchParams(searchParams);
            newParams.set('sidePane', paneContentForPage);
            // When setting a side pane, always clear split view params to avoid invalid URL state
            newParams.delete('view');
            newParams.delete('right');
            setSearchParams(newParams, { replace: true });
          }
        }
      } else {
        navigate(`/${page}`);
      }
    }
  };

  return (
    <div className={isSubItem ? (compactMode ? 'ml-4' : 'ml-6') : ''}>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={handleClick}
          isActive={isActive}
          draggable={!!page}
          onDragStart={(_e) => {
            if (page) {
              // set dragged page in AppShell context
              dispatch({ type: 'SET_DRAGGED_PAGE', payload: page });
            }
          }}
          onDragEnd={() => {
            dispatch({ type: 'SET_DRAGGED_PAGE', payload: null });
            dispatch({ type: 'SET_DRAG_HOVER_TARGET', payload: null });
          }}
        >
          <SidebarIcon>
            <Icon className={isSubItem ? "w-3 h-3" : "w-4 h-4"}/>
          </SidebarIcon>
          <SidebarLabel>{label}</SidebarLabel>
          {badge && <SidebarBadge>{badge}</SidebarBadge>}
          <SidebarTooltip label={label} badge={badge} />
        </SidebarMenuButton>

        {page && !isCollapsed && ( // Always render switcher if there's a page
          <div className={cn(
            "absolute top-1/2 -translate-y-1/2 z-10",
            "opacity-0 group-hover/item:opacity-100 group-focus-within/item:opacity-100",
            "transition-opacity pointer-events-none group-hover/item:pointer-events-auto",
            // If there are actions, move left to make space for the action button
            hasActions ? "right-10" : "right-2"
          )}>
            <ViewModeSwitcher targetPage={page} />
          </div>
        )}

        {hasActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction>
                <MoreHorizontal className="h-4 w-4" />
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
              <DropdownMenuItem>
                <span>Edit {label}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Delete {label}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
      {!isCollapsed && children && (
        <div className="space-y-1 mt-1">{children}</div>
      )}
    </div>
  );
};
```

## File: src/components/layout/ViewModeSwitcher.tsx
```typescript
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils'
import { useAppShell } from '@/context/AppShellContext'
import { type ActivePage } from '@/store/appStore'
import { BODY_STATES } from '@/lib/utils'
import { type AppShellState } from '@/context/AppShellContext'
import {
  Columns,
  PanelRightOpen,
  SplitSquareHorizontal,
  Maximize,
  Minimize,
  Layers,
  X,
  ArrowLeftRight
} from 'lucide-react'

const pageToPaneMap: Record<ActivePage, AppShellState['sidePaneContent']> = {
  dashboard: 'main',
  settings: 'settings',
  toaster: 'toaster',
  notifications: 'notifications',
  'data-demo': 'dataDemo',
};

export function ViewModeSwitcher({ pane, targetPage }: { pane?: 'main' | 'right', targetPage?: ActivePage }) {
  const {
    bodyState,
    sidePaneContent,
    toggleFullscreen,
    fullscreenTarget,
  } = useAppShell()
  const location = useLocation();
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const currentActivePage = (location.pathname.split('/')[1] || 'dashboard') as ActivePage;

  const activePage = targetPage || currentActivePage;
  const [isExpanded, setIsExpanded] = useState(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;
  const isThisPaneFullscreen = isFullscreen && (
    (pane === 'main' && fullscreenTarget !== 'right') ||
    (pane === 'right' && fullscreenTarget === 'right') ||
    (!pane && !fullscreenTarget) // Global switcher, global fullscreen
  );

  useEffect(() => {
    const buttonsToAnimate = buttonRefs.current.filter(Boolean) as HTMLButtonElement[];
    if (buttonsToAnimate.length === 0) return;

    gsap.killTweensOf(buttonsToAnimate);

    if (isExpanded) {
        gsap.to(buttonsToAnimate, {
            width: 32, // h-8 w-8
            opacity: 1,
            pointerEvents: 'auto',
            marginLeft: 4, // from gap-1 in original
            duration: 0.2,
            stagger: {
                each: 0.05,
                from: 'start'
            },
            ease: 'power2.out'
        });
    } else {
        gsap.to(buttonsToAnimate, {
            width: 0,
            opacity: 0,
            pointerEvents: 'none',
            marginLeft: 0,
            duration: 0.2,
            stagger: {
                each: 0.05,
                from: 'end'
            },
            ease: 'power2.in'
        });
    }
  }, [isExpanded, bodyState]); // re-run if bodyState changes to recalc buttons

  const handleSidePaneClick = () => {
    const paneContent = pageToPaneMap[activePage] || 'details';
    if (pane === 'right') return;

    const newSearchParams = new URLSearchParams(location.search);
    if (bodyState === BODY_STATES.SIDE_PANE && sidePaneContent === paneContent) {
      newSearchParams.delete('sidePane');
      newSearchParams.delete('view');
      newSearchParams.delete('right');
    } else {
      newSearchParams.set('sidePane', paneContent);
      newSearchParams.delete('view');
      newSearchParams.delete('right');
    }
    setSearchParams(newSearchParams, { replace: true });
  };
  
  const handleSplitViewClick = () => {
    const paneContent = pageToPaneMap[activePage] || 'details';
    if (pane === 'right') return;

    const newSearchParams = new URLSearchParams(location.search);
    if (bodyState === BODY_STATES.SPLIT_VIEW) {
        // from split to overlay
        newSearchParams.set('sidePane', sidePaneContent);
        newSearchParams.delete('view');
        newSearchParams.delete('right');
    } else {
        // from normal/overlay to split
        newSearchParams.set('view', 'split');
        newSearchParams.set('right', bodyState === BODY_STATES.SIDE_PANE ? sidePaneContent : paneContent);
        newSearchParams.delete('sidePane');
    }
    setSearchParams(newSearchParams, { replace: true });
  }

  const handleSwitchPanes = () => {
    if (bodyState !== BODY_STATES.SPLIT_VIEW) return;
    const newSidePaneContent = pageToPaneMap[currentActivePage];
    const newActivePage = Object.entries(pageToPaneMap).find(
      ([, value]) => value === sidePaneContent
    )?.[0] as ActivePage | undefined;

    if (newActivePage && newSidePaneContent) {
      navigate(`/${newActivePage}?view=split&right=${newSidePaneContent}`, { replace: true });
    }
  };

  const handleClosePane = () => {
    if (bodyState !== BODY_STATES.SPLIT_VIEW) return;
    if (pane === 'right') {
      setSearchParams({}, { replace: true });
    } else if (pane === 'main') {
      const pageToBecomeActive = Object.entries(pageToPaneMap).find(
        ([, value]) => value === sidePaneContent
      )?.[0] as ActivePage | undefined;
      
      if (pageToBecomeActive) {
        navigate(`/${pageToBecomeActive}`, { replace: true });
      } else {
        setSearchParams({}, { replace: true });
      }
    }
  }

  const handleNormalViewClick = () => {
    if (isFullscreen) {
      toggleFullscreen();
    }
    if (targetPage && targetPage !== currentActivePage) {
      navigate(`/${targetPage}`, { replace: true });
    }
      setSearchParams({}, { replace: true });
  }

  const buttons = [
    {
      id: 'normal',
      onClick: handleNormalViewClick,
      active: bodyState === BODY_STATES.NORMAL,
      title: "Normal View",
      icon: <Columns className="w-4 h-4" />
    },
    {
      id: 'side-pane',
      onClick: handleSidePaneClick,
      active: bodyState === BODY_STATES.SIDE_PANE,
      title: "Side Pane View",
      icon: <PanelRightOpen className="w-4 h-4" />
    },
    {
      id: 'split-view',
      onClick: handleSplitViewClick,
      active: bodyState === BODY_STATES.SPLIT_VIEW,
      title: bodyState === BODY_STATES.SPLIT_VIEW ? 'Switch to Overlay View' : 'Switch to Split View',
      icon: bodyState === BODY_STATES.SPLIT_VIEW ? <Layers className="w-4 h-4" /> : <SplitSquareHorizontal className="w-4 h-4" />
    },
    {
      id: 'fullscreen',
      onClick: () => {
        if (targetPage && targetPage !== currentActivePage ) {
          navigate(`/${targetPage}`);
          setTimeout(() => toggleFullscreen(pane), 50);
        } else {
          toggleFullscreen(pane);
        }
      },
      active: isThisPaneFullscreen,
      title: "Toggle Fullscreen",
      icon: isThisPaneFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />
    }
  ];

  if (bodyState === BODY_STATES.SPLIT_VIEW) {
    buttons.push({
      id: 'switch',
      onClick: handleSwitchPanes,
      active: false,
      title: "Switch Panes",
      icon: <ArrowLeftRight className="w-4 h-4" />
    });
    buttons.push({
      id: 'close',
      onClick: handleClosePane,
      active: false,
      title: "Close Pane",
      icon: <X className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
    });
  }

  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="flex items-center gap-0 p-1 bg-card rounded-full border border-border"
    >
        <button
            className='h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-accent transition-colors'
            title="View Modes"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <Layers className="w-4 h-4" />
        </button>
      
      {buttons.map((btn, index) => (
        <button
          key={btn.id}
          ref={el => buttonRefs.current[index] = el}
          onClick={btn.onClick}
          className={cn(
            'h-8 w-0 flex items-center justify-center rounded-full hover:bg-accent transition-colors group opacity-0',
            btn.active && 'bg-accent text-accent-foreground',
            btn.id === 'close' && 'hover:bg-destructive/20'
          )}
          style={{ pointerEvents: 'none', marginLeft: 0, overflow: 'hidden' }}
          title={btn.title}
        >
          {btn.icon}
        </button>
      ))}
    </div>
  )
}
```

## File: src/pages/DataDemo/index.tsx
```typescript
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Layers, 
  AlertTriangle, 
  PlayCircle, 
  TrendingUp,
  Loader2
} from 'lucide-react'
import { gsap } from 'gsap'
import { PageLayout } from '@/components/shared/PageLayout'
import { DataListView } from './components/DataListView'
import { DataCardView } from './components/DataCardView'
import { DataTableView } from './components/DataTableView'
import { DataViewModeSelector } from './components/DataViewModeSelector'
import { DataDetailPanel } from './components/DataDetailPanel'
import { AnimatedLoadingSkeleton } from './components/AnimatedLoadingSkeleton'
import { StatChartCard } from './components/StatChartCard'
import { DataToolbar, FilterConfig } from './components/DataToolbar'
import { mockDataItems } from './data/mockData'
import type { DataItem, ViewMode, SortConfig, SortableField } from './types'

type Stat = {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down';
  type?: 'card';
};

type ChartStat = {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down';
  type: 'chart';
  chartData: number[];
};

type StatItem = Stat | ChartStat;

export default function DataDemoPage({ isInSidePane = false }: { isInSidePane?: boolean }) {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [filters, setFilters] = useState<FilterConfig>({
    searchTerm: '',
    status: [],
    priority: [],
  })
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'updatedAt', direction: 'desc' })
  const [items, setItems] = useState<DataItem[]>([])
  const [page, setPage] = useState(0) // Start at 0 to trigger initial load effect
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const observer = useRef<IntersectionObserver>()
  const navigate = useNavigate()
  const { itemId } = useParams<{ itemId: string }>()

  const selectedItem = useMemo(() => {
    if (!itemId) return null
    return mockDataItems.find(item => item.id === itemId) ?? null
  }, [itemId])

  const isInitialLoading = isLoading && items.length === 0

  // Centralized data processing
  const processedData = useMemo(() => {
    let filteredItems = mockDataItems.filter(item => {
      const searchTermMatch =
        item.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.searchTerm.toLowerCase())

      const statusMatch = filters.status.length === 0 || filters.status.includes(item.status)
      const priorityMatch = filters.priority.length === 0 || filters.priority.includes(item.priority)

      return searchTermMatch && statusMatch && priorityMatch
    })

    if (sortConfig) {
      filteredItems.sort((a, b) => {
        let aValue: any
        let bValue: any

        const getNestedValue = (obj: any, path: string) => path.split('.').reduce((o, k) => (o || {})[k], obj)

        aValue = getNestedValue(a, sortConfig.key)
        bValue = getNestedValue(b, sortConfig.key)

        if (aValue === undefined || bValue === undefined) return 0;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
        }
        // Date sorting (assuming ISO strings)
        if (sortConfig.key === 'updatedAt' || sortConfig.key === 'createdAt') {
            return sortConfig.direction === 'asc'
                ? new Date(aValue).getTime() - new Date(aValue).getTime()
                : new Date(bValue).getTime() - new Date(bValue).getTime()
        }
        return 0
      })
    }
    return filteredItems
  }, [filters, sortConfig])

  // Calculate stats from data
  const totalItems = mockDataItems.length
  const activeItems = mockDataItems.filter(item => item.status === 'active').length
  const highPriorityItems = mockDataItems.filter(item => item.priority === 'high' || item.priority === 'critical').length
  const avgCompletion = totalItems > 0 ? Math.round(
    mockDataItems.reduce((acc, item) => acc + item.metrics.completion, 0) / totalItems
  ) : 0

  // Reset pagination when filters or sort change
  useEffect(() => {
    setItems([])
    setPage(0) // This will be incremented to 1 in the loader `useEffect`, triggering a fresh load
    setHasMore(true)
    // This timeout helps prevent a flicker between old and new filtered data
    setTimeout(() => setPage(1), 50)
  }, [processedData])

  // Infinite scroll logic
  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    if (page === 0) return;

    const fetchItems = () => {
      setIsLoading(true);
      const isFirstPage = page === 1
      
      const pageSize = 12;
      const newItems = processedData.slice((page - 1) * pageSize, page * pageSize);
      
      // Simulate network delay, longer for initial load to showcase skeleton
      setTimeout(() => {
        setItems(prev => (isFirstPage ? newItems : [...prev, ...newItems]))
        setHasMore(processedData.length > page * pageSize)
        setIsLoading(false)
      }, isFirstPage && items.length === 0 ? 1500 : 500)
    };

    if (hasMore) fetchItems();
  }, [page]);

  const loaderRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const stats: StatItem[] = [
    {
      title: "Total Projects",
      value: totalItems.toString(),
      icon: <Layers className="w-5 h-5" />,
      change: "+5.2% this month",
      trend: "up" as const,
      type: 'chart',
      chartData: [120, 125, 122, 130, 135, 138, 142]
    },
    {
      title: "Active Projects",
      value: activeItems.toString(),
      icon: <PlayCircle className="w-5 h-5" />,
      change: "+2 this week", 
      trend: "up" as const,
      type: 'chart',
      chartData: [45, 50, 48, 55, 53, 60, 58]
    },
    {
      title: "High Priority",
      value: highPriorityItems.toString(),
      icon: <AlertTriangle className="w-5 h-5" />,
      change: "-1 from last week",
      trend: "down" as const,
      type: 'chart',
      chartData: [25, 26, 28, 27, 26, 24, 23]
    },
    {
      title: "Avg. Completion",
      value: `${avgCompletion}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      change: "+3.2%",
      trend: "up" as const,
      type: 'chart',
      chartData: [65, 68, 70, 69, 72, 75, 78]
    }
  ]

  useEffect(() => {
    // Animate stats cards in
    if (!isInitialLoading && statsRef.current) {
      gsap.fromTo(statsRef.current.children,
        { y: 30, opacity: 0 },
        {
          duration: 0.6,
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: "power2.out"
        }
      )
    }
  }, [isInitialLoading])

  const handleSortChange = (config: SortConfig | null) => {
    setSortConfig(config)
  }

  // For table view header clicks
  const handleTableSort = (field: SortableField) => {
    if (sortConfig?.key === field) {
      if (sortConfig.direction === 'desc') {
        // Cycle: desc -> asc
        setSortConfig({ key: field, direction: 'asc' })
      } else {
        // Cycle: asc -> default
        setSortConfig(null)
      }
    } else {
      // New field, default to desc
      setSortConfig({ key: field, direction: 'desc' })
    }
  }

  const handleFilterChange = (newFilters: FilterConfig) => {
    setFilters(newFilters)
  }
  
  // Handle item selection and open side panel
  const handleItemSelect = (item: DataItem) => {
    navigate(`/data-demo/${item.id}`)
  }

  if (itemId) {
    if (!selectedItem) {
      return (
        <PageLayout>
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold">Item Not Found</h2>
            <p className="text-muted-foreground">The item you are looking for does not exist.</p>
          </div>
        </PageLayout>
      )
    }
    return <DataDetailPanel item={selectedItem} onClose={() => navigate('/data-demo')} />
  }

  const renderView = () => {
    const commonProps = {
      data: items,
      onItemSelect: handleItemSelect,
      selectedItem,
      sortConfig,
      onSort: handleTableSort,
    }

    switch (viewMode) {
      case 'list':
        return <DataListView {...commonProps} />
      case 'cards':
        return <DataCardView {...commonProps} />
      case 'grid':
        return <DataCardView {...commonProps} isGrid />
      case 'table':
        return <DataTableView {...commonProps} />
      default:
        return <DataListView {...commonProps} />
    }
  }

  return (
    <PageLayout
      // Note: Search functionality is handled by a separate SearchBar in the TopBar
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">Data Showcase</h1>
            <p className="text-muted-foreground">
              {isInitialLoading 
                ? "Loading projects..." 
                : `Showing ${processedData.length} item(s)`}
            </p>
          </div>
          <DataViewModeSelector viewMode={viewMode} onChange={setViewMode} />
        </div>

        {/* Stats Section */}
        {!isInitialLoading && (
          <div ref={statsRef} className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
            {stats.map((stat) =>
              stat.type === 'chart' ? (
                <StatChartCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  trend={stat.trend}
                  icon={stat.icon}
                  chartData={stat.chartData}
                />
              ) : null
            )}
          </div>
        )}

        <DataToolbar
          filters={filters}
          onFiltersChange={handleFilterChange}
          sortConfig={sortConfig}
          onSortChange={handleSortChange}
        />

        <div ref={contentRef} className="min-h-[500px]">
          {isInitialLoading ? <AnimatedLoadingSkeleton viewMode={viewMode} /> : renderView()}
        </div>

        {/* Loader for infinite scroll */}
        <div ref={loaderRef} className="flex justify-center items-center py-6">
          {isLoading && !isInitialLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more...</span>
            </div>
          )}
          {!isLoading && !hasMore && processedData.length > 0 && !isInitialLoading && (
            <p className="text-muted-foreground">You've reached the end.</p>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
```

## File: src/context/AppShellContext.tsx
```typescript
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
  type ReactElement,
  type Dispatch,
} from 'react';
import { SIDEBAR_STATES, BODY_STATES, type SidebarState, type BodyState } from '@/lib/utils';

// --- State and Action Types ---

export interface AppShellState {
  sidebarState: SidebarState;
  bodyState: BodyState;
  sidePaneContent: 'details' | 'settings' | 'main' | 'toaster' | 'notifications' | 'dataDemo';
  sidebarWidth: number;
  sidePaneWidth: number;
  splitPaneWidth: number;
  previousBodyState: BodyState;
  fullscreenTarget: 'main' | 'right' | null;
  isResizing: boolean;
  isResizingRightPane: boolean;
  isTopBarVisible: boolean;
  autoExpandSidebar: boolean;
  reducedMotion: boolean;
  compactMode: boolean;
  primaryColor: string;
  appName?: string;
  appLogo?: ReactElement;
 draggedPage: 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo' | null;
 dragHoverTarget: 'left' | 'right' | null;
 hoveredPane: 'left' | 'right' | null;
}

type AppShellAction =
  | { type: 'SET_SIDEBAR_STATE'; payload: SidebarState }
  | { type: 'SET_BODY_STATE'; payload: BodyState }
  | { type: 'SET_SIDE_PANE_CONTENT'; payload: AppShellState['sidePaneContent'] }
  | { type: 'SET_SIDEBAR_WIDTH'; payload: number }
  | { type: 'SET_SIDE_PANE_WIDTH'; payload: number }
  | { type: 'SET_SPLIT_PANE_WIDTH'; payload: number }
  | { type: 'SET_IS_RESIZING'; payload: boolean }
  | { type: 'SET_PREVIOUS_BODY_STATE'; payload: BodyState }
  | { type: 'SET_FULLSCREEN_TARGET'; payload: 'main' | 'right' | null }
  | { type: 'SET_IS_RESIZING_RIGHT_PANE'; payload: boolean }
  | { type: 'SET_TOP_BAR_VISIBLE'; payload: boolean }
  | { type: 'SET_AUTO_EXPAND_SIDEBAR'; payload: boolean }
  | { type: 'SET_REDUCED_MOTION'; payload: boolean }
  | { type: 'SET_COMPACT_MODE'; payload: boolean }
  | { type: 'SET_PRIMARY_COLOR'; payload: string }
  | { type: 'SET_DRAGGED_PAGE'; payload: 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo' | null }
  | { type: 'SET_DRAG_HOVER_TARGET'; payload: 'left' | 'right' | null }
  | { type: 'SET_HOVERED_PANE'; payload: 'left' | 'right' | null }
  | { type: 'RESET_TO_DEFAULTS' };

// --- Reducer ---

const defaultState: AppShellState = {
  sidebarState: SIDEBAR_STATES.EXPANDED,
  bodyState: BODY_STATES.NORMAL,
  sidePaneContent: 'details',
  sidebarWidth: 280,
  sidePaneWidth: typeof window !== 'undefined' ? Math.max(300, Math.round(window.innerWidth * 0.6)) : 400,
  splitPaneWidth: typeof window !== 'undefined' ? Math.max(300, Math.round(window.innerWidth * 0.35)) : 400,
  previousBodyState: BODY_STATES.NORMAL,
  fullscreenTarget: null,
  isResizing: false,
  isResizingRightPane: false,
  isTopBarVisible: true,
  autoExpandSidebar: true,
  reducedMotion: false,
  compactMode: false,
  primaryColor: '220 84% 60%',
  appName: 'Jeli App',
  appLogo: undefined,
  draggedPage: null,
  dragHoverTarget: null,
  hoveredPane: null,
};

function appShellReducer(state: AppShellState, action: AppShellAction): AppShellState {
  switch (action.type) {
    case 'SET_SIDEBAR_STATE': return { ...state, sidebarState: action.payload };
    case 'SET_BODY_STATE':
      // If we're leaving fullscreen, reset the target and previous state
      if (state.bodyState === BODY_STATES.FULLSCREEN && action.payload !== BODY_STATES.FULLSCREEN) {
        return { ...state, bodyState: action.payload, fullscreenTarget: null, previousBodyState: BODY_STATES.NORMAL };
      }
      return { ...state, bodyState: action.payload };
    case 'SET_SIDE_PANE_CONTENT': return { ...state, sidePaneContent: action.payload };
    case 'SET_SIDEBAR_WIDTH': return { ...state, sidebarWidth: Math.max(200, Math.min(500, action.payload)) };
    case 'SET_SIDE_PANE_WIDTH': return { ...state, sidePaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, action.payload)) };
    case 'SET_SPLIT_PANE_WIDTH': return { ...state, splitPaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, action.payload)) };
    case 'SET_IS_RESIZING': return { ...state, isResizing: action.payload };
    case 'SET_PREVIOUS_BODY_STATE': return { ...state, previousBodyState: action.payload };
    case 'SET_FULLSCREEN_TARGET': return { ...state, fullscreenTarget: action.payload };
    case 'SET_IS_RESIZING_RIGHT_PANE': return { ...state, isResizingRightPane: action.payload };
    case 'SET_TOP_BAR_VISIBLE': return { ...state, isTopBarVisible: action.payload };
    case 'SET_AUTO_EXPAND_SIDEBAR': return { ...state, autoExpandSidebar: action.payload };
    case 'SET_REDUCED_MOTION': return { ...state, reducedMotion: action.payload };
    case 'SET_COMPACT_MODE': return { ...state, compactMode: action.payload };
    case 'SET_PRIMARY_COLOR': return { ...state, primaryColor: action.payload };
    case 'SET_DRAGGED_PAGE': return { ...state, draggedPage: action.payload };
    case 'SET_DRAG_HOVER_TARGET': return { ...state, dragHoverTarget: action.payload };
    case 'SET_HOVERED_PANE': return { ...state, hoveredPane: action.payload };
    case 'RESET_TO_DEFAULTS':
      return {
        ...defaultState,
        appName: state.appName, // Preserve props passed to provider
        appLogo: state.appLogo,   // Preserve props passed to provider
      };
    default: return state;
  }
}

// --- Context and Provider ---

interface AppShellContextValue extends AppShellState {
  dispatch: Dispatch<AppShellAction>;
  rightPaneWidth: number;
  // Composite actions for convenience
  toggleSidebar: () => void;
  hideSidebar: () => void;
  showSidebar: () => void;
  peekSidebar: () => void;
  toggleFullscreen: (target?: 'main' | 'right' | null) => void;
  resetToDefaults: () => void;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

interface AppShellProviderProps {
  children: ReactNode;
  appName?: string;
  appLogo?: ReactElement;
  defaultSplitPaneWidth?: number;
}

export function AppShellProvider({ children, appName, appLogo, defaultSplitPaneWidth }: AppShellProviderProps) {
  const [state, dispatch] = useReducer(appShellReducer, {
    ...defaultState,
    ...(appName && { appName }),
    ...(appLogo && { appLogo }),
    ...(defaultSplitPaneWidth && { splitPaneWidth: defaultSplitPaneWidth }),
  });

  // Side effect for primary color
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-hsl', state.primaryColor);
  }, [state.primaryColor]);

  // Memoized composite actions using useCallback for stable function identities
  const toggleSidebar = useCallback(() => {
    const current = state.sidebarState;
    if (current === SIDEBAR_STATES.HIDDEN) dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.COLLAPSED });
    else if (current === SIDEBAR_STATES.COLLAPSED) dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.EXPANDED });
    else if (current === SIDEBAR_STATES.EXPANDED) dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.COLLAPSED });
  }, [state.sidebarState]);

  const hideSidebar = useCallback(() => dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.HIDDEN }), []);
  const showSidebar = useCallback(() => dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.EXPANDED }), []);
  const peekSidebar = useCallback(() => dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.PEEK }), []);
  
  const toggleFullscreen = useCallback((target: 'main' | 'right' | null = null) => {
    const current = state.bodyState;
    if (current === BODY_STATES.FULLSCREEN) {
      // Exiting fullscreen, go back to the previous state
      dispatch({ type: 'SET_BODY_STATE', payload: state.previousBodyState || BODY_STATES.NORMAL });
    } else {
      // Entering fullscreen
      dispatch({ type: 'SET_PREVIOUS_BODY_STATE', payload: current });
      dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.FULLSCREEN });
      dispatch({ type: 'SET_FULLSCREEN_TARGET', payload: target });
    }
  }, [state.bodyState, state.previousBodyState]);

  const resetToDefaults = useCallback(() => dispatch({ type: 'RESET_TO_DEFAULTS' }), []);

  const rightPaneWidth = useMemo(() => (
    state.bodyState === BODY_STATES.SPLIT_VIEW ? state.splitPaneWidth : state.sidePaneWidth
  ), [state.bodyState, state.splitPaneWidth, state.sidePaneWidth]);

  const value = useMemo(() => ({ 
    ...state, 
    dispatch,
    rightPaneWidth,
    toggleSidebar,
    hideSidebar,
    showSidebar,
    peekSidebar,
    toggleFullscreen,
    resetToDefaults,
  }), [
    state, 
    rightPaneWidth,
    toggleSidebar,
    hideSidebar,
    showSidebar,
    peekSidebar,
    toggleFullscreen,
    resetToDefaults
  ]);

  return (
    <AppShellContext.Provider value={value}>
      {children}
    </AppShellContext.Provider>
  );
}

// --- Hook ---

export function useAppShell() {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error('useAppShell must be used within an AppShellProvider');
  }
  return context;
}
```

## File: src/components/layout/AppShell.tsx
```typescript
import React, { useRef, type ReactElement, useCallback, useEffect, useLayoutEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils'
import { gsap } from 'gsap';
import { CommandPalette } from '@/components/global/CommandPalette';
import { useAppStore } from '@/store/appStore'
import { useAppShell } from '@/context/AppShellContext';
import { SIDEBAR_STATES, BODY_STATES } from '@/lib/utils'
import { useResizableSidebar, useResizableRightPane } from '@/hooks/useResizablePanes.hook'
import { useSidebarAnimations, useBodyStateAnimations } from '@/hooks/useAppShellAnimations.hook'
import { ViewModeSwitcher } from './ViewModeSwitcher';

interface AppShellProps {
  sidebar: ReactElement;
  topBar: ReactElement;
  mainContent: ReactElement;
  rightPane: ReactElement;
  commandPalette?: ReactElement;
  onOverlayClick?: () => void;
}

const pageToPaneMap: Record<string, 'main' | 'settings' | 'toaster' | 'notifications' | 'dataDemo'> = {
  dashboard: 'main',
  settings: 'settings',
  toaster: 'toaster',
  notifications: 'notifications',
  'data-demo': 'dataDemo',
};

// Helper hook to get the previous value of a prop or state
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}


export function AppShell({ sidebar, topBar, mainContent, rightPane, commandPalette, onOverlayClick }: AppShellProps) {
  const {
    sidebarState,
    dispatch,
    autoExpandSidebar,
    toggleSidebar,
    hoveredPane,
    peekSidebar,
    draggedPage,
    dragHoverTarget,
    bodyState,
    sidePaneContent,
    reducedMotion,
    isTopBarVisible,
  } = useAppShell();
  
  const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;
  const isSidePaneOpen = bodyState === BODY_STATES.SIDE_PANE;

  const { isDarkMode, toggleDarkMode } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = location.pathname.split('/')[1] || 'dashboard';
  const appRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const rightPaneRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const topBarContainerRef = useRef<HTMLDivElement>(null)
  const mainAreaRef = useRef<HTMLDivElement>(null)

  const prevActivePage = usePrevious(activePage);
  const prevSidePaneContent = usePrevious(sidePaneContent);

  const isSplitView = bodyState === BODY_STATES.SPLIT_VIEW;

  // Custom hooks for logic
  useResizableSidebar(sidebarRef, resizeHandleRef);
  useResizableRightPane();
  useSidebarAnimations(sidebarRef, resizeHandleRef);
  useBodyStateAnimations(appRef, mainContentRef, rightPaneRef, topBarContainerRef, mainAreaRef);
  
  // Animation for pane swapping
  useLayoutEffect(() => {
    if (reducedMotion || bodyState !== BODY_STATES.SPLIT_VIEW || !prevActivePage || !prevSidePaneContent) {
      return;
    }

    const pageForPrevSidePane = Object.keys(pageToPaneMap).find(
      key => pageToPaneMap[key as keyof typeof pageToPaneMap] === prevSidePaneContent
    );

    // Check if a swap occurred by comparing current state with previous state
    if (activePage === pageForPrevSidePane && sidePaneContent === pageToPaneMap[prevActivePage as keyof typeof pageToPaneMap]) {
      const mainEl = mainAreaRef.current;
      const rightEl = rightPaneRef.current;

      if (mainEl && rightEl) {
        const mainWidth = mainEl.offsetWidth;
        const rightWidth = rightEl.offsetWidth;

        const tl = gsap.timeline();
        
        // Animate main content FROM where right pane was TO its new place
        tl.from(mainEl, {
          x: rightWidth, duration: 0.4, ease: 'power3.inOut'
        });

        // Animate right pane FROM where main content was TO its new place
        tl.from(rightEl, {
          x: -mainWidth, duration: 0.4, ease: 'power3.inOut'
        }, 0); // Start at the same time
      }
    }
  }, [activePage, sidePaneContent, bodyState, prevActivePage, prevSidePaneContent, reducedMotion]);
  
  const sidebarWithProps = React.cloneElement(sidebar, { 
    ref: sidebarRef,
    onMouseEnter: () => {
      if (autoExpandSidebar && sidebarState === SIDEBAR_STATES.COLLAPSED) {
        peekSidebar()
      }
    },
    onMouseLeave: () => {
      if (autoExpandSidebar && sidebarState === SIDEBAR_STATES.PEEK) {
        dispatch({ type: 'SET_SIDEBAR_STATE', payload: SIDEBAR_STATES.COLLAPSED });
      }
    }
  });

  const topBarWithProps = React.cloneElement(topBar, {
    onToggleSidebar: toggleSidebar,
    onToggleDarkMode: toggleDarkMode,
  });

  const mainContentWithProps = React.cloneElement(mainContent, {
    ref: mainContentRef,
  });

  const rightPaneWithProps = React.cloneElement(rightPane, { ref: rightPaneRef });

  // Drag and drop handlers for docking
  const handleDragOverLeft = useCallback((e: React.DragEvent) => {
    if (!draggedPage) return;
    e.preventDefault();
    if (dragHoverTarget !== 'left') {
      dispatch({ type: 'SET_DRAG_HOVER_TARGET', payload: 'left' });
    }
  }, [draggedPage, dragHoverTarget, dispatch]);

  const handleDropLeft = useCallback(() => {
    if (!draggedPage) return;

    // If we drop the page that's already in the side pane, just make it the main view.
    const paneContentOfDraggedPage = pageToPaneMap[draggedPage];
    if (paneContentOfDraggedPage === sidePaneContent && (bodyState === BODY_STATES.SIDE_PANE || bodyState === BODY_STATES.SPLIT_VIEW)) {
      navigate(`/${draggedPage}`, { replace: true });
    } 
    // New context-aware logic: if we are in normal view and drop a NEW page on the left
    else if (bodyState === BODY_STATES.NORMAL && draggedPage !== activePage) {
        const originalActivePagePaneContent = pageToPaneMap[activePage];
        if (originalActivePagePaneContent) {
            navigate(`/${draggedPage}?view=split&right=${originalActivePagePaneContent}`, { replace: true });
        } else {
            // Fallback for pages that can't be in a pane
            navigate(`/${draggedPage}`, { replace: true });
        }
    } else { // Default behavior: just make the dropped page the main one
      // If in split view, replace the main content and keep the right pane
      if (bodyState === BODY_STATES.SPLIT_VIEW) {
        const rightPane = location.search.split('right=')[1];
        if (rightPane) {
          navigate(`/${draggedPage}?view=split&right=${rightPane}`, { replace: true });
          return;
        }
      }
      navigate(`/${draggedPage}`, { replace: true });
    }
    
    dispatch({ type: 'SET_DRAGGED_PAGE', payload: null });
    dispatch({ type: 'SET_DRAG_HOVER_TARGET', payload: null });
  }, [draggedPage, activePage, bodyState, sidePaneContent, navigate, dispatch, location]);

  const handleDragOverRight = useCallback((e: React.DragEvent) => {
    if (!draggedPage) return;
    e.preventDefault();
    if (dragHoverTarget !== 'right') {
      dispatch({ type: 'SET_DRAG_HOVER_TARGET', payload: 'right' });
    }
  }, [draggedPage, dragHoverTarget, dispatch]);

  const handleDropRight = useCallback(() => {
    if (!draggedPage) return;
    const pane = pageToPaneMap[draggedPage as keyof typeof pageToPaneMap];
    if (pane) {
      let mainPage = activePage;
      // If dropping the currently active page to the right,
      // set a default page (e.g., dashboard) as the new active page.
      if (draggedPage === activePage) {
        mainPage = 'dashboard';
      }

      navigate(`/${mainPage}?view=split&right=${pane}`, { replace: true });
    }
    dispatch({ type: 'SET_DRAGGED_PAGE', payload: null });
    dispatch({ type: 'SET_DRAG_HOVER_TARGET', payload: null });
  }, [draggedPage, dispatch, bodyState, activePage, navigate]);

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
        {sidebarWithProps}

        {/* Resize Handle */}
        {sidebarState !== SIDEBAR_STATES.HIDDEN && (
          <div
            ref={resizeHandleRef}
            className={cn(
              "absolute top-0 w-2 h-full bg-transparent hover:bg-primary/20 cursor-col-resize z-50 transition-colors duration-200 group -translate-x-1/2"
            )}
            onMouseDown={(e) => {
              e.preventDefault()
              dispatch({ type: 'SET_IS_RESIZING', payload: true });
            }}
          >
            <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200 mx-auto" />
          </div>
        )}

        {/* Main area wrapper */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div
            ref={topBarContainerRef}
            className={cn(
              "absolute top-0 left-0 right-0 z-30",
              isFullscreen && "z-0"
            )}
            onMouseEnter={() => { if (isSplitView) dispatch({ type: 'SET_HOVERED_PANE', payload: null }); }}
          >
            {topBarWithProps}
          </div>

          <div className="flex flex-1 min-h-0">
            <div
              ref={mainAreaRef}
              className="relative flex-1 overflow-hidden bg-background"
              onMouseEnter={() => { if (isSplitView && !draggedPage) dispatch({ type: 'SET_HOVERED_PANE', payload: 'left' }); }}
              onMouseLeave={() => { if (isSplitView && !draggedPage) dispatch({ type: 'SET_HOVERED_PANE', payload: null }); }}
            >
              {/* Side Pane Overlay */}
              <div
                role="button"
                aria-label="Close side pane"
                tabIndex={isSidePaneOpen ? 0 : -1}
                className={cn(
                  "absolute inset-0 bg-black/40 z-40 transition-opacity duration-300",
                  isSidePaneOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                )}
                onClick={onOverlayClick}
              />
              {/* Left drop overlay */}
              <div
                className={cn(
                  "absolute inset-y-0 left-0 z-40 border-2 border-transparent transition-all",
                  draggedPage
                    ? cn("pointer-events-auto", isSplitView ? 'w-full' : 'w-1/2')
                    : "pointer-events-none w-0",
                  dragHoverTarget === 'left' && "bg-primary/10 border-primary"
                )}
                onDragOver={handleDragOverLeft}
                onDrop={handleDropLeft}
                onDragLeave={() => {
                  if (dragHoverTarget === 'left') dispatch({ type: 'SET_DRAG_HOVER_TARGET', payload: null });
                }}
              >
                {draggedPage && dragHoverTarget === 'left' && (
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-primary-foreground/80 pointer-events-none">
                    <span className="px-3 py-1 rounded-md bg-primary/70">{isSplitView ? 'Drop to Replace' : 'Drop to Left'}</span>
                  </div>
                )}
              </div>
              {mainContentWithProps}
              {isSplitView && hoveredPane === 'left' && !draggedPage && (
                <div className={cn("absolute right-4 z-50 transition-all", isTopBarVisible ? 'top-24' : 'top-4')}>
                  <ViewModeSwitcher pane="main" />
                </div>
              )}
              {/* Right drop overlay (over main area, ONLY when NOT in split view) */}
              {!isSplitView && (
                <div
                  className={cn(
                    "absolute inset-y-0 right-0 z-40 border-2 border-transparent",
                    draggedPage ? "pointer-events-auto w-1/2" : "pointer-events-none",
                    dragHoverTarget === 'right' && "bg-primary/10 border-primary"
                  )}
                  onDragOver={handleDragOverRight}
                  onDrop={handleDropRight}
                  onDragLeave={() => {
                    if (dragHoverTarget === 'right') dispatch({ type: 'SET_DRAG_HOVER_TARGET', payload: null });
                  }}
                >
                  {draggedPage && dragHoverTarget === 'right' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="px-3 py-1 rounded-md bg-primary/70 text-sm font-medium text-primary-foreground/80">Drop to Right</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            {isSplitView ? (
              <div
                className="relative"
                onMouseEnter={() => { if (isSplitView && !draggedPage) dispatch({ type: 'SET_HOVERED_PANE', payload: 'right' }); }}
                onMouseLeave={() => { if (isSplitView && !draggedPage) dispatch({ type: 'SET_HOVERED_PANE', payload: null }); }}
                onDragOver={handleDragOverRight}
              >
                {rightPaneWithProps}
                {draggedPage && (
                  <div
                    className={cn(
                      'absolute inset-0 z-50 transition-all',
                      dragHoverTarget === 'right'
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'pointer-events-none'
                    )}
                    onDragLeave={() => {
                      if (dragHoverTarget === 'right')
                        dispatch({ type: 'SET_DRAG_HOVER_TARGET', payload: null });
                    }}
                    onDrop={handleDropRight}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {dragHoverTarget === 'right' && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="px-3 py-1 rounded-md bg-primary/70 text-sm font-medium text-primary-foreground/80">
                          Drop to Replace
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {hoveredPane === 'right' && !draggedPage && (
                  <div className={cn("absolute right-4 z-[70] transition-all", isTopBarVisible ? 'top-24' : 'top-4')}>
                    <ViewModeSwitcher pane="right" />
                  </div>
                )}
              </div>
            ) : rightPaneWithProps}
          </div>
        </div>
      </div>
      {commandPalette || <CommandPalette />}
    </div>
  )
}
```

## File: src/store/appStore.ts
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ActivePage = 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo';

interface AppState {
  // UI States
  isCommandPaletteOpen: boolean
  searchTerm: string
  isDarkMode: boolean
  
  // Actions
  setCommandPaletteOpen: (open: boolean) => void
  setSearchTerm: (term: string) => void
  toggleDarkMode: () => void
}

const defaultState = {
  isCommandPaletteOpen: false,
  searchTerm: '',
  isDarkMode: false,
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...defaultState,
      
      // Basic setters
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'app-preferences',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        // searchTerm is not persisted
      }),
    }
  )
)
```

## File: package.json
```json
{
  "name": "jeli-app-shell",
  "private": false,
  "version": "1.0.1",
  "type": "module",
  "files": [
    "dist"
  ],
  "main": "./dist/jeli-app-shell.umd.js",
  "module": "./dist/jeli-app-shell.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/jeli-app-shell.es.js",
      "require": "./dist/jeli-app-shell.umd.js"
    },
    "./dist/style.css": "./dist/style.css"
  },
  "sideEffects": [
    "**/*.css"
  ],
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {},
  "peerDependencies": {
    "@iconify/react": "^4.1.1",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "cmdk": "^0.2.0",
    "gsap": "^3.12.2",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3",
    "sonner": "^1.2.4",
    "tailwind-merge": "^2.0.0",
    "tailwindcss": "^3.3.5",
    "zustand": "^4.5.7"
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
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5.2.2",
    "vite": "^4.5.0"
  }
}
```

## File: src/App.tsx
```typescript
import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import { AppShell } from "./components/layout/AppShell";
import { AppShellProvider, useAppShell } from "./context/AppShellContext";
import { useAppStore } from "./store/appStore";
import { useAuthStore } from "./store/authStore";
import "./index.css";

// Import library components
import { EnhancedSidebar } from "./components/layout/EnhancedSidebar";
import { MainContent } from "./components/layout/MainContent";
import { RightPane } from "./components/layout/RightPane";
import { TopBar } from "./components/layout/TopBar";
import { CommandPalette } from "./components/global/CommandPalette";
import { ToasterProvider } from "./components/ui/toast";

// Import page/content components
import { DashboardContent } from "./pages/Dashboard";
import { SettingsPage } from "./pages/Settings";
import { ToasterDemo } from "./pages/ToasterDemo";
import { NotificationsPage } from "./pages/Notifications";
import DataDemoPage from "./pages/DataDemo";
import { SettingsContent } from "./features/settings/SettingsContent";
import { LoginPage } from "./components/auth/LoginPage";

// Import icons
import {
  LayoutDashboard,
  Settings,
  Component,
  Bell,
  SlidersHorizontal,
  ChevronsLeftRight,
  Search,
  Filter,
  Plus,
  ChevronRight,
  Rocket,
  Layers,
  SplitSquareHorizontal,
  Database,
} from "lucide-react";
import { BODY_STATES } from "./lib/utils";
import { cn } from "./lib/utils";

// Wrapper for LoginPage to provide auth handlers
function LoginPageWrapper() {
  const { login, forgotPassword } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      // In a real app, you'd show an error message to the user
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await forgotPassword(email);
    } catch (error) {
      console.error("Forgot password failed:", error);
    }
  };

  const handleSignUp = () => {
    // In a real app, navigate to sign up page
    console.log("Navigate to sign up page");
  };

  return (
    <LoginPage
      onLogin={handleLogin}
      onForgotPassword={handleForgotPassword}
      onSignUp={handleSignUp}
    />
  );
}

// Checks for authentication and redirects to login if needed
function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

// The main layout for authenticated parts of the application
function ProtectedLayout() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <AppShellProvider
        appName="Jeli App"
        appLogo={
          <div className="p-2 bg-primary/20 rounded-lg">
            <Rocket className="w-5 h-5 text-primary" />
          </div>
        }
      >
        <ComposedApp />
      </AppShellProvider>
    </div>
  );
}

// Content for the Top Bar (will be fully refactored in Part 2)
function AppTopBar() {
  const { searchTerm, setSearchTerm } = useAppStore();
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const location = useLocation();
  const activePage = location.pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'dashboard';

  return (
    <div className="flex items-center gap-3 flex-1">
      <div
        className={cn(
          "hidden md:flex items-center gap-2 text-sm transition-opacity",
          {
            "opacity-0 pointer-events-none":
              isSearchFocused && activePage === "dashboard",
          },
        )}
      >
        <a
          href="#"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Home
        </a>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-foreground capitalize">
          {activePage}
        </span>
      </div>

      <div className="flex-1" />

      {/* Page-specific: Dashboard search and actions */}
      {activePage === "dashboard" && (
        <div className="flex items-center gap-2 flex-1 justify-end">
          <div
            className={cn(
              "relative transition-all duration-300 ease-in-out",
              isSearchFocused ? "flex-1 max-w-lg" : "w-auto",
            )}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={cn(
                "pl-9 pr-4 py-2 h-10 border-none rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ease-in-out w-full",
                isSearchFocused ? "bg-background" : "w-48",
              )}
            />
          </div>
          <button className="h-10 w-10 flex-shrink-0 flex items-center justify-center hover:bg-accent rounded-full transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 h-10 flex-shrink-0">
            <Plus className="w-5 h-5" />
            <span
              className={cn(isSearchFocused ? "hidden sm:inline" : "inline")}
            >
              New Project
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

// The main App component that composes the shell
function ComposedApp() {
  const {
    bodyState,
    dispatch,
  } = useAppShell();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const pane = searchParams.get('sidePane');
    const view = searchParams.get('view');
    const right = searchParams.get('right');

    if (pane) {
      dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: pane as any });
      dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SIDE_PANE });
    } else if (view === 'split' && right) {
      dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: right as any });
      dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SPLIT_VIEW });
    } else {
      dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.NORMAL });
      // Clean up side pane content when not in use
      dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: 'details' });
    }
  }, [searchParams, dispatch]);
  
  const isOverlaySidePane = bodyState === BODY_STATES.SIDE_PANE;

  const contentMap = {
    main: {
      title: "Dashboard",
      icon: LayoutDashboard,
      page: "dashboard",
      content: <DashboardContent isInSidePane={isOverlaySidePane} />,
    },
    settings: {
      title: "Settings",
      icon: Settings,
      page: "settings",
      content: isOverlaySidePane ? (
        <div className="p-6">
          <SettingsContent />
        </div>
      ) : (
        <SettingsPage />
      ),
    },
    toaster: {
      title: "Toaster Demo",
      icon: Component,
      page: "toaster",
      content: <ToasterDemo isInSidePane={isOverlaySidePane} />,
    },
    notifications: {
      title: "Notifications",
      icon: Bell,
      page: "notifications",
      content: <NotificationsPage isInSidePane={isOverlaySidePane} />,
    },
    dataDemo: {
      title: "Data Showcase",
      icon: Database,
      page: "data-demo",
      content: <DataDemoPage isInSidePane={isOverlaySidePane} />,
    },
    details: {
      title: "Details Panel",
      icon: SlidersHorizontal,
      content: (
        <div className="p-6">
          <p className="text-muted-foreground">
            This is the side pane. It can be used to display contextual
            information, forms, or actions related to the main content.
          </p>
        </div>
      ),
    },
  } as const;

  // Derive content directly from URL to prevent flashes of incorrect content
  const sidePaneContent = searchParams.get('sidePane') || searchParams.get('right') || 'details';
  const currentContent =
    contentMap[sidePaneContent as keyof typeof contentMap] ||
    contentMap.details;
  const CurrentIcon = currentContent.icon;

  const handleMaximize = () => {
    if ("page" in currentContent && currentContent.page) {
      navigate(`/${currentContent.page}`, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleCloseSidePane = () => {
    // Use functional update to avoid stale closures with searchParams
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('sidePane');
      return newParams;
    }, { replace: true });
  };

  const handleToggleSplitView = () => {
    if (bodyState === BODY_STATES.SIDE_PANE) {
      const newParams = new URLSearchParams(location.search);
      newParams.set('view', 'split');
      newParams.set('right', sidePaneContent);
      newParams.delete('sidePane');
      setSearchParams(newParams, { replace: true });
    } else if (bodyState === BODY_STATES.SPLIT_VIEW) {
      setSearchParams({ sidePane: sidePaneContent }, { replace: true });
    }
  };

  const rightPaneHeader =
    bodyState !== BODY_STATES.SPLIT_VIEW ? (
      <>
        <div className="flex items-center gap-2">
          <CurrentIcon className="w-5 h-5" />
          <h2 className="text-lg font-semibold whitespace-nowrap">
            {currentContent.title}
          </h2>
        </div>
        <div className="flex items-center">
          {(bodyState === BODY_STATES.SIDE_PANE ||
            bodyState === BODY_STATES.SPLIT_VIEW) && (
            <button
              onClick={handleToggleSplitView}
              className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors"
              title={
                bodyState === BODY_STATES.SIDE_PANE
                  ? "Switch to Split View"
                  : "Switch to Overlay View"
              }
            >
              {bodyState === BODY_STATES.SPLIT_VIEW ? (
                <Layers className="w-5 h-5" />
              ) : (
                <SplitSquareHorizontal className="w-5 h-5" />
              )}
            </button>
          )}
          {"page" in currentContent && currentContent.page && (
            <button
              onClick={handleMaximize}
              className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors mr-2"
              title="Move to Main View"
            >
              <ChevronsLeftRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </>
    ) : undefined;

  return (
    <AppShell
      sidebar={<EnhancedSidebar />}
      onOverlayClick={handleCloseSidePane}
      topBar={
        <TopBar>
          <AppTopBar />
        </TopBar>
      }
      mainContent={
        <MainContent>
          <Outlet />
        </MainContent>
      }
      rightPane={
        <RightPane onClose={handleCloseSidePane} header={rightPaneHeader}>{currentContent.content}</RightPane>
      }
      commandPalette={<CommandPalette />}
    />
  );
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPageWrapper />,
    },
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/",
          element: <ProtectedLayout />,
          children: [
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: "dashboard", element: <DashboardContent /> },
            { path: "settings", element: <SettingsPage /> },
            { path: "toaster", element: <ToasterDemo /> },
            { path: "notifications", element: <NotificationsPage /> },
            { path: "data-demo", element: <DataDemoPage /> },
            { path: "data-demo/:itemId", element: <DataDemoPage /> },
          ],
        },
      ],
    },
  ]);

  return (
    <ToasterProvider>
      <RouterProvider router={router} />
    </ToasterProvider>
  );
}

export default App;
```
