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