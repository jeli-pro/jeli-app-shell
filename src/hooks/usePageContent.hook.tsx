import { useEffect, useMemo, useCallback } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useAppShell } from "@/context/AppShellContext";
import type { AppShellState } from "@/context/AppShellContext";
import { BODY_STATES } from "@/lib/utils";

// Import page/content components
import { DashboardContent } from "@/pages/Dashboard";
import { ToasterDemo } from "@/pages/ToasterDemo";
import { NotificationsPage } from "@/pages/Notifications";
import { DataDetailPanel } from "@/pages/DataDemo/components/DataDetailPanel";
import { mockDataItems } from "@/pages/DataDemo/data/mockData";
import DataDemoPage from "@/pages/DataDemo";
import { SettingsContent } from "@/features/settings/SettingsContent";

// Import icons
import {
  LayoutDashboard,
  Settings,
  Component,
  Bell,
  SlidersHorizontal,
  ChevronsLeftRight,
  Layers,
  SplitSquareHorizontal,
  Database,
} from "lucide-react";

export function usePageContent() {
  const { bodyState, dispatch } = useAppShell();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { itemId } = useParams<{ itemId: string }>();

  // Effect to sync app shell state (bodyState, sidePaneContent) with URL
  useEffect(() => {
    const pane = searchParams.get('sidePane');
    const view = searchParams.get('view');
    const right = searchParams.get('right');
    const validPanes: AppShellState['sidePaneContent'][] = ['details', 'settings', 'main', 'toaster', 'notifications', 'dataDemo'];

    if (itemId) {
      dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: 'dataItem' });
      if (view === 'split') {
        dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SPLIT_VIEW });
      } else {
        dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SIDE_PANE });
      }
    } else if (pane && validPanes.includes(pane as AppShellState['sidePaneContent'])) {
      dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: pane as AppShellState['sidePaneContent'] });
      dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SIDE_PANE });
    } else if (view === 'split' && right && validPanes.includes(right as AppShellState['sidePaneContent'])) {
      dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: right as AppShellState['sidePaneContent'] });
      dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.SPLIT_VIEW });
    } else {
      dispatch({ type: 'SET_BODY_STATE', payload: BODY_STATES.NORMAL });
      dispatch({ type: 'SET_SIDE_PANE_CONTENT', payload: 'details' });
    }
  }, [itemId, searchParams, dispatch]);

  const contentMap = useMemo(() => ({
    main: {
      title: "Dashboard",
      icon: LayoutDashboard,
      page: "dashboard",
      content: <DashboardContent isInSidePane />,
    },
    settings: {
      title: "Settings",
      icon: Settings,
      page: "settings",
      content: <div className="p-6"><SettingsContent /></div>
    },
    toaster: {
      title: "Toaster Demo",
      icon: Component,
      page: "toaster",
      content: <ToasterDemo isInSidePane />,
    },
    notifications: {
      title: "Notifications",
      icon: Bell,
      page: "notifications",
      content: <NotificationsPage isInSidePane />,
    },
    dataDemo: {
      title: "Data Showcase",
      icon: Database,
      page: "data-demo",
      content: <DataDemoPage />,
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
  }), []);

  const selectedItem = useMemo(() => {
    if (!itemId) return null
    return mockDataItems.find(item => item.id === itemId) ?? null
  }, [itemId]);

  const sidePaneIdentifier = itemId
    ? 'dataItem'
    : searchParams.get('sidePane') || searchParams.get('right') || 'details';

  const { currentContent, rightPaneContent } = useMemo(() => {
    if (sidePaneIdentifier === 'dataItem') {
      return {
        currentContent: { title: "Item Details", icon: Database, page: `data-demo/${itemId}` },
        rightPaneContent: <DataDetailPanel item={selectedItem} onClose={() => navigate('/data-demo')} />,
      };
    }
    const mappedContent = contentMap[sidePaneIdentifier as keyof typeof contentMap] || contentMap.details;
    return {
      currentContent: mappedContent,
      rightPaneContent: mappedContent.content,
    };
  }, [sidePaneIdentifier, selectedItem, navigate, contentMap, itemId]);

  const CurrentIcon = currentContent.icon;

  const handleMaximize = useCallback(() => {
    if ("page" in currentContent && currentContent.page) {
      navigate(`/${currentContent.page}`, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [currentContent, navigate, setSearchParams]);

  const handleCloseSidePane = useCallback(() => {
    if (itemId) {
      navigate('/data-demo');
    } else {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.delete('sidePane');
        newParams.delete('right');
        newParams.delete('view');
        return newParams;
      }, { replace: true });
    }
  }, [setSearchParams, itemId, navigate]);

  const handleToggleSplitView = useCallback(() => {
    if (bodyState === BODY_STATES.SIDE_PANE) {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        const currentPane = newParams.get('sidePane');
        if (currentPane) {
          newParams.set('view', 'split');
          newParams.set('right', currentPane);
          newParams.delete('sidePane');
        }
        return newParams;
      }, { replace: true });
    } else if (bodyState === BODY_STATES.SPLIT_VIEW) {
      setSearchParams(prev => {
        return { sidePane: prev.get('right') || 'details' }
      }, { replace: true });
    }
  }, [bodyState, setSearchParams]);

  const rightPaneHeader = useMemo(() => (
    <>
      {bodyState !== BODY_STATES.SPLIT_VIEW ? (
        <div className="flex items-center gap-2">
          <CurrentIcon className="w-5 h-5" />
          <h2 className="text-lg font-semibold whitespace-nowrap">
            {currentContent.title}
          </h2>
        </div>
      ) : <div />} {/* Placeholder to make justify-between work */}
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
        {bodyState !== BODY_STATES.SPLIT_VIEW && "page" in currentContent && currentContent.page && (
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
  ), [bodyState, currentContent, CurrentIcon, handleToggleSplitView, handleMaximize]);

  return {
    rightPaneContent,
    rightPaneHeader,
    handleCloseSidePane
  };
}