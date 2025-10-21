import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

/**
 * A hook that animates a stats container in and out of view based on scroll direction.
 * It creates a "sliver app bar" effect for the stats section.
 * @param scrollContainerRef Ref to the main scrolling element.
 * @param statsContainerRef Ref to the stats container element to be animated.
 */
export function useAutoAnimateStats(
  scrollContainerRef: React.RefObject<HTMLElement>,
  statsContainerRef: React.RefObject<HTMLElement>
) {
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);
  const originalMarginTop = useRef<string | null>(null);

  const hideStats = useCallback(() => {
    if (isHidden.current || !statsContainerRef.current) return;
    isHidden.current = true;
    gsap.to(statsContainerRef.current, {
      duration: 0.4,
      height: 0,
      autoAlpha: 0,
      marginTop: 0,
      ease: 'power2.inOut',
      overwrite: true,
    });
  }, [statsContainerRef]);

  const showStats = useCallback(() => {
    if (!isHidden.current || !statsContainerRef.current) return;
    isHidden.current = false;
    gsap.to(statsContainerRef.current, {
      duration: 0.4,
      height: 'auto',
      autoAlpha: 1,
      marginTop: originalMarginTop.current || 0,
      ease: 'power2.out',
      overwrite: true,
    });
  }, [statsContainerRef]);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !statsContainerRef.current) return;

    const scrollY = scrollContainerRef.current.scrollTop;
    
    if (originalMarginTop.current === null) {
      const computedStyle = getComputedStyle(statsContainerRef.current);
      originalMarginTop.current = computedStyle.getPropertyValue('margin-top');
    }

    if (scrollY > lastScrollY.current && scrollY > 10) {
      hideStats();
    } 

    lastScrollY.current = scrollY < 0 ? 0 : scrollY;
  }, [scrollContainerRef, statsContainerRef, hideStats]);

  const handleWheel = useCallback((event: WheelEvent) => {
    if (!scrollContainerRef.current || !statsContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const isAtTop = container.scrollTop === 0;
    const isScrollingUp = event.deltaY < 0;
    const isScrollingDown = event.deltaY > 0;
    const isVerticallyScrollable = container.scrollHeight > container.clientHeight;

    // Reveal on "pull to reveal" at the top
    if (isAtTop && isScrollingUp) {
      showStats();
    }

    // For non-scrollable containers (like Kanban), hide on any downward scroll
    if (!isVerticallyScrollable && isScrollingDown) {
      hideStats();
    }
  }, [scrollContainerRef, statsContainerRef, showStats, hideStats]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      scrollContainer.addEventListener('wheel', handleWheel, { passive: true });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
        scrollContainer.removeEventListener('wheel', handleWheel);
      }
      // When component unmounts, kill any running animations on the stats ref
      if (statsContainerRef.current) {
        gsap.killTweensOf(statsContainerRef.current);
      }
    };
  }, [scrollContainerRef, statsContainerRef, handleScroll, handleWheel]);
}