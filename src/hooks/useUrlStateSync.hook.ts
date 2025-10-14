import { useEffect } from "react";
import {
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useAppShell } from "@/context/AppShellContext";
import type { AppShellState } from "@/context/AppShellContext";
import { BODY_STATES } from "@/lib/utils";

/**
 * A hook to synchronize the URL state (params and search query) with the AppShellContext.
 * This hook is responsible for setting the body state and side pane content based on the URL.
 * It does not return anything.
 */
export function useUrlStateSync() {
  const { dispatch } = useAppShell();
  const [searchParams] = useSearchParams();
  const { itemId } = useParams<{ itemId: string }>();

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
}