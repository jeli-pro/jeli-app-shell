import React, { useEffect } from 'react'
import { AppShell } from './components/layout/AppShell'
import { AppShellProvider, useAppShell } from './context/AppShellContext'
import { useAppStore } from './store/appStore'
import { useAuthStore } from './store/authStore'
import './index.css'

// Import library components
import { EnhancedSidebar } from './components/layout/EnhancedSidebar'
import { MainContent } from './components/layout/MainContent'
import { RightPane } from './components/layout/RightPane'
import { TopBar } from './components/layout/TopBar'
import { CommandPalette } from './components/global/CommandPalette'

// Import page/content components
import { DashboardContent } from './pages/Dashboard'
import { SettingsPage } from './pages/Settings'
import { ToasterDemo } from './pages/ToasterDemo'
import { NotificationsPage } from './pages/Notifications'
import { ContentInSidePanePlaceholder } from './components/shared/ContentInSidePanePlaceholder'
import { SettingsContent } from './features/settings/SettingsContent'
import { LoginPage } from './components/auth/LoginPage'

// Import icons
import { LayoutDashboard, Settings, Component, Bell, SlidersHorizontal, ChevronsLeftRight, Search, Filter, Plus, PanelRight, ChevronRight, Rocket } from 'lucide-react'
import { BODY_STATES } from './lib/utils'
import { cn } from './lib/utils'


// The content for the main area, with page routing logic
function AppContent() {
  const { activePage, setActivePage } = useAppStore()
  const { bodyState, sidePaneContent, openSidePane } = useAppShell()

  const pageMap = {
    dashboard: {
      component: <DashboardContent />,
      sidePaneContent: 'main',
      icon: LayoutDashboard,
      name: 'dashboard',
    },
    settings: {
      component: <SettingsPage />,
      sidePaneContent: 'settings',
      icon: Settings,
      name: 'settings',
    },
    toaster: {
      component: <ToasterDemo />,
      sidePaneContent: 'toaster',
      icon: Component,
      name: 'toaster demo',
    },
    notifications: {
      component: <NotificationsPage />,
      sidePaneContent: 'notifications',
      icon: Bell,
      name: 'notifications',
    },
  } as const;

  const currentPage = pageMap[activePage];

  if (sidePaneContent === currentPage.sidePaneContent && bodyState === BODY_STATES.SIDE_PANE) {
    return (
      <ContentInSidePanePlaceholder 
        icon={currentPage.icon}
        title={`${currentPage.name.charAt(0).toUpperCase() + currentPage.name.slice(1)} is in Side Pane`}
        pageName={currentPage.name}
        onBringBack={() => {
          openSidePane(currentPage.sidePaneContent);
          setActivePage(activePage);
        }}
      />
    )
  }

  return currentPage.component;
}

// Content for the Top Bar
function AppTopBar() {
  const { activePage, searchTerm, setSearchTerm } = useAppStore()
  const { openSidePane } = useAppShell()
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  const handleMoveToSidePane = () => {
    const mapping = { dashboard: 'main', settings: 'settings', toaster: 'toaster', notifications: 'notifications' } as const;
    if (mapping[activePage]) openSidePane(mapping[activePage]);
  };

  return (
    <div className="flex items-center gap-3 flex-1">
      <div className={cn("hidden md:flex items-center gap-2 text-sm transition-opacity", {
          "opacity-0 pointer-events-none": isSearchFocused && activePage === 'dashboard'
      })}>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Home</a>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-foreground capitalize">{activePage}</span>
      </div>
      
      <div className="flex-1" />

      {/* Page-specific: Dashboard search and actions */}
      {activePage === 'dashboard' && (
      <div className="flex items-center gap-2 flex-1 justify-end">
        <div className={cn("relative transition-all duration-300 ease-in-out", isSearchFocused ? 'flex-1 max-w-lg' : 'w-auto')}>
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
      {['dashboard', 'settings', 'toaster', 'notifications'].includes(activePage) && (
        <button onClick={handleMoveToSidePane} className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors" title="Move to Side Pane"><PanelRight className="w-5 h-5" /></button>
      )}
    </div>
  )
}

// The main App component that composes the shell
function ComposedApp() {
  const { sidePaneContent, closeSidePane } = useAppShell();
  const { setActivePage } = useAppStore();

  const contentMap = {
    main: { title: 'Dashboard', icon: LayoutDashboard, page: 'dashboard', content: <DashboardContent isInSidePane /> },
    settings: { title: 'Settings', icon: Settings, page: 'settings', content: <SettingsContent /> },
    toaster: { title: 'Toaster Demo', icon: Component, page: 'toaster', content: <ToasterDemo isInSidePane /> },
    notifications: { title: 'Notifications', icon: Bell, page: 'notifications', content: <NotificationsPage isInSidePane /> },
    details: { title: 'Details Panel', icon: SlidersHorizontal, content: <p className="text-muted-foreground">This is the side pane. It can be used to display contextual information, forms, or actions related to the main content.</p> }
  } as const;

  const currentContent = contentMap[sidePaneContent as keyof typeof contentMap] || contentMap.details;
  const CurrentIcon = currentContent.icon;

  const handleMaximize = () => {
    if ('page' in currentContent && currentContent.page) {
      setActivePage(currentContent.page as any);
    }
    closeSidePane()
  }

  const rightPaneHeader = (
      <>
      <div className="flex items-center gap-2">
        <CurrentIcon className="w-5 h-5" />
        <h2 className="text-lg font-semibold whitespace-nowrap">
          {currentContent.title}
        </h2>
      </div>
      
      {'page' in currentContent && currentContent.page && (
        <button
          onClick={handleMaximize}
          className="h-10 w-10 flex items-center justify-center hover:bg-accent rounded-full transition-colors mr-2"
          title="Move to Main View"
        >
          <ChevronsLeftRight className="w-5 h-5" />
        </button>
      )}
      </>
  );

  return (
    <AppShell
      sidebar={<EnhancedSidebar />}
      topBar={<TopBar><AppTopBar /></TopBar>}
      mainContent={<MainContent><AppContent /></MainContent>}
      rightPane={(
        <RightPane header={rightPaneHeader}>{currentContent.content}</RightPane>
      )}
      commandPalette={<CommandPalette />}
    />
  );
}

function App() {
  const isDarkMode = useAppStore((state) => state.isDarkMode)
  const { isAuthenticated, login, forgotPassword } = useAuthStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password)
    } catch (error) {
      console.error('Login failed:', error)
      // In a real app, you'd show an error message to the user
    }
  }

  const handleForgotPassword = async (email: string) => {
    try {
      await forgotPassword(email)
    } catch (error) {
      console.error('Forgot password failed:', error)
    }
  }

  const handleSignUp = () => {
    // In a real app, navigate to sign up page
    console.log('Navigate to sign up page')
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onForgotPassword={handleForgotPassword}
        onSignUp={handleSignUp}
      />
    )
  }

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
  )
}

export default App