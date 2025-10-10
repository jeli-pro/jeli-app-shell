import { useRef, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';

export function useAutoAnimateTopBar(isPane = false) {
  const setTopBarVisible = useAppStore((state) => state.setTopBarVisible);
  const lastScrollTop = useRef(0);

  const onScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (isPane) return;

    const { scrollTop } = event.currentTarget;
    
    if (scrollTop > lastScrollTop.current && scrollTop > 200) {
      setTopBarVisible(false);
    } else if (scrollTop < lastScrollTop.current || scrollTop <= 0) {
      setTopBarVisible(true);
    }
    
    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  }, [isPane, setTopBarVisible]);

  return { onScroll };
}