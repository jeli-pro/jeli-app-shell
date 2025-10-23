# Directory Structure
```
docs/
  screen-view.spec.md
src/
  components/
    global/
      CommandPalette.tsx
    layout/
      AppShell.tsx
      EnhancedSidebar.tsx
      TopBar.tsx
      ViewModeSwitcher.tsx
      ViewRenderer.tsx
  features/
    dynamic-view/
      components/
        shared/
          DetailPanel.tsx
  hooks/
    useAppViewManager.hook.ts
    usePageViewConfig.hook.ts
    usePaneDnd.hook.ts
    useResizablePanes.hook.ts
  lib/
    utils.ts
  pages/
    DataDemo/
      components/
        DataDetailContent.tsx
      index.tsx
    Messaging/
      components/
        MessagingContent.tsx
        TaskList.tsx
      index.tsx
  store/
    appShell.store.ts
  views/
    viewRegistry.tsx
  App.tsx
  index.css
index.html
package.json
postcss.config.js
tailwind.config.js
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: docs/screen-view.spec.md
````markdown
### TL;DR

To accommodate complex, multi-pane layouts and granular user constraints, the `viewRegistry` will be elevated to a complete behavioral specification. It will define not only what a view is, but how it can be displayed, how it responds to different user interactions, and how it composes with other views. The view manager becomes a "dumb" executor of these declarative rules.

### Core Proposal: The "Hyper-Explicit" `viewRegistry`

We will add three key pieces of metadata to our view definitions:

1.  **`allowedBodyStates`**: An array of `bodyState`s a view is permitted to be in. The view manager will enforce this, defaulting to the first allowed state if an invalid transition is attempted.
2.  **`triggerBehaviors`**: An object mapping an interaction *source* (e.g., `iconClick`, `navClick`) to a specific *action* (`openPane`, `navigate`). This provides context-aware control.
3.  **`compositeView`**: For "app-within-an-app" layouts like Messaging, this defines what content should be in the `main` and `right` panes when this route is active. This is the key to the three-pane layout.

---

## Ideal Screen Views & Behavior (Based on Your Requirements)

### `dashboard`, `settings`, `notifications`

*   **Requirement:** Can be a full page, overlay, split view, or fullscreen. However, `settings` (from top bar icon) and `notifications` (from sidebar link) should default to opening as an overlay.
*   **Proposed Ideal Behavior:** These views are defined as maximally flexible, but with specific `triggerBehaviors` to override the default action based on the interaction source.
*   **`viewRegistry.tsx` Entries:**
    ```typescript
    dashboard: {
      id: 'dashboard',
      component: ..., title: 'Dashboard', icon: Home, isNavigable: true,
      renderTarget: ['main', 'pane'],
      allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
      defaultBehavior: 'navigate',
    },

    settings: {
      id: 'settings',
      component: ..., title: 'Settings', icon: Settings, isNavigable: true,
      renderTarget: ['main', 'pane'],
      allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
      defaultBehavior: 'navigate', // Default for command palette, etc.
      triggerBehaviors: {
        iconClick: 'openPane', // <-- Rule for TopBar icon
      },
    },

    notifications: {
      id: 'notifications',
      component: ..., title: 'Notifications', icon: Bell, isNavigable: true,
      renderTarget: ['main', 'pane'],
      allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
      defaultBehavior: 'navigate',
      triggerBehaviors: {
        navClick: 'openPane', // <-- Rule for Sidebar link
      },
    },
    ```
*   **Rationale:** The `triggerBehaviors` object gives us the context-aware logic needed. When the `TopBar` settings icon is clicked, it calls `viewManager.trigger('settings', 'iconClick')`. The manager sees the override and runs `openPane('settings')`. A click from the command palette, lacking a specific trigger, uses `defaultBehavior: 'navigate'`.

### `messaging`

*   **Requirement:** A three-pane layout perceived as one screen. `[Pane 1: List | Pane 2: Thread] | [Pane 3: Context]`. It can only be a `split_view` or `fullscreen`. Individual panes can be fullscreened. The context pane (`Pane 3`) can be opened as a standalone overlay, but the entire view cannot be a single page.
*   **Proposed Ideal Behavior:** This is a "Composite View". We define a virtual `messaging` route that orchestrates the layout. The `AppShell`'s main content area will render `MessagingPage` (which contains Panes 1 & 2), and the `AppShell`'s right pane will render `MessagingContent` (Pane 3).
*   **`viewRegistry.tsx` Entries:**
    ```typescript
    // 1. The "Virtual" Route for the layout. This is what the user navigates to.
    messaging: {
      id: 'messaging',
      isNavigable: true, title: 'Messaging', icon: Inbox,
      renderTarget: [], // It doesn't render a component itself
      allowedBodyStates: ['split_view', 'fullscreen'], // <-- Enforces layout constraint
      defaultBehavior: 'openSplit',
      compositeView: { // <-- Defines the layout for the view manager
        main: 'messagingPage',
        right: 'messagingContextPanel',
      },
      onNavigate: { sidebar: SIDEBAR_STATES.COLLAPSED },
    },

    // 2. The component for the main content area (Panes 1 & 2)
    messagingPage: {
      id: 'messagingPage',
      component: MessagingPage, // The component with its own internal 2-pane resizer
      title: 'Inbox', isNavigable: false,
      renderTarget: ['main'],
      allowedBodyStates: ['split_view', 'fullscreen'],
      hasOwnScrolling: true,
    },

    // 3. The component for the right pane (Pane 3)
    messagingContextPanel: {
      id: 'messagingContextPanel',
      component: MessagingContent, // Refactored component for context
      title: 'Task Details', isNavigable: false,
      renderTarget: ['pane'],
      // Note: This pane can exist as a simple overlay if opened from another context
      allowedBodyStates: ['side_pane', 'split_view', 'fullscreen'],
    },
    ```
*   **Rationale:** This is the key insight. When `navigateTo('/messaging')` is called, the view manager sees `compositeView`. It automatically enforces `bodyState: 'split_view'`, sets the main view to `messagingPage`, and the right pane view to `messagingContextPanel`. The fullscreen buttons within `messagingPage` would call `toggleFullscreen('main')`, while a button in `messagingContextPanel` would call `toggleFullscreen('right')`, providing the required granular control.

### `dataItemDetail`

*   **Requirement:** Should be a page (have a URL), but its default presentation is an overlay. The user can then promote it to a full page, split view, or fullscreen.
*   **Proposed Ideal Behavior:** A contextually-triggered view that defaults to a pane but has permissions to exist in any layout.
*   **`viewRegistry.tsx` Entry:**
    ```typescript
    dataItemDetail: {
      id: 'dataItemDetail',
      component: DataDetailContent,
      title: 'Item Details', icon: FileText,
      isNavigable: false, // Not in main navigation
      renderTarget: ['main', 'pane'],
      allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
      defaultBehavior: 'openPane', // <-- Default action when triggered by onItemSelect
    },
    ```
*   **Rationale:** When a user clicks an item in `data-demo`, `onItemSelect` calls the view manager. The manager sees `defaultBehavior: 'openPane'` for `dataItemDetail` and constructs the URL (`?itemId=...`) to open it as an overlay. However, because `allowedBodyStates` includes `'normal'`, a user can manually navigate to `/data-demo/123` and the view manager will render it as a full page in the main content area, satisfying all requirements.
````

## File: src/index.css
````css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@layer base {
  :root {
    --primary-hsl: 220 84% 60%;
    --background: 210 40% 96.1%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: var(--primary-hsl);
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
    --ring: var(--primary-hsl);
    --radius: 1rem;
  }

  .dark {
    --background: 240 6% 9%;
    --foreground: 210 40% 98%;
    --card: 240 6% 14%;
    --card-foreground: 210 40% 98%;
    --popover: 240 6% 12%;
    --popover-foreground: 210 40% 98%;
    --primary: var(--primary-hsl);
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
    --ring: var(--primary-hsl);
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

/* For UserDropdown */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

@layer base {
  .login-page-theme {
    --background: hsl(0 0% 100%);
    --foreground: hsl(0 0% 0%);
    --skeleton: hsl(0 0% 90%);
    --border: hsl(220 20% 90%);
    --btn-border: hsl(214.3 31.8% 91.4%);
    --input: hsl(220 20% 90%);
    --radius: 0.5rem;
  }
 
  .dark .login-page-theme {
    --background: hsl(222 94% 5%);
    --foreground: hsl(0 0% 100%);
    --skeleton: hsl(218 36% 16%);
    --border: hsl(220 20% 90%);
    --btn-border: hsl(217 32.6% 17.5%);
    --input: hsl(219 63% 16%);
    --radius: 0.5rem;
  }
}

@layer components {
  .g-button {
    @apply rounded-[var(--radius)] border;
    border-color: var(--btn-border);
  }
}
````

## File: postcss.config.js
````javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
````

## File: vite.config.ts
````typescript
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
````

## File: src/components/layout/ViewRenderer.tsx
````typescript
import { useParams, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getViewById, type ViewId } from '@/views/viewRegistry';
import { useSelectedItem } from '@/pages/DataDemo/store/dataDemo.store';

interface ViewRendererProps {
  viewId: ViewId | string | null;
  className?: string;
}

export function ViewRenderer({ viewId, className }: ViewRendererProps) {
  const view = getViewById(viewId);
  const { conversationId, itemId: pathItemId } = useParams();
  const [searchParams] = useSearchParams();
  const sidePaneItemId = searchParams.get('itemId');

  // Specific logic for views that need props
  const selectedItem = useSelectedItem(pathItemId || sidePaneItemId || undefined);

  if (!view) {
    return (
      <div className="p-6 text-muted-foreground">
        View not found: {viewId}
      </div>
    );
  }

  const { component: Component, hasOwnScrolling } = view;

  if (!Component) {
    return (
      <div className="p-6 text-muted-foreground">
        View has no component to render: {viewId}
      </div>
    );
  }

  let componentProps: any = {};
  if (viewId === 'dataItemDetail') {
    if (!selectedItem) {
      return (
        <div className="p-6 text-muted-foreground">
          Item not found.
        </div>
      );
    }
    componentProps = { item: selectedItem };
  }

  const content = <Component {...componentProps} />;

  if (hasOwnScrolling) {
    return content;
  }

  return (
    <div className={cn("h-full overflow-y-auto", className)}>
      {content}
    </div>
  );
}
````

## File: src/pages/DataDemo/components/DataDetailContent.tsx
````typescript
import { ExternalLink, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DynamicViewProvider } from '@/features/dynamic-view/DynamicViewContext';
import { DetailPanel } from '@/features/dynamic-view/components/shared/DetailPanel';
import { dataDemoViewConfig } from '@/pages/DataDemo/DataDemo.config';
import type { DataDemoItem } from '@/pages/DataDemo/data/DataDemoItem';
import { useDataDemoStore } from '../store/dataDemo.store';
import { useRef, useLayoutEffect } from 'react';

interface DataDetailContentProps {
  item: DataDemoItem;
}

export function DataDetailContent({ item }: DataDetailContentProps) {
  const { updateItem } = useDataDemoStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // HACK: This is a temporary workaround to fix a DOM nesting warning (`div` inside `p`)
  // originating from the `DetailPanel` component, which is not available for direct editing.
  // The correct solution is to modify `DetailPanel.tsx` to use `div` instead of `p` as a container for its fields.
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // Find all <p> tags that have a <div> as a descendant
    const paragraphs = Array.from(containerRef.current.getElementsByTagName('p'));

    for (const p of paragraphs) {
      if (p.querySelector('div')) {
        const wrapperDiv = document.createElement('div');
        // Copy classes from the <p> to the new <div>
        wrapperDiv.className = p.className;
        // Move all children from <p> to the new <div>
        while (p.firstChild) {
          wrapperDiv.appendChild(p.firstChild);
        }
        // Replace the <p> with the new <div>
        p.parentNode?.replaceChild(wrapperDiv, p);
      }
    }
  }, [item]); // Rerun when the item changes

  return (
    <DynamicViewProvider
      viewConfig={dataDemoViewConfig}
      items={[]} // Not needed for detail view, but provider requires it
      isLoading={false}
      isInitialLoading={false}
      totalItemCount={0}
      hasMore={false}
      viewMode="list" // Doesn't matter which, but required
      filters={{ searchTerm: "" }}
      sortConfig={null}
      groupBy="none"
      activeGroupTab=""
      page={1}
      onViewModeChange={() => {}}
      onFiltersChange={() => {}}
      onSortChange={() => {}}
      onGroupByChange={() => {}}
      onActiveGroupTabChange={() => {}}
      onPageChange={() => {}}
      onItemSelect={() => {}}
      onItemUpdate={updateItem}
    >
      <div ref={containerRef} className="h-full flex flex-col bg-card">
        <DetailPanel item={item} config={dataDemoViewConfig.detailView} />
        {/* Application-specific actions can be composed here */}
        <div className="p-6 border-t border-border/50 bg-card/30 flex-shrink-0">
          <div className="flex gap-3">
            <Button className="flex-1" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Project
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </DynamicViewProvider>
  );
}
````

## File: src/views/viewRegistry.tsx
````typescript
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Settings,
  Component,
  Bell,
  Database,
  SlidersHorizontal,
  FileText,
  Inbox,
} from 'lucide-react';
import type { BodyState, SidebarState } from '@/lib/utils';
import { SIDEBAR_STATES } from '@/lib/utils';

// --- Lazy load components for better code splitting ---
import React from 'react';

// Correctly typed lazy imports
const DashboardContent = React.lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.DashboardContent })));
const SettingsPage = React.lazy(() => import('@/pages/Settings').then(module => ({ default: module.SettingsPage })));
const ToasterDemo = React.lazy(() => import('@/pages/ToasterDemo').then(module => ({ default: module.ToasterDemo })));
const NotificationsPage = React.lazy(() => import('@/pages/Notifications').then(module => ({ default: module.NotificationsPage })));
const DataDemoPage = React.lazy(() => import('@/pages/DataDemo'));
const MessagingPage = React.lazy(() => import('@/pages/Messaging'));
const DataDetailContent = React.lazy(() => import('@/pages/DataDemo/components/DataDetailContent').then(module => ({ default: module.DataDetailContent })));
const MessagingContent = React.lazy(() => import('@/pages/Messaging/components/MessagingContent').then(module => ({ default: module.MessagingContent })));

export type ViewId = 
  | 'dashboard'
  | 'settings'
  | 'toaster'
  | 'notifications'
  | 'data-demo'
  | 'messaging'
  | 'dataItemDetail'
  | 'messagingPage'
  | 'messagingContextPanel';

export interface ViewRegistration {
  id: ViewId;
  component?: React.ComponentType<any>; // Component is optional for composite views
  title: string;
  icon: LucideIcon;
  hasOwnScrolling?: boolean;
  
  // New behavioral properties
  isNavigable?: boolean; // Can it be navigated to via URL and appear in menus?
  renderTarget?: ('main' | 'pane')[]; // Where can this view be rendered?
  allowedBodyStates?: BodyState[]; // What layouts can this view exist in?
  defaultBehavior?: 'navigate' | 'openPane' | 'openSplit'; // Default action when triggered without context
  triggerBehaviors?: Record<string, 'navigate' | 'openPane' | 'openSplit'>; // Context-aware actions
  compositeView?: { // For "app-within-an-app" layouts
    main: ViewId;
    right: ViewId;
  };
  onNavigate?: { // Side-effects on navigation
    sidebar?: SidebarState;
  };
}

const suspenseWrapper = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (props: any) => (
  <React.Suspense fallback={<div className="p-6">Loading...</div>}>
    <Component {...props} />
  </React.Suspense>
);

export const viewRegistry: Record<ViewId, ViewRegistration> = {
  dashboard: {
    id: 'dashboard',
    component: suspenseWrapper(DashboardContent),
    title: 'Dashboard',
    icon: LayoutDashboard,
    isNavigable: true,
    renderTarget: ['main', 'pane'],
    allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
    defaultBehavior: 'navigate',
  },
  settings: {
    id: 'settings',
    component: suspenseWrapper(SettingsPage),
    title: 'Settings',
    icon: Settings,
    isNavigable: true,
    renderTarget: ['main', 'pane'],
    allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
    defaultBehavior: 'navigate',
    triggerBehaviors: {
      iconClick: 'openPane',
    },
  },
  toaster: {
    id: 'toaster',
    component: suspenseWrapper(ToasterDemo),
    title: 'Toaster Demo',
    icon: Component,
    isNavigable: true,
    renderTarget: ['main', 'pane'],
    allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
    defaultBehavior: 'navigate',
  },
  notifications: {
    id: 'notifications',
    component: suspenseWrapper(NotificationsPage),
    title: 'Notifications',
    icon: Bell,
    isNavigable: true,
    renderTarget: ['main', 'pane'],
    allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
    defaultBehavior: 'navigate',
    triggerBehaviors: {
      navClick: 'openPane',
    },
  },
  'data-demo': {
    id: 'data-demo',
    component: suspenseWrapper(DataDemoPage),
    title: 'Data Showcase',
    icon: Database,
    isNavigable: true,
    renderTarget: ['main'],
    allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
    defaultBehavior: 'navigate',
  },
  messaging: {
    id: 'messaging',
    isNavigable: true,
    title: 'Messaging',
    icon: Inbox,
    renderTarget: [], // It doesn't render a component itself
    allowedBodyStates: ['split_view', 'fullscreen'],
    defaultBehavior: 'navigate',
    compositeView: {
      main: 'messagingPage',
      right: 'messagingContextPanel',
    },
    onNavigate: { sidebar: SIDEBAR_STATES.COLLAPSED },
  },
  messagingPage: {
    id: 'messagingPage',
    component: suspenseWrapper(MessagingPage),
    title: 'Inbox',
    icon: Inbox, // icon is required, even if not shown
    isNavigable: false,
    renderTarget: ['main'],
    allowedBodyStates: ['split_view', 'fullscreen'],
    hasOwnScrolling: true,
  },
  messagingContextPanel: {
    id: 'messagingContextPanel',
    component: suspenseWrapper(MessagingContent),
    title: 'Task Details',
    icon: SlidersHorizontal, // icon is required
    isNavigable: false,
    renderTarget: ['pane'],
    allowedBodyStates: ['side_pane', 'split_view', 'fullscreen'],
  },
  dataItemDetail: {
    id: 'dataItemDetail',
    component: suspenseWrapper(DataDetailContent),
    title: 'Item Details',
    icon: FileText,
    isNavigable: false,
    renderTarget: ['main', 'pane'],
    allowedBodyStates: ['normal', 'side_pane', 'split_view', 'fullscreen'],
    defaultBehavior: 'openPane',
    hasOwnScrolling: true,
  },
};

export const getViewById = (id: string | null | undefined): ViewRegistration | null => {
  if (!id) return null;
  return viewRegistry[id as ViewId] || null;
}
````

## File: index.html
````html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jeli App Shell</title>
    <script>
      (function() {
        try {
          const storageKey = 'app-shell-storage';
          const storageValue = localStorage.getItem(storageKey);
          let isDarkMode;

          if (storageValue) {
            isDarkMode = JSON.parse(storageValue)?.state?.isDarkMode;
          }
          
          if (typeof isDarkMode !== 'boolean') {
            isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
          }
          
          document.documentElement.classList.toggle('dark', isDarkMode);
        } catch (e) { /* Fails safely */ }
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <div id="toaster-container"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
````

## File: tailwind.config.js
````javascript
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
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss/plugin")(function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      });
    }),
  ],
}
````

## File: tsconfig.json
````json
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
  ]
}
````

## File: tsconfig.node.json
````json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
````

## File: src/hooks/usePageViewConfig.hook.ts
````typescript
import { useEffect } from 'react';
import { useAppShellStore } from '@/store/appShell.store';

interface PageViewConfig {
    sidePaneWidth?: number;
    splitPaneWidth?: number;
}

/**
 * A hook for a page component to declaratively set its desired pane widths.
 * It sets the widths when config changes and resets them to the application defaults on unmount.
 * @param {PageViewConfig} config - The desired widths for side pane and split view.
 */
export function usePageViewConfig(config: PageViewConfig) {
    const { setSidePaneWidth, setSplitPaneWidth, resetPaneWidths } = useAppShellStore.getState();
    const { sidePaneWidth, splitPaneWidth } = config;

    useEffect(() => {
        if (sidePaneWidth !== undefined) {
            setSidePaneWidth(sidePaneWidth);
        }
        if (splitPaneWidth !== undefined) {
            setSplitPaneWidth(splitPaneWidth);
        }

        // Return a cleanup function to reset widths when the component unmounts
        return () => {
            resetPaneWidths();
        };
    }, [sidePaneWidth, splitPaneWidth, setSidePaneWidth, setSplitPaneWidth, resetPaneWidths]);
}
````

## File: src/hooks/usePaneDnd.hook.ts
````typescript
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppShellStore } from '@/store/appShell.store';
import { BODY_STATES } from '@/lib/utils';

const pageToPaneMap: Record<string, 'main' | 'settings' | 'toaster' | 'notifications' | 'dataDemo' | 'messaging'> = {
  dashboard: 'main',
  settings: 'settings',
  toaster: 'toaster',
  notifications: 'notifications',
  'data-demo': 'dataDemo',
  messaging: 'messaging',
};

export function usePaneDnd() {
  const {
    draggedPage,
    dragHoverTarget,
    bodyState,
    sidePaneContent,
  } = useAppShellStore(state => ({
    draggedPage: state.draggedPage,
    dragHoverTarget: state.dragHoverTarget,
    bodyState: state.bodyState,
    sidePaneContent: state.sidePaneContent,
  }));
  const { setDraggedPage, setDragHoverTarget } = useAppShellStore.getState();
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = location.pathname.split('/')[1] || 'dashboard';

  const handleDragOverLeft = useCallback((e: React.DragEvent) => {
    if (!draggedPage) return;
    e.preventDefault();
    if (dragHoverTarget !== 'left') {
      setDragHoverTarget('left');
    }
  }, [draggedPage, dragHoverTarget, setDragHoverTarget]);

  const handleDropLeft = useCallback(() => {
    if (!draggedPage) return;

    const paneContentOfDraggedPage = pageToPaneMap[draggedPage as keyof typeof pageToPaneMap];
    if (paneContentOfDraggedPage === sidePaneContent && (bodyState === BODY_STATES.SIDE_PANE || bodyState === BODY_STATES.SPLIT_VIEW)) {
      navigate(`/${draggedPage}`, { replace: true });
    } 
    else if (bodyState === BODY_STATES.NORMAL && draggedPage !== activePage) {
        const originalActivePagePaneContent = pageToPaneMap[activePage as keyof typeof pageToPaneMap];
        if (originalActivePagePaneContent) {
            navigate(`/${draggedPage}?view=split&right=${originalActivePagePaneContent}`, { replace: true });
        } else {
            navigate(`/${draggedPage}`, { replace: true });
        }
    } else {
      if (bodyState === BODY_STATES.SPLIT_VIEW) {
        const rightPane = location.search.split('right=')[1];
        if (rightPane) {
          navigate(`/${draggedPage}?view=split&right=${rightPane}`, { replace: true });
          return;
        }
      }
      navigate(`/${draggedPage}`, { replace: true });
    }
    
    setDraggedPage(null);
    setDragHoverTarget(null);
  }, [draggedPage, activePage, bodyState, sidePaneContent, navigate, location.search, setDraggedPage, setDragHoverTarget]);

  const handleDragOverRight = useCallback((e: React.DragEvent) => {
    if (!draggedPage) return;
    e.preventDefault();
    if (dragHoverTarget !== 'right') {
      setDragHoverTarget('right');
    }
  }, [draggedPage, dragHoverTarget, setDragHoverTarget]);

  const handleDropRight = useCallback(() => {
    if (!draggedPage) return;
    const pane = pageToPaneMap[draggedPage as keyof typeof pageToPaneMap];
    if (pane) {
      let mainPage = activePage;
      if (draggedPage === activePage) {
        mainPage = 'dashboard';
      }
      navigate(`/${mainPage}?view=split&right=${pane}`, { replace: true });
    }
    setDraggedPage(null);
    setDragHoverTarget(null);
  }, [draggedPage, activePage, navigate, setDraggedPage, setDragHoverTarget]);

  const handleDragLeave = useCallback(() => {
      setDragHoverTarget(null);
  }, [setDragHoverTarget]);

  return {
    handleDragOverLeft,
    handleDropLeft,
    handleDragOverRight,
    handleDropRight,
    handleDragLeave,
  };
}
````

## File: src/pages/Messaging/components/MessagingContent.tsx
````typescript
import React, { useState, useMemo } from 'react';
import { useMessagingStore } from '../store/messaging.store';
import { ContactInfoPanel } from './ContactInfoPanel';
import { AIInsightsPanel } from './AIInsightsPanel';
import { ActivityPanel } from './ActivityPanel';
import { NotesPanel } from './NotesPanel';
import { TaskHeader } from './TaskHeader';
import { AnimatedTabs } from '@/components/ui/animated-tabs';
import { TechOrbitDisplay } from '@/components/effects/OrbitingCircles';
import { useAppViewManager } from '@/hooks/useAppViewManager.hook';

interface MessagingContentProps {
  // Note: conversationId is now derived from the URL via useAppViewManager hook
  // to ensure it's in sync with the composite view's state.
}

export const MessagingContent: React.FC<MessagingContentProps> = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const { conversationId } = useAppViewManager();
  const task = useMessagingStore(state => conversationId ? state.getTaskById(conversationId) : undefined);
  
  const tabs = useMemo(() => [
    { id: 'contact', label: 'Contact' },
    { id: 'ai', label: 'AI Insights' },
    { id: 'activity', label: 'Activity' },
    { id: 'notes', label: 'Notes' },
  ], []);

  if (!task) {
    return (
      <div className="h-full flex-1 flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
        <TechOrbitDisplay text="Context" />
        <div className="text-center z-10 bg-background/50 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="mt-4 text-lg font-medium">Select a Task</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Task details and contact information will appear here.
            </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex-1 flex flex-col bg-background overflow-hidden" data-testid="messaging-content-scroll-pane">
      <div className="flex-shrink-0 border-b p-6">
        <TaskHeader task={task} />
      </div>
      <AnimatedTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        size="sm" 
        className="px-6 border-b flex-shrink-0"
        wrapperClassName="flex-1 flex flex-col min-h-0"
        contentClassName="flex-1 min-h-0"
      >
        <div className="p-6 h-full overflow-y-auto"><ContactInfoPanel contact={task.contact} /></div>
        <div className="p-6 h-full overflow-y-auto"><AIInsightsPanel task={task} /></div>
        <div className="p-6 h-full overflow-y-auto"><ActivityPanel contact={task.contact} /></div>
        <div className="p-6 h-full overflow-y-auto"><NotesPanel contact={task.contact} /></div>
      </AnimatedTabs>
    </div>
  );
};
````

## File: src/components/global/CommandPalette.tsx
````typescript
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { useCommandPaletteToggle } from '@/hooks/useCommandPaletteToggle.hook'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook';
import { useAppShellStore } from '@/store/appShell.store';
import { Home, Settings, Moon, Sun, Monitor, Smartphone, PanelRight, Maximize, Component, Bell } from 'lucide-react'

export function CommandPalette() {
  const { setCompactMode, toggleFullscreen, setCommandPaletteOpen, toggleDarkMode } = useAppShellStore.getState();
  const isCommandPaletteOpen = useAppShellStore(s => s.isCommandPaletteOpen);
  const isDarkMode = useAppShellStore(s => s.isDarkMode);
  const viewManager = useAppViewManager();
  useCommandPaletteToggle()
  
  const runCommand = (command: () => void) => {
    setCommandPaletteOpen(false);
    command()
  }

  return (
    <CommandDialog open={isCommandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => viewManager.navigateTo('dashboard'))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Go to Dashboard</span>
            <CommandShortcut>G D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => viewManager.navigateTo('settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Go to Settings</span>
            <CommandShortcut>G S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => viewManager.navigateTo('toaster'))}>
            <Component className="mr-2 h-4 w-4" />
            <span>Go to Toaster Demo</span>
            <CommandShortcut>G T</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => viewManager.navigateTo('notifications'))}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Go to Notifications</span>
            <CommandShortcut>G N</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(toggleDarkMode)}>
            {isDarkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            <span>Toggle Theme</span>
            <CommandShortcut>⌘T</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(toggleFullscreen)}>
            <Maximize className="mr-2 h-4 w-4" />
            <span>Toggle Fullscreen</span>
            <CommandShortcut>⌘F</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => viewManager.openPane('settings'))}>
            <PanelRight className="mr-2 h-4 w-4" />
            <span>Open Settings in Side Pane</span>
            <CommandShortcut>⌥S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Preferences">
          <CommandItem onSelect={() => runCommand(() => setCompactMode(true))}>
            <Smartphone className="mr-2 h-4 w-4" />
            <span>Enable Compact Mode</span>
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setCompactMode(false))}>
            <Monitor className="mr-2 h-4 w-4" />
            <span>Disable Compact Mode</span>
            <CommandShortcut>⇧⌘C</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
````

## File: src/lib/utils.ts
````typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from "date-fns"

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
  SIDE_PANE: 'side_pane',
  SPLIT_VIEW: 'split_view'
} as const

export type SidebarState = typeof SIDEBAR_STATES[keyof typeof SIDEBAR_STATES]
export type BodyState = typeof BODY_STATES[keyof typeof BODY_STATES]

export function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatDistanceToNowShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const result = formatDistanceToNow(dateObj, { addSuffix: true });

  if (result === 'less than a minute ago') return 'now';

  return result
    .replace('about ', '')
    .replace(' minutes', 'm')
    .replace(' minute', 'm')
    .replace(' hours', 'h')
    .replace(' hour', 'h')
    .replace(' days', 'd')
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500/20 text-green-700 border-green-500/30'
    case 'pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
    case 'completed': return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
    case 'archived': return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
    default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
  }
}

// A helper to get nested properties from an object, e.g., 'metrics.views'
export function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

export const getPrioritySolidColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-500'
    case 'high': return 'bg-orange-500'
    case 'medium': return 'bg-blue-500'
    case 'low': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-500/20 text-red-700 border-red-500/30'
    case 'high': return 'bg-orange-500/20 text-orange-700 border-orange-500/30'
    case 'medium': return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
    case 'low': return 'bg-green-500/20 text-green-700 border-green-500/30'
    default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
  }
}
````

## File: src/features/dynamic-view/components/shared/DetailPanel.tsx
````typescript
import React, { useRef, useState, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Clock, 
  Tag,
  User,
  BarChart3,
} from 'lucide-react'
import type { GenericItem, DetailViewConfig } from '../../types'
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation.motion.hook';
import { EditableField } from './EditableField'
import { DraggableSection } from './DraggableSection'
import { getNestedValue } from '@/lib/utils'
import { useDynamicView } from '../../DynamicViewContext'

interface DetailPanelProps<TFieldId extends string, TItem extends GenericItem> {
  item: TItem;
  config: DetailViewConfig<TFieldId>;
}

const SECTION_ICONS: Record<string, React.ElementType> = {
  "Assigned to": User,
  "Engagement Metrics": BarChart3,
  "Tags": Tag,
  "Timeline": Clock,
};

export function DetailPanel<TFieldId extends string, TItem extends GenericItem>({ item, config }: DetailPanelProps<TFieldId, TItem>) {
  const contentRef = useRef<HTMLDivElement>(null)
  useStaggeredAnimation(contentRef, [item]);
  
  const { getFieldDef } = useDynamicView<TFieldId, TItem>();
  const { header, body } = config;
  const [sections, setSections] = useState([...body.sections]);

  const sectionIds = useMemo(() => sections.map(s => s.title), [sections]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setSections((currentSections) => {
        const oldIndex = sectionIds.indexOf(active.id as string);
        const newIndex = sectionIds.indexOf(over!.id as string);
        return arrayMove(currentSections, oldIndex, newIndex);
      });
    }
  };

  if (!item) {
    return null
  }
  
  return (
    <div ref={contentRef} className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
             <EditableField item={item} fieldId={header.thumbnailField} />
          </div>
          <div className="flex-1 min-w-0 break-words">
            <h1 className="text-2xl font-bold mb-1 leading-tight truncate">
              <EditableField item={item} fieldId={header.titleField} />
            </h1>
            <p className="text-muted-foreground truncate">
              <EditableField item={item} fieldId={header.descriptionField} />
            </p>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {header.badgeFields.map((fieldId: TFieldId) => (
            <EditableField key={fieldId} item={item} fieldId={fieldId} />
          ))}
        </div>

        {/* Progress */}
        <EditableField item={item} fieldId={header.progressField} options={{ showPercentage: true }} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sectionIds}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section) => {
                const IconComponent = SECTION_ICONS[section.title];
                const hasContent = section.fields.some((fieldId: TFieldId) => {
                  const value = getNestedValue(item, fieldId as string);
                  return value !== null && typeof value !== 'undefined';
                });

                if (!hasContent) return null;

                return (
                  <DraggableSection key={section.title} id={section.title} >
                    <div className="p-4 bg-card/30 rounded-2xl border border-border/30">
                      <div className="flex items-center gap-1 mb-3">
                        {IconComponent && <IconComponent className="w-4 h-4 text-muted-foreground" />}
                        <h3 className="font-semibold text-sm">{section.title}</h3>
                      </div>
                      <div className="space-y-3">
                        {section.fields.map((fieldId: TFieldId) => {
                          const fieldDef = getFieldDef(fieldId);
                          return (
                            <div key={fieldId} className="flex items-start gap-4 text-sm">
                              <div className="w-1/3 text-muted-foreground pt-1.5 shrink-0">{fieldDef?.label}</div>
                              <div className="w-2/3 grow min-w-0 break-words"><EditableField item={item} fieldId={fieldId} /></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </DraggableSection>
                );
              })}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  )
}
````

## File: src/hooks/useResizablePanes.hook.ts
````typescript
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAppShellStore } from '@/store/appShell.store';
import { BODY_STATES } from '@/lib/utils';

export function useResizableSidebar(
  sidebarRef: React.RefObject<HTMLDivElement>,
  resizeHandleRef: React.RefObject<HTMLDivElement>
) {
  const isResizing = useAppShellStore(s => s.isResizing);
  const { setSidebarWidth, setIsResizing } = useAppShellStore.getState();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = Math.max(200, Math.min(500, e.clientX));
      setSidebarWidth(newWidth);

      if (sidebarRef.current) {
        gsap.set(sidebarRef.current, { width: newWidth });
      }
      if (resizeHandleRef.current) {
        gsap.set(resizeHandleRef.current, { left: newWidth });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setSidebarWidth, setIsResizing, sidebarRef, resizeHandleRef]);
}

export function useResizableRightPane(
  rightPaneRef: React.RefObject<HTMLDivElement>
) {
  const isResizingRightPane = useAppShellStore(s => s.isResizingRightPane);
  const bodyState = useAppShellStore(s => s.bodyState);
  const { setSplitPaneWidth, setSidePaneWidth, setIsResizingRightPane, setReducedMotion } = useAppShellStore.getState();
  const finalWidthRef = useRef<number | null>(null);
  const originalReducedMotionRef = useRef<boolean | null>(null);

  // This effect temporarily disables animations during resizing to prevent the
  // pane's enter/exit animation from firing incorrectly.
  useEffect(() => {
    if (isResizingRightPane) {
      // When resizing starts, store the original setting and disable animations.
      if (originalReducedMotionRef.current === null) {
        originalReducedMotionRef.current = useAppShellStore.getState().reducedMotion;
        setReducedMotion(true);
      }
    } else {
      // When resizing ends, restore the original setting after a brief delay.
      // This ensures the final width is rendered before animations are re-enabled.
      if (originalReducedMotionRef.current !== null) {
        // Use requestAnimationFrame to ensure we re-enable animations *after* the browser
        // has painted the new, non-animated pane width. This is more reliable than setTimeout(0).
        requestAnimationFrame(() => {
          setReducedMotion(originalReducedMotionRef.current!);
          originalReducedMotionRef.current = null;
        });
      }
    }
  }, [isResizingRightPane, setReducedMotion]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRightPane) return;

      const newWidth = window.innerWidth - e.clientX;
      finalWidthRef.current = newWidth;
      if (rightPaneRef.current) {
        gsap.set(rightPaneRef.current, { width: newWidth });
      }
    };

    const handleMouseUp = () => {
      if (finalWidthRef.current !== null) {
        if (bodyState === BODY_STATES.SPLIT_VIEW) {
          setSplitPaneWidth(finalWidthRef.current);
        } else {
          setSidePaneWidth(finalWidthRef.current);
        }
        finalWidthRef.current = null;
      }
      setIsResizingRightPane(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizingRightPane) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isResizingRightPane, setSplitPaneWidth, setSidePaneWidth, setIsResizingRightPane, bodyState, rightPaneRef]);
}
````

## File: src/components/layout/AppShell.tsx
````typescript
import React, { useRef, type ReactElement, useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils'
import { gsap } from 'gsap';
import { CommandPalette } from '@/components/global/CommandPalette';
import { useAppShellStore } from '@/store/appShell.store';
import { SIDEBAR_STATES, BODY_STATES } from '@/lib/utils'
import { useResizableSidebar, useResizableRightPane } from '@/hooks/useResizablePanes.hook'
import { useSidebarAnimations, useBodyStateAnimations } from '@/hooks/useAppShellAnimations.hook'
import { ViewModeSwitcher } from './ViewModeSwitcher';
import { useAppViewManager } from '@/hooks/useAppViewManager.hook';
import type { ViewId } from '@/views/viewRegistry';

interface AppShellProps {
  sidebar: ReactElement;
  topBar: ReactElement;
  mainContent: ReactElement;
  rightPane: ReactElement;
  commandPalette?: ReactElement;
  onOverlayClick?: () => void;
}

// Helper hook to get the previous value of a prop or state
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}


export function AppShell({ sidebar, topBar, mainContent, rightPane, commandPalette, onOverlayClick }: AppShellProps) {
  const sidebarState = useAppShellStore(s => s.sidebarState);
  const autoExpandSidebar = useAppShellStore(s => s.autoExpandSidebar);
  const hoveredPane = useAppShellStore(s => s.hoveredPane);
  const draggedPage = useAppShellStore(s => s.draggedPage);
  const bodyState = useAppShellStore(s => s.bodyState);
  const reducedMotion = useAppShellStore(s => s.reducedMotion);
  const isTopBarVisible = useAppShellStore(s => s.isTopBarVisible);
  const isDarkMode = useAppShellStore(s => s.isDarkMode);
  const { setSidebarState, peekSidebar, setHoveredPane, setTopBarHovered } = useAppShellStore.getState();
  
  const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;
  const isSidePaneOpen = bodyState === BODY_STATES.SIDE_PANE;
  const location = useLocation();
  const activePage = location.pathname.split('/')[1] || 'dashboard';
  const appRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const rightPaneRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const topBarContainerRef = useRef<HTMLDivElement>(null)
  const mainAreaRef = useRef<HTMLDivElement>(null)

  const isSplitView = bodyState === BODY_STATES.SPLIT_VIEW;
  const viewManager = useAppViewManager();

  // Custom hooks for logic
  useResizableSidebar(sidebarRef, resizeHandleRef);
  useResizableRightPane(rightPaneRef);
  useSidebarAnimations(sidebarRef, resizeHandleRef);
  useBodyStateAnimations(appRef, mainContentRef, rightPaneRef, topBarContainerRef, mainAreaRef);
  
  const sidebarWithProps = React.cloneElement(sidebar, { 
    ref: sidebarRef,
    onMouseEnter: () => {
      if (autoExpandSidebar && sidebarState === SIDEBAR_STATES.COLLAPSED) {
        peekSidebar()
      }
    },
    onMouseLeave: () => {
      if (autoExpandSidebar && sidebarState === SIDEBAR_STATES.PEEK) {
        setSidebarState(SIDEBAR_STATES.COLLAPSED);
      }
    }
  });

  const mainContentWithProps = React.cloneElement(mainContent, {
    ref: mainContentRef,
  });

  const rightPaneWithProps = React.cloneElement(rightPane, { ref: rightPaneRef });

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
              useAppShellStore.getState().setIsResizing(true);
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
            onMouseEnter={() => {
              if (isSplitView) {
                setTopBarHovered(true);
                setHoveredPane(null);
              }
            }}
            onMouseLeave={() => {
              if (isSplitView) {
                setTopBarHovered(false);
              }
            }}
          >
            {topBar}
          </div>

          {/* Invisible trigger area for top bar in split view */}
          {isSplitView && (
            <div
              className="absolute top-0 left-0 right-0 h-4 z-20"
              onMouseEnter={() => {
                setTopBarHovered(true);
                setHoveredPane(null);
              }}
            />
          )}

          <div className="flex flex-1 min-h-0">
            <div
              ref={mainAreaRef}
              className="relative flex-1 overflow-hidden bg-background"
              onMouseEnter={() => { if (isSplitView && !draggedPage) setHoveredPane('left'); }}
              onMouseLeave={() => { if (isSplitView && !draggedPage) setHoveredPane(null); }}
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
              {mainContentWithProps}
              {isSplitView && hoveredPane === 'left' && !draggedPage && (
                <div className={cn("absolute right-4 z-50 transition-all", isTopBarVisible ? 'top-24' : 'top-4')}>
                  <ViewModeSwitcher pane="main" targetPage={viewManager.mainViewId as ViewId} />
                </div>
              )}
            </div>
            {isSplitView ? (
              <div
                className="relative"
                onMouseEnter={() => { if (isSplitView && !draggedPage) setHoveredPane('right'); }}
                onMouseLeave={() => { if (isSplitView && !draggedPage) setHoveredPane(null); }}
              >
                {rightPaneWithProps}
                {hoveredPane === 'right' && !draggedPage && (
                  <div className={cn("absolute right-4 z-[70] transition-all", isTopBarVisible ? 'top-24' : 'top-4')}>
                    <ViewModeSwitcher pane="right" targetPage={viewManager.rightPaneViewId as ViewId} />
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
````

## File: src/components/layout/TopBar.tsx
````typescript
import React from 'react';
import {
  Moon, 
  Sun,
  Settings,
  Command,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BODY_STATES } from '@/lib/utils'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import { UserDropdown } from './UserDropdown'
import { ViewModeSwitcher } from './ViewModeSwitcher'
import { useAppShellStore } from '@/store/appShell.store'

interface TopBarProps {
  breadcrumbs?: React.ReactNode
  pageControls?: React.ReactNode
}

export const TopBar = React.memo(({
  breadcrumbs,
  pageControls,
}: TopBarProps) => {
  const bodyState = useAppShellStore(s => s.bodyState)
  const isDarkMode = useAppShellStore(s => s.isDarkMode);
  const { 
    setCommandPaletteOpen,
    toggleDarkMode,
  } = useAppShellStore.getState();
  const viewManager = useAppViewManager();

  return (
    <div className={cn(
      "h-20 bg-background border-b border-border flex items-center justify-between px-6 z-50 gap-4"
    )}>
      {/* Left Section - Sidebar Controls & Breadcrumbs */}
      <div className="flex items-center gap-4">
        {breadcrumbs}
      </div>

      {/* Right Section - page controls, and global controls */}
      <div className="flex items-center gap-3">
        {pageControls}

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
          onClick={toggleDarkMode}
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
          onClick={() => viewManager.trigger('settings', 'iconClick')}
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
});
````

## File: src/pages/Messaging/components/TaskList.tsx
````typescript
import { useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, Check, Inbox, Clock, Zap, Shield, Eye } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useMessagingStore } from '../store/messaging.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { cn, formatDistanceToNowShort } from '@/lib/utils';
import { AnimatedTabs } from '@/components/ui/animated-tabs';
import type { TaskStatus, TaskPriority, TaskView } from '../types';
import { useAppViewManager } from '@/hooks/useAppViewManager.hook';
import { useMessagingTaskCounts } from '../store/messaging.store';

// Local helpers for styling based on task properties
const getStatusIcon = (status: TaskStatus) => {
    switch(status) {
        case 'open': return <Inbox className="w-3 h-3 text-blue-500" />;
        case 'in-progress': return <Zap className="w-3 h-3 text-yellow-500" />;
        case 'done': return <Shield className="w-3 h-3 text-green-500" />;
        case 'snoozed': return <Clock className="w-3 h-3 text-gray-500" />;
    }
};

const getPriorityIcon = (priority: TaskPriority) => {
    switch(priority) {
        case 'high': return <div className="w-2 h-2 rounded-full bg-red-500" />;
        case 'medium': return <div className="w-2 h-2 rounded-full bg-yellow-500" />;
        case 'low': return <div className="w-2 h-2 rounded-full bg-green-500" />;
        default: return <div className="w-2 h-2 rounded-full bg-gray-400" />;
    }
};

const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'open', label: 'Open' }, { value: 'in-progress', label: 'In Progress' }, { value: 'done', label: 'Done' }, { value: 'snoozed', label: 'Snoozed' }
];
const priorityOptions: { value: TaskPriority; label: string }[] = [
    { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }, { value: 'none', label: 'None' }
];

const TABS_CONFIG: { id: TaskView, label: string }[] = [
  { id: 'all_open', label: 'Open' },
  { id: 'unassigned', label: 'Unassigned' },
  { id: 'me', label: 'Me' },
  { id: 'done', label: 'Done' }
];

export const TaskList = () => {
  const { conversationId } = useParams<{ conversationId: string }>(); // This will be taskId later
  const { 
    getFilteredTasks,
    setSearchTerm,
    activeFilters,
    setActiveTaskView,
    searchTerm,
   } = useMessagingStore();
   const { messagingView, setMessagingView } = useAppViewManager();
   const taskCounts = useMessagingTaskCounts();

  useEffect(() => {
    setActiveTaskView(messagingView || 'all_open');
  }, [messagingView, setActiveTaskView]);

  const filteredTasks = getFilteredTasks();
  const activeFilterCount = Object.values(activeFilters).reduce((count, filterArray) => count + filterArray.length, 0);

  const TABS = useMemo(() => 
    TABS_CONFIG.map(tab => ({
      ...tab,
      count: taskCounts[tab.id as keyof typeof taskCounts]
    })), 
    [taskCounts]
  );

  return (
    <div className="h-full flex flex-col bg-background/80">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-background/80 p-4 space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Inbox</h2>
        <div className="flex gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search tasks..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10 border-dashed gap-2">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                        {activeFilterCount > 0 && <Badge variant="secondary" className="rounded-sm px-1 font-normal">{activeFilterCount}</Badge>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0" align="end">
                    <FilterCommand />
                </PopoverContent>
            </Popover>
        </div>
      </div>
      <AnimatedTabs
        tabs={TABS}
        activeTab={messagingView || 'all_open'}
        onTabChange={(tabId) => setMessagingView(tabId as TaskView)}
        size="sm"
        className="px-4"
      />

      {/* Task List */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-1">
          {filteredTasks.map(task => {
            const currentUserId = 'user-1';
            const isHandledByOther = task.activeHandlerId && task.activeHandlerId !== currentUserId;

            return (
              <Link
                to={`/messaging/${task.id}`}
                key={task.id}
                className={cn(
                  "block p-3 rounded-lg text-left transition-all duration-200 hover:bg-accent/50",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none",
                  conversationId === task.id && "bg-accent"
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 mt-1">
                    <AvatarImage src={task.contact.avatar} alt={task.contact.name} />
                    <AvatarFallback>{task.contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-semibold truncate pr-2">
                        {task.contact.name} <span className="text-muted-foreground font-normal">&middot; {task.contact.company}</span>
                      </p>
                      <p className="text-sm truncate text-foreground mt-1">{task.title}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5" title={task.status}>
                              {getStatusIcon(task.status)}
                              <span className="capitalize">{task.status.replace('-', ' ')}</span>
                          </div>
                          <div className="flex items-center gap-1.5" title={task.priority}>
                              {getPriorityIcon(task.priority)}
                              <span className="capitalize">{task.priority}</span>
                          </div>
                          {task.assignee && (
                              <div className="flex items-center gap-1.5" title={`Assigned to ${task.assignee.name}`}>
                                  <Avatar className="h-4 w-4"><AvatarImage src={task.assignee.avatar} /></Avatar>
                              </div>
                          )}
                          {isHandledByOther && <span title="Being handled by another user"><Eye className="w-3.5 h-3.5" /></span>}
                      </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1.5 flex-shrink-0">
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{formatDistanceToNowShort(new Date(task.lastActivity.timestamp))}</p>
                    {task.unreadCount > 0 ? (
                        <Badge className="bg-primary h-5 w-5 p-0 flex items-center justify-center">{task.unreadCount}</Badge>
                    ) : <div className="h-5 w-5" /> /* Spacer to maintain alignment */ }
                  </div>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  );
};

// Filter component for popover
function FilterCommand() {
    const { activeFilters, setFilters, assignees, getAvailableTags } = useMessagingStore();
    const availableTags = getAvailableTags();

    const handleSelect = (type: 'status' | 'priority' | 'assigneeId' | 'tags', value: string) => {
        const current = new Set(activeFilters[type]);
        current.has(value) ? current.delete(value) : current.add(value);
        setFilters({ [type]: Array.from(current) });
    };

    const hasActiveFilters = Object.values(activeFilters).some(arr => arr.length > 0);

    return (
        <Command>
            <CommandInput placeholder="Filter by..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Status">
                    {statusOptions.map(o => (
                        <CommandItem key={o.value} onSelect={() => handleSelect('status', o.value)}>
                            <div className={cn('mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary', activeFilters.status.includes(o.value) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible')}><Check className="h-4 w-4" /></div>
                            <span>{o.label}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Priority">
                    {priorityOptions.map(o => (
                        <CommandItem key={o.value} onSelect={() => handleSelect('priority', o.value)}>
                            <div className={cn('mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary', activeFilters.priority.includes(o.value) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible')}><Check className="h-4 w-4" /></div>
                            <span>{o.label}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Assignee">
                    {assignees.map(a => (
                        <CommandItem key={a.id} onSelect={() => handleSelect('assigneeId', a.id)}>
                            <div className={cn('mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary', activeFilters.assigneeId.includes(a.id) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible')}><Check className="h-4 w-4" /></div>
                            <Avatar className="h-5 w-5 mr-2"><AvatarImage src={a.avatar} /><AvatarFallback>{a.name.charAt(0)}</AvatarFallback></Avatar>
                            <span>{a.name}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Tags">
                    {availableTags.map(t => (
                        <CommandItem key={t} onSelect={() => handleSelect('tags', t)}>
                            <div className={cn('mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary', activeFilters.tags.includes(t) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible')}><Check className="h-4 w-4" /></div>
                            <span>{t}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>

                {hasActiveFilters && (
                    <>
                        <CommandSeparator />
                        <CommandGroup>
                            <CommandItem onSelect={() => setFilters({ status: [], priority: [], assigneeId: [], tags: [], channels: [] })} className="justify-center text-center text-sm">Clear all filters</CommandItem>
                        </CommandGroup>
                    </>
                )}
            </CommandList>
        </Command>
    );
}
````

## File: package.json
````json
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
  "peerDependencies": {
    "@iconify/react": "^4.1.1",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "cmdk": "^0.2.0",
    "date-fns": "^3.6.0",
    "gsap": "^3.13.0",
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
  },
  "dependencies": {
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@faker-js/faker": "^10.1.0",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.2.8"
  }
}
````

## File: src/components/layout/ViewModeSwitcher.tsx
````typescript
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { useAppShellStore } from '@/store/appShell.store';
import { BODY_STATES } from '@/lib/utils'
import { useAppViewManager } from '@/hooks/useAppViewManager.hook'
import {
  Columns,
  PanelRightOpen,
  SplitSquareHorizontal,
  Maximize,
  Minimize,
  Layers,
  X,
  ArrowLeftRight,
} from 'lucide-react';
import { getViewById, type ViewId } from '@/views/viewRegistry';

export function ViewModeSwitcher({ pane, targetPage }: { pane?: 'main' | 'right'; targetPage?: ViewId }) {
  const bodyState = useAppShellStore(s => s.bodyState);
  const fullscreenTarget = useAppShellStore(s => s.fullscreenTarget);
  const { toggleFullscreen } = useAppShellStore.getState();
  const {
    currentActivePage,
    toggleSplitView,
    setNormalView,
    navigateTo,
    toggleSidePane,
    switchSplitPanes,
    closeSplitPane,
    itemId,
  } = useAppViewManager();

  const activePage = targetPage || currentActivePage;
  const view = getViewById(activePage);
  const [isExpanded, setIsExpanded] = useState(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isFullscreen = bodyState === BODY_STATES.FULLSCREEN;
  const isThisPaneFullscreen = isFullscreen && (
    (pane === 'main' && fullscreenTarget !== 'right') || // main pane is fullscreen if target is not right
    (pane === 'right' && fullscreenTarget === 'right') || // right pane is fullscreen if it is the target
    (!pane && fullscreenTarget !== 'right') // global switcher shows minimize if main pane is fullscreen
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

  const canBeSidePane = view?.renderTarget?.includes('pane');
  // For split view, the *current* page must support being the main pane in that layout.
  // The right pane's ability to be a pane is checked by the view manager.
  const canBeSplitView = view?.allowedBodyStates?.includes('split_view');

  const handleSidePaneClick = () => {
    const payload = (activePage === 'dataItemDetail' && itemId) ? { itemId } : undefined;
    toggleSidePane(activePage, payload);
  }

  const handleNormalViewClick = () => {
    if (isFullscreen) {
      toggleFullscreen();
    }
    if (targetPage && targetPage !== currentActivePage) {
      const navParams = (targetPage === 'dataItemDetail' && itemId) ? { itemId } : undefined;
      navigateTo(targetPage, navParams);
    } else {
      setNormalView();
    }
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
      icon: <PanelRightOpen className="w-4 h-4" />,
      disabled: !canBeSidePane,
    },
    {
      id: 'split-view',
      onClick: () => toggleSplitView(),
      active: bodyState === BODY_STATES.SPLIT_VIEW,
      title: "Split View",
      icon: <SplitSquareHorizontal className="w-4 h-4" />,
      disabled: !canBeSplitView,
    },
    {
      id: 'fullscreen',
      onClick: () => {
        if (targetPage && targetPage !== currentActivePage) {
          const navParams = (targetPage === 'dataItemDetail' && itemId) ? { itemId } : undefined;
          navigateTo(targetPage, navParams);
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
      onClick: switchSplitPanes,
      active: false,
      title: "Switch Panes",
      icon: <ArrowLeftRight className="w-4 h-4" />
    });
    buttons.push({
      id: 'close',
      onClick: () => closeSplitPane(pane || 'right'),
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
          onClick={btn.disabled ? undefined : btn.onClick}
          disabled={btn.disabled}
          className={cn(
            'h-8 w-0 flex items-center justify-center rounded-full hover:bg-accent transition-colors group opacity-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
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
````

## File: src/pages/Messaging/index.tsx
````typescript
import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { TaskList } from "./components/TaskList";
import { TaskDetail } from "./components/TaskDetail";
import { cn } from "@/lib/utils";

const useResizableMessagingPanes = (
  containerRef: React.RefObject<HTMLDivElement>,
  initialWidth: number = 320
) => {
  const [isResizing, setIsResizing] = useState(false);
  const [listWidth, setListWidth] = useState(initialWidth);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;
      // Constraints for the conversation list pane
      setListWidth(Math.max(280, Math.min(newWidth, containerRect.width - 500)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp, { once: true });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (document.body) {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
  }, [isResizing, containerRef]);

  return { listWidth, handleMouseDown, isResizing };
};

export default function MessagingPage() {
  useParams<{ conversationId?: string }>(); // Keep for route matching, but don't need the value here
  const containerRef = useRef<HTMLDivElement>(null);

  const { listWidth, handleMouseDown, isResizing } = useResizableMessagingPanes(containerRef);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "h-full w-full flex bg-background",
        isResizing && "cursor-col-resize select-none"
      )}
    >
      <div style={{ width: `${listWidth}px` }} className="flex-shrink-0 h-full">
        <TaskList />
      </div>
      <div onMouseDown={handleMouseDown} className="w-2 flex-shrink-0 cursor-col-resize group flex items-center justify-center">
        <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors duration-200" />
      </div>
      <div className="flex-1 min-w-0 h-full">
        <TaskDetail />
      </div>
    </div>
  );
}
````

## File: src/store/appShell.store.ts
````typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type ReactElement } from 'react';
import { SIDEBAR_STATES, BODY_STATES, type SidebarState, type BodyState } from '@/lib/utils';

export type ActivePage = 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo' | 'messaging';

// --- State and Action Types ---

export interface AppShellState {
  sidebarState: SidebarState;
  bodyState: BodyState;
  sidePaneContent: 'details' | 'settings' | 'main' | 'toaster' | 'notifications' | 'dataDemo' | 'dataItem' | 'messaging';
  sidebarWidth: number;
  sidePaneWidth: number;
  splitPaneWidth: number;
  defaultSidePaneWidth: number;
  defaultSplitPaneWidth: number;
  defaultWidthsSet: boolean;
  previousBodyState: BodyState;
  fullscreenTarget: 'main' | 'right' | null;
  isResizing: boolean;
  isResizingRightPane: boolean;
  isTopBarVisible: boolean;
  isTopBarHovered: boolean;
  autoExpandSidebar: boolean;
  reducedMotion: boolean;
  compactMode: boolean;
  primaryColor: string;
  isCommandPaletteOpen: boolean;
  isDarkMode: boolean;
  appName?: string;
  appLogo?: ReactElement;
  draggedPage: 'dashboard' | 'settings' | 'toaster' | 'notifications' | 'data-demo' | 'messaging' | null;
  dragHoverTarget: 'left' | 'right' | null;
  hoveredPane: 'left' | 'right' | null;
}

export interface AppShellActions {
    // Initialization
    init: (config: { appName?: string; appLogo?: ReactElement; defaultSplitPaneWidth?: number }) => void;
    
    // Direct state setters
    setSidebarState: (payload: SidebarState) => void;
    setBodyState: (payload: BodyState) => void;
    setSidePaneContent: (payload: AppShellState['sidePaneContent']) => void;
    setSidebarWidth: (payload: number) => void;
    setSidePaneWidth: (payload: number) => void;
    setDefaultPaneWidths: () => void;
    resetPaneWidths: () => void;
    setSplitPaneWidth: (payload: number) => void;
    setIsResizing: (payload: boolean) => void;
    setFullscreenTarget: (payload: 'main' | 'right' | null) => void;
    setIsResizingRightPane: (payload: boolean) => void;
    setTopBarVisible: (payload: boolean) => void;
    setAutoExpandSidebar: (payload: boolean) => void;
    setReducedMotion: (payload: boolean) => void;
    setCompactMode: (payload: boolean) => void;
    setPrimaryColor: (payload: string) => void;
    setDraggedPage: (payload: AppShellState['draggedPage']) => void;
    setCommandPaletteOpen: (open: boolean) => void;
    toggleDarkMode: () => void;
    setDragHoverTarget: (payload: 'left' | 'right' | null) => void;
    setTopBarHovered: (isHovered: boolean) => void;
    setHoveredPane: (payload: 'left' | 'right' | null) => void;
    
    // Composite actions
    toggleSidebar: () => void;
    hideSidebar: () => void;
    showSidebar: () => void;
    peekSidebar: () => void;
    toggleFullscreen: (target?: 'main' | 'right' | null) => void;
    resetToDefaults: () => void;
}

const defaultState: AppShellState = {
  sidebarState: SIDEBAR_STATES.EXPANDED,
  bodyState: BODY_STATES.NORMAL,
  sidePaneContent: 'details',
  sidebarWidth: 280,
  sidePaneWidth: typeof window !== 'undefined' ? Math.max(300, Math.round(window.innerWidth * 0.6)) : 400,
  splitPaneWidth: typeof window !== 'undefined' ? Math.max(300, Math.round(window.innerWidth * 0.35)) : 400,
  defaultSidePaneWidth: 400,
  defaultSplitPaneWidth: 400,
  defaultWidthsSet: false,
  previousBodyState: BODY_STATES.NORMAL,
  fullscreenTarget: null,
  isResizing: false,
  isResizingRightPane: false,
  isTopBarVisible: true,
  isTopBarHovered: false,
  autoExpandSidebar: true,
  reducedMotion: false,
  compactMode: false,
  primaryColor: '220 84% 60%',
  isCommandPaletteOpen: false,
  isDarkMode: false,
  appName: 'Jeli App',
  appLogo: undefined,
  draggedPage: null,
  dragHoverTarget: null,
  hoveredPane: null,
};


export const useAppShellStore = create<AppShellState & AppShellActions>()(
  persist(
    (set, get) => ({
      ...defaultState,

      init: ({ appName, appLogo, defaultSplitPaneWidth }) => set(state => ({
        ...state,
        ...(appName && { appName }),
        ...(appLogo && { appLogo }),
        ...(defaultSplitPaneWidth && { splitPaneWidth: defaultSplitPaneWidth }),
      })),
      
      setSidebarState: (payload) => set({ sidebarState: payload }),
      setBodyState: (payload) => {
        // If we're leaving fullscreen, reset the target and previous state
        if (get().bodyState === BODY_STATES.FULLSCREEN && payload !== BODY_STATES.FULLSCREEN) {
          set({ bodyState: payload, fullscreenTarget: null, previousBodyState: BODY_STATES.NORMAL });
        } else {
          set({ bodyState: payload });
        }
      },
      setSidePaneContent: (payload) => set({ sidePaneContent: payload }),
      setSidebarWidth: (payload) => set({ sidebarWidth: Math.max(200, Math.min(500, payload)) }),
      setSidePaneWidth: (payload) => set({ sidePaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, payload)) }),
      setDefaultPaneWidths: () => {
        if (get().defaultWidthsSet) return;
        set(state => ({
            defaultSidePaneWidth: state.sidePaneWidth,
            defaultSplitPaneWidth: state.splitPaneWidth,
            defaultWidthsSet: true,
        }));
      },
      resetPaneWidths: () => set(state => ({
        sidePaneWidth: state.defaultSidePaneWidth,
        splitPaneWidth: state.defaultSplitPaneWidth,
      })),
      setSplitPaneWidth: (payload) => set({ splitPaneWidth: Math.max(300, Math.min(window.innerWidth * 0.8, payload)) }),
      setIsResizing: (payload) => set({ isResizing: payload }),
      setFullscreenTarget: (payload) => set({ fullscreenTarget: payload }),
      setIsResizingRightPane: (payload) => set({ isResizingRightPane: payload }),
      setTopBarVisible: (payload) => set({ isTopBarVisible: payload }),
      setAutoExpandSidebar: (payload) => set({ autoExpandSidebar: payload }),
      setReducedMotion: (payload) => set({ reducedMotion: payload }),
      setCompactMode: (payload) => set({ compactMode: payload }),
      setPrimaryColor: (payload) => {
        if (typeof document !== 'undefined') {
            document.documentElement.style.setProperty('--primary-hsl', payload);
        }
        set({ primaryColor: payload });
      },
      setDraggedPage: (payload) => set({ draggedPage: payload }),
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDragHoverTarget: (payload) => set({ dragHoverTarget: payload }),
      setTopBarHovered: (isHovered) => set({ isTopBarHovered: isHovered }),
      setHoveredPane: (payload) => set({ hoveredPane: payload }),
      
      toggleSidebar: () => {
        const current = get().sidebarState;
        if (current === SIDEBAR_STATES.HIDDEN) set({ sidebarState: SIDEBAR_STATES.COLLAPSED });
        else if (current === SIDEBAR_STATES.COLLAPSED) set({ sidebarState: SIDEBAR_STATES.EXPANDED });
        else if (current === SIDEBAR_STATES.EXPANDED) set({ sidebarState: SIDEBAR_STATES.COLLAPSED });
      },
      hideSidebar: () => set({ sidebarState: SIDEBAR_STATES.HIDDEN }),
      showSidebar: () => set({ sidebarState: SIDEBAR_STATES.EXPANDED }),
      peekSidebar: () => set({ sidebarState: SIDEBAR_STATES.PEEK }),
      
      toggleFullscreen: (target = null) => {
        const { bodyState, previousBodyState } = get();
        if (bodyState === BODY_STATES.FULLSCREEN) {
          set({ 
            bodyState: previousBodyState || BODY_STATES.NORMAL,
            fullscreenTarget: null,
            previousBodyState: BODY_STATES.NORMAL,
          });
        } else {
          set({ 
            previousBodyState: bodyState, 
            bodyState: BODY_STATES.FULLSCREEN, 
            fullscreenTarget: target 
          });
        }
      },
      
      resetToDefaults: () => {
        // Preserve props passed to provider and session defaults
        set(state => {
          const currentPrimaryColor = defaultState.primaryColor;
          if (typeof document !== 'undefined') {
            document.documentElement.style.setProperty('--primary-hsl', currentPrimaryColor);
          }
          return {
            ...defaultState,
            primaryColor: currentPrimaryColor,
            appName: state.appName,
            appLogo: state.appLogo,
            defaultSidePaneWidth: state.defaultSidePaneWidth,
            defaultSplitPaneWidth: state.defaultSplitPaneWidth,
            defaultWidthsSet: state.defaultWidthsSet,
            // Also reset current widths to the defaults
            sidePaneWidth: state.defaultSidePaneWidth,
            splitPaneWidth: state.defaultSplitPaneWidth,
          };
        });
      },
    }),
    {
      name: 'app-shell-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        sidebarState: state.sidebarState,
        sidebarWidth: state.sidebarWidth,
        sidePaneWidth: state.sidePaneWidth,
        splitPaneWidth: state.splitPaneWidth,
        autoExpandSidebar: state.autoExpandSidebar,
        reducedMotion: state.reducedMotion,
        compactMode: state.compactMode,
        primaryColor: state.primaryColor,
      }),
    }
  )
);

// Add a selector for the derived rightPaneWidth
export const useRightPaneWidth = () => useAppShellStore(state => 
    state.bodyState === BODY_STATES.SPLIT_VIEW ? state.splitPaneWidth : state.sidePaneWidth
);
````

## File: src/components/layout/EnhancedSidebar.tsx
````typescript
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
  Database,
  PanelLeftClose,
  Inbox,
  UserX,
  CheckCircle2,
} from 'lucide-react';
import { useAppShellStore, type ActivePage } from '@/store/appShell.store';
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
import { useAppViewManager } from '@/hooks/useAppViewManager.hook';
import type { ViewId } from '@/views/viewRegistry';

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

const SidebarToggleButton = () => {
  const { isCollapsed } = useSidebar();
  const { toggleSidebar } = useAppShellStore.getState();

  if (isCollapsed) return null;

  return (
    <button
      onClick={toggleSidebar}
      className="ml-auto h-9 w-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
      title="Collapse Sidebar"
    >
      <PanelLeftClose className="w-5 h-5" />
    </button>
  );
};

interface SidebarProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const EnhancedSidebar = React.memo(React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ onMouseEnter, onMouseLeave }, ref) => {
    const sidebarWidth = useAppShellStore(s => s.sidebarWidth);
    const compactMode = useAppShellStore(s => s.compactMode);
    const appName = useAppShellStore(s => s.appName);
    const appLogo = useAppShellStore(s => s.appLogo);
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
            <SidebarToggleButton />
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection title="Main">
              <AppMenuItem icon={Home} label="Dashboard" page="dashboard" />
              <AppMenuItem icon={Database} label="Data Demo" page="data-demo"  />
              <MessagingSidebarItems />
              <AppMenuItem icon={Search} label="Search" />
              <AppMenuItem icon={Bell} label="Notifications" badge={3} page="notifications" />
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
                onWorkspaceChange={(ws) => setSelectedWorkspace(ws as MyWorkspace)}
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
));
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
  onClick?: () => void;
  isActive?: boolean;
}

const AppMenuItem: React.FC<AppMenuItemProps> = ({ icon: Icon, label, badge, hasActions, children, isSubItem = false, page, onClick, isActive: isActiveProp }) => {
  const compactMode = useAppShellStore(state => state.compactMode);
  const { setDraggedPage, setDragHoverTarget } = useAppShellStore.getState()
  const { isCollapsed } = useSidebar();
  const viewManager = useAppViewManager();

  const calculatedIsActive =
    (page && viewManager.mainViewId === page) ||
    (page && viewManager.rightPaneViewId === page);

  const isActive = isActiveProp ?? calculatedIsActive;

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    if (page) {
      // For context-aware actions like 'notifications' from a sidebar nav link,
      // we use trigger() with a source. For all others, a simple trigger
      // will execute the defaultBehavior from the viewRegistry.
      const source = page === 'notifications' ? 'navClick' : undefined;
      viewManager.trigger(page as ViewId, source);
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
              // set dragged page in AppShell store
              setDraggedPage(page);
            }
          }}
          onDragEnd={() => {
            setDraggedPage(null);
            setDragHoverTarget(null);
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

const MessagingSidebarItems = () => {
  const { currentActivePage, messagingView, navigateTo } = useAppViewManager();
  const totalUnread = 7; // Mock data, could come from a store

  return (
    <AppMenuItem
      icon={Mail}
      label="Messaging"
      badge={totalUnread}
      page="messaging"
      isActive={currentActivePage === 'messaging'}
      onClick={() => navigateTo('messaging', { messagingView: 'all_open' })}
    >
      <AppMenuItem
        icon={Inbox}
        label="All Open"
        isSubItem
        page="messaging"
        isActive={currentActivePage === 'messaging' && (messagingView === 'all_open' || !messagingView)}
        onClick={() => navigateTo('messaging', { messagingView: 'all_open' })}
      />
      <AppMenuItem
        icon={UserX}
        label="Unassigned"
        isSubItem
        page="messaging"
        isActive={currentActivePage === 'messaging' && messagingView === 'unassigned'}
        onClick={() => navigateTo('messaging', { messagingView: 'unassigned' })}
      />
      <AppMenuItem
        icon={CheckCircle2}
        label="Done"
        isSubItem
        page="messaging"
        isActive={currentActivePage === 'messaging' && messagingView === 'done'}
        onClick={() => navigateTo('messaging', { messagingView: 'done' })}
      />
    </AppMenuItem>
  );
};
````

## File: src/App.tsx
````typescript
import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useNavigate, // used in LoginPageWrapper
  useLocation,
  useParams,
} from "react-router-dom";

import { AppShell } from "./components/layout/AppShell";
import { AppShellProvider } from "./providers/AppShellProvider";
import { useAppShellStore } from "./store/appShell.store";
import { useAuthStore } from "./store/authStore";
import "./index.css";

// Import library components
import { EnhancedSidebar } from "./components/layout/EnhancedSidebar";
import { MainContent } from "./components/layout/MainContent";
import { RightPane } from "./components/layout/RightPane";
import { TopBar } from "./components/layout/TopBar";
import { CommandPalette } from "./components/global/CommandPalette";
import { ToasterProvider } from "./components/ui/toast";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

import { LoginPage } from "./components/auth/LoginPage";
import { type ViewId } from "./views/viewRegistry";

// --- Icons ---
import {
  Search,
  Filter,
  Plus,
  ChevronRight,
  Rocket,
} from "lucide-react";

// --- Utils & Hooks ---
import { cn } from "./lib/utils";
import { useAppViewManager } from "./hooks/useAppViewManager.hook";
import { useDataDemoParams } from "./pages/DataDemo/hooks/useDataDemoParams.hook";

// Checks for authentication and redirects to login if needed
function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <ComposedApp />; // ComposedApp is the layout for all protected routes
}

// A root component to apply global styles and effects
function Root() {
  const isDarkMode = useAppShellStore((state) => state.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return <Outlet />;
}

// Breadcrumbs for the Top Bar
function AppBreadcrumbs() {
  const { currentActivePage } = useAppViewManager();
  const activePageName = currentActivePage.replace('-', ' ');

  return (
    <div className="hidden md:flex items-center gap-2 text-sm">
      <a
        href="#"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Home
      </a>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
      <span className="font-medium text-foreground capitalize">
        {activePageName}
      </span>
    </div>
  );
}

// Specific controls for DataDemo page
function DataDemoTopBarControls() {
  const { filters, setFilters } = useDataDemoParams();

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search items..."
          className="pl-9 bg-card border-none"
          value={filters.searchTerm}
          onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
        />
      </div>
      <Button variant="outline">
        <Filter className="w-4 h-4 mr-2" />
        Filter
      </Button>
      <Button>
        <Plus className="w-4 h-4 mr-2" />
        New Item
      </Button>
    </div>
  );
}
// Page-specific controls for the Top Bar
function TopBarPageControls() {
  const { currentActivePage } = useAppViewManager();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  if (currentActivePage === "dashboard") {
    return (
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
            placeholder="Search dashboard..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="pl-9 pr-4 py-2 h-10 border-none rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ease-in-out w-full"
          />
        </div>
        <Button variant="ghost" size="icon" className="flex-shrink-0">
          <Filter className="w-5 h-5" />
        </Button>
        <Button className="flex-shrink-0">
          <Plus className="w-5 h-5 mr-0 sm:mr-2" />
          <span className={cn(isSearchFocused ? "hidden sm:inline" : "inline")}>
            New Project
          </span>
        </Button>
      </div>
    );
  }

  if (currentActivePage === "data-demo") {
    return <DataDemoTopBarControls />;
  }

  return null;
}

// The main App component that composes the shell
function ComposedApp() {
  const viewManager = useAppViewManager();
  const { setBodyState, setSidePaneContent } = useAppShellStore.getState(); // Non-reactive state setters

  // Sync URL-derived state to the global Zustand store.
  // This allows descendant components (like AppShell) to react to layout changes
  // without having to drill props down. The loop is prevented by using selective
  // subscriptions in other hooks.
  useEffect(() => {
    setBodyState(viewManager.bodyState);
    // The view manager now provides the definitive ID for the right pane.
    // We cast it for the store, which uses a string union. This might be an area for future refactoring.
    setSidePaneContent(viewManager.rightPaneViewId as any);
  }, [viewManager.bodyState, viewManager.rightPaneViewId, setBodyState, setSidePaneContent]);

  // The view manager is now the single source of truth for which views to render.
  const { mainViewId, rightPaneViewId } = viewManager;

  return (
    <AppShellProvider
      appName="Jeli App"
      appLogo={
        <div className="p-2 bg-primary/20 rounded-lg">
          <Rocket className="w-5 h-5 text-primary" />
        </div>
      }
    >
      <AppShell
        sidebar={<EnhancedSidebar />}
        onOverlayClick={viewManager.closeSidePane}
        topBar={
          <TopBar breadcrumbs={<AppBreadcrumbs />} pageControls={<TopBarPageControls />} />
        }
        mainContent={<MainContent viewId={mainViewId} />}
        rightPane={<RightPane viewId={rightPaneViewId} />}
      />
    </AppShellProvider>
  );
}

const router = createBrowserRouter([
    {
      element: <Root />,
      children: [
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/",
          element: <ProtectedRoute />,
          children: [
            // The ComposedApp layout will render the correct view based on the path
            // so these elements can be null. The paths are still needed for matching.
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: "dashboard", element: null },
            { path: "settings", element: null },
            { path: "toaster", element: null },
            { path: "notifications", element: null },
            { path: "data-demo", element: null },
            { path: "data-demo/:itemId", element: null },
            { path: "messaging", element: null },
            { path: "messaging/:conversationId", element: null },
          ],
        },
      ],
    },
  ]);

function App() {
  return (
    <ToasterProvider>
      <RouterProvider router={router} />
    </ToasterProvider>
  );
}

export default App;
````

## File: src/hooks/useAppViewManager.hook.ts
````typescript
import { useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAppShellStore } from '@/store/appShell.store';
import type { TaskView } from '@/pages/Messaging/types';
import { BODY_STATES, BodyState } from '@/lib/utils';
import { getViewById, type ViewId, type ViewRegistration } from '@/views/viewRegistry';

/**
 * A centralized hook to manage and synchronize all URL-based view states.
 * This is the single source of truth for view modes, side panes, split views,
 * and page-specific parameters. It acts as an executor for the declarative
 * rules defined in the `viewRegistry`.
 */
export function useAppViewManager() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ itemId?: string; conversationId?: string }>();

  const { setSidebarState } = useAppShellStore.getState();

  // --- DERIVED STATE FROM URL & VIEW REGISTRY ---

  const { mainViewId, rightPaneViewId, bodyState } = useMemo(() => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    const viewFromPath = getViewById(path);
    
    const sidePaneParam = searchParams.get('sidePane');
    const viewParam = searchParams.get('view');
    const rightParam = searchParams.get('right');
    const itemIdParam = searchParams.get('itemId');

    let derivedMainViewId: ViewId | null = (path as ViewId) || 'dashboard';
    let derivedRightPaneViewId: ViewId | null = null;
    let derivedBodyState: BodyState = BODY_STATES.NORMAL;

    if (viewFromPath?.compositeView) {
      derivedMainViewId = viewFromPath.compositeView.main;
      derivedRightPaneViewId = viewFromPath.compositeView.right;
      derivedBodyState = BODY_STATES.SPLIT_VIEW;
    } else if (sidePaneParam) {
      derivedRightPaneViewId = sidePaneParam as ViewId;
      derivedBodyState = BODY_STATES.SIDE_PANE;
    } else if (viewParam === 'split' && rightParam) {
      derivedRightPaneViewId = rightParam as ViewId;
      derivedBodyState = BODY_STATES.SPLIT_VIEW;
    }

    // Handle item detail views specially
    if (derivedMainViewId === 'data-demo' && params.itemId) {
      derivedMainViewId = 'dataItemDetail';
    } else if (itemIdParam) {
      derivedRightPaneViewId = 'dataItemDetail';
      // If there's an itemId, it could be a side pane or part of a split
      if (derivedBodyState !== BODY_STATES.SPLIT_VIEW) {
          derivedBodyState = BODY_STATES.SIDE_PANE;
      }
    }

    return { 
      mainViewId: derivedMainViewId, 
      rightPaneViewId: derivedRightPaneViewId, 
      bodyState: derivedBodyState
    };
  }, [location.pathname, searchParams, params.itemId, params.conversationId]);

  const messagingView = searchParams.get('messagingView') as TaskView | null;
  const currentActivePage = (location.pathname.split('/')[1] || 'dashboard') as ViewId;

  // --- PRIVATE ACTION EXECUTORS ---

  const getPathForView = useCallback((viewId: ViewId | null, viewParams: typeof params): string => {
    if (!viewId) return '/dashboard'; // Fallback to dashboard
    if (viewId === 'dataItemDetail' && viewParams.itemId) {
        return `/data-demo/${viewParams.itemId}`;
    }
    // When dealing with a composite view, the "page" is the parent route
    if ((viewId === 'messagingPage' || viewId === 'messagingContextPanel') && viewParams.conversationId) {
      return `/messaging/${viewParams.conversationId}`;
    }
    if (viewId === 'messagingPage' || viewId === 'messagingContextPanel') {
      return '/messaging';
    }
    return `/${viewId}`;
  }, []);

  const _executeNavigate = useCallback((view: ViewRegistration, payload?: any) => {
    if (view.onNavigate?.sidebar) {
      setSidebarState(view.onNavigate.sidebar);
    }
    
    let path = `/${view.id}`;
    if (view.id === 'dataItemDetail' && payload?.itemId) {
        path = `/data-demo/${payload.itemId}`;
    }

    navigate(path);
  }, [navigate, setSidebarState]);

  const _executeOpenPane = useCallback((view: ViewRegistration, payload?: any) => {
    if (!view.renderTarget?.includes('pane')) {
      console.warn(`View "${view.id}" cannot be rendered in a pane.`);
      return;
    }
    
    const mainView = getViewById(mainViewId);
    if (mainView && !mainView.allowedBodyStates?.includes('side_pane')) {
        console.warn(`Cannot open side pane: Main view "${mainView.id}" does not allow the "side_pane" layout.`);
        return;
    }
    
    setSearchParams(prev => {
        prev.delete('view');
        prev.delete('right');
        if (view.id === 'dataItemDetail' && payload?.itemId) {
            prev.set('itemId', payload.itemId);
            prev.delete('sidePane');
        } else {
            prev.set('sidePane', view.id);
            prev.delete('itemId');
        }
        return prev;
    }, { replace: true });

  }, [setSearchParams, mainViewId]);

  const _executeOpenSplit = useCallback((view: ViewRegistration, payload?: any) => {
    // A composite view is triggered by navigating to its main route
    if (view.compositeView) {
      _executeNavigate(view, payload);
      return;
    }
    
    if (!view.renderTarget?.includes('pane')) {
      console.warn(`View "${view.id}" cannot be rendered in a split view's right pane.`);
      return;
    }
    
    const mainView = getViewById(mainViewId);
    if (mainView && !mainView.allowedBodyStates?.includes('split_view')) {
        console.warn(`Cannot open split view: Main view "${mainView.id}" does not allow the "split_view" layout.`);
        return;
    }
    
    setSearchParams(prev => {
        prev.set('view', 'split');
        prev.delete('sidePane');
        if (view.id === 'dataItemDetail' && payload?.itemId) {
            prev.set('itemId', payload.itemId);
            prev.delete('right');
        } else {
            prev.set('right', view.id);
            prev.delete('itemId');
        }
        return prev;
    }, { replace: true });
  }, [setSearchParams, _executeNavigate, mainViewId]);

  // --- PUBLIC API ---

  const trigger = useCallback((viewId: ViewId, source?: string, payload?: any) => {
    const view = getViewById(viewId);
    if (!view) {
      console.error(`View with id "${viewId}" not found in registry.`);
      return;
    }
    
    const behavior = (source && view.triggerBehaviors?.[source]) || view.defaultBehavior || 'navigate';
    
    // TODO: Add check for allowedBodyStates
    
    switch (behavior) {
      case 'navigate':
        _executeNavigate(view, payload);
        break;
      case 'openPane':
        _executeOpenPane(view, payload);
        break;
      case 'openSplit':
        _executeOpenSplit(view, payload);
        break;
      default:
        console.warn(`Unknown behavior "${behavior}" for view "${viewId}".`);
        _executeNavigate(view, payload);
    }
  }, [_executeNavigate, _executeOpenPane, _executeOpenSplit]);
  
  const navigateTo = useCallback((page: ViewId, navParams?: Record<string, string | null | undefined>) => {
    // This is a simplified navigate, for complex behaviors, use trigger.
    let path = `/${page}`;
    if (page === 'dataItemDetail' && navParams?.itemId) {
        path = `/data-demo/${navParams.itemId}`;
    } else if (page === 'dataItemDetail') {
      console.error("navigateTo('dataItemDetail') called without an itemId. This is not supported. Falling back to '/data-demo'.");
      path = '/data-demo';
    }
    
    const newSearchParams = new URLSearchParams(searchParams);
    if (navParams) {
      for (const [key, value] of Object.entries(navParams)) {
        if (value === null || value === undefined) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      }
    }
    
    const view = getViewById(page);
    if (view?.onNavigate?.sidebar) {
      setSidebarState(view.onNavigate.sidebar);
    }

    navigate({ pathname: path, search: newSearchParams.toString() });
  }, [navigate, searchParams, setSidebarState]);
  
  const openPane = useCallback((viewId: ViewId, payload?: any) => {
    const view = getViewById(viewId);
    if (view) {
      _executeOpenPane(view, payload);
    }
  }, [_executeOpenPane]);

  const closeSidePane = useCallback(() => {
    setSearchParams(prev => {
        prev.delete('sidePane');
        prev.delete('itemId');
        // if we were in a split view, revert to normal by clearing view and right
        if (prev.get('view') === 'split') {
          prev.delete('view');
          prev.delete('right');
        }
        return prev;
    }, { replace: true });
  }, [setSearchParams]);

  const toggleSidePane = useCallback((viewId: ViewId, payload?: any) => {
    if (rightPaneViewId === viewId && bodyState === BODY_STATES.SIDE_PANE) {
        closeSidePane();
    } else {
        openPane(viewId, payload);
    }
  }, [rightPaneViewId, bodyState, closeSidePane, openPane]);

  const setNormalView = useCallback(() => {
    // We want to navigate to the path of the main content view, clearing search params.
    const path = getPathForView(mainViewId, params);
    navigate(path, { replace: true });
  }, [mainViewId, params, navigate, getPathForView]);

  const toggleSplitView = useCallback((rightViewId: ViewId = 'settings') => {
    if (bodyState === BODY_STATES.SPLIT_VIEW) {
      setNormalView();
    } else {
      trigger(rightViewId, 'openSplit');
    }
  }, [bodyState, setNormalView, trigger]);

  const switchSplitPanes = useCallback(() => {
    if (bodyState !== BODY_STATES.SPLIT_VIEW || !mainViewId || !rightPaneViewId) return;

    const newMainView = getViewById(rightPaneViewId);
    const newRightViewId = mainViewId;

    // Check if the new main view is navigable and the new layout is allowed
    if (newMainView?.isNavigable && newMainView.allowedBodyStates?.includes('split_view')) {
      navigate(`/${rightPaneViewId}?view=split&right=${newRightViewId}`, { replace: true });
    } else {
      console.warn("Cannot switch panes: new main view is not navigable or does not allow split view.", { newMainViewId: rightPaneViewId, mainViewId });
    }
  }, [bodyState, mainViewId, rightPaneViewId, navigate]);

  const closeSplitPane = useCallback((pane: 'main' | 'right') => {
    if (bodyState !== BODY_STATES.SPLIT_VIEW || !mainViewId) {
      setNormalView();
      return;
    }
    if (pane === 'right') {
      const path = getPathForView(mainViewId as ViewId, params);
      navigate(path, { replace: true });
    } else if (rightPaneViewId) {
      const rightView = getViewById(rightPaneViewId);
      if (rightView?.isNavigable) navigate(`/${rightPaneViewId}`, { replace: true });
      else navigate('/dashboard', { replace: true });
    } else setNormalView();
  }, [bodyState, mainViewId, rightPaneViewId, navigate, setNormalView, getPathForView, params]);

  const setMessagingView = (view: TaskView) => {
    setSearchParams(prev => {
        prev.set('messagingView', view);
        return prev;
    }, { replace: true });
  };

  const itemId = params.itemId || searchParams.get('itemId');
  
  return useMemo(() => ({
    // State
    mainViewId,
    rightPaneViewId,
    bodyState,
    itemId,
    conversationId: params.conversationId,
    messagingView,
    currentActivePage,

    // Actions
    trigger,
    navigateTo,
    openPane,
    closeSidePane,
    toggleSidePane,
    setNormalView,
    toggleSplitView,
    switchSplitPanes,
    closeSplitPane,
    setMessagingView,
  }), [
    mainViewId, rightPaneViewId, bodyState, itemId, params.conversationId, messagingView, currentActivePage,
    trigger, navigateTo, openPane, closeSidePane, toggleSidePane, setNormalView, toggleSplitView, switchSplitPanes, closeSplitPane, setMessagingView,
  ]);
}
````

## File: src/pages/DataDemo/index.tsx
````typescript
import { useRef, useEffect, useCallback } from "react";
import {
  Layers,
  AlertTriangle,
  PlayCircle,
  TrendingUp,
  CheckCircle,
  Clock,
  Archive,
  PlusCircle,
} from "lucide-react";
import { DynamicView } from "@/features/dynamic-view/DynamicView";
import { PageLayout } from "@/components/shared/PageLayout";
import { useScrollToBottom } from "@/hooks/useScrollToBottom.hook";
import { ScrollToBottomButton } from "@/components/shared/ScrollToBottomButton";
import { mockDataItems } from "./data/mockData";
import { useDataDemoParams } from "./hooks/useDataDemoParams.hook";
import { useAppViewManager } from "@/hooks/useAppViewManager.hook";
import { useDataDemoStore, useSelectedItem } from "./store/dataDemo.store";
import { AddDataItemCta } from "@/features/dynamic-view/components/shared/AddDataItemCta";
import { DataDetailContent } from "./components/DataDetailContent";
import { dataDemoViewConfig } from "./DataDemo.config";
import type { StatItem } from "@/features/dynamic-view/types";

export default function DataDemoPage() {
  const viewManager = useAppViewManager();
  const {
    viewMode,
    groupBy,
    activeGroupTab,
    setGroupBy,
    setSort,
    setActiveGroupTab,
    page,
    filters,
    sortConfig,
    setPage,
    setFilters,
    setViewMode,
    calendarDate,
    setCalendarDate,
  } = useDataDemoParams();

  const selectedItem = useSelectedItem(viewManager.itemId || undefined);

  const {
    items: allItems,
    hasMore,
    isLoading,
    isInitialLoading,
    totalItemCount,
    loadData,
    updateItem,
  } = useDataDemoStore((state) => ({
    items: state.items,
    hasMore: state.hasMore,
    isLoading: state.isLoading,
    isInitialLoading: state.isInitialLoading,
    totalItemCount: state.totalItemCount,
    loadData: state.loadData,
    updateItem: state.updateItem,
  }));

  const scrollRef = useRef<HTMLDivElement>(null);

  // Note: The `DynamicViewProvider` needs `GenericItem[]`.
  // Our store uses `GenericItem` so no cast is needed.
  // Calculate stats from data
  const totalItems = mockDataItems.length;
  const { showScrollToBottom, scrollToBottom, handleScroll } =
    useScrollToBottom(scrollRef);

  const activeItems = mockDataItems.filter(
    (item) => item.status === "active",
  ).length;
  const highPriorityItems = mockDataItems.filter(
    (item) => item.priority === "high" || item.priority === "critical",
  ).length;
  const avgCompletion =
    totalItems > 0
      ? Math.round(
          mockDataItems.reduce(
            (acc, item) => acc + item.metrics.completion,
            0,
          ) / totalItems,
        )
      : 0;

  const stats: StatItem[] = [
    {
      title: "Total Projects",
      value: totalItems.toString(),
      icon: <Layers className="w-5 h-5" />,
      change: "+5.2% this month",
      trend: "up" as const,
      chartData: [120, 125, 122, 130, 135, 138, 142],
    },
    {
      title: "Active Projects",
      value: activeItems.toString(),
      icon: <PlayCircle className="w-5 h-5" />,
      change: "+2 this week",
      trend: "up" as const,
      chartData: [45, 50, 48, 55, 53, 60, 58],
    },
    {
      title: "High Priority",
      value: highPriorityItems.toString(),
      icon: <AlertTriangle className="w-5 h-5" />,
      change: "-1 from last week",
      trend: "down" as const,
      chartData: [25, 26, 28, 27, 26, 24, 23],
    },
    {
      title: "Avg. Completion",
      value: `${avgCompletion}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      change: "+3.2%",
      trend: "up" as const,
      chartData: [65, 68, 70, 69, 72, 75, 78],
    },
    {
      title: "Completion Rate",
      value: "88%",
      icon: <CheckCircle className="w-5 h-5" />,
      change: "+1.5% this month",
      trend: "up" as const,
      chartData: [80, 82, 81, 84, 85, 87, 88],
    },
    {
      title: "Overdue Items",
      value: "8",
      icon: <Clock className="w-5 h-5" />,
      change: "-3 this week",
      trend: "down" as const,
    },
    {
      title: "New This Week",
      value: "12",
      icon: <PlusCircle className="w-5 h-5" />,
      change: "+2 from last week",
      trend: "up" as const,
    },
    {
      title: "Archived Projects",
      value: "153",
      icon: <Archive className="w-5 h-5" />,
      change: "+20 this month",
      trend: "up" as const,
    },
  ];

  useEffect(() => {
    loadData({
      page,
      groupBy,
      filters,
      sortConfig,
      isFullLoad: viewMode === "calendar" || viewMode === "kanban",
    });
  }, [page, groupBy, filters, sortConfig, loadData, viewMode]);

  const observer = useRef<IntersectionObserver>();
  const loaderRef = useCallback(
    (node: Element | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, page, setPage],
  );

  if (viewManager.mainViewId === 'dataItemDetail' && viewManager.itemId && selectedItem) {
    // Render detail view as the main content
    return <DataDetailContent item={selectedItem} />;
  }

  return (
    <PageLayout scrollRef={scrollRef} onScroll={handleScroll}>
      <DynamicView
        viewConfig={dataDemoViewConfig}
        items={allItems}
        isLoading={isLoading}
        isInitialLoading={isInitialLoading}
        totalItemCount={totalItemCount}
        hasMore={hasMore}
        // Controlled state
        viewMode={viewMode}
        filters={filters}
        sortConfig={sortConfig}
        groupBy={groupBy}
        activeGroupTab={activeGroupTab}
        page={page}
        // Callbacks
        calendarDate={calendarDate}
        onCalendarDateChange={setCalendarDate}
        onViewModeChange={setViewMode}
        onFiltersChange={setFilters}
        onSortChange={setSort}
        onGroupByChange={setGroupBy}
        onActiveGroupTabChange={setActiveGroupTab}
        onPageChange={setPage}
        onItemUpdate={updateItem}
        onItemSelect={(item) => viewManager.trigger('dataItemDetail', 'itemClick', { itemId: item.id })}
        loaderRef={loaderRef}
        scrollContainerRef={scrollRef}
        statsData={stats}
        // Custom Renderers
        renderCta={(viewMode, ctaProps) => (
          <AddDataItemCta viewMode={viewMode} colSpan={ctaProps.colSpan} />
        )}
      />

      <ScrollToBottomButton
        isVisible={showScrollToBottom}
        onClick={scrollToBottom}
      />
    </PageLayout>
  );
}
````
