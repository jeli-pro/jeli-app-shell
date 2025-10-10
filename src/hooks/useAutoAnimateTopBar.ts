import { useRef, useCallback, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';

export function useAutoAnimateTopBar(isPane = false) {
  const setTopBarVisible = useAppStore((state) => state.setTopBarVisible);
  const lastScrollTop = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (isPane) return;

    // Clear previous timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    const { scrollTop } = event.currentTarget;
    
    if (scrollTop > lastScrollTop.current && scrollTop > 200) {
      setTopBarVisible(false);
    } else if (scrollTop < lastScrollTop.current || scrollTop <= 0) {
      setTopBarVisible(true);
    }
    
    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;

    // Set new timeout to show top bar when scrolling stops
    scrollTimeout.current = setTimeout(() => {
      // Don't hide, just ensure it's visible after scrolling stops
      // and we are not at the top of the page.
      if (scrollTop > 0) {
        setTopBarVisible(true);
      }
    }, 250); // Adjust timeout as needed
  }, [isPane, setTopBarVisible]);

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