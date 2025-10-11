import { useState, useCallback } from 'react';
import { useAutoAnimateTopBar } from '@/hooks/useAutoAnimateTopBar';

export function useDashboardScroll(
  contentRef: React.RefObject<HTMLDivElement>,
  isInSidePane: boolean
) {
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const { onScroll: handleTopBarScroll } = useAutoAnimateTopBar(isInSidePane);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    handleTopBarScroll(e);
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    setShowScrollToBottom(scrollTop > 200 && scrollTop < scrollHeight - clientHeight - 200);
  }, [handleTopBarScroll, contentRef]);

  const scrollToBottom = () => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };

  return { showScrollToBottom, handleScroll, scrollToBottom };
}