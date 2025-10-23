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