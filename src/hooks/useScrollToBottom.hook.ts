import { useState, useCallback } from 'react';

export function useScrollToBottom(
  contentRef: React.RefObject<HTMLDivElement>
) {
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    // Show button if scrolled down more than 200px, and there's more than 200px left to scroll
    setShowScrollToBottom(scrollTop > 200 && scrollTop < scrollHeight - clientHeight - 200);
  }, [contentRef]);

  const scrollToBottom = () => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };

  return { showScrollToBottom, handleScroll, scrollToBottom };
}