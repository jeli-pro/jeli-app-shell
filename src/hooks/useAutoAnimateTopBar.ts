import { useRef, useCallback, useEffect } from 'react';
import { useAppShell } from '@/context/AppShellContext';
import { BODY_STATES } from '@/lib/utils';

export function useAutoAnimateTopBar(isPane = false) {
  const { dispatch, bodyState } = useAppShell();
  const lastScrollTop = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (isPane || bodyState === BODY_STATES.SPLIT_VIEW) return;

    // Clear previous timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    const { scrollTop } = event.currentTarget;
    
    if (scrollTop > lastScrollTop.current && scrollTop > 200) {
      dispatch({ type: 'SET_TOP_BAR_VISIBLE', payload: false });
    } else if (scrollTop < lastScrollTop.current || scrollTop <= 0) {
      dispatch({ type: 'SET_TOP_BAR_VISIBLE', payload: true });
    }
    
    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;

    // Set new timeout to show top bar when scrolling stops
    scrollTimeout.current = setTimeout(() => {
      // Don't hide, just ensure it's visible after scrolling stops
      // and we are not at the top of the page.
      if (scrollTop > 0) {
        dispatch({ type: 'SET_TOP_BAR_VISIBLE', payload: true });
      }
    }, 250); // Adjust timeout as needed
  }, [isPane, dispatch, bodyState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return { onScroll };
}