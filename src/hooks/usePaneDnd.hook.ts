import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppShellStore } from '@/store/appShell.store';
import { BODY_STATES } from '@/lib/utils';

const pageToPaneMap: Record<string, 'main' | 'settings' | 'toaster' | 'notifications' | 'dataDemo'> = {
  dashboard: 'main',
  settings: 'settings',
  toaster: 'toaster',
  notifications: 'notifications',
  'data-demo': 'dataDemo',
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