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
  const { openSidePane } = useAppShell();
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
    sidePaneContent,
    closeSidePane,
    bodyState,
    openSidePane,
    dispatch,
  } = useAppShell();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const pane = searchParams.get('sidePane') as 'settings' | 'notifications' | null;
    const view = searchParams.get('view');
    const right = searchParams.get('right');

    if (pane) {
      if (bodyState !== BODY_STATES.SIDE_PANE || sidePaneContent !== pane) {
        openSidePane(pane);
      }
    } else if (view === 'split' && right) {
      if (bodyState !== BODY_STATES.SPLIT_VIEW || sidePaneContent !== right) {
        dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: right as any });
        dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SPLIT_VIEW });
      }
    } else if (bodyState !== BODY_STATES.NORMAL) {
      closeSidePane();
    }
  }, [searchParams, bodyState, sidePaneContent, openSidePane, closeSidePane, dispatch]);
  
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
        <RightPane header={rightPaneHeader}>{currentContent.content}</RightPane>
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