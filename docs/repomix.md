# Directory Structure
```
src/
  pages/
    DataDemo/
      components/
        DataViewModeSelector.tsx
index.html
package.json
postcss.config.js
README.md
tailwind.config.js
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: postcss.config.js
````javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
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
  ],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

## File: src/pages/DataDemo/components/DataViewModeSelector.tsx
````typescript
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { List, Grid3X3, LayoutGrid, Table } from 'lucide-react'
import type { ViewMode } from '../types'

interface DataViewModeSelectorProps {
  viewMode: ViewMode
  onChange: (mode: ViewMode) => void
}

const viewModes = [
  { id: 'list' as ViewMode, label: 'List', icon: List, description: 'Compact list with details' },
  { id: 'cards' as ViewMode, label: 'Cards', icon: LayoutGrid, description: 'Rich card layout' },
  { id: 'grid' as ViewMode, label: 'Grid', icon: Grid3X3, description: 'Masonry grid view' },
  { id: 'table' as ViewMode, label: 'Table', icon: Table, description: 'Structured data table' }
]

export function DataViewModeSelector({ viewMode, onChange }: DataViewModeSelectorProps) {
  const indicatorRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Animate the indicator to the active button
  useEffect(() => {
    if (!indicatorRef.current) return

    const activeIndex = viewModes.findIndex((m) => m.id === viewMode);
    if (activeIndex === -1) return;

    // Determine responsive sizes, must match the other useEffect
    const isSmallScreen = window.innerWidth < 640;
    const buttonWidth = isSmallScreen ? 100 : 120;
    
    // Calculate final position without reading from DOM during animation
    const targetX = isExpanded
      ? activeIndex * buttonWidth
      : 0;

    // Animate indicator to the calculated position
    gsap.to(indicatorRef.current, {
      duration: 0.4,
      x: targetX,
      width: buttonWidth,
      ease: "power3.out",
    });
  }, [viewMode, isExpanded]);

  // Expand and collapse inactive buttons
  useEffect(() => {
    const activeIndex = viewModes.findIndex((m) => m.id === viewMode);
    
    // Determine responsive sizes
    const isSmallScreen = window.innerWidth < 640;
    const padding = isSmallScreen ? 16 : 24; // px-4 vs sm:px-6
    const minWidth = isSmallScreen ? 100 : 120;

    buttonRefs.current.forEach((button, index) => {
      if (!button) return;

      const isActive = index === activeIndex;

      // The active button is always visible and sized correctly
      if (isActive) {
        gsap.set(button, {
          minWidth: minWidth,
          width: minWidth,
          paddingLeft: padding,
          paddingRight: padding,
          opacity: 1,
          pointerEvents: 'auto',
          overflow: 'visible'
        });
        return;
      }

      // Animate inactive buttons
      gsap.to(button, {
        width: isExpanded ? minWidth : 0,
        minWidth: isExpanded ? minWidth : 0,
        paddingLeft: isExpanded ? padding : 0,
        paddingRight: isExpanded ? padding : 0,
        opacity: isExpanded ? 1 : 0,
        duration: 0.3,
        ease: "power2.out",
        delay: isExpanded ? (Math.abs(index - activeIndex) - 1) * 0.05 : 0,
        pointerEvents: isExpanded ? "auto" : "none",
        overwrite: true,
        onStart: () => {
          if(!isExpanded) button.style.overflow = 'hidden';
        },
        onComplete: () => {
          if (isExpanded) button.style.overflow = 'visible';
        }
      });
    });
  }, [isExpanded, viewMode]);

  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="inline-block" // Wrapper to isolate from parent layout changes
    >
      <div
        ref={containerRef}
        className="relative flex flex-nowrap justify-center items-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-1.5 shadow-lg"
      >
        {/* Animated indicator */}
        <div
          ref={indicatorRef}
          className="absolute inset-y-1.5 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20 rounded-xl"
          style={{ left: 0, width: 0, pointerEvents: 'none' }}
        />

        {/* Mode buttons */}
        {viewModes.map((mode, index) => {
          const IconComponent = mode.icon;
          const isActive = viewMode === mode.id;

          return (
            <button
              key={mode.id}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              data-mode={mode.id}
              onClick={() => {
                if (!isActive) onChange(mode.id);
              }}
              // Size and padding classes are removed and handled by GSAP
              className={cn(
                "relative flex items-center justify-center gap-2 sm:gap-3 py-2 sm:py-3 rounded-xl transition-colors duration-300 group z-10",
                "hover:bg-accent/20 active:scale-95",
                isActive ? "text-primary" : ""
              )}
              style={
                !isActive
                  ? {
                      width: 0,
                      minWidth: 0,
                      paddingLeft: 0,
                      paddingRight: 0,
                      opacity: 0,
                      overflow: "hidden",
                      pointerEvents: "none",
                    }
                  : {}
              }
              title={mode.description}
            >
              <IconComponent
                className={cn(
                  "w-5 h-5 transition-all duration-300 flex-shrink-0",
                  isActive && "scale-110",
                  "group-hover:scale-105"
                )}
              />
              <span
                className={cn(
                  "font-medium transition-colors duration-300 whitespace-nowrap",
                  isActive ? "text-primary" : "text-muted-foreground",
                  "group-hover:text-foreground"
                )}
              >
                {mode.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  )
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
  plugins: [require("tailwindcss-animate")],
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
    "resolveJsonModule": true
  },
  "include": ["vite.config.ts"]
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

## File: README.md
````markdown
# Jeli App Shell

[![npm version](https://img.shields.io/npm/v/jeli-app-shell.svg?style=flat)](https://www.npmjs.com/package/jeli-app-shell)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/travis/com/your-username/jeli-app-shell.svg)](https://travis-ci.com/your-username/jeli-app-shell)

A fully-featured, animated, and customizable application shell for React, built with TypeScript, Tailwind CSS, and powered by GSAP for smooth animations. Provide a modern, desktop-grade user experience out of the box.

This library provides all the necessary components and hooks to build a complex application layout with a resizable sidebar, a dynamic main content area, a contextual side pane, and more.

[**Live Demo (Storybook) →**](https://your-demo-link.com)

 <!-- TODO: Add a real preview image -->

---

## Key Features

-   **Component-Based Architecture**: Build your shell by composing flexible and powerful React components.
-   **Resizable Sidebar**: Draggable resizing with multiple states: `Expanded`, `Collapsed`, `Hidden`, and `Peek` (on hover).
-   **Dynamic Body States**: Seamlessly switch between `Normal`, `Fullscreen`, and `Side Pane` views.
-   **Smooth Animations**: Fluid transitions powered by GSAP for a premium feel.
-   **Dark Mode Support**: First-class dark mode support, easily toggled.
-   **Customizable Theming**: Easily theme your application using CSS variables, just like shadcn/ui.
-   **State Management Included**: Simple and powerful state management via React Context and Zustand.
-   **Command Palette**: Built-in command palette for quick navigation and actions.
-   **TypeScript & Modern Tools**: Built with TypeScript, React, Vite, and Tailwind CSS for a great developer experience.

## Installation

Install the package and its peer dependencies using your preferred package manager.
```bash
npm install jeli-app-shell react react-dom tailwindcss gsap lucide-react tailwind-merge class-variance-authority clsx tailwindcss-animate
```

or

```bash
yarn add jeli-app-shell react react-dom tailwindcss gsap lucide-react tailwind-merge class-variance-authority clsx tailwindcss-animate
```

## Getting Started

Follow these steps to integrate Jeli App Shell into your project.

### 1. Configure Tailwind CSS

You need to configure Tailwind CSS to correctly process the styles from the library.

**`tailwind.config.js`**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  // ... your other config
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // Add the path to the library's components
    './node_modules/jeli-app-shell/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    // ...
  },
  plugins: [require('tailwindcss-animate')],
};
```

**`index.css` (or your main CSS file)**

You need to import the library's stylesheet. It contains all the necessary base styles and CSS variables for theming.

```css
/* Import Tailwind's base, components, and utilities */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Import the App Shell's stylesheet */
@import 'jeli-app-shell/dist/style.css';
```

### 2. Set Up Providers

Wrap your application's root component with `AppShellProvider` and `ToasterProvider`.

**`App.tsx`**

```tsx
import React from 'react';
import { AppShellProvider } from 'jeli-app-shell';
import { ToasterProvider } from 'jeli-app-shell'; // Re-exported for convenience
import { Rocket } from 'lucide-react';
import { YourAppComponent } from './YourAppComponent';

function App() {
  const myLogo = (
    <div className="p-2 bg-primary/20 rounded-lg">
      <Rocket className="w-5 h-5 text-primary" />
    </div>
  );

  return (
    <AppShellProvider appName="My Awesome App" appLogo={myLogo}>
      <ToasterProvider>
        <YourAppComponent />
      </ToasterProvider>
    </AppShellProvider>
  );
}

export default App;
```

### 3. Compose Your Shell

The `<AppShell>` component is the heart of the library. You compose your layout by passing the `sidebar`, `topBar`, `mainContent`, and `rightPane` components as props.

Here's a complete example:

**`YourAppComponent.tsx`**

```tsx
import {
  // Main Layout
  AppShell,
  MainContent,
  RightPane,
  TopBar,

  // Sidebar Primitives
  Sidebar,
  SidebarBody,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarIcon,
  SidebarLabel,

  // Hooks & Context
  useAppShell,
} from 'jeli-app-shell';
import { Home, Settings, PanelRight } from 'lucide-react';

// 1. Build your custom sidebar
const MySidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <SidebarTitle>My App</SidebarTitle>
        </SidebarHeader>
        <SidebarBody>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <SidebarIcon><Home /></SidebarIcon>
              <SidebarLabel>Dashboard</SidebarLabel>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <SidebarIcon><Settings /></SidebarIcon>
              <SidebarLabel>Settings</SidebarLabel>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarBody>
      </SidebarContent>
    </Sidebar>
  );
};

// 2. Build your custom top bar content
const MyTopBarContent = () => {
  const { openSidePane } = useAppShell();
  return (
    <button onClick={() => openSidePane('details')} title="Open Details">
      <PanelRight />
    </button>
  );
};

// 3. Build your main content
const MyMainContent = () => {
  return (
    <div>
      <h1>Welcome to your Dashboard!</h1>
      <p>This is the main content area.</p>
    </div>
  );
};

// 4. Build your right pane
const MyRightPane = () => {
  return (
    <div>
      <h3>Details Panel</h3>
      <p>Contextual information goes here.</p>
    </div>
  );
};

// 5. Assemble the App Shell
export function YourAppComponent() {
  return (
    <AppShell
      sidebar={<MySidebar />}
      topBar={<TopBar><MyTopBarContent /></TopBar>}
      mainContent={<MainContent><MyMainContent /></MainContent>}
      rightPane={<RightPane>{<MyRightPane />}</RightPane>}
    />
  );
}
```

## Component API

### Layout Components

-   `<AppShellProvider>`: Wraps your app and provides the context for all hooks and components.
-   `<AppShell>`: The main container that orchestrates the layout. Requires `sidebar`, `topBar`, `mainContent`, and `rightPane` props.
-   `<TopBar>`: The header component. It's a container for your own controls and branding.
-   `<MainContent>`: The primary content area of your application.
-   `<RightPane>`: A panel that slides in from the right, perfect for details, forms, or secondary information.

### Sidebar Primitives

The sidebar is built using a set of highly composable components.

-   `<Sidebar>`: The root sidebar component.
-   `<SidebarContent>`: Wrapper for all sidebar content.
-   `<SidebarHeader>`, `<SidebarBody>`, `<SidebarFooter>`: Structural components to organize sidebar content.
-   `<SidebarTitle>`: The title of your app, automatically hidden when the sidebar is collapsed.
-   `<SidebarSection>`: A component to group menu items with an optional title.
-   `<SidebarMenuItem>`: A wrapper for a single menu item, including the button and potential actions.
-   `<SidebarMenuButton>`: The main clickable button for a menu item.
-   `<SidebarIcon>`, `<SidebarLabel>`, `<SidebarBadge>`, `<SidebarTooltip>`: Atomic parts of a menu item.

### Ready-to-use Components

-   `<UserDropdown>`: A pre-styled user profile dropdown menu.
-   `<WorkspaceSwitcher>`: A complete workspace/tenant switcher component.
-   `<PageHeader>`: A standardized header for your main content pages.
-   `<LoginPage>`: A beautiful, animated login page component.
-   `<CommandPalette>`: A powerful command palette for your application.

### UI Primitives

The library also exports a set of UI components (Button, Card, Badge, etc.) based on shadcn/ui. You can import them directly from `jeli-app-shell`.

## Hooks

-   `useAppShell()`: The primary hook to control the shell's state.
    -   `sidebarState`: Current state of the sidebar (`expanded`, `collapsed`, etc.).
    -   `bodyState`: Current body state (`normal`, `fullscreen`, `side_pane`).
    -   `toggleSidebar()`: Toggles the sidebar between expanded and collapsed.
    -   `openSidePane(content: string)`: Opens the right-hand pane.
    -   `closeSidePane()`: Closes the right-hand pane.
    -   `toggleFullscreen()`: Toggles fullscreen mode.
    -   `dispatch`: For more granular state control.
-   `useToast()`: A hook to display toast notifications.
    -   `show({ title, message, variant, ... })`

## Theming

Customizing the look and feel is straightforward. The library uses CSS variables for colors, border radius, etc., which you can override in your global CSS file.

**`index.css`**

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 262.1 83.3% 57.8%; /* New primary color: Violet */
    --primary-foreground: 210 40% 98%;
    --radius: 0.75rem; /* New border radius */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 262.1 83.3% 57.8%;
    --primary-foreground: 210 40% 98%;
  }
}
```

## Contributing

Contributions are welcome! Please read our [contributing guidelines](./CONTRIBUTING.md) to get started.

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.
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
````
